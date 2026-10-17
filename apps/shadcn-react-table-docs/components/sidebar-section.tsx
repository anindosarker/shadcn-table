'use client';

import type { ComponentProps } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * Renders a top-level folder as a flat section: small uppercase label followed
 * by its items (TanStack docs style) instead of a collapsible folder.
 */
export function SidebarSection({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col gap-0.5 first:mt-0">
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
      className="mb-1.5 inline-flex min-h-6 items-center gap-2 px-2 text-[11px] font-bold uppercase leading-none tracking-[0.075em] text-fd-muted-foreground"
    />
  );
}
