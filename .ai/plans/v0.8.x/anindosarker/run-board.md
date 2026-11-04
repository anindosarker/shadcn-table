# v0.8.x run board

Rewritten by the run session at every boundary. Last update: 2026-11-04 15:15.

## Now

- Round E running: spec 06 docs builder in worktree `02`, milestone 2 of 3 (guides, example, registrations), PR #102, workflow `wf_ed8b103c-176`.
- Next: round S (spec 07 release 0.8.0) launches when spec 06 merges; script written.

## Specs

| Spec | Workstream | Status | Branch / PR | Merged | Notes |
|---|---|---|---|---|---|
| 01 shared surface | F | merged | `v0.8/shared-surface` #97 | `752cc62b` | 40 min lost on demo captures |
| 02 frame and body | A | merged, judged 3/3 | `v0.8/frame-body` #98 | `839a6a6e` | review r2 fixes `c802d041` |
| 03 header, menu, drag | B | merged, judged 3/3 | `v0.8/header-menu-drag` #99 | `8239218c` | story fixes `47ef3f89` |
| 04 toolbar chrome | C | merged, judged 3/3 | `v0.8/toolbar-chrome` #100 | `04c2360e` | aria focus-return fix `7ff5992c`, chip flash `c766390b` |
| 05 defaults and stories | D | merged | `v0.8/defaults-stories` #101 | `7db14760` | F3 to F6 fixed on claude/review first (`304283b4`..`e6db62a9`) |
| 06 docs | E | building | `v0.8/docs` #102 | | milestone 1 done `73ec8c45` |
| 07 release 0.8.0 | S | planned | none | | gate apps, judges, release per P3 |

## Open owner items

- A1 "Row Numbers" casing (kept as built).
- A3 no header hairline between cells at rest (kept as built per D2 addendum and D6).

## Process notes this run

- D40: no Claude-Session line in this run's commits.
- P4: gates one base at a time (machine load). P7: every multi-agent stage is a dynamic Workflow; opus mechanical, fable judgment.
- Usage limit paused the run 04:41 to 10:46; one Fable limit killed seven judgment agents, rerun later.
