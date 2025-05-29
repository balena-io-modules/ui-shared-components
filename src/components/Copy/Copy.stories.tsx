import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Copy } from '.';

const meta = {
	title: 'Other/Copy',
	component: Copy,
	tags: ['autodocs'],
} satisfies Meta<typeof Copy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		copy: 'This string has been copied',
	},
};

export const WithChildren: Story = {
	args: {
		copy: 'Clicking the copy icon will copy this string to your clipboard',
		children: 'Clicking the copy icon will copy this string to your clipboard',
	},
};

export const Absolute: Story = {
	args: {
		copy: 'Clicking the copy icon will copy this string to your clipboard',
		children: 'Clicking the copy icon will copy this string to your clipboard',
		variant: 'absolute',
	},
};
