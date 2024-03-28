import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '.';
import { Box, Button } from '@mui/material';

const meta = {
	title: 'Other/Spinner',
	component: Spinner,
	tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		show: true,
	},
};

export const WithLabel: Story = {
	args: {
		show: true,
		label: 'Loading...',
	},
};

export const WithChildren: Story = {
	args: {
		label: 'Loading...',
		show: true,
		children: (
			<Box>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</Box>
		),
	},
};

export const AlongsideContent: Story = {
	render: () => (
		<Box display="flex">
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
			tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
			veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
			velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
			cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
			est laborum.
			<Spinner />
		</Box>
	),
};

export const withDarkBackground: Story = {
	args: {
		...WithChildren.args,
		bgVariant: 'dark',
	},
};
