import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Truncate } from '.';
import { Typography } from '@mui/material';

const meta = {
	title: 'Other/Truncate',
	component: Truncate,
	tags: ['autodocs'],
} satisfies Meta<typeof Truncate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		lineCamp: 2,
		children: (
			<Typography variant="body1">
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry's standard dummy text ever
				since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
				centuries, but also the leap into electronic typesetting, remaining
				essentially unchanged. It was popularised in the 1960s with the release
				of Letraset sheets containing Lorem Ipsum passages, and more recently
				with desktop publishing software like Aldus PageMaker including versions
				of Lorem Ipsum.
			</Typography>
		),
	},
};
