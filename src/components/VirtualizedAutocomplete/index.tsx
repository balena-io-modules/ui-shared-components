import {
	Autocomplete,
	AutocompleteProps,
	ChipTypeMap,
	Box,
	ListItemButton,
	ListItemButtonProps,
} from '@mui/material';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { VList } from 'virtua';

const MUI_LIST_VERTICAL_PADDING = 8;

interface ItemDataElement {
	props: React.HTMLAttributes<HTMLElement>;
	option: React.ReactNode;
	index: number;
}

const ListboxComponent = ({
	children,
	isNextPageLoading,
	...props
}: React.HTMLAttributes<HTMLElement> & {
	pagination: { loadNextPage?: () => Promise<void>; itemCount?: number };
	isNextPageLoading: boolean;
}) => {
	const itemData = (children as ItemDataElement[]).slice();
	const { itemCount, loadNextPage } = props.pagination;
	const [optionHeightsTotal, setOptionHeightsTotal] = React.useState(
		MUI_LIST_VERTICAL_PADDING * 2,
	);

	React.useEffect(() => {
		if (!isNextPageLoading) {
			setOptionHeightsTotal(MUI_LIST_VERTICAL_PADDING * 2);
		}
	}, [isNextPageLoading]);

	React.useEffect(() => {
		if (optionHeightsTotal < document.documentElement.clientHeight * 0.4) {
			const options = document.getElementsByClassName('MuiAutocomplete-option');
			let total = MUI_LIST_VERTICAL_PADDING * 2;
			for (const option of options) {
				total += option.clientHeight;
			}
			setOptionHeightsTotal(total);
		}
	}, [
		document.documentElement.clientHeight,
		optionHeightsTotal,
		document.getElementsByClassName('MuiAutocomplete-option'),
	]);

	return (
		<Box
			{...props}
			style={{
				...props.style,
				padding: 0,
				height:
					document.documentElement.clientHeight * 0.4 < optionHeightsTotal
						? '40vh'
						: optionHeightsTotal,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<VList
				style={{
					flex: 1,
				}}
				onRangeChange={(_, lastItemIndex) => {
					if (
						itemCount != null &&
						lastItemIndex + 1 === itemData.length &&
						lastItemIndex + 1 < itemCount
					) {
						loadNextPage?.();
					}
				}}
			>
				{itemData.map((item, i) => (
					<ListItemButton
						{...(item.props as ListItemButtonProps)}
						key={Math.random()}
						sx={{
							mt: i === 0 ? `${MUI_LIST_VERTICAL_PADDING}px` : 0,
							mb:
								i === (itemCount ?? itemData.length) - 1
									? `${MUI_LIST_VERTICAL_PADDING}px`
									: 0,
						}}
					>
						{item.option}
					</ListItemButton>
				))}
			</VList>
			{isNextPageLoading && (
				<Box
					style={{
						position: 'absolute',
						top: 0,
						right: 0,
						left: 0,
						bottom: 0,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgb(0, 0, 0, 0.4)',
						color: 'white',
					}}
				>
					Loading...
				</Box>
			)}
		</Box>
	);
};

export interface VirtualizedAutocompleteProps<
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> extends Omit<
		AutocompleteProps<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>,
		'ListboxComponent'
	> {}

export interface VirtualizedAutocompleteWithPaginationProps<
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> extends Omit<
		AutocompleteProps<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>,
		'ListboxComponent' | 'options' | 'filterOptions'
	> {
	/** function to fetch next page of items */
	loadNext: (
		page: number,
		query: string | undefined,
	) => Promise<{ data: Value[]; totalItems: number }>;
}

const VirtualizedAutocompleteBase = <
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
	renderOption,
	getOptionLabel,
	value,
	...props
}:
	| VirtualizedAutocompleteProps<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
	  >
	| VirtualizedAutocompleteWithPaginationProps<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
	  >) => {
	const [page, setPage] = React.useState(0);
	const [isNextPageLoading, setIsNextPageLoading] = React.useState(false);
	const [response, setResponse] = React.useState<{
		data: Value[];
		totalItems: number;
	}>({ data: [], totalItems: 0 });
	const [query, setQuery] = React.useState('');

	const loadNext = 'loadNext' in props ? props.loadNext : undefined;

	const options = 'options' in props ? props.options : undefined;

	const loadNextPage = React.useCallback(
		async (page: number, items: Value[], query: string) => {
			if (loadNext === undefined || isNextPageLoading) {
				return;
			}
			setIsNextPageLoading(true);
			setQuery(query);
			const { data: nextItems, totalItems } = await loadNext(page, query);
			setPage(page + 1);
			setResponse({ data: items.concat(nextItems), totalItems });
			setIsNextPageLoading(false);
		},
		[
			setQuery,
			setPage,
			setResponse,
			setIsNextPageLoading,
			isNextPageLoading,
			loadNext,
		],
	);

	const onInputChange = async (query: string, items: Value[]) =>
		await loadNextPage(0, items, query);

	const debouncedInputChange = React.useCallback(
		throttle(onInputChange, 500),
		[],
	);

	const pagination = React.useMemo(
		() => ({
			loadNextPage: async () => {
				await loadNextPage(page, response.data, query);
			},
			itemCount: response.totalItems,
		}),
		[loadNextPage, response.totalItems, response.data, page, query],
	);

	return (
		<Autocomplete<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>
			{...props}
			loading={isNextPageLoading}
			options={options ?? response.data}
			renderOption={(renderOptionProps, option, state, ownerState) =>
				({
					props: renderOptionProps,
					option: renderOption?.(renderOptionProps, option, state, ownerState),
					index: state.index,
				} as unknown as React.ReactNode)
			}
			ListboxProps={
				{
					isNextPageLoading,
					pagination,
				} as any
			}
			ListboxComponent={
				ListboxComponent as AutocompleteProps<
					Value,
					Multiple,
					DisableClearable,
					FreeSolo,
					ChipComponent
				>['ListboxComponent']
			}
			onInputChange={async (event, query) => {
				// dropdown is opened, we should move this in a useEffect
				if (!event && !response.totalItems) {
					await loadNextPage(0, [], '');
				}
				// input change
				if (event?.type === 'change') {
					await debouncedInputChange(query, []);
				}
			}}
			getOptionLabel={getOptionLabel}
			value={value}
			{...(loadNext === undefined
				? {}
				: { filterOptions: (options) => options })}
		/>
	);
};

export const VirtualizedAutocomplete = React.memo(
	VirtualizedAutocompleteBase,
) as typeof VirtualizedAutocompleteBase;
