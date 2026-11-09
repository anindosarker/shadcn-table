# v0.9.x decisions

## Round 1: discussion, 2026-11-07

### D1 The select filter's clear button sits right of the chevron

[Done]  [E1]

- Fixes F1. In the three `ST_FilterTextField.tsx`, the select trigger's `pe-9` becomes `pr-9`, so tailwind-merge drops the base `pr-2` and the chevron moves left of the overlaid clear x.
- One play sets a select filter value and asserts the chevron is left of the clear button; it runs on the shipped code first and must fail there (v0.8.x P11).
- Stays: the clear addon overlaid at the end of the trigger; multi-select unchanged.

### D2 The palette button opens a theme customizer panel

[Done]  [E2]

- The docs nav keeps its palette button where it is (`components/theme-preset-switcher.tsx:85`, mounted at `lib/layout.shared.tsx:36` and `dev-home/v12/nav.tsx:63`); the light/dark toggle beside it stays. Clicking it opens a right-side panel instead of the six-preset dropdown. Reference: shadcnstudio.com/theme-generator (screenshot in chat, 2026-11-08).
- Panel layout, top to bottom: header (title, reset, close); Copy (the theme CSS and the preset code), Undo, Redo; Mode Light / Dark; Style; Icon Library (Lucide only, v0.7.x D38); Base Color; Theme; Menu Color; Menu Accent; Presets row with Import (paste a preset code), Random, and a preset select holding Default plus the 42 tweakcn palettes; tabs Colors, Typography, Other.
- Colors tab: one swatch and oklch input per token, light and dark, every token the theme CSS emits. Typography: font and heading font. Other: radius and chart color. Left out from the reference: Contrast, Hold to save, AI, Pro sync.
- Default is the docs' current Emerald look (`themes/emerald.css`), added as the `Default` preset; Reset returns to it. Mechanics ported from `test-projects/next-app/lib/design-system/*` (provider, generated CSS in a `<style>` element, pre-paint script); `themes/*.css`, `lib/theme-presets.ts` and the Random re-roll on load go; the home theme demo (`theme-demo/variants/no-step-3.tsx:203`) calls the new preset API.
- Every page load applies the default unless localStorage holds a user choice; the stored choice carries a timestamp and expires after 2 days.
- Shortcuts through TanStack Hotkeys (`@tanstack/react-hotkeys`, one scope, off while an input, textarea or the search dialog has focus), each shown as a kbd hint beside its control: `r` shuffle, `Shift+R` reset, `c` shuffle the color preset, `p` undo.

### D3 The version bump waits for the owner's approval

[Done]  [E2]

- Supersedes v0.8.x D88 on approval and the A23 default. A GitHub Environment `release` with the owner as required reviewer gates the bump job `prepare-release` (`pr.yml:165-222`): the job gets `environment: release`; every other job stays automatic. The owner creates the environment in Settings, Environments, and this decision is the one-time authorization for that setting (v0.8.x P7).
- The release PR (`dev` into `master`) is opened with its label and auto-merge enabled at creation. The run's flow: CI green, Prepare Release waits for review, the owner clicks Review deployments and Approve, the job pushes `chore: version <v>` to `dev`, CI reruns green, auto-merge merges, `release.yml` tags, verifies and publishes. A rejected review fails the job and pushes nothing.
- An agent never approves the deployment, not in the UI and not through `gh api .../actions/runs/<run_id>/pending_deployments`, although the owner's `gh` login could. The run posts "Prepare Release waits for your approval" and continues everything that does not depend on the merge; the owner approves with a click, or says "approve it" in chat for that one release.

### D4 Filter modes are on by default

[Done]  [E1]

- `enableColumnFilterModes` defaults to true (`features/stConfigFeature.ts:105`, `:561`, `useST_TableOptions.ts`); a consumer turns it off per table or per column as today. Material React Table defaults it off; this is a deliberate deviation.
- Mode lists stay as they are today for every variant (`shared/utils/filterSummary.utils.ts:46-65`, `ST_FilterOptionMenu.tsx:172`): text, autocomplete, select, date, datetime, time offer all 14 modes; range, date-range, datetime-range, time-range offer between and betweenInclusive; range-slider and checkbox offer none.
- Multi-select adds three menu entries after its 14, labelled Includes any (`arrIncludesSome`, the default fn), Includes all (`arrIncludesAll`) and Excludes (`arrIncludesNone`), with localization keys for the three labels.
- Chip labels show the mode as `/docs/examples/advanced` does today ("Email fuzzy: ..."); the subheader and popover display modes get the same default.
- The column-filtering guide and every docs example drop the explicit `enableColumnFilterModes: true`; one play per display mode asserts the picker appears without the flag (v0.8.x P11).

### D5 The column size reset animates, in CSS

[Done]  [E1]

- Double-click on the resize handle (`ST_TableHeadCellResizeHandle.tsx:64-70`) and the "Reset column size" menu item (v0.8.x D5 addendum) keep calling `column.resetSize()` and also set `data-size-resetting` on the table element; the attribute clears on the header cell's `transitionend`, with no timer.
- The transition is Tailwind classes on the th and td class strings, gated by the attribute the way the flip gates `transition-[translate]` (`ST_TableHeadCell.tsx:309`): `[table[data-size-resetting]_&]:transition-[width,min-width]`, 200 ms, ease-out, `motion-reduce:transition-none`. No JS animation, no frame loop, no change to `global.css`.
- Nothing else animates: drags stay instant, other width changes snap as today.
- One play asserts the attribute appears on double-click, clears after the transition, and the width lands on the default; it runs on the shipped code first and must fail there (v0.8.x P11).

### D6 The `pages` footer shows the row range; the compact mode is `compact`

[Done]  [E1]

- The `pages` footer (the default, v0.8.x D13 stays) shows the row range between Rows per page and the page buttons: `1-10 of 200`, localized, the filtered count, `1-2 of 2` on one page. Previewed on the docs copy (Base UI, worktree 01, port 5341) and accepted. Owner, 2026-11-08.
- The compact footer's value is `paginationDisplayMode: 'compact'`; `'default'` is removed from the option type and the branch, no alias (no users yet). The stories, guide, API page and examples that say "default" for it are a separate item (F5, F7).
- The accepted diff, to apply as is to `ST_TablePagination.tsx` in the three bases (path rewritten from the docs copy to the registry; `pnpm format` fixes the indent of the moved `<Pagination>` block; `'default'` in the branch becomes `'compact'`):

```diff
diff --git a/apps/shadcn-table-docs/components/ui-base/shadcn-table/components/toolbar/ST_TablePagination.tsx b/apps/shadcn-table-docs/components/ui-base/shadcn-table/components/toolbar/ST_TablePagination.tsx
index 4b0227a2..21c2d077 100644
--- a/apps/shadcn-table-docs/components/ui-base/shadcn-table/components/toolbar/ST_TablePagination.tsx
+++ b/apps/shadcn-table-docs/components/ui-base/shadcn-table/components/toolbar/ST_TablePagination.tsx
@@ -150,6 +150,17 @@ export const ST_TablePagination = <TData extends ST_RowData>({
           pageSize,
           totalRowCount,
         });
+        const rangeLabel = (
+          <span className="mx-1 min-w-[8ch] text-center text-sm">{`${
+            shownRowRange.lastRowIndex === 0
+              ? 0
+              : (shownRowRange.firstRowIndex + 1).toLocaleString(
+                  localization.language,
+                )
+          }-${shownRowRange.lastRowIndex.toLocaleString(localization.language)} ${
+            localization.of
+          } ${totalRowCount.toLocaleString(localization.language)}`}</span>
+        );
 
         return (
           <div
@@ -239,9 +250,11 @@ export const ST_TablePagination = <TData extends ST_RowData>({
               </div>
             )}
             {paginationDisplayMode === 'pages' ? (
-              // Not PaginationPrevious/Next: they hardcode English text and
-              // lucide icons, which bypasses localization and icon overrides.
-              <Pagination {...restPaginationProps} className="mx-0 w-auto">
+              <>
+                {rangeLabel}
+                {/* Not PaginationPrevious/Next: they hardcode English text and
+                    lucide icons, which bypasses localization and icon overrides. */}
+                <Pagination {...restPaginationProps} className="mx-0 w-auto">
                 <PaginationContent>
                   {getPaginationItems({
                     boundaryCount,
@@ -291,17 +304,10 @@ export const ST_TablePagination = <TData extends ST_RowData>({
                   })}
                 </PaginationContent>
               </Pagination>
+              </>
             ) : paginationDisplayMode === 'default' ? (
               <>
-                <span className="mx-1 min-w-[8ch] text-center text-sm">{`${
-                  shownRowRange.lastRowIndex === 0
-                    ? 0
-                    : (shownRowRange.firstRowIndex + 1).toLocaleString(
-                        localization.language,
-                      )
-                }-${shownRowRange.lastRowIndex.toLocaleString(localization.language)} ${
-                  localization.of
-                } ${totalRowCount.toLocaleString(localization.language)}`}</span>
+                {rangeLabel}
                 <div>
                   {showFirstPageButton && (
                     <ST_Tooltip title={localization.goToFirstPage}>
```

- One play renders a `pages` table, asserts `1-10 of 21`, types a filter and asserts the new range; it runs on the shipped code first and must fail there, the red recorded in the tracker (v0.8.x P11).

### D7 "Default" leaves the pagination names; `compact` everywhere

[Done]  [E1]

- Fixes F5 and F7, applies D6's rename. Every `'default'` for `paginationDisplayMode` becomes `'compact'`: the type `features/stConfigFeature.ts:391` and the branch `ST_TablePagination.tsx` (radix `:278`, base `:294`, aria `:281`) in the three bases; the docs-app copies follow by sync and `public/r/*.json` by regeneration (P9); `guides/pagination.mdx:104,110`, `guides/best-practices.mdx:199`, the API entry `lib/prop-tables/tableOptions.ts:1827-1835`, the example `alternate-pagination/TS.tsx:13` in three bases, `test/docs-e2e/lib/guides.mjs:139`, the stories `TableProvider.stories.tsx:63,169,218,224`, `NestedTable.stories.tsx:89,99`, `RowPinningOnSelect.stories.tsx:66,282,332`; a new CHANGELOG entry, the old `:122` stays.
- Story names: the compact story `PaginationEnabledDefaultMoreData` (`Pagination.stories.tsx:60`) becomes `PaginationCompactMoreData`; the four stock-settings stories drop "Default": `PaginationEnabled` (`:56`), `PaginationEnabledBigData` (`:103`), `PaginationEnabledBigDataLanguage` (`:116`), `PaginationEnabledNoRowsPerPage` (`:133`). Titles follow the export names; the story ids change and no docs link points at them.
- The guide and the API entry state that `'pages'` is the default and `'compact'` the alternative; no page calls the compact footer the default.
- The next-app demo's stale copy (`test-projects/next-app/.../useST_TableOptions.ts:84`) is the owner's, outside the run (D34).

### D8 The static Storybook resets each story after its play

[Done]  [E2]

- Fixes F6. The static builds (`/base/`, `/radix/`, `/aria/`) reset a story after its play: `.storybook/main.ts` injects `window.__ST_STATIC__ = true` into the preview head only when `configType === 'PRODUCTION'`; `.storybook/preview.tsx` adds a project-level `afterEach` that bumps a counter and a `ResetAfterPlay` keyed wrapper inside the existing decorator, so React remounts the story with fresh state. The play does not rerun; the Interactions panel keeps its steps and PASS; Rerun runs the play and resets again. Previewed on the Base static build (worktree 01, port 5342) and accepted. Owner, 2026-11-08.
- `storybook dev` (configType `DEVELOPMENT`) and vitest (no configType in the addon-vitest plugin) keep the end state. A failing play keeps its end state too: `afterEach` is skipped in the `errored` phase.
- The accepted diff, to apply as is:

```diff
diff --git a/packages/shadcn-table/.storybook/main.ts b/packages/shadcn-table/.storybook/main.ts
index 4c3f4c27..191c4493 100644
--- a/packages/shadcn-table/.storybook/main.ts
+++ b/packages/shadcn-table/.storybook/main.ts
@@ -16,6 +16,10 @@ const ST_BASE = resolveBase(process.env.ST_BASE);
 const baseScript = `<script>window.__ST_BASE__ = ${JSON.stringify(ST_BASE)};</script>`;
 const devScript = (dev: boolean) =>
   `<script>window.__ST_DEV__ = ${JSON.stringify(dev)};</script>`;
+// The preview gets whether this is a static build, which resets each story
+// after its play (preview.tsx). Vitest loads no configType, so it stays false.
+const staticScript = (isStatic: boolean) =>
+  `<script>window.__ST_STATIC__ = ${JSON.stringify(isStatic)};</script>`;
 
 /** Resolve the absolute path of a package (monorepo-safe). */
 function getAbsolutePath(value: string): string {
@@ -41,7 +45,8 @@ const config: StorybookConfig = {
   },
   managerHead: (head, { configType }) =>
     `${head}${baseScript}${devScript(configType !== 'PRODUCTION')}`,
-  previewHead: (head) => `${head}${baseScript}`,
+  previewHead: (head, { configType }) =>
+    `${head}${baseScript}${staticScript(configType === 'PRODUCTION')}`,
   // Storybook keys its Vite dep cache by the config dir alone, so the base
   // servers (storybook:all) would share one optimized-deps dir and invalidate
   // each other ("Failed to fetch dynamically imported module"). One cache per
diff --git a/packages/shadcn-table/.storybook/preview.tsx b/packages/shadcn-table/.storybook/preview.tsx
index e1645117..e67a5482 100644
--- a/packages/shadcn-table/.storybook/preview.tsx
+++ b/packages/shadcn-table/.storybook/preview.tsx
@@ -1,5 +1,5 @@
 import type { Preview } from '@storybook/react-vite';
-import { Fragment } from 'react';
+import { Fragment, type ReactNode, useSyncExternalStore } from 'react';
 import { addons, useEffect, useState } from 'storybook/preview-api';
 import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
 import {
@@ -42,7 +42,29 @@ function useStorybookDarkMode() {
 // Set the class before React mounts so the initial story paint is dark.
 applyHtmlClass(readStoredMode() === 'dark');
 
+// A play leaves the story in its end state. On the static site the story
+// resets after its play: afterEach bumps this counter and the keyed wrapper
+// remounts the story with fresh state, without rerunning the play. Vitest and
+// `storybook dev` keep the end state (__ST_STATIC__ is false there, main.ts).
+let resetCount = 0;
+const resetListeners = new Set<() => void>();
+const subscribeReset = (listener: () => void) => {
+  resetListeners.add(listener);
+  return () => resetListeners.delete(listener);
+};
+
+function ResetAfterPlay({ children }: { children: ReactNode }) {
+  const key = useSyncExternalStore(subscribeReset, () => resetCount);
+  return <Fragment key={key}>{children}</Fragment>;
+}
+
 const preview: Preview = {
+  afterEach: () => {
+    if ((globalThis as { __ST_STATIC__?: boolean }).__ST_STATIC__ !== true)
+      return;
+    resetCount += 1;
+    resetListeners.forEach((listener) => listener());
+  },
   parameters: {
     actions: { argTypesRegex: '^on[A-Z].*' },
     controls: {
@@ -132,7 +154,9 @@ const preview: Preview = {
               here on GitHub.
             </a>
           </p>
-          <Story />
+          <ResetAfterPlay>
+            <Story />
+          </ResetAfterPlay>
         </div>
       );
     },
```

- Check: the release validation opens one story with a play on the deployed Storybook and asserts the initial state once the play has settled.

### D9 `process.md` audited for the batch flow

[Done]

- The v0.8.x copy is rewritten in place, numbers P1 to P11 unchanged. Cut: bullets that restate the skill or the coding standards (branch creation, worktree reset, tracker lines, merge-on-green, the `eslint-disable` rule, "epics follow the guidelines", the `release:` label line of `plan.md`). Rewritten: `dev` is untouched until a release epic runs (P1); the pool is worktrees 01 to 09, `wt1`, `wt2` and `changelog` excluded (P2); P3 keeps the merge message and branch deletion only; P4 states no release is planned for v0.9.x and the D3 gate; P5 adds the `pnpm test` runner facts and the CI-only tests; P6 names port 5273 and lets a new dependency land as the first milestone of the batch that needs it (so D2's `@tanstack/react-hotkeys` is not blocked); P8 keeps the `reference/**` revert only; P9 lists the generated files only.
- Moved: "every story file has a play" to `docs/code-of-conduct/coding-standards.md`, Checks; P11 keeps the fix-play-fails-first rule.
- Settled by the agent from the audit table; no bullet was a real choice (owner, 2026-11-08: the audit is not an owner item).

## Round 2: triage, 2026-11-08

### D10 The reset listener waits for a width transition

[Done]

- Source: A1. The `resetColumnSizeAnimated` listener in `shared/utils/column.utils.ts` (three bases) removes itself on the first `transitionend` whose `propertyName` is `width` or `min-width`, not on the first event of any kind: button color transitions bubble to the table first and `{ once: true }` would leave `data-size-resetting` stuck. No timer; the D5 behaviour is unchanged. Kept as merged (E1 03, `54a51ee3`).

### D11 The select trigger pads with `ltr:pr-9 rtl:pl-9`

[Done]

- Source: A2. D1 named `pr-9`; the merged code uses `ltr:pr-9 rtl:pl-9` because `pnpm test validate-repo` rejects a physical padding class, and spec 01 requires that check green. The chevron sits left of the clear button in both directions. Kept as merged (E1 01, `4a61e251`).

### D12 Removing a filter chip returns the column to its initial filter mode

[Done]

- Source: A3. With modes on by default (D4), the old reset to the first listed mode turned a multi-select column into `fuzzy` and a select column away from `equals` after one chip removal; the merged code resets to `table.initialState.columnFilterFns`, or the first listed mode only when the initial one is not offered. Kept as merged (E1 01, `4a61e251`, `ST_FilterOptionMenu.tsx`, `filterSummary.utils.ts`).

### D13 The multi-select mode labels read Includes any, Includes all, Excludes in every locale

[Done]

- Source: A4. `filterArrIncludesSome` and `filterArrIncludesAll` already existed; the builder rewrote them to D4's wording in every locale and added `filterArrIncludesNone`; eleven locales had an imperative ("include everything") that became the descriptive label. Kept as merged (E1 01, `4a61e251`, `shared/locales/*.ts`).

### D14 Two more known flakes

[Done]

- Fixes F8. `ClickToCopy` "Click Copies Value" (base, radix) and `RowOrdering` "Drag Reorders Rows" (aria, 90 s timeout) time out under machine load and pass alone; they join the P5 known-flake list, rerun once before a check is called red.

### D15 Release 0.9.0 after E2 (superseded by D28, D45)

[Done]  [E3]

- A release spec (07, epic E3, depends on E2) ships 0.9.0 with E1, E2 and the F3 fix: the integration milestone fast-forwards `claude/review` into `dev` once and runs the suite there; then one PR `dev` into `master` with the label `release:minor`, auto-merge enabled at creation; `release.yml` tags, verifies the deploy and publishes. Supersedes the P4 bullet "no release is planned".
- Superseded by D28 (the runner does not approve). The owner approved the 0.9.0 Prepare Release deployment in advance (2026-11-08: "you can approve it now"), the per-release word D3 requires; the runner approves it with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments` when the job waits. Any later release needs a fresh word.
- The docs changes are not in 0.9.0; they ship as 0.9.1 after the docs discussion.

### D16 The `release` environment keeps admin bypass

[Done]

- Source: A5. The environment created by spec 05 (`aeca4d55`) keeps GitHub's default `can_admins_bypass: true`; the owner is the repository's only admin, so nobody else can merge past the Approve. Kept as created; no extra PUT.

## Round 3: triage E2, 2026-11-08

### D17 The sheet part is installed into the docs only

[Done]

- Source: A6. `sheet` is listed in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs` (as `alert-dialog` is), so `pnpm lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base; the registry gains no part the library does not use. Kept as merged (E2 04, `161c5ae6`).

### D18 `@tanstack/react-hotkeys` stays a caret range

[Done]

- Source: A7. `^0.22.0` in `apps/shadcn-table-docs/package.json`, the convention of the other dependencies there; the lockfile pins the installed build. Kept as merged (E2 04, `161c5ae6`).

### D19 The home demo label reads the design system store

[Done]

- Source: A9. `no-step-3.tsx` reads the current preset from `useDesignSystem()`, the store the panel writes, so every pick (panel, shortcut, cycle button) updates the label; no MutationObserver on `data-design-system`. The D2 behaviour is unchanged. Kept as merged (E2 04, `161c5ae6`).

### D20 The docs dev server loads clean

[Done]  [E2]

- Fixes F11. The runner runs `pnpm --filter shadcn-table-docs dev` on an agent port, loads `/`, `/docs` and one example page, reads the server and browser logs, and fixes each logged error or warning at its root cause (v0.8.x D34 style: no suppression, no `suppressHydrationWarning` blanket).
- The hotkeys label: formatted only in the browser, or with the platform read from the request (`detectPlatform(userAgent)`) and set on the hotkeys provider, whichever the library's SSR guide names; the kbd hints stay (D2).
- The hydration mismatch on the home page: the attribute located from the browser log and its server and client values made equal.
- Acceptance: the same three loads log nothing from TanStack Hotkeys and no hydration mismatch, recorded in the tracker; `pnpm test docs-e2e --base base` green. Owner, 2026-11-08: fix now, before the release.

### D21 Copy and Import leave the theme panel

[Done]  [E4]

- Fixes F18, amends D2. The `CopyMenu` (Copy CSS, Copy preset code, `theme-customizer.tsx:490-519`, used at `:146`) and `ImportPreset` (`:522-576`, used at `:275`) are removed, with `importPreset` (`design-system-provider.tsx:185`), `encodeConfig` and `decodeConfig` (`config.ts:501,518`) and the preset-code format they share; Random, the preset select, the tabs and every other D2 control stay. Owner, 2026-11-08: "Unnecessary items, remove them."

### D22 One shortcut row at the top of the theme panel

[Done]  [E4]

- Fixes F19, F12, F17; amends D2's layout and keys. One row directly under the header, in Copy's former slot (D21), holds five buttons: Reset `Shift+R`, Undo `Mod+Z`, Redo `Mod+Shift+Z`, Random `R`, Next preset `C` (`Mod` is Cmd on macOS, Ctrl on Windows and Linux; the label comes from the client platform, D20). `P` for undo goes.
- Labeled buttons with their kbd hint when the row fits the panel width; when it does not, icon buttons with a tooltip that carries the label and the kbd hint. The header keeps the title and the close button only (the icon-only reset at `theme-customizer.tsx:133-141` and its hint go); the Presets row keeps the select alone (Random at `:292` and the `C` hint under the select move up).
- Keys registered in `design-system-provider.tsx:193-198`, scope and guards unchanged (D2).

### D23 Each color swatch opens a picker

[Done]  [E4]

- Fixes F13. In the Colors tab each token's swatch (`theme-customizer.tsx:631-638`, a static span today) becomes a button that opens a Popover holding `react-colorful`'s `HexColorPicker` above the existing text input; dragging in the picker writes the token live, and Undo records one step per Popover close (the per-keystroke undo of A10 stays for typed values). `react-colorful` is one new dependency of the docs app, added by the first milestone of the epic that ships this (P6).

### D24 The persistent view example starts at ten rows

[Done]  [E4]

- Fixes F14. `initialState.pagination.pageSize` becomes 10 in `apps/shadcn-table-docs/examples/{radix,base,aria}/persistent-view/TS.tsx:344`; the stored view (`viewSettingsStorage.utils.ts`) keeps not persisting pagination, so a visitor's page size choice still resets on reload. No library change.

### D25 The stored view persists rows per page

[Done]  [E4]

- `ST_StoredView` (`shared/utils/viewSettingsStorage.utils.ts:7-16`, three bases) gains `pageSize?: number`; the persist path saves it on every page size change and the restore path applies it at mount over `initialState.pagination.pageSize`. Page index is not stored. Old stored views without the field stay valid. Public surface (P7): the view settings guide and the API entry for `persistViewSettings` list the new field; a CHANGELOG entry.
- One play changes the page size, remounts the table and asserts the size held; it runs on the shipped code first and must fail there (P11).
- D24 stays: the persistent view example starts at 10 and a visitor's choice now survives reload.

### D26 Style, Menu Color and Menu Accent take effect in the docs

[Done]  [E4]

- Source: A8
- The docs parts in `apps/shadcn-table-docs/components/ui-<base>/` (three bases) are regenerated through `lib/install.mjs` with the preset that emits the `cn-*` hooks (`cn-menu-target` and the rest the design system's style layers in `lib/design-system/*` target, as the next-app reference's parts carry them); the library's own table parts under `shadcn-table/` are untouched. Owner, 2026-11-08: "No, they should work."
- Acceptance: `pnpm test docs-e2e --base base` green, plus one check that picking a Style and a Menu Color changes a docs menu's computed style; a check that fails on the shipped parts first (P11).
- Mechanism settled at spec time (spec 13, lead 2026-11-08): `shadcn add` cannot emit the hooks (ui.shadcn.com serves the parts resolved, and the CLI's `transformMenu` strips `cn-menu-target`, measured on 4.22.0 and 4.23.0), so `lib/install.mjs` gains a second phase that fetches the hooked sources from shadcn-ui/ui `apps/v4/registry/bases/<base>/ui/` at a pinned commit and rewrites their imports; the decided behaviour is unchanged.

### D27 The Icon Library select switches the example tables' icons

[Done]  [E5]

- Fixes F16; supersedes v0.7.x D38 "Lucide only" for the docs. The select (`theme-customizer.tsx:207-214`, disabled today) picks lucide, hugeicons, tabler, phosphor or remixicon; every docs example table shows that set; the docs chrome (nav, panel, shadcn parts) stays Lucide. Reset returns to lucide; the choice persists with the rest of the config (D2).
- Mechanism, library side: the docs copies under `components/ui-<base>/shadcn-table/` are written by `lib:install` from the registry and carry no shared hook, and every example calls `useST_TableOptions` itself, so the library gains a defaults provider (`ST_DefaultsProvider`, three bases) whose `icons` the hook merges beneath the per-table `icons` option (`useST_TableOptions.ts:114`: defaults, then provider, then the table's own). Public surface (P7): API entry, the icons guide, a CHANGELOG entry; one story with a play.
- Docs side: the provider wraps the examples with the set the theme config names; `hugeicons`, `tabler`, `phosphor` and `remixicon` packages become docs dependencies (P6); the registry's `icons/<lib>.ts` files are installed into the docs copies by `lib:install`.

### D28 The 0.9.0 release waits for the owner's manual approval

[E7]
[Done]

- Supersedes D15's advance approval. No agent approves the Prepare Release deployment of the 0.9.0 release PR, not in the UI and not through `gh api .../pending_deployments`; D3's rule stands in full. The run opens the PR, posts "Prepare Release waits for your approval" and stops there; the owner approves with a click. Owner, 2026-11-08: "There are way too many breaking items that we are changing, so stop the release before my manual approval."

### D29 Only the active style's stylesheet loads

[Done]  [E5]

- Fixes F15. `app/global.css:9-16` stops importing the eight `styles/style-*.css` files; each style is its own CSS asset and only the active one is linked: the pre-paint script links the stored or default style's sheet before first paint, and a style change swaps the link and applies the class once the new sheet has loaded, so nothing flashes unstyled. The eight files themselves and the `.cn-*` layers stay as they are (spec 13 relies on them).
- Measured 2026-11-08, same machine, commit `546bcabd` against `claude/review`: root stylesheet 351 KB to 2,755 KB; warm `/` usable at 1.3 s to 2.8 s; persistent view 1.6 s to 5.6 s; panel open one 1.1 to 1.3 s long task; light/dark toggle style recalc 81 ms to 476 ms. JS unchanged.
- Acceptance: the root stylesheet of `/` within 10 percent of the 351 KB baseline plus the one active style sheet; opening the panel and toggling light/dark each under 300 ms of long task in the docs E2E harness, measured against the shipped code first (P11); every page green in `pnpm test docs-e2e --base base`.
- Runs after spec 13 (E4) has merged, so the on-demand sheet is tested with the hooked parts.

### D30 The installation reference refresh merges into dev directly

[Done]

- Source: A12
- Source: A12. The fix milestone `refresh-installation-references` (F20: the six `test/installation-e2e/fixtures/reference/<base>/default-{light,dark}.png` taken after D6's footer range) is cut from `dev` at `df90bd27` and merged into `dev` directly with a merge commit, then into `claude/review`; `dev` is not fast-forwarded from `claude/review` again for 0.9.0, so the E4 and E5 merges stay out of it (D15). The one exception to P1 for this release; a later release returns to the fast-forward.

### D31 Random keeps its curated presets through a private decoder

[Done]

- Source: A11
- Source: A11. D21 removed the preset-code codec; the Random button (kept by D21) decoded its curated `SHUFFLE_PRESETS` with it, so the builder kept a private `curatedPreset` decoder and a `sameLook` field compare in `lib/design-system/config.ts`; `decodePreset` from `shadcn/preset` stays imported, nothing user-facing changes. Kept as merged (E4 08, `9d582dcd`).

### D32 A CI-only red is reproduced and fixed under act before it merges

[Done]  [E3]

- A check that is red on GitHub Actions and green on the local macOS run (a Linux-only failure, such as the docs E2E `/` theme checks of F23 and F24) is reproduced locally with `act` against the local Docker (`act pull_request -W .github/workflows/pr.yml -j <job>` with the matrix narrowed to the red base) and the fix is confirmed green there before it merges into `dev`; the GitHub run is the confirmation, not the loop. Owner, 2026-11-08: "You can run them locally and fix them quickly, then do the pr"; "I have Docker and we discussed about using tools like act". Narrows process.md P3 ("never required") for the Linux-only case.

### D33 The page index restore gets its red-first play

[Done]

- Source: A13
- Source: A13. The F22 fix (`811045dc`) merged without a play that fails on the shipped code (P11). A fix milestone adds a `Persistence` play variant in `packages/shadcn-table/stories/features/ViewSettings.stories.tsx` with `initialState.pagination.pageIndex: 2` and a stored rows-per-page, asserting the page index holds after remount; red at `117a81b5`, green at `811045dc`, the two lines in its tracker; three bases through `pnpm test storybook-tests --base <base>`. Settled by the lead: a coverage gap, no behaviour change.

### D34 No bot comment for the approval wait

[Done]

- The PR's own banner ("This branch is waiting for a deployment approval", Show environments) is the entry point; no `pr.yml` job and no runner comment announces the wait. Owner, 2026-11-08: "I think we can scrap it." Not to be re-proposed.

### D35 The release test jobs skip the version bump commit

[Done]  [E6]

- In `.github/workflows/pr.yml`, every test job (typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-pr, PR Summary as applicable) gets an `if:` that skips it when the PR head commit is the bot's `chore: version <v>` commit pushed by `prepare-release` (D3); a job skipped by its condition reports Success for required checks, so auto-merge merges without a second test run. The bump commit changes version files only. `prepare-release` itself keeps running only on an unbumped head. The next release (0.9.1) is the first to run this way; the spec proves it with the 0.9.1 PR's check list (one run of each test job, the bump commit's jobs skipped).
- Owner, 2026-11-08: "doesn't that mean we just ran the same checks again? doesn't it seem unnecessary?"
- Consequence, owner 2026-11-08: the bot's bump push prompts nobody (its test jobs skip, so `prepare-release`, which needs them, is skipped too), while any regular push after an Approve (a fix) runs the tests and prompts again; that second prompt is wanted and stays (the idea of skipping `prepare-release` on an already bumped head was dropped).

### D36 The workflows use the Node 24 action majors

[Done]  [E6]

- Every `uses:` in `.github/workflows/*.yml` moves to the major built for Node 24: `actions/checkout@v5` (13 uses), `actions/setup-node@v5` (13), `actions/upload-artifact@v5` (8), `actions/download-artifact@v5` (1), `pnpm/action-setup@v5` where that release exists (8); the spec writer checks each release's Node line before pinning. Acceptance: a green `pr.yml` run with zero "Node.js 20 is deprecated" annotations (30 per run today). Owner, 2026-11-08.

### D37 The PR Summary comment is a grouped table

[Done]  [E6]

- `tools/release/pr-summary.mjs` writes the sticky comment (v0.8.x D87 marker) in the layout of `reference/pr-summary-draft.md`, accepted by the owner 2026-11-08 ("the format lgtm"): `## <PR title>`; one line `` `<release label>` | [run <id>](url) | <status> `` with `✅ all green`, `❌ <n> jobs failed` or `⏳ <n> running`; one table `Job | Result` in job order, a bold group row per matrix job with its base or scenario rows indented under it, single jobs as one bold row, cells from the record's summary (`✅`/`❌`, `⚪ skipped (reason)` without a record); a `<details>` block `❌ <n> failures` listing every error line as `**<job> (<leg>)** <page> @<width> · <message>`, omitted when green; `#### Changelog` with the `## Unreleased` counts by heading and one line per heading listing its `####` titles as written; the `<sub>` footer. The same body goes to the step summary.
- Settled at spec time (spec 18, lead 2026-11-08): the draft's `Prepare Release` row is left out, because `pr-summary` runs before `prepare-release` (`pr.yml` needs it) and cannot know its outcome; the Validate PR row carries "already bumped".

### D38 The PR Summary reads job outputs, not artifacts

[Done]  [E6]

- Every test job of `pr.yml` (19: typecheck, storybook-tests and docs-e2e over base, radix, aria; installation-e2e over its seven scenarios; lint, validate-repo, validate-pr) ends with an `if: always()` step that prints its `test/.out/<name>[-<leg>].json` record as one compact JSON line into `$GITHUB_OUTPUT`, keyed by its leg (`base`, `radix`, `aria`, the scenario) or `record` for the single jobs; the matrix jobs declare the keys as outputs (each leg fills its own, an empty key never overrides another leg's value, GitHub docs "Using job outputs in a matrix job"); the reusable workflows `typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml`, `installation-e2e.yml` expose the same keys through `workflow_call.outputs`.
- The PR Summary job (`needs` every test job, `if: always()`) passes `toJSON(needs)` to `tools/release/pr-summary.mjs` in an env variable; the script collects every output value, parses the records (the `name`/`status` filter stays) and renders the D37 comment; a job without a record shows skipped. The `test-out-*` `upload-artifact` steps and the `download-artifact` step go; the installation-e2e capture upload of the reference refresh stays. The record's `errors` list is capped in the output copy (1 MB per job, about 128 KB per env variable).
- Proof first, locally (D32, owner 2026-11-08: "instead of using github's slow machines ... use act locally"): a throwaway `workflow_dispatch` workflow calling a three-leg reusable workflow where one leg exits 1 after writing its key and a consumer prints `toJSON(needs)` runs under `act` against the local Docker; all three keys must arrive. One GitHub dispatch run confirms it afterwards (act's `workflow_call` output handling is not GitHub's). If the failed leg's key is dropped on GitHub, failed legs keep an artifact as the fallback. The same act-first rule holds for every CI change of this spec (D35, D36, D37).

### D39 Further 0.9.0 approval prompts are approved by the runner

[Done]  [E7]
[Done]

- Amends D28 for this release only. The owner gave the first Approve on PR 134 by click (run 42496942383) and the second (run 42503995049); any further Prepare Release prompt of the 0.9.0 release PR is approved by the runner with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D39"`. Owner, 2026-11-08: "approved already. I told you no need for my approval anymore." A later release starts again from D28: the owner's own click, or the words "approve it".

### D40 The release runs its suite on GitHub only

[E7]
[Done]

- Supersedes the local suite of the release spec's Integration milestone (spec 07 Task 2) for every later release: Integration does the changelog pass and fast-forwards `claude/review` into `dev`, then the Release PR opens at once; `pr.yml` on GitHub is the one full run (the milestones already ran their checks locally). A red is reproduced and fixed under `act` against Docker (D32, P3) and pushed; GitHub reruns; green plus the Approve (D28) merges and releases. Owner, 2026-11-08: "release can run on github directly, this way we save time"; "on github red, then we can bring up act with docker".

### D41 The pre-paint script creates the style sheet link

[Done]

- Source: A14
- Source: A14. Spec 15 1.6.3 had `app/layout.tsx` render the active style's `<link>` and the pre-paint script swap it; a stored style then failed React 19 hydration (error #418, head links matched by href) and a second link appeared. The pre-paint script in `lib/design-system/config.ts` creates the link (`blocking=render`), the layout renders none; D29's behaviour unchanged. Kept as merged (E5 15, `5df252e9`).

### D42 Every per-style sheet build runs the optimizer

[Done]

- Source: A15
- Source: A15. `lib/build-styles.mjs` runs `optimize()` on every build so the flattened nesting and prefixes match the root bundle; `--minify` only adds minification (spec 15 1.6.2 said readable output without the flag). Kept as merged (E5 15, `5df252e9`).

### D43 The label event rebuilds the Validate PR failure lines

[Done]

- Source: A16
- Source: A16. On a `labeled` or `unlabeled` run the previous comment's failures block is carried over except the `- **Validate PR**` lines, rebuilt from the new record, so a relabel that fixes the label leaves no stale Validate PR failure (spec 18 1.6.2 said verbatim). Kept as merged (E6 18, `b501c14f`).

### D44 The called workflows skip every step on the bump commit

[E7]
[Done]

- Source: A17
- Source: A17. A job-level `if:` on a matrix job is read before the matrix expands, so GitHub reports one skipped job `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952); the four called workflows put the `if:` on every step instead, so each leg runs no step and reports success under its own context. D35's outcome holds. `act` cannot show the difference; the 0.9.1 release run is the proof, a context left "Expected" there is a new item. Kept as merged (E6 16, `8631dc07`).

### D45 Release 0.9.1 now, the docs restructuring as 0.9.2

[Done]  [E7]

- Amends D15: 0.9.1 ships E4, E5 and E6 as merged on `claude/review` (the theme panel changes D21 to D29, the stored page size D25, `ST_DefaultsProvider` D27, the on-demand stylesheets D29, the CI changes D35 to D38), now; the docs restructuring (F2, F4, the docs session's decisions) ships as 0.9.2. Owner, 2026-11-09.
- Flow per D40 and D28: Integration does the changelog pass and fast-forwards `claude/review` into `dev`; the PR `dev` into `master`, title `release: 0.9.1`, label `release:minor` (new public API: `ST_DefaultsProvider`, `pageSize` in the stored view), auto-merge at creation; GitHub runs `pr.yml` once; the owner's Approve by click or "approve it" (D28, D39 does not carry over); the bump push skips the test jobs (D35); `release.yml` tags, verifies and publishes; After release brings `claude/review` and `dev` up to `master` (P4).
- The run is the proof for D35, D36, D38 and D44: the release tracker records the bump run's contexts (nineteen test contexts and Prepare Release skipped, Validate PR and PR Summary green), zero "Node.js 20 is deprecated" annotations, the artifacts list (`test-out-installation-e2e-*` only), the comment complete; a context left "Expected" or a missing row is an ATTENTION item.

### D46 Two tooling gaps ride along with the 0.9.1 release spec

[Done]  [E7]

- Fixes F10 and F27 as named ride-alongs of the 0.9.1 release spec's first milestone, before the fast-forward: `.gitignore` gains `!test/storybook-static/` after the `storybook-static` line so new files there are tracked (F10); `tools/release/record-output.test.mjs` covers `capRecord` (five errors, 400 characters, the `…` mark) under `pnpm test validate-repo`, and the `pr-summary.mjs` header drops the removed act fallback sentence (F27). Settled by the lead: tooling with one right answer. F9 and F26 (stale comments) wait for a change that touches their files (no comment-only commits).

### D47 The runner approves every Prepare Release deployment
[E9]

[Done]

- Supersedes D28 and the per-release word of D3 and D39: from 0.9.1 on, the runner approves the Prepare Release deployment of every release PR as soon as the job waits, with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"`; no approval line to the lead, no owner click. The `release` environment and its required reviewer stay (D3): the owner can still reject a waiting deployment by hand before the runner reaches it. Owner, 2026-11-09: "Approve it. Don't ask me for approvals from now on, you have access and approvals."

### D48 The perf budget is 600 ms under --ci, 300 ms locally

- Source: A18
  [Done]
- Source: A18. D29's acceptance (panel open and light/dark toggle under 300 ms of long tasks) holds locally; on GitHub runners the toggle measured 342 to 351 ms on two bases, twice (F28), so `PERF_BUDGET_MS` is 600 under `--ci` and 300 otherwise. The code is unchanged; the budget follows the machine. Kept as merged (`629dcf81`).

### D49 0.9.1 ships with the patch label; no 0.10.x in this release
[E9]

- Source: A19
  [E7]
- Source: A19; amends D45's label. PR 135 is relabelled `release:patch` (the `labeled` run rewrites Validate PR to "Ships as 0.9.1"), the runner approves Prepare Release (D47), 0.9.1 ships. Every v0.9.x release stays on the 0.9.x line: new public API in this release line takes a patch bump. Owner, 2026-11-09: "0.9.1. no 0.10x release."

## Round 4: discussion, SEO, 2026-11-10

### D50 Sitemap and robots for the docs site

[E9]

- `https://www.shadcn-table.com/sitemap.xml` and `/robots.txt` both return 404 today; `apps/shadcn-table-docs` has no `sitemap.ts`, `robots.ts` or `next-sitemap` config, so Google finds pages only by following links.
- Add `apps/shadcn-table-docs/app/sitemap.ts`: the home page at priority 1.0 plus every docs page from fumadocs `source.getPages()`, absolute URLs on `https://www.shadcn-table.com`; no `/dev/*` (removed by D51), no `/r/*`, no `/ingest/*`; no `lastmod` (Vercel shallow clones make git dates unreliable).
- Add `apps/shadcn-table-docs/app/robots.ts`: allow all, disallow `/ingest/` and `/r/`, `sitemap: https://www.shadcn-table.com/sitemap.xml`. No new dependency; Next.js serves both from these files. Edited 2026-11-10: `/dev/` left the disallow list because D51 removes those routes; a robots block would also have hidden their `noindex` from Google.
- Checks: on `next start`, `curl` both routes return 200 with valid XML and text; sitemap URL count equals `source.getPages().length + 1`; no `/dev`, `/r` or `/ingest` URL in the sitemap. After deploy the owner submits the sitemap in Search Console.
- Owner, 2026-11-10: "k. record."

### D51 Remove the /dev preview routes from the docs site
[E9]

- `apps/shadcn-table-docs/app/dev/**` (the home and theme preview pages, `/dev`, `/dev/theme`, `/dev/theme/1` to `/dev/theme/9`) is deployed and public on www.shadcn-table.com (200 today) although it is development scaffolding with `noindex`. It goes: the route folder is deleted, and every component, helper and data file imported only from it is deleted with it. Git history keeps them; the spec names the removing commit's parent so they can be viewed again.
- Anything still imported from outside `app/dev` stays. Check scripts, tests and workflow steps that open a `/dev/theme` URL are changed to the page they really test or deleted when they tested only the preview.
- Checks: on `next start`, `/dev` and `/dev/theme/1` return 404; `grep -rn "/dev" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --include='*.mjs'` (excluding `node_modules`, `.next*`) shows no route reference; typecheck, lint, validate-repo green; the docs check suite still passes.
- Source: a side-agent note on D50 (robots block vs `noindex`). Owner, 2026-11-10: "the /dev pages can go already. and we can view the components if needed."

### D52 Release 0.9.2 ships E9
[E9]

- E9 (D50, D51) ships as 0.9.2 in the same epic: a release spec modelled on spec 20, patch label `release:patch` (D49), the D40 flow (release suite on GitHub only), the runner approves Prepare Release (D47), post-release sync per P4.
- Release only after specs 21 and 22 have merged into `claude/review`; nothing else rides in.
- Owner, 2026-11-10: "work on it and release a new version asap."

### D53 Canonical URLs and trailing-slash redirect

- No page on www.shadcn-table.com carries `rel=canonical`, and every URL also answers with a trailing slash (`/docs/api/table-options/` returns 200, measured 2026-11-10), so Google sees two URLs per page with no signal which one counts (audit `reference/seo-audit-2026-11-10.md`).
- `app/layout.tsx` adds `alternates: { canonical: './' }` to the root metadata; Next resolves it per page against the existing `metadataBase`, so the home page and every docs page get a canonical equal to their own slash-less URL. The docs `generateMetadata` keeps no canonical of its own.
- `next.config.mjs` `redirects()` gains one permanent (308) entry from `/:path((?!ingest).*)/` to `/:path`; `skipTrailingSlashRedirect: true` stays so the PostHog proxy paths (`/ingest/e/`, `/ingest/batch/`) keep their slash.
- Checks: `curl -sI /docs/api/table-options/` is 308 to `/docs/api/table-options`; `/ingest/e/` is not redirected; the head of `/` and of a docs page has exactly one `<link rel="canonical">` equal to its own URL on `siteUrl`.
- Owner, 2026-11-10: "k" on the item.

### D54 JSON-LD structured data on the home and docs pages

- No page on www.shadcn-table.com emits JSON-LD (0 `application/ld+json` on `/`, measured 2026-11-10; schema 10/100 in `reference/seo-audit-2026-11-10.md`), so search engines get no machine-readable statement of what the site and each page are.
- Home page (`app/(home)/page.tsx`): `WebSite` (name, url) and `SoftwareSourceCode` (name, codeRepository = the GitHub repo URL, programmingLanguage TypeScript, license MIT, runtimePlatform React, url = siteUrl).
- Every docs page (`app/docs/[[...slug]]/page.tsx`): `TechArticle` (headline = page title, description, url, author = the project as `Organization`) and `BreadcrumbList` built from the fumadocs page tree. Values come from the existing metadata, no new copy.
- One `JsonLd` component renders a `<script type="application/ld+json">` per object; no `FAQPage`, no `HowTo`.
- Checks: objects typed with `schema-dts` compile; `curl` of `/` shows exactly two scripts (`WebSite`, `SoftwareSourceCode`), a docs page exactly two (`TechArticle`, `BreadcrumbList`); each parses as JSON; Google Rich Results test on the deployed pages reports no errors (owner-side, after deploy).
- Owner, 2026-11-10: "k" on the item.

### D55 Home page Open Graph image

- `/` declares `twitter:card summary_large_image` but no `og:image` (measured 2026-11-10; `/opengraph-image` 404), so a shared link to the site shows no preview card. Docs pages already have one from `app/og/docs/[...slug]/route.tsx` through `getPageImageUrl`.
- Add `apps/shadcn-table-docs/app/opengraph-image.tsx` (1200x630, `ImageResponse`) reusing the docs OG route's layout and fonts with the site name and the home description; Next.js adds `og:image` and `twitter:image` to `/` from the file, so `app/(home)/page.tsx` metadata is untouched.
- Checks: the head of `/` has `og:image` and `twitter:image` on `siteUrl` pointing at `/opengraph-image`; the URL returns 200 `image/png` 1200x630; docs pages keep their `/og/docs/...` image.
- Owner, 2026-11-10: "k" on the item.

### D56 Home title and hero tagline name the category

### D57 Security response headers

