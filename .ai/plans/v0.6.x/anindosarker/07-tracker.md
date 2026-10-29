# 07: base naming, tracker

Status: done (3d6ce403)

Plan: [07-base-naming.md](07-base-naming.md). Rulings: [decisions.md](decisions.md), decision 9.
Branch `v0.6/base-naming`, worktree `07`, from `claude/review` at `e6f347b7`, carrying the
chevron commit `8db770ea` feat(storybook): chevron on the edition picker.

## Phases

- Phase 1, scripts and Storybook: `f51b57f8` refactor(registry): name the shadcn base `base` in
  scripts and Storybook. `git mv` of editions.mjs, editions.d.mts and .storybook/edition-tool.ts
  to bases.mjs, bases.d.mts and base-tool.ts, identifiers per decision 9. `tsc:radix`,
  `tsc:baseui`, `tsc:aria`, `lint` exit 0; `check:bases` 4 sets green; `test:base`,
  `test:radix`, `test:aria` 446 passed each; `storybook:build:base`, `:radix`, `:aria` exit 0;
  `check-storybook.mjs --url http://localhost:5344` against `serve storybook-static`: 21 passed,
  0 failed, 1 skipped (root redirect, Vercel only). `registry:build`, `registry:items`,
  `registry:hosted`: catalogs differ only in the alias descriptions, hosted `diff -r` differs only
  in `aria/shadcn-table.json` (see Owner attention).
- Phase 2, docs app and prose: `715ad0bf` refactor(docs): name the shadcn base `base` in the docs
  app; `111abbfc` docs: name the shadcn base `base` in the prose and standards. Docs
  `types:check` exit 0, `lint` exit 0 (9 warnings, none new), `build` exit 0. `next start` on
  5345: `check-pages.mjs a --url http://localhost:5345 --base <base>` 277 passed, 0 failed for
  base, radix and aria; `check-pages.mjs e` 596 passed, 0 failed for each base; full run
  without `--base` 1654 passed, 0 failed; `--base nope` exits 1 with the usage error.
- Final: `8801049c` docs(changelog): base naming, tracker for part 07. Changelog lines,
  `06-shots/` deleted, tracker. `grep -rni edition` gate (plan 2.2 excludes plus `.git`) prints
  nothing with `public/r`, `storybook-static` and `.next` built.
- Review round: fixed the page gate's external-host check (`06bfc1ba`: the `url` rename shadowed
  the server origin in `isExternalResourceError`, so third-party resource errors failed; parameter
  now `resourceUrl`, `check-pages.mjs a` 277 passed, 0 failed); reflowed every renamed comment
  paragraph at 80 columns and split the single-line JSDoc over 80 (`6253b7f5`, comment lines
  only, `check:bases` and library `lint` green); "an base's" to "a base's" in coding-standards
  (`e6da46b4`); wrapped this file's Final bullet. Declined: nothing.
- Review round 2: CHANGELOG maintainer renames line now lists `check-storybook.mjs --url <url>`
  (was `--base <url>`) (`78ea6683`). Declined: nothing.

## Owner attention

- The `grep -rni edition` gate and "catalogs and hosted output byte-identical" cannot both
  hold: the alias descriptions in both committed `registry.json` catalogs said "installs the
  Base UI edition", and one shipped library comment
  (`registry/aria/.../head/ST_TableHeadCellFilterContainer.tsx`, "every edition exposes") said
  edition. The gate won: aliases now say "installs the Base UI copy" (lib.mjs `aliasItems`), the
  comment says "every base exposes", and the docs app's installed copy under
  `components/ui-aria/` follows. Item names, files, paths and dependencies are unchanged; the
  hosted `diff -r` before and after differs in `aria/shadcn-table.json` only, in that one
  comment line inside the file content.
- `lib.mjs` already had a `baseItems` (the item builder each `registry/<base>/registry.ts`
  calls). The catalog picker `editionItems` took the name `baseItems` as instructed, so the
  builder became `buildBaseItems`.
- `check-storybook.mjs` also took `--url <url>` (was `--base <url>`), matching
  `check-pages.mjs`; nobody calls it with the flag outside the docs.
- Where "base" would read twice, the text says "copy": "the Base UI copy" (alias descriptions,
  CONTRIBUTING tree, `registry/<base>/registry.ts` headers), "one copy of the table per shadcn
  base" (README, SKILL.md, introduction.mdx, CONTRIBUTING). The CONTRIBUTING port table reads
  "Storybook, Base UI".
- Comments were first renamed in place; the review round reflowed every touched paragraph at
  80 columns as plan 1.6.2 says (`6253b7f5`), which rewraps lines the rename did not change. One
  touched line stays over 80: the `@type` import in `apps/shadcn-table-docs/lib/base-tabs.mjs`,
  a single unbreakable path.
- The `pr.yml` job name is `bases (base guard)` (was `bases (edition guard)`); the ruleset has
  no required status checks, so the rename touches no repo setting.
- The Unreleased chevron line now says "base picker" and "base name" (it was written this round
  as "edition picker").

## Gates

Verifier run on a clean tree at `40821640`, plan 2.2, PR #61, CI run `40829404197`
(`pr.yml`) and `40829404030` (release impact).

- `grep -rni edition` with the plan's excludes: empty, also with `public/r`, `storybook-static`
  and `.next` built.
- `tsc:radix`, `tsc:baseui`, `tsc:aria`, library `lint`: exit 0. `check:bases`: 4 sets green.
- `registry:build`, `registry:items`, `registry:hosted`: exit 0, `git status` clean. Against
  `e6f347b7`: catalogs differ only in the alias descriptions (39 lines package, 115 lines docs),
  hosted `diff -r` only in `aria/shadcn-table.json` (one comment line). See Owner attention.
- `test:base`, `test:radix`, `test:aria`: 446 passed each, turbo cache off (0 cached).
- `storybook:build:base`, `:radix`, `:aria`: exit 0. `check-storybook.mjs --url
  http://localhost:5346` on `serve storybook-static`: 21 passed, 0 failed, 1 skipped (root
  redirect, Vercel only).
- Docs `types:check` exit 0, `lint` exit 0 (9 warnings), `build` exit 0.
- `check-pages.mjs --url http://localhost:5347 --base base`, `radix`, `aria` on `next start`:
  1654 passed, 0 failed each.
- `pr.yml` run `40829404197`: every job passed (bases, docs, library x3, test x3, registry,
  install x5); release impact passed.
- `smoke.mjs`: after release, not run here.
