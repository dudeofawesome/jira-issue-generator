import { Effect, Schema as S, ParseResult } from 'effect';
import { TaggedError } from 'effect/Data';
import { ParseError } from 'effect/ParseResult';
import { parse, YAMLParseError } from 'yaml';
import { MarkdownToMarkup } from '@dudeofawesome/markdown-to-jira-markup';

import { Issue } from './types.js';

export class YamlParsingError extends TaggedError('YamlParsingError')<{
  message: string;
}> {}
export function parseFrontmatter<I, A>(
  text: string,
  schema: S.Schema<A, I>,
): Effect.Effect<
  readonly [S.Schema.Type<typeof schema>, string],
  ParseResult.ParseError | YamlParsingError
> {
  return Effect.gen(function* () {
    // split frontmatter from body
    const match = text.match(
      /^(?:----*\n(?<yaml>.*?)\n---*\n\s*)?(?<markdown>.*)/isu,
    );
    const yaml_str = match?.groups?.yaml;
    const markdown_str = match?.groups?.markdown;
    if (markdown_str == null)
      return yield* new YamlParsingError({ message: 'No markdown found' });
    if (yaml_str == null)
      return [yield* S.decodeUnknown(schema)(undefined), markdown_str] as const;
    try {
      const parsed: unknown = parse(yaml_str);
      return [yield* S.decodeUnknown(schema)(parsed), markdown_str] as const;
    } catch (err) {
      return yield* new YamlParsingError({
        message: (err as YAMLParseError).message,
      });
    }
  }).pipe(
    Effect.tap(([object, bodymatter]) =>
      Effect.annotateCurrentSpan({
        object,
        bodymatter,
      }),
    ),
    Effect.withSpan(parseFrontmatter.name, { attributes: { text } }),
  );
}

export interface GlobalParseOptions {
  parent: string;
  dev_team_name: string;
}
export function parseMarkdownToIssues(
  markdown: string,
  { parent, dev_team_name }: GlobalParseOptions,
): Effect.Effect<readonly (typeof Issue.Type)[], ParseError> {
  return S.decode(S.Array(Issue))(
    markdown
      // split on horizontal rules
      .split(/^[-_*]{3,}\s*$/mu)
      // remove empty entries
      .filter((entry) => entry.trim().length !== 0)
      .map((raw) => {
        // find the 1st level-1 header
        const summary = raw.match(/^\s*\n?#\s+(?<summary>.+)\s*\n/u)?.groups
          ?.summary!;
        // convert markdown after metadata table to Jira markup
        const description = MarkdownToMarkup(
          raw
            // find the end of the metadata table
            .split('|\n\n')
            .slice(1)
            .join('|\n\n')
            // remove comments
            .replaceAll(/<!--.*?-->/gisu, '')
            .trim(),
        );

        // find metadata table
        const table = raw.match(
          /(?<=\|\s*Key\s*\|\s*Value\s*\|\n\|.+\|.+\|\n).*\|(?=\n)/isu,
        )?.[0];
        // convert rows to object
        const metadata = Array.from(
          table?.matchAll(/^\|\s*(?<key>.+?)\s*\|\s*(?<value>.+?)\s*\|$/gimu) ??
            [],
        )
          .map((row) => row.groups as { key: string; value: string })
          .reduce<Record<string, string>>(
            (acc, { key, value }) => ({ ...acc, [key.toLowerCase()]: value }),
            {},
          );

        return {
          parent: metadata.parent ?? parent,
          issuetype: (metadata.type ??
            metadata.issuetype) as (typeof Issue.Type)['issuetype'],
          status: metadata.status as (typeof Issue.Type)['status'],

          summary,
          description,

          priority: metadata.priority as (typeof Issue.Type)['priority'],
          labels: metadata.labels,

          dev_team:
            metadata.dev_team_name ?? metadata.dev_team ?? dev_team_name,
          assignee: metadata.assignee as (typeof Issue.Type)['assignee'],
        } satisfies typeof Issue.Type;
      }),
  ).pipe(
    Effect.tap((issues) =>
      Effect.annotateCurrentSpan({
        issue_count: issues.length,
        issue_summaries: issues.map((issue) => `"${issue.summary}"`).join(', '),
      }),
    ),
    Effect.withSpan(parseMarkdownToIssues.name, {
      attributes: { markdown, parent, dev_team_name },
    }),
  );
}
