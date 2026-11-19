# 68: Version labels
- Epic: E19

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Neither the docs site nor Storybook says which version of the library a reader looks at (Q136, Q137). The docs header gets a version label after the library name (D147), the Storybook sidebar title gets the version before the base name (D148). Both read `packages/shadcn-table/package.json`, the file `version.txt` already reads, so no label is ever typed by hand. One spec and one milestone: two small changes of the same kind and their two checks fit one builder, and the docs half is already built as an owner demo.

### 1.2 Goals

- The docs header reads `// shadcn-table v<version>` top left on every page, phone width included: small muted mono text, no box, a link to the GitHub releases page beside the logo's home link, not inside it (D147).
- The Storybook sidebar title reads `shadcn-table v<version> (<base label>)` on the three bases, for example `shadcn-table v0.9.6 (Base UI)`; the title link is unchanged (D148).
- `<version>` is the `version` field of `packages/shadcn-table/package.json` at build time in both places.
- A docs E2E check and a Storybook Static check read both labels and compare them with that field.
- Acceptance: the owner's demo of the docs label on branch `v0.9/docs-version-label` (`a3d61fe9`, previewed in `wt2`) for D147; for D148 the previous release's title `shadcn-table (Base UI)` on `https://storybook.shadcn-table.com/base/` with ` v<version>` added after the name. Programmatic: the two new checks of 1.6.3 pass on the three bases.

### 1.3 Current structure

```
apps/shadcn-table-docs/components/site-nav.tsx        ← header: logo link `// shadcn-table`, no version
apps/shadcn-table-docs/lib/layout.shared.tsx          ← GITHUB_URL; no version export
apps/shadcn-table-docs/app/version.txt/route.ts:1     ← imports packages/shadcn-table/package.json (the pattern D147 reuses)
packages/shadcn-table/.storybook/main.ts:17,19,52,54  ← Node side: window.__ST_BASE__, __ST_DEV__ scripts in managerHead and previewHead
packages/shadcn-table/.storybook/themes.ts:24,45,48   ← reads those globals; brandTitle = `shadcn-table (${ST_BASE_LABEL})`
test/docs-e2e/lib/getting-started.mjs                 ← header checks (headerBaseLabel, headerBaseMenu); none for a version
test/storybook-static/test.mjs                        ← opens the manager per base; no title check
branch v0.9/docs-version-label                        ← a3d61fe9 (the docs label, types and lint pass), 0bf6b8b0 (a merge of claude/review for the preview); not merged
```

### 1.4 Target structure

```
apps/shadcn-table-docs/lib/layout.shared.tsx    ← + LIBRARY_VERSION = pkg.version (a3d61fe9)
apps/shadcn-table-docs/components/site-nav.tsx  ← + <a href={`${GITHUB_URL}/releases`}>v{LIBRARY_VERSION}</a> beside the logo link (a3d61fe9)
packages/shadcn-table/.storybook/main.ts        ← + window.__ST_VERSION__ script, from package.json, in managerHead and previewHead
packages/shadcn-table/.storybook/themes.ts      ← + ST_VERSION; brandTitle = `shadcn-table v${ST_VERSION} (${ST_BASE_LABEL})`
test/docs-e2e/lib/getting-started.mjs           ← + check `header version`
test/storybook-static/test.mjs                  ← + check `manager title version`
CHANGELOG.md                                    ← + `#### Spec 68` under `## Unreleased`, `### Docs` (P9, shared)
```

### 1.6 Components

#### 1.6.1 Docs header label (D147)

- The feature commit `a3d61fe9` of `origin/v0.9/docs-version-label` is taken over with `git cherry-pick a3d61fe9` on the milestone branch; it is not rebuilt and the merge commit `0bf6b8b0` is not taken. The owner has seen this label: its classes (`shrink-0 font-mono text-xs text-fd-muted-foreground transition-colors hover:text-(--docs-accent)`), its place and its link stay as they are.
- `text-xs` stands in for the section tabs' `text-[11px]`: stock Tailwind, no pixel size.
- Does NOT put the label inside the logo's `Link`, does NOT add a box, a border, a tooltip or a version menu, does NOT hide it at any width, does NOT touch `wt2` or the branch `v0.9/docs-version-label` (the owner previews there).

#### 1.6.2 Storybook title (D148)

- `main.ts` runs in Node: it reads `version` from `packages/shadcn-table/package.json` (`createRequire` or `fs`, as line 27 already resolves a `package.json`) and adds `<script>window.__ST_VERSION__ = "<version>";</script>` to the two head strings, next to `__ST_BASE__` and `__ST_DEV__`. `themes.ts` exports `ST_VERSION` read from that global the way `ST_BASE` and `ST_DEV` are read, and `brandTitle` becomes `` `shadcn-table v${ST_VERSION} (${ST_BASE_LABEL})` ``; the comment above it names the new form.
- The version reaches `themes.ts` through `main.ts` and not through a JSON import in `themes.ts`: that file is bundled for the manager and for the preview, and the build values it uses already arrive this way. D148's intent, the version read from the package file and never typed, is kept.
- Under `storybook dev` the title shows the version too (`managerHead` runs in both modes).
- Does NOT set `brandUrl` or `brandImage`, does NOT change `ST_BASE_LABEL` or the text of `preview.tsx:203`, does NOT edit the `storybook:build` scripts or `version.txt`.

#### 1.6.3 Checks

- `test/docs-e2e/lib/getting-started.mjs`, new check `header version` on the page the header checks already open: the header holds one link whose text is `v` plus the `version` of `packages/shadcn-table/package.json` (read by the test from the file), whose `href` ends in `/releases`, and which is not inside the home link; the same at the phone width the file already uses.
- `test/storybook-static/test.mjs`, new check `manager title version`, once per base on the manager page the Code tab read opens: the sidebar title's text equals `shadcn-table v<version> (<base label>)` with the label from `tools/registry/bases.mjs`.
- Each new check is run once before its change is in place (the docs check on `origin/claude/review`, the title check before Task 2's edit) and must fail there; the failure line goes to the tracker.

**Stays unchanged:** every library file under `packages/shadcn-table/registry/`, `registry.json`, `public/r/` (P7, P9), `app/version.txt/route.ts`, the `storybook:build` scripts, `package.json` and the lockfile (no new dependency).

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Version labels

- Files owned: `apps/shadcn-table-docs/components/site-nav.tsx`, `apps/shadcn-table-docs/lib/layout.shared.tsx`, `packages/shadcn-table/.storybook/main.ts`, `packages/shadcn-table/.storybook/themes.ts`, `test/docs-e2e/lib/getting-started.mjs`, `test/storybook-static/test.mjs`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck`, `pnpm test lint`, `pnpm test validate-repo`, `pnpm test docs-e2e`, `pnpm test storybook-static`, the last three one at a time (P5)
- Task 1: The docs check `header version` (1.6.3), run red on `origin/claude/review`; then `git cherry-pick a3d61fe9` (1.6.1). Checks: the red line in the tracker; `pnpm test docs-e2e --base base`, `--base radix`, `--base aria` green with `header version` in the passed list; `git diff a3d61fe9 HEAD -- apps/shadcn-table-docs/components/site-nav.tsx apps/shadcn-table-docs/lib/layout.shared.tsx` prints nothing
- Task 2: The title check `manager title version` (1.6.3), run red; then `__ST_VERSION__` in `main.ts` and the new `brandTitle` in `themes.ts` (1.6.2). Checks: the red line in the tracker; `pnpm test typecheck --base base`, `--base radix`, `--base aria` green; `pnpm test storybook-static --base base`, `--base radix`, `--base aria` green with `manager title version` in the passed list
- Task 3: The changelog block `#### Spec 68` under `## Unreleased`, `### Docs`: one line for the docs header label, one for the Storybook title (P9). Checks: `pnpm test lint` and `pnpm test validate-repo` green; `grep -c '^#### Spec 68' CHANGELOG.md` prints `1`

### 2.2 Checks

- Version labels: typecheck, lint, validate-repo, docs-e2e and storybook-static green on the three bases; both new checks recorded red before their change (1.6.3)
- Review: none (two display strings, no public API, no shared state)
- Worktrees from the pool 01 to 09 only; the root checkout, `wt1` and `wt2` are never used for a checkout, an install or a build (P2); heavy checks one at a time (P5)
