import { Box, BoxProps, CircularProgress, Typography } from '@mui/material';

// TODO: Consider `Backdrop` for whole page coverage (with dismiss)

export interface SpinnerProps extends Pick<BoxProps, 'sx' | 'children'> {
	show?: boolean;
	label?: string;
}

export const Spinner = ({ show, children, label, sx }: SpinnerProps) => {
	return (
		<Box
			sx={[
				{
					position: 'relative',
					// TODO: the varying height of the CircularProgress messes with scrollbars in components with variable height, i.e. DialogContent
					// Consider if there's a better solution than minHeight
					minHeight: show ? '5rem' : 0,
					...(show === undefined && { height: '100%' }),
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			{children}
			{(show === undefined || show) && (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						backgroundColor: 'rgba(255, 255, 255, 0.4)',
						height: '100%',
						width: '100%',
						...(children != null && {
							position: 'absolute',
							top: 0,
						}),
						'&:hover': { cursor: 'default' },
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<CircularProgress size="2rem" />
					{label != null && <Typography>{label}</Typography>}
				</Box>
			)}
		</Box>
	);
};
