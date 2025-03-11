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
	ListItemIcon,
	Menu,
	MenuItem,
	useTheme,
	useMediaQuery,
	Typography,
	Button,
} from '@mui/material';
import { color } from '@balena/design-tokens';
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from 'react-beautiful-dnd';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import type { ColumnPreferencesChangeProp } from './index';
import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';

interface TableActionsProps<T> {
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	actions?: MenuItemProps[];
	onColumnPreferencesChange?: ColumnPreferencesChangeProp<T>;
}

export const TableActions = <T extends object>({
	columns,
	actions,
	onColumnPreferencesChange,
}: TableActionsProps<T>) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
	const theme = useTheme();
	const { state: analyticsState } = useAnalyticsContext();
	const matches = useMediaQuery(theme.breakpoints.up('sm'));
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
				onColumnPreferencesChange(
					columns.filter((c) => c.key !== column.key),
					'display',
				);
				return;
			}
			const newColumns = columns.map((c) =>
				c.key === column.key ? { ...c, selected: !c.selected } : c,
			);
			onColumnPreferencesChange(newColumns, 'display');
		},
		[onColumnPreferencesChange, columns],
	);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || !analyticsState.featureFlags?.columnOrdering) {
			return;
		}

		const newColumns = Array.from(columns);
		const [movedColumn] = newColumns.splice(result.source.index, 1);
		newColumns.splice(result.destination.index, 0, movedColumn);
		const updatedColumns = newColumns.map((column, newIndex) => ({
			...column,
			index: newIndex,
		}));

		onColumnPreferencesChange?.(updatedColumns, 'reorder');
	};

	return (
		<>
			<Button
				aria-label="handle column settings"
				onClick={handleClick}
				sx={{ ml: 'auto', p: 1, color: color.text.value }}
				variant="text"
			>
				<FontAwesomeIcon icon={faCog} />
				{matches ? (
					<Typography variant="bodySm" ml={1}>
						Manage columns
					</Typography>
				) : null}
			</Button>
			<Menu
				id="long-menu"
				MenuListProps={{
					'aria-labelledby': 'long-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						sx: {
							minWidth: 250,
						},
					},
				}}
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
												{analyticsState.featureFlags?.columnOrdering && (
													<ListItemIcon
														{...item.dragHandleProps}
														sx={{
															cursor: 'grab',
															pl: 3,
															pr: 2,
															mx: 0,
															minWidth: 'auto !important',
														}}
													>
														<FontAwesomeIcon icon={faGripVertical} />
													</ListItemIcon>
												)}
												<FormControlLabel
													sx={{ flex: 1, width: '100%', py: 1, pr: 2, m: 0 }}
													control={
														<Checkbox
															sx={{ m: 0 }}
															edge="start"
															size="small"
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
