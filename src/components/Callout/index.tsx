import * as React from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, styled, useThemeProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Severity } from '../../theme';
import { severityIcons } from '../../theme';
import { color } from '@balena/design-tokens';

export interface CalloutProps {
	children: React.ReactNode;
	severity?: Severity;
	variant?: 'default' | 'subtle';
	icon?: React.ReactNode;
	sx?: SxProps<Theme>;
	size?: 'sm' | 'lg';
}
const CalloutRoot = styled(Box, {
	name: 'Callout',
	slot: 'root',
})<{ ownerState: CalloutProps }>(({ theme, ownerState }) => ({
	display: 'flex',
	gap: theme.spacing(2),
	padding: theme.spacing(ownerState.size === 'sm' ? 2 : 3),
	borderLeft: 'solid 3px',
	borderLeftColor: 'var(--callout-border-color)',
	...(ownerState.variant === 'default' && {
		backgroundColor: color.bg.value,
	}),
	...(ownerState.variant === 'subtle' && {
		backgroundColor: color.bg.subtlest.value,
	}),
	'--callout-border-color': color.border.info.value,
	'--callout-icon-color': color.icon.info.value,
	...(ownerState.severity === 'success' && {
		'--callout-border-color': color.border.success.value,
		'--callout-icon-color': color.icon.success.value,
	}),
	...(ownerState.severity === 'warning' && {
		'--callout-border-color': color.border.warning.value,
		'--callout-icon-color': color.icon.warning.value,
	}),
	...(ownerState.severity === 'danger' && {
		'--callout-border-color': color.border.danger.value,
		'--callout-icon-color': color.icon.danger.value,
	}),
}));

const CalloutIcon = styled('div', {
	name: 'Callout',
	slot: 'icon',
})<{ size?: 'sm' | 'lg' }>(({ theme, size }) => ({
	color: 'var(--callout-icon-color)',
	marginTop: '1px',
	...theme.typography[size === 'sm' ? 'bodySm' : 'body'],
}));

const CalloutMessage = styled('div', {
	name: 'Callout',
	slot: 'message',
})<{ size?: 'sm' | 'lg' }>(({ theme, size }) => ({
	...theme.typography[size === 'sm' ? 'bodySm' : 'body'],
}));

/**
 * This component will display text prominently. Callouts sit within the page’s content,
 * and are designed to highlight a particularly important piece of information.
 * They should be already shown when the page or UI is loaded.
 *
 * 📣 <b>If you need to give feedback based on user action, use Alerts instead.</b>
 *
 * This is a Themed Component as documented here: https://mui.com/material-ui/customization/creating-themed-components/.
 * As such, it can be modified in the theme.
 */
export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
	function Callout(inProps, ref) {
		const props = useThemeProps({ props: inProps, name: 'Callout' });
		const {
			severity = 'info',
			variant = 'default',
			icon,
			children,
			size = 'lg',
			...other
		} = props;
		const ownerState = { ...props, severity, variant, size };

		return (
			<CalloutRoot ownerState={ownerState} ref={ref} {...other}>
				<CalloutIcon size={size}>
					{icon ?? <FontAwesomeIcon icon={severityIcons[severity]} />}
				</CalloutIcon>
				<CalloutMessage size={size}>{children}</CalloutMessage>
			</CalloutRoot>
		);
	},
);
