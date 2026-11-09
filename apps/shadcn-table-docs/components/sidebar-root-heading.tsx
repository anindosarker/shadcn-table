'use client';

import { useTreeContext } from 'fumadocs-ui/contexts/tree';

/**
 * The current section's name above the sidebar page tree. Each section is a
 * fumadocs root folder (meta.json "root": true), so the sidebar lists one
 * section; this label names it. A plain label: no link, no collapse. Hidden
 * outside a section (the root is then the full tree).
 */
export function SidebarRootHeading() {
  const { root, full } = useTreeContext();
  if (root === full) return null;

  return (
    <p className="inline-flex min-h-6 w-full items-center px-2 font-mono text-[11px] font-normal uppercase leading-none tracking-[0.12em] text-fd-muted-foreground">
      {root.name}
    </p>
  );
}
