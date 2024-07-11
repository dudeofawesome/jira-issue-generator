/**
 * Translate Markdown to Jira's Markup syntax
 * https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
 */
export function MarkdownToMarkup(markdown: string): string {
  // TODO: support tables
  // TODO: support block quotes
  // TODO: support struck text
  // TODO: support multi-level lists
  // TODO: support nested styling (this might require an AST. `markdown-it` can generate one)
  return (
    markdown
      // Headers
      .replaceAll(
        /^(#+)\s+/gimu,
        (_, group1: string) => `h${group1.split('#').length - 1}. `,
      )
      // Code blocks
      .replaceAll(
        /```(?<lang>\w+)\n(?<code>[^`].+?[^`])\n```/giu,
        (_, lang: string, code: string) => `{code:${lang}}\n${code}\n{code}`,
      )
      // Code
      .replaceAll(/`([^`].+?[^`])`/giu, (_, group1: string) => `{{${group1}}}`)
      // Bold
      .replaceAll(/\*\*(.+?)\*\*/giu, (_, group1: string) => `*${group1}*`)
      // Links
      .replaceAll(
        /\[(?<text>.+?)\]\((?<url>.+?)\)/giu,
        (_, text: string, url: string) => `[${text}|${url}]`,
      )
      // Lists
      .replaceAll(
        /^(?<indent>\s*)(?<list>-|\*|\+|(?:\d+\.))\s+(?<item>.+)$/gimu,
        (_, indent: string, list: '-' | '*' | `${number}.`, item: string) =>
          // TODO: the `4` here is an assumption about the amount of indent in Markdown
          `${(['*', '-', '+'].includes(list) ? '*' : '#').repeat(
            indent.length / 4 + 1,
          )} ${item}`,
      )
  );
}
