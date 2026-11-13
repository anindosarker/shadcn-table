# 42: React Aria multi-select filter opens on click
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

On React Aria the multi-select filter's option list opens only on ArrowDown or on the chevron; a click into its input does nothing. Base UI and Radix open the list on that click. The run found it in the browser check of the live demo (Q68), and the docs E2E helper carries a workaround for it. D82: React Aria opens on click like the other two bases.

### 1.2 Goals

- On React Aria a click into the multi-select filter's input opens the option list (D82).
- Keyboard opening (ArrowDown), the chevron, typing to narrow and chip removal work as today.
- The docs E2E workaround is removed.
- Acceptance: programmatic. Play `MultiSelectOpensOnClick` in `stories/features/FilterChips.stories.tsx`: open a multi-select column's chip editor, click the combobox input once, assert an option is visible within 1000 ms with no key press. It passes on Base UI and Radix before the change, fails on React Aria before the change (P11, recorded) and passes on the three bases after. `pnpm test docs-e2e --base aria` green with the ArrowDown fallback removed from `liveDemoFilters`.

### 1.3 Current structure

```
packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx
  ├── isMultiSelectFilter branch (about :627-690)  ← <Combobox selectionMode="multiple" ...> with ComboboxChips, ComboboxChipList, ComboboxChipsInput, ComboboxTrigger, ComboboxContent
  ├── ComboboxChips onClick                        ← e.stopPropagation() only
  └── ComboboxChipsInput onKeyDown                 ← stopPropagation, then the user's onKeyDown
packages/shadcn-table/registry/aria/components/ui/combobox.tsx:248,326 ← ComboboxChips, ComboboxChipsInput (the shadcn React Aria part; passes props through to the React Aria ComboBox; no menuTrigger set)
packages/shadcn-table/registry/{base,radix}/.../ST_FilterTextField.tsx ← their comboboxes open on click; not changed
test/docs-e2e/lib/helpers.mjs:729-741             ← "A React Aria combobox opens its list on ArrowDown, not on a click": presses ArrowDown when no option shows
packages/shadcn-table/stories/features/FilterChips.stories.tsx:488 ← MultiSelectArrayModes (existing multi-select play)
```

### 1.4 Target structure

```
registry/aria/.../components/inputs/ST_FilterTextField.tsx ← the multi-select combobox opens its list when its input is clicked or focused by a click
stories/features/FilterChips.stories.tsx                  ← MultiSelectOpensOnClick
test/docs-e2e/lib/helpers.mjs                             ← the ArrowDown fallback and its comment removed
CHANGELOG.md (P9)                                         ← #### Spec 42 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 42 React Aria multi-select filter opens on click` under `## Unreleased`, `### Fixed` (D82).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-aria/`.

#### 1.6.2 Open on click (D82)

`registry/aria/.../components/inputs/ST_FilterTextField.tsx`, status `refactor`.

- The multi-select `<Combobox>` opens on a click into its input through React Aria's own mechanism: the ComboBox `menuTrigger="focus"` prop (the list opens when the input takes focus, which a click does), passed on the `Combobox` of this branch. Before choosing it the builder reads the React Aria ComboBox documentation for the installed `react-aria-components` version and records the prop and its behaviour in the tracker; if `menuTrigger` does not reach the primitive through the shadcn part, the prop is passed through the part's existing props and the part file is not edited.
- The chip editor focuses the filter input when it opens (`initialFocus`, `focusFilterInput`): the play asserts the list's state right after the editor opens and records it; if focus on open also opens the list, that is accepted (Base UI and Radix behaviour is compared in the same play and recorded).
- Does NOT edit `registry/aria/components/ui/combobox.tsx` (a stock shadcn part), the autocomplete branch, or Base UI and Radix.

#### 1.6.3 Docs E2E helper

`test/docs-e2e/lib/helpers.mjs`, status `refactor`.

- In `liveDemoFilters`, the Status case clicks the combobox and picks `Suspended`; the `ArrowDown` fallback and its two comment lines go.

**Stays unchanged:** every other filter variant, `ST_FilterChips.tsx`, the React Aria ui parts.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

#### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: React Aria multi-select opens on click)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`, `test/docs-e2e/lib/helpers.mjs`
- Depends on: 41
- Review: none
- Local CI: `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`, `pnpm test docs-e2e --base aria`
- Task 1: The play first (P11): passes on Base UI and Radix, fails on React Aria before the change; record the three results. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Multi Select Opens On Click"`
- Task 2: The fix (1.6.2) and the helper (1.6.3). Checks: the play passes on the three bases; `MultiSelectArrayModes` passes on React Aria; `pnpm test typecheck --base aria`
- Task 3: Regenerate (`pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- The Local CI lines green
- `MultiSelectOpensOnClick` on the three bases, with the React Aria failure before the change recorded
- Review: none (one prop on one base, proven by the play; P7 untouched)
