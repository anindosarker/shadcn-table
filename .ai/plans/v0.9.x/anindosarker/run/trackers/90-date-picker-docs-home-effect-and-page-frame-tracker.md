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

- Task 1 The home effect: done (8f114c4)
- Task 2 The sidebar by section and the Changelog link: done (9b5ccf2)
- Task 3 Copy page: done (f131036)
- Task 4 The local production build read and the captures: planned
- Task 5 After the merge: the live reads: planned

## Attention

- Copy page on the Install page leaves out the install command, the one line the page is for.
	- `/docs/install` copied text (`/llms.mdx/docs/install/content.md`) at f131036: "Pick your base with the tabs. ..." is followed directly by "The files land in `components/date-picker/`."; the `<InstallCommand />` between them is a capitalised JSX element, which the table's `toPlainMarkdown` drops (`lib/llms.ts:114`). The table's own install page loses its `<AgentPrompt />` and `<InitCommand />` the same way.
	- Spec 90 1.6.3: a queue card with the page and the text, not a change to the taken file. Nearest default kept: the taken `lib/llms.ts` stays byte for byte the table's.
