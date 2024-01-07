import { useMemo, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
	Button,
	ButtonGroup,
	ButtonGroupProps,
	MenuItem,
	MenuItemProps,
	Menu,
	ButtonProps,
} from '@mui/material';
import { ButtonWithTracking } from '../ButtonWithTracking';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Tooltip } from '../Tooltip';

type MenuItemType<T> = MenuItemWithTrackingProps &
	T & {
		tooltip?: string | undefined;
	};

export interface DropDownButtonProps<T = unknown>
	extends Omit<ButtonGroupProps & ButtonProps, 'onClick'> {
	items: Array<MenuItemType<T>>;
	selectedItemIndex?: number;
	groupByProp?: keyof T;
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLLIElement, MouseEvent>,
		item: MenuItemWithTrackingProps,
	) => void;
}

/**
 * This component implements a Dropdown button using MUI (This can be removed as soon as MUI implements it. Check
 * progress: https://mui.com/material-ui/discover-more/roadmap/#new-components)
 */
export const DropDownButton = <T extends unknown>({
	items,
	selectedItemIndex = 0,
	groupByProp,
	onClick,
	children,
	...buttonProps
}: DropDownButtonProps<T>) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedIndex, setSelectedIndex] = useState(selectedItemIndex);

	// To use the groupBy pass another property on each item and define that property on groupByProp.
	// const items = [{...menuItem, section: 'test1'}, {...menuItem, section: 'test2'}];
	// <Dropdown groupByProp='section' .../>
	const memoizedItems = useMemo(() => {
		if (!groupByProp) {
			return items;
		}
		const grouped = groupBy(items, (item) => item[groupByProp]);
		const keys = Object.keys(grouped);
		const lastKey = keys[keys.length - 1];

		return flatMap(grouped, (value, key) => [
			...value.map((v, index) =>
				key !== lastKey && index === value.length - 1
					? { ...v, divider: true }
					: v,
			),
		]).filter((item) => item);
	}, [items, groupByProp]);

	const handleClick = (
		event: React.MouseEvent<HTMLLIElement | HTMLButtonElement>,
	) => {
		setAnchorEl(event.currentTarget);
		return (
			items?.[selectedIndex]?.onClick?.(event) ??
			onClick?.(event, items[selectedIndex])
		);
	};

	const handleMenuItemClick = (
		event: React.MouseEvent<HTMLLIElement | HTMLButtonElement>,
		index: number,
	) => {
		setSelectedIndex(index);
		setAnchorEl(null);
		if (children) {
			return (
				items?.[index]?.onClick?.(event) ??
				onClick?.(event, items[selectedIndex])
			);
		}
	};

	const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			{children ? (
				<Button
					aria-controls={!!anchorEl ? 'dropdown' : undefined}
					aria-expanded={!!anchorEl ? 'true' : undefined}
					onClick={(event) => {
						setAnchorEl(event.currentTarget);
					}}
					endIcon={<KeyboardArrowDown />}
					{...(buttonProps as ButtonProps)}
				>
					{children}
				</Button>
			) : (
				<ButtonGroup
					variant="contained"
					disableElevation
					{...(buttonProps as ButtonGroupProps)}
				>
					<ButtonWithTracking
						onClick={handleClick}
						eventName={items[selectedIndex].eventName}
						eventProperties={items[selectedIndex].eventProperties}
						tooltip={items[selectedIndex].tooltip}
					>
						{items[selectedIndex].children}
					</ButtonWithTracking>
					<Button
						onClick={handleToggle}
						// It doesn't look good without it, hence the addition.
						sx={(theme) => ({ pl: 2, pr: `calc(${theme.spacing(2)} + 2px)` })}
					>
						<ArrowDropDownIcon />
					</Button>
				</ButtonGroup>
			)}
			<Menu
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={() => {
					setAnchorEl(null);
				}}
			>
				{memoizedItems.map((item, index) => (
					<MenuItemWithTracking
						{...item}
						onClick={(event) => handleMenuItemClick(event, index)}
					>
						{item.children}
					</MenuItemWithTracking>
				))}
			</Menu>
		</>
	);
};

export interface MenuItemWithTrackingProps
	extends Omit<MenuItemProps, 'onClick'> {
	eventName: string;
	eventProperties?: { [key: string]: any };
	tooltip?: string;
	onClick?: React.MouseEventHandler<HTMLLIElement | HTMLButtonElement>;
}

/**
 * This MenuItem will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).
 */
export const MenuItemWithTracking: React.FC<MenuItemWithTrackingProps> = ({
	eventName,
	eventProperties,
	children,
	tooltip,
	onClick,
	...menuItem
}) => {
	const { state } = useAnalyticsContext();

	const handleClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		if (state.webTracker) {
			state.webTracker.track(eventName, eventProperties);
		}
		onClick?.(event);
	};

	return (
		<Tooltip title={tooltip}>
			<MenuItem {...menuItem} onClick={handleClick}>
				{children}
			</MenuItem>
		</Tooltip>
	);
};
