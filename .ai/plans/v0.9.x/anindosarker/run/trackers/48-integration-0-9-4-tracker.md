# 48: Release 0.9.4, Integration, tracker

Status: running
Branch `claude/review` and `dev`, main checkout
Checks:
- Check: precondition, `status/sprints.md` E12 rows 39, 40 (two), 41, 41.1, 41.2, 46, 47, 47.1, 49 all `[x]`; only the three 48 rows open: pass
- Check: master contained, `git merge-base --is-ancestor origin/master origin/claude/review` at 9b34c520: pass
- Check: dev ancestor, `git merge-base --is-ancestor origin/dev origin/claude/review` at 9b34c520 (origin/dev 9378b9f8): pass

- Task 1 Changelog pass and fast-forward to dev: running

## Attention



## Notes

- Changelog pass: blocks reordered to the 1.6.1 order. `### Changed` held a second `#### Spec 40 Date filter compare` block (4eb91071, the spec 40 review fix on ISO date-time strings); 1.6.1 has no Spec 40 under Changed, so its one bullet moved verbatim into the `### Fixed` block of the same name, whose first bullet already states the same behavior. No claim added or dropped. `#### Fix D91` stays under Changed, `#### Fix Q76` under Fixed after the spec blocks; spec 41.2 has no block.
