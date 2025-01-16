import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import type { RJSTEntityPropertyDefinition } from '../..';
import type { MenuItemProps } from '@mui/material';
import {
	Checkbox,
	Divider,
	FormControlLabel,
	FormGroup,
	IconButton,
	Menu,
	MenuItem,
} from '@mui/material';
import { color } from '@balena/design-tokens';

interface TableActionsProps<T> {
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	actions?: MenuItemProps[];
	onColumnPreferencesChange?: (
		columns: Array<RJSTEntityPropertyDefinition<T>>,
	) => void;
}

export const TableActions = <T extends object>({
	columns,
	actions,
	onColumnPreferencesChange,
}: TableActionsProps<T>) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(undefined);
	};
	const handleColumnSelection = React.useCallback(
		(column: RJSTEntityPropertyDefinition<T>) => {
			if (!onColumnPreferencesChange) {
				return;
			}
			if (typeof column.label === 'string' && column.label.startsWith('Tag:')) {
				onColumnPreferencesChange(columns.filter((c) => c.key !== column.key));
				return;
			}
			const newColumns = columns.map((c) =>
				c.key === column.key ? { ...c, selected: !c.selected } : c,
			);
			onColumnPreferencesChange(newColumns);
		},
		[onColumnPreferencesChange, columns],
	);
	return (
		<>
			<IconButton
				aria-label="handle column settings"
				onClick={handleClick}
				sx={{ ml: 'auto', color: color.text.value }}
			>
				<FontAwesomeIcon icon={faCog} />
			</IconButton>
			<Menu
				id="long-menu"
				MenuListProps={{
					'aria-labelledby': 'long-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<FormGroup>
					{columns.map((column) => (
						<MenuItem key={column.key} sx={{ p: 0 }}>
							{/* Needed to expand the checkbox click to MenuItem */}
							<FormControlLabel
								sx={{
									flex: 1,
									width: '100%',
									height: '100%',
									py: 1,
									px: 2,
									m: 0,
								}}
								control={
									<Checkbox
										onClick={() => {
											handleColumnSelection(column);
										}}
										checked={column.selected}
									/>
								}
								label={
									typeof column.label === 'string' ? column.label : column.title
								}
							/>
						</MenuItem>
					))}
				</FormGroup>
				{actions?.map(({ onClick, ...menuItemProps }, index) => [
					<Divider key={`divider-${index}`} />,
					<MenuItem
						key={`menuItem-${index}`}
						sx={{ py: 3 }}
						{...menuItemProps}
						onClick={(e) => {
							onClick?.(e);
							handleClose();
						}}
					/>,
				])}
			</Menu>
		</>
	);
};
