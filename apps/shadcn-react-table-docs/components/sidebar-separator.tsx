'use client';

import type * as PageTree from 'fumadocs-core/page-tree';

/** Sub-group label inside a section ("---Props and Options---" in meta.json). */
export function SidebarSeparator({ item }: { item: PageTree.Separator }) {
  return (
    <p className="mb-1 mt-4 inline-flex items-center gap-2 px-2 text-[11px] font-bold uppercase leading-none tracking-[0.075em] text-fd-muted-foreground">
      {item.icon}
      {item.name}
    </p>
  );
}
