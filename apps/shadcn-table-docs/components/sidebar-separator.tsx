'use client';

import { useEffect, useRef } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';
import {
  findSiblings,
  groupCount,
  isNumberedRoot,
  separatorHasPages,
  separatorPages,
} from '@/lib/page-tree-utils';
import { SidebarGroupContext } from '@/components/sidebar-group-context';
import { SidebarItem } from '@/components/sidebar-item';

/**
 * Sub-group label inside a section ("---Props and Options---" in meta.json),
 * rendered together with its pages as one element. Hidden until at least one
 * page exists between it and the next separator.
 */
export function SidebarSeparator({ item }: { item: PageTree.Separator }) {
  const { root } = useTreeContext();
  const label = useStuckLabel(item);
  const siblings = findSiblings(root, item);
  if (!siblings || !separatorHasPages(item, siblings)) return null;

  // The label is sticky in the sidebar scroll area. Its group (label plus
  // pages) is its own element, so the label sticks only while its group is
  // in view and the next group's label pushes it out. The group inherits the
  // list's gap, so rows keep their spacing; fumadocs renders the same pages
  // flat after this, and components/sidebar-item.tsx skips them there.
  // Opaque so rows do not show through; the dashed line shows only while
  // stuck (data-stuck, useStuckLabel below). Inside a folder with a
  // sticky heading, --sidebar-stick-top puts it below that; -1rem cancels the
  // scroll area padding (fumadocs SidebarViewport p-4).
  return (
    <div className="flex flex-col gap-[inherit]">
      <p
        ref={label}
        data-subgroup
        className="sidebar-sticky-label sticky top-[calc(var(--sidebar-stick-top,0px)-1rem)] z-10 mt-2 flex w-full bg-fd-background"
      >
        <span className="flex w-full items-center gap-2 px-2 py-1 font-mono text-[9px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground">
          {item.icon}
          {isNumberedRoot(root) ? (
            // one flex item, so the label's gap stays out of "Featured (5)"
            <span>
              {item.name} ({groupCount(item, siblings)})
            </span>
          ) : (
            item.name
          )}
        </span>
      </p>
      <SidebarGroupContext value>
        {separatorPages(item, siblings).map((page) => (
          <SidebarItem key={page.$id ?? page.url} item={page} />
        ))}
      </SidebarGroupContext>
    </div>
  );
}

/** Labels on screen, checked together on each scroll frame. */
const labels = new Set<HTMLElement>();
let frame = 0;

/**
 * A label is stuck while sticky positioning moves it down inside its group:
 * its distance from the group's top is more than its own top margin. Read
 * all, then write, once per frame.
 */
function markStuck() {
  frame = 0;
  const stuck = [...labels].map((el) => {
    const group = el.parentElement;
    if (!group) return false;
    const shift =
      el.getBoundingClientRect().top - group.getBoundingClientRect().top;
    return shift > parseFloat(getComputedStyle(el).marginTop) + 0.5;
  });
  [...labels].forEach((el, i) => el.toggleAttribute('data-stuck', stuck[i]));
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(markStuck);
}

/**
 * Only a scroll of an element that holds a label can move one: the page and
 * the example tables scroll often and hold none, so they are skipped.
 */
function onScroll(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  for (const el of labels) {
    if (target.contains(el)) {
      schedule();
      return;
    }
  }
}

/**
 * Sets `data-stuck` on the sticky label while it is stuck, for the dashed
 * line below it (app/global.css). CSS `scroll-state(stuck)` container
 * queries run in Chromium only; this works in every engine. One capture
 * scroll listener serves every label. fumadocs keys sidebar rows by index,
 * so after a client navigation to another section the same label shows a
 * new `item`; the flags are checked again then, without waiting for a scroll.
 */
function useStuckLabel(item: PageTree.Separator) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (labels.size === 0) {
      document.addEventListener('scroll', onScroll, {
        capture: true,
        passive: true,
      });
      window.addEventListener('resize', schedule, { passive: true });
    }
    labels.add(el);
    schedule();
    return () => {
      labels.delete(el);
      if (labels.size === 0) {
        document.removeEventListener('scroll', onScroll, { capture: true });
        window.removeEventListener('resize', schedule);
      }
    };
  }, [item]);
  return ref;
}
