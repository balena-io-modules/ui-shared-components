import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '.';

const meta = {
	title: 'Mui Components/Data Display/Chip',
	component: Chip,
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Chip',
	},
};
