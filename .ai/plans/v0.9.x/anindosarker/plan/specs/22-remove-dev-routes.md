# 22: Remove the /dev preview routes
- Epic: E9

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

`apps/shadcn-table-docs/app/dev/**` (the homepage variant index `/dev`, the theming previews `/dev/theme` and `/dev/theme/1` to `/dev/theme/9`) is deployed and public on www.shadcn-table.com (200 today) although it is review scaffolding marked `noindex` (`app/dev/layout.tsx:7`). D51 deletes the route folder and every module imported only from it; git history keeps them, and this spec names the commit they can be viewed from. The homepage (`app/(home)/page.tsx:2` imports `components/dev-home/v12/home-page`) and `app/global.css:9` (`@import '../components/dev-home/tokens.css'`) keep `components/dev-home/**`, so only the route files and the theme-demo variants that no non-dev file imports go. The mapping below was verified file by file on `claude/review` `1aea02ec` (2026-11-10).

### 1.2 Goals

- `GET /dev`, `/dev/theme` and `/dev/theme/1` to `/dev/theme/9` return 404 on `next start` (D51).
- No file under `apps/shadcn-table-docs/` outside `.next*` references a `/dev` route: `grep -rnE "['\"\`]/dev(/|['\"\`])|/dev/theme" apps/shadcn-table-docs --include='*.ts' --include='*.tsx' --include='*.mjs' --include='*.css' --exclude-dir=node_modules --exclude-dir='.next*'` prints nothing (D51).
- Every deleted module has no remaining importer: `pnpm --filter shadcn-table-docs types:check` and `lint` green; `pnpm test docs-e2e --base base` green (the homepage and every docs page unchanged).
- The removing commit's parent is recorded in the tracker so the deleted components can be viewed with `git show <parent>:apps/shadcn-table-docs/app/dev/theme/9/page.tsx` (D51).
- Acceptance: programmatic. On a production build served on a P6 port: `curl -s -o /dev/null -w '%{http_code}' localhost:<port>/dev`, `/dev/theme`, `/dev/theme/1`, `/dev/theme/9` each print `404`; `/` prints `200`; the grep of goal 2 prints nothing; `git ls-files apps/shadcn-table-docs/app/dev apps/shadcn-table-docs/components/theme-demo/variants | grep -vE 'whole-app(-site)?\.tsx$'` prints nothing; `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base` green.

### 1.3 Current structure

```
apps/shadcn-table-docs/
├── app/dev/                              ← 14 route files, all deleted
│   ├── layout.tsx                        ← noindex metadata, DevBar shell
│   ├── page.tsx, pages.ts, dev-bar.tsx   ← index of DEV_GROUPS, the bottom bar
│   └── theme/page.tsx, theme/1..9/page.tsx ← each renders one theme-demo variant
├── app/(home)/page.tsx:2                 ← import { HomePage } from '@/components/dev-home/v12/home-page'  (STAYS)
├── app/global.css:8-9                    ← comment "experimental /dev homepages" + @import dev-home/tokens.css (comment edited, import STAYS)
├── components/dev-home/**                ← 23 files; the homepage (v12) and its shared v4/v5/v7 parts  (STAY)
│   ├── v12/home-page.tsx:26,169          ← showVariantsLink prop, only true from app/dev (dead after)
│   ├── v12/footer.tsx:104-108            ← <Link href="/dev">All variants</Link> behind showVariantsLink (dead after)
│   ├── v12/theme-demo.tsx:18,25          ← dynamic import of theme-demo/variants/whole-app (STAYS); comment names /dev/theme/9
│   ├── v4/nav.tsx:14-22                  ← Wordmark with href="/dev/4", Nav(): imported nowhere; only GITHUB_URL (line 4) is imported (v12/footer.tsx:5, v12/nav.tsx:7)
│   ├── tokens.css:3-6                    ← header comment names app/dev and app/dev/layout.tsx
│   └── v12/v12.css:5                     ← comment names app/dev/layout.tsx
└── components/theme-demo/
    ├── demo-themes.ts, fonts.ts, theme-scope.tsx, theme-table.tsx, use-theme-cycle.ts ← imported by whole-app*.tsx (STAY)
    ├── theme-chips.tsx                   ← imported only by variants stage, terminal, tokens (deleted)
    └── variants/
        ├── whole-app.tsx, whole-app-site.tsx ← imported by dev-home/v12/theme-demo.tsx (STAY)
        └── terminal, stage, tokens, grid, matches, matches-app, matches-paste, empty-diff, no-step-3, prompt-diff .tsx ← imported only from app/dev/theme/* (deleted)
```

Outside the docs app: no `/dev` route reference in `test/`, `tools/`, `.github/workflows/`, `package.json` scripts or MDX (grep 2026-11-10). `lib/dev-tsconfig.mjs` is the `next dev` port tsconfig helper, unrelated, stays. No `middleware.ts`.

### 1.4 Target structure

```
apps/shadcn-table-docs/
├── app/(home)/page.tsx                   ← unchanged
├── app/global.css:8                      ← comment: "homepage tokens (components/dev-home), scoped under .dev-home"
├── components/dev-home/
│   ├── v12/home-page.tsx                 ← no showVariantsLink prop; <Footer /> plain
│   ├── v12/footer.tsx                    ← no showVariantsLink prop, no /dev link, Link import dropped if unused
│   ├── v12/theme-demo.tsx:25             ← comment: "The theming demo for the homepage."
│   ├── v4/nav.tsx                        ← GITHUB_URL and NAV_LINKS only; Wordmark and Nav deleted (dead, /dev/4 link)
│   ├── tokens.css:3-6                    ← comment names the homepage, not app/dev
│   └── v12/v12.css:5                     ← comment without app/dev/layout.tsx
└── components/theme-demo/
    ├── demo-themes.ts, fonts.ts, theme-scope.tsx, theme-table.tsx, use-theme-cycle.ts
    └── variants/whole-app.tsx, whole-app-site.tsx
CHANGELOG.md (P9)                         ← #### Spec 22 under ## Unreleased, ### Removed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 22 Remove the /dev preview routes` under `## Unreleased`, `### Removed`: the `/dev` and `/dev/theme/*` preview pages and their components; `## Unreleased` is created above `## 0.9.1 - 2026-11-08` when spec 21 has not added it yet (both sides kept in a conflict).
- The tracker records `Parent: <sha>`, the parent of the first removing commit on the milestone branch, cut from `origin/claude/review` (`1aea02ec` or later).
- No dependency, config or `next.config.mjs` change.

#### 1.6.2 Route removal

Status `refactor` (delete). `git rm -r apps/shadcn-table-docs/app/dev`.

- Deletes the 14 files of 1.3 under `app/dev/`.
- Deletes `components/theme-demo/theme-chips.tsx` and the ten variants `terminal`, `stage`, `tokens`, `grid`, `matches`, `matches-app`, `matches-paste`, `empty-diff`, `no-step-3`, `prompt-diff` (`.tsx`), each verified importer-free after the route deletion (`grep -rn "<name>" apps/shadcn-table-docs/app apps/shadcn-table-docs/components` prints only the file itself).
- Does NOT delete `components/dev-home/**`, `components/theme-demo/{demo-themes.ts,fonts.ts,theme-scope.tsx,theme-table.tsx,use-theme-cycle.ts}`, `components/theme-demo/variants/{whole-app,whole-app-site}.tsx`, `lib/dev-tsconfig.mjs`.
- Does NOT add a redirect for `/dev/*`: the pages were `noindex`, 404 is the decided outcome (D51).

**Operations:**

| Operation | Status | Notes |
| --- | --- | --- |
| `app/dev/**` | delete | 14 files |
| `theme-demo/theme-chips.tsx`, 10 variants | delete | dev-only after the routes go |
| `theme-demo/variants/whole-app*.tsx` | keep | homepage theming demo |

#### 1.6.3 Ride-alongs in owned files (D51, F9-style stale comments)

Status `refactor`; each touches a file this milestone owns anyway, never a comment-only commit.

- `components/dev-home/v12/footer.tsx:104-108`: the `showVariantsLink` prop and the `<Link href="/dev">All variants</Link>` block go; `Link` import removed when nothing else uses it.
- `components/dev-home/v12/home-page.tsx:26,169`: the `showVariantsLink` prop and its JSDoc go; `<Footer />`; the header comment (lines 20-24) drops "and at /dev/12".
- `components/dev-home/v4/nav.tsx`: `Wordmark` (href `/dev/4`) and `Nav` deleted; `GITHUB_URL` and `NAV_LINKS` stay (imported by `v12/footer.tsx:5`, `v12/nav.tsx:7`); unused imports (`Link`, `ArrowUpRightIcon`) dropped.
- Comments: `app/global.css:8` and `app/global.css:461-462` ("the /dev/12 tokens", "so /dev and the home page keep"), `components/dev-home/tokens.css:3-6`, `components/dev-home/v12/v12.css:5`, `components/dev-home/v12/theme-demo.tsx:25` reworded without `app/dev`, `/dev/12` or `/dev/theme/9`; the facts they state about `.dev-home` scoping stay.
- Does NOT restyle, rename or move anything in `dev-home/**`; does NOT touch `demo-themes.ts`, `install.mjs`, `global.css` beyond lines 8 and 461-462 (F9 and F26 belong to E8's first milestone, E8 note).

**Stays unchanged:** `app/(home)/page.tsx`, `app/layout.tsx`, `components/dev-home/v12/{nav,rise-figure,theme-demo}.tsx` apart from the one comment, `components/dev-home/v4/font*`, every docs page.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Remove dev routes

- Files owned: `apps/shadcn-table-docs/app/dev/**`, `apps/shadcn-table-docs/components/theme-demo/theme-chips.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/terminal.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/stage.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/tokens.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/grid.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/matches.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/matches-app.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/matches-paste.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/empty-diff.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/no-step-3.tsx`, `apps/shadcn-table-docs/components/theme-demo/variants/prompt-diff.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/footer.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/home-page.tsx`, `apps/shadcn-table-docs/components/dev-home/v12/theme-demo.tsx`, `apps/shadcn-table-docs/components/dev-home/v4/nav.tsx`, `apps/shadcn-table-docs/components/dev-home/tokens.css`, `apps/shadcn-table-docs/components/dev-home/v12/v12.css`, `apps/shadcn-table-docs/app/global.css`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e --base base`
- Task 1: Record `Parent: $(git rev-parse HEAD)` in the tracker, then `git rm -r app/dev` and the 11 dev-only components (1.6.2); re-verify each is importer-free before removing it. Checks: `pnpm --filter shadcn-table-docs types:check`; the `git ls-files` line of 1.2 prints nothing
- Task 2: Ride-alongs (1.6.3). Checks: the grep of goal 2 prints nothing; `pnpm --filter shadcn-table-docs types:check`; `pnpm --filter shadcn-table-docs lint`
- Task 3: Prove the Acceptance of 1.2 on a production build served on a P6 port; record the four 404 lines and the `/` 200 line in the tracker; stop the server. Checks: the `curl` lines of 1.2
- Task 4: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- `pnpm test docs-e2e --base base` green: the homepage and every docs page unchanged
- `/dev`, `/dev/theme`, `/dev/theme/1`, `/dev/theme/9` 404 on `next start`; `/` 200
- Review: none (deletions and dead-prop removal in the docs app; P7 untouched)
