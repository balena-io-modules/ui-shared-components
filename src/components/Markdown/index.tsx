import type { Options as ReactMarkdownOptions } from 'react-markdown';
import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type { MUILinkWithTrackingProps } from '../MUILinkWithTracking';

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

export const defaultAllowedElements: string[] = [
	'li',
	'strong',
	'em',
	'del',
	'input',
];

const defaultSxProps: SxProps = { mb: 2 };

export const defaultMarkdownComponentOverrides: ReactMarkdownOptions['components'] =
	{
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
			remarkPlugins={[remarkGfm]}
			components={componentsWithOverrides}
			allowedElements={[
				...defaultAllowedElements,
				...Object.keys(componentsWithOverrides),
			]}
			skipHtml
			unwrapDisallowed
			{...props}
		/>
	);
};
