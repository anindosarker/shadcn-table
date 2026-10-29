# 07: base naming, tracker

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
  base, radix and aria; `check-pages.mjs e` 596 passed, 0 failed for each base.
- Final: changelog line, `06-shots/` deleted, tracker. `grep -rni edition` gate (plan 2.2
  excludes plus `.git`) prints nothing with `public/r`, `storybook-static` and `.next` built.

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
- Comments were renamed in place, not reflowed: every line got shorter and stays within 80
  columns, and a full reflow would have rewrapped many untouched lines.
- The `pr.yml` job name is `bases (base guard)` (was `bases (edition guard)`); the ruleset has
  no required status checks, so the rename touches no repo setting.
- The Unreleased chevron line now says "base picker" and "base name" (it was written this round
  as "edition picker").
