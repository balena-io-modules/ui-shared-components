import type { MenuItemProps } from '@mui/material';
import { Stack, Typography } from '@mui/material';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import { TableActions } from './TableActions';
import { token } from '../../../../utils/token';
import type { ColumnPreferencesChangeProp } from './index';

interface TableToolbarProps<T> {
	numSelected?: number;
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	actions?: MenuItemProps[];
	onManageColumnsOpen?: () => void;
	onColumnPreferencesChange?: ColumnPreferencesChangeProp<T>;
}

export const TableToolbar = <T extends object>({
	numSelected = 0,
	columns,
	actions,
	onManageColumnsOpen,
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
						borderRadius: `${token('shape.borderRadius.sm')} ${token('shape.borderRadius.sm')} 0 0`,
						background: token('color.bg.subtle'),
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
				onManageColumnsOpen={onManageColumnsOpen}
			/>
		</Stack>
	);
};
