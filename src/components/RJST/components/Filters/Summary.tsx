import React from 'react';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { useTranslation } from '../../../../hooks/useTranslations';
import { FilterDescription } from './FilterDescription';
import { DialogWithCloseButton } from '../../../DialogWithCloseButton';
import type { IChangeEvent } from '../../../Form';
import { RJSForm } from '../../../Form';
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	Typography,
} from '@mui/material';

interface ViewData {
	name: string;
}
interface SummaryProps {
	filters: JSONSchema[];
	onEdit: (filter: JSONSchema) => void;
	onDelete: (filter: JSONSchema) => void;
	onClearFilters: () => void;
	showSaveView?: boolean;
	dark?: boolean;
	onSaveView: (viewData: ViewData) => void;
}

const schema: JSONSchema = {
	type: 'object',
	properties: {
		name: {
			title: 'View name',
			type: 'string',
		},
	},
};

export const Summary = ({
	filters,
	showSaveView,
	dark,
	onClearFilters,
	onSaveView,
	onEdit,
	onDelete,
}: SummaryProps) => {
	const { t } = useTranslation();
	const [showViewForm, setShowViewForm] = React.useState(false);
	const [viewData, setViewData] = React.useState<ViewData | undefined>();

	return (
		<Box display="flex" flexDirection="column" my={2}>
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Box
					display="flex"
					gap={1}
					alignItems="center"
					sx={{ color: dark ? 'white' : 'primary' }}
				>
					<Typography sx={{ fontWeight: 'bold' }}>
						{t('labels.filter_other')}
					</Typography>
					<Typography>({filters.length})</Typography>
					<Button variant="text" onClick={onClearFilters}>
						{t('actions.clear_all')}
					</Button>
				</Box>
				{showSaveView && (
					<Button
						variant="text"
						onClick={() => {
							setShowViewForm(true);
						}}
					>
						{t('actions.save_view')}
					</Button>
				)}
			</Box>
			<Box display="flex" flexWrap="wrap">
				{filters.map((filter, index) => (
					<FilterDescription
						key={filter.$id ?? index}
						filter={filter}
						onClick={() => {
							onEdit(filter);
						}}
						onClose={() => {
							onDelete(filter);
						}}
					/>
				))}
			</Box>
			<DialogWithCloseButton
				fullWidth
				open={showViewForm}
				title={t('labels.save_current_view')}
				onClose={() => {
					setShowViewForm(false);
					setViewData(undefined);
				}}
			>
				<DialogContent>
					<RJSForm
						liveValidate
						hideSubmitButton
						onChange={({ formData }: IChangeEvent) => {
							setViewData(formData);
						}}
						schema={schema}
						formData={viewData}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						aria-label={t('aria_labels.create_view')}
						onClick={() => {
							if (!viewData) {
								return;
							}
							onSaveView?.(viewData);
							setShowViewForm(false);
							setViewData(undefined);
						}}
						disabled={!viewData?.name?.length}
						variant="contained"
					>
						{t('actions.save_view')}
					</Button>
				</DialogActions>
			</DialogWithCloseButton>
		</Box>
	);
};
