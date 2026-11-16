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

  // Sticky in the sidebar scroll area: the label of the group at the top of
  // the list stays there until the next label slides over it (labels and rows
  // are siblings of one list). Opaque so rows do not show through; the dashed
  // line shows only while stuck (app/global.css .sidebar-sticky-label). Inside
  // a folder with a sticky heading, --sidebar-stick-top puts it below that;
  // -1rem cancels the scroll area padding (fumadocs SidebarViewport p-4).
  return (
    <p
      data-subgroup
      className="sidebar-sticky-label sticky top-[calc(var(--sidebar-stick-top,0px)-1rem)] z-10 mt-2 flex w-full bg-fd-background"
    >
      <span className="flex w-full items-center gap-2 px-2 py-1 font-mono text-[9px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground">
        {item.icon}
        {item.name}
      </span>
    </p>
  );
}
