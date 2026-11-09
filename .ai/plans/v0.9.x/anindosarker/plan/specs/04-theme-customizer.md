# 04: Theme customizer panel
- Epic: E2

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The docs palette button opens a six-preset dropdown (`components/theme-preset-switcher.tsx:95-131`) backed by six static CSS files and a `data-theme` attribute. D2 replaces the dropdown with a right-side customizer panel holding the next-app design system (`test-projects/next-app/lib/design-system/*`, `components/design-system-provider.tsx`, `components/theme-controls.tsx:105-310`): 42 tweakcn palettes plus the current Emerald look as `Default`, style, base color, theme, chart color, fonts, radius, menus, preset codes, and three things next-app lacks: per-token color editing, undo and redo, and a stored choice that expires after 2 days. Shortcuts run through TanStack Hotkeys with kbd hints. The docs nav and home nav keep mounting `ThemeControls` where they do today, so no nav file changes.

### 1.2 Goals

- The palette button in both navs opens a right-side panel; the mode toggle beside it stays (D2).
- Panel, top to bottom: header (title, Reset, close); Copy, Undo, Redo; Mode; Style; Icon Library (Lucide, fixed); Base Color; Theme; Menu Color; Menu Accent; Presets (Import, Random, select: Default plus 42 palettes); tabs Colors, Typography, Other (D2).
- A fresh visitor sees the Emerald look; a stored choice applies before first paint and is dropped after 2 days (D2).
- `r` shuffle, `Shift+R` reset, `c` shuffle the color preset, `p` undo; off while typing or while the search dialog is open; each shown as a kbd hint (D2).
- The home theme demo keeps cycling presets through the new API (D2).
- Acceptance: programmatic. The docs E2E checks of 1.6.8 pass on `/` (`pnpm test docs-e2e --base base /`): default tokens equal `themes/emerald.css` with empty storage and with a stale entry; the panel opens with its sections; `r` changes `--primary`, `p` restores it, `Shift+R` returns to the default; a token edit changes the computed variable. `pnpm test typecheck --base radix` (docs `types:check`), `pnpm test lint`, `pnpm test validate-repo` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── components/theme-preset-switcher.tsx:22-67,83-133 ← store, applyThemePreset, the dropdown
├── components/theme-controls.tsx:13-37    ← pill: ThemePresetSwitcher + ModeToggle (next-themes)
├── lib/theme-presets.ts                   ← 6 presets, STORAGE_KEY 'st-theme', RANDOMIZE flag
├── themes/{amber,blue,emerald,mono,rose,violet}.css ← :root[data-theme=n] (light :4, dark :38), 32 tokens
├── app/global.css:7-12,77-144             ← @import themes; neutral :root and .dark fallback
├── app/layout.tsx:36-41,54,62             ← themePresetScript (pre-paint), RootProvider dark default
├── lib/layout.shared.tsx:36, components/dev-home/v12/nav.tsx:63 ← mount ThemeControls (unchanged)
├── components/theme-demo/variants/no-step-3.tsx:6-14,74-88,200-204 ← cycles the 6 presets, observes data-theme
├── components/theme-demo/variants/matches.tsx:69-74, dev-home/v12/dune.tsx:158-165 ← observe data-theme
├── components/posthog-provider.tsx:26     ← useSearchContext().open (the search dialog state)
└── components/ui-radix/                   ← dialog, tabs, popover, select, input-group, field; no sheet
test-projects/next-app/ (read-only source, D34)
├── lib/design-system/config.ts (620), color-presets.ts (3001, 42 palettes), themes.ts (1091), fonts.ts (224)
├── components/design-system-provider.tsx (233): storage, applyToDocument, shuffle, keydown r and c
├── components/theme-controls.tsx:105-310  ← CustomizePopover controls
└── styles/style-{vega,nova,lyra,maia,mira,luma,rhea,sera}.css
```

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── lib/design-system/
│   ├── config.ts            ← ported: STYLES, BASE_COLORS, FONTS, RADII, MENU_*, DesignSystemConfig + overrides, DEFAULT_CONFIG, buildThemeCss, STORAGE_KEY 'st-design-system', STORAGE_TTL_MS, designSystemScript
│   ├── color-presets.ts     ← ported 42 palettes (Apache-2.0 header kept) plus `default` (Emerald) first
│   ├── themes.ts, fonts.ts  ← ported as is
│   ├── tokens.ts            ← TOKENS (the 32 names of themes/emerald.css), token helpers
│   └── history.ts           ← past and future stacks for undo and redo
├── components/design-system-provider.tsx ← ported: store, applyToDocument, hotkeys, history, expiry
├── components/theme-customizer.tsx       ← the Sheet panel (D2 layout), ThemeCustomizerTrigger (palette button)
├── components/theme-controls.tsx         ← pill: ThemeCustomizerTrigger + ModeToggle
├── components/ui-radix/sheet.tsx         ← `pnpm add-part radix sheet`
├── styles/style-*.css                    ← ported 8 style layers
├── app/global.css                        ← theme imports removed, style imports added, fallback tokens kept
├── app/layout.tsx                        ← designSystemFontVariables, DesignSystemProvider, InlineScript(designSystemScript)
├── components/theme-demo/variants/no-step-3.tsx ← DEMO_PRESETS cycle through useDesignSystem
├── components/theme-demo/variants/matches.tsx, dev-home/v12/dune.tsx ← observe data-design-system
└── (deleted) components/theme-preset-switcher.tsx, lib/theme-presets.ts, themes/*.css
test/docs-e2e/lib/getting-started.mjs    ← the `/` theme checks (1.6.8)
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `apps/shadcn-table-docs/package.json` and `pnpm-lock.yaml`: `@tanstack/react-hotkeys` added (P6: this milestone owns both for E2). `shadcn` (preset codec) and `next-themes` are present.
- `CHANGELOG.md` (P9): `#### Spec 04 Theme customizer` under `## Unreleased` (D2).
- `components/ui-radix/sheet.tsx` from `pnpm add-part radix sheet`; `git status` clean after `pnpm add-part radix --all`.

#### 1.6.2 Design system core (port)

`lib/design-system/config.ts`, `color-presets.ts`, `themes.ts`, `fonts.ts`, `styles/style-*.css` copied from next-app with the docs' paths; status `new`.

- `COLOR_PRESETS` gains `{ name: 'default', label: 'Default', light, dark }` first, its values read from `themes/emerald.css` (light `:4-37`, dark `:38-70`), so `findColorPreset('default')` is the Emerald look.
- `DEFAULT_CONFIG`: `style: 'nova'`, `baseColor: 'neutral'`, `theme: 'neutral'`, `chartColor: 'neutral'`, `font: 'inter'`, `fontHeading: 'inherit'`, `radius: 'default'`, `menuAccent: 'subtle'`, `menuColor: 'default'`, `iconLibrary: 'lucide'`, `colorPreset: 'default'`, `overrides: { light: {}, dark: {} }` (matches `components.json`: radix-nova, neutral, lucide).
- `DesignSystemConfig.overrides`: `Partial<Record<Token, string>>` per mode; `buildThemeCss` applies them after the preset and theme variables.
- Storage: `STORAGE_KEY = 'st-design-system'`, value `{ config, css, savedAt }`; `STORAGE_TTL_MS = 2 * 24 * 60 * 60 * 1000`; `readStoredConfig` and `designSystemScript` ignore and remove an entry older than the TTL or without `savedAt`. The script still removes the old `st-theme` key.
- Does NOT keep `RANDOMIZE_DEFAULT_THEME` or any random pick on load.

**Interfaces:**

```typescript
export type Token = (typeof TOKENS)[number]; // 'background' | 'foreground' | ... | 'sidebar-ring'
export interface DesignSystemConfig { /* next-app fields */ overrides: { light: Partial<Record<Token, string>>; dark: Partial<Record<Token, string>> } }
export interface StoredDesignSystem { config: DesignSystemConfig; css: string; savedAt: number }
```

#### 1.6.3 Provider (port plus history and hotkeys)

`components/design-system-provider.tsx`, status `new`, from next-app's file.

- `useDesignSystem()` returns `{ config, setConfig, reset, shuffle, shuffleColorPreset, undo, redo, canUndo, canRedo, setToken, importPreset }`.
- `history.ts`: `setConfig` pushes the previous config on `past` and clears `future`; `undo` and `redo` move between them; capped at 50 entries; `reset` is a normal `setConfig(DEFAULT_CONFIG)` so `p` undoes it.
- Hotkeys through `@tanstack/react-hotkeys` in one scope `theme`: `r` shuffle, `Shift+R` reset, `c` shuffleColorPreset, `p` undo; `enabled` is false while `isTypingTarget(document.activeElement)` (input, textarea, contenteditable, select) or `useSearchContext().open` from `fumadocs-ui/contexts/search` is true. The library's key formatter gives the kbd labels. Does NOT keep next-app's plain `keydown` listener or its `d` toggle.
- `applyToDocument` as next-app: `style-<name>` class, `data-design-system`, the `<style id="design-system-theme-vars">` element, `data-menu-color` and `data-menu-accent` attributes on `<html>`; writes `savedAt` on every store.
- Does NOT regenerate the docs primitives; if the menu color or accent has no visible effect on the docs menus (the docs `ui-radix` parts carry no `cn-menu-target` hook), the builder records that under the tracker's `## Attention` and leaves the controls in place.

#### 1.6.4 Panel

`components/theme-customizer.tsx`, status `new`: `ThemeCustomizerTrigger` (the palette icon button, same place and look as today's trigger at `theme-preset-switcher.tsx:85-93`) and `ThemeCustomizer`, a `Sheet` (`side="right"`, 360 px, scrollable) with:

- header: title "Theme", a Reset icon button (`RotateCcw`, kbd `⇧R`), the sheet close;
- toolbar: Copy (dropdown: "Copy CSS" = `buildThemeCss(config)`, "Copy preset code" = `encodeConfig(config)`), Undo (kbd `p`), Redo;
- Mode: a two-button segmented control (Light, Dark) bound to next-themes `setTheme`;
- Style, Icon Library (one option, Lucide, disabled, v0.7.x D38), Base Color, Theme, Menu Color, Menu Accent: `Select` fields in two columns as the reference;
- Presets row: Import (a `Popover` with the preset-code field from next-app `PresetField`, Apply), Random (kbd `r`), the preset `Select` (Default first, then the 42, each with its swatch);
- `Tabs` (ui-radix): Colors, Typography, Other.
- Colors tab: one row per `TOKENS` entry for the current mode (the Mode control picks light or dark): label, a swatch, a text `Input` holding the oklch value; a change calls `setToken(mode, token, value)`; an invalid value keeps the swatch grey and is not applied. A "Reset colors" link clears the mode's overrides.
- Typography: Font, Heading font (next-app `FontOptions`). Other: Radius, Chart color.
- Left out from the reference: Contrast, Hold to save, AI, Pro sync (D2).

**Stays unchanged:** `lib/layout.shared.tsx`, `components/dev-home/v12/nav.tsx` (they mount `ThemeControls`), `ModeToggle`.

#### 1.6.5 Theme controls

`components/theme-controls.tsx`, status `refactor`: the pill renders `ThemeCustomizerTrigger` and `ModeToggle`; `ThemeCustomizer` mounts once beside it.

#### 1.6.6 Layout and CSS

- `app/layout.tsx`, status `refactor`: `designSystemFontVariables` on `<html>`; `themePresetScript` replaced by `<InlineScript html={designSystemScript} />` before the body content; `DesignSystemProvider` inside `RootProvider`; the Inter loader stays as `--font-inter`.
- `app/global.css`, status `refactor`: the six `@import '../themes/*.css'` lines removed; `@import '../styles/style-<name>.css'` for the eight styles; the neutral `:root` and `.dark` blocks at `:77-144` stay as the pre-script fallback.
- Does NOT change the `@theme inline` block, the code-token variables or `dev-home/tokens.css`.

#### 1.6.7 Theme demo and observers

- `theme-demo/variants/no-step-3.tsx`, status `refactor`: `DEMO_PRESETS = ['default', 'mono', 'violet-bloom', 'ocean-breeze', 'quantum-rose', 'amber-minimal']` (the old six by nearest palette); `cycle()` sets the next one through `setConfig({ ...config, colorPreset })`; the observer watches `data-design-system`.
- `theme-demo/variants/matches.tsx` and `dev-home/v12/dune.tsx`, status `refactor`: observe `data-design-system` instead of `data-theme`.
- Deleted: `components/theme-preset-switcher.tsx`, `lib/theme-presets.ts`, `themes/*.css`; no importer left (`grep -rn "theme-presets\|data-theme\|applyThemePreset" apps/shadcn-table-docs` empty apart from CSS comments).

#### 1.6.8 Docs E2E checks (Acceptance)

In `test/docs-e2e/lib/getting-started.mjs`, on `/`:

- `default look`: with empty storage, `getComputedStyle(html).getPropertyValue('--primary')` equals the light value in the `Default` preset, and after `.dark` is set the dark value.
- `stale choice`: a `st-design-system` entry with `savedAt = Date.now() - 3 days` and a different preset is ignored after reload and removed.
- `panel`: clicking the palette button opens a dialog with the heading "Theme" and the tabs Colors, Typography, Other.
- `shortcuts`: `r` changes `--primary`; `p` restores it; `Shift+R` returns to the default; with the search dialog open `r` changes nothing.
- `token edit`: typing an oklch value into the Colors tab's `primary` input changes the computed `--primary`.
- These run on the shipped code first and fail there (no panel, no `st-design-system`), the red line in the tracker (P11).

### 1.7 Dependencies and env

- `@tanstack/react-hotkeys` (beta; API read from https://tanstack.com/hotkeys/latest at build time), in `apps/shadcn-table-docs`.
- Google fonts through `next/font/google` as in next-app `fonts.ts` (build-time, no env).

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Theme customizer

- Files owned: `apps/shadcn-table-docs/package.json`, `pnpm-lock.yaml`, `apps/shadcn-table-docs/lib/design-system/*`, `apps/shadcn-table-docs/components/design-system-provider.tsx`, `apps/shadcn-table-docs/components/theme-customizer.tsx`, `apps/shadcn-table-docs/components/theme-controls.tsx`, `apps/shadcn-table-docs/components/theme-preset-switcher.tsx`, `apps/shadcn-table-docs/components/ui-radix/sheet.tsx`, `apps/shadcn-table-docs/lib/theme-presets.ts`, `apps/shadcn-table-docs/themes/*`, `apps/shadcn-table-docs/styles/*`, `apps/shadcn-table-docs/app/global.css`, `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/no-step-3.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/matches.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/dune.tsx`, `test/docs-e2e/lib/getting-started.mjs`
- Depends on: none
- Review: fable
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test docs-e2e --base base`, `pnpm test validate-repo`
- Task 1: Reproduce: write the checks of 1.6.8, run `pnpm test docs-e2e --base base /` on the shipped code, record the red lines in the tracker. Checks: the five checks fail
- Task 2: Dependencies: `pnpm add @tanstack/react-hotkeys --filter shadcn-table-docs`, `pnpm add-part radix sheet` (1.6.1). Checks: `pnpm install --frozen-lockfile` clean; `pnpm add-part radix --all` then `git status --short` prints nothing beyond the new sheet
- Task 3: Core and provider: 1.6.2, 1.6.3, the style CSS files. Checks: `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 4: Panel, controls, layout, demo: 1.6.4 to 1.6.7. Checks: `pnpm test typecheck --base radix`; `pnpm test docs-e2e --base base /` green
- Task 5: Cleanup: delete the old files (1.6.7), the grep of 1.6.7 empty, `pnpm format`, the changelog block. Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base radix` (docs `types:check` included) and `pnpm test lint` green
- `pnpm test docs-e2e --base base` green: the `/` theme checks and every page unchanged
- `pnpm test validate-repo` green: registry and docs copies untouched
- Review: fable (shared state in localStorage and a provider every page mounts; the home demo and three observers depend on it)
