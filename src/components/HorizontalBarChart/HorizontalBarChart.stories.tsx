import type { Meta, StoryObj } from '@storybook/react';
import { HorizontalBarChart } from '.';

const meta = {
	title: 'Components/Charts/Horizontal Bar Chart',
	component: HorizontalBarChart,
	tags: ['autodocs'],
} satisfies Meta<typeof HorizontalBarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{
				color: 'var(--mui-tokens-color-status-warning-value)',
				count: 100,
				title: 'Reduced functionality',
			},
			{
				color: 'var(--mui-tokens-color-status-teal-value)',
				count: 20,
				title: 'Configuring',
			},
			{
				color: 'var(--mui-tokens-color-status-danger-value)',
				count: 100,
				title: 'Disconnected',
			},
			{
				color: 'var(--mui-tokens-color-status-purple-value)',
				count: 20,
				title: 'Post provisioning',
			},
			{
				color: 'var(--mui-tokens-color-status-inactive-value)',
				count: 20,
				title: 'Inactive',
			},
		],
		resourceLabel: 'device',
		resourceLabelPlural: 'devices',
	},
};
