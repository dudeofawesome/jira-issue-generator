import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { stringify } from 'csv-stringify/sync';

import { parseMarkdown } from './parse.js';
import { generateJiraConfig } from './jira-config.js';

export async function main() {


  const input_filename_base = basename(options.issues_file, '.md');

  await Promise.all([
    readFile(options.issues_file, { encoding: 'utf8' })
      .then(parseMarkdown)
      .then((issues) =>
        stringify(issues, {
          header: true,
          objectMode: true,
        }),
      )
      .then((csv) => writeFile(`${input_filename_base}.csv`, csv)),

    generateJiraConfig()
      .then((config) =>
        // We use JSON.stringify instead of Effect's stringify because we want the output formatted
        JSON.stringify(config, null, 2),
      )
      .then((json) => writeFile(`${input_filename_base}.json`, json)),
  ]).then(() =>
    console.log('Created CSV & config JSON. Have fun with Jira 😉'),
  );
}
