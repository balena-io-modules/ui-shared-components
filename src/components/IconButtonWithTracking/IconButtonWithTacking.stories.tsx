import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconButtonWithTracking } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

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
		children: <FontAwesomeIcon icon={faUserPlus} />,
	},
};
