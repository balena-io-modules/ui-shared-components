import type { Meta, StoryObj } from '@storybook/react';
import { RJSForm } from '.';
import { RJSFSchema } from '@rjsf/utils';

const meta = {
	title: 'Other/RJS Form',
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
				favoriteKantoStarter: {
					type: 'string',
					title: 'Favorite Kanto Starter',
					enum: ['Bulbasaur', 'Charmander', 'Squirtle'],
				},
				leastFavoriteKantoStarter: {
					type: 'array',
					title: 'Least Favorite Kanto Starter',
					items: {
						type: 'number',
						oneOf: [
							{ title: 'Bulbasaur', const: 1 },
							{ title: 'Charmander', const: 2 },
							{ title: 'Squirtle', const: 3 },
						],
					},
					uniqueItems: true,
				},
				leastFavoriteJohtoStarters: {
					type: 'array',
					title:
						'Least Favorite Johto Starters (Chikorita must be one of them, sorry)',
					default: [1],
					items: {
						type: 'number',
						oneOf: [
							{ title: 'Chikorita', const: 1, disabled: true } as RJSFSchema,
							{ title: 'Cyndaquil', const: 2 },
							{ title: 'Totodile', const: 3 },
						],
					},
					uniqueItems: true,
				},
				additionalDocuments: {
					type: 'string',
					format: 'data-url',
					title: 'Additional Documents',
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
			additionalDocuments: {
				'ui:options': {
					accept: {
						'image/png': ['.png'],
						'text/plain': ['.txt'],
					},
					maxSize: 13400,
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
