import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Collapsible } from '.';
import { Stack } from '@mui/material';

const meta = {
	title: 'Other/Collapsible',
	component: Collapsible,
	tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		summary: "Bulbasaur's moves",
		details: (
			<Stack gap={1}>
				<div>Tackle</div>
				<div>Growl</div>
				<div>Vine Whip</div>
				<div>Razor Leaf</div>
			</Stack>
		),
	},
};
