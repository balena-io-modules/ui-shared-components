import {
	Box,
	BoxProps,
	CircularProgress,
	Typography,
	Backdrop,
} from '@mui/material';
import { color } from '@balena/design-tokens';

export interface SpinnerProps extends Pick<BoxProps, 'sx' | 'children'> {
	show?: boolean;
	label?: string;
	bgVariant?: 'light' | 'dark';
	size?: keyof typeof SIZE_MAPPING;
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
					(theme) => ({
						display: show ? 'flex' : 'none',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 1,
						height: '100%',
						width: '100%',
						zIndex: theme.zIndex.modal,
					}),
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
		<Box position="relative" height="100%">
			{children}
			<Backdrop
				sx={[
					{
						gap: 1,
						position: 'absolute',
						backgroundColor:
							bgVariant === 'light' ? color.bg.overlay.light.value : null,
					},
					...(Array.isArray(sx) ? sx : [sx]),
				]}
				open={show}
			>
				{SpinnerContent}
			</Backdrop>
		</Box>
	);
};
