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
  pageTree: {
    transformers: [
      {
        // Each section is a root folder (meta.json "root": true), so the
        // sidebar shows one section at a time. A root folder has no folder
        // index; its index page is listed as the first page and reads
        // "Overview" in the sidebar.
        file(node, path) {
          return path && /^[^/]+\/index\.mdx?$/.test(path)
            ? { ...node, name: 'Overview' }
            : node;
        },
        // The sidebar shows only the current root folder's children
        // (fumadocs-ui contexts/tree), so a top-level external row such as
        // Changelog (D60) would show in no section. Move each one to the end
        // of every root folder.
        root(node) {
          const shared = node.children.filter(
            (child) => child.type === 'page' && child.external,
          );
          if (shared.length === 0) return node;
          return {
            ...node,
            children: node.children
              .filter((child) => !shared.includes(child))
              .map((child) =>
                child.type === 'folder' && child.root
                  ? {
                      ...child,
                      children: [
                        ...child.children,
                        ...shared.map((row) => ({ ...row })),
                      ],
                    }
                  : child,
              ),
          };
        },
      },
    ],
  },
});

// preview-examples-ab: the generated preview sections (EX A, EX B) stay out
// of search, sitemap, llms output and OG images. Delete with the demo.
const PREVIEW_SECTIONS = ['examples-a', 'examples-b'];
const isPublic = (page?: { slugs: string[] }) =>
  !!page && !PREVIEW_SECTIONS.includes(page.slugs[0]);

/** `source` without the preview sections, for indexes and generated lists. */
export const publicSource: typeof source = {
  ...source,
  getPages: (...args) => source.getPages(...args).filter(isPublic),
  getPageByUrl: (...args) => {
    const page = source.getPageByUrl(...args);
    return isPublic(page) ? page : undefined;
  },
};

export const docsLlms = llms(publicSource, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${toPlainMarkdown(await page.data.getText('processed'))}`,
});
