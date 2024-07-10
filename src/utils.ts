/**
 * Translate Markdown to Jira's Markup syntax
 * https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
 */
export function MarkdownToMarkup(markdown: string): string {
  // TODO: support ordered lists
  // TODO: support tables
  // TODO: support block quotes
  // TODO: support struck text
  // TODO: support multi-level lists
  // TODO: support nested styling (this might require an AST. `markdown-it` can generate one)
  return markdown
    .replaceAll(
      /^(#+)\s+/gimu,
      (_, group1: string) => `h${group1.split('#').length - 1}. `,
    )
    .replaceAll(
      /```(?<lang>\w+)\n(?<code>[^`].+?[^`])\n```/giu,
      (_, lang: string, code: string) => `{code:${lang}}\n${code}\n{code}`,
    )
    .replaceAll(/`([^`].+?[^`])`/giu, (_, group1: string) => `{{${group1}}}`)
    .replaceAll(/\*\*(.+?)\*\*/giu, (_, group1: string) => `*${group1}*`)
    .replaceAll(
      /\[(?<text>.+?)\]\((?<url>.+?)\)/giu,
      (_, text: string, url: string) => `[${text}|${url}]`,
    );
}
