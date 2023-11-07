import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle } from '@mui/material';

const meta = {
	title: 'Mui/Feedback/Alert',
	component: Alert,
	tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<>
				We no longer maintain versions of balenaOS for this device type. For
				more information <a href="#">click here</a>.
			</>
		),
	},
};

export const Info: Story = {
	args: {
		...Default.args,
		severity: 'info',
	},
};

export const Success: Story = {
	args: {
		...Default.args,
		severity: 'success',
	},
};

export const Warning: Story = {
	args: {
		...Default.args,
		severity: 'warning',
	},
};

export const Danger: Story = {
	args: {
		...Default.args,
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
		severity: 'info',
	},
};

export const WithCloseIcon: Story = {
	args: {
		...Default.args,
		onClose() {
			console.log('Close alert');
		},
	},
};
