# 06: tailwind canonical

## 1. Architecture

### 1.1 Overview

A Tailwind 4.3 consumer sees `suggestCanonicalClasses` hints on 37 class sites, 22 distinct classes, in every base (F13). They take their canonical form in all three bases, same CSS output, and a new `check:tailwind` gate keeps them canonical (D16). The same pass makes direction logical: 20 static physical classes per base and the resize handle's direction variant become `ms-*`, `me-*`, `start-*`, `end-*` and `text-start` or `text-end`, pinning uses inline-axis offsets, and the gate fails on any physical direction class (D31) (F34). The four shadow literals take their color from theme variables (D32) (F35). Runs in workstream S1 (index, Run plan) (D34): the dependency bumps, `check-tailwind.mjs`, its scripts, the `pr.yml` step, the coding-standards line and the Storybook baseline captures land in the foundation; the class, direction and shadow edits are applied per file set A to D by the same builders that apply 02, 04, 05 and 07, so no 28-file rebase exists; the long gates run once at workstream end.

### 1.2 Goals

- Zero non-canonical candidates in `registry/<base>/components/ui/shadcn-table/` for base, radix and aria (F13) (D16)
- `pnpm check:tailwind` exits 0 on the result and non-zero on any reintroduced non-canonical class
- CI runs the check per base in the `library` job (D16)
- Zero physical direction classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `border-l`, `border-r`, `rounded-l`, `rounded-r`) in the library trees; `check:tailwind` fails on any (D31)
- The resize handle has no direction variant; pinned offsets use `insetInlineStart` and `insetInlineEnd`; the cell resize border uses `borderInlineEnd` (D31)
- No `rgba(` literal in the library trees; shadows read theme variables (D32)
- Rendered output unchanged in LTR: Storybook tests green, spot checks match
- Acceptance: `pnpm check:tailwind` exits 0 for base, radix and aria under both rules, and `grep -rn "rgba(" packages/shadcn-table/registry/*/components/ui/shadcn-table` prints nothing; judged: Storybook captures of the resize handle, pinned columns, toolbar and header shadows per base in LTR against the foundation baseline `reference/06-*` (taken with `reference/06-capture.mjs`), three judges on "same position, same visible shadow" (P6)

### 1.3 Current structure: none

### 1.4 Target structure

Everything in this tree is written in the foundation (index, Run plan); this spec's own edits are the class strings in the library files.

```
packages/shadcn-table/
├── package.json                 ← check:tailwind script, new devDependencies, `tailwindcss` and `@tailwindcss/vite` bumps in `dependencies` (:30, :45)
└── scripts/
    ├── check-tailwind.mjs       ← new gate
    ├── registry/bases.mjs       ← BASES (:24) reused
    └── registry/lib.mjs         ← PKG (:11) reused
package.json                     ← root check:tailwind
.github/workflows/pr.yml         ← library job step
docs/code-of-conduct/coding-standards.md ← Gates block line
.ai/plans/v0.7.x/anindosarker/reference/06-* ← baseline captures and 06-capture.mjs
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` `## Unreleased` `### Changed`: "Tailwind classes use their canonical forms (`z-1` for `z-[1]`, `min-h-25` for `min-h-[100px]` and 20 more), so Tailwind 4.3 IntelliSense reports no hints in the installed files; same CSS."
- `### Changed`: "Direction classes are logical (`ms-`, `me-`, `start-`, `end-`, `text-start`, `text-end`) and pinned offsets use the inline axis, so the table follows `dir` on any ancestor; set `columnResizeDirection: 'rtl'` on RTL pages for the drag math." (D31)
- `### Changed`: "Toolbar and header shadows take their color from the theme instead of fixed `rgba` values." (D32)
- `registry.json` unchanged (no file added or moved); hosted output and the three docs app copies change only in the 37 canonical sites, the direction sites and the four shadow sites.

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

`packages/shadcn-table/scripts/check-tailwind.mjs`, same style as `scripts/registry/check-bases.mjs`: header comment with usage, one summary line per base, then every offending site, non-zero exit on any problem; never edits a file. Written in the foundation (index, Run plan).

- Input: optional base argument (`base`, `radix`, `aria`); default every base in `BASES` from `scripts/registry/bases.mjs:24`; the package root from `PKG` in `scripts/registry/lib.mjs:11`
- Design system: `__unstable__loadDesignSystem` from `@tailwindcss/node` over `registry/<base>/index.css` (the stylesheet Storybook imports as `@/index.css`), `base` set to `registry/<base>` so `tailwindcss`, `tw-animate-css` and `shadcn/tailwind.css` resolve
- Files: `registry/<base>/components/ui/shadcn-table/**/*.{ts,tsx}`; shadcn parts excluded
- Candidates: `Scanner#getCandidatesWithPositions` from `@tailwindcss/oxide` per file; kept when `candidatesToCss` returns CSS for it
- Check: `canonicalizeCandidates([candidate], { rem: 16 })`; a result different from the candidate is a failure
- Output per failure: `registry/<base>/.../<file>:<line>  <candidate>  ->  <canonical>`; exit 1 on any failure, 0 otherwise
- Second rule (D31): a candidate whose utility is physical (`ml`, `mr`, `pl`, `pr`, `left`, `right`, `text-left`, `text-right`, `border-l`, `border-r`, `rounded-l`, `rounded-r`, `rounded-tl`, `rounded-tr`, `rounded-bl`, `rounded-br`, `scroll-ml`, `scroll-mr`, `scroll-pl`, `scroll-pr`, with or without a leading `-` and with or without variant prefixes, so `-mr-2` and `-ml-2` at `ST_TableHeadCellResizeHandle.tsx:34-39` count) is a failure printed as `<candidate>  ->  logical`; `inset-x-*`, `translate-x-*` and `rtl:` or `ltr:` prefixed candidates are not physical

#### 1.6.4 Logical direction classes

The 20 static physical sites per base (F34) and the resize handle's cva `compoundVariants` become logical; the runtime direction switch keeps only what CSS cannot express (D31). Lines from F34 and the RTL verification on `registry/base`; radix and aria hold the same sites.

| Site | Status | Change |
| --- | --- | --- |
| `ST_TableHeadCellResizeHandle.tsx:34-43` `compoundVariants` (`-mr-*`/`right-*` vs `-ml-*`/`left-*`) | refactor | one `-me-*` and `end-*` set, no `direction` variant; the cva `direction` prop goes |
| `ST_TableHeadCellResizeHandle.tsx:97-101` `translateX((rtl ? -1 : 1) * delta)` | keep | JS stays: `clientX` is physical and CSS transforms have no logical axis |
| `ST_TableBodyCell.tsx:220-223`, `ST_TableHeadCell.tsx:194-197` inline `borderRight`/`borderLeft` | refactor | `borderInlineEnd`, no branch |
| `ST_TableBodyCell.tsx:289/291`, `ST_TableHeadCell.tsx:253/255`, `ST_TableFooterCell.tsx:114/116`, `ST_TableDetailPanel.tsx:134/136` `text-right`/`text-left` | refactor | `text-end`/`text-start` |
| `ST_ToggleRowActionMenuButton.tsx:17` `ml-2.5`, `ST_TableHeadCellFilterLabel.tsx:22` `ml-1` | refactor | `ms-2.5`, `ms-1` |
| `ST_TableHeadCellSortLabel.tsx:115` `right-[14%]` | refactor | `end-[14%]` |
| `ST_FilterTextField.tsx:332` `right-0`, `:540` `pr-9` | refactor | `end-0`, `pe-9` |
| `ST_BottomToolbar.tsx:23,100`, `ST_ToolbarAlertBanner.tsx:25`, `ST_TopToolbar.tsx:141` `left-0 right-0`, `right-0` | refactor | `start-0 end-0`, `end-0` |
| `style.utils.ts:74` `data-[pinned=true]:before:left-0` | refactor | `data-[pinned=true]:before:start-0` |
| `style.utils.ts:136-142` pinned `left`/`right` from `getStart`/`getAfter` | refactor | `insetInlineStart`/`insetInlineEnd`; pixel values unchanged |
| `ST_TablePagination.tsx` `rtl:rotate-180` sites | keep | already CSS-only |

- `columnResizeDirection` stays the TanStack option for the drag sign (`useST_TableOptions.ts:123-124` default `'ltr'`); the Column Resizing guide already says to set it to `'rtl'` on RTL pages (`column-resizing.mdx:108`), no docs edit
- Does NOT read `document.dir` or add a direction option; does NOT touch shadcn parts

**Stays unchanged:** `columnResizeDirection` default, the pinned pixel math, the drag delta math.

#### 1.6.5 Theme-driven shadows

| Site | Status | Change |
| --- | --- | --- |
| `style.utils.ts:77` (radix 56) `shadow-[-4px_0_4px_-4px_rgba(97,97,97,0.5)_inset]` | refactor | `shadow-[-4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)_inset]` |
| `style.utils.ts:79` (radix 58) `shadow-[4px_0_4px_-4px_rgba(97,97,97,0.5)_inset]` | refactor | `shadow-[4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)_inset]` |
| `ST_BottomToolbar.tsx:23` `shadow-[inset_0_1px_2px_-1px_rgba(97,97,97,0.5)]` | refactor | `shadow-[inset_0_1px_2px_-1px_color-mix(in_oklab,var(--foreground)_15%,transparent)]` |
| `ST_TableHeadRow.tsx:22` `shadow-[4px_0_8px_rgba(0,0,0,0.1)]` | refactor | `shadow-[4px_0_8px_color-mix(in_oklab,var(--foreground)_10%,transparent)]` |

- Arbitrary-value form: underscores for spaces, no spaces inside the brackets, so Tailwind reads one candidate
- Gate: `check:tailwind` green on the four new shadow classes (a candidate `canonicalizeCandidates` rewrites or `candidatesToCss` drops is a failure)
- Same blur and offset values; only the color changes, so light mode looks the same and dark mode gains a visible shadow (D32) (F35)
- Does NOT touch `rounded-*` steps or `font-bold` (intent and MRT parity per F35), nor the base filter popover (spec 10, D28)

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `scripts/check-tailwind.mjs` | new | |
| package script `check:tailwind` | new | `node scripts/check-tailwind.mjs` |
| root script `check:tailwind` | new | `pnpm --filter shadcn-table check:tailwind` |
| `pr.yml` `library` job step | new | `pnpm --filter shadcn-table check:tailwind ${{ matrix.base }}` after `lint` (foundation) |
| coding-standards `## Gates` | refactor | one line `pnpm --filter shadcn-table check:tailwind   # canonical and logical Tailwind classes, every base` (foundation) |

**Stays unchanged:** `check-bases.mjs`, `lib.mjs`, `registry/<base>/index.css`, ESLint config.

**Usage:**

```sh
pnpm check:tailwind            # every base
pnpm --filter shadcn-table check:tailwind aria
```

### 1.7 Dependencies and env

- `@tailwindcss/node` `^4.3.3` and `@tailwindcss/oxide` `^4.3.3`: new devDependencies of `packages/shadcn-table` (already in the store at 4.3.3 through the docs app)
- `tailwindcss` and `@tailwindcss/vite` in `packages/shadcn-table` `dependencies` (`package.json:30,45`) from `^4.1.11` to `^4.3.3`: Storybook and the tests build with the package's Tailwind, and `scrollbar-thin` exists in 4.3.3 and not in 4.1.11; the docs app is on `^4.3.3` already
- All of it lands in the foundation (index, Run plan); this spec never touches `package.json` or the lockfile
- No env vars

## 2. Instructions for AI

### 2.1 Milestones

#### 2.1.1 Milestone 1: Class edits per file set

Lane: agent

- The foundation already provides `check:tailwind` (37 failures per base, 22 distinct, recorded as the baseline count in `trackers/02-tracker.md`), the 4.3.3 dependencies and the `reference/06-*` captures
- Per set A to D (index, Run plan): the 1.6.2, 1.6.4 and 1.6.5 rows whose files the set owns, edited once on `registry/base` and copied to `registry/radix` and `registry/aria`; the files listed in `base-diff.json` and `aria-diff.json` are hand-edited per base (radix `style.utils.ts:56,58`); `check:bases` at workstream end proves the copies
- Reviewer (workstream review) checks the three trees' changed lines against the 1.6.2 table, D31 (JS kept only for the drag sign and the pin pixels, `columnResizeDirection` untouched) and D32 (color only, blur and offset unchanged)
- Gates per set: `eslint --max-warnings 0 <own files>`, `prettier --check <own files>`

#### 2.1.2 Final milestone: Gates once

Lane: inline

- CHANGELOG lines from 1.6.1 in the `### Spec 06` block
- `check:tailwind` zero failures under both rules (the physical-class rule reported the 20 static sites plus the handle before the sets, zero after); `pnpm registry:build`; `lib:install` per base; `test:*` once, at workstream end
- Judged: Storybook captures per base in LTR with `reference/06-capture.mjs` (resize handle, pinned columns, toolbar, header shadows) next to `reference/06-*`, three judges on "same position, same visible shadow"; computed-style spot check: sticky header `z-index: 2` (`ST_TableHead.tsx:25`), empty body `min-height: 100px` (`ST_TableBody.tsx:180`)
- `Gates: see 02-tracker.md` in `../trackers/06-tracker.md`

### 2.2 Gates

- `pnpm check:tailwind` exits 0 for base, radix and aria, canonical and physical-class rules (D16) (D31)
- `grep -rn "rgba(" packages/shadcn-table/registry/*/components/ui/shadcn-table`: empty (D32)
- `pnpm --filter shadcn-table tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint` green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` green
- `pnpm check:bases` green; `pnpm registry:build` leaves `registry.json` unchanged
- `pnpm --filter shadcn-table-docs types:check`, `lint`, `build` green
- Spot check: computed `z-index: 2` on the sticky header and `min-height: 100px` on the empty body in each base
- `pr.yml` green, including the new `check:tailwind` step in each `library` matrix entry
