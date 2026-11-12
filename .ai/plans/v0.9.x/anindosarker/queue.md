# v0.9.x queue

### Q1 Select filter clear button overlaps the chevron
- Tags: D1
- From: lead.
- Once a select filter has a value, the clear x (`absolute inset-y-0 inset-e-0`, `ST_FilterTextField.tsx:335-347` radix; aria `:369`, base `:340`) sits on top of the `SelectTrigger` chevron. The trigger's `pe-9` never applies: the shadcn `SelectTrigger` base has `pr-2` (`select.tsx:46`), tailwind-merge keeps both classes, and Tailwind 4 emits `padding-right` after `padding-inline-end`, so `pr-2` wins. Same in chips, subheader and popover modes, all three registries. Owner's screenshot `v0.8.x/reference/image/bugs/1793953068792.png`. Resolved by D1.

### Q2 The filtering stories show the old filter UI, not the current format
- Tags:
- From: lead.
- Owner, 2026-11-08, on the deployed Storybook (`https://storybook.shadcn-table.com/base/`): the filtering stories are not updated to the new format. Stories looked at: `Features/Filtering Examples` (`FilteringChangeModeEnabled`, `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`, `FilterFnAndFilterVariants`, `packages/shadcn-table/stories/features/Filtering.stories.tsx:174-702`) and `Features/Filter Chips Examples` (`FilterModePickerTableLevel`, `FilterChips.stories.tsx:300`). Major. Screenshot 2026-11-08 of `FilteringChangeModeEnabled` (Base build): the subheader filter row with one input per column and a "Filter Mode: Fuzzy" helper line under each, no chips; the docs filtering examples moved to chips in v0.8.x (D51) while the stories did not.

### Q3 The filtering story's UI jumps
- Tags: Autofix
- From: lead.
- Owner, 2026-11-08, on `https://storybook.shadcn-table.com/base/?path=/story/features-filtering-examples--filtering-change-mode-enabled`: type a value in one subheader filter field, then close it (blur): the first filter field jumps (layout shift in the filter row). To be reproduced with a play before it is planned (v0.8.x P10, P11).
- Resolved 2026-11-08: the jump is the filter mode menu's exit animation. `useST_MenuAnchor.ts` stored `anchorEl?.getBoundingClientRect()` on close, undefined once the anchor cleared, so the invisible trigger span moved to (0,0) and the Base UI and Radix positioners followed it while the menu faded; the hook now keeps the last measured box (three bases). Play `FilterModeMenuClosesInPlace`, red on base and radix before, green after; merged as a fix from the lead at the merge commit after `546bcabd`.

### Q4 Stories carry no explainer
- Tags:
- From: lead.
- Owner, 2026-11-08, screenshot of `Features/Filtering Examples/Column Filtering Disabled` (Base build): every story shows the same three-line banner (docs link, base links, source link) and nothing about what the story demonstrates or what to try; a visitor cannot tell what "Column Filtering Disabled" shows. Holds for every story (594 stories, one shared banner from `.storybook/preview.tsx`). To be discussed with the docs restructuring items, not on its own.

### Q5 The pagination mode named `default` is not the default
- Tags: D7
- From: lead.
- `paginationDisplayMode` defaults to `pages` (v0.8.x D13, `useST_TableOptions.ts:90`), but the mode value `'default'` names the compact range-and-arrows footer, so the guide (`/docs/guides/pagination#pagination-display-modes`) has to say "by default ('pages') ... set to 'default' for the compact UI". Owner, 2026-11-08: the page reads as wrong. The name comes from Material React Table, where `default` is the default. Renaming the value is a public option change (v0.8.x P7), so the fix is decided with item 6.

### Q6 The deployed Storybook runs the plays and shows their end state
- Tags: D8
- From: lead.
- Owner, 2026-11-08, `https://storybook.shadcn-table.com/base/?path=/story/features-pagination-examples--pagination-enabled-default-more-data`: the story opens with the global filter already set to "42459 Eda Springs" and one row left, because its play function runs on load in the static build too. A visitor takes the filtered end state for the example (D59 requires a play per story, so most stories end in some changed state). The static builds under `/base/`, `/radix/` and `/aria/` should render the stories without running the plays (the plays keep running in vitest and in local dev), or the play should restore the initial state; the mechanism is decided with the Storybook items.

### Q7 "Default" names the compact pagination across stories and docs
- Tags: D7
- From: lead.
- Owner, 2026-11-08, `Features/Pagination Examples/Pagination Enabled Default More Data` (Base build): the story is titled "Default" and shows the compact footer (`Rows per page`, `1-10 of 551`, four arrows), which is not the default since v0.8.x D13 (`pages`). The same wording runs through the pagination stories (`Pagination Enabled Default`, `... Big Data`, `... No Rows Per Page` and more), the guide, the API page and the examples. Fixing it is bigger than F5: one audit of every story title, docs page and example that says "default" for `paginationDisplayMode: 'default'`, with the rename decided separately from item 6 (the range span). Decided in its own item.

### Q8 Two storybook plays time out under machine load and are not on the known-flake list
- Tags: D14
- From: lead.
- `stories/features/ClickToCopy.stories.tsx` "Click Copies Value" (base and radix) and `stories/features/RowOrdering.stories.tsx` "Drag Reorders Rows" (aria, 90 s timeout) failed once each in the E1 verifier runs at load average about 16 and passed on rerun and alone; neither is in the P5 known-flake list, so a loaded run reads them as red.

### Q9 Two doc comments name files spec 04 deleted or misstate their list
- Tags: Later
- From: lead.
- `apps/shadcn-table-docs/components/theme-demo/demo-themes.ts:42` still names `lib/theme-presets.ts` and `themes/*.css`, deleted by spec 04; `apps/shadcn-table-docs/lib/install.mjs:52` says `EXTRA_PARTS` holds "parts the examples import", but `sheet` is imported by the theme panel, not by an example.

### Q10 The static Storybook test folder matches the build-output ignore line
- Tags: D46
- From: lead.
- `.gitignore`: the line `storybook-static` also matches `test/storybook-static/`, so spec 06 added its two files with `git add -f`; git tracks them now, but a new file in that folder is ignored unless a `!test/storybook-static/` line follows.

### Q11 The docs dev server logs errors on every page load
- Tags: D20
- From: run.
- Owner, 2026-11-08, `pnpm --filter shadcn-table-docs dev` on `claude/review` (`815436fa`), GET `/`: two logs on every load. Server: `[TanStack Hotkeys] A hotkey label was formatted during server rendering without a platform, so it uses 'linux'` (the kbd hints of the theme panel, E2 04, format on the server with no `platform`). Browser: `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties` under `<Page>` of `(home)/page`, attribute mismatch not yet located. Owner: "Every time I run the server locally I see huge errors."

### Q12 Reset is not discoverable
- Tags: D22
- From: run.
- Owner, 2026-11-08, same screenshot: "There is no button or hint to reset theme." The header holds an icon-only reset button with a `⇧R` hint (spec 04 review fix), which the owner did not read as reset.

### Q13 The color tokens have no color picker
- Tags: D23
- From: run.
- Owner, 2026-11-08, same screenshot: each token in the Colors tab shows a static swatch and a hex input; no picker opens from the swatch. The reference (shadcnstudio.com/theme-generator, D2) opens a picker.

### Q14 The persistent view example starts with more than ten rows
- Tags: D24
- From: run.
- Owner, 2026-11-08, `/docs/examples/persistent-view`: the default page size should be ten.

### Q15 The docs dev server is slow
- Tags: D29
- From: run.
- Owner, 2026-11-08, `pnpm --filter shadcn-table-docs dev` on `claude/review`: "The site is super slow in dev server." Cause, measured 2026-11-08 in a browser before and after the theme panel: `app/global.css:9-16` imports all eight `styles/style-*.css`, the root stylesheet grew from 351 KB to 2,755 KB, and every theme or class change recalculates styles over about 3,560 nodes (0.5 to 1 s); the first-hit compile (12 to 18 s) is the same on both builds. The machine's load average of 20 plus from agent gates doubles it. Resolved by D29.

### Q16 The icon library cannot be changed
- Tags: D27
- From: run.
- Owner, 2026-11-08, same screenshot: the Icon Library select is disabled at Lucide (D2: "Lucide only, v0.7.x D38"). Owner: add the option.

### Q17 Undo and redo use `p` and no key
- Tags: D22
- From: run.
- Owner, 2026-11-08: undo and redo should be the regular shortcuts, Cmd+Z and Cmd+Shift+Z (Ctrl on Windows and Linux); D2 gave undo `p` and redo nothing.

### Q18 The theme panel carries Copy and Import
- Tags: D21
- From: run.
- Owner, 2026-11-08, screenshot of the panel on `/docs/examples/persistent-view` (dev, `claude/review`): the Copy button (top row) and the Import button (Presets row), both from D2's layout, marked "Unnecessary items, remove them."

### Q19 The shortcut buttons and hints are spread over the panel
- Tags: D22
- From: run.
- Owner, 2026-11-08, same screenshot: Undo (`P`) and Redo sit in the top row, Random (`R`) in the Presets row, the cycle hint `C` under the preset select, Reset (`⇧R`) as an icon in the header. Owner: keep all shortcut buttons and hints together at the top.

### Q20 Installation E2E references predate the pages footer range
- Tags: Autofix
- From: run.
- `test/installation-e2e/fixtures/reference/<base>/default-{light,dark}.png` (committed in 010f7359, v0.8.x) show the pages footer without the `1-10 of 50` range span that spec 02 (D6) added; `pnpm test installation-e2e` on `dev` at df90bd27 fails the three nextjs scenarios with 23626 (light) and 25084 (dark) pixels over the 500 limit, the same count on every base.
- v0.8.x D-addendum (decisions.md line 780): a milestone that changes the default look replaces the six PNGs from a `pr.yml` dispatch with `installation-e2e-only=true`; spec 02 did not. Fix milestone `refresh-installation-references`.

### Q21 Installation E2E capture diff cannot pass on macOS against the Linux references
- Tags: Autofix
- From: run.
- `test/installation-e2e/lib/browser.mjs:363`: the local capture on macOS differs from the Linux CI reference in every glyph (font rasterization), so the diff exceeds 500 pixels whatever the code; the v0.8.x local runs used `--no-diff` (v0.8.x tracker 08-test-runner-and-tests, line 22).
- Local runs of the nextjs scenarios take `--no-diff`; the pixel diff is a CI check only. Recorded in process.md P5.

### Q22 Restoring a stored rows per page remaps the page index
- Tags: Autofix
- From: run.
- `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts:121` (spec 12, merged 117a81b5): `applyView` restores the stored size with `table.setPageSize`, which in TanStack 9.3.1 recomputes `pageIndex` to keep the top row; spec 12 section 1.6.3 says the page index is untouched, so a table with `initialState.pagination.pageIndex` above 0 and a stored size mounts on another page. Fix: `table.setPagination((old) => ({ ...old, pageSize: view.pageSize }))` in the three bases, the comment reworded, the docs copies regenerated.
- Same review (fable, round 1, minors): `content/docs/guides/view-settings.mdx:109` Reset view bullet lacks "rows per page"; `content/docs/examples/persistent-view.mdx:6` lists a partial field set where spec 12 1.6.4 says the page names the option without a field list.

### Q23 Theme hotkey docs E2E checks read the variable a fixed 200 ms after the key
- Tags: Autofix
- From: run.
- `test/docs-e2e/lib/getting-started.mjs:282-309` (spec 04 on `dev` at 0adce149; spec 09 and 10 kept the pattern on `claude/review`): `press()` is `keyboard.press` plus `waitForTimeout(200)`, then `--primary` is read once. On CI (release PR 134, run 42488458376) "theme: Shift+R returns to the default" failed on base and aria in attempt 1 and on aria again in attempt 2 with the value unchanged after Shift+R, and radix timed out on the next click; locally it failed once under load (P5 entry). Fix: wait for the variable to change (or to equal the expected value) with a bounded poll instead of a fixed delay; test file only.

### Q24 The theme check's search dialog stays open after Escape on CI
- Tags: Autofix
- From: run.
- `test/docs-e2e/lib/getting-started.mjs` (`/` theme checks, `dev` at ea276251 and `claude/review`): after "theme: r does nothing while the search dialog is open" the test presses Escape and swallows the 5 s detach timeout; on CI the dialog stays, so the next `button[aria-label="Customize theme"]` click (or the following `input.fill`) times out after 30 s. Release PR 134: run 42488458376 attempt 1 radix, run 42490873017 attempts 1 and 2 aria (the Q23 hotkey waits pass there). Fix: close the dialog deterministically (second Escape, close control, reload as the last resort) before the edit check; test file only, D30 pattern.

### Q25 The CRUD delete-dialog check counts rows before the example finishes loading
- Tags: Autofix
- From: run.
- `test/docs-e2e/lib/examples.mjs:85-111` (`deleteDialog`, v0.8.x F53): `before` is `tbody tr` counted as soon as the example panel is found, `after` the same count once the Cancel click closed the alert dialog. On CI the inline CRUD examples still show their loading rows at the first count (before=10 after=8 on `editing-crud-inline-row` and `-inline-cell`, before=20 after=10 on `editing-crud-tree`), so the check fails although Cancel kept every row. Release PR 134 on the bump 0a465c3e: run 42501252444 attempt 1 base and radix, attempt 2 radix; earlier once on aria at ea276251. Fix: wait for the example's rows to settle (the loading state gone, the count stable across two reads) before the first count; test file only, D30 pattern.

### Q26 Spec 15 comments still name app/layout.tsx as the style link owner
- Tags: Later
- From: run.
- `apps/shadcn-table-docs/app/global.css:7`, `lib/build-styles.mjs:8-11`, `lib/design-system/config.ts:451` (JSDoc on `STYLE_SHEET_ID`) say the style link is rendered by `app/layout.tsx`; since the Q50 deviation the pre-paint script creates it. `CONTRIBUTING.md:59` lists neither `lib/build-styles.mjs` nor `public/styles/`. Review minors of milestone 15 (fable, round 1), left by the bounce because no major was open; a one-commit docs fix.

### Q27 The record cap of record-output.mjs has no unit test and the pr-summary.mjs header names a removed act path
- Tags: D46
- From: run.
- `tools/release/record-output.mjs:28`: `capRecord` holds the one rule D38 specifies (five errors, 400 characters, an `…` mark) and is exported, but no `tools/release/record-output.test.mjs` runs under `pnpm test validate-repo`; the cap was checked by hand in the spec 19 review only. `tools/release/pr-summary.mjs:10`: the header says the `test/.out/*.json` fallback serves "spec 18's act check", but under act `toJSON(needs)` sets `NEEDS` too, so the fallback serves a plain shell run only. Both nits from the spec 19 review (a0677dfc), deferred.

### Q28 The 300 ms perf budgets of the getting-started page fail on GitHub runners
- Tags: Autofix
- From: run.
- `test/docs-e2e/lib/getting-started.mjs:841-845`: `perf: panel open` and `perf: light/dark toggle` require under 300 ms of long tasks (D29's acceptance, measured on the owner's machine). On GitHub runners the toggle took 342 ms (aria) and 351 ms (radix) on the 0.9.1 release PR run 42514739346, twice (one rerun), base 267 ms; panel open 207 to 268 ms. The release run is red on a budget the runner cannot meet; the P5 flake rerun does not cover it.

### Q29 The llms.txt summary duplicates the home page description
- Tags:
- From: run.
- `apps/shadcn-table-docs/lib/llms.ts`: the `llms.txt` summary line is the home page description copied as a module constant (spec 29, merged 184056d2), because the home page and layout files belonged to other milestones; a change to the home description leaves this copy behind. One shared `siteDescription` in `lib/shared.ts` read by the layout, the OG image (`app/opengraph-image.tsx` holds a third copy) and `lib/llms.ts` removes it.

### Q30 PostHog and providers load in the root layout on every page
- Tags: D70
- From: run.
- `apps/shadcn-table-docs/app/layout.tsx`: posthog-js (114 KB) and the providers ship in the shared root layout, so every page carries them in the first load; on `/` they are most of the 580 KB of script left after spec 30 (Q30). A later decision lazy-loads posthog-js after hydration or on first interaction and re-measures `/` against 450 KB; the docs check "icons: the pick survives a reload" must keep passing.
- D59 and spec 30 ask for under 450 KB of script transfer on `/`, changing only `components/dev-home/**`. The builder measured 711 KB before and 580 KB after (blocking time 158 ms, under the 300 ms target). Of the first load, all but 19 KB is the shared root layout (posthog-js 114 KB, react-dom 72 KB), which spec 30 puts out of scope; the live demo table adds 167 KB and the docs check "icons: the pick survives a reload" needs it to load without input. Milestone 30 Home JavaScript is stopped, not merged: branch `v0.9/home-javascript` at b2bcf60d holds the 580 KB state (nav and hero links prefetch on hover, touch or focus instead of in the viewport), every check green.
- Options:
  - a) Recommended: merge the branch as it stands (711 to 580 KB) and move the target to what the home components can reach; the root layout (PostHog loading) becomes its own decision
  - b) load the demo table only on visitor intent (437 KB measured) and change the docs check that waits for the table after a reload
  - c) widen spec 30 to `app/layout.tsx` and lazy-load posthog-js and the providers, then rerun the milestone against 450 KB
  - d) drop the branch; the home page stays at 711 KB

### Q31 The docs check suite has no check for the byline or the two new pages
- Tags: D65
- From: run.
- `test/docs-e2e/lib/`: spec 31 2.2 expects `pnpm test docs-e2e` to prove the byline and the two new pages (`/docs/getting-started/comparison`, `/docs/guides/tanstack-table-with-shadcn-ui`), but no milestone of spec 31 owns `test/docs-e2e`, so no named check exists; the frame milestone (merged 23e1cfa9) proved them by curl and a route run only (render, hydration, console).

### Q32 Guides and API copy overclaims shadcn components and keeps six inherited typos
- Tags: D64
- From: run.
- `apps/shadcn-table-docs/content/docs/guides/accessibility.mdx:7`, `guides/customize-components.mdx:7`, `api/st-components.mdx:22`, `api/table-options.mdx:24`: the new copy (spec 31, merged edc04e01) says the table is built from shadcn/ui components throughout; the table, rows and cells are plain elements (`ST_Table.tsx:113`, `ST_TableBodyCell.tsx:317`), only the controls are shadcn/ui. Typos and inherited phrasing left on edited lines: `guides/column-ordering-dnd.mdx:72` ("should also should"), `guides/editing.mdx:211` ("news rows"), `guides/column-size.mdx:88` ("ect."), `guides/detail-panel.mdx:163` ("as of version 2.6.0", a Material React Table version); `guides/sorting.mdx:3` says the sort arrow shows in each header cell (only sorted ones); four API pages keep an older sentence that restates the new lead. Review findings of the milestone, deferred by the script as minors.

### Q33 Vercel free tier function CPU at 75 percent
- Tags: D66
- From: run.
- Vercel mail 2026-11-11 02:01: team `anindo-sarkers-projects` used 75 percent of the Hobby tier's Fluid Active CPU (4 hours per month); at 100 percent the projects pause. Likely sources: the Show HN traffic of 2026-11-10, `proxy.ts` running on every request, the `/og/docs/[...slug]` image route, the llms and Markdown routes.
- Choices for a later item: Vercel Pro (20 USD a month, pay-as-you-go above the included usage), or move per-request work off functions (static OG images at build, narrower `proxy.ts` matcher, cache headers on the Markdown routes) and re-measure on the Vercel usage page.

### Q34 Rank one for shadcn table and a keyword-led snippet
- Tags: Later
- From: run.
- Owner, 2026-11-12, Google query "shadcn table" (logged in, personalised): the result shown is `/docs/getting-started/introduction`, below shadcn.io's "Shadcn Table: Free Data Table Component for Next.js" (tablecn) and a shadcn-ui GitHub issue; the owner also reports finding the page only on the sixth page in another view. Goal: rank one for "shadcn table", with the home page as the landing result, not the introduction page.
- The snippet Google shows is the introduction's description ("shadcn-table is a feature-rich data table for shadcn/ui. It covers everything from a simple list to a production data grid."); the owner wants it rewritten around the terms people search (shadcn table, shadcn data table, data table component, Next.js, TanStack Table), as the tablecn result does ("production-ready, feature-rich data table component. Built with Next.js, React, Tailwind and shadcn/ui").
- Inputs for the item: Search Console query and page data once it fills (the property is 2 days old), the live home and introduction descriptions after E10 ships, a keyword check with the `/seo` tools. To discuss later, at the owner's call.

### Q35 Example source read traces every examples file into the build
- Tags: D69
- From: run.
- `apps/shadcn-table-docs/lib/example-source.ts:39` (`listExampleFiles`, October 2026, before E10): `fs.readFile(path.join(dir, rel))` with a dynamic `dir` makes Turbopack trace the whole `examples/` tree including the generated `examples/.<base>` copies (8 pattern alternatives times about 1321 files, reported as 10568 matches); builds and typecheck are slow. One-file literal paths made it worse (4 warnings, 13384 matches, reverted). Needs a change to how the example folders are read, across more than one file; a later decision.

### Q36 The generated examples registry was not regenerated with the spec 31 descriptions
- Tags: D68
- From: run.
- `apps/shadcn-table-docs/registry.json` is tracked and generated by `tools/registry/examples.mjs` (`pnpm -w registry:items`, run by the docs `build` script) from the example pages' descriptions. Spec 31's Examples copy milestone owned `content/docs/examples/**` only, so the rewritten descriptions never reached the committed file; the owner's local build regenerated it and left a 252-line diff. Committed by the lead 2026-11-12. Gap: no check fails when a generated tracked file is stale; `pnpm test validate-repo` should regenerate and `git diff --exit-code` the registry files, and a milestone that edits example descriptions must own `registry.json`. A later decision.

### Q37 Column size reset listener stays until the width transition ends
- Tags: D10
- From: run.
- Epic 03 said the reset helper listens for `transitionend` with `{ once: true }`; the merged code keeps listening until a `width` or `min-width` transitionend instead, because other transitions (button colors) bubble to the table first and `once` would leave `data-size-resetting` stuck.
- Code: `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts`, `resetColumnSizeAnimated`. No timer, as D5 says.
- Options:
  - a) Recommended: keep (listener removes itself on the first `width` or `min-width` transitionend)
  - b) revert to `{ once: true }` as the epic wrote it

### Q38 Select clear button padding uses ltr:pr-9 rtl:pl-9, not pr-9
- Tags: D11
- From: run.
- D1 names `pr-9` for the select trigger; the merged code uses `ltr:pr-9 rtl:pl-9`, because `pr-9` fails the logical-direction rule of `pnpm test validate-repo`, which spec 01 Acceptance requires green. The chevron sits left of the clear button as D1 wants, and RTL pads the right side too.
- Code: `components/inputs/ST_FilterTextField.tsx`, the `SelectTrigger` className (three bases).
- Options:
  - a) Recommended: keep `ltr:pr-9 rtl:pl-9`
  - b) revert to `pr-9` with an exception in `test/validate-repo/lib/tailwind-classes.mjs`

### Q39 Removing a filter chip returns the column to its initial filter mode
- Tags: D12
- From: run.
- Not in spec 01: removing a chip or "Clear filters" now resets the column to `table.initialState.columnFilterFns` (first listed mode only when the initial one is not offered). Before, it took the first mode of the list, which with modes on by default turns a multi-select column into `fuzzy` and a select column away from `equals` after one removal.
- Code: the chip remove and clear paths in `ST_FilterOptionMenu.tsx` / `filterSummary.utils.ts` (three bases), merged in `4a61e251`.
- Options:
  - a) Recommended: keep
  - b) revert to the first listed mode

### Q40 Existing multi-select labels retranslated in every locale
- Tags: D13
- From: run.
- Spec 01 asked for three new keys; `filterArrIncludesSome` and `filterArrIncludesAll` already existed, so only `filterArrIncludesNone` is new. The builder also rewrote every locale's `filterArrIncludesSome` to "includes any", and `filterArrIncludesAll` in az, fr, hy, it, pt, pt-BR, ru, tr, uk, zh-Hans, zh-Hant where the old text was an imperative ("include everything").
- Code: `shared/locales/*.ts` (three bases), merged in `4a61e251`.
- Options:
  - a) Recommended: keep the new wording
  - b) revert the existing two keys to their old text, keep only `filterArrIncludesNone`

### Q41 Admins can bypass the release approval gate
- Tags: D16
- From: run.
- The `release` environment created by spec 05 keeps GitHub's default `can_admins_bypass: true`, because the spec's PUT body does not set it: a repository admin can still merge past the owner's Approve on Prepare Release.
- Setting: `gh api repos/anindosarker/shadcn-table/environments/release` (created in `aeca4d55`, E2 05).
- Options:
  - a) Recommended: keep the default (the owner is the only admin)
  - b) set `can_admins_bypass` to false with one more PUT

### Q42 The sheet part lives in the docs only, not in the registry
- Tags: D17
- From: run.
- Spec 04 said `pnpm add-part radix sheet`; the merged code instead lists `sheet` in `EXTRA_PARTS` of `apps/shadcn-table-docs/lib/install.mjs`, so `lib:install <base>` writes `components/ui-<base>/sheet.tsx` for every base and the registry gains no part the library does not use.
- Options:
  - a) Recommended: keep (docs only, like alert-dialog)
  - b) revert: add `sheet` to the registry for radix, base and aria

### Q43 The theme shortcuts depend on a six-day-old beta
- Tags: D18
- From: run.
- `@tanstack/react-hotkeys` is `^0.22.0`, a beta published 2026-11-02, added to `apps/shadcn-table-docs/package.json` by spec 04 (D2).
- Options:
  - a) Recommended: keep `^0.22.0`
  - b) pin the exact version `0.22.0`

### Q44 Three theme controls change nothing visible in the docs
- Tags: D26
- From: run.
- Menu Color, Menu Accent and Style in the theme panel have no visible effect: the docs `components/ui-<base>/` parts carry no `cn-*` hooks for them to target, and spec 04 does not regenerate those parts. Tokens, fonts and radius do apply.
- Options:
  - a) Recommended: keep the controls; hook the docs parts in a later spec
  - b) hide the three controls until the hooks exist

### Q45 The home demo label reads the theme store, not the page attribute
- Tags: D19
- From: run.
- Spec 04 1.6.7 said `no-step-3.tsx` observes `data-design-system` with a MutationObserver; the merged code reads the preset from `useDesignSystem()`, the same store the panel writes, and the label updates on every pick (panel, shortcut, cycle button).
- Options:
  - a) Recommended: keep `useDesignSystem()`
  - b) revert to the MutationObserver as 1.6.7 words it

### Q46 Undo in the Colors tab steps back one keystroke at a time
- Tags: D23
- From: run.
- Each valid keystroke in a Colors tab input is one history entry, so undo walks back through a typed value one valid prefix at a time (spec 04 does not say).
- Options:
  - a) Recommended: keep
  - b) record a token edit on blur, one undo step per edit

### Q47 Random in the theme panel keeps its curated presets through a private decoder
- Tags: D31
- From: run.
- Spec 08 removed the preset-code codec, but the Random button (kept by D21) decoded its curated presets with it; the builder kept Random working with a private `curatedPreset` decoder and a `sameLook` compare in `apps/shadcn-table-docs/lib/design-system/config.ts`, so `decodePreset` from `shadcn/preset` stays imported. Merged in 9d582dcd.
- Options:
  - a) Recommended: keep
  - b) revert: drop `SHUFFLE_PRESETS`, Random shuffles by `randomFields` only, `decodePreset` import gone

### Q48 How dev takes the installation reference refresh while E4 sits on claude/review
- Tags: D30
- From: run.
- The 0.9.0 suite on `dev` (df90bd27) is green except the installation-e2e reference diff (Q20); the fix milestone refreshes six PNGs on a branch cut from df90bd27 and merges it into `claude/review`. P1 says `dev` is then fast-forwarded from `claude/review` again, but `claude/review` now also carries the E4 merges 11 (d7ee15f3) and 08 (9d582dcd), which D15 keeps out of 0.9.0. The Release PR waits on this.
- Options:
  - a) Recommended: merge the fix branch `v0.9/refresh-installation-references` into `dev` directly (`dev` = df90bd27 plus the six PNGs), the one exception to P1 for this release; `claude/review` keeps everything.
  - b) fast-forward `dev` to `claude/review`: 0.9.0 ships E4 08 and 11 (and whatever else merges before the PR opens).

### Q49 The Q22 fix has no play that fails on the shipped code
- Tags: D33
- From: run.
- Fix milestone `stored-view-page-index` (Q22, merged 811045dc) changed how a stored rows-per-page is restored so the page index stays, but no story play exercises a table with `initialState.pagination.pageIndex` above 0, so P11 (a fix's play fails on the shipped code first) has no red line; the spec 12 `Persistence` play stays green before and after.
- Options:
  - a) Recommended: accept as is; the behavior is covered by the three typechecks and the Persistence play, the page-index case is a one-line spec clause
  - b) a follow-up fix milestone adds a `Persistence` play variant with `pageIndex: 2` in `ViewSettings.stories.tsx`, red on 117a81b5, green on 811045dc

### Q50 The pre-paint script creates the style sheet link, not the layout
- Tags: D41
- From: run.
- Spec 15 section 1.6.3 has `app/layout.tsx` render the active style's `<link>` and the pre-paint script swap it; built that way, a page with a stored style failed React 19 hydration (error #418, links in `<head>` matched by href) and a second link appeared. The builder moved the link creation into the pre-paint script in `lib/design-system/config.ts` (`blocking=render`), `app/layout.tsx` renders no link; every check green, merged in 5df252e9.
- Options:
  - a) Recommended: keep (amend spec 15 1.6.3 to match)
  - b) revert to a server-rendered link in `app/layout.tsx` and solve the hydration mismatch another way (the script would then suppress or match the default link)

### Q51 Every per-style sheet build runs through the optimizer, not only --minify
- Tags: D42
- From: run.
- Spec 15 section 1.6.2 says only `--minify` passes a sheet through the optimizer and `predev` leaves it readable; `lib/build-styles.mjs` runs `optimize()` on every build (the flag only adds minification) so the flattened nesting and prefixes match the root bundle. Recorded under the tracker's Notes by the builder; merged in 5df252e9.
- Options:
  - a) Recommended: keep (amend spec 15 1.6.2)
  - b) revert: optimizer only under `--minify`

### Q52 The label event rebuilds the Validate PR failure lines instead of keeping the block verbatim
- Tags: D43
- From: run.
- On a `labeled` or `unlabeled` run only Validate PR reruns; spec 18 1.6.2 says the previous comment's failures block is carried over verbatim. The builder carries it over except the `- **Validate PR**` lines, which are rebuilt from the new record, so a relabel that fixes the label does not leave a stale Validate PR failure in the block. Merged in b501c14f (`tools/release/pr-summary.mjs`, `buildComment`).
- Options:
  - a) Recommended: keep (amend spec 18 1.6.2: "verbatim except the Validate PR lines")
  - b) revert: the block verbatim, a stale Validate PR failure stays until the next full run

### Q53 The four called workflows skip every step on the bump commit, not the job
- Tags: D44
- From: run.
- Spec 16 1.6.4 put `if: ${{ !inputs.skip }}` on the matrix job of `typecheck.yml`, `storybook-tests.yml`, `docs-e2e.yml` and `installation-e2e.yml`. The builder found that a job-level `if:` is read before the matrix expands, so GitHub reports one skipped job named `Typecheck (${{ matrix.base }})` and the required leg contexts stay "Expected" (actions/runner#952, closed unfixed). Merged 8631dc07: every step carries the `if:` instead, so on the bump commit each leg runs no step and reports success under its own context; D35's outcome (no second test run, Prepare Release skipped through Lint and Validate Repo) holds. act expands the legs either way, so only the 0.9.1 release run confirms it.
- Options:
  - a) Recommended: keep (spec 16 1.6.4 already reads this way); the 0.9.1 run is the proof, a context left "Expected" there is a new item
  - b) revert to the job-level `if:` and prove it on a throwaway PR first

### Q54 The getting-started perf budgets are 600 ms under --ci, 300 ms locally
- Tags: D48
- From: run.
- D29 accepts the panel open and light/dark toggle at under 300 ms of long tasks; the 0.9.1 release run (42514739346) measured the toggle at 342 to 351 ms on GitHub runners on two of three bases, twice, so the release PR was red on the budget, not the code (Q28). The fix milestone keeps 300 ms locally (D29's measure) and uses 600 ms under `--ci` so the release can ship; the fix merges into `claude/review` and `dev` before the PR reruns (merged 629dcf81: `PERF_BUDGET_MS` is 600 when `process.env.CI === 'true'`, which GitHub sets; a local `--ci` run keeps 300 ms because `test/run.mjs --ci` does not set `CI`).
- Options:
  - a) Recommended: keep (amend D29's acceptance line: 300 ms locally, 600 ms on GitHub runners)
  - b) revert: one budget of 300 ms everywhere, the release run reruns until the runner is fast enough (or the perf checks leave the CI run)

### Q55 The release label minor ships 0.10.0, D45 names 0.9.1
- Tags: D49
- From: run.
- D45 names the release 0.9.1 and the label `release:minor` (new public API: `ST_DefaultsProvider`, `pageSize` in the stored view); on 0.9.0 that label bumps to 0.10.0 (Validate PR on PR 135, run 42518019709: "Ships as 0.10.0 (release:minor)"). Prepare Release waits; the runner did not approve (a tag and a publish cannot be undone). Everything else is green; the D36 and D38 proof lines are recorded in `trackers/20-release-pr-0-9-1-tracker.md`.
- Options:
  - a) Recommended: ship 0.10.0 as labelled (semver: new public API is a minor), rename spec 20 and the trackers to 0.10.0 after the merge; the runner approves on the ruling
  - b) relabel PR 135 `release:patch` (`gh pr edit 135 --remove-label release:minor --add-label release:patch`), a new `labeled` run, then approve: ships 0.9.1 with new API under a patch number

### Q56 The bundle analyzer wrap writes no report under Turbopack
- Tags: D63
- From: run.
- Spec 24 wraps `next.config.mjs` in `@next/bundle-analyzer` behind `ANALYZE=1` (D53, for spec 30's measurements). The docs app builds with Turbopack, and the analyzer prints "not compatible with Turbopack builds, no report will be generated"; `next build --webpack` writes the reports but fails on `node:` imports. So the wrap and its devDependency do nothing today. The canonical tags and the 308 redirect pass; milestone 24 merges with the wrap as specified, and spec 30 measures the home page chunks from the built `/` HTML and Lighthouse instead.
- Options:
  - a) Recommended: remove the wrap and the `@next/bundle-analyzer` devDependency in a small fix milestone; bundle inspection uses `next experimental-analyze` when needed
  - b) keep the wrap as merged (inert until the app builds with webpack)

### Q57 The sidebar Changelog link is marked external
- Tags: Autofix
- From: run.
- Spec 31 added a Changelog link to the docs sidebar. As a plain entry it also became the "Next" card on the last docs page, pointing at GitHub. The review fix gave the entry the fumadocs `external:` prefix in `content/docs/meta.json`: the link stays in the sidebar, opens in a new tab, shows the external-link icon before its label, and no longer appears in the previous/next footer. Merged in 23e1cfa9.
- Options:
  - a) Recommended: keep
  - b) revert: drop the prefix (no icon, same tab, and the last docs page gets a Next card to the changelog on GitHub)
