import {
	Box,
	ListItem,
	ListItemIcon,
	ListItemProps,
	Typography,
} from '@mui/material';

export interface OrderedListItemProps extends ListItemProps {
	index: number;
}

export const OrderedListItem: React.FC<OrderedListItemProps> = ({
	index,
	children,
	sx,
	...orderedListItemProps
}) => {
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
