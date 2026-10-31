# 02: lint parity

## 1. Architecture

### 1.1 Overview

The library lints with `eslint-plugin-react-hooks` 5.2.0 `recommended-latest` and a folded-core exemption block, so a Next 16 consumer sees React Compiler and core hits the repo never reports (F1 to F6) (F9 to F12) (F17). This spec lints the library as the consumer does (D17), fixes every local hit in all three bases (D4) (D5 a to c) (D7) (D8) (D9) (D12) (D14) (D15) and keeps suppressions per line and reasoned (D19). Runs in workstream S1 (index, Run plan) (D34): the dependency adds, the lockfile and `hooks/useST_ComposedRef.ts` land in the foundation; the config switch and the `lint -f json` baseline are the S1 lead step; the fixes are applied per file set A to D together with 04, 05, 06 and 07; the long gates run once at workstream end.

### 1.2 Goals

- `pnpm --filter shadcn-table lint` reports zero problems under the 1.6.2 config (D17) (D19)
- No relaxation block in the config, temporary or otherwise; no new disable in library code beyond 1.6.6 (the five 04 `keep` lines and the `icons.ts:74` line come from the foundation)
- No option, type or visible behavior change; per-base tsc, tests and `check:bases` green
- Acceptance: `pnpm --filter shadcn-table lint` exits 0 under the 1.6.2 config (unused directives are errors there), and `grep -rc "eslint-disable" packages/shadcn-table/registry/<base>/components/ui/shadcn-table | awk -F: '{s+=$2} END {print s}'` per base equals the expected count recorded in `trackers/02-tracker.md` at the S1 lead step (P6)

### 1.3 Current structure

```
package.json (root)                ← pnpm.overrides "@types/react": "19.1.13" (no useEffectEvent type)
packages/shadcn-table/
├── package.json                   ← `lint`: `eslint .`; no peerDependencies field; dependencies react, react-dom ^19.1.1;
│                                    devDependencies @types/react ^19.1.13, @types/react-dom ^19.1.9,
│                                    eslint-plugin-react-hooks ^5.2.0
└── eslint.config.js               ← recommended-latest (2 rules), `^_` patterns, folded-core block
```

### 1.4 Target structure

```
package.json (root)                ← override "@types/react": "^19.2.0"
packages/shadcn-table/
├── package.json                   ← `lint`: `eslint . --max-warnings 0`; react, react-dom ^19.2.0 (dependencies); @types/react, @types/react-dom ^19.2.0,
│                                    eslint-plugin-react-hooks ^7.1.1, @eslint-community/eslint-plugin-eslint-comments (new)
├── eslint.config.js               ← 1.6.2
└── registry/<base>/components/ui/shadcn-table/
    └── hooks/useST_ComposedRef.ts ← new, identical in the three bases (1.6.3)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `package.json` fields as 1.4. The range D5 calls the peer range lives in `dependencies`; no `peerDependencies` field is added. The dependency adds, the root override and the lockfile land in the foundation's single `pnpm install` (index, Run plan); this spec never touches `package.json` or the lockfile.
- `packages/shadcn-table/package.json` `lint` script: `eslint . --max-warnings 0`. Every rule the config reports as a warning, the seven React Compiler rules, `exhaustive-deps`, `incompatible-library` and `unsupported-syntax` included, fails `lint` (D17)
- `registry.json`: `registry:build` adds `hooks/useST_ComposedRef.ts` to the four main items. Docs copies: `pnpm --filter shadcn-table-docs lib:install <base>` per base.
- `CHANGELOG.md` `## Unreleased` `### Fixed`: "The installed table lints clean under `eslint-config-next` 16 with the React Compiler rules: hooks run unconditionally, no ref is touched during render, no state is set inside an effect."
- `docs/code-of-conduct/coding-standards.md` "## Gates": the `lint` line comment names the React Compiler rules, `no-deprecated`, unused directives and directive descriptions.

#### 1.6.2 ESLint config

Plugin 7.1.1 exposes the flat config under `configs.flat`; `configs.recommended` is the legacy form. The folded-core block and the `no-unused-vars` options go, so `tseslint.configs.recommended` defaults apply as in `next/typescript` (D17). Type-aware linting uses each base's tsconfig, since `@/` resolves per base.

```js
import comments from '@eslint-community/eslint-plugin-eslint-comments';

const LIB = 'registry/*/components/ui/shadcn-table';
const BASE_PROJECTS = { base: './tsconfig.baseui.json', radix: './tsconfig.radix.json', aria: './tsconfig.aria.json' };

export default defineConfig([
  globalIgnores([/* unchanged */]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    languageOptions: { /* unchanged */ },
  },
  ...Object.entries(BASE_PROJECTS).map(([base, project]) => ({
    files: [`registry/${base}/components/ui/shadcn-table/**/*.{ts,tsx}`],
    languageOptions: { parserOptions: { project, tsconfigRootDir: import.meta.dirname } },
    plugins: { '@eslint-community/eslint-comments': comments },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  })),
]);
```

- Stories, `.storybook` and `scripts` get the plugin 7 rules through the first block; hits there are fixed under the same decisions
- Does NOT switch off any rule for the whole library; does NOT keep `^_` patterns or `caughtErrors: 'none'` (every `catch (e)` in the library uses `e`)
- Does NOT add temporary per-file relaxation blocks: with `reportUnusedDisableDirectives: 'error'` a per-file `no-explicit-any: off` block turns the 11 existing next-line directives into unused-directive errors. The S1 file sets fix every hit directly; `lint` is red by design between the lead step and the last set merge (index, Run plan)

#### 1.6.3 `hooks/useST_ComposedRef.ts` (D5) (F2)

One callback ref for an internal ref and the user's ref, memoized on both. Replaces the `userRef.current = <props>.ref` render write. The file is written in the foundation (index, Run plan); the sites below are set work.

```typescript
export const useST_ComposedRef: <T>(
  internalRef: RefObject<T | null>,
  userRef: Ref<T> | undefined,
) => RefCallback<T>;
```

- Attaches the node to both refs through `assignRef`; the cleanup runs the user's cleanup or nulls the user's ref, then nulls `internalRef`
- Does NOT read a ref during render; a user ref that changes identity re-attaches, as React's own ref merging does

| Site | Status | Internal ref, user ref |
| --- | --- | --- |
| `ST_TableLayout`, `ST_TableContainer`, `ST_TableHead`, `ST_TableFooter`, `ST_TopToolbar`, `ST_BottomToolbar` | refactor | `table.refs.<spec>Ref`, `<spec>Props.ref` |
| aria `ST_Tooltip` | refactor | `triggerRef`, `trigger.props.ref` |

```tsx
const attachRef = useST_ComposedRef(tableLayoutRef, layoutDivProps.ref);
```

#### 1.6.4 Menu anchors (D5) (F2)

Superseded: the foundation's `hooks/useST_MenuAnchor.ts` (D26 shape, index Run plan) replaces the `lastAnchorEl` state this section planned; set C applies 07 1.6.2 (wire the five menus to the hook) and that removes every `anchorRef` render read and write below. The sites stay listed so the set knows what to remove.

- Sites: base `ST_ColumnActionMenu`, `ST_FilterOptionMenu`, `ST_RowActionMenu`, `ST_ShowHideColumnsMenu`; radix `ST_FilterOptionMenu`, `ST_RowActionMenu`; aria none (D20)
- Site: base `components/menus/ST_CellActionMenu.tsx`: `anchorRef` at the component top (:49) and its render-time write `if (anchorEl) anchorRef.current = anchorEl` inside the `Subscribe` render prop (:103), fed by the `actionCellRef.current` read at :102; the hook call at the component top replaces both (D5) (F2). Radix and aria hold no anchor ref there

#### 1.6.5 Hooks (D4) (D7) (D12) (D14)

- `useST_RowVirtualizer`, `useST_ColumnVirtualizer`: `'use no memo'` first in the body (D14) (F10); every hook unconditional, `enabled: enableRowVirtualization` / `enableColumnVirtualization` passed to `useVirtualizer` (option present in virtual-core 3.11.2), `undefined` returned at the end when off (D4) (F1); complete dependency lists (D12) (F9)
- `useST_TableOptions`: the `id = useId()` default goes; `id: idProp` destructured, `generatedId = useId()` in the body, `id = idProp ?? generatedId` (D4) (F1); locals `definedIcons`, `definedLocalization`, `definedDefaultColumn`, `definedDefaultDisplayColumn`; the virtualization pair fixed at mount by a `useState` initializer, which replaces the `[]` memo without a suppression (D7) (F3) (F6) (D12) (F9). Returned keys unchanged
- `useST_TableInstance`: `initialState` built in a `useState` initializer from a shallow copy of `definedTableOptions.initialState` (D7) (F3) (D12 site 123) (F9); skeleton `data` memo lists `pageSize` and `columns` (D12 site 197) (F9)
- `useST_Effects`: `latestTable` and `latestCheckPageIndex` replaced by effect events (D5) (F2); subscriptions call them through a wrapper, never pass them

```typescript
const readOptions = useEffectEvent(() => table.options);
const checkPageIndex = useEffectEvent((totalRowCount: number): void => { /* body unchanged */ });
```

- Effect dependency lists name `table.atoms` and destructured table methods; `table` itself appears in memo lists only, since `useTable` returns a new object on every render (`@tanstack/react-table` 9.3.1 `dist/useTable.js:70`, a `useMemo` keyed on the per-render `tableOptions`), so no effect re-runs per owner render (D12) (F9)

#### 1.6.6 Components and utils (D7) (D8) (D9) (D15) (D19)

- D7 (F3) handler writes keep one disable each, wording `// eslint-disable-next-line react-hooks/immutability -- runs in <handler>, not render; <object> is <owner>'s mutable <ref bag | row values cache>`: `ST_TableBodyCell` `handleContextMenu`, `ST_EditActionButtons`, `ST_EditCellTextField`, `ST_FilterTextField` (filter input refs), aria `ST_FilterTextField` `comboboxAnchor` x2
- D8 (F4): `ST_TableBodyCell` skeleton width from the `useState` initializer; `ST_FilterRangeSlider`, `ST_FilterTextField`, `ST_GlobalFilterTextField` keep `prev<Value>` in state and set local state during render on change, always behind the previous-value compare, never unconditionally (`react-hooks/set-state-in-render`); store setters are never called in render (`setGlobalFilter(undefined)` is a no-op once the filter is undefined); `isMounted` refs go
- D9 (F5): debounce memos `useMemo(() => debounce(...), [])` with `// eslint-disable-next-line react-hooks/exhaustive-deps -- one debounced function per mount; a new one drops the pending call`; `ST_ShowHideColumnsMenu` and `useST_Rows` hoist getter results to locals, the block disable goes
- D15: `ST_TableDetailPanel` drops `hover` without a binding; `filterFns.ts:180,188` trailing parameters removed (F11); `cell.utils.ts:121`, `row.utils.ts:211` `if / else` (F12)
- D19 (F17): the nine feature-file `/* eslint-disable no-unused-vars */` blocks and the `ShadcnTable.tsx` `rules-of-hooks` block become `eslint-disable-next-line` on each reported line, same reason

**Stays unchanged:** public options and types, `ST_TableInstance`, `selectST_TransformState`, registry item names, `*-diff.json` lists, the 8 `@ts-expect-error`.

### 1.7 Dependencies and env

- `eslint-plugin-react-hooks` 7.1.1, `@eslint-community/eslint-plugin-eslint-comments` 4.8.1 (pinned), `@types/react`, `@types/react-dom` ^19.2.0; React 19.2 runtime for `useEffectEvent`. All added in the foundation (index, Run plan)

## 2. Instructions for AI

### 2.1 Milestones

#### 2.1.1 Milestone 1: Config switch and baseline (S1 lead step)

Lane: agent

- 1.6.2 as written, no temporary blocks; the dependencies and `useST_ComposedRef.ts` are already on `claude/review` from the foundation
- `pnpm --filter shadcn-table lint -f json` before the switch is the foundation baseline (`reference/02-lint-baseline.json`); rerun it after the switch and record the count per rule and per file in `../trackers/02-tracker.md`, split library, stories, other; the S1 file sets are built from that output unioned with the site lists of 04 1.6.2 and 1.6.5, 05 1.6.4 to 1.6.8 and 07 1.6.4, so comment-only files have an owner too
- Record in `../trackers/02-tracker.md` the expected `eslint-disable` count per base after the sweep: the 1.6.6 lines, the five 04 `keep` lines, the 05 `navigator.platform` line and `icons.ts:74` while it holds the foundation disable
- Gates: `tsc:radix`, `tsc:baseui`, `tsc:aria` green (`lint` red by design until the last set merges)

#### 2.1.2 Milestone 2: Fixes per file set

Lane: agent

- Per set A to D (index, Run plan), all rule groups in one pass on the set's files in base, radix and aria: D4, D5 (1.6.3, effect events; 1.6.4 through the foundation hook in set C), D7, D8, D9, D12, D14, D15, D19, per 1.6.3 to 1.6.6; 03's `hooks/useST_TableInstance.ts` edits are already in from the lead step
- Reviewer (workstream review, whole diff) bounces on: a behavior change; a disable without a reason, file-wide, or outside 1.6.6; `table` in an effect dependency list; a store setter called in render; an unconditional setState in render (`react-hooks/set-state-in-render`); a base twin missed; a decision applied differently than written
- Blocked: a fix that needs a public type change, or a compiler rule the `'use no memo'` hooks still report; that site is recorded under `## Attention` in `../trackers/02-tracker.md` and skipped, the set continues (P5)
- Gates per set: `eslint --max-warnings 0 <own files>` zero, `prettier --check <own files>`

#### 2.1.3 Final milestone: Gates once

Lane: inline

- 1.6.1 CHANGELOG line in the `### Spec 02` block; `registry:build`; `lib:install` for the three bases
- `pnpm format`; merge per the index Workstreams rule; the next-app consumer check runs in spec 09 1.6.2 from the local registry
- Gates: the full set in 2.2, recorded in `../trackers/02-tracker.md` for the whole workstream

### 2.2 Gates

- `pnpm --filter shadcn-table lint` (`eslint . --max-warnings 0`) zero problems, warnings included; no relaxation block in the config
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria` green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` green, `Styling/Render Counts` included (pins the owner re-render set)
- `pnpm check:bases` green; `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green
- The 1.2 `eslint-disable` count per base equals the tracker's expected count
- Workstream S1 long gates, recorded here for 02 to 07 at the end of S1: `pnpm --filter shadcn-table exec tsc -p tsconfig.stories.json`, `check:tailwind`, `pnpm registry:build`, `lib:install` per base, and the 06 computed-style spot check (`z-index: 2` on the sticky header, `min-height: 100px` on the empty body)
- `pr.yml` green on the PR
