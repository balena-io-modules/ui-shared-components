import type { Options as ReactMarkdownOptions } from 'react-markdown';
import { default as ReactMarkdown } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { theme } from '../../theme';
import { color } from '@balena/design-tokens';

/**
 * This component will render a Markdown text.
 */
export const Markdown: React.FC<ReactMarkdownOptions> = ({
	components,
	...props
}) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]}
			components={{
				img: ({ alt, ...otherProps }) => {
					return <img style={{ maxWidth: '100%' }} alt={alt} {...otherProps} />;
				},
				pre: (preProps) => {
					return <pre style={{ maxWidth: '100%' }} {...preProps} />;
				},
				a: ({ children, ...otherProps }) => {
					return (
						<a
							target="_blank"
							rel="noreferrer"
							style={{
								textDecoration: 'none',
								color: theme.palette.customBlue.main,
							}}
							{...otherProps}
						>
							{children}
						</a>
					);
				},
				code: (codeProps) => {
					return (
						<code
							style={{
								display: 'block',
								maxWidth: '100%',
								whiteSpace: 'break-spaces',
								fontFamily: 'monospace',
								backgroundColor: theme.palette.background.default,
							}}
							{...codeProps}
						/>
					);
				},
				table: ({ children, ...otherProps }) => {
					return (
						<table
							style={{
								borderSpacing: 0,
								borderCollapse: 'collapse',
								display: 'block',
								width: '100%',
								overflow: 'auto',
							}}
							{...otherProps}
						>
							{children}
						</table>
					);
				},
				th: ({ children, ...otherProps }) => {
					return (
						<th
							style={{
								padding: '6px 13px',
								border: '1px solid #ccc',
							}}
							{...otherProps}
						>
							{children}
						</th>
					);
				},
				td: ({ children, ...otherProps }) => {
					return (
						<td
							style={{
								padding: '6px 13px',
								border: '1px solid #ccc',
							}}
							{...otherProps}
						>
							{children}
						</td>
					);
				},
				tr: ({ children, ...otherProps }: any) => {
					const isNthChild2n = otherProps.node.position.start.line % 2 === 0;
					return (
						<tr
							style={{
								backgroundColor: isNthChild2n
									? '#fff'
									: theme.palette.background.default,
								borderTop: `1px solid ${color.border.value}`,
							}}
							{...otherProps}
						>
							{children}
						</tr>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
};
