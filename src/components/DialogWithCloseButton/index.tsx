import { Dialog, DialogProps, IconButton, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export type DialogWithCloseButtonProps = Omit<DialogProps, 'title'> & {
	title: DialogProps['title'] | JSX.Element;
};

export const DialogWithCloseButton = ({
	children,
	onClose,
	title,
	...other
}: DialogWithCloseButtonProps) => {
	return (
		<Dialog onClose={onClose} {...other}>
			{title != null && (
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{title}
					{onClose ? (
						<IconButton
							aria-label="close"
							onClick={(e) => {
								onClose(e, 'backdropClick');
							}}
							sx={{
								color: (theme) => theme.palette.grey[500],
							}}
						>
							<CloseIcon />
						</IconButton>
					) : null}
				</DialogTitle>
			)}
			{children}
		</Dialog>
	);
};
