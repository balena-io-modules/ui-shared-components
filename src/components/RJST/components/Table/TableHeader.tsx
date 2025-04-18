import type * as React from 'react';
import { visuallyHidden } from '@mui/utils';
import type { CheckedState, Order } from './utils';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import {
	Box,
	Checkbox,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';

interface TableHeaderProps<T> {
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	data: T[];
	isServerSide?: boolean;
	numSelected?: number;
	checkedState?: CheckedState;
	onRequestSort: (
		event: React.MouseEvent<HTMLSpanElement>,
		column: RJSTEntityPropertyDefinition<T>,
	) => void;
	onSelectAllClick?: (
		selected: T[] | undefined,
		allChecked: CheckedState,
	) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

export const TableHeader = <T extends object>({
	data,
	isServerSide,
	columns,
	onSelectAllClick,
	order,
	orderBy,
	numSelected,
	checkedState,
	rowCount,
	onRequestSort,
}: TableHeaderProps<T>) => {
	return (
		<TableHead sx={{ borderCollapse: 'collapse' }}>
			<TableRow>
				{onSelectAllClick && (
					<TableCell data-table="table_cell__sticky_header" padding="checkbox">
						<Checkbox
							color="primary"
							indeterminate={checkedState === 'some'}
							checked={
								(rowCount > 0 && numSelected === rowCount) ||
								checkedState === 'all'
							}
							onChange={() => {
								const state =
									checkedState === 'some'
										? 'none'
										: checkedState === 'all'
											? 'none'
											: 'all';
								const clientData = state === 'all' ? data : undefined;
								onSelectAllClick?.(
									isServerSide ? undefined : clientData,
									state,
								);
							}}
							inputProps={{
								'aria-label': 'select all rows',
							}}
						/>
					</TableCell>
				)}
				{columns.map(
					(column, index) =>
						column.selected && (
							<TableCell
								key={`${column.label}_${index}`}
								align="left"
								sortDirection={orderBy === column.key ? order : false}
								sx={{ whiteSpace: 'nowrap', border: 'none' }}
							>
								{column.sortable ? (
									<TableSortLabel
										active={orderBy === column.key}
										direction={orderBy === column.key ? order : 'asc'}
										onClick={(event) => {
											onRequestSort(event, column);
										}}
									>
										{column.label ?? column.title}
										{orderBy === column.key ? (
											<Box component="span" sx={visuallyHidden}>
												{order === 'desc'
													? 'sorted descending'
													: 'sorted ascending'}
											</Box>
										) : null}
									</TableSortLabel>
								) : (
									(column.label ?? column.title)
								)}
							</TableCell>
						),
				)}
			</TableRow>
		</TableHead>
	);
};
