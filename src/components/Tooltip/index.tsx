import type { TooltipProps } from '@mui/material';
import { Tooltip as MuiTooltip } from '@mui/material';

/**
 * This component will replace material one as it does not work by default on disabled elements
 * see: https://mui.com/material-ui/react-tooltip/#disabled-elements
 */
const Tooltip = ({ children, ...tooltipProps }: TooltipProps) => {
	return (
		<MuiTooltip {...tooltipProps}>
			{children.props.disabled ? <span>{children}</span> : children}
		</MuiTooltip>
	);
};

export { Tooltip, type TooltipProps };
