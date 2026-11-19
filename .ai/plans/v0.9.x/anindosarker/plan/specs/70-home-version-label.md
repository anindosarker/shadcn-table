# 70: Home page version label
- Epic: E20

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

The docs header shows the library version since 0.9.7 (D147), but the home page has its own header and shows none (Q141). The home page header gets the same label (D152). The change is already built as an owner demo and the owner said "looks good", so this spec takes that commit over and adds the check that keeps it there. One spec and one milestone: one component and one check file.

### 1.2 Goals

- The home page header reads `// shadcn-table v<version>` top left: the same text, link and source as the docs header label, in the home header's own muted and accent colours (D152).
- Every page that renders that header shows the label, the 404 page included (D152).
- `<version>` is `LIBRARY_VERSION` of `apps/shadcn-table-docs/lib/layout.shared.tsx`, which reads `packages/shadcn-table/package.json`; nothing is typed by hand.
- A docs E2E check reads the label on `/` and on a missing address, at the page's width and at 390.
- Acceptance: the owner's demo on branch `v0.9/home-version-label` (`93405e6e`, previewed in `wt2`). Programmatic: the new checks of 1.6.2 pass on the three bases.

### 1.3 Current structure

```
apps/shadcn-table-docs/components/dev-home/v12/nav.tsx:32  ← <header class="v4-nav">: logo link `// shadcn-table`, section links, actions; no version
apps/shadcn-table-docs/lib/layout.shared.tsx               ← GITHUB_URL, LIBRARY_VERSION (spec 68)
apps/shadcn-table-docs/components/site-nav.tsx:42          ← the docs label (D147), the pattern D152 repeats
test/docs-e2e/lib/getting-started.mjs:102                  ← headerVersion(page, check): reads `#nd-subnav a`, called at :1599 on the install page only
test/docs-e2e/lib/getting-started.mjs:979                  ← the checks of `/`
test/docs-e2e/lib/site.mjs:85                              ← notFoundPage: the checks of `/nope`
branch v0.9/home-version-label                             ← 93405e6e (nav.tsx only, types and lint pass); not merged
```

### 1.4 Target structure

```
apps/shadcn-table-docs/components/dev-home/v12/nav.tsx  ← + <a href={`${GITHUB_URL}/releases`}>v{LIBRARY_VERSION}</a> beside the logo link (93405e6e)
test/docs-e2e/lib/getting-started.mjs                   ← headerVersion takes the header's selector; + `home header version` on `/`
test/docs-e2e/lib/site.mjs                              ← + `404: header version` on `/nope`
CHANGELOG.md                                            ← + `#### Spec 70` under `## Unreleased`, `### Docs` (P9, shared)
```

### 1.6 Components

#### 1.6.1 Home header label (D152)

- The commit `93405e6e` of `origin/v0.9/home-version-label` is taken over with `git cherry-pick 93405e6e` on the milestone branch; it is not rebuilt. The owner has seen this label: its classes (`shrink-0 font-mono text-xs text-(--dh-ink-muted) transition-colors hover:text-(--dh-accent)`), its place right after the name and its link stay as they are.
- The label is its own anchor beside the home link, as in the docs header.
- Does NOT change the docs label in `site-nav.tsx`, does NOT merge the two headers into one component, does NOT add a box, a tooltip, a new-tab target or a version menu, does NOT hide the label at any width, does NOT touch `wt2` or the branch `v0.9/home-version-label` (the owner previews there).

#### 1.6.2 Checks

- `headerVersion` in `test/docs-e2e/lib/getting-started.mjs` takes the header's selector as an argument (`#nd-subnav` stays the default for its present call) and is exported; the check names carry a prefix the caller passes. No second copy of its body.
- `/` in `getting-started.mjs`: `home header version` and `home header version at 390`, read inside `header.v4-nav`: one visible link whose text is `v` plus the package version, whose `href` ends in `/releases`, not inside the home link.
- `/nope` in `test/docs-e2e/lib/site.mjs`, inside `notFoundPage`: `404: header version`, the same read on the header that page renders. The builder reads which header the 404 page renders before writing the selector; the runner's read at `93405e6e` is that it shares the home header.
- The new checks are run once on `origin/claude/review` before the cherry-pick and must fail there; the failure lines go to the tracker (P11).

**Stays unchanged:** `site-nav.tsx`, `layout.shared.tsx`, every file under `packages/`, `registry.json`, `public/r/` (P7, P9), `package.json` and the lockfile.

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Home page version label

- Files owned: `apps/shadcn-table-docs/components/dev-home/v12/nav.tsx`, `test/docs-e2e/lib/getting-started.mjs`, `test/docs-e2e/lib/site.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base radix`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e`, the last two one at a time (P5)
- Task 1: The checks of 1.6.2, run red on `origin/claude/review`; then `git cherry-pick 93405e6e` (1.6.1). Checks: the red lines in the tracker; `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` green with `home header version`, `home header version at 390` and `404: header version` in the passed list, and `header version` of spec 68 still passed; `git diff 93405e6e HEAD -- apps/shadcn-table-docs/components/dev-home/v12/nav.tsx` prints nothing
- Task 2: The changelog block `#### Spec 70` under `## Unreleased`, `### Docs`: one line for the home page label (P9). Checks: `pnpm test typecheck --base radix`, `pnpm test lint` and `pnpm test validate-repo` green; `grep -c '^#### Spec 70' CHANGELOG.md` prints `1`

### 2.2 Checks

- Home page version label: typecheck (radix, which covers the docs app), lint, validate-repo green; docs-e2e green on the three bases; the new checks recorded red before the cherry-pick (1.6.2)
- Review: none (one display string, no public API, no shared state)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
