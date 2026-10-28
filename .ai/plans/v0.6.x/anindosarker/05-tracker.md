# 05: edition selector, tracker

Plan: [05-edition-selector.md](05-edition-selector.md). Rulings: [decisions.md](decisions.md),
decision 7. Branch `v0.6/edition-selector`, worktree `08`, from `claude/review` at `5f75c32e`.

## Phases

- Phase 1, names: `d9479c2c` refactor(registry): name every committed item by its edition;
  `a237977b` ci: dry-run and install by the per-edition item names; `4c5daae0` docs: GitHub
  fallback addresses carry the edition suffix. `editionItemName` returns `<name>-<edition>`
  for every edition, `DEFAULT_EDITION = 'base'` joins `REFERENCE_EDITION = 'radix'` in
  `editions.mjs` (and `editions.d.mts`, `lib.mjs`, `lib.d.mts`); `registry/radix/registry.ts`
  names its item `shadcn-table-radix` by hand like the other two trees;
  `editionExampleItems` strips the suffix for every edition. `registry:build`: 105 files in
  `shadcn-table-radix`, 38 locale items; `registry:items`: 345 items. Hosted output gate:
  `public/r` is gitignored (`apps/shadcn-table-docs/.gitignore`), so `git status --short
  apps/shadcn-table-docs/public/r` is empty by construction; the real check was a `diff -r`
  of `public/r` built at `5f75c32e` against the rebuild: `/r/radix/` byte-identical, `/r/base/`
  and `/r/aria/` differ in the 38 locale item descriptions each (see Owner attention), nothing
  else. `pr.yml` dry-runs `shadcn-table-radix` and `example-basic-radix`; `install.yml`
  derives `ITEM` and `EXAMPLE_ITEM` from the scenario's edition for all five scenarios.
  `check:bases` green (142 library files, 23 and 37 allowed to differ; 216 example files,
  2 and 10), docs `types:check` and `lint` green (9 pre-existing warnings in the examples),
  library `lint` and `tsc:radix` green.
- Phase 2, Storybook: `9f1b9dbe` build(storybook): every edition under /<edition>/, root
  redirects to /base/; `a3d425ca` feat(storybook): selected state on the current edition
  button. `storybook:build` writes `storybook-static/radix`; `staticEditionRoot` is
  `../<edition>/`; `vercel.json` gains the `redirects` entry (`source: "/"`, host `pre:
  "storybook."`, `destination: "/base/"`, `permanent: false`, query forwarded by Vercel's
  default); `check-storybook.mjs` reads the story id from
  `storybook-static/<DEFAULT_EDITION>/index.json`, each edition at `/<edition>/`, plus a root
  redirect check that prints `SKIP` on a server that answers 200 or 404; `smoke.mjs` checks
  `/radix/`, `/base/`, `/aria/` 200 and `/?path=/story/x` 3xx to `/base/?path=/story/x`.
  Local gate: three builds into `storybook-static/{radix,base,aria}`, `pnpm exec serve
  storybook-static -l 5344`, `node scripts/check-storybook.mjs --base http://localhost:5344`:
  `43 passed, 0 failed`, first line `SKIP root redirect (status 200, no redirect on this
  server)`. The Vercel redirect cannot be tested locally; `smoke.mjs` checks it after the
  deploy. Toolbar selected state: the current button keeps its 1px outline
  (`theme.appBorderColor`) and gets a 2px bottom bar in `theme.barSelectedColor`
  (`useTheme()` from `storybook/theming`, so it follows the storybook-dark-mode toggle).
  Screenshots per edition and manager theme (Playwright, `sb-addon-themes-3` seeded,
  static build on 5344): [05-shots/](05-shots/) `edition-tool-<edition>-<dark|light>.png`,
  six files. Computed styles: dark bar `rgb(71, 157, 255)`, light bar `rgb(0, 99, 214)`,
  the link buttons keep the plain 1px outline.
- Phase 3, docs: `3fb8b428` feat(docs): Base UI is the edition shown first; `3ef12fb6`
  test(docs): page checks start from the edition the page opened on. `defaultBase` reads `DEFAULT_EDITION` (plain import of the
  `.mjs`, `allowJs` plus `editions.d.mts` type it); `storybookUrl.radix` is `/radix/`;
  `example-prompt.ts` reads the committed `example-<name>-<base>` item for its title and
  dependencies and emits the hosted `example-<name>` command, so its output did not change
  (comment updated). `check-pages.mjs` passes `edition` (the `--edition`, else
  `DEFAULT_EDITION`) to every page check; `a.mjs` (home command bar, install page) asserts
  the opened-on edition first and visits the other two; `_helpers.mjs` `baseSwitch` picks
  Radix UI before its loop, `demoLoop` starts on the opened-on edition; the install page check
  asserts the header switch's active tab is the opened-on edition's label (a fresh context
  opens on Base UI). Dev server on 5347: `check-pages a` (no `--edition`, fresh context) `/`
  17 passed, `/docs/getting-started/install` `opens on Base UI` PASS; `check-pages a
  --edition radix|base|aria` 275 passed, 0 failed each (the two radix-only install
  expectations part 01 noted on base and aria are gone). All clusters: see the gate line.
- Final phase: `CHANGELOG.md` `## Unreleased` `### Changed` (two bullets), standards Editions
  bullets (`DEFAULT_EDITION` versus `REFERENCE_EDITION`, committed naming), CONTRIBUTING
  build output paths: `d6280651` docs: Base UI shown first, per-edition item names, Storybook
  folders. Gates: see below.

## Gates

- `registry:build`, `registry:items`, `registry:hosted` green; `git status --short
  apps/shadcn-table-docs/public/r` empty (gitignored; `diff -r` against the baseline above).
- `check:bases` green; docs `types:check`, `lint` green; docs `build` green (runs `registry:build`, `registry:items`,
  `registry:hosted` first; `git status --short` afterwards shows no tracked change).
- `check-storybook.mjs` 43 passed against the local three-folder build.
- `check-pages.mjs` against the dev server on 5347, all clusters: `--edition radix`, `--edition
  base`, `--edition aria` and no `--edition` (fresh context, Base UI) each `1652 passed, 0
  failed`. The `warn: e.mjs redefines /` line predates this part.
- `pr.yml` on the verifier's CI-only PR (touches `packages/shadcn-table/registry` and
  `skills/`, so it needs a `release:` label, `release:patch` per decision 7). After release:
  `smoke.mjs` (the redirect check is new).

## Owner attention

- Hosted locale descriptions: `lib.mjs` writes `The <code> localization for <committed
  name>.`, so after the rename the radix hosted copies would have said `for
  shadcn-table-radix` while the hosted item is `shadcn-table`. `hosted.mjs` now writes the
  hosted name into the description, the same way it already rewrites the name and the
  dependency; `/r/radix/` is byte-identical to before, `/r/base/` and `/r/aria/` change in the
  38 locale descriptions each (`for shadcn-table-base.` and `for shadcn-table-aria.` become
  `for shadcn-table.`), nothing else. Revert: drop the `description` line in `hosted.mjs`;
  then `/r/radix/` changes instead.
- GitHub fallback addresses: the committed rename changes the user-facing GitHub addresses of
  the Radix items (`anindosarker/shadcn-table/shadcn-table` to `shadcn-table-radix`, the
  locales and `example-<slug>` likewise). README, SKILL.md, `agents.mdx`, `localization.mdx`
  and CONTRIBUTING say the new names; the CHANGELOG bullet says the old ones stop resolving.
  `best-practices.mdx` had a hard-coded `pnpm dlx shadcn@latest add
  anindosarker/shadcn-table/shadcn-table` update command; it now renders `<InstallCommand
  overwrite />` (the hosted, per-base command the install page uses).
- Selected state: a 2px bottom bar in `barSelectedColor` inside the button's outline was
  chosen over a filled `theme.color.secondary` background (white on Storybook blue reads
  poorly at the toolbar's font size). Screenshots in `05-shots/`; the folder can be deleted
  once reviewed.
- `check-storybook.mjs` reads `index.json` from the default edition's folder (`base`); any
  folder would do, the three builds share the story set.
- `05-shots/` holds six PNGs (44K) committed next to this tracker; no precedent in earlier
  trackers.
