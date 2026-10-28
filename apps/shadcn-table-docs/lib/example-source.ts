import { promises as fs } from 'node:fs';
import path from 'node:path';
import { listExampleFiles } from './example-files.mjs';
import type { Base } from './install';

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

/** examples/<base>/<name>: the base's hand-written source the code view shows. */
export const exampleDir = (name: string, base: Base) =>
  path.join(process.cwd(), 'examples', base, name);

/**
 * Every source file of examples/<base>/<name> the playground shows, in tree
 * order (see listExampleFiles): `TS.tsx` first, then folders before files.
 * The source imports `@/components/ui/...`, the path a user has after
 * install; the base's variant under examples/.<base>
 * (lib/example-variants.mjs) only feeds the live example.
 */
export async function readExampleFiles(
  name: string,
  base: Base,
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
