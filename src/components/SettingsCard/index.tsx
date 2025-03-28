import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Typography,
} from '@mui/material';
import { token } from '../../utils/token';

export interface SettingsCardProps {
	title?: string | React.ReactNode;
	children: React.ReactNode;
	danger?: boolean;
}

export interface SettingsCardItemProps {
	title: string | React.ReactNode;
	description?: string | React.ReactNode;
	// TODO make it required once username and social accounts can be updated in the UI
	action?: React.ReactNode;
}

const settingsCardItemTitleClass = 'settings-card-item-title';

export const SettingsCard = ({
	title,
	children,
	danger,
}: SettingsCardProps) => (
	<Card>
		{title && (
			<CardHeader
				title={title}
				{...(danger && {
					sx: {
						'.MuiCardHeader-title': {
							color: token('color.text.danger'),
						},
					},
				})}
			/>
		)}
		{/* TODO find out why there's a paddingBottom: 24px on CardContent :last-child */}
		<CardContent
			sx={{
				'&:last-child': { pb: 0 },
				gap: 3,
				display: 'flex',
				flexDirection: 'column',
				...(danger && {
					[`.${settingsCardItemTitleClass}`]: {
						color: token('color.text.danger'),
					},
				}),
			}}
		>
			{children}
		</CardContent>
	</Card>
);

export const SettingsCardItem = ({
	title,
	description,
	action,
}: SettingsCardItemProps) => (
	<Stack
		gap={2}
		direction={['column', 'column', 'row']}
		justifyContent="space-between"
		alignItems={['start', 'start', 'center']}
		sx={{
			'&:not(&:last-child)': {
				borderBottom: `dashed ${token('color.border.subtle')} 1px`,
				pb: 3,
			},
		}}
	>
		<Stack gap={2} maxWidth={[undefined, undefined, '70%']}>
			<Typography className={settingsCardItemTitleClass} variant="bodyLg">
				{title}
			</Typography>
			<Typography color={token('color.text.subtle')}>{description}</Typography>
		</Stack>
		<Box>{action}</Box>
	</Stack>
);
