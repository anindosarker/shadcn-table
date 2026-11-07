# 06: Storybook reset, tracker

Status: running
Branch `v0.9/storybook-reset`, worktree 05
Checks:
- Check: list, `pnpm test --list` at 546bcabd (+ test/storybook-static): pass, names `storybook-static (base, radix, aria)`
- Check: format, `pnpm exec prettier --check test/storybook-static/` at 546bcabd (+ test/storybook-static): pass
- Check: red run on the shipped code (P11), `pnpm test storybook-static --base base` at 546bcabd (+ test/storybook-static): fail as expected, `FAIL footer in initial state "1-1 of 1" (expected "1-10 of 551")`, `FAIL global filter empty "79079 Montana Fields"`, `FAIL window.__ST_STATIC__ is true`

- Task 1 Reproduce (`storybook-static` red on the shipped code): done at dbaf1414
- Task 2 Apply the D8 diff: planned
- Task 3 Cleanup: planned

## Attention

- `test/storybook-static/` matches the root `.gitignore` line `storybook-static` (meant for the build output), so its two files were added with `git add -f`; once tracked, git follows them. A `!test/storybook-static/` line in `.gitignore` would make that explicit; not added, `.gitignore` is not owned by this milestone.

## Notes

- `serve` redirects `/iframe.html?...` to `/iframe` and drops the query (clean URLs), so the test writes `test/.out/storybook-static-serve.json` (`{"cleanUrls": false}`) and passes it with `-c`.
- The test waits for `__STORYBOOK_PREVIEW__.currentRender.phase === 'finished'` (after play and afterEach) before reading the footer; the story's initial render already reads `1-10 of 551`, so reading earlier would pass on the shipped code.
