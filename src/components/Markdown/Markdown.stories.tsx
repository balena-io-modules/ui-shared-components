import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from '.';

const meta = {
	title: 'Other/Markdown',
	component: Markdown,
	tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const markdown = `
# Title

## SubTitle

### List:

- item 1
- item 2
- item 3
`;

export const Default: Story = {
	args: {
		children: markdown,
	},
};
