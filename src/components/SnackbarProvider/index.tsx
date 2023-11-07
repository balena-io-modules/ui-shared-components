import * as React from 'react';
import { Alert } from '@mui/material';
import {
	closeSnackbar,
	CustomContentProps,
	SnackbarProviderProps,
	SnackbarProvider,
} from 'notistack';

const Toast = React.forwardRef(
	({ message, id, variant }: CustomContentProps, ref) => {
		return (
			<Alert
				ref={ref as React.ForwardedRef<HTMLDivElement>}
				onClose={() => closeSnackbar(id)}
				severity={variant === 'default' ? 'success' : variant}
				sx={{ alignItems: 'center' }}
			>
				{message}
			</Alert>
		);
	},
);

export const SnackbarProviderBase = (props: SnackbarProviderProps) => (
	<SnackbarProvider
		Components={{
			default: Toast,
			info: Toast,
			warning: Toast,
			error: Toast,
			success: Toast,
		}}
		anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
		{...props}
	/>
);
