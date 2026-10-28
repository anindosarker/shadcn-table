#!/usr/bin/env node
/**
 * Per-base variants of the docs examples. examples/<edition>/<slug>/ is that
 * edition's hand-written source (packages/shadcn-table/scripts/registry/editions.mjs
 * lists the editions, pnpm check:bases keeps the three sets in step). It
 * imports `@/components/ui/...`, the path a user has after `shadcn add`; the
 * code view shows it as is. The docs app installs the three library copies
 * side by side (`pnpm lib:install <base>`, under components/ui-<base>), so
 * for each base every source file of examples/<base>/<slug>/ is copied to
 * examples/<variant dir>/<slug>/* (gitignored, folder names in
 * lib/example-variant-dir.mjs) with its `@/components/ui/` imports pointed
 * at `@/components/ui-<base>/`. Nothing else changes: an example that needs
 * other code on a base has it written in that base's folder.
 * components/example-variant.tsx lazy-loads the variant for the selected
 * base; the output is formatted with the repo's prettier config.
 *
 * Runs before `next build` and `next dev` (package.json `build`, `predev`)
 * and from `pnpm examples:variants`. Stale variant folders are removed.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import { listExampleFiles } from './example-files.mjs';
import { VARIANT_DIRS } from './example-variant-dir.mjs';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLES = path.join(APP, 'examples');

/**
 * `@/components/ui/<part>` and `@/components/ui/shadcn-table...` imports to
 * the base's installed copy. Both quote styles; nothing else changes.
 * @param {string} source
 * @param {keyof typeof VARIANT_DIRS} base
 */
export const rewriteImports = (source, base) =>
  source.replace(
    /(['"])@\/components\/ui\//g,
    `$1@/components/ui-${base}/`,
  );

/**
 * One base's variant of one example source file, formatted.
 * @param {{ source: string, fileName: string, base: keyof typeof VARIANT_DIRS }} file
 *   fileName is absolute, for prettier's parser choice
 */
export const toVariant = async ({ source, fileName, base }) => {
  const text = rewriteImports(source, base);
  if (text === source) return source;
  const config = await prettier.resolveConfig(fileName);
  return prettier.format(text, { ...config, filepath: fileName });
};

/** The example slugs of one edition folder: every directory with a TS.tsx. */
const listSlugs = async (dir) => {
  const slugs = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      await fs.access(path.join(dir, entry.name, 'TS.tsx'));
    } catch {
      continue;
    }
    slugs.push(entry.name);
  }
  return slugs.sort();
};

async function main() {
  for (const [base, variantDir] of Object.entries(VARIANT_DIRS)) {
    const sourceRoot = path.join(EXAMPLES, base);
    const out = path.join(EXAMPLES, variantDir);
    const slugs = await listSlugs(sourceRoot);
    let files = 0;
    for (const slug of slugs) {
      const dir = path.join(sourceRoot, slug);
      for (const rel of await listExampleFiles(dir)) {
        const source = await fs.readFile(path.join(dir, rel), 'utf8');
        const target = path.join(out, slug, rel);
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(
          target,
          await toVariant({ source, fileName: target, base }),
        );
        files += 1;
      }
    }
    // Variant folders whose example is gone.
    const kept = new Set(slugs);
    await fs.mkdir(out, { recursive: true });
    for (const entry of await fs.readdir(out, { withFileTypes: true })) {
      if (entry.isDirectory() && !kept.has(entry.name)) {
        await fs.rm(path.join(out, entry.name), { recursive: true });
      }
    }
    console.log(
      `examples/${variantDir}: ${slugs.length} examples, ${files} files`,
    );
  }
}

await main();
