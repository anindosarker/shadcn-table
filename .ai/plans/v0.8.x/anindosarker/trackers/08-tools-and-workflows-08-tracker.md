# 08: Tools and workflows (08), tracker (D85, D86, D87, D88)

Status: running
Branch `v0.8/08-tools-workflows`, worktree `shadcn-react-table.worktrees/01`, no PR (P1, P3)
Checks:
- Check: tool unit tests, `node --test "tools/**/*.test.mjs"` at 2c5ba59d+Task 1: pass (27)
- Check: syntax, `node --check` on `tools/release/{verify-deployment,publish-release,pr-summary}.mjs` at 2c5ba59d+Task 1: pass
- Check: verify-deployment live, `node tools/release/verify-deployment.mjs --version 0.8.1 --timeout-min 1` at 2c5ba59d+Task 1: fail (environment: www serves `0.8.0`, storybook `/version.txt` is 404 because `storybook:build` writing it is not on master yet; the tool exits 1 with both bodies as specified; the success path proven with stubbed bodies through the exported `poll`)

- Task 1 Release tools: running
- Task 2 Workflows: planned
- Task 3 Repository settings: pending (main session, D80)
- Task 4 Cleanup and checks once: planned

## Attention

- The Task 1 check `verify-deployment --version 0.8.1` cannot pass today: production serves 0.8.0 (0.8.1 is not live) and storybook.shadcn-table.com has no `/version.txt` until the next release deploys `storybook:build`. Recorded as fail (environment); the first release run of the new `release.yml` is the live proof.

## Notes
