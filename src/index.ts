import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { stringify } from 'csv-stringify/sync';
import { Schema as S } from '@effect/schema';

const input_filename = process.argv[2]!;
const input_filename_base = basename(input_filename, '.md');

const markdown = await readFile(input_filename, { encoding: 'utf8' });

export enum IssueType {
  STORY = 'story',
  TASK = 'task',
  BUG = 'bug',
}
const Issue = S.Struct({
  issuetype: S.Enums(IssueType),
  summary: S.String.pipe(S.nonEmpty()),
  description: S.optional(S.String.pipe(S.nonEmpty())),
  assignee: S.optional(S.String),
  dev_team: S.String,
  parent: S.String,
});

const issues = await Promise.all(
  markdown
    .split(/^#\s+(?=\S)/mu)
    .filter((entry) => entry.trim())
    .map(async (raw) => {
      const summary = raw.split('\n\n')[0]!;
      const description = raw.split('|\n\n').at(-1);

      const table = raw.match(
        /(?<=\|\s*Key\s*\|\s*Value\s*\|\n\|.+\|.+\|\n).*\|(?=\n)/isu,
      )?.[0];
      const rows = Array.from(
        table?.matchAll(/^\|\s*(?<key>.+?)\s*\|\s*(?<value>.+?)\s*\|$/gimu) ??
          [],
      ).map((row) => row.groups as { key: string; value: string });
      const type = rows.find((row) => row.key.toLowerCase() === 'type')
        ?.value as (typeof Issue.Type)['issuetype'];
      const assignee = rows.find(
        (row) => row.key.toLowerCase() === 'assignee',
      )?.value;

      return await S.validatePromise(Issue)({
        issuetype: type,
        summary,
        description,

        assignee,
        dev_team: 'Integrations',
        parent: 'PAC-21692',
      } satisfies typeof Issue.Type);
    }),
);

const out = stringify(issues, {
  header: true,
  // columns: ['type', 'summary', 'description', 'assignee'],
  // escape: '"',
  objectMode: true,
});

await writeFile(`${input_filename_base}.csv`, out);

console.log('Created CSV. Have fun with Jira 😉');
