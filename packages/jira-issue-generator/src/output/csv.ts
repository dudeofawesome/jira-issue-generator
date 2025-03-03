import { Console, Effect } from 'effect';
import { FileSystem } from '@effect/platform/FileSystem';
import { stringify } from 'csv-stringify/sync';

import { GlobalParseOptions } from '../parse.js';
import { generateJiraConfig, JiraConfigOptions } from '../jira-config.js';
import { Issue } from '../types.js';

export function output_to_csv({
  issues,
  options,
}: {
  issues: readonly (typeof Issue.Type)[];
  options: GlobalParseOptions &
    JiraConfigOptions & { input_filename_base: string };
}) {
  return FileSystem.pipe(
    Effect.andThen((fs) =>
      Effect.all([
        Effect.succeed(
          stringify(Array.from(issues), {
            header: true,
            objectMode: true,
          }),
        ).pipe(
          Effect.tap((csv) =>
            fs.writeFileString(`${options.input_filename_base}.csv`, csv),
          ),
        ),

        generateJiraConfig(options).pipe(
          Effect.tap((json) =>
            fs.writeFileString(`${options.input_filename_base}.json`, json),
          ),
        ),
      ]).pipe(
        Effect.tap(
          Console.log(`Created CSV & config JSON. Have fun with Jira 😉`),
        ),
      ),
    ),
  ).pipe(
    Effect.withSpan(output_to_csv.name, {
      attributes: { issue_count: issues.length },
    }),
  );
}
