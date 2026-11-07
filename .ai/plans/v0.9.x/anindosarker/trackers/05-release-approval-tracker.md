# 05: Release approval, tracker

Status: running
Branch `v0.9/release-approval`, worktree 04
Checks:
- Check: environment reviewers, `gh api repos/anindosarker/shadcn-table/environments/release --jq '[.protection_rules[] | select(.type == "required_reviewers") | .reviewers[].reviewer.login]'` at 546bcabd: pass (`["anindosarker"]`)
- Check: environment line, `grep -c '^    environment: release$' .github/workflows/pr.yml` at task 2 commit: pass (`1`, line 171, inside `prepare-release`)
- Check: act list, `act pull_request -l` at task 2 commit: pass (lists `prepare-release`, Prepare Release)
- Check: validate-repo, `pnpm test validate-repo` at task 2 commit: pass

- Task 1 Create the `release` environment: done
- Task 2 Gate `prepare-release`: done
- Task 3 Cleanup: planned

## Attention

- The `release` environment keeps GitHub's default `can_admins_bypass: true`: the spec's PUT body (1.6.2) does not set it, so a repository admin can still bypass the review. Left as the spec wrote it; setting it to false is one more PUT if the owner wants it.

## Notes

- Environment created 2026-11-07T23:48:53Z with `gh api -X PUT repos/anindosarker/shadcn-table/environments/release` and the body of spec 1.6.2. Before: `{"total_count":0,"environments":[]}`. Response (user fields trimmed): `{"id":26597343948,"name":"release","can_admins_bypass":true,"protection_rules":[{"id":71674184,"type":"required_reviewers","prevent_self_review":false,"reviewers":[{"type":"User","reviewer":{"login":"anindosarker","id":29659719}}]}],"deployment_branch_policy":null}`.
