import type {
	ActionData,
	RJSTBaseResource,
	RJSTContext,
	RJSTModel,
} from './schemaOps';
import { Create } from './Actions/Create';
import type { NoDataInfo } from '.';
import { useTranslation } from '../../hooks/useTranslations';
import { Container, Typography } from '@mui/material';
import { Callout } from '../Callout';
import { MUILinkWithTracking } from '../MUILinkWithTracking';

export interface NoRecordsFoundViewProps<T> {
	model: RJSTModel<T>;
	rjstContext: RJSTContext<T>;
	onActionTriggered: (data: ActionData<T>) => void;
	noDataInfo?: NoDataInfo;
}

export const NoRecordsFoundView = <T extends RJSTBaseResource<T>>({
	model,
	rjstContext,
	onActionTriggered,
	noDataInfo,
}: NoRecordsFoundViewProps<T>) => {
	const { t } = useTranslation();
	return (
		<Container
			maxWidth="sm"
			sx={{
				textAlign: 'center',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				my: 'auto',
				gap: 3,
			}}
		>
			<Typography variant="titleLg" fontWeight="bold">
				{noDataInfo?.title ??
					t('no_data.no_resource_data_title', {
						resource: t(`resource.${model.resource}_other`).toLowerCase(),
					})}
			</Typography>
			{noDataInfo?.subtitle && (
				<Typography variant="title">{noDataInfo?.subtitle}</Typography>
			)}
			{noDataInfo?.info && (
				<Callout severity="info" variant="subtle" sx={{ my: 3 }}>
					{noDataInfo.info}
				</Callout>
			)}
			<Typography variant="title">
				{noDataInfo?.description ?? t('no_data.no_resource_data_description')}
			</Typography>
			<Create
				model={model}
				rjstContext={rjstContext}
				hasOngoingAction={false}
				onActionTriggered={onActionTriggered}
			/>
			{noDataInfo?.docsLink && (
				<MUILinkWithTracking href={noDataInfo.docsLink}>
					{noDataInfo.docsLabel ?? noDataInfo.docsLink}
				</MUILinkWithTracking>
			)}
		</Container>
	);
};
