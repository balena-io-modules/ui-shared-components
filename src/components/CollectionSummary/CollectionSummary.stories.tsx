import type { Meta, StoryObj } from '@storybook/react';
import { CollectionSummary } from '.';

const meta = {
	title: 'Other/Collection summary',
	component: CollectionSummary,
	tags: ['autodocs'],
} satisfies Meta<typeof CollectionSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		itemsType: 'items',
		items: ['item1', 'item2', 'item3', 'item4', 'item5'],
	},
};

export const maxItems: Story = {
	args: {
		itemsType: 'items',
		items: [
			'item1',
			'item2',
			'item3',
			'item4',
			'item5',
			'item6',
			'item7',
			'item8',
			'item9',
			'item10',
			'item11',
			'item12',
			'item13',
			'item14',
			'item15',
		],
		maxVisibleItemCount: 10,
	},
};
