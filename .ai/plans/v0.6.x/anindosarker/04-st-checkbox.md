# 04: ST_Checkbox

## 1. Architecture

### 1.1 Overview

Radix and Base UI ship a forked `components/ui/checkbox.tsx` (dash for the indeterminate state) under shadcn's own file name, replacing the user's checkbox across their app; React Aria draws the same dash inline in `ST_SelectCheckbox.tsx` without a fork. Decision 6: one library-owned `ST_Checkbox` per edition, the part untouched, `forkedUi` gone. Depends on part 03 (the restore goes through the fixed `add-part`).

### 1.2 Goals

- `forkedUi` absent from every `registry.ts` and from `lib.mjs`; `checkbox` is a `registryDependency` on all three editions
- `pnpm add-part radix checkbox` and `pnpm add-part base checkbox` leave no diff
- The select-all header and partially selected parent rows draw the dash on all three editions, as before

### 1.3 Current structure

```
registry/<edition>/components/ui/
├── checkbox.tsx                          ← radix, base: fork (MinusIcon, indeterminate classes); aria: upstream
└── shadcn-table/
    ├── ST_Tooltip.tsx                    ← library wrapper over the tooltip part (the precedent)
    ├── types.ts                          ← CheckboxProps = ComponentPropsWithRef<typeof Checkbox>
    └── components/inputs/
        ├── ST_SelectCheckbox.tsx         ← radix, base: `checked="indeterminate"`; aria: inline wrapper (classes, hidden indicator, MinusIcon children)
        └── ST_FilterCheckbox.tsx         ← plain Checkbox
```

### 1.4 Target structure

```
registry/<edition>/components/ui/
├── checkbox.tsx                          ← upstream on all three (radix, base restored by add-part)
└── shadcn-table/
    ├── ST_Checkbox.tsx                   ← wrapper: part + indeterminate styling + dash
    ├── ST_Tooltip.tsx
    ├── index.ts                          ← exports ST_Checkbox beside ST_Tooltip
    ├── types.ts                          ← CheckboxProps = ComponentPropsWithRef<typeof ST_Checkbox>
    └── components/inputs/
        ├── ST_SelectCheckbox.tsx         ← renders ST_Checkbox; aria's inline wrapper moves out
        └── ST_FilterCheckbox.tsx         ← renders ST_Checkbox
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `registry/{radix,base}/registry.ts`: `forkedUi` removed; `lib.mjs` and `lib.d.mts` drop the field, `registryDependencies` is computed from the core files alone; `registry.json` rebuilt (`checkbox` appears in `registryDependencies` of `shadcn-table` and `shadcn-table-base`, the file leaves `files`).
- `registry/{radix,base}/components/ui/checkbox.tsx`: restored with `pnpm add-part <edition> checkbox` (part 03's script). No hand edit.
- `scripts/registry/base-diff.json`, `aria-diff.json`: `ST_Checkbox.tsx` and the touched inputs listed where the editions differ (the part import and the indeterminate prop differ per edition).
- Docs app installed copies (`components/ui-<edition>/`) reinstalled through `scripts/install.mjs`; the docs `checkbox.tsx` copies become upstream.
- `CHANGELOG.md` `## Unreleased`, `### Fixed`: the Radix UI and Base UI items no longer replace the project's `components/ui/checkbox.tsx`; the dash moves into the library.
- `docs/code-of-conduct/coding-standards.md` Editions bullet: the `forkedUi` sentence and the `checkbox` clause removed; "parts are never edited" with no exception.

#### 1.6.2 `ST_Checkbox`

Library-owned wrapper, one file per edition, same shape on all three.

- Renders the edition's `Checkbox` part untouched, forwarding every prop (`ComponentPropsWithRef<typeof Checkbox>`; no new props: radix signals indeterminate with `checked="indeterminate"`, base with `indeterminate`, aria with `isIndeterminate`, each already in the part's props).
- Adds the indeterminate fill through `className` (`data-[state=indeterminate]:*` on radix, `data-indeterminate:*` on base and aria: `border-primary bg-primary text-primary-foreground`, dark variant), hides the part's check in that state (`[&_[data-slot=checkbox-indicator]_svg]:hidden` under the same variant) and draws `MinusIcon` (`lucide-react`, `size-3.5`) over the box: a `relative inline-flex` span around the part with the icon absolutely centred, `pointer-events-none`, rendered only when the indeterminate prop is set. On aria the icon may instead go through the part's children render prop, as `ST_SelectCheckbox` does today; the agent picks whichever keeps the three files closest.
- Does NOT reimplement the primitive, does NOT touch `components/ui/checkbox.tsx`, does NOT change the hit area or focus ring the part defines.

**Operations:**

| Operation | Status | Notes |
| --------- | ------ | ----- |
| `ST_Checkbox` | new | exported from `index.ts` |
| `CheckboxProps` (`types.ts`) | refactor | typed from `ST_Checkbox` |
| `ST_SelectCheckbox` | refactor | imports `ST_Checkbox`; aria's inline classes and `composeRenderProps` block move into the wrapper |
| `ST_FilterCheckbox` | refactor | imports `ST_Checkbox` |

**Stays unchanged:** `stSelectCheckboxProps`, `stSelectAllCheckboxProps`, `stFilterCheckboxProps` option types and behaviour; the `RadioGroupItem` single-select branch.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Phases

#### 2.1.1 Phase 1: wrapper

- 1.6.2 on radix first, then base and aria; stories `features/Selection*` and the expanding stories render the dash in all three editions (`pnpm storybook:test` per edition or the vitest browser run `check-storybook.mjs` uses)

#### 2.1.2 Phase 2: unfork

- 1.6.1: `forkedUi` out, `add-part` restore, `registry:build`, docs copies reinstalled

#### 2.1.3 Final phase: docs and gates

- 1.6.1 changelog and standards; 2.2; CI-only PR into `claude/review`

### 2.2 Gates

- `pnpm add-part radix checkbox && pnpm add-part base checkbox && git status --short` prints nothing
- `grep -rn forkedUi packages/shadcn-table` prints nothing
- `tsc:radix`, `tsc:baseui`, `tsc:aria` 0 errors; `lint` clean; `check:bases` green; `registry:build` green; story tests green per edition
- `pr.yml` green on the PR (the five install scenarios cover `checkbox` arriving as a registryDependency)
