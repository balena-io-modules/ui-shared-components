import type { Meta, StoryObj } from '@storybook/react';
import { Announcement } from '.';

const meta = {
	title: 'Components/Navigation/Announcement',
	component: Announcement,
	tags: ['autodocs'],
} satisfies Meta<typeof Announcement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		open: true,
		campaignId: 'storybook-test',
		children: <>Discover everything we’ve done these past two months!</>,
		title: 'balena Cycle Round-Up',
		linkLabel: "Check out this cycle's roundup!",
		linkHref: 'https://blog.balena.io',
		illustration: <img alt="" src="/images/logo-icon.svg" />,
		onClose: () => {
			console.log('click on close button');
		},
		sx: {
			position: 'relative',
		},
	},
};
