import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { SimpleConfirmationDialogProps } from '.';
import { SimpleConfirmationDialog } from '.';
import { Button } from '@mui/material';

const SimpleConfirmationDialogTemplate = (
	props: Omit<SimpleConfirmationDialogProps, 'onClose'>,
) => {
	const [demoShow, setDemoShow] = React.useState(false);
	return (
		<>
			<Button
				onClick={() => {
					setDemoShow(!demoShow);
				}}
			>
				Show
			</Button>
			{demoShow && (
				<SimpleConfirmationDialog
					{...props}
					onClose={() => {
						setDemoShow(false);
					}}
				/>
			)}
		</>
	);
};

const meta = {
	title: 'Other/SimpleConfirmationDialog',
	component: SimpleConfirmationDialogTemplate,
	tags: ['autodocs'],
} satisfies Meta<typeof SimpleConfirmationDialogTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Simple confirmation dialog demo',
		action: 'Demo',
	},
};
