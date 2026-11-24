# 86: Date picker docs theme changer
- Epic: E28

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`https://date-picker.shadcn-table.com/` was built by spec 85 from the table docs shell with the theme customizer and the style switcher left out: one fixed look, frozen in `docs/app/theme.css`. The owner looked at the live site: "The site doesn't look good. I want the theme changer exactly from the table." D182 puts the table site's theme customizer and style switcher back, as they are on the table site, with the table's default theme from the same code. Nothing else of spec 85's not-taken list comes back.

Paths without a prefix are in the date picker repository (`anindosarker/shadcn-date-picker`, clone `shadcn-date-picker/` beside the table repository). `table:` paths are in `shadcn-react-table/apps/shadcn-table-docs` at the tag `v0.9.8` (`a594a8a4`), the table site as it is live; read-only here.

### 1.2 Goals

- The header pill of every page (home, docs, 404) carries the palette button before the light and dark toggle; it opens the table's theme customizer sheet: Mode, Style, Base Color, Theme, Menu Color, Menu Accent, Presets, and the Colors, Typography and Other tabs, with the table's shortcuts, undo, reset and saved choice (D182).
- A fresh visitor sees the table's default look: `DEFAULT_CONFIG` (nova, Inter, the `default` colour preset, dark), painted before the first paint by the table's pre-paint script, not by a frozen file (D182).
- A style change loads that style's sheet as on the table site; the eight styles of the table are offered (D182).
- The live pickers of the home and the type pages follow the chosen theme in the three bases: tokens, radius, fonts and the style's `cn-*` rules (D182).
- The docs layout, the flat sidebar list and the pages do not change, as spec 85 built them; Copy page, the agent bar, the icon library and locale selectors, analytics and the other not-taken features of spec 85 stay out (D182).
- Acceptance: `https://www.shadcn-table.com/docs/getting-started/install` as it is live, with the customizer sheet open, captured at 1440 and 390 wide in light and dark, set beside `/docs/install` of the new build with the sheet open; the tracker names every difference and why (the one row of 1.6.2, or content). The default look: the same two pages with the sheet closed and no stored choice. Programmatic: the checks of 1.6.5.

### 1.3 Current structure

```
shadcn-date-picker/docs/ (main, 0c007cf)
├── app/layout.tsx              ← <html> hard-codes class style-nova and three data attributes (43-48), links /styles/style-nova.css (51), imports ./theme.css (6)
├── app/theme.css               ← the frozen text of buildThemeCss(DEFAULT_CONFIG) (spec 85, plan 4.3)
├── components/theme-controls.tsx ← the pill with ModeToggle only (the Sheet and the customizer trimmed out)
├── components/ui-radix/        ← button, collapsible, command, dialog, dropdown-menu, input-group, input, popover, textarea, tooltip
├── lib/build-styles.mjs        ← equal to the table's; compiles every styles/style-<name>.css it finds
├── styles/style-nova.css       ← equal to the table's; the only style sheet
└── package.json                ← no react-colorful, no @tanstack/react-hotkeys; shadcn, next-themes, radix-ui present

table: (read-only)
├── app/layout.tsx              ← designSystemScript in <head> (55), designSystemFontVariables on <html> (48), DesignSystemProvider inside TooltipProvider (83)
├── components/theme-customizer.tsx (687), design-system-provider.tsx (413), theme-controls.tsx (47)
├── components/ui-radix/sheet.tsx, tabs.tsx, select.tsx
├── lib/design-system/color-presets.ts, config.ts, fonts.ts, history.ts, themes.ts, tokens.ts
└── styles/style-{luma,lyra,maia,mira,nova,rhea,sera,vega}.css
```

### 1.4 Target structure

```
shadcn-date-picker/docs/
├── app/layout.tsx              ← the table's lines for the script, the font variables and the provider; the hard-coded class, attributes and link leave
├── app/theme.css               ← removed
├── components/theme-customizer.tsx   ← the table's, less the Icon Library row (1.6.2)
├── components/design-system-provider.tsx ← the table's, as is
├── components/theme-controls.tsx ← the table's, as is
├── components/ui-radix/sheet.tsx, tabs.tsx, select.tsx ← the table's, as is
├── lib/design-system/*.ts      ← the table's six files, as is
├── styles/style-*.css          ← the table's eight, as is
└── package.json                ← plus react-colorful and @tanstack/react-hotkeys at the table's versions
```

### 1.5 Flow

```
branch date-picker-docs-theme-changer from origin/main ──> files copied from the table at v0.9.8 ──> layout wired ──> local production build read
     ──> merge into main ──> Vercel production ──> live reads
```

### 1.6 Components

#### 1.6.1 Files taken from the table (D182)

- Taken as is, byte for byte, under the table's file names: `components/design-system-provider.tsx`, `components/theme-controls.tsx`, `components/ui-radix/sheet.tsx`, `components/ui-radix/tabs.tsx`, `components/ui-radix/select.tsx`, the six files of `lib/design-system/`, the seven style sheets `styles/style-{luma,lyra,maia,mira,rhea,sera,vega}.css` (`style-nova.css` is already equal).
- Before the copy, each taken file's `from '@/` imports are listed against the docs app: every one resolves to a file the app has or to a file of this list. An import that does not is a queue card with the file and the line, never a rewrite of the taken file.
- `lib/build-styles.mjs` and the `build` and `predev` scripts do not change: the script lists `styles/` itself and writes one sheet per style into `public/styles/` (git-ignored).
- No file is a hand-rewritten look-alike of a table file. Few code comments: none added.

#### 1.6.2 The customizer sheet (D182)

- `components/theme-customizer.tsx` is the table's file with one deletion: the Icon Library row (`table:components/theme-customizer.tsx:183-199`, the `SelectField` with `label="Icon Library"` and the comment above it) and what only it used. The icon library selector is a not-taken feature of spec 85 that D182 keeps out: the picker's parts carry fixed lucide icons and the site has no `ExampleIcons`, so the row would change nothing. `iconLibrary` stays in the config type, so `lib/design-system/config.ts` is as is.
- Every other control stays, the Chart color row included: it writes a token, as on the table site.
- The storage key, the shortcuts and the undo history are the table's; the site is its own origin, so a choice made on the table site is not shared and nothing is done to share it.

#### 1.6.3 The layout and the default look (D182)

- `app/layout.tsx` takes the table's lines: `designSystemScript` as the first script of `<head>`, `designSystemFontVariables` in the `<html>` class, `DesignSystemProvider` around the children inside `TooltipProvider`. The hard-coded `style-nova` class, the three `data-*` attributes and the `<link rel="stylesheet" href="/styles/style-nova.css">` leave: the script sets them, as on the table site (`table:lib/design-system/config.ts:516`). `PostHogProvider` and `ExampleIcons` stay out.
- `app/theme.css` and its import are removed; the default tokens come from `buildThemeCss(DEFAULT_CONFIG)` at run time. `DEFAULT_CONFIG` is not edited.
- Dark stays the default mode (`RootProvider` line unchanged).
- `app/global.css` changes only if a rule the customizer needs was trimmed by spec 85: the builder diffs the table's file against the app's and puts back only rules whose selectors the taken files render; each restored rule is one tracker line. Nothing else of the file changes.

#### 1.6.4 The pickers follow the theme (D182)

- No file under `registry/`, `demos/` or `content/` changes. The demos read the docs tokens already (spec 85, plan 4.4); with the script in place the tokens, `--radius`, the fonts and the `.style-<name>` rules of the chosen style reach the three `cn-*` hook classes of the trees.
- A fault found here (a picker part that ignores a token or breaks in one style) is a queue card with the capture; the approved picker code is not changed in this spec.

#### 1.6.5 Checks on the production build and live (D182)

- Local: `pnpm --filter docs build`, then `next start` on a port from 5340 to 5360 (P6), stopped after. In a browser at 1440 and 390 wide:
  - no stored choice: `<html>` carries `style-nova` and `data-design-system`; the computed `--primary`, `--radius` and `--font-sans` of `/docs/install` equal those of `https://www.shadcn-table.com/docs/getting-started/install` in light and in dark; no flash of another look on a reload;
  - the palette button shows on `/`, `/docs/date` and a 404 address and opens the sheet; the sheet's controls are the table's less Icon Library, compared by their labels;
  - each of the eight styles: the sheet of that style is linked, the `<html>` class is `style-<name>`, and the picker of `/docs/date` opens and takes a day on Base UI; for nova and two other styles also on Radix UI and React Aria, and on `/docs/ranges`;
  - a preset, a colour picked in the Colors tab, a font and a radius each change the open picker's computed style; undo, reset and the shuffle shortcut work as on the table site; a reload keeps the choice;
  - typing a date into a picker's box does not fire a theme shortcut;
  - no error in the console; nothing runs past the right edge at 390 with the sheet open.
  One tracker line per read.
- The captures of 1.2 Acceptance under `reference/q149-calendar-library/docs-site/theme/`, the difference list in the tracker.
- No preview read by the owner and no wait on the branch preview (E28 Notes): after the local read the branch merges; then on `https://date-picker.shadcn-table.com/`: `/`, `/docs/install` and `/docs/date` answer 200, `/styles/style-<name>.css` answers 200 for the eight styles, the sheet opens and one style change and one preset reach the picker of `/docs/date`, `/storybook/base/` still opens. A red there is fixed forward.

**Stays unchanged:** `registry/**`, `stories/**`, `.storybook/**`, `tools/**`, `vercel.json`, `README.md`, `docs/content/**`, `docs/demos/**`, the docs layout and sidebar files, `docs/lib/build-styles.mjs`; the tags; the table repository outside `.ai/plans/v0.9.x/`; the Vercel project's settings.

### 1.7 Dependencies and env

- New in `docs/package.json`: `react-colorful` `5.8.1` and `@tanstack/react-hotkeys` `^0.22.0`, the table's versions; one `pnpm install`. The milestone owns `docs/package.json` and `pnpm-lock.yaml`.
- `lib/design-system/fonts.ts` loads the customizer's faces with `next/font/google`; the build needs the network, as the table's does.
- Clone, branch, worktree, merge and tracker rules: spec 78, 1.6.1. Branch `date-picker-docs-theme-changer`.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Date picker docs theme changer

- Files owned: `shadcn-date-picker/docs/app/layout.tsx`, `shadcn-date-picker/docs/app/theme.css`, `shadcn-date-picker/docs/app/global.css`, `shadcn-date-picker/docs/components/theme-customizer.tsx`, `shadcn-date-picker/docs/components/design-system-provider.tsx`, `shadcn-date-picker/docs/components/theme-controls.tsx`, `shadcn-date-picker/docs/components/ui-radix/sheet.tsx`, `shadcn-date-picker/docs/components/ui-radix/tabs.tsx`, `shadcn-date-picker/docs/components/ui-radix/select.tsx`, `shadcn-date-picker/docs/lib/design-system/**`, `shadcn-date-picker/docs/styles/**`, `shadcn-date-picker/docs/package.json`, `shadcn-date-picker/pnpm-lock.yaml`
- Depends on: none
- Review: none
- Local CI: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm --filter docs lint`, `pnpm --filter docs types:check`, `pnpm --filter docs build`, in the milestone's worktree of the date picker repository, one at a time (P5)
- Task 1: The taken files and the two packages (1.6.1, 1.6.2, 1.7). Checks: the import list of 1.6.1 in the tracker, every line resolved; for each `as is` file `diff` against the table's at `v0.9.8` prints nothing; the diff of `components/theme-customizer.tsx` against the table's shows deletions only; `pnpm install --frozen-lockfile` exits 0 after the one install; `ls docs/styles/style-*.css | wc -l` prints `8`
- Task 2: The layout and the default look (1.6.3). Checks: `test ! -e docs/app/theme.css`; `grep -c 'style-nova\|data-menu-color' docs/app/layout.tsx` prints `0`; `grep -c 'designSystemScript\|DesignSystemProvider\|designSystemFontVariables' docs/app/layout.tsx` prints `6`; each restored `global.css` rule one tracker line, or the line `none`; `pnpm --filter docs types:check`, `pnpm --filter docs lint` and `pnpm --filter docs build` exit 0; `ls docs/public/styles/style-*.css | wc -l` prints `8`
- Task 3: The local production build read and the captures (1.6.4, 1.6.5). Checks: one tracker line per read of 1.6.5 with pass or the fault; the token comparison with the table site, the six values in the tracker; the captures committed under `reference/q149-calendar-library/docs-site/theme/` and the difference list in the tracker; the server stopped (`lsof -nP -iTCP:<port> -sTCP:LISTEN` prints nothing)
- Task 4: After the merge: the live reads (1.6.5). Checks: one tracker line per live read with the address; the CI run of the merged commit is `success`; the milestone worktree removed and `git -C <clone> status --short` prints nothing

### 2.2 Checks

- Date picker docs theme changer: taken files equal the table's at `v0.9.8` (the customizer by deletions only), the default look equals the table's by computed tokens, the eight styles load, the pickers follow the theme on the three bases, the production build read at two widths and two modes, the captures beside the table site, the live reads
- Review: none; the copy is proven by the diffs and the look by the captures and the token comparison
