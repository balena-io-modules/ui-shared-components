import { Link } from '@mui/material';
import type { LinkProps } from '@mui/material';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';

export interface MUILinkWithTrackingProps extends LinkProps {
	eventName?: string;
	eventProperties?: { [key: string]: string };
}

export const MUILinkWithTracking: React.FC<MUILinkWithTrackingProps> = ({
	eventName,
	eventProperties,
	children,
	onClick,
	...rest
}) => {
	const { state } = useAnalyticsContext();
	console.log('lINK');

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
			rel={rest.target === '_blank' ? 'noreferrer' : undefined}
		>
			{children}
		</Link>
	);
};
