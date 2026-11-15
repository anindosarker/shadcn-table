'use client';

import {
  createContext,
  Fragment,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';

export interface GuideExampleItem {
  /** Example page slug, /docs/examples/<slug>. */
  slug: string;
  /** The example page's title. */
  title: string;
}

interface GuideExamples {
  /** The guide's example pages as page tree items, in picker order. */
  pages: PageTree.Item[];
  /** Index of the example on show. */
  index: number;
  /** Shows the example at `index` in place. */
  select: (index: number) => void;
}

const GuideExamplesContext = createContext<GuideExamples | null>(null);

/** The guide's example list around a playground, or null outside a guide's <GuideExamples>. */
export const useGuideExamples = () => useContext(GuideExamplesContext);

/**
 * Client half of <GuideExamples>: keeps which example is on show and mounts
 * only that one's playground; the playground's toolbar reads the list from
 * context for its link or picker.
 */
export function GuideExampleSwitch({
  items,
  panels,
}: {
  items: GuideExampleItem[];
  panels: ReactNode[];
}) {
  const [index, setIndex] = useState(0);
  const pages = useMemo(
    () =>
      items.map(
        (item): PageTree.Item => ({
          type: 'page',
          name: item.title,
          url: `/docs/examples/${item.slug}`,
        }),
      ),
    [items],
  );
  const value = useMemo(
    () => ({ pages, index, select: setIndex }),
    [pages, index],
  );

  return (
    <GuideExamplesContext.Provider value={value}>
      <Fragment key={items[index]?.slug}>{panels[index]}</Fragment>
    </GuideExamplesContext.Provider>
  );
}
