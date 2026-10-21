# Changelog

All notable changes to shadcn-table are recorded here, newest first, in the
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Entries are
written while the work happens, under `Unreleased`; `pnpm release <version>`
renames that heading to the version and the date, and the release workflow
publishes the section as the GitHub release notes.

## Unreleased

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

### Changed

- The CI install matrix (fresh, existing, base, nextjs) lives in the reusable
  `.github/workflows/install.yml`; `ci.yml` and `release.yml` both call it.

### Fixed

- The docs home page no longer crashes with React error #185 ("Maximum update depth
  exceeded") about 9 seconds after load: `radix-ui` is bumped to 1.8.1, which carries
  Radix's fix for the React 19 re-render loop in `Select` composed refs
  (`@radix-ui/react-select` 2.4.1, `@radix-ui/react-compose-refs` 1.1.5). The registry
  item already installs the fixed version for new users.

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
