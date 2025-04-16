import { Stack, styled, Tooltip, Typography } from '@mui/material';
import { token } from '../../utils/token';
import { useTranslation } from '../../hooks/useTranslations';
import { useMemo } from 'react';

export interface HorizontalBarChartProps {
	items: Array<{ color: string; title: string; count: number }>;
	resourceLabel?: string;
	resourceLabelPlural?: string;
}

const Bar = styled('div')({
	width: '100%',
	height: 24,
	display: 'flex',
	borderRadius: token('shape.borderRadius.sm'),
	overflow: 'hidden',
	gap: 2,
});

const BarItem = styled('span')({
	minWidth: 3,
});

const Legend = styled('ul')({
	display: 'inline',
	listStyle: 'none',
	padding: 0,
	margin: 0,
});

const LegendItem = styled('li')({
	display: 'inline-flex',
	marginRight: token('spacing.2'),
	alignItems: 'center',
	'&:before': {
		content: '""',
		backgroundColor: 'currentColor',
		borderRadius: '50%',
		width: '10px',
		height: '10px',
		display: 'inline-block',
		marginRight: token('spacing.1'),
	},
});

export const HorizontalBarChart = ({
	items,
	resourceLabel,
	resourceLabelPlural,
}: HorizontalBarChartProps) => {
	const { t } = useTranslation();
	const totalItems = useMemo(
		() => items.reduce((sum, item) => sum + item.count, 0),
		[items],
	);
	const filteredItems = useMemo(
		() => items.filter((item) => item.count > 0),
		[items],
	);
	const getTotalResourcesLabel = (count: number) => {
		if (resourceLabel && resourceLabelPlural) {
			return t('labels.total_resources', {
				count,
				resource: count > 1 ? resourceLabelPlural : resourceLabel,
			});
		} else {
			return count;
		}
	};

	return (
		<Stack sx={{ gap: token('spacing.2') }}>
			<Bar>
				{filteredItems.map((item) => (
					<Tooltip
						key={item.title}
						title={`${item.title}: ${getTotalResourcesLabel(item.count)}`}
					>
						<BarItem
							sx={{
								backgroundColor: item.color,
								width: `${Math.floor((item.count / totalItems) * 100)}%`,
							}}
						/>
					</Tooltip>
				))}
			</Bar>

			<Legend>
				{filteredItems.map((item) => (
					<Tooltip key={item.title} title={getTotalResourcesLabel(item.count)}>
						<LegendItem style={{ color: item.color }}>
							<Typography variant="bodySm" color={token('color.text.subtle')}>
								{item.title}
							</Typography>
						</LegendItem>
					</Tooltip>
				))}
			</Legend>
		</Stack>
	);
};
