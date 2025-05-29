import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Markdown } from '.';

const meta = {
	title: 'Other/Markdown',
	component: Markdown,
	tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const markdown = `
# Title 1

## Title 2

### Title 3

- item 1
- item 2
- item 3

1. item 1
1. item 2
1. item 3

Testing some \`inline code\` example.

\`\`\`
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
\`\`\`

---

[Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)

**bold text**

*italicized text*

> Quote quote lorem ipsum

 | Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text | 

~~The world is flat.~~

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media 
`;

export const Default: Story = {
	args: {
		children: markdown,
	},
};
