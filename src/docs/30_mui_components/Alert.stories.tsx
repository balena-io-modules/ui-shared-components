import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle } from '@mui/material';

const meta = {
	title: 'Mui Components/Feedback/Alert',
	component: Alert,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	args: {
		children: (
			<>
				We no longer maintain versions of balenaOS for this device type.{' '}
				<a href="#">Learn more</a>.
			</>
		),
	},
};

export const Success: Story = {
	args: {
		...Info.args,
		severity: 'success',
	},
};

export const Warning: Story = {
	args: {
		...Info.args,
		severity: 'warning',
	},
};

export const Danger: Story = {
	args: {
		...Info.args,
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
		...Info.args,
		onClose() {
			console.log('Close alert');
		},
	},
};
