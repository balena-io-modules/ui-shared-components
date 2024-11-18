import type { Meta, StoryObj } from '@storybook/react';
import type { DialogWithCloseButtonProps } from '.';
import { DialogWithCloseButton } from '.';
import { useState } from 'react';
import { Button, DialogContent } from '@mui/material';

const Template = (
	args: Omit<DialogWithCloseButtonProps, 'open' | 'onClose'>,
) => {
	const [show, setShow] = useState(false);
	return (
		<>
			<Button
				onClick={() => {
					setShow(true);
				}}
			>
				Open modal
			</Button>
			<DialogWithCloseButton
				open={show}
				onClose={() => {
					setShow(false);
				}}
				{...args}
			/>
		</>
	);
};

const meta = {
	title: 'Other/DialogWithCloseButton',
	component: Template,
	tags: ['autodocs'],
} satisfies Meta<typeof DialogWithCloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'This is a dialog with a close button',
		children: <DialogContent>Hello world!</DialogContent>,
	},
};
