import * as React from 'react';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import { Link } from '@mui/material';

export interface TableCellProps<T> {
	href: string | undefined;
	onRowClick:
		| ((entity: T, event: React.MouseEvent<HTMLAnchorElement>) => void)
		| undefined;
	row: T;
	rowKey: keyof T;
	column: RJSTEntityPropertyDefinition<T>;

	url: URL | null;
}

function TableCellComponent<T extends object>({
	href,
	onRowClick,
	row,
	rowKey,
	column,
	url,
}: TableCellProps<T>) {
	return (
		<Link
			sx={(theme) => ({
				px: theme.spacing(2),
				color: 'inherit',
				textDecoration: 'none',
				display: 'table-cell',
				verticalAlign: 'middle',
				whiteSpace: 'nowrap',
				boxSizing: 'border-box',
				cursor: href ? 'pointer' : 'default',
				'&:hover': {
					color: 'inherit',
				},
				height: '50px',
				...(column.priority === 'primary' ? { fontWeight: 'bold' } : {}),
			})}
			href={href}
			data-key={row[rowKey]}
			onClick={(event) => {
				onRowClick?.(row, event);
			}}
			target={url ? '_blank' : undefined}
		>
			{column.render(row[column.field], row)}
		</Link>
	);
}

export const TableCell = React.memo(TableCellComponent) as <T extends object>(
	props: TableCellProps<T>,
) => JSX.Element;
