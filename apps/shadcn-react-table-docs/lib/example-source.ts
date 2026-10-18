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

/**
 * Every source file of examples/<name> the playground shows, in tree order
 * (see listExampleFiles): `TS.tsx` first, then folders before files.
 */
export async function readExampleFiles(name: string): Promise<ExampleFile[]> {
  const dir = path.join(process.cwd(), 'examples', name);
  const paths = await listExampleFiles(dir);
  return Promise.all(
    paths.map(async (rel) => ({
      path: rel,
      source: stripDirective(await fs.readFile(path.join(dir, rel), 'utf8')),
    })),
  );
}
