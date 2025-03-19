import type { BoxProps } from '@mui/material';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { token } from '../../utils/token';

export interface SpinnerProps extends Pick<BoxProps, 'sx' | 'children'> {
	show?: boolean;
	label?: string;
	bgVariant?: 'light' | 'dark';
	size?: keyof typeof SIZE_MAPPING;
	zIndex?: number;
	progress?: number;
}

// TODO use design tokens when available
const SIZE_MAPPING = {
	small: '14px',
	medium: '20px', // 20px is the default size of the old rendition Spinner
	large: '24px',
};

export const Spinner = ({
	show = true,
	children,
	label,
	sx,
	bgVariant = 'light',
	size = 'medium',
	zIndex,
	progress,
}: SpinnerProps) => {
	const SpinnerContent = (
		<>
			<CircularProgress
				size={SIZE_MAPPING[size]}
				{...(progress != null && { variant: 'determinate', value: progress })}
			/>
			{label != null && (
				<Typography
					color={bgVariant === 'dark' ? token('color.text.inverse') : 'default'}
				>
					{label}
				</Typography>
			)}
		</>
	);

	if (children == null) {
		return (
			<Box
				sx={[
					{
						display: show ? 'flex' : 'none',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 1,
						height: '100%',
						width: '100%',
					},
					...(Array.isArray(sx) ? sx : [sx]),
				]}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				{SpinnerContent}
			</Box>
		);
	}

	return (
		<Box
			sx={[
				{
					position: 'relative',
					height: '100%',
					width: '100%',
				},
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					...(show &&
						bgVariant === 'light' && {
							opacity: 0.4,
							transition: 'opacity 250ms',
						}),
				}}
			>
				{children}
			</Box>
			<Backdrop
				sx={{
					gap: 1,
					position: 'absolute',
					...(bgVariant === 'light' && { backgroundColor: 'unset' }),
					zIndex,
				}}
				open={show}
			>
				{SpinnerContent}
			</Backdrop>
		</Box>
	);
};
