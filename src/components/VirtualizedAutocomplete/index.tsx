import type { AutocompleteProps, ChipTypeMap } from '@mui/material';
import { Autocomplete, Box, ListItemButton, Typography } from '@mui/material';
import { throttle } from 'es-toolkit';
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { token } from '../../utils/token';

interface ItemDataElement {
	props: React.HTMLAttributes<HTMLElement>;
	option: React.ReactNode;
	index: number;
}

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
	forwardedRef,
) {
	const muiContainerRef = React.useRef<HTMLDivElement>(null);
	// Safely handle the external 'forwardedRef'
	// Not sure why this was needed tbh
	React.useImperativeHandle(forwardedRef, () => muiContainerRef.current!);

	const scrollAreaRef = React.useRef<HTMLDivElement>(null);

	const items = React.useMemo(
		() => (children as ItemDataElement[]).slice(),
		[children],
	);
	const { itemCount, loadNextPage } = pagination ?? {
		itemCount: items.length,
		loadNextPage: undefined,
	};

	const virtualizer = useVirtualizer({
		count: items.length < (itemCount ?? 0) ? items.length + 1 : items.length,
		estimateSize: () => estimatedOptionSize ?? 48,
		getScrollElement: () => scrollAreaRef.current,
		overscan: 10,
	});
	const virtualItems = virtualizer.getVirtualItems();

	React.useEffect(() => {
		const lastItem = virtualItems[virtualItems.length - 1];

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
		<div
			// AI kept insisting that this ref and the scrollAreaRef need to be merged into one, but I couldn't get that working
			ref={muiContainerRef}
			{...restProps}
			style={{
				position: 'relative',
				maxHeight: '400px',
				// Not sure why this one gets the overflow when scrollAreaRef is supposedly the scroll element
				// Couldn't get it to work the other way though
				overflow: 'auto',
			}}
		>
			<div
				ref={scrollAreaRef}
				style={{
					// This is based on estimated size. Not sure what exact role it plays, maybe there's a cleaner way
					// When you get to the end of the list where items ended up needing more size than estimated, it doesn't cut anything off
					// What I know is it's necessary to get the scroll container to know how large to be
					height: `${virtualizer.getTotalSize()}px`,
					width: '100%',
					position: 'relative',
				}}
			>
				{/* I don't get the need for this either, the parent container has this height so why does this one need it?
					The only difference is the ref */}
				<div
					style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%' }}
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
										// This styling makes the options properly aligned
										// Not sure why it's necessary though, maybe there's a cleaner way
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
	/** estimated size of each option once it is rendered in the dropdown */
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
			getOptionLabel={getOptionLabel}
			value={value}
			{...(loadNext === undefined ? {} : { filterOptions: (o) => o })}
		/>
	);
};

export const VirtualizedAutocomplete = React.memo(
	React.forwardRef(VirtualizedAutocompleteBase),
) as typeof VirtualizedAutocompleteBase;
