import { Suspense, type ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import {
  ExampleBlockBody,
  type DocsPage,
} from '@/components/example-block-body';
import { ExamplesScrollSpy } from '@/components/examples-scroll-spy';
import { LazyBlock } from '@/components/lazy-block';
import { LazyMount } from '@/components/lazy-mount';
import { ExampleSkeleton } from '@/components/example-skeleton';

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

/** Blocks whose body renders on the server; the rest load on scroll. */
const EAGER_BLOCKS = 3;

/**
 * The continuous examples page: the index intro, then every example page as a
 * block. The server renders every title, description and a skeleton per
 * block, but only the first EAGER_BLOCKS bodies (each in its own Suspense
 * boundary, LazyMount deferring the live table); every other body loads
 * through LazyBlock when it nears the viewport. The scroll spy keeps the
 * address bar on the block in view.
 */
export function ExamplesStack({
  index,
  intro,
}: {
  index: DocsPage;
  intro: ReactNode;
}) {
  const entries = examplePages(index.url);

  return (
    <ExamplesScrollSpy introUrl={index.url}>
      <div data-spy-url={index.url}>{intro}</div>
      {entries.map(({ page, group, groupStart }, i) => {
        const slug = page.slugs.slice(1).join('/');
        return (
          <div key={page.url}>
            {groupStart && (
              <p className="docs-eyebrow mt-16">
                <span aria-hidden="true">{'//'}</span> {group}
              </p>
            )}
            <section
              id={slug}
              data-spy-url={page.url}
              className="scroll-mt-24 pt-6"
            >
              <h2>{page.data.title}</h2>
              {page.data.description && (
                <p className="text-fd-muted-foreground">
                  {page.data.description}
                </p>
              )}
              {i < EAGER_BLOCKS ? (
                <Suspense fallback={<ExampleSkeleton />}>
                  <LazyMount>
                    <ExampleBlockBody page={page} />
                  </LazyMount>
                </Suspense>
              ) : (
                <LazyBlock slug={slug} url={page.url} title={page.data.title} />
              )}
            </section>
          </div>
        );
      })}
    </ExamplesScrollSpy>
  );
}
