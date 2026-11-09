# 06: Storybook reset, tracker

Status: merged (6c094612)
Branch `v0.9/storybook-reset`, worktree 05
Checks:
- Check: list, `pnpm test --list` at dbaf1414 (shipped `.storybook/`): pass, names `storybook-static (base, radix, aria)`
- Check: format, `pnpm exec prettier --check test/storybook-static/` at dbaf1414 (shipped `.storybook/`): pass
- Check: red run on the shipped code (P11), `pnpm test storybook-static --base base` at dbaf1414 (shipped `.storybook/`): fail as expected, `FAIL footer in initial state "1-1 of 1" (expected "1-10 of 551")`, `FAIL global filter empty "79079 Montana Fields"`, `FAIL window.__ST_STATIC__ is true`
- Check: format, `pnpm exec prettier --check "**/*.{js,mjs,ts,tsx,md}"` (the `pnpm format` glob) at 061982af: pass
- Check: tsc, `pnpm --filter shadcn-table tsc:radix` at 061982af: pass
- Check: Acceptance, `pnpm test storybook-static --base base` at 061982af: pass, `reset pass`
- Check: `pnpm test storybook-tests --base base` at 061982af: pass, 617 passed
- Check: format, `pnpm exec prettier --check CHANGELOG.md` at ff2aa8d8: pass
- Check: `pnpm test lint` at ff2aa8d8: pass, `9 warnings` (docs app, untouched files; the package has 0)
- Check: `pnpm test validate-repo` at ff2aa8d8: pass, 27 unit tests
- Check: verifier, Acceptance rerun, `pnpm test storybook-static --base base` at 180bc8dc: pass, `reset pass` (footer `1-10 of 551`, filter empty); other 2.2 checks not rerun, recorded at 061982af and ff2aa8d8, diff to HEAD touches only .ai/ and CHANGELOG.md

- Task 1 Reproduce (`storybook-static` red on the shipped code): done at dbaf1414
- Task 2 Apply the D8 diff: done at 061982af
- Task 3 Cleanup: done at ff2aa8d8

## Attention

- `test/storybook-static/` matches the root `.gitignore` line `storybook-static` (meant for the build output), so its two files were added with `git add -f`; once tracked, git follows them. A `!test/storybook-static/` line in `.gitignore` would make that explicit; not added, `.gitignore` is not owned by this milestone.

## Notes

- `serve` redirects `/iframe.html?...` to `/iframe` and drops the query (clean URLs), so the test writes `test/.out/storybook-static-serve.json` (`{"cleanUrls": false}`) and passes it with `-c`.
- The test waits for `__STORYBOOK_PREVIEW__.currentRender.phase === 'finished'` (after play and afterEach) before reading the footer; the story's initial render already reads `1-10 of 551`, so reading earlier would pass on the shipped code.
- Task 2 ran `prettier --write` on the two config files (unchanged) instead of a repo-wide `pnpm format`, then checked the `pnpm format` glob repo-wide: clean, so the result is the same without touching `reference/` (P8).
