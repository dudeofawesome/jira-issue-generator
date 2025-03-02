import { String } from "effect";
const heading = String.replaceAll(
  /^(#+)\s+/gimu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1) => `h${group1.split("#").length - 1}. `
);
const code_block = String.replaceAll(
  /```(?<lang>\w+)?\n(?:(?<code>[^`].+?[^`])\n)?```/gisu,
  // @ts-expect-error -- Effect's types are wrong
  (_, lang, code2) => `{code${lang != null ? `:${lang}` : ""}}
${code2 != null ? `${code2}
` : ""}{code}`
);
const code = String.replaceAll(
  /`([^`].+?[^`])`/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1) => `{{${group1}}}`
);
const bold = String.replaceAll(
  /\*\*(.+?)\*\*/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1) => `*${group1}*`
);
const strikethrough = String.replaceAll(
  /~~(.+?)~~/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, group1) => `-${group1}-`
);
const link = String.replaceAll(
  /\[(?<text>.+?)\]\((?<url>.+?)\)/giu,
  // @ts-expect-error -- Effect's types are wrong
  (_, text, url) => `[${text}|${url}]`
);
const list = String.replaceAll(
  /^(?<indent>\s*)(?<list>-|\*|\+|(?:\d+\.))\s+(?<item>.+)$/gimu,
  // @ts-expect-error -- Effect's types are wrong
  (_, indent, list2, item) => (
    // TODO: the `4` here is an assumption about the amount of indent in Markdown
    `${indent.includes("\n") ? "\n" : ""}${(["*", "-", "+"].includes(list2) ? "*" : "#").repeat(indent.length / 4 + 1)} ${item}`
  )
);
const table = String.replaceAll(
  /^(\|[^\n]+\|\r?\n)((?:\|:?[- :]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?$/gmu,
  // @ts-expect-error -- Effect's types are wrong
  (_, header, __, rows) => `${header.replaceAll("|", "||").replace(/\n$/gu, "")}${rows}`
);
export {
  bold,
  code,
  code_block,
  heading,
  link,
  list,
  strikethrough,
  table
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3N5bnRheC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgU3RyaW5nIH0gZnJvbSAnZWZmZWN0JztcblxuZXhwb3J0IGNvbnN0IGhlYWRpbmcgPSBTdHJpbmcucmVwbGFjZUFsbChcbiAgL14oIyspXFxzKy9naW11LFxuICAvLyBAdHMtZXhwZWN0LWVycm9yIC0tIEVmZmVjdCdzIHR5cGVzIGFyZSB3cm9uZ1xuICAoXywgZ3JvdXAxOiBzdHJpbmcpID0+IGBoJHtncm91cDEuc3BsaXQoJyMnKS5sZW5ndGggLSAxfS4gYCxcbik7XG5cbmV4cG9ydCBjb25zdCBjb2RlX2Jsb2NrID0gU3RyaW5nLnJlcGxhY2VBbGwoXG4gIC9gYGAoPzxsYW5nPlxcdyspP1xcbig/Oig/PGNvZGU+W15gXS4rP1teYF0pXFxuKT9gYGAvZ2lzdSxcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciAtLSBFZmZlY3QncyB0eXBlcyBhcmUgd3JvbmdcbiAgKF8sIGxhbmc6IHN0cmluZyB8IG51bGwsIGNvZGU6IHN0cmluZyB8IHVuZGVmaW5lZCkgPT5cbiAgICBge2NvZGUke2xhbmcgIT0gbnVsbCA/IGA6JHtsYW5nfWAgOiAnJ319XFxuJHtjb2RlICE9IG51bGwgPyBgJHtjb2RlfVxcbmAgOiAnJ317Y29kZX1gLFxuKTtcblxuZXhwb3J0IGNvbnN0IGNvZGUgPSBTdHJpbmcucmVwbGFjZUFsbChcbiAgL2AoW15gXS4rP1teYF0pYC9naXUsXG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgLS0gRWZmZWN0J3MgdHlwZXMgYXJlIHdyb25nXG4gIChfLCBncm91cDE6IHN0cmluZykgPT4gYHt7JHtncm91cDF9fX1gLFxuKTtcblxuZXhwb3J0IGNvbnN0IGJvbGQgPSBTdHJpbmcucmVwbGFjZUFsbChcbiAgL1xcKlxcKiguKz8pXFwqXFwqL2dpdSxcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciAtLSBFZmZlY3QncyB0eXBlcyBhcmUgd3JvbmdcbiAgKF8sIGdyb3VwMTogc3RyaW5nKSA9PiBgKiR7Z3JvdXAxfSpgLFxuKTtcblxuZXhwb3J0IGNvbnN0IHN0cmlrZXRocm91Z2ggPSBTdHJpbmcucmVwbGFjZUFsbChcbiAgL35+KC4rPyl+fi9naXUsXG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgLS0gRWZmZWN0J3MgdHlwZXMgYXJlIHdyb25nXG4gIChfLCBncm91cDE6IHN0cmluZykgPT4gYC0ke2dyb3VwMX0tYCxcbik7XG5cbmV4cG9ydCBjb25zdCBsaW5rID0gU3RyaW5nLnJlcGxhY2VBbGwoXG4gIC9cXFsoPzx0ZXh0Pi4rPylcXF1cXCgoPzx1cmw+Lis/KVxcKS9naXUsXG4gIC8vIEB0cy1leHBlY3QtZXJyb3IgLS0gRWZmZWN0J3MgdHlwZXMgYXJlIHdyb25nXG4gIChfLCB0ZXh0OiBzdHJpbmcsIHVybDogc3RyaW5nKSA9PiBgWyR7dGV4dH18JHt1cmx9XWAsXG4pO1xuXG5leHBvcnQgY29uc3QgbGlzdCA9IFN0cmluZy5yZXBsYWNlQWxsKFxuICAvXig/PGluZGVudD5cXHMqKSg/PGxpc3Q+LXxcXCp8XFwrfCg/OlxcZCtcXC4pKVxccysoPzxpdGVtPi4rKSQvZ2ltdSxcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciAtLSBFZmZlY3QncyB0eXBlcyBhcmUgd3JvbmdcbiAgKF8sIGluZGVudDogc3RyaW5nLCBsaXN0OiAnLScgfCAnKicgfCBgJHtudW1iZXJ9LmAsIGl0ZW06IHN0cmluZykgPT5cbiAgICAvLyBUT0RPOiB0aGUgYDRgIGhlcmUgaXMgYW4gYXNzdW1wdGlvbiBhYm91dCB0aGUgYW1vdW50IG9mIGluZGVudCBpbiBNYXJrZG93blxuICAgIGAke2luZGVudC5pbmNsdWRlcygnXFxuJykgPyAnXFxuJyA6ICcnfSR7KFsnKicsICctJywgJysnXS5pbmNsdWRlcyhsaXN0KVxuICAgICAgPyAnKidcbiAgICAgIDogJyMnXG4gICAgKS5yZXBlYXQoaW5kZW50Lmxlbmd0aCAvIDQgKyAxKX0gJHtpdGVtfWAsXG4pO1xuXG5leHBvcnQgY29uc3QgdGFibGUgPSBTdHJpbmcucmVwbGFjZUFsbChcbiAgL14oXFx8W15cXG5dK1xcfFxccj9cXG4pKCg/OlxcfDo/Wy0gOl0rOj8pK1xcfCkoXFxuKD86XFx8W15cXG5dK1xcfFxccj9cXG4/KSopPyQvZ211LFxuICAvLyBAdHMtZXhwZWN0LWVycm9yIC0tIEVmZmVjdCdzIHR5cGVzIGFyZSB3cm9uZ1xuICAoXywgaGVhZGVyOiBzdHJpbmcsIF9fLCByb3dzOiBzdHJpbmcpID0+XG4gICAgYCR7aGVhZGVyLnJlcGxhY2VBbGwoJ3wnLCAnfHwnKS5yZXBsYWNlKC9cXG4kL2d1LCAnJyl9JHtyb3dzfWAsXG4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBQUEsU0FBUyxjQUFjO0FBRWhCLE1BQU0sVUFBVSxPQUFPO0FBQUEsRUFDNUI7QUFBQTtBQUFBLEVBRUEsQ0FBQyxHQUFHLFdBQW1CLElBQUksT0FBTyxNQUFNLEdBQUcsRUFBRSxTQUFTLENBQUM7QUFDekQ7QUFFTyxNQUFNLGFBQWEsT0FBTztBQUFBLEVBQy9CO0FBQUE7QUFBQSxFQUVBLENBQUMsR0FBRyxNQUFxQkEsVUFDdkIsUUFBUSxRQUFRLE9BQU8sSUFBSSxJQUFJLEtBQUssRUFBRTtBQUFBLEVBQU1BLFNBQVEsT0FBTyxHQUFHQSxLQUFJO0FBQUEsSUFBTyxFQUFFO0FBQy9FO0FBRU8sTUFBTSxPQUFPLE9BQU87QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFFQSxDQUFDLEdBQUcsV0FBbUIsS0FBSyxNQUFNO0FBQ3BDO0FBRU8sTUFBTSxPQUFPLE9BQU87QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFFQSxDQUFDLEdBQUcsV0FBbUIsSUFBSSxNQUFNO0FBQ25DO0FBRU8sTUFBTSxnQkFBZ0IsT0FBTztBQUFBLEVBQ2xDO0FBQUE7QUFBQSxFQUVBLENBQUMsR0FBRyxXQUFtQixJQUFJLE1BQU07QUFDbkM7QUFFTyxNQUFNLE9BQU8sT0FBTztBQUFBLEVBQ3pCO0FBQUE7QUFBQSxFQUVBLENBQUMsR0FBRyxNQUFjLFFBQWdCLElBQUksSUFBSSxJQUFJLEdBQUc7QUFDbkQ7QUFFTyxNQUFNLE9BQU8sT0FBTztBQUFBLEVBQ3pCO0FBQUE7QUFBQSxFQUVBLENBQUMsR0FBRyxRQUFnQkMsT0FBZ0M7QUFBQTtBQUFBLElBRWxELEdBQUcsT0FBTyxTQUFTLElBQUksSUFBSSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxHQUFHLEVBQUUsU0FBU0EsS0FBSSxJQUNqRSxNQUNBLEtBQ0YsT0FBTyxPQUFPLFNBQVMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJO0FBQUE7QUFDM0M7QUFFTyxNQUFNLFFBQVEsT0FBTztBQUFBLEVBQzFCO0FBQUE7QUFBQSxFQUVBLENBQUMsR0FBRyxRQUFnQixJQUFJLFNBQ3RCLEdBQUcsT0FBTyxXQUFXLEtBQUssSUFBSSxFQUFFLFFBQVEsU0FBUyxFQUFFLENBQUMsR0FBRyxJQUFJO0FBQy9EOyIsCiAgIm5hbWVzIjogWyJjb2RlIiwgImxpc3QiXQp9Cg==
