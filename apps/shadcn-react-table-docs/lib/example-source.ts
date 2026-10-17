import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Source text of examples/<name>/TS.tsx as shown to the reader. The leading
 * 'use client' directive is a Next.js requirement, not part of the example.
 */
export async function readExampleSource(name: string) {
  const file = path.join(process.cwd(), 'examples', name, 'TS.tsx');
  const src = await fs.readFile(file, 'utf8');
  return src.replace(/^'use client';\r?\n(\r?\n)?/, '');
}
