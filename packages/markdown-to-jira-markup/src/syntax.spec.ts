import { describe, it, expect } from 'vitest';
import { stripIndent } from 'common-tags';

import { code_block, heading, list, table } from './syntax.js';

describe('syntax', () => {
  describe(`heading`, () => {
    it.each([
      {
        title: 'multiple headers',
        input: stripIndent`
            foo

            # foo
            ## bar

            bar
          `,
        output: stripIndent`
            foo

            h1. foo
            h2. bar

            bar
          `,
      },
    ])(`$title`, ({ input, output }) =>
      expect(heading(input)).toStrictEqual(output),
    );
  });

  describe(`code_block`, () => {
    it.each([
      {
        title: 'single line',
        input: stripIndent`
            foo

            \`\`\`js
            foo();
            \`\`\`

            bar
          `,
        output: stripIndent`
            foo

            {code:js}
            foo();
            {code}

            bar
          `,
      },
      {
        title: 'multiple lines',
        input: stripIndent`
            foo

            \`\`\`js
            foo(
              'multiple lines',
              'of code',
            );
            \`\`\`

            bar
          `,
        output: stripIndent`
            foo

            {code:js}
            foo(
              'multiple lines',
              'of code',
            );
            {code}

            bar
          `,
      },
      {
        title: 'no language',
        input: stripIndent`
            foo

            \`\`\`
            block text
            \`\`\`

            bar
          `,
        output: stripIndent`
            foo

            {code}
            block text
            {code}

            bar
          `,
      },
      {
        title: 'empty block',
        input: stripIndent`
            foo

            \`\`\`
            \`\`\`

            bar
          `,
        output: stripIndent`
            foo

            {code}
            {code}

            bar
          `,
      },
    ])(`$title`, ({ input, output }) =>
      expect(code_block(input)).toStrictEqual(output),
    );
  });

  describe(`list`, () => {
    it.each([
      {
        title: 'single level',
        input: stripIndent`
            foo

            - one
            - two
            - three

            bar
          `,
        output: stripIndent`
            foo

            * one
            * two
            * three

            bar
          `,
      },
      {
        title: 'multiple levels',
        input: stripIndent`
            foo

            - one
                - ayy
                    - alpha
                - bee
            - two
            - three

            bar
          `,
        output: stripIndent`
            foo

            * one
            ** ayy
            *** alpha
            ** bee
            * two
            * three

            bar
          `,
      },
    ])(`$title`, ({ input, output }) =>
      expect(list(input)).toStrictEqual(output),
    );
  });

  describe(`table`, () => {
    it.each([
      {
        title: 'simple table',
        input: stripIndent`
            | key | value |
            | --- | ----- |
            | foo | bar   |
            | baz | qux   |

            bar
          `,
        output: stripIndent`
            || key || value ||
            | foo | bar   |
            | baz | qux   |

            bar
          `,
      },
    ])(`$title`, ({ input, output }) =>
      expect(table(input)).toStrictEqual(output),
    );
  });
});
