import type { Meta, StoryObj } from '@storybook/react';
import { CustomHelmet } from '.';
import { Typography } from '@mui/material';

const meta = {
	title: 'Other/CustomHelmet',
	component: CustomHelmet,
	tags: ['autodocs'],
} satisfies Meta<typeof CustomHelmet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<>
			<Typography variant="body1">
				This component will only set meta tags, will not display anything. Check
				the code!
			</Typography>
			<CustomHelmet {...args} />
		</>
	),
	args: {
		title: 'Balena UI shared components',
		description: 'library to share UI components',
		properties: {
			'og:title': 'Example og title',
			'og:description': 'Example og description',
		},
	},
};
