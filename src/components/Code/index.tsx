import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import { color } from '@balena/design-tokens';
import { forwardRef } from 'react';

/**
 * This component will display a text as code.
 */
export const Code = forwardRef<TypographyProps['ref'], TypographyProps>(
	function Code({ children, sx, ...props }, ref) {
		return (
			<Typography
				sx={[
					{
						background: color.bg.code.value,
						color: color.text.code.value,
						borderRadius: 1,
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
