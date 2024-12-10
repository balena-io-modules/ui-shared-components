import type { Options as ReactMarkdownOptions } from 'react-markdown';
import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type { MUILinkWithTrackingProps } from '../MUILinkWithTracking';
export type MarkdownComponents = ReactMarkdownOptions['components'];

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import type {
	SxProps,
	TableBodyProps,
	TableCellProps,
	TableHeadProps,
	TableProps,
	TableRowProps,
	TypographyProps,
} from '@mui/material';

import designTokens from '@balena/design-tokens';

const defaultSxProps: SxProps = { mb: 2 };

const defaultMarkdownComponentOverrides: ReactMarkdownOptions['components'] = {
	br: (props) => <br {...props} />,
	li: (props) => <li {...props} />,
	strong: (props) => <strong {...props} />,
	em: (props) => <em {...props} />,
	del: (props) => <del {...props} />,
	input: (props) => <input {...props} />,
	p: (props) => (
		<Typography
			component="p"
			sx={{ ...defaultSxProps }}
			{...(props as TypographyProps)}
		/>
	),
	ul: (props) => (
		<Typography
			component="ul"
			sx={{
				mt: 0,
				pl: '24px',
				...defaultSxProps,
				'&.contains-task-list': {
					listStyle: 'none',
					pl: 0,
				},
			}}
			{...(props as TypographyProps)}
		/>
	),
	ol: (props) => (
		<Typography
			component="ol"
			sx={{ mt: 0, pl: '24px', ...defaultSxProps }}
			{...(props as TypographyProps)}
		/>
	),
	pre: (props) => (
		<Typography
			component="pre"
			sx={{
				maxWidth: '100%',
				width: '100%',
				backgroundColor: designTokens.color.bg.value,
				borderRadius: `${designTokens.shape.border_radius.sm.value}px`,
				p: 2,
				...defaultSxProps,
			}}
			{...(props as TypographyProps)}
		/>
	),
	blockquote: (props) => (
		<Typography
			component="blockquote"
			sx={{
				borderLeft: `solid 2px ${designTokens.color.border.value}`,
				fontStyle: 'italic',
				pl: 2,
				...defaultSxProps,
			}}
			{...(props as TypographyProps)}
		/>
	),
	a: (props) => (
		<MUILinkWithTracking
			target="_blank"
			rel="noreferrer"
			{...(props as MUILinkWithTrackingProps)}
		/>
	),
	h1: (props) => (
		<Typography
			component="p"
			sx={{ fontSize: 18, ...defaultSxProps }}
			{...(props as TypographyProps)}
		></Typography>
	),
	h2: (props) => (
		<Typography
			component="p"
			sx={{ fontSize: 16, ...defaultSxProps }}
			{...(props as TypographyProps)}
		></Typography>
	),
	h3: (props) => (
		<Typography
			component="p"
			sx={{
				fontSize: 14,
				fontWeight: designTokens.typography.weight.strong.value,
				...defaultSxProps,
			}}
			{...(props as TypographyProps)}
		></Typography>
	),
	code: (props) => (
		<Typography
			sx={{
				fontFamily: designTokens.typography.fontfamily.code.value,
				backgroundColor: designTokens.color.bg.value,
				borderRadius: `${designTokens.shape.border_radius.sm.value}px`,
				px: 1,
				py: '2px',
			}}
			{...(props as TypographyProps)}
		/>
	),
	table: (props) => (
		<Table sx={{ ...defaultSxProps }} {...(props as TableProps)} />
	),
	thead: (props) => <TableHead {...(props as TableHeadProps)} />,
	tbody: (props) => <TableBody {...(props as TableBodyProps)} />,
	th: (props) => <TableCell {...(props as TableCellProps)} />,
	td: (props) => <TableCell {...(props as TableCellProps)} />,
	tr: (props) => <TableRow {...(props as TableRowProps)} />,
};

/**
 * This component will render a Markdown text.
 */
export const Markdown = ({ components, ...props }: ReactMarkdownOptions) => {
	const componentsWithOverrides = {
		...defaultMarkdownComponentOverrides,
		...components,
	};

	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm, remarkBreaks]}
			components={componentsWithOverrides}
			allowedElements={Object.keys(componentsWithOverrides)}
			skipHtml
			unwrapDisallowed
			{...props}
		/>
	);
};

export type ComponentSyntax =
	| {
			override: (typeof defaultMarkdownComponentOverrides)[keyof typeof defaultMarkdownComponentOverrides];
	  }
	| {
			syntax: string;
			example: string;
			override: (typeof defaultMarkdownComponentOverrides)[keyof typeof defaultMarkdownComponentOverrides];
	  };

const defaultComponentSyntax: Record<string, ComponentSyntax> = {
	...Object.fromEntries(
		Object.entries(defaultMarkdownComponentOverrides).map(([key, override]) => [
			key,
			{ override },
		]),
	),
	h1: {
		example: '# Heading 1',
		syntax: '# Heading 1',
		override: defaultMarkdownComponentOverrides.h1,
	},
	h2: {
		example: '## Heading 2',
		syntax: '## Heading 2',
		override: defaultMarkdownComponentOverrides.h2,
	},
	h3: {
		example: '### Heading 3',
		syntax: '### Heading 3',
		override: defaultMarkdownComponentOverrides.h3,
	},
	p: {
		example: 'Paragraph',
		syntax: 'Text',
		override: defaultMarkdownComponentOverrides.p,
	},
	strong: {
		example: '**Bold**',
		syntax: '**Text**',
		override: defaultMarkdownComponentOverrides.strong,
	},
	em: {
		example: '*Italic*',
		syntax: '*Text*',
		override: defaultMarkdownComponentOverrides.em,
	},
	del: {
		example: '~~Strikethrough~~',
		syntax: '~~Text~~',
		override: defaultMarkdownComponentOverrides.del,
	},
	a: {
		example: '[Visit our site!](https://www.balena.io/)',
		syntax: '[Text](URL)',
		override: defaultMarkdownComponentOverrides.a,
	},
	ul: {
		example: '- List item',
		syntax: '- Item',
		override: defaultMarkdownComponentOverrides.ul,
	},
	ol: {
		example: '1. List item',
		syntax: '1. Item',
		override: defaultMarkdownComponentOverrides.ol,
	},
	blockquote: {
		example: '> Blockquote',
		syntax: '> Text',
		override: defaultMarkdownComponentOverrides.blockquote,
	},
	code: {
		example: '`code`',
		syntax: '`Code`',
		override: defaultMarkdownComponentOverrides.code,
	},
	pre: {
		example: `\`\`\`
code
block`,
		syntax: `\`\`\`
Code
block
\`\`\`
		`,
		override: defaultMarkdownComponentOverrides.pre,
	},
	table: {
		example: `
| Header | Header |
| ------ | ------ |
| Cell | Cell |
`,
		syntax: `
| Header | Header |
| ------ | ------ |
| Cell | Cell |
`,
		override: defaultMarkdownComponentOverrides.table,
	},
	input: {
		example: `
- [X] Task 1
- [X] Task 2
- [ ] Task 3
		`,
		syntax: `
- [X] Task 1
- [X] Task 2
- [ ] Task 3
		`,
		override: defaultMarkdownComponentOverrides.input,
	},
};

export const MarkdownSupportedSyntax = ({
	overriddenComponentSyntax,
}: {
	overriddenComponentSyntax?: Record<string, ComponentSyntax>;
}) => {
	const componentSyntax = {
		...defaultComponentSyntax,
		...overriddenComponentSyntax,
	};
	const components = Object.fromEntries(
		Object.entries(componentSyntax).map(([element, { override }]) => [
			element,
			override,
		]),
	);

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>Element</TableCell>
					<TableCell>Syntax</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{Object.entries(componentSyntax).map(([element, elementSyntax]) => {
					if (!('example' in elementSyntax)) {
						return null;
					}
					const { example, syntax } = elementSyntax;
					return (
						<TableRow key={element}>
							<TableCell>
								<Markdown components={components}>{example}</Markdown>
							</TableCell>
							<TableCell sx={{ whiteSpace: 'pre' }}>{syntax}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};
