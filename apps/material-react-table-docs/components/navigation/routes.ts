export type RouteItem = {
  href: string;
  label: string;
  items?: RouteItem[];
  divider?: boolean;
  external?: boolean;
  secondaryItems?: RouteItem[];
  keywords?: string[];
};

export const routes: Array<RouteItem> = [
  {
    href: '/',
    label: 'Home',
    keywords: ['home', 'overview', 'getting-started'],
  },
  {
    href: '/about',
    label: 'About',
    keywords: ['about', 'team', 'contributors'],
  },
  {
    href: '/changelog',
    label: 'Changelog',
    keywords: ['changelog', 'updates', 'releases'],
  },
  {
    href: '/roadmap',
    label: 'Roadmap',
    keywords: ['roadmap', 'future', 'plans'],
  },
  {
    label: 'Getting Started',
    href: '/docs/getting-started',
    items: [
      {
        href: '/docs/getting-started/install',
        label: 'Install',
        keywords: ['installation', 'instructions', 'setup'],
      },
      {
        href: '/docs/getting-started/usage',
        label: 'Usage',
        keywords: ['beginner', 'guide'],
      },
      {
        href: '/docs/getting-started/migrating-to-v3',
        label: 'Migrating to V3',
        keywords: ['migration', 'upgrade', 'v3'],
      },
    ],
  },
  {
    label: 'API Reference',
    href: '/docs/api',
    items: [
      {
        label: 'Props and Options',
        href: '/docs/api/table-options',
        secondaryItems: [
          {
            href: '/docs/api/table-options',
            label: 'Table Options (Props)',
            keywords: ['props'],
          },
          {
            href: '/docs/api/column-options',
            label: 'Column Options',
          },
          {
            href: '/docs/api/state-options',
            label: 'State Options',
          },
        ],
      },
      {
        label: 'Instance APIs',
        href: '/docs/api/table-instance-apis',
        secondaryItems: [
          {
            href: '/docs/api/table-instance-apis',
            label: 'Table Instance APIs',
            keywords: ['methods', 'apis'],
          },
          {
            href: '/docs/api/column-instance-apis',
            label: 'Column Instance APIs',
            keywords: ['methods', 'apis'],
          },
          {
            href: '/docs/api/row-instance-apis',
            label: 'Row Instance APIs',
            keywords: ['methods', 'apis'],
          },
          {
            href: '/docs/api/cell-instance-apis',
            label: 'Cell Instance APIs',
            keywords: ['methods', 'apis'],
          },
        ],
      },
      {
        label: 'Components and Hooks',
        href: '/docs/api/mrt-components',
        secondaryItems: [
          {
            href: '/docs/api/mrt-components',
            label: 'MRT Components',
            keywords: ['internal'],
          },
          {
            href: '/docs/api/mrt-hooks',
            label: 'MRT Hooks',
            keywords: ['internal'],
          },
        ],
      },
    ],
  },
  {
    label: 'Quick Examples',
    href: '/docs/examples',
    items: [
      {
        href: '/docs/examples/basic',
        label: 'Basic Example',
        keywords: ['pagination', 'sorting', 'filtering'],
      },
      {
        href: '/docs/examples/minimal',
        label: 'Minimal Example',
        keywords: ['turn off', 'disable', 'caption', 'hide'],
      },
      {
        href: '/docs/examples/advanced',
        label: 'Advanced Example',
        keywords: [
          'pinning',
          'sticky',
          'cell rendering',
          'detail panel',
          'expanding',
          'style',
        ],
      },
      {
        href: '/docs/examples/custom-headless',
        label: 'Custom Headless Example',
      },
      {
        href: '/docs/examples/export-csv',
        label: 'Data Export Examples',
        secondaryItems: [
          {
            href: '/docs/examples/export-csv',
            label: 'Export to CSV Example',
            keywords: ['data', 'download'],
          },
          {
            href: '/docs/examples/export-pdf',
            label: 'Export to PDF Example',
            keywords: ['data', 'download', 'format'],
          },
        ],
      },
      {
        href: '/docs/examples/column-ordering',
        label: 'Dragging / Ordering Examples',
        secondaryItems: [
          {
            href: '/docs/examples/column-ordering',
            label: 'Column Ordering Example',
            keywords: ['dragging', 'dnd', 'drag and drop'],
          },
          {
            href: '/docs/examples/row-ordering',
            label: 'Row Ordering Example',
          },
          {
            href: '/docs/examples/row-dragging',
            label: 'Row Dragging Example',
            keywords: ['dragging', 'dnd', 'drag and drop'],
          },
        ],
      },
      {
        href: '/docs/examples/editing-crud',
        label: 'Editing (CRUD) Examples',
        secondaryItems: [
          {
            href: '/docs/examples/editing-crud',
            label: 'Modal Editing Example',
            keywords: ['popup', 'dialog', 'form'],
          },
          {
            href: '/docs/examples/editing-crud-inline-row',
            label: 'Inline Row Editing Example',
            keywords: ['form'],
          },
          {
            href: '/docs/examples/editing-crud-inline-cell',
            label: 'Inline Cell Editing Example',
            keywords: ['click to edit'],
          },
          {
            href: '/docs/examples/editing-crud-inline-table',
            label: 'Inline Table Editing Example',
            keywords: ['form'],
          },
          {
            href: '/docs/examples/editing-crud-tree',
            label: 'Tree Editing Example',
            keywords: ['form'],
          },
        ],
      },
      {
        href: '/docs/examples/expanding-tree',
        label: 'Expanding / Grouping Examples',
        secondaryItems: [
          {
            href: '/docs/examples/expanding-tree',
            label: 'Expanding Sub-Rows (Tree) Example',
            keywords: ['hierarchical', 'nested', 'parent-child'],
          },
          {
            href: '/docs/examples/expanding-tree-flat-parse',
            label: 'Expanding Parsed Tree Example',
            keywords: ['flat data', 'hierarchical', 'conversion'],
          },
          {
            href: '/docs/examples/column-grouping',
            label: 'Column Grouping Example',
            keywords: ['categorization', 'organization'],
          },
          {
            href: '/docs/examples/customized-grouping',
            label: 'Customized Grouping Example',
          },
          {
            href: '/docs/examples/aggregation-and-grouping',
            label: 'Aggregation Example',
            keywords: [
              'aggregate',
              'average',
              'calculate',
              'combine',
              'count',
              'formula',
              'max',
              'min',
              'statistics',
              'sum',
              'summarize',
              'summary',
              'total',
              'footer',
            ],
          },
          {
            href: '/docs/examples/detail-panel',
            label: 'Detail Panel (Expanding) Example',
            keywords: ['additional information', 'collapsible', 'accordion'],
          },
          {
            href: '/docs/examples/chart-detail-panel',
            label: 'Chart Detail Panel Example',
            keywords: ['graph', 'visualization', 'data representation'],
          },
        ],
      },
      {
        href: '/docs/examples/filter-variants',
        label: 'Filtering Examples',
        secondaryItems: [
          {
            href: '/docs/examples/filter-variants',
            label: 'Filter Variants Example',
            keywords: [
              'alternative',
              'autocomplete',
              'date range',
              'select',
              'multi select',
              'slider',
              'range',
            ],
          },
          {
            href: '/docs/examples/faceted-values',
            label: 'Faceted Values Example',
            keywords: [
              'faceted search',
              'autocomplete',
              'range',
              'min',
              'max',
              'suggestions',
            ],
          },
          {
            href: '/docs/examples/filter-switching',
            label: 'Filter Switching Example',
            keywords: ['toggle', 'dropdown', 'mode'],
          },
          {
            href: '/docs/examples/popover-filters',
            label: 'Popover Filters Example',
            keywords: ['excel', 'alternative filter ui'],
          },
          {
            href: '/docs/examples/custom-filter-ui',
            label: 'Custom Filter UI Example',
            keywords: ['alternative', 'drawer', 'sidebar'],
          },
        ],
      },
      {
        href: '/docs/examples/sticky-header',
        label: 'Sticky Pinning Examples',
        secondaryItems: [
          {
            href: '/docs/examples/sticky-header',
            label: 'Sticky Header Example',
          },
          {
            href: '/docs/examples/column-pinning',
            label: 'Column Pinning Example',
          },
          {
            href: '/docs/examples/sticky-row-pinning',
            label: 'Row Pinning (Sticky) Example',
          },
          {
            href: '/docs/examples/static-row-pinning',
            label: 'Row Pinning (Static) Example',
          },
          {
            href: '/docs/examples/sticky-row-selection',
            label: 'Sticky Row Selection Example',
          },
        ],
      },
      {
        href: '/docs/examples/react-query',
        label: 'Remote Data Fetching Examples',
        secondaryItems: [
          {
            href: '/docs/examples/react-query',
            label: 'React Query Example',
            keywords: ['tanstack', 'remote', 'data fetching', 'useQuery'],
          },
          {
            href: '/docs/examples/remote',
            label: 'useEffect Fetching Example',
            keywords: ['data fetching'],
          },
          {
            href: '/docs/examples/dynamic-columns',
            label: 'Dynamic Columns Example',
            keywords: ['useQuery', 'determine', 'from data'],
          },
          {
            href: '/docs/examples/lazy-detail-panel',
            label: 'Lazy Detail Panel Example',
            keywords: ['useQuery', 'lazy load'],
          },
          {
            href: '/docs/examples/lazy-sub-rows',
            label: 'Lazy Sub-Rows Example',
          },
        ],
      },
      {
        href: '/docs/examples/virtualized',
        label: 'Virtualized Examples',
        secondaryItems: [
          {
            href: '/docs/examples/virtualized',
            label: 'Fully Virtualized Example',
          },
          {
            href: '/docs/examples/row-virtualization',
            label: 'Row Virtualization Example',
          },
          {
            href: '/docs/examples/column-virtualization',
            label: 'Column Virtualization Example',
          },
          {
            href: '/docs/examples/infinite-scrolling',
            label: 'Infinite Scrolling Example',
          },
        ],
      },
      {
        href: 'https://www.material-react-table.dev',
        label: 'Extra Storybook Examples',
        external: true,
      },
    ],
  },
  {
    label: 'Guides',
    href: '/docs/guides',
    items: [
      {
        label: 'Fundamentals',
        href: '/docs/guides#fundamentals',
        items: [
          {
            href: '/docs/guides/best-practices',
            label: 'Best Practices (TypeScript)',
          },
          {
            href: '/docs/guides/data-columns',
            label: 'Data (Accessor) Columns',
          },
          {
            href: '/docs/guides/display-columns',
            label: 'Display (Built-in) Columns',
          },
          {
            href: '/docs/guides/table-event-listeners',
            label: 'Event Listeners (onClicks)',
          },
          {
            href: '/docs/guides/memoization',
            label: 'Memoization (Performance)',
          },
          {
            href: '/docs/guides/state-management',
            label: 'State Management',
          },
          {
            href: '/docs/guides/accessibility',
            label: 'Accessibility / Keyboard Navigation',
          },
        ],
      },
      {
        label: 'Customization Guides',
        href: '/docs/guides#customization-guides',
        items: [
          {
            href: '/docs/guides/customize-components',
            label: 'Customize (Style) Components',
          },
          {
            href: '/docs/guides/customize-icons',
            label: 'Custom Icons',
          },
          {
            href: '/docs/guides/localization',
            label: 'Localization / Custom Text (i18n)',
          },
          {
            href: '/docs/guides/toolbar-customization',
            label: 'Toolbar Customization',
          },
        ],
      },
      {
        label: 'Size / Width Guides',
        href: '/docs/guides#size---width-guides',
        items: [
          {
            href: '/docs/guides/column-size',
            label: 'Column Size (Widths)',
          },
          {
            href: '/docs/guides/column-resizing',
            label: 'Column Resizing',
          },
          {
            href: '/docs/guides/density-toggle',
            label: 'Density Toggle',
          },
          {
            href: '/docs/guides/full-screen-toggle',
            label: 'Full Screen Toggle',
          },
        ],
      },
      {
        label: 'Big Data Guides',
        href: '/docs/guides#big-data-guides',
        items: [
          {
            href: '/docs/guides/async-loading',
            label: 'Async Loading UI',
          },
          {
            href: '/docs/guides/pagination',
            label: 'Pagination',
          },
          {
            href: '/docs/guides/virtualization',
            label: 'Virtualization (Scrolling)',
          },
        ],
      },
      {
        label: 'Data Mutation Guides',
        href: '/docs/guides#data-mutation-guides',
        items: [
          {
            href: '/docs/guides/row-selection',
            label: 'Row Selection (Checkboxes)',
          },
          {
            href: '/docs/guides/editing',
            label: 'Editing (Text Fields)',
          },
        ],
      },
      {
        label: 'Filtering / Hiding Guides',
        href: '/docs/guides#filtering---hiding-guides',
        items: [
          {
            href: '/docs/guides/column-filtering',
            label: 'Column Filtering',
          },
          {
            href: '/docs/guides/global-filtering',
            label: 'Global Filtering (Search)',
          },
          {
            href: '/docs/guides/column-hiding',
            label: 'Column Hiding',
          },
        ],
      },
      {
        label: 'Grouping / Expanding Guides',
        href: '/docs/guides#grouping---expanding-guides',
        items: [
          {
            href: '/docs/guides/detail-panel',
            label: 'Detail Panel (Expanding)',
          },
          {
            href: '/docs/guides/expanding-sub-rows',
            label: 'Expanding Sub-Rows (Tree)',
          },
          {
            href: '/docs/guides/column-grouping',
            label: 'Column Grouping',
          },
          {
            href: '/docs/guides/aggregation',
            label: 'Aggregation',
          },
        ],
      },
      {
        label: 'Sticky Pinning / Freezing Guides',
        href: '/docs/guides#sticky-pinning---freezing-guides',
        items: [
          {
            href: '/docs/guides/sticky-header',
            label: 'Sticky Header/Footer',
          },
          {
            href: '/docs/guides/column-pinning',
            label: 'Column Pinning (Sticky)',
          },
          {
            href: '/docs/guides/row-pinning',
            label: 'Row Pinning (Sticky)',
          },
        ],
      },
      {
        label: 'Sort / Order / DnD Guides',
        href: '/docs/guides#sort---order---dnd-guides',
        items: [
          {
            href: '/docs/guides/sorting',
            label: 'Sorting',
          },
          {
            href: '/docs/guides/row-ordering-dnd',
            label: 'Row Ordering and Dragging',
          },
          {
            href: '/docs/guides/column-ordering-dnd',
            label: 'Column Ordering and Dragging',
          },
          {
            href: '/docs/guides/row-numbers',
            label: 'Row Numbers',
          },
        ],
      },
      {
        label: 'Action Button / Menu Guides',
        href: '/docs/guides#action-button---menu-guides',
        items: [
          {
            href: '/docs/guides/column-actions',
            label: 'Column Actions (Menu)',
          },
          {
            href: '/docs/guides/cell-actions',
            label: 'Cell Actions (Context Menu)',
          },
          {
            href: '/docs/guides/row-actions',
            label: 'Row Actions (Buttons)',
          },
          {
            href: '/docs/guides/click-to-copy',
            label: 'Click to Copy',
          },
        ],
      },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
    items: [
      {
        href: '/blog/the-best-react-data-grid-table-libraries-with-material-design-in-2023',
        label: 'The Best Data Grid Libraries...',
      },
    ],
  },
  {
    label: 'Other',
    href: '#',
    items: [
      {
        href: 'https://discord.gg/5wqyRx6fnm',
        label: 'Discord',
        external: true,
      },
      {
        href: 'https://www.github.com/kevinvandy/material-react-table',
        label: 'GitHub',
        external: true,
      },
      {
        href: 'https://www.npmjs.com/package/material-react-table',
        label: 'NPM',
        external: true,
      },
    ],
  },
];
