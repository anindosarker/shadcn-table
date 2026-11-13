# 48: Release 0.9.4, Release PR, tracker

Status: merged (7b37986610565ff36f191c89932edfcdda4385af)
Branch `dev`, main checkout (gh only)
Checks:
- Check: dev equals claude/review, `git rev-parse origin/dev origin/claude/review` at f7905db9: pass (one sha); `git merge-base --is-ancestor origin/master origin/dev`: pass
- Check (resume): `## Unreleased` on claude/review 59f239f3, `awk '/^## Unreleased/{p=1;next} p&&/^## /{exit} p' CHANGELOG.md | grep -E '^###+ '`: order of spec 48 1.6.1 intact, 41.3 only dropped the non-modal line under Spec 43 (no claim of non-modal React Aria editors left): pass, no edit
- Check: dev fast-forward again, `git merge-base --is-ancestor origin/dev origin/claude/review` pass; `git push origin origin/claude/review:refs/heads/dev` f7905db9..e96f5612; `git rev-parse origin/dev origin/claude/review`: pass (one sha e96f5612)
- Check: PR 138 body Changes gains Spec 41.3 (D97), the Spec 43 non-modal claim dropped; `gh pr ready 138`, `gh pr merge 138 --auto --merge`; `gh pr view 138 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'`: pass (["release:patch", true])
- Check: pr.yml run 43501905394 at e96f5612: pass (21 jobs success, Prepare Release waiting; `[.jobs[] | select(.conclusion != "success" and .conclusion != "skipped")] | length` 1 = Prepare Release waiting)
- Check: D47 approve, `gh api repos/anindosarker/shadcn-table/actions/runs/43501905394/pending_deployments -f state=approved -F 'environment_ids[]=26597343948' -f comment=D47`: approved (deployment 7775915910, environment release, ref dev, sha e96f5612); Prepare Release success, run conclusion success
- Check: D35/D44 bump run 43503591693 at 13db000a `chore: version 0.9.4`: pass (Head bumped=true; Lint, Validate Repo, Prepare Release skipped; 16 test legs, Validate PR, PR Summary success; same contexts as 0.9.3 run 43313740356)
- Check: merge, `gh pr view 138 --json state --jq .state`: MERGED (merge commit 7b379866, auto-merge); `git show origin/master:packages/shadcn-table/package.json | grep '"version": "0.9.4"'`: pass

- Task 1 Open the PR with label and auto-merge: done, PR 138 ready, auto-merge on at e96f5612
- Task 2 Full run green; approve Prepare Release (D47): done, run 43501905394, deployment 7775915910 approved
- Task 3 Bump run (test jobs skipped, D35) and merge: done, bump 13db000a (run 43503591693), merge 7b379866

## Attention

## Notes

## Notes

- 2026-11-14 01:24: the owner's hold (E12 note, Q83) arrived after Integration had fast-forwarded dev and PR 138 was open. The run manager stopped the workflow, turned auto-merge off, made PR 138 a draft and cancelled pr.yml run 43490656009 before Prepare Release; no approval was given, no bump commit exists. When the fix has merged: fast-forward dev again, mark PR 138 ready, enable auto-merge, continue at Task 1's check.
