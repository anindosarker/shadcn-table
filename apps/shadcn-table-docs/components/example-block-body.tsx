import { createRelativeLink } from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { ExamplePageProvider } from '@/components/example-page-context';

export type DocsPage = NonNullable<ReturnType<typeof source.getPage>>;

/**
 * One example page's body (its MDX with the playground), bound to that page
 * through ExamplePageProvider, with the same MDX components and relative
 * links as the single page. Rendered by the examples stack for its first
 * blocks and by `loadExampleBlock` for every block loaded on scroll.
 */
export function ExampleBlockBody({ page }: { page: DocsPage }) {
  const MDX = page.data.body;
  return (
    <ExamplePageProvider url={page.url}>
      <MDX
        components={getMDXComponents({
          a: createRelativeLink(source, page),
        })}
      />
    </ExamplePageProvider>
  );
}
