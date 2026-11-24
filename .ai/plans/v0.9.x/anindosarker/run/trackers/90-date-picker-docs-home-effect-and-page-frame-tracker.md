# 90: Date picker docs home effect and page frame, tracker

Status: running
Branch `date-picker-docs-home-effect-page-frame`, worktree shadcn-date-picker.worktrees/date-picker-docs-home-effect-page-frame, from origin/main 3f20d72 (holds both spec 89 merges, 0d62301 and 3f20d72)
Checks:
- Check: setup, `pnpm install --frozen-lockfile` at 3f20d72: exit 0, pass
- Check: T1 taken files, `diff` of `components/dev-home/v4/starfield.tsx`, `v4/field.ts`, `v12/dune.tsx` against `git show v0.9.8:apps/shadcn-table-docs/<same path>` at 8f114c4: prints nothing for each, pass
- Check: T1 imports resolve, `dune.tsx` imports `@/lib/cn` (app has `lib/cn.ts`) and `@/components/dev-home/v4/field` (taken), `starfield.tsx` imports only `react` types at 8f114c4: pass, no queue card
- Check: T1 style sheets, `diff` of `v4/v4.css`, `v5/v5.css`, `v7/v7.css`, `v12/v12.css` against the table's at v0.9.8 at 8f114c4: prints nothing, no CSS written, pass
- Check: T1 edited lines, `git diff origin/main -- components/dev-home/v12/home-page.tsx components/dev-home/v12/footer.tsx` at 8f114c4: home page gains the Starfield and Dune imports, `<Starfield />` first child of the root div, `<Dune className="v12-field" fps={9} />` first child of the hero section; footer gains the Dune import, `<Dune fps={6} className="v4-footer-dune" />` first child of `<footer>`, root class `v4-footer` (the two border classes and the border colour class leave); nothing else: pass
- Check: T1 types, `pnpm --filter shadcn-date-picker-docs types:check` at 8f114c4: exit 0, pass
- Check: T1 lint, `pnpm --filter shadcn-date-picker-docs lint` at 8f114c4: exit 0, pass
- Check: T2 address list before the move, `pnpm --filter shadcn-date-picker-docs build` then the routes of `.next/prerender-manifest.json` at 8f114c4 (content and routes as origin/main 3f20d72; Task 1 touches only `components/dev-home`): `/`, `/_global-error`, `/_not-found`, `/apple-icon`, `/docs/date`, `/docs/date-time`, `/docs/install`, `/docs/month`, `/docs/props`, `/docs/ranges`, `/docs/time`, `/docs/week`, `/docs/year`, `/icon.svg`, `/version.txt`
- Check: T2 address list after the move, same command at 9b5ccf2: `/`, `/_global-error`, `/_not-found`, `/apple-icon`, `/docs/date`, `/docs/date-time`, `/docs/install`, `/docs/month`, `/docs/props`, `/docs/ranges`, `/docs/time`, `/docs/week`, `/docs/year`, `/icon.svg`, `/version.txt`; `diff` of the two lists prints nothing: pass
- Check: T2 renames, `git diff -M100% --diff-filter=R --stat origin/main -- apps/shadcn-date-picker-docs/content` at 9b5ccf2: the nine pages as renames, 0 insertions, 0 deletions; no relative link between pages existed (`grep` for `](./`, `](../`), none fixed: pass
- Check: T2 meta files, `content/docs/meta.json` pages `(get-started)`, `(pickers)`, `(reference)`, `external:[Changelog](https://github.com/anindosarker/shadcn-date-picker/releases)`, the three separators gone; three folder `meta.json` with `title`, `root: true`, `defaultOpen: true`, `pages` (keys of the table's `getting-started/meta.json`); `prettier --check` at 9b5ccf2: pass
- Check: T2 frame files unchanged, `git diff origin/main --stat -- components/docs-breadcrumb.tsx lib/page-tree-utils.ts components/section-tabs.tsx lib/layout.shared.tsx app/docs/layout.tsx` (app paths) at 9b5ccf2: prints nothing, pass
- Check: T2 build, `pnpm --filter shadcn-date-picker-docs build` at 9b5ccf2: exit 0, pass
- Check: T3 taken files, `diff` of `lib/llms.ts` and `app/llms.mdx/docs/[[...slug]]/route.ts` against the table's at v0.9.8 at f131036: prints nothing for each, pass
- Check: T3 edited lines, every `+` line of `git diff origin/main` on `page.tsx`, `lib/shared.ts`, `lib/source.ts` searched as a whole line in the table's file at v0.9.8 at f131036: all found except three: the `githubUrl` line (segment `apps/shadcn-date-picker-docs/content/docs/`, as 1.6.3), `import { docsContentRoute, docsRoute } from './shared';` (the table's line without `docsImageRoute`, as 1.6.3) and `import { getPageMarkdownUrl, gitConfig, siteName } from '@/lib/shared';` (the table's import without `getPageImageUrl`, which stays out with the image line; prettier puts the three names on one line): pass
- Check: T3 left out, `docsImageRoute`, `getPageImageUrl`, `absoluteMarkdownUrl`, `libraryItem`, `registryRef`, JSON-LD, the more-examples code, `app/llms.txt`, `app/llms-full.txt` absent at f131036: pass
- Check: T3 no proxy, `test ! -e apps/shadcn-date-picker-docs/proxy.ts` at f131036: exit 0, pass
- Check: T3 no package change, `git diff origin/main --stat -- apps/shadcn-date-picker-docs/package.json pnpm-lock.yaml` at f131036: prints nothing, pass
- Check: T3 types, `pnpm --filter shadcn-date-picker-docs types:check` at f131036: exit 0, pass
- Check: T3 lint, `pnpm --filter shadcn-date-picker-docs lint` at f131036: exit 0, pass
- Check: T3 build, `pnpm --filter shadcn-date-picker-docs build` at f131036: exit 0; route `/llms.mdx/docs/[[...slug]]` prerenders the nine `content.md`, pass
- Check: T3 copied text `/docs/install`, `.next/server/app/llms.mdx/docs/install/content.md.body` at f131036: 3546 bytes, the Install, Usage and notes prose, the usage code block and the known-issue list; the install command itself (`<InstallCommand />`, a capitalised JSX element) is dropped: fault, see Attention
- Check: T3 copied text `/docs/date` at f131036: 840 bytes, the value line, the props table, the Storybook line; the demo (`<ExampleSnippet name="date" />`) dropped: pass, the page's subject (value and props) is there
- Check: T3 copied text `/docs/date-time` at f131036: 930 bytes, value line, props table (step, min/max, presets, presentation, popover/dialog props, calendarProps), Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/time` at f131036: 624 bytes, value line, props table, the line on what a time picker does not take, Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/week` at f131036: 831 bytes, value line, props table, Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/month` at f131036: 929 bytes, value line with the range example, props table, Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/year` at f131036: 798 bytes, value line, props table, Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/ranges` at f131036: 834 bytes, the range line, props table, the time range line, Storybook line; demo dropped: pass
- Check: T3 copied text `/docs/props` at f131036: 1650 bytes, the full props table: pass
- Check: T4 server, `pnpm --filter shadcn-date-picker-docs build` (the T3 build) then `next start -p 5350` at f131036; every read below in Playwright chromium, a new context per read group (no storage state, no real profile): noted
- Check: T4 `/` 1440 dark at f131036: star field 72 stars, 1440x900, first child of the root div; hero dune canvas 1440x951, 145606 painted pixels, avg rgb(0,214,136); footer dune 1440x140, 17112 painted; scrollWidth 1440 = clientWidth: pass
- Check: T4 `/` 1440 light at f131036: stars 72; hero dune 144261 painted, avg rgb(74,86,4); footer dune 16475 painted; no overflow: pass
- Check: T4 `/` 390 dark at f131036: stars 72, 390x900; hero dune 390x882, 27837 painted; footer dune 390x140, 2962 painted; scrollWidth 390 = clientWidth: pass
- Check: T4 `/` 390 light at f131036: stars 72; hero dune 27424 painted; footer dune 3073 painted; scrollWidth 390 = clientWidth: pass
- Check: T4 `/no-such-page` footer dune at 1440 and 390, dark and light at f131036: 17914, 16234, 2874, 3078 painted pixels: pass
- Check: T4 preset change, customizer Color preset Default to the second entry (Modern Minimal), no reload (a window marker survives) at f131036: `--dh-accent` oklch(0.765 0.177 163.223) to #3b82f6, hero dune avg rgb(0,214,136) to rgb(48,124,247): pass
- Check: T4 mode change, the light/dark toggle after the preset at f131036: dune avg rgb(48,124,247) to rgb(48,95,182) without a reload: pass
- Check: T4 reduced motion, context `reducedMotion: reduce`, two canvas snapshots 1.5 s apart at f131036: equal, 148133 painted pixels (static); with `no-preference` they differ (animates): pass
- Check: T4 `/docs/install` at 1440 and 390, dark and light at f131036: sidebar Install, Changelog; `// Get Started`; switcher opens with Install; active tab Get Started; previous: none (first page), next: Date: pass
- Check: T4 `/docs/time` at 1440 and 390, dark and light at f131036: sidebar Date, Date and time, Time, Week, Month, Year, Ranges, Changelog; `// Pickers`; switcher lists the seven picker pages; active tab Pickers; previous: Date and time, next: Week: pass
- Check: T4 `/docs/props` at 1440 and 390, dark and light at f131036: sidebar Props, Changelog; `// Props`; switcher with Props; active tab Props; previous: Ranges, next: none (last page): pass
- Check: T4 at 390 the mobile sidebar also holds the GitHub icon link after Changelog (the docs layout's own link, unchanged) at f131036: noted
- Check: T4 Changelog link at f131036: `href` https://github.com/anindosarker/shadcn-date-picker/releases, `target="_blank"`, `rel="noreferrer noopener"`, visible; the table's live Changelog link (www.shadcn-table.com/docs/getting-started/install, fresh context) carries the same `target` and `rel`: pass
- Check: T4 Copy page `/docs/install` at f131036: clipboard 3546 characters, equal to `/llms.mdx/docs/install/content.md`: pass
- Check: T4 Copy page `/docs/date` at f131036: clipboard 840 characters, equal to the route's text: pass
- Check: T4 options menu `/docs/install` at f131036: opens with Open in GitHub, View as Markdown, Scira AI, ChatGPT, Claude, Cursor (stock fumadocs-ui); GitHub entry https://github.com/anindosarker/shadcn-date-picker/blob/main/apps/shadcn-date-picker-docs/content/docs/(get-started)/install.mdx (answers 200 only after the merge, Task 5): pass
- Check: T4 options menu `/docs/date` at f131036: same entries; GitHub entry `.../content/docs/(pickers)/date.mdx`: pass
- Check: T4 `/llms.mdx/docs/<page>/content.md` for install, date, date-time, time, week, month, year, ranges, props at f131036: each 200, `text/markdown; charset=utf-8`: pass
- Check: T4 search, Cmd+K then "Ranges" at f131036: result "Docs Pickers Ranges", click opens `/docs/ranges`: pass
- Check: T4 console at f131036: no error on `/`, the docs pages, the search or Copy page; the only errors are the browser's "Failed to load resource: 404" for the document of `/no-such-page` itself (the address is a 404 by design): pass
- Check: T4 captures at f131036: committed under `reference/q149-calendar-library/docs-site/frame/`, each set beside its table capture with the Read tool, one pair at a time; differences below: pass
- Check: T4 server stopped, `kill 74688`, `lsof -nP -iTCP:5350 -sTCP:LISTEN` at f131036: prints nothing, pass

### Difference list (frame captures beside q179 and q180)

- `frame/picker-home-dark-1440.png` beside `q179/table-home-dark-1440-fresh.png`: same emerald star dots over the page and the same box-glyph dune rising behind the hero bottom. Differences: the picker's dune fills the viewport bottom down to 900 while the table's runs under its live demo from about 660, because the picker hero has no live demo below it (not taken, 1.6.1) and the dune sits at the hero's bottom; hero copy, install command and the two pickers in place of the agent bar (page content, unchanged); header has the base select and no Discord icon (D181).
- `frame/picker-home-light-1440.png` beside `q179/table-home-light-1440.png`: same faint olive dune and grey star dots on white; the same dune-height difference and the same content and header differences as dark.
- `frame/picker-docs-dark-1440.png` beside `q180/table-docs-dark-1440.png`: same frame: tabs with the active section underlined, the section's pages in the sidebar then a CHANGELOG row with the external icon, the breadcrumb Docs > section > page switcher, the Copy page group with the chevron at the right, the `// section` line, title, description rule, On this page. Differences: one page in Get Started against five; the section reads Get Started where the table's folder reads Getting Started (the tab names, 1.6.2); no Discord icon (D181); page content.
- `frame/picker-docs-dark-390.png` beside `q180/table-docs-dark-390.png`: same mobile frame: tabs, the TOC popover row, breadcrumb with the switcher, Copy page group, section line. Differences: the picker's crumb "Install" fits where the table's "Installation" is cut to "Insta"; page content.
- `frame/picker-home-dark-390.png` beside `q180/table-home-dark-390.png`: same side and bottom dune and star dots. Differences: the picker header holds the base select in place of the GitHub and Discord icons (D181, spec 85); dune reaches the viewport bottom (no live demo, as at 1440); content.
- `frame/picker-home-dark-1440-footer.png` and `frame/picker-404-dark-1440-footer.png` beside `frame/table-home-dark-1440-footer.png` (the table live home, scrolled to the bottom, fresh context): the same footer dune off the footer rule, densest at the rule. Differences: the footer keeps the wordmark, licence line, GitHub and Storybook (D181); on the picker home the hero dune runs straight into the footer dune, see Attention.
- `frame/picker-home-dark-1440-preset2.png`: the dune, the accent and the button in blue after the Modern Minimal preset, no reload.

- Task 1 The home effect: done (8f114c4)
- Task 2 The sidebar by section and the Changelog link: done (9b5ccf2)
- Task 3 Copy page: done (f131036)
- Task 4 The local production build read and the captures: done (0bbc1b4ec)
- Task 5 After the merge: the live reads: planned

## Attention

- Copy page on the Install page leaves out the install command, the one line the page is for.
	- `/docs/install` copied text (`/llms.mdx/docs/install/content.md`) at f131036: "Pick your base with the tabs. ..." is followed directly by "The files land in `components/date-picker/`."; the `<InstallCommand />` between them is a capitalised JSX element, which the table's `toPlainMarkdown` drops (`lib/llms.ts:114`). The table's own install page loses its `<AgentPrompt />` and `<InitCommand />` the same way.
	- Spec 90 1.6.3: a queue card with the page and the text, not a change to the taken file. Nearest default kept: the taken `lib/llms.ts` stays byte for byte the table's.
- On the home page the hero dune runs straight into the footer dune, so the two read as one tall band.
	- `frame/picker-home-dark-1440-footer.png`: the picker home is one screen of content, so the hero's bottom dune ends where the footer's dune starts; on the table home a long page (live demo, theming demo, tiles, code strip) sits between them (`frame/table-home-dark-1440-footer.png`). Both are the table's lines as they are (1.6.1).
	- Nearest default kept: the table's lines, no spacing added.
