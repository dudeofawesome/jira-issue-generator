import { basename } from 'node:path';
import { stringify } from 'csv-stringify/sync';
import { Console, Effect } from 'effect';
import { FileSystem } from '@effect/platform/FileSystem';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Args, Command, Options } from '@effect/cli';

import { parseMarkdown } from './parse.js';
import { generateJiraConfig } from './jira-config.js';

export function main() {
  const name = 'jira-issue-generator';

  const cli = Command.run(
    Command.make(
      name,
      {
        issues_file: Args.file({ name: 'issues file' }).pipe(
          Args.withDescription(`The Markdown file containing your issues.`),
          Args.withDefault('jira.md'),
        ),
        parent: Options.text('parent').pipe(
          Options.withAlias('p'),
          Options.withDescription(`The parent Issue (eg: PAC-21694)`),
        ),
        project_name: Options.text('project-name').pipe(
          Options.withAlias('n'),
          Options.withDescription(
            `The name of the Project to create the Issue in (eg: Integrations)`,
          ),
        ),
        project_key: Options.text('project-key').pipe(
          Options.withAlias('k'),
          Options.withDescription(
            `The key of the Project to create the Issue in (eg: INT)`,
          ),
        ),
        dev_team_name: Options.text('dev-team-name').pipe(
          Options.withAlias('d'),
          Options.withDescription(`The dev team name (eg: Integrations)`),
        ),
        dev_team_id: Options.text('dev-team-id').pipe(
          Options.withAlias('i'),
          Options.withDescription(`The dev team ID (eg: 10055)`),
        ),
      },
      ({
        issues_file,
        parent,
        project_name,
        project_key,
        dev_team_name,
        dev_team_id,
      }) =>
        Effect.gen(function* () {
          const fs = yield* FileSystem;
          const input_filename_base = basename(issues_file, '.md');

          return yield* Effect.all([
            fs.readFileString(issues_file).pipe(
              Effect.andThen((issues) =>
                parseMarkdown(issues, { parent, dev_team_name }),
              ),
              Effect.andThen((issues) =>
                stringify(Array.from(issues), {
                  header: true,
                  objectMode: true,
                }),
              ),
              Effect.tap((csv) =>
                fs.writeFileString(`${input_filename_base}.csv`, csv),
              ),
            ),

            generateJiraConfig({ dev_team_id, project_name, project_key }).pipe(
              // We use JSON.stringify instead of Effect's stringify because we want the output formatted
              Effect.andThen((config) => JSON.stringify(config, null, 2)),
              Effect.tap((json) =>
                fs.writeFileString(`${input_filename_base}.json`, json),
              ),
            ),
          ]).pipe(
            Effect.andThen(
              Console.log(`Created CSV & config JSON. Have fun with Jira 😉`),
            ),
          );
        }),
    ).pipe(
      Command.withDescription(
        `Generate CSV files for importing issues into Jira from markdown files.`,
      ),
    ),
    { name, version: '0.0.1' },
  );

  Effect.suspend(() => cli(process.argv)).pipe(
    Effect.provide(NodeContext.layer),
    NodeRuntime.runMain,
  );
}
