import {
	Box,
	BoxProps,
	CircularProgress,
	Typography,
	Backdrop,
	SxProps,
} from '@mui/material';
import { color } from '@balena/design-tokens';

export interface SpinnerProps extends Pick<BoxProps, 'sx' | 'children'> {
	show?: boolean;
	label?: string;
	bgVariant?: 'light' | 'dark';
	size?: keyof typeof SIZE_MAPPING;
	zIndex?: number;
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
}: SpinnerProps) => {
	const SpinnerContent = (
		<>
			<CircularProgress size={SIZE_MAPPING[size]} />
			{label != null && (
				<Typography
					color={bgVariant === 'dark' ? color.text.inverse.value : 'default'}
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
