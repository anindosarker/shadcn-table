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

- Task 1 The home effect: done (8f114c4)
- Task 2 The sidebar by section and the Changelog link: done (9b5ccf2)
- Task 3 Copy page: planned
- Task 4 The local production build read and the captures: planned
- Task 5 After the merge: the live reads: planned
