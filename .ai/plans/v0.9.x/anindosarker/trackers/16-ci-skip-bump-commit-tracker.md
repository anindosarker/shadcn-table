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
- Review fix (step-level skip), scratch clone of 3a6bec2a with scratch head `dd0cd42d` (`chore: version 9.9.9`, github-actions[bot]), reset after the proof:
  - `act -W .github/workflows/pr.yml -l`: pass
  - `act -v pull_request -W .github/workflows/pr.yml -j typecheck -e bump16.json`: pass, `bumped=true`; each leg (base, radix, aria) is created under its own name, logs `Skipping step ... due to '${{ !inputs.skip }}'` for checkout, pnpm/action-setup, setup-node, install and the test run and `due to '${{ always() && !inputs.skip }}'` for upload-artifact, then `Job succeeded`
  - `act -v pull_request -W .github/workflows/pr.yml -j installation-e2e -e bump16.json`: pass, all seven legs skip their 9 steps (the nextjs Playwright steps through `!inputs.skip && startsWith(...)`) and succeed, 0 failed
  - `act pull_request -W .github/workflows/pr.yml -j typecheck -e normal16.json`, head 3a6bec2a: `bumped=false`, every leg runs its steps (checkout and pnpm/action-setup succeed), then setup-node fails with `exec: "node": executable file not found in $PATH`; the unchanged Lint job fails the same way under the same act run (`act ... -j lint -e normal16.json`), so it is the act image, not this change

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
- A job-level `if:` on a matrix job is read before the matrix expands: GitHub reports one skipped job with the unexpanded name (`Typecheck (${{ matrix.base }})`) and the required leg contexts stay "Expected" (actions/runner#952, closed unfixed). The four called workflows therefore skip every step instead of the job (spec 1.6.4 said job-level `if:`): each leg reports success, not skipped, under its own context; D35's outcome (no second test run, Prepare Release skipped through Lint and Validate Repo, nobody prompted) is unchanged. The 0.9.1 run stays the GitHub confirmation.
- The milestone commits 05c8c8da, 493223c6, 6a8b8fc2 and a450e458 carry no `Claude-Session` trailer; they are pushed and P2 forbids force-push, so they stay as they are. Every later commit of this milestone carries it.
- `head` adds a fourteenth `actions/checkout@v4` use: the D36 milestone counts 14 checkout uses, not 13.
- act's `catthehacker/ubuntu:act-latest` image now fails every `actions/setup-node@v4` step (`exec: "node": executable file not found in $PATH`), the unchanged Lint job included; a normal-head act run cannot get past setup-node until the image is refreshed.
