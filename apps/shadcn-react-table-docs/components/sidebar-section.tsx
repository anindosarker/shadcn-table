'use client';

import { useState } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';
import { SidebarItem } from 'fumadocs-ui/components/sidebar/base';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { hasPages } from '@/lib/page-tree-utils';

/**
 * Renders a top-level folder as a collapsible section: a small muted label
 * (the trigger, never a page link) followed by its pages. A folder index page
 * becomes the first page of the section, titled "Overview", so every clickable
 * row looks like a page and every label looks like a label. Sections start
 * open. Folders with no pages render nothing.
 */
export function SidebarSection({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  if (!hasPages(item)) return null;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mt-8 flex flex-col gap-1 first:mt-0"
    >
      <CollapsibleTrigger className="group/section mb-1.5 inline-flex min-h-6 w-full cursor-pointer items-center justify-between gap-2 px-2 text-xs font-normal leading-none text-fd-muted-foreground hover:text-fd-foreground">
        {item.name}
        <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=closed]/section:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-1">
        {item.index ? (
          <SidebarItem
            href={item.index.url}
            external={item.index.external}
            active={pathname === item.index.url}
            className={ITEM_CLASS}
          >
            Overview
          </SidebarItem>
        ) : null}
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Same classes the notebook layout gives its page items (link variant). */
const ITEM_CLASS =
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors [&_svg]:size-4 [&_svg]:shrink-0';
