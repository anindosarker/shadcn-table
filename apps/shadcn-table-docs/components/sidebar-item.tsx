'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import {
  SidebarItem as BaseSidebarItem,
  useSidebar,
} from 'fumadocs-ui/components/sidebar/base';
import {
  ITEM_CLASS,
  SECTION_CLASS,
  SECTION_LABEL_CLASS,
} from '@/components/sidebar-section';
import {
  EXAMPLES_URL,
  scrollStackTo,
  useLocationHash,
} from '@/lib/examples-url';

/**
 * Sidebar page row. Pages render like the notebook layout's own items.
 * External links ("external:[Name](url)" in the top-level meta.json) close
 * every section (lib/source.ts), so they render like a section label: the same
 * small muted label, with the external-link icon at the right end where the
 * sections show their chevron. fumadocs' default puts that icon before the
 * name, which breaks the row's alignment with the labels.
 * On the examples stack the example rows link to their block
 * (`/docs/examples#<slug>`) and scroll the stack instead of leaving it.
 */
export function SidebarItem({ item }: { item: PageTree.Item }) {
  const pathname = usePathname();
  const hash = useLocationHash();
  const { setOpen } = useSidebar();

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

  const page = normalize(item.url);
  const onStack = normalize(pathname) === EXAMPLES_URL;
  // '' is the Overview row (the top of the stack), undefined any other page.
  const block = page === EXAMPLES_URL ? '' : exampleSlug(page);
  const stackLink = onStack && block !== undefined;

  return (
    <BaseSidebarItem
      href={stackLink && block ? `${EXAMPLES_URL}#${block}` : item.url}
      onClick={(event) => {
        if (!onStack || block === undefined || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
        if (!scrollStackTo(block)) return;
        event.preventDefault();
        // The mobile drawer closes on a pathname change, which a hash is not.
        setOpen(false);
      }}
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
