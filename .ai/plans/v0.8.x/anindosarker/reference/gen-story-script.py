#!/usr/bin/env python3
"""Generate the three S6 story workflow scripts from the expedition template."""
import re, sys, pathlib

TPL = pathlib.Path('/Users/anindosarker/.claude/skills/expedition/templates/workflow.js').read_text()
OUT = pathlib.Path('/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/a8f67844-b95f-442e-b11b-8a45bbe814b1/scratchpad')
BASE_SHA = sys.argv[1]
ROOT = '/Users/anindosarker/Work/Personal/React-table/shadcn-react-table'

COMMON = """- Tracker format: ~/.claude/skills/expedition/templates/tracker.md (Status, Branch line, Gates bullets, one Milestone line each, "## Attention", "## Notes"); set the Branch line to your branch, worktree and PR; commit it with your commits, always pushed.
- The machine is loaded (P4): run per-base gates one base after another, never two test:<base> or two Storybook builds at once; ports 5340 to 5360 for anything you start, stop what you start. The dev registry on 5310 is shared: reuse it, never kill it. Never touch ports 5273, 5320, 5330, 6006, 6007, 6008.
- Library bases live under packages/shadcn-table/registry/{radix,base,aria}/components/ui/shadcn-table/ (there is no src/). Write radix first, then base and aria; a file whose base or aria copy differs is listed in packages/shadcn-table/scripts/registry/{base,aria}-diff.json (hand-kept allow lists); `pnpm -w check:bases` must stay green.
- Gates: `pnpm tsc:radix`, `pnpm tsc:baseui`, `pnpm tsc:aria`, `pnpm lint`, `pnpm check:tailwind`, `pnpm check:bases`, `pnpm check:icons`; `test:<base>` runs the Storybook plays in Chromium (`pnpm test:base` etc., see packages/shadcn-table/package.json); `storybook:build:<base>`; aria warnings: `node scripts/check-aria-warnings.mjs --url <built aria storybook served on a port you take>` must print 0. The known flake `Profiled Thousand Rows` and the parallel-load flakes pass alone: rerun once before red.
- Reproduce first (P6): every play the spec lists is written before its fix, run against the shipped code, and its failure noted in the tracker ("## Notes": play name, what failed); then the fix makes it pass. A play that passes on the shipped code is not proof: rewrite it until it fails first.
- Never edit a file another S6 story owns (index Stories table rows "Toolbar and filters (06.1)", "Cells and layout (06.1)", "Docs app (06.2)"): if a root cause lives in a file you do not own, do not fix it there; write the exact file:line and the fix under "## Attention" in your tracker and continue with the other findings.
- No workaround on a symptom: fix the root cause where it lives (no-hack rule).
- The owner's demo at /Users/anindosarker/Work/Personal/React-table/test-projects/next-app is read-only reference (D34): never start, stop or restart its server."""

STORIES = {
  'toolbar': dict(
    id='06.1-toolbar', wt=f'{ROOT}.worktrees/01', branch='v0.8/fix-toolbar',
    plan='specs/06.1-library-fixes.md', tracker='trackers/06.1-tracker.md',
    title='v0.8 spec 06.1: toolbar and filters', review='fable',
    specifics="""Story "Toolbar and filters (06.1)" specifics (spec 06.1 sections 1.6.2, 1.6.3 and the three plays of 1.6.9 that belong to them; the other sections are the Cells story's, running at the same time):
""" + COMMON + """
- Your files: components/toolbar/*.tsx, components/menus/*.tsx, components/table/ST_TableLayout.tsx, shared/locales/en.ts, shared/locales/de.ts, index.ts (append under a `// spec 06.1` comment, both sides in order, P9) in the three bases; packages/shadcn-table/scripts/registry/{base,aria}-diff.json; stories/features/{SortPopover,ColumnHiding,FilterChips}.stories.tsx; CHANGELOG.md block `#### Spec 06.1 toolbar` under `### Fixed` (create the `### Fixed` heading under Unreleased if missing). Nothing under components/head, components/body, hooks, features, shared/utils.
- F17: ST_FilterChips.tsx differs per base (base and aria copies); move the header-anchored editor (radix 297-348, mounted at 433; base 311-, 440; aria 323-, 449) into a new exported ST_HeaderFilterEditor.tsx per base, with the column lookup it needs; ST_TableLayout.tsx:114-117 renders it right after the toolbar slot in chips mode. The play HeaderEditorWithCustomToolbar in FilterChips.stories.tsx: renderTopToolbar returns a plain div; open the column menu, click Filter, the editor opens anchored to the header, type a value, rows filter.
- D47: ST_SortPopover.tsx canAddSort (radix/base 86, aria 81) also requires sorting.length < (maxMultiSortColCount ?? Infinity); play MaxMultiSortCapsAdd in SortPopover.stories.tsx.
- D48: ST_ShowHideColumnsMenuItems.tsx label (radix/base 120-128, aria 164-166) renders <ST_ColumnIcon column={column} /> (exported from ST_ColumnPicker.tsx) before the header; play MenuItemsShowIcons in ColumnHiding.stories.tsx.
- D41, F11: en.ts:113 'Row numbers', de.ts:73 'Zeilennummern', per base; no other locale.""",
  ),
  'cells': dict(
    id='06.1-cells', wt=f'{ROOT}.worktrees/03', branch='v0.8/fix-cells',
    plan='specs/06.1-library-fixes.md', tracker='trackers/06.1-cells-layout-tracker.md',
    title='v0.8 spec 06.1: cells and layout', review='fable',
    specifics="""Story "Cells and layout (06.1)" specifics (spec 06.1 sections 1.6.4 to 1.6.8 and the seven plays of 1.6.9 that belong to them; 1.6.2 and 1.6.3 are the Toolbar story's, running at the same time):
""" + COMMON + """
- Your files: components/head/*.tsx, components/body/*.tsx, components/table/ST_Table.tsx, components/inputs/ST_SelectCheckbox.tsx, shared/utils/style.utils.ts, hooks/display-columns/*.tsx, hooks/useST_Effects.ts, hooks/useST_ViewPersistence.ts, features/stViewSettingsFeature.ts in the three bases; stories/features/{Selection,RowNumbers,ViewSettings,HeaderGroups,RowActions,DetailPanel}.stories.tsx, stories/fixed-bugs/FilterPopover.stories.tsx; CHANGELOG.md block `#### Spec 06.1 cells` under `### Fixed` (create the heading if missing). Nothing under components/toolbar, components/menus, ST_TableLayout.tsx, locales, index.ts.
- Milestone order is reproduce first: write all seven plays (spec 1.6.9: CheckboxesAlign, NumbersCentred, RowNumbersKeepAlignment, GroupEdgesMatchLeaves, OpensWithRowSelection, TwoControlsVisible, PanelRenders) and run them on the shipped code in one base before any fix; note each failure in the tracker. F16, F19 and F24 have no confirmed cause (the spec lists candidates per finding): the failing play is your reproduction; find the cause by reading and by instrumenting the play, fix where it lives, and record the cause in one tracker Note line. If a play does not fail on the shipped code, make it match the docs page that showed the bug (persistent-view with row numbers on through the view settings; export-csv with enableRowSelection, columnFilterDisplayMode 'popover' and sized columns 40 to 300; detail-panel with layoutMode grid) until it does.
- F12: body display cells keep px-0 and get justify-center text-center (ST_TableBodyCell.tsx:336-346); header display cells and placeholder header cells above a display column get p-0 justify-center instead of the density padding (ST_TableHeadCell.tsx:252-256, 345-354, 340-341); row numbers Cell tabular-nums text-muted-foreground.
- F18: style.utils.ts (radix/base 76-96, aria 109-129): a group header's flex is the sum of its leaves' resolved flex; grow 0 when every leaf is pinned or grow false; sticky with the leaves' offset when every leaf is pinned on one side; justifyContent center stays.
- F22 (D52): getST_RowActionsColumnDef.tsx: with renderRowActions set, Header renders localization.actions visibly and size defaults to 96 (displayColumnDefOptions['st-row-actions'].size wins); without it, 48 and the sr-only header as shipped; the cell content wrapper flex items-center justify-center gap-1; no overflow-visible.
- F19: keep popover mode's funnel look (opacity 30 at rest, full while active); label min-w-0 truncate, funnel and chevron shrink-0; the popover must open from the funnel in base (Tooltip wrapper around the trigger), radix and aria.""",
  ),
  'docs': dict(
    id='06.2-docs', wt=f'{ROOT}.worktrees/02', branch='v0.8/docs-follow-up',
    plan='specs/06.2-docs-follow-up.md', tracker='trackers/06.2-tracker.md',
    title='v0.8 spec 06.2: docs app', review='fable',
    specifics="""Story "Docs app (06.2)" specifics (spec 06.2 milestones 2.1.1 to 2.1.4; milestone 2.1.5 is the Stories story's, in a later sprint):
- Tracker format: ~/.claude/skills/expedition/templates/tracker.md; set the Branch line; commit it with your commits, always pushed.
- Your files: everything under apps/shadcn-table-docs/ except components/ui-<base>/ (regenerated, never edited), plus .ai/plans/v0.8.x/anindosarker/reference/06.2-check.mjs and the CHANGELOG.md block `#### Spec 06.2` under `### Docs`. No library source edit (P5): a library bug goes under "## Attention" in the tracker with file:line. Do not touch packages/shadcn-table/stories/ (the Stories story, later sprint).
- The docs app scripts: build, dev, types:check, lint, lib:install, registry:hosted, examples:variants (apps/shadcn-table-docs/package.json). Page checks: scripts/check-pages.mjs --base <base> --url http://localhost:<port> against your own dev server (`PORT=<5340 to 5360> pnpm --filter shadcn-table-docs dev`), one base at a time, stop the server when done; clusters a to e under scripts/page-checks/, helpers in _helpers.mjs (DEMO_LAST at :522). The dev registry on 5310 is shared: start it with `pnpm registry:dev` only when missing, never kill it. Never touch ports 5273, 5320, 5330, 6006 to 6008.
- The library copies under components/ui-<base>/ come from `pnpm -w registry:build` then `pnpm --filter shadcn-table-docs lib:install radix`, base, aria one after another (never in parallel, shared temporary components.json); you only need them if the installed copies are stale; the library itself is not yours. The machine is loaded (P4): long gates one base after another.
- Examples: hand sources in examples/{radix,base,aria}/<slug>/ (116 slugs, identical across bases unless listed in packages/shadcn-table/scripts/registry/examples-{base,aria}-diff.json); generated copies examples/.<base>/ are git-ignored and rebuilt by `pnpm --filter shadcn-table-docs examples:variants` (also by predev, build, types:check); example maps regenerated with `node apps/shadcn-table-docs/scripts/example-map.mjs` (never edit examples/map.tsx or example-groups/map.tsx by hand); registry.json through `pnpm --filter shadcn-table-docs registry:items` (part of build), commit the regenerated file. A new example needs: the three base folders, content/docs/examples/<page>.mdx, meta.json Filtering block (:29-34), lib/routes.ts Filtering secondaryItems (:277-320), example-groups/FilteringExamples.tsx tab, a page-checks/e.mjs entry. Never rename or remove an example, route or registry item (P5).
- D49 icon convention: `import { <Name>Icon } from 'lucide-react'`, `icon: <Name>Icon` on every column object (accessorKey objects and columnHelper.accessor options); no size, no className; the same pick for the same field across examples; persistent-view's unsuffixed imports renamed; loop-built columns (dynamic-columns/TS.tsx:105, enable-column-virtualization/makeData.ts:49) take an icon from a lookup Record by key with a fallback; alternate-pagination/makeData.ts and server-side-data/components/UsersTable.tsx hold column defs too; the 39 localization-i18n-* examples share one column block.
- D50: persistent-view makeData.ts takes the Task type, makeRandom(42) and the 50-row generator from packages/shadcn-table/stories/styling/DefaultLook.stories.tsx:37-160 (read it, copy the data code; do not edit the story); TS.tsx takes the 15 columns with icons and sizes from :162-225; keep persistViewSettings and id.
- D46 home demo: components/dev-home/v12/signal-table.tsx imports data from @/examples/.radix/persistent-view/makeData (the same pattern as today's aggregation-and-grouping import); columns as persistent-view; options per spec 1.6.3; signal-demo.tsx STEPS Sorting, Search, Editing, Filtering, Column order, View settings; _helpers.mjs DEMO_LAST = 'Now showing: View settings'; e.mjs home entry follows.
- F26/D51: the four filtering examples lose columnFilterDisplayMode and initialState.showColumnFilters; the new subheader-filters example keeps them with enableColumnFilterModes; page checks b.mjs:138-175 and e.mjs:44-75 rewritten for chips (a chip per seeded filter, the editor opens from the chip, the variant control renders inside the editor, the mode picker on the modes page), the subheader assertions move to the new page's entry; b.mjs:347 asserts path.recharts-line-curve count above 0 (F25, after the stroke fix in chart-detail-panel/TS.tsx:72,78,84 in the three bases: `stroke="var(--primary)"` etc.).
- F14: global.css:363 rule becomes exactly `#nd-page .prose :is(p, ul, ol):not(.not-prose *) {`; the table font-size rule at 367-370 the same way if it reaches the preview; e.mjs persistent-view entry asserts the pagination ul bottom inside the bottom toolbar rect; react-query entry asserts the first body row top not above the sticky header bottom (a failure after the rule fix is a library fault: Attention line, not an edit).
- F27: advanced, custom-top-toolbar, custom-headless, external-toolbar render <ST_ViewSettingsButton table={table} /> (exported; needs the table prop; never ST_ToolbarInternalButtons inside renderToolbarInternalActions, it recurses); external-toolbar drops ST_ShowHideColumnsButton, ST_ToggleDensePaddingButton, ST_ToggleFiltersButton; advanced drops ST_ToggleFiltersButton and renders <ST_FilterChips table={table} /> in its toolbar; custom-column-filtering-ui and enable-row-ordering render <ShadcnTable table={table} /> instead of ST_TableContainer; minimal stays.
- F15: size 40 and 50 on data columns (export-to-csv:19, export-to-pdf:20, chart-detail-panel:26, enable-column-pinning:19, alternate-detail-panel:33, enable-detail-panel-conditionally:18, three bases) become 56 or are removed. F21: row-ordering.mdx:3,6 and row-dragging.mdx:6 say row. D52: the five editing examples set positionActionsColumn: 'first' (editing-crud-table loses 'last').
- reference/06.2-check.mjs <root>: the checks of spec 1.6.7; exit 1 on any report; commit it in milestone 1 and run it in every later milestone.""",
  ),
  'stories': dict(
    id='06.2-stories', wt=f'{ROOT}.worktrees/02', branch='v0.8/stories-icons',
    plan='specs/06.2-docs-follow-up.md', tracker='trackers/06.2-stories-tracker.md',
    title='v0.8 spec 06.2: stories and DefaultLook', review=None,
    specifics="""Story "Stories and DefaultLook (06.2)" specifics (spec 06.2 milestone 2.1.5 only: sections 1.6.6 and the stories part of 1.6.2 and 2.2; the docs app milestones are merged already):
""" + COMMON + """
- Your files: every file under packages/shadcn-table/stories/ except stories/fixed-bugs/MultiSelectFilter.stories.tsx (a fix story's new file, may not exist yet); CHANGELOG.md block `#### Spec 06.2 stories` under `### Docs`; your tracker. No library source edit (P5): a library bug goes under "## Attention" in the tracker with file:line.
- D49 icon convention (as the docs examples, merged): `import { <Name>Icon } from 'lucide-react'`, `icon: <Name>Icon` on every column object (accessorKey objects, accessorFn objects, columnHelper.accessor options); no size, no className; the same pick for the same field (firstName/lastName UserIcon, age CakeIcon, city Building2Icon, state MapIcon, address MapPinIcon, email MailIcon, salary DollarSignIcon, dates CalendarIcon, booleans CheckIcon, ids HashIcon, generic TypeIcon); loop-built columns (stories/features/Virtualization.stories.tsx:343, RowOrdering.stories.tsx:238 fakeColumns) take an icon from a `Record<string, LucideIcon>` lookup with a fallback.
- F10: stories/styling/DefaultLook.stories.tsx:227-280 passes columns, data, getRowId, enableRowActions and renderRowActionMenuItems only; its play tests stay green; the eleven explicit options go.
- The check: `node .ai/plans/v0.8.x/anindosarker/reference/06.2-check.mjs packages/shadcn-table/stories` must exit 0 (it reported 807 entries before this story); extend its exception list only for loop files.
- Play assertions that read header text keep passing (the icon renders before the label, the text is unchanged); a play that breaks because of an icon is fixed in the play, never by dropping the icon.
- Gates: `node reference/06.2-check.mjs packages/shadcn-table/stories`, test:base, test:radix, test:aria one after another, storybook:build:base, lint.""",
  ),
}

def gen(key, st):
    s = TPL
    s = s.replace("name: 'v<cycle>-story-<slug>'", f"name: 'v0-8-s6-{key}'")
    s = s.replace("description: 'v<cycle> story <Name (NN)> (worktree <name>): build, spec check, review, verify, judges, merge; the release story adds gate and release'",
                  f"description: 'v0.8.x sprint S6 story {st['id']} ({st['branch']}, worktree {st['wt'].rsplit('/',1)[1]}): build, spec check, fable review, verify; merge by the main session'")
    s = s.replace("""  phases: [
    { title: 'Story NN build' }, { title: 'Story NN review' }, { title: 'Story NN verify' },
    // release story only:
    { title: 'Release gate' }, { title: 'Release' },
  ],""", f"""  phases: [
    {{ title: 'Story {st['id']} build' }}, {{ title: 'Story {st['id']} review' }}, {{ title: 'Story {st['id']} verify' }},
  ],""")
    s = s.replace("const ROOT = '/abs/path/to/repo'", f"const ROOT = '{ROOT}'")
    s = s.replace("const PLANS = '.ai/plans/v<cycle>/<owner>'", "const PLANS = '.ai/plans/v0.8.x/anindosarker'")
    s = s.replace("const INTEGRATION = '<integration branch>'", "const INTEGRATION = 'claude/review'")
    s = s.replace("const RELEASE_LABEL = '<release label>'", "const RELEASE_LABEL = 'release:minor'")
    s = s.replace("const RELEASE_PREFIX = 'v<cycle>'", "const RELEASE_PREFIX = 'v0.8'")
    s = s.replace("const RELEASE_SPEC = `${PLANS}/specs/<release spec>.md`", "const RELEASE_SPEC = `${PLANS}/specs/07-release.md`")
    s = s.replace("const RUN_SPEC_CHECK = true, RUN_REVIEW = true, RUN_VERIFY = true, RUN_JUDGES = true, RUN_MERGE = true, RUN_GATE = true, RUN_RELEASE = true",
                  "const RUN_SPEC_CHECK = true, RUN_REVIEW = true, RUN_VERIFY = true, RUN_JUDGES = true, RUN_MERGE = false, RUN_GATE = false, RUN_RELEASE = false")
    s = s.replace("const SERIAL_GATES = false", "const SERIAL_GATES = true")
    # SPECS block
    specs_re = re.compile(r"const SPECS = \[\n.*?\n\]\n", re.S)
    entry = (f"const SPECS = [\n  {{ id: '{st['id']}', specs: ['{st['plan'].split('/')[1].split('-')[0]}'], wt: '{st['wt']}', branch: '{st['branch']}', "
             f"plan: `${{PLANS}}/{st['plan']}`, tracker: `${{PLANS}}/{st['tracker']}`, title: '{st['title']}', review: {repr(st['review']) if st['review'] else 'null'}, judged: null }},\n]\n")
    s, n = specs_re.subn(entry, s, count=1); assert n == 1
    s = s.replace("const BASE_SHA = '<sha of origin/INTEGRATION the branch started from>'", f"const BASE_SHA = '{BASE_SHA}'")
    spec_re = re.compile(r"const SPECIFICS = \{\n  'NN': `Spec NN specifics: \.\.\.`,\n\}")
    specifics = st['specifics'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    s, n = spec_re.subn("const SPECIFICS = {\n  '" + st['id'] + "': `" + specifics + "`,\n}", s, count=1); assert n == 1
    s = s.replace("${PLANS}/<cycle>-plan.md", "${PLANS}/v0.8.x-plan.md")
    # the build prompt's parallel-gates sentence contradicts P4 on this machine
    s = s.replace("Slow gates run in parallel, not one after another: per-base gates on separate ports at once, builds at once, test runs at once.",
                  "The machine is loaded (P4): per-base gates one base after another, never two long gates at once.")
    s = s.replace("in parallel where independent, and record them. The long gates (pages check, Storybook build, browser tests per base) run here once, every base concurrently, never per milestone.",
                  "one after another (P4, loaded machine), and record them. The long gates (pages check, Storybook build, browser tests per base) run here once, one base after another, never per milestone.")
    out = OUT / f"v0.8-s6-{key}.js"
    out.write_text(s)
    print(out)

KEYS = sys.argv[2].split(',') if len(sys.argv) > 2 else list(STORIES)
for k in KEYS:
    gen(k, STORIES[k])
