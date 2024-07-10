import { Schema as S } from '@effect/schema';
import { Issue } from './types.js';
import { MarkdownToMarkup } from './utils.js';

export function parseMarkdown(markdown: string) {
  return Promise.all(
    markdown
      .split(/^#\s+(?=\S)/mu)
      .filter((entry) => entry.trim())
      .map(async (raw) => {
        const summary = raw.split('\n\n')[0]!.trim();
        const description = MarkdownToMarkup(
          raw.split('|\n\n').at(-1)?.trim() ?? '',
        );

        const table = raw.match(
          /(?<=\|\s*Key\s*\|\s*Value\s*\|\n\|.+\|.+\|\n).*\|(?=\n)/isu,
        )?.[0];
        const rows = Array.from(
          table?.matchAll(/^\|\s*(?<key>.+?)\s*\|\s*(?<value>.+?)\s*\|$/gimu) ??
            [],
        ).map((row) => row.groups as { key: string; value: string });

        const type = rows.find((row) => row.key.toLowerCase() === 'type')
          ?.value as (typeof Issue.Type)['issuetype'];
        const status = rows.find((row) => row.key.toLowerCase() === 'status')
          ?.value as (typeof Issue.Type)['status'];
        const priority = rows.find(
          (row) => row.key.toLowerCase() === 'priority',
        )?.value as (typeof Issue.Type)['priority'];
        const labels = rows.find(
          (row) => row.key.toLowerCase() === 'labels',
        )?.value;
        const assignee = rows.find(
          (row) => row.key.toLowerCase() === 'assignee',
        )?.value;

        return await S.decodePromise(Issue)({
          parent: 'PAC-21694',
          issuetype: type,
          status,

          summary,
          description,
          priority,
          labels,

          dev_team: 'Integrations',
          assignee,
        });
      }),
  );
}