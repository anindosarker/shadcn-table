# Brief: version label on the home page header (Q141)

Owner demo, to look at locally before anything ships. Not recorded as a decision yet: no tracker, no merge, no release.

## What

- The home page (`/`) has its own header (`header.v4-nav`); it gets the same version label the docs header has since D147: after the library name, same text (`v<version>`), same link (GitHub releases), same source (`LIBRARY_VERSION` in `apps/shadcn-table-docs/lib/layout.shared.tsx`).
- Styled to sit in the home header as the docs label sits in the docs header: muted mono, no box, visible at phone width. Reuse the docs label's element when the two headers can share it without a refactor; else the same classes.
- Stock Tailwind, no new dependency.

## Where

- Branch `v0.9/home-version-label` from `origin/claude/review`, in a free pool worktree.
- Checks: types:check and lint of the docs app only. No build, no test suite.
- Commit and push the branch. Do not merge it.

## Preview

- The owner previews in `wt2`: `git -C ../shadcn-react-table.worktrees/wt2 switch --detach origin/v0.9/home-version-label`, only when `wt2` is clean. No install, build or process kill there; a lockfile difference from its current head is reported, the install left to the owner.
- Report to the lead by `SendMessage`: commit id, the label's file:line, check results, lockfile difference yes or no, and how it looks at phone width (one line).
