import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AnimatedText } from '.';

const meta = {
	title: 'Other/Animated Text',
	component: AnimatedText,
	tags: ['autodocs'],
} satisfies Meta<typeof AnimatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		words: ['Lorem', 'Ipsum'],
		animationType: 'fade',
	},
};
