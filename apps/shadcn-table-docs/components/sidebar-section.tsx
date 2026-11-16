'use client';

import { Children, Fragment, useState } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { ChevronDownIcon } from 'lucide-react';
import { SidebarItem } from 'fumadocs-ui/components/sidebar/base';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui-radix/collapsible';
import { SidebarSubgroup } from '@/components/sidebar-subgroup';
import { containsUrl, groupBySeparator, hasPages } from '@/lib/page-tree-utils';

/**
 * Renders a top-level folder as a collapsible section: a small muted label
 * (the trigger, never a page link) followed by its pages. A folder index page
 * becomes the first page of the section, titled "Overview", so every clickable
 * row looks like a page and every label looks like a label. Sections start
 * open. Folders with no pages render nothing.
 *
 * "---Label---" separators and the pages after them render as collapsible
 * sub-groups (components/sidebar-subgroup.tsx). fumadocs renders `children`
 * one element per `item.children` node, in order, so the groups pick their
 * elements by index; the page tree itself stays flat for the breadcrumb.
 */
export function SidebarSection({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // A folder with meta.json `defaultOpen: false` (preview-examples-ab "More
  // examples") starts closed unless it holds the current page, opens when the
  // visitor navigates into it, else keeps the state they left; its
  // "---Label---" sub-groups are plain labels.
  const closable = item.defaultOpen === false;
  const active = containsUrl(item, pathname);
  const [open, setOpen] = useState(!closable || active);
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (closable && active) setOpen(true);
  }
  if (!hasPages(item)) return null;
  const rendered = Children.toArray(children);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={SECTION_CLASS}>
      <CollapsibleTrigger
        // a closable folder's heading sticks while its rows scroll, with its
        // sticky sub-group labels (sidebar-separator.tsx) right below it
        className={`group/section mb-1 cursor-pointer justify-between ${SECTION_LABEL_CLASS} ${closable ? 'sticky -top-4 z-20 bg-fd-background' : ''}`}
      >
        {item.name}
        <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=closed]/section:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent
        className={`flex flex-col gap-1 ${closable ? '[--sidebar-stick-top:1.5rem]' : ''}`}
      >
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
        {groupBySeparator(item.children).map((group, g) => {
          const nodes = group.indices.map((i) => rendered[i]);
          if (closable)
            return (
              <Fragment key={g}>
                {group.separator &&
                  rendered[item.children.indexOf(group.separator)]}
                {nodes}
              </Fragment>
            );
          return group.separator ? (
            <SidebarSubgroup
              key={g}
              separator={group.separator}
              active={group.indices.some((i) =>
                containsUrl(item.children[i], pathname),
              )}
            >
              {nodes}
            </SidebarSubgroup>
          ) : (
            <Fragment key={g}>{nodes}</Fragment>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

/** A top-level section block: the gap above it and between its rows. */
export const SECTION_CLASS = 'mt-6 flex flex-col gap-1 first:mt-0';

/**
 * The small muted label of a top-level row: the section triggers here and
 * the external links beside them (components/sidebar-item.tsx).
 */
export const SECTION_LABEL_CLASS =
  'inline-flex min-h-6 w-full items-center gap-2 px-2 font-mono text-[11px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground hover:text-fd-foreground';

/** Same classes the notebook layout gives its page items (link variant). */
export const ITEM_CLASS =
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors [&_svg]:size-4 [&_svg]:shrink-0';
