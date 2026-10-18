'use client';

import Link from 'fumadocs-core/link';
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
  const { root } = useTreeContext();
  const items = useMemo(
    () => [
      { name: 'Docs', url: docsRoute },
      ...getBreadcrumbItemsFromPath(root, path, { includePage: true }),
    ],
    [path, root],
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
