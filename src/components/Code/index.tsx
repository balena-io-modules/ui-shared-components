import { Box, BoxProps } from '@mui/material';
import { theme } from '../../theme';

/**
 * This component will display a text as code.
 */
export const Code = ({ children, ...props }: BoxProps) => (
	<Box
		sx={{
			background: theme.palette.customGrey.xlight,
			borderRadius: 1,
		}}
		p={1}
		component="span"
		{...props}
	>
		<code
			style={{
				color: theme.palette.customGrey.dark || '#000',
			}}
		>
			{children}
		</code>
	</Box>
);
