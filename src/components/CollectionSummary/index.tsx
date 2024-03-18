import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box, Button, Fade, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

export interface CollectionSummaryProps {
	items: string[];
	itemsType: string;
	expanded?: boolean;
	maxVisibleItemCount?: number;
}

export const CollectionSummary = ({
	expanded,
	items,
	itemsType,
	maxVisibleItemCount,
}: CollectionSummaryProps) => {
	const [isExpanded, setIsExpanded] = useState(expanded ?? false);
	const stringifyItems = useMemo(() => {
		if (!items.length) {
			return null;
		}
		if (maxVisibleItemCount && items.length > maxVisibleItemCount) {
			return `${items.slice(0, maxVisibleItemCount).join(', ')}, ...`;
		}
		return items.join(', ');
	}, [items, maxVisibleItemCount]);

	if (!items.length) {
		return null;
	}

	return (
		<Box>
			{items.length === 1 ? (
				<Typography variant="body1" color="text.secondary">
					{stringifyItems}
				</Typography>
			) : (
				<Box>
					<Button
						onClick={() => setIsExpanded(!isExpanded)}
						variant="text"
						color="secondary"
						endIcon={isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
						size="small"
					>
						{`${items.length} ${itemsType}`}
					</Button>

					<Fade in={isExpanded}>
						<Typography variant="body2" color="text.secondary">
							{stringifyItems}
						</Typography>
					</Fade>
				</Box>
			)}
		</Box>
	);
};
