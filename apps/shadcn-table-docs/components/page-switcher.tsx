'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui-radix/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui-radix/popover';
import { cn } from '@/lib/cn';

interface PageGroup {
  label?: string;
  pages: PageTree.Item[];
}

/** Page tree names are ReactNodes; the switcher needs plain text for search. */
function textOf(name: React.ReactNode): string {
  return typeof name === 'string' || typeof name === 'number'
    ? String(name)
    : '';
}

/**
 * Flattens a section into groups: the section's own index page (titled
 * "Overview", as in the sidebar) and the pages before the first separator form
 * an unlabelled group, then one group per "---Label---" separator. Nested
 * folders contribute their index and pages to the group they sit in.
 */
function groupPages(section: PageTree.Folder): PageGroup[] {
  const groups: PageGroup[] = [{ pages: [] }];
  const push = (page: PageTree.Item) =>
    groups[groups.length - 1].pages.push(page);
  const visit = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type === 'separator') {
        groups.push({ label: textOf(node.name), pages: [] });
      } else if (node.type === 'page') {
        push(node);
      } else {
        if (node.index) push(node.index);
        visit(node.children);
      }
    }
  };
  if (section.index) push({ ...section.index, name: 'Overview' });
  visit(section.children);
  return groups.filter((group) => group.pages.length > 0);
}

/**
 * The section's pages in the switcher's order, without the section's own
 * index page: the previous / next steps of the example switcher.
 */
export function sectionPages(section: PageTree.Folder): PageTree.Item[] {
  return groupPages(section)
    .flatMap((group) => group.pages)
    .filter((page) => page.url !== section.index?.url);
}

/**
 * cmdk's default filter is fuzzy over the whole value, so "aggre" also matches
 * "Row Dragging Example" through scattered letters. Pages are few: rank by
 * plain prefix and substring matches on the page name, then on the slug.
 */
function filterPages(value: string, search: string, keywords?: string[]) {
  const query = search.trim().toLowerCase();
  if (!query) return 1;
  const name = (keywords?.[0] ?? '').toLowerCase();
  const slug = value.slice(value.lastIndexOf('/') + 1).replace(/-/g, ' ');
  if (name.startsWith(query)) return 1;
  if (name.split(' ').some((word) => word.startsWith(query))) return 0.9;
  if (name.includes(query)) return 0.8;
  if (slug.includes(query)) return 0.6;
  return 0;
}

/**
 * Last breadcrumb crumb as a combobox: the trigger shows the current page name,
 * the popover lists every page of the current top-level section, grouped by
 * the sidebar's separator labels, with a search input on top. Enter or click
 * navigates and closes the popover.
 */
export function PageSwitcher({
  section,
  current,
  className,
}: {
  section: PageTree.Folder;
  current: PageTree.Item;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const groups = useMemo(() => groupPages(section), [section]);
  const label =
    section.index && current.url === section.index.url
      ? 'Overview'
      : current.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label="Switch page"
          className={cn(
            'inline-flex max-w-[60vw] cursor-pointer items-center gap-1 transition-colors hover:text-fd-foreground data-[state=open]:text-fd-foreground sm:max-w-xs',
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDownIcon className="size-3.5 shrink-0" />
        </button>
      </PopoverTrigger>
      {/* cmdk assigns the listbox its own id, so the trigger points at the
          popup container instead. */}
      <PopoverContent id={listId} align="start" className="docs-menu w-72 p-0">
        <Command filter={filterPages}>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            {groups.map((group, i) => (
              <CommandGroup key={group.label ?? i} heading={group.label}>
                {group.pages.map((page) => (
                  <CommandItem
                    key={page.url}
                    value={page.url}
                    keywords={[textOf(page.name)]}
                    data-checked={page.url === current.url}
                    onSelect={() => {
                      setOpen(false);
                      if (page.url !== current.url) router.push(page.url);
                    }}
                  >
                    <span className="truncate">{page.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
