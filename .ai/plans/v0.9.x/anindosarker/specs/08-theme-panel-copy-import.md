# 08: Copy and Import leave the theme panel

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The theme panel (spec 04) carries a Copy menu (Copy CSS, Copy preset code) in its toolbar and an Import popover (paste a shadcn preset code) in its Presets row. D21 removes both, with the preset-code codec they share: nothing else in the docs reads or writes a preset code.

### 1.2 Goals

- The panel has no Copy and no Import control; Undo, Redo, Mode, the selects, Random, the preset select and the tabs stay (D21).
- `encodeConfig`, `decodeConfig` and `importPreset` are gone; no importer left.
- Acceptance: programmatic. `pnpm test docs-e2e --base base /` green with the panel check of 1.6.3 (no button named Copy or Import inside the dialog); `pnpm test typecheck --base radix` (docs `types:check`), `pnpm test lint` green; `grep -rn "encodeConfig\|decodeConfig\|importPreset\|CopyMenu\|ImportPreset" apps/shadcn-table-docs` empty.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── components/theme-customizer.tsx:146          ← <CopyMenu config={config} /> in the toolbar row
├── components/theme-customizer.tsx:275          ← <ImportPreset /> in the Presets row
├── components/theme-customizer.tsx:490-519      ← CopyMenu (DropdownMenu: Copy CSS = buildThemeCss, Copy preset code = encodeConfig)
├── components/theme-customizer.tsx:522-576      ← ImportPreset (Popover, text field, Apply calls importPreset)
├── components/design-system-provider.tsx:185-191 ← importPreset(code): decodeConfig, setConfig
├── components/design-system-provider.tsx:208,304 ← importPreset in the context type and value
├── lib/design-system/config.ts:499-530          ← encodeConfig, decodeConfig (shadcn/preset codec)
└── lib/design-system/config.ts:4-10             ← decodePreset, encodePreset, isPresetCode, V1_CHART_COLOR_MAP imports
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── components/theme-customizer.tsx       ← toolbar row: Undo, Redo; Presets row: Random, the preset select; CopyMenu and ImportPreset deleted
├── components/design-system-provider.tsx ← context without importPreset
└── lib/design-system/config.ts           ← no preset-code codec; `PresetConfig` type import stays (DesignSystemConfig fields)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 08 Theme panel: Copy and Import removed` under `## Unreleased` (D21).
- `apps/shadcn-table-docs/package.json`: unchanged; `shadcn` stays a dependency (`shadcn/preset` still supplies `PresetConfig` and the option lists in `config.ts`).

#### 1.6.2 Panel

`components/theme-customizer.tsx`, status `refactor`.

- The toolbar row renders Undo and Redo only (spec 09 reshapes this row; this spec only removes Copy).
- The Presets row renders Random and the preset select only.
- `CopyMenu`, `ImportPreset`, their imports (`DropdownMenu*`, `ClipboardIcon`, `UploadIcon`, `Popover*` where no other use remains) are deleted.

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `CopyMenu` | delete | `:490-519` |
| `ImportPreset` | delete | `:522-576` |
| toolbar row | refactor | Undo, Redo |
| Presets row | refactor | Random, preset select |

**Stays unchanged:** header, Mode, the six selects, the tabs and their contents, `ThemeCustomizerTrigger`, `Kbd`, `Swatch`.

#### 1.6.3 Provider and config

- `components/design-system-provider.tsx`, status `refactor`: `importPreset` function, its context-type member and its value entry removed; nothing else.
- `lib/design-system/config.ts`, status `refactor`: `encodeConfig`, `decodeConfig` and the `MARK: Preset codes` block removed, with the now-unused `decodePreset`, `encodePreset`, `isPresetCode`, `V1_CHART_COLOR_MAP` imports; `PresetConfig` stays.
- Docs E2E, `test/docs-e2e/lib/getting-started.mjs`, status `refactor`: the `panel` check also asserts `dialog.getByRole('button', { name: /^(Copy|Import)$/ })` counts 0.

**Stays unchanged:** `buildThemeCss`, `normalizeConfig`, storage, `designSystemScript`, hotkeys, history.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Theme panel copy import

- Files owned: `apps/shadcn-table-docs/components/theme-customizer.tsx`, `apps/shadcn-table-docs/components/design-system-provider.tsx`, `apps/shadcn-table-docs/lib/design-system/config.ts`, `test/docs-e2e/lib/getting-started.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test docs-e2e --base base /`
- Task 1: Reproduce: add the Copy and Import assertion to the `panel` check (1.6.3), run `pnpm test docs-e2e --base base /` on the shipped code, record the red line in the tracker (P11). Checks: the panel check fails
- Task 2: Remove `CopyMenu`, `ImportPreset`, `importPreset`, `encodeConfig`, `decodeConfig` and their imports (1.6.2, 1.6.3). Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 3: Cleanup: the grep of 1.2 empty, `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix` and `pnpm test lint` green
- `pnpm test docs-e2e --base base /` green: the theme checks, the panel check with the new assertion
- `grep -rn "encodeConfig\|decodeConfig\|importPreset\|CopyMenu\|ImportPreset" apps/shadcn-table-docs` prints nothing
