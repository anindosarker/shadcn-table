# 43: Escape closes the filter editor after a select pick
- Epic: E12

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

In the chips mode a filter's value editor is a popover. After a value is picked in a select filter, Escape closes the editor on Radix but leaves it open on Base UI and React Aria; on React Aria the open editor also blocks the Clear filters button until a click outside (Q69, the run's browser check of the live demo). From the code: the filter inputs stop Escape from bubbling to the popover, and `closeOnEscape` closes the editor in the capture phase only when the event target is an `HTMLInputElement`; after a select pick the focus sits on the select trigger, a button, so neither path closes the editor. D83: Escape closes the editor on Base UI and React Aria as on Radix, and Clear filters stays clickable.

### 1.2 Goals

- After a value is picked in a select filter inside the chip editor, one Escape closes the editor on the three bases (D83).
- Escape pressed while the select's own option list is open closes that list only; the next Escape closes the editor.
- With a chip editor open, one click on Clear filters clears the filters and removes the chips on the three bases (D83).
- Escape in a text filter input closes the editor as today.
- Acceptance: programmatic. Plays in `stories/features/FilterChips.stories.tsx`: `EscapeClosesEditorAfterSelectPick` (open a select column's chip editor, pick an option, press Escape once: the editor is gone and the chip shows the value) and `ClearFiltersClickableWithEditorOpen` (open a chip editor, click Clear filters once: no chip remains and all rows show). Before the change (P11, recorded per base): the first fails on Base UI and React Aria and passes on Radix; the second fails on React Aria. After: both pass on the three bases.

### 1.3 Current structure

Paths under `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/`.

```
components/toolbar/ST_HeaderFilterEditor.tsx:29-38 (base; aria :33-42) ← closeOnEscape: closes only when event.key === 'Escape' && event.target instanceof HTMLInputElement
components/toolbar/ST_FilterChips.tsx:120,205     ← PopoverContent onKeyDownCapture={closeOnEscape(...)} (chip editor, picker)
components/toolbar/ST_HeaderFilterEditor.tsx:94   ← the same on the header editor
components/inputs/ST_FilterTextField.tsx:414-417  ← inputs: onKeyDown stopPropagation
components/inputs/ST_FilterTextField.tsx (select branch) ← SelectTrigger onKeyDown: e.stopPropagation(), then the user's onKeyDown (base about :556-561, aria about :598-603, radix :549-551)
components/toolbar/ST_FilterChips.tsx:345-355     ← the Clear filters button: clearFilterChips(table)
registry/radix/...                                ← closes on Escape today; its files are not changed unless the play shows a regression
```

- Why Radix closes and the other two do not is not read from the code; Task 1 records, per base, where focus sits after the pick and which element handles Escape.
- Why Clear filters is blocked on React Aria is not known from the code (a React Aria popover may render an underlay or mark the outside inert); Task 1 records what the click hits.

### 1.4 Target structure

```
components/toolbar/ST_HeaderFilterEditor.tsx (base, aria) ← closeOnEscape also closes when Escape comes from the select trigger with its list closed
components/inputs/ST_FilterTextField.tsx (base, aria)     ← only if the trigger's own handler must let the capture handler act (the cause found in Task 1)
components/toolbar/ST_FilterChips.tsx (base, aria)        ← only if the Clear filters fix sits in the popover's props (the cause found in Task 1)
stories/features/FilterChips.stories.tsx                  ← the two plays
CHANGELOG.md (P9)                                         ← #### Spec 43 under ### Fixed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 43 Escape closes the filter editor after a select pick` under `## Unreleased`, `### Fixed`: Escape and Clear filters with an open filter editor (D83).
- Generated (P9): `registry.json`, `apps/shadcn-table-docs/components/ui-base/`, `ui-aria/`.

#### 1.6.2 Escape (D83)

- `closeOnEscape` treats every focusable control of the filter field as its input: an Escape whose target is inside the editor and is an input or the select trigger closes the editor, unless that control's own popup (the select or combobox list) is open, in which case the popup takes the Escape. The check for an open popup reads the control's own state attribute (`aria-expanded="true"` on the trigger), not a timer.
- The fix sits at the root: no second key listener on `document`, no delayed close.

#### 1.6.3 Clear filters with an open editor (D83)

- The record of Task 1 names what swallows the click on React Aria. The fix makes the chip editor a non-modal popover there, in the popover's own props at the three call sites if the React Aria popover part offers it, so that one click outside both closes the editor and reaches the button, as on Base UI and Radix. The builder reads the React Aria Popover documentation for the installed version and records the prop used.
- Does NOT edit `registry/aria/components/ui/popover.tsx` or any other stock ui part, and does NOT change `clearFilterChips`.

**Stays unchanged:** Radix files (unless a play regresses there), `ST_FilterEditor.tsx`, `ST_GlobalFilterTextField.tsx`, the header popover display mode.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

#### Work, in milestone `Filter editor fixes` of spec 41 (was milestone: Escape closes filter editor)

Regrouped 2026-11-13 by the lead: this spec's work runs as a task of the milestone `Filter editor fixes` (spec 41), which owns the files; the regenerate, format and Local CI steps run once there. The lines below describe the work only.

- Files owned: `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_HeaderFilterEditor.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/inputs/ST_FilterTextField.tsx`, `packages/shadcn-table/registry/base/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/registry/aria/components/ui/shadcn-table/components/toolbar/ST_FilterChips.tsx`, `packages/shadcn-table/stories/features/FilterChips.stories.tsx`
- Depends on: 42
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria`
- Task 1: The two plays first (P11) on the three bases and the per-base record: focus target after the pick, the element that handles Escape, what a click on Clear filters hits on React Aria. Checks: `ST_BASE=<base> pnpm exec vitest run stories/features/FilterChips.stories.tsx -t "Escape Closes Editor After Select Pick"` and `-t "Clear Filters Clickable With Editor Open"` fail and pass as 1.2 states
- Task 2: The fixes of 1.6.2 and 1.6.3. Checks: both plays pass on the three bases; `RemoveAndClear` and `SelectClearBesideChevron` pass; `pnpm test typecheck --base <base>`
- Task 3: Regenerate (`pnpm lib:install base`, `pnpm lib:install aria`, `pnpm registry:build`), `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test typecheck --base radix`, `pnpm test typecheck --base aria`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test storybook-tests --base base`, `pnpm test storybook-tests --base radix`, `pnpm test storybook-tests --base aria` green
- The two plays on the three bases with the before-the-change results recorded per base
- Review: none (keyboard handling of one popover, proven by plays; P7 untouched)
