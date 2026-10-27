'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { findSiblings, separatorHasPages } from '@/lib/page-tree-utils';

/**
 * Sub-group label inside a section ("---Props and Options---" in meta.json).
 * Hidden until at least one page exists between it and the next separator.
 */
export function SidebarSeparator({ item }: { item: PageTree.Separator }) {
  const { root } = useTreeContext();
  const siblings = findSiblings(root, item);
  if (!siblings || !separatorHasPages(item, siblings)) return null;

  return (
    <p
      data-subgroup
      className="mb-1 mt-3 inline-flex items-center gap-2 ps-5 pe-2 font-mono text-[11px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground"
    >
      {item.icon}
      {item.name}
    </p>
  );
}
