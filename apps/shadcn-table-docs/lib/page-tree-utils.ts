import type * as PageTree from 'fumadocs-core/page-tree';
import { docsRoute } from './shared';

/** A page node with the sidebar label set from frontmatter `sidebarTitle` (lib/source.ts). */
export type SidebarTreeItem = PageTree.Item & { sidebarName?: string };

/** The sidebar row label of a page: its `sidebarName` when set, else `name` (the page title). */
export function sidebarName(item: PageTree.Item): PageTree.Item['name'] {
  return (item as SidebarTreeItem).sidebarName ?? item.name;
}

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

/**
 * The pages a "---X---" separator labels: the pages after it among
 * `siblings`, up to the next separator, folder or external link (the shared
 * Changelog row, lib/source.ts, stays loose at the end).
 */
export function separatorPages(
  separator: PageTree.Separator,
  siblings: PageTree.Node[],
): PageTree.Item[] {
  const pages: PageTree.Item[] = [];
  for (let i = siblings.indexOf(separator) + 1; i < siblings.length; i++) {
    const node = siblings[i];
    if (node.type !== 'page' || node.external) break;
    pages.push(node);
  }
  return pages;
}

const groupedCache = new WeakMap<object, Set<PageTree.Node>>();

/**
 * Every page under `root` that follows a separator (separatorPages), cached
 * per tree. The sidebar renders those inside their separator's group.
 */
export function groupedPages(
  root: Pick<PageTree.Root, 'children'>,
): Set<PageTree.Node> {
  let set = groupedCache.get(root);
  if (set) return set;
  set = new Set();
  const visit = (list: PageTree.Node[]) => {
    let grouped = false;
    for (const node of list) {
      if (node.type === 'separator') grouped = true;
      else if (node.type === 'folder') {
        grouped = false;
        visit(node.children);
      } else if (node.type === 'page' && node.external) grouped = false;
      else if (grouped) set.add(node);
    }
  };
  visit(root.children);
  groupedCache.set(root, set);
  return set;
}

/**
 * Sections whose sidebar rows carry a running number and whose group labels
 * carry a row count (D103: Examples only), by URL prefix of their pages.
 */
const NUMBERED_SECTIONS = [`${docsRoute}/examples/`];

/** The sidebar rows under `node` in sidebar order: folder index first, external links skipped. */
function pageRows(node: PageTree.Root | PageTree.Folder): PageTree.Item[] {
  const rows: PageTree.Item[] = [];
  const visit = (current: PageTree.Root | PageTree.Folder) => {
    if ('index' in current && current.index && !current.index.external)
      rows.push(current.index);
    for (const child of current.children) {
      if (child.type === 'folder') visit(child);
      else if (child.type === 'page' && !child.external) rows.push(child);
    }
  };
  visit(node);
  return rows;
}

const numberCache = new WeakMap<object, Map<string, number> | null>();

/** Row numbers by URL of a numbered section, null for any other root; cached per tree. */
function sectionNumbers(
  root: PageTree.Root | PageTree.Folder,
): Map<string, number> | null {
  let numbers = numberCache.get(root);
  if (numbers === undefined) {
    const rows = pageRows(root);
    numbers = isNumberedSection(rows)
      ? new Map(rows.map((row, i) => [row.url, i + 1]))
      : null;
    numberCache.set(root, numbers);
  }
  return numbers;
}

/** Row number of a page inside its root section, 1-based, or undefined outside a numbered section. */
export function rowNumber(
  root: PageTree.Root | PageTree.Folder,
  url: string,
): number | undefined {
  return sectionNumbers(root)?.get(url);
}

/** True when the section's sidebar shows row numbers and group counts. */
export function isNumberedRoot(root: PageTree.Root | PageTree.Folder): boolean {
  return sectionNumbers(root) !== null;
}

function isNumberedSection(rows: PageTree.Item[]): boolean {
  return (
    rows.length > 0 &&
    rows.every((row) =>
      NUMBERED_SECTIONS.some((prefix) => row.url.startsWith(prefix)),
    )
  );
}

/** Number of page rows under a separator group or a folder. */
export function groupCount(
  node: PageTree.Separator | PageTree.Folder,
  siblings: PageTree.Node[],
): number {
  return node.type === 'folder'
    ? pageRows(node).length
    : separatorPages(node, siblings).length;
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

/** URL of the first page under `node`, in tree order. */
export function firstPageUrl(
  node: PageTree.Root | PageTree.Folder,
): string | undefined {
  if ('index' in node && node.index) return node.index.url;
  for (const child of node.children) {
    if (child.type === 'page') return child.url;
    if (child.type === 'folder') {
      const url = firstPageUrl(child);
      if (url) return url;
    }
  }
  return undefined;
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

type FooterItem = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

/**
 * Previous and next page for the page footer across the whole docs tree.
 * Each section is a root folder, so fumadocs' own footer stops at the
 * section edge; this walks every section in meta.json order (L1) with the
 * same rule as fumadocs (folder index first, then children; pages only,
 * external links skipped), so within a section the neighbours are unchanged.
 */
export function footerNeighbours(
  tree: PageTree.Root,
  url: string,
): { previous?: FooterItem; next?: FooterItem } {
  const list: PageTree.Item[] = [];
  function onNode(node: PageTree.Node) {
    if (node.type === 'folder') {
      if (node.index) onNode(node.index);
      for (const child of node.children) onNode(child);
    } else if (node.type === 'page' && !node.external) list.push(node);
  }
  for (const child of tree.children) onNode(child);

  const idx = list.findIndex((item) => item.url === url);
  if (idx === -1) return {};
  const pick = (item?: PageTree.Item): FooterItem | undefined =>
    item && { name: item.name, description: item.description, url: item.url };
  return { previous: pick(list[idx - 1]), next: pick(list[idx + 1]) };
}
