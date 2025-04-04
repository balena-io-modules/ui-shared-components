import React from 'react';
import { useTranslation } from '../../../../hooks/useTranslations';
import { Search } from './Search';
import { Views } from './Views';
import { FiltersDialog } from './FiltersDialog';
import {
	type FormData,
	createFullTextSearchFilter,
	randomUUID,
	FULL_TEXT_SLUG,
	parseFilterDescription,
} from './SchemaSieve';
import { Summary } from './Summary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { useClickOutsideOrEsc } from '../../../../hooks/useClickOutsideOrEsc';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { getPropertySchemaAndModel } from '../../DataTypes';
import { getFromLocalStorage, setToLocalStorage } from '../../utils';
import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';
import type { SxProps } from '@mui/material';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { isJSONSchema } from '../../schemaOps';
import { token } from '../../../../utils/token';

const getViews = (views?: FiltersView[], viewsRestorationKey?: string) => {
	if (views?.length) {
		return views;
	}
	if (viewsRestorationKey) {
		return getFromLocalStorage<FiltersView[]>(viewsRestorationKey) ?? [];
	}
	return [];
};

export interface FiltersView {
	id: string;
	eventName: string;
	name: string;
	filters: JSONSchema[];
}

export type FilterRenderMode =
	| 'all'
	| 'add'
	| 'search'
	| 'views'
	| 'summary'
	| 'summaryWithSaveViews';

export interface FiltersProps {
	schema: JSONSchema;
	dark?: boolean;
	filters?: JSONSchema[];
	views?: FiltersView[];
	viewsRestorationKey?: string;
	onFiltersChange?: (filters: JSONSchema[]) => void;
	onViewsChange?: (views: FiltersView[]) => void;
	renderMode?: FilterRenderMode | FilterRenderMode[];
	onSearch?: (searchTerm: string) => React.ReactElement | null;
}

// TODO remove when we have implemented a dark theme
const darkStyles: SxProps = {
	color: token('color.text'),
	backgroundColor: 'white',
	border: 'none',
	'&:hover': {
		backgroundColor: 'white',
	},
};

export const Filters = ({
	schema,
	dark,
	filters,
	views,
	viewsRestorationKey,
	onFiltersChange,
	onViewsChange,
	renderMode,
	onSearch,
}: FiltersProps) => {
	const { t } = useTranslation();
	const { state: analytics } = useAnalyticsContext();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up('sm'));
	const [showFilterDialog, setShowFilterDialog] = React.useState(false);
	const [showSearchDropDown, setShowSearchDropDown] = React.useState(false);
	const [searchString, setSearchString] = React.useState<string>('');
	const [editFilter, setEditFilter] = React.useState<JSONSchema>();
	const searchBarRef = useClickOutsideOrEsc<HTMLDivElement>(() => {
		setShowSearchDropDown(false);
	});
	const [storedViews, setStoredViews] = React.useState(
		getViews(views, viewsRestorationKey),
	);

	React.useEffect(() => {
		setStoredViews(getViews(views, viewsRestorationKey));
	}, [views, viewsRestorationKey]);

	const viewsUpdate = React.useCallback(
		(newViews: FiltersView[]) => {
			if (viewsRestorationKey) {
				setToLocalStorage(viewsRestorationKey, newViews);
			}
			setStoredViews(newViews);
			onViewsChange?.(newViews);

			analytics.webTracker?.track('Update table views', {
				current_url: location.origin + location.pathname,
				...newViews,
			});
		},
		[viewsRestorationKey, setStoredViews, onViewsChange, analytics.webTracker],
	);

	const formData = React.useMemo(() => {
		if (!editFilter) {
			return;
		}
		if (editFilter.title === FULL_TEXT_SLUG) {
			const description = parseFilterDescription(editFilter);
			if (!description) {
				return;
			}
			return {
				field: description.field,
				operator: 'contains',
				value: description.value,
			};
		}
		return editFilter.anyOf
			?.map((f) => {
				if (!isJSONSchema(f)) {
					return;
				}
				const description = parseFilterDescription(f);
				if (!description) {
					return;
				}
				const { model } = getPropertySchemaAndModel(description?.field, schema);

				// We need to recalculate the operator, as it is provided as a value in the description instead of as a key.
				// TODO: The operator should be passed as an object in the description, not as a value.
				const operator = model
					? (Object.entries(model.operators).find(
							([key, value]) =>
								value === description.operator || key === description.operator,
						)?.[0] ?? description.operator)
					: description.operator;
				return {
					field: description.field,
					operator,
					value: description.value,
				};
			})
			.filter((f) => !!f) as FormData[];
	}, [editFilter, schema]);

	const handleFilterChange = React.useCallback(
		(filter: JSONSchema | null) => {
			if (!filter) {
				return;
			}
			let existingFilters = filters;
			if (editFilter && filters) {
				existingFilters = filters.filter((f) => f.$id !== editFilter.$id);
			}
			onFiltersChange?.([...(existingFilters ?? []), filter]);
		},
		[filters, onFiltersChange, editFilter],
	);

	const handleDeleteFilter = React.useCallback(
		(filter: JSONSchema) => {
			onFiltersChange?.(filters?.filter((f) => f.$id !== filter.$id) ?? []);
		},
		[filters, onFiltersChange],
	);

	const handleSaveView = React.useCallback(
		(name: string) => {
			const view: FiltersView = {
				id: randomUUID(),
				name,
				eventName: `Saving filters view ${name}`,
				filters: filters ?? [],
			};
			const newViews = [...(storedViews ?? []), view];
			viewsUpdate?.(newViews);
		},
		[filters, storedViews, viewsUpdate],
	);

	const handleDeleteView = React.useCallback(
		(view: FiltersView) => {
			viewsUpdate?.(storedViews?.filter((v) => v.id !== view.id) ?? []);
		},
		[storedViews, viewsUpdate],
	);

	return (
		<>
			<Box display="flex" alignItems="center" gap={2}>
				{(!renderMode || renderMode.includes('search')) && (
					<Box
						ref={searchBarRef}
						sx={{
							display: 'flex',
							flex: 1,
							position: 'relative',
							alignSelf: 'center',
							zIndex: 10,
						}}
					>
						<Search
							id="balena__filters_search_bar"
							dark={dark}
							onChange={(e) => {
								if (!e) {
									setSearchString('');
									setShowSearchDropDown(false);
									return;
								}
								setShowSearchDropDown(e.target.value !== '');
								setSearchString(e.target.value);
							}}
							onEnter={(event) => {
								event.preventDefault();
								event.stopPropagation();
								if (!searchString) {
									return;
								}
								const filter = createFullTextSearchFilter(schema, searchString);
								handleFilterChange(filter ?? null);
								setSearchString('');
							}}
							value={searchString}
						/>
						{searchString && showSearchDropDown && onSearch?.(searchString)}
					</Box>
				)}
				{(!renderMode || renderMode.includes('add')) && (
					<Button
						variant={dark ? 'light' : 'outlined'}
						onClick={() => {
							setShowFilterDialog(true);
						}}
						startIcon={matches ? <FontAwesomeIcon icon={faFilter} /> : null}
						color="secondary"
						sx={{
							whiteSpace: 'nowrap',
							...(dark && darkStyles),
						}}
					>
						{matches ? (
							t('actions.add_filter')
						) : (
							<FontAwesomeIcon icon={faFilter} />
						)}
					</Button>
				)}
				{(!renderMode || renderMode.includes('views')) && (
					<Views
						views={storedViews}
						setFilters={(updatedFilters) => {
							onFiltersChange?.(updatedFilters);
						}}
						deleteView={handleDeleteView}
						dark={dark}
					/>
				)}
			</Box>
			{(!renderMode ||
				renderMode.includes('summary') ||
				renderMode.includes('summaryWithSaveViews') ||
				renderMode.includes('all')) &&
				!!filters?.length && (
					<Summary
						onEdit={(filter) => {
							setEditFilter(filter);
						}}
						onDelete={handleDeleteFilter}
						onClearFilters={() => {
							onFiltersChange?.([]);
						}}
						showSaveView={
							!renderMode ||
							renderMode?.includes('views') ||
							renderMode?.includes('summaryWithSaveViews') ||
							renderMode?.includes('all')
						}
						onSaveView={({ name }) => {
							handleSaveView(name);
						}}
						filters={filters}
						dark={dark}
					/>
				)}
			{(showFilterDialog || formData) && (
				<FiltersDialog
					onClose={(filter) => {
						handleFilterChange(filter ?? null);
						setShowFilterDialog(false);
						setEditFilter(undefined);
					}}
					schema={schema}
					data={formData}
				/>
			)}
		</>
	);
};
