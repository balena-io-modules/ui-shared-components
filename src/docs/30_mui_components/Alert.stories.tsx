import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle } from '@mui/material';

const meta = {
	title: 'Mui Components/Feedback/Alert',
	component: Alert,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
	args: {
		children: (
			<>
				We no longer maintain versions of balenaOS for this device type.{' '}
				<a href="#">Learn more</a>.
			</>
		),
	},
};

export const Info: Story = {
	args: {
		...Neutral.args,
		severity: 'info',
	},
};

export const Success: Story = {
	args: {
		...Neutral.args,
		severity: 'success',
	},
};

export const Warning: Story = {
	args: {
		...Neutral.args,
		severity: 'warning',
	},
};

export const Danger: Story = {
	args: {
		...Neutral.args,
		severity: 'error',
	},
};

export const WithTitle: Story = {
	args: {
		children: (
			<>
				<AlertTitle>Info</AlertTitle>
				This is an info alert with title.
			</>
		),
	},
};

export const WithCloseIcon: Story = {
	args: {
		...Neutral.args,
		onClose() {
			console.log('Close alert');
		},
	},
};

export const CalloutNeutral: Story = {
	args: {
		...Neutral.args,
		variant: 'callout',
	},
};

export const CalloutInfo: Story = {
	args: {
		...Info.args,
		variant: 'callout',
	},
};

export const CalloutSuccess: Story = {
	args: {
		...Success.args,
		variant: 'callout',
	},
};

export const CalloutWarning: Story = {
	args: {
		...Warning.args,
		variant: 'callout',
	},
};

export const CalloutError: Story = {
	args: {
		...Danger.args,
		variant: 'callout',
	},
};
