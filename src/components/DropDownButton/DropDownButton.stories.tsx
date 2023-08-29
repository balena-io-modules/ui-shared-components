import type { Meta, StoryObj } from '@storybook/react';
import { DropDownButton } from '.';

const meta = {
	title: 'Other/DropDownButton',
	component: DropDownButton,
	tags: ['autodocs'],
} satisfies Meta<typeof DropDownButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items: [
			{
				eventName: 'First action name (analytics)',
				eventProperties: {
					prop: 'this is a property I want to track for analytics',
				},
				onClick: () => console.log('first action clicked'),
				children: 'first action button title',
				tooltip: 'This is a tooltip',
			},
			{
				eventName: 'Second action name (analytics)',
				eventProperties: {
					anotherProp: 'this is another property I want to track for analytics',
				},
				onClick: () => console.log('second action clicked'),
				children: <>This can also be a component</>,
				disabled: true,
				tooltip:
					'This is disabled because we want to show you how to disable it',
			},
		],
	},
};
