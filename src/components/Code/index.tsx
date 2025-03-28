import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import { forwardRef } from 'react';
import { token } from '../../utils/token';

/**
 * This component will display a text as code.
 */
export const Code = forwardRef<TypographyProps['ref'], TypographyProps>(
	function Code({ children, sx, ...props }, ref) {
		return (
			<Typography
				sx={[
					{
						backgroundColor: token('color.bg.code'),
						color: token('color.text.code'),
						borderRadius: token('shape.borderRadius.sm'),
						px: 1,
						py: '2px',
					},
					// See: https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
					...(Array.isArray(sx) ? sx : [sx]),
				]}
				variant="code"
				component="code"
				{...props}
				ref={ref}
			>
				{children}
			</Typography>
		);
	},
);
