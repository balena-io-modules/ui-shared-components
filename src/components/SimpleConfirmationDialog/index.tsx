import * as React from 'react';
import { useTranslation } from '../../hooks/useTranslations';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { Spinner } from '../Spinner';
import { ButtonWithTracking } from '../ButtonWithTracking';

export interface SimpleConfirmationDialogProps {
	children?: React.ReactNode;
	title: string | JSX.Element;
	cancel?: string;
	action: string;
	onClose: (confirmed: boolean) => MaybePromise<void>;
	danger?: boolean;
}

export const SimpleConfirmationDialog = ({
	title,
	onClose,
	cancel,
	action,
	children,
	danger,
}: SimpleConfirmationDialogProps) => {
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	return (
		<Dialog
			onClose={async () => {
				await onClose(false);
			}}
			open
		>
			<Spinner show={isSubmitting}>
				<DialogTitle>{title ?? t('actions_messages.confirmation')}</DialogTitle>
				<DialogContent>{children}</DialogContent>
				<DialogActions>
					<ButtonWithTracking
						eventName="Confirmation dialog cancel click"
						aria-label={t('aria_labels.execute_action', {
							actionName: cancel ?? t('actions.cancel'),
						})}
						onClick={async () => {
							await onClose(false);
						}}
						variant="outlined"
						color="secondary"
						autoFocus={danger}
					>
						{cancel ?? t('actions.cancel')}
					</ButtonWithTracking>
					<ButtonWithTracking
						eventName={`Confirmation dialog ${action} click`}
						aria-label={t('aria_labels.execute_action', { actionName: action })}
						onClick={async () => {
							try {
								const result = onClose(true);
								if (result != null && result instanceof Promise) {
									setIsSubmitting(true);
								}
								await result;
							} finally {
								setIsSubmitting(false);
							}
						}}
						variant="contained"
						color={danger ? 'error' : 'primary'}
						autoFocus={!danger}
					>
						{action}
					</ButtonWithTracking>
				</DialogActions>
			</Spinner>
		</Dialog>
	);
};
