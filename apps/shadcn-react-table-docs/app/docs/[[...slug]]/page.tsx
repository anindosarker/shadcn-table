import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { DocsBreadcrumb, NoBreadcrumb } from '@/components/docs-breadcrumb';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';
import { findSectionName } from '@/lib/page-tree-utils';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const section = findSectionName(source.getPageTree(), page.url);

  return (
    <DocsPage
      toc={page.data.toc}
      // Example pages have no headings worth a TOC and their playground wants
      // the whole column, so they render full width; so does any page without
      // TOC entries, instead of leaving the TOC column empty.
      full={
        page.data.full ||
        page.slugs[0] === 'examples' ||
        page.data.toc.length === 0
      }
      slots={{ breadcrumb: NoBreadcrumb }}
    >
      {/* Sticky under the top nav (and the mobile TOC popover): fumadocs
          publishes that edge as --fd-docs-row-3. */}
      <div className="docs-page-bar sticky top-(--fd-docs-row-3) z-10 flex flex-row items-center justify-between gap-4 bg-fd-background py-2">
        <DocsBreadcrumb />
        <div
          className="srt-page-actions inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-md border bg-fd-secondary [&>*]:h-full [&>*]:rounded-none [&>*]:border-0"
          role="group"
          aria-label="Page actions"
        >
          <MarkdownCopyButton markdownUrl={markdownUrl} className="px-2.5">
            Copy page
          </MarkdownCopyButton>
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/shadcn-react-table-docs/content/docs/${page.path}`}
            className="gap-0 border-l px-2"
            aria-label="Page options"
          >
            <span className="sr-only">Page options</span>
          </ViewOptionsPopover>
        </div>
      </div>
      {section && (
        <p className="docs-eyebrow">
          <span aria-hidden="true">{'//'}</span> {section}
        </p>
      )}
      <DocsTitle className="docs-title">{page.data.title}</DocsTitle>
      <DocsDescription className="docs-description-rule mb-0 pb-4 text-[0.9375rem]">
        {page.data.description}
      </DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
