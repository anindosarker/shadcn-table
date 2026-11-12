# 36: validate-repo fails on a stale generated registry
- Epic: E11

Follow the project planning rules: docs/code-of-conduct/planning-guidelines.md, CLAUDE.md:9. Keep the expedition contract.

## 1. Architecture

### 1.1 Overview

Some tracked files are written by generators: `apps/shadcn-table-docs/registry.json` by `pnpm -w registry:items` (`tools/registry/examples.mjs`), `packages/shadcn-table/registry.json` by `pnpm -w registry:build` (`tools/registry/build.mjs`), and the lists the generators keep beside them. Nothing fails when a change edits a generator's input and does not commit its output: spec 31 rewrote the example descriptions without owning `registry.json`, and the owner's next local build left a 252-line diff (Q36, fixed by hand in cc199f5a). D68 adds a step to `pnpm test validate-repo`, which CI already runs (`.github/workflows/pr.yml:136`), that runs the generators and fails when a tracked output changes, and a planning rule so the milestone that edits the inputs owns the outputs.

### 1.2 Goals

- `pnpm test validate-repo` fails, naming the file, when a tracked generator output differs from what the generators write (D68).
- It passes on a tree where the outputs are fresh, twice in a row (the generators are deterministic) (D68).
- `pr.yml` runs the step with no workflow change, through its existing `pnpm test validate-repo --ci` line (D68).
- The planning guidelines say that a milestone editing example descriptions or registry sources owns the generated outputs (D68).
- Acceptance: programmatic. On the milestone branch: `pnpm test validate-repo` passes and its summary line contains `registry fresh`; run again, it passes again and `git status --short` prints nothing. Then the failing case, recorded in the tracker and reverted: change one word of a `description` in `apps/shadcn-table-docs/content/docs/examples/basic.mdx` without regenerating; `pnpm test validate-repo` exits non-zero and its errors name `apps/shadcn-table-docs/registry.json`; `git checkout -- apps/shadcn-table-docs` restores the tree; `pnpm test validate-repo` passes. `node --test "test/validate-repo/**/*.test.mjs"` (or the suite's existing unit entry) covers the new check's pure part when it has one.

### 1.3 Current structure

```
test/validate-repo/test.mjs                ← five steps in order: bases-identical, icon-maps, tailwind-classes, registry-valid, unit; summary "bases identical, icon maps complete, tailwind valid, registry valid, <n> unit tests"
test/validate-repo/lib/registry-valid.mjs  ← validates the registry files as they are on disk
test/validate-repo/run.mjs:7-10            ← the `--changed` path list (packages/shadcn-table/registry/**, registry.json, apps/shadcn-table-docs/examples/**, ...)
package.json:18-20                         ← registry:build, registry:items, registry:hosted
tools/registry/build.mjs:29,87             ← writes packages/shadcn-table/registry.json, then `shadcn build` writes public/r (git-ignored)
tools/registry/examples.mjs:69,237,245     ← writes apps/shadcn-table-docs/registry.json and the examples-<base>-diff.json lists
tools/registry/hosted.mjs                  ← writes apps/shadcn-table-docs/public/r/<base>/ (git-ignored)
.github/workflows/pr.yml:121-136           ← job validate-repo: pnpm install --frozen-lockfile, pnpm test validate-repo --ci
docs/code-of-conduct/planning-guidelines.md ← the project planning rules
```

Tracked generator outputs today (`git ls-files`): `apps/shadcn-table-docs/registry.json`, `packages/shadcn-table/registry.json`, `tools/registry/examples-aria-diff.json`, `tools/registry/examples-base-diff.json`; the root `registry.json` is tracked too.

### 1.4 Target structure

```
test/validate-repo/lib/registry-fresh.mjs  ← new: runs the generators, returns one problem per tracked output that changed
test/validate-repo/test.mjs                ← sixth step `registry-fresh` after `registry-valid`; summary gains "registry fresh"
test/validate-repo/run.mjs                 ← the `--changed` list gains the generators' inputs it lacks (apps/shadcn-table-docs/content/docs/examples/**, tools/registry/**)
docs/code-of-conduct/planning-guidelines.md ← one rule: generated tracked outputs are owned with their inputs
CHANGELOG.md (P9)                          ← #### Spec 36 under ## Unreleased, ### Changed
```

### 1.5 Flow: none

### 1.6 Components

#### 1.6.1 Data artifacts

- `CHANGELOG.md` (P9): `#### Spec 36 validate-repo fails on a stale generated registry` under `## Unreleased`, `### Changed`: the repository check regenerates the registries and fails on a diff (D68).
- `docs/code-of-conduct/planning-guidelines.md`: one sentence in the section on milestones and owned files: a milestone that edits a registry source or an example page's `description` lists the generated outputs (`apps/shadcn-table-docs/registry.json`, `packages/shadcn-table/registry.json`, the `examples-<base>-diff.json` lists) in its `Files owned` and regenerates them (D68).

#### 1.6.2 The check (D68)

`test/validate-repo/lib/registry-fresh.mjs`, status `new`; `test/validate-repo/test.mjs`, status `refactor`.

- `check(log, root)`: runs `pnpm -w registry:build`, `pnpm -w registry:items`, `pnpm -w registry:hosted` in that order (the order of the docs `build` script), then `git diff --name-only --` over the tracked outputs. The list of outputs is derived, not typed: every tracked file under the repository that a generator wrote in this run (compare `git status --porcelain` before and after, restricted to tracked files), so a new generated file is covered without editing the check. Each changed file is one problem: `<path> is stale: run pnpm -w registry:build && pnpm -w registry:items and commit the result`.
- A dirty tree before the run (a tracked generator output already modified) is reported the same way and the generators still run; the check never resets or stashes anything (P2), so after a failure the regenerated files are in the working tree, ready to commit.
- `test.mjs`: the step runs after `registry-valid`, named `registry-fresh`, ok text `registry fresh`; the header comment and the summary comment list six checks.
- If a generator is not deterministic (two runs on the same input differ), that generator is fixed in this milestone (stable key order, no timestamps) and `tools/registry/<file>` joins the owned files; the tracker names what was not deterministic.
- Does NOT change `registry-valid.mjs`, the generators' output format, `pr.yml` (the job already runs the test), or what `pnpm test --changed` means beyond the added paths.

**Stays unchanged:** `.github/workflows/*.yml`, `package.json`, the registry files' content, `test/run.mjs`.

### 1.7 Dependencies and env: none

## 2. Instructions for AI

### 2.1 Milestones

### Milestone: Registry fresh check

- Files owned: `test/validate-repo/lib/registry-fresh.mjs`, `test/validate-repo/test.mjs`, `test/validate-repo/run.mjs`, `docs/code-of-conduct/planning-guidelines.md`
- Depends on: none
- Review: none
- Local CI: `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo`
- Task 1: Prove the generators are deterministic: run the three twice on a clean tree, `git status --short` empty after each; fix a generator that is not (1.6.2). Checks: both `git status --short` outputs in the tracker
- Task 2: The check and its wiring (1.6.2), the planning rule (1.6.1). Checks: `pnpm test validate-repo` passes with `registry fresh` in the summary; `pnpm test lint`
- Task 3: Prove the Acceptance of 1.2: the passing runs, the failing case with its error line, the restore. Checks: the lines of 1.2; `act pull_request -W .github/workflows/pr.yml -j validate-repo` green (P3: the job's behaviour changes although the workflow file does not; a stopped Docker daemon is started by the agent)
- Task 4: Cleanup: `pnpm format`, the changelog block (1.6.1). Checks: 2.2

### 2.2 Checks

- `pnpm test typecheck --base base`, `pnpm test lint`, `pnpm test validate-repo` green
- The failing case of 1.2 recorded with its error line
- The `validate-repo` job green under `act`
- Review: none (one test step; P7 untouched: the registries' content does not change)
