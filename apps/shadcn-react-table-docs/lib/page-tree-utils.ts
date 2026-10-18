import type * as PageTree from 'fumadocs-core/page-tree';

/** True when the node is a page, or a folder with at least one page below it. */
export function hasPages(node: PageTree.Node): boolean {
  if (node.type === 'page') return true;
  if (node.type !== 'folder') return false;
  return Boolean(node.index) || node.children.some(hasPages);
}

/**
 * True when at least one page follows `separator` among `siblings` before the
 * next separator. Used to hide "---X---" sub-labels for groups with no pages.
 */
export function separatorHasPages(
  separator: PageTree.Separator,
  siblings: PageTree.Node[],
): boolean {
  const start = siblings.indexOf(separator);
  if (start === -1) return false;
  for (let i = start + 1; i < siblings.length; i++) {
    const node = siblings[i];
    if (node.type === 'separator') return false;
    if (hasPages(node)) return true;
  }
  return false;
}

/** Find the sibling list that contains `node` (by reference) anywhere in the tree. */
export function findSiblings(
  root: Pick<PageTree.Root, 'children'>,
  node: PageTree.Node,
): PageTree.Node[] | undefined {
  const visit = (list: PageTree.Node[]): PageTree.Node[] | undefined => {
    if (list.includes(node)) return list;
    for (const child of list) {
      if (child.type === 'folder') {
        const found = visit(child.children);
        if (found) return found;
      }
    }
  };
  return visit(root.children);
}

/** Name of the top-level folder that holds the page at `url`, if any. */
export function findSectionName(
  root: Pick<PageTree.Root, 'children'>,
  url: string,
): PageTree.Folder['name'] | undefined {
  const contains = (node: PageTree.Node): boolean =>
    node.type === 'page'
      ? node.url === url
      : node.type === 'folder' &&
        (node.index?.url === url || node.children.some(contains));
  return root.children.find(
    (node): node is PageTree.Folder => node.type === 'folder' && contains(node),
  )?.name;
}
