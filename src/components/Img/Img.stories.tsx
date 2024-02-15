import type { Meta, StoryObj } from '@storybook/react';
import { Img } from '.';
// @ts-expect-error
import logo from '../../../public/images/logo.svg';

const meta = {
	title: 'Other/Img',
	component: Img,
	tags: ['autodocs'],
} satisfies Meta<typeof Img>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		src: logo,
	},
};

export const Fallback: Story = {
	args: {
		src: 'foo',
		fallback: logo,
	},
};
