# 06: tailwind canonical

## 1. Architecture

### 1.1 Overview

A Tailwind 4.3 consumer sees `suggestCanonicalClasses` hints on 37 class sites, 22 distinct classes, in every base (F13). They take their canonical form in all three bases, same CSS output, and a new `check:tailwind` gate keeps them canonical (D16). Branch `v0.7/tailwind-canonical` from `claude/review` after 01 merges, worktree `shadcn-react-table.worktrees/tailwind-canonical`, parallel to the 02 chain; the later merger rebases; one PR into `claude/review` for CI, merged by merge commit once green.

### 1.2 Goals

- Zero non-canonical candidates in `registry/<base>/components/ui/shadcn-table/` for base, radix and aria (F13) (D16)
- `pnpm check:tailwind` exits 0 on the result and non-zero on any reintroduced non-canonical class
- CI runs the check per base in the `library` job (D16)
- Rendered output unchanged: Storybook tests green, spot checks match

### 1.3 Current structure: none

### 1.4 Target structure

```
packages/shadcn-table/
├── package.json                 ← check:tailwind script, devDependencies
└── scripts/
    ├── check-tailwind.mjs       ← new gate
    └── registry/lib.mjs         ← BASES, PKG reused
package.json                     ← root check:tailwind
.github/workflows/pr.yml         ← library job step
docs/code-of-conduct/coding-standards.md ← Gates block line
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Changed`: "Tailwind classes use their canonical forms (`z-1` for `z-[1]`, `min-h-25` for `min-h-[100px]` and 20 more), so Tailwind 4.3 IntelliSense reports no hints in the installed files; same CSS."
- `registry.json` unchanged (no file added or moved); hosted output and the three docs app copies change only in the 37 sites.

#### 1.6.2 Canonical classes

Applied by hand in every base, identical in radix, base and aria (F13 counts match per base). Sites per base, paths below `shadcn-table/`; line numbers from F13 on `registry/base`.

| Current | Status | Canonical | Sites |
| --- | --- | --- | --- |
| `z-[1]` | refactor | `z-1` | `ST_TableBody.tsx:165,236`, `ST_TableFooter.tsx:25`, `ST_TableHeadCellSortLabel.tsx:115`, `ST_BottomToolbar.tsx:23`, `ST_TopToolbar.tsx:20`, `style.utils.ts:162,183` |
| `z-[2]` | refactor | `z-2` | `ST_TableBodyRow.tsx:47`, `ST_TableHead.tsx:25`, `ST_TableHeadCell.tsx:282`, `ST_TablePagination.tsx:55`, `ST_ToolbarAlertBanner.tsx:25`, `ST_TopToolbar.tsx:76`, `style.utils.ts:160` |
| `z-[3]` | refactor | `z-3` | `ST_TableLoadingOverlay.tsx:11`, `ST_ToolbarInternalButtons.tsx:16` |
| `z-[4]` | refactor | `z-4` | `ST_TableHeadCellResizeHandle.tsx:108`, `ST_ToolbarDropZone.tsx:14` |
| `data-[pinned=true]:before:-z-[1]` | refactor | `data-[pinned=true]:before:z-[-1]` | `style.utils.ts:74` |
| `min-h-[100px]` | refactor | `min-h-25` | `ST_TableBody.tsx:180` |
| `min-w-[70px]` | refactor | `min-w-17.5` | `ST_ColumnPinningButtons.tsx:13` |
| `w-[70px]` | refactor | `w-17.5` | `ST_ShowHideColumnsMenuItems.tsx:151` |
| `min-w-[140px]` | refactor | `min-w-35` | `ST_FilterTextField.tsx:438` |
| `min-w-[120px]` | refactor | `min-w-30` | `ST_FilterTextField.tsx:440` |
| `min-w-[72px]` | refactor | `min-w-18` | `ST_FilterTextField.tsx:442` |
| `min-w-[96px]` | refactor | `min-w-24` | `ST_FilterTextField.tsx:444` |
| `mt-[3px]` | refactor | `mt-0.75` | `ST_FilterTextField.tsx:635` |
| `leading-[1.3125rem]` | refactor | `leading-5.25` | `ST_TableFooterCell.tsx:21` |
| `[&_svg]:size-[18px]` | refactor | `[&_svg]:size-4.5` | `ST_TableHeadCellSortLabel.tsx:17` |
| `m-[-0.25rem]` | refactor | `-m-1` | `ST_CopyButton.tsx:16` |
| `rotate-[135deg]` | refactor | `rotate-135` | `ST_RowPinButton.tsx:67` |
| `-mx-[0.1rem]` | refactor | `mx-[-0.1rem]` | `ST_GrabHandleButton.tsx:10` |
| `focus-visible:outline-offset-[-2px]` | refactor | `focus-visible:-outline-offset-2` | `style.utils.ts:164` |
| `[&>[data-align=inline-start]]:py-0` | refactor | `*:data-[align=inline-start]:py-0` | `ST_FilterTextField.tsx:450` |
| `[&>[data-align=inline-end]]:py-0` | refactor | `*:data-[align=inline-end]:py-0` | `ST_FilterTextField.tsx:450` |
| `supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin]` | refactor | `supports-[not_selector(::-webkit-scrollbar)]:scrollbar-thin` | `ST_TableContainer.tsx:32` |

- Does NOT touch the about 72 arbitrary values with no canonical form (`opacity-[0.97]`, `font-[inherit]`, `animate-[...]`, `[&>td]:after:*`) (F13)
- Does NOT touch shadcn parts `registry/<base>/components/ui/<part>.tsx`

#### 1.6.3 `check:tailwind`

`packages/shadcn-table/scripts/check-tailwind.mjs`, same style as `scripts/registry/check-bases.mjs`: header comment with usage, one summary line per base, then every offending site, non-zero exit on any problem; never edits a file.

- Input: optional base argument (`base`, `radix`, `aria`); default every base in `BASES` from `scripts/registry/lib.mjs`
- Design system: `__unstable__loadDesignSystem` from `@tailwindcss/node` over `registry/<base>/index.css` (the stylesheet Storybook imports as `@/index.css`), `base` set to `registry/<base>` so `tailwindcss`, `tw-animate-css` and `shadcn/tailwind.css` resolve
- Files: `registry/<base>/components/ui/shadcn-table/**/*.{ts,tsx}`; shadcn parts excluded
- Candidates: `Scanner#getCandidatesWithPositions` from `@tailwindcss/oxide` per file; kept when `candidatesToCss` returns CSS for it
- Check: `canonicalizeCandidates([candidate], { rem: 16 })`; a result different from the candidate is a failure
- Output per failure: `registry/<base>/.../<file>:<line>  <candidate>  ->  <canonical>`; exit 1 on any failure, 0 otherwise

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `scripts/check-tailwind.mjs` | new | |
| package script `check:tailwind` | new | `node scripts/check-tailwind.mjs` |
| root script `check:tailwind` | new | `pnpm --filter shadcn-table check:tailwind` |
| `pr.yml` `library` job step | new | `pnpm --filter shadcn-table check:tailwind ${{ matrix.base }}` after `lint` |
| coding-standards `## Gates` | refactor | one line `pnpm --filter shadcn-table check:tailwind   # canonical Tailwind classes, every base` |

**Stays unchanged:** `check-bases.mjs`, `lib.mjs`, `registry/<base>/index.css`, ESLint config.

**Usage:**

```sh
pnpm check:tailwind            # every base
pnpm --filter shadcn-table check:tailwind aria
```

### 1.7 Dependencies and env

- `@tailwindcss/node` `^4.3.3` and `@tailwindcss/oxide` `^4.3.3`: new devDependencies of `packages/shadcn-table` (already in the store at 4.3.3 through the docs app)
- `tailwindcss` and `@tailwindcss/vite` in `packages/shadcn-table` from `^4.1.11` to `^4.3.3`: Storybook and the tests build with the package's Tailwind, and `scrollbar-thin` exists in 4.3.3 and not in 4.1.11; the docs app is on `^4.3.3` already
- No env vars

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: Gate

Lane: agent

- 1.7 dependency changes, `pnpm install`
- 1.6.3 script and wiring; on the unchanged trees it reports 37 failures per base, 22 distinct, matching F13
- Gates: `lint`, `check:tailwind` output matches F13, `test:base`, `test:radix`, `test:aria` green on 4.3.3 before any class change

#### 2.1.2 Phase 2: Canonical classes

Lane: agent

- 1.6.2 in `registry/radix`, then the same lines in `registry/base` and `registry/aria`
- `pnpm registry:build`; `pnpm --filter shadcn-table-docs lib:install base`, `radix`, `aria`
- Gates: `check:tailwind` zero failures, `check:bases`, `tsc:radix`, `tsc:baseui`, `tsc:aria`, `test:base`, `test:radix`, `test:aria`

#### 2.1.3 Final phase: Cleanup

Lane: agent

- CHANGELOG line from 1.6.1; coding-standards Gates line
- Visual spot check per base in Storybook, against `claude/review`: sticky header over scrolled rows (`ST_TableHead.tsx:25`, `z-2`) and the empty-rows body height (`ST_TableBody.tsx:180`, `min-h-25`, 100px)
- `pnpm format`; PR into `claude/review` with `release:minor`, merge commit when green, push right after each commit

### 2.2 Gates

- `pnpm check:tailwind` exits 0 for base, radix and aria
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint` green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` green
- `pnpm check:bases` green; `pnpm registry:build` leaves `registry.json` unchanged
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green
- Spot check: computed `z-index: 2` on the sticky header and `min-height: 100px` on the empty body in each base
- `pr.yml` green, including the new `check:tailwind` step in each `library` matrix entry
