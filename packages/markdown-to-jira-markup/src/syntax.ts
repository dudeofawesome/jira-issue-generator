import { String } from 'effect';

export const heading = String.replaceAll(
  /^(#+)\s+/gimu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1: string) => `h${group1.split('#').length - 1}. `,
);

export const code_block = String.replaceAll(
  /```(?<lang>\w+)?\n(?:(?<code>[^`].+?[^`])\n)?```/gisu,
  // @ts-expect-error -- Effect's types are wrong
  (_, lang: string | null, code: string | undefined) =>
    `{code${lang != null ? `:${lang}` : ''}}\n${code != null ? `${code}\n` : ''}{code}`,
);

export const code = String.replaceAll(
  /`([^`].+?[^`])`/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1: string) => `{{${group1}}}`,
);

export const bold = String.replaceAll(
  /\*\*(.+?)\*\*/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1: string) => `*${group1}*`,
);

export const strikethrough = String.replaceAll(
  /~~(.+?)~~/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1: string) => `-${group1}-`,
);

export const link = String.replaceAll(
  /\[(?<text>.+?)\]\((?<url>.+?)\)/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, text: string, url: string) => `[${text}|${url}]`,
);

export const list = String.replaceAll(
  /^(?<indent>\s*)(?<list>-|\*|\+|(?:\d+\.))\s+(?<item>.+)$/gimu,
  // @ts-expect-error -- Effect's types are wrong
  (_, indent: string, list: '-' | '*' | `${number}.`, item: string) =>
    // TODO: the `4` here is an assumption about the amount of indent in Markdown
    `${indent.includes('\n') ? '\n' : ''}${(['*', '-', '+'].includes(list)
      ? '*'
      : '#'
    ).repeat(indent.length / 4 + 1)} ${item}`,
);

export const table = String.replaceAll(
  /^(\|[^\n]+\|\r?\n)((?:\|:?[- :]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?$/gmu,
  // @ts-expect-error -- Effect's types are wrong
  (_, header: string, __, rows: string) =>
    `${header.replaceAll('|', '||').replace(/\n$/gu, '')}${rows}`,
);
