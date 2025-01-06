import React from 'react';
import type {
	ActionData,
	RJSTContext,
	RJSTModel,
	RJSTBaseResource,
} from '../schemaOps';
import { rjstJsonSchemaPick } from '../schemaOps';
import { rjstGetDisabledReason } from '../utils';
import { ActionContent, LOADING_DISABLED_REASON } from './ActionContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare';
import type { CheckedState } from '../components/Table/utils';
import { useTranslation } from '../../../hooks/useTranslations';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import type { DropDownButtonProps } from '../../DropDownButton';
import { DropDownButton } from '../../DropDownButton';
import { Spinner } from '../../Spinner';
import { Tooltip } from '../../Tooltip';

interface UpdateProps<T extends RJSTBaseResource<T>> {
	model: RJSTModel<T>;
	rjstContext: RJSTContext<T>;
	selected: T[] | undefined;
	checkedState?: CheckedState;
	hasOngoingAction: boolean;
	onActionTriggered: (data: ActionData<T>) => void;
}

export const Update = <T extends RJSTBaseResource<T>>({
	model,
	rjstContext,
	selected,
	hasOngoingAction,
	onActionTriggered,
	checkedState,
}: UpdateProps<T>) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const isTablet = useMediaQuery(theme.breakpoints.down('md'));
	const { actions } = rjstContext;
	const updateActions = React.useMemo(
		() =>
			actions
				?.filter(
					(action) => action.type === 'update' || action.type === 'delete',
				)
				.sort((a) => (a.type === 'delete' ? 1 : -1))
				.sort((a) => (a.isDangerous ? 1 : a.type === 'delete' ? 0 : -1)),
		[actions],
	);

	const [disabledReasonsByAction, setDisabledReasonsByAction] =
		React.useState<Record<string, string | undefined | null>>();

	const [isInitialized, setIsInitialized] = React.useState(false);

	React.useEffect(() => {
		if (isInitialized || !updateActions) {
			return;
		}
		setDisabledReasonsByAction(
			Object.fromEntries(
				updateActions.map((action) => [action.title, LOADING_DISABLED_REASON]),
			),
		);
		setIsInitialized(true);
	}, [updateActions, isInitialized]);

	const actionHandlers = React.useMemo<
		DropDownButtonProps<{ section?: string }>['items']
	>(() => {
		if (!updateActions || !disabledReasonsByAction) {
			return [];
		}
		return updateActions.map((action) => {
			const disabledActionReason =
				rjstGetDisabledReason(
					selected,
					checkedState,
					hasOngoingAction,
					action.type as 'update' | 'delete',
					t,
				) ?? disabledReasonsByAction[action.title];

			return {
				eventName: `${model.resource} ${action.title}`,
				children: (
					<ActionContent<T>
						action={action}
						getDisabledReason={action.isDisabled}
						affectedEntries={selected}
						checkedState={checkedState}
						onDisabledReady={(result) => {
							setDisabledReasonsByAction((disabledReasonsState) => ({
								...disabledReasonsState,
								[action.title]: result,
							}));
						}}
					>
						<Box
							display="flex"
							justifyContent="space-between"
							gap={2}
							color={
								action.isDangerous && !disabledReasonsByAction[action.title]
									? 'error.main'
									: undefined
							}
						>
							{action.title}
							<Spinner
								show={disabledActionReason === LOADING_DISABLED_REASON}
							/>
						</Box>
					</ActionContent>
				),
				onClick: () => {
					onActionTriggered({
						action,
						schema:
							action.type === 'delete'
								? {}
								: rjstJsonSchemaPick(
										model.schema,
										model.permissions[action.type],
									),
						affectedEntries: selected,
					});
				},
				tooltip:
					typeof disabledActionReason === 'string'
						? {
								title: disabledActionReason,
								placement: isTablet ? 'top' : 'right',
							}
						: undefined,
				disabled: !!disabledActionReason,
				section: action.section,
			};
		});
	}, [
		updateActions,
		disabledReasonsByAction,
		checkedState,
		hasOngoingAction,
		isTablet,
		model.permissions,
		model.resource,
		model.schema,
		onActionTriggered,
		selected,
		t,
	]);

	if (!updateActions || updateActions.length < 1 || !disabledReasonsByAction) {
		return null;
	}

	if (updateActions.length === 1) {
		const action = updateActions[0];
		const disabledUpdateReason =
			rjstGetDisabledReason(
				selected,
				checkedState,
				hasOngoingAction,
				action.type as 'update' | 'delete',
				t,
			) ?? disabledReasonsByAction[action.title];
		return (
			<Box alignSelf="flex-start">
				<Tooltip
					title={
						typeof disabledUpdateReason === 'string'
							? disabledUpdateReason
							: undefined
					}
				>
					<Button
						key={action.title}
						data-action={`${action.type}-${model.resource}`}
						onClick={() => {
							onActionTriggered({
								action,
								schema:
									action.type === 'delete'
										? {}
										: rjstJsonSchemaPick(
												model.schema,
												model.permissions[action.type],
											),
								affectedEntries: selected,
							});
						}}
						disabled={!!disabledUpdateReason}
						color={action.isDangerous ? 'error' : 'secondary'}
					>
						<ActionContent<T>
							action={action}
							getDisabledReason={action.isDisabled}
							affectedEntries={selected}
							checkedState={checkedState}
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
									show={disabledUpdateReason === LOADING_DISABLED_REASON}
								/>
							</Box>
						</ActionContent>
					</Button>
				</Tooltip>
			</Box>
		);
	}

	const disabledReason = rjstGetDisabledReason(
		selected,
		checkedState,
		hasOngoingAction,
		null,
		t,
	);

	return (
		<Tooltip title={disabledReason}>
			<DropDownButton<{ section?: string }>
				items={actionHandlers}
				disabled={!!disabledReason}
				startIcon={<FontAwesomeIcon icon={faPenToSquare} />}
				color="secondary"
				groupByProp="section"
			>
				{t('labels.modify')}
			</DropDownButton>
		</Tooltip>
	);
};
