import { basename } from 'node:path';
import { stringify } from 'csv-stringify/sync';
import { Console, Effect, Option, pipe } from 'effect';
import { FileSystem } from '@effect/platform/FileSystem';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Args, Command, Options } from '@effect/cli';

import { parseFrontmatter, parseMarkdown } from './parse.js';
import { generateJiraConfig } from './jira-config.js';
import { Frontmatter } from './types.js';

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
          Options.optional,
          Options.withAlias('p'),
          Options.withDescription(`The parent Issue (eg: PAC-21694)`),
        ),
        project_name: Options.text('project-name').pipe(
          Options.optional,
          Options.withAlias('n'),
          Options.withDescription(
            `The name of the Project to create the Issue in (eg: Integrations)`,
          ),
        ),
        project_key: Options.text('project-key').pipe(
          Options.optional,
          Options.withAlias('k'),
          Options.withDescription(
            `The key of the Project to create the Issue in (eg: INT)`,
          ),
        ),
        dev_team_name: Options.text('dev-team-name').pipe(
          Options.optional,
          Options.withAlias('d'),
          Options.withDescription(`The dev team name (eg: Integrations)`),
        ),
        dev_team_field_id: Options.integer('dev-team-field-id').pipe(
          Options.optional,
          Options.withAlias('f'),
          Options.withDescription(`The dev team Jira field ID (eg: 10055)`),
        ),
      },
      ({
        issues_file,
        parent,
        project_name,
        project_key,
        dev_team_name,
        dev_team_field_id,
      }) =>
        Effect.gen(function* () {
          const fs = yield* FileSystem;
          const input_filename_base = basename(issues_file, '.md');

          return yield* pipe(
            fs.readFileString(issues_file),

            Effect.andThen((str) =>
              pipe(
                parseFrontmatter(str, Frontmatter).pipe(
                  Effect.andThen(
                    ([frontmatter, markdown_str]) =>
                      [
                        // prefer CLI overrides
                        {
                          parent: Option.match(parent, {
                            onNone: () => frontmatter.parent,
                            onSome: (parent) => parent,
                          }),
                          dev_team_name: Option.match(dev_team_name, {
                            onNone: () => frontmatter['dev-team-name'],
                            onSome: (dev_team_name) => dev_team_name,
                          }),
                          dev_team_field_id: Option.match(dev_team_field_id, {
                            onNone: () => frontmatter['dev-team-field-id'],
                            onSome: (dev_team_field_id) => dev_team_field_id,
                          }),
                          project_name: Option.match(project_name, {
                            onNone: () => frontmatter['project-name'],
                            onSome: (project_name) => project_name,
                          }),
                          project_key: Option.match(project_key, {
                            onNone: () => frontmatter['project-key'],
                            onSome: (project_key) => project_key,
                          }),
                        },
                        markdown_str,
                      ] as const,
                  ),
                ),
                Effect.andThen(([options, markdown_str]) =>
                  Effect.all([
                    parseMarkdown(markdown_str, options).pipe(
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
                    generateJiraConfig(options).pipe(
                      // We use JSON.stringify instead of Effect's stringify because we want the output formatted
                      Effect.andThen((config) =>
                        JSON.stringify(config, null, 2),
                      ),
                      Effect.tap((json) =>
                        fs.writeFileString(`${input_filename_base}.json`, json),
                      ),
                    ),
                  ]),
                ),
              ),
            ),
          ).pipe(
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
