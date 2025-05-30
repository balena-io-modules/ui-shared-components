import type { AutocompleteProps, ChipTypeMap } from '@mui/material';
import { Autocomplete, Box, ListItemButton, Stack } from '@mui/material';
import throttle from 'lodash/throttle';
import * as React from 'react';
import { forwardRef } from 'react';
import type { VListHandle } from 'virtua';
import { VList } from 'virtua';
import { token } from '../../utils/token';

interface ItemDataElement {
	props: React.HTMLAttributes<HTMLElement>;
	option: React.ReactNode;
	index: number;
}

const ListboxComponent = ({
	children,
	isNextPageLoading,
	style,
	pagination,
	...props
}: React.HTMLAttributes<HTMLElement> & {
	pagination: { loadNextPage?: () => Promise<void>; itemCount?: number };
	isNextPageLoading: boolean;
	style: React.CSSProperties;
}) => {
	const itemData = (children as ItemDataElement[]).slice();
	const { itemCount, loadNextPage } = pagination;
	const [optionHeightsTotal, setOptionHeightsTotal] = React.useState(0);
	const ref = React.useRef<VListHandle>(null);

	React.useEffect(() => {
		if (!isNextPageLoading) {
			setOptionHeightsTotal(0);
		}
	}, [isNextPageLoading]);

	React.useEffect(() => {
		if (optionHeightsTotal < document.documentElement.clientHeight * 0.4) {
			const options = document.getElementsByClassName('MuiAutocomplete-option');
			let total = 0;
			for (const option of options) {
				total += option.clientHeight;
			}
			setOptionHeightsTotal(total);
		}
	}, [optionHeightsTotal]);

	return (
		<Stack
			{...props}
			style={{
				...style,
				padding: 0,
				height:
					document.documentElement.clientHeight * 0.4 < optionHeightsTotal
						? '40vh'
						: optionHeightsTotal,
			}}
		>
			<VList
				ref={ref}
				style={{
					flex: 1,
				}}
				onScroll={async () => {
					if (!ref.current) {
						return;
					}
					if (
						itemCount != null &&
						itemData.length < itemCount &&
						ref.current.findEndIndex() + 50 > itemCount
					) {
						await loadNextPage?.();
					}
				}}
			>
				{itemData.map((item, i) => (
					<Box
						component={ListItemButton}
						{...item.props}
						{...(i < itemData.length - 1
							? {
									sx: {
										borderBottom: `1px solid ${token('color.border.subtle')}`,
									},
								}
							: {})}
						key={item.index}
					>
						{item.option}
					</Box>
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
		</Stack>
	);
};

export type VirtualizedAutocompleteProps<
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> = Omit<
	AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>,
	'ListboxComponent'
>;

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
	) => MaybePromise<{ data: Value[]; totalItems: number }>;
}

const VirtualizedAutocompleteBase = <
	Value,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>(
	{
		renderOption,
		getOptionLabel,
		value,
		loadNext,
		...props
	}:
		| (VirtualizedAutocompleteProps<
				Value,
				Multiple,
				DisableClearable,
				FreeSolo,
				ChipComponent
				// This is to allow destructuring of loadNext from props
		  > & { loadNext?: never })
		| VirtualizedAutocompleteWithPaginationProps<
				Value,
				Multiple,
				DisableClearable,
				FreeSolo,
				ChipComponent
		  >,
	ref: React.Ref<
		typeof Autocomplete<
			Value,
			Multiple,
			DisableClearable,
			FreeSolo,
			ChipComponent
		>
	>,
) => {
	const [page, setPage] = React.useState(0);
	const [isNextPageLoading, setIsNextPageLoading] = React.useState(false);
	const [response, setResponse] = React.useState<{
		data: Value[];
		totalItems: number;
	}>({ data: [], totalItems: 0 });
	const [query, setQuery] = React.useState('');

	const options = 'options' in props ? props.options : undefined;

	const loadNextPage = React.useCallback(
		async (pageParam: number, items: Value[], queryParam: string) => {
			if (loadNext === undefined || isNextPageLoading) {
				return;
			}
			setIsNextPageLoading(true);
			setQuery(queryParam);
			const { data: nextItems, totalItems } = await loadNext(
				pageParam,
				queryParam,
			);
			setPage(pageParam + 1);
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

	const debouncedInputChange = React.useMemo(
		() =>
			throttle(async (input: string, items: Value[]) => {
				await loadNextPage(0, items, input);
			}, 500),
		[loadNextPage],
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

	React.useEffect(() => {
		void loadNextPage(0, [], '');
	}, []);

	return (
		<Autocomplete<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>
			{...props}
			ref={ref}
			loading={isNextPageLoading}
			options={options ?? response.data}
			renderOption={(renderOptionProps, option, state, ownerState) =>
				({
					props: renderOptionProps,
					option: renderOption?.(renderOptionProps, option, state, ownerState),
					index: state.index,
				}) as unknown as React.ReactNode
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
			onInputChange={async (event, input) => {
				// input change
				if (event?.type === 'change') {
					await debouncedInputChange(input, []);
				}
			}}
			getOptionLabel={getOptionLabel}
			value={value}
			{...(loadNext === undefined ? {} : { filterOptions: (o) => o })}
		/>
	);
};

export const VirtualizedAutocomplete = React.memo(
	forwardRef(VirtualizedAutocompleteBase),
) as typeof VirtualizedAutocompleteBase;
