import type { MenuItemProps } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import { TableActions } from './TableActions';
import { color } from '@balena/design-tokens';
import type { ColumnPreferencesChangeProp } from './index';

interface TableToolbarProps<T> {
	numSelected?: number;
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	actions?: MenuItemProps[];
	onColumnPreferencesChange?: ColumnPreferencesChangeProp<T>;
}

export const TableToolbar = <T extends object>({
	numSelected = 0,
	columns,
	actions,
	onColumnPreferencesChange,
}: TableToolbarProps<T>) => {
	return (
		<Stack direction="row">
			{numSelected > 0 && (
				<Typography
					color="inherit"
					variant="bodySm"
					component="div"
					sx={(theme) => ({
						alignSelf: 'flex-end',
						px: theme.spacing(2),
						py: theme.spacing(1),
						borderRadius: '4px 4px 0 0',
						background: color.bg.subtle.value,
						boxShadow: 'inset 0px -1px 1px rgba(0,0,0,0.05)',
					})}
				>
					<strong>{numSelected}</strong> selected
				</Typography>
			)}
			<TableActions
				columns={columns}
				actions={actions}
				onColumnPreferencesChange={onColumnPreferencesChange}
			/>
		</Stack>
	);
};
