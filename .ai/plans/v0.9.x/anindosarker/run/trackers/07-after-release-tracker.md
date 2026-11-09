# 07: Release 0.9.0, After release, tracker

Status: merged (566f56a6)
Branch `master` (read only), main checkout (gh and git only)
Checks:
- Check: release.yml, run 42505022746 on master 2eeafde9: pass (Check Release, Verify Deployment, Validate Production, Publish Release all success)
- Check: tag, `git ls-remote --tags origin v0.9.0` at 2eeafde9: pass (one line, 2eeafde9)
- Check: release, `gh release view v0.9.0 --json tagName --jq .tagName` at 2eeafde9: pass (`v0.9.0`)
- Check: www version, `curl -fsS https://www.shadcn-table.com/version.txt` at 2eeafde9: pass (`0.9.0`)
- Check: storybook version, `curl -fsS https://storybook.shadcn-table.com/version.txt` at 2eeafde9: pass (`0.9.0`; the per-base `/<base>/version.txt` URLs of the spec's Acceptance line do not exist, 404; `/<base>/` index 200 for base, radix, aria; `tools/release/verify-deployment.mjs` polls the root URL)
- Check: Validate Production, `gh run view 42505022746 --json jobs --jq '.jobs[] | select(.name == "Validate Production") | .conclusion'` at 2eeafde9: pass (`success`)
- Check: branches, `git rev-parse origin/dev origin/master` at 2eeafde9: pass (one sha twice); `origin/claude/review` = 566f56a6, a merge of master into it (it carries E4 and E5, so no fast-forward was possible)
- Check: validate-repo, `pnpm test validate-repo` at 566f56a6 on `claude/review`: pass

- Task 1 release.yml green: done (run 42505022746, https://github.com/anindosarker/shadcn-table/actions/runs/42505022746, 23:27 to 23:34)
- Task 2 Branches fast-forwarded, handoff: done (`dev` fast-forwarded 634739d3..2eeafde9; `claude/review` merged master as 566f56a6; the four D30 fix branches deleted on origin; handoff rewritten)

## Attention

- (none)

## Notes

- Spec 07 1.2 names `https://storybook.shadcn-table.com/<base>/version.txt`; the deployment serves one `version.txt` at the root (as `verify-deployment.mjs` expects). Spec text, not a finding.
- P4 "fast-forward `claude/review` to `master`" does not hold once feature epics merge into `claude/review` during a release (D30 split `dev` from it); the reconciliation is a merge of `master` into `claude/review`.
