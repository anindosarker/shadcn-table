import type * as PageTree from 'fumadocs-core/page-tree';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { docsRoute } from './shared';

/** Tab label by content folder; order here is the navbar order. */
const TABS: Array<{ dir: string; title: string }> = [
  { dir: 'getting-started', title: 'Getting Started' },
  { dir: 'guides', title: 'Guides' },
  { dir: 'api', title: 'API' },
  { dir: 'examples', title: 'Examples' },
];

function collectPageUrls(nodes: PageTree.Node[], out: string[]) {
  for (const node of nodes) {
    if (node.type === 'page') out.push(node.url);
    else if (node.type === 'folder') {
      if (node.index) out.push(node.index.url);
      collectPageUrls(node.children, out);
    }
  }
}

/**
 * Build navbar tabs (Home + one per top-level content folder) from the page
 * tree. Each tab links to the folder's first page and is active for any page
 * under that folder.
 */
export function getDocsTabs(tree: PageTree.Root): LayoutTab[] {
  const folders = tree.children.filter(
    (node): node is PageTree.Folder => node.type === 'folder',
  );

  const tabs: LayoutTab[] = [{ url: '/', title: 'Home' }];

  for (const { dir, title } of TABS) {
    const prefix = `${docsRoute}/${dir}`;
    const folder = folders.find((node) => {
      const urls: string[] = [];
      collectPageUrls([node], urls);
      return urls.some((url) => url.startsWith(`${prefix}/`) || url === prefix);
    });
    const urls: string[] = [];
    if (folder) collectPageUrls([folder], urls);

    tabs.push({
      url: urls[0] ?? prefix,
      title,
      urls: new Set(urls),
    });
  }

  return tabs;
}
