import { Suspense, type ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import {
  ExampleBlockBody,
  type DocsPage,
} from '@/components/example-block-body';
import {
  ExamplesVirtualList,
  type StackItem,
} from '@/components/examples-virtual-list';
import { LazyMount } from '@/components/lazy-mount';
import { ExampleSkeleton } from '@/components/example-skeleton';
import { BackToTop } from '@/components/back-to-top';

interface StackEntry {
  page: DocsPage;
  /** The "---X---" separator (or folder) the page sits under, if any. */
  group?: ReactNode;
  /** True on the first page of a subgroup: the block shows its heading. */
  groupStart: boolean;
}

/**
 * Every example page in page tree order (the `meta.json` order), with the
 * subgroup each one sits under. Folders are flattened in place.
 */
function examplePages(indexUrl: string): StackEntry[] {
  const byUrl = new Map(
    source
      .getPages()
      .filter((page) => page.slugs[0] === 'examples' && page.url !== indexUrl)
      .map((page) => [page.url, page]),
  );
  const out: StackEntry[] = [];
  const push = (page: DocsPage, group?: ReactNode) => {
    const previous = out[out.length - 1];
    const groupStart =
      group !== undefined && (!previous || previous.group !== group);
    out.push({ page, group, groupStart });
  };
  const walk = (nodes: PageTree.Node[], group?: ReactNode) => {
    let current = group;
    for (const node of nodes) {
      if (node.type === 'separator') {
        current = node.name;
      } else if (node.type === 'page') {
        const page = byUrl.get(node.url);
        if (page) push(page, current);
      } else {
        if (node.index) {
          const page = byUrl.get(node.index.url);
          if (page) push(page, node.name);
        }
        walk(node.children, node.name);
      }
    }
  };
  // The section is a root folder (meta.json "root": true), which has no
  // folder index: its index page is listed as the first child instead.
  const folder = source
    .getPageTree()
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === 'folder' &&
        (node.index?.url === indexUrl ||
          node.children.some(
            (child) => child.type === 'page' && child.url === indexUrl,
          )),
    );
  walk(folder?.children ?? []);
  return out;
}

/** Blocks whose body the server renders; the rest load on approach. */
const EAGER_BLOCKS = 3;

/**
 * The continuous examples page: the index intro, then every example page as a
 * block under its subgroup heading, as one window-virtualized list. The first
 * EAGER_BLOCKS bodies are rendered here (each in its own Suspense boundary,
 * LazyMount deferring the live table); every other body is fetched when its
 * block nears the viewport. Every title and description is also in a plain
 * list outside the virtualized one, so the HTML carries them all. A floating
 * button scrolls back to the top.
 */
export function ExamplesStack({
  index,
  intro,
}: {
  index: DocsPage;
  intro: ReactNode;
}) {
  const entries = examplePages(index.url);
  const items: StackItem[] = [{ kind: 'intro', content: intro }];
  entries.forEach(({ page, group, groupStart }, i) => {
    const slug = page.slugs.slice(1).join('/');
    if (groupStart)
      items.push({ kind: 'heading', key: `group:${slug}`, label: group });
    items.push({
      kind: 'block',
      slug,
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      body:
        i < EAGER_BLOCKS ? (
          <Suspense fallback={<ExampleSkeleton />}>
            <LazyMount>
              <ExampleBlockBody page={page} />
            </LazyMount>
          </Suspense>
        ) : undefined,
    });
  });

  return (
    <>
      <ExamplesVirtualList items={items} introUrl={index.url} />
      {/* Plain anchors, not next/link: a Link would prefetch every page. */}
      <nav aria-label="Every example" className="sr-only">
        <ul>
          {entries.map(({ page }) => (
            <li key={page.url}>
              <a href={page.url}>{page.data.title}</a>
              {page.data.description && <p>{page.data.description}</p>}
            </li>
          ))}
        </ul>
      </nav>
      <BackToTop />
    </>
  );
}
