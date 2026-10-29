# 06: edition order and dropdown selectors, tracker

Plan: [06-edition-order-dropdown.md](06-edition-order-dropdown.md). Rulings: [decisions.md](decisions.md),
decision 8. Branch `v0.6/edition-order-dropdown`, worktree `07`, from `claude/review` at `91614e84`.

## Phases

- Phase 1, editions and scripts: `c70af38f` feat(editions): list Base UI first and resolve
  unset ST_BASE to it; `5f68d18c` build: name the edition in every edition script; `b80e635a`
  test: raise the vitest browser timeout to 90 s; `02d3aedc` style: format .mjs files with the
  rest. `EDITIONS` is `['base', 'radix', 'aria']`, `EDITION_PORTS` `{ base: 6007, radix: 6006,
  aria: 6008 }`, `resolveEdition` falls back to `DEFAULT_EDITION`; `REFERENCE_EDITION` stays
  `radix`. `registry:build` and `registry:items` reorder both committed catalogs
  (`packages/shadcn-table/registry.json`, `apps/shadcn-table-docs/registry.json`), Base UI items
  first; `registry:hosted` writes 154 items per edition, `git status --short
  apps/shadcn-table-docs/public/r` empty (the folder is gitignored, see Final). `vitest run`
  with `ST_BASE` unset: `resolveEdition(undefined)` is `base`, 63 files, 446 tests passed.
  `storybook:build:base`, `:radix`, `:aria` exit 0. The format glob change reformatted
  `apps/shadcn-table-docs/lib/example-variants.mjs`, `scripts/release/decide.mjs` and
  `scripts/release/decide.test.mjs`, nothing else.
- Phase 2, Storybook tool: `ae7bc00b` feat(storybook): edition switch as the toolbar Select.
  Three builds served from `storybook-static` on 5344 (`serve`) and 5345
  (`python3 -m http.server`): `node scripts/check-storybook.mjs` `21 passed, 0 failed, 1
  skipped` on both (the skip is the root redirect, Vercel only). Per edition: one
  `button[aria-haspopup="listbox"]` named `Edition <label>` showing the current label, the
  listbox lists Base UI, Radix UI, React Aria with the current one `aria-selected`, choosing the
  next edition lands on `/<edition>/?path=/story/basic--default`. Dev: `ST_BASE=base storybook
  dev -p 5341`, choosing React Aria requests `http://localhost:6008/?path=/story/basic--default`
  (intercepted, the owner's ports were not used, so the two-server run of the plan was replaced
  by this request check). Screenshots, one per theme, menu open on Base UI:
  [06-shots/storybook-edition-select-light.png](06-shots/storybook-edition-select-light.png),
  [06-shots/storybook-edition-select-dark.png](06-shots/storybook-edition-select-dark.png);
  delete after review.
- Phase 3, docs: `ff5eb013` feat(docs): header edition switch as a select menu; `986d4bde`
  docs: list Base UI first and name the edition scripts; `ef2d8945` test(docs): pick the header edition only when it changes (the first Radix UI run failed once on `/docs/getting-started/usage`: picking the already selected edition raced the next menu open). Docs `types:check`
  green, `lint` 0 errors (9 pre-existing warnings in the examples), `build` exit 0. Dev server
  on 5346: `check-pages.mjs --edition radix`, `--edition aria`, `--edition base`: `1654 passed, 0 failed` each, after the fix. A fresh context (`--edition` unset) opens
  `/docs/getting-started/install` with the header button reading `Base UI` and the menu listing
  Base UI, Radix UI, React Aria, Base UI checked (cluster a, `277 passed`).
- Final: `92c4b6df` docs(changelog): Base UI first, edition selects, edition scripts; `c88fe68f` chore(plans): part 06 tracker, Storybook shots, drop 05-shots. `05-shots/` deleted, `CHANGELOG.md` `## Unreleased` `### Changed` (order, the two selects, script names and the `ST_BASE` fallback). Hosted output: `public/r` is gitignored, so `git status` is empty by construction; the real check rebuilt `registry:build`, `registry:items`, `registry:hosted` with the `91614e84` `editions.mjs` and with the new one: `diff -r` of the two `public/r` trees is empty.
- Review round: fixed all five findings. Root `storybook:build` runs the three turbo
  `storybook:build:<edition>` tasks in sequence (`63838c70`); CONTRIBUTING.md flow diagram
  lists `registry/base | registry/radix | registry/aria`; install.yml Next.js scaffold reads
  `--base "$BASE"`; edition-tool.ts imports `EDITION_PORTS` through `./themes`; editions.mjs
  header wrapped at 80 columns. Declined: none.

## Gates

- `tsc:radix`, `tsc:baseui`, `tsc:aria`, library `lint`: exit 0. `check:bases`: 143 library
  files (24 and 38 allowed to differ), 216 example files (2 and 10).
- `test:base`, `test:radix`, `test:aria`: 63 files, 446 tests passed each.
- `check-storybook.mjs`: 21 passed, 0 failed, 1 skipped (root redirect, Vercel only).
- Docs `types:check`, `lint` (0 errors), `build` green; `check-pages.mjs` 1654 passed per edition.
- `grep -rn "'radix', 'base', 'aria'\|radix, base, aria\|Radix UI, Base UI"` over md, mdx, ts,
  tsx, mjs, json, yml: only `.ai/` history and `CHANGELOG.md`.
- `pr.yml` and the release smoke run on the pull request and after the release.

## Owner attention

- Keyboard on the Storybook Select: Storybook's single Select moves the selection with focus,
  so ArrowDown in the open list (or on the closed trigger) selects the next edition and the
  tool navigates at once. A keyboard user goes Base UI, Radix UI, React Aria one hop at a time,
  and Escape after an arrow does not cancel. The built-in viewport picker behaves the same way
  (it applies on arrow). Followed the plan (`onSelect` navigates); a navigate-on-close variant
  needs state Storybook's Select does not expose.
- The Storybook Select names its trigger `Edition <current label>` (Storybook appends the
  selected title to `ariaLabel`), so `check-storybook.mjs` matches `[aria-label^="Edition"]`
  rather than the exact `Edition` the plan wrote.
- The package `tsc` alias (`pnpm tsc:radix`) is removed: nothing called it, and it was an
  unnamed edition script.
- Root `storybook:build` runs three `turbo run storybook:build:<edition>` calls in sequence,
  Base UI first: one turbo call per edition, because turbo gives no order guarantee across
  tasks in one call. The turbo tasks keep their `outputs` caching. The root
  `storybook` and `test` scripts are gone; `storybook:base`, `:radix`, `:aria` and `test:base`,
  `:radix`, `:aria` run through turbo like before.
- `pr.yml` `test` job runs `pnpm --filter shadcn-table test:<edition>` (the plan's form)
  instead of the root turbo script.
- `install.yml` matrix lists `{ scenario, base }` pairs (`include`), and `BASE`, `ITEM`,
  `EXAMPLE_ITEM` read `matrix.base`: no fallback edition left in the workflow.
- `theme-demo/variants/terminal.tsx` uses `defaultBase` from `@/lib/install`, which is
  `DEFAULT_EDITION`, instead of importing `editions.mjs` through a five-level relative path.
- The docs header button's accessible name is `Edition` (plan), so screen readers hear the
  current edition only from the menu; the Storybook trigger says `Edition Base UI`.
- `CONTRIBUTING.md` "item and base do not match" named the Radix UI item `shadcn-table`
  (stale since 0.6.1, the plain name is the Base UI alias); now `shadcn-table-radix`.
- `serve` (the check script's suggested server) shows "No Preview" in the static Storybook's
  canvas for screenshots; `python3 -m http.server` renders it. Pre-existing, the checks pass
  on both.
