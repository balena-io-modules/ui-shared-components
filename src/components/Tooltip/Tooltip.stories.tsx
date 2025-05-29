import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Box, Button, Typography } from '@mui/material';
import { Tooltip } from '.';

const meta = {
	title: 'Mui Components/Feedback/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'This is a tooltip that adds information for the user.',
		children: <Button variant="contained">button with tooltip</Button>,
	},
};

export const Disabled: Story = {
	args: {
		title: 'This button is disabled but tooltip should be shown correctly',
		children: (
			<Button variant="contained" disabled>
				disabled button with tooltip
			</Button>
		),
	},
};

export const BoxElement: Story = {
	args: {
		title: 'This Box represent a Box with info',
		children: (
			<Box>
				<Typography>This is a box containing multiple paragraphs</Typography>
				<Typography>And we want to show a tooltip.</Typography>
				<Typography>
					This tooltip will explain what the box component is for
				</Typography>
			</Box>
		),
	},
};
