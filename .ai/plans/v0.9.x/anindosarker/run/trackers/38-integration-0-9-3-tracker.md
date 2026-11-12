# 38: Release 0.9.3, Integration, tracker

Status: merged (head of claude/review after this commit, equal to dev)
Branch `claude/review` and `dev`, main checkout
Checks:
- Check: precondition, `status/sprints.md` rows E11 32 to 37 and the four fix rows (D77, D78, D79, D80) all `[x]`: pass
- Check: master contained, `git merge-base --is-ancestor origin/master origin/claude/review` at 1edf8f15: pass
- Check: local CI, `pnpm test validate-repo` at 1e3bc537: pass (40 unit tests, registry fresh, tree clean after)
- Check: local CI, `pnpm test lint` at 1e3bc537: pass (0 errors, 9 warnings)
- Check: changelog, `grep -c '^## Unreleased' CHANGELOG.md` at 1e3bc537: 1, pass
- Check: changelog headings, `awk '/^## Unreleased/{p=1;next} p&&/^## /{exit} p' CHANGELOG.md | grep -E '^###+ '` at 1e3bc537: pass; final list: `### Added` (Spec 26, Spec 28, Spec 25), `### Changed` (Spec 30 API page payload, Spec 30 Home JavaScript, Spec 33, Spec 34, Spec 35, Spec 36), `### Fixed` (Spec 29, Spec 24, Fix D66 The docs proxy runs only on docs paths, Fix Docs build type check, Fix D77, Fix D79, Fix D80), `### Docs` (Spec 31 Page frame and new pages, Spec 32 Docs wording, Fix D78)
- Check: fast-forward, `git checkout dev && git merge --ff-only origin/claude/review && git push origin dev` then `git rev-parse origin/dev origin/claude/review`: one sha, the head of this tracker commit (equality verified after the push)

- Task 1 Changelog pass and fast-forward to dev: done (changelog 1e3bc537; dev fast-forwarded to this tracker commit)

## Attention



## Notes

- Changelog pass: blocks reordered to the 1.6.1 order; added `#### Fix D66 The docs proxy runs only on docs paths`, `#### Fix Docs build type check` and `#### Fix D79 Docs app drops the unused zod dependency` (no D79 line existed; 1.6.1 gives every fix milestone one `#### Fix` block under `### Fixed`). Kept `#### Fix D77`, `#### Fix D80` (Fixed) and `#### Fix D78` (Docs).
