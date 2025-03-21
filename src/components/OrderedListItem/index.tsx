import type { ListItemProps } from '@mui/material';
import { Box, ListItem, ListItemIcon, Typography } from '@mui/material';

export interface OrderedListItemProps extends ListItemProps {
	index: number;
}

export const OrderedListItem = ({
	index,
	children,
	sx,
	...orderedListItemProps
}: OrderedListItemProps) => {
	return (
		<ListItem sx={{ pl: 0, ...sx }} {...orderedListItemProps}>
			<ListItemIcon>
				<Box
					sx={{
						borderRadius: '50%',
						backgroundColor: 'b-bg-accent-strong',
						width: '1.5em',
						height: '1.5em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant="bodySm" color="b-text-inverse">
						{index}
					</Typography>
				</Box>
			</ListItemIcon>
			{children}
		</ListItem>
	);
};
