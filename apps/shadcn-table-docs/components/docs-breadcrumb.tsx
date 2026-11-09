'use client';

import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/notebook/page';
import { ChevronRight } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import { docsRoute } from '@/lib/shared';
import { cn } from '@/lib/cn';
import { PageSwitcher } from '@/components/page-switcher';

/** Passed to the DocsPage breadcrumb slot: the page renders its own in the bar. */
export function NoBreadcrumb() {
  return null;
}

/**
 * Full breadcrumb path (Docs › Section › Page), all muted. fumadocs' own
 * breadcrumb omits the tree root and tints the last item, so this replaces it.
 * The last crumb is the page switcher when the page sits in a top-level
 * section; pages outside a section keep plain text.
 */
export function DocsBreadcrumb({
  includeRoot: _includeRoot,
  includeSeparator: _includeSeparator,
  includePage: _includePage,
  className,
  ...props
}: BreadcrumbProps) {
  const path = useTreePath();
  const { root, full } = useTreeContext();
  const items = useMemo(
    () => [
      { name: 'Docs', url: docsRoute },
      // Each section is a root folder, whose crumb fumadocs drops; name it
      // and link its first page (Overview, or Introduction).
      ...getBreadcrumbItemsFromPath(root, path, {
        includePage: true,
        includeRoot: root === full ? false : { url: firstPageUrl(root) ?? '' },
      }),
    ],
    [path, root, full],
  );
  const section = path[0];
  const current = path[path.length - 1];
  const switcher =
    section?.type === 'folder' && current?.type === 'page' ? (
      <PageSwitcher section={section} current={current} />
    ) : null;

  return (
    <div
      {...props}
      className={cn(
        'flex min-w-0 items-center gap-1.5 text-sm text-fd-muted-foreground',
        className,
      )}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
            {last && switcher ? (
              switcher
            ) : item.url && !last ? (
              <Link
                href={item.url}
                className="shrink-0 truncate transition-colors hover:text-fd-foreground"
              >
                {item.name}
              </Link>
            ) : (
              <span className="truncate">{item.name}</span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

/** URL of the first page under `node`, in tree order. */
function firstPageUrl(
  node: PageTree.Root | PageTree.Folder,
): string | undefined {
  if ('index' in node && node.index) return node.index.url;
  for (const child of node.children) {
    if (child.type === 'page') return child.url;
    if (child.type === 'folder') {
      const url = firstPageUrl(child);
      if (url) return url;
    }
  }
  return undefined;
}
