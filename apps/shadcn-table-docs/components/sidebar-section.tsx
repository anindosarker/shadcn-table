'use client';

import {
  Children,
  createContext,
  Fragment,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { usePathname } from 'next/navigation';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import { ChevronDownIcon } from 'lucide-react';
import { SidebarItem } from 'fumadocs-ui/components/sidebar/base';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui-radix/collapsible';
import { SidebarSubgroup } from '@/components/sidebar-subgroup';
import {
  containsUrl,
  groupBySeparator,
  groupCount,
  hasPages,
  isNumberedRoot,
} from '@/lib/page-tree-utils';

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
  const { root } = useTreeContext();
  // A folder with meta.json `defaultOpen: false` (the Examples "More
  // examples", D103) starts closed unless it holds the current page, opens when the
  // visitor navigates into it, else keeps the state they left, also across
  // a reload (localStorage); its "---Label---" sub-groups are plain labels.
  const closable = item.defaultOpen === false;
  const active = containsUrl(item, pathname);
  // the visitor's choice in this visit; a closable folder falls back to the
  // stored one, then to closed
  const [choice, setChoice] = useState<boolean | undefined>(
    closable && active ? true : undefined,
  );
  const [wasActive, setWasActive] = useState(active);
  if (active !== wasActive) {
    setWasActive(active);
    if (closable && active) setChoice(true);
  }
  const storageKey = closable ? folderOpenKey(item) : undefined;
  const stored = useSyncExternalStore(
    subscribeFolderOpen,
    () => (storageKey ? readFolderOpen(storageKey) : undefined),
    () => undefined,
  );
  const open = closable ? (choice ?? stored ?? false) : (choice ?? true);
  useEffect(() => {
    if (storageKey && choice !== undefined) writeFolderOpen(storageKey, choice);
  }, [storageKey, choice]);
  // A closable folder lists its rows only in the browser: the server and the
  // hydration render show the current row alone, with its number and its
  // sub-group label, so the 596 story pages do not each carry the whole
  // "More examples" list in their HTML (D116).
  const listed = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  if (!hasPages(item)) return null;
  const rendered = Children.toArray(children);
  // A closable folder's index row stays outside its collapsible content, so
  // the server HTML links it with the folder closed (v1.0.x D5).
  const indexRow = item.index ? (
    <SidebarItem
      href={item.index.url}
      external={item.index.external}
      active={pathname === item.index.url}
      className={ITEM_CLASS}
    >
      Overview
    </SidebarItem>
  ) : null;

  return (
    <Collapsible open={open} onOpenChange={setChoice} className={SECTION_CLASS}>
      <CollapsibleTrigger
        // a closable folder's heading sticks while its rows scroll, with its
        // sticky sub-group labels (sidebar-separator.tsx) right below it
        className={`group/section mb-1 cursor-pointer justify-between ${SECTION_LABEL_CLASS} ${closable ? 'sticky -top-4 z-20 bg-fd-background' : ''}`}
      >
        {isNumberedRoot(root) ? (
          // Examples folders end with the count of every row inside (D103)
          <span>
            {item.name} ({groupCount(item, [])})
          </span>
        ) : (
          item.name
        )}
        <ChevronDownIcon className="size-3.5 shrink-0 transition-transform group-data-[state=closed]/section:-rotate-90" />
      </CollapsibleTrigger>
      {closable ? indexRow : null}
      <CollapsibleContent
        className={`flex flex-col gap-1 ${closable ? '[--sidebar-stick-top:1.5rem]' : ''}`}
      >
        {closable ? null : indexRow}
        {groupBySeparator(item.children).map((group, g) => {
          const nodes = group.indices.map((i) => rendered[i]);
          // the separator renders its own group (sidebar-separator.tsx)
          if (closable && !listed) {
            const current = group.indices.filter((i) =>
              containsUrl(item.children[i], pathname),
            );
            if (current.length === 0) return null;
            // its own key, so the row mounts again once the list is in and
            // fumadocs scrolls it into view (useAutoScroll) at its place
            return (
              <ActiveRowOnly key={`current-${g}`} value>
                {group.separator
                  ? rendered[item.children.indexOf(group.separator)]
                  : current.map((i) => rendered[i])}
              </ActiveRowOnly>
            );
          }
          if (closable)
            return group.separator ? (
              <Fragment key={g}>
                {rendered[item.children.indexOf(group.separator)]}
              </Fragment>
            ) : (
              <Fragment key={g}>{nodes}</Fragment>
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

/**
 * True while a closable folder shows its current row alone (server render
 * and hydration): the sub-group label in it (sidebar-separator.tsx) renders
 * that row and no other.
 */
export const ActiveRowOnly = createContext(false);

/** The store behind `listed`: nothing changes it after hydration. */
function subscribeNothing() {
  return () => {};
}

/** localStorage key of a closable folder's open state. */
function folderOpenKey(item: PageTree.Folder) {
  return `docs-sidebar-open:${item.$id ?? String(item.name)}`;
}

/** The stored open state, or undefined when none is stored or storage is blocked. */
function readFolderOpen(key: string): boolean | undefined {
  try {
    const value = localStorage.getItem(key);
    return value === null ? undefined : value === '1';
  } catch {
    return undefined;
  }
}

const folderListeners = new Set<() => void>();

/** Other tabs' changes (the storage event) and this tab's writes. */
function subscribeFolderOpen(onChange: () => void) {
  folderListeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    folderListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function writeFolderOpen(key: string, open: boolean) {
  try {
    if (localStorage.getItem(key) === (open ? '1' : '0')) return;
    localStorage.setItem(key, open ? '1' : '0');
  } catch {
    return;
  }
  for (const listener of folderListeners) listener();
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
