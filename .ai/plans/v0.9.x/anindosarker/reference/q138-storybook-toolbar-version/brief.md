# Brief: Storybook version in the toolbar (Q138, D150)

D150 supersedes D148 and ships in 0.9.7. The owner said it goes into the current release, so release 0.9.7 (spec 69, PR 141) waits for it. A deliberate deviation from "an epic never gains a decision after go": the owner asked for it in this release.

## What

- D150 (`decisions.md`): the Storybook toolbar shows `v<version>` as its own item right after the base switcher, on the three bases.
- Same stock mechanism as the base switcher (`packages/shadcn-table/.storybook/base-tool.ts`, `types.TOOL`); the version from the `__ST_VERSION__` define spec 68 added.
- A link to the GitHub releases page, as the docs header label (D147).
- The sidebar title goes back to `shadcn-table (<base>)`; the spec 68 check `manager title version` is rewritten to read the toolbar item and to assert the title has no version. It fails first on the current code (P11).
- Reference: the owner's screenshot marks the spot, right of the `Radix UI` switcher.

## How

- A new milestone of spec 69 (`plan/new_fix.py`, cites Q138), merged into `claude/review` before the release goes on; then the fast-forward of `dev` again and the PR run again.
- PR 141 must not merge before that: take auto-merge off now, put it back after the fast-forward.
- PR 141 is red today on `Storybook Tests (radix)`: yours to fix as usual; no need to chase it before the fast-forward if the new push reruns it.
- Spec 69's live checks: the Storybook check reads the toolbar item `v0.9.7`, not the title.
