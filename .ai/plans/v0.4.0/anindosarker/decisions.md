# Review feedback on `claude/review` (v0.3.0): decisions

## Docs app

1. Folder goes back to `apps/shadcn-table-docs`.
   - Package name `shadcn-table-docs` stays.
   - Why: the structure-cleanup rename to `apps/docs` was not asked for.
2. UI folders are named per base: `components/ui-radix` and `components/ui-base`.
   - `components.json` `ui` alias points at `@/components/ui-radix`; docs chrome imports
     `@/components/ui-radix/...` directly.
   - Example source under `examples/<slug>/` keeps `@/components/ui/...` imports and is what
     the code view shows, because that is the path a user has after `shadcn add`. Each base
     renders a generated variant (`examples/.radix/`, `examples/.base/`), gitignored because
     `lib/example-variants.mjs` regenerates them on `predev` and `build`.
   - One installer, `scripts/install.mjs <base>`, replaces `lib:install` and
     `install-base.mjs`.
   - Why: one folder per base should say which base; today's Base UI code view shows
     `ui-base` imports, which is wrong for users.

## Package `packages/shadcn-table`

1. One complete library per base, shadcn's model: `registry/radix` and `registry/base`, each
   self-contained. `shared/` and the override resolution go away.
   - Changes to common files are made in both trees by hand. No sync script.
   - A CI guard only (`scripts/registry/check-bases.mjs`): every file outside a committed
     list of differing files must be byte-identical in both trees, every listed file must
     exist in both. No copying, nothing to run locally.
   - Why: with overrides every edit needs knowing which files have a base twin, and the
     editor could not resolve shared files (the TS server assigns a file to a referenced
     project only when it is a root file of that project). A sync script would become its
     own maintenance; the guard is the only way drift is found by CI instead of by a user.
2. Folders follow the shadcn repo.
   - `registry/` is the source of truth: `registry/radix`, `registry/base`,
     `registry/README.md`.
   - `scripts/registry/` holds the registry scripts (`build.mjs`, `hosted.mjs`,
     `examples.mjs`, `add-part.mjs`, `lib.mjs`, `lib.d.mts`, `check-bases.mjs`); `scripts/`
     the rest (`check-storybook.mjs`).
   - `registry.json` stays at the package root: the CLI resolves `files[].path` relative to
     it, so the install addresses stay as they are (the paths inside the catalog follow the
     tree move).
3. Stories and tests stay one set; `@/` is a plain alias to `registry/<ST_BASE>`.

## Target tree

```
shadcn-react-table/
  registry.json                         include file for the GitHub install address
  apps/shadcn-table-docs/
    components.json                     ui alias → @/components/ui-radix
    components/
      ui-radix/                         installed Radix UI library + parts (committed)
      ui-base/                          installed Base UI library + parts (committed)
      ...                               docs chrome, imports @/components/ui-radix/...
    examples/
      <slug>/                           source: @/components/ui/... imports, shown in code view
      .radix/<slug>/                    generated variant (gitignored)
      .base/<slug>/                     generated variant (gitignored)
    scripts/
      install.mjs                       pnpm lib:install <base>
      page-checks/
    lib/  content/  app/  registry.json (example items)
  packages/shadcn-table/
    registry.json                       library items, stays at package root
    registry/
      radix/                            complete Radix UI library
        components/ui/<parts>.tsx
        components/ui/shadcn-table/**
        lib/utils.ts  index.css  components.json  registry.ts
      base/                             complete Base UI library, same shape
      README.md
    scripts/
      registry/                         build.mjs hosted.mjs examples.mjs add-part.mjs lib.mjs lib.d.mts check-bases.mjs
      check-storybook.mjs
    stories/  .storybook/               one set, @/ → registry/<ST_BASE>
    vite.config.ts  vitest.config.ts  eslint.config.js
    tsconfig.json  tsconfig.radix.json  tsconfig.baseui.json  tsconfig.stories.json
    public/r/                           built registry output
```

## TanStack Table v9 architecture

1. Rewrite the library internals to MRT's v9 architecture, mirroring its port file by file.
   - Reference: `TanStack/table` `main`, `examples/react/material-react-table/src/material-react-table/`,
     sparse clone at `React-table/tanstack-table` (`git pull` to update). The
     `React-table/material-react-table` clone is the v8 library and has no v9 code.
   - Shape: library state and APIs become v9 custom features (`features/`), one
     `createTableHook` (`hooks/stTableHook.ts`) bundling them, `useST_TableInstance` wraps
     `useAppTable`, components read state through feature APIs instead of `table.state`.
   - Public API (`useShadcnTable`, `ShadcnTable`, `ST_TableOptions`) stays; the table hook and
     column helper stay internal, as in MRT.
   - Why: MRT moves into the TanStack repo as copy-paste source on this architecture; staying
     its shadcn mirror keeps the port comparable and is the v9-native shape for a reusable
     table package.
   - Ships as `0.4.0`.
   - Plan: `.ai/plans/v9-architecture/anindosarker/v9-architecture-plan.md`.

2. Library folder structure (decided 2026-10-27). Per base, `registry/<base>/components/ui/shadcn-table/`:

   ```
   shadcn-table/
   ├── features/        stFeatures.ts + one st*Feature.ts per state group (11)
   ├── hooks/           stTableHook.ts, useShadcnTable.ts, useST_*.ts, display-columns/
   ├── components/      table/ head/ body/ footer/ toolbar/ buttons/ inputs/ menus/ modals/
   ├── shared/
   │   ├── fns/         filterFns.ts  sortFns.ts  aggregationFns.ts
   │   ├── utils/       cell, column, row, style, pagination, virtualization, displayColumn, utils
   │   └── locales/     38 + mk
   ├── ShadcnTable.tsx  ST_Tooltip.tsx  types.ts  icons.ts
   └── index.ts
   ```

   - Four top-level folders, one kind each: what a table is, how it is built, how it looks,
     plain data and helpers. `shared/` not `lib/`, because `@/lib` is the user's own folder in
     a shadcn project.
   - Twin map: `components/<x>` to MRT `components/<x>`, `shared/fns` to `fns`, `shared/utils`
     to `utils`, `shared/locales` to `locales`. `utils/tanstack.features.ts` is removed, its
     content becomes `features/stFeatures.ts`.
   - `index.ts` stays a full barrel, every module exported, as today and as MRT. The docs and
     stories import 14 internal components, 18 types and several hooks through it, and the one
     public import path is what lets the folders above move without a breaking change.
   - Internal files import siblings by path, never the barrel. The 38 locale files that import
     `index.ts` today switch to `types.ts` (phase 04).

3. D3, fn registries (decided 2026-10-27). `filterFns`, `sortFns`, `aggregationFns` stay
   per-call table options, same as v8 and MRT v2.
   - Mechanism: v9 keeps the registries inside the `features` object and copies them once at
     construction (`table-core/src/core/table/constructTable.ts:70`), and `useAppTable` omits
     `features` from per-table options (`react-table/src/createTableHook.tsx:953`). So
     `useST_TableInstance` creates its own `createTableHook` instance once per mount, inside a
     `useState` initializer, with the call's registries merged over the built-ins:

     ```ts
     // hooks/stTableHook.ts
     export const createSTTableHook = (o) => createTableHook({
       features: tableFeatures({
         ...stFeatures,
         filterFns:      { ...ST_FilterFns,      ...o.filterFns },
         sortFns:        { ...ST_SortFns,        ...o.sortFns },
         aggregationFns: { ...ST_AggregationFns, ...o.aggregationFns },
       }),
     });
     export const { useTableContext: useSTContext } = createTableHookContexts<ST_Features>();

     // hooks/useST_TableInstance.ts
     const [{ useAppTable }] = useState(() => createSTTableHook(definedOptions));
     const table = useAppTable({ ...definedOptions, columns, initialState });
     ```

   - Core resolves every name itself. Removed: the registry merge in
     `useST_TableOptions.ts:119-120`, the name-to-function swap and `_filterFn` in
     `column.utils.ts:83-93`, the hand-resolved `globalFilterFn` in
     `useST_TableInstance.ts:286-287`. `prepareColumns` writes the current mode name onto
     `columnDef.filterFn`; `globalFilterFn` is passed as a name.
   - `useSTContext` is defined once at module level on the shared context that
     `createTableHook` uses by default (`createTableHook.tsx:46-50, 713-715`), so components
     read any table regardless of which instance built it.
   - Deviation from MRT: MRT's port passes the options through unread, so a custom name
     silently filters nothing. Not copied. One tracker line.
   - Why not the alternatives: resolving names to functions before core skips core's lookup;
     a cast past `Omit<..., 'features'>` and a feature that rewrites `_rowModelFns` lean on
     internals; a per-project `createShadcnTable` factory and `useTable` without
     `useAppTable` change the public API or drop the hook.
   - Caveats, accepted:
     - `createTableHook` runs once per mounted table instead of once per app. A few closures
       and three small components.
     - Registries are read on the first render only, as today (`useMemo(..., [])`).
     - Exact string typing for custom names is not available; `ST_FilterOption` stays
       `LiteralUnion`, as today.
     - Aggregation: plain callables passed in `aggregationFns` are wrapped with
       `constructAggregationFn` before registration.
   - Verify in phase 01 and 02 (tests, both bases):
     - A column with `filterFn: 'customFilterFn'` from the call's `filterFns` filters rows.
     - `globalFilterFn: 'customFilterFn'` filters rows; `'fuzzy'` default still works.
     - A custom `sortFn` name sorts; a custom `aggregationFn` name aggregates.
     - Two tables on one page with different `filterFns` do not see each other's names.
     - Filter-mode switch via `ST_FilterOptionMenu` changes the applied function; the menu
       label, `ST_FilterTextField`, `ST_FilterRangeSlider`, `ST_ColumnActionMenu` and the fuzzy
       highlight in `ST_TableBodyCellValue` read the name from `columnDef.filterFn`.
     - An unknown name logs core's dev warning and filters nothing, no throw.
     - `useAppTable` call has no `@ts-expect-error`; `pnpm tsc:radix` and `tsc:baseui` clean.
     - `useSTContext()` inside a component rendered by `<ShadcnTable>` returns the right table
       when two tables are mounted.
     - No remount of `AppTable` across re-renders (controlled input in a custom toolbar keeps
       focus while typing).

4. D1, the `table` prop (decided 2026-10-27). Dropped from every component. Two ways to reach
   the table, per the TanStack table-context guide:
   - Components that receive an instance (`row`, `cell`, `header`, `column`) read
     `instance.table`. About 35 of 57 files: body rows and cells, head cells and their menus,
     filter and edit inputs, row buttons, cell action menu. No context, no provider needed, so
     they compose anywhere. Depends on phase 01 putting ST state, refs and setters on the core
     table; today `row.table` is the bare core table (findings: headless display columns).
   - Components with no instance read `useSTContext()`. About 20 files: `ST_TableContainer`,
     `ST_TableLayout`, `ST_Table`, head, body and footer roots, toolbars and toolbar buttons,
     pagination, alert banner, drop zone, global filter field, edit modal, show-hide menu.
     `useSTContext` is the `useTableContext` from `createTableHookContexts<ST_Features>()` in
     `hooks/stTableHook.ts`; it throws outside a provider.
   - `ShadcnTable.tsx` wraps `ST_TableLayout` in `tableContext.Provider`. New public export
     `ST_TableProvider`, a typed wrapper over that provider, for hand composition:

     ```tsx
     const table = useShadcnTable({ columns, data });
     return (
       <ST_TableProvider table={table}>
         <ST_TableContainer />
       </ST_TableProvider>
     );
     ```

   - Why dropped rather than optional: no users yet, so compatibility buys nothing; one code
     path per component instead of a `prop ?? context` fallback in 20 files; an optional prop
     can be added later without a break, removing one cannot. Matches MRT's port.
   - Breaking, 0.4.0 changelog: sub-components no longer take `table`; wrap hand-composed
     pieces in `ST_TableProvider`. Docs: 7 guides and 2 docs-app layout files pass
     `table={table}` to sub-components today (`toolbar-customization`, `column-pinning`,
     `density-toggle`, `full-screen-toggle`, `row-actions`, `sorting`, `global-filtering`
     among them); about 15 stories. Rewritten in phase 03.
   - Verify in phase 03:
     - Nested table in `renderDetailPanel`: inner `ShadcnTable` consumers read the inner table.
     - Radix portals (menus, dialogs, tooltips) still see the context.
     - Custom renderers (`Cell`, `Header`, `renderRowActions`, `renderDetailPanel`) still
       receive `table` in their argument object; that surface is unchanged.
     - A group 2 component rendered without a provider throws the `useSTContext` error at
       mount, not a silent undefined.
     - Every guide example that composes sub-components renders in `check-pages.mjs`.

## Docs site

1. Code view highlights on the client, on demand.
   - `components/mdx/example-snippet.tsx` ships raw source strings only; the explorer
     highlights the active file when opened with fumadocs `DynamicCodeBlock`.
   - Why: build-time shiki trees for every file of every example in both bases made docs
     pages 1 to 5 MB each and filled the Hobby 10 GB deployment storage. Retention was cut by
     the other session (handoff `wt1/.ai/handoffs/handoff-2026-10-20-2310.md`); page weight
     is the remaining cause.
2. PostHog analytics in the docs app.
   - `posthog-js`, US cloud, provider in `app/layout.tsx`, ingest reverse-proxied through
     `next.config.mjs` rewrites, key in `NEXT_PUBLIC_POSTHOG_KEY` (Vercel env and local
     `.env.local`, never committed).
   - Events: auto page views; `base_switched`, `install_command_copied`,
     `example_code_opened`, `example_file_viewed`, `search_used`, `storybook_opened`,
     `outbound_clicked` (GitHub, Discord).
   - Deliver with usage instructions: how to read page views, funnels per base, and the
     install-copy conversion in the PostHog UI.

## Release

1. Releases are automated from a merged pull request (decided 2026-10-22; `master` only
   takes pull requests, so the script cannot push to it).
   - `pnpm release <version>` sets both `package.json` versions, closes the `Unreleased`
     changelog section, commits `chore: version <v>` on `release/<v>`, pushes the branch
     and opens the pull request into `master`.
   - `.github/workflows/release.yml` on every push to `master` (and on `v*` tags pushed
     by hand): skip when `v<v>` is already tagged, else tag `v<v>`, wait for production
     to serve the version, smoke the registry URLs, Storybook, `/SKILL.md` and the page
     checks against production, real install per base from the public URL, then
     `gh release create` with notes from the `## <v>` section of `CHANGELOG.md`. Any
     failure: no release.
   - `CHANGELOG.md` at the repo root is written during the work, not at release time.
   - v0.3.0 was the last manual release (tag on `e7ebbde`, released 2026-10-20).
   - `release.yml` also runs on `workflow_dispatch` with a `dry_run` input that skips
     `gh release create`; that run at the first milestone proves the workflow. No
     intermediate tags; the only tag of this cycle is `v0.4.0`.
   - Why: the manual v0.3.0 pass proved production, not the workflow; a dry run proves the
     workflow without a version bump.
   - For this cycle this item is superseded by item 2 on intermediate releases.
2. Intermediate releases are allowed in this cycle.
   - v0.3.1 releases parts 01 to 05 and 08 at the first milestone.
   - v0.3.2 releases the home page crash fix (part 07) when it lands.
   - v0.4.0 stays the tag for the v9 architecture (part 06).
   - Why: the crash fix and the docs changes are user-facing and part 06 is weeks away; the
     owner decided this on 2026-10-21.

## Sequence

1. Docs folder rename, package layout split, CI guard, docs UI folders (mechanical, small).
2. v9 architecture rewrite on the two-tree layout.
   - Why this order: the split is days, the rewrite is weeks; the rewrite then lands once on
     the final paths, and the editor resolves every file while the owner reviews it.
