import { Link } from '@mui/material';
import type { LinkProps } from '@mui/material';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';

export interface MUILinkWithTrackingProps extends LinkProps {
	eventName?: string;
	eventProperties?: { [key: string]: string };
}

/**
 * This Link will send analytics in case the analytics context is passed through
 * the provider (AnalyticsProvider).
 */
export const MUILinkWithTracking: React.FC<MUILinkWithTrackingProps> = ({
	eventName,
	eventProperties,
	children,
	onClick,
	target = '_blank',
	...rest
}) => {
	const { state } = useAnalyticsContext();

	const handleClick = (event: any) => {
		if (!state.webTracker) {
			onClick?.(event);
			return;
		}
		if (eventName) {
			state.webTracker.track(eventName, eventProperties);
		} else {
			state.webTracker.trackNavigationClick(`${rest.href}`, eventProperties);
		}
		onClick?.(event);
	};

	return (
		<Link
			{...rest}
			onClick={handleClick}
			target={target}
			rel={target === '_blank' ? 'noreferrer' : undefined}
		>
			{children}
		</Link>
	);
};
