# 02: base tree, tracker

Deviations and gate results. Plan: [02-base-tree.md](02-base-tree.md). Rulings: [decisions.md](decisions.md). Part 01 patterns (instance.table, useSTContext, Subscribe, `.get()`, useST_Atom): [01-tracker.md](01-tracker.md).

## Deviations

### base-diff.json

- `ShadcnTable.tsx` removed from the list: identical in both trees once the `TooltipProvider` moved into `ST_TableProvider` (`hooks/stTableHook.tsx`, part 01 pattern).
- `hooks/stTableHook.tsx` added: the provider prop differs, Radix `skipDelayDuration={0}` against Base UI `timeout={0}`, plus the comment that explains why the provider is mounted at all under Base UI (it is optional there; it owns the shared delay and skip window).
- 23 files allowed to differ, 142 library files in both trees (`check-bases`).

### Diff files

Every listed file differs in its Base UI primitive usage only; the instance, context, subscription and atom reads match the radix twin line for line. Differences that go beyond a prop rename, kept because the primitive needs them:

- `components/menus/ST_ActionMenuItem.tsx`: explicit `closeOnClick` (Base UI keeps a menu open on checkbox and radio items by default).
- `components/menus/ST_ShowHideColumnsMenuItems.tsx`: `closeOnClick={false}` replaces Radix `onSelect` + `preventDefault` so a column toggle keeps the menu open.
- `components/menus/ST_CellActionMenu.tsx`: `finalFocus` returns focus to the cell through an `anchorRef` unless editing started and returns `false` to keep Base UI off the invisible trigger (Radix: `onCloseAutoFocus` + `preventDefault`).
- `components/menus/ST_ShowHideColumnsMenu.tsx`, `ST_ColumnActionMenu.tsx`, `ST_RowActionMenu.tsx`, `ST_FilterOptionMenu.tsx`: anchor refs and `useRef` where Radix read the event target; menu, trigger and positioner parts as today.
- `components/toolbar/ST_TablePagination.tsx`: Base UI Select hands `null` on clear; `setPageSize` runs only for a value.
- `components/toolbar/ST_LinearProgressBar.tsx`: Base UI Progress takes `value: number | null`, null meaning indeterminate (Radix: `undefined`).
- `components/modals/ST_EditRowModal.tsx`: Base UI `onOpenChange(open, eventDetails)`; both arguments forwarded.
- Collapsible users (`ST_TableDetailPanel`, `ST_TableHeadCellFilterContainer`, `ST_GlobalFilterTextField`, `ST_LinearProgressBar`): `data-open` / `data-closed` selectors and the `st-collapsible-*` keyframes (Radix: `data-[state=open]` and the shared `animate-collapsible-*` utilities).
- `shared/utils/style.utils.ts`: comment only (where the skip window lives).

### Gates, part 02 verify on `08a4626`

- Worktree root `pnpm check:bases`: pass, `check-bases: 142 library files in both trees, 23 allowed to differ`.
- `pnpm tsc:baseui`, `pnpm tsc:radix`, `pnpm lint`: pass, no output.
- Stories tsc under `ST_BASE=base`: skipped. `tsconfig.stories.json` extends `tsconfig.radix.json` and includes `registry/radix`; neither it, `vite.config.ts` nor `.storybook/main.ts` route tsc through `ST_BASE`, so the stories type check runs against radix only.
- `pnpm test:base`: pass, `Test Files 58 passed (58)`, `Tests 429 passed (429)`. The first three runs timed out on `Profiled Thousand Rows` (`Test timed out in 15000ms`) with the machine at load average 20 to 25 from unrelated browser renderers; `pnpm test` (radix, untouched since claude/review) timed out the same way at that load. The story takes 10.7 s alone; it has a 15 s budget inside a parallel run. Both suites green at load average 5.
- `pnpm test` (radix): pass, `Test Files 58 passed (58)`, `Tests 429 passed (429)`.
- `pnpm storybook:build` and `pnpm storybook:build:base`: pass, `Storybook build completed successfully`; the base build was red since 42d83ad (part 01 tracker) and is green from this part.
- `node scripts/check-storybook.mjs --base http://localhost:6056` on a static server over `storybook-static` (both outputs): `14 passed, 0 failed`. `serve` redirects `iframe.html?id=` to `/iframe` and drops the query, even with `-n`; a plain node static server was used.
- `grep -rn "table\.state"` over BASE `components/` and `hooks/display-columns/`: no hits.
- `pnpm registry:build`: `Building registry.`, `git status` clean.
- `pnpm --filter shadcn-table-docs lib:install base`: `143 table files (38 locales merged in), 26 parts`, `git status` clean; `08a4626` had already reinstalled the mirror, so no reinstall commit. The mirror's file set equals BASE path for path (no stale old-layout file); the only content differences are the installer's rewrites (`@/components/ui-base/` import prefix, `st-base-` keyframe names).

### Browser, base Storybook dev server on 6056

Playwright against `iframe.html`, each story loaded until `storyRendered` or `playFunctionThrewException`, console errors and page errors recorded per story. `FnRegistries` (9), `RowPinningOnSelect` (5), `PhaseTwoVerify` (6), `PhaseThreeVerify` (14): 34 of 34 render, every play passes. One recorded console error is by design: `NoProviderThrows` throws inside its boundary and React logs the caught error. Interaction checks on `basic--default`: column actions menu opens (Base UI Menu, 7 items), the density tooltip opens (Base UI Tooltip, `Toggle density`), density toggle re-renders the cells (`p-4` to `p-2`). `EditingEnabledEditModeModalDefault`: the create dialog opens (Base UI Dialog, 5 inputs) and closes on Escape; `PortalsReadContext` covers the same through its play. `CellActionMenuEditKeepsFocus`: play passes, `document.activeElement` is the cell input.

### Finding, both editions (not a base deviation)

- `components/buttons/ST_ToggleRowActionMenuButton.tsx:61` calls `setEditingRow({ ...row })`. TanStack 9.3.1 builds rows with `Object.create(rowPrototype)` and keeps the row APIs on that prototype, so the spread copy has no `getAllCells`; `ST_EditRowModal` then throws `TypeError: row.getAllCells is not a function` when the row action edit opens the modal (`EditingEnabledEditModeModalDefault`, radix and base alike; no play covers it, so `pnpm test` stays green). Fix in RADIX first (part 02 scope fence): pass `row` itself, as `setEditingCell(cell)` and `setCreatingRow` already store live objects; then mirror to BASE.

### Deferred to part 04

- Docs app `types:check`, `lint`, `build` and `check-pages.mjs`: expected red, not run (guides and examples still use the `table` prop and removed names, 01-tracker).
- `pnpm format` rewrites `apps/shadcn-table-docs/lib/utils.ts` every run (pre-existing, 01-tracker); reverted before the commit.
