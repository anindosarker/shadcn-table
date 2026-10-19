import { promises as fs } from 'node:fs';
import path from 'node:path';
import { listExampleFiles } from './example-files.mjs';
import { BASE_VARIANT_DIR } from './example-variant-dir.mjs';
import { defaultBase, type Base } from './install';

export interface ExampleFile {
  /** Path relative to the example folder, for example `hooks/useUsersQuery.ts`. */
  path: string;
  source: string;
}

/**
 * Strips the leading 'use client' directive: a Next.js requirement, not part
 * of the example.
 */
const stripDirective = (src: string) =>
  src.replace(/^'use client';\r?\n(\r?\n)?/, '');

/** examples/<name> for Radix, examples/.base/<name> for the Base UI variant. */
export const exampleDir = (name: string, base: Base = defaultBase) =>
  base === 'radix'
    ? path.join(process.cwd(), 'examples', name)
    : path.join(process.cwd(), 'examples', BASE_VARIANT_DIR, name);

/**
 * Every source file of examples/<name> the playground shows, in tree order
 * (see listExampleFiles): `TS.tsx` first, then folders before files. On the
 * Base UI base the generated variant (lib/example-variants.mjs), whose
 * imports point at components/ui-base.
 */
export async function readExampleFiles(
  name: string,
  base: Base = defaultBase,
): Promise<ExampleFile[]> {
  const dir = exampleDir(name, base);
  const paths = await listExampleFiles(dir);
  return Promise.all(
    paths.map(async (rel) => ({
      path: rel,
      source: stripDirective(await fs.readFile(path.join(dir, rel), 'utf8')),
    })),
  );
}
