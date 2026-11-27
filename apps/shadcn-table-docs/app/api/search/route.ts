import { MORE_EXAMPLES_URL } from '@/lib/more-examples';
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

/** The list page of every story page, /docs/examples/more (v1.0.x D5). */
const STORY_LIST_URL = MORE_EXAMPLES_URL.slice(0, -1);

export const { GET } = createFromSource(source, {
  // fumadocs ids a page's headings and paragraphs `<page id>-<n>`, so with
  // the URL as the page id a page `<slug>-<n>` (basic-new-format-2) collides
  // with a heading of `<slug>` and the index fails to build. The trailing
  // "#" keeps every page id apart from those; results link by `url`.
  buildIndex: (page) => ({
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    id: `${page.url}#`,
    // The list page's links are story pages the search already returns (D6).
    structuredData:
      page.url === STORY_LIST_URL
        ? { headings: [], contents: [] }
        : page.data.structuredData,
  }),
});
