import type { Meta, StoryObj } from '@storybook/react';
import { HighlightedName } from '.';

const meta = {
	title: 'Other/HighlightedName',
	component: HighlightedName,
	tags: ['autodocs'],
} satisfies Meta<typeof HighlightedName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Example text',
	},
};
