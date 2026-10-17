#!/usr/bin/env node
/**
 * Sync MRT docs pages into this fumadocs app.
 *
 * Reads ../material-react-table-docs/pages/docs/**\/*.mdx and writes
 * content/docs/<same relative path>.mdx, plus:
 *   - lib/routes.ts            (MRT components/navigation/routes.ts, text-mapped)
 *   - content/docs/meta.json   (sidebar order, from routes.ts)
 *   - content/docs/<section>/meta.json for every /docs/<section> route
 *
 * Usage:
 *   node scripts/sync-mrt-docs.mjs                     # all pages
 *   node scripts/sync-mrt-docs.mjs index.mdx getting-started/install.mdx
 *   node scripts/sync-mrt-docs.mjs prop-tables         # lib/prop-tables/*.ts
 *
 * Everything not listed in the tables below is copied verbatim.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const MRT_DIR = path.resolve(APP_DIR, '..', 'material-react-table-docs');
const MRT_PAGES = path.join(MRT_DIR, 'pages', 'docs');
const MRT_ROUTES = path.join(MRT_DIR, 'components', 'navigation', 'routes.ts');
const MRT_PROP_TABLES = path.join(MRT_DIR, 'components', 'prop-tables');
const OUT_PAGES = path.join(APP_DIR, 'content', 'docs');
const OUT_ROUTES = path.join(APP_DIR, 'lib', 'routes.ts');
const OUT_PROP_TABLES = path.join(APP_DIR, 'lib', 'prop-tables');
const SRT_TYPES = path.resolve(
  APP_DIR,
  '..',
  '..',
  'packages',
  'shadcn-react-table',
  'src',
  'components',
  'ui',
  'shadcn-react-table',
  'types.ts',
);

const REGISTRY_INSTALL =
  'pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table';

// This repository, for source links that MRT points at KevinVandy's repo.
const SRT_REPO = 'https://github.com/anindosarker/shadcn-react-table';
const SRT_SRC =
  'packages/shadcn-react-table/src/components/ui/shadcn-react-table';
// No deployed storybook yet; MRT's storybook links go to the stories folder.
const SRT_STORIES_URL = `${SRT_REPO}/tree/main/packages/shadcn-react-table/stories`;

/**
 * mui.com API page slug -> shadcn/ui docs page for the part SRT uses in its
 * place. Slugs not listed link the components index.
 */
const SHADCN_DOCS = {
  table: 'table',
  'table-cell': 'table',
  'table-row': 'table',
  'table-head': 'table',
  'table-body': 'table',
  'table-footer': 'table',
  'table-container': 'table',
  'icon-button': 'button',
  button: 'button',
  'text-field': 'input',
  autocomplete: 'combobox',
  checkbox: 'checkbox',
  slider: 'slider',
  skeleton: 'skeleton',
  pagination: 'pagination',
  'linear-progress': 'progress',
  'circular-progress': 'spinner',
  dialog: 'dialog',
  chip: 'badge',
  alert: 'alert',
  'date-picker': 'date-picker',
  'date-time-picker': 'date-picker',
  'time-picker': 'date-picker',
};

/** Replacement callback for mui.com API links (TEXT_MAP). */
function shadcnDocsUrl(_url, slug) {
  const page = SHADCN_DOCS[slug];
  return page
    ? `https://ui.shadcn.com/docs/components/${page}`
    : 'https://ui.shadcn.com/docs/components';
}

/**
 * Text replacements, applied in order to page bodies, titles, descriptions,
 * routes.ts and prop-table data. Order matters: longer / more specific
 * patterns first.
 */
const TEXT_MAP = [
  // import path (quoted) before the bare package name is rewritten
  ["'material-react-table'", "'@/components/ui/shadcn-react-table'"],
  // muiTableBodyRowProps -> srtTableBodyRowProps (any mui*Props option)
  [/\bmui([A-Z][A-Za-z]*Props)\b/g, 'srt$1'],
  ['Material React Table', 'Shadcn React Table'],
  ['material-react-table', 'shadcn-react-table'],
  ['MaterialReactTable', 'ShadcnReactTable'],
  ['Material UI', 'shadcn/ui'],
  ['MUI', 'shadcn/ui'],
  ['MRT', 'SRT'],
  ['mrt', 'srt'],
  // MRT's npm install tabs become the shadcn registry command.
  [/<InstallCommand\b[^>]*\/>/g, '```bash\n' + REGISTRY_INSTALL + '\n```'],
  // MRT's CodeSandbox iframe becomes the live basic example.
  ['<SimpleCodeSandbox />', '<BasicExample />'],
  // MRT's Paper wrapper is SRT_TableLayout; the option is srtTableLayoutProps.
  ['srtTablePaperProps', 'srtTableLayoutProps'],
  // MRT pages import MUI Box for one inline colored span (column-filtering,
  // global-filtering). Drop the import and render a Tailwind span.
  [/^import Box from '@mui\/material\/Box';\n/m, ''],
  [
    '<Box component="span" color="warning.main">',
    '<span className="text-yellow-600">',
  ],
  ['</Box>', '</span>'],
  // Prose wildcards for the option family (memoization, table-event-listeners)
  // and MRT's short "Mui" spelling (row-selection).
  ['`mui*Props`', '`srt*Props`'],
  ['`mui...Props`', '`srt...Props`'],
  [/\bMui\b/g, 'shadcn/ui'],
  // MRT-only facts (2026-10-17): release history, MUI styling, MRT links.
  // Single-line "> New in vX.Y" callouts and "new in v2.8" code comments are
  // MRT release history.
  [/^> New in [vV]\d[^\n]*\n\n/gm, ''],
  [
    /^> `'autocomplete'`, `'date'`, and `'date-range'`, variants are new in v2\.0\.0\n>\n> `datetime`, `datetime-range`, `time`, and `time-range` variants are new in v2\.4\.0\n\n/m,
    '',
  ],
  [' - new in v2.8', ''],
  [
    '//new in v2.8 (default is false for this column)',
    '//default is false for this column',
  ],
  [
    '//new in v2.8 (allow this column to grow to fill in remaining space)',
    '//allow this column to grow to fill in remaining space',
  ],
  ['//new in v2.8 - ', '//'],
  [' //new in v2.8\n', '\n'],
  // MUI's `sx` is `style` on an SRT part. Nested selectors are rewritten to
  // Tailwind classes per page.
  [/\bsx: \{/g, 'style: {'],
  [/\bsx=\{\{/g, 'style={{'],
  ['`mui...Prop`', '`srt...Prop`'],
  // MUI Box in code samples; `</Box>` is already mapped to `</span>` above.
  [/<Box\b/g, '<span'],
  ['underlying Material components', 'underlying shadcn/ui components'],
  [
    'use the Material Pagination component instead',
    'use the shadcn/ui Pagination component instead',
  ],
  ['material react table', 'shadcn react table'],
  [
    /https:\/\/www\.(?:shadcn|Material)-react-table\.dev\/\?path=[^\s)]+/g,
    SRT_STORIES_URL,
  ],
  // MRT source links (already name-mapped) point at this repository.
  [
    /https:\/\/(?:www\.)?github\.com\/[Kk]evin[Vv]andy\/shadcn-react-table\/(blob|tree)\/v3\/packages\/shadcn-react-table\/src\/(?:components\/)?/g,
    `${SRT_REPO}/$1/main/${SRT_SRC}/`,
  ],
  [
    /https:\/\/(?:www\.)?github\.com\/[Kk]evin[Vv]andy\/shadcn-react-table/g,
    SRT_REPO,
  ],
  // mui.com API links (prop tables, customize-components) -> shadcn/ui docs.
  [
    /https:\/\/mui\.com\/(?:material-ui\/api|x\/api\/date-pickers)\/([a-z-]+)\/?(?:#props)?/g,
    shadcnDocsUrl,
  ],
  ['shadcn/ui X DatePicker Props', 'shadcn/ui Date Picker Props'],
  ['shadcn/ui X DateTimePicker Props', 'shadcn/ui Date Picker Props'],
  ['shadcn/ui X TimePicker Props', 'shadcn/ui Date Picker Props'],
  // MUI X Charts in the chart-detail-panel description; the example uses Recharts.
  ['shadcn/ui X Charts', 'Recharts'],
  ['https://mui.com/x/react-charts/getting-started/', 'https://recharts.org/'],
  // MRT's Paper wrapper component is SRT_TableLayout (srtTableLayoutProps above).
  ['SRT_TablePaper', 'SRT_TableLayout'],
  ['The Paper component includes UI', 'The layout component includes UI'],
  // rewriteExampleTags runs before TEXT_MAP, so MRT's CodeSandbox tag on the
  // usage page arrives here under its registry name.
  ['<SimpleCodeSandboxExample />', '<BasicExample />'],
];

/**
 * Replacements applied to routes.ts after TEXT_MAP: MRT-only pages that are
 * not ported (plan: skipped list). Append only.
 */
const ROUTES_MAP = [
  [
    /\n\s*\{\n\s*href: '\/docs\/getting-started\/migrating-to-v3',\n(?:[^\n]*\n)*?\s*\},(?=\n)/,
    '',
  ],
  [/\n\s*\{\n\s*label: 'Blog',\n(?:[^\n]*\n)*?\s*\],\n\s*\},(?=\n)/, ''],
];

/** Replacements applied only to the page title (from <Head><title>). */
const TITLE_MAP = [
  [/ - Material React Table V\d Docs$/, ''],
  [/ - Material React Table Docs$/, ''],
  [/\bV3\b/g, 'V1'],
];

/**
 * Relative imports. Keys are path fragments; a matching import is rewritten
 * to the value, or dropped when the value is null (components are resolved
 * through components/mdx.tsx instead).
 */
const IMPORT_MAP = {
  'next/head': null,
  'components/navigation/routes': '@/lib/routes',
};

/** getting-started/install: the peer dependency callout (shadcn registry). */
const INSTALL_PEERS = `> \`shadcn-react-table\` is distributed through the shadcn registry: the install command below copies the component into your project and installs its dependencies.
>
> If you are already using shadcn/ui, you probably already have most of these peer dependencies installed.
>
> Just double-check that you have the following in your project, or use the [full install commands](<#install-with-required-peer-dependencies-(recommended)>) below.
>
> 1.  A shadcn/ui project initialised with \`shadcn init\` (Tailwind CSS v4)
> 2.  \`react\` and \`react-dom\` (v18+)
>
> The install command adds \`@tanstack/react-table\` (v8), \`@tanstack/react-virtual\`, \`lucide-react\` and the shadcn/ui components the table is built from.
`;

/** guides/customize-components: MRT's "Styling MUI Components" / sx section. */
const STYLING_SECTION = `### Styling Components

Each \`srt...Props\` prop accepts \`className\` and \`style\`, which are forwarded to the underlying element. Since Shadcn React Table is built with Tailwind CSS, the recommended way to style components is with Tailwind classes in \`className\`. They are merged with the default classes, and they can use the shadcn/ui CSS variables from your theme.

1. The \`style\` prop works just like a style prop in any React component.

\`\`\`jsx
const table = useShadcnReactTable({
  columns,
  data,
  srtTableHeadCellProps: {
    //simple styling with the \`style\` prop
    style: {
      fontWeight: 'normal',
      fontSize: '14px',
    },
  },
});

return <ShadcnReactTable table={table} />;
\`\`\`

2. Tailwind classes in \`className\` get easy access to your theme colors, no hook needed.

\`\`\`jsx
const table = useShadcnReactTable({
  columns,
  data,
  srtTableHeadCellProps: {
    //shadcn/ui theme colors are available as Tailwind classes
    className: 'text-muted-foreground',
  },
});

return <ShadcnReactTable table={table} />;
\`\`\`

3. Tailwind responsive variants give you a concise way to add media queries to your styling.

\`\`\`jsx
const table = useShadcnReactTable({
  columns,
  data,
  srtTableHeadCellProps: {
    //responsive variants instead of media queries
    className:
      'text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px]',
  },
});

return <ShadcnReactTable table={table} />;
\`\`\`

4. Tailwind arbitrary variants let you target nested elements and states.

\`\`\`jsx
const table = useShadcnReactTable({
  columns,
  data,
  srtTableHeadCellProps: {
    //target nested elements (the buttons in the header cell) and the hover state
    className: '[&_button]:p-0 hover:font-bold',
  },
});
\`\`\`

You can learn more about utility classes in the official [Tailwind CSS Docs](https://tailwindcss.com/docs/styling-with-utility-classes) and about the theme variables in the [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming).

`;

/**
 * guides/customize-components: MRT's "Material UI Theme", nested
 * ThemeProvider, "MRT Theme Values" and "Table Paper" sections.
 */
const THEME_SECTION = `### Theming

Shadcn React Table respects your shadcn/ui theme. If you have already set up shadcn/ui with \`shadcn init\`, you should already be set. The table reads the CSS variables from your global stylesheet (\`--background\`, \`--foreground\`, \`--primary\`, \`--border\`, \`--muted\`, etc.), so changing them changes the table along with the rest of your app. If you have not set that up, you should visit the official [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming) to learn how.

\`\`\`css
/* app/globals.css: have you set up your theme variables globally in your app root? */
:root {
  --primary: oklch(0.45 0.2 280);
  --border: oklch(0.9 0 0);
}

.dark {
  --primary: oklch(0.7 0.18 280);
  --border: oklch(0.3 0 0);
}
\`\`\`

#### Customize Theme Just for your Table

Because the theme is CSS variables, you can change it just for the \`<ShadcnReactTable />\` component by redefining the variables on an element around just your table (or on the table root through the \`srtTableLayoutProps\` table option). The values only effect the \`<ShadcnReactTable />\` component, and not the rest of your site. Everything you do not redefine is inherited from your global theme, so you do not have to redefine everything again. You can just tweak the values you want to change.

\`\`\`jsx
//in one of your normal components
return (
  <div className="[--primary:var(--secondary)] [--background:rgb(254,255,244)] dark:[--background:#000]">
    <ShadcnReactTable table={table} />
  </div>
);
\`\`\`

#### Custom Theme Example

<MuiThemeExample />

### Table Theme Values

The colors Shadcn React Table uses internally come from the shadcn/ui theme variables, so there is no separate theme object to pass in. Here is where the default values come from, if you want to override them:

- the table and toolbars use \`--background\` and \`--foreground\`
- selected rows use \`--primary\` at 20% opacity, pinned rows at 10%, hovered rows use \`--foreground\` at 10%
- dragging borders use \`--primary\`
- filter match highlighting uses \`--destructive\` at 20% opacity (30% in dark mode), on the element with \`data-slot="srt-match-highlight"\`

### Customize Table Layout Styling

You can customize both the props and the styles of the internal \`<SRT_TableLayout />\` component that wraps the table by passing in a \`srtTableLayoutProps\` table option. This is useful if you want to remove the shadow, or change the border radius, or any other styling you want to do to the wrapper.

\`\`\`jsx
const table = useShadcnReactTable({
  columns,
  data,
  srtTableLayoutProps: {
    //customize wrapper styles
    className: 'rounded-none border-dashed shadow-none',
  },
});

return <ShadcnReactTable table={table} />;
\`\`\`

`;

/**
 * Per-page titles. MRT titles both inline editing example pages "Editing
 * CRUD Inline Example", which shows twice in the sidebar and keeps their
 * title-repeating heading (dropTitleHeading needs nested word sets).
 */
const PAGE_TITLES = {
  'examples/editing-crud-inline-cell.mdx': 'Editing CRUD Inline Cell Example',
  'examples/editing-crud-inline-table.mdx': 'Editing CRUD Inline Table Example',
};

/**
 * Per-page replacements, applied last. Keys are page paths relative to
 * pages/docs (e.g. 'guides/column-size.mdx'). Append only.
 */
const PAGE_RULES = {
  // api/*: the dropped `import SourceCode from '.../<X>Source'` becomes the
  // matching prop-table source component (components/prop-tables/prop-table-source.tsx).
  'api/table-options.mdx': [['<SourceCode />', '<TableOptionsSource />']],
  'api/column-options.mdx': [['<SourceCode />', '<ColumnOptionsSource />']],
  'api/state-options.mdx': [['<SourceCode />', '<StateOptionsSource />']],
  'api/table-instance-apis.mdx': [
    ['<SourceCode />', '<TableInstanceAPIsSource />'],
  ],
  'api/column-instance-apis.mdx': [
    ['<SourceCode />', '<ColumnInstanceAPIsSource />'],
  ],
  'api/row-instance-apis.mdx': [
    ['<SourceCode />', '<RowInstanceAPIsSource />'],
  ],
  'api/cell-instance-apis.mdx': [
    ['<SourceCode />', '<CellInstanceAPIsSource />'],
  ],
  // GitHub source links point at MRT's repository; TEXT_MAP would turn them
  // into URLs that do not exist, so they are restored verbatim.
  'api/mrt-components.mdx': [
    [/https:\/\/github\.com\/KevinVandy\/[^\s)]+/g, restoreMrtUrl],
    // MRT-only facts pass: the links are now mapped to this repository by
    // TEXT_MAP before this rule runs, so restoreMrtUrl no longer matches.
    [
      'It accepts table options as props, just like in v1, but it also now simply accepts',
      'It accepts table options as props, but it can also simply accept',
    ],
    [
      '//passing props instead like in v1 is possible',
      '//passing props instead is possible',
    ],
  ],
  'api/mrt-hooks.mdx': [
    [/https:\/\/github\.com\/KevinVandy\/[^\s)]+/g, restoreMrtUrl],
  ],
  // The ported example charts with recharts, not MUI X Charts.
  'examples/chart-detail-panel.mdx': [
    [
      '[shadcn/ui X Charts](https://mui.com/x/react-charts/getting-started/)',
      '[Recharts](https://recharts.org/)',
    ],
    ['using shadcn/ui X Charts will give you', 'using Recharts will give you'],
  ],
  // MRT-only facts pass (2026-10-17): MUI versions and packages, sx and
  // theming, release history, MRT links. Text below is matched after TEXT_MAP.
  'getting-started/install.mdx': [
    [
      'latest version of Shadcn React Table (V3)',
      'latest version of Shadcn React Table (V1)',
    ],
    [
      "let's make sure you have the correct versions of React, shadcn/ui, and shadcn/ui X Date Pickers installed.",
      "let's make sure you have the correct versions of React, TanStack Table, Tailwind CSS, and shadcn/ui installed.",
    ],
    [
      /> `shadcn-react-table` requires \*\*shadcn\/ui V6\*\* packages[\s\S]*?> 6\.  `react` and `react-dom` \(v18\+\)\n/,
      INSTALL_PEERS,
    ],
    ['which is no longer supported in v2+.', 'which is not supported.'],
    [
      'Or you probably do not have the correct version of shadcn/ui installed. Make sure all material ui packages are at least V6.0 or higher if you are using SRT v3 or higher.',
      'Or your shadcn/ui components may be out of date. Re-run the install command above to update the component and its registry dependencies.',
    ],
    [
      'As of SRT V3, it uses some React 18+ features, so React 18 is required. SRT V2 and below are compatible with React 17.',
      'Shadcn React Table uses some React 18+ features, so React 18 is required.',
    ],
  ],
  'getting-started/usage.mdx': [
    [
      'and the necessary shadcn/ui V6 dependencies.',
      'and the necessary shadcn/ui dependencies.',
    ],
    [
      'https://mui.com/material-ui/getting-started/installation/',
      'https://ui.shadcn.com/docs/installation',
    ],
    [
      'https://mui.com/material-ui/customization/default-theme/',
      'https://ui.shadcn.com/docs/theming',
    ],
    [
      '/docs/guides/customize-components#material-ui-theme',
      '/docs/guides/customize-components#theming',
    ],
    [
      "<span style={{ display: 'flex', gap: '2ch', alignItems: 'center' }}>",
      '<span className="flex items-center gap-[2ch]">',
    ],
  ],
  'guides/customize-components.mdx': [
    [
      '[how to customize and use a shadcn/ui Theme](#material-ui-theme)',
      '[how to theme your table](#theming)',
    ],
    ['### shadcn/ui Props and Types', '### Props and Types'],
    [
      /> All `srt\.\.\.Props` props are strongly typed[^\n]*\n/,
      '> All `srt...Props` props are strongly typed and you should get ts hints as you write them. Each one forwards `className`, `style` and the props of the element or [shadcn/ui component](https://ui.shadcn.com/docs/components) it targets.\n',
    ],
    [
      "    color: 'secondary', //makes all checkboxes use the secondary color",
      "    className: 'rounded-full', //makes all checkboxes round",
    ],
    [
      "    color: 'secondary',\n    disabled:",
      "    className: 'rounded-full',\n    disabled:",
    ],
    [
      /### Styling shadcn\/ui Components\n[\s\S]*?(?=### Conditional Styling)/,
      STYLING_SECTION,
    ],
    [
      'Using the `sx`, `style`, or `className` props',
      'Using the `style` or `className` props',
    ],
    [
      "    //conditionally style selected rows\n    style: {\n      fontWeight: row.getIsSelected() ? 'bold' : 'normal',\n    },",
      "    //conditionally style selected rows\n    className: row.getIsSelected() ? 'font-bold' : 'font-normal',",
    ],
    [
      "    //conditionally style expanded rows\n    style: {\n      fontWeight: row.getIsExpanded() ? 'bold' : 'normal',\n    },",
      "    //conditionally style expanded rows\n    className: row.getIsExpanded() ? 'font-bold' : 'font-normal',",
    ],
    [
      "    //conditionally style pinned columns\n    style: {\n      backgroundColor: column.getIsPinned() ? '#f5f5f5' : 'inherit',\n    },",
      "    //conditionally style pinned columns\n    className: column.getIsPinned() ? 'bg-muted' : undefined,",
    ],
    [
      "    //conditionally style pinned columns\n    style: {\n      fontWeight: column.getIsPinned() ? 'bold' : 'normal',\n    },",
      "    //conditionally style pinned columns\n    className: column.getIsPinned() ? 'font-bold' : 'font-normal',",
    ],
    [
      /### shadcn\/ui Theme\n[\s\S]*?(?=### Customize Table Body, Rows, Columns, and Cells)/,
      THEME_SECTION,
    ],
    [
      "    style: {\n      //stripe the rows, make odd rows a darker color\n      '& tr:nth-of-type(odd) > td': {\n        backgroundColor: '#f5f5f5',\n      },\n    },",
      "    //stripe the rows, make odd rows a darker color\n    className: '[&_tr:nth-of-type(odd)>td]:bg-muted',",
    ],
    [
      "    style: {\n      //stripe the rows, make odd rows a darker color\n      '& td:nth-of-type(odd)': {\n        backgroundColor: '#f5f5f5',\n      },\n    },",
      "    //stripe the columns, make odd columns a darker color\n    className: '[&_td:nth-of-type(odd)]:bg-muted',",
    ],
    [
      "    style: {\n      borderRight: '2px solid #e0e0e0', //add a border between columns\n    },",
      "    className: 'border-r-2', //add a border between columns",
    ],
  ],
  'guides/table-event-listeners.mdx': [
    ['#material-ui-prop-types', '#props-and-types'],
  ],
  'guides/full-screen-toggle.mdx': [
    [
      'Under the hood in Shadcn React Table V3, when the table is full screen, these `styles` are applied to the root mui paper component:',
      'Under the hood, when the table is full screen, these classes are applied to the root table container:',
    ],
    [
      /```jsx\n\{\n  bottom: 0,[\s\S]*?zIndex: 999,\n\}\n```/,
      '```txt\nfixed inset-0 z-50 h-dvh max-h-dvh w-dvw max-w-dvw rounded-none border-0 m-0 p-0\n```',
    ],
    [
      'with a `style` object that has a `zIndex` property.',
      'with a `style` object that has a `zIndex` property (or a `z-*` Tailwind class in `className`).',
    ],
    ['  //not sx\n', ''],
    [/\n> Note: The `sx` table option will not work here[^\n]*\n/, ''],
  ],
  'guides/customize-icons.mdx': [
    [
      '[Material Icons](https://mui.com/material-ui/material-icons)',
      '[Lucide icons](https://lucide.dev)',
    ],
    ['use other Material Icons or icons', 'use other Lucide icons or icons'],
  ],
  'guides/pagination.mdx': [
    [/> Note: In v2, srtPaginationProps is now based on mui's[^\n]*\n\n/, ''],
  ],
  'guides/state-management.mdx': [
    [/> Note: `tableInstanceRef` has been removed in SRT v2[^\n]*\n\n/, ''],
    [/> Note: Previously, in early SRT v1, you could use[^\n]*\n\n/, ''],
  ],
  'guides/column-size.mdx': [
    ['exposes all mui props', 'exposes all `srt*Props`'],
    [
      'you can edit the `srtTableContainerProps.sx` styles to set `overflowX: "hidden"`',
      'you can edit the `srtTableContainerProps` `className` or `style` to set `overflow-x: hidden`',
    ],
    [
      '`srtTableHeadCellProps.sx`, `srtTableBodyCellProps.sx`, and `srtTableFooterCellProps.sx` and more',
      '`srtTableHeadCellProps`, `srtTableBodyCellProps`, and `srtTableFooterCellProps` (`className` or `style`) and more',
    ],
  ],
  'guides/editing.mdx': [
    ['//highlight mui text field red error color', '//highlight the input red'],
  ],
  'guides/best-practices.mdx': [
    [
      'npx npm-check-updates -u shadcn-react-table @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled',
      REGISTRY_INSTALL,
    ],
  ],
  'guides/column-resizing.mdx': [
    [
      'The default `columnResizeMode` is `onChange` (in SRT versions v1.7+), which',
      'The default `columnResizeMode` is `onChange`, which',
    ],
    [/> SRT V3 has a new "opposite" behavior[^\n]*\n\n/, ''],
    [
      ' This may behave differently depending on which Emotion or shadcn/ui theme settings you have enabled.',
      '',
    ],
    [
      /^If you have already set the proper `theme\.direction` setting in your shadcn\/ui theme[^\n]*\n/m,
      'Shadcn React Table does not read the document direction, so set this option explicitly when your table is rendered in an RTL layout.\n',
    ],
  ],
  'guides/toolbar-customization.mdx': [
    [
      /> Note: This guide has become much more simple since the introduction of the `useShadcnReactTable` hook in v2\. <br \/>\n> No more `tableInstanceRef` or `useReducer` rerender hacks required!\n\n/,
      '',
    ],
    [
      'pass CSS overrides to their `sx` or `style` props',
      'pass CSS overrides to their `className` or `style` props',
    ],
    [
      'https://mui.com/material-ui/react-progress/',
      'https://ui.shadcn.com/docs/components/progress',
    ],
    [
      "    <span\n      style={{\n        display: 'flex',\n        justifyContent: 'space-between',\n        alignItems: 'center',\n      }}\n    >",
      '    <span className="flex items-center justify-between">',
    ],
  ],
  'guides/accessibility.mdx': [
    [
      'Shadcn React Table V3 introduces a new table option',
      'Shadcn React Table has a table option',
    ],
    ['Now in V3, a focus trap', 'A focus trap'],
    [
      'add custom focus styles to any element using the `sx` prop.',
      'add custom focus styles to any element using the `className` prop.',
    ],
    [
      'you can just use the `sx` props to override',
      'you can just use the `className` or `style` props to override',
    ],
    [
      "      //add custom focus styles\n      style: {\n        '&:focus-visible': {\n          //or just `&:focus` if you want all focus events to be visible\n          outline: '2px solid red',\n          outlineOffset: '-2px',\n        },\n      },",
      "      //add custom focus styles (or just `focus:` if you want all focus events to be visible)\n      className:\n        'focus-visible:outline-2 focus-visible:outline-red-500 focus-visible:-outline-offset-2',",
    ],
    [
      "      style: {\n        '&:focus-visible': {\n          outline: '4px solid red',\n          outlineOffset: '-4px',\n        },\n      },",
      "      className:\n        'focus-visible:outline-4 focus-visible:outline-red-500 focus-visible:-outline-offset-4',",
    ],
  ],
  'guides/virtualization.mdx': [
    [/> SRT v1\.4 and v1\.5 have major virtualization upgrades[^\n]*\n\n/, ''],
    [/> SRT v1\.4 upgraded from `react-virtual` v2[^\n]*\n\n/, ''],
  ],
  'guides/aggregation.mdx': [
    [
      'This is now easier if you are upgraded to at least v1.3.0. You can now specify',
      'You can specify',
    ],
  ],
  'guides/column-ordering-dnd.mdx': [
    ['internally as of v2.10.0.', 'internally.'],
    ['Though, as of v2.10.0, if you do not', 'Though, if you do not'],
    ['(Initializing is optional as of v2.10.0)', '(Initializing is optional)'],
  ],
  'guides/data-columns.mdx': [
    [
      'Setting a CSS (sx or style) width prop',
      'Setting a CSS (`className` or `style`) width prop',
    ],
    ['<span color="warning.main">', '<span className="text-yellow-600">'],
  ],
  'guides/density-toggle.mdx': [
    [
      '`srtTableBodyCellProps` styles or sx prop.',
      '`srtTableBodyCellProps` `style` or `className` prop.',
    ],
  ],
};

/** Reverses TEXT_MAP inside a URL (replacement callback for PAGE_RULES). */
function restoreMrtUrl(url) {
  return url
    .replaceAll('shadcn-react-table', 'material-react-table')
    .replaceAll('ShadcnReactTable', 'MaterialReactTable')
    .replaceAll('SRT_', 'MRT_');
}

/**
 * Output path overrides (MRT page path -> content/docs path) for pages whose
 * slug carries the library name; routes.ts already maps the href through
 * TEXT_MAP. Append only.
 */
const OUTPUT_PATHS = {
  'api/mrt-components.mdx': 'api/srt-components.mdx',
  'api/mrt-hooks.mdx': 'api/srt-hooks.mdx',
};

/**
 * Example tags. MRT pages import examples under local names
 * (`import Example from '../../../examples/font-awesome-icons'`, `<Example />`)
 * that differ per page; the registry (scripts/build-example-registry.mjs)
 * exposes `<PascalCase(folder)>Example` for examples/<folder> and the file
 * name for example-groups/<Name>. Rewrites each imported tag to its registry
 * name so the page needs no hand-written import.
 */
const pascal = (s) =>
  s
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('');

function rewriteExampleTags(src) {
  const re =
    /^import\s+(\w+)\s+from\s+['"][./]*\/(examples|example-groups)\/([^'"/]+)['"];?/gm;
  const renames = [];
  for (const m of src.matchAll(re)) {
    const [, local, kind, folder] = m;
    const target = kind === 'examples' ? `${pascal(folder)}Example` : folder;
    if (local !== target) renames.push([local, target]);
  }
  return renames.reduce(
    (acc, [from, to]) =>
      acc.replace(new RegExp(`<${from}(?=[\\s/>])`, 'g'), `<${to}`),
    src,
  );
}

const EXAMPLE_GROUPS = path.join(APP_DIR, 'example-groups');
const groupPanelsCache = new Map();

/**
 * Panel map of example-groups/<group>.tsx: page slug -> registry example
 * name, resolved through the file's own imports (panel key -> local import
 * name -> examples/<folder> -> `<PascalCase(folder)>Example`).
 */
async function groupPanels(group) {
  if (groupPanelsCache.has(group)) return groupPanelsCache.get(group);
  const src = await fs.readFile(
    path.join(EXAMPLE_GROUPS, `${group}.tsx`),
    'utf8',
  );
  const folders = new Map();
  for (const m of src.matchAll(
    /^import\s+(\w+)\s+from\s+'@\/examples\/([^']+)';/gm,
  )) {
    folders.set(m[1], m[2]);
  }
  const panels = new Map();
  for (const m of src.matchAll(/^\s+'?([\w-]+)'?:\s*<(\w+)\s*\/>,?$/gm)) {
    const folder = folders.get(m[2]);
    if (folder) panels.set(m[1], `${pascal(folder)}Example`);
  }
  groupPanelsCache.set(group, panels);
  return panels;
}

/**
 * Example pages render their own example instead of the group tab strip
 * (which only guides keep): MRT's `<XExamples isPage />` becomes the group's
 * panel for the page slug. Throws when the group has no panel for the slug so
 * a renamed page cannot silently keep the strip.
 */
async function renderSingleExample(rel, src) {
  if (!rel.startsWith('examples/')) return src;
  const m = src.match(/^<(\w+) isPage \/>$/m);
  if (!m) return src;
  const slug = path.basename(rel, '.mdx');
  const example = (await groupPanels(m[1])).get(slug);
  if (!example) throw new Error(`${rel}: ${m[1]} has no panel for ${slug}`);
  return src.replace(m[0], `<${example} />`);
}

/**
 * Words that do not distinguish a page title from its first heading (MRT
 * writes "Sorting Feature Guide" under the title "Sorting Guide").
 */
const TITLE_STOPWORDS = new Set([
  'feature',
  'guide',
  'example',
  'examples',
  'props',
  'srt',
  'the',
  'a',
]);

/**
 * Title or heading text as a set of distinguishing words: lowercase, without
 * parenthesised segments, slashes, the library name and TITLE_STOPWORDS.
 */
function titleWords(text) {
  const words = text
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/shadcn react table/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !TITLE_STOPWORDS.has(w));
  return new Set(words);
}

/**
 * The first body heading repeats the title when, as word sets, one is a
 * subset of the other and they share at least one word.
 */
function headingRepeatsTitle(heading, title) {
  const h = titleWords(heading);
  const t = titleWords(title);
  if (!h.size || !t.size) return false;
  const [small, large] = h.size <= t.size ? [h, t] : [t, h];
  return [...small].every((w) => large.has(w));
}

/**
 * MRT repeats the <Head> title as the first body heading, often reworded
 * ("Sorting Feature Guide" under "Sorting Guide"); the page layout already
 * renders the frontmatter title, so the first heading (any level) is dropped
 * when it repeats the title, with one empty line after it. Only the first
 * heading of the body is considered.
 */
function dropTitleHeading(src, title) {
  const m = src.match(/^#{1,6} +(.+?)[ \t]*\n(?:[ \t]*\n)?/m);
  if (!m || !headingRepeatsTitle(m[1], title)) return src;
  return src.slice(0, m.index) + src.slice(m.index + m[0].length);
}

function applyMap(text, map) {
  return map.reduce(
    (acc, [from, to]) =>
      from instanceof RegExp ? acc.replace(from, to) : acc.replaceAll(from, to),
    text,
  );
}

function rewriteImports(src) {
  const importRe = /^import[\s\S]*?from\s+['"]([^'"]+)['"];?[ \t]*\n/gm;
  return src.replace(importRe, (stmt, spec) => {
    if (spec === 'next/head') return '';
    if (!spec.startsWith('.')) return stmt;
    const hit = Object.entries(IMPORT_MAP).find(([k]) => spec.includes(k));
    if (!hit) return '';
    const [, target] = hit;
    if (target === null) return '';
    return stmt.replace(spec, target);
  });
}

function extractHead(src) {
  const m = src.match(/<Head>([\s\S]*?)<\/Head>\s*\n?/);
  if (!m) return { body: src, title: '', description: '' };
  const head = m[1];
  const t = head.match(
    /<title>\s*(?:\{\s*['"`])?([\s\S]*?)(?:['"`]\s*\})?\s*<\/title>/,
  );
  const d = head.match(
    /<meta\s+name="description"\s+content=(?:"([^"]*)"|\{\s*['"`]([\s\S]*?)['"`]\s*\})/,
  );
  return {
    body: src.replace(m[0], ''),
    title: (t?.[1] ?? '').trim(),
    description: (d?.[1] ?? d?.[2] ?? '').replace(/\s+/g, ' ').trim(),
  };
}

function yamlString(s) {
  return JSON.stringify(s);
}

async function syncPage(rel) {
  const src = await fs.readFile(path.join(MRT_PAGES, rel), 'utf8');
  const { body, title, description } = extractHead(src);
  const fmTitle =
    PAGE_TITLES[rel] ?? applyMap(applyMap(title, TITLE_MAP), TEXT_MAP);
  const fmDesc = applyMap(description, TEXT_MAP);
  let out = rewriteExampleTags(body);
  out = rewriteImports(out);
  out = applyMap(out, TEXT_MAP);
  out = dropTitleHeading(out, fmTitle);
  out = applyMap(out, PAGE_RULES[rel] ?? []);
  out = await renderSingleExample(rel, out);
  out = out.replace(/^\s*\n/, '');
  const frontmatter = ['---', `title: ${yamlString(fmTitle)}`];
  if (fmDesc) frontmatter.push(`description: ${yamlString(fmDesc)}`);
  frontmatter.push('---', '');
  const dest = path.join(OUT_PAGES, OUTPUT_PATHS[rel] ?? rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, frontmatter.join('\n') + '\n' + out);
  return { rel: OUTPUT_PATHS[rel] ?? rel, title: fmTitle };
}

/** MRT pages that are not ported (plan: skipped list). */
const SKIPPED_PAGES = new Set([
  'getting-started/migrating-to-v3.mdx',
  // MRT's docs TOC page; /docs redirects to the install page (next.config.mjs)
  'index.mdx',
]);

async function listPages() {
  const out = [];
  async function walk(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else if (e.name.endsWith('.mdx')) out.push(path.relative(MRT_PAGES, p));
    }
  }
  await walk(MRT_PAGES);
  return out.filter((rel) => !SKIPPED_PAGES.has(rel)).sort();
}

async function loadRoutes() {
  const raw = await fs.readFile(MRT_ROUTES, 'utf8');
  const mapped = applyMap(applyMap(raw, TEXT_MAP), ROUTES_MAP);
  await fs.mkdir(path.dirname(OUT_ROUTES), { recursive: true });
  await fs.writeFile(OUT_ROUTES, mapped);
  // Evaluate the TS file as JS: drop the type block and the annotation.
  const js = mapped
    .replace(/export type RouteItem = \{[\s\S]*?\};\n/, '')
    .replace(/export const routes: Array<RouteItem> =/, 'return');
  return new Function(js)();
}

/** fumadocs meta.json files mirroring MRT's sidebar sections. */
async function writeMeta(routes) {
  const sections = routes.filter(
    (r) => r.href?.startsWith('/docs/') && Array.isArray(r.items),
  );
  const rootPages = sections.map((s) => s.href.split('/')[2]);
  await fs.mkdir(OUT_PAGES, { recursive: true });
  await fs.writeFile(
    path.join(OUT_PAGES, 'meta.json'),
    JSON.stringify({ title: 'Docs', pages: rootPages }, null, 2) + '\n',
  );
  const warnings = [];
  for (const section of sections) {
    const folder = section.href.split('/')[2];
    const prefix = `/docs/${folder}/`;
    const pages = [];
    const push = (item) => {
      if (!item.href || item.external) return;
      if (item.href.startsWith(prefix)) {
        pages.push(item.href.slice(prefix.length).split('#')[0]);
      } else if (!item.href.includes('#')) {
        warnings.push(`${folder}: skipped cross-section link ${item.href}`);
      }
    };
    for (const item of section.items) {
      // Guides groups nest their pages under `items` (with an anchor href),
      // Examples/API groups under `secondaryItems`; both become a separator.
      const group = item.secondaryItems ?? item.items;
      if (group) {
        pages.push(`---${item.label}---`);
        group.forEach(push);
      } else {
        push(item);
      }
    }
    const dir = path.join(OUT_PAGES, folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, 'meta.json'),
      JSON.stringify(
        { title: section.label, defaultOpen: true, pages: [...new Set(pages)] },
        null,
        2,
      ) + '\n',
    );
  }
  return { sections: sections.map((s) => s.label), warnings };
}

/**
 * Prop-table data files (components/prop-tables/*.ts in MRT) -> lib/prop-tables.
 * Same text map; additionally every srt*Props option name is checked against
 * the library's types.ts. Names the library does not declare stay in the data
 * (with their MRT `required` flag untouched) and are typed through an
 * `Unmapped<Name>` union so tsc keeps passing; they are reported on stdout.
 */
const PROP_TABLES = [
  {
    file: 'tableOptions.ts',
    key: 'tableOption',
    unmapped: 'UnmappedTableOption',
  },
  {
    file: 'stateOptions.ts',
    key: 'stateOption',
    unmapped: 'UnmappedStateOption',
  },
  {
    file: 'columnOptions.ts',
    key: 'columnOption',
    unmapped: 'UnmappedColumnOption',
  },
  {
    file: 'tableInstanceAPIs.ts',
    key: 'tableInstanceAPI',
    unmapped: 'UnmappedTableInstanceAPI',
  },
  {
    file: 'columnInstanceAPIs.ts',
    key: 'columnInstanceAPI',
    unmapped: 'UnmappedColumnInstanceAPI',
  },
  {
    file: 'rowInstanceAPIs.ts',
    key: 'rowInstanceAPI',
    unmapped: 'UnmappedRowInstanceAPI',
  },
  {
    file: 'cellInstanceAPIs.ts',
    key: 'cellInstanceAPI',
    unmapped: 'UnmappedCellInstanceAPI',
  },
];

function writePropTable({ file, key, unmapped }, mapped, names) {
  let out = mapped;
  const keyType = new RegExp(`(\\n\\s+${key}: keyof SRT_[A-Za-z]+<[A-Za-z]+>)`);
  if (names.length) {
    const union = names.map((n) => `'${n}'`).join(' | ');
    out = out.replace(keyType, `$1 | ${unmapped}`);
    out = out.replace(
      /(\nexport (?:type|interface) )/,
      `\n/** Options MRT documents that the library's types.ts does not declare. */\nexport type ${unmapped} = ${union};\n$1`,
    );
  }
  const header =
    '// Generated by scripts/sync-mrt-docs.mjs prop-tables from\n' +
    `// material-react-table-docs/components/prop-tables/${file}. Do not edit.\n`;
  return fs.writeFile(path.join(OUT_PROP_TABLES, file), header + out);
}

/**
 * Names that are not `srt*Props` (column options, instance API members) cannot
 * be matched against types.ts by text, so after the first write the generated
 * files are type-checked and every `Type '"x"' is not assignable` error on a
 * generated file adds `x` to that file's unmapped union.
 */
async function tscUnmapped() {
  const { execFile } = await import('node:child_process');
  const tsconfig = path.join(APP_DIR, '.sync-prop-tables.tsconfig.json');
  await fs.writeFile(
    tsconfig,
    JSON.stringify({
      extends: './tsconfig.json',
      include: ['lib/prop-tables/*.ts'],
      compilerOptions: { incremental: false },
    }),
  );
  const stdout = await new Promise((resolve) =>
    execFile(
      'npx',
      ['tsc', '--noEmit', '--pretty', 'false', '-p', tsconfig],
      { cwd: APP_DIR, maxBuffer: 64 * 1024 * 1024 },
      (_err, out) => resolve(out ?? ''),
    ),
  );
  await fs.rm(tsconfig, { force: true });
  const byFile = {};
  const re =
    /lib\/prop-tables\/([A-Za-z]+\.ts)\(\d+,\d+\): error TS\d+: Type '"([^"]+)"' is not assignable/g;
  for (const m of stdout.matchAll(re)) {
    (byFile[m[1]] ??= new Set()).add(m[2]);
  }
  return byFile;
}

async function syncPropTables() {
  const types = await fs.readFile(SRT_TYPES, 'utf8');
  const declared = new Set(types.match(/\bsrt[A-Z][A-Za-z]*Props\b/g) ?? []);
  await fs.mkdir(OUT_PROP_TABLES, { recursive: true });
  const report = [];
  for (const table of PROP_TABLES) {
    const { file, key } = table;
    const raw = await fs.readFile(path.join(MRT_PROP_TABLES, file), 'utf8');
    const mapped = applyMap(raw, TEXT_MAP);
    const names = [
      ...new Set(
        [
          ...mapped.matchAll(
            new RegExp(`${key}: '(srt[A-Z][A-Za-z]*Props)'`, 'g'),
          ),
        ]
          .map((m) => m[1])
          .filter((n) => !declared.has(n)),
      ),
    ].sort();
    await writePropTable(table, mapped, names);
    report.push({ table, mapped, names });
  }
  const extra = await tscUnmapped();
  for (const entry of report) {
    const more = extra[entry.table.file];
    if (!more?.size) continue;
    entry.names = [...new Set([...entry.names, ...more])].sort();
    await writePropTable(entry.table, entry.mapped, entry.names);
  }
  return report.map(({ table, names }) => ({ file: table.file, names }));
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === 'prop-tables') {
    const report = await syncPropTables();
    for (const { file, names } of report) {
      console.log(`prop-tables  lib/prop-tables/${file}`);
      for (const n of names) console.log(`  unmapped (not in types.ts): ${n}`);
    }
    return;
  }
  const allow = args.map((p) => p.replace(/^\.?\//, ''));
  const pages = allow.length ? allow : await listPages();
  const routes = await loadRoutes();
  const meta = await writeMeta(routes);
  const done = [];
  for (const rel of pages) done.push(await syncPage(rel));
  console.log(`routes -> ${path.relative(APP_DIR, OUT_ROUTES)}`);
  console.log(`meta.json sections: ${meta.sections.join(', ')}`);
  for (const w of meta.warnings) console.log(`warn: ${w}`);
  for (const d of done) console.log(`page  ${d.rel}  (title: ${d.title})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
