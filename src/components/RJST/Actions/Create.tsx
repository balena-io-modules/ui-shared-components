import React from 'react';
import type {
	ActionData,
	RJSTContext,
	RJSTModel,
	RJSTBaseResource,
} from '../schemaOps';
import { rjstJsonSchemaPick } from '../schemaOps';
import { getCreateDisabledReason } from '../utils';
import { ActionContent, LOADING_DISABLED_REASON } from './ActionContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/free-solid-svg-icons/faMagic';
import { Box, Button } from '@mui/material';
import { Spinner } from '../../Spinner';
import { useTranslation } from '../../../hooks/useTranslations';
import { Tooltip } from '../../Tooltip';

interface CreateProps<T extends RJSTBaseResource<T>> {
	model: RJSTModel<T>;
	rjstContext: RJSTContext<T>;
	hasOngoingAction: boolean;
	onActionTriggered: (data: ActionData<T>) => void;
}

export const Create = <T extends RJSTBaseResource<T>>({
	model,
	rjstContext,
	hasOngoingAction,
	onActionTriggered,
}: CreateProps<T>) => {
	const { t } = useTranslation();
	const { actions } = rjstContext;
	const createActions = actions?.filter((a) => a.type === 'create');
	const [disabledReasonsByAction, setDisabledReasonsByAction] =
		React.useState<Record<string, string | undefined | null>>();
	const [isInitialized, setIsInitialized] = React.useState(false);

	React.useEffect(() => {
		if (!isInitialized && createActions) {
			setDisabledReasonsByAction(
				Object.fromEntries(
					createActions.map((a) => [a.title, LOADING_DISABLED_REASON]),
				),
			);
			setIsInitialized(true);
		}
	}, [createActions, isInitialized]);

	if (!createActions || createActions.length < 1 || !disabledReasonsByAction) {
		return null;
	}

	if (createActions.length > 1) {
		throw new Error('Only one create action per resource is allowed');
	}

	const [action] = createActions;

	const disabledReason =
		getCreateDisabledReason(model.permissions, hasOngoingAction, t) ??
		disabledReasonsByAction[action.title];
	return (
		<Box display="flex">
			<Tooltip
				title={typeof disabledReason === 'string' ? disabledReason : undefined}
			>
				<Button
					data-action={`create-${model.resource}`}
					variant="contained"
					onClick={() => {
						onActionTriggered({
							action,
							schema: rjstJsonSchemaPick(
								model.schema,
								model.permissions.create,
							),
						});
					}}
					startIcon={<FontAwesomeIcon icon={faMagic} />}
					disabled={!!disabledReason}
				>
					<ActionContent<T>
						action={action}
						getDisabledReason={action.isDisabled}
						affectedEntries={undefined}
						checkedState={undefined}
						onDisabledReady={(result) => {
							setDisabledReasonsByAction((disabledReasonsState) => ({
								...disabledReasonsState,
								[action.title]: result,
							}));
						}}
					>
						<Box display="flex" justifyContent="space-between">
							{action.title}
							<Spinner
								sx={{ ml: 2 }}
								show={disabledReason === LOADING_DISABLED_REASON}
							/>
						</Box>
					</ActionContent>
				</Button>
			</Tooltip>
		</Box>
	);
};
