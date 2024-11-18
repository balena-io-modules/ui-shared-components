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
						backgroundColor: 'info.main',
						width: '1.5em',
						height: '1.5em',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant="body2" color="white">
						{index}
					</Typography>
				</Box>
			</ListItemIcon>
			{children}
		</ListItem>
	);
};
