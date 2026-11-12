import type { Folder, Node, Root } from 'fumadocs-core/page-tree';
import { siteDescription, siteName, siteUrl } from './shared';
import { source } from './source';

const fenceOpen = /^\s*(`{3,}|~{3,})/;

/**
 * Index past a JSX tag that starts at `start` (a `<`): attribute strings and
 * `{...}` expressions are skipped, so a `>` inside them does not end the tag.
 */
function tagEnd(text: string, start: number): number {
  let depth = 0;
  let quote = '';
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = '';
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
    } else if (ch === '>' && depth === 0) {
      return i + 1;
    }
  }
  return text.length;
}

/**
 * Removes capitalised JSX elements, `{/* ... *\/}` comments and, inside a
 * capitalised element, lowercase tags; text children stay. A removed tag that
 * filled its line leaves a blank line, so sibling bodies stay paragraphs.
 * `depths[i]` is the element depth line `i` starts at.
 */
function stripJsx(text: string, startDepth: number) {
  let out = '';
  let depth = startDepth;
  const depths: number[] = [depth];
  for (let i = 0; i < text.length; ) {
    const ch = text[i];
    if (ch === '\n') {
      out += ch;
      i++;
      depths.push(depth);
      continue;
    }
    if (ch === '\\') {
      out += text.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (ch === '`') {
      const run = /^`+/.exec(text.slice(i))![0];
      const close = text.indexOf(run, i + run.length);
      const end = close === -1 ? i + run.length : close + run.length;
      out += text.slice(i, end);
      i = end;
      continue;
    }
    if (text.startsWith('{/*', i)) {
      const close = text.indexOf('*/}', i);
      i = close === -1 ? text.length : close + 3;
      continue;
    }
    const tag = /^<(\/?)([A-Za-z][\w.:-]*)?/.exec(text.slice(i));
    const isFragment = text.startsWith('<>', i) || text.startsWith('</>', i);
    if (
      tag &&
      (isFragment ||
        (tag[2] && (/^[A-Z]/.test(tag[2]) || (depth > 0 && tag[0].length > 1))))
    ) {
      const end = tagEnd(text, i);
      const raw = text.slice(i, end);
      if (tag[1]) depth = Math.max(0, depth - 1);
      else if (!raw.endsWith('/>')) depth++;
      i = end;
      continue;
    }
    out += ch;
    i++;
  }
  return { out, depths, depth };
}

/** Removes the common indent of each run of lines at one element depth. */
function dedentRuns(lines: string[], depths: number[]): string[] {
  const result = [...lines];
  for (let i = 0; i < lines.length; ) {
    if (!depths[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j < lines.length && depths[j] === depths[i]) j++;
    const indents = lines
      .slice(i, j)
      .filter((line) => line.trim())
      .map((line) => /^ */.exec(line)![0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    for (let k = i; k < j; k++) result[k] = lines[k].slice(cut);
    i = j;
  }
  return result;
}

/**
 * MDX to plain Markdown for agents: drops a leading frontmatter block, `import`
 * statements, capitalised JSX elements (their prose children stay) and
 * `{/* ... *\/}` comments. Fenced code blocks are never touched.
 */
export function toPlainMarkdown(text: string): string {
  let lines = text.replace(/\r\n?/g, '\n').split('\n');

  if (lines[0]?.trim() === '---') {
    const close = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
    if (close !== -1) lines = lines.slice(close + 1);
  }

  const out: string[] = [];
  const depths: number[] = [];
  let depth = 0;
  let chunk: string[] = [];

  const flush = () => {
    if (!chunk.length) return;
    const stripped = stripJsx(chunk.join('\n'), depth);
    depth = stripped.depth;
    out.push(...stripped.out.split('\n'));
    depths.push(...stripped.depths);
    chunk = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = fenceOpen.exec(line);
    if (fence) {
      flush();
      const marker = fence[1];
      const closes = new RegExp(`^\\s*${marker[0]}{${marker.length},}\\s*$`);
      let j = i + 1;
      while (j < lines.length && !closes.test(lines[j])) j++;
      for (let k = i; k <= Math.min(j, lines.length - 1); k++) {
        out.push(lines[k]);
        depths.push(depth);
      }
      i = j;
      continue;
    }
    if (/^import\s/.test(line)) {
      flush();
      let j = i;
      while (
        j < lines.length - 1 &&
        !/(from\s*['"][^'"]+['"]|^import\s*['"][^'"]+['"])\s*;?\s*$/.test(
          lines[j],
        )
      ) {
        j++;
      }
      i = j;
      continue;
    }
    chunk.push(line);
  }
  flush();

  return dedentRuns(out, depths)
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function pageLine(url: string): string | undefined {
  const page = source.getPageByUrl(url);
  if (!page) return undefined;
  const { title, description } = page.data;
  const link = `- [${title}](${siteUrl}${page.url})`;
  return description ? `${link}: ${description}` : link;
}

function collect(nodes: Node[], lines: string[]) {
  for (const node of nodes) {
    if (node.type === 'page') {
      const line = pageLine(node.url);
      if (line) lines.push(line);
    } else if (node.type === 'folder') {
      collectFolder(node, lines);
    }
  }
}

function collectFolder(folder: Folder, lines: string[]) {
  if (folder.index) {
    const line = pageLine(folder.index.url);
    if (line) lines.push(line);
  }
  collect(folder.children, lines);
}

/**
 * The llmstxt.org index: H1, one blockquote summary, then one section per
 * top-level docs folder with a link line per page.
 */
export function renderLlmsIndex(): string {
  const tree: Root = source.getPageTree();
  const sections = [`# ${siteName}`, `> ${siteDescription}`];

  for (const node of tree.children) {
    if (node.type === 'separator') continue;
    const lines: string[] = [];
    let name: string;
    if (node.type === 'folder') {
      name = source.getNodeMeta(node)?.data.title ?? String(node.name);
      collectFolder(node, lines);
    } else {
      name = String(node.name);
      collect([node], lines);
    }
    if (lines.length) sections.push(`## ${name}\n\n${lines.join('\n')}`);
  }

  return `${sections.join('\n\n')}\n`;
}
