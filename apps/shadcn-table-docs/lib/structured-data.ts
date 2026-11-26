import type {
  BreadcrumbList,
  Organization,
  SoftwareSourceCode,
  TechArticle,
  WebSite,
  WithContext,
} from 'schema-dts';
import type { InferPageType } from 'fumadocs-core/source';
import type { ReactNode } from 'react';
import { getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import { findPath, flattenTree } from 'fumadocs-core/page-tree';
import type * as PageTree from 'fumadocs-core/page-tree';
import { source } from '@/lib/source';
import { firstPageUrl } from '@/lib/page-tree-utils';
import { getPageImageUrl, gitConfig, siteName, siteUrl } from '@/lib/shared';

type DocsPage = InferPageType<typeof source>;

const organization: Organization = {
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
};

/** Page tree names are ReactNodes; Schema.org needs plain text. */
function textOf(name: ReactNode): string {
  return typeof name === 'string' || typeof name === 'number'
    ? String(name)
    : '';
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };
}

export function softwareSourceCodeJsonLd(
  description: string,
): WithContext<SoftwareSourceCode> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: siteName,
    description,
    url: siteUrl,
    codeRepository: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    programmingLanguage: 'TypeScript',
    runtimePlatform: 'React',
    license: 'https://opensource.org/license/mit',
  };
}

export function techArticleJsonLd(page: DocsPage): WithContext<TechArticle> {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.data.title,
    description: page.data.description,
    url: `${siteUrl}${page.url}`,
    image: `${siteUrl}${getPageImageUrl(page).url}`,
    author: organization,
    publisher: organization,
  };
}

/**
 * Docs > section > page, as the visible breadcrumb shows it, except that Docs
 * names the first docs page: `/docs` itself redirects there. A folder without
 * an index page links to its first page. Each section is a root folder, whose
 * crumb fumadocs drops; as in components/docs-breadcrumb.tsx, the section is
 * passed as the tree so `includeRoot` names it and links its first page.
 */
export function breadcrumbJsonLd(page: DocsPage): WithContext<BreadcrumbList> {
  const tree = source.getPageTree();
  const path =
    findPath(
      tree.children,
      (node) => node.type === 'page' && node.url === page.url,
    ) ?? [];
  const section = path.findLast(
    (node): node is PageTree.Folder => node.type === 'folder' && !!node.root,
  );
  const items = [
    { name: 'Docs', url: firstPageUrl(tree) },
    ...getBreadcrumbItemsFromPath(section ?? tree, path, {
      includePage: true,
      includeRoot: section ? { url: firstPageUrl(section) ?? '' } : false,
    }).map((item) => ({
      name: textOf(item.name),
      url:
        item.url ??
        path.flatMap((node) =>
          node.type === 'folder' && node.name === item.name
            ? flattenTree(node.children)
            : [],
        )[0]?.url,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${siteUrl}${item.url}` : undefined,
    })),
  };
}
