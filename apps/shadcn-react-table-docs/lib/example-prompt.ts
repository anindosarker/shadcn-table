// Server only: reads the registry and example sources from disk. Import it
// from server components (ExampleSnippet), never from client code.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  findExamplePage,
  loadExamplePages,
  readExampleExportName,
} from './example-pages.mjs';
import { readExampleSource } from './example-source';
import { absoluteMarkdownUrl, registryRef } from './shared';

interface RegistryItem {
  name: string;
  title: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

/** Where `shadcn add` puts the example files (registry.json `target`). */
const INSTALL_DIR = 'components/examples';

/** The `shadcn add` command installing examples/<name>. */
export const buildInstallCommand = (name: string) =>
  `pnpm dlx shadcn@latest add ${registryRef(`example-${name}`)}`;

async function readRegistryItem(name: string): Promise<RegistryItem> {
  const file = path.join(process.cwd(), 'registry.json');
  const registry = JSON.parse(await fs.readFile(file, 'utf8')) as {
    items: RegistryItem[];
  };
  const item = registry.items.find((i) => i.name === `example-${name}`);
  if (!item) {
    throw new Error(
      `registry.json has no item "example-${name}"; run scripts/build-registry-items.mjs`,
    );
  }
  return item;
}

/**
 * Top-level keys of the object literal passed to the first
 * `useShadcnReactTable(...)` call: a brace-balanced scan that skips strings,
 * template literals, comments and nested brackets. Quoted keys count by
 * their content; spreads and computed keys are skipped. Regex literals are
 * not recognised, so a `{` or quote inside one can derail the scan. Empty
 * when the source has no such call or the argument is not an object literal.
 */
export function tableOptionKeys(source: string): string[] {
  // The call, not the import: the name followed by an optional type argument
  // list and the opening parenthesis.
  const call = /\buseShadcnReactTable\s*(?:<[^()]*>)?\s*\(/.exec(source);
  if (!call) return [];
  const paren = call.index + call[0].length - 1;
  const brace = skipTrivia(source, paren + 1);
  if (source[brace] !== '{') return [];

  const keys: string[] = [];
  let depth = 0;
  let i = brace;
  let atKey = false;
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === '/' && next === '/') {
      i = source.indexOf('\n', i);
      if (i === -1) break;
      continue;
    }
    if (ch === '/' && next === '*') {
      i = source.indexOf('*/', i + 2);
      if (i === -1) break;
      i += 2;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const end = skipString(source, i);
      if (depth === 1 && atKey && ch !== '`') {
        // Quoted key: `'foo': value`.
        keys.push(source.slice(i + 1, end - 1));
        atKey = false;
      }
      i = end;
      continue;
    }
    if (ch === '{' || ch === '[' || ch === '(') {
      depth += 1;
      atKey = depth === 1;
      i += 1;
      continue;
    }
    if (ch === '}' || ch === ']' || ch === ')') {
      depth -= 1;
      if (depth === 0) break;
      i += 1;
      continue;
    }
    if (depth === 1 && ch === ',') {
      atKey = true;
      i += 1;
      continue;
    }
    if (depth === 1 && atKey && /[A-Za-z_$]/.test(ch)) {
      const match = /^[A-Za-z_$][\w$]*/.exec(source.slice(i));
      if (match) {
        keys.push(match[0]);
        atKey = false;
        i += match[0].length;
        continue;
      }
    }
    if (depth === 1 && atKey && ch === '.' && source.startsWith('...', i)) {
      // Spread: not a named option.
      atKey = false;
      i += 3;
      continue;
    }
    i += 1;
  }
  return keys;
}

/** Index of the first character at or after `start` that is not whitespace or a comment. */
function skipTrivia(source: string, start: number) {
  let i = start;
  while (i < source.length) {
    if (/\s/.test(source[i])) {
      i += 1;
    } else if (source.startsWith('//', i)) {
      const end = source.indexOf('\n', i);
      if (end === -1) return source.length;
      i = end;
    } else if (source.startsWith('/*', i)) {
      const end = source.indexOf('*/', i + 2);
      if (end === -1) return source.length;
      i = end + 2;
    } else {
      return i;
    }
  }
  return i;
}

/** Index just past the string literal starting at `start`. */
function skipString(source: string, start: number) {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === quote) return i + 1;
    if (quote === '`' && ch === '$' && source[i + 1] === '{') {
      // Template expression: balance its braces, strings inside included.
      let depth = 1;
      i += 2;
      while (i < source.length && depth > 0) {
        const c = source[i];
        if (c === "'" || c === '"' || c === '`') {
          i = skipString(source, i);
          continue;
        }
        if (c === '{') depth += 1;
        if (c === '}') depth -= 1;
        i += 1;
      }
      continue;
    }
    i += 1;
  }
  return i;
}

/**
 * Prompt a reader pastes into their coding agent to add examples/<name> to
 * their project: install command, import path, docs to read before changing
 * table options, and how to verify.
 */
export async function buildExamplePrompt({
  name,
}: {
  name: string;
}): Promise<string> {
  const [item, source, pages, exportName] = await Promise.all([
    readRegistryItem(name),
    readExampleSource(name),
    loadExamplePages(path.join(process.cwd(), 'content', 'docs', 'examples')),
    readExampleExportName(path.join(process.cwd(), 'examples', name)),
  ]);
  const page = findExamplePage({ slug: name, exportName }, pages);
  const deps = item.dependencies ?? [];
  const keys = tableOptionKeys(source);

  const lines = [
    `Add the "${item.title}" example of shadcn-react-table to this project.`,
    '',
    `1. Run: ${buildInstallCommand(name)}`,
    `   It installs the example into ${INSTALL_DIR}/${name}/ and, if missing,`,
    `   shadcn-react-table itself with its dependencies${deps.length ? `, plus: ${deps.join(', ')}` : ''}.`,
    `2. Import the default export from "@/${INSTALL_DIR}/${name}/${name}" and render it`,
    '   where the table belongs.',
  ];
  const read = page
    ? [
        `3. Read before changing options: ${absoluteMarkdownUrl(['examples', page.slug])}`,
      ]
    : ['3. Before changing options, read the references below.'];
  if (keys.length) read.push(`   Table options used: ${keys.join(', ')}`);
  read.push(
    `   Reference: ${absoluteMarkdownUrl(['api', 'table-options'])}, ${absoluteMarkdownUrl(['api', 'column-options'])}`,
  );
  lines.push(
    ...read,
    '4. Verify: the project type-checks and the table renders with its rows.',
  );
  return lines.join('\n');
}
