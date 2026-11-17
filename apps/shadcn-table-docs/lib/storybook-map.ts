import type { Base } from '@/lib/install';
import { storybookUrl } from '@/components/mdx/storybook-link';

/**
 * Example page slug (content/docs/examples/<slug>.mdx) to its exact story in
 * packages/shadcn-table/stories: the same columns, options and data (spec 56,
 * D106). Every example page has one, and no two pages share a story. Ids follow
 * Storybook's rule, kebab-case of `<title>--<story name>`, checked against
 * storybook-static/base/index.json.
 */
export const storybookStoryId: Record<string, string> = {
  basic: 'basic--basic',
  'server-side-pagination': 'features-server-data--server-side-pagination',
  'inline-editing': 'features-editing--inline-editing',
  virtualization: 'features-virtualization--virtualization',
  advanced: 'features-customization--advanced',
  'filter-variants': 'features-filtering--filter-variants',
  'faceted-values': 'features-filtering--faceted-values',
  'filter-switching': 'features-filtering--filter-switching',
  'popover-filters': 'features-filtering--popover-filters',
  'subheader-filters': 'features-filtering--subheader-filters',
  'custom-filter-ui': 'features-filtering--custom-filter-ui',
  remote: 'features-server-data--remote-data-fetching',
  'dynamic-columns': 'features-server-data--dynamic-columns',
  'lazy-detail-panel': 'features-detail-panel--lazy-detail-panel',
  'lazy-sub-rows': 'features-sub-row-tree--lazy-sub-rows',
  'sticky-header': 'styling-sticky-header--sticky-header',
  'column-pinning': 'features-column-pinning--column-pinning',
  'sticky-row-pinning': 'features-row-pinning--sticky-row-pinning',
  'static-row-pinning': 'features-row-pinning--static-row-pinning',
  'sticky-row-selection': 'features-row-pinning--sticky-row-selection',
  'row-virtualization': 'features-virtualization--row-virtualization',
  'column-virtualization': 'features-virtualization--column-virtualization',
  'infinite-scrolling': 'features-virtualization--infinite-scrolling',
  'editing-crud': 'features-editing--editing-crud',
  'editing-crud-inline-cell': 'features-editing--editing-crud-inline-cell',
  'editing-crud-inline-table': 'features-editing--editing-crud-inline-table',
  'editing-crud-tree': 'features-editing--editing-crud-tree',
  'column-grouping': 'features-column-grouping--column-grouping',
  'customized-grouping': 'features-column-grouping--customized-grouping',
  'aggregation-and-grouping': 'features-aggregation--aggregation-and-grouping',
  'expanding-tree': 'features-sub-row-tree--expanding-tree',
  'expanding-tree-flat-parse': 'features-sub-row-tree--expanding-parsed-tree',
  'detail-panel': 'features-detail-panel--detail-panel',
  'chart-detail-panel': 'features-detail-panel--chart-detail-panel',
  'column-ordering': 'features-column-ordering--column-dnd-ordering',
  'row-ordering': 'features-row-ordering--row-dnd-ordering',
  'row-dragging': 'features-row-dragging--row-dragging',
  'export-csv': 'features-export--csv-export',
  'export-pdf': 'features-export--pdf-export',
  minimal: 'features-customization--minimal',
  'custom-headless': 'features-customization--custom-headless',
  'persistent-view': 'features-view-settings--persistent-view',
};

/** The selected base's Storybook, deep-linked to the example's story. */
export function storybookExampleUrl(base: Base, slug: string | undefined) {
  const id = slug ? storybookStoryId[slug] : undefined;
  return id ? `${storybookUrl[base]}?path=/story/${id}` : storybookUrl[base];
}
