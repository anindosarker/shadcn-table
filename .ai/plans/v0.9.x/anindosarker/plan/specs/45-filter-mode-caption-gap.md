# 45: Filter Mode caption gap

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Under a filter input the library shows a caption "Filter Mode: <mode>" when filter modes are on and the display mode is not chips. Its top margin is `mt-0.75` (3 px), which the owner found too tight on the live popover filters example (Q71). D85: the margin becomes `mt-1.5` (6 px); the line height and every other class stay.

### 1.2 Goals

- The caption's top margin is 6 px in the nine places that render it: text field, range fields and range slider on Base UI, Radix and React Aria (D85).
- `leading-[0.8rem]` and the other caption classes are unchanged (D85).
- Acceptance: programmatic. `grep -rn "mt-0.75 block text-xs" packages/shadcn-table/registry/*/components/ui/shadcn-table/components/inputs` prints nothing; `grep -rc "mt-1.5 block text-xs leading-\[0.8rem\] whitespace-nowrap text-muted-foreground" packages/shadcn-table/registry/*/components/ui/shadcn-table/components/inputs | awk -F: '{s+=$2} END {print s}'` prints 9. Reference (P10): a capture of the popover filters story on `claude/review` before the change next to one after, per base, paths in the tracker; the caption sits 3 px lower and nothing else moves.

### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/inputs/`.

```
ST_FilterTextField.tsx:662 (base), :646 (radix), :705 (aria)   ← <label className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
ST_FilterRangeFields.tsx:60 (the three bases, identical file)   ← <p className="mt-0.75 block text-xs leading-[0.8rem] whitespace-nowrap text-muted-foreground">
ST_FilterRangeSlider.tsx:138 (base), :128 (radix), :146 (aria)  ← the same <p>
```

- `components/head/ST_TableHeadCellFilterContainer.tsx:72` (base, radix) and `:90` (aria) carry `pt-0.75 -mt-0.75` for the subheader collapse; that is another rule and stays.

### 1.4 Target structure

```
the nine lines of 1.3      ← mt-1.5 in place of mt-0.75
CHANGELOG.md (P9)          ← #### Spec 45 under ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 45 Filter Mode caption gap` under `## Unreleased`, `### Changed`: the caption sits 6 px under the filter input (D85).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-<base>/`.

#### 1.6.2 Caption margin (D85)

- In each of the nine lines `mt-0.75` becomes `mt-1.5`. Nothing else in the class list or the markup changes.
- Does NOT touch `ST_TableHeadCellFilterContainer.tsx`.

**Stays unchanged:** every other file; no story changes (no behaviour changes, so no new play).

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Filter Mode caption gap

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeFields.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/radix/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterRangeSlider.tsx`
- Depends on: 44
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: Capture the popover filters story with a filter popover open on `claude/review` before the change, per base; change the nine lines; capture again. Checks: the two `grep` lines of 1.2; the capture paths in the tracker
- Task 2: Regenerate (`pnpm lib:install` per base, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- The `grep` lines of 1.2; the before and after captures per base
- Review: none (one class value in nine lines the owner approved; P7 untouched)
