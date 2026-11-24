# 83: Release 0.9.8, After release 0.9.8, tracker

Status: done (2721fafc)
Branch `master`, worktree 03 for Task 3 (detached, operations only)
Checks:
- Check: release.yml, run 45337528159 at a594a8a4: Check Release, Verify Deployment, Validate Production, Publish Release all `success`; no rerun needed
- Check: tag, `git ls-remote --tags origin v0.9.8`: one line (a594a8a4), pass
- Check: release, `gh release view v0.9.8 --json tagName --jq .tagName`: `v0.9.8`, pass
- Check: version files, `https://www.shadcn-table.com/version.txt` and `https://storybook.shadcn-table.com/version.txt`: both `0.9.8`, pass
- Check: hosted core items, `https://www.shadcn-table.com/r/{base,radix,aria}/shadcn-table-core.json` `registryDependencies`: `anindosarker/shadcn-date-picker/date-picker-base#v0.1.1`, `...-radix#v0.1.1`, `...-aria#v0.1.1` (DATE_PICKER_TAG v0.1.1), pass
- Check: live Storybook `Features/Date Filters`, story `Typed Date Applies On Enter` (subheader, Greater Than, no value; plays do not run on the hosted iframe), Playwright headless at 1440, `/base/`: pass. The box's `Select date` button opens the dialog `Select date`; Nov 2nd 2025 picked: rows Dan, Eve (6 before), box value `2025-11-02`
- Check: same, typed then picked, `/base/`: pass. Typed `10102025`: value `2025-10-10`, 6 rows (not applied); popup opens at October 2025; October 10th picked: 300 ms later rows Ben, Cara, Dan, Eve
- Check: same two reads, `/radix/`: pass, identical results
- Check: same two reads, `/aria/`: pass, identical results
- Check: live docs example `https://www.shadcn-table.com/docs/examples/subheader-filters` (Hire Date, `date-range`), header select Base UI (base markup 18, no `data-rac`): pass. First `Select date` box opens the dialog `Select date`; June 1st 2023 picked as min: 7 rows to 1 (John Smith, 6/12/2023)
- Check: same, Radix UI (no base markup, no `data-rac`): pass, 7 rows to 1
- Check: same, React Aria (`data-rac` 113): pass, 7 rows to 1
- Check: browser closed (Playwright `browser.close()` in `finally`), pass
- Check: fresh app, `pnpm dlx shadcn@latest init --template next --base base --preset nova --name app --yes` in `/private/tmp/claude-501/release-0-9-8/fresh`: `components.json` style `base-nova`; `pnpm dlx shadcn@latest add https://www.shadcn-table.com/r/base/shadcn-table.json --yes`: exit 0, 184 files created, `components/date-picker/date-picker.tsx` present; `pnpm exec tsc --noEmit` (heavy.sh): exit 0, pass
- Check: scratch folder `/private/tmp/claude-501/release-0-9-8` deleted, pass
- Check: `claude/review` had 28 commits past `master` (plan files and f1d1bff5 docs-e2e test fix), so `git merge origin/master -m "merge: master 0.9.8"` in worktree 03: 2721fafc, pushed `HEAD:claude/review`
- Check: `dev` fast-forwarded to `master` a594a8a4 (plain push, from b9cef463), as for 0.9.7
- Check: branches, `git rev-parse origin/claude/review`, `origin/dev`, `origin/master`: `claude/review` 2721fafc (`merge: master 0.9.8`), `dev` and `master` a594a8a4. Not one sha three times: `claude/review` carries plan commits and the test fix f1d1bff5 past `master`, as for 0.9.7
- Check: `git ls-remote --heads origin v0.9/filter-input-fixes`: one line, pass
- Check: validate-repo, `pnpm test validate-repo` at 2721fafc in worktree 03: pass; worktree clean and detached after

- Task 1: done (a594a8a4, run 45337528159)
- Task 2: done (a594a8a4); every live read passes; browser closed; scratch app deleted
- Task 3: done (2721fafc); handoff left to the runner

## Notes

- 0.9.8 does not hold f1d1bff5 (`test(docs-e2e): copied checks wait for the label and poll the clipboard`): it merged into `claude/review` after `dev` was fast-forwarded. Test-only; it ships with the next release.

## Attention
