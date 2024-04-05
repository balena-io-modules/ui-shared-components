import React from 'react';
import {
	IconButton,
	type IconButtonProps,
	type TooltipProps,
} from '@mui/material';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { Tooltip } from '../Tooltip';

export interface IconButtonWithTrackingProps extends IconButtonProps {
	eventName: string;
	eventProperties?: { [key: string]: any };
	tooltip?: Omit<TooltipProps, 'children'> | TooltipProps['title'];
}

/**
 * This IconButton will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).
 */
export const IconButtonWithTracking: React.FC<IconButtonWithTrackingProps> = ({
	eventName,
	eventProperties,
	children,
	tooltip,
	onClick,
	...rest
}) => {
	const { state } = useAnalyticsContext();

	const handleClick = (event: any) => {
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
			<IconButton {...rest} onClick={handleClick}>
				{children}
			</IconButton>
		</Tooltip>
	);
};
