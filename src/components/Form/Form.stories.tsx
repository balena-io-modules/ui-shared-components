import type { Meta, StoryObj } from '@storybook/react';
import { RJSForm } from '.';

const meta = {
	title: 'Other/RJSForm',
	component: RJSForm,
	tags: ['autodocs'],
} satisfies Meta<typeof RJSForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		schema: {
			title: 'A registration form',
			description: 'A simple form example.',
			type: 'object',
			required: ['firstName', 'lastName'],
			properties: {
				firstName: {
					type: 'string',
					title: 'First name',
					default: 'Chuck',
				},
				lastName: {
					type: 'string',
					title: 'Last name',
				},
				age: {
					type: 'integer',
					title: 'Age',
				},
				bio: {
					type: 'string',
					title: 'Bio',
				},
				password: {
					type: 'string',
					title: 'Password',
					minLength: 3,
				},
				passwordStrength: {
					type: 'string',
					title: 'Password make it strong',
					minLength: 3,
				},
				telephone: {
					type: 'string',
					title: 'Telephone',
					minLength: 10,
				},
			},
		},
		uiSchema: {
			firstName: {
				'ui:autofocus': true,
				'ui:emptyValue': '',
				'ui:placeholder':
					'ui:emptyValue causes this field to always be valid despite being required',
				'ui:autocomplete': 'family-name',
				'ui:enableMarkdownInDescription': true,
				'ui:description':
					'Make text **bold** or *italic*. Take a look at other options [here](https://probablyup.com/markdown-to-jsx/).',
			},
			lastName: {
				'ui:autocomplete': 'given-name',
				'ui:enableMarkdownInDescription': true,
				'ui:description':
					'Make things **bold** or *italic*. Embed snippets of `code`. <small>And this is a small texts.</small> ',
			},
			age: {
				'ui:widget': 'updown',
				'ui:title': 'Age of person',
				'ui:description': '(earth year)',
			},
			bio: {
				'ui:widget': 'textarea',
			},
			password: {
				'ui:widget': 'password',
			},
			passwordStrength: {
				'ui:widget': 'password',
				'ui:help': 'Hint: Make it strong!',
				'ui:options': {
					showPasswordStrengthMeter: true,
				},
			},
			telephone: {
				'ui:options': {
					inputType: 'tel',
				},
			},
		},
		submitButtonProps: {
			sx: {
				display: 'flex',
				alignSelf: 'flex-end',
			},
		},
	},
};