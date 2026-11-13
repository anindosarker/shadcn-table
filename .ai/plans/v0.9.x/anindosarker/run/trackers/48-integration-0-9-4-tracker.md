# 48: Release 0.9.4, Integration, tracker

Status: merged (head of claude/review after this commit, equal to dev)
Branch `claude/review` and `dev`, main checkout
Checks:
- Check: precondition, `status/sprints.md` E12 rows 39, 40 (two), 41, 41.1, 41.2, 46, 47, 47.1, 49 all `[x]`; only the three 48 rows open: pass
- Check: master contained, `git merge-base --is-ancestor origin/master origin/claude/review` at 9b34c520: pass
- Check: dev ancestor, `git merge-base --is-ancestor origin/dev origin/claude/review` at 9b34c520 (origin/dev 9378b9f8): pass
- Check: local CI, `pnpm test validate-repo` at 62c9be3d: pass (40 unit tests, registry valid and fresh, tree clean after)
- Check: local CI, `pnpm test lint` at 62c9be3d: pass (0 errors, 9 warnings)
- Check: changelog, `grep -c '^## Unreleased' CHANGELOG.md` at 62c9be3d: 1, pass
- Check: changelog headings, `awk '/^## Unreleased/{p=1;next} p&&/^## /{exit} p' CHANGELOG.md | grep -E '^###+ '` at 62c9be3d: pass; final list: `### Added` (Spec 39 Typed filters wait for you to finish typing), `### Changed` (Spec 45 Filter Mode caption gap, Spec 49 Home hero wording, Fix D91), `### Fixed` (Spec 40 Date filter compare, Spec 40 React Query route dates, Spec 41 Range filter editors fit and accept input, Spec 42 React Aria multi-select filter opens on click, Spec 43 Escape closes the filter editor after a select pick, Spec 44 React Aria select filter chevron, Fix Q76), `### Docs` (Spec 46 Live demo with ten columns, Spec 47 Comparison page)
- Check: fast-forward, `git push origin origin/claude/review:refs/heads/dev` then `git rev-parse origin/dev origin/claude/review`: one sha, the head of this tracker commit (equality verified after the push)

- Task 1 Changelog pass and fast-forward to dev: done (changelog 62c9be3d; dev fast-forwarded to this tracker commit)

## Attention



## Notes

- Changelog pass: blocks reordered to the 1.6.1 order. `### Changed` held a second `#### Spec 40 Date filter compare` block (4eb91071, the spec 40 review fix on ISO date-time strings); 1.6.1 has no Spec 40 under Changed, so its one bullet moved verbatim into the `### Fixed` block of the same name, whose first bullet already states the same behavior. No claim added or dropped. `#### Fix D91` stays under Changed, `#### Fix Q76` under Fixed after the spec blocks; spec 41.2 has no block.
