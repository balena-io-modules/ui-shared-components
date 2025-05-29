import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OrderedListItem } from '.';
import { Typography } from '@mui/material';

const meta = {
	title: 'Typography/Ordered List Item',
	component: OrderedListItem,
	tags: ['autodocs'],
} satisfies Meta<typeof OrderedListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		index: 1,
		children: <Typography variant="body1">Hello world</Typography>,
	},
};
