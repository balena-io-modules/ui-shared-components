import type { AutocompleteProps, ChipTypeMap } from '@mui/material';
import {
	Autocomplete,
	Box,
	ListItemButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { debounce } from 'es-toolkit';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { token } from '../../utils/token';
import { Spinner } from '../Spinner';

interface ItemDataElement {
	props: React.HTMLAttributes<HTMLElement>;
	option: React.ReactNode;
	index: number;
}

// Implementation based on TanStack example: https://tanstack.com/virtual/latest/docs/framework/react/examples/infinite-scroll
const ListboxComponent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLElement> & {
		pagination?: { loadNextPage?: () => Promise<void>; itemCount?: number };
		isNextPageLoading?: boolean;
		estimatedOptionSize?: number;
	}
>(function ListboxComponent(
	{
		pagination,
		isNextPageLoading,
		estimatedOptionSize,
		children,
		...restProps
	},
	parentRef,
) {
	const scrollRef = React.useRef<HTMLDivElement>(null);

	const items = children as ItemDataElement[];
	const { itemCount, loadNextPage } = pagination ?? {
		itemCount: items.length,
		loadNextPage: undefined,
	};

	const virtualizer = useVirtualizer({
		count: items.length < (itemCount ?? 0) ? items.length + 1 : items.length,
		estimateSize: () => estimatedOptionSize ?? 48,
		getScrollElement: () => scrollRef.current,
		overscan: 10,
	});
	const virtualItems = virtualizer.getVirtualItems();

	React.useEffect(() => {
		const lastItem = virtualItems.at(-1);

		if (!lastItem || isNextPageLoading) {
			return;
		}

		const totalLoaded = items.length;

		// If the last visible item is within 10 of the end of our current data AND we haven't reached the grand total yet
		if (lastItem.index >= totalLoaded - 10 && totalLoaded < (itemCount ?? 0)) {
			void loadNextPage?.();
		}
	}, [virtualItems, isNextPageLoading, items.length, itemCount, loadNextPage]);

	return (
		<div ref={parentRef} {...restProps}>
			<div
				ref={scrollRef}
				style={{
					maxHeight: '400px',
					overflow: 'auto',
				}}
			>
				<div
					style={{
						height: `${virtualizer.getTotalSize()}px`,
						width: '100%',
						position: 'relative',
					}}
				>
					{virtualItems.map((virtualItem) => {
						const item =
							virtualItem.index < items.length
								? items[virtualItem.index]
								: // add the loading option if we have not reach the grand total yet
									{
										props: { style: {} },
										option: <Typography>Loading...</Typography>,
										index: virtualItem.index,
									};

						return (
							<Box
								key={virtualItem.key.toString()}
								{...item.props}
								component={ListItemButton}
								// needed for measureElement
								data-index={virtualItem.index}
								// makes the item the correct height, or else it uses the estimated size
								ref={virtualizer.measureElement}
								// disable the loading option
								disabled={virtualItem.index === items.length}
								sx={[
									{
										...item.props.style,
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										transform: `translateY(${virtualItem.start}px)`,
										...(virtualItem.index < items.length - 1
											? {
													borderBottom: `1px solid ${token('color.border.subtle')}`,
												}
											: {}),
									},
								]}
							>
								{item.option}
							</Box>
						);
					})}
				</div>
			</div>
		</div>
	);
});

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
	/** used for estimating the size of options that have not been rendered yet so that the scrollbar can be close to accurate */
	estimatedOptionSize?: number;
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
		estimatedOptionSize,
		...props
	}:
		| (VirtualizedAutocompleteProps<
				Value,
				Multiple,
				DisableClearable,
				FreeSolo,
				ChipComponent
				// This is to allow destructuring of loadNext and estimatedOptionSize from props
		  > & { loadNext?: never; estimatedOptionSize?: never })
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
	// TODO: consider useInfiniteQuery for this: https://tanstack.com/query/v4/docs/framework/react/reference/useInfiniteQuery
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
			debounce(async (input: string, items: Value[]) => {
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
			slots={{ listbox: ListboxComponent }}
			slotProps={{
				listbox: {
					isNextPageLoading,
					pagination,
					estimatedOptionSize,
				} as React.ComponentProps<typeof ListboxComponent>,
			}}
			onInputChange={(event, input) => {
				// input change
				if (event?.type === 'change') {
					debouncedInputChange(input, []);
				}
			}}
			onOpen={async () => {
				await loadNextPage(0, [], '');
			}}
			getOptionLabel={getOptionLabel}
			value={value}
			{...(loadNext === undefined ? {} : { filterOptions: (o) => o })}
			renderInput={({ InputProps, ...params }) => (
				<TextField
					{...params}
					slotProps={{
						input: {
							...InputProps,
							endAdornment: (
								<Stack direction="row" gap={1} alignItems="center">
									<Spinner show={isNextPageLoading} />
									{InputProps.endAdornment}
								</Stack>
							),
						},
					}}
				/>
			)}
		/>
	);
};

export const VirtualizedAutocomplete = React.memo(
	React.forwardRef(VirtualizedAutocompleteBase),
) as typeof VirtualizedAutocompleteBase;
