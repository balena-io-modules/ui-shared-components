import { color } from '@balena/design-tokens';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Fade, Typography, Stack } from '@mui/material';
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
				<Typography color="text.secondary">{stringifyItems}</Typography>
			) : (
				<Stack alignItems="start">
					<Button
						onClick={() => setIsExpanded(!isExpanded)}
						variant="text"
						sx={{ color: color.text.subtle.value, minWidth: 'unset' }}
						endIcon={
							isExpanded ? (
								<FontAwesomeIcon icon={faCaretUp} />
							) : (
								<FontAwesomeIcon icon={faCaretDown} />
							)
						}
						size="small"
					>
						{`${items.length} ${itemsType}`}
					</Button>

					<Fade in={isExpanded} appear={!isExpanded} unmountOnExit>
						<Typography variant="bodySm" color="text.secondary">
							{stringifyItems}
						</Typography>
					</Fade>
				</Stack>
			)}
		</Box>
	);
};
