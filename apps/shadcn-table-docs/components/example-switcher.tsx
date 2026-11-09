'use client';

import type * as PageTree from 'fumadocs-core/page-tree';
import { PageSwitcher } from '@/components/page-switcher';

interface Props {
  section: PageTree.Folder;
  current: PageTree.Item;
}

/**
 * Example playground's left toolbar: the page switcher combobox (the
 * section's pages, without its overview).
 */
export const ExampleSwitcher = ({ section, current }: Props) => (
  <div className="flex min-w-0 items-center">
    <PageSwitcher
      section={section}
      current={current}
      className="h-8 min-w-0 shrink rounded-md border bg-fd-secondary px-2.5 text-sm font-medium text-fd-foreground"
    />
  </div>
);
