import { promises as fs } from 'node:fs';
import path from 'node:path';
import { registryRef } from '@/lib/shared';

export const revalidate = false;

/** Registry item addresses in the skill file, with the branch ref applied. */
const ITEM_ADDRESS = /anindosarker\/shadcn-table\/([\w<>-]+)/g;

/**
 * The agent skill, served from skills/shadcn-table/SKILL.md at the
 * repo root (the same file `npx skills add` installs). Item addresses get
 * the branch ref while the registry is served from a branch.
 */
export async function GET() {
  const file = path.join(
    process.cwd(),
    '../../skills/shadcn-table/SKILL.md',
  );
  const text = (await fs.readFile(file, 'utf8')).replace(
    ITEM_ADDRESS,
    (_, item: string) => registryRef(item),
  );
  return new Response(text, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
