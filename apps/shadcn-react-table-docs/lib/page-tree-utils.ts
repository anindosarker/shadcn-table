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

/** True when the node is, or holds, the page at `url`. */
export function containsUrl(node: PageTree.Node, url: string): boolean {
  if (node.type === 'page') return node.url === url;
  if (node.type !== 'folder') return false;
  return (
    node.index?.url === url ||
    node.children.some((child) => containsUrl(child, url))
  );
}

/** A run of sibling nodes, by index into the list they came from. */
export interface SiblingGroup {
  /** The "---X---" separator that names the group; absent for loose nodes. */
  separator?: PageTree.Separator;
  indices: number[];
}

/**
 * Groups a sibling list for the sidebar: each separator takes the pages after
 * it, up to the next separator or folder. Folders, and pages before the first
 * separator or after a folder, stay loose. Groups with no pages are dropped.
 * The tree itself is untouched, so the breadcrumb and page switcher keep it.
 */
export function groupBySeparator(nodes: PageTree.Node[]): SiblingGroup[] {
  const groups: SiblingGroup[] = [];
  let current: SiblingGroup | undefined;
  nodes.forEach((node, i) => {
    if (node.type === 'separator') {
      current = { separator: node, indices: [] };
      groups.push(current);
    } else if (node.type === 'folder') {
      current = undefined;
      groups.push({ indices: [i] });
    } else {
      if (!current) {
        current = { indices: [] };
        groups.push(current);
      }
      current.indices.push(i);
    }
  });
  return groups.filter(
    (group) =>
      !group.separator || group.indices.some((i) => hasPages(nodes[i])),
  );
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
  return root.children.find(
    (node): node is PageTree.Folder =>
      node.type === 'folder' && containsUrl(node, url),
  )?.name;
}
