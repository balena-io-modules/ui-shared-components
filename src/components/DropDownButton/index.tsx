import { useMemo, useState } from 'react';
import {
	Button,
	ButtonGroup,
	ButtonGroupProps,
	MenuItem,
	MenuItemProps,
	Menu,
	ButtonProps,
	TooltipProps,
} from '@mui/material';
import { ButtonWithTracking } from '../ButtonWithTracking';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import {
	KeyboardArrowDown,
	KeyboardArrowUp,
	ArrowDropDown,
	ArrowDropUp,
} from '@mui/icons-material';
import { Tooltip } from '../Tooltip';

type MenuItemType<T> = MenuItemWithTrackingProps &
	T & {
		tooltip?: Omit<TooltipProps, 'children'> | TooltipProps['title'];
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
		return (
			memoizedItems?.[selectedIndex]?.onClick?.(event) ??
			onClick?.(event, memoizedItems[selectedIndex])
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
				memoizedItems?.[index]?.onClick?.(event) ??
				onClick?.(event, memoizedItems[selectedIndex])
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
					endIcon={anchorEl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
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
						eventName={memoizedItems[selectedIndex].eventName}
						eventProperties={memoizedItems[selectedIndex].eventProperties}
						tooltip={memoizedItems[selectedIndex].tooltip}
					>
						{memoizedItems[selectedIndex].children}
					</ButtonWithTracking>
					<Button
						onClick={handleToggle}
						// It doesn't look good without it, hence the addition.
						sx={(theme) => ({ pl: 2, pr: `calc(${theme.spacing(2)} + 2px)` })}
					>
						{anchorEl ? <ArrowDropUp /> : <ArrowDropDown />}
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
						key={index}
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
	tooltip?: Omit<TooltipProps, 'children'> | TooltipProps['title'];
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

	const tooltipProps =
		tooltip && typeof tooltip === 'object' && 'title' in tooltip
			? tooltip
			: { title: tooltip };

	return (
		<Tooltip {...tooltipProps}>
			<MenuItem {...menuItem} onClick={handleClick}>
				{children}
			</MenuItem>
		</Tooltip>
	);
};
