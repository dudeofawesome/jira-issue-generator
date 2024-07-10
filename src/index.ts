import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { stringify } from 'csv-stringify/sync';
import { Schema as S } from '@effect/schema';
import { BulkCreateConfiguration, Issue } from './types.js';
import { MarkdownToMarkup } from './utils.js';

const input_filename = process.argv[2]!;
const input_filename_base = basename(input_filename, '.md');

const markdown = await readFile(input_filename, { encoding: 'utf8' });

const issues = await Promise.all(
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
      const priority = rows.find((row) => row.key.toLowerCase() === 'priority')
        ?.value as (typeof Issue.Type)['priority'];
      const assignee = rows.find(
        (row) => row.key.toLowerCase() === 'assignee',
      )?.value;

      return await S.encodePromise(Issue)({
        issuetype: type,
        parent: 'PAC-21692',

        summary,
        description,
        priority,

        dev_team: 'Integrations',
        assignee,
      } satisfies typeof Issue.Type);
    }),
);

const out = stringify(issues, {
  header: true,
  objectMode: true,
});

await Promise.all([
  writeFile(`${input_filename_base}.csv`, out),
  writeFile(
    `${input_filename_base}.json`,
    JSON.stringify(
      await S.encodePromise(BulkCreateConfiguration)({
        'config.version': '2.0',
        'config.encoding': 'UTF-8',

        'config.delimiter': ',',
        'config.date.format': "yyyy-MM-dd'T'HH:mmZ",

        'config.field.mappings': {
          issuetype: {
            'jira.field': 'issuetype',
            userChanged: 'false',
            manualMapping: 'false',
          },
          parent: {
            'jira.field': 'parent',
            userChanged: 'false',
            manualMapping: 'false',
          },

          summary: {
            'jira.field': 'summary',
            userChanged: 'false',
            manualMapping: 'false',
          },
          description: {
            'jira.field': 'description',
            userChanged: 'false',
            manualMapping: 'false',
          },
          priority: {
            'jira.field': 'priority',
            userChanged: 'false',
            manualMapping: 'false',
          },

          dev_team: {
            'existing.custom.field': '10055',
            userChanged: 'true',
            manualMapping: 'false',
          },
          assignee: {
            'jira.field': 'assignee',
            userChanged: 'false',
            manualMapping: 'false',
          },
        },
        'config.value.mappings': {},

        'config.project': {
          'project.key': 'INT',
          'project.name': 'Integrations',
        },
      } satisfies typeof BulkCreateConfiguration.Type),
      null,
      2,
    ),
  ),
]);

console.log('Created CSV. Have fun with Jira 😉');
