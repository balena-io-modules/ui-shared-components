import { Box, BoxProps } from '@mui/material';
import { theme } from '../../theme';

/**
 * This component will display a text as code.
 */
export const Code = ({ children, ...props }: BoxProps) => (
	<Box
		sx={{
			background: theme.palette.background.default,
			borderRadius: 1,
		}}
		p={1}
		component="span"
		{...props}
	>
		<code
			style={{
				color: theme.palette.text.primary,
			}}
		>
			{children}
		</code>
	</Box>
);
