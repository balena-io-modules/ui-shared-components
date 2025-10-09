import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import type { RJSTEntityPropertyDefinition } from '../../schemaOps';
import type { MenuItemProps } from '@mui/material';
import {
	Button,
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
} from '@mui/material';
import { token } from '../../../../utils/token';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import type { ColumnPreferencesChangeProp } from './index';
import { useAnalyticsContext } from '../../../../contexts/AnalyticsContext';

interface SortableItemProps<T> {
	column: RJSTEntityPropertyDefinition<T>;
	handleColumnSelection: (column: RJSTEntityPropertyDefinition<T>) => void;
}

const SortableItem = <T extends object>({
	column,
	handleColumnSelection,
}: SortableItemProps<T>) => {
	const { state: analyticsState } = useAnalyticsContext();
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: column.key });

	return (
		<MenuItem
			ref={setNodeRef}
			{...attributes}
			sx={{ transform: CSS.Transform.toString(transform), transition }}
		>
			{(analyticsState.featureFlags?.['reducedDefaultDeviceColumns']?.value ===
				'on' ||
				analyticsState.featureFlags?.[
					'reducedDefaultDeviceColumnsAndReordering'
				]?.value === 'on') && (
				<ListItemIcon
					{...listeners}
					sx={{
						cursor: 'grab',
						pr: 2,
						mx: 0,
						minWidth: 'auto !important',
					}}
				>
					<FontAwesomeIcon icon={faGripVertical} />
				</ListItemIcon>
			)}
			<FormControlLabel
				sx={{ flex: 1, width: '100%', m: 0 }}
				control={
					<Checkbox
						sx={{ m: 0 }}
						onClick={() => {
							handleColumnSelection(column);
						}}
						checked={column.selected}
					/>
				}
				label={typeof column.label === 'string' ? column.label : column.title}
			/>
		</MenuItem>
	);
};

interface TableActionsProps<T> {
	columns: Array<RJSTEntityPropertyDefinition<T>>;
	actions?: MenuItemProps[];
	onColumnPreferencesChange?: ColumnPreferencesChangeProp<T>;
	onManageColumnsOpen?: () => void;
}

export const TableActions = <T extends object>({
	columns,
	actions,
	onColumnPreferencesChange,
	onManageColumnsOpen,
}: TableActionsProps<T>) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();
	const theme = useTheme();
	const { state: analyticsState } = useAnalyticsContext();
	const matches = useMediaQuery(theme.breakpoints.up('sm'));
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		onManageColumnsOpen?.();
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
		[columns, onColumnPreferencesChange],
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (
			!active ||
			!over ||
			!onColumnPreferencesChange ||
			(!(
				analyticsState.featureFlags?.['reducedDefaultDeviceColumns']?.value ===
				'on'
			) &&
				!(
					analyticsState.featureFlags?.[
						'reducedDefaultDeviceColumnsAndReordering'
					]?.value === 'on'
				))
		) {
			return;
		}

		const oldIndex = columns.findIndex((c) => c.key === active.id);
		const newIndex = columns.findIndex((c) => c.key === over.id);

		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		const reordered = arrayMove(columns, oldIndex, newIndex).map((c, i) => ({
			...c,
			index: i,
		}));

		onColumnPreferencesChange?.(reordered, 'reorder');
	};

	return (
		<>
			<Button
				aria-label="handle column settings"
				onClick={handleClick}
				sx={{ ml: 'auto', p: 1, color: token('color.text') }}
				variant="text"
			>
				<FontAwesomeIcon icon={faCog} />
				{matches && (
					<Typography variant="bodySm" ml={1}>
						Manage columns
					</Typography>
				)}
			</Button>
			<Menu
				id="long-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						sx: { minWidth: 250 },
					},
				}}
			>
				<FormGroup>
					<DndContext onDragEnd={handleDragEnd}>
						<SortableContext items={columns.map((c) => c.key)}>
							{columns.map((column) => (
								<SortableItem
									key={column.key}
									column={column}
									handleColumnSelection={handleColumnSelection}
								/>
							))}
						</SortableContext>
					</DndContext>
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
