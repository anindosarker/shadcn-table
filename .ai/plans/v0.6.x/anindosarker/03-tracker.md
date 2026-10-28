# 03: add-part deterministic, tracker

Plan: [03-add-part-deterministic.md](03-add-part-deterministic.md). Rulings:
[decisions.md](decisions.md), decision 5. Branch `v0.6/add-part-deterministic`, worktree
`07`, from `claude/review` at `5f75c32e`.

## Phases

- Phase 1, 1.6.2: `233bd8d4` fix(add-part): deterministic output per part. One
  `shadcn add <part>` invocation per part (also for an explicit multi-part call, so no path is
  left where the order matters); the directive pass strips any leading `'use client'` the
  CLI left and prepends `'use client';` plus a blank line when the upstream `files[].content`
  starts with the directive; the scratch `index.css` is
  `@theme inline { --font-heading: var(--font-sans); }`; `--all` lists the `*.tsx` files
  directly below `components/ui/` minus the parts the edition's `registry.ts` item ships as
  its own files (`forkedUi`, read from the imported `registry` so the list is never repeated).
  Probes: `pnpm add-part aria separator textarea` and `pnpm add-part aria textarea separator`
  both leave `git status --short` empty; `pnpm add-part radix dialog` keeps `font-heading` on
  `DialogTitle` (its only diff was the directive, see Phase 2). One invocation runs in about
  3 s, a full sweep in about 30 s.
- Phase 2, radix: `2ae6be38`. `pnpm add-part radix --all` (26 parts, checkbox skipped)
  rewrote 9 files: `combobox`, `dialog`, `dropdown-menu`, `field`, `popover`, `radio-group`,
  `separator`, `switch`, `tooltip`. Every diff is two added lines (`'use client';` and a
  blank line), checked with `git diff -U0 | grep '^[+-]' | sort | uniq -c`; no removed line.
  Second run after the commit: `git status --short` empty.
- Phase 2, base: `b51fd68b`. 26 parts, checkbox skipped, 7 files rewritten: `collapsible`,
  `dialog`, `input-group`, `label`, `progress`, `select`, `switch`. Same two-line diff each,
  second run empty.
- Phase 2, aria: `e4bb19d8`. 27 parts (no fork), 12 files rewritten: `button`,
  `collapsible`, `combobox`, `field`, `input`, `label`, `popover`, `radio-group`, `select`,
  `slider`, `table`, `tooltip`. Same two-line diff each, second run empty.
- Final phase: docs commit below. Gates in the Gates section.

## Owner attention

- The sweep's diff is not the probe's list and the run did not halt on it. Plan 2.1.2 names
  "any file outside those lists" a halt, but the probe lists in `02-tracker.md` are what the
  buggy CLI flipped relative to the committed tree, while decision 5 sets the directive per
  file from the upstream item: every part whose upstream content starts with `'use client'`
  gets it. Upstream carries it on 18 radix, 17 base and 21 aria parts (checked against
  `https://ui.shadcn.com/r/styles/<style>/<part>.json` for all 27 parts of each style); the
  committed tree had it on 8, 9 and 9, so the fixed sweep restores it on 9, 7 and 12 files,
  of which only radix `combobox` and `dialog` are on the probe lists (the probe's "lose"
  entries keep it and show no diff). Every changed file was verified mechanically to differ by
  exactly the directive and the blank line after it, which is the first of the two mechanisms
  the plan fixes ("the directive restored where a run had stripped it", 1.6.1); no part shows
  any other change and `font-heading` moved nowhere. The judgment: a halt would only ask the
  owner to re-confirm decision 5. To revert, drop the three `chore(registry)` commits; the
  script change stands on its own. Lesson for the next plan of this kind: derive the
  expected-diff list from the upstream content, not from a probe against a buggy baseline.
- An explicit multi-part call (`pnpm add-part aria separator textarea`) now runs one CLI
  invocation per part instead of one for the list. The plan asks that for `--all` only; the
  same loop serves both so the order dependency has no second code path. About 3 s per part.
- `apps/shadcn-table-docs/components/ui-<edition>/` (the docs app's installed parts,
  `pnpm lib:install <edition>`) are not touched: those copies come straight from
  ui.shadcn.com through `shadcn add` in the docs app, not from `registry/<edition>/`, and
  already differ from the committed parts in formatting. Out of this part's scope.
- `CHANGELOG.md` gains the `## Unreleased` section (none existed after 0.6.0) with the one
  `### Fixed` line the plan asks for. The PR touches `packages/shadcn-table/registry`, so
  `release impact` needs a `release:` label; `release:patch` per the 0.6.1 round.

- The `pnpm add-part <edition> --all` line in the standards' Gates block is marked local only:
  `pr.yml` has no add-part step (the `bases` job runs `check-bases.mjs` without `pnpm install`),
  so the sentence "CI runs the same gates" would overstate it. The alternative is a step in
  `bases` (`pnpm install`, then `pnpm add-part <edition> --all` for the three editions and
  `git diff --exit-code packages/shadcn-table/registry`; network to ui.shadcn.com, about
  90 s). Not added here: `pr.yml` is outside the plan's target structure.
- The root `format` script globs `**/*.{js,ts,tsx,md}` and never touches `.mjs`, so
  `pnpm format` is blind to every registry and release script (the review caught an 82-column
  line that way). Extending it to `**/*.{js,mjs,ts,tsx,md}` reformats three files outside this
  part (`apps/shadcn-table-docs/lib/example-variants.mjs`, `scripts/release/decide.mjs`,
  `scripts/release/decide.test.mjs`), so it is left for an owner commit on `claude/review`.

- The upstream report decision 5 asks for is not filed by this part: an issue on
  `shadcn-ui/ui` speaks for the owner, so it is left to the owner. Text to file: "@shadcn/registry
  0.2.0, transform-rsc: the `'use client'` test is a regex with the `/g` flag shared across the
  files of one `shadcn add` run, so its `lastIndex` carries over from one file to the next and
  the directive is kept or stripped depending on the order of the parts. Repro in a project
  with the `aria-nova` style: `shadcn add separator textarea` and `shadcn add textarea separator`
  write different `'use client'` lines for the same two files (here `pnpm add-part aria
  separator textarea` against `pnpm add-part aria textarea separator` before `233bd8d4`). Fix:
  drop `/g` or reset `lastIndex` before each test."

## Review round

- Fixed: `d7aee89b` style(add-part): prettier (the 82-column argv line); `647aa4eb` `--all`
  with any other argument prints the usage line instead of fetching `--all.json`; `6dcab930`
  fork list from `registry.items.flatMap((item) => item.files)`, no `items[0]`; the Gates
  block line marked local only (this commit). After the script commits:
  `pnpm add-part aria --all bogus` exits 1 with the usage line; `pnpm add-part radix --all`
  and `pnpm add-part base --all` leave `git status --short` empty (checkbox still skipped).
- Declined: the `format` glob extension (owner commit, bullet above); a `pr.yml` add-part
  step (owner call, bullet above); the Phase 2 halt finding needs no code change, the Owner
  attention bullet stands with the lesson added.

- Round 2. Fixed: `934de79d` the `add-part.mjs` header describes the `--all` skip set as the
  registry items' own `components/ui/*.tsx` files, not `forkedUi`; `a7ce2fb8` `--all` and its
  empty `git status --short` gate in `registry/README.md` and `CONTRIBUTING.md`, whose "change
  them only when the table needs it" clause becomes "never edited by hand"; the upstream report
  bullet under Owner attention (this commit). Declined: filing the upstream issue (owner, bullet
  above); the Phase 2 halt finding needs no code change, the Owner attention bullet stands.

## Gates

Run by the verifier on `753ed7e9`, clean tree, 2026-10-29.

- `pnpm add-part radix --all && git status --short`: exit 0, 26 parts, status empty. Pass.
- `pnpm add-part base --all && git status --short`: exit 0, 26 parts, status empty. Pass.
- `pnpm add-part aria --all && git status --short`: exit 0, 27 parts, status empty. Pass.
- `tsc:radix`: exit 0, 0 errors. Pass.
- `tsc:baseui`: exit 0, 0 errors. Pass.
- `tsc:aria`: exit 0, 0 errors. Pass.
- `lint` (`eslint .`): exit 0, clean. Pass.
- `check:bases`: exit 0; 142 library files, 23 and 37 allowed to differ; 216 example files, 2
  and 10. Pass.
- `registry:build`: exit 0, `registry.json` unchanged. Pass.
- `storybook:build`, `storybook:build:base`, `storybook:build:aria`: exit 0 each, output in
  `storybook-static/`, `storybook-static/base`, `storybook-static/aria`. Pass.
- `pr.yml` on PR #52 (`v0.6/add-part-deterministic` into `claude/review`, draft,
  `release:patch`): run `40750260288` success, 15 of 15 jobs green (release impact, library
  x3, bases, test x3, docs, registry, install x5). The `labeled` event run `40750261837` runs
  the label check alone, the other jobs skip by design.
