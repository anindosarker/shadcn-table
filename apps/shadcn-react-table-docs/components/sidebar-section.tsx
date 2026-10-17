'use client';

import type { ComponentProps } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { hasPages } from '@/lib/page-tree-utils';

/**
 * Renders a top-level folder as a flat section: small muted label followed
 * by its items (TanStack docs style) instead of a collapsible folder.
 * Folders with no pages render nothing.
 */
export function SidebarSection({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  if (!hasPages(item)) return null;

  return (
    <div className="mt-6 flex flex-col gap-1 first:mt-0">
      {item.index ? (
        <SectionLabel>
          <a href={item.index.url}>{item.name}</a>
        </SectionLabel>
      ) : (
        <SectionLabel>{item.name}</SectionLabel>
      )}
      {children}
    </div>
  );
}

function SectionLabel(props: ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className="mb-1.5 inline-flex min-h-6 items-center gap-2 px-2 text-xs font-normal leading-none text-fd-muted-foreground"
    />
  );
}
