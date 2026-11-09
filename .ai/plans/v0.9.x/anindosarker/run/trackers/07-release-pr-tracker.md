# 07: Release 0.9.0, Release PR, tracker

Status: merged (2eeafde9)
Branch `dev` at 0adce149, main checkout (gh only)
Checks:
- Check: merged, `gh pr view 134 --json state --jq .state` at 634739d3: `MERGED`; `git show origin/master:packages/shadcn-table/package.json | grep version` prints 0.9.0 (checked by the After release milestone)
- Check: label and auto-merge, `gh pr view 134 --json labels,autoMergeRequest --jq '[.labels[].name, .autoMergeRequest.enabledAt != null]'` at 0adce149: pass (`["release:minor", true]`)

- Task 1 Open the PR with label and auto-merge: done (PR 134, https://github.com/anindosarker/shadcn-table/pull/134, pr.yml run 42488458376, watcher armed 20:13)
- Task 2 Approve the Prepare Release deployment (D15): superseded by D28; the owner approved at about 22:45, bump 0a465c3e on `origin/dev`
- Task 3 Merged on green: done, PR 134 merged by auto-merge at 23:27 as 2eeafde9 on `master`; pr.yml run 42488458376 red on `Storybook Tests (aria)` only (`SubRowTree` plays "Expand Shows Children" and "Expand All Collapse All", `getByRole` on an undefined container; 616 of 618 pass; green locally at df90bd27 three times today), plus `Docs E2E Tests (base, radix, aria)` each on the `/` theme checks of getting-started (base and aria: "Shift+R returns to the default" leaves `--primary` unchanged; radix: the next check's `locator.click` times out after 30 s); every other job green; `gh run rerun --failed 42488458376` at 20:27 (attempt 2, the one P5 rerun): storybook aria, docs-e2e base and radix green, docs-e2e aria red again on "Shift+R returns to the default" (F23); fix milestone `theme-hotkey-check-wait` merged into `dev` as ea276251; pr.yml run 42490873017 on ea276251: every job green except `Docs E2E Tests (aria)`: the hotkey checks now pass, red on `/` "page check threw locator.fill: Timeout 30000ms" (the Colors tab edit) and on `/docs/examples/editing-crud-inline-row` and `-table` "delete dialog cancel keeps the rows before=10 after=8"; `gh run rerun --failed 42490873017` at 20:52 (attempt 2): aria red again, the `Customize theme` click after the search-dialog check times out (F24); fix milestone `theme-check-close-search` merged into `dev` as 50ef8dd5 (D30; act not run, Docker daemon down, D32 applies from here); pr.yml run 42496942383 on 50ef8dd5: every test job green on the first attempt (typecheck, lint, storybook-tests, docs-e2e, validate-repo, installation-e2e, validate-pr, PR Summary); Prepare Release waited for the owner's approval on the `release` environment from 22:00 (D28); approved by the owner, bump `chore: version 0.9.0` = 0a465c3e on `dev`; pr.yml run 42501252444 on the bump: red on `Docs E2E Tests (base)` (`/docs/examples/editing-crud-inline-cell` and `-inline-row` "delete dialog cancel keeps the rows before=10 after=8") and `(radix)` (`editing-crud-tree` "before=20 after=10"), the same check that failed once on aria at ea276251 and passed on rerun; `gh run rerun --failed 42501252444` at 22:52 (the one P5 rerun): base green, radix red again on `editing-crud-inline-row` (F25); fix milestone `crud-dialog-check-wait` merged into `dev` as 634739d3 (D30); pr.yml run 42503995049 on 634739d3: every test job green on the first attempt; Prepare Release waits for the owner's Approve again since 23:22 (the `release` environment gates the job on every run, before its already-bumped skip); BLOCKED E3 and a push notification sent 23:24; approved by the owner at about 23:26

## Attention

- [Staging for the ATTENTION file, one bullet per item, self-explanatory first line.]

## Notes

- [Optional: only what a later task, a resume or the owner would otherwise rediscover.]
