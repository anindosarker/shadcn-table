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
import { EXAMPLES_URL, useLocationHash } from '@/lib/examples-url';

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
  const hash = useLocationHash();

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
      active={isActive({ url: item.url, pathname, hash })}
      icon={item.icon}
      className={ITEM_CLASS}
    >
      {item.name}
    </BaseSidebarItem>
  );
}

/**
 * On the examples stack the hash names the block in view, so an example row
 * is active when its slug is the hash and the Overview row when there is none.
 */
function isActive({
  url,
  pathname,
  hash,
}: {
  url: string;
  pathname: string;
  hash: string;
}) {
  const page = normalize(url);
  if (normalize(pathname) === EXAMPLES_URL) {
    if (page === EXAMPLES_URL) return hash === '';
    const slug = exampleSlug(page);
    if (slug) return `#${slug}` === hash;
  }
  return page === normalize(pathname);
}

/** `basic` for `/docs/examples/basic`; undefined for any other page. */
function exampleSlug(page: string) {
  return page.startsWith(`${EXAMPLES_URL}/`)
    ? page.slice(EXAMPLES_URL.length + 1)
    : undefined;
}

/** Drops a trailing slash, as fumadocs does before comparing URLs. */
function normalize(url: string) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}
