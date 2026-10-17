'use client';

import Link from 'fumadocs-core/link';
import { getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/notebook/page';
import { ChevronRight } from 'lucide-react';
import { Fragment, useMemo } from 'react';
import { docsRoute } from '@/lib/shared';
import { cn } from '@/lib/cn';

/**
 * Full breadcrumb path (Docs › Section › Page), all muted. fumadocs' own
 * breadcrumb omits the tree root and tints the last item, so this replaces it.
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

  return (
    <div
      {...props}
      className={cn(
        'flex flex-wrap items-center gap-1.5 text-sm text-fd-muted-foreground',
        className,
      )}
    >
      {items.map((item, i) => (
        <Fragment key={i}>
          {i !== 0 && <ChevronRight className="size-3.5 shrink-0" />}
          {item.url && i !== items.length - 1 ? (
            <Link
              href={item.url}
              className="truncate transition-colors hover:text-fd-foreground"
            >
              {item.name}
            </Link>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
