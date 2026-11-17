import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';
import { toPlainMarkdown } from './llms';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import type * as PageTree from 'fumadocs-core/page-tree';
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

/**
 * The page tree the docs layout hands to the browser (app/docs/layout.tsx).
 * Every docs page carries it in its HTML and RSC payload, so each node keeps
 * only what the sidebar, the breadcrumb and the page switchers read: a page
 * its name, sidebar label, URL, icon and external flag, but not its file
 * reference, its id or its description (D116). Server code (page footer,
 * structured data, llms output) keeps reading `source.getPageTree()`.
 */
export function sidebarTree(): PageTree.Root {
  const tree = source.getPageTree();
  return {
    $id: tree.$id,
    name: tree.name,
    children: tree.children.map(trimNode),
  };
}

function trimNode(node: PageTree.Node): PageTree.Node {
  if (node.type === 'page') return trimPage(node);
  if (node.type === 'separator') {
    return defined({
      $id: node.$id,
      type: 'separator',
      name: node.name,
      icon: node.icon,
    });
  }
  return defined({
    $id: node.$id,
    type: 'folder',
    name: node.name,
    root: node.root,
    defaultOpen: node.defaultOpen,
    collapsible: node.collapsible,
    icon: node.icon,
    index: node.index && trimPage(node.index),
    children: node.children.map(trimNode),
  });
}

function trimPage(page: PageTree.Item): PageTree.Item {
  const label = (page as SidebarTreeItem).sidebarName;
  const item: SidebarTreeItem = defined({
    type: 'page',
    name: page.name,
    url: page.url,
    external: page.external,
    icon: page.icon,
    sidebarName: label === page.name ? undefined : label,
  });
  return item;
}

/** Drops the keys whose value is undefined: React serializes each one. */
function defined<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as T;
}

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${toPlainMarkdown(await page.data.getText('processed'))}`,
});
