# v0.9.x findings

## Round 1: discussion, 2026-11-07

### F1 Select filter clear button overlaps the chevron

- Once a select filter has a value, the clear x (`absolute inset-y-0 inset-e-0`, `ST_FilterTextField.tsx:335-347` radix; aria `:369`, base `:340`) sits on top of the `SelectTrigger` chevron. The trigger's `pe-9` never applies: the shadcn `SelectTrigger` base has `pr-2` (`select.tsx:46`), tailwind-merge keeps both classes, and Tailwind 4 emits `padding-right` after `padding-inline-end`, so `pr-2` wins. Same in chips, subheader and popover modes, all three registries. Owner's screenshot `v0.8.x/reference/image/bugs/1793953068792.png`. Resolved by D1.

### F2 The filtering stories show the old filter UI, not the current format

- Owner, 2026-11-08, on the deployed Storybook (`https://storybook.shadcn-table.com/base/`): the filtering stories are not updated to the new format. Stories looked at: `Features/Filtering Examples` (`FilteringChangeModeEnabled`, `FilteringChangeModeEnabledFaceted`, `SubheaderRangeFieldsNarrow`, `FilterFnAndFilterVariants`, `packages/shadcn-table/stories/features/Filtering.stories.tsx:174-702`) and `Features/Filter Chips Examples` (`FilterModePickerTableLevel`, `FilterChips.stories.tsx:300`). Major. Screenshot 2026-11-08 of `FilteringChangeModeEnabled` (Base build): the subheader filter row with one input per column and a "Filter Mode: Fuzzy" helper line under each, no chips; the docs filtering examples moved to chips in v0.8.x (D51) while the stories did not.

### F3 The filtering story's UI jumps

- Owner, 2026-11-08, on `https://storybook.shadcn-table.com/base/?path=/story/features-filtering-examples--filtering-change-mode-enabled`: type a value in one subheader filter field, then close it (blur): the first filter field jumps (layout shift in the filter row). To be reproduced with a play before it is planned (v0.8.x P10, P11).
- Resolved 2026-11-08: the jump is the filter mode menu's exit animation. `useST_MenuAnchor.ts` stored `anchorEl?.getBoundingClientRect()` on close, undefined once the anchor cleared, so the invisible trigger span moved to (0,0) and the Base UI and Radix positioners followed it while the menu faded; the hook now keeps the last measured box (three bases). Play `FilterModeMenuClosesInPlace`, red on base and radix before, green after; merged as a fix from the lead at the merge commit after `546bcabd`.

### F4 Stories carry no explainer

- Owner, 2026-11-08, screenshot of `Features/Filtering Examples/Column Filtering Disabled` (Base build): every story shows the same three-line banner (docs link, base links, source link) and nothing about what the story demonstrates or what to try; a visitor cannot tell what "Column Filtering Disabled" shows. Holds for every story (594 stories, one shared banner from `.storybook/preview.tsx`). To be discussed with the docs restructuring items, not on its own.

### F5 The pagination mode named `default` is not the default

- `paginationDisplayMode` defaults to `pages` (v0.8.x D13, `useST_TableOptions.ts:90`), but the mode value `'default'` names the compact range-and-arrows footer, so the guide (`/docs/guides/pagination#pagination-display-modes`) has to say "by default ('pages') ... set to 'default' for the compact UI". Owner, 2026-11-08: the page reads as wrong. The name comes from Material React Table, where `default` is the default. Renaming the value is a public option change (v0.8.x P7), so the fix is decided with item 6.

### F6 The deployed Storybook runs the plays and shows their end state

- Owner, 2026-11-08, `https://storybook.shadcn-table.com/base/?path=/story/features-pagination-examples--pagination-enabled-default-more-data`: the story opens with the global filter already set to "42459 Eda Springs" and one row left, because its play function runs on load in the static build too. A visitor takes the filtered end state for the example (D59 requires a play per story, so most stories end in some changed state). The static builds under `/base/`, `/radix/` and `/aria/` should render the stories without running the plays (the plays keep running in vitest and in local dev), or the play should restore the initial state; the mechanism is decided with the Storybook items.

### F7 "Default" names the compact pagination across stories and docs

- Owner, 2026-11-08, `Features/Pagination Examples/Pagination Enabled Default More Data` (Base build): the story is titled "Default" and shows the compact footer (`Rows per page`, `1-10 of 551`, four arrows), which is not the default since v0.8.x D13 (`pages`). The same wording runs through the pagination stories (`Pagination Enabled Default`, `... Big Data`, `... No Rows Per Page` and more), the guide, the API page and the examples. Fixing it is bigger than F5: one audit of every story title, docs page and example that says "default" for `paginationDisplayMode: 'default'`, with the rename decided separately from item 6 (the range span). Decided in its own item.

### F8 Two storybook plays time out under machine load and are not on the known-flake list

- `stories/features/ClickToCopy.stories.tsx` "Click Copies Value" (base and radix) and `stories/features/RowOrdering.stories.tsx` "Drag Reorders Rows" (aria, 90 s timeout) failed once each in the E1 verifier runs at load average about 16 and passed on rerun and alone; neither is in the P5 known-flake list, so a loaded run reads them as red.

### F9 Two doc comments name files spec 04 deleted or misstate their list

- `apps/shadcn-table-docs/components/theme-demo/demo-themes.ts:42` still names `lib/theme-presets.ts` and `themes/*.css`, deleted by spec 04; `apps/shadcn-table-docs/lib/install.mjs:52` says `EXTRA_PARTS` holds "parts the examples import", but `sheet` is imported by the theme panel, not by an example.

### F10 The static Storybook test folder matches the build-output ignore line

- `.gitignore`: the line `storybook-static` also matches `test/storybook-static/`, so spec 06 added its two files with `git add -f`; git tracks them now, but a new file in that folder is ignored unless a `!test/storybook-static/` line follows.

## Round 3: triage E2, 2026-11-08

### F11 The docs dev server logs errors on every page load

- Owner, 2026-11-08, `pnpm --filter shadcn-table-docs dev` on `claude/review` (`815436fa`), GET `/`: two logs on every load. Server: `[TanStack Hotkeys] A hotkey label was formatted during server rendering without a platform, so it uses 'linux'` (the kbd hints of the theme panel, E2 04, format on the server with no `platform`). Browser: `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties` under `<Page>` of `(home)/page`, attribute mismatch not yet located. Owner: "Every time I run the server locally I see huge errors."

### F12 Reset is not discoverable

- Owner, 2026-11-08, same screenshot: "There is no button or hint to reset theme." The header holds an icon-only reset button with a `⇧R` hint (spec 04 review fix), which the owner did not read as reset.

### F13 The color tokens have no color picker

- Owner, 2026-11-08, same screenshot: each token in the Colors tab shows a static swatch and a hex input; no picker opens from the swatch. The reference (shadcnstudio.com/theme-generator, D2) opens a picker.

### F14 The persistent view example starts with more than ten rows

- Owner, 2026-11-08, `/docs/examples/persistent-view`: the default page size should be ten.

### F15 The docs dev server is slow

- Owner, 2026-11-08, `pnpm --filter shadcn-table-docs dev` on `claude/review`: "The site is super slow in dev server." Cause, measured 2026-11-08 in a browser before and after the theme panel: `app/global.css:9-16` imports all eight `styles/style-*.css`, the root stylesheet grew from 351 KB to 2,755 KB, and every theme or class change recalculates styles over about 3,560 nodes (0.5 to 1 s); the first-hit compile (12 to 18 s) is the same on both builds. The machine's load average of 20 plus from agent gates doubles it. Resolved by D29.

### F16 The icon library cannot be changed

- Owner, 2026-11-08, same screenshot: the Icon Library select is disabled at Lucide (D2: "Lucide only, v0.7.x D38"). Owner: add the option.

### F17 Undo and redo use `p` and no key

- Owner, 2026-11-08: undo and redo should be the regular shortcuts, Cmd+Z and Cmd+Shift+Z (Ctrl on Windows and Linux); D2 gave undo `p` and redo nothing.

### F18 The theme panel carries Copy and Import

- Owner, 2026-11-08, screenshot of the panel on `/docs/examples/persistent-view` (dev, `claude/review`): the Copy button (top row) and the Import button (Presets row), both from D2's layout, marked "Unnecessary items, remove them."

### F19 The shortcut buttons and hints are spread over the panel

- Owner, 2026-11-08, same screenshot: Undo (`P`) and Redo sit in the top row, Random (`R`) in the Presets row, the cycle hint `C` under the preset select, Reset (`⇧R`) as an icon in the header. Owner: keep all shortcut buttons and hints together at the top.

### F20 Installation E2E references predate the pages footer range

- `test/installation-e2e/fixtures/reference/<base>/default-{light,dark}.png` (committed in 010f7359, v0.8.x) show the pages footer without the `1-10 of 50` range span that spec 02 (D6) added; `pnpm test installation-e2e` on `dev` at df90bd27 fails the three nextjs scenarios with 23626 (light) and 25084 (dark) pixels over the 500 limit, the same count on every base.
- v0.8.x D-addendum (decisions.md line 780): a milestone that changes the default look replaces the six PNGs from a `pr.yml` dispatch with `installation-e2e-only=true`; spec 02 did not. Fix milestone `refresh-installation-references`.

### F21 Installation E2E capture diff cannot pass on macOS against the Linux references

- `test/installation-e2e/lib/browser.mjs:363`: the local capture on macOS differs from the Linux CI reference in every glyph (font rasterization), so the diff exceeds 500 pixels whatever the code; the v0.8.x local runs used `--no-diff` (v0.8.x tracker 08-test-runner-and-tests, line 22).
- Local runs of the nextjs scenarios take `--no-diff`; the pixel diff is a CI check only. Recorded in process.md P5.

### F22 Restoring a stored rows per page remaps the page index

- `packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts:121` (spec 12, merged 117a81b5): `applyView` restores the stored size with `table.setPageSize`, which in TanStack 9.3.1 recomputes `pageIndex` to keep the top row; spec 12 section 1.6.3 says the page index is untouched, so a table with `initialState.pagination.pageIndex` above 0 and a stored size mounts on another page. Fix: `table.setPagination((old) => ({ ...old, pageSize: view.pageSize }))` in the three bases, the comment reworded, the docs copies regenerated.
- Same review (fable, round 1, minors): `content/docs/guides/view-settings.mdx:109` Reset view bullet lacks "rows per page"; `content/docs/examples/persistent-view.mdx:6` lists a partial field set where spec 12 1.6.4 says the page names the option without a field list.

### F23 Theme hotkey docs E2E checks read the variable a fixed 200 ms after the key

- `test/docs-e2e/lib/getting-started.mjs:282-309` (spec 04 on `dev` at 0adce149; spec 09 and 10 kept the pattern on `claude/review`): `press()` is `keyboard.press` plus `waitForTimeout(200)`, then `--primary` is read once. On CI (release PR 134, run 42488458376) "theme: Shift+R returns to the default" failed on base and aria in attempt 1 and on aria again in attempt 2 with the value unchanged after Shift+R, and radix timed out on the next click; locally it failed once under load (P5 entry). Fix: wait for the variable to change (or to equal the expected value) with a bounded poll instead of a fixed delay; test file only.

### F24 The theme check's search dialog stays open after Escape on CI

- `test/docs-e2e/lib/getting-started.mjs` (`/` theme checks, `dev` at ea276251 and `claude/review`): after "theme: r does nothing while the search dialog is open" the test presses Escape and swallows the 5 s detach timeout; on CI the dialog stays, so the next `button[aria-label="Customize theme"]` click (or the following `input.fill`) times out after 30 s. Release PR 134: run 42488458376 attempt 1 radix, run 42490873017 attempts 1 and 2 aria (the F23 hotkey waits pass there). Fix: close the dialog deterministically (second Escape, close control, reload as the last resort) before the edit check; test file only, D30 pattern.

### F25 The CRUD delete-dialog check counts rows before the example finishes loading

- `test/docs-e2e/lib/examples.mjs:85-111` (`deleteDialog`, v0.8.x F53): `before` is `tbody tr` counted as soon as the example panel is found, `after` the same count once the Cancel click closed the alert dialog. On CI the inline CRUD examples still show their loading rows at the first count (before=10 after=8 on `editing-crud-inline-row` and `-inline-cell`, before=20 after=10 on `editing-crud-tree`), so the check fails although Cancel kept every row. Release PR 134 on the bump 0a465c3e: run 42501252444 attempt 1 base and radix, attempt 2 radix; earlier once on aria at ea276251. Fix: wait for the example's rows to settle (the loading state gone, the count stable across two reads) before the first count; test file only, D30 pattern.

### F26 Spec 15 comments still name app/layout.tsx as the style link owner

- `apps/shadcn-table-docs/app/global.css:7`, `lib/build-styles.mjs:8-11`, `lib/design-system/config.ts:451` (JSDoc on `STYLE_SHEET_ID`) say the style link is rendered by `app/layout.tsx`; since the A14 deviation the pre-paint script creates it. `CONTRIBUTING.md:59` lists neither `lib/build-styles.mjs` nor `public/styles/`. Review minors of milestone 15 (fable, round 1), left by the bounce because no major was open; a one-commit docs fix.

### F27 The record cap of record-output.mjs has no unit test and the pr-summary.mjs header names a removed act path


- `tools/release/record-output.mjs:28`: `capRecord` holds the one rule D38 specifies (five errors, 400 characters, an `…` mark) and is exported, but no `tools/release/record-output.test.mjs` runs under `pnpm test validate-repo`; the cap was checked by hand in the spec 19 review only. `tools/release/pr-summary.mjs:10`: the header says the `test/.out/*.json` fallback serves "spec 18's act check", but under act `toJSON(needs)` sets `NEEDS` too, so the fallback serves a plain shell run only. Both nits from the spec 19 review (a0677dfc), deferred.

### F28 The 300 ms perf budgets of the getting-started page fail on GitHub runners


- `test/docs-e2e/lib/getting-started.mjs:841-845`: `perf: panel open` and `perf: light/dark toggle` require under 300 ms of long tasks (D29's acceptance, measured on the owner's machine). On GitHub runners the toggle took 342 ms (aria) and 351 ms (radix) on the 0.9.1 release PR run 42514739346, twice (one rerun), base 267 ms; panel open 207 to 268 ms. The release run is red on a budget the runner cannot meet; the P5 flake rerun does not cover it.

### F29 The llms.txt summary duplicates the home page description


- `apps/shadcn-table-docs/lib/llms.ts`: the `llms.txt` summary line is the home page description copied as a module constant (spec 29, merged 184056d2), because the home page and layout files belonged to other milestones; a change to the home description leaves this copy behind. One shared `siteDescription` in `lib/shared.ts` read by the layout, the OG image (`app/opengraph-image.tsx` holds a third copy) and `lib/llms.ts` removes it.

### F30 PostHog and providers load in the root layout on every page

- `apps/shadcn-table-docs/app/layout.tsx`: posthog-js (114 KB) and the providers ship in the shared root layout, so every page carries them in the first load; on `/` they are most of the 580 KB of script left after spec 30 (A21). A later decision lazy-loads posthog-js after hydration or on first interaction and re-measures `/` against 450 KB; the docs check "icons: the pick survives a reload" must keep passing.

### F31 The docs check suite has no check for the byline or the two new pages
[D65]


- `test/docs-e2e/lib/`: spec 31 2.2 expects `pnpm test docs-e2e` to prove the byline and the two new pages (`/docs/getting-started/comparison`, `/docs/guides/tanstack-table-with-shadcn-ui`), but no milestone of spec 31 owns `test/docs-e2e`, so no named check exists; the frame milestone (merged 23e1cfa9) proved them by curl and a route run only (render, hydration, console).

### F32 Guides and API copy overclaims shadcn components and keeps six inherited typos
[D64]


- `apps/shadcn-table-docs/content/docs/guides/accessibility.mdx:7`, `guides/customize-components.mdx:7`, `api/st-components.mdx:22`, `api/table-options.mdx:24`: the new copy (spec 31, merged edc04e01) says the table is built from shadcn/ui components throughout; the table, rows and cells are plain elements (`ST_Table.tsx:113`, `ST_TableBodyCell.tsx:317`), only the controls are shadcn/ui. Typos and inherited phrasing left on edited lines: `guides/column-ordering-dnd.mdx:72` ("should also should"), `guides/editing.mdx:211` ("news rows"), `guides/column-size.mdx:88` ("ect."), `guides/detail-panel.mdx:163` ("as of version 2.6.0", a Material React Table version); `guides/sorting.mdx:3` says the sort arrow shows in each header cell (only sorted ones); four API pages keep an older sentence that restates the new lead. Review findings of the milestone, deferred by the script as minors.

### F33 Vercel free tier function CPU at 75 percent
[D66]

- Vercel mail 2026-11-11 02:01: team `anindo-sarkers-projects` used 75 percent of the Hobby tier's Fluid Active CPU (4 hours per month); at 100 percent the projects pause. Likely sources: the Show HN traffic of 2026-11-10, `proxy.ts` running on every request, the `/og/docs/[...slug]` image route, the llms and Markdown routes.
- Choices for a later item: Vercel Pro (20 USD a month, pay-as-you-go above the included usage), or move per-request work off functions (static OG images at build, narrower `proxy.ts` matcher, cache headers on the Markdown routes) and re-measure on the Vercel usage page.

### F34 Rank one for shadcn table and a keyword-led snippet

- Owner, 2026-11-12, Google query "shadcn table" (logged in, personalised): the result shown is `/docs/getting-started/introduction`, below shadcn.io's "Shadcn Table: Free Data Table Component for Next.js" (tablecn) and a shadcn-ui GitHub issue; the owner also reports finding the page only on the sixth page in another view. Goal: rank one for "shadcn table", with the home page as the landing result, not the introduction page.
- The snippet Google shows is the introduction's description ("shadcn-table is a feature-rich data table for shadcn/ui. It covers everything from a simple list to a production data grid."); the owner wants it rewritten around the terms people search (shadcn table, shadcn data table, data table component, Next.js, TanStack Table), as the tablecn result does ("production-ready, feature-rich data table component. Built with Next.js, React, Tailwind and shadcn/ui").
- Inputs for the item: Search Console query and page data once it fills (the property is 2 days old), the live home and introduction descriptions after E10 ships, a keyword check with the `/seo` tools. To discuss later, at the owner's call.

### F35 Example source read traces every examples file into the build

- `apps/shadcn-table-docs/lib/example-source.ts:39` (`listExampleFiles`, October 2026, before E10): `fs.readFile(path.join(dir, rel))` with a dynamic `dir` makes Turbopack trace the whole `examples/` tree including the generated `examples/.<base>` copies (8 pattern alternatives times about 1321 files, reported as 10568 matches); builds and typecheck are slow. One-file literal paths made it worse (4 warnings, 13384 matches, reverted). Needs a change to how the example folders are read, across more than one file; a later decision.

### F36 The generated examples registry was not regenerated with the spec 31 descriptions

- `apps/shadcn-table-docs/registry.json` is tracked and generated by `tools/registry/examples.mjs` (`pnpm -w registry:items`, run by the docs `build` script) from the example pages' descriptions. Spec 31's Examples copy milestone owned `content/docs/examples/**` only, so the rewritten descriptions never reached the committed file; the owner's local build regenerated it and left a 252-line diff. Committed by the lead 2026-11-12. Gap: no check fails when a generated tracked file is stale; `pnpm test validate-repo` should regenerate and `git diff --exit-code` the registry files, and a milestone that edits example descriptions must own `registry.json`. A later decision.
