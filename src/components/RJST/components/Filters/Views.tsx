import React from 'react';
import { faChartPie } from '@fortawesome/free-solid-svg-icons/faChartPie';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { useTranslation } from '../../../../hooks/useTranslations';
import type { SxProps } from '@mui/material';
import {
	Box,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { color } from '@balena/design-tokens';
import type { DropDownButtonProps } from '../../../DropDownButton';
import { DropDownButton } from '../../../DropDownButton';
import { stopEvent } from '../../../../utils/eventHandling';
import { Tooltip } from '../../../Tooltip';

interface FiltersView {
	id: string;
	eventName: string;
	name: string;
	filters: JSONSchema[];
}

export interface ViewsProps {
	views: FiltersView[] | undefined;
	setFilters: (filters: JSONSchema[]) => void;
	deleteView: (
		view: FiltersView,

		event?: React.MouseEvent<HTMLElement>,
	) => void;
	dark?: boolean;
}

// TODO remove when we have implemented a dark theme
const darkStyles: SxProps = {
	// Using !important to override disabled styles on the primary variant
	backgroundColor: 'white !important',
	border: 'none !important',
	color: `${color.text.value} !important`,
};

export const Views = ({ views, setFilters, deleteView, dark }: ViewsProps) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up('sm'));

	const memoizedViews = React.useMemo<
		DropDownButtonProps<FiltersView>['items'] | null
	>(() => {
		return (
			views?.map((view) => {
				return {
					...view,
					eventName: `Open saved view`,
					children: (
						<Box
							display="flex"
							alignItems="center"
							justifyContent="space-between"
							minWidth="200px"
						>
							<Box display="flex" flexDirection="column">
								<Typography>{view.name}</Typography>
								<Typography color="grey">
									{view.filters.length}{' '}
									{view.filters.length === 1
										? t('labels.filter_one').toLowerCase()
										: t('labels.filter_other').toLowerCase()}
								</Typography>
							</Box>
							<IconButton
								aria-label={t('aria_labels.remove_view')}
								onClick={(event: React.MouseEvent<HTMLElement> | undefined) => {
									if (event) {
										stopEvent(event);
									}
									deleteView(view, event);
								}}
							>
								<FontAwesomeIcon icon={faTrash} />
							</IconButton>
						</Box>
					),
					onClick: () => {
						const filters = view.filters;
						setFilters(filters);
					},
				};
			}) ?? null
		);
	}, [views, deleteView, setFilters, t]);

	return (
		<Tooltip
			title={!memoizedViews?.length ? t('labels.info_no_views') : undefined}
		>
			<DropDownButton<FiltersView>
				disabled={!memoizedViews?.length}
				items={memoizedViews ?? []}
				variant={!memoizedViews?.length && dark ? 'contained' : 'outlined'}
				color={!memoizedViews?.length && dark ? 'primary' : 'secondary'}
				startIcon={matches ? <FontAwesomeIcon icon={faChartPie} /> : null}
				sx={{ ...(dark && darkStyles) }}
			>
				{matches ? t('labels.views') : <FontAwesomeIcon icon={faChartPie} />}
			</DropDownButton>
		</Tooltip>
	);
};
