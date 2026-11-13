# 44: React Aria select filter chevron at the right end

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On the live 0.9.3 Filter Variants example with React Aria, the City filter (mode equals) shows its chevron right after the placeholder "Filter by City", in the middle of the input, not at the input's right end (Q75, owner's screenshot). On Base UI and Radix the chevron sits at the right end. From the code: the React Aria `SelectTrigger` is `flex w-full items-center justify-between`, so its chevron sits at the trigger's right end; the trigger is as wide as its parent, the React Aria `Select` root element, which carries no width class inside the filter's input group. D87: the chevron sits at the input's right end, as on the other two bases.

### 1.2 Goals

- On React Aria the select filter's chevron sits at the right end of its input, with and without a value, in the chip editor, the subheader row and the popover mode (D87).
- With a value, the chevron stays clear of the overlaid clear button (the existing `ltr:pr-9 rtl:pl-9` rule).
- Acceptance: programmatic. Play `SelectChevronAtInputEnd` in `stories/features/FilterChips.stories.tsx`: open a select column's chip editor with no value; the chevron icon's right edge is within 12 px of the input group's right edge. It passes on Base UI and Radix before the change, fails on React Aria before the change (P11, recorded with the measured distance) and passes on the three bases after. `SelectClearBesideChevron` still passes on the three bases.

### 1.3 Current structure

```
packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
  └── isSelectFilter branch (about :580-626) ← <Select aria-label placeholder value onChange> (no className) wrapping <SelectTrigger className="w-full flex-1 rounded-none border-0 ..."> and <SelectValue />
packages/shadcn-table/registry/aria/components/ui/select.tsx:57-77  ← SelectValue: 'flex flex-1 text-left'
packages/shadcn-table/registry/aria/components/ui/select.tsx:79-101 ← SelectTrigger: 'flex w-full items-center justify-between gap-1.5 ...', the ChevronDownIcon after its children
packages/shadcn-table/registry/base/.../ST_FilterTextField.tsx:540-562 ← Base UI: the trigger is a direct child of the InputGroup, 'w-full flex-1'
packages/shadcn-table/stories/features/FilterChips.stories.tsx:552 ← SelectClearBesideChevron
```

- Task 1 confirms in a browser which element is narrower than the input group (the `Select` root is the expected one) and records its measured width.

### 1.4 Target structure

```
registry/aria/.../components/inputs/ST_FilterTextField.tsx ← the Select root of the filter field spans the input group (a width class on the Select of this branch)
stories/features/FilterChips.stories.tsx                  ← SelectChevronAtInputEnd
CHANGELOG.md (P9)                                         ← #### Spec 44 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 44 React Aria select filter chevron` under `## Unreleased`, `### Fixed` (D87).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-aria/`.

#### 1.6.2 Width (D87)

`registry/aria/.../components/inputs/ST_FilterTextField.tsx`, status `refactor`.

- The `Select` of the select branch gets the classes that make it fill the input group (`w-full min-w-0 flex-1`), so the trigger's `w-full` resolves against the whole field and its `justify-between` puts the chevron at the end. If the record of Task 1 names another element, the class goes on that element in this file.
- Does NOT edit `registry/aria/components/ui/select.tsx` (a stock shadcn part), the multi-select branch, or Base UI and Radix.

**Stays unchanged:** every other file.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: React Aria select filter chevron

- Files owned: `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`
- Depends on: 43
- Review: none
- Local CI: `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The play first (P11) and the browser record of the narrow element on React Aria. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Select Chevron At Input End"` passes on base and radix, fails on aria with the distance recorded
- Task 2: The class (1.6.2). Checks: the play and `SelectClearBesideChevron` pass on the three bases; one screenshot of the React Aria City editor, path in the tracker
- Task 3: Regenerate (`pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- The Local CI lines green
- `SelectChevronAtInputEnd` on the three bases, with the React Aria failure before the change recorded
- Review: none (one class on one base; P7 untouched)
