import { Dialog, DialogProps, IconButton, DialogTitle } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';

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
						alignItems: 'center',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					variant="inherit"
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
							<FontAwesomeIcon icon={faClose} />
						</IconButton>
					) : null}
				</DialogTitle>
			)}
			{children}
		</Dialog>
	);
};
