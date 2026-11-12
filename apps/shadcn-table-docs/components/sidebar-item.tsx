'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import { SidebarItem as BaseSidebarItem } from 'fumadocs-ui/components/sidebar/base';
import {
  ITEM_CLASS,
  SECTION_CLASS,
  SECTION_LABEL_CLASS,
} from '@/components/sidebar-section';

/**
 * Sidebar page row. Pages render like the notebook layout's own items.
 * External links ("external:[Name](url)" in meta.json) sit at the top level
 * of the tree, so they render like the section labels beside them: the same
 * small muted label, with the external-link icon at the right end where the
 * sections show their chevron. fumadocs' default puts that icon before the
 * name, which breaks the row's alignment with the labels.
 */
export function SidebarItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();

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
