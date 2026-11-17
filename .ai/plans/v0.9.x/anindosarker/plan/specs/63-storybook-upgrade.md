# 63: Storybook upgrade and the docs branch catch-up

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Storybook is at 10.6.2. D123 moves it to the latest stable release as planned work: a baseline first, an audit of our setup against the target version, one install, and a compare with the baseline on all three bases. A first attempt as a hotfix was stopped by the owner; its branch `v0.9/storybook-upgrade` (18cc55b5) is a reference only and is not merged or continued.

The spec has two milestones on two branches. "Storybook upgrade" branches from `origin/claude/review` and merges into `claude/review`, so the upgrade can ship in a patch release. "Docs branch catch-up" branches from `origin/v0.9/docs-layout` and merges into `v0.9/docs-layout`: it merges `claude/review` into the docs branch once the library specs of this epic (60, 61, 62) and the upgrade have merged, moves the docs app's own Storybook pins, and makes the story pages there follow (process.md P1, D109, the E15 note).

### 1.2 Goals

- `storybook` and every `@storybook/*` package are on the latest stable release at the time the milestone runs (10.6.7 on 2026-11-17); no beta or release candidate (D123).
- A baseline exists before any change: the story test results on base, radix and aria, the three static builds, the story pages the docs mount, and screenshots of a fixed set of stories (D123).
- An audit lists every Storybook package, addon and config file of the project against what the target version expects (D123).
- After the upgrade the tests, builds, screenshots and docs story pages match the baseline on all three bases, and `pnpm ls storybook` shows one version in the package and, after the catch-up, in the docs app (D123).
- Known issues are listed with what is done about each, among them the `glob` vulnerability that comes in through `@storybook/react-vite` (Storybook issue 37409) and the peer range of `storybook-dark-mode` (D123).
- `v0.9/docs-layout` contains `claude/review` with the fixes of specs 60 to 62; the story pages whose text described a fixed bug describe the working behaviour (D125, D128); every story still has its docs page and its text (D106).
- Acceptance: programmatic, against a reference. `pnpm test storybook-tests --base base|radix|aria`, `pnpm test storybook-static --base base|radix|aria`, `pnpm test validate-repo`, `pnpm test typecheck --base base|radix|aria`, `pnpm test lint` green on both branches, `pnpm test docs-e2e --base base|radix|aria` on the docs branch; the reference is the baseline of Task 1 (`reference/d123-storybook-upgrade/baseline.md` and its captures): same test counts and names, same story ids in each `index.json`, screenshots without a visible difference.

### 1.3 Current structure

```
packages/shadcn-table/
├── package.json:56-62,82-83      ← @storybook/addon-a11y, addon-docs, addon-links, addon-mcp, react-vite ^10.6.2; addon-vitest 10.6.2 (pinned); @storybook/icons ^2.2.0; storybook ^10.6.2; storybook-dark-mode ^5.0.0
├── package.json:14-20            ← storybook:base|radix|aria (ST_BASE), storybook:build:*
├── .storybook/{main.ts,manager.ts,preview.tsx,themes.ts,base-tool.ts,vitest.setup.ts}
└── vitest.config.ts              ← the browser test project (vitest 4.1.12, playwright 1.64.1, vite = rolldown-vite 7.1.12 by a root override)
apps/shadcn-table-docs/package.json:32,60   ← only on v0.9/docs-layout: @storybook/react 10.6.2 and storybook 10.6.2, exact, for composeStories
pnpm-lock.yaml                    ← 57 lines name a Storybook package
test/storybook-static/{run,test}.mjs, test/run.mjs   ← storybook-tests, storybook-static
```

- Lookup of 2026-11-17 (card Q112): 10.6.3 to 10.6.7 are fixes only; MIGRATION.md has no section after "10.6.1 to 10.6.2"; no automigration exists for these versions; `storybook-dark-mode` 5.0.0 accepts `storybook ^10.0.0`; 11.0.0 is in beta. Nothing was installed or run for that lookup.
- The stopped hotfix changed `packages/shadcn-table/package.json`, the docs app's two pins and the lockfile, and ran the type check only.
- `packages/shadcn-table/package.json` and `pnpm-lock.yaml` are also changed by spec 57 on the docs branch (recharts); the catch-up merges both.

### 1.4 Target structure

```
.ai/plans/v0.9.x/anindosarker/reference/d123-storybook-upgrade/
├── baseline.md        ← test counts and names per base, story id lists, build sizes, the fixed story set
├── audit.md           ← package, addon and config against the target version; the known issues and what is done
├── captures/          ← the fixed set before and after, per base, light and dark
└── compare.md         ← after against baseline
packages/shadcn-table/package.json, pnpm-lock.yaml      ← the target version
apps/shadcn-table-docs/package.json                      ← the two pins, on the docs branch
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `packages/shadcn-table/package.json` and `pnpm-lock.yaml`: one `pnpm install` on the upgrade branch (process.md P6). The hand-off of these two files inside E15: spec 57 owns them first, on `v0.9/docs-layout` (recharts); then "Storybook upgrade" on `claude/review`; then "Docs branch catch-up", which merges both sides and regenerates the lockfile. No two of the three run at the same time.
- `CHANGELOG.md` (P9): `#### Spec 63 Storybook upgrade` under `## Unreleased`, `### Changed`.
- The plan reference files of 1.4 are committed on `claude/review` with the plan folder (P10).

#### 1.6.2 Baseline (D123)

- Taken on the upgrade milestone's branch point of `claude/review`, and for the story pages on `origin/v0.9/docs-layout`, before any file changes.
- The fixed story set is written into `baseline.md` first: Basic Default, and one story each from Column Pinning, Filtering, Editing, Detail Panel, Virtualization, Row Pinning, View Settings, Click To Copy and Sticky Header, in light and dark, on the three bases, plus the Storybook shell (sidebar, toolbar with the base tool and the dark mode toggle, the Docs tab of one story).

#### 1.6.3 Audit (D123)

- Target version: `npm view storybook version` at run time, and the same for each installed `@storybook/*` package and addon; a package without a release at the target version is named.
- Each of: the six `.storybook` files, the three-base scripts, `storybook-dark-mode`, `@storybook/addon-vitest` with `vitest.setup.ts` and the browser project, `@storybook/addon-mcp`, `storybook/test` imports in the stories, on the docs branch `composeStories` and `storybook/internal/csf-tools` in the docs app, and the deployed builds (the hosting's build settings for the Storybook site, the `storybook:build` script with its three outputs, and the `version.txt` it writes): what the target's changelog and MIGRATION.md say about it, and whether a change is needed.
- Known issues with a line each: what it is, whether the target fixes it, what we do (the `glob` advisory: the installed `glob` version after the upgrade and whether an override removes it without breaking the build; `storybook-dark-mode`: one Storybook version installed, the toggle works).

#### 1.6.4 Upgrade and compare (D123)

- Every Storybook package of 1.3 to the target version (`@storybook/addon-vitest` stays pinned exact; `@storybook/icons` and `storybook-dark-mode` move only when the audit says so), one install; a change the audit found needed is made in the same milestone.
- `npx storybook upgrade` is not relied on: there is no automigration for these versions; `npx storybook doctor` is run and its output recorded.
- Compare: the baseline's checks rerun, `compare.md` lists every difference with its cause; a difference that is not a fix in Storybook itself is a failure.
- The deployed Storybook: the hosting's preview deployment of the pushed branch is opened and the fixed set checked on base, radix and aria; when the hosting builds no preview for the branch, the tracker says so under Attention and the three static builds served locally on a P6 port stand in.

#### 1.6.5 Docs branch catch-up

- `git merge origin/claude/review` into the milestone branch (created from `origin/v0.9/docs-layout`): conflicts in the story files, the guides, `package.json` files and the lockfile are resolved so that the docs branch's story groups, exact stories, merged copies and texts stay, and `claude/review`'s plays, fixes and removed sentences are added to them; the lockfile is regenerated by `pnpm install`.
- Stories D110 merged on the docs branch are not brought back: no story export that D110 removed is re-added. A play `claude/review` added to such a story goes onto the story it was merged into: the steps of `ReorderRemoveDelete` into the play `reorderRemoveDelete` of `SortPopoverSeeded` (`SortPopover.stories.tsx:58`); the steps of `LockedColumnStaysPut` into `MenuReorderMovesColumn` (`ColumnOrdering.stories.tsx:226`, the locked row at `:270`); any other such story the same way, named in the tracker.
- The docs app's pins `@storybook/react` and `storybook` move to the target version, exact.
- Story pages: `node lib/story-pages.mjs` for a story `claude/review` added; such a page gets its description, Try it steps and Related guides in the format of D104, checked by the three judges of D104, and its line in `reference/docs-layout/story-text-checklist.md` (regenerated by `lib/story-text-checklist.mjs`).
- The Try it text of the story pages `features-sub-row-tree--sub-row-tree-with-selection` (D125) and `features-row-pinning--row-pinning-sticky-with-virtualization` (D128), written in E14 to match the bugs, is corrected to the working behaviour and stays in the owner's wording review.
- Does NOT merge `v0.9/docs-layout` into `claude/review`, `dev` or `master` (D109): that is the owner's word.

**Stays unchanged:** `.storybook` files unless the audit names a needed change; the stories' own code in the upgrade milestone.

### 1.7 Dependencies and env

- Storybook packages at the target version; no new package.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Storybook upgrade

- Files owned: `packages/shadcn-table/package.json`, `pnpm-lock.yaml`, `.ai/plans/v0.9.x/anindosarker/reference/d123-storybook-upgrade/**`
- Depends on: Stories match their examples, Lighter story pages
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test storybook-static --base base`, `pnpm test storybook-static --base radix`, `pnpm test storybook-static --base aria`
- Task 1: Baseline (1.6.2), nothing changed yet: the story tests and the static builds on the three bases, one base at a time (P5); per base the test count and names, the story ids of `storybook-static/<base>/index.json`, the build size; the captures of the fixed set; for the docs story pages, in a second pool worktree (01 to 09) taken from the runner and detached at `origin/v0.9/docs-layout` (never the root checkout, wt1 or wt2): `pnpm test docs-e2e --base base`, `--base radix` and `--base aria`, and captures of three story pages on each of the three bases. Checks: `baseline.md` and `captures/before/` committed; `git status` shows no change outside the reference folder
- Task 2: Audit (1.6.3). Checks: `audit.md` has one line per package, addon, config file and known issue, each with its source (changelog or MIGRATION.md section, issue number) and "change needed: yes or no"
- Task 3: Upgrade (1.6.4). Checks: `pnpm ls storybook -r` shows one version, the target; `pnpm ls --filter shadcn-table --depth 0 | grep storybook` shows every `@storybook/*` package at the target except `@storybook/icons`; `npx storybook doctor` output in the tracker, no error; `pnpm why glob` recorded in `audit.md`
- Task 4: Compare (1.6.4): the checks of Task 1 rerun on the three bases, `captures/after/`, `compare.md`. Checks: same test names and counts per base, all green; the story id lists are equal (`diff` of the sorted ids prints nothing); no visible difference in the captures, the shell included; the dark mode toggle and the base tool work (seen in the shell captures)
- Task 5: The deployed Storybook on a preview (1.6.4). Checks: the fixed set on the three bases, one line per base in the tracker; a missing preview named under Attention with the local stand-in result
- Task 6: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### Milestone: Docs branch catch-up

- Files owned: `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`, `packages/shadcn-table/package.json`, `packages/shadcn-table/stories/**`, `apps/shadcn-table-docs/content/docs/guides/row-pinning.mdx`, `apps/shadcn-table-docs/content/docs/guides/column-ordering-dnd.mdx`, `apps/shadcn-table-docs/content/docs/examples/more/**`, `.ai/plans/v0.9.x/anindosarker/reference/docs-layout/story-text-checklist.md`
- Depends on: Storybook upgrade, Sticky header switch and resize grip, Sub-row selection and copy button, Pinned rows with row virtualization, Touch drag in menus and toolbars, Stories match their examples, Docs content fixes
- Review: fable
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test storybook-static --base base`, `pnpm test docs-e2e --base base`, `pnpm test docs-e2e --base radix`, `pnpm test docs-e2e --base aria`
- Task 1: The merge (1.6.5). Checks: `git merge-base --is-ancestor origin/claude/review HEAD`; no conflict marker (`git grep -n '^<<<<<<<\|^>>>>>>>' -- . ':!*.md'` prints nothing); each conflicted file named in the tracker with what was kept; the story ids of `storybook-static/base/index.json` after the merge equal those of `origin/v0.9/docs-layout` before it (`diff` of the sorted ids prints nothing: no export re-added, none lost); the steps of every play specs 60 to 62 added are present, under the story named there or under the story D110 merged it into (1.6.5), one line per play in the tracker
- Task 2: Pins and install. Checks: `pnpm ls storybook -r` shows one version, the target, in `shadcn-table` and `shadcn-table-docs`; `pnpm ls recharts -r` still shows the docs app's version in both
- Task 3: Story pages follow. Checks: `pnpm test validate-repo` (every story has a page, order equal); a page added here has the three parts of D104 and passed the judges; the two corrected pages (1.6.5) state the working behaviour and their steps were run once in a browser on a production build with base selected, on a P6 port; the checklist regenerated; the server stopped
- Task 4: The docs story pages against the baseline of the first milestone: the three captured story pages and `pnpm test docs-e2e --base base|radix|aria`. Checks: green; no visible difference except the two corrected texts
- Task 5: Cleanup: `pnpm format`. Checks: 2.2

### 2.2 Checks

- The Local CI line of each milestone green, one base at a time (P5); every server stopped
- The Acceptance checks of 1.2
- Review: fable on "Storybook upgrade" (the audit and the compare read against the diff); fable on "Docs branch catch-up" (conflicts resolved by hand in the story files, plus any new story page text)
