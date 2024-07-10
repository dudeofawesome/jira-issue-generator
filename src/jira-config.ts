import { Schema as S } from '@effect/schema';
import { BulkCreateConfiguration } from './types.js';

export function generateJiraConfig({
  dev_team_id,
  project_key,
  project_name,
}: {
  dev_team_id: string;
  project_name: string;
  project_key: string;
}) {
  return S.encode(BulkCreateConfiguration)({
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
      labels: {
        'jira.field': 'labels',
        userChanged: 'true',
        manualMapping: 'false',
      },

      dev_team: {
        'existing.custom.field': dev_team_id,
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
      'project.key': project_key,
      'project.name': project_name,
    },
  } satisfies typeof BulkCreateConfiguration.Type);
}
