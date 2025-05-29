import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CollapsedList } from '.';

const meta = {
	title: 'Other/Collapsed List',
	component: CollapsedList,
	tags: ['autodocs'],
} satisfies Meta<typeof CollapsedList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		list: [
			{ name: 'item1', logo: null },
			{ name: 'item2', logo: null },
			{ name: 'item3', logo: null },
			{ name: 'item4', logo: null },
			{ name: 'item5', logo: null },
			{ name: 'item6', logo: null },
			{ name: 'item7', logo: null },
			{ name: 'item8', logo: null },
			{ name: 'item9', logo: null },
			{ name: 'item10', logo: null },
			{ name: 'item11', logo: null },
			{ name: 'item12', logo: null },
			{ name: 'item13', logo: null },
			{ name: 'item14', logo: null },
		],
	},
};
