import { Button, type ButtonProps, type TooltipProps } from '@mui/material';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { Tooltip } from '../Tooltip';

export interface ButtonWithTrackingProps extends ButtonProps {
	eventName: string;
	eventProperties?: { [key: string]: any };
	tooltip?: Omit<TooltipProps, 'children'> | TooltipProps['title'];
}

/**
 * This button will send analytics in case the analytics context is passed through the provider (AnalyticsProvider).
 */
export const ButtonWithTracking = ({
	eventName,
	eventProperties,
	children,
	tooltip,
	onClick,
	...rest
}: ButtonWithTrackingProps) => {
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
			<Button {...rest} onClick={handleClick} disableElevation>
				{children}
			</Button>
		</Tooltip>
	);
};
