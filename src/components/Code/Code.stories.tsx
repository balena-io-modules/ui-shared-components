import type { Meta, StoryObj } from '@storybook/react';
import { Code } from '.';

const meta = {
	title: 'Other/Code',
	component: Code,
	tags: ['autodocs'],
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'const test = "I\'m a string"',
	},
};
