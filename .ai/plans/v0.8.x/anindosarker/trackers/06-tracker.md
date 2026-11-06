# 06: docs, tracker

Status: merged (e0e2e6ef)
Branch `v0.8/docs`, worktree 02, PR #102
Checks:
- `pnpm --filter shadcn-table-docs types:check` at 73ec8c45: green
- `pnpm --filter shadcn-table-docs types:check` at 23e6115e: green
- `pnpm --filter shadcn-table-docs lint` at 23e6115e: green (9 pre-existing warnings)
- `pnpm -w check:bases` at 23e6115e: green
- `node .ai/plans/v0.8.x/anindosarker/reference/06-check.mjs` at 23e6115e: green
- `node scripts/check-pages.mjs --base radix --url http://localhost:5347` (own dev server) at 61792f9f: green (1792 passed, 0 failed)
- `pnpm --filter shadcn-table-docs build` at dc29db70: green (its `registry:items` step regenerated `registry.json`, committed as af9780fb)
- Builder ran every line above. Verifier lines below, at cb70852d (tree clean):
- `node scripts/check-pages.mjs --base radix --url http://localhost:5347` (verifier, own dev server) at cb70852d: green (1792 passed, 0 failed); rerun because `registry.json` changed after 61792f9f
- `node scripts/check-pages.mjs --base base --url http://localhost:5347` (verifier, own dev server) at cb70852d: green (1792 passed, 0 failed)
- `node scripts/check-pages.mjs --base aria --url http://localhost:5347` (verifier, own dev server) at cb70852d: green (1792 passed, 0 failed)
- `pnpm -w check:bases` (verifier) at cb70852d: green
- `node .ai/plans/v0.8.x/anindosarker/reference/06-check.mjs` (verifier, Acceptance rerun) at cb70852d: green ("06-check: all checks pass")
- Docs `types:check`, `lint`, `build`: recorded green by the builder (23e6115e, dc29db70); later diffs touch two `.mdx` guides and `registry.json` only, CI is the second run
- Storybook build and `test:<base>`: not in spec 06 section 2.2; no file under `packages/` changed

- Milestone 01 setup and prop tables: done (73ec8c45)
- Milestone 02 guides, example, registrations: done (23e6115e)
- Milestone 03 page checks, build, cleanup: done (af9780fb)

## Attention

- Library: the sort editor ignores `maxMultiSortColCount`; "Add sort" stays while unused sortable columns remain (`packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/toolbar/ST_SortPopover.tsx:86`), so the multi-sorting example's limit of 3 holds only for the column menu. The sort-editor guide describes the shipped rule (hidden only with `enableMultiSort: false` or no unused column).
- Library vs D3: the columns menu shows no `columnDef.icon` (`components/menus/ST_ShowHideColumnsMenuItems.tsx`, no `ST_ColumnIcon`); the icon shows in the header, the chips and the column picker. The column-icons guide and the `icon` prop row describe that.
- Library vs D21: every built-in display column except row actions is locked (stripes and "Fixed" while another column drags), because `ST_DefaultDisplayColumn` sets `enableColumnOrdering: false` (`hooks/useST_TableOptions.ts:23`); D21 says only row numbers. The ordering guide and the column option row describe the shipped behaviour.
- Library: with `enableColumnOrdering: false` on the table, every column menu shows the disabled "Fixed position" item and the header counts as locked (`components/menus/ST_ColumnActionMenu.tsx:205-206`, `components/head/ST_TableHeadCell.tsx:117-120`), while the body cell does not (`components/body/ST_TableBodyCell.tsx:197-198`); visible only during a grouping drag. The guide states the menu behaviour as built.
- Library vs D23: the table root redeclares the four `--st-*` tokens (`components/table/ST_TableLayout.tsx:23-24`), so a value set on an ancestor never reaches the cells; only `stTableLayoutProps.className` overrides them. The tint-tokens guide says so and points ancestors at the theme variables the tokens mix from.
- Judgment call: a string `persistViewSettings` is the whole storage key, not `shadcn-table:<string>:view` (`shared/utils/viewSettingsStorage.utils.ts:43`); the view-settings guide documents the code, D36's wording reads the other way.
- Judgment call: the docs home demo pins `columnFilterDisplayMode: 'subheader'` (`apps/shadcn-table-docs/components/dev-home/v12/signal-table.tsx`) so its Filtering step still types into the State header input; drop the line to show chips instead.

## Notes

- check-pages ran for radix only (the task asks one base; the verifier runs base and aria). `test:<base>` not run: the diff touches no file under `packages/` (docs app, `.ai/` and `CHANGELOG.md` only), CI runs it.
- `pnpm format` covers `**/*.{js,mjs,ts,tsx,md}` only; the `.mdx` guides are not prettier-formatted by the repo, so only the touched `.ts`/`.mjs`/`.tsx` files were formatted.

- `pnpm -w registry:build` then `lib:install` radix, base, aria at f98ea1b0 left `components/ui-<base>/` unchanged: the spec 05 merge already carried the regenerated copies.
- Own dev server on port 5347 for check-pages; the shared registry on 5310 was already up.
