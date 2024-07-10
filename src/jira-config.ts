import { Schema as S } from '@effect/schema';
import { BulkCreateConfiguration } from './types.js';

export function generateJiraConfig() {
  return S.encodePromise(BulkCreateConfiguration)({
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
  } satisfies typeof BulkCreateConfiguration.Type);
}
