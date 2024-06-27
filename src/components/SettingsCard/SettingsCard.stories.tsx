import { Button, Chip, Link, Stack, Switch, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsCard, SettingsCardItem } from '.';
import { Code } from '../Code';

const meta = {
	title: 'Patterns/Settings Card',
	component: SettingsCard,
	tags: ['autodocs'],
} satisfies Meta<typeof SettingsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Account Settings',
		children: (
			<>
				<SettingsCardItem
					title="Username"
					description={
						<Stack gap={2}>
							<Code sx={{ width: 'fit-content' }}>johndoe113</Code>
							<Typography component="p">
								Your username is auto-generated. Currently it's impossible to
								change it, but we are working on making it editable.
							</Typography>
						</Stack>
					}
				/>
				<SettingsCardItem
					title="Email"
					description="johndoe113@balena.io"
					action={<Button>Change email</Button>}
				/>
				<SettingsCardItem
					title="Password"
					action={<Button>Change password</Button>}
				/>
				<SettingsCardItem
					title={
						<Stack direction="row" alignItems="center" gap={1}>
							2FA <Chip color="green" label="Enabled" />
						</Stack>
					}
					description="Two-factor authentication protects you if your password is guessed or stolen, by requiring you to enter a token generated on your mobile phone to log in, in addition to your username & password. Learn more."
					action={
						<Stack gap={1} alignItems={['start', 'start', 'end']}>
							<Switch defaultChecked edge="end" />
							<Link>Regenerate recovery codes</Link>
						</Stack>
					}
				/>
			</>
		),
	},
};
