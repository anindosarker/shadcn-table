# 19: PR Summary reads job outputs, tracker

Status: running
Branch `v0.9/pr-summary-job-outputs`, worktree `shadcn-react-table.worktrees/04`
Checks:
- Check: proof under act, `act workflow_dispatch -W .github/workflows/zz-outputs-proof.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64` (throwaway clone) at fe190cdf: fail, act 0.2.96 limit, not the workflows: the three legs set their keys, the radix leg fails, then act ends the plan (`Error: Job 'Leg (${{ matrix.base }})' failed`) and never runs `consume`; a scratch inline-matrix copy (no workflow_call) does run the always() consumer but shows `base` and `radix` empty (act keeps the last leg's output set, GitHub merges the non-empty ones); the act-unreproducible part goes to the GitHub run (P3)
- Check: proof on GitHub, run 42509826313 (push trigger on the milestone branch) at c42a23d8: pass, `consume` echoes `call.result` failure with outputs base, radix and aria all filled; no fallback
- Check: red first (P11), `node --test tools/release/pr-summary.test.mjs` at 135d35eb on the shipped pr-summary.mjs: fail as expected, `SyntaxError: The requested module './pr-summary.mjs' does not provide an export named 'recordsFromNeeds'`

- Task 1 Proof: done (c42a23d8, run 42509826313)
- Task 2 Reproduce: done (135d35eb)

## Notes

- `gh workflow run zz-outputs-proof.yml` answers HTTP 404 (a workflow not on the default branch cannot be dispatched); the proof file got a `push` trigger on the milestone branch, the run is the same workflow.
- Out of reach here: the next GitHub PR run (artifacts list only `test-out-installation-e2e-*`, nineteen filled rows), for the tracker of the spec whose PR runs first.
