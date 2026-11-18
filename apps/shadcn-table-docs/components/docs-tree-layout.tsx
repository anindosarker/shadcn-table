'use client';

import { useMemo } from 'react';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { withMoreExamples } from '@/lib/more-examples';

/**
 * fumadocs' DocsLayout with the "More examples" rows put back into the page
 * tree in the browser (lib/more-examples.ts): the server sends the folder
 * without them (lib/source.ts `sidebarTree`), so a story page's payload
 * stays small, while the sidebar, the breadcrumb and the page switchers see
 * the whole tree, on the server render as after hydration.
 */
export function DocsTreeLayout({ tree, ...props }: DocsLayoutProps) {
  const full = useMemo(() => withMoreExamples(tree), [tree]);
  return <DocsLayout {...props} tree={full} />;
}
