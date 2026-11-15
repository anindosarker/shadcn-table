---

kanban-plugin: basic

---

## Open

- [ ] **LQ21** Visitors get confused by the detail panel example because some rows cannot expand #owner
	- Owner, 2026-11-13, from a screen recording: on `/docs/examples/detail-panel` rows 3 and 5 show a greyed expand chevron that does nothing; nothing on the page says those rows are deliberately disabled, so the visitor thinks the feature is broken. The example text needs to say which rows cannot expand and why, and the table needs a visible cue on those rows (a tooltip on the disabled chevron, or a muted row with a short note).
	- Fact, 2026-11-13: the page renders `examples/<base>/enable-detail-panel-conditionally/TS.tsx` (same in base, radix, aria), where `renderDetailPanel: ({ row }) => row.original.address ? (...) : null` (TS.tsx:61-69) returns null for Ervin (row 3) and Branson (row 5), which have no `address` in `makeData.ts`; the default `getRowCanExpand` then marks them not expandable (`registry/base/.../hooks/useST_TableOptions.ts:228`), and the example's `stExpandButtonProps` (TS.tsx:50-58) forces a `rotate(-90deg)` style so disabled and collapsed chevrons look the same. The MDX already says it once, at the end of the intro paragraph (`content/docs/examples/detail-panel.mdx:7`): "In this example, the panel renders only for rows that have an address, so the expand button is disabled on rows without one." In the library, `registry/<base>/.../buttons/ST_ExpandButton.tsx` renders a disabled row as `disabled={!canExpand && !detailPanel}` (base and radix :87; aria `isDisabled` :86) with the tooltip switched off (`disableHoverListener`, :78) and no title or explanation, so the greyed chevron gives no reason on hover. Storybook `stories/features/DetailPanel.stories.tsx` shows disabled rows in `DetailPanelEnabledConditional` (:193), `DetailPanelEnabledConditionalHide` (:240, hides the button instead) and `ConditionalPanelDisablesEmptyRow` (:665, play test), none with a description.
- [ ] **LQ22** First-time visitors land on Guides and see no example #owner
	- Owner, 2026-11-16, from PostHog screen recordings: visitors get sent to the Guides pages, likely from the home page, and a guide does not show an example right away, so a first-time visitor is confused. The guides need to show or point to examples.
	- Fact, 2026-11-16 (wt1 `a8cca4d4`): 11 of the 12 home feature tiles link to a guide (`components/dev-home/shared/outline-tiles.tsx:50-138`, link at `:930`); only Export goes to an example. "All feature guides" (`components/dev-home/v12/home-page.tsx:127`), the top bar and the footer go to `/docs/guides`. The main buttons go to install and `/docs/examples` (`home-page.tsx:55-62`).
	- Fact: the Guides overview (`content/docs/guides/index.mdx`) is a title and one sentence; no links, no table.
	- Fact: 46 guide pages. 40 embed a live example, first at about line 83 of the body (median), after 5 to 6 headings, mostly under a "Demo" heading near the end; 6 have code blocks only (accessibility, best-practices, column-size, full-screen-toggle, table-event-listeners, tanstack-table-with-shadcn-ui). 27 guides have a matching example page, 19 do not.
	- Fact: a guide embeds a table with a bare tag such as `<EnableStickyHeaderExample />` (`examples/map.tsx`, `components/mdx/example-snippet.tsx:12-14`), the same tag the example page uses; moving it up needs no new component.
	- Fact: `usage.mdx:184` links `/docs/guides#fundamentals` and `#feature-guides`; neither anchor exists.
- [ ] **LQ23** An example page does not say what the visitor is looking at #owner
	- Owner, 2026-11-16, from PostHog screen recordings: visitors land on an example and try to work out what it is; the page gives too little information. The example descriptions need a rewrite.
- [ ] **LQ24** Visitors try the example table and get lost #owner
	- Owner, 2026-11-16, from PostHog screen recordings: visitors try out the UI of an example and lose their way. Each example needs a step-by-step guide of what to test or check. LQ21 is one case.
	- Owner, 2026-11-16: LQ21 (detail panel, rows that cannot expand) needs no item of its own; the rewritten description and steps must cover it.
- [ ] **LQ6** Content elements still render rounded corners against the square dashed style #lookup
	- Audit of the built HTML after wt1 `5d262205`, 2026-11-10. Still rounded, no reset rule reaches them: fumadocs `Tabs` frame and panel `rounded-xl` (`@fumadocs/base-ui` `dist/components/tabs.js:29,60`, 6 frames on the install page); `CodeBlockTabs` frame (`dist/components/codeblock.js:101`); the agent bar (`components/agent-bar.tsx:105`); the example skeleton frame and bars (`components/example-skeleton.tsx:20,23,27`); the code block copy chip (`codeblock.js:51`). Unconfirmed: prop-table inline code (`components/prop-tables/inline-code.tsx:7`).
	- Already square: code blocks, callouts, footer cards, MDX cards, toolbar groups, tab triggers, sidebar links. Rounded on purpose: the table frame (`ST_TableLayout.tsx:30`) and fumadocs scroll controls.
	- Fix: widen the existing radius-0 rule in the docs `global.css` to those frames; leave the table frame.
- [ ] **LQ4** The filter-variants example blocks the main thread for 6.6 s on mount #lookup
	- In the stack it loads in 7.8 s, the longest task is 6.7 s, of which 6.58 s is forced style and layout inside React render (`perf-report.md`, scroll run). Attribution by timing only; profile the example on its single page first. Likely the example itself, not the stack.
- [ ] **LQ3** Two hand-kept route lists must both be edited for every new page #lead
	- `content/docs/*/meta.json` drives the sidebar; `lib/routes.ts:11` is a second list (examples block :107, Storybook entry :392) feeding `TableOfContentsList`. After wt1 `b9d619f6` the guides and api overviews no longer render that list; `routes.ts` is still read by the component and by the home page.
- [ ] **LQ1** The home footer's Storybook link ignores the selected base #lead
	- `components/dev-home/v12/footer.tsx:40-41` always uses `storybookUrl.radix`; `StorybookLink` (`components/mdx/storybook-link.tsx:24-35`) and the toolbar button (L12) follow the selected base.

## Decided

- [x] **LQ9** Nav order puts Examples third, after API Reference #owner
	- Decision: L1
- [x] **LQ10** The examples landing is a prose list of links; visitors never see a table without clicking #owner
	- Decision: L2
	- Preview accepted on wt1 `e702398d`; performance measured in `perf-report.md`; L6 adds virtualization. Reopened as LQ8.
- [x] **LQ11** A reload or share mid-stack opens the single page, not the stack #owner
	- Decision: L3
- [x] **LQ12** A sidebar click leaves the stack #lead
	- Decision: L4
- [x] **LQ13** Getting back to the top of the stack takes many screens #owner
	- Decision: L5
- [x] **LQ14** Scrolling the stack is poor on every metric #lookup
	- Decision: L6
	- `perf-report.md`: CLS 1.10 during the scroll, 26.2 s blocking, 1,448 ms sort click and 19,383 DOM nodes after a full scroll, 276 MB heap.
- [x] **LQ15** The section switcher's place: header centre, a row under the header, or the sidebar #owner
	- Decision: L7, amended by L10
- [x] **LQ16** Subgroups indented with a guide line, labels too large, section titled "Quick Examples" #owner
	- Decision: L8
- [x] **LQ17** One sidebar for the whole site, three levels deep #owner
	- Decision: L9
	- The per-section change dropped the next link on a section's last page (fixed in wt1 `07b5f1eb`, folded into L9) and the stack's page lookup (fixed in `cd43cf4d`).
- [x] **LQ18** Header looks empty after the section links left it #owner
	- Decision: L10
- [x] **LQ19** Agents restart preview servers the owner stopped #owner
	- Decision: L11
- [x] **LQ20** 594 Storybook stories are reachable only through one link per page #owner
	- Decision: L12
- [x] **LQ8** Keep the live examples stack or replace the landing with a card grid #lead
	- Decision: L13
- [x] **LQ7** The examples list is hard to get through because the groups collapse #owner
	- Owner, 2026-11-13, from screen recordings of real users: collapsed groups in the Examples sidebar hide the pages. The group labels (L8: small, flush left) stay as plain subheaders, but no group collapses, ever; every example page is visible at all times. Guides and API follow the same rule unless decided otherwise.
	- Fix: drop the collapse from `components/sidebar-subgroup.tsx` (or render groups through the stock fumadocs separator, which has no collapse), keep the label style, no chevron.
	- Covered by L9: on the preview each section is a root, so group labels render through the plain separator and never collapse. Owner confirmed on the running preview, 2026-11-16.
- [x] **LQ25** Visitors switch examples through the picker and the sidebar, and the deployed sidebar is poor #owner
	- Owner, 2026-11-16, from PostHog screen recordings: many visitors change example through the quick example picker or the sidebar. The deployed sidebar is worse than the preview one (L8, L9, L10); switching examples through the sidebar must be easy. Related: LQ7.
	- Fact, 2026-11-16: the picker's left and right arrows were removed on the preview by `ae316d45` and restored on owner feedback in wt1 `3f027846`.
	- Covered by L8, L9, L10 and the picker arrows (wt1 `3f027846`). Owner is happy with the preview sidebar, 2026-11-16.

## Later

## Dropped

- [x] **LQ2** The example playground names a "Both" mode it never offers #lead
	- `components/example-playground.tsx:69-70` named Preview, Code and Both while the tab list had two. The toolbar now shows all three (owner's screenshots, 2026-11-10, wt1 after the merge of `claude/review`); nothing to do.

## Autofix

- [x] **LQ5** No next link on the last page of a section after the per-section sidebar #owner
	- Fixed in wt1 `07b5f1eb`: `footerNeighbours` in `lib/page-tree-utils.ts` walks the full tree in L1 order, so prev/next cross sections. Folded into L9.




%% kanban:settings
```
{"kanban-plugin":"basic","lane-width":300,"date-format":"YYYY-MM-DD","time-format":"HH:mm"}
```
%%
