# 19: PR Summary reads job outputs, tracker

Status: done
Branch `v0.9/pr-summary-job-outputs`, worktree `shadcn-react-table.worktrees/04`
Checks:
- Check: proof under act, `act workflow_dispatch -W .github/workflows/zz-outputs-proof.yml -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64` (throwaway clone) at fe190cdf: fail, act 0.2.96 limit, not the workflows: the three legs set their keys, the radix leg fails, then act ends the plan (`Error: Job 'Leg (${{ matrix.base }})' failed`) and never runs `consume`; a scratch inline-matrix copy (no workflow_call) does run the always() consumer but shows `base` and `radix` empty (act keeps the last leg's output set, GitHub merges the non-empty ones); the act-unreproducible part goes to the GitHub run (P3)
- Check: proof on GitHub, run 42509826313 (push trigger on the milestone branch) at c42a23d8: pass, `consume` echoes `call.result` failure with outputs base, radix and aria all filled; no fallback
- Check: red first (P11), `node --test tools/release/pr-summary.test.mjs` at 135d35eb on the shipped pr-summary.mjs: fail as expected, `SyntaxError: The requested module './pr-summary.mjs' does not provide an export named 'recordsFromNeeds'`
- Check: `act pull_request -W .github/workflows/pr.yml -j lint -e <scratchpad>/pr-event.json -P ubuntu-latest=catthehacker/ubuntu:act-latest --artifact-server-path <scratchpad>/act-artifacts` (throwaway clone) at 924a9118: pass line met, Head green, Lint checkout, pnpm/action-setup, setup-node and install green, `pnpm test lint --ci` red (package eslint ran out of the container's 2 GB heap, exit 134; act only, the step is unchanged), then the record step green printing `::set-output:: record={"name":"lint","status":"fail","summary":"9 problems",...,"sha":"924a9118"}`. With `--container-architecture linux/amd64` setup-node fails (`exec: "node": executable file not found in $PATH`), so the arm64 image ran
- Check: `node --test tools/release/pr-summary.test.mjs` at 924a9118 and e0adb7a2: pass, 13 tests
- Check: `pnpm test validate-repo` at 924a9118 and e0adb7a2: pass, 34 unit tests
- Check: `pnpm test lint` at 924a9118: pass, 9 warnings; `node tools/release/record-output.mjs --key record` after it prints `record={"name":"lint","status":"pass",...}`
- Check: at e0adb7a2 `grep -rn 'download-artifact' .github/workflows/pr.yml` empty; `grep -rln 'test-out-' .github/workflows/` lists `installation-e2e.yml` and `release.yml` (the `test-out-validate-production` upload of the release workflow, outside this spec); `ls .github/workflows/zz-*` no match: pass

- Task 1 Proof: done (c42a23d8, run 42509826313)
- Task 2 Reproduce: done (135d35eb)
- Task 3 Outputs: done (924a9118)
- Task 4 Cleanup: done (e0adb7a2)

## Notes

- `gh workflow run zz-outputs-proof.yml` answers HTTP 404 (a workflow not on the default branch cannot be dispatched); the proof file got a `push` trigger on the milestone branch, the run is the same workflow.
- Out of reach here: the next GitHub PR run (artifacts list only `test-out-installation-e2e-*`, nineteen filled rows), for the tracker of the spec whose PR runs first.
- The record step of the four called workflows is `if: ${{ always() && !inputs.skip }}` (the removed upload's condition), so a skipped leg (D35) runs no node step and stays success.
- act 0.2.96 does not model matrix outputs as GitHub does: a scratch inline-matrix run kept only the last leg's outputs (the others empty), and a failed leg inside a called workflow ends the act plan; a local act run of the four called workflows therefore cannot show the per-leg outputs, the GitHub proof does.
