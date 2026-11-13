# v0.9.x decisions

## Round 1: discussion, 2026-11-07

### D1 The select filter's clear button sits right of the chevron

[Done]  [E1]

- Fixes Q1. In the three `ST_FilterTextField.tsx`, the select trigger's `pe-9` becomes `pr-9`, so tailwind-merge drops the base `pr-2` and the chevron moves left of the overlaid clear x.
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
- The compact footer's value is `paginationDisplayMode: 'compact'`; `'default'` is removed from the option type and the branch, no alias (no users yet). The stories, guide, API page and examples that say "default" for it are a separate item (Q5, Q7).
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

- Fixes Q5 and Q7, applies D6's rename. Every `'default'` for `paginationDisplayMode` becomes `'compact'`: the type `features/stConfigFeature.ts:391` and the branch `ST_TablePagination.tsx` (radix `:278`, base `:294`, aria `:281`) in the three bases; the docs-app copies follow by sync and `public/r/*.json` by regeneration (P9); `guides/pagination.mdx:104,110`, `guides/best-practices.mdx:199`, the API entry `lib/prop-tables/tableOptions.ts:1827-1835`, the example `alternate-pagination/TS.tsx:13` in three bases, `test/docs-e2e/lib/guides.mjs:139`, the stories `TableProvider.stories.tsx:63,169,218,224`, `NestedTable.stories.tsx:89,99`, `RowPinningOnSelect.stories.tsx:66,282,332`; a new CHANGELOG entry, the old `:122` stays.
- Story names: the compact story `PaginationEnabledDefaultMoreData` (`Pagination.stories.tsx:60`) becomes `PaginationCompactMoreData`; the four stock-settings stories drop "Default": `PaginationEnabled` (`:56`), `PaginationEnabledBigData` (`:103`), `PaginationEnabledBigDataLanguage` (`:116`), `PaginationEnabledNoRowsPerPage` (`:133`). Titles follow the export names; the story ids change and no docs link points at them.
- The guide and the API entry state that `'pages'` is the default and `'compact'` the alternative; no page calls the compact footer the default.
- The next-app demo's stale copy (`test-projects/next-app/.../useST_TableOptions.ts:84`) is the owner's, outside the run (D34).

### D8 The static Storybook resets each story after its play

[Done]  [E2]

- Fixes Q6. The static builds (`/base/`, `/radix/`, `/aria/`) reset a story after its play: `.storybook/main.ts` injects `window.__ST_STATIC__ = true` into the preview head only when `configType === 'PRODUCTION'`; `.storybook/preview.tsx` adds a project-level `afterEach` that bumps a counter and a `ResetAfterPlay` keyed wrapper inside the existing decorator, so React remounts the story with fresh state. The play does not rerun; the Interactions panel keeps its steps and PASS; Rerun runs the play and resets again. Previewed on the Base static build (worktree 01, port 5342) and accepted. Owner, 2026-11-08.
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

- Source: Q37. The `resetColumnSizeAnimated` listener in `shared/utils/column.utils.ts` (three bases) removes itself on the first `transitionend` whose `propertyName` is `width` or `min-width`, not on the first event of any kind: button color transitions bubble to the table first and `{ once: true }` would leave `data-size-resetting` stuck. No timer; the D5 behaviour is unchanged. Kept as merged (E1 03, `54a51ee3`).

### D11 The select trigger pads with `ltr:pr-9 rtl:pl-9`

[Done]

- Source: Q38. D1 named `pr-9`; the merged code uses `ltr:pr-9 rtl:pl-9` because `pnpm test validate-repo` rejects a physical padding class, and spec 01 requires that check green. The chevron sits left of the clear button in both directions. Kept as merged (E1 01, `4a61e251`).

### D12 Removing a filter chip returns the column to its initial filter mode

[Done]

- Source: Q39. With modes on by default (D4), the old reset to the first listed mode turned a multi-select column into `fuzzy` and a select column away from `equals` after one chip removal; the merged code resets to `table.initialState.columnFilterFns`, or the first listed mode only when the initial one is not offered. Kept as merged (E1 01, `4a61e251`, `ST_FilterOptionMenu.tsx`, `filterSummary.utils.ts`).

### D13 The multi-select mode labels read Includes any, Includes all, Excludes in every locale

[Done]

- Source: Q40. `filterArrIncludesSome` and `filterArrIncludesAll` already existed; the builder rewrote them to D4's wording in every locale and added `filterArrIncludesNone`; eleven locales had an imperative ("include everything") that became the descriptive label. Kept as merged (E1 01, `4a61e251`, `shared/locales/*.ts`).

### D14 Two more known flakes

[Done]

- Fixes Q8. `ClickToCopy` "Click Copies Value" (base, radix) and `RowOrdering` "Drag Reorders Rows" (aria, 90 s timeout) time out under machine load and pass alone; they join the P5 known-flake list, rerun once before a check is called red.

### D15 (superseded by D28) (superseded by D45) Release 0.9.0 after E2

[Done]  [E3]

- A release spec (07, epic E3, depends on E2) ships 0.9.0 with E1, E2 and the Q3 fix: the integration milestone fast-forwards `claude/review` into `dev` once and runs the suite there; then one PR `dev` into `master` with the label `release:minor`, auto-merge enabled at creation; `release.yml` tags, verifies the deploy and publishes. Supersedes the P4 bullet "no release is planned".
- Superseded by D28 (the runner does not approve). The owner approved the 0.9.0 Prepare Release deployment in advance (2026-11-08: "you can approve it now"), the per-release word D3 requires; the runner approves it with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments` when the job waits. Any later release needs a fresh word.
- The docs changes are not in 0.9.0; they ship as 0.9.1 after the docs discussion.

### D16 The `release` environment keeps admin bypass

[Done]

- Source: Q41. The environment created by spec 05 (`aeca4d55`) keeps GitHub's default `can_admins_bypass: true`; the owner is the repository's only admin, so nobody else can merge past the Approve. Kept as created; no extra PUT.

## Round 3: triage E2, 2026-11-08

### D17 The sheet part is installed into the docs only

[Done]

- Source: Q42. `sheet` is listed in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs` (as `alert-dialog` is), so `pnpm lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base; the registry gains no part the library does not use. Kept as merged (E2 04, `161c5ae6`).

### D18 `@tanstack/react-hotkeys` stays a caret range

[Done]

- Source: Q43. `^0.22.0` in `apps/shadcn-table-docs/package.json`, the convention of the other dependencies there; the lockfile pins the installed build. Kept as merged (E2 04, `161c5ae6`).

### D19 The home demo label reads the design system store

[Done]

- Source: Q45. `no-step-3.tsx` reads the current preset from `useDesignSystem()`, the store the panel writes, so every pick (panel, shortcut, cycle button) updates the label; no MutationObserver on `data-design-system`. The D2 behaviour is unchanged. Kept as merged (E2 04, `161c5ae6`).

### D20 The docs dev server loads clean

[Done]  [E2]

- Fixes Q11. The runner runs `pnpm --filter shadcn-table-docs dev` on an agent port, loads `/`, `/docs` and one example page, reads the server and browser logs, and fixes each logged error or warning at its root cause (v0.8.x D34 style: no suppression, no `suppressHydrationWarning` blanket).
- The hotkeys label: formatted only in the browser, or with the platform read from the request (`detectPlatform(userAgent)`) and set on the hotkeys provider, whichever the library's SSR guide names; the kbd hints stay (D2).
- The hydration mismatch on the home page: the attribute located from the browser log and its server and client values made equal.
- Acceptance: the same three loads log nothing from TanStack Hotkeys and no hydration mismatch, recorded in the tracker; `pnpm test docs-e2e --base base` green. Owner, 2026-11-08: fix now, before the release.

### D21 Copy and Import leave the theme panel

[Done]  [E4]

- Fixes Q18, amends D2. The `CopyMenu` (Copy CSS, Copy preset code, `theme-customizer.tsx:490-519`, used at `:146`) and `ImportPreset` (`:522-576`, used at `:275`) are removed, with `importPreset` (`design-system-provider.tsx:185`), `encodeConfig` and `decodeConfig` (`config.ts:501,518`) and the preset-code format they share; Random, the preset select, the tabs and every other D2 control stay. Owner, 2026-11-08: "Unnecessary items, remove them."

### D22 One shortcut row at the top of the theme panel

[Done]  [E4]

- Fixes Q19, Q12, Q17; amends D2's layout and keys. One row directly under the header, in Copy's former slot (D21), holds five buttons: Reset `Shift+R`, Undo `Mod+Z`, Redo `Mod+Shift+Z`, Random `R`, Next preset `C` (`Mod` is Cmd on macOS, Ctrl on Windows and Linux; the label comes from the client platform, D20). `P` for undo goes.
- Labeled buttons with their kbd hint when the row fits the panel width; when it does not, icon buttons with a tooltip that carries the label and the kbd hint. The header keeps the title and the close button only (the icon-only reset at `theme-customizer.tsx:133-141` and its hint go); the Presets row keeps the select alone (Random at `:292` and the `C` hint under the select move up).
- Keys registered in `design-system-provider.tsx:193-198`, scope and guards unchanged (D2).

### D23 Each color swatch opens a picker

[Done]  [E4]

- Fixes Q13. In the Colors tab each token's swatch (`theme-customizer.tsx:631-638`, a static span today) becomes a button that opens a Popover holding `react-colorful`'s `HexColorPicker` above the existing text input; dragging in the picker writes the token live, and Undo records one step per Popover close (the per-keystroke undo of Q46 stays for typed values). `react-colorful` is one new dependency of the docs app, added by the first milestone of the epic that ships this (P6).

### D24 The persistent view example starts at ten rows

[Done]  [E4]

- Fixes Q14. `initialState.pagination.pageSize` becomes 10 in `apps/shadcn-table-docs/examples/{radix,base,aria}/persistent-view/TS.tsx:344`; the stored view (`viewSettingsStorage.utils.ts`) keeps not persisting pagination, so a visitor's page size choice still resets on reload. No library change.

### D25 The stored view persists rows per page

[Done]  [E4]

- `ST_StoredView` (`shared/utils/viewSettingsStorage.utils.ts:7-16`, three bases) gains `pageSize?: number`; the persist path saves it on every page size change and the restore path applies it at mount over `initialState.pagination.pageSize`. Page index is not stored. Old stored views without the field stay valid. Public surface (P7): the view settings guide and the API entry for `persistViewSettings` list the new field; a CHANGELOG entry.
- One play changes the page size, remounts the table and asserts the size held; it runs on the shipped code first and must fail there (P11).
- D24 stays: the persistent view example starts at 10 and a visitor's choice now survives reload.

### D26 Style, Menu Color and Menu Accent take effect in the docs

[Done]  [E4]

- Source: Q44
- The docs parts in `apps/shadcn-table-docs/components/ui-<base>/` (three bases) are regenerated through `lib/install.mjs` with the preset that emits the `cn-*` hooks (`cn-menu-target` and the rest the design system's style layers in `lib/design-system/*` target, as the next-app reference's parts carry them); the library's own table parts under `shadcn-table/` are untouched. Owner, 2026-11-08: "No, they should work."
- Acceptance: `pnpm test docs-e2e --base base` green, plus one check that picking a Style and a Menu Color changes a docs menu's computed style; a check that fails on the shipped parts first (P11).
- Mechanism settled at spec time (spec 13, lead 2026-11-08): `shadcn add` cannot emit the hooks (ui.shadcn.com serves the parts resolved, and the CLI's `transformMenu` strips `cn-menu-target`, measured on 4.22.0 and 4.23.0), so `lib/install.mjs` gains a second phase that fetches the hooked sources from shadcn-ui/ui `apps/v4/registry/bases/<base>/ui/` at a pinned commit and rewrites their imports; the decided behaviour is unchanged.

### D27 The Icon Library select switches the example tables' icons

[Done]  [E5]

- Fixes Q16; supersedes v0.7.x D38 "Lucide only" for the docs. The select (`theme-customizer.tsx:207-214`, disabled today) picks lucide, hugeicons, tabler, phosphor or remixicon; every docs example table shows that set; the docs chrome (nav, panel, shadcn parts) stays Lucide. Reset returns to lucide; the choice persists with the rest of the config (D2).
- Mechanism, library side: the docs copies under `components/ui-<base>/shadcn-table/` are written by `lib:install` from the registry and carry no shared hook, and every example calls `useST_TableOptions` itself, so the library gains a defaults provider (`ST_DefaultsProvider`, three bases) whose `icons` the hook merges beneath the per-table `icons` option (`useST_TableOptions.ts:114`: defaults, then provider, then the table's own). Public surface (P7): API entry, the icons guide, a CHANGELOG entry; one story with a play.
- Docs side: the provider wraps the examples with the set the theme config names; `hugeicons`, `tabler`, `phosphor` and `remixicon` packages become docs dependencies (P6); the registry's `icons/<lib>.ts` files are installed into the docs copies by `lib:install`.

### D28 (superseded by D47) The 0.9.0 release waits for the owner's manual approval

[E7]
[Done]

- Supersedes D15's advance approval. No agent approves the Prepare Release deployment of the 0.9.0 release PR, not in the UI and not through `gh api .../pending_deployments`; D3's rule stands in full. The run opens the PR, posts "Prepare Release waits for your approval" and stops there; the owner approves with a click. Owner, 2026-11-08: "There are way too many breaking items that we are changing, so stop the release before my manual approval."

### D29 Only the active style's stylesheet loads

[Done]  [E5]

- Fixes Q15. `app/global.css:9-16` stops importing the eight `styles/style-*.css` files; each style is its own CSS asset and only the active one is linked: the pre-paint script links the stored or default style's sheet before first paint, and a style change swaps the link and applies the class once the new sheet has loaded, so nothing flashes unstyled. The eight files themselves and the `.cn-*` layers stay as they are (spec 13 relies on them).
- Measured 2026-11-08, same machine, commit `546bcabd` against `claude/review`: root stylesheet 351 KB to 2,755 KB; warm `/` usable at 1.3 s to 2.8 s; persistent view 1.6 s to 5.6 s; panel open one 1.1 to 1.3 s long task; light/dark toggle style recalc 81 ms to 476 ms. JS unchanged.
- Acceptance: the root stylesheet of `/` within 10 percent of the 351 KB baseline plus the one active style sheet; opening the panel and toggling light/dark each under 300 ms of long task in the docs E2E harness, measured against the shipped code first (P11); every page green in `pnpm test docs-e2e --base base`.
- Runs after spec 13 (E4) has merged, so the on-demand sheet is tested with the hooked parts.

### D30 The installation reference refresh merges into dev directly

[Done]

- Source: Q48
- Source: Q48. The fix milestone `refresh-installation-references` (Q20: the six `test/installation-e2e/fixtures/reference/<base>/default-{light,dark}.png` taken after D6's footer range) is cut from `dev` at `df90bd27` and merged into `dev` directly with a merge commit, then into `claude/review`; `dev` is not fast-forwarded from `claude/review` again for 0.9.0, so the E4 and E5 merges stay out of it (D15). The one exception to P1 for this release; a later release returns to the fast-forward.

### D31 Random keeps its curated presets through a private decoder

[Done]

- Source: Q47
- Source: Q47. D21 removed the preset-code codec; the Random button (kept by D21) decoded its curated `SHUFFLE_PRESETS` with it, so the builder kept a private `curatedPreset` decoder and a `sameLook` field compare in `lib/design-system/config.ts`; `decodePreset` from `shadcn/preset` stays imported, nothing user-facing changes. Kept as merged (E4 08, `9d582dcd`).

### D32 A CI-only red is reproduced and fixed under act before it merges

[Done]  [E3]

- A check that is red on GitHub Actions and green on the local macOS run (a Linux-only failure, such as the docs E2E `/` theme checks of Q23 and Q24) is reproduced locally with `act` against the local Docker (`act pull_request -W .github/workflows/pr.yml -j <job>` with the matrix narrowed to the red base) and the fix is confirmed green there before it merges into `dev`; the GitHub run is the confirmation, not the loop. Owner, 2026-11-08: "You can run them locally and fix them quickly, then do the pr"; "I have Docker and we discussed about using tools like act". Narrows process.md P3 ("never required") for the Linux-only case.

### D33 The page index restore gets its red-first play

[Done]

- Source: Q49
- Source: Q49. The Q22 fix (`811045dc`) merged without a play that fails on the shipped code (P11). A fix milestone adds a `Persistence` play variant in `packages/shadcn-table/stories/features/ViewSettings.stories.tsx` with `initialState.pagination.pageIndex: 2` and a stored rows-per-page, asserting the page index holds after remount; red at `117a81b5`, green at `811045dc`, the two lines in its tracker; three bases through `pnpm test storybook-tests --base <base>`. Settled by the lead: a coverage gap, no behaviour change.

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

- Source: Q50
- Source: Q50. Spec 15 1.6.3 had `app/layout.tsx` render the active style's `<link>` and the pre-paint script swap it; a stored style then failed React 19 hydration (error #418, head links matched by href) and a second link appeared. The pre-paint script in `lib/design-system/config.ts` creates the link (`blocking=render`), the layout renders none; D29's behaviour unchanged. Kept as merged (E5 15, `5df252e9`).

### D42 Every per-style sheet build runs the optimizer

[Done]

- Source: Q51
- Source: Q51. `lib/build-styles.mjs` runs `optimize()` on every build so the flattened nesting and prefixes match the root bundle; `--minify` only adds minification (spec 15 1.6.2 said readable output without the flag). Kept as merged (E5 15, `5df252e9`).

### D43 The label event rebuilds the Validate PR failure lines

[Done]

- Source: Q52
- Source: Q52. On a `labeled` or `unlabeled` run the previous comment's failures block is carried over except the `- **Validate PR**` lines, rebuilt from the new record, so a relabel that fixes the label leaves no stale Validate PR failure (spec 18 1.6.2 said verbatim). Kept as merged (E6 18, `b501c14f`).

### D44 The called workflows skip every step on the bump commit

[E7]
[Done]

- Source: Q53
- Source: Q53. A job-level `if:` on a matrix job is read before the matrix expands, so GitHub reports one skipped job `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952); the four called workflows put the `if:` on every step instead, so each leg runs no step and reports success under its own context. D35's outcome holds. `act` cannot show the difference; the 0.9.1 release run is the proof, a context left "Expected" there is a new item. Kept as merged (E6 16, `8631dc07`).

### D45 Release 0.9.1 now, the docs restructuring as 0.9.2

[Done]  [E7]

- Amends D15: 0.9.1 ships E4, E5 and E6 as merged on `claude/review` (the theme panel changes D21 to D29, the stored page size D25, `ST_DefaultsProvider` D27, the on-demand stylesheets D29, the CI changes D35 to D38), now; the docs restructuring (Q2, Q4, the docs session's decisions) ships as 0.9.2. Owner, 2026-11-09.
- Flow per D40 and D28: Integration does the changelog pass and fast-forwards `claude/review` into `dev`; the PR `dev` into `master`, title `release: 0.9.1`, label `release:minor` (new public API: `ST_DefaultsProvider`, `pageSize` in the stored view), auto-merge at creation; GitHub runs `pr.yml` once; the owner's Approve by click or "approve it" (D28, D39 does not carry over); the bump push skips the test jobs (D35); `release.yml` tags, verifies and publishes; After release brings `claude/review` and `dev` up to `master` (P4).
- The run is the proof for D35, D36, D38 and D44: the release tracker records the bump run's contexts (nineteen test contexts and Prepare Release skipped, Validate PR and PR Summary green), zero "Node.js 20 is deprecated" annotations, the artifacts list (`test-out-installation-e2e-*` only), the comment complete; a context left "Expected" or a missing row is an ATTENTION item.

### D46 Two tooling gaps ride along with the 0.9.1 release spec

[Done]  [E7]

- Fixes Q10 and Q27 as named ride-alongs of the 0.9.1 release spec's first milestone, before the fast-forward: `.gitignore` gains `!test/storybook-static/` after the `storybook-static` line so new files there are tracked (Q10); `tools/release/record-output.test.mjs` covers `capRecord` (five errors, 400 characters, the `…` mark) under `pnpm test validate-repo`, and the `pr-summary.mjs` header drops the removed act fallback sentence (Q27). Settled by the lead: tooling with one right answer. Q9 and Q26 (stale comments) wait for a change that touches their files (no comment-only commits).

### D47 The runner approves every Prepare Release deployment
[E9]

[Done]

- Supersedes D28 and the per-release word of D3 and D39: from 0.9.1 on, the runner approves the Prepare Release deployment of every release PR as soon as the job waits, with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"`; no approval line to the lead, no owner click. The `release` environment and its required reviewer stay (D3): the owner can still reject a waiting deployment by hand before the runner reaches it. Owner, 2026-11-09: "Approve it. Don't ask me for approvals from now on, you have access and approvals."

### D48 The perf budget is 600 ms under --ci, 300 ms locally

- Source: Q54
  [Done]
- Source: Q54. D29's acceptance (panel open and light/dark toggle under 300 ms of long tasks) holds locally; on GitHub runners the toggle measured 342 to 351 ms on two bases, twice (Q28), so `PERF_BUDGET_MS` is 600 under `--ci` and 300 otherwise. The code is unchanged; the budget follows the machine. Kept as merged (`629dcf81`).

### D49 0.9.1 ships with the patch label; no 0.10.x in this release
[E9]

- Source: Q55
  [E7]
- Source: Q55; amends D45's label. PR 135 is relabelled `release:patch` (the `labeled` run rewrites Validate PR to "Ships as 0.9.1"), the runner approves Prepare Release (D47), 0.9.1 ships. Every v0.9.x release stays on the 0.9.x line: new public API in this release line takes a patch bump. Owner, 2026-11-09: "0.9.1. no 0.10x release."

## Round 4: discussion, SEO, 2026-11-10

### D50 Sitemap and robots for the docs site

[Done]  [E9]

- `https://www.shadcn-table.com/sitemap.xml` and `/robots.txt` both return 404 today; `apps/shadcn-table-docs` has no `sitemap.ts`, `robots.ts` or `next-sitemap` config, so Google finds pages only by following links.
- Add `apps/shadcn-table-docs/app/sitemap.ts`: the home page at priority 1.0 plus every docs page from fumadocs `source.getPages()`, absolute URLs on `https://www.shadcn-table.com`; no `/dev/*` (removed by D51), no `/r/*`, no `/ingest/*`; no `lastmod` (Vercel shallow clones make git dates unreliable).
- Add `apps/shadcn-table-docs/app/robots.ts`: allow all, disallow `/ingest/` and `/r/`, `sitemap: https://www.shadcn-table.com/sitemap.xml`. No new dependency; Next.js serves both from these files. Edited 2026-11-10: `/dev/` left the disallow list because D51 removes those routes; a robots block would also have hidden their `noindex` from Google.
- Checks: on `next start`, `curl` both routes return 200 with valid XML and text; sitemap URL count equals `source.getPages().length + 1`; no `/dev`, `/r` or `/ingest` URL in the sitemap. After deploy the owner submits the sitemap in Search Console.
- Owner, 2026-11-10: "k. record."

### D51 Remove the /dev preview routes from the docs site
[Done]  [E9]

- `apps/shadcn-table-docs/app/dev/**` (the home and theme preview pages, `/dev`, `/dev/theme`, `/dev/theme/1` to `/dev/theme/9`) is deployed and public on www.shadcn-table.com (200 today) although it is development scaffolding with `noindex`. It goes: the route folder is deleted, and every component, helper and data file imported only from it is deleted with it. Git history keeps them; the spec names the removing commit's parent so they can be viewed again.
- Anything still imported from outside `app/dev` stays. Check scripts, tests and workflow steps that open a `/dev/theme` URL are changed to the page they really test or deleted when they tested only the preview.
- Checks: on `next start`, `/dev` and `/dev/theme/1` return 404; `grep -rn "/dev" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --include='*.mjs'` (excluding `node_modules`, `.next*`) shows no route reference; typecheck, lint, validate-repo green; the docs check suite still passes.
- Source: a side-agent note on D50 (robots block vs `noindex`). Owner, 2026-11-10: "the /dev pages can go already. and we can view the components if needed."

### D52 Release 0.9.2 ships E9
[Done]  [E9]

- E9 (D50, D51) ships as 0.9.2 in the same epic: a release spec modelled on spec 20, patch label `release:patch` (D49), the D40 flow (release suite on GitHub only), the runner approves Prepare Release (D47), post-release sync per P4.
- Release only after specs 21 and 22 have merged into `claude/review`; nothing else rides in.
- Owner, 2026-11-10: "work on it and release a new version asap."

### D53 Canonical URLs and trailing-slash redirect
[Done]  [E10]

- No page on www.shadcn-table.com carries `rel=canonical`, and every URL also answers with a trailing slash (`/docs/api/table-options/` returns 200, measured 2026-11-10), so Google sees two URLs per page with no signal which one counts (audit `reference/seo-audit-2026-11-10.md`).
- `app/layout.tsx` adds `alternates: { canonical: './' }` to the root metadata; Next resolves it per page against the existing `metadataBase`, so the home page and every docs page get a canonical equal to their own slash-less URL. The docs `generateMetadata` keeps no canonical of its own.
- `next.config.mjs` `redirects()` gains one permanent (308) entry from `/:path((?!ingest).*)/` to `/:path`; `skipTrailingSlashRedirect: true` stays so the PostHog proxy paths (`/ingest/e/`, `/ingest/batch/`) keep their slash.
- Checks: `curl -sI /docs/api/table-options/` is 308 to `/docs/api/table-options`; `/ingest/e/` is not redirected; the head of `/` and of a docs page has exactly one `<link rel="canonical">` equal to its own URL on `siteUrl`.
- Owner, 2026-11-10: "k" on the item.

### D54 JSON-LD structured data on the home and docs pages
[Done]  [E10]

- No page on www.shadcn-table.com emits JSON-LD (0 `application/ld+json` on `/`, measured 2026-11-10; schema 10/100 in `reference/seo-audit-2026-11-10.md`), so search engines get no machine-readable statement of what the site and each page are.
- Home page (`app/(home)/page.tsx`): `WebSite` (name, url) and `SoftwareSourceCode` (name, codeRepository = the GitHub repo URL, programmingLanguage TypeScript, license MIT, runtimePlatform React, url = siteUrl).
- Every docs page (`app/docs/[[...slug]]/page.tsx`): `TechArticle` (headline = page title, description, url, author = the project as `Organization`) and `BreadcrumbList` built from the fumadocs page tree. Values come from the existing metadata, no new copy.
- One `JsonLd` component renders a `<script type="application/ld+json">` per object; no `FAQPage`, no `HowTo`.
- Checks: objects typed with `schema-dts` compile; `curl` of `/` shows exactly two scripts (`WebSite`, `SoftwareSourceCode`), a docs page exactly two (`TechArticle`, `BreadcrumbList`); each parses as JSON; Google Rich Results test on the deployed pages reports no errors (owner-side, after deploy).
- Owner, 2026-11-10: "k" on the item.

### D55 Home page Open Graph image
[Done]  [E10]

- `/` declares `twitter:card summary_large_image` but no `og:image` (measured 2026-11-10; `/opengraph-image` 404), so a shared link to the site shows no preview card. Docs pages already have one from `app/og/docs/[...slug]/route.tsx` through `getPageImageUrl`.
- Add `apps/shadcn-table-docs/app/opengraph-image.tsx` (1200x630, `ImageResponse`) reusing the docs OG route's layout and fonts with the site name and the home description; Next.js adds `og:image` and `twitter:image` to `/` from the file, so `app/(home)/page.tsx` metadata is untouched.
- Checks: the head of `/` has `og:image` and `twitter:image` on `siteUrl` pointing at `/opengraph-image`; the URL returns 200 `image/png` 1200x630; docs pages keep their `/og/docs/...` image.
- Owner, 2026-11-10: "k" on the item.

### D56 Home title and hero tagline name the category
[Done]  [E10]

- The home page `<title>`, `og:title` and H1 are the bare word "shadcn-table" and the searched phrases ("shadcn data table", "tanstack table shadcn") appear nowhere on the site (audit 2026-11-10, on-page 56/100), so the page competes only for its own name.
- Root metadata `title.default` becomes `shadcn-table: data table for shadcn/ui, built on TanStack Table`; the template `%s | shadcn-table` for docs pages stays. The H1 stays "shadcn-table"; the hero tagline under it carries the phrase "data table for shadcn/ui" once. Docs titles are untouched (D60 covers descriptions).
- Checks: `curl` of `/` shows the new `<title>` and `og:title`; a docs page title still ends in `| shadcn-table`; the hero renders the tagline; docs-e2e green.
- Owner, 2026-11-10: "recommended on all".

### D57 Security response headers
[Done]  [E10]

- The live site sends only `strict-transport-security` (measured 2026-11-10); `next.config.mjs` has no `headers()`.
- `next.config.mjs` `headers()` sets on every path: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. No `Content-Security-Policy` in this decision: it needs nonces for Next inline scripts, PostHog and fonts, and is its own decision when wanted.
- The two-hop `http://shadcn-table.com` redirect (308 to https apex, 308 to www) is Vercel's standard behaviour and stays; no change.
- Checks: `curl -sI` of `/` and of a docs page shows the four headers; `/ingest/*` and `/r/*` responses still work (the headers do not break the proxy or the registry JSON).
- Owner, 2026-11-10: "recommended on all".

### D58 Markdown delivery and llms.txt shape
[Done]  [E10]

- A docs URL requested with `Accept: text/markdown` answers `content-type: text/markdown` but its `vary` header lists only the Next router keys (measured 2026-11-10): `proxy.ts:26` sets `Vary: Accept` on the rewrite, Next drops it, so caches may serve Markdown to browsers or HTML to agents. `/llms.txt` starts with `# Docs` and no summary; `/llms-full.txt` carries raw JSX and import lines from the MDX.
- `app/llms.mdx/docs/[[...slug]]/route.ts` sets `Vary: Accept` on its own response (and the HTML side keeps Next's vary; the proxy header may stay or go, whichever the check proves). `app/llms.txt/route.ts` follows llmstxt.org: `# shadcn-table` H1, one `>` blockquote summary (the home description), then the sections with one line per page: link and its description. `app/llms-full.txt/route.ts` strips MDX imports, JSX components and frontmatter before export; prose, headings and code fences stay.
- Checks: `curl -sI -H "Accept: text/markdown"` on a docs URL shows `vary` containing `Accept`; `/llms.txt` first two lines are the H1 and the blockquote; `grep -cE '^(import |<[A-Z])' ` on `/llms-full.txt` is 0.
- Owner, 2026-11-10: "recommended on all".

### D59 Home page JavaScript and API page payload
[Done]  [E10]

- Lab audit 2026-11-10: the home page ships 775 KB of JavaScript with 1040 ms total blocking time; `/docs/api/table-options` HTML is 1.94 MB. `jspdf`, `jspdf-autotable` and `recharts` are docs dependencies (`apps/shadcn-table-docs/package.json:45-56`).
- The home demo (`components/dev-home/v12/home-page.tsx` and what it imports) loads below-the-fold parts with `next/dynamic`; `jspdf`, `jspdf-autotable` and `recharts` are imported only inside the component that uses them, dynamically, never in the initial home bundle. `/docs/api/table-options` renders its option tables so the HTML stays under 800 KB (the spec picks the mechanism after measuring what fills the payload).
- Targets, measured with the perf budget tooling of Q28 (`--ci`): home initial JavaScript under 450 KB, lab TBT under 300 ms; `/docs/api/table-options` HTML under 800 KB. Visible behaviour unchanged.
- Checks: the three numbers recorded in the tracker before and after; docs-e2e green; the home demo and the API page render the same content.
- Owner, 2026-11-10: "recommended on all".

### D60 Docs content, descriptions and discoverability pages
[Done]  [E10]

- Audit 2026-11-10 (content 62/100): docs intros and descriptions are 38 to 53 percent Material React Table wording with its typos (`/docs/guides/sorting` description, "use use" on the detail-panel page); descriptions are copied (column-pinning, row-pinning), missing (`/docs/api`) or under 45 characters (install, usage); 35 of 42 example pages are under 200 words; the Introduction page (where `/docs` lands) has no install snippet or demo; no page targets "TanStack Table" together with "shadcn/ui"; no comparison page; the GitHub repo has no topics, the docs no byline or dates.
- Every docs page gets a unique description of 120 to 155 characters and an intro written around what is shadcn-specific, MRT typos gone; every example page gets two or three sentences on what it shows and when to use it. The Introduction page gets the install snippet and a demo; the `/docs` redirect becomes permanent (308).
- New pages: a guide "TanStack Table with shadcn/ui" (why and how this library wires them), and a comparison page against tablecn, Material React Table and the shadcn data-table recipe (feature matrix, honest, no claims we cannot show). Each docs page shows the maintainer byline and a last-updated date from frontmatter, and the sidebar links the changelog.
- The repo gets GitHub topics (`gh repo edit anindosarker/shadcn-table --add-topic react,shadcn-ui,tanstack-table,data-table,typescript,nextjs`).
- This decision changes `content/docs/**`, the same files as the E8 docs restructuring; its epic is chosen with that in mind.
- Checks: every page's description length in range (a script over `content/docs/**` frontmatter); no page under 150 words; the two new pages present in the sitemap; typecheck, lint, docs-e2e green.
- Owner, 2026-11-10: "recommended on all".

### D61 Release 0.9.3 ships E10

- E10 (D53 to D60) ships as 0.9.3 in the same epic: a release spec modelled on spec 23, patch label `release:patch` (D49), the D40 flow, the runner approves Prepare Release (D47), post-release sync per P4. Release only after every E10 spec has merged into `claude/review`.
- Owner, 2026-11-10: "work on it and release a new version asap" (E9), "epic go" on D53 to D60.
- Held by the owner 2026-11-10 ("Hold.", after a side-agent note): E10 merges into `claude/review` only; the owner reviews the home title, the rewritten docs copy and the comparison page on the preview deploy first, then says release. The release spec is written then and joins the next epic.

### D62 Home script target follows the home components; the PostHog load is its own finding
[Done]  [E10]

- Source: Q30. D59's 450 KB script target on `/` is unreachable inside `components/dev-home/**`: measured 711 KB before, 580 KB on branch `v0.9/home-javascript` (b2bcf60d), blocking time 158 ms (under the 300 ms target); all but 19 KB of the first load is the shared root layout (posthog-js 114 KB, react-dom 72 KB), out of spec 30's scope.
- The branch merges as it stands. D59's home target becomes: script transfer on `/` under 600 KB and lab TBT under 300 ms, both met at b2bcf60d. Visible behaviour unchanged (nav and hero links prefetch on hover, touch or focus instead of in the viewport; the demo table still loads on mount, which the docs check "icons: the pick survives a reload" needs).
- The root layout's PostHog and provider load is Q30, for a later epic; the demo-table-on-intent variant (437 KB, needs the docs check changed) is not taken.
- Settled by the lead 2026-11-10: a target number the lead set, no visible change; Q30 option a.

### D63 The bundle analyzer wrap goes
[Done]  [E10]

- Source: Q56. Spec 24 wrapped `next.config.mjs` in `@next/bundle-analyzer` behind `ANALYZE=1` for spec 30's measurements; the docs app builds with Turbopack, where the analyzer writes no report, and `next build --webpack` fails on `node:` imports. The wrap and its devDependency do nothing.
- A fix milestone on `claude/review` removes the wrap from `next.config.mjs` and `@next/bundle-analyzer` from `apps/shadcn-table-docs/package.json` and the lockfile. Bundle inspection, when needed, uses `next experimental-analyze` or the built `/` HTML, as spec 30 did.
- Checks: `grep -c bundle-analyzer apps/shadcn-table-docs/next.config.mjs apps/shadcn-table-docs/package.json` is 0; `pnpm install` leaves the lockfile without it; typecheck, lint, validate-repo green.
- Settled by the lead 2026-11-10: tooling with one right answer; Q56 option a.

### D64 (superseded by D74) Guides and API copy states what is shadcn/ui and drops the inherited typos

- Source: Q32. `content/docs/guides/accessibility.mdx:7`, `guides/customize-components.mdx:7`, `api/st-components.mdx:22`, `api/table-options.mdx:24` say the table is built from shadcn/ui components throughout; the table, rows and cells are plain elements (`ST_Table.tsx:113`, `ST_TableBodyCell.tsx:317`), only the controls (buttons, menus, inputs, dialogs) are shadcn/ui. The six inherited typos Q32 lists stay in the merged copy.
- The four sentences say it as it is: the controls are shadcn/ui components, the table markup is plain elements styled with the shadcn theme tokens. The six typos are corrected in the same milestone. No other copy changes.
- Checks: `grep` of the four files shows the corrected sentences; the D60 description script still prints 0; `pnpm test docs-e2e --base base` green.
- Settled by the lead 2026-11-12: a false claim and typos, not a choice. Joins the next epic.

### D65 Docs e2e checks cover the byline and the two new pages
[Done]  [E11]

- Source: Q31. Spec 31 expected `pnpm test docs-e2e` to prove the byline and `/docs/getting-started/comparison` and `/docs/guides/tanstack-table-with-shadcn-ui`, but no milestone owned `test/docs-e2e`, so the frame milestone proved them by curl and a route run only.
- `test/docs-e2e/lib/` gets checks: the two new pages render with their title and their first heading; the comparison table has one row per compared library. Owned by one milestone with `test/docs-e2e/**`.
- Checks: `pnpm test docs-e2e --base base` green with the new checks counted in the run summary.
- Settled by the lead 2026-11-12: tooling gap, one right answer. Joins the next epic.
- Edited 2026-11-13 before build: no byline check; D74 removes the byline. Only the checks for the two new pages remain.
- Edited 2026-11-13 before build: the comparison page is out of 0.9.3 (D75), so this epic checks `/docs/guides/tanstack-table-with-shadcn-ui` only; the comparison check comes with D71.

### D66 proxy.ts runs only on docs paths
[Done]

- Source: Q33. `apps/shadcn-table-docs/proxy.ts` (the Markdown-by-`Accept` rewrite from `fumadocs-core/negotiation`) exports no `config.matcher`, so Next runs it as a function on every request: assets, bot hits, 404s. Vercel usage page 2026-11-12: 581K function invocations, 3h 01m of the Hobby plan's 4 h monthly Fluid Active CPU; prerendered pages are cache hits and builds are a separate budget, so the proxy is the cost.
- `proxy.ts` gets `export const config = { matcher: [...] }` limited to the paths the two rewrites can match: `/docs/:path*` and the `.mdx` suffix form; never `/_next/*`, `/ingest/*`, `/r/*`, `/og/*`, static files. The rewrite behaviour on docs URLs is unchanged.
- Checks: `curl -sI -H "Accept: text/markdown"` on a docs URL still returns `text/markdown`; a docs URL with `.mdx` suffix still rewrites; `/`, `/sitemap.xml`, `/r/base/registry.json`, `/ingest/e/` unchanged; after deploy the Vercel usage page shows invocations falling to the docs-request count. Small fix, lands directly on `claude/review` (P13 style), ships with the next release.
- Owner, 2026-11-12: "10. k".

### D67 PostHog session replays on
[Done]

- Owner request 2026-11-12: watch how visitors use the site. `components/posthog-provider.tsx` initialises posthog-js with `api_host '/ingest'` (the reverse proxy in `next.config.mjs`); replays are off today.
- Code: the init options enable session recording (`disable_session_recording: false`, inputs masked, the default), 100 percent sampling for now; the owner lowers the sample rate in the PostHog project settings if the free quota (5,000 replays a month) runs out. PostHog project: the owner turns on "Record user sessions" in Settings, Session replay. Both sides needed; the code side is a small fix that lands directly on `claude/review`.
- Checks: on a production build the recorder script loads (network request to `/ingest/static/recorder` or the `$snapshot` events in `/ingest/e/`); a replay appears in the PostHog project after a visit on the deployed site.
- Owner, 2026-11-12: "11. k".
- 2026-11-13: nothing to build. posthog-js records by default once the project setting is on, and `components/posthog-provider.tsx` does not turn it off; the owner switched it on in PostHog and saw replays from the live site ("I saw session replay was working. skip it").

### D68 validate-repo fails on a stale generated registry
[Done]  [E11]

- Source: Q36. `apps/shadcn-table-docs/registry.json` (and the other tracked registry outputs of `pnpm -w registry:build`, `registry:items`, `registry:hosted`) are generated from source files and committed; nothing fails when a milestone changes the source and not the output (spec 31 left a 252-line stale diff).
- `pnpm test validate-repo` gains a step that runs the three registry generators and fails on `git diff --exit-code` over their tracked outputs, naming the stale file. The generators must be deterministic (same input, same bytes); if one is not, that is fixed first. Planning rule for specs: a milestone that edits example descriptions or registry sources owns the generated outputs too.
- Checks: with a deliberately edited example description and no regeneration, `pnpm test validate-repo` fails naming `registry.json`; after `pnpm -w registry:items` it passes; CI (`pr.yml`) runs the same step.
- Settled by the lead 2026-11-13: tooling with one right answer.

### D69 Example sources are read per example, not by a tree-wide pattern
[Done]  [E11]

- Source: Q35. `apps/shadcn-table-docs/lib/example-source.ts:39` reads example files with a dynamic directory, so Turbopack traces the whole `examples/` tree including the generated `examples/.<base>` copies (about 1321 files times 8 pattern alternatives) into the server bundle; builds and typecheck are slow and Turbopack warns.
- The example file list and contents are produced at build time by the existing generator step (`lib/example-variants.mjs`, which already walks `examples/`) into one generated module per example (or one JSON index), and `example-source.ts` imports from that module with static paths. The server component no longer calls `fs.readFile` with a computed directory. What the docs show is unchanged.
- Checks: `pnpm --filter shadcn-table-docs build` prints no "file pattern matches" warning; build and `types:check` wall time recorded before and after in the tracker; `pnpm test docs-e2e --base base` green (every example page still shows its source).
- Settled by the lead 2026-11-13: build mechanics, no visible change.

### D70 posthog-js loads after hydration
[Done]  [E11]

- Source: Q30 (Q30). posthog-js (114 KB) and the providers ship in the shared root layout, so every page carries them in the first script load; on `/` they are most of the 580 KB left after spec 30.
- `components/posthog-provider.tsx` initialises posthog-js after hydration (dynamic import on an idle callback or first interaction, whichever is first), with the queue of events captured before init flushed on init, so the first pageview is not lost. Session replay (D67) starts on the same init. Nothing else in the root layout changes.
- Checks: on a production build the `/` first-load script transfer is under 450 KB (the D59 original target) with posthog-js absent from the initial chunks; a pageview and the recorder still arrive at `/ingest/*`; the docs check "icons: the pick survives a reload" passes.
- Settled by the lead 2026-11-13: technical, no visible change.

### D71 Comparison page moves last in Getting Started and compares the searched names
[E12]

- Amends D60 (built, spec 31 merged; patched forward). `content/docs/getting-started/comparison.mdx` sits second in Getting Started and compares against tablecn, Material React Table and the shadcn data-table recipe. Google autocomplete, 2026-11-12: "tanstack table vs shadcn table", "shadcn table vs tanstack table", "shadcn data table vs tanstack table", "material react table vs tanstack / mui datagrid / ag grid" and "ag grid alternative" exist; "tablecn vs" and "tablecn alternative" return nothing.
- `content/docs/getting-started/meta.json` becomes `introduction, install, usage, agents, comparison` (the placement TanStack Query, Router, Form, Zustand and Jotai use: one Comparison entry near the end of Getting Started).
- The table's columns become, in this order: shadcn-table, TanStack Table, the shadcn data-table recipe, Material React Table, AG Grid; the tablecn column goes. The sidebar label stays "Comparison"; the page's search title names the compared libraries (as TanStack Query's does). Every cell is a claim that can be shown from the cited project's own docs; a cell that cannot be sourced is left out.
- Checks: the sidebar order on a production build; the D60 description script prints 0; `pnpm test docs-e2e --base base` green. The owner reads every row on the preview before release (D61 stays held).
- Owner, 2026-11-13: "Looks good.", "k" on the item.

### D72 TanStack guide moves last in Fundamentals
[Done]  [E11]

- Amends D60 (built, spec 31 merged; patched forward). `content/docs/guides/tanstack-table-with-shadcn-ui.mdx` is listed first in the Fundamentals group of Guides. It exists for search ("tanstack table shadcn" has autocomplete suggestions: ui, example, shadcn datatable, github); a reader already in the docs meets the practical guides first.
- `content/docs/guides/meta.json`: the entry moves to the end of the Fundamentals group. The page's content, title and URL are unchanged.
- Checks: the sidebar order on a production build; `pnpm test docs-e2e --base base` green.
- Owner, 2026-11-13: "k" on the item.

### D73 Home title, description and hero line: brand first with the category words
[Done]  [E11]

- Amends D56 (built, spec 27 merged; patched forward before release). The merged title "shadcn-table: data table for shadcn/ui, built on TanStack Table" is 63 characters and the eyebrow reads "The batteries-included data table for shadcn/ui."; the owner found both too technical.
- Evidence, 2026-11-12: Search Console for `sc-domain:shadcn-table.com` (28 days, 85 impressions): "shadcn table" 54 impressions at position 6.2 on `/`, "shadcn tables" 7, "table shadcn" 6, "shadcn data table" 1 at position 74. Across about 28 ranking titles and descriptions: react 28, data table 25, shadcn/ui 14, TanStack 13, component 13, data grid 7; "production-ready" and "batteries" 0. sadmann7/shadcn-table (now tablecn) still appears for "shadcn table", so the title carries the category words next to the brand.
- Root `title.default`: `shadcn-table: React Data Table for shadcn/ui and TanStack` (57 characters); the docs template `%s | shadcn-table` stays. H1 stays `shadcn-table`. The hero line (the eyebrow of spec 27) reads `The open-source React data table for shadcn/ui, built on TanStack Table.` The home meta description (and `og:description`, `twitter:description`) reads `Open-source React data table for shadcn/ui, built on TanStack Table. Sorting, filtering, pagination, grouping, pinning. Installs as source via shadcn CLI.`
- Checks: `curl` of `/` on a production build shows the title, the description and the hero line exactly; a docs page title still ends in `| shadcn-table`; the home JSON-LD (D54) description follows the new text if it copies the old one; `pnpm test docs-e2e --base base` green. Search Console is re-read four weeks after the release.
- Owner, 2026-11-13: "14 k".

### D74 Docs pages return to their previous wording; byline and dates removed
[Done]  [E11]

- Supersedes D64. Amends D60 (built, spec 31 merged; patched forward before release). Spec 31 rewrote the intro and description of the example, guide and API pages with no keyword target per page and no style the owner had approved; the owner rejected the result on the preview (2026-11-13). A rewrite is the docs work's, in a new version; nothing is planned here.
- Restored: every file under `content/docs/examples/**`, `content/docs/guides/*.mdx` and `content/docs/api/**` gets back its frontmatter `description` and body text from the commit before spec 31's copy milestones, with only typos in that older text fixed. `apps/shadcn-table-docs/registry.json` is regenerated from the restored descriptions.
- Removed: `components/docs-byline.tsx`, its use in `app/docs/[[...slug]]/page.tsx:81`, `siteAuthor` in `lib/shared.ts` when nothing else reads it, the `date` field in the docs schema and the `date:` line in all 105 docs files. The name was a fixed GitHub username and the date one hand-written value (`2026-11-10`) on every page.
- Kept from spec 31: the Introduction page's install snippet and demo, `getting-started/comparison.mdx` (D71), `guides/tanstack-table-with-shadcn-ui.mdx` (D72), the permanent `/docs` redirect, the sidebar Changelog link.
- Falls away: D60's description-length rule (120 to 155 characters) and its script; D65's byline check (D65 keeps the two new pages).
- Checks: `git diff <commit before spec 31's copy milestones> -- content/docs/examples content/docs/guides content/docs/api` shows only typo fixes, the two kept pages and the D71/D72 order changes; `grep -rn "DocsByline\|^date:" apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/content` prints nothing; `pnpm test validate-repo` and `pnpm test docs-e2e --base base` green.
- Owner, 2026-11-13: "So remove it. Q58, okay."
- Source: Q58

### D75 One 0.9.3 deployment with everything, released on the owner's yes after the preview
[Done]  [E11]

- Amends D61 (held, not built). The owner wants one deployment, after every decided change: the release does not ship the `proxy.ts` budget fix (D66) ahead of the rest.
- 0.9.3 carries E10 (D53 to D60, D62, D63), the direct fixes (D66, the sidebar Changelog row, the build tsconfig split, the regenerated registry) and the next epic's decisions (D65, D68, D69, D70, D72, D73, D74, D76). The release spec joins that epic, modelled on spec 23: patch label (D49), the D40 flow, P4 sync.
- Edited 2026-11-13 before build: no preview stop. The release milestones run as soon as every other milestone of the epic has merged and its checks pass; D47 applies (the runner approves Prepare Release). The owner has seen or approved every visible change in it.
- The comparison page stays out of 0.9.3: `content/docs/getting-started/comparison.mdx` and its `meta.json` entry are removed from `claude/review` in this epic (the file is in git history at the spec 31 merge). D71 is not in this epic; it ships in the next release, after the owner has read the table in chat.
- Before the build starts the lead reads the Vercel usage page and tells the owner the Fluid Active CPU figure (3h 01m of 4 h on 2026-11-12).
- Owner, 2026-11-13: "I want to do one deployment and that should be after all the items that have changed."; "59 k"; "you can release it in this epic. No need to wait for a preview."; "k. Epic Go".
- Source: Q59

### D76 One shared site description
[Done]  [E11]

- `apps/shadcn-table-docs/lib/llms.ts` holds the `llms.txt` summary as a copy of the home description, `app/opengraph-image.tsx` a third copy (spec 29, spec 26). One exported `siteDescription` in `lib/shared.ts` is read by the root layout metadata, the OG image, `lib/llms.ts` and the home JSON-LD; its text is D73's description.
- Checks: `grep -rn` of the description sentence under `apps/shadcn-table-docs` (outside `.next*`) finds it once; `/llms.txt`, the `/` meta description and the OG image show the same text on a production build.
- Settled by the lead 2026-11-13: one right answer, no visible change beyond D73.
- Source: Q29

### D77 Filter mode menu opens next to its button; the popover stays above the header
[Done]  [E11]

- With `columnFilterDisplayMode: 'popover'` on the Base UI and Radix bases, the filter-mode menu opens about 550 px right and 290 px below its button (measured: button 542,706, menu 1093,994); React Aria is correct; the live 0.9.2 site shows the same, so it predates E10 (d54340da, 2026-10-31).
- Cause: `useST_MenuAnchor.ts:124-131` places the menu's invisible trigger span with `position: fixed` at the button's screen position; inside the popover positioner, which carries `transform: translate(...)`, fixed positioning is relative to that transformed ancestor, so the span is offset by the popover's own position (`ST_FilterOptionMenu.tsx:392-405` base, `:399` radix).
- Fix: in `ST_FilterOptionMenu` for Base UI and Radix, the anchored trigger span renders through `createPortal(..., document.body)`, so no transformed ancestor moves it. React Aria is untouched. The popover keeps `side="top"` (`ST_TableHeadCellFilterLabel.tsx:176` base, `:181` radix), as Material React Table does; the owner chose that.
- Proof (P11): a Storybook play on the popover filters story opens the filter popover, opens the mode menu and asserts the menu's box is adjacent to the mode button's box; it fails on the code before the fix and passes after, on Base UI and Radix.
- Runs as a fix milestone added to the running E11 column, so 0.9.3 ships with it; the changelog gets a `#### Fix` block under `### Fixed`.
- Owner, 2026-11-13: "Choice 1: fix the menu only"; "add to the running epic."
- Source: Q62

### D78 Usage and Introduction show a richer live demo with select, range, date and multi-select filters
[Done]  [E11]

- The Live Example on `/docs/getting-started/usage` (`content/docs/getting-started/usage.mdx:177`) and the demo on `/docs/getting-started/introduction` are the Basic Example (`examples/<base>/basic/TS.tsx:76-103`): five string columns, five rows, every filter a text box. The owner saw it in a PostHog replay and found it a weak demo.
- A new example (one per base, in the examples registry like the others) with about 20 rows: First Name and Last Name with text filters, State with `filterVariant: 'select'`, Age with a number range, a date column with a date filter, a status column with `filterVariant: 'multi-select'`. Both pages embed it where the Basic Example is embedded today.
- The Usage page's tutorial steps and the Basic Example itself are unchanged; the new demo sits at the end as the richer result. The Basic Example stays in the Examples section.
- Checks: on a production build both pages render the new demo on the three bases; each of the four non-text filters opens and filters rows (docs e2e); `pnpm test validate-repo` green with the regenerated registry (D68).
- Edited 2026-11-13 before build: runs as a fix milestone in the running E11 epic, after spec 32 has merged (both touch `content/docs/getting-started/**`), and ships in 0.9.3 (owner: "It should be added to this current sprint as well.").
- Owner, 2026-11-13: "update the demos there"; "k" on the item.
- Source: Q63

### D79 The docs app drops its unused zod dependency
[Done]  [E11]

- `apps/shadcn-table-docs/package.json:57` lists `zod` (added by spec 24 for the frontmatter `date` field in `lib/source.ts`, 3e8114a3); spec 32 removed the field and the byline (005b49f3, D74), and nothing in the docs app imports `zod` now.
- Fix: remove the `zod` line from `apps/shadcn-table-docs/package.json` and refresh `pnpm-lock.yaml` with `pnpm install`; no other file changes.
- Checks: `git grep -n "from 'zod'" apps/shadcn-table-docs` is empty; the docs production build (`pnpm --filter shadcn-table-docs build`) and `pnpm test validate-repo` pass.
- Runs as a fix milestone added to the running E11 epic, before `38 Integration 0.9.3`, so 0.9.3 ships with it.
- Owner, 2026-11-13: "Remove Zod. should be part of this epic".
- Source: Q64

### D80 The filter mode menu lands next to its button even when opened while the filter popover animates in
[Done]  [E11]

- On React Aria, a click on the mode button during the popover's 100 ms enter animation (`zoom-in-95` plus slide, `registry/aria/components/ui/popover.tsx:37`) leaves the menu misplaced: `useST_MenuAnchor.ts:63-68, 84-85` measures the button's box once and re-measures only on resize or scroll, and the fixed anchor `<a>` sits inside the transformed popover (`aria/.../menus/ST_FilterOptionMenu.tsx:392-404`), so the offset counts twice. From the code, not reproduced; found by the D77 play.
- Base UI and Radix share the hook and the same popover animation; after D77's portal the double offset is gone, but the anchor still keeps the mid-animation box. Likely the same bug, smaller; not verified.
- Fix: `useST_MenuAnchor.ts` on the three bases re-measures on `animationend` while open (a capture listener on `document`, only for events whose target contains the anchor element, beside the resize and scroll listeners). The React Aria `ST_FilterOptionMenu.tsx` renders its anchor through `createPortal(..., document.body)` with the hydration guard, as Base UI and Radix do since D77.
- React Aria repositions an open menu only when its trigger resizes or an input changes (`useOverlayPosition`); if the re-measure alone does not move the menu, the builder makes the menu follow the re-measured anchor at the root. No delayed click, no disabled animation.
- Proof (P11): a sibling play of `ModeMenuNextToButtonPopover` opens the mode menu right after the popover appears, without the animation wait (`Filtering.stories.tsx:1333-1336`), waits for all animations to end and asserts the menu's box is adjacent to the mode button's box. It fails before the fix on React Aria and passes after on the three bases; the tracker records what Base UI and Radix did before the fix.
- Runs as a fix milestone added to the running E11 epic, so 0.9.3 ships with it; the changelog gets a `#### Fix` block under `### Fixed`.
- Owner, 2026-11-13: "2" (fix it in E11, 0.9.3 waits for it).
- Source: Q65

### D81 Date filters compare dates, also when the column holds Date values
[E12]

- With `filterVariant: 'date'` and an accessor returning a `Date`, the input yields a 'YYYY-MM-DD' string and greaterThan/lessThan compare it with `Date.toString()`: "greater than" keeps every row, "less than" none (run E11, card Q67). Seen live by the owner on 0.9.3, /docs/examples/react-query: "after 11/02/2025" kept rows dated 9/20/2025, 2/18/2025 and 9/28/2025.
- Fix in the next epic, not as a patch release: date filter modes compare date values for `Date` accessors and for ISO string accessors. The spec follows one lookup: the exact cause in the filter functions, which modes are affected (equals, between), what Material React Table does, and whether the react-query and other remote examples filter in their own mock server code and need the same fix there.
- Proof (P11): a play with a `Date` accessor column that fails before the fix on "greater than" and "less than" and passes after; the live demo (D78) may then return to a `Date` accessor.
- Lookup 2026-11-13 (code read, not run). Cause: the date, datetime and time inputs send `event.target.value`, a string (`ST_FilterTextField.tsx:420-426` base and radix, `:445` aria); `shared/fns/filterFns.ts:85-170` then compares it with the `Date`'s text form. For a `Date` accessor all eight modes are wrong: `greaterThan` and `greaterThanOrEqualTo` keep every row, `lessThan`, `lessThanOrEqualTo` and `equals` none, `notEquals` every row, `between` and `betweenInclusive` none once the upper bound is set; a plain `'date'` column with no `filterFn` defaults to `fuzzy` (`column.utils.ts:216`) and keeps none. ISO string accessors work. Material React Table passes dayjs objects, so its greater, less and between modes work: a port deviation.
- Fix: in `shared/fns/filterFns.ts` (identical on the three bases), when the row value is a `Date` the filter value becomes a timestamp before comparing: a date-only string reads as local midnight and equality compares by calendar day; an `HH:mm` value compares time of day. Filter values stay strings, so stored and URL state stay serializable. `getDefaultColumnFilterFn` (`column.utils.ts:210`) gives a plain date variant `equals` instead of `fuzzy`.
- Examples affected, client side: advanced, subheader-filters, customize-filter-variants. Not affected: persistent-view (ISO strings), server-side-data (its route compares by `getTime()`).
- react-query: its route `app/api/data/route.ts:29-33` compares dates correctly but ignores the filter mode (always `>`), and `getData()` re-randomizes `lastLogin` on every request (`route.ts:16`, `db.ts:1413`); the owner's live symptom there is not explained by the library bug. The spec finds that cause and fixes the route in the same epic.
- Owner, 2026-11-13: "1k" (next epic, after a lookup).
- Source: Q67

### D82 On React Aria the multi-select filter list opens on a click into its input
[E12]

- Today it opens only on ArrowDown or the chevron; Base UI and Radix open on click (run E11 browser check of the D78 demo). Fix: React Aria opens on click like the other two bases. Owner, 2026-11-13: "decision is to fix it".
- Source: Q68

### D83 (superseded by D97) Escape closes the filter chip editor after a select value is picked, on the three bases
[E12]

- Today Radix closes it; Base UI and React Aria leave the editor open, and on React Aria the open editor blocks the Clear filters button until a click outside (run E11 browser check of the D78 demo). Fix: Escape closes the editor on Base UI and React Aria as on Radix, and Clear filters stays clickable. Owner, 2026-11-13: "fix. k".
- Source: Q69

### D84 The live demo on Introduction and Usage has ten columns, so wide-table behavior shows
[E12]

- The D78 demo (`examples/{base,radix,aria}/live-demo`) has six columns: First Name, Last Name, State, Age, Joined, Status. It gains Email, City, Department (select filter) and Salary (range filter), ten in all, so the table scrolls sideways at the docs width on purpose and pinning, hiding and reordering have columns to act on. No column is pinned by default. Checks as D78: both pages render it on the three bases and each non-text filter opens and filters rows. Owner, 2026-11-13: "add more columns in intro and usage instead to show the behaviours for multi columns"; "1 k".
- Source: Q70

### D85 The Filter Mode line sits 6 px under the filter input
[E12]

- The caption "Filter Mode: <mode>" has `mt-0.75` (3 px) in nine places: `ST_FilterTextField.tsx`, `ST_FilterRangeFields.tsx`, `ST_FilterRangeSlider.tsx` on Base UI, Radix and React Aria. It becomes `mt-1.5` (6 px); `leading-[0.8rem]` and the other classes stay. Owner, 2026-11-13: "need to increase a bit padding for the line that says filter fuzzy"; "1 k".
- Source: Q71

### D86 Range filter editors show both inputs in full and accept input
[E12]

- Live 0.9.3, /docs/examples/filter-variants, Base UI, Departure Time chip, mode between inclusive: the two time inputs sit side by side, the second runs past the editor's right edge (no clock icon), and the owner could not fill the inputs at all. Fix: in the chip editor both inputs of a range filter fit inside the editor and accept input, on the three bases, for time, date, datetime and number ranges. The cause of the failed input is not looked up; the spec finds it first. Proof (P11): a play that fills both inputs of a time range in the chip editor and asserts both boxes lie inside the editor's box. Owner, 2026-11-13: "This filter is broken"; "I wasn't able to put inputs at all, need to fix the UI as well"; "Q73 1k".
- Source: Q73

### D87 On React Aria the select filter's chevron sits at the right end of its input
[E12]

- Live 0.9.3, /docs/examples/filter-variants, React Aria, City chip editor, mode equals: the chevron follows the placeholder "Filter by City" in the middle of the input. Fix: the chevron sits at the input's right end, as on Base UI and Radix (the spec compares the three). Owner, 2026-11-13: "arrow in the middle, ui issue"; "1 k".
- Source: Q75

### D88 Typed filters use one debounce hook with commit and cancel rules
[E12]

- Today typed column filters (text, number, autocomplete, date, datetime, time, both range ends) share one debounce created once per mount (`ST_FilterTextField.tsx:212-232`, 200 ms, 400 ms with `manualFiltering`); global search has its own (`ST_GlobalFilterTextField.tsx:67-77`, 250 or 500 ms); the util (`shared/utils/utils.ts:60-77`) has `clear()` and no flush. A 1:1 port of Material React Table v3.
- Problems: filters fire mid-typing; native date and time inputs emit half-typed values, so a pause over 200 ms applies a wrong date; the field's clear button, Clear filters (`ST_FilterChips.tsx:277`), the column menu clear (`ST_ColumnActionMenu.tsx:157`), a stored view load and global search clear or Escape do not cancel a pending call, which re-applies the old text; a pending call fires after unmount; Enter and blur do not commit.
- Hook: `hooks/useST_DebouncedCallback.ts`, identical on the three bases, one `registry.json` entry each; no new dependency (`@tanstack/react-pacer`, used by the Material React Table v9 port, is not adopted). `useST_DebouncedCallback(fn, wait)` returns `run`, `flush`, `cancel`, `isPending`; it calls the latest `fn` and reads `wait` live.
- Used by the typed column filters and global search. Select, multi-select, checkbox, range slider and edit cells stay as they are.
- Rules: Enter and blur flush; every clear path cancels (the field's clear button, Escape, the outside-value sync, which covers Clear filters, the column menu and stored views, the global clear, closing the search field). On unmount: the spec picks flush or cancel and proves it with a play on a chip editor that closes mid-wait.
- Waits: text, number and autocomplete column filters 500 ms; global search 500 ms; the same with `manualFiltering`. Date, datetime and time apply only a complete value, on Enter, on blur or on a pick from the native picker, never per keystroke; the spec checks per input type in a browser what counts as complete.
- The wait is a table option with a per-column override; names are set in the spec, next to `manualFiltering` in the table options and next to the filter props in the column definition.
- Proof (P11): plays that fail before and pass after: type then Clear filters (the text does not come back), type then Enter (applies at once), a half-typed year in a date filter (no filter applied). `RenderCounts.stories.tsx` stays green. The `debounce` util is removed if nothing else uses it.
- Owner, 2026-11-13: "The filters apply way faster than I type"; "add a debounce hook. and then implement. this needs good planning"; "1 k" (own hook, with the option).
- Source: Q74

### D89 Release 0.9.4 ships E12
[E12]

- E12 (D71, D81 to D88, and the home heading decision if the owner adds it) ships as 0.9.4 in the same epic: a release spec modelled on spec 38 (`plan/specs/38-release-0-9-3.md`), patch label `release:patch` (D49), the D40 flow, the runner approves Prepare Release (D47), post-release sync per P4. The release milestones run as soon as every other milestone of the epic has merged and its checks pass; no preview stop, except that the D71 comparison table is read by the owner in chat before its milestone merges. Owner, 2026-11-13: "yes add" (on "add release 0.9.4" to E12).
- Edited 2026-11-13 before build: the owner does not read the comparison table. The lead verifies every cell against its cited source before the milestone merges and removes or corrects a cell that the source does not show; nothing is pasted to the owner. This also replaces the owner read in D71's Checks. Owner: "Double check and verify yourself, I don't wanna see it."

### D90 Home hero: the name stays the heading; the line above and the sentence below carry the search words
[E12]

- Amends D73 (built, live in 0.9.3) for the hero line and adds the hero sentence. The h1 stays `shadcn-table`. The line above it reads `The open-source shadcn data table for React, built on TanStack Table.` (was `The open-source React data table for shadcn/ui, built on TanStack Table.`). The sentence below it reads `A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in.` (was `A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.`). The title tag and the meta description of D73 are unchanged. Chosen by the owner after the SEO research in session "v0.9.x heading". Checks: `curl` of `/` on a production build shows both texts exactly; `pnpm test docs-e2e --base base` green. Owner, 2026-11-13: "this is what I picked for 72".
- Source: Q72

### D91 The table context and the defaults context move to a context folder, named as contexts
[E12]

- `hooks/stTableHook.tsx` (table context pair, `useSTContext`, `ST_TableProvider`, and the factory `createSTTableHook`) and `hooks/useST_Defaults.tsx` (context, provider, reader hook) are filed and named as hooks. Per base, under `registry/<base>/components/ui/shadcn-table/`: new `context/ST_TableContext.tsx` exports `tableContext`, `useTableContext`, `useSTContext`, `ST_TableProvider`; new `context/ST_DefaultsContext.tsx` exports `ST_DefaultsContext`, `ST_DefaultsProvider`, `useST_Defaults`; the factory moves to `hooks/createSTTableHook.ts`; the two old files are removed.
- Every exported name stays the same, so imports through `index.ts` keep working; only path imports change (about 60 files per base, the stories, the registry entries, the docs pages that name the files). One file per context holds context, provider and reader hook together.
- Checks: `grep -rn "hooks/stTableHook\|hooks/useST_Defaults" packages apps` prints nothing outside the changelog; typecheck, lint, validate-repo and the Storybook tests green on the three bases; the registry is regenerated and `registry.json` lists the new paths; the changelog names the moved files under `### Changed`.
- Runs as a fix milestone added to the running E12 epic, after `Filter editor fixes` has merged (same files' import lines), so 0.9.4 ships with it.
- Owner, 2026-11-14: "These are bad coding patterns"; on the first suggested layout: "this looks better. record and add to current epic".
- Source: Q82

### D92 ISO date-time text values keep comparing as dates in date filters

- Spec 40 (merged) compares string row values that match `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/` as dates in the eight modes, beyond its own 1.6.2 (string values keep today's branches). Kept: for ISO text the order is the same as before, and `equals` now matches by day as D81 asks for Date values, so the two accessor kinds behave alike. Settled by the lead (a deviation that keeps the decided behavior), 2026-11-14.
- Source: Q77

### D93 Clearing an is-empty filter returns the column to its default filter mode

- `ST_FilterTextField.tsx:292` and `ST_ColumnActionMenu.tsx:170` (three bases) reset a cleared `empty`/`notEmpty` mode to `allowedColumnFilterOptions?.[0] ?? 'fuzzy'`; on a date column that is fuzzy, not the `equals` default of D81. Fix: reset to `getDefaultColumnFilterFn(columnDef)` when the column lists no allowed options. Proof (P11): a play on a date column that sets is-empty, clears it and asserts the mode. Settled by the lead (one right answer), 2026-11-14.
- Source: Q78

### D94 The column filtering guide states the date defaults of D81

- `content/docs/guides/column-filtering.mdx:93-98, 175` still says every column defaults to fuzzy and does not mention date comparison. Fix: the guide says date, datetime and time columns default to `equals` and compare by local day, minute or time of day, also for `Date` accessors; no other wording changes. Settled by the lead (a factual correction), 2026-11-14.
- Source: Q79

### D95 The React Query example offers only the filter modes its server applies

- `app/api/data/route.ts` applies contains to text columns whatever mode is sent, while `examples/<base>/react-query/TS.tsx` offers every mode on them. Fix: the text columns list only the contains mode (`columnFilterModeOptions`), as spec 40 did for Last Login; the route is unchanged. Settled by the lead (the example must not offer what it ignores), 2026-11-14.
- Source: Q81

### D96 A click in a date or time filter box starts typing at its first part

- Native Chromium date, datetime and time inputs put the caret on the segment under the click; a click at the centre of a filter box lands on the year, so typed digits fill only the year (run E12, spec 41 1.6.3; the owner could not fill the range inputs on live 0.9.3). Fix: in the filter date, datetime and time inputs, single and range, on the three bases, a pointer click into the field moves the caret to the first segment; the native picker icon, keyboard navigation between segments and a click on an already focused field keep the browser's behavior. The spec checks Chromium, Firefox and Safari and names what each allows. Proof (P11): a play that clicks the centre of a date range input, types a full date and asserts the value. Owner, 2026-11-14: "k" on option 1.
- Source: Q80

### D97 React Aria filter popups are modal again as in 0.9.3; the Escape fix stays

- Supersedes D83.
- Spec 41 (1.6.3) met D83's "Clear filters stays clickable" by adding `isNonModal` to three React Aria filter popups (`registry/aria/.../toolbar/ST_FilterChips.tsx:114`, `:225`, `ST_HeaderFilterEditor.tsx:141`, commits `0f0f9f54`, `df03b7f1`). A non-modal React Aria popup closes on page scroll and no public prop turns that off (`react-aria` 3.53.1 `usePopover.mjs:42`); the owner rejects closing on scroll.
- Fix: remove `isNonModal` from the three popups and the code added only for it (focus on open in `focusFilterInput`, the two `shouldCloseOnInteractOutside` filters, the `clickInView` and `clickInPlace` helpers in `test/docs-e2e/lib/helpers.mjs` where nothing else needs them), in the registry and the generated docs copies. Not a revert of the commits: the `closeOnEscape` change (Escape closes the editor after a select pick, base and aria) and every other E12 fix stay.
- React Aria again: page locked while a popup is open, the popup never closes on scroll, the first outside click only closes it. Clear filters takes two clicks there with a popup open; D83's "Clear filters stays clickable" is dropped for React Aria. The play `ClearFiltersClickableWithEditorOpen` no longer asserts one click on React Aria. Base UI and Radix are unchanged.
- Checks on React Aria: `EscapeClosesEditorAfterSelectPick` passes with the modal popup; a popup stays open and the page does not scroll while it is open; the select filter's arrow sits at the right edge of its field (owner screenshot of live 0.9.3, `/docs/examples/filter-variants`, City chip), and a misplaced arrow becomes its own card. CHANGELOG 0.9.4 drops the non-modal lines.
- Owner, 2026-11-14: "The old behavior was completely fine", "don't just blindly revert code", "k".
- Source: Q83
