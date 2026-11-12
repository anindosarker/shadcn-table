---

kanban-plugin: basic

---

## Open

- [ ] **LQ7** The examples list is hard to get through because the groups collapse #owner
	- Owner, 2026-11-13, from screen recordings of real users: collapsed groups in the Examples sidebar hide the pages. The group labels (L8: small, flush left) stay as plain subheaders, but no group collapses, ever; every example page is visible at all times. Guides and API follow the same rule unless decided otherwise.
	- Fix: drop the collapse from `components/sidebar-subgroup.tsx` (or render groups through the stock fumadocs separator, which has no collapse), keep the label style, no chevron.
- [ ] **LQ8** Keep the live examples stack or replace the landing with a card grid #lead
	- The stack (L2, L3, L4, L6) is SEO-neutral: search ranks the single pages; hash positions are not indexed; a crawler sees the intro, the titles and descriptions and 3 example bodies that duplicate 3 single pages. `perf-report.md` is still red on the stack (CLS 1.10, 19,383 nodes, 1.4 s clicks after a full scroll) and L6 virtualization is unbuilt. With L12 the stack grows from 42 to 121 blocks.
	- Options posted 2026-11-10: a card grid with a static capture per example (recommended; supersedes L2, L3, L4, L6, makes L5 unnecessary); finish the stack (L6, measured skeleton heights, block titles linking to their pages); stack the 42 docs examples only and cards for the 79 story pages.
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
