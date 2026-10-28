import { promises as fs } from 'node:fs';
import path from 'node:path';
import { listExampleFiles } from './example-files.mjs';

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

/** examples/<name>: the base-neutral source the code view shows. */
export const exampleDir = (name: string) =>
  path.join(process.cwd(), 'examples', name);

/**
 * Every source file of examples/<name> the playground shows, in tree order
 * (see listExampleFiles): `TS.tsx` first, then folders before files. One
 * set for every base: the source imports `@/components/ui/...`, the path a
 * user has after install; the per-base variants under examples/.radix,
 * examples/.base and examples/.aria (lib/example-variants.mjs) only feed the
 * live example.
 */
export async function readExampleFiles(name: string): Promise<ExampleFile[]> {
  const dir = exampleDir(name);
  const paths = await listExampleFiles(dir);
  return Promise.all(
    paths.map(async (rel) => ({
      path: rel,
      source: stripDirective(await fs.readFile(path.join(dir, rel), 'utf8')),
    })),
  );
}
