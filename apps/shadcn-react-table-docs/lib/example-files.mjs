/**
 * Source files of one docs example folder (examples/<slug>/). Shared by
 * scripts/build-registry-items.mjs (the registry item's files) and
 * lib/example-source.ts (the playground's code explorer), so both see the
 * same files in the same order.
 *
 * Plain ESM so the Node script can import it without a TypeScript loader;
 * tsconfig has `allowJs`, so the app imports it with types from the JSDoc.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

/** The example's entry file, always listed first. */
export const ENTRY_FILE = 'TS.tsx';

/** The docs wrapper at the example root: renders the playground, not part of the example. */
const WRAPPER_FILE = 'index.tsx';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.json']);

/**
 * Paths of every source file under `dir`, relative to it with `/`
 * separators (`hooks/useUsersQuery.ts`), in tree order: `TS.tsx` first,
 * then in each folder its subfolders before its files, both alphabetical.
 * The root `index.tsx` wrapper is left out.
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
      if (file === WRAPPER_FILE || file === ENTRY_FILE) continue;
      out.push(file);
    }
    return out;
  };
  return [ENTRY_FILE, ...(await walk(''))];
}
