import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Button } from '@mui/material';
import { TagManagementDialog, type TagManagementDialogProps } from '.';

const items = [
	{
		id: 1,
		name: 'item-with-tag-1',
		tag_field: [
			{
				tag_key: 'tag1-key',
				value: 'tag-value',
			},
			{
				tag_key: 'tag2-key',
				value: 'tag3-value',
			},
			{
				tag_key: 'tag3-key',
				value: 'tag3-value',
			},
		],
	},
	{
		id: 2,
		name: 'item-with-tag-2',
		tag_field: [
			{
				tag_key: 'tag1-key',
				value: 'tag-value',
			},
			{
				tag_key: 'tag2-key',
				value: 'tag3-value',
			},
		],
	},
];

const TagManagementDialogTemplate = (
	props: Omit<TagManagementDialogProps<any>, 'cancel' | 'done'>,
) => {
	const [demoShow, setDemoShow] = useState(false);
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
				<TagManagementDialog
					{...props}
					cancel={() => {
						setDemoShow(false);
					}}
					done={() => {
						setDemoShow(false);
					}}
				/>
			)}
		</>
	);
};

const meta = {
	title: 'Other/TagManagementDialog',
	component: TagManagementDialogTemplate,
	tags: ['autodocs'],
} satisfies Meta<typeof TagManagementDialogTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		items,
		itemType: 'tag',
		titleField: 'name',
		tagField: 'tag_field',
	},
};
