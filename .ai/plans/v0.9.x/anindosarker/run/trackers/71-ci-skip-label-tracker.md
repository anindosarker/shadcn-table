# 71: CI skip label, tracker

Status: running
Branch `v0.9/ci-skip-label`, worktree 07
Checks:
- Check: `grep -c 'needs.head.outputs.bumped' .github/workflows/pr.yml` = 0, `grep -c 'needs.head.outputs.skip' .github/workflows/pr.yml` = 6 at 23c30cee: pass
- Check: act, no label, `act pull_request -W .github/workflows/pr.yml -j head -e <scratchpad>/event-134.json -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-options "-v <scratchpad>/gh:/usr/local/bin/gh:ro" -s GITHUB_TOKEN=<gh auth token>` (throwaway clone, the worktree's .git file does not resolve in the container; merged PR 134, head 634739d3 not a version commit, labels release:minor) at 23c30cee content: pass, Head prints `bumped=false`, `skip=false (none)` after a live `gh pr view` read
- Check: act, labelled, same command on a copy of pr.yml in <scratchpad> whose label read `labelled=$(gh pr view "$PR" --json labels --jq 'any(.labels[]; .name == "ci:skip")')` is replaced by `labelled=$(echo true)` for that run only (no PR carries ci:skip and the label is not created by this milestone), PR 134 at 23c30cee content: pass, `skip=true (label ci:skip)`
- Check: act, read fails, same command with `-s GITHUB_TOKEN=not-a-token`, PR 134 at 23c30cee: pass, `HTTP 401: Bad credentials`, warning, `skip=false (none, the label read failed)` (falls back to bumped, not true)
- Check: act, version commit, same command with an event for merged PR 141 (head dd2cb8e2 `chore: version 0.9.7` by github-actions[bot]) before the reason wording change, same logic: pass, `bumped=true`, `skip=true (version commit)`, no label read
- Not reproducible under act: the live read of a PR that really carries `ci:skip` (label not created yet); proven by the GitHub run of milestone `Ship the home page label` (Head log `skip=true (label ci:skip)`). The act image has no gh; a linux arm64 gh 2.105.0 was mounted for the runs, GitHub's ubuntu-latest ships gh
- Check: `grep -c 'ci:skip' CONTRIBUTING.md docs/code-of-conduct/coding-standards.md` = 1 and 2 at e99d2894: pass
- Check: `pnpm test lint` at e99d2894: pass (9 warnings, unchanged files)
- Check: `pnpm test validate-repo` at e99d2894: pass (43 unit tests, worktree clean after)
- Verifier: lint, validate-repo, the greps and the act lines above are recorded at e99d2894 = HEAD, not rerun
- Acceptance (1.2, act part), verifier, at e99d2894 (clone synced to HEAD, workflow files identical): `act pull_request -W .github/workflows/pr.yml -j head` on PR 134, no label: pass, `bumped=false`, `skip=false (none)`; labelled (label read replaced by `echo true`, as above): pass, `skip=true (label ci:skip)`. The GitHub part of Acceptance belongs to milestone `Ship the home page label`

- Task 1 skip output of Head: done (23c30cee)
- Task 2 the ci:skip sentence in CONTRIBUTING.md and coding-standards.md: done (e99d2894)

## Attention
