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
		children: (
			<>
				Discover what we&apos;ve been working on recently in our{' '}
				<a>Product Roundup</a>.
			</>
		),
		title: 'balena Cycle Round-Up',
		illustration: <img alt="" src="/images/logo-icon.svg" />,
		onClose: () => {
			console.log('click on close button');
		},
		sx: {
			// force Snackbar relative positioning for the story
			right: 'auto !important',
			position: 'relative',
		},
	},
};
