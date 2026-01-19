import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Autocomplete, TextField, Box } from '@mui/material';

const meta = {
	title: 'Mui Components/Input/Autocomplete',
	component: Autocomplete,
	tags: ['autodocs'],
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const GROUPED_OPTIONS = [
	{ group: 'Group 1', title: 'Option 1' },
	{ group: 'Group 1', title: 'Option 2' },
	{ group: 'Group 2', title: 'Option 3' },
	{ group: 'Group 2', title: 'Option 4' },
	{ group: 'Group 2', title: 'Option 5' },
	{ group: 'Group 3', title: 'Option 6' },
	{ group: 'Group 4', title: 'Option 7' },
	{ group: 'Group 4', title: 'Option 8' },
];

export const Basic: Story = {
	args: {
		options: GROUPED_OPTIONS,
		renderInput: ({ ...params }) => <TextField {...params} />,
		renderOption: (props, option) => (
			<Box component="li" {...props}>
				{(option as (typeof GROUPED_OPTIONS)[number]).title}
			</Box>
		),
	},
};

export const Grouped: Story = {
	args: {
		options: GROUPED_OPTIONS,
		groupBy: (option) => (option as (typeof GROUPED_OPTIONS)[number]).group,
		renderInput: ({ ...params }) => <TextField {...params} />,
		renderOption: (props, option) => (
			<Box component="li" {...props}>
				{(option as (typeof GROUPED_OPTIONS)[number]).title}
			</Box>
		),
	},
};
