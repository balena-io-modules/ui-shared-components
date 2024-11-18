import type { DialogProps } from '@mui/material';
import { Dialog, IconButton, DialogTitle } from '@mui/material';
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
						alignItems: 'start',
					}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					{title}
					{onClose ? (
						<IconButton
							edge="end"
							aria-label="close"
							onClick={(e) => {
								onClose(e, 'backdropClick');
							}}
							sx={{ ml: 'auto' }}
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
