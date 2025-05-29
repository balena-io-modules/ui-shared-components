import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Tabs } from '.';
import { Box } from '@mui/material';

const meta = {
	title: 'Other/Tabs',
	component: Tabs,
	tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tabs: [
			{ label: 'one', render: <Box>Rendering the first tab</Box> },
			{ label: 'two', render: <Box>Rendering the second tab</Box> },
			{ label: 'three', render: <Box>Rendering the third tab</Box> },
			{
				label: 'disabled',
				render: <Box>Not rendering the fourth tab (disabled)</Box>,
				tabProps: { disabled: true },
			},
		],
	},
};
