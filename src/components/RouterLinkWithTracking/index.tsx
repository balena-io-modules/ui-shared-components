import { Link } from 'react-router';
import type { LinkProps } from 'react-router';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
export interface RouterLinkWithTrackingProps extends LinkProps {
	eventName?: string;
	eventProperties?: { [key: string]: string };
}

/**
 * This Link will send analytics in case the analytics context is
 * passed through the provider (AnalyticsProvider).
 */
export const RouterLinkWithTracking = ({
	eventName,
	eventProperties,
	children,
	onClick,
	...rest
}: RouterLinkWithTrackingProps) => {
	const { state } = useAnalyticsContext();

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (!state.webTracker) {
			onClick?.(event);
			return;
		}
		if (eventName) {
			state.webTracker.track(eventName, eventProperties);
		} else {
			state.webTracker.trackNavigationClick(`${rest.to}`, eventProperties);
		}
		onClick?.(event);
	};

	return (
		<Link {...rest} onClick={handleClick} data-underline="false">
			{children}
		</Link>
	);
};
