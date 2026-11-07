import { Suspense, type ReactNode } from 'react';
import { connection } from 'next/server';
import type * as PageTree from 'fumadocs-core/page-tree';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { ExamplePageProvider } from '@/components/example-page-context';
import { ExamplesScrollSpy } from '@/components/examples-scroll-spy';
import { LazyMount } from '@/components/lazy-mount';
import { ExampleSkeleton } from '@/components/example-skeleton';

type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

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
  const folder = source
    .getPageTree()
    .children.find(
      (node): node is PageTree.Folder =>
        node.type === 'folder' && node.index?.url === indexUrl,
    );
  walk(folder?.children ?? []);
  return out;
}

/**
 * One block's body: the example page's MDX with its playground. Awaiting
 * `connection()` renders the stack per request, so the shell (intro,
 * subgroup headings, titles, descriptions, skeletons) streams first and each
 * body follows inside its own Suspense boundary; the playground's
 * ExampleSnippet reads its example sources while the block suspends.
 * LazyMount still defers the client mount of the live table.
 */
async function ExampleBlockBody({ page }: { page: DocsPage }) {
  await connection();
  const MDX = page.data.body;
  return (
    <LazyMount>
      <MDX
        components={getMDXComponents({
          a: createRelativeLink(source, page),
        })}
      />
    </LazyMount>
  );
}

/**
 * The continuous examples page: the index intro, then every example page as a
 * block. The scroll spy keeps the address bar on the block in view; each
 * block's body streams in its own Suspense boundary and mounts only near the
 * viewport.
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
      {entries.map(({ page, group, groupStart }) => {
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
              <ExamplePageProvider url={page.url}>
                <Suspense fallback={<ExampleSkeleton />}>
                  <ExampleBlockBody page={page} />
                </Suspense>
              </ExamplePageProvider>
            </section>
          </div>
        );
      })}
    </ExamplesScrollSpy>
  );
}
