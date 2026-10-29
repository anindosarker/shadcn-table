# Changelog

All notable changes to shadcn-table are recorded here, newest first, in the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Entries are
written while the work happens, under `## Unreleased`, below `### Breaking`,
`### Removed`, `### Added`, `### Changed`, `### Fixed` or `### Docs`. The version pull request
that the release workflow opens renames that heading to the version and the
date; merging it publishes the section as the GitHub release notes.

## 0.6.4 - 2026-10-29

### Docs

- The API reference index explains versioning: everything exported is public, the three bases stay at parity, TanStack Table is pinned to `^9`, renamed options keep an alias for one minor, upgrade is `shadcn add --overwrite` plus this changelog.

## 0.6.3 - 2026-10-29

### Changed

- The Storybook base picker shows a chevron before the base name.
- The shadcn base is called base everywhere, in the Storybook picker, the docs and the
  maintainer scripts; edition is gone.
- Maintainer renames: `scripts/registry/bases.mjs` (`BASES`, `REFERENCE_BASE`, `DEFAULT_BASE`,
  `BASE_LABELS`, `BASE_PORTS`, `resolveBase`, `baseItemName`), `.storybook/base-tool.ts`,
  `check-pages.mjs --url <url> --base <base>` (was `--base <url> --edition <base>`), and
  `check-storybook.mjs --url <url>` (was `--base <url>`).

## 0.6.2 - 2026-10-29

### Changed

- Base UI is listed first wherever the editions appear: the docs edition tabs and menus, the
  Storybook edition switch, the README, the install pages and the agent skill read Base UI,
  Radix UI, React Aria. The README's quick start installs the Base UI edition; Radix UI and
  React Aria sit in the fold.
- The docs header's edition switch is a select button showing the current edition, opening a
  menu with the three editions; the edition tabs on the install, init and best-practices pages
  stay tabs. The Storybook edition switch is the toolbar's own select, like the viewport and
  background pickers, in place of three buttons.
- Maintainers: every edition script names its edition. `storybook`, `storybook:build` and
  `test` become `storybook:radix`, `storybook:build:radix` and `test:radix` (the `:base` and
  `:aria` scripts are unchanged); the root `storybook:build` builds all three, Base UI first.
  `ST_BASE` unset or unknown now means the Base UI tree, not Radix UI, for `vite`, `vitest`
  and `storybook`.

## 0.6.1 - 2026-10-28

### Changed

- Base UI is the edition shown first: the docs edition tabs and the command bar open on Base UI
  until the reader picks one (a stored pick is kept), and the Storybook root
  (`storybook.shadcn-table.com/`) redirects to the Base UI build. The three Storybook builds
  live under `/radix/`, `/base/` and `/aria/`; `/base/` and `/aria/` links keep working, old
  root links land on Base UI. The Storybook edition tool marks the current edition's button.
- Every committed registry item is named by its edition: the GitHub-namespace addresses of the
  Radix UI items are `anindosarker/shadcn-table/shadcn-table-radix`,
  `shadcn-table-radix-locale-<code>` and `example-<slug>-radix`. The plain GitHub addresses
  (`anindosarker/shadcn-table/shadcn-table`, `shadcn-table-locale-<code>`, `example-<slug>`)
  now install the Base UI edition, as aliases of the `-base` items; before, they installed
  the Radix UI items. The hosted item names are unchanged:
  `/r/radix/shadcn-table.json`, `/r/radix/shadcn-table-locale-<code>.json` and
  `/r/radix/example-<slug>.json` as before.

### Fixed

- The Base UI and React Aria hosted locale items' descriptions name the hosted item
  `shadcn-table` (`/r/base/` and `/r/aria/` said `shadcn-table-base` and `shadcn-table-aria`).
- shadcn parts re-added by a deterministic `add-part`: `pnpm add-part <edition> <part>` now
  writes the same bytes whatever the invocation order (the `'use client'` directive is set per
  file from the upstream item, `font-heading` survives the CLI's class resolution), and every
  part of every edition was re-added once with it. Repo-internal; nothing changes for users.
- Radix UI and Base UI: installing shadcn-table no longer replaces the project's
  `components/ui/checkbox.tsx` with a fork. The indeterminate dash on the select-all and
  partially selected row checkboxes is drawn by the library's own `ST_Checkbox` wrapper on
  every edition, and `checkbox` arrives as a plain registry dependency. The checkbox filter's
  unset state on React Aria now shows the same dash as on Radix UI and Base UI instead of a
  check.

## 0.6.0 - 2026-10-28

### Changed

- Docs examples per edition: `apps/shadcn-table-docs/examples/<edition>/<slug>/` holds one
  hand-written set per edition (Radix UI, Base UI, React Aria) in place of one Radix source
  rewritten per base; the code view, the GitHub link and the agent prompt show the selected
  edition's source, and `pnpm check:bases` guards the three sets the way it guards the
  library trees (`scripts/registry/examples-<edition>-diff.json`). GitHub-namespace example
  items are `example-<slug>`, `example-<slug>-base` and `example-<slug>-aria`; the hosted
  `/r/<edition>/example-<slug>.json` names are unchanged. `custom-headless` renders the shadcn
  `Table` parts on Radix UI and Base UI and the React Aria `Table` collection on React Aria.

### Fixed

- Registry example items for Base UI and React Aria: `/r/base/example-<slug>.json` and
  `/r/aria/example-<slug>.json` carried the Radix source (`asChild`, `disabled` on `Button`,
  `onValueChange` on `RadioGroup`, the Radix tooltip composition), which those editions' parts
  reject; they now carry that edition's code.
- React Aria edition: the `label` part is what shadcn ships (`add-part.mjs` output), the hand
  edit that dropped its unused `import * as React` is reverted, and `shadcn-table-aria` lists
  `label` as a registryDependency like every other part instead of shipping its own copy.
  Unused locals and parameters are checked by ESLint (`@typescript-eslint/no-unused-vars`, `_`
  prefix tolerated, parts ignored), no longer by `noUnusedLocals` and `noUnusedParameters` in
  the tsconfigs.

## 0.5.1 - 2026-10-28

### Changed

- Release flow: `.github/workflows/pr.yml` replaces `ci.yml` and adds a `release impact` job
  that asks every pull request for one `release:` label (`release:patch`, `release:minor`,
  `release:major`, `release:skip`); the `registry` and `install` jobs now run on every pull
  request. `.github/workflows/release.yml` computes the next version from that label or the
  `## Unreleased` headings (`scripts/release/next-version.mjs`), opens or updates the
  `chore: version <v>` pull request from `release/next`, and on its merge tags, smokes,
  installs, publishes the GitHub release and comments on the shipped pull requests.
  `scripts/release.mjs` and the root `release` script are gone.

## 0.5.0 - 2026-10-28

### Added

- React Aria edition: a third edition of the table on shadcn's React Aria parts (`aria-nova`
  style, `react-aria-components`), same API. Registry item `shadcn-table-aria` plus its 38
  locale items (`shadcn-table-aria-locale-<code>`). Install on an `aria-*` style with
  `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/aria/shadcn-table.json`, or
  `pnpm dlx shadcn@latest add @st/shadcn-table` with the `@st` namespace registered.
- Docs: the edition switch offers Radix UI, Base UI and React Aria; every example renders
  on the selected edition, and the install page, the agent skill and the registry addresses
  list the React Aria commands.

### Changed

- `ST_PartPropTypes` gains `button` and `select`. `table.options` and `column.columnDef`
  hold the button and select `st*Props` (`stCopyButtonProps`, `stExpandButtonProps`,
  `stPaginationProps` and the like) tree-neutral, like the checkbox, slider and dialog
  ones, so one program can hold several editions; the options as written
  (`ST_TableOptions`, `ST_ColumnDef`) keep the edition's types.

## 0.4.0 - 2026-10-28

### Breaking

- Sub-components no longer take a `table` prop. They read it from the `row`, `cell`,
  `header` or `column` they render (`instance.table`), or from the `ST_TableProvider`
  context; wrap hand-composed pieces in `ST_TableProvider`.
- Renderers and `st*Props` callbacks of components that render a row, cell, header or
  column (`Cell`, `GroupedCell`, `Header`, `Footer`, `renderRowActions`,
  `renderRowActionMenuItems`, `renderColumnActionsMenuItems`, `renderDetailPanel`,
  `stRowDragHandleProps` and the like) receive `instance.table`, which has no `state`. Read
  `table.store.state` or `table.atoms.<slice>.get()` there. `table.store.state` is typed over
  `ST_RowData`; cast the row slices (`draggingRow`, `hoveredRow`) through
  `ST_TableState<TData>` when the row type matters.
- The props types of components that render no row, cell, header or column
  (`ST_TableLayoutProps`, `ST_TableContainerProps`, `ST_TableProps`, `ST_TableBodyProps`,
  `ST_TableHeadProps`, `ST_TableFooterProps`, the toolbar, toggle button, menu and modal
  props) no longer take a `TData` parameter. Drop the type argument.
- `ST_TopToolbarProps` is removed; `ST_TopToolbar` takes no props.
- `memoMode` is removed, with the memoized row and cell components
  (`Memo_ST_TableBodyRow`, `Memo_ST_TableBodyCell`) it switched to.
- `expandRowsFn` is removed. It was never implemented.
- The `stFeatures` value is no longer exported. `ST_Features` stays, as a type.
- `filterFns`, `sortFns` and `aggregationFns` names are resolved by TanStack Table core. A
  `filterFn`, `globalFilterFn`, `sortFn` or `aggregationFn` string must be a built-in name or
  one registered through the table option of the same name; an unknown name logs core's
  development warning and filters, sorts or aggregates nothing. A column's `filterFn` keeps
  the name: `columnDef.filterFn` holds the current filter mode name instead of the resolved
  function, and `columnDef._filterFn` is removed.
- Every ST setter (`table.setDensity`, `setIsFullScreen`, `setShowAlertBanner`,
  `setShowToolbarDropZone`, `setDraggingColumn`, `setHoveredColumn`, `setDraggingRow`,
  `setHoveredRow`, `setCreatingRow`, `setEditingCell`, `setEditingRow`,
  `setColumnFilterFns`, `setGlobalFilterFn`, `setShowColumnFilters`, `setShowGlobalFilter`
  and `setActionCell`) hands its `on*Change` handler a function updater, as TanStack's own
  setters do since v9. A handler resolves it with `functionalUpdate` or a React state
  setter.

### Added

- mk (Macedonian) locale.
- `ST_TableProvider` puts a table on the context the library's components read.
  `ShadcnTable` renders it around its layout.
- `ST_TableProvider` renders the table's `table.AppTable`. Swapping its `table` prop for a
  different table remounts the subtree.
- `useShadcnTable` takes an optional selector as its second argument, as `useTable` does,
  so the owner re-renders only on the state it selects.
- `@tanstack/react-store` is a dependency.
- `getColumnFilterFnName` and `selectST_TransformState` are exported from the barrel.
- Docs: the `localization-i18n-mk` example, and a "Compose with ST_TableProvider" section
  in the toolbar customization guide, linked from the ST components page.

### Changed

- Components subscribe to the state slices they render. A state change re-renders the
  components that show it, not the whole table; `ShadcnTable` itself re-renders only on
  the slices its column and data transforms read.
- Docs: examples and guides compose sub-components without a `table` prop, under
  `ST_TableProvider` outside `ShadcnTable`. Locale imports read
  `@/components/ui/shadcn-table/shared/locales/<code>` in the guides, `/SKILL.md` and the
  registry README. The prop tables follow the name resolution in core, the function
  updater on the ST `on*Change` handlers and the unset `show*` loading slices.
- The table's keyframes ship inside the components as a hoisted `<style>` tag; `shadcn add`
  no longer writes to your global CSS. Remove the `st-` keyframes and the
  `.st-progress-indeterminate` rule an earlier install added there. A strict Content Security
  Policy needs a nonce or `style-src 'unsafe-inline'` for the tag.
- `row.table`, `cell.table`, `column.table` and `header.table` are typed
  `ST_CoreTableInstance`, the core table without state; read `table.store.state` or
  subscribe. The `table` argument of every part prop, renderer and handler that also
  receives a row, cell, column or header, and of `createRow`, has the same type.

### Removed

- Docs: the memoization guide and the `memoMode` and `expandRowsFn` prop table entries.

### Fixed

- The row action Edit button hands the edit modal the live row; a spread copy lost the v9 row prototype and `row.getAllCells` threw.
- `isLoading` and `isSaving` default to `false`, and every loading slice (`isLoading`,
  `isSaving`, `showLoadingOverlay`, `showProgressBars`, `showSkeletons`) is in the table
  store from the first render. The three `show*` slices start unset, so they still follow
  `isLoading` and `isSaving` until they are set.
- The core table at `row.table`, `cell.table` and `header.getContext().table` carries the
  ST state, refs and setters.
- A custom `aggregationFn` name typechecks: `ST_AggregationOption` accepts any string, as
  `ST_FilterOption` and `ST_SortingOption` do.
- `enablePagination: false` with `manualPagination: false` shows every row instead of the
  first page.
- With `enableFilters`, `enableColumnFilters` and `enableGlobalFilter` all `false`, filters
  in state no longer filter the rows.
- Row pinning on select (`rowPinningDisplayMode: 'select-*'`) follows the selection state:
  a Shift range pins every row in it under controlled `rowSelection` or an external
  `atoms.rowSelection` too, select all pins the rows it selects (it cleared every pin), and
  programmatic selection (`row.toggleSelected`, `table.toggleAllRowsSelected`) pins and
  unpins.
- Under `rowPinningDisplayMode: 'select-*'`, unselect all (the select-all checkbox, its
  keyboard toggle and `Clear selection`) clears every pin, rows pinned by hand included, as
  0.3.3 did.
- Rows pinned together on select (a Shift range, select all) keep the row model order,
  whatever order the selection lists them in. Under `select-sticky` the rows pinned on
  another page show above or below the page rows in row model order; they came first.
- Under `rowPinningDisplayMode: 'select-*'` the pagination label covers the pinned rows
  kept from other pages (`keepPinnedRows`): select all with `selectAllMode: 'all'` on 8 rows
  at page size 5 reads `1-8 of 8`, the rows the body shows, not `1-5 of 8`.
- Sticky pinned rows (`rowPinningDisplayMode: 'sticky'` or `'select-sticky'`) stay below
  the table head: with more pinned rows than the container holds they covered the head and
  its select-all checkbox. A pinned stack taller than the container keeps its rows below the
  head and sticks them at the top only. Pinned rows kept from another page take their place
  in the sticky offsets; they were offset by minus one row.
- Switching a column's filter mode re-filters the current filter value with the new mode.
  While a column or global filter is set, a controlled `onColumnFiltersChange` receives an
  identity updater (`(old) => [...old]`) on each `setColumnFilterFns` and `setGlobalFilterFn`
  call so the row model re-filters; a handler that only stores the value needs no change.
- Editing a cell from the cell action menu (`editDisplayMode: 'cell'`) keeps the edit input
  focused when the menu closes.
- Rendering an ST display column header headless
  (`flexRender(header.column.columnDef.Header, header.getContext())`) no longer throws.
- A callback `ref` in `stTableLayoutProps`, `stTableContainerProps`, `stTableHeadProps`,
  `stTableFooterProps`, `stTopToolbarProps` or `stBottomToolbarProps` receives the node;
  only ref objects did.
- Those six refs follow React 19 ref cleanup: a cleanup the callback ref returns runs on
  unmount, and a callback that returns none, or a ref object, gets `null`. The
  `stTableContainerProps` and `stBottomToolbarProps` refs never got `null`, and no cleanup
  ran.
- Both installed trees type-check in one program: a project holding the Radix UI and the
  Base UI copy no longer fails with TS2717 on `stConfigFeature`, and each copy types
  `stFilterCheckboxProps`, `stFilterSliderProps`, `stSelectCheckboxProps`,
  `stSelectAllCheckboxProps`, `stEditRowDialogProps` and `stCreateRowModalProps` for its
  own parts. `table.options` and `column.columnDef` hold them as `ST_PartProps` (`object`).

## 0.3.3 - 2026-10-22

### Removed

- The "Migrating to v1" docs page and its sidebar entry. The table has shipped on TanStack
  Table v9 since 0.3.0; there is no v1 and no migration to document.
- Version-specific wording in the docs: the v9 and v8 mentions on the install page, the
  API option pages, the aggregation guide and the prop tables.

### Changed

- The prop tables link to the current TanStack Table docs (`/table/latest/`) instead of
  the v8 docs.
- Releases happen by merging a pull request. `pnpm release <version>` now bumps the
  versions, closes the `Unreleased` changelog section, pushes a `release/<version>` branch
  and opens the pull request; `release.yml` runs on every push to `master`, tags
  `v<version>` when the tag is missing, then verifies production and creates the GitHub
  release as before. Pushing a `v*` tag by hand still works.

## 0.3.2 - 2026-10-21

### Fixed

- Docs site: broken internal links on eight docs pages, the `custom-headless` example
  (crashed on `r.state`), the detail-panel conditional check and the localization tab
  count, so the release smoke passes on production.

## 0.3.1 - 2026-10-21

### Added

- Automated releases: `pnpm release <version>` bumps both `package.json` versions,
  commits `chore: version <version>`, tags `v<version>` and pushes; the tag runs
  `.github/workflows/release.yml`, which waits for production to serve the version,
  smokes the hosted registry, Storybook, `/SKILL.md` and the docs pages, installs the
  table per base from the public URL and creates the GitHub release from this file.
  Any failed check means no release.
- `GET /version.txt` on the docs site returns the library version.
- `release.yml` on `workflow_dispatch` with `dry_run` runs every check and skips the
  release.
- Privacy-preserving analytics on the docs site with PostHog, sent through a first-party
  `/ingest` proxy; no cookie banner, no session replay. The events are listed in
  `CONTRIBUTING.md`.

### Changed

- The CI install matrix (fresh, existing, base, nextjs) lives in the reusable
  `.github/workflows/install.yml`; `ci.yml` and `release.yml` both call it.
- The library source is two complete trees, `registry/radix` and `registry/base`, kept in
  step by the CI guard `pnpm check:bases`; registry scripts live under `scripts/registry`.
  Install addresses are unchanged.
- Docs pages are far lighter: example code is highlighted in the browser on demand
  (`/docs/guides/editing` went from 4.7 MB to 1.05 MB).
- The docs app is back at `apps/shadcn-table-docs`, with one installed copy per base
  (`components/ui-radix`, `components/ui-base`) and one installer,
  `scripts/install.mjs <base>`. The example code view shows `@/components/ui` imports,
  as a user has them.

### Fixed

- The install command bar on the home page stacks on small screens and no longer
  overflows at 390 and 440 px.
- The docs home page no longer crashes with React error #185 ("Maximum update depth
  exceeded") about 9 seconds after load: the live demo opened its edited salary cell from
  an effect that re-ran on every render, because `useShadcnTable` returns a new table
  object each render. The effect now runs only when the replayed row changes.
- `radix-ui` is bumped to 1.8.1, which carries Radix's fix for the React 19 re-render loop
  in `Select` composed refs (`@radix-ui/react-select` 2.4.1,
  `@radix-ui/react-compose-refs` 1.1.5). The registry item already installs the fixed
  version for new users.
- Docs: internal links to pages that do not exist (`/docs/api/props`,
  `/docs/features/*`, `/docs/guides/aggregation-and-grouping` and other old guide paths,
  in pages and in the option tables) point at the right pages. The custom headless example
  renders again: it passed `header.getContext()`, whose `table` has no `table.state`, to
  the select-all header. The one-panel-at-a-time detail panel example opens its panel.
  The command bar's copy button is named "Copied" again after a click, not only its text.

## 0.3.0 - 2026-10-20

Everything since v0.1.1 in one branch for review: the Base UI edition, the shared-source
layout, and the TanStack Table v9 port.

### Install

- Radix UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/radix/shadcn-table.json`
- Base UI: `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json`
- Namespace: `shadcn registry add @st=https://www.shadcn-table.com/r/{style}/{name}.json`,
  then `shadcn add @st/shadcn-table`
- GitHub addresses still work: `anindosarker/shadcn-table/shadcn-table` and
  `anindosarker/shadcn-table/shadcn-table-base`.

### Added

- Base UI edition: two editions of the table, one per shadcn base, same API. Registry
  items `shadcn-table` (Radix UI) and `shadcn-table-base` (Base UI), 37 locale items each,
  114 base-neutral example items.
- Hosted registry per base on the docs site: `https://www.shadcn-table.com/r/radix/<name>.json`
  and `/r/base/<name>.json`, namespace form
  `@st=https://www.shadcn-table.com/r/{style}/{name}.json`.
- Docs: site-wide base selector (header pill and the command-bar dropdown on the home
  page); install commands, rendered examples and code views follow it. Storybook ships
  both editions (`/` and `/base/`) with a toolbar button to the other edition;
  `pnpm storybook:all` runs both locally.
- CI: library and test matrix on both editions, install scenarios fresh, existing, base,
  nextjs.
- Detail-panel rows get a `getRowCanExpand` default (v9 refuses to expand rows without
  `subRows`).

### Changed

- TanStack Table v9 (`@tanstack/react-table` 9.3.1): full v9 API, no legacy hook, no
  compatibility layer. Public renames are listed on the docs page
  getting-started/migrating-v1 (17 items): `sortFn`, `sortFns`, `columnResizing`,
  `columnPinning: { start, end }`, `table.state`, `constructAggregationFn` definitions,
  native Shift-click range selection, `getIsSomeRowsSelected` semantics, exports
  `stFeatures` / `ST_Features`.
- Structure: one shared library source `packages/shadcn-table/shared/` plus 23 Base UI
  override files under `bases/base/components/ui/shadcn-table/`; resolution base-first
  then shared (tsconfig paths and a Vite resolver). No stub `package.json` files inside
  `bases/`.
- All registry scripts under `packages/shadcn-table/registry/`; docs app folder
  `apps/docs`; `tsc:radix` / `tsc:baseui`.
- Installed output unchanged: 92 files per item, same targets.

### Known

- Base UI tooltips have no skip-delay grouping. React Aria is not supported.
- Sidebar "Extra Storybook Examples" and the dev-home footer link the Radix UI Storybook
  regardless of the selector; home page tiles render Radix UI only.

## 0.1.1 - 2026-10-18

Patch release. Install or update with the same command; `--overwrite` updates an existing
install: `pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table --overwrite`.

### Fixed

- Cell action menu stays open on a real right-click (Chrome on macOS fired the right
  button's pointerup into the first menu item).
- Icon buttons wrapped in `ST_Tooltip` without a name now get the tooltip title as
  `aria-label` (column pin, column filter, show/hide columns).
- `<caption>` renders at the bottom by default, like MRT; `[&>caption]:caption-top` on
  `stTableProps` restores the top.
- `ST_Tooltip` and `useST_MediaQuery` are exported from the barrel.

### Added

- `stTableBodyRowProps.hover`: `false` removes the row hover background.
- `stEditTextFieldProps.helperText` and `error`: inline validation text under the edit
  field, `aria-invalid` on error.

### Docs

- Guide samples no longer pass MUI-only props (`color`, `variant`, `startIcon`, `stTheme`).
- Docs app lint is clean and part of CI.

## 0.1.0 - 2026-10-18

First public release of shadcn-table: a full-featured React data table for shadcn/ui,
built on TanStack Table v8, installed into your app with the shadcn CLI. A port of
material-react-table to shadcn/ui (Radix base).

Install: `pnpm dlx shadcn@latest init --base radix`, then
`pnpm dlx shadcn@latest add anindosarker/shadcn-table/shadcn-table`. Docs:
https://www.shadcn-table.com. Storybook: https://storybook.shadcn-table.com.

### Added

- Sorting, filtering (column, global, faceted, filter modes), grouping, aggregation,
  expanding and tree data, row and column pinning, column ordering, resizing, hiding,
  density, full screen.
- Editing (cell, row, modal, table), row selection, row actions, cell actions, click to
  copy, detail panels, row numbers, row and column virtualization, sticky header and
  footer, pagination.
- 38 locales as separate registry items (`anindosarker/shadcn-table/shadcn-table-locale-<code>`).
- Every docs example installable as `anindosarker/shadcn-table/example-<slug>`.
- AI agent entry points: https://www.shadcn-table.com/SKILL.md,
  `npx skills add anindosarker/shadcn-table`, https://www.shadcn-table.com/llms.txt.

### Requirements

- React 18+, Tailwind CSS v4, shadcn/ui on the Radix base. Base UI and React Aria are not
  supported in this release.

### Known

- Cell action menu does not stay open on a real right-click in some browsers.
- Tooltip triggers have no accessible name.
- `<caption>` renders at the top; no caption-bottom default.
- A few docs samples still pass MUI-era props the types do not declare.
