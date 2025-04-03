import React from 'react';
import type {
	RJSTContext,
	ActionData,
	Priorities,
	RJSTSdk,
	RJSTAction,
	RJSTModel,
	RJSTBaseResource,
	RJSTRawModel,
	RJSTEntityPropertyDefinition,
} from './schemaOps';
import {
	getFieldForFormat,
	rjstJsonSchemaPick,
	rjstAdaptRefScheme,
	rjstAddToSchema,
	generateSchemaFromRefScheme,
	getHeaderLink,
	getPropertyScheme,
	getSubSchemaFromRefScheme,
	parseDescription,
	parseDescriptionProperty,
	isJSONSchema,
} from './schemaOps';
import { LensSelection } from './Lenses/LensSelection';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import isEqual from 'lodash/isEqual';
import { Filters } from './Filters/Filters';
import { Tags } from './Actions/Tags';
import { Update } from './Actions/Update';
import { Create } from './Actions/Create';
import {
	rjstDefaultPermissions,
	rjstGetModelForCollection,
	rjstRunTransformers,
} from './models/helpers';
import {
	rjstGetDisabledReason,
	getFromLocalStorage,
	getTagsDisabledReason,
	setToLocalStorage,
	getSelected,
	getSortingFunction,
	DEFAULT_ITEMS_PER_PAGE,
} from './utils';
import type { LensTemplate } from './Lenses';
import { getLenses } from './Lenses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { CollectionLensRendererProps } from './Lenses/types';
import pickBy from 'lodash/pickBy';
import { NoRecordsFoundView } from './NoRecordsFoundView';
import type { BoxProps } from '@mui/material';
import { Box, Link, styled } from '@mui/material';
import type { Format } from './components/Widget/utils';
import type {
	CheckedState,
	Pagination,
	TableSortOptions,
} from './components/Table/utils';
import type { TFunction } from '../../hooks/useTranslations';
import { useTranslation } from '../../hooks/useTranslations';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { useNavigate } from '../../hooks/useNavigate';
import type { FiltersView } from './components/Filters';
import type { PineFilterObject } from './oData/jsonToOData';
import { convertToPineClientFilter, orderbyBuilder } from './oData/jsonToOData';
import { ajvFilter } from './components/Filters/SchemaSieve';
import { Spinner } from '../Spinner';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FocusSearch } from './components/Filters/FocusSearch';
import { Widget } from './components/Widget';
import { defaultFormats } from './components/Widget/Formats';
import { Tooltip } from '../Tooltip';
import { token } from '../../utils/token';

const HeaderGrid = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(2),
}));

export interface NoDataInfo {
	title?: string | React.ReactElement;
	subtitle?: string | React.ReactElement;
	info?: string | React.ReactElement;
	description?: string | React.ReactElement;
	docsLink?: string;
	docsLabel?: string;
}

export interface RJSTProps<T> extends Omit<BoxProps, 'onChange'> {
	/** Model is the property that describe the data to display with a JSON structure */
	model: RJSTModel<T>;
	/** Array of data or data entity to display */
	data: T[] | undefined;
	/** Formats are custom widgets to render in the table cell. The type of format to display is described in the model. */
	formats?: Format[];
	/** Actions is an array of actions applicable on the selected items */
	actions?: Array<RJSTAction<T>>;
	/** The sdk is used to pass the method to handle tags when added removed or updated */
	sdk?: RJSTSdk<T>;
	/** Dictionary of {[column_property]: customFunction} where the customFunction is the function to sort data on column header click */
	customSort?:
		| Dictionary<(a: T, b: T) => number>
		| Dictionary<string | string[]>;
	// TODO: Ideally the base URL is autogenerated, but there are some issues with that currently (eg. instead of application we have apps in the URL)
	/** Redirect on entity click */
	getBaseUrl?: (entry: T) => string;
	/** Method to refresh the rendered data when something is changed */
	refresh?: () => void;
	/** Event emitted on entity click */
	onEntityClick?: (
		entry: T,
		event: React.MouseEvent<HTMLAnchorElement>,
	) => void;
	// TODO: onChange should also be called when data in the table is sorted and when columns change
	/** Function that gets called when filters change */
	onChange?: (changes: {
		filters?: JSONSchema[];
		page: number;
		itemsPerPage?: number;
		oData?: {
			$top?: number;
			$skip?: number;
			$filter?: any;
			$orderby?: any;
		} | null;
	}) => void;
	/** Information from a server side pagination */
	pagination?: Pagination;
	/** All the lenses available for this RJST component. Any default lenses will automatically be added to this array. */
	customLenses?: LensTemplate[];
	/** Loading property to show the Spinner */
	loading?: boolean;
	rowKey?: keyof T;
	noDataInfo?: NoDataInfo;
	persistFilters?: boolean;
}

// TODO: Refactor into multiple layers: one for handling
// loading and another for managing all necessary data,
// to achieve a cleaner architecture. This will also improve the
// any typing we have in lenses today.

export const RJST = <T extends RJSTBaseResource<T>>({
	model: modelRaw,
	data,
	formats,
	actions,
	sdk,
	customSort,
	refresh,
	getBaseUrl,
	onEntityClick,
	onChange,
	pagination,
	customLenses,
	loading = false,
	rowKey,
	noDataInfo,
	persistFilters = true,
	...boxProps
}: RJSTProps<T>) => {
	const { t } = useTranslation();
	const { state: analytics } = useAnalyticsContext();
	const navigate = useNavigate();

	const modelRef = React.useRef(modelRaw);
	// This allows the component to work even if
	// consumers are passing a new model object every time.
	const model = React.useMemo(() => {
		if (isEqual(modelRaw, modelRef.current)) {
			return modelRef.current;
		}
		return modelRaw;
	}, [modelRaw]);

	const [filters, setFilters] = React.useState<JSONSchema[]>([]);
	// TODO: this logic should be moved in the lens/table.tsx.
	// With the layer refactor we should have a lens.data.renderer should
	// only handle a onChange event that has all the info. the lens should handle all cases
	const [sort, setSort] = React.useState<TableSortOptions<T> | null>(null);
	const [internalPagination, setInternalPagination] = React.useState<
		Pick<Pagination, 'currentPage' | 'itemsPerPage'>
	>({
		currentPage: pagination?.currentPage ?? 0,
		// In the first case we need the || as the result might be NaN (Number(undefined)) or 0 Number(null)).
		itemsPerPage:
			(Number(getFromLocalStorage(`${model.resource}__items_per_page`)) ||
				pagination?.itemsPerPage) ??
			DEFAULT_ITEMS_PER_PAGE,
	});
	const [views, setViews] = React.useState<FiltersView[]>([]);
	const [selected, setSelected] = React.useState<T[] | undefined>([]);
	const [checkedState, setCheckedState] = React.useState<CheckedState>('none');
	const [internalPineFilter, setInternalPineFilter] = React.useState<
		PineFilterObject | null | undefined
	>();
	const [isBusyMessage, setIsBusyMessage] = React.useState<
		string | undefined
	>();
	const [actionData, setActionData] = React.useState<
		ActionData<T> | undefined
	>();

	const internalOnChange = React.useCallback(
		(
			updatedFilters: JSONSchema[],
			sortInfo: TableSortOptions<T> | null,
			page: number,
			itemsPerPage: number,
		) => {
			if (!onChange) {
				return;
			}

			const pineFilter = pagination?.serverSide
				? convertToPineClientFilter([], updatedFilters)
				: null;
			const oData = pagination?.serverSide
				? pickBy(
						{
							$filter: pineFilter,
							$orderby: orderbyBuilder(sortInfo, customSort),
							$top: itemsPerPage,
							$skip: page * itemsPerPage,
						},
						(v) => v != null,
					)
				: null;
			setInternalPineFilter(pineFilter);
			onChange?.({
				filters: updatedFilters,
				page,
				itemsPerPage,
				oData,
			});
		},
		[customSort, onChange, pagination?.serverSide],
	);

	const $setFilters = React.useCallback(
		(updatedFilters: JSONSchema[]) => {
			setFilters(updatedFilters);
			internalOnChange(
				updatedFilters,
				sort,
				internalPagination.currentPage,
				internalPagination.itemsPerPage,
			);
		},
		[
			setFilters,
			internalOnChange,
			internalPagination.itemsPerPage,
			internalPagination.currentPage,
			sort,
		],
	);

	const $setSelected = React.useCallback<
		CollectionLensRendererProps<T>['changeSelected']
	>(
		(items, newCheckedState = undefined) => {
			setSelected(items);
			setCheckedState(newCheckedState ?? 'none');
			setActionData((oldState) =>
				oldState
					? {
							...oldState,
							affectedEntries: items,
							checkedState: newCheckedState,
						}
					: undefined,
			);
		},
		[setSelected, setActionData],
	);

	const serverSide = pagination?.serverSide;
	const totalItems = serverSide ? pagination.totalItems : data?.length;

	const hideUtils = React.useMemo(
		() =>
			(!filters || filters.length === 0) &&
			data?.length === 0 &&
			(!serverSide || !totalItems),
		[data?.length, filters, serverSide, totalItems],
	);

	const filtered = React.useMemo(() => {
		if (pagination?.serverSide) {
			return data ?? [];
		}
		return Array.isArray(data) ? ajvFilter(filters, data) : [];
	}, [pagination?.serverSide, data, filters]);

	React.useEffect(() => {
		$setSelected([], 'none');
	}, [filters, $setSelected]);

	const onActionTriggered = React.useCallback(
		(acData: ActionData<T>) => {
			setActionData(acData);
			if (acData.action.actionFn) {
				acData.action.actionFn({
					affectedEntries: acData.affectedEntries,
					checkedState: checkedState || 'none',
					setSelected: $setSelected,
				});
			}
		},
		[$setSelected, checkedState],
	);

	const defaultLensSlug = getFromLocalStorage(`${model.resource}__view_lens`);

	const lenses = React.useMemo(() => {
		return getLenses(data, customLenses);
	}, [data, customLenses]);

	const [lens, setLens] = React.useState(lenses?.[0]);

	React.useEffect(() => {
		const foundLens =
			lenses?.find((l) => l.slug === defaultLensSlug) ??
			lenses?.find((l) => l.default) ??
			lenses?.[0];
		if (lens?.slug === foundLens?.slug) {
			return;
		}
		setLens(foundLens);
	}, [lenses, defaultLensSlug, lens?.slug]);

	const internalEntityClick = React.useCallback<
		NonNullable<typeof onEntityClick>
	>(
		(row, event) => {
			onEntityClick?.(row, event);

			if (event.isPropagationStopped() && event.isDefaultPrevented()) {
				return;
			}

			if (getBaseUrl && !event.ctrlKey && !event.metaKey && navigate) {
				event.preventDefault();
				try {
					const url = new URL(getBaseUrl(row));
					window.open(url.toString(), '_blank');
				} catch {
					navigate?.(getBaseUrl(row));
				}
			}
		},
		[onEntityClick, getBaseUrl, navigate],
	);

	const rjstContext = React.useMemo((): RJSTContext<T> => {
		const tagField = getFieldForFormat<T>(model.schema, 'tag');
		const sdkTags = sdk?.tags;
		const tagsAction: RJSTAction<T> | null = sdkTags
			? {
					title: t('actions.manage_tags'),
					type: 'update',
					section: 'settings',
					renderer: ({ affectedEntries, onDone }) => {
						return (
							(!!affectedEntries || (sdkTags && 'getAll' in sdkTags)) && (
								<Tags
									selected={affectedEntries}
									rjstContext={rjstContext}
									onDone={onDone}
									setIsBusyMessage={setIsBusyMessage}
									refresh={refresh}
									schema={model.schema}
								/>
							)
						);
					},
					isDisabled: async ({
						affectedEntries,
						checkedState: rendererCheckedState,
					}) =>
						await getTagsDisabledReason(
							affectedEntries,
							tagField as keyof T,
							rendererCheckedState,
							sdkTags,
							t,
						),
				}
			: null;

		return {
			resource: model.resource,
			idField: 'id',
			nameField: (model.priorities?.primary[0] as string) ?? 'id',
			tagField,
			getBaseUrl,
			onEntityClick,
			actions: tagsAction ? (actions ?? []).concat(tagsAction) : actions,
			customSort,
			sdk,
			internalPineFilter,
			checkedState,
		};
	}, [
		model,
		getBaseUrl,
		onEntityClick,
		refresh,
		t,
		actions,
		customSort,
		sdk,
		internalPineFilter,
		checkedState,
	]);

	const properties = React.useMemo(
		() =>
			getColumnsFromSchema<T>({
				t,
				schema: model.schema,
				idField: rjstContext.idField,
				isServerSide: pagination?.serverSide ?? false,
				customSort: rjstContext.customSort,
				priorities: model.priorities,
				formats,
			}),
		[
			model.schema,
			rjstContext.idField,
			rjstContext.customSort,
			model.priorities,
			pagination?.serverSide,
			t,
			formats,
		],
	);
	const hasUpdateActions = React.useMemo(
		() =>
			!!actions?.filter((action) => action.type !== 'create')?.length ||
			!!sdk?.tags,
		[actions, sdk?.tags],
	);

	if (loading && data == null) {
		return (
			<Spinner
				label={t('loading.resource', {
					resource: t(`resource.${model.resource}_other`).toLowerCase(),
				})}
			/>
		);
	}

	return (
		<Box display="flex" flex={1} flexDirection="column" {...boxProps}>
			<Spinner label={isBusyMessage} show={!!isBusyMessage || loading}>
				<Box display="flex" height="100%" flexDirection="column">
					{
						// We need to mount the Filters component so that it can load the filters
						// & pagination state from the url (or use defaults) and provide them to
						// the parent component (via $setFilters -> onChange) to use them for the
						// initial data fetching request.
						(data == null || Array.isArray(data)) && (
							<>
								{!hideUtils ? (
									<Box
										mb={1}
										display={
											// This hides the Filters component during the initial load but keeps them mounted so that
											// it can trigger onChange on mount to communicate to the parent component the pineOptions
											// that need to be used.
											data == null ? 'none' : undefined
										}
									>
										<HeaderGrid
											flexWrap="wrap"
											justifyContent="space-between"
											alignItems="center"
										>
											<Create
												model={model}
												rjstContext={rjstContext}
												hasOngoingAction={false}
												onActionTriggered={onActionTriggered}
											/>

											<Update
												model={model}
												selected={selected}
												rjstContext={rjstContext}
												hasOngoingAction={false}
												onActionTriggered={onActionTriggered}
												checkedState={checkedState}
											/>
											<Box
												order={[-1, -1, -1, 0]}
												flex={['1 0 100%', '1 0 100%', '1 0 100%', 'auto']}
											>
												<Filters
													renderMode={['add', 'search', 'views']}
													schema={model.schema}
													filters={filters}
													views={views}
													viewsRestorationKey={`${rjstContext.resource}__views`}
													persistFilters={persistFilters}
													changeFilters={$setFilters}
													changeViews={setViews}
													onSearch={(term: string) => (
														<FocusSearch
															searchTerm={term}
															filtered={filtered}
															rjstContext={rjstContext}
															model={model}
															rowKey={rowKey}
														/>
													)}
												/>
											</Box>
											{lenses && lenses.length > 1 && lens && (
												<LensSelection
													lenses={lenses}
													lens={lens}
													setLens={(updatedLens) => {
														setLens(updatedLens);
														setToLocalStorage(
															`${model.resource}__view_lens`,
															updatedLens.slug,
														);

														analytics.webTracker?.track('Change lens', {
															current_url: location.origin + location.pathname,
															resource: model.resource,
															lens: updatedLens.slug,
														});
													}}
												/>
											)}
										</HeaderGrid>
										<Filters
											renderMode={['summaryWithSaveViews']}
											schema={model.schema}
											filters={filters}
											views={views}
											viewsRestorationKey={`${rjstContext.resource}__views`}
											changeFilters={$setFilters}
											changeViews={setViews}
											persistFilters={persistFilters}
										/>
									</Box>
								) : rjstContext.actions?.filter(
										(action) => action.type === 'create',
								  ).length ? (
									<NoRecordsFoundView
										model={model}
										rjstContext={rjstContext}
										onActionTriggered={onActionTriggered}
										noDataInfo={noDataInfo}
									/>
								) : (
									t('no_data.no_resource_data', {
										resource: t(
											`resource.${model.resource}_other`,
										).toLowerCase(),
									})
								)}
							</>
						)
					}

					{lens && !hideUtils && (
						<lens.data.renderer
							flex={1}
							filtered={filtered}
							selected={selected}
							properties={properties}
							hasUpdateActions={hasUpdateActions}
							changeSelected={$setSelected}
							checkedState={checkedState}
							sort={sort}
							onSort={(sortInfo) => {
								setSort(sortInfo);
								internalOnChange(
									filters,
									sortInfo,
									internalPagination.currentPage,
									internalPagination.itemsPerPage,
								);
								setToLocalStorage(`${rjstContext.resource}__sort`, sortInfo);
							}}
							data={data}
							rjstContext={rjstContext}
							onEntityClick={
								!!onEntityClick || !!getBaseUrl
									? internalEntityClick
									: undefined
							}
							model={model}
							onPageChange={(currentPage, itemsPerPage) => {
								setInternalPagination({
									currentPage,
									itemsPerPage,
								});
								internalOnChange(filters, sort, currentPage, itemsPerPage);
								setToLocalStorage(
									`${model.resource}__items_per_page`,
									itemsPerPage,
								);
								analytics.webTracker?.track('Change table page', {
									current_url: location.origin + location.pathname,
									resource: model.resource,
									page: currentPage,
									itemsPerPage,
								});
							}}
							pagination={
								{ ...(pagination ?? {}), ...internalPagination } as Pagination
							}
							rowKey={rowKey}
						/>
					)}

					{actionData?.action?.renderer?.({
						schema: actionData.schema,
						affectedEntries: actionData.affectedEntries,
						onDone: () => {
							setActionData(undefined);
						},
						setSelected: $setSelected,
					})}
				</Box>
			</Spinner>
		</Box>
	);
};

export {
	rjstRunTransformers,
	rjstDefaultPermissions,
	rjstGetModelForCollection,
	rjstAddToSchema,
	type RJSTAction,
	type RJSTBaseResource,
	type RJSTRawModel,
	type RJSTModel,
	rjstJsonSchemaPick,
	rjstGetDisabledReason,
	getPropertyScheme,
	getSubSchemaFromRefScheme,
	parseDescription,
	parseDescriptionProperty,
	generateSchemaFromRefScheme,
};

const getTitleAndLabel = <T extends object>(
	t: TFunction,
	jsonSchema: JSONSchema,
	propertyKey: string,
	refScheme: string | undefined,
) => {
	const subSchema = getSubSchemaFromRefScheme(jsonSchema, refScheme);
	const title = subSchema?.title ?? jsonSchema.title ?? propertyKey;
	const headerLink = getHeaderLink(subSchema);
	let label: RJSTEntityPropertyDefinition<T>['label'] = title;

	if (headerLink?.href || headerLink?.tooltip) {
		label = (
			<>
				<Tooltip title={headerLink?.tooltip ?? t('info.learn_more', { title })}>
					<Link
						sx={{
							mr: 2,
							color: token('color.text.accent'),
						}}
						target="_blank"
						// Prevent header click from triggering sort or other parent events
						onClick={(event) => {
							event.stopPropagation();
						}}
						{...(headerLink?.href ? { href: headerLink.href } : {})}
					>
						<FontAwesomeIcon icon={faCircleQuestion} />
					</Link>
				</Tooltip>
				{title}
			</>
		);
	}
	return {
		title,
		label,
	};
};

const hasPropertyEnabled = (
	value: string[] | boolean | undefined | null,
	propertyKey: string,
) => {
	if (!value) {
		return false;
	}
	return Array.isArray(value) && value.some((v) => v === propertyKey)
		? true
		: typeof value === 'boolean'
			? true
			: false;
};

const getColumnsFromSchema = <T extends RJSTBaseResource<T>>({
	t,
	schema,
	idField,
	isServerSide,
	customSort,
	priorities,
	formats,
}: {
	t: TFunction;
	schema: JSONSchema;
	idField: RJSTContext<T>['idField'];
	isServerSide: boolean;
	customSort?: RJSTContext<T>['customSort'];
	priorities?: Priorities<T>;
	formats?: Format[];
}): Array<RJSTEntityPropertyDefinition<T>> =>
	(
		Object.entries(schema.properties ?? {}) as Array<
			[
				Extract<keyof T, string>,
				NonNullable<typeof schema.properties>[string] | undefined,
			]
		>
	)
		.filter((entry): entry is [Extract<keyof T, string>, JSONSchema] => {
			const [_key, val] = entry;
			return isJSONSchema(val);
		})
		.flatMap(([key, val]): Array<[Extract<keyof T, string>, JSONSchema]> => {
			const refScheme = getPropertyScheme(val);
			if (!refScheme || refScheme.length <= 1 || typeof val !== 'object') {
				return [[key, val]];
			}
			const entityFilterOnly = parseDescriptionProperty(val, 'x-filter-only');
			return refScheme.map((propKey: string) => {
				const referenceSchema = generateSchemaFromRefScheme(val, key, propKey);
				const referenceSchemaFilterOnly = parseDescriptionProperty(
					referenceSchema,
					'x-filter-only',
				);
				const xFilterOnly =
					hasPropertyEnabled(referenceSchemaFilterOnly, propKey) ||
					hasPropertyEnabled(entityFilterOnly, propKey);
				const xNoSort =
					hasPropertyEnabled(
						parseDescriptionProperty(val, 'x-no-sort'),
						propKey,
					) ||
					hasPropertyEnabled(
						parseDescriptionProperty(referenceSchema, 'x-no-sort'),
						propKey,
					);
				const description = JSON.stringify({
					'x-ref-scheme': [propKey],
					...(xFilterOnly && { 'x-filter-only': 'true' }),
					...(xNoSort && { 'x-no-sort': 'true' }),
				});
				return [key, { ...val, description }];
			});
		})
		.filter(([key, val]) => {
			const entryDescription = parseDescription(val);
			return (
				key !== idField &&
				(!entryDescription || !('x-filter-only' in entryDescription))
			);
		})
		.map(([key, val], index) => {
			const xNoSort = parseDescriptionProperty(val, 'x-no-sort');
			const definedPriorities = priorities ?? ({} as Partial<Priorities<T>>);
			const refScheme = getPropertyScheme(val);
			const priority = definedPriorities.primary?.find(
				(prioritizedKey) => prioritizedKey === key,
			)
				? 'primary'
				: definedPriorities.secondary?.find(
							(prioritizedKey) => prioritizedKey === key,
					  )
					? 'secondary'
					: 'tertiary';
			const widgetSchema = { ...val, title: undefined };
			// TODO: Refactor this logic to create an object structure and retrieve the correct property using the refScheme.
			// The customSort should look like: { user: { owns_items: [{ uuid: 'xx09x0' }] } }
			// The refScheme will reference the property path, e.g., owns_items[0].uuid.
			const fieldCustomSort =
				customSort?.[`${key}_${refScheme}`] ?? customSort?.[key];
			if (fieldCustomSort != null) {
				if (
					isServerSide &&
					typeof fieldCustomSort !== 'string' &&
					!Array.isArray(fieldCustomSort)
				) {
					// We are also checking this in `orderbyBuilder()` to make TS happy, but better throw upfront
					// when the model is invalid rather than only when the user issues a sorting based on
					// an incorrectly configured property.
					throw new Error(
						`Field ${key} error: custom sort for this field must be of type string or string array, ${typeof fieldCustomSort} is not accepted.`,
					);
				} else if (!isServerSide && typeof fieldCustomSort !== 'function') {
					throw new Error(
						`Field ${key} error: custom sort for this field must be a function, ${typeof fieldCustomSort} is not accepted.`,
					);
				}
			}
			return {
				...getTitleAndLabel(t, val, key, refScheme?.[0]),
				field: key,
				// This is used for storing columns and views
				key: refScheme ? `${key}_${refScheme[0]}_${index}` : `${key}_${index}`,
				selected: getSelected(key, priorities),
				priority,
				type: 'predefined',
				refScheme: refScheme?.[0],
				index,
				sortable:
					xNoSort || val.format === 'tag'
						? false
						: typeof fieldCustomSort === 'function'
							? fieldCustomSort
							: getSortingFunction(key, val),
				render: (fieldVal: string, entry: T) => {
					const calculatedField = rjstAdaptRefScheme(fieldVal, val);
					return (
						<Widget
							extraFormats={[...(formats ?? []), ...defaultFormats]}
							schema={widgetSchema}
							value={calculatedField}
							extraContext={entry}
						/>
					);
				},
			} satisfies RJSTEntityPropertyDefinition<T>;
		})
		.filter((columnDef) => columnDef != null);
