import * as React from 'react';
import { TableHeader } from './TableHeader';
import { TableToolbar } from './TableToolbar';
import type { CheckedState, Pagination, TableSortOptions } from './utils';

import { TableRow } from './TableRow';
import type { MenuItemProps } from '@mui/material';
import {
	styled,
	Table as MaterialTable,
	TableContainer,
	Box,
	TableBody,
	TablePagination,
} from '@mui/material';

import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';
import { DEFAULT_ITEMS_PER_PAGE } from '../../utils';
import { token } from '../../../../utils/token';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';

const StyledMaterialTable = styled(MaterialTable)(() => ({
	'& [data-table="table_cell__sticky"]': {
		position: 'sticky',
		left: 0,
		zIndex: 9,
		backgroundColor: 'inherit',
	},
	'& [data-table="table_cell__sticky_header"]': {
		position: 'sticky',
		left: 0,
		zIndex: 10,
	},
}));

export type ColumnPreferencesChangeProp<T> = (
	columns: Array<RJSTEntityPropertyDefinition<T>>,
	changeType: 'display' | 'reorder',
) => void;

interface TableProps<T> {
	rowKey: keyof T;
	data: T[];
	checkedItems?: T[];
	checkedState?: CheckedState;
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	pagination: Pagination;
	sort: TableSortOptions<T>;
	actions?: MenuItemProps[];
	onCheck?: (selected: T[] | undefined, allChecked?: CheckedState) => void;
	onSort?: (sort: TableSortOptions<T>) => void;
	getRowHref: ((entry: any) => string) | undefined;
	onRowClick?: (entity: T, event: React.MouseEvent<HTMLAnchorElement>) => void;
	onPageChange?: (page: number, itemsPerPage: number) => void;
	onColumnPreferencesChange?: ColumnPreferencesChangeProp<T>;
	onManageColumnsOpen?: () => void;
}

export const Table = <T extends object>({
	rowKey,
	data,
	checkedItems = [],
	checkedState,
	columns,
	pagination,
	onManageColumnsOpen,
	sort,
	actions,
	onCheck,
	onSort,
	onRowClick,
	getRowHref,
	onPageChange,
	onColumnPreferencesChange,
}: TableProps<T>) => {
	const { state: analytics } = useAnalyticsContext();
	const lastSelected = React.useRef<T>();

	const totalItems = pagination?.totalItems ?? data.length;

	const numSelected = React.useMemo(() => {
		if (checkedState === 'none') {
			return 0;
		}
		if (checkedState === 'all') {
			// Using || here ensures that the pineFilter case works correctly,
			// as checkedItems is an empty array in this scenario.
			return checkedItems?.length || totalItems;
		}
		return checkedItems?.length;
	}, [checkedState, checkedItems, totalItems]);

	const checkedRowsMap = React.useMemo(() => {
		if (!rowKey || !checkedItems?.length) {
			return new Map();
		}
		return new Map(checkedItems.map((x) => [x[rowKey], x]));
	}, [checkedItems, rowKey]);

	const isChecked = React.useCallback(
		(item: T) => {
			const identifier = item[rowKey];
			return checkedRowsMap.has(identifier);
		},
		[checkedRowsMap, rowKey],
	);

	const visibleRows = React.useMemo(
		() =>
			data.length > pagination.itemsPerPage
				? data.slice(
						pagination.currentPage * pagination.itemsPerPage,
						pagination.currentPage * pagination.itemsPerPage +
							pagination.itemsPerPage,
					)
				: data,
		[data, pagination.currentPage, pagination.itemsPerPage],
	);

	const visibleRowsMap = React.useMemo(() => {
		return visibleRows
			? new Map<T[keyof T], T>(visibleRows.map((row) => [row[rowKey], row]))
			: null;
	}, [visibleRows, rowKey]);

	const handleOnSort = React.useCallback(
		(
			_event: React.MouseEvent<HTMLSpanElement>,
			{ key, field, refScheme, sortable }: RJSTEntityPropertyDefinition<T>,
		) => {
			if (!sort) {
				return;
			}
			const isAsc = sort.key === key && sort.direction === 'asc';
			const newOrder = isAsc ? 'desc' : 'asc';
			// Passing the entire column is not possible because the label might be an HTML element.
			// This can cause errors when attempting to save it to localStorage.
			const sortObj: TableSortOptions<T> = {
				direction: newOrder,
				field: field,
				sortable,
				key: key,
				refScheme: refScheme,
			};
			onSort?.(sortObj);
		},
		[onSort, sort],
	);

	const handleToggleCheck = React.useCallback(
		(row: T) => {
			return (
				event: React.MouseEvent<HTMLButtonElement> & {
					target: { checked: boolean };
				},
			) => {
				if (!visibleRowsMap) {
					return;
				}
				const lastSelectedRow = lastSelected.current;
				const isDifferentRowSelected =
					lastSelectedRow && lastSelectedRow[rowKey] !== row[rowKey];
				const isShiftClick =
					event.shiftKey &&
					isDifferentRowSelected &&
					visibleRowsMap.has(lastSelectedRow[rowKey]);
				// handle multiple selection
				if (isShiftClick) {
					let isInSelection = false;
					for (const [key, value] of visibleRowsMap) {
						if (row[rowKey] === key || lastSelectedRow[rowKey] === key) {
							isInSelection = !isInSelection;
						}
						if (
							(isInSelection || row[rowKey] === key) &&
							event.target.checked
						) {
							checkedRowsMap.set(key, value);
						} else if (!event.target.checked) {
							checkedRowsMap.delete(key);
						}
					}
					lastSelected.current = undefined;
					// Handle select all case
				} else if (checkedState === 'all') {
					for (const [key, value] of visibleRowsMap) {
						if (row[rowKey] === key) {
							continue;
						}
						checkedRowsMap.set(key, value);
					}
				} else {
					// handle single selection
					if (event.target.checked) {
						checkedRowsMap.set(row[rowKey], row);
					} else {
						checkedRowsMap.delete(row[rowKey]);
					}
					lastSelected.current = row;
				}

				const filteredArray = Array.from(checkedRowsMap.values());
				onCheck?.(filteredArray, filteredArray.length > 0 ? 'some' : 'none');
			};
		},
		[visibleRowsMap, checkedRowsMap, rowKey, checkedState, onCheck],
	);

	return (
		<Box sx={{ width: '100%' }}>
			<TableToolbar
				numSelected={numSelected}
				columns={columns}
				actions={actions}
				onColumnPreferencesChange={onColumnPreferencesChange}
				onManageColumnsOpen={onManageColumnsOpen}
			/>
			<TableContainer sx={{ maxHeight: '70vh' }}>
				<StyledMaterialTable stickyHeader>
					<TableHeader
						data-display="table-head"
						columns={columns}
						data={data}
						isServerSide={pagination?.serverSide}
						numSelected={numSelected}
						checkedState={checkedState}
						order={sort.direction}
						orderBy={sort.key}
						onSelectAllClick={onCheck}
						onRequestSort={handleOnSort}
						rowCount={totalItems}
					/>
					<TableBody data-display="table-body">
						{visibleRows.map((row, rowIndex) => {
							const labelId = `enhanced-table-checkbox-${rowIndex}`;
							const checked = isChecked(row);
							const href = getRowHref?.(row);

							let url: URL | null;
							try {
								url = new URL(href ?? '');
							} catch {
								url = null;
							}
							return (
								<TableRow
									key={`${row[rowKey]}_${rowIndex}`}
									row={row}
									rowKey={rowKey}
									rowIndex={rowIndex}
									{...(onCheck && { handleToggleCheck })}
									checkedState={checkedState}
									checked={checked}
									labelId={labelId}
									columns={columns}
									href={href}
									onRowClick={onRowClick}
									url={url}
								/>
							);
						})}
					</TableBody>
				</StyledMaterialTable>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[25, DEFAULT_ITEMS_PER_PAGE, 100]}
				component="div"
				sx={{
					borderTop: `1px solid ${token('color.border.subtle')}`,
				}}
				slotProps={{
					actions: {
						firstButton: { size: 'small' },
						lastButton: { size: 'small' },
						nextButton: { size: 'small' },
						previousButton: { size: 'small' },
					},
				}}
				count={totalItems}
				rowsPerPage={pagination.itemsPerPage}
				page={pagination.currentPage}
				showFirstButton
				showLastButton
				onPageChange={(_event, page) => {
					onPageChange?.(page, pagination.itemsPerPage);
				}}
				onRowsPerPageChange={(event) => {
					const newRowsPerPage = Number(event.target.value);

					onPageChange?.(pagination.currentPage, newRowsPerPage);

					analytics.webTracker?.track('Change table rows per page', {
						rowPerPage: newRowsPerPage,
						totalItems,
						path: window.location.pathname,
					});
				}}
			/>
		</Box>
	);
};
