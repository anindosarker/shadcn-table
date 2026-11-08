# 16: Test jobs skip the version bump commit, tracker

Status: done
Branch `v0.9/ci-skip-bump-commit`, worktree `shadcn-react-table.worktrees/03`
Checks:
- P11 red line, `act pull_request -W .github/workflows/pr.yml -j lint -e bump.json` on the shipped workflows, scratch head `cace5bc5` (`chore: version 9.9.9`, github-actions[bot]) on 05c8c8da: Lint ran (`Run Main pnpm test lint --ci`), no skip; scratch reset
- `act -W .github/workflows/pr.yml -l` at 6a8b8fc2: pass, every job listed, `head` first in the file (stage 0 beside validate-pr; lint, typecheck, storybook-tests, docs-e2e, validate-repo, installation-e2e in stage 1)
- `act -v pull_request -W .github/workflows/pr.yml -j lint -e bump.json`, scratch head `56b73dcc` on 493223c6: pass, `[PR checks/Head] | bumped=true` and `[PR checks/Lint] [DEBUG] Skipping job 'Lint' due to '${{ ... && needs.head.outputs.bumped != 'true' }}'`
- `act -v pull_request -W .github/workflows/pr.yml -j typecheck -e bump.json`, same scratch head: pass, `Skipping job 'Typecheck (${{ matrix.base }})' due to '${{ !inputs.skip }}'` once per leg (base, radix, aria)
- `act pull_request -W .github/workflows/pr.yml -j lint -e normal.json`, head 493223c6: pass, `[PR checks/Head] | bumped=false` and `[PR checks/Lint] ⭐ Run Main pnpm test lint --ci` (Lint ran)
- `pnpm test validate-repo` at 493223c6 and 6a8b8fc2: pass

Tasks:
- Task 1 reproduce: done (05c8c8da, the P11 line above)
- Task 2 head job, callers, skip input: done (493223c6)
- Task 3 cleanup, changelog: done (6a8b8fc2)

Notes:
- Lint under act ends red on 9 eslint warnings in `apps/shadcn-table-docs/examples/*/TS.tsx` (`--max-warnings 0`) on the shipped and the new workflows alike; act environment only, not this change.
- The act proofs ran in a throwaway clone of the worktree in the session scratchpad: in the worktree itself the container cannot resolve the `.git` file (`fatal: not a git repository`), and a checkout with `ref:` an unpushed sha fails (`not our ref`).
- The 0.9.1 release PR run (nineteen contexts and Prepare Release skipped, auto-merge) is out of this milestone's reach; the release spec records it.

## Attention
- `head` checks out the default merge commit with `fetch-depth: 2` and reads `git log -1 "$HEAD_SHA"` (the PR head is its parent), instead of the spec's `ref: head.sha, fetch-depth: 1`: that `ref:` makes act fetch the sha from GitHub, so no local proof is possible. Same result on GitHub.
- `head`'s `if:` is the label condition alone, not the spec's full test-job condition: with `!(dispatch && installation-e2e-only)` the reference refresh dispatch would skip `head` and so Installation E2E, which needs it.
- GitHub may report a matrix job skipped by a job-level `if:` once, with its name unexpanded (`Typecheck (${{ matrix.base }})`), instead of one skipped context per leg; act expands the legs, so only the 0.9.1 run shows it. If the required contexts stay "Expected" there, the fallback is a step-level skip in the four called workflows.
