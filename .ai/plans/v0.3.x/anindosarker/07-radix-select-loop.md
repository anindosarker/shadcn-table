# 07: Radix Select render loop

## 1. Architecture

### 1.1 Overview

The home page of https://www.shadcn-table.com/ (production, v0.3.0) dies about 9.6 s after
load in Chrome, with no click: React error #185 "Maximum update depth exceeded", then the
renderer is killed ("This page couldn't load"). It starts when the live demo
(`components/dev-home/v12/signal-demo.tsx`) opens the salary cell in its Editing step and
reproduces on `v0.4/07` with `next dev`. The fix is in the demo, not the library; no
decision was taken, so `decisions.md` is not touched.

**Mechanism (verified on `next dev`, Playwright hold of `/`):**

| Layer | Fact |
| --- | --- |
| Trigger | Editing step sets `editing` (`signal-demo.tsx` 265 to 271); `SignalTable` opens the cell from a `useEffect` with deps `[editingRowId, table]` that calls `table.setEditingCell(cell)` (`signal-table.tsx` 229 to 246) |
| `table` identity | `useTable` from `@tanstack/react-table` 9.3.1 returns `useMemo(() => ({ ...table, options, state }), [table, tableOptions, state])` (`dist/useTable.js` 70 to 78); `tableOptions` is a new object every render, so `useShadcnTable` returns a new `table` every render (logged: previous `table` never equals the next) |
| `cell` identity | `useST_TableInstance.ts` 215 rebuilds `statefulTableOptions.columns` with `prepareColumns` every render, so the core row model and its cells are rebuilt; the cell the effect finds is a new object every time (logged) |
| Loop | effect runs, `setEditingCell(newCell)`, `editingCell` state changes, `SignalTable` re-renders, new `table`, effect runs again: one commit every ~11 ms from 8.9 s, hook 31 (`editingCell`) and hook 52 (table state) of `SignalTable` change on every commit |
| Where it throws | `ST_TableContainer.tsx` 66 to 78: the layout effect without deps calls `setTotalToolbarHeight` in every commit of the cascade; toolbar heights are constant (56 + 56 = 112, equal to the current state on every commit), so it only feeds React's nested update counter and is the frame where the 51st nested update throws |
| Library alone | the same effect exists unguarded in MRT (`MRT_TableContainer.tsx` 50 to 62). Giving it a dependency array removes the throw, but the passive loop keeps running: two "Maximum update depth exceeded ... useEffect" console errors at 9.6 s and 10.3 s, so a library change only masks the demo bug |
| Demo alone | effect keyed on `editingRowId` only, reading the latest `table` through a ref: the hold reaches "Now showing: Grouping" with zero page errors and zero console errors on Radix UI and on Base UI |
| Radix | the Radix bump of 3af7aa9 stays, because the `SelectItemText` compose-refs loop of `@radix-ui/react-select` 2.3.0 under React 19.3.1 was real but secondary: it was the first frame of the same cascade before the bump |

### 1.2 Goals

- Home page survives the full demo loop (Sorting to Grouping) with zero page errors and zero
  console errors, with Radix UI and with Base UI selected in the base switch
- The demo's replay edit effect runs only when the replayed row changes, never on a new
  `table` object
- `pnpm-lock.yaml` resolves `radix-ui` 1.8.1, `@radix-ui/react-select` 2.4.1 and
  `@radix-ui/react-compose-refs` 1.1.5 for both importers
- A page check guards the regression: it fails against production v0.3.0 and on 3af7aa9, and
  passes with the demo fix
- `CHANGELOG.md` carries a Fixed entry under `## Unreleased` that names both fixes
- Library source and the installed docs copies under `apps/docs/components/ui` and `ui-base`
  are unchanged

### 1.3 Current structure

```
./
├── pnpm-lock.yaml                         ← radix-ui 1.5.0, react-select 2.3.0, compose-refs 1.1.3
├── CHANGELOG.md                           ← "## Unreleased" with "### Added" only
├── packages/shadcn-table/package.json     ← "radix-ui": "^1.5.0"
└── apps/docs/
    ├── package.json                       ← "radix-ui": "^1.5.0"
    ├── components/dev-home/v12/
    │   └── signal-table.tsx               ← replay edit effect deps [editingRowId, table]: re-runs on every render
    └── scripts/
        ├── check-pages.mjs                ← runner; collects console errors and pageerror per page
        └── page-checks/
            ├── _helpers.mjs               ← shared helpers (example, baseSwitch, ...)
            ├── a.mjs                      ← '/' asserts the agent bar base menu only
            └── e.mjs                      ← '/' asserts hero, install command, demo rows; wins when all clusters run
```

### 1.4 Target structure

```
./
├── pnpm-lock.yaml                         ← radix-ui 1.8.1, react-select 2.4.1, compose-refs 1.1.5 (old 1.1.3 entries stay for other transitive users)
├── CHANGELOG.md                           ← "## Unreleased" gains "### Fixed"
├── packages/shadcn-table/package.json     ← "radix-ui": "^1.8.1"
└── apps/docs/
    ├── package.json                       ← "radix-ui": "^1.8.1"
    ├── components/dev-home/v12/
    │   └── signal-table.tsx               ← replay edit effect keyed on editingRowId; latest table read through a ref
    └── scripts/page-checks/
        ├── _helpers.mjs                   ← new demoLoop() helper
        └── e.mjs                          ← '/' calls demoLoop() on both bases after its existing asserts
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

| Artifact | Status | Change |
| --- | --- | --- |
| `packages/shadcn-table/package.json` | refactor | `"radix-ui": "^1.8.1"` |
| `apps/docs/package.json` | refactor | `"radix-ui": "^1.8.1"` |
| `pnpm-lock.yaml` | refactor | output of `pnpm up -r radix-ui@1.8.1`; no hand edits |
| `CHANGELOG.md` | refactor | `### Fixed` under `## Unreleased`, after `### Added`; the entry of 3af7aa9 is rewritten in Phase 3 to the text below |
| `packages/shadcn-table/registry.json` | keep | `radix-ui` stays unversioned |
| `registry/radix/registry.ts` line 25 | keep | `{ name: 'radix-ui' }` |

**CHANGELOG entry:**

```markdown
### Fixed

- The docs home page no longer crashes with React error #185 ("Maximum update depth
  exceeded") about 9 seconds after load: the live demo opened its edited salary cell from
  an effect that re-ran on every render, because `useShadcnTable` returns a new table
  object each render. The effect now runs only when the replayed row changes.
- `radix-ui` is bumped to 1.8.1, which carries Radix's fix for the React 19 re-render loop
  in `Select` composed refs (`@radix-ui/react-select` 2.4.1,
  `@radix-ui/react-compose-refs` 1.1.5). The registry item already installs the fixed
  version for new users.
```

#### 1.6.2 Page check: demo loop

New helper in `_helpers.mjs`, called from the `'/'` entry of `e.mjs`. Catches any render
loop or crash that needs time or the demo's step changes to surface.

- Scrolls the live demo into view, then waits until its `aria-live` status reads
  `Now showing: Grouping` (last step), timeout 30 s, minimum hold 15 s
- Registers `page.once('crash')` before the hold and fails `demo: no renderer crash` if it
  fires
- Runs twice: with the default base (Radix UI), then picks Base UI through the agent bar's
  `Choose base` menu (same selectors as `commandBarBase` in `a.mjs`), reloads and holds again
- Leaves zero-error assertions to the runner: its `pageerror` and console listeners stay
  attached across the reload, so `no hydration / React errors` and `no console errors` cover
  both holds
- Does NOT add a check to `a.mjs`; `e.mjs` owns `'/'` when all clusters run (release smoke)
- Does NOT change the runner, `FATAL` or `KNOWN_LIBRARY_ERRORS`

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `demoLoop(page, check)` | new | `_helpers.mjs`, exported |
| `e.mjs` `'/'` | refactor | existing asserts first, then `demoLoop` |
| `e.mjs` header comment | refactor | mentions the demo loop hold |
| other helpers, clusters | keep | |

**Interfaces:**

```javascript
/** Holds the home page through the full live demo loop on both bases. */
export async function demoLoop(page, check) {}

const DEMO_LAST = 'Now showing: Grouping';
const DEMO_MIN_HOLD_MS = 15000;
const DEMO_TIMEOUT_MS = 30000;
```

**Checks added:** `demo: radix ui reaches Grouping`, `demo: base ui reaches Grouping`,
`demo: no renderer crash`.

**Stays unchanged:** `check-pages.mjs`, `a.mjs` to `d.mjs`, `baseSwitch`, `signal-demo.tsx`
timings.

**Usage:**

```javascript
'/': async ({ page, check }) => {
  // existing hero, agent bar, demo rows, headings, guide links asserts
  await demoLoop(page, check);
},
```

#### 1.6.3 Dependency bump

Moves both importers to `radix-ui` 1.8.1 so the lockfile carries the fixed Radix packages.

- Bumps the range in both `package.json` files and regenerates the lockfile with one
  `pnpm up`
- Does NOT pin or override `@radix-ui/react-select` or `@radix-ui/react-compose-refs`
  directly; `radix-ui` 1.8.1 pulls them
- Does NOT touch `@base-ui/react`, React or Next

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `pnpm up -r radix-ui@1.8.1` | new | from the repo root |
| lockfile verification | new | `pnpm why -r @radix-ui/react-select` and `@radix-ui/react-compose-refs` show 2.4.1 and 1.1.5 under `radix-ui` 1.8.1 |

**Stays unchanged:** library source under `packages/shadcn-table/registry/`, installed copies
under `apps/docs/components/ui` and `apps/docs/components/ui-base`,
`packages/shadcn-table/registry.json`, `registry/radix/registry.ts`, `public/r` output
content.

#### 1.6.4 Demo: replay edit effect

`SignalTable` opens and closes the salary cell the replay edits. The effect must not depend
on `table`: `useShadcnTable` returns a new object every render (TanStack `useTable` 9.3.1
memo on `tableOptions`), and the effect writes table state, so a `table` dependency loops.

- The effect's dependency array is `[editingRowId]` only
- The latest `table` is read through a ref that a deps-free `useLayoutEffect` assigns
  (`useEffectEvent` is not in the installed `@types/react`; TS2305)
- Open and close behaviour, `replayEditing` and the `editing` prop shape are unchanged
- Does NOT change `ST_TableContainer.tsx`: the toolbar height effect is MRT parity, its
  heights are constant in the loop, and a guard there only hides this bug

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| replay edit `useEffect` | refactor | `signal-table.tsx` 229 to 246; deps `[editingRowId]`, reads `tableRef.current` |
| `tableRef` | new | `useRef(table)`, assigned in a `useLayoutEffect` without deps |
| `react` import | refactor | adds `useLayoutEffect` |

**Interfaces:**

```typescript
// type inferred from useShadcnTable
const tableRef = useRef(table);
```

**Stays unchanged:** `SignalTableProps`, `SignalTableState`, `useShadcnTable` options in
`signal-table.tsx`, `signal-demo.tsx` (steps and timings), library source under
`packages/shadcn-table/registry/` (radix and base trees, including `ST_TableContainer.tsx`
and `useST_TableInstance.ts`), installed copies under `apps/docs/components/ui` and
`apps/docs/components/ui-base`.

### 1.7 Dependencies and env

| Package | From | To | Importers |
| --- | --- | --- | --- |
| `radix-ui` | 1.5.0 | 1.8.1 | `packages/shadcn-table`, `apps/docs` |
| `@radix-ui/react-select` (transitive) | 2.3.0 | 2.4.1 | via `radix-ui` |
| `@radix-ui/react-compose-refs` (transitive) | 1.1.3 | 1.1.5 | via `radix-ui` |

Unchanged runtime: react 19.3.1, react-dom 19.3.1, next 16.3.8. No env vars.

## 2. Instructions for AI

### 2.1 Phases

Runs alone in `shadcn-react-table.worktrees/07`, branch `v0.4/07`. No dependency on 05 or 06.
Merges into `claude/review` as soon as the gates are green; the owner then merges `master`
as a hotfix.

**Rules for every phase:**

- No `git add -A`; stage files by path
- Conventional Commits, no trailers, no attribution; push right after every commit
- `pnpm format` once, right before each commit; no format-only or comment-only commits
- No em dashes anywhere, comments and CHANGELOG included
- CHANGELOG entry in the same commit as the code it describes
- Revert `lib:install` side effects (`apps/docs/app/global.css`, `.next-*` entries in
  `apps/docs/tsconfig.json`) before committing
- Ports 4170 to 4179 only; never 3000, 5173, 5273, 5320, 5404, 5406, 6006, 6007, 6306
- Never `pkill`; stop only processes you started, by PID
- The docs `start` script binds 5320: use
  `NEXT_DIST_DIR=.next pnpm --filter shadcn-table-docs exec next start -p 4170`
  (`next.config.mjs` maps other ports to `.next-<port>`)

#### 2.1.1 Phase 1: Bump and lockfile

- Run `pnpm up -r radix-ui@1.8.1` from the repo root
- Confirm both `package.json` ranges read `^1.8.1`; set them by hand only if `pnpm up` left
  either unchanged
- Verify the lockfile per 1.6.3
- Add the CHANGELOG entry per 1.6.1
- Commit: `fix(deps): bump radix-ui to 1.8.1 for the React 19 Select ref loop`

#### 2.1.2 Phase 2: Page check

- Add `demoLoop` to `_helpers.mjs` per 1.6.2; call it from `e.mjs` `'/'`
- Prove it red: `node scripts/check-pages.mjs e --base https://www.shadcn-table.com /`
  fails (production still serves v0.3.0)
- Prove it red against local `next start` on 4170 too: the demo loop is still there until
  Phase 3 (gate 1 in 2.2)
- Commit: `test(docs): hold the home page through the demo loop`

#### 2.1.3 Phase 3: Demo fix

- Change the replay edit effect in `signal-table.tsx` per 1.6.4
- Rewrite the `### Fixed` entry in `CHANGELOG.md` to the text in 1.6.1
- Prove it green against local `next start` on 4170, both bases (gate 1 in 2.2)
- Commit: `fix(docs): stop the home demo edit effect from re-running every render`

#### 2.1.4 Final phase: Cleanup

- `pnpm format`
- Repo gates per 2.2
- Revert `lib:install` side effects; `git status` shows only the files in 1.4
- Open the PR into `claude/review` for CI; merge with a merge commit once green

### 2.2 Gates

1. Repro: docs `build`, then `next start -p 4170`;
   `node scripts/check-pages.mjs e --base http://localhost:4170 /` green: `demoLoop` reaches
   Grouping on Radix UI and Base UI, hold at least 15 s each, zero page errors, zero console
   errors, no renderer crash. Before Phase 3 the same command is red (error #185 at about
   9.6 s); after Phase 3 it is green
2. `pnpm check:bases`
3. Library, both bases (the library depends on `radix-ui`):
   `pnpm --filter shadcn-table tsc:radix` (TS5101 notice only), `tsc:baseui`, `lint`,
   `test` and `test:base` at 400/400 each
4. Docs: `pnpm --filter shadcn-table-docs types:check`, `lint`, `build`
5. Page checks: `check-pages.mjs a` and `e` against `next start` on 4170, all green
6. Installed copies: `pnpm --filter shadcn-table registry:build`, then
   `pnpm --filter shadcn-table-docs lib:install` and `lib:install:base`;
   `git status --short apps/docs/components/ui apps/docs/components/ui-base` is empty (the
   library does not change); side effects reverted
7. Docs lint and types cover the demo fix: `pnpm --filter shadcn-table-docs lint` and
   `types:check` with zero errors in `components/dev-home/v12/signal-table.tsx`
8. CI on the PR: docs, library and install jobs green
