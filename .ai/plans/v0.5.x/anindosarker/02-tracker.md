# 02: infra, tracker

Deviations and gate results. Plan: [02-infra.md](02-infra.md). Rulings: [decisions.md](decisions.md).

## Phase 01

Branch `v0.5/infra` from `claude/review` at `e713b0b2`, worktree `07`.

### Commits

- `build(registry): one edition list drives the scripts`: `scripts/registry/lib.mjs` exports `EDITIONS` (`radix`, `base`, `aria`), `REFERENCE_EDITION` (`radix`) and `editionItems(catalog, edition)` (main item plus locale items of one edition, found by the `registry/<edition>/` file paths, so no script repeats the committed item names). `build.mjs` imports `registry/<edition>/registry.ts` per edition (`registry.json` byte-identical), `hosted.mjs` writes `public/r/<edition>` for every edition (radix and base output byte-identical to before, `public/r/aria` new: 154 items), `add-part.mjs` takes any edition, `check-bases.mjs` compares every non-reference edition against radix with `<edition>-diff.json`, one line per edition, exit 1 on any problem (checked with a stray file in `registry/aria`). `examples.mjs`: comments only (nothing enumerated editions).
- `build(storybook): aria edition in the tools`: the four package scripts from part 01 confirmed. Root `storybook:all` regex `/^storybook(:base|:aria)?$/`, root `test:aria` plus the turbo task (CI calls `pnpm test:aria` like `pnpm test:base`), `vercel.json` storybook build adds `storybook:build:aria` (the edition switch and the release smoke link `/aria/`). `themes.ts`: `EDITIONS`, `EDITION_LABELS` (`Radix UI`, `Base UI`, `React Aria`), `ST_OTHER_EDITIONS`, `staticEditionRoot`. `edition-tool.ts`: three-way switch, current edition marked (`aria-current="page"`, `data-edition-current`), one link per other edition (`data-edition-link="<edition>"`; dev ports shift by the EDITIONS index, 6006, 6007, 6008). `preview.tsx` decorator links both other editions. `check-storybook.mjs` checks all three builds.
- `ci: aria edition in every matrix`: `ci.yml` `library` and `test` matrices `[radix, base, aria]` with `tsc:aria`, `storybook:build:aria`, `test:aria`; `bases` job unchanged (name kept, comment updated). `install.yml`: `aria` scenario (`BASE` aria, `ITEM` `shadcn-table-aria`, `shadcn init --base aria --preset nova`) plus a "No radix-ui or @base-ui/react on the React Aria base" step. `release.yml` needed no edit: its install job reuses `install.yml` with the `<base>` template, so the aria scenario installs `/r/aria/shadcn-table.json`; the smoke list lives in `scripts/release/smoke.mjs`, now looping `EDITIONS` (`/r/aria/shadcn-table.json`, `/r/aria/registry.json`, Storybook `/aria/`, `SKILL.md` names `React Aria`).
- `docs(standards): three editions`: "Two trees" is "Editions"; layout lists `registry/aria`; gates list `tsc:aria`, `test:aria`.

### Gates

- `check-bases.mjs`: `radix and base: 142 library files in both trees, 23 allowed to differ`, `radix and aria: 142 library files in both trees, 37 allowed to differ`, exit 0.
- `pnpm registry:build`: `git status` clean.
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `tsc -p tsconfig.stories.json`, `lint`: pass.
- `storybook:build`, `storybook:build:base`, `storybook:build:aria`, static output served on 6028 (server stopped after): `check-storybook.mjs` 42 passed, 0 failed. Decorator text checked in each build's preview frame: links to the two other editions.
- `ci.yml`, `install.yml` parse (`act -l` lists every job). Not run in CI yet.
- `node scripts/release/smoke.mjs` against production: 13 passed; the 3 aria checks fail with 404 until the aria hosted registry and Storybook deploy (expected before the 0.5.0 release).

### Left for phase 02

- `next.config.mjs` rewrite, docs `install.mjs`, `example-variants.mjs`, `lib/install.ts`, the two `preview.mjs` (coding standards preview line still names two Storybooks), `components/ui-aria`.

## Phase 02

Docs app and previews, on `v0.5/infra` after phase 01.

### Commits

- `feat(docs): hosted registry for the aria edition`: `next.config.mjs` rewrites `/r/:style(aria-.*)/:name.json` to `/r/aria/:name.json` next to the radix and base ones. `hosted.mjs` already loops `EDITIONS` (phase 01), no edit.
- `fix(types): tree-neutral button and select props in the feature map` (deviation, found by the docs type check): with `components/ui-aria` in the docs program the `stConfigFeature` augmentation conflicted (TS2717), because the React Aria `ButtonProps` and `SelectProps` differ from the Radix ones and the feature map typed eight options with them directly. Root fix in all three trees, the checkbox, slider and dialog pattern: `ST_PartPropTypes` gains `button` and `select`; `stConfigFeature.ts` types `stColumnActionsButtonProps`, `stColumnDragHandleProps`, `stCopyButtonProps`, `stExpandAllButtonProps`, `stExpandButtonProps`, `stRowDragHandleProps`, `stToolbarAlertBannerChipProps` with `TParts['button']` and `stPaginationProps.SelectProps` with `TParts['select']`; those keys join `ST_TableOptions_PartKeys` (the first three also `ST_ColumnDef_PartKeys`); the eight components that read them (`ST_CopyButton`, `ST_ExpandButton`, `ST_ExpandAllButton`, `ST_TableHeadCellColumnActionsButton`, `ST_TableHeadCellGrabHandle`, `ST_TableBodyRowGrabHandle`, `ST_ToolbarAlertBanner`, `ST_TablePagination`) read them through `Pick<ST_TableOptions<TData>, ...>` and `Pick<ST_ColumnDef<TData>, ...>`. Shared files stay byte-identical (`check-bases` unchanged counts). `CHANGELOG.md` "Changed" line. `components/ui-radix` and `ui-base` reinstalled.
- `chore(docs): install the aria library copy and example variants`: `scripts/install.mjs` `aria` entry (`shadcn-table-aria`, style `aria-nova`); the keyframe and style-href rename is now `st-<base>-collapsible` for every non-radix base (`st-base-collapsible` unchanged, `st-aria-collapsible` new). `react-aria-components` `^1.22.1` added to the docs dependencies (the install restores `package.json` and the lockfile, so the dependency must already be there). `components/ui-aria` committed (142 table files, 38 locales, 26 parts). `VARIANT_DIRS` gains `aria: '.aria'`; `.gitignore`, `.prettierignore` and `eslint.config.mjs` ignore `components/ui-aria` and `examples/.aria`; README lists the third copy.
- `feat(scripts): aria Storybook in the previews`: package `preview.mjs` third child `storybook:aria` on 6008 (`ST_BASE=aria`, yellow); root `preview.mjs` header; coding standards Preview line names 6008.

### Not done here, for part 03

- `lib/install.ts` `bases` keeps `radix` and `base`. Adding `aria` puts a React Aria tab in `base-selector.tsx` and an aria loader in `example-variant.tsx`, and the generated `examples/.aria` sources do not type-check yet against the aria parts (19 errors in 10 examples): `Button` `disabled` (aria `isDisabled`) in advanced, custom-top-toolbar, editing-crud-cell, editing-crud-table, export-to-csv, export-to-pdf; `RadioGroup` `onValueChange` in enable-column-grouping; `TooltipContent` and `TooltipTrigger asChild` in react-query and server-side-data; `ST_TableHeadCellFilterContainer` `open` (aria `CollapseProps` is a Disclosure, `isExpanded`) in custom-column-filtering-ui. The aria rewrite in `lib/example-variants.mjs` (like `asChild` to `render` for Base UI), the `examples/.aria` tsconfig include, the `bases` entry and the third tab land together in part 03.

### Gates

- `tsc:radix`, `tsc:baseui`, `tsc:aria`, `tsc -p tsconfig.stories.json`: pass. `check-bases`: `radix and base: 142 ... 23 allowed to differ`, `radix and aria: 142 ... 37 allowed to differ`.
- `test`, `test:base`, `test:aria`: 63 files, 446 tests each, pass.
- `pnpm registry:build`, then `lib:install radix`, `base`, `aria`: `git status` clean.
- Docs `types:check`, `lint` (0 errors, 3 existing warnings), `build` with `NEXT_DIST_DIR=.next-verify` (tsconfig include rewrite reverted): pass.
- `next start -p 5344` on `.next-verify` (stopped after): `/r/aria-nova/shadcn-table.json`, `/r/aria/registry.json`, `/r/radix-nova/...`, `/r/base-nova/...` 200; `check-pages a` 260 passed, `c` 280 passed, `e` 595 passed, 0 failed. No check expectation changed (no check lists editions while `bases` has two).
- `pnpm preview` not started: its ports (5310, 6006, 6007, 6008, 5330) belong to the shared servers in this run. The child list was checked by importing the module.
