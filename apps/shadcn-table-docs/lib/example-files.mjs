/**
 * Source files of one docs example folder (examples/<base>/<slug>/). Shared by
 * tools/registry/examples.mjs (the registry item's
 * files) and lib/example-variants.mjs (the playground's code explorer sources,
 * read by lib/example-source.ts), so both see the same files in the same order.
 *
 * Plain ESM so the Node script can import it without a TypeScript loader;
 * tsconfig has `allowJs`, so the app imports it with types from the JSDoc.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Strips the leading 'use client' directive: a Next.js requirement, not part
 * of the example. lib/example-variants.mjs applies it to the code-view sources
 * it writes (examples/.<base>/sources.json).
 * @param {string} src
 */
export const stripDirective = (src) =>
  src.replace(/^'use client';\r?\n(\r?\n)?/, '');

/** The example's entry file, always listed first. */
export const ENTRY_FILE = 'TS.tsx';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.json']);

/**
 * Paths of every source file under `dir`, relative to it with `/`
 * separators (`hooks/useUsersQuery.ts`), in tree order: `TS.tsx` first,
 * then in each folder its subfolders before its files, both alphabetical.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
export async function listExampleFiles(dir) {
  /** @param {string} rel */
  const walk = async (rel) => {
    const entries = await fs.readdir(path.join(dir, rel), {
      withFileTypes: true,
    });
    const byName = (
      /** @type {{ name: string }} */ a,
      /** @type {{ name: string }} */ b,
    ) => a.name.localeCompare(b.name);
    /** @type {string[]} */
    const out = [];
    for (const entry of entries.filter((e) => e.isDirectory()).sort(byName)) {
      out.push(...(await walk(rel ? `${rel}/${entry.name}` : entry.name)));
    }
    for (const entry of entries.filter((e) => e.isFile()).sort(byName)) {
      const file = rel ? `${rel}/${entry.name}` : entry.name;
      if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) continue;
      if (file === ENTRY_FILE) continue;
      out.push(file);
    }
    return out;
  };
  return [ENTRY_FILE, ...(await walk(''))];
}
