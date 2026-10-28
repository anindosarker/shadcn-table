# 02: parts untouched, tracker

Plan: [02-parts-untouched.md](02-parts-untouched.md). Rulings: [decisions.md](decisions.md).
Branch `v0.6/parts-untouched`, worktree `08`, from `claude/review` at `03d95c95`.

## Phases

- Phase 01, 1.6.2: `ba611ed1` build(tsc): drop noUnusedLocals and noUnusedParameters.
  `tsc:radix`, `tsc:baseui`, `tsc:aria` green.
- Phase 01, 1.6.3: `b4f3d5c2` build(eslint): unused code check, shadcn parts ignored.
  `lint` green. Probes: an unused `import { useId } from "react"` in
  `registry/radix/components/ui/shadcn-table/ST_Tooltip.tsx` is one error
  (`@typescript-eslint/no-unused-vars`); the same import in
  `registry/radix/components/ui/badge.tsx` is "File ignored because of a matching ignore
  pattern"; in the folded core (`shared/utils/displayColumn.utils.ts`) an unused local is an
  error and an unused function argument is not. The rule made the one
  `eslint-disable-next-line @typescript-eslint/no-unused-vars` in
  `components/body/ST_TableDetailPanel.tsx` (`_hover`) stale; removed in all three trees in
  the same commit (`check:bases` unchanged: 23 and 37 allowed to differ).
- Phase 01, 1.6.4: `404305c5` fix(aria): label part as add-part writes it. Output of
  `pnpm add-part aria label` kept as is; it differs from the edited file in two places, the
  `import * as React` comes back and the `'use client'` directive goes. The upstream
  `aria-nova/label.json` content carries the directive; the CLI drops it from some files of a
  run and keeps it in others (the Part drift section below has the mechanism), and the
  committed tree reflects older runs: 18 of the 27 aria parts had no directive before this
  commit. `pnpm add-part aria label && git status --short` prints nothing afterwards, and the
  output of that exact command is stable across repeated runs.
- Phase 01, follow-up: `6c8550e5` fix(registry): aria item takes label as a
  registryDependency. See Owner attention.
- Decision 4: `999ea291` docs(changelog): drop the label workaround line (the `### Changed`
  bullet and its heading under `## Unreleased`, the `### Fixed` bullet stays); `81b69881`
  docs(install): known issue, aria label and noUnusedLocals (a `Callout` in the Verify step of
  `install.mdx`: the `aria-nova` `label` part's unused `import * as React` fails Vite's
  `noUnusedLocals`, TS6133, the user deletes the line or sets `"noUnusedLocals": false` in
  `tsconfig.app.json`; the page has no aria-only tab in MDX, the callout title names React
  Aria); `e60f2794` ci(install): aria scenario applies the documented label step (an
  `aria`-only step after `shadcn add` deletes that line from `src/components/ui/label.tsx`
  and fails when it is missing; it runs again after the locale and example adds, because
  `--overwrite` rewrites every resolved file whose content differs and the locale item
  resolves the library's `label` registryDependency, so the old combined step is split
  around it; `actionlint` clean, the file's one pre-existing shellcheck warning, unused `i`
  in the dev registry wait loop, fixed in the same commit).
- Final phase: docs commit below. Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria` 0 errors;
  `lint` clean; `pnpm add-part aria label && git status --short` nothing;
  `check:bases` green (142 files, 23 and 37 allowed to differ); `registry:build` green
  (`shadcn-table-aria`: 104 files, 24 registryDependencies). `pr.yml` runs on the verifier's
  CI-only PR; the PR touches `packages/shadcn-table/registry`, so it needs a `release:` label
  (`release:minor` per decision 3).

## Part drift (halt, review round)

Probe on 2026-10-28 (`shadcn` 4.22.0, `@shadcn/registry` 0.2.0): `pnpm add-part <edition>
<part>` run once per part for every part in every edition (checkbox skipped on radix and
base, the recorded forks), tree restored with `git checkout` after each edition. Files the
script rewrote, per edition:

- radix: `collapsible`, `command`, `input-group`, `label`, `progress`, `select`, `slider`,
  `table` lose `'use client'`; `combobox` gains it; `dialog` loses the `font-heading` class on
  `DialogTitle`.
- base: `command`, `dropdown-menu`, `field`, `popover`, `radio-group`, `separator`, `table`,
  `tooltip` lose `'use client'`; `dialog` loses `font-heading`.
- aria: `checkbox`, `dropdown-menu`, `progress`, `separator`, `switch`, `textarea` lose
  `'use client'`; `dialog` loses `font-heading`.

Two mechanisms, both in the CLI, neither in the parts:

- `'use client'`: `@shadcn/registry` 0.2.0 `transform-rsc` matches the directive with
  `/^["']use client["']$/g` through `.test()`; the `g` flag keeps `lastIndex` between files,
  so with `rsc: false` the directive is removed from every other file the CLI transforms in
  one run (the requested parts plus their registryDependencies, in the CLI's order). Observed:
  `pnpm add-part aria separator textarea` rewrites `separator.tsx` only,
  `pnpm add-part aria textarea separator` rewrites `textarea.tsx` only, both repeatable; a
  single-part call strips the directive from `label`, `separator`, `textarea` and adds it to
  radix `combobox`, whose dependencies are transformed first. Upstream content carries the
  directive for every part checked. The committed copies are what earlier runs happened to
  write, so "what `add-part` writes" is defined per invocation, not per part.
- `font-heading`: the CLI resolves that class against the project's stylesheet; the add-part
  scratch `index.css` is empty, so the class is removed; a scratch stylesheet declaring
  `--font-heading` keeps it (checked by hand with `shadcn add dialog`). Upstream `dialog`
  content carries `font-heading` in all three styles; the committed `dialog.tsx` files keep it.

Plan section 2 names "any other part showing a diff" as a halt, so this run stops here. Open
for the owner: re-add the drifting parts as the script writes them (one commit per edition,
decision 2, accepting that a later run with a different part order flips directives again),
or fix the mechanism first (a repo-side rule for the directive and a `--font-heading`
declaration in the scratch stylesheet are check-side changes, not part edits; the regex is
an upstream bug in `@shadcn/registry`). No part was hand-edited; the tree holds the committed
copies.

## Owner attention

- `registry/aria/registry.ts` `forkedUi: ['label']` is dropped (`6c8550e5`) as a consequence
  of decision 2: the fork existed to ship a `label` copy without the unused `import * as
  React`, so a fresh `shadcn init --template vite --base aria` app passed `tsc` (Vite's
  default tsconfig sets `noUnusedLocals`; the shipped part fails TS6133, see
  `../../v0.5.x/anindosarker/02-tracker.md`, Gates). With the part as shipped the fork would
  ship identical content, so it is gone: the aria item lists `label` in `registryDependencies`
  and no longer carries `registry/aria/components/ui/label.tsx` in `files`; `registry.json`
  rebuilt. The trade-off decision 2 accepted ("No upstream report to shadcn"): a fresh Vite
  aria app fails TS6133 until aria-nova drops the import or the user deletes the line or
  relaxes `noUnusedLocals`; reverting `6c8550e5` would not restore it. Settled by decision 4:
  the install page names it as a known issue with the user's own fix, and the `aria` install
  scenario applies exactly that documented step (`e60f2794`); the CHANGELOG line is gone.
- `checkbox` on radix and base is a recorded fork (`forkedUi`, minus icon for the
  indeterminate state): `pnpm add-part radix checkbox` shows a diff there, which contradicts
  the literal "never edited" of decision 2. The standards bullet names it as the recorded-fork
  exception instead of hiding it. Not changed in this part.
- The forked `checkbox.tsx` files sit under the new ESLint ignore pattern
  `registry/*/components/ui/*.tsx`, so our own edits in them are type-checked but not linted.

## Review round

- Fixed: part drift probed and recorded (section above), halt returned per plan section 2;
  1.6.4 bullet restated from the observed mechanism; `forkedUi` bullet names the returning
  TS6133 install scenario, CHANGELOG gains a `### Changed` line; docs app installed copies
  reinstalled for all three editions (`717dac78`: `ui-aria/label.tsx` is the upstream part
  the aria item now depends on, the stale `eslint-disable` line left `ST_TableDetailPanel.tsx`
  in all three copies; nothing else moved); `caughtErrors: 'none'` on
  `@typescript-eslint/no-unused-vars` (`daa4ddb3`), an unused `catch (e)` binding in a library
  file lints clean, as `noUnusedLocals` left it.
- Declined: the standards bullet's second sentence (`forkedUi` as the recorded-fork
  exception) stays as flagged in Owner attention; it is the owner's call between decision 2
  as written and the checkbox forks.
