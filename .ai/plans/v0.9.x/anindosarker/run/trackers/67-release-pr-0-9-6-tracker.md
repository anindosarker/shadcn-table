# 67: Release 0.9.6, Release PR 0.9.6, tracker

Status: running
Branch `dev`, no worktree (operations only)
Checks:
- Check: PR opened, `gh pr create --base master --head dev --title "release: 0.9.6" --label release:patch` at 020465a0: PR 140, https://github.com/anindosarker/shadcn-table/pull/140
- Check: Task 1, `gh pr view 140 --json labels,autoMergeRequest` at 020465a0: `["release:patch", true]`, pass

- Check: pr.yml run 44445584962, attempt 1 at 020465a0: red. Docs E2E Tests fail on base, radix and aria in the check `story code panels` of spec 66: base 587 of 599, aria 593, radix 597 show the story's own text, `text differs from the story's code text`; the failing pages differ per base, `basic--default` fails on all three. Every other job green. Not a P5 flake and not rerun: fix milestone `67 Docs code panel check passes in CI` (card Q135), then dev fast-forwarded again

- Check: fix milestone `67 Docs code panel check passes in CI` merged as a263d115 (check-only: the read now waits for the highlighted code); dev fast-forwarded to 13a8633e, PR 140 follows

- Task 1 Open the PR with its label and auto-merge: done (020465a0, PR 140); watcher armed in the runner session
- Task 2: planned
- Task 3: planned

## Attention

## Notes
