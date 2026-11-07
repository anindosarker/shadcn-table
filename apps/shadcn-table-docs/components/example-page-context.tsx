'use client';

import { createContext, use, useMemo, type ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { searchPath } from 'fumadocs-core/breadcrumb';
import { useTreeContext } from 'fumadocs-ui/contexts/tree';

export interface ExamplePage {
  /** The example page's own url, e.g. `/docs/examples/basic`. */
  url: string;
  /** Page tree path to that url, outermost first, like `useTreePath()`. */
  path: PageTree.Node[];
}

const ExamplePageContext = createContext<ExamplePage | null>(null);

/**
 * Binds the example playgrounds below it to one example page. The continuous
 * examples page renders every example under one pathname, so each block says
 * which page it is instead of the playground reading the pathname.
 */
export function ExamplePageProvider({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) {
  const { full } = useTreeContext();
  const value = useMemo(
    () => ({ url, path: searchPath(full.children, url) ?? [] }),
    [full, url],
  );
  return <ExamplePageContext value={value}>{children}</ExamplePageContext>;
}

/** The example page a playground belongs to, or null on a single page. */
export function useExamplePage(): ExamplePage | null {
  return use(ExamplePageContext);
}
