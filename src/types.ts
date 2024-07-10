import { Schema as S } from '@effect/schema';

export enum IssueType {
  STORY = 'story',
  TASK = 'task',
  BUG = 'bug',
}

export enum Priority {
  CRITICAL = '1',
  MAJOR = '3',
  MINOR = '4',
}

export const Issue = S.Struct({
  issuetype: S.Enums(IssueType),
  parent: S.String,

  summary: S.String.pipe(S.nonEmpty()),
  description: S.optional(S.String.pipe(S.nonEmpty())),
  priority: S.optional(S.Enums(Priority)),

  assignee: S.optional(S.String),
  dev_team: S.String,
});

export const BulkCreateConfiguration = S.Struct({
  'config.version': S.Literal('2.0'),
  'config.encoding': S.Literal('UTF-8'),

  'config.delimiter': S.Literal(','),
  'config.date.format': S.String,

  'config.field.mappings': S.Record(
    S.String,
    S.Struct({
      'jira.field': S.optional(S.String),
      'existing.custom.field': S.optional(S.String),
      userChanged: S.Union(S.Literal('true'), S.Literal('false')),
      manualMapping: S.Union(S.Literal('true'), S.Literal('false')),
    }),
  ),
  'config.value.mappings': S.Record(S.String, S.Never),

  'config.project': S.Struct({
    'project.key': S.String,
    'project.name': S.String,
    'project.type': S.optional(S.NullOr(S.String)),
    'project.description': S.optional(S.NullOr(S.String)),
    'project.url': S.optional(S.NullOr(S.String)),
    'project.lead': S.optional(S.String),
  }),
});
