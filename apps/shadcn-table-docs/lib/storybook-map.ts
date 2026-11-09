import type { Base } from '@/lib/install';
import { storybookUrl } from '@/components/mdx/storybook-link';

/**
 * Example page slug (content/docs/examples/<slug>.mdx) to the Storybook story
 * that matches it: the first story of the best-matching story file in
 * packages/shadcn-table/stories. Ids follow Storybook's rule, kebab-case of
 * `<title>--<exportName>`, checked against storybook-static/index.json.
 * Examples with no matching story file are left out and open the base's
 * Storybook root.
 */
export const storybookStoryId: Record<string, string> = {
  basic: 'basic--default',
  'column-ordering':
    'features-column-ordering-examples--column-ordering-enabled',
  'row-ordering': 'features-row-ordering-examples--row-ordering-enabled',
  'row-dragging': 'features-row-dragging-examples--row-dragging-enabled',
  'editing-crud':
    'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'editing-crud-inline-row':
    'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'editing-crud-inline-cell':
    'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'editing-crud-inline-table':
    'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'editing-crud-tree':
    'features-editing-examples--editing-enabled-edit-mode-modal-default',
  'expanding-tree':
    'features-sub-row-tree-examples--sub-row-tree-enabled-default',
  'expanding-tree-flat-parse':
    'features-sub-row-tree-examples--sub-row-tree-enabled-default',
  'column-grouping':
    'features-column-grouping-examples--column-grouping-enabled',
  'customized-grouping':
    'features-column-grouping-examples--column-grouping-enabled',
  'aggregation-and-grouping': 'features-aggregation-examples--aggregation',
  'detail-panel':
    'features-detail-panel-examples--detail-panel-enabled-semantic',
  'chart-detail-panel':
    'features-detail-panel-examples--detail-panel-enabled-semantic',
  'lazy-detail-panel':
    'features-detail-panel-examples--detail-panel-enabled-semantic',
  'filter-variants': 'features-filtering-examples--filtering-enabled-default',
  'faceted-values': 'features-filtering-examples--filtering-enabled-default',
  'filter-switching': 'features-filtering-examples--filtering-enabled-default',
  'popover-filters': 'features-filtering-examples--filtering-enabled-default',
  'subheader-filters': 'features-filtering-examples--filtering-enabled-default',
  'custom-filter-ui': 'features-filtering-examples--filtering-enabled-default',
  'sticky-header':
    'styling-sticky-header-examples--sticky-header-disabled-default',
  'column-pinning': 'features-column-pinning-examples--column-pinning-enabled',
  'sticky-row-pinning':
    'features-row-pinning-examples--row-pinning-sticky-default-enabled',
  'static-row-pinning':
    'features-row-pinning-examples--row-pinning-sticky-default-enabled',
  'sticky-row-selection':
    'features-row-pinning-examples--row-pinning-sticky-default-enabled',
  'lazy-sub-rows':
    'features-sub-row-tree-examples--sub-row-tree-enabled-default',
  virtualized: 'features-virtualization--enable-row-virtualization-dense',
  'row-virtualization':
    'features-virtualization--enable-row-virtualization-dense',
  'column-virtualization':
    'features-virtualization--enable-row-virtualization-dense',
  'infinite-scrolling':
    'features-virtualization--enable-row-virtualization-dense',
};

/** The selected base's Storybook, deep-linked to the example's story. */
export function storybookExampleUrl(base: Base, slug: string | undefined) {
  const id = slug ? storybookStoryId[slug] : undefined;
  return id ? `${storybookUrl[base]}?path=/story/${id}` : storybookUrl[base];
}
