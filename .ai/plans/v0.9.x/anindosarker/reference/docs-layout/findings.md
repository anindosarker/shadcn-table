# Docs layout findings, v0.9.x

Problems found in the docs site while discussing the restructuring. Numbered `LF<n>`; the epic that fixes one cites it as `(docs-layout LF<n>)`. Paths under `apps/shadcn-table-docs/`.

### LF1 The home footer's Storybook link ignores the selected base

- `components/dev-home/v12/footer.tsx:40-41` always uses `storybookUrl.radix`; `StorybookLink` (`components/mdx/storybook-link.tsx:24-35`) follows the selected base everywhere else.

### LF2 The example playground names a "Both" mode it never offers

- `components/example-playground.tsx:69-70` and the brief say Preview, Code and Both; the tab list at :128 has Preview and Code only.

### LF3 Two hand-kept route lists

- `content/docs/*/meta.json` drives the sidebar; `lib/routes.ts:11` is a second list (examples block :107, Storybook entry :392) feeding `TableOfContentsList` on `examples/index.mdx:10-12`. A new page must be added to both.

### LF4 The `filter-variants` example blocks the main thread for 6.6 s on mount

- In the stack it loads in 7.8 s, the longest task is 6.7 s, of which 6.58 s is forced style and layout inside React render (`perf-report.md`, scroll run). Attribution by timing only; profile the example on its single page first. Likely the example itself, not the stack.

### LF5 No next link on the last page of a section after the per-section sidebar

- With `root: true` per section (item 8 preview, wt1 `11ff81ef`), fumadocs computes the prev/next footer inside the active root, so `/docs/getting-started/agents` shows only "Usage" as previous and no next; before, next was the first page of the following section. Fix: a footer that crosses sections in L1 order (last page of a section links to the next section's first page, first page back to the previous section's last). Seen by the owner on the 5342 preview, 2026-11-10.

### LF6 Content elements still rendering rounded corners against the square dashed style

- Audit of the built HTML (introduction, install, production-ready-tables, api/table-options, examples/basic, guides) after `5d262205`, 2026-11-10. Still rounded, no reset rule reaches them: fumadocs `Tabs` frame and panel `rounded-xl` (`@fumadocs/base-ui` `dist/components/tabs.js:29,60`, 6 frames on the install page); `CodeBlockTabs` frame `rounded-xl` (`dist/components/codeblock.js:101`); the agent bar `rounded-lg` (`components/agent-bar.tsx:105`); the example skeleton frame and bars `rounded-md` / `rounded` (`components/example-skeleton.tsx:20,23,27`); the code block copy chip `rounded-lg` (`codeblock.js:51`). Unconfirmed: prop-table inline code `rounded-md` (`components/prop-tables/inline-code.tsx:7`), probably squared by `global.css:318`.
- Already square: code blocks, callouts, footer cards, MDX cards, toolbar groups, tab triggers, sidebar links. Intentionally rounded: the table frame itself (`ST_TableLayout.tsx:30`, library look) and fumadocs scroll controls.
- Recommended: one pass widening the existing radius-0 rule in the docs `global.css` to the Tabs and CodeBlockTabs frames, the agent bar and the skeleton; leave the table frame.
