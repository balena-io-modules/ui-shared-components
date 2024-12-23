import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '.';

const meta = {
	title: 'Other/Tag',
	component: Tag,
	tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		name: 'Tag',
		value: 'Value',
	},
};

export const OnlyValue: Story = {
	args: {
		value: 'Value',
	},
};

export const OnlyName: Story = {
	args: {
		value: 'Name',
	},
};

export const Empty: Story = { args: {} };

export const MultipleValues: Story = {
	args: {
		multiple: [
			{ name: 'Tag1', operator: 'contains', value: 'value1' },
			{
				prefix: 'or',
				name: 'Tag2',
				operator: 'contains',
				value: 'value2',
			},
		],
	},
};

export const Overflow: Story = {
	args: {
		multiple: [
			{ name: 'Tag1', operator: 'contains', value: 'value1' },
			{
				prefix: 'or',
				name: 'Tag2',
				operator: 'contains',
				value: 'value2',
			},
			{
				prefix: 'or',
				name: 'Tag3',
				operator: 'contains',
				value: 'value3',
			},
			{
				prefix: 'or',
				name: 'Tag4',
				operator: 'contains',
				value: 'value4',
			},
		],
	},
};
