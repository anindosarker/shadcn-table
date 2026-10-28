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
