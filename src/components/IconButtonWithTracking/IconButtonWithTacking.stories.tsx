import type { Meta, StoryObj } from '@storybook/react';
import { IconButtonWithTracking } from '.';
import { PersonAddOutlined } from '@mui/icons-material';

const meta = {
	title: 'Other/IconButton With Tracking',
	component: IconButtonWithTracking,
	tags: ['autodocs'],
} satisfies Meta<typeof IconButtonWithTracking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		eventName: 'Member added',
		eventProperties: { info: 'more action info' },
		children: <PersonAddOutlined />,
	},
};
