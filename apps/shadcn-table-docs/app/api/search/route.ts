import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

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
    structuredData: page.data.structuredData,
  }),
});
