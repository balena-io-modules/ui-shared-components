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
	ListItemIcon,
	Menu,
	MenuItem,
} from '@mui/material';
import { color } from '@balena/design-tokens';
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from 'react-beautiful-dnd';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

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

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination) {
			return;
		}

		const newColumns = Array.from(columns);
		const [movedColumn] = newColumns.splice(result.source.index, 1);
		newColumns.splice(result.destination.index, 0, movedColumn);
		const updatedColumns = newColumns.map((column, newIndex) => ({
			...column,
			index: newIndex,
		}));

		onColumnPreferencesChange?.(updatedColumns);
	};

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
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="columns" direction="vertical">
						{(provided) => (
							<FormGroup ref={provided.innerRef} {...provided.droppableProps}>
								{columns.map((column, index) => (
									<Draggable
										key={column.key}
										draggableId={column.key}
										index={index}
									>
										{(item) => (
											<MenuItem
												ref={item.innerRef}
												{...item.draggableProps}
												sx={{ display: 'flex', alignItems: 'center', p: 0 }}
											>
												<ListItemIcon
													{...item.dragHandleProps}
													sx={{
														cursor: 'grab',
														pl: 3,
														pr: 2,
														mx: 0,
														minWidth: 'fit-content',
													}}
												>
													<FontAwesomeIcon icon={faEllipsisV} />
												</ListItemIcon>
												<FormControlLabel
													sx={{ flex: 1, width: '100%', py: 1, pr: 2, m: 0 }}
													control={
														<Checkbox
															onClick={() => {
																handleColumnSelection(column);
															}}
															checked={column.selected}
														/>
													}
													label={
														typeof column.label === 'string'
															? column.label
															: column.title
													}
												/>
											</MenuItem>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</FormGroup>
						)}
					</Droppable>
				</DragDropContext>
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
