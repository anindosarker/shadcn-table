import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Base } from './install';

export interface ExampleFile {
  /** Path relative to the example folder, for example `hooks/useUsersQuery.ts`. */
  path: string;
  source: string;
}

type ExampleSources = Record<string, ExampleFile[]>;

/**
 * examples/.<base>/sources.json per base, written by lib/example-variants.mjs
 * (before `build`, `predev` and `types:check`). One literal path per base, so
 * the bundler resolves each file at build time instead of tracing the whole
 * examples tree.
 */
const SOURCES: Record<Base, () => Promise<string>> = {
  base: () =>
    fs.readFile(
      path.join(process.cwd(), 'examples/.base/sources.json'),
      'utf8',
    ),
  radix: () =>
    fs.readFile(
      path.join(process.cwd(), 'examples/.radix/sources.json'),
      'utf8',
    ),
  aria: () =>
    fs.readFile(
      path.join(process.cwd(), 'examples/.aria/sources.json'),
      'utf8',
    ),
};

/**
 * Every source file of examples/<base>/<name> the playground shows, in tree
 * order (see listExampleFiles in lib/example-files.mjs): `TS.tsx` first, then
 * folders before files, the leading 'use client' directive stripped. The
 * source imports `@/components/ui/...`, the path a user has after install; the
 * base's variant under examples/.<base> (lib/example-variants.mjs) only feeds
 * the live example.
 */
export async function readExampleFiles(
  name: string,
  base: Base,
): Promise<ExampleFile[]> {
  const sources = JSON.parse(await SOURCES[base]()) as ExampleSources;
  const files = Object.hasOwn(sources, name) ? sources[name] : undefined;
  if (!files) {
    throw new Error(`No example "${name}" in examples/${base}`);
  }
  return files;
}
