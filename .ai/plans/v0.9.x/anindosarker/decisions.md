---
kanban-plugin: basic
---

## To do

## In progress

- [ ] **D182** The date picker docs site gets the table site's theme changer, with the same default theme #E28 #R6
	- The picker docs site (date-picker.shadcn-table.com) takes the table docs site's theme customizer and style switcher as they are there: the same panel, presets, shortcuts, undo and saved choice (components/theme-customizer.tsx, components/design-system-provider.tsx, lib/design-system/*, the style sheets, the parts of components/theme-controls.tsx and app/layout.tsx that spec 85 trimmed). The default look is the table's DEFAULT_CONFIG (nova, Inter, Emerald, dark) from the same code, replacing the frozen app/theme.css of design-docs-site.md 4.3. The picker demos follow the chosen theme as the table examples do. Stays: the docs layout as built with one flat sidebar list (D180); Copy page, the agent bar and the other not-taken features of spec 85 stay out. Replaces the theme customizer line of spec 85's not-taken list. Owner, 2026-11-24: 'Add the theme changer. The default theme should be the same as the table one. That should cover most of the stuff.', 'k'.
	- Source: Q175
- [ ] **D183** The table's date range filters use the date picker's own range type #E29 #R6
	- A filter with the variant date-range, datetime-range or time-range renders one DatePicker in range mode (range: true, value [from, to]) in every filter place (chips editor, header editor, popover, subheader): one box, one calendar, both ends, in place of the two single boxes of D164 and spec 82 line 15. Setting only one end (Min without Max, Max without Min) keeps working as today; if the picker's range mode cannot hold one end, that is a queue card before the build, not a silent change, and a change to the approved picker code goes to the owner. The filter value stays a pair, the modes, filter functions and public types do not change (P7). The cut-off date in the popover (18/11/202 at desktop width) goes with it: the one box takes the width of the two. Replaces, for the date variants, v0.8.x D61 (Min and Max side by side) and the range line of D164; number ranges and the slider are unchanged. Owner, 2026-11-24: 'Isn't this example using the wrong type of the date picker? Because I already added support for date range here.', 'q176. k'.
	- Applies wherever two date boxes show today, the between and between inclusive modes included, not only columns declared with a range variant. Every other mode (equals, less than, greater than and the rest) keeps the single date picker; switching the mode swaps the single and the range picker. Owner, 2026-11-24: 'So the actual issue is on the between modes ... should use the type of range for the date pickers, correct?', 'record it'.
	- Source: Q176
- [ ] **D184** A width class on a filter box applies to the whole box, so the calendar button stays inside #E29 #R6
	- Today the className a consumer passes in stFilterTextFieldProps lands on the picker's inner group (ST_FilterTextField.tsx:594 base and radix, :644 aria) and on the inner input of the text branch (:745), not on the outer box (:657); a width class there (examples/base/advanced/TS.tsx:139, Start Date) makes the inside wider than the box and the calendar button shows past the border, in every filter place on the three bases. Fix: the consumer's className goes on the outer box, so box and content size together; it leaves the nested picker group and the inner input. Table only, the picker is not changed; the Advanced example keeps its class. A play per base on a filter with a width class asserts the calendar button lies inside the box; it fails on the shipped code first (P11). Owner, 2026-11-24: 'UI Issue', '177 k'.
	- Source: Q177
- [ ] **D185** The date picker repository takes the table repository's layout: apps and packages #E30 #R6
	- anindosarker/shadcn-date-picker becomes a workspace laid out as shadcn-react-table is: packages/shadcn-date-picker holds the library (the registry trees, stories, Storybook config, its tsconfig files), apps/ holds the docs app (docs/ today), tools/ stays at the root, turbo runs the tasks; registry.json stays at the repository root so the install address anindosarker/shadcn-date-picker/date-picker-<base>#<tag> keeps resolving, as in the table. Replaces spec 78 line 103 ('one private package at the repository root; no workspace, no turbo'). No file content of the approved picker code changes: moves and path updates only. The tags v0.1.0 and v0.1.1 are untouched; the Vercel project, the site address, /storybook/ and the CI checks keep working after the move, proven before the merge. Runs after the theme changer (E28, spec 86) has merged: both touch docs/. Owner, 2026-11-24: 'Why is it not a monorepo with properly handled folders like apps and packages?', 'k'.
	- Source: Q178

## Done

- [x] **D1** The select filter's clear button sits right of the chevron #E1 #R1
	- Fixes Q1. In the three `ST_FilterTextField.tsx`, the select trigger's `pe-9` becomes `pr-9`, so tailwind-merge drops the base `pr-2` and the chevron moves left of the overlaid clear x.
	- One play sets a select filter value and asserts the chevron is left of the clear button; it runs on the shipped code first and must fail there (v0.8.x P11).
	- Stays: the clear addon overlaid at the end of the trigger; multi-select unchanged.
- [x] **D2** The palette button opens a theme customizer panel #E2 #R1
	- The docs nav keeps its palette button where it is (`components/theme-preset-switcher.tsx:85`, mounted at `lib/layout.shared.tsx:36` and `dev-home/v12/nav.tsx:63`); the light/dark toggle beside it stays. Clicking it opens a right-side panel instead of the six-preset dropdown. Reference: shadcnstudio.com/theme-generator (screenshot in chat, 2026-11-08).
	- Panel layout, top to bottom: header (title, reset, close); Copy (the theme CSS and the preset code), Undo, Redo; Mode Light / Dark; Style; Icon Library (Lucide only, v0.7.x D38); Base Color; Theme; Menu Color; Menu Accent; Presets row with Import (paste a preset code), Random, and a preset select holding Default plus the 42 tweakcn palettes; tabs Colors, Typography, Other.
	- Colors tab: one swatch and oklch input per token, light and dark, every token the theme CSS emits. Typography: font and heading font. Other: radius and chart color. Left out from the reference: Contrast, Hold to save, AI, Pro sync.
	- Default is the docs' current Emerald look (`themes/emerald.css`), added as the `Default` preset; Reset returns to it. Mechanics ported from `test-projects/next-app/lib/design-system/*` (provider, generated CSS in a `<style>` element, pre-paint script); `themes/*.css`, `lib/theme-presets.ts` and the Random re-roll on load go; the home theme demo (`theme-demo/variants/no-step-3.tsx:203`) calls the new preset API.
	- Every page load applies the default unless localStorage holds a user choice; the stored choice carries a timestamp and expires after 2 days.
	- Shortcuts through TanStack Hotkeys (`@tanstack/react-hotkeys`, one scope, off while an input, textarea or the search dialog has focus), each shown as a kbd hint beside its control: `r` shuffle, `Shift+R` reset, `c` shuffle the color preset, `p` undo.
- [x] **D3** The version bump waits for the owner's approval #E2 #R1
	- Supersedes v0.8.x D88 on approval and the A23 default. A GitHub Environment `release` with the owner as required reviewer gates the bump job `prepare-release` (`pr.yml:165-222`): the job gets `environment: release`; every other job stays automatic. The owner creates the environment in Settings, Environments, and this decision is the one-time authorization for that setting (v0.8.x P7).
	- The release PR (`dev` into `master`) is opened with its label and auto-merge enabled at creation. The run's flow: CI green, Prepare Release waits for review, the owner clicks Review deployments and Approve, the job pushes `chore: version <v>` to `dev`, CI reruns green, auto-merge merges, `release.yml` tags, verifies and publishes. A rejected review fails the job and pushes nothing.
	- An agent never approves the deployment, not in the UI and not through `gh api .../actions/runs/<run_id>/pending_deployments`, although the owner's `gh` login could. The run posts "Prepare Release waits for your approval" and continues everything that does not depend on the merge; the owner approves with a click, or says "approve it" in chat for that one release.
- [x] **D4** Filter modes are on by default #E1 #R1
	- `enableColumnFilterModes` defaults to true (`features/stConfigFeature.ts:105`, `:561`, `useST_TableOptions.ts`); a consumer turns it off per table or per column as today. Material React Table defaults it off; this is a deliberate deviation.
	- Mode lists stay as they are today for every variant (`shared/utils/filterSummary.utils.ts:46-65`, `ST_FilterOptionMenu.tsx:172`): text, autocomplete, select, date, datetime, time offer all 14 modes; range, date-range, datetime-range, time-range offer between and betweenInclusive; range-slider and checkbox offer none.
	- Multi-select adds three menu entries after its 14, labelled Includes any (`arrIncludesSome`, the default fn), Includes all (`arrIncludesAll`) and Excludes (`arrIncludesNone`), with localization keys for the three labels.
	- Chip labels show the mode as `/docs/examples/advanced` does today ("Email fuzzy: ..."); the subheader and popover display modes get the same default.
	- The column-filtering guide and every docs example drop the explicit `enableColumnFilterModes: true`; one play per display mode asserts the picker appears without the flag (v0.8.x P11).
- [x] **D5** The column size reset animates, in CSS #E1 #R1
	- Double-click on the resize handle (`ST_TableHeadCellResizeHandle.tsx:64-70`) and the "Reset column size" menu item (v0.8.x D5 addendum) keep calling `column.resetSize()` and also set `data-size-resetting` on the table element; the attribute clears on the header cell's `transitionend`, with no timer.
	- The transition is Tailwind classes on the th and td class strings, gated by the attribute the way the flip gates `transition-[translate]` (`ST_TableHeadCell.tsx:309`): `[table[data-size-resetting]_&]:transition-[width,min-width]`, 200 ms, ease-out, `motion-reduce:transition-none`. No JS animation, no frame loop, no change to `global.css`.
	- Nothing else animates: drags stay instant, other width changes snap as today.
	- One play asserts the attribute appears on double-click, clears after the transition, and the width lands on the default; it runs on the shipped code first and must fail there (v0.8.x P11).
- [x] **D6** The `pages` footer shows the row range; the compact mode is `compact` #E1 #R1
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
- [x] **D7** "Default" leaves the pagination names; `compact` everywhere #E1 #R1
	- Fixes Q5 and Q7, applies D6's rename. Every `'default'` for `paginationDisplayMode` becomes `'compact'`: the type `features/stConfigFeature.ts:391` and the branch `ST_TablePagination.tsx` (radix `:278`, base `:294`, aria `:281`) in the three bases; the docs-app copies follow by sync and `public/r/*.json` by regeneration (P9); `guides/pagination.mdx:104,110`, `guides/best-practices.mdx:199`, the API entry `lib/prop-tables/tableOptions.ts:1827-1835`, the example `alternate-pagination/TS.tsx:13` in three bases, `test/docs-e2e/lib/guides.mjs:139`, the stories `TableProvider.stories.tsx:63,169,218,224`, `NestedTable.stories.tsx:89,99`, `RowPinningOnSelect.stories.tsx:66,282,332`; a new CHANGELOG entry, the old `:122` stays.
	- Story names: the compact story `PaginationEnabledDefaultMoreData` (`Pagination.stories.tsx:60`) becomes `PaginationCompactMoreData`; the four stock-settings stories drop "Default": `PaginationEnabled` (`:56`), `PaginationEnabledBigData` (`:103`), `PaginationEnabledBigDataLanguage` (`:116`), `PaginationEnabledNoRowsPerPage` (`:133`). Titles follow the export names; the story ids change and no docs link points at them.
	- The guide and the API entry state that `'pages'` is the default and `'compact'` the alternative; no page calls the compact footer the default.
	- The next-app demo's stale copy (`test-projects/next-app/.../useST_TableOptions.ts:84`) is the owner's, outside the run (D34).
- [x] **D8** The static Storybook resets each story after its play #E2 #R1
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
- [x] **D9** `process.md` audited for the batch flow #R1
	- The v0.8.x copy is rewritten in place, numbers P1 to P11 unchanged. Cut: bullets that restate the skill or the coding standards (branch creation, worktree reset, tracker lines, merge-on-green, the `eslint-disable` rule, "epics follow the guidelines", the `release:` label line of `plan.md`). Rewritten: `dev` is untouched until a release epic runs (P1); the pool is worktrees 01 to 09, `wt1`, `wt2` and `changelog` excluded (P2); P3 keeps the merge message and branch deletion only; P4 states no release is planned for v0.9.x and the D3 gate; P5 adds the `pnpm test` runner facts and the CI-only tests; P6 names port 5273 and lets a new dependency land as the first milestone of the batch that needs it (so D2's `@tanstack/react-hotkeys` is not blocked); P8 keeps the `reference/**` revert only; P9 lists the generated files only.
	- Moved: "every story file has a play" to `docs/code-of-conduct/coding-standards.md`, Checks; P11 keeps the fix-play-fails-first rule.
	- Settled by the agent from the audit table; no bullet was a real choice (owner, 2026-11-08: the audit is not an owner item).
- [x] **D10** The reset listener waits for a width transition #R2
	- Source: Q37. The `resetColumnSizeAnimated` listener in `shared/utils/column.utils.ts` (three bases) removes itself on the first `transitionend` whose `propertyName` is `width` or `min-width`, not on the first event of any kind: button color transitions bubble to the table first and `{ once: true }` would leave `data-size-resetting` stuck. No timer; the D5 behaviour is unchanged. Kept as merged (E1 03, `54a51ee3`).
- [x] **D11** The select trigger pads with `ltr:pr-9 rtl:pl-9` #R2
	- Source: Q38. D1 named `pr-9`; the merged code uses `ltr:pr-9 rtl:pl-9` because `pnpm test validate-repo` rejects a physical padding class, and spec 01 requires that check green. The chevron sits left of the clear button in both directions. Kept as merged (E1 01, `4a61e251`).
- [x] **D12** Removing a filter chip returns the column to its initial filter mode #R2
	- Source: Q39. With modes on by default (D4), the old reset to the first listed mode turned a multi-select column into `fuzzy` and a select column away from `equals` after one chip removal; the merged code resets to `table.initialState.columnFilterFns`, or the first listed mode only when the initial one is not offered. Kept as merged (E1 01, `4a61e251`, `ST_FilterOptionMenu.tsx`, `filterSummary.utils.ts`).
- [x] **D13** The multi-select mode labels read Includes any, Includes all, Excludes in every locale #R2
	- Source: Q40. `filterArrIncludesSome` and `filterArrIncludesAll` already existed; the builder rewrote them to D4's wording in every locale and added `filterArrIncludesNone`; eleven locales had an imperative ("include everything") that became the descriptive label. Kept as merged (E1 01, `4a61e251`, `shared/locales/*.ts`).
- [x] **D14** Two more known flakes #R2
	- Fixes Q8. `ClickToCopy` "Click Copies Value" (base, radix) and `RowOrdering` "Drag Reorders Rows" (aria, 90 s timeout) time out under machine load and pass alone; they join the P5 known-flake list, rerun once before a check is called red.
- [x] **D15** Release 0.9.0 after E2 (superseded by D28) (superseded by D45) #superseded #E3 #R2
	- A release spec (07, epic E3, depends on E2) ships 0.9.0 with E1, E2 and the Q3 fix: the integration milestone fast-forwards `claude/review` into `dev` once and runs the suite there; then one PR `dev` into `master` with the label `release:minor`, auto-merge enabled at creation; `release.yml` tags, verifies the deploy and publishes. Supersedes the P4 bullet "no release is planned".
	- Superseded by D28 (the runner does not approve). The owner approved the 0.9.0 Prepare Release deployment in advance (2026-11-08: "you can approve it now"), the per-release word D3 requires; the runner approves it with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments` when the job waits. Any later release needs a fresh word.
	- The docs changes are not in 0.9.0; they ship as 0.9.1 after the docs discussion.
- [x] **D16** The `release` environment keeps admin bypass #R2
	- Source: Q41. The environment created by spec 05 (`aeca4d55`) keeps GitHub's default `can_admins_bypass: true`; the owner is the repository's only admin, so nobody else can merge past the Approve. Kept as created; no extra PUT.
- [x] **D17** The sheet part is installed into the docs only #R3
	- Source: Q42. `sheet` is listed in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs` (as `alert-dialog` is), so `pnpm lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base; the registry gains no part the library does not use. Kept as merged (E2 04, `161c5ae6`).
- [x] **D18** `@tanstack/react-hotkeys` stays a caret range #R3
	- Source: Q43. `^0.22.0` in `apps/shadcn-table-docs/package.json`, the convention of the other dependencies there; the lockfile pins the installed build. Kept as merged (E2 04, `161c5ae6`).
- [x] **D19** The home demo label reads the design system store #R3
	- Source: Q45. `no-step-3.tsx` reads the current preset from `useDesignSystem()`, the store the panel writes, so every pick (panel, shortcut, cycle button) updates the label; no MutationObserver on `data-design-system`. The D2 behaviour is unchanged. Kept as merged (E2 04, `161c5ae6`).
- [x] **D20** The docs dev server loads clean #E2 #R3
	- Fixes Q11. The runner runs `pnpm --filter shadcn-table-docs dev` on an agent port, loads `/`, `/docs` and one example page, reads the server and browser logs, and fixes each logged error or warning at its root cause (v0.8.x D34 style: no suppression, no `suppressHydrationWarning` blanket).
	- The hotkeys label: formatted only in the browser, or with the platform read from the request (`detectPlatform(userAgent)`) and set on the hotkeys provider, whichever the library's SSR guide names; the kbd hints stay (D2).
	- The hydration mismatch on the home page: the attribute located from the browser log and its server and client values made equal.
	- Acceptance: the same three loads log nothing from TanStack Hotkeys and no hydration mismatch, recorded in the tracker; `pnpm test docs-e2e --base base` green. Owner, 2026-11-08: fix now, before the release.
- [x] **D21** Copy and Import leave the theme panel #E4 #R3
	- Fixes Q18, amends D2. The `CopyMenu` (Copy CSS, Copy preset code, `theme-customizer.tsx:490-519`, used at `:146`) and `ImportPreset` (`:522-576`, used at `:275`) are removed, with `importPreset` (`design-system-provider.tsx:185`), `encodeConfig` and `decodeConfig` (`config.ts:501,518`) and the preset-code format they share; Random, the preset select, the tabs and every other D2 control stay. Owner, 2026-11-08: "Unnecessary items, remove them."
- [x] **D22** One shortcut row at the top of the theme panel #E4 #R3
	- Fixes Q19, Q12, Q17; amends D2's layout and keys. One row directly under the header, in Copy's former slot (D21), holds five buttons: Reset `Shift+R`, Undo `Mod+Z`, Redo `Mod+Shift+Z`, Random `R`, Next preset `C` (`Mod` is Cmd on macOS, Ctrl on Windows and Linux; the label comes from the client platform, D20). `P` for undo goes.
	- Labeled buttons with their kbd hint when the row fits the panel width; when it does not, icon buttons with a tooltip that carries the label and the kbd hint. The header keeps the title and the close button only (the icon-only reset at `theme-customizer.tsx:133-141` and its hint go); the Presets row keeps the select alone (Random at `:292` and the `C` hint under the select move up).
	- Keys registered in `design-system-provider.tsx:193-198`, scope and guards unchanged (D2).
- [x] **D23** Each color swatch opens a picker #E4 #R3
	- Fixes Q13. In the Colors tab each token's swatch (`theme-customizer.tsx:631-638`, a static span today) becomes a button that opens a Popover holding `react-colorful`'s `HexColorPicker` above the existing text input; dragging in the picker writes the token live, and Undo records one step per Popover close (the per-keystroke undo of Q46 stays for typed values). `react-colorful` is one new dependency of the docs app, added by the first milestone of the epic that ships this (P6).
- [x] **D24** The persistent view example starts at ten rows #E4 #R3
	- Fixes Q14. `initialState.pagination.pageSize` becomes 10 in `apps/shadcn-table-docs/examples/{radix,base,aria}/persistent-view/TS.tsx:344`; the stored view (`viewSettingsStorage.utils.ts`) keeps not persisting pagination, so a visitor's page size choice still resets on reload. No library change.
- [x] **D25** The stored view persists rows per page #E4 #R3
	- `ST_StoredView` (`shared/utils/viewSettingsStorage.utils.ts:7-16`, three bases) gains `pageSize?: number`; the persist path saves it on every page size change and the restore path applies it at mount over `initialState.pagination.pageSize`. Page index is not stored. Old stored views without the field stay valid. Public surface (P7): the view settings guide and the API entry for `persistViewSettings` list the new field; a CHANGELOG entry.
	- One play changes the page size, remounts the table and asserts the size held; it runs on the shipped code first and must fail there (P11).
	- D24 stays: the persistent view example starts at 10 and a visitor's choice now survives reload.
- [x] **D26** Style, Menu Color and Menu Accent take effect in the docs #E4 #R3
	- Source: Q44
	- The docs parts in `apps/shadcn-table-docs/components/ui-<base>/` (three bases) are regenerated through `lib/install.mjs` with the preset that emits the `cn-*` hooks (`cn-menu-target` and the rest the design system's style layers in `lib/design-system/*` target, as the next-app reference's parts carry them); the library's own table parts under `shadcn-table/` are untouched. Owner, 2026-11-08: "No, they should work."
	- Acceptance: `pnpm test docs-e2e --base base` green, plus one check that picking a Style and a Menu Color changes a docs menu's computed style; a check that fails on the shipped parts first (P11).
	- Mechanism settled at spec time (spec 13, lead 2026-11-08): `shadcn add` cannot emit the hooks (ui.shadcn.com serves the parts resolved, and the CLI's `transformMenu` strips `cn-menu-target`, measured on 4.22.0 and 4.23.0), so `lib/install.mjs` gains a second phase that fetches the hooked sources from shadcn-ui/ui `apps/v4/registry/bases/<base>/ui/` at a pinned commit and rewrites their imports; the decided behaviour is unchanged.
- [x] **D27** The Icon Library select switches the example tables' icons #E5 #R3
	- Fixes Q16; supersedes v0.7.x D38 "Lucide only" for the docs. The select (`theme-customizer.tsx:207-214`, disabled today) picks lucide, hugeicons, tabler, phosphor or remixicon; every docs example table shows that set; the docs chrome (nav, panel, shadcn parts) stays Lucide. Reset returns to lucide; the choice persists with the rest of the config (D2).
	- Mechanism, library side: the docs copies under `components/ui-<base>/shadcn-table/` are written by `lib:install` from the registry and carry no shared hook, and every example calls `useST_TableOptions` itself, so the library gains a defaults provider (`ST_DefaultsProvider`, three bases) whose `icons` the hook merges beneath the per-table `icons` option (`useST_TableOptions.ts:114`: defaults, then provider, then the table's own). Public surface (P7): API entry, the icons guide, a CHANGELOG entry; one story with a play.
	- Docs side: the provider wraps the examples with the set the theme config names; `hugeicons`, `tabler`, `phosphor` and `remixicon` packages become docs dependencies (P6); the registry's `icons/<lib>.ts` files are installed into the docs copies by `lib:install`.
- [x] **D28** The 0.9.0 release waits for the owner's manual approval (superseded by D47) #superseded #E7 #R3
	- Supersedes D15's advance approval. No agent approves the Prepare Release deployment of the 0.9.0 release PR, not in the UI and not through `gh api .../pending_deployments`; D3's rule stands in full. The run opens the PR, posts "Prepare Release waits for your approval" and stops there; the owner approves with a click. Owner, 2026-11-08: "There are way too many breaking items that we are changing, so stop the release before my manual approval."
- [x] **D29** Only the active style's stylesheet loads #E5 #R3
	- Fixes Q15. `app/global.css:9-16` stops importing the eight `styles/style-*.css` files; each style is its own CSS asset and only the active one is linked: the pre-paint script links the stored or default style's sheet before first paint, and a style change swaps the link and applies the class once the new sheet has loaded, so nothing flashes unstyled. The eight files themselves and the `.cn-*` layers stay as they are (spec 13 relies on them).
	- Measured 2026-11-08, same machine, commit `546bcabd` against `claude/review`: root stylesheet 351 KB to 2,755 KB; warm `/` usable at 1.3 s to 2.8 s; persistent view 1.6 s to 5.6 s; panel open one 1.1 to 1.3 s long task; light/dark toggle style recalc 81 ms to 476 ms. JS unchanged.
	- Acceptance: the root stylesheet of `/` within 10 percent of the 351 KB baseline plus the one active style sheet; opening the panel and toggling light/dark each under 300 ms of long task in the docs E2E harness, measured against the shipped code first (P11); every page green in `pnpm test docs-e2e --base base`.
	- Runs after spec 13 (E4) has merged, so the on-demand sheet is tested with the hooked parts.
- [x] **D30** The installation reference refresh merges into dev directly #R3
	- Source: Q48
	- Source: Q48. The fix milestone `refresh-installation-references` (Q20: the six `test/installation-e2e/fixtures/reference/<base>/default-{light,dark}.png` taken after D6's footer range) is cut from `dev` at `df90bd27` and merged into `dev` directly with a merge commit, then into `claude/review`; `dev` is not fast-forwarded from `claude/review` again for 0.9.0, so the E4 and E5 merges stay out of it (D15). The one exception to P1 for this release; a later release returns to the fast-forward.
- [x] **D31** Random keeps its curated presets through a private decoder #R3
	- Source: Q47
	- Source: Q47. D21 removed the preset-code codec; the Random button (kept by D21) decoded its curated `SHUFFLE_PRESETS` with it, so the builder kept a private `curatedPreset` decoder and a `sameLook` field compare in `lib/design-system/config.ts`; `decodePreset` from `shadcn/preset` stays imported, nothing user-facing changes. Kept as merged (E4 08, `9d582dcd`).
- [x] **D32** A CI-only red is reproduced and fixed under act before it merges #E3 #R3
	- A check that is red on GitHub Actions and green on the local macOS run (a Linux-only failure, such as the docs E2E `/` theme checks of Q23 and Q24) is reproduced locally with `act` against the local Docker (`act pull_request -W .github/workflows/pr.yml -j <job>` with the matrix narrowed to the red base) and the fix is confirmed green there before it merges into `dev`; the GitHub run is the confirmation, not the loop. Owner, 2026-11-08: "You can run them locally and fix them quickly, then do the pr"; "I have Docker and we discussed about using tools like act". Narrows process.md P3 ("never required") for the Linux-only case.
- [x] **D33** The page index restore gets its red-first play #R3
	- Source: Q49
	- Source: Q49. The Q22 fix (`811045dc`) merged without a play that fails on the shipped code (P11). A fix milestone adds a `Persistence` play variant in `packages/shadcn-table/stories/features/ViewSettings.stories.tsx` with `initialState.pagination.pageIndex: 2` and a stored rows-per-page, asserting the page index holds after remount; red at `117a81b5`, green at `811045dc`, the two lines in its tracker; three bases through `pnpm test storybook-tests --base <base>`. Settled by the lead: a coverage gap, no behaviour change.
- [x] **D34** No bot comment for the approval wait #R3
	- The PR's own banner ("This branch is waiting for a deployment approval", Show environments) is the entry point; no `pr.yml` job and no runner comment announces the wait. Owner, 2026-11-08: "I think we can scrap it." Not to be re-proposed.
- [x] **D35** The release test jobs skip the version bump commit #E6 #R3
	- In `.github/workflows/pr.yml`, every test job (typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-pr, PR Summary as applicable) gets an `if:` that skips it when the PR head commit is the bot's `chore: version <v>` commit pushed by `prepare-release` (D3); a job skipped by its condition reports Success for required checks, so auto-merge merges without a second test run. The bump commit changes version files only. `prepare-release` itself keeps running only on an unbumped head. The next release (0.9.1) is the first to run this way; the spec proves it with the 0.9.1 PR's check list (one run of each test job, the bump commit's jobs skipped).
	- Owner, 2026-11-08: "doesn't that mean we just ran the same checks again? doesn't it seem unnecessary?"
	- Consequence, owner 2026-11-08: the bot's bump push prompts nobody (its test jobs skip, so `prepare-release`, which needs them, is skipped too), while any regular push after an Approve (a fix) runs the tests and prompts again; that second prompt is wanted and stays (the idea of skipping `prepare-release` on an already bumped head was dropped).
- [x] **D36** The workflows use the Node 24 action majors #E6 #R3
	- Every `uses:` in `.github/workflows/*.yml` moves to the major built for Node 24: `actions/checkout@v5` (13 uses), `actions/setup-node@v5` (13), `actions/upload-artifact@v5` (8), `actions/download-artifact@v5` (1), `pnpm/action-setup@v5` where that release exists (8); the spec writer checks each release's Node line before pinning. Acceptance: a green `pr.yml` run with zero "Node.js 20 is deprecated" annotations (30 per run today). Owner, 2026-11-08.
- [x] **D37** The PR Summary comment is a grouped table #E6 #R3
	- `tools/release/pr-summary.mjs` writes the sticky comment (v0.8.x D87 marker) in the layout of `reference/pr-summary-draft.md`, accepted by the owner 2026-11-08 ("the format lgtm"): `## <PR title>`; one line `` `<release label>` | [run <id>](url) | <status> `` with `✅ all green`, `❌ <n> jobs failed` or `⏳ <n> running`; one table `Job | Result` in job order, a bold group row per matrix job with its base or scenario rows indented under it, single jobs as one bold row, cells from the record's summary (`✅`/`❌`, `⚪ skipped (reason)` without a record); a `<details>` block `❌ <n> failures` listing every error line as `**<job> (<leg>)** <page> @<width> · <message>`, omitted when green; `#### Changelog` with the `## Unreleased` counts by heading and one line per heading listing its `####` titles as written; the `<sub>` footer. The same body goes to the step summary.
	- Settled at spec time (spec 18, lead 2026-11-08): the draft's `Prepare Release` row is left out, because `pr-summary` runs before `prepare-release` (`pr.yml` needs it) and cannot know its outcome; the Validate PR row carries "already bumped".
- [x] **D38** The PR Summary reads job outputs, not artifacts #E6 #R3
	- Every test job of `pr.yml` (19: typecheck, storybook-tests and docs-e2e over base, radix, aria; installation-e2e over its seven scenarios; lint, validate-repo, validate-pr) ends with an `if: always()` step that prints its `test/.out/<name>[-<leg>].json` record as one compact JSON line into `$GITHUB_OUTPUT`, keyed by its leg (`base`, `radix`, `aria`, the scenario) or `record` for the single jobs; the matrix jobs declare the keys as outputs (each leg fills its own, an empty key never overrides another leg's value, GitHub docs "Using job outputs in a matrix job"); the reusable workflows `typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml`, `installation-e2e.yml` expose the same keys through `workflow_call.outputs`.
	- The PR Summary job (`needs` every test job, `if: always()`) passes `toJSON(needs)` to `tools/release/pr-summary.mjs` in an env variable; the script collects every output value, parses the records (the `name`/`status` filter stays) and renders the D37 comment; a job without a record shows skipped. The `test-out-*` `upload-artifact` steps and the `download-artifact` step go; the installation-e2e capture upload of the reference refresh stays. The record's `errors` list is capped in the output copy (1 MB per job, about 128 KB per env variable).
	- Proof first, locally (D32, owner 2026-11-08: "instead of using github's slow machines ... use act locally"): a throwaway `workflow_dispatch` workflow calling a three-leg reusable workflow where one leg exits 1 after writing its key and a consumer prints `toJSON(needs)` runs under `act` against the local Docker; all three keys must arrive. One GitHub dispatch run confirms it afterwards (act's `workflow_call` output handling is not GitHub's). If the failed leg's key is dropped on GitHub, failed legs keep an artifact as the fallback. The same act-first rule holds for every CI change of this spec (D35, D36, D37).
- [x] **D39** Further 0.9.0 approval prompts are approved by the runner #E7 #R3
	- Amends D28 for this release only. The owner gave the first Approve on PR 134 by click (run 42496942383) and the second (run 42503995049); any further Prepare Release prompt of the 0.9.0 release PR is approved by the runner with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D39"`. Owner, 2026-11-08: "approved already. I told you no need for my approval anymore." A later release starts again from D28: the owner's own click, or the words "approve it".
- [x] **D40** The release runs its suite on GitHub only #E7 #R3
	- Supersedes the local suite of the release spec's Integration milestone (spec 07 Task 2) for every later release: Integration does the changelog pass and fast-forwards `claude/review` into `dev`, then the Release PR opens at once; `pr.yml` on GitHub is the one full run (the milestones already ran their checks locally). A red is reproduced and fixed under `act` against Docker (D32, P3) and pushed; GitHub reruns; green plus the Approve (D28) merges and releases. Owner, 2026-11-08: "release can run on github directly, this way we save time"; "on github red, then we can bring up act with docker".
- [x] **D41** The pre-paint script creates the style sheet link #R3
	- Source: Q50
	- Source: Q50. Spec 15 1.6.3 had `app/layout.tsx` render the active style's `<link>` and the pre-paint script swap it; a stored style then failed React 19 hydration (error #418, head links matched by href) and a second link appeared. The pre-paint script in `lib/design-system/config.ts` creates the link (`blocking=render`), the layout renders none; D29's behaviour unchanged. Kept as merged (E5 15, `5df252e9`).
- [x] **D42** Every per-style sheet build runs the optimizer #R3
	- Source: Q51
	- Source: Q51. `lib/build-styles.mjs` runs `optimize()` on every build so the flattened nesting and prefixes match the root bundle; `--minify` only adds minification (spec 15 1.6.2 said readable output without the flag). Kept as merged (E5 15, `5df252e9`).
- [x] **D43** The label event rebuilds the Validate PR failure lines #R3
	- Source: Q52
	- Source: Q52. On a `labeled` or `unlabeled` run the previous comment's failures block is carried over except the `- **Validate PR**` lines, rebuilt from the new record, so a relabel that fixes the label leaves no stale Validate PR failure (spec 18 1.6.2 said verbatim). Kept as merged (E6 18, `b501c14f`).
- [x] **D44** The called workflows skip every step on the bump commit #E7 #R3
	- Source: Q53
	- Source: Q53. A job-level `if:` on a matrix job is read before the matrix expands, so GitHub reports one skipped job `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952); the four called workflows put the `if:` on every step instead, so each leg runs no step and reports success under its own context. D35's outcome holds. `act` cannot show the difference; the 0.9.1 release run is the proof, a context left "Expected" there is a new item. Kept as merged (E6 16, `8631dc07`).
- [x] **D45** Release 0.9.1 now, the docs restructuring as 0.9.2 #E7 #R3
	- Amends D15: 0.9.1 ships E4, E5 and E6 as merged on `claude/review` (the theme panel changes D21 to D29, the stored page size D25, `ST_DefaultsProvider` D27, the on-demand stylesheets D29, the CI changes D35 to D38), now; the docs restructuring (Q2, Q4, the docs session's decisions) ships as 0.9.2. Owner, 2026-11-09.
	- Flow per D40 and D28: Integration does the changelog pass and fast-forwards `claude/review` into `dev`; the PR `dev` into `master`, title `release: 0.9.1`, label `release:minor` (new public API: `ST_DefaultsProvider`, `pageSize` in the stored view), auto-merge at creation; GitHub runs `pr.yml` once; the owner's Approve by click or "approve it" (D28, D39 does not carry over); the bump push skips the test jobs (D35); `release.yml` tags, verifies and publishes; After release brings `claude/review` and `dev` up to `master` (P4).
	- The run is the proof for D35, D36, D38 and D44: the release tracker records the bump run's contexts (nineteen test contexts and Prepare Release skipped, Validate PR and PR Summary green), zero "Node.js 20 is deprecated" annotations, the artifacts list (`test-out-installation-e2e-*` only), the comment complete; a context left "Expected" or a missing row is an ATTENTION item.
- [x] **D46** Two tooling gaps ride along with the 0.9.1 release spec #E7 #R3
	- Fixes Q10 and Q27 as named ride-alongs of the 0.9.1 release spec's first milestone, before the fast-forward: `.gitignore` gains `!test/storybook-static/` after the `storybook-static` line so new files there are tracked (Q10); `tools/release/record-output.test.mjs` covers `capRecord` (five errors, 400 characters, the `…` mark) under `pnpm test validate-repo`, and the `pr-summary.mjs` header drops the removed act fallback sentence (Q27). Settled by the lead: tooling with one right answer. Q9 and Q26 (stale comments) wait for a change that touches their files (no comment-only commits).
- [x] **D47** The runner approves every Prepare Release deployment #E9 #R3
	- Supersedes D28 and the per-release word of D3 and D39: from 0.9.1 on, the runner approves the Prepare Release deployment of every release PR as soon as the job waits, with `gh api repos/anindosarker/shadcn-table/actions/runs/<run_id>/pending_deployments -f state=approved -F 'environment_ids[]=<id>' -f comment="D47"`; no approval line to the lead, no owner click. The `release` environment and its required reviewer stay (D3): the owner can still reject a waiting deployment by hand before the runner reaches it. Owner, 2026-11-09: "Approve it. Don't ask me for approvals from now on, you have access and approvals."
- [x] **D48** The perf budget is 600 ms under --ci, 300 ms locally #E13 #R3
	- Source: Q54
	  [Done]
	- Source: Q54. D29's acceptance (panel open and light/dark toggle under 300 ms of long tasks) holds locally; on GitHub runners the toggle measured 342 to 351 ms on two bases, twice (Q28), so `PERF_BUDGET_MS` is 600 under `--ci` and 300 otherwise. The code is unchanged; the budget follows the machine. Kept as merged (`629dcf81`).
- [x] **D49** 0.9.1 ships with the patch label; no 0.10.x in this release #E9 #R3
	- Source: Q55
	  [E7]
	- Source: Q55; amends D45's label. PR 135 is relabelled `release:patch` (the `labeled` run rewrites Validate PR to "Ships as 0.9.1"), the runner approves Prepare Release (D47), 0.9.1 ships. Every v0.9.x release stays on the 0.9.x line: new public API in this release line takes a patch bump. Owner, 2026-11-09: "0.9.1. no 0.10x release."
- [x] **D50** Sitemap and robots for the docs site #E9 #R4
	- `https://www.shadcn-table.com/sitemap.xml` and `/robots.txt` both return 404 today; `apps/shadcn-table-docs` has no `sitemap.ts`, `robots.ts` or `next-sitemap` config, so Google finds pages only by following links.
	- Add `apps/shadcn-table-docs/app/sitemap.ts`: the home page at priority 1.0 plus every docs page from fumadocs `source.getPages()`, absolute URLs on `https://www.shadcn-table.com`; no `/dev/*` (removed by D51), no `/r/*`, no `/ingest/*`; no `lastmod` (Vercel shallow clones make git dates unreliable).
	- Add `apps/shadcn-table-docs/app/robots.ts`: allow all, disallow `/ingest/` and `/r/`, `sitemap: https://www.shadcn-table.com/sitemap.xml`. No new dependency; Next.js serves both from these files. Edited 2026-11-10: `/dev/` left the disallow list because D51 removes those routes; a robots block would also have hidden their `noindex` from Google.
	- Checks: on `next start`, `curl` both routes return 200 with valid XML and text; sitemap URL count equals `source.getPages().length + 1`; no `/dev`, `/r` or `/ingest` URL in the sitemap. After deploy the owner submits the sitemap in Search Console.
	- Owner, 2026-11-10: "k. record."
- [x] **D51** Remove the /dev preview routes from the docs site #E9 #R4
	- `apps/shadcn-table-docs/app/dev/**` (the home and theme preview pages, `/dev`, `/dev/theme`, `/dev/theme/1` to `/dev/theme/9`) is deployed and public on www.shadcn-table.com (200 today) although it is development scaffolding with `noindex`. It goes: the route folder is deleted, and every component, helper and data file imported only from it is deleted with it. Git history keeps them; the spec names the removing commit's parent so they can be viewed again.
	- Anything still imported from outside `app/dev` stays. Check scripts, tests and workflow steps that open a `/dev/theme` URL are changed to the page they really test or deleted when they tested only the preview.
	- Checks: on `next start`, `/dev` and `/dev/theme/1` return 404; `grep -rn "/dev" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --include='*.mjs'` (excluding `node_modules`, `.next*`) shows no route reference; typecheck, lint, validate-repo green; the docs check suite still passes.
	- Source: a side-agent note on D50 (robots block vs `noindex`). Owner, 2026-11-10: "the /dev pages can go already. and we can view the components if needed."
- [x] **D52** Release 0.9.2 ships E9 #E9 #R4
	- E9 (D50, D51) ships as 0.9.2 in the same epic: a release spec modelled on spec 20, patch label `release:patch` (D49), the D40 flow (release suite on GitHub only), the runner approves Prepare Release (D47), post-release sync per P4.
	- Release only after specs 21 and 22 have merged into `claude/review`; nothing else rides in.
	- Owner, 2026-11-10: "work on it and release a new version asap."
- [x] **D53** Canonical URLs and trailing-slash redirect #E10 #R4
	- No page on www.shadcn-table.com carries `rel=canonical`, and every URL also answers with a trailing slash (`/docs/api/table-options/` returns 200, measured 2026-11-10), so Google sees two URLs per page with no signal which one counts (audit `reference/seo-audit-2026-11-10.md`).
	- `app/layout.tsx` adds `alternates: { canonical: './' }` to the root metadata; Next resolves it per page against the existing `metadataBase`, so the home page and every docs page get a canonical equal to their own slash-less URL. The docs `generateMetadata` keeps no canonical of its own.
	- `next.config.mjs` `redirects()` gains one permanent (308) entry from `/:path((?!ingest).*)/` to `/:path`; `skipTrailingSlashRedirect: true` stays so the PostHog proxy paths (`/ingest/e/`, `/ingest/batch/`) keep their slash.
	- Checks: `curl -sI /docs/api/table-options/` is 308 to `/docs/api/table-options`; `/ingest/e/` is not redirected; the head of `/` and of a docs page has exactly one `<link rel="canonical">` equal to its own URL on `siteUrl`.
	- Owner, 2026-11-10: "k" on the item.
- [x] **D54** JSON-LD structured data on the home and docs pages #E10 #R4
	- No page on www.shadcn-table.com emits JSON-LD (0 `application/ld+json` on `/`, measured 2026-11-10; schema 10/100 in `reference/seo-audit-2026-11-10.md`), so search engines get no machine-readable statement of what the site and each page are.
	- Home page (`app/(home)/page.tsx`): `WebSite` (name, url) and `SoftwareSourceCode` (name, codeRepository = the GitHub repo URL, programmingLanguage TypeScript, license MIT, runtimePlatform React, url = siteUrl).
	- Every docs page (`app/docs/[[...slug]]/page.tsx`): `TechArticle` (headline = page title, description, url, author = the project as `Organization`) and `BreadcrumbList` built from the fumadocs page tree. Values come from the existing metadata, no new copy.
	- One `JsonLd` component renders a `<script type="application/ld+json">` per object; no `FAQPage`, no `HowTo`.
	- Checks: objects typed with `schema-dts` compile; `curl` of `/` shows exactly two scripts (`WebSite`, `SoftwareSourceCode`), a docs page exactly two (`TechArticle`, `BreadcrumbList`); each parses as JSON; Google Rich Results test on the deployed pages reports no errors (owner-side, after deploy).
	- Owner, 2026-11-10: "k" on the item.
- [x] **D55** Home page Open Graph image #E10 #R4
	- `/` declares `twitter:card summary_large_image` but no `og:image` (measured 2026-11-10; `/opengraph-image` 404), so a shared link to the site shows no preview card. Docs pages already have one from `app/og/docs/[...slug]/route.tsx` through `getPageImageUrl`.
	- Add `apps/shadcn-table-docs/app/opengraph-image.tsx` (1200x630, `ImageResponse`) reusing the docs OG route's layout and fonts with the site name and the home description; Next.js adds `og:image` and `twitter:image` to `/` from the file, so `app/(home)/page.tsx` metadata is untouched.
	- Checks: the head of `/` has `og:image` and `twitter:image` on `siteUrl` pointing at `/opengraph-image`; the URL returns 200 `image/png` 1200x630; docs pages keep their `/og/docs/...` image.
	- Owner, 2026-11-10: "k" on the item.
- [x] **D56** Home title and hero tagline name the category #E10 #R4
	- The home page `<title>`, `og:title` and H1 are the bare word "shadcn-table" and the searched phrases ("shadcn data table", "tanstack table shadcn") appear nowhere on the site (audit 2026-11-10, on-page 56/100), so the page competes only for its own name.
	- Root metadata `title.default` becomes `shadcn-table: data table for shadcn/ui, built on TanStack Table`; the template `%s | shadcn-table` for docs pages stays. The H1 stays "shadcn-table"; the hero tagline under it carries the phrase "data table for shadcn/ui" once. Docs titles are untouched (D60 covers descriptions).
	- Checks: `curl` of `/` shows the new `<title>` and `og:title`; a docs page title still ends in `| shadcn-table`; the hero renders the tagline; docs-e2e green.
	- Owner, 2026-11-10: "recommended on all".
- [x] **D57** Security response headers #E10 #R4
	- The live site sends only `strict-transport-security` (measured 2026-11-10); `next.config.mjs` has no `headers()`.
	- `next.config.mjs` `headers()` sets on every path: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. No `Content-Security-Policy` in this decision: it needs nonces for Next inline scripts, PostHog and fonts, and is its own decision when wanted.
	- The two-hop `http://shadcn-table.com` redirect (308 to https apex, 308 to www) is Vercel's standard behaviour and stays; no change.
	- Checks: `curl -sI` of `/` and of a docs page shows the four headers; `/ingest/*` and `/r/*` responses still work (the headers do not break the proxy or the registry JSON).
	- Owner, 2026-11-10: "recommended on all".
- [x] **D58** Markdown delivery and llms.txt shape #E10 #R4
	- A docs URL requested with `Accept: text/markdown` answers `content-type: text/markdown` but its `vary` header lists only the Next router keys (measured 2026-11-10): `proxy.ts:26` sets `Vary: Accept` on the rewrite, Next drops it, so caches may serve Markdown to browsers or HTML to agents. `/llms.txt` starts with `# Docs` and no summary; `/llms-full.txt` carries raw JSX and import lines from the MDX.
	- `app/llms.mdx/docs/[[...slug]]/route.ts` sets `Vary: Accept` on its own response (and the HTML side keeps Next's vary; the proxy header may stay or go, whichever the check proves). `app/llms.txt/route.ts` follows llmstxt.org: `# shadcn-table` H1, one `>` blockquote summary (the home description), then the sections with one line per page: link and its description. `app/llms-full.txt/route.ts` strips MDX imports, JSX components and frontmatter before export; prose, headings and code fences stay.
	- Checks: `curl -sI -H "Accept: text/markdown"` on a docs URL shows `vary` containing `Accept`; `/llms.txt` first two lines are the H1 and the blockquote; `grep -cE '^(import |<[A-Z])' ` on `/llms-full.txt` is 0.
	- Owner, 2026-11-10: "recommended on all".
- [x] **D59** Home page JavaScript and API page payload #E10 #R4
	- Lab audit 2026-11-10: the home page ships 775 KB of JavaScript with 1040 ms total blocking time; `/docs/api/table-options` HTML is 1.94 MB. `jspdf`, `jspdf-autotable` and `recharts` are docs dependencies (`apps/shadcn-table-docs/package.json:45-56`).
	- The home demo (`components/dev-home/v12/home-page.tsx` and what it imports) loads below-the-fold parts with `next/dynamic`; `jspdf`, `jspdf-autotable` and `recharts` are imported only inside the component that uses them, dynamically, never in the initial home bundle. `/docs/api/table-options` renders its option tables so the HTML stays under 800 KB (the spec picks the mechanism after measuring what fills the payload).
	- Targets, measured with the perf budget tooling of Q28 (`--ci`): home initial JavaScript under 450 KB, lab TBT under 300 ms; `/docs/api/table-options` HTML under 800 KB. Visible behaviour unchanged.
	- Checks: the three numbers recorded in the tracker before and after; docs-e2e green; the home demo and the API page render the same content.
	- Owner, 2026-11-10: "recommended on all".
- [x] **D60** Docs content, descriptions and discoverability pages #E10 #R4
	- Audit 2026-11-10 (content 62/100): docs intros and descriptions are 38 to 53 percent Material React Table wording with its typos (`/docs/guides/sorting` description, "use use" on the detail-panel page); descriptions are copied (column-pinning, row-pinning), missing (`/docs/api`) or under 45 characters (install, usage); 35 of 42 example pages are under 200 words; the Introduction page (where `/docs` lands) has no install snippet or demo; no page targets "TanStack Table" together with "shadcn/ui"; no comparison page; the GitHub repo has no topics, the docs no byline or dates.
	- Every docs page gets a unique description of 120 to 155 characters and an intro written around what is shadcn-specific, MRT typos gone; every example page gets two or three sentences on what it shows and when to use it. The Introduction page gets the install snippet and a demo; the `/docs` redirect becomes permanent (308).
	- New pages: a guide "TanStack Table with shadcn/ui" (why and how this library wires them), and a comparison page against tablecn, Material React Table and the shadcn data-table recipe (feature matrix, honest, no claims we cannot show). Each docs page shows the maintainer byline and a last-updated date from frontmatter, and the sidebar links the changelog.
	- The repo gets GitHub topics (`gh repo edit anindosarker/shadcn-table --add-topic react,shadcn-ui,tanstack-table,data-table,typescript,nextjs`).
	- This decision changes `content/docs/**`, the same files as the E8 docs restructuring; its epic is chosen with that in mind.
	- Checks: every page's description length in range (a script over `content/docs/**` frontmatter); no page under 150 words; the two new pages present in the sitemap; typecheck, lint, docs-e2e green.
	- Owner, 2026-11-10: "recommended on all".
- [x] **D61** Release 0.9.3 ships E10 #R4
	- E10 (D53 to D60) ships as 0.9.3 in the same epic: a release spec modelled on spec 23, patch label `release:patch` (D49), the D40 flow, the runner approves Prepare Release (D47), post-release sync per P4. Release only after every E10 spec has merged into `claude/review`.
	- Owner, 2026-11-10: "work on it and release a new version asap" (E9), "epic go" on D53 to D60.
	- Held by the owner 2026-11-10 ("Hold.", after a side-agent note): E10 merges into `claude/review` only; the owner reviews the home title, the rewritten docs copy and the comparison page on the preview deploy first, then says release. The release spec is written then and joins the next epic.
- [x] **D62** Home script target follows the home components; the PostHog load is its own finding #E10 #R4
	- Source: Q30. D59's 450 KB script target on `/` is unreachable inside `components/dev-home/**`: measured 711 KB before, 580 KB on branch `v0.9/home-javascript` (b2bcf60d), blocking time 158 ms (under the 300 ms target); all but 19 KB of the first load is the shared root layout (posthog-js 114 KB, react-dom 72 KB), out of spec 30's scope.
	- The branch merges as it stands. D59's home target becomes: script transfer on `/` under 600 KB and lab TBT under 300 ms, both met at b2bcf60d. Visible behaviour unchanged (nav and hero links prefetch on hover, touch or focus instead of in the viewport; the demo table still loads on mount, which the docs check "icons: the pick survives a reload" needs).
	- The root layout's PostHog and provider load is Q30, for a later epic; the demo-table-on-intent variant (437 KB, needs the docs check changed) is not taken.
	- Settled by the lead 2026-11-10: a target number the lead set, no visible change; Q30 option a.
- [x] **D63** The bundle analyzer wrap goes #E10 #R4
	- Source: Q56. Spec 24 wrapped `next.config.mjs` in `@next/bundle-analyzer` behind `ANALYZE=1` for spec 30's measurements; the docs app builds with Turbopack, where the analyzer writes no report, and `next build --webpack` fails on `node:` imports. The wrap and its devDependency do nothing.
	- A fix milestone on `claude/review` removes the wrap from `next.config.mjs` and `@next/bundle-analyzer` from `apps/shadcn-table-docs/package.json` and the lockfile. Bundle inspection, when needed, uses `next experimental-analyze` or the built `/` HTML, as spec 30 did.
	- Checks: `grep -c bundle-analyzer apps/shadcn-table-docs/next.config.mjs apps/shadcn-table-docs/package.json` is 0; `pnpm install` leaves the lockfile without it; typecheck, lint, validate-repo green.
	- Settled by the lead 2026-11-10: tooling with one right answer; Q56 option a.
- [x] **D64** Guides and API copy states what is shadcn/ui and drops the inherited typos (superseded by D74) #superseded #R4
	- Source: Q32. `content/docs/guides/accessibility.mdx:7`, `guides/customize-components.mdx:7`, `api/st-components.mdx:22`, `api/table-options.mdx:24` say the table is built from shadcn/ui components throughout; the table, rows and cells are plain elements (`ST_Table.tsx:113`, `ST_TableBodyCell.tsx:317`), only the controls (buttons, menus, inputs, dialogs) are shadcn/ui. The six inherited typos Q32 lists stay in the merged copy.
	- The four sentences say it as it is: the controls are shadcn/ui components, the table markup is plain elements styled with the shadcn theme tokens. The six typos are corrected in the same milestone. No other copy changes.
	- Checks: `grep` of the four files shows the corrected sentences; the D60 description script still prints 0; `pnpm test docs-e2e --base base` green.
	- Settled by the lead 2026-11-12: a false claim and typos, not a choice. Joins the next epic.
- [x] **D65** Docs e2e checks cover the byline and the two new pages #E11 #R4
	- Source: Q31. Spec 31 expected `pnpm test docs-e2e` to prove the byline and `/docs/getting-started/comparison` and `/docs/guides/tanstack-table-with-shadcn-ui`, but no milestone owned `test/docs-e2e`, so the frame milestone proved them by curl and a route run only.
	- `test/docs-e2e/lib/` gets checks: the two new pages render with their title and their first heading; the comparison table has one row per compared library. Owned by one milestone with `test/docs-e2e/**`.
	- Checks: `pnpm test docs-e2e --base base` green with the new checks counted in the run summary.
	- Settled by the lead 2026-11-12: tooling gap, one right answer. Joins the next epic.
	- Edited 2026-11-13 before build: no byline check; D74 removes the byline. Only the checks for the two new pages remain.
	- Edited 2026-11-13 before build: the comparison page is out of 0.9.3 (D75), so this epic checks `/docs/guides/tanstack-table-with-shadcn-ui` only; the comparison check comes with D71.
- [x] **D66** proxy.ts runs only on docs paths #R4
	- Source: Q33. `apps/shadcn-table-docs/proxy.ts` (the Markdown-by-`Accept` rewrite from `fumadocs-core/negotiation`) exports no `config.matcher`, so Next runs it as a function on every request: assets, bot hits, 404s. Vercel usage page 2026-11-12: 581K function invocations, 3h 01m of the Hobby plan's 4 h monthly Fluid Active CPU; prerendered pages are cache hits and builds are a separate budget, so the proxy is the cost.
	- `proxy.ts` gets `export const config = { matcher: [...] }` limited to the paths the two rewrites can match: `/docs/:path*` and the `.mdx` suffix form; never `/_next/*`, `/ingest/*`, `/r/*`, `/og/*`, static files. The rewrite behaviour on docs URLs is unchanged.
	- Checks: `curl -sI -H "Accept: text/markdown"` on a docs URL still returns `text/markdown`; a docs URL with `.mdx` suffix still rewrites; `/`, `/sitemap.xml`, `/r/base/registry.json`, `/ingest/e/` unchanged; after deploy the Vercel usage page shows invocations falling to the docs-request count. Small fix, lands directly on `claude/review` (P13 style), ships with the next release.
	- Owner, 2026-11-12: "10. k".
- [x] **D67** PostHog session replays on #E23 #R4
	- Owner request 2026-11-12: watch how visitors use the site. `components/posthog-provider.tsx` initialises posthog-js with `api_host '/ingest'` (the reverse proxy in `next.config.mjs`); replays are off today.
	- Code: the init options enable session recording (`disable_session_recording: false`, inputs masked, the default), 100 percent sampling for now; the owner lowers the sample rate in the PostHog project settings if the free quota (5,000 replays a month) runs out. PostHog project: the owner turns on "Record user sessions" in Settings, Session replay. Both sides needed; the code side is a small fix that lands directly on `claude/review`.
	- Checks: on a production build the recorder script loads (network request to `/ingest/static/recorder` or the `$snapshot` events in `/ingest/e/`); a replay appears in the PostHog project after a visit on the deployed site.
	- Owner, 2026-11-12: "11. k".
	- 2026-11-13: nothing to build. posthog-js records by default once the project setting is on, and `components/posthog-provider.tsx` does not turn it off; the owner switched it on in PostHog and saw replays from the live site ("I saw session replay was working. skip it").
- [x] **D68** validate-repo fails on a stale generated registry #E11 #R4
	- Source: Q36. `apps/shadcn-table-docs/registry.json` (and the other tracked registry outputs of `pnpm -w registry:build`, `registry:items`, `registry:hosted`) are generated from source files and committed; nothing fails when a milestone changes the source and not the output (spec 31 left a 252-line stale diff).
	- `pnpm test validate-repo` gains a step that runs the three registry generators and fails on `git diff --exit-code` over their tracked outputs, naming the stale file. The generators must be deterministic (same input, same bytes); if one is not, that is fixed first. Planning rule for specs: a milestone that edits example descriptions or registry sources owns the generated outputs too.
	- Checks: with a deliberately edited example description and no regeneration, `pnpm test validate-repo` fails naming `registry.json`; after `pnpm -w registry:items` it passes; CI (`pr.yml`) runs the same step.
	- Settled by the lead 2026-11-13: tooling with one right answer.
- [x] **D69** Example sources are read per example, not by a tree-wide pattern #E11 #R4
	- Source: Q35. `apps/shadcn-table-docs/lib/example-source.ts:39` reads example files with a dynamic directory, so Turbopack traces the whole `examples/` tree including the generated `examples/.<base>` copies (about 1321 files times 8 pattern alternatives) into the server bundle; builds and typecheck are slow and Turbopack warns.
	- The example file list and contents are produced at build time by the existing generator step (`lib/example-variants.mjs`, which already walks `examples/`) into one generated module per example (or one JSON index), and `example-source.ts` imports from that module with static paths. The server component no longer calls `fs.readFile` with a computed directory. What the docs show is unchanged.
	- Checks: `pnpm --filter shadcn-table-docs build` prints no "file pattern matches" warning; build and `types:check` wall time recorded before and after in the tracker; `pnpm test docs-e2e --base base` green (every example page still shows its source).
	- Settled by the lead 2026-11-13: build mechanics, no visible change.
- [x] **D70** posthog-js loads after hydration #E11 #R4
	- Source: Q30 (Q30). posthog-js (114 KB) and the providers ship in the shared root layout, so every page carries them in the first script load; on `/` they are most of the 580 KB left after spec 30.
	- `components/posthog-provider.tsx` initialises posthog-js after hydration (dynamic import on an idle callback or first interaction, whichever is first), with the queue of events captured before init flushed on init, so the first pageview is not lost. Session replay (D67) starts on the same init. Nothing else in the root layout changes.
	- Checks: on a production build the `/` first-load script transfer is under 450 KB (the D59 original target) with posthog-js absent from the initial chunks; a pageview and the recorder still arrive at `/ingest/*`; the docs check "icons: the pick survives a reload" passes.
	- Settled by the lead 2026-11-13: technical, no visible change.
- [x] **D71** Comparison page moves last in Getting Started and compares the searched names #E12 #R4
	- Amends D60 (built, spec 31 merged; patched forward). `content/docs/getting-started/comparison.mdx` sits second in Getting Started and compares against tablecn, Material React Table and the shadcn data-table recipe. Google autocomplete, 2026-11-12: "tanstack table vs shadcn table", "shadcn table vs tanstack table", "shadcn data table vs tanstack table", "material react table vs tanstack / mui datagrid / ag grid" and "ag grid alternative" exist; "tablecn vs" and "tablecn alternative" return nothing.
	- `content/docs/getting-started/meta.json` becomes `introduction, install, usage, agents, comparison` (the placement TanStack Query, Router, Form, Zustand and Jotai use: one Comparison entry near the end of Getting Started).
	- The table's columns become, in this order: shadcn-table, TanStack Table, the shadcn data-table recipe, Material React Table, AG Grid; the tablecn column goes. The sidebar label stays "Comparison"; the page's search title names the compared libraries (as TanStack Query's does). Every cell is a claim that can be shown from the cited project's own docs; a cell that cannot be sourced is left out.
	- Checks: the sidebar order on a production build; the D60 description script prints 0; `pnpm test docs-e2e --base base` green. The owner reads every row on the preview before release (D61 stays held).
	- Owner, 2026-11-13: "Looks good.", "k" on the item.
- [x] **D72** TanStack guide moves last in Fundamentals #E11 #R4
	- Amends D60 (built, spec 31 merged; patched forward). `content/docs/guides/tanstack-table-with-shadcn-ui.mdx` is listed first in the Fundamentals group of Guides. It exists for search ("tanstack table shadcn" has autocomplete suggestions: ui, example, shadcn datatable, github); a reader already in the docs meets the practical guides first.
	- `content/docs/guides/meta.json`: the entry moves to the end of the Fundamentals group. The page's content, title and URL are unchanged.
	- Checks: the sidebar order on a production build; `pnpm test docs-e2e --base base` green.
	- Owner, 2026-11-13: "k" on the item.
- [x] **D73** Home title, description and hero line: brand first with the category words #E11 #R4
	- Amends D56 (built, spec 27 merged; patched forward before release). The merged title "shadcn-table: data table for shadcn/ui, built on TanStack Table" is 63 characters and the eyebrow reads "The batteries-included data table for shadcn/ui."; the owner found both too technical.
	- Evidence, 2026-11-12: Search Console for `sc-domain:shadcn-table.com` (28 days, 85 impressions): "shadcn table" 54 impressions at position 6.2 on `/`, "shadcn tables" 7, "table shadcn" 6, "shadcn data table" 1 at position 74. Across about 28 ranking titles and descriptions: react 28, data table 25, shadcn/ui 14, TanStack 13, component 13, data grid 7; "production-ready" and "batteries" 0. sadmann7/shadcn-table (now tablecn) still appears for "shadcn table", so the title carries the category words next to the brand.
	- Root `title.default`: `shadcn-table: React Data Table for shadcn/ui and TanStack` (57 characters); the docs template `%s | shadcn-table` stays. H1 stays `shadcn-table`. The hero line (the eyebrow of spec 27) reads `The open-source React data table for shadcn/ui, built on TanStack Table.` The home meta description (and `og:description`, `twitter:description`) reads `Open-source React data table for shadcn/ui, built on TanStack Table. Sorting, filtering, pagination, grouping, pinning. Installs as source via shadcn CLI.`
	- Checks: `curl` of `/` on a production build shows the title, the description and the hero line exactly; a docs page title still ends in `| shadcn-table`; the home JSON-LD (D54) description follows the new text if it copies the old one; `pnpm test docs-e2e --base base` green. Search Console is re-read four weeks after the release.
	- Owner, 2026-11-13: "14 k".
- [x] **D74** Docs pages return to their previous wording; byline and dates removed #E11 #R4
	- Supersedes D64. Amends D60 (built, spec 31 merged; patched forward before release). Spec 31 rewrote the intro and description of the example, guide and API pages with no keyword target per page and no style the owner had approved; the owner rejected the result on the preview (2026-11-13). A rewrite is the docs work's, in a new version; nothing is planned here.
	- Restored: every file under `content/docs/examples/**`, `content/docs/guides/*.mdx` and `content/docs/api/**` gets back its frontmatter `description` and body text from the commit before spec 31's copy milestones, with only typos in that older text fixed. `apps/shadcn-table-docs/registry.json` is regenerated from the restored descriptions.
	- Removed: `components/docs-byline.tsx`, its use in `app/docs/[[...slug]]/page.tsx:81`, `siteAuthor` in `lib/shared.ts` when nothing else reads it, the `date` field in the docs schema and the `date:` line in all 105 docs files. The name was a fixed GitHub username and the date one hand-written value (`2026-11-10`) on every page.
	- Kept from spec 31: the Introduction page's install snippet and demo, `getting-started/comparison.mdx` (D71), `guides/tanstack-table-with-shadcn-ui.mdx` (D72), the permanent `/docs` redirect, the sidebar Changelog link.
	- Falls away: D60's description-length rule (120 to 155 characters) and its script; D65's byline check (D65 keeps the two new pages).
	- Checks: `git diff <commit before spec 31's copy milestones> -- content/docs/examples content/docs/guides content/docs/api` shows only typo fixes, the two kept pages and the D71/D72 order changes; `grep -rn "DocsByline\|^date:" apps/shadcn-table-docs/app apps/shadcn-table-docs/components apps/shadcn-table-docs/content` prints nothing; `pnpm test validate-repo` and `pnpm test docs-e2e --base base` green.
	- Owner, 2026-11-13: "So remove it. Q58, okay."
	- Source: Q58
- [x] **D75** One 0.9.3 deployment with everything, released on the owner's yes after the preview #E11 #R4
	- Amends D61 (held, not built). The owner wants one deployment, after every decided change: the release does not ship the `proxy.ts` budget fix (D66) ahead of the rest.
	- 0.9.3 carries E10 (D53 to D60, D62, D63), the direct fixes (D66, the sidebar Changelog row, the build tsconfig split, the regenerated registry) and the next epic's decisions (D65, D68, D69, D70, D72, D73, D74, D76). The release spec joins that epic, modelled on spec 23: patch label (D49), the D40 flow, P4 sync.
	- Edited 2026-11-13 before build: no preview stop. The release milestones run as soon as every other milestone of the epic has merged and its checks pass; D47 applies (the runner approves Prepare Release). The owner has seen or approved every visible change in it.
	- The comparison page stays out of 0.9.3: `content/docs/getting-started/comparison.mdx` and its `meta.json` entry are removed from `claude/review` in this epic (the file is in git history at the spec 31 merge). D71 is not in this epic; it ships in the next release, after the owner has read the table in chat.
	- Before the build starts the lead reads the Vercel usage page and tells the owner the Fluid Active CPU figure (3h 01m of 4 h on 2026-11-12).
	- Owner, 2026-11-13: "I want to do one deployment and that should be after all the items that have changed."; "59 k"; "you can release it in this epic. No need to wait for a preview."; "k. Epic Go".
	- Source: Q59
- [x] **D76** One shared site description #E11 #R4
	- `apps/shadcn-table-docs/lib/llms.ts` holds the `llms.txt` summary as a copy of the home description, `app/opengraph-image.tsx` a third copy (spec 29, spec 26). One exported `siteDescription` in `lib/shared.ts` is read by the root layout metadata, the OG image, `lib/llms.ts` and the home JSON-LD; its text is D73's description.
	- Checks: `grep -rn` of the description sentence under `apps/shadcn-table-docs` (outside `.next*`) finds it once; `/llms.txt`, the `/` meta description and the OG image show the same text on a production build.
	- Settled by the lead 2026-11-13: one right answer, no visible change beyond D73.
	- Source: Q29
- [x] **D77** Filter mode menu opens next to its button; the popover stays above the header #E11 #R4
	- With `columnFilterDisplayMode: 'popover'` on the Base UI and Radix bases, the filter-mode menu opens about 550 px right and 290 px below its button (measured: button 542,706, menu 1093,994); React Aria is correct; the live 0.9.2 site shows the same, so it predates E10 (d54340da, 2026-10-31).
	- Cause: `useST_MenuAnchor.ts:124-131` places the menu's invisible trigger span with `position: fixed` at the button's screen position; inside the popover positioner, which carries `transform: translate(...)`, fixed positioning is relative to that transformed ancestor, so the span is offset by the popover's own position (`ST_FilterOptionMenu.tsx:392-405` base, `:399` radix).
	- Fix: in `ST_FilterOptionMenu` for Base UI and Radix, the anchored trigger span renders through `createPortal(..., document.body)`, so no transformed ancestor moves it. React Aria is untouched. The popover keeps `side="top"` (`ST_TableHeadCellFilterLabel.tsx:176` base, `:181` radix), as Material React Table does; the owner chose that.
	- Proof (P11): a Storybook play on the popover filters story opens the filter popover, opens the mode menu and asserts the menu's box is adjacent to the mode button's box; it fails on the code before the fix and passes after, on Base UI and Radix.
	- Runs as a fix milestone added to the running E11 column, so 0.9.3 ships with it; the changelog gets a `#### Fix` block under `### Fixed`.
	- Owner, 2026-11-13: "Choice 1: fix the menu only"; "add to the running epic."
	- Source: Q62
- [x] **D78** Usage and Introduction show a richer live demo with select, range, date and multi-select filters #E11 #R4
	- The Live Example on `/docs/getting-started/usage` (`content/docs/getting-started/usage.mdx:177`) and the demo on `/docs/getting-started/introduction` are the Basic Example (`examples/<base>/basic/TS.tsx:76-103`): five string columns, five rows, every filter a text box. The owner saw it in a PostHog replay and found it a weak demo.
	- A new example (one per base, in the examples registry like the others) with about 20 rows: First Name and Last Name with text filters, State with `filterVariant: 'select'`, Age with a number range, a date column with a date filter, a status column with `filterVariant: 'multi-select'`. Both pages embed it where the Basic Example is embedded today.
	- The Usage page's tutorial steps and the Basic Example itself are unchanged; the new demo sits at the end as the richer result. The Basic Example stays in the Examples section.
	- Checks: on a production build both pages render the new demo on the three bases; each of the four non-text filters opens and filters rows (docs e2e); `pnpm test validate-repo` green with the regenerated registry (D68).
	- Edited 2026-11-13 before build: runs as a fix milestone in the running E11 epic, after spec 32 has merged (both touch `content/docs/getting-started/**`), and ships in 0.9.3 (owner: "It should be added to this current sprint as well.").
	- Owner, 2026-11-13: "update the demos there"; "k" on the item.
	- Source: Q63
- [x] **D79** The docs app drops its unused zod dependency #E11 #R4
	- `apps/shadcn-table-docs/package.json:57` lists `zod` (added by spec 24 for the frontmatter `date` field in `lib/source.ts`, 3e8114a3); spec 32 removed the field and the byline (005b49f3, D74), and nothing in the docs app imports `zod` now.
	- Fix: remove the `zod` line from `apps/shadcn-table-docs/package.json` and refresh `pnpm-lock.yaml` with `pnpm install`; no other file changes.
	- Checks: `git grep -n "from 'zod'" apps/shadcn-table-docs` is empty; the docs production build (`pnpm --filter shadcn-table-docs build`) and `pnpm test validate-repo` pass.
	- Runs as a fix milestone added to the running E11 epic, before `38 Integration 0.9.3`, so 0.9.3 ships with it.
	- Owner, 2026-11-13: "Remove Zod. should be part of this epic".
	- Source: Q64
- [x] **D80** The filter mode menu lands next to its button even when opened while the filter popover animates in #E11 #R4
	- On React Aria, a click on the mode button during the popover's 100 ms enter animation (`zoom-in-95` plus slide, `registry/aria/components/ui/popover.tsx:37`) leaves the menu misplaced: `useST_MenuAnchor.ts:63-68, 84-85` measures the button's box once and re-measures only on resize or scroll, and the fixed anchor `<a>` sits inside the transformed popover (`aria/.../menus/ST_FilterOptionMenu.tsx:392-404`), so the offset counts twice. From the code, not reproduced; found by the D77 play.
	- Base UI and Radix share the hook and the same popover animation; after D77's portal the double offset is gone, but the anchor still keeps the mid-animation box. Likely the same bug, smaller; not verified.
	- Fix: `useST_MenuAnchor.ts` on the three bases re-measures on `animationend` while open (a capture listener on `document`, only for events whose target contains the anchor element, beside the resize and scroll listeners). The React Aria `ST_FilterOptionMenu.tsx` renders its anchor through `createPortal(..., document.body)` with the hydration guard, as Base UI and Radix do since D77.
	- React Aria repositions an open menu only when its trigger resizes or an input changes (`useOverlayPosition`); if the re-measure alone does not move the menu, the builder makes the menu follow the re-measured anchor at the root. No delayed click, no disabled animation.
	- Proof (P11): a sibling play of `ModeMenuNextToButtonPopover` opens the mode menu right after the popover appears, without the animation wait (`Filtering.stories.tsx:1333-1336`), waits for all animations to end and asserts the menu's box is adjacent to the mode button's box. It fails before the fix on React Aria and passes after on the three bases; the tracker records what Base UI and Radix did before the fix.
	- Runs as a fix milestone added to the running E11 epic, so 0.9.3 ships with it; the changelog gets a `#### Fix` block under `### Fixed`.
	- Owner, 2026-11-13: "2" (fix it in E11, 0.9.3 waits for it).
	- Source: Q65
- [x] **D81** Date filters compare dates, also when the column holds Date values #E12 #R4
	- With `filterVariant: 'date'` and an accessor returning a `Date`, the input yields a 'YYYY-MM-DD' string and greaterThan/lessThan compare it with `Date.toString()`: "greater than" keeps every row, "less than" none (run E11, card Q67). Seen live by the owner on 0.9.3, /docs/examples/react-query: "after 11/02/2025" kept rows dated 9/20/2025, 2/18/2025 and 9/28/2025.
	- Fix in the next epic, not as a patch release: date filter modes compare date values for `Date` accessors and for ISO string accessors. The spec follows one lookup: the exact cause in the filter functions, which modes are affected (equals, between), what Material React Table does, and whether the react-query and other remote examples filter in their own mock server code and need the same fix there.
	- Proof (P11): a play with a `Date` accessor column that fails before the fix on "greater than" and "less than" and passes after; the live demo (D78) may then return to a `Date` accessor.
	- Lookup 2026-11-13 (code read, not run). Cause: the date, datetime and time inputs send `event.target.value`, a string (`ST_FilterTextField.tsx:420-426` base and radix, `:445` aria); `shared/fns/filterFns.ts:85-170` then compares it with the `Date`'s text form. For a `Date` accessor all eight modes are wrong: `greaterThan` and `greaterThanOrEqualTo` keep every row, `lessThan`, `lessThanOrEqualTo` and `equals` none, `notEquals` every row, `between` and `betweenInclusive` none once the upper bound is set; a plain `'date'` column with no `filterFn` defaults to `fuzzy` (`column.utils.ts:216`) and keeps none. ISO string accessors work. Material React Table passes dayjs objects, so its greater, less and between modes work: a port deviation.
	- Fix: in `shared/fns/filterFns.ts` (identical on the three bases), when the row value is a `Date` the filter value becomes a timestamp before comparing: a date-only string reads as local midnight and equality compares by calendar day; an `HH:mm` value compares time of day. Filter values stay strings, so stored and URL state stay serializable. `getDefaultColumnFilterFn` (`column.utils.ts:210`) gives a plain date variant `equals` instead of `fuzzy`.
	- Examples affected, client side: advanced, subheader-filters, customize-filter-variants. Not affected: persistent-view (ISO strings), server-side-data (its route compares by `getTime()`).
	- react-query: its route `app/api/data/route.ts:29-33` compares dates correctly but ignores the filter mode (always `>`), and `getData()` re-randomizes `lastLogin` on every request (`route.ts:16`, `db.ts:1413`); the owner's live symptom there is not explained by the library bug. The spec finds that cause and fixes the route in the same epic.
	- Owner, 2026-11-13: "1k" (next epic, after a lookup).
	- Source: Q67
- [x] **D82** On React Aria the multi-select filter list opens on a click into its input #E12 #R4
	- Today it opens only on ArrowDown or the chevron; Base UI and Radix open on click (run E11 browser check of the D78 demo). Fix: React Aria opens on click like the other two bases. Owner, 2026-11-13: "decision is to fix it".
	- Source: Q68
- [x] **D83** Escape closes the filter chip editor after a select value is picked, on the three bases (superseded by D97) #superseded #E12 #R4
	- Today Radix closes it; Base UI and React Aria leave the editor open, and on React Aria the open editor blocks the Clear filters button until a click outside (run E11 browser check of the D78 demo). Fix: Escape closes the editor on Base UI and React Aria as on Radix, and Clear filters stays clickable. Owner, 2026-11-13: "fix. k".
	- Source: Q69
- [x] **D84** The live demo on Introduction and Usage has ten columns, so wide-table behavior shows #E12 #R4
	- The D78 demo (`examples/{base,radix,aria}/live-demo`) has six columns: First Name, Last Name, State, Age, Joined, Status. It gains Email, City, Department (select filter) and Salary (range filter), ten in all, so the table scrolls sideways at the docs width on purpose and pinning, hiding and reordering have columns to act on. No column is pinned by default. Checks as D78: both pages render it on the three bases and each non-text filter opens and filters rows. Owner, 2026-11-13: "add more columns in intro and usage instead to show the behaviours for multi columns"; "1 k".
	- Source: Q70
- [x] **D85** The Filter Mode line sits 6 px under the filter input #E12 #R4
	- The caption "Filter Mode: <mode>" has `mt-0.75` (3 px) in nine places: `ST_FilterTextField.tsx`, `ST_FilterRangeFields.tsx`, `ST_FilterRangeSlider.tsx` on Base UI, Radix and React Aria. It becomes `mt-1.5` (6 px); `leading-[0.8rem]` and the other classes stay. Owner, 2026-11-13: "need to increase a bit padding for the line that says filter fuzzy"; "1 k".
	- Source: Q71
- [x] **D86** Range filter editors show both inputs in full and accept input #E12 #R4
	- Live 0.9.3, /docs/examples/filter-variants, Base UI, Departure Time chip, mode between inclusive: the two time inputs sit side by side, the second runs past the editor's right edge (no clock icon), and the owner could not fill the inputs at all. Fix: in the chip editor both inputs of a range filter fit inside the editor and accept input, on the three bases, for time, date, datetime and number ranges. The cause of the failed input is not looked up; the spec finds it first. Proof (P11): a play that fills both inputs of a time range in the chip editor and asserts both boxes lie inside the editor's box. Owner, 2026-11-13: "This filter is broken"; "I wasn't able to put inputs at all, need to fix the UI as well"; "Q73 1k".
	- Source: Q73
- [x] **D87** On React Aria the select filter's chevron sits at the right end of its input #E12 #R4
	- Live 0.9.3, /docs/examples/filter-variants, React Aria, City chip editor, mode equals: the chevron follows the placeholder "Filter by City" in the middle of the input. Fix: the chevron sits at the input's right end, as on Base UI and Radix (the spec compares the three). Owner, 2026-11-13: "arrow in the middle, ui issue"; "1 k".
	- Source: Q75
- [x] **D88** Typed filters use one debounce hook with commit and cancel rules #E12 #R4
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
- [x] **D89** Release 0.9.4 ships E12 #E12 #R4
	- E12 (D71, D81 to D88, and the home heading decision if the owner adds it) ships as 0.9.4 in the same epic: a release spec modelled on spec 38 (`plan/specs/38-release-0-9-3.md`), patch label `release:patch` (D49), the D40 flow, the runner approves Prepare Release (D47), post-release sync per P4. The release milestones run as soon as every other milestone of the epic has merged and its checks pass; no preview stop, except that the D71 comparison table is read by the owner in chat before its milestone merges. Owner, 2026-11-13: "yes add" (on "add release 0.9.4" to E12).
	- Edited 2026-11-13 before build: the owner does not read the comparison table. The lead verifies every cell against its cited source before the milestone merges and removes or corrects a cell that the source does not show; nothing is pasted to the owner. This also replaces the owner read in D71's Checks. Owner: "Double check and verify yourself, I don't wanna see it."
- [x] **D90** Home hero: the name stays the heading; the line above and the sentence below carry the search words #E12 #R4
	- Amends D73 (built, live in 0.9.3) for the hero line and adds the hero sentence. The h1 stays `shadcn-table`. The line above it reads `The open-source shadcn data table for React, built on TanStack Table.` (was `The open-source React data table for shadcn/ui, built on TanStack Table.`). The sentence below it reads `A production-ready data table library built with TanStack Table and shadcn/ui. Sorting, filtering, pagination, grouping, pinning, virtualization, and more, all built in.` (was `A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.`). The title tag and the meta description of D73 are unchanged. Chosen by the owner after the SEO research in session "v0.9.x heading". Checks: `curl` of `/` on a production build shows both texts exactly; `pnpm test docs-e2e --base base` green. Owner, 2026-11-13: "this is what I picked for 72".
	- Source: Q72
- [x] **D91** The table context and the defaults context move to a context folder, named as contexts #E12 #R4
	- `hooks/stTableHook.tsx` (table context pair, `useSTContext`, `ST_TableProvider`, and the factory `createSTTableHook`) and `hooks/useST_Defaults.tsx` (context, provider, reader hook) are filed and named as hooks. Per base, under `registry/<base>/components/ui/shadcn-table/`: new `context/ST_TableContext.tsx` exports `tableContext`, `useTableContext`, `useSTContext`, `ST_TableProvider`; new `context/ST_DefaultsContext.tsx` exports `ST_DefaultsContext`, `ST_DefaultsProvider`, `useST_Defaults`; the factory moves to `hooks/createSTTableHook.ts`; the two old files are removed.
	- Every exported name stays the same, so imports through `index.ts` keep working; only path imports change (about 60 files per base, the stories, the registry entries, the docs pages that name the files). One file per context holds context, provider and reader hook together.
	- Checks: `grep -rn "hooks/stTableHook\|hooks/useST_Defaults" packages apps` prints nothing outside the changelog; typecheck, lint, validate-repo and the Storybook tests green on the three bases; the registry is regenerated and `registry.json` lists the new paths; the changelog names the moved files under `### Changed`.
	- Runs as a fix milestone added to the running E12 epic, after `Filter editor fixes` has merged (same files' import lines), so 0.9.4 ships with it.
	- Owner, 2026-11-14: "These are bad coding patterns"; on the first suggested layout: "this looks better. record and add to current epic".
	- Source: Q82
- [x] **D92** ISO date-time text values keep comparing as dates in date filters #E13 #R4
	- Spec 40 (merged) compares string row values that match `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/` as dates in the eight modes, beyond its own 1.6.2 (string values keep today's branches). Kept: for ISO text the order is the same as before, and `equals` now matches by day as D81 asks for Date values, so the two accessor kinds behave alike. Settled by the lead (a deviation that keeps the decided behavior), 2026-11-14.
	- Source: Q77
- [x] **D93** Clearing an is-empty filter returns the column to its default filter mode (superseded by D165) #superseded #E13 #R4
	- `ST_FilterTextField.tsx:292` and `ST_ColumnActionMenu.tsx:170` (three bases) reset a cleared `empty`/`notEmpty` mode to `allowedColumnFilterOptions?.[0] ?? 'fuzzy'`; on a date column that is fuzzy, not the `equals` default of D81. Fix: reset to `getDefaultColumnFilterFn(columnDef)` when the column lists no allowed options. Proof (P11): a play on a date column that sets is-empty, clears it and asserts the mode. Settled by the lead (one right answer), 2026-11-14.
	- Source: Q78
- [x] **D94** The column filtering guide states the date defaults of D81 #E13 #R4
	- `content/docs/guides/column-filtering.mdx:93-98, 175` still says every column defaults to fuzzy and does not mention date comparison. Fix: the guide says date, datetime and time columns default to `equals` and compare by local day, minute or time of day, also for `Date` accessors; no other wording changes. Settled by the lead (a factual correction), 2026-11-14.
	- Source: Q79
- [x] **D95** The React Query example offers only the filter modes its server applies #E13 #R4
	- `app/api/data/route.ts` applies contains to text columns whatever mode is sent, while `examples/<base>/react-query/TS.tsx` offers every mode on them. Fix: the text columns list only the contains mode (`columnFilterModeOptions`), as spec 40 did for Last Login; the route is unchanged. Settled by the lead (the example must not offer what it ignores), 2026-11-14.
	- Source: Q81
- [x] **D96** A click in a date or time filter box starts typing at its first part (superseded by D164) #superseded #E13 #R4
	- Native Chromium date, datetime and time inputs put the caret on the segment under the click; a click at the centre of a filter box lands on the year, so typed digits fill only the year (run E12, spec 41 1.6.3; the owner could not fill the range inputs on live 0.9.3). Fix: in the filter date, datetime and time inputs, single and range, on the three bases, a pointer click into the field moves the caret to the first segment; the native picker icon, keyboard navigation between segments and a click on an already focused field keep the browser's behavior. The spec checks Chromium, Firefox and Safari and names what each allows. Proof (P11): a play that clicks the centre of a date range input, types a full date and asserts the value. Owner, 2026-11-14: "k" on option 1.
	- Source: Q80
- [x] **D97** React Aria filter popups are modal again as in 0.9.3; the Escape fix stays #E12 #R4
	- Supersedes D83.
	- Spec 41 (1.6.3) met D83's "Clear filters stays clickable" by adding `isNonModal` to three React Aria filter popups (`registry/aria/.../toolbar/ST_FilterChips.tsx:114`, `:225`, `ST_HeaderFilterEditor.tsx:141`, commits `0f0f9f54`, `df03b7f1`). A non-modal React Aria popup closes on page scroll and no public prop turns that off (`react-aria` 3.53.1 `usePopover.mjs:42`); the owner rejects closing on scroll.
	- Fix: remove `isNonModal` from the three popups and the code added only for it (focus on open in `focusFilterInput`, the two `shouldCloseOnInteractOutside` filters, the `clickInView` and `clickInPlace` helpers in `test/docs-e2e/lib/helpers.mjs` where nothing else needs them), in the registry and the generated docs copies. Not a revert of the commits: the `closeOnEscape` change (Escape closes the editor after a select pick, base and aria) and every other E12 fix stay.
	- React Aria again: page locked while a popup is open, the popup never closes on scroll, the first outside click only closes it. Clear filters takes two clicks there with a popup open; D83's "Clear filters stays clickable" is dropped for React Aria. The play `ClearFiltersClickableWithEditorOpen` no longer asserts one click on React Aria. Base UI and Radix are unchanged.
	- Checks on React Aria: `EscapeClosesEditorAfterSelectPick` passes with the modal popup; a popup stays open and the page does not scroll while it is open; the select filter's arrow sits at the right edge of its field (owner screenshot of live 0.9.3, `/docs/examples/filter-variants`, City chip), and a misplaced arrow becomes its own card. CHANGELOG 0.9.4 drops the non-modal lines.
	- Owner, 2026-11-14: "The old behavior was completely fine", "don't just blindly revert code", "k".
	- Source: Q83
- [x] **D98** The plain filtering demo stories show filter chips; the tested subheader stories stay and say Subheader #E13 #R4
	- `packages/shadcn-table/stories/features/Filtering.stories.tsx` has 37 stories; 21 pin `columnFilterDisplayMode: 'subheader'` while the library default is `'chips'` (`useST_TableOptions.ts:40`), so Storybook shows the old filter row for most filtering features (owner, 2026-11-08, deployed Storybook).
	- Fix: the 10 subheader stories with no play drop the pin and follow the default chips: FilterFnAndFilterVariants, FilterFnAndFilterVariantsFaceted, FilteringChangeModeEnabled, DisableSomeFilterTypesForCertainColumns, FilteringDisabledForCertainColumns, CustomFilterFunctionPerColumn, CustomFilterFns, CustomFilterComponent, CustomizeFilterTextFields, ExternalSetFilterValue.
	- The 11 subheader stories with a play keep the subheader row and their plays unchanged, as that mode's regression tests; each gets a story name that says "Subheader". FilterModeMenuClosesInPlace reuses the render of FilteringChangeModeEnabled (:489) and keeps a subheader render of its own.
	- The 5 popover stories, the chips stories and `FilterChips.stories.tsx` are unchanged (`FilterModePickerTableLevel` already shows chips).
	- Owner, 2026-11-14: "k" on option 1.
	- Source: Q2
- [x] **D99** The React Query example's text columns filter with contains, so the one mode offered shows active #E13 #R4
	- Spec 52 (D95) limits the five text columns of `examples/<base>/react-query/TS.tsx` to `columnFilterModeOptions: ['contains']`, but they keep the default fuzzy filter function, so the mode button reads auto and Contains shows unchecked. Fix: those five columns also set `filterFn: 'contains'`, in the spec 52 milestone before it merges; the route and the request are unchanged. Settled by the lead (the example must show the mode its server applies), 2026-11-14.
	- Source: Q86
- [x] **D100** A release ships only when planned in its epic or on the owner's yes; an owner hold stays until the owner lifts it #E17 #R4
	- Release 0.9.4 was on a hold the owner asked for (Q83); the lead lifted it once the fix merged and the runner published without an owner yes. From 0.9.5 on: a release that is part of an epic the owner started ships with that epic; a release not in the plan ships only on the owner's explicit yes; a hold the owner asks for stays until the owner says release, and a merged fix, green checks, the lead or the runner never lift it.
	- D47 stays for the mechanics: once a release is allowed, the runner approves the deployment steps itself.
	- Recorded in `process.md` P4. Owner, 2026-11-14: "If I ask it to hold, then it should hold. Otherwise if I explicitly say yes or during the plan that release is part of it, then yes.", "record it".
	- Source: Q89
- [x] **D101** Top of the page: sections Get Started, Examples, Guides, API in a tab row under the top bar #E14 #R5
	- Replaces L1, L7, L10, L23.
	- The docs have four sections, in this order: Get Started, Examples, Guides, API. The order applies wherever the sections are listed: the tab row, the home page menu, the footer.
	- The first section is labelled "Get Started", not "Docs". Its pages are the getting-started pages (introduction, install, usage, agents, comparison) and its URLs already say `/docs/getting-started/`. The breadcrumb root "Docs" and the footer column head "Docs" stay; they name the whole docs area.
	- The section tabs form a row directly under the top bar on every docs page, left aligned with the brand: mono, uppercase, letter-spaced, muted; the active tab in the accent colour with a 2px underline. The space inside a label is tighter than the gap between tabs, so "GET STARTED" reads as one tab. A dashed rule runs below the row; there is no line between the top bar and the row. Top bar and row stay in place together when the page scrolls.
	- The row starts with the sidebar's hide and show button (L25), close to the first tab, with no divider. On the mobile layout the button is not shown and the row scrolls sideways when the tabs do not fit.
	- The top bar holds the brand on the left, the search box in the centre (from the `lg` width up; an icon in the right group below it), then GitHub, Discord, the base selector and the theme toggle on the right.
	- Owner accepted on the preview 2026-11-17.
	- Source: LQ9, LQ15, LQ18
	- Source: docs-layout L24 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D102** The sidebar, in every section: one list per section, flush groups, sticky labels, hide and resize #E14 #R5
	- Replaces L8, L9, and the general parts of L22.
	- Each section has its own sidebar: on an Examples page it lists only the examples, on a Guides page only the guides. Guides and API open with an Overview row; Examples has none (L26). The prev/next footer still crosses from one section into the next, in the section order of L24.
	- No heading row with the section's name at the top of the list; the active tab names the section.
	- Group labels and their pages share one left edge: no indent, no guide line. Labels are small, mono, uppercase and muted.
	- Groups never collapse. The one exception is "More examples" in the Examples sidebar (L26).
	- Sticky group labels: while the sidebar scrolls, the label of the group in view sticks at the top with a dashed line below it and no fade; the next group's label pushes it out. Only one label shows at a time.
	- Hide and show: the button at the start of the tab row hides the whole sidebar and brings it back. Its icon carries an arrow pointing left when the sidebar is open and right when it is hidden; the tooltip reads "Hide sidebar" or "Show sidebar". The sidebar slides in about 200 ms and the content follows; no animation on reload, while resizing, or for visitors who ask for reduced motion. The state survives a reload.
	- Resize: dragging the sidebar's right edge changes its width between 220 and 480 px; a double click resets it; arrow keys work; the width survives a reload.
	- The header's text links never show as rows in the sidebar, at any width; the tab row replaces them, also on the mobile layout.
	- Guides and API: their labels, groups and order stay as they are today.
	- Owner accepted on the preview 2026-11-17.
	- Source: LQ16, LQ17, LQ7, LQ25
	- Source: docs-layout L25 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D103** The Examples sidebar: Featured first, groups by demand, numbered rows, stories under "More examples" #E14 #R5
	- Replaces L13 and the Examples parts of L22. The long scrolling examples page (old L2 to L6) is not built; it never reached the live site.
	- The Examples section has no overview page. `/docs/examples` and the Examples tab open the first example in the list, Basic, through a permanent redirect, so a table shows without a click.
	- Regrouping moves no page: titles, URLs, descriptions and text of the 42 example pages stay as they are (LQ29 covers titles and URLs).
	- Groups, in this order, labels without the word "Examples":
	  - Featured: Basic (`basic`), Server-Side Pagination (`react-query`), Inline Editing (`editing-crud-inline-row`), Virtualization (`virtualized`), Advanced (`advanced`). A filter example is not featured, because the basic table already filters.
	  - Filtering: `filter-variants`, `faceted-values`, `filter-switching`, `popover-filters`, `subheader-filters`, `custom-filter-ui`.
	  - Server Data: `remote`, `dynamic-columns`, `lazy-detail-panel`, `lazy-sub-rows`.
	  - Pinning: `sticky-header`, `column-pinning`, `sticky-row-pinning`, `static-row-pinning`, `sticky-row-selection`.
	  - Virtualization: `row-virtualization`, `column-virtualization`, `infinite-scrolling`.
	  - Editing: `editing-crud`, `editing-crud-inline-cell`, `editing-crud-inline-table`, `editing-crud-tree`.
	  - Grouping: `column-grouping`, `customized-grouping`, `aggregation-and-grouping`.
	  - Expanding: `expanding-tree`, `expanding-tree-flat-parse`, `detail-panel`, `chart-detail-panel`.
	  - Drag and Drop: `column-ordering`, `row-ordering`, `row-dragging`.
	  - Export: `export-csv`, `export-pdf`.
	  - Customization: `minimal`, `custom-headless`, `persistent-view`.
	  - More examples: every Storybook group as a labelled sub-group, with its stories as rows (L29).
	- Row labels: the Featured rows use the names above; every other row is the page title without the word "Example". The short label shows only in the sidebar; page heading, browser title, breadcrumb, prev/next and the example picker keep the page title.
	- Numbers, Examples only: every row starts with its running number and a dot ("1. Basic", "12. Popover Filters"), counted through the whole section in sidebar order, the "More examples" rows included, no leading zeros. Every group label ends with its row count in brackets ("Featured (5)", "More examples (652)"). The numbers are computed from the order, never typed into a page, and show in the sidebar only.
	- "More examples" is the only group that collapses. It starts closed, opens when the current page is inside it, and otherwise stays as the visitor left it. Its sub-group labels do not collapse.
	- Why this order and these names: `featured-examples-research.md`, `example-demand-audit.md`. Old against new position of every page: `sidebar-regroup-checklist.md`.
	- Owner accepted on the preview 2026-11-17: the real Examples section, and "More examples" with the numbers and counts in the EX B demo.
	- Source: LQ8, LQ10
	- Source: docs-layout L26 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D104** Example pages: "Try it" steps above the table, "Related guides" below, existing text unchanged #E14 #R5
	- Replaces L14.
	- Page order: title and description (unchanged); the page's existing body text, word for word; "Try it"; the live example; "Related guides".
	- Try it: an h3 heading, then 2 to 4 steps in the `TryIt` component: one short line each, an action and a few words of result, small muted text, directly above the live example. On-screen labels and typed values are inline code, with the exact label the table shows (for example `Sort by First Name ascending`).
	- Every step is true to the example's code and data in all three bases. Where the page text does not explain a behaviour the visitor will hit, the step carries the reason in a few words (detail panel: "these rows have no address").
	- Related guides: an h2 heading and a list of links to the guide pages for the feature, below the example; every link resolves.
	- The "View Extra Storybook Examples" line is removed from the page; the toolbar Storybook button replaces it.
	- Text check: every Try it step and every Related guides line is verified before it ships, against four criteria. Wording: it reads right and uses the exact on-screen labels. No slop: no filler, nothing that could be deleted without loss. No unnecessary jargon: plain words where a plain word exists. Simple and short enough: one short line per step, 2 to 4 steps. A text that fails one criterion is rewritten, not shipped.
	- Not part of this decision: rewording titles, descriptions or body text (LQ26, LQ29).
	- Owner accepted on the preview 2026-11-16: pages `basic-new-format-2`, `detail-panel-new-format-2`, `row-dragging-new-format-2`.
	- Source: LQ21, LQ23, LQ24
	- Source: docs-layout L27 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D105** Guide pages: an "Example" section under the intro with the best example; the guide's text unchanged #E14 #R5
	- Replaces L15.
	- Page order: title, description and intro paragraph (unchanged); the "Example" section; the rest of the guide (unchanged text, same order).
	- The rules, in the owner's words of 2026-11-17:
	  - Every guide gets an Example section. No guide is left without one.
	  - The example in it is the best one for that guide.
	  - A table that was already in the guide is removed only when both hold: the same example is now shown in the Example section, and the table is not part of the guide's story or writing. Then removing it breaks nothing. A table the writing depends on stays, even when the Example section shows the same example. A table that shows a different example stays.
	  - After the implementation there is a short checklist, one line per guide, so the owner can check every guide by hand: which example the section shows, and which table was removed, if any. Nothing is released without the owner's approval of that checklist.
	- The Example section is a heading "Example" at the guide's section level and the live example block, nothing else.
	- The example's toolbar names the example in its left slot. One example: the example page title followed by the arrow-up-right icon, together the link to the example page. Several examples: the example picker (arrows and dropdown) listing only this guide's examples; it swaps the table in place without changing the URL, and an "Open example page" button beside it follows the selection.
	- On guide pages the toolbar stays on one row: the name truncates, and Storybook and Copy prompt show only their icons when the column is narrow. Example pages are unchanged.
	- Guide sections are h2 and their sub-sections h3; every guide heading moves up one level.
	- Guide text is not reworded (LQ26).
	- An example shown twice on one page must not repeat its element id.
	- Owner accepted on the preview 2026-11-16: pages `column-pinning-new-format-3` and `virtualization-new-format-3`.
	- Source: LQ22, LQ27, LQ28
	- Source: docs-layout L28 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D106** Storybook and docs match one to one: every story is a docs page, the docs page owns the text #E14 #R5
	- Replaces L12, L19, L20, L21.
	- Every Storybook story is also an example page in the docs. The docs list follows Storybook: its groups and its stories, with the same names and order, under "More examples" in the Examples sidebar (L26). One story is one row and one page. This replaces the earlier wording "one page per story file, its stories as tabs".
	- Pairing: an audit lists every docs example with its story in a markdown file, in three lists: exact pair (same table), close pair (same feature, different table), no partner. After the audit every docs example has an exact story: the existing story where it already matches, otherwise a new story built from the example. No "closest story" links remain; the toolbar Storybook button always opens the same table.
	- Text: the docs page owns the details, the Try it steps and the related guides (L27). A story's description carries a link to its docs page and nothing more. No Storybook toolbar addon is built.
	- The docs page shows the story itself; story code is not copied into the docs examples. The code tab shows the story's source. How the docs mount a story for each base is settled in the plan.
	- Story pages that have no text yet start with the table and the Storybook button; their text is written in the docs and goes through the owner's wording review (LQ26).
	- Test stories: a story that shows the same table as another and only adds an automated check is not listed on its own; its check moves onto the story it copies and the copy is deleted. First case: "Renders Rows" in the Basic stories, a copy of "Default". A test story with its own different table stays listed like any other story; none is hidden or sorted by hand.
	- The Storybook folder "Fixed Bugs" is renamed "Miscellaneous", in Storybook and in the docs, as a whole; no story is moved out of it. It is kept for completeness and easy upkeep, not as a group visitors are expected to browse.
	- Every story group name is Title Case with spaces and without the word "Examples" ("sticky-footer" becomes "Sticky Footer", "useEffects" "Use Effects", "Aggregation Examples" "Aggregation"); the misspelt "click-propogation" becomes "Click Propagation". The change is made in the story files, so Storybook and the docs follow together, and the docs links to stories are regenerated in the same change. No two groups in one folder end up with the same name.
	- Owner accepted 2026-11-16 and 2026-11-17; the list and the names as in the EX B demo on the preview.
	- Source: LQ20
	- Source: docs-layout L29 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D107** Two small fixes: the footer's Storybook link follows the selected base; the last rounded boxes go square #E14 #R5
	- Replaces L17, L18.
	- The Storybook link in the home page footer opens the Storybook of the selected base. Today it always opens the Radix one.
	- The last rounded frames in the docs content get square corners, matching the square dashed style of the rest: the tab frames and panels, the code tab frames, the code block copy chip, the agent bar, and inline code in the prop tables. The table frame itself and the scroll controls stay rounded on purpose.
	- Settled by the lead 2026-11-16, confirmed by the owner 2026-11-17.
	- Source: LQ1, LQ6
	- Source: docs-layout L30 (`reference/docs-layout/decisions.md`), accepted by the owner 2026-11-17; text copied unchanged.
- [x] **D108** Every reorder drag works by touch on phones and tablets #E15 #R5
	- Supersedes the line "touch screens have no drag (unchanged)" of v0.8.x D37.
	- Every drag that reorders works with a finger as it does with a mouse, on all five surfaces: column reorder (grip and header), row reorder, the show/hide columns menu, the sort rules in the sort popover, and the grouping drop zone.
	- It works the same on all three bases (Base UI, Radix, React Aria).
	- Dragging a grip by touch does not scroll the page; a touch outside a grip scrolls as before.
	- Mouse dragging, column resize and the range slider stay as they are today.
	- Today: reorder uses HTML5 drag and drop only, with no touch or pointer handlers; in phone emulation column reorder starts but the order never changes and row reorder never starts.
	- Proof: each of the five drags has an automated touch check per base, and one check on a real phone or tablet before the release that carries it.
	- Owner picked option 1 of Q90, 2026-11-17.
	- Source: Q90
- [x] **D109** E14 builds on its own branch so patch releases keep going #E15 #R5
	- Every E14 milestone branch is created from `origin/v0.9/docs-layout` and merges into `v0.9/docs-layout`, never into `claude/review`. The branch is created from `origin/claude/review` on 2026-11-17.
	- `claude/review` stays free for patch releases (date filter fixes, touch dragging); nothing of E14's code or content reaches it, `dev` or `master` during the run.
	- `v0.9/docs-layout` merges into `claude/review` only on the owner's explicit word, after the owner's reviews (the guide checklist of D105, the Try it texts of D104, the story texts of D106). It lands as one merge.
	- After each patch release `claude/review` is merged into `v0.9/docs-layout`, so the branch stays close.
	- Plan files, trackers, the grid and decisions stay on `claude/review` as before.
	- Why the whole epic: the sidebar, tab row and page formats are also not released yet, and without the texts `claude/review` would carry about 650 story pages with no text.
	- Owner recorded 2026-11-17.
- [x] **D110** All 59 copied stories merge into the story they copy #R6
	- Settled by the lead: D106's rule applied as written (a copy whose copied story has no check of its own merges; its check moves onto the story it copies).
	- The audit of E14 (`reference/docs-layout/story-pairing-audit.md`, list 4) found 59 such copies in 59 same-table groups, not the 2 the plan assumed: 54 move a play, 5 had none; 12 stories now carry two or more plays.
	- Kept as built in E14.
	- Source: Q92
- [x] **D111** Each of the 42 docs examples gets a new exact story #R6
	- Settled by the lead: D106 as written (every docs example has an exact story; a new story built from the example where none matches).
	- The audit found exact 0, close 34, no partner 8, so all 42 examples get a new story. Story pages under More examples: 593.
	- Kept as built in E14.
	- Source: Q93
- [x] **D112** Story group names with no example in D106 follow its Title Case rule #R6
	- Settled by the lead: D106's naming rule (Title Case with spaces) applied where D106 gives no example.
	- 'AppBar overlaps with Fullscreen Modal' is 'App Bar Overlaps With Full Screen Modal'; 'Click to Copy' is 'Click To Copy'; 'RTL' and 'Custom Filter Fns' stay.
	- Kept as built in E14.
	- Source: Q95
- [x] **D113** An example shown twice on a page has different ids in the served HTML too #E15 #R6
	- Settled by the lead: D105 says an example shown twice on one page must not repeat its element id.
	- Today the second mount gets its own id only after the page has loaded; the served HTML of a guide with the same example twice carries the id twice (`components/example-playground.tsx`, `useExampleId`).
	- Fix: the ids differ in the served HTML. Check: `curl` of a production build of such a guide page shows no repeated example id.
	- Source: Q94
- [x] **D114** The column pinning example locks the ID column with the option that works #E15 #R6
	- Settled by the lead: the example's comment says the ID column cannot be pinned, but it sets `enableColumnPinning: false` on the column, an option that does nothing; the column option is `enablePinning`.
	- Fix: `enablePinning: false` on the ID column in `examples/{base,radix,aria}/enable-column-pinning`, and in its exact story. No page text changes.
	- Source: Q98
- [x] **D115** The chart detail panel and editing stories match their examples exactly #E15 #R6
	- Settled by the lead: D106 says the story is the same table as the example.
	- Today the chart detail panel story draws its lines in inline SVG (the example uses recharts) and the five editing CRUD stories confirm a delete in an inline box (the examples open a modal dialog).
	- Fix: recharts and an alert dialog are added to the package's story setup only, as development dependencies and story-only files; nothing is added to what the registry ships. The six stories then match their examples.
	- Source: Q99
- [x] **D116** Story pages no longer triple the size of the docs build #E15 #R6
	- Settled by the lead: a build problem, not an owner item.
	- Measured in E14: the docs build output grew from 644 MB to 1.9 GB; 1.0 GB of it is the HTML and RSC of the 594 story pages, each carrying the Examples sidebar of 636 rows.
	- Fix: the build output returns close to its size before the story pages. What the visitor sees in the sidebar stays as D102 and D103 say; the mechanism is settled in the spec.
	- Source: Q101
- [x] **D117** The guide Example section sits right after the first intro paragraph #E15 #R6
	- Settled by the lead: D105's page order (title, description and intro paragraph; the Example section; the rest) and the accepted preview page `virtualization-new-format-3`.
	- Today the section sits before each guide's first own heading, so on 16 guides a note or further intro blocks stand above it.
	- Fix: the section follows the first intro paragraph on every guide; notes and further intro blocks come after it. On `production-ready-tables` this also puts the guide's own table back as the nearest one above 'Open the Code view above'. No guide text is reworded.
	- Source: Q105
- [x] **D118** The Basic page's Try it steps name the real menu label and add a column filtering step #E15 #R6
	- Changes the Try it text of `content/docs/examples/basic.mdx` that the owner accepted on `basic-new-format-2` (D104).
	- The steps, four in all:
	-   1. Click `First Name` and choose `Sort ascending`. The rows reorder.
	-   2. Try column filtering: click `Filter`, choose `State` and type `Nebraska`. Two rows remain.
	-   3. Remove the filter. All five rows return.
	-   4. Open search and type `Ohio`. One row remains.
	- Step 1 names `Sort ascending`, the label the column menu shows, not `Sort by First Name ascending`.
	- Step 2 carries the words "column filtering": the Basic page is where a visitor looking for column filtering lands, because D103 leaves a filter example out of Featured.
	- The labels inside the filter popup are checked by the D104 text check on all three bases; a label that differs on screen is corrected to the on-screen one, the four steps and the words "column filtering" stay.
	- Owner recorded 2026-11-17.
	- Source: Q96
- [x] **D119** Three example pages get a title and address that match their sidebar name #E15 #R6
	- Replaces, for these three pages only, D103's lines "Regrouping moves no page: titles, URLs ... stay as they are" and "page heading, browser title, breadcrumb, prev/next and the example picker keep the page title". Closes the title and URL part of docs-layout LQ29 for them.
	- Rule: an example page's title is its sidebar name plus " Example". "Basic" with "Basic Example" is right. 39 of the 42 pages already follow it and do not change.
	- The three that change:
	-   - `react-query`: title "React Query Example" becomes "Server-Side Pagination Example"; address `/docs/examples/server-side-pagination`.
	-   - `editing-crud-inline-row`: "Editing CRUD Inline Row Example" becomes "Inline Editing Example"; address `/docs/examples/inline-editing`.
	-   - `virtualized`: "Virtualized Example" becomes "Virtualization Example"; address `/docs/examples/virtualization`.
	- The title drives the heading, browser title, breadcrumb, prev/next and the example picker; all follow.
	- Each old address redirects permanently to the new one. Every docs link to the three follows; a link text that names the old title gets the new title, and nothing else is reworded.
	- Six pages whose title follows the rule but whose address is shorter than the name stay as they are: `column-ordering`, `row-ordering`, `expanding-tree-flat-parse`, `export-csv`, `export-pdf`, `remote`.
	- Descriptions and body text are not touched (docs-layout LQ26).
	- Owner recorded 2026-11-17.
	- Source: Q108
- [x] **D120** The Sticky header switch in View settings wins over the enableStickyHeader option #E15 #R6
	- `enableStickyHeader` sets how the table starts: with `true` the header is sticky and the `Sticky header` switch in `View settings` shows on.
	- The visitor's switch then decides: off unsticks the header, on sticks it, whatever the option says.
	- Full screen still forces the sticky header on, as today.
	- Today every sticky check joins the option and the switch with "or", so the option always wins and the switch shows off while the header stays stuck: `ST_TableHead.tsx:72`, `ST_TableHeadCell.tsx:183`, `ST_TableBodyRow.tsx:181`, `ST_TableBody.tsx:154`, `ST_TableContainer.tsx:152`.
	- All three bases alike. MRT has no such switch.
	- Owner recorded 2026-11-17.
	- Source: Q97
- [x] **D121** A wrong address on the docs site shows our own 404 page #E15 #R6
	- A missing address on the docs site shows a 404 page of our own inside the site frame: top bar, footer, theme and base selector, in the mono dashed style of the rest of the site.
	- The page holds three things: the line "404" with "This page does not exist", the docs search box, and links to the four sections in the order of D101: Get Started, Examples, Guides, API.
	- It works in light and dark and on the mobile layout, and answers with the HTTP status 404.
	- Today `apps/shadcn-table-docs/app` has no `not-found` file, so the framework's default page shows.
	- Not part of this: a "Did you mean" suggestion.
	- Owner recorded 2026-11-17.
	- Source: Q110
- [x] **D122** A guide shows each table once, on top, and the removed table's explainer line moves up with it #E15 #R6
	- From the owner's review of `reference/docs-layout/guide-checklist.md` (all 46 guides ticked, five with a remark and a screenshot). The other 41 guides keep the example they show.
	- Changes two lines of D105. "A table the writing depends on stays, even when the Example section shows the same example": a guide no longer shows the same table twice; the copy further down is removed with its heading. "The Example section is a heading and the live example block, nothing else": when the removed table had an explainer line, that line moves into the Example section, between the heading and the table, word for word. A removed table without such a line adds none.
	- Building Production-Ready Tables: one table on top. Line: "Open the network tab and click around. Every page, sort, search or filter change sends one request to `/api/users`." The table kept is the one this sentence is true for.
	- Async Loading: the React Query table shows once, on top. Line: "Here is a copy of the full [React Query](/docs/examples/react-query) example." The heading "Full Loading and Server-Side Logic Example" goes with the removed table. The loading and linear progress tables stay.
	- Pagination: the Remote Data table shows once, on top. Line: "Here is the full Remote Data example showing off server-side filtering, **pagination**, and sorting." The alternate pagination table stays.
	- Scroll Cues: one table on top. Line: "Hover the table to see the chevrons; the start and end pinned columns cast the edge shadow."
	- Click to Copy: the Example section shows the guide's own Click to Copy example (First Name, Last Name, Email, City), not Advanced, with its own page so the name links (D106). Every cell copies: the example sets `enableClickToCopy: true` for the whole table instead of on Email and City only; the library is not changed. The example at the end of the guide is removed.
	- Sorting and Global Filtering keep their Remote Data table at the end; their Example section shows Basic, so nothing shows twice.
	- Owner recorded 2026-11-18.
	- Source: Q100
- [x] **D123** Storybook is upgraded to the latest stable version, as planned work with a baseline #E15 #R6
	- Storybook and every `@storybook/*` package move to the latest stable release at the time the work runs. On 2026-11-17 that is 10.6.7; installed is 10.6.2. A beta or release candidate is not a target.
	- It is planned work, a spec in an epic, not a hotfix. The hotfix started on 2026-11-17 (branch `v0.9/storybook-upgrade`) was stopped by the owner and is not merged.
	- Baseline before any change: the story tests on base, radix and aria, the three static builds, the story pages the docs mount, and screenshots of a fixed set of stories.
	- Audit: every Storybook package, addon and config the project uses is checked against what the target version expects: the three-base scripts, `storybook-dark-mode`, the vitest setup, `composeStories` in the docs app, the deployed builds.
	- The upgrade is one install on its own branch. `pnpm ls storybook` shows one version in the package and in the docs app.
	- Proof: tests, builds, screenshots and docs story pages compared with the baseline on all three bases, and the deployed Storybook checked on a preview.
	- Known issues are listed with what is done about each, among them the `glob` vulnerability that comes in through `@storybook/react-vite` (Storybook issue 37409) and the peer range of `storybook-dark-mode`.
	- Owner recorded 2026-11-18.
	- Source: Q112
- [x] **D124** The first line above each Storybook story reads View documentation for this example #E15 #R6
	- The three lines above every story, in this order:
	-   1. View documentation for this example
	-   2. These stories render shadcn-table on React Aria. The other bases: Base UI, Radix UI.
	-   3. View Source code for these examples in the code tab below or here on GitHub.
	- Line 1 is new wording: the whole line is a link to the story's docs page (D106); no address is shown. Before: "This story on the docs site: shadcn-table.com/docs/examples/..." (`packages/shadcn-table/.storybook/preview.tsx:164-173`).
	- Lines 2 and 3 stay as built: the base name follows the Storybook the visitor is in, the other two bases and "here on GitHub." are links.
	- Owner's wording, recorded 2026-11-18.
	- Source: Q102
- [x] **D125** Ticking a parent row ticks its sub-rows #E15 #R6
	- Settled by the lead: a bug with one right behaviour, the one MRT has.
	- Today ticking a parent leaves its sub-rows unticked: `shared/utils/row.utils.ts:168-182` toggles the row, then reads `row.getIsAllSubRowsSelected()`, which the v9 store already reports as true, and unticks them all. Base, radix and aria alike.
	- Fix: ticking a parent ticks all its sub-rows; unticking it unticks them; ticking the last unticked sub-row ticks the parent. A check per base.
	- The Try it text of the story page `features-sub-row-tree--sub-row-tree-with-selection` was written to match the bug; it is corrected with the fix and stays in the owner's wording review.
	- Source: Q103
- [x] **D126** A column's resize grip can be dragged across its whole width #E15 #R6
	- Settled by the lead: a bug with one right behaviour.
	- Today the right half of the grip is covered by the next header cell: the handle sits half over the next cell (`head/ST_TableHeadCellResizeHandle.tsx:60-62`) and cannot rise above it, because every head cell is its own layer (`shared/utils/style.utils.ts:188-196`, `ST_TableHeadCell.tsx:296`). Base, radix and aria alike.
	- Fix: a drag starts from anywhere on the grip, also on pinned and sticky headers. A check per base that drags from the grip's right half.
	- Source: Q104
- [x] **D127** The Click to copy button fits its cell and shows its own tooltip #E15 #R6
	- Settled by the lead: a bug with one right behaviour.
	- Today the copy button cannot shrink (`buttons/ST_CopyButton.tsx:16,74-80`), so in a narrow cell it overflows its truncating span (`ST_OverflowText`); on React Aria a hover then opens the cell's overflow tooltip instead of "Click to copy". The overflow is in base, radix and aria.
	- Fix: the button stays inside its cell and its text truncates; hovering it shows "Click to copy" on all three bases. A check per base on a narrow column with the pointer, not keyboard focus.
	- Source: Q107
- [x] **D128** A pinned row stays in view while virtualized rows scroll #E15 #R6
	- With row virtualization on and sticky row pinning, a pinned row stays stuck at the top or the bottom of the table body while the other rows scroll under it, as it does without virtualization.
	- Today a virtual row is always placed by position and the sticky rule applies only when the row is not virtual (`body/ST_TableBodyRow.tsx:228-262`), so a pinned row scrolls away. Base, radix and aria alike.
	- This goes beyond MRT, where a pinned virtual row does not stick either (`MRT_TableBodyRow.tsx:181-218`).
	- Holds for several pinned rows at the top and at the bottom, with a sticky header, and with rows that leave the rendered range while pinned.
	- Proof: the story `features-row-pinning--row-pinning-sticky-with-virtualization` on the three bases; pin a row, scroll to the end, the row is still in view. Its docs page text follows the working behaviour.
	- Owner tested the story locally and recorded 2026-11-18.
	- Source: Q106
- [x] **D129** The docs Storybook button opens the local Storybook under the dev server #R6
	- Under the docs dev server the Storybook button links to the local Storybook: base `http://localhost:6007/`, radix `http://localhost:6006/`, aria `http://localhost:6008/`, with the same `?path=/story/<id>`. A production build keeps the deployed addresses `https://storybook.shadcn-table.com/{base,radix,aria}/`.
	- Before, the three deployed addresses were fixed in `components/mdx/storybook-link.tsx`, so the button could not be checked locally.
	- Built as a hotfix on `v0.9/docs-layout`, merge 675337f9, on the owner's instruction of 2026-11-17.
	- Owner closed the card 2026-11-18.
	- Source: Q109
- [x] **D130** The Production-Ready Tables guide's own table becomes a story and shows on top #E15 #R6
	- Completes D122 for this guide. The guide's own table (the server-side data table the guide builds, which calls `/api/users`) becomes a Storybook story and so a page under "More examples" (D106), with its text.
	- The guide's Example section shows that story: the heading, the line "Open the network tab and click around. Every page, sort, search or filter change sends one request to `/api/users`.", then the table, its name linking to the story page. The table shows once; the React Query table is no longer shown in this guide.
	- The guide's later sections that point at this table ("Open the Code view above", the folder tree) stay word for word and stay true.
	- The story behaves as the guide's table does: every page, sort, search and filter change sends one request. Inside Storybook the server is a stand-in that answers `/api/users`; how is settled in the build.
	- Measured before: the guide's own table calls `/api/users`, the React Query example calls `/api/data`, so the sentence is true only for the guide's own table.
	- Owner recorded 2026-11-18.
	- Source: Q113
- [x] **D131** The Production-Ready Tables guide's Code view keeps showing the guide's five files #E18 #R6
	- Settled by the lead: the one way that keeps both D130 (the guide's sentence 'Open the Code view above to browse the files' and the five-file `server-side-data/` tree stay true) and D106 (a story page's Code tab shows the story source).
	- In the guide, the Code view of the Example section shows the five files of the example folder `server-side-data/`, through an opt-in map in `GuideExamples` from this story's id to that folder.
	- The story's own page under More examples keeps the story source in its Code tab, like every story page.
	- The docs E2E check 'server-side-data: 5 files in the tree' stays and passes.
	- Source: Q114
- [x] **D132** A touch drag on a header starts after a short hold and a ghost copy follows the finger #R6
	- Details D108 where it is silent; D108's five surfaces and three bases stand.
	- A grip starts the drag at once.
	- A header cell that is itself draggable, with no grip, starts the drag after the finger rests about 300 ms without moving; a swipe before that scrolls the table as today.
	- While a touch drag is on, a ghost copy of the dragged column header, row, menu item or sort rule follows the finger, on all five surfaces. The dragged item keeps the same dragging style as with the mouse and the drop target is marked as with the mouse.
	- The ghost is removed on drop and on cancel, does not take touches, and does not show on mouse drags, where the browser draws its own.
	- Owner recorded 2026-11-18.
	- Source: Q115
- [x] **D133** The sidebar state script runs from the page head #R6
	- Settled by the lead: an owner-reported bug with one right behaviour, already fixed.
	- Opening the docs from the home page showed a script tag error in the console and lost the saved sidebar width (`app/docs/layout.tsx:22`).
	- Fixed as a hotfix on `v0.9/docs-layout`, merge bb8eec7a: the script moved to the root layout head; a docs E2E check (home, client navigation, saved width 360px, no script tag error) failed before and passes now.
	- Source: Q111
- [x] **D134** Pinned virtual rows are sticky rows in their own grid track #R6
	- Settled by the lead: a build deviation that keeps D128.
	- Spec 61 described absolute rows with a clamped offset; built as `position: sticky` in a grid track of their own (`ST_TableBody.tsx:84`, new optional prop `stickyGridRow` on `ST_TableBodyRowProps`), because an absolute row placed from the scroll offset lags and jumps.
	- Kept as built (ee1c2837 on `claude/review`): play green on three bases, 0 jumps in the scroll measurement. Spec 61 1.5 and 1.6.3 are read with this decision.
	- Source: Q119
- [x] **D135** The three renamed example pages rename the titles of their registry items too #R6
	- Settled by the lead: follows D119. Registry item titles are generated from the page frontmatter (`tools/registry/examples.mjs:181`).
	- The title lines of `example-react-query-*`, `example-editing-crud-row-*` and `example-virtualized-*` change on the three bases; item names and hosted paths do not (P7 holds).
	- Kept; the regenerated `registry.json` is committed with spec 58.
	- Source: Q120
- [x] **D136** The docs build size limit is measured without the build cache #R6
	- Settled by the lead: a build measure, not an owner item.
	- Spec 59's 900 MB limit is measured on `.next` without `.next/cache` (the turbopack build cache, not served, 518 MB before the change too). Measured: 583 MB, below the 644 MB from before the story pages; the story pages went from 1166 MB to 245 MB.
	- D116 is met. Spec 59 line 18 says so.
	- Source: Q122
- [x] **D137** The More examples rows come from one list bundled in the docs script #R6
	- Settled by the lead: a build deviation that keeps D116 and D103.
	- Spec 59 described rows fetched from a JSON route; built from the folder's `meta.json` bundled once (`lib/more-examples.ts`, `components/docs-tree-layout.tsx`), because the breadcrumb, the page switcher and the row numbers need the full tree on the server render.
	- Kept: the HTML carries only the current row, and the build fails if the bundled rows differ from the page tree.
	- Source: Q123
- [x] **D138** Touch drag reuses the mouse drop handlers through marked drag events #R6
	- Settled by the lead: a build deviation that keeps D108 and D132.
	- Spec 62 described drop target marks; built so the touch path (`hooks/useST_TouchDrag.ts`) dispatches marked dragenter, dragleave, dragover and drop events to the element under the finger, with a stand-in `dataTransfer`, so the existing mouse handlers serve it and the body cell and row files are untouched.
	- Kept as built (fcd6af8f on `claude/review`). Spec 62 1.4 and 1.6.2 are read with this decision.
	- Source: Q124
- [x] **D139** The two touch drag test stories stay and become docs pages #R6
	- Settled by the lead: D106 says a test story with its own different table stays listed like any other story, and P11 needs a play that fails first for each fix.
	- `TouchHoldOnRangeSlider` (`ColumnDragging.stories.tsx:495`) and `TouchDragScrollsPage` (`RowOrdering.stories.tsx:583`) stay.
	- Spec 63's catch-up gives each its page under More examples and its text, which joins the owner's wording review.
	- Source: Q125
- [x] **D140** Thirteen guides open with a table that shows their feature already at work #E16 #R6
	- Sharpens D105's "the best example for that guide": the Example section shows a table in which the guide's feature is already visibly in use when the page opens, where such a table can exist. "The feature is on by default" is not a reason to show Basic.
	- Full list with reasons: `reference/docs-layout/guide-example-candidates.md` (code read, not rendered). The build confirms each pick in a browser on load; a pick that does not show the feature on load is replaced by a new story for that guide, not by Basic.
	- Ten guides take a table that exists:
	-   - Column Size: story `styling-custom-column-widths--custom-widths-semantic`.
	-   - Density Toggle: story `features-dense-padding--default-to-dense-padding`.
	-   - Overflow Tooltip: story `styling-default-look--overflow-tooltip`.
	-   - Filter Chips: story `features-filter-chips--chips-seeded`.
	-   - Global Filtering: story `features-search--search-initial-state`.
	-   - Sort Editor: story `features-sort-popover--sort-popover-seeded`.
	-   - Row Selection: example page `sticky-row-selection` (was `export-csv`).
	-   - Toolbar Customization: story `features-toolbar--custom-top-toolbar-actions` (was `advanced`).
	-   - Row Actions: story `features-row-actions--custom-row-action-buttons` (was `advanced`).
	-   - Display Columns: story `styling-styling-display-columns--customize-display-columns` (was `advanced`).
	- Three guides get a new story, which becomes a page under More examples with its text (D106):
	-   - Sorting: the guide's own multi-sort table, sorted by state ascending then city descending on load.
	-   - Column Hiding: a plain table with one column hidden that the reader can bring back from the menu.
	-   - Column Resizing: a table with one column already widened.
	- A table that moves to the top and is also shown further down the guide shows once: the lower copy goes, its explainer line moves up (D122).
	- Basic stays on six guides, whose subject cannot be seen on load in any table: Best Practices, Data Columns, Accessibility, TanStack Table with shadcn/ui, Full Screen Toggle, Column Actions.
	- Six guides keep their table: Row Numbers, Tint Tokens, Table Event Listeners, Column Icons, View Settings, Click to Copy.
	- `guide-checklist.md` and `guide-example-plan.md` are updated with the result.
	- Owner recorded 2026-11-18.
	- Source: Q128
- [x] **D141** 0.9.5 is released with the whole docs site and Storybook, without the date picker work #E17 #R6
	- The owner's explicit yes for a release (D100, process.md P4): "All looks good, release.", 2026-11-19.
	- 0.9.5 carries everything on `v0.9/docs-layout` and `claude/review`: the new docs layout, the 42 example pages, the 46 guides, every story page with its text, the 404 page, the three Storybooks on 10.6.7, and the E15 library fixes (touch reorder, pinned rows with row virtualization, Sticky header switch, resize grip, sub-row selection, copy button).
	- Nothing is left out or hidden: every page is public and indexed (sitemap, search engines, docs search, llms output).
	- No date picker work is in it. The date filters stay as in 0.9.4; spec 50 stays on its branch `v0.9/filter-input-fixes`, held with Q84 and Q88.
	- This is the owner's word of D109: `v0.9/docs-layout` merges into `claude/review` as one merge, as the first step of the release.
	- Lifted by the owner for this release: the 13 unticked lines of the guide checklist (D105), the wording review of the story texts (D104, D106; the owner looked at the preview and it is good), and the real-device touch check of D108 (the owner does it later, card Q131).
	- After 0.9.5 is live the lead reminds the owner to request indexing in Search Console for the home page, the introduction and the comparison page (Q34).
	- Owner recorded 2026-11-19.
	- Source: Q132
- [x] **D142** Every code panel shows the table's own code: audit, fix, release 0.9.6 #E18 #R6
	- Wherever a reader is offered an example's code, the panel shows the code of the table itself, complete enough to copy and run: the columns, the data or how it is fetched, the hook and its options, the component. It never shows only a wrapper such as `render: () => <BasicExample />`, and it does not show the story's test (`play`).
	- This holds in the Code tab of every story in the three Storybooks (base, radix, aria) and in the code panel of every story page and example page in the docs.
	- Today on the live 0.9.5 Storybook the Code tab of "Basic / Basic" shows the story object with its test and none of the table's code; the stories built in E14 from the docs examples import the example as a component.
	- Audit first: every story and every docs code panel is listed with what its panel shows today, and the ones that fail the first bullet are named. The audit also lists stories that show the same table twice in one group ("Default" and "Basic" under Basic) and settles each by D106's rule.
	- Fix: every failing panel is corrected. Proof is by reading the panels, not only by rendering: a check opens the code panel of every story and every docs page on a production build and asserts it contains the table's hook call and no `play`; it fails on the shipped 0.9.5 first.
	- Release: the fix ships as 0.9.6, in the same epic, on the owner's word of 2026-11-19 ("audit, fix, release"; "epic and go"). No date picker work is in it.
	- The line above each story, "View Source code for these examples in the code tab below or here on GitHub.", stays (D124) and becomes true.
	- Owner recorded 2026-11-19.
	- Source: Q133
- [x] **D143** An unknown docs address answers the site's 404 page #R6
	- The docs route sets dynamicParams = false (apps/shadcn-table-docs/app/docs/[[...slug]]/page.tsx), so an address outside the generated list goes to the 404 route and the root layout's head scripts no longer log the script tag console error. Built on the owner's 'fix it', shipped in 0.9.5.
	- Source: Q129
- [x] **D144** Section tabs keep equal side padding and the page bar's hover fill #R6
	- Every section tab has the same padding on both sides, the first one included, and the hover fill is the same for active and inactive tabs (components/section-tabs.tsx, app/global.css). The owner's fix, replaces the Q116 hotfix; shipped in 0.9.5.
	- Source: Q130
- [x] **D145** The docs code panel check waits for the highlighted code #R6
	- The 'story code panels' check read the highlighter's placeholder on the slow CI machine and failed PR 140; the pages were right. The check now waits for the highlighted code before it reads (fix milestone of spec 67, merge a263d115). A CI problem, settled by the lead.
	- Source: Q135
- [x] **D146** The 19 merged same-table test stories lose their pages, with no redirect #R6
	- Spec 66 merged the 19 same-table copies into their originals and removed their 19 pages under /docs/examples/more/; the old addresses answer 404 after 0.9.6 and get no redirect and no duplicate page. Owner, 2026-11-19: 'that's fine then. We don't need any duplicate or redirect.' No link, guide, storybook map row or test names any of the 19 ids.
	- Source: Q134
- [x] **D147** The docs header shows the library version after the name #E19 #R6
	- The docs site header shows the current version right after the library name, top left: small muted mono text (v0.9.5) in the style of the section tab labels, no box, visible on mobile. It is read from packages/shadcn-table/package.json at build time and links to the GitHub releases page.
	- Source: Q136
- [x] **D148** The Storybook title shows the library version (superseded by D150) #superseded #E19 #R6
	- The Storybook sidebar title reads shadcn-table v<version> (<base>), for example shadcn-table v0.9.6 (Base UI): the version is read from packages/shadcn-table/package.json in packages/shadcn-table/.storybook/themes.ts, on the three bases. The title link stays as it is.
	- Source: Q137
- [x] **D149** Release 0.9.7 ships the version labels #E19 #R6
	- 0.9.7 is released with the docs header version label (D147) and the Storybook title version (D148), through a release spec in the same epic (P4). Owner, 2026-11-19: 'do a new release with both changes, Epic and Go.'
- [x] **D150** The Storybook version sits in the toolbar after the base switcher #R6
	- Supersedes D148.
	- The Storybook toolbar shows the library version (v<version>) as its own item right after the base switcher, on the three bases, read from packages/shadcn-table/package.json; it is a link to the GitHub releases page, like the docs header label (D147). The sidebar title goes back to shadcn-table (<base>). It ships in 0.9.7: the release waits for it. Owner, 2026-11-19, on a marked screenshot: 'The version label should be here', 'this goes directly to the current release'. Supersedes D148.
	- Source: Q138
- [x] **D151** The click-to-copy tooltip shows when focus comes back quickly (superseded by D157) #superseded #E21 #R6
	- On Radix, focus that returns to a click-to-copy button within the tooltip's exit animation shows the 'Click to copy' tooltip again: the overflow tooltip of the cell (ST_OverflowText around ST_CopyButton) no longer closes it. Base and aria are checked for the same case and fixed when they show it. A bug with one right answer, settled by the lead.
	- Source: Q140
- [x] **D152** The home page header shows the library version too #E20 #R6
	- The home page header, which the 404 page shares, shows the same version label as the docs header (D147): after the library name, v<version>, a link to the GitHub releases page, in the home header's own muted and accent colours. As built on branch v0.9/home-version-label (93405e6e), which the owner saw in wt2: 'looks good'.
	- Source: Q141
- [x] **D153** A PR label skips the test jobs so a small change ships without a release #E20 #R6
	- A PR into master that carries the label ci:skip runs no test job: every required check reports success through the skip input pr.yml already uses for the version commit, and the PR merges at once. With the existing release:skip label there is no version bump, tag or GitHub release; the live sites build from the master push. The runner may set both labels itself, only for a change the owner said ships this way. First use: the home page label (D152) goes live as 0.9.7 with no new version. The pr.yml change is proven under act before it is pushed (P3). Owner, 2026-11-19: 'On the PR, we can simply add a manual marker whether it should be skipped or not', then 'Okay, deploy it, looks good. go'.
	- Source: Q142
- [x] **D154** The ci:skip label counts only on a PR into master #E21 #R6
	- pr.yml reads ci:skip only when the PR's base branch is master; on any other base the label changes nothing and the tests run. Keeps D153 as written; CONTRIBUTING.md and the coding standards stay. Settled by the lead.
	- Source: Q143
- [x] **D155** A PR opened with ci:skip merges without a further push #E21 #R6
	- A PR created with ci:skip and release:skip merges on its first green run: PR 142 stayed blocked on '16 of 21 required status checks are expected' until a new commit was pushed. The cause is found first (likely the label runs on the same head, whose skipped caller jobs carry no matrix legs) and fixed in pr.yml, proven under act and then with trial PRs carrying ci:skip, which this decision allows. A CI problem, settled by the lead.
	- Source: Q144
- [x] **D156** On a phone the docs example toolbar is two rows with a More menu #E21 #R6
	- At phone width the example toolbar on docs pages has two rows: row 1 is previous, the example name stretched between the arrows, next; row 2 is Preview, Code, Both, the base switcher and a More button at the right end. The More button opens a stock menu with labelled entries: Open in Storybook, Copy prompt, Copy install command, Fullscreen. Desktop and tablet keep the single row. Variant A of reference/q145-example-toolbar-phone.excalidraw, picked by the owner on 2026-11-20.
	- Source: Q145
- [x] **D157** The quick-refocus tooltip miss on Radix is left to Radix #R6
	- Supersedes D151.
	- The 'Click to copy' tooltip that fails to show when focus returns within its exit animation is Radix's own behaviour, not the overflow tooltip's: an uncontrolled Radix tooltip that reopens while its content is still mounted closes itself on its own tooltip.open event (radix-ui 1.8.1, tracker 73). The library does not patch its tooltip around it (stock shadcn styling and behaviour, no workaround to remove later); milestone 73 stops, its red play is not merged. The runner searches the Radix repository for an existing report and records the link in the tracker; a new upstream report is filed only on the owner's word. Settled by the lead.
- [x] **D158** The phone example toolbar and the ci:skip fixes go live without a new version #E22 #R6
	- claude/review as of E21 (spec 74, the phone example toolbar of D156; spec 72, the ci:skip fixes of D154 and D155) ships by one PR from dev into master with the labels release:skip and ci:skip (D153): no version bump, no tag, the sites stay 0.9.7. The PR is created with both labels and must report CLEAN after its first run with no further push: that is the proof spec 72 still owes, recorded in tracker 72. After the merge the live docs page is read at phone width (two toolbar rows, the More menu and its entries) and at desktop width (unchanged), and claude/review and dev are brought up to master. Owner, 2026-11-20: 'Ship it.'
- [x] **D159** The docs site's PostHog SDK is updated to the latest 1.x and its setup rechecked #E23 #R6
	- posthog-js in apps/shadcn-table-docs goes from 1.438.13 to the latest 1.x (1.453.2 on 2026-11-23), package.json and lockfile only; no other code changes unless the release notes between the two versions or the setup recheck require one, and then the tracker names it. The setup is rechecked against PostHog's current Next.js install guide (init place and options, key and host, pageview capture, any proxy or rewrite) and each point is recorded as matches or differs. It ships by one PR from dev into master with release:skip and ci:skip (D153): no version, no tag, the sites stay 0.9.7; local checks are install, docs types:check, lint and the docs build. After the merge the live site is loaded and a capture request to PostHog is seen answering 200 with the new SDK version in it. Owner, 2026-11-23: 'Update the SDK, double check if every installation, everything is properly done and then deploy', 'we can skip huge long-running checks'.
	- Source: Q147
- [x] **D160** The docs site proxies PostHog's config files through the assets rewrite the guide names #E24 #R6
	- next.config.mjs of the docs app gets the rewrite /ingest/array/:path* to https://us-assets.i.posthog.com/array/:path*, placed before the /ingest catch-all, as PostHog's Next.js proxy guide has it: since posthog-js 1.451.0 remote config is fetched from /ingest/array/<token>/config and today reaches us.i.posthog.com through the catch-all, without the asset server's cache headers (tracker 76, recheck point 3). Follows the vendor's guide, docs app only; settled by the lead.
- [x] **D161** The docs site sets PostHog's dated defaults as the install guide does, and the PostHog fixes ship #E24 #R6
	- posthog.init in the docs app sets defaults to the date PostHog's Next.js install guide names (2026-08-30 on 2026-11-23); an option the app sets by hand to the same value that date gives is removed only when the tracker shows the two are equal, and the deliberate differences stay (lazy load, autocapture off, no identify). This and the rewrite of D160 ship together by one PR from dev into master with release:skip and ci:skip (D153): no version, no tag. After the merge the live site is loaded: the config request goes to /ingest/array/ and answers 200, a capture request answers 200, the seven events of lib/analytics.ts still fire. Owner, 2026-11-23: 'Resolve all the issues. This shouldn't be a decision that I need to make.' Settled by the lead.
	- Source: Q148
- [x] **D162** The date picker becomes its own small library in its own repository #E25 #R6
	- The calendar library lives in a new repository, not in the table repository: `reference/q149-calendar-library/report.md` stands except sections 4, 6 and 7 (folders, distribution, the later move), which this decision replaces. The table repository gets no calendar folder.
	- Base UI version: the approved picker, exact copy of `test-projects/next-app/components/date-picker/` (22 files, version 9.3.6, commit `53f4b4f`); only an import path may differ, proven by `diff -r`; any other change is the owner's (report 2.1). Radix and React Aria versions are new work with the same files and names, the same look and behaviour, tested against the Base UI version.
	- The owner's picker rules of report section 3 hold in every version.
	- Thin tooling: a small registry build, types and lint, Storybook stories with tests. No installation tests, no perf checks, no visual captures.
	- Users install it with the shadcn CLI by GitHub address (`owner/repo/item`), the form the table's core items use; an entry in shadcn's registry directory is optional and later.
	- The table depends on it per base at a tag; in the table repository that is the import mapping of `tools/registry/lib.mjs` and one dependency per base.
	- Docs and demo live on a subdomain of `shadcn-table.com`, served by the calendar's own Vercel project; the table's `vercel.json` does not change.
	- Table v1 comes first; the calendar work never delays it.
	- Source: Q149
- [x] **D163** The date picker library is named shadcn-date-picker everywhere #E25 #R6
	- Repository `shadcn-date-picker` under the owner's GitHub account, registry items `date-picker-base`, `date-picker-radix` and `date-picker-aria`, docs and demo at `date-picker.shadcn-table.com`, Vercel project `shadcn-date-picker`. The repository, the Vercel project and the domain assignment exist (the lead, 2026-11-24); the one DNS record left is in `reference/q149-calendar-library/setup-steps.md`. Owner, 2026-11-24: 'make the name shadcn-date-picker pls. not calendar.' (first recorded as shadcn-calendar the same day, changed before anything was built).
	- Source: Q150
- [x] **D164** The table's date filters use the date picker library, all three bases together #E26 #R6
	- Supersedes D96.
	- Every date, date-time and time filter of the table (chips editor, header editor, popover, subheader, range Min and Max) renders DatePicker from shadcn-date-picker (D162, D163) in place of the browser's date box; each base's table item depends on the matching date picker item at a tag, so installing the table installs the picker. The three bases switch together in one table release, after the three picker versions exist. The table's own date-box workarounds go with it, the click fix of D96 among them. The filter values, modes and the public API of the table do not change; any that must is a new decision.
	- Source: Q88
- [x] **D165** The is-empty reset fix lands with the table's date picker switch #E26 #R6
	- Supersedes D93.
	- Clearing an is-empty filter returns the column to its default filter mode, on every column type: the fix of D93 is taken as built from branch v0.9/filter-input-fixes (commit fd7059b6 and its play in 8c34979e) and merged in the same epic as the table switch of D164, not on its own. Spec 50 stops; its click fix (D96, 9bfdf247) is not merged. Owner, 2026-11-24: 'fix everything in one go', 'k'.
- [x] **D166** The date-time range popover keeps its approved width #R6
	- The date-time range popover stays as wide as the approved code makes it in Chrome (540 px on 2026-11-23, 492 px in an earlier version); the cause of the difference is not looked for and the approved code is not changed for it. It is looked at again only if it overflows a small screen.
	- Source: Q151
- [x] **D167** The date picker gets one right-to-left look; Safari and iPhone are the owner's tests #E25 #R6
	- Desktop Safari and iPhone are tested by the owner, look and feel accepted (2026-11-24); no agent re-tests them. Right-to-left: one manual look, once, on the Base UI picker in the new repository (each mode opened on a dir=rtl page, screenshots); a broken thing becomes a card with its screenshot, a clean result one line in the tracker. No CI job and no test is added for it. The five-digit year in Safari is left alone.
	- Source: Q152
- [x] **D168** The React Aria day calendar is built on react-day-picker directly #R6
	- K1 option 1: registry/aria day-calendar.tsx uses react-day-picker's DayPicker and carries what the stock react-day-picker calendar part adds, so the native select, the caption, week numbers, the public calendarProps and the look equal the Base UI version (report section 3, D162). The React Aria style's own calendar part is not used and no components/ui/calendar.tsx is shipped or replaced. Settled by the lead under the owner's 'implement everything autonomously' (2026-11-24); options and source lines in run/trackers/79-date-picker-radix-and-aria-tracker.md, Attention K1.
	- Source: Q154
- [x] **D169** Radix and React Aria pickers close after a pick through one open state inside the popup file #R6
	- K2 option 1: picker-popup.tsx on radix and aria holds one open state and exposes close() with useImperativeHandle, so every pick that closes on Base UI closes there too (cases D4, D5, P3, P6, P11, M10, W10); no other file differs for it and no hidden button is clicked from code. Settled by the lead under the owner's 'implement everything autonomously' (2026-11-24); options and source lines in run/trackers/79-date-picker-radix-and-aria-tracker.md, Attention K2.
	- Source: Q155
- [x] **D170** The month arrow at the end of the range stays reachable by Tab on Radix and React Aria #R6
	- K3 option 1: view-nav.tsx on radix and aria sets aria-disabled in place of disabled and ignores the click while disabled, so case D11 holds as on Base UI. Settled by the lead under the owner's 'implement everything autonomously' (2026-11-24); options and source lines in run/trackers/79-date-picker-radix-and-aria-tracker.md, Attention K3.
	- Source: Q156
- [x] **D171** Popup focus, Tab and page blocking follow each base's stock popover #R6
	- K4, K5 and K6, option 1 each: the Radix picker keeps the stock Radix popover (Tab goes round inside the popup, first control focused on touch); the React Aria picker keeps the stock aria-nova modal popover (underlay, page scroll locked, focus contained, popup named by the trigger). No key handler, focus override or label of the picker's own is added: the picker has no rule of its own where the library does the task (report section 3). The differences from Base UI (cases U2, WR1) are listed in the repository README per base. Covers Q158 and Q159. Settled by the lead under the owner's 'implement everything autonomously' (2026-11-24); options and source lines in run/trackers/79-date-picker-radix-and-aria-tracker.md, Attention K4 to K6.
	- Source: Q157
- [x] **D172** The date picker installs through the shadcn CLI's own rewriting; the exact-copy rule binds the repository source #R6
	- The 22 files in registry/base of shadcn-date-picker stay the exact approved code (D162, diff -r). What the shadcn CLI writes into a user's app may differ from it by the CLI's own rewriting: import aliases follow the app's components.json and the style hook classes (cn-dialog-close, cn-field, cn-button-group-orientation-horizontal) are resolved the way the CLI resolves them for shadcn's own parts. The item type is the one that gives a working picker in a fresh app of each style with other aliases: imports resolve, tsc and next build pass, the dialog close button, field and button group are styled as in the approved app. The install proof compares the rendered picker with the approved one, not the installed bytes. A fix milestone of spec 78 finds the stock mechanism first (how the CLI treats cn-* classes for an outside registry) and names it in the tracker.
	- Source: Q153
- [x] **D173** The date picker's install files are generated with shadcn's own style transform #E27 #R6
	- Option 1 of Q161: the registry build of shadcn-date-picker runs shadcn's own createStyleMap and transformStyle with the nova style over the source and writes a generated, committed folder per base; the items serve those files as registry:component, so the CLI rewrites import aliases and the dialog close button, the field and the button group carry real classes. The source in registry/<base> stays the exact approved code (D162) and is never edited for it; the generated folder is never hand-edited and a check fails when it is out of step with the source. One item per base as D163 names them; a user on another shadcn style gets nova's values for those three places, named in the README. This is how shadcn styles its own parts at build time. Tooling, settled by the lead under the owner's 'implement everything autonomously'; replaces the item-type part of D172.
	- Source: Q161
- [x] **D174** The React Aria popup's rare stuck-open case is left to React Aria #R6
	- The React Aria picker keeps the stock popover (D171): a close that lands in the first two frames of a delayed fade-in can leave the popup on the page, and on a touch screen the popup can flicker once as it opens; both are stock react-aria-components behaviour (Popover.mjs:91,103,180,185), not picker code. No workaround and no restyled stock part in the library; the README names both under React Aria. An upstream report is filed only on the owner's word. Settled by the lead.
	- Source: Q164
- [x] **D175** The table's three date picker props keep their type and pass on what the picker takes #R6
	- Option 1 of Q165: stFilterDatePickerProps, stFilterDateTimePickerProps and stFilterTimePickerProps stay typed as input props (no public type change, P7); the table forwards min, max, step, disabled, id, className, style, aria and data attributes and the bubbling handlers onFocus, onBlur and onKeyDown to the picker; the input-only props (value, onChange, type, ref, placeholder, name, readOnly, autoFocus) no longer have an effect and the changelog names them. No new prop for the picker's own options is added until someone needs one. Settled by the lead under the owner's 'implement everything autonomously'.
	- Source: Q165
- [x] **D176** The date picker's developer warning for a wrong min, max or step is removed #E27 #R6
	- utils/values.ts of the date picker no longer prints 'DatePicker: <name> <value> is ignored': a min or max that is not a value of the picker's type and a step that is not a whole number above zero are dropped silently, as the browser does with a bad min on its own input. The process.env.NODE_ENV read goes with it, so a Vite app that installs the picker type-checks without Node types; the helper ignored() and its type go, nothing else changes. On the three bases, in shadcn-date-picker; this is an owner-allowed change to the approved code (report 2.1), so from here the Base UI source differs from test-projects/next-app by this change. The 'node' line added to packages/shadcn-table/tsconfig.radix.json in spec 81 is removed when the table moves to the new tag. Owner, 2026-11-24, told it is a development-only message: 'remove'.
	- Source: Q166
- [x] **D177** The month and year grid arrows flip on right-to-left pages #E27 #R6
	- The previous and next chevrons of GridHeader in components/period-views.tsx of the date picker get rtl:rotate-180, the class the day calendar's caption arrows already have, on the three bases in shadcn-date-picker. An owner-allowed change to the approved code (report 2.1). Owner, 2026-11-24: '162 k'.
	- Source: Q162
- [x] **D178** The date picker gets a small docs site with the table site's look #E27 #R6
	- shadcn-date-picker gets a docs app that reuses the shell of the table's docs site (header, theme, fonts, section layout, code panels, install command blocks), served at date-picker.shadcn-table.com. Pages stay few: home, install, one page per picker type (date, date-time, time, week, month, year, ranges) with a live demo and its code, and props. The Storybook moves off the site root to its own address under the same project, as the table's does. The content is thin (D162); the look is the table's. Owner, 2026-11-24: 'the docs app looks bad, make it like table', 'k'.
	- Source: Q167
- [x] **D179** The date picker ships with shadcn's Base UI arrow-key bug and a short note #E27 #R6
	- The picker and the table keep shadcn's stock Base UI calendar part everywhere, their own trees, Storybooks and docs included, so a demo shows what a user gets: on Base UI, arrow keys in the day grid move the highlight but not keyboard focus (shadcn-ui/ui issue 9401, fix PRs 9402 and 9082 open since January 2026). No calendar file of ours is shipped and the approved code is not changed for it. The picker README carries a short note under Base UI: the symptom, the issue link, and the one line (ref={ref} on the day Button of components/ui/calendar.tsx) a user can add. Nothing is posted on shadcn-ui/ui; the draft comment in reference/q149-calendar-library/q160-upstream-draft.md stays unsent. Owner, 2026-11-24: 'no, ship with bug. tiny disclaimer is fine'.
	- Source: Q160
- [x] **D180** The date picker docs site keeps one sidebar list of its nine pages #R6
	- Tracker 85 A2, option 1: one flat sidebar list under the three labels Get Started, Pickers, Props. Three sections as on the table site would leave two sidebars with one row each; the section line above the page title and the page switcher in the breadcrumb are not shown. Lead, 2026-11-24 (weight test: docs layout, cheap to change).
	- Source: Q168
- [x] **D181** Date picker docs site: a GitHub button on code panels, a short footer, the base select on the home header #R6
	- Tracker 85 A3. Code panel: the More menu with the single entry Open in GitHub becomes a plain GitHub button (a menu of one entry is no menu). Home and 404 pages: the table's footer trimmed to the name, the licence line, GitHub and Storybook (D178: the look is the table's). Home header: the base select stays, the home demos need a base choice. Lead, 2026-11-24 (weight test: small docs looks, cheap to change).
	- Source: Q169

%% kanban:settings
{"kanban-plugin":"basic","lane-width":600,"date-format":"YYYY-MM-DD","time-format":"HH:mm","tag-action":"kanban","set-view":"list","full-list-lane-width":true,"show-add-list":false,"show-archive-all":false,"custom-title":"v0.9.x decisions"}
%%
