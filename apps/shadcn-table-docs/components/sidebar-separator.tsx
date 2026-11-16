'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import {
  findSiblings,
  separatorHasPages,
  separatorPages,
} from '@/lib/page-tree-utils';
import { SidebarGroupContext } from '@/components/sidebar-group-context';
import { SidebarItem } from '@/components/sidebar-item';

/**
 * Sub-group label inside a section ("---Props and Options---" in meta.json),
 * rendered together with its pages as one element. Hidden until at least one
 * page exists between it and the next separator.
 */
export function SidebarSeparator({ item }: { item: PageTree.Separator }) {
  const { root } = useTreeContext();
  const siblings = findSiblings(root, item);
  if (!siblings || !separatorHasPages(item, siblings)) return null;

  // The label is sticky in the sidebar scroll area. Its group (label plus
  // pages) is its own element, so the label sticks only while its group is
  // in view and the next group's label pushes it out. The group inherits the
  // list's gap, so rows keep their spacing; fumadocs renders the same pages
  // flat after this, and components/sidebar-item.tsx skips them there.
  // Opaque so rows do not show through; the dashed line shows only while
  // stuck (app/global.css .sidebar-sticky-label). Inside a folder with a
  // sticky heading, --sidebar-stick-top puts it below that; -1rem cancels the
  // scroll area padding (fumadocs SidebarViewport p-4).
  return (
    <div className="flex flex-col gap-[inherit]">
      <p
        data-subgroup
        className="sidebar-sticky-label sticky top-[calc(var(--sidebar-stick-top,0px)-1rem)] z-10 mt-2 flex w-full bg-fd-background"
      >
        <span className="flex w-full items-center gap-2 px-2 py-1 font-mono text-[9px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground">
          {item.icon}
          {item.name}
        </span>
      </p>
      <SidebarGroupContext value>
        {separatorPages(item, siblings).map((page) => (
          <SidebarItem key={page.$id ?? page.url} item={page} />
        ))}
      </SidebarGroupContext>
    </div>
  );
}
