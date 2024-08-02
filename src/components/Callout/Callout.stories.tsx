import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from '.';

const meta = {
	title: 'Components/Typography/Callout',
	component: Callout,
	tags: ['autodocs'],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<>
				Hello, I am a Callout. Use me to highlight an important piece of
				information. I should sit within the page’s content, contrary to an
				Alert.
			</>
		),
	},
};

export const Info: Story = {
	args: {
		...Default.args,
		severity: 'info',
	},
};

export const Success: Story = {
	args: {
		...Default.args,
		severity: 'success',
	},
};

export const Warning: Story = {
	args: {
		...Default.args,
		severity: 'warning',
	},
};

export const Danger: Story = {
	args: {
		...Default.args,
		severity: 'danger',
	},
};

export const VariantSubtle: Story = {
	args: {
		...Default.args,
		variant: 'subtle',
	},
};
