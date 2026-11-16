'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { use } from 'react';
import { usePathname } from 'next/navigation';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { ExternalLinkIcon } from 'lucide-react';
import { SidebarItem as BaseSidebarItem } from 'fumadocs-ui/components/sidebar/base';
import {
  ITEM_CLASS,
  SECTION_CLASS,
  SECTION_LABEL_CLASS,
} from '@/components/sidebar-section';
import { SidebarGroupContext } from '@/components/sidebar-group-context';
import { groupedPages } from '@/lib/page-tree-utils';

/**
 * Sidebar page row. Pages render like the notebook layout's own items.
 * External links ("external:[Name](url)" in the top-level meta.json) close
 * every section (lib/source.ts), so they render like a section label: the same
 * small muted label, with the external-link icon at the right end where the
 * sections show their chevron. fumadocs' default puts that icon before the
 * name, which breaks the row's alignment with the labels.
 */
export function SidebarItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const { root } = useTreeContext();
  // A page after a "---Label---" renders inside its separator's group
  // (components/sidebar-separator.tsx); skip it in fumadocs' flat list.
  if (!use(SidebarGroupContext) && groupedPages(root).has(item)) return null;

  if (item.external) {
    return (
      <div className={SECTION_CLASS}>
        <BaseSidebarItem
          href={item.url}
          external
          // An empty icon keeps fumadocs from adding its leading ExternalLink.
          icon={<></>}
          // app/global.css styles sidebar page links; data-external opts this
          // label row out of that rule.
          data-external=""
          className={`${SECTION_LABEL_CLASS} justify-between`}
        >
          {item.name}
          <ExternalLinkIcon className="size-3.5 shrink-0" />
        </BaseSidebarItem>
      </div>
    );
  }

  return (
    <BaseSidebarItem
      href={item.url}
      active={normalize(item.url) === normalize(pathname)}
      icon={item.icon}
      className={ITEM_CLASS}
    >
      {item.name}
    </BaseSidebarItem>
  );
}

/** Drops a trailing slash, as fumadocs does before comparing URLs. */
function normalize(url: string) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}
