import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { toPlainMarkdown } from './llms';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

// `searchTitle`: an optional `<title>` for search results that differs from
// the heading and the sidebar label (`title`). Built with the zod methods of
// fumadocs' own `pageSchema`, so the docs app needs no zod dependency.
const docsPageSchema = pageSchema.extend({
  searchTitle: pageSchema.shape.title.optional(),
});

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docsPageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${toPlainMarkdown(await page.data.getText('processed'))}`,
});
