import type { TypographyProps } from '@mui/material';
import { Tooltip, Typography } from '@mui/material';

export interface TruncateProps extends TypographyProps {
	lineCamp: number;
	tooltip?: boolean;
}

/**
 * This component will truncate text depending on the settings passed by props.
 */
export const Truncate = ({
	children,
	lineCamp,
	tooltip,
	...typographyProps
}: React.PropsWithChildren<TruncateProps>) => {
	return (
		<Tooltip
			title={tooltip && typeof children === 'string' ? children : undefined}
		>
			<Typography
				component="span"
				{...typographyProps}
				sx={{
					lineHeight: '2rem',
					display: '-webkit-box',
					overflow: 'hidden !important',
					textOverflow: 'ellipsis',
					WebkitLineClamp: lineCamp,
					WebkitBoxOrient: 'vertical',
				}}
			>
				{children}
			</Typography>
		</Tooltip>
	);
};
