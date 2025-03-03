import { describe, it, expect } from '@effect/vitest';
import { Effect, Schema as S, Exit } from 'effect';
import { stripIndent } from 'common-tags';

import { parseFrontmatter, parseMarkdownToIssues } from './parse.js';
import { Issue, IssueType, Priority, Status } from './types.js';

describe('parse', () => {
  describe(parseFrontmatter.name, () => {
    it.effect.each([
      {
        title: 'simple',
        input: stripIndent`
          ---
          foo: 'foo'
          ---

          some text
        `,
        output: {
          foo: 'foo',
        },
      },
    ])('$title', ({ input, output }) =>
      Effect.gen(function* () {
        const result = yield* parseFrontmatter(
          input,
          S.Struct({ foo: S.String }),
        ).pipe(
          Effect.map(([frontmatter, markdown]) => frontmatter),
          Effect.exit,
        );
        expect(result).toStrictEqual(Exit.succeed(output));
      }),
    );
  });

  describe(parseMarkdownToIssues.name, () => {
    it.effect.each([
      {
        title: 'simple',
        input: stripIndent`
          # Summary

          | Key  | Value |
          | ---- | ----- |
          | type | story |

          description
        `,
        output: [
          {
            issuetype: IssueType.STORY,
            summary: 'Summary',
            description: 'description',
            parent: '1',
            dev_team: 'team',
            status: Status.OPEN,
            priority: Priority.MINOR,
            labels: undefined,
            assignee: undefined,
          },
        ] satisfies (typeof Issue.Type)[],
      },
      {
        title: 'table in description',
        input: stripIndent`
          # Summary

          | Key  | Value |
          | ---- | ----- |
          | type | story |

          description

          | foo | bar |
          | --- | --- |
          | baz | qux |
          `,
        output: [
          {
            issuetype: IssueType.STORY,
            summary: 'Summary',
            description: stripIndent`
              description

              || foo || bar ||
              | baz | qux |
            `,
            parent: '1',
            dev_team: 'team',
            status: Status.OPEN,
            priority: Priority.MINOR,
            labels: undefined,
            assignee: undefined,
          },
        ] satisfies (typeof Issue.Type)[],
      },
    ])('$title', ({ input, output }) =>
      Effect.gen(function* () {
        const result = yield* parseMarkdownToIssues(input, {
          parent: '1',
          dev_team_name: 'team',
        }).pipe(Effect.exit);
        expect(result).toStrictEqual(Exit.succeed(output));
      }),
    );
  });
});
