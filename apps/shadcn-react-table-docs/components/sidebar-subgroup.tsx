'use client';

import { useState } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronDownIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

/**
 * A "---Label---" sub-group inside a section: the label toggles the pages
 * after it, which sit on a dashed guide line (styled in app/global.css).
 * Open only while it holds the current page; navigating into it opens it.
 */
export function SidebarSubgroup({
  separator,
  active,
  children,
}: {
  separator: PageTree.Separator;
  active: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(active);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (active) setOpen(true);
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex flex-col">
      <CollapsibleTrigger className="group/subgroup mt-2 inline-flex min-h-6 w-full cursor-pointer items-center justify-between gap-2 ps-5 pe-2 font-mono text-[11px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground hover:text-fd-foreground">
        <span className="inline-flex items-center gap-2 text-start">
          {separator.icon}
          {separator.name}
        </span>
        <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=closed]/subgroup:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent
        data-subgroup-list
        className="mt-1 flex flex-col gap-1"
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
