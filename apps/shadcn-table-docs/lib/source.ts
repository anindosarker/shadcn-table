import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { toPlainMarkdown } from './llms';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import type { SidebarTreeItem } from './page-tree-utils';

// `searchTitle`: an optional `<title>` for search results that differs from
// the heading and the sidebar label (`title`). `sidebarTitle`: an optional
// sidebar row label; it sets only the tree node's `sidebarName` (transformer
// below), so the heading, breadcrumb, page switcher, prev / next, metadata,
// structured data and llms output keep `title`. Built with the zod methods of
// fumadocs' own `pageSchema`, so the docs app needs no zod dependency.
const docsPageSchema = pageSchema.extend({
  searchTitle: pageSchema.shape.title.optional(),
  sidebarTitle: pageSchema.shape.title.optional(),
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
          if (!path) return node;
          if (/^[^/]+\/index\.mdx?$/.test(path)) {
            return { ...node, name: 'Overview' };
          }
          // Frontmatter `sidebarTitle`: the sidebar row label only
          // (components/sidebar-item.tsx); `name` stays the page title.
          const file = this.storage.read(path);
          const sidebarName =
            file?.format === 'page' && 'sidebarTitle' in file.data
              ? file.data.sidebarTitle
              : undefined;
          if (typeof sidebarName !== 'string') return node;
          const item: SidebarTreeItem = { ...node, sidebarName };
          return item;
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

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${toPlainMarkdown(await page.data.getText('processed'))}`,
});
