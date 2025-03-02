import { pipe } from 'effect';

import {
  heading,
  code_block,
  code,
  bold,
  strikethrough,
  link,
  list,
  table,
} from './syntax.js';

/**
 * Translate a subset of Markdown syntax to [Jira's custom markup language](https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all)
 */
export function MarkdownToMarkup(markdown: string): string {
  // TODO: support block quotes
  // TODO: support nested styling (this might require an AST. `markdown-it` can generate one)
  return pipe(
    markdown,
    heading,
    code_block,
    code,
    bold,
    strikethrough,
    link,
    list,
    table,
  );
}
