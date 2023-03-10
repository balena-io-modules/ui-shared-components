import {
  ReactMarkdown,
  ReactMarkdownOptions,
} from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { theme } from "../../theme";

export const Markdown: React.FC<ReactMarkdownOptions> = (props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ alt, ...props }) => {
          return <img style={{ maxWidth: "100%" }} alt={alt} {...props} />;
        },
        pre: (props) => {
          return <pre style={{ maxWidth: "100%" }} {...props} />;
        },
        a: ({ children, ...props }) => {
          return (
            <a
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: theme.palette.hubBlue.main,
              }}
              {...props}
            >
              {children}
            </a>
          );
        },
        code: (props) => {
          return (
            <code
              style={{
                display: "block",
                maxWidth: "100%",
                whiteSpace: "break-spaces",
                fontFamily: "monospace",
                backgroundColor: "#f4f4f4",
              }}
              {...props}
            />
          );
        },
        table: ({ children, ...props }) => {
          return (
            <table
              style={{
                borderSpacing: 0,
                borderCollapse: "collapse",
                display: "block",
                width: "100%",
                overflow: "auto",
              }}
              {...props}
            >
              {children}
            </table>
          );
        },
        th: ({ children, ...props }) => {
          return (
            <th
              style={{
                padding: "6px 13px",
                border: "1px solid #ccc",
              }}
              {...props}
            >
              {children}
            </th>
          );
        },
        td: ({ children, ...props }) => {
          return (
            <td
              style={{
                padding: "6px 13px",
                border: "1px solid #ccc",
              }}
              {...props}
            >
              {children}
            </td>
          );
        },
        tr: ({ children, ...props }: any) => {
          const isNthChild2n = props.node.position.start.line % 2 === 0;
          return (
            <tr
              style={{
                backgroundColor: isNthChild2n ? "#fff" : "#f4f4f4",
                borderTop: "1px solid #eee",
              }}
              {...props}
            >
              {children}
            </tr>
          );
        },
      }}
      {...props}
    />
  );
};
