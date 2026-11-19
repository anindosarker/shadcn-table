# Brief: docs header version label (Q136, D147)

Owner wants to see it locally in `wt2`. A demo round, not a milestone: no tracker, no merge.

## What

- D147 (`decisions.md`): the docs header shows the current version right after the library name, top left: `// shadcn-table v0.9.5`.
- Small muted mono text in the style of the section tab labels (`apps/shadcn-table-docs/components/section-tabs.tsx`), no box, visible on mobile.
- Read from `packages/shadcn-table/package.json` at build time, never hard-coded; reuse a place that already reads the version when one exists.
- A link to the GitHub releases page (the repo URL the header's GitHub icon uses, plus `/releases`); a separate anchor beside the logo's home link.
- Stock Tailwind, no new dependency, no refactor.

## Where

- Branch `v0.9/docs-version-label`, already created from `origin/claude/review` in pool worktree `09` (no edits yet, not pushed).
- Checks: types:check and lint of the docs app only. No build, no test suite.
- Commit and push the branch. Do not merge it.

## Preview

- The owner previews in `wt2` (detached at `8cd198f4`, clean). The owner asked for it there: `git -C ../shadcn-react-table.worktrees/wt2 switch --detach origin/v0.9/docs-version-label`. No install, build or process kill in `wt2`; when the lockfile differs from `8cd198f4`, say so in the report and leave the install to the owner.
- Report to the lead by `SendMessage`: commit id, the label's file:line, check results, lockfile difference yes or no.

This work never delays PR 140 or the 0.9.6 release steps.
