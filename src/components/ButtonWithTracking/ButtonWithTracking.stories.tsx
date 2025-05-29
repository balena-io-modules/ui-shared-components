import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ButtonWithTracking } from '.';

const meta = {
	title: 'Other/Button With Tracking',
	component: ButtonWithTracking,
	tags: ['autodocs'],
} satisfies Meta<typeof ButtonWithTracking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		eventName: 'Instructions Copied',
		eventProperties: { info: 'something' },
		children: 'Button with tracking',
	},
};
