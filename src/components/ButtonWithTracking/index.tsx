import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { Tooltip } from '../Tooltip';

export interface ButtonWithTrackingProps extends ButtonProps {
	eventName: string;
	eventProperties?: { [key: string]: any };
	tooltip?: string;
}

/**
 * This button will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).
 */
export const ButtonWithTracking: React.FC<ButtonWithTrackingProps> = ({
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

	return (
		<Tooltip title={tooltip}>
			<Button {...rest} onClick={handleClick} disableElevation>
				{children}
			</Button>
		</Tooltip>
	);
};
