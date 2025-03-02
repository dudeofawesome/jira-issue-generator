import { describe, it, expect } from 'vitest';
import { stripIndent } from 'common-tags';

import { MarkdownToMarkup } from './index.js';

describe(MarkdownToMarkup.name, () => {
  it.each([
    {
      input: stripIndent`
        # Header 1

        Some text

        | key | value |
        | --- | ----- |
        | foo | bar   |
        | baz | qux   |

        bar

        - item 1
        - item 2
            - sub-item a
        - item 3

        baz

        1. one
        2. two
        3. 🌳

        qux

        \`\`\`ts
        console.log('foo'.replaceAll(
          /[a-z]/i,
          'e',
        ));
        \`\`\`

        Here is some more body text. It includes \`some cool formatting\` _like italics_, **bold words**, ~~struck things~~.

        We should also [test links](https://vitest.dev).
      `,
      output: stripIndent`
        h1. Header 1

        Some text

        || key || value ||
        | foo | bar   |
        | baz | qux   |

        bar

        * item 1
        * item 2
        ** sub-item a
        * item 3

        baz

        # one
        # two
        # 🌳

        qux

        {code:ts}
        console.log('foo'.replaceAll(
          /[a-z]/i,
          'e',
        ));
        {code}

        Here is some more body text. It includes {{some cool formatting}} _like italics_, *bold words*, -struck things-.

        We should also [test links|https://vitest.dev].
      `,
    },
  ])(`%#`, ({ input, output }) =>
    expect(MarkdownToMarkup(input)).toStrictEqual(output),
  );
});
