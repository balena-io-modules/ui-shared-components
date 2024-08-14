import { Tooltip, Typography, TypographyProps } from '@mui/material';
import React from 'react';

export interface TruncateProps extends TypographyProps {
	lineCamp: number;
	tooltip?: boolean;
}

/**
 * This component will truncate text depending on the settings passed by props.
 */
export const Truncate: React.FC<React.PropsWithChildren<TruncateProps>> = ({
	children,
	lineCamp,
	tooltip,
	...typographyProps
}) => {
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
