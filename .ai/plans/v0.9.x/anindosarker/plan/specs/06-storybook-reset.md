# 06: Static Storybook resets after the play
- Epic: E2

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Every story's play runs when the story opens, so the deployed Storybook (`storybook.shadcn-table.com/<base>/`) shows each story in its play's end state: a filter typed, the last page selected (Q6). D8 resets the story after its play on the static builds only: `main.ts` tells the preview it is a static build, and a project-level `afterEach` in `preview.tsx` remounts the story through a keyed wrapper. `storybook dev` and vitest keep the end state. The diff is accepted as is (D8) and applied verbatim.

### 1.2 Goals

- A deployed story opens, runs its play with the Interactions panel logging every step, then returns to its initial state; Rerun runs the play and resets again (D8).
- `storybook dev` and `pnpm test storybook-tests` keep the end state; a failing play keeps its end state (D8).
- Acceptance: programmatic. `pnpm test storybook-static --base base` green (1.6.3): it builds the base static Storybook, serves it, opens the `PaginationCompactMoreData` story's iframe and asserts the footer reads `1-10 of 551` with an empty global filter once the play has settled; it runs on the shipped code first and must fail there, the red line recorded in the tracker (P11). `pnpm test storybook-tests --base base` green (the end state in vitest unchanged).

### 1.3 Current structure

```
packages/shadcn-table/.storybook/
├── main.ts:16-18, :42-44      ← baseScript, devScript; managerHead gets configType, previewHead does not
└── preview.tsx:1-3, :42-44, :91-135 ← imports; applyHtmlClass; the one decorator wrapping <Story />
test/validate-production/test.mjs ← HTTP checks only (v0.8.x D92); no browser
```

### 1.4 Target structure

```
packages/shadcn-table/.storybook/
├── main.ts                     ← staticScript(configType === 'PRODUCTION') in previewHead
└── preview.tsx                 ← resetCount store, ResetAfterPlay keyed wrapper, afterEach
test/storybook-static/
├── run.mjs                     ← defineTest({ name: 'storybook-static', bases, paths, run })
└── test.mjs                    ← build or --url, serve, one story, assert initial state after play
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 06 Storybook reset` under `## Unreleased`: the deployed Storybook resets each story after its play (D8, Q6).
- The tracker `trackers/06-storybook-reset-tracker.md`: the red run of `storybook-static` on the shipped code (P11).

#### 1.6.2 Reset after play (D8)

The accepted D8 diff, applied as is to `packages/shadcn-table/.storybook/main.ts` and `packages/shadcn-table/.storybook/preview.tsx`; `pnpm format` after.

- `main.ts`: `staticScript(isStatic)` beside `devScript`; `previewHead: (head, { configType }) => ...${staticScript(configType === 'PRODUCTION')}`. The manager head is unchanged.
- `preview.tsx`: `resetCount`, `resetListeners`, `subscribeReset`, `ResetAfterPlay` (a `useSyncExternalStore` keyed `Fragment`); `afterEach` on the `Preview` object returns early unless `globalThis.__ST_STATIC__ === true`, else bumps the counter and notifies; the existing decorator wraps `<Story />` in `<ResetAfterPlay>`.
- Does NOT touch the stories, `vite.config.ts`, `themes.ts`, `base-tool.ts`, the vitest setup or `validate-production` (HTTP checks only, v0.8.x D92).

**Stays unchanged:** the dark-mode hook, the banner paragraphs, `storybook:build:*` scripts, `vercel.json`.

#### 1.6.3 `storybook-static` test (Acceptance)

A based test in the repo's test contract (`test/lib/define.mjs`), modelled on `test/docs-e2e/test.mjs`.

- `run.mjs`: `defineTest({ name: 'storybook-static', paths: ['packages/shadcn-table/.storybook/**', 'packages/shadcn-table/stories/**', 'test/storybook-static/**'], bases: ['base', 'radix', 'aria'], run })`.
- `test.mjs`: without `--url`, runs `pnpm --filter shadcn-table storybook:build:<base>` then serves `packages/shadcn-table/storybook-static/<base>` with `serve` (already a root dependency) through `spawnServer` on `portFor(ctx, 5343)`; with `--url <origin>` it checks `<origin>/<base>/` instead (the deployed site; a release spec wires it, never `validate-production`). It opens `iframe.html?id=features-pagination-examples--pagination-compact-more-data&viewMode=story` in headless Chromium (`playwright`), waits up to 30 s for the footer text `1-10 of 551` and an empty global filter input, and asserts `window.__ST_STATIC__ === true`. One PASS or FAIL line, summary `reset pass`, a record under `test/.out/` as the other tests.
- On the shipped code the story ends at `1-1 of 1` with an address typed, so the check fails (P11).
- Does NOT run in `pr.yml` (no CI edit in this spec; the test is local and release-time).

### 1.7 Dependencies and env: none (`playwright` and `serve` are root dependencies already)

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Storybook reset

- Files owned: `packages/shadcn-table/.storybook/main.ts`, `packages/shadcn-table/.storybook/preview.tsx`, `test/storybook-static/run.mjs`, `test/storybook-static/test.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test storybook-static --base base`, `pnpm test storybook-tests --base base`, `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Reproduce: write `test/storybook-static/` (1.6.3), run `pnpm test storybook-static --base base` on the shipped code, record the red line in the tracker. Checks: the test lists under `pnpm test --list`; the run fails on the footer assertion
- Task 2: Apply the D8 diff to `main.ts` and `preview.tsx` (1.6.2), `pnpm format`. Checks: `pnpm --filter shadcn-table tsc:radix`; `pnpm test storybook-static --base base` green; `pnpm test storybook-tests --base base` green (one base, P5)
- Task 3: Cleanup: the changelog block of 1.6.1. Checks: 2.2

### 2.2 Checks

- `pnpm test storybook-static --base base` green: the deployed-style build opens the story in its initial state after the play
- `pnpm test storybook-tests --base base` green: vitest keeps the plays' end state and every play still passes
- `pnpm test lint` and `pnpm test validate-repo` green
- Review: none (checks only; no public option, two config files and one test)
