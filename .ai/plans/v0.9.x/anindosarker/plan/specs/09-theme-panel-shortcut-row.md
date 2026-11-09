# 09: One shortcut row in the theme panel
- Epic: E4

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The panel's shortcut controls are spread out: Undo (`P`) and Redo in the toolbar, Random (`R`) in the Presets row, the `C` hint under the preset select, and an icon-only Reset with a `⇧R` hint in the header that reads as nothing. D22 gathers the five into one row under the header, gives undo and redo the regular keys, and drops `P`.

### 1.2 Goals

- One row directly under the header holds Reset, Undo, Redo, Random, Next preset, each with its kbd hint: `Shift+R`, `Mod+Z`, `Mod+Shift+Z`, `R`, `C` (`Mod` is Cmd on macOS, Ctrl elsewhere; the label comes from the client platform through the formatter the F11 fix (D20) leaves in place) (D22).
- The header holds the title and the close button only; the Presets row holds the preset select only (D22).
- Labeled buttons when the row fits the panel width; icon buttons with a tooltip (label plus kbd hint) when it does not (D22). The row never overflows horizontally.
- Acceptance: programmatic. `pnpm test docs-e2e --base base /` green with the checks of 1.6.3: the row has the five buttons by accessible name, `ControlOrMeta+z` undoes, `ControlOrMeta+Shift+z` redoes, `p` changes nothing, `Shift+R` resets, the row's `scrollWidth` equals its `clientWidth`; `pnpm test typecheck --base radix`, `pnpm test lint` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── components/theme-customizer.tsx:126-142   ← SheetHeader: title, <Kbd>Shift+R</Kbd>, Reset icon button (RotateCcwIcon)
├── components/theme-customizer.tsx:144-168   ← toolbar row: (Copy, removed by spec 08), Undo + <Kbd>P</Kbd>, Redo
├── components/theme-customizer.tsx:273-295   ← Presets row: Random + <Kbd>R</Kbd>, preset select, "<Kbd>C</Kbd> picks another color preset."
├── components/theme-customizer.tsx:366-372   ← Kbd
├── components/design-system-provider.tsx:193-198 ← THEME_HOTKEYS { shuffle: 'R', reset: 'Shift+R', shuffleColorPreset: 'C', undo: 'P' }
├── components/design-system-provider.tsx:225-231 ← useHotkeys([...]) four entries, no redo
└── test/docs-e2e/lib/getting-started.mjs:282-306 ← presses r, p, r, Shift+R
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── components/theme-customizer.tsx       ← header: title, close; ShortcutRow under it; Presets row: select only
├── components/design-system-provider.tsx ← THEME_HOTKEYS with undo 'Mod+Z', redo 'Mod+Shift+Z'; five useHotkeys entries
└── test/docs-e2e/lib/getting-started.mjs ← the shortcut checks of 1.6.3
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 09 Theme panel: shortcut row, Mod+Z undo` under `## Unreleased` (D22).

#### 1.6.2 Shortcut row

`components/theme-customizer.tsx`, status `refactor`: a `ShortcutRow` rendered directly under `SheetHeader`, in the toolbar row's place.

- Five buttons in order: Reset (`RotateCcwIcon`), Undo (`Undo2Icon`, disabled when `!canUndo`), Redo (`Redo2Icon`, disabled when `!canRedo`), Random (`ShuffleIcon`), Next preset (`PaletteIcon`), each bound to `reset`, `undo`, `redo`, `shuffle`, `shuffleColorPreset` from `useDesignSystem()`.
- Each button's accessible name is its label; the hint is `format(THEME_HOTKEYS.<key>)` from `useFormatForDisplay`, the same formatter as today.
- Layout: the labeled form is a `Button variant="outline" size="sm"` with icon, label and `<Kbd>`; the compact form is `size="icon-sm"` with the icon only, wrapped in `Tooltip` (ui-radix `tooltip.tsx`, content: label and `<Kbd>`), and `aria-label` set to the label. The compact form is used when the labeled row overflows the panel's content width (the Sheet is 360 px, spec 04); the builder measures the labeled row once in the docs E2E check of 1.6.3 and switches to the compact form when `scrollWidth > clientWidth`. The outcome is one form at the panel's width; no runtime measurement.
- The header keeps `SheetTitle` and the sheet close only; the Reset button and its hint at `:132-141` move into the row.
- The Presets row keeps the preset select; Random (`:276-285`) and the `C` line (`:291-293`) move into the row.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `ShortcutRow` | new | five buttons, labeled or compact |
| header | refactor | title, close |
| toolbar row | delete | replaced by `ShortcutRow` |
| Presets row | refactor | select only |

**Stays unchanged:** Mode, the six selects, the tabs, `Kbd`, `Swatch`, `ThemeCustomizerTrigger`.

#### 1.6.3 Hotkeys and checks

- `components/design-system-provider.tsx`, status `refactor`: `THEME_HOTKEYS = { shuffle: 'R', reset: 'Shift+R', shuffleColorPreset: 'C', undo: 'Mod+Z', redo: 'Mod+Shift+Z' }`; `useHotkeys` gains the redo entry; the scope, `enabled` and the typing guard stay (D2). `P` is not bound.
- `test/docs-e2e/lib/getting-started.mjs`, status `refactor`, on `/` with the panel open: the row has buttons named Reset, Undo, Redo, Random, Next preset; `r` changes `--primary`; `ControlOrMeta+z` restores it; `ControlOrMeta+Shift+z` reapplies the shuffled value; `p` after a shuffle changes nothing; `Shift+R` returns to the default; the row's `scrollWidth === clientWidth`. The checks run on the shipped code first; the Redo, `p` and button-name checks fail there (P11).

**Interfaces:**

```typescript
export const THEME_HOTKEYS = {
  shuffle: 'R',
  reset: 'Shift+R',
  shuffleColorPreset: 'C',
  undo: 'Mod+Z',
  redo: 'Mod+Shift+Z',
} as const;
```

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Theme panel shortcut row

- Files owned: `apps/shadcn-table-docs/components/theme-customizer.tsx`, `apps/shadcn-table-docs/components/design-system-provider.tsx`, `test/docs-e2e/lib/getting-started.mjs`
- Depends on: Theme panel copy import
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test docs-e2e --base base /`
- Task 1: Reproduce: write the checks of 1.6.3, run `pnpm test docs-e2e --base base /` on the shipped code, record the red lines in the tracker (P11). Checks: the Redo, `p` and button-name checks fail
- Task 2: Hotkeys: `THEME_HOTKEYS` and the redo binding (1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`
- Task 3: `ShortcutRow`, header and Presets row (1.6.2); measure the labeled row, pick the form. Checks: `pnpm test docs-e2e --base base /` green
- Task 4: Cleanup: `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix` and `pnpm test lint` green
- `pnpm test docs-e2e --base base /` green: the theme checks of spec 04 as rewritten by 1.6.3
