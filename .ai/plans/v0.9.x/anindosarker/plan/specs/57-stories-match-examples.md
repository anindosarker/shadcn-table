# 57: Stories match their examples
- Epic: E15

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

E14 gave each of the 42 docs examples an exact story, so the docs Storybook button opens the same table. Six of those stories are not the same table yet, one example carries an option name that does nothing, and the line above every story reads awkwardly. This spec closes the three gaps (D114, D115, D124).

Branch: created from `origin/v0.9/docs-layout`, merges into `v0.9/docs-layout` (process.md P1, D109). Nothing here reaches `claude/review`.

### 1.2 Goals

- The column pinning example and its exact story lock the ID column with `enablePinning: false`; the ID column cannot be pinned in base, radix and aria (D114).
- The chart detail panel story draws its chart with recharts, as the example does; the five editing CRUD stories confirm a delete in a modal alert dialog, as the examples do (D115).
- recharts and the alert dialog are story-only: a development dependency and files under `stories/`; `registry.json` and what the registry ships do not change (D115, process.md P7).
- The first line above every story reads "View documentation for this example", the whole line one link to the story's docs page; the two lines after it are unchanged (D124).
- Acceptance: programmatic. `pnpm test storybook-tests --base base|radix|aria`, `pnpm test storybook-static --base base|radix|aria`, `pnpm test validate-repo` and `pnpm test docs-e2e --base base` green; the plays of 2.1 Task 2, 3 and 5; the reference for the six stories is their docs example on a production build of `v0.9/docs-layout` (`/docs/examples/chart-detail-panel`, `/docs/examples/editing-crud` and the four other editing pages).

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── examples/{base,radix,aria}/enable-column-pinning/TS.tsx:26   ← `enableColumnPinning: false` on the ID column, an option that does nothing
├── examples/<base>/chart-detail-panel/TS.tsx:9-16               ← imports recharts
├── examples/<base>/editing-crud-{modal,row,cell,table,tree}/    ← import @/components/ui/alert-dialog
├── components/ui-{base,radix,aria}/alert-dialog.tsx             ← the docs app's alert dialog per base
├── lib/story-variants.mjs:41-43                                 ← copies every story to stories/.<base>/, rewrites @/components/ui/ to @/components/ui-<base>/
└── package.json:59                                              ← recharts ^2.15.4
packages/shadcn-table/
├── stories/features/ColumnPinning.stories.tsx:312,321,384       ← ColumnPinningTable, the wrong line, story ColumnPinning
├── stories/features/DetailPanel.stories.tsx:16,1029,1078,1116   ← inline svg chart, story ChartDetailPanel
├── stories/features/Editing.stories.tsx:1314-1349,2640-2789     ← DeleteUserConfirm (inline box, role alertdialog), the five stories, play :2778
├── .storybook/preview.tsx:163-173                               ← "This story on the docs site:" + the address
├── vite.config.ts:19                                            ← @/ resolves to registry/<ST_BASE>
├── registry/<base>/components/ui/                                ← dialog.tsx, no alert-dialog.tsx
└── package.json:48-84                                           ← devDependencies, no recharts
tools/registry/examples-{base,aria}-diff.json                    ← do not list enable-column-pinning: the three copies stay identical
```

- The exact stories of the 42 examples have no page under `content/docs/examples/more/`; the example page is their page. No story page text changes here.
- No test asserts the story intro line today.

### 1.4 Target structure

```
packages/shadcn-table/
├── stories/support/{base,radix,aria}/alert-dialog.tsx   ← new, story-only, the docs app's file per base
├── vite.config.ts, tsconfig.stories.json                ← alias @story-support to stories/support/<ST_BASE>
├── stories/features/{ColumnPinning,DetailPanel,Editing}.stories.tsx
├── .storybook/preview.tsx                               ← line 1 reworded
└── package.json                                         ← + recharts (devDependencies), the docs app's range
apps/shadcn-table-docs/
├── examples/{base,radix,aria}/enable-column-pinning/TS.tsx
└── lib/story-variants.mjs                               ← rewrites @story-support/ to @/components/ui-<base>/
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `packages/shadcn-table/package.json` and `pnpm-lock.yaml`: `recharts` added to `devDependencies` at the docs app's range, one `pnpm install` (process.md P6: this milestone owns both files on `v0.9/docs-layout`).
- `CHANGELOG.md` (P9): `#### Spec 57` under `## Unreleased`, `### Fixed`.
- Generated, regenerated and committed when they change: `apps/shadcn-table-docs/registry.json` (`pnpm -w registry:items`); `packages/shadcn-table/registry.json` must not change.

#### 1.6.2 Column pinning example (D114)

- `enableColumnPinning: false` becomes `enablePinning: false` on the ID column in the three example copies and at `ColumnPinning.stories.tsx:321`. The comment on the line stays.
- Does NOT change the page text of `column-pinning.mdx`.

#### 1.6.3 Six exact stories (D115)

- `ChartDetailPanel` renders the chart with the same recharts components and props as `examples/base/chart-detail-panel/TS.tsx`; the inline svg and its comment are removed.
- `DeleteUserConfirm` opens the alert dialog of `@story-support/alert-dialog` with the same title, text and buttons as the examples; the inline box and its comment are removed. The play at `:2778` and every other play that confirms a delete follow.
- `stories/support/<base>/alert-dialog.tsx` is a copy of `apps/shadcn-table-docs/components/ui-<base>/alert-dialog.tsx`; `story-variants.mjs` maps the import back to the docs app's own file, so the docs app gains no second copy.
- Does NOT add an alert dialog to `registry/<base>/components/ui/` or to any `registry.json`.

#### 1.6.4 Story intro line (D124)

- `preview.tsx:163-173`: the paragraph is one link with the text "View documentation for this example", `href={docsPageUrl(id)}`, same classes, `target` and `rel`; no address text.
- Lines 2 and 3 (`:174-201`) are not touched.

**Stays unchanged:** every file under `packages/shadcn-table/registry/`, `lib/storybook-map.ts`, every page under `content/docs/`.

### 1.7 Dependencies and env

- `recharts` in `packages/shadcn-table` `devDependencies`, the range of `apps/shadcn-table-docs/package.json:59`.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Stories match their examples

- Files owned: `apps/shadcn-table-docs/examples/base/enable-column-pinning/TS.tsx`, `apps/shadcn-table-docs/examples/radix/enable-column-pinning/TS.tsx`, `apps/shadcn-table-docs/examples/aria/enable-column-pinning/TS.tsx`, `packages/shadcn-table/stories/features/ColumnPinning.stories.tsx`, `packages/shadcn-table/stories/features/DetailPanel.stories.tsx`, `packages/shadcn-table/stories/features/Editing.stories.tsx`, `packages/shadcn-table/stories/support/**`, `packages/shadcn-table/.storybook/preview.tsx`, `packages/shadcn-table/vite.config.ts`, `packages/shadcn-table/tsconfig.stories.json`, `packages/shadcn-table/package.json`, `pnpm-lock.yaml`, `apps/shadcn-table-docs/lib/story-variants.mjs`, `test/storybook-static/test.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test storybook-static --base base`, `pnpm test docs-e2e --base base`
- Task 1: Dependency and story support (1.6.1, 1.4): recharts, the three alert dialog files, the `@story-support` alias, the rewrite in `story-variants.mjs`. Checks: `pnpm ls recharts --filter shadcn-table` shows one version, the same as the docs app's; `git diff origin/v0.9/docs-layout --stat -- packages/shadcn-table/registry.json packages/shadcn-table/registry` prints nothing; `pnpm --filter shadcn-table-docs types:check` passes (the story copies resolve)
- Task 2: Column pinning (1.6.2), with a play on the story `ColumnPinning` that opens the ID column menu and finds no pin action; the play runs on the code before the fix first and fails there (P11). Checks: the failure in the tracker; `grep -rn "enableColumnPinning: false" apps/shadcn-table-docs/examples packages/shadcn-table/stories` prints nothing; `pnpm test validate-repo` (the three example copies identical)
- Task 3: The six stories (1.6.3). Checks: `grep -n "<svg\|DeleteUserConfirm.*role" packages/shadcn-table/stories/features/DetailPanel.stories.tsx packages/shadcn-table/stories/features/Editing.stories.tsx` shows no inline chart and no inline confirm box; each of the five editing stories has a play that deletes a row through the dialog (`findByRole('alertdialog')`, confirm, the row is gone); `ChartDetailPanel` has a play that expands a row and finds the recharts surface; all green on base, radix and aria
- Task 4: The six stories against their examples: on a production docs build with base selected, on a P6 port, each story page reached through the Storybook button's story and the example page side by side: same columns, data, chart and dialog. Checks: one line per story in the tracker; the server stopped
- Task 5: Story intro line (1.6.4) and its check in `test/storybook-static/test.mjs`: the built preview of one story carries a link with the text "View documentation for this example" and the docs address of that story, and the text "This story on the docs site" is absent. Checks: `pnpm test storybook-static --base base|radix|aria`
- Task 6: Cleanup: `pnpm format`, the changelog block, generated files. Checks: 2.2

### 2.2 Checks

- The Local CI line green; every server stopped
- The Acceptance checks of 1.2
- Review: none (stories and one example line; the plays and the side by side check cover it)
