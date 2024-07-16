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

export enum Status {
  OPEN = 'Open',
  TODO = 'Todo',
}

export const Frontmatter = S.Struct({
  parent: S.String,
  'project-name': S.String,
  'project-key': S.String,
  'dev-team-name': S.String,
  'dev-team-field-id': S.Int,
});

export const IssueMetadata = S.Struct({
  parent: S.String,
  issuetype: S.optional(S.UndefinedOr(S.Enums(IssueType)), {
    default: () => IssueType.STORY,
  }),
  status: S.optional(S.UndefinedOr(S.Enums(Status)), {
    default: () => Status.OPEN,
  }),

  priority: S.optional(S.UndefinedOr(S.Enums(Priority)), {
    default: () => Priority.MINOR,
  }),
  labels: S.optional(S.String),

  assignee: S.optional(
    S.TemplateLiteral(S.String, '@', S.String).pipe(S.pattern(/^\S+@\S+$/u)),
  ),
  dev_team: S.String,
});
export const Issue = S.Struct({
  ...IssueMetadata.fields,
  summary: S.String.pipe(S.nonEmpty()),
  description: S.optional(S.String.pipe(S.nonEmpty())),
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
      'existing.custom.field': S.optional(S.NumberFromString),
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
