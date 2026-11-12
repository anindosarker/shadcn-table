# 38: Release 0.9.3, Integration, tracker

Status: running
Branch `claude/review` and `dev`, main checkout
Checks:
- Check: precondition, `status/sprints.md` rows E11 32 to 37 and the four fix rows (D77, D78, D79, D80) all `[x]`: pass
- Check: master contained, `git merge-base --is-ancestor origin/master origin/claude/review` at 1edf8f15: pass

- Task 1 Changelog pass and fast-forward to dev: running

## Attention



## Notes

- Changelog pass: blocks reordered to the 1.6.1 order; added `#### Fix D66 The docs proxy runs only on docs paths`, `#### Fix Docs build type check` and `#### Fix D79 Docs app drops the unused zod dependency` (no D79 line existed; 1.6.1 gives every fix milestone one `#### Fix` block under `### Fixed`). Kept `#### Fix D77`, `#### Fix D80` (Fixed) and `#### Fix D78` (Docs).
