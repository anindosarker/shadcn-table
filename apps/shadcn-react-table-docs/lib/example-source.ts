import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface ExampleFile {
  /** File name as shown on the playground tab, for example `TS.tsx`. */
  name: string;
  source: string;
}

/**
 * Strips the leading 'use client' directive: a Next.js requirement, not part
 * of the example.
 */
const stripDirective = (src: string) =>
  src.replace(/^'use client';\r?\n(\r?\n)?/, '');

/** Source text of examples/<name>/TS.tsx as shown to the reader. */
export async function readExampleSource(name: string) {
  const file = path.join(process.cwd(), 'examples', name, 'TS.tsx');
  return stripDirective(await fs.readFile(file, 'utf8'));
}

/**
 * Every source file of examples/<name> the playground shows: `TS.tsx` first,
 * then `makeData.ts` when the example has one.
 */
export async function readExampleFiles(name: string): Promise<ExampleFile[]> {
  const dir = path.join(process.cwd(), 'examples', name);
  const files: ExampleFile[] = [
    { name: 'TS.tsx', source: await readExampleSource(name) },
  ];
  const makeData = await fs
    .readFile(path.join(dir, 'makeData.ts'), 'utf8')
    .catch(() => null);
  if (makeData !== null) {
    files.push({ name: 'makeData.ts', source: stripDirective(makeData) });
  }
  return files;
}
