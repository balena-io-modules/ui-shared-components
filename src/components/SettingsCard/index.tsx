import React from 'react';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Stack,
	Typography,
} from '@mui/material';
import { color } from '@balena/design-tokens';

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
							color: color.text.danger.value,
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
						color: color.text.danger.value,
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
				borderBottom: `dashed ${color.border.subtle.value} 1px`,
				pb: 3,
			},
		}}
	>
		<Stack gap={2} maxWidth={[undefined, undefined, '70%']}>
			<Typography className={settingsCardItemTitleClass} variant="bodyLg">
				{title}
			</Typography>
			<Typography color="text.secondary">{description}</Typography>
		</Stack>
		<Box>{action}</Box>
	</Stack>
);
