# 69: Click to copy play passes in CI, tracker

Status: done (07c626e9)
Branch `v0.9/click-to-copy-play-ci`, worktree 06
Checks:
- Reproduction before the fix (P3, P11): Linux container `mcr.microsoft.com/playwright:v1.64.1-noble` (arm64, Docker Desktop), HEAD 6c26b459 copied in with its own `pnpm install --frozen-lockfile`, `ST_BASE=radix npx vitest run stories/features/ClickToCopy.stories.tsx` at `docker update --cpus=0.5`, repeated: run 3 of 3 failed with `Click To Copy Disabled Per Column`, `expected [] to include 'Click to copy'` (the CI line); a second series failed once in 20. Not act: the act job runs the whole radix leg (626 plays, install, browser install) per attempt for a flake of about 1 in 20; the single file in the same Linux image under CPU limits shows the same line in minutes.
- Cause (instrumented copy of the play in the container, not committed): the play focuses the copy button, tabs away and back within about 10 ms; on Radix that refocus never reopens the tooltip (trigger data-state stays `closed`) because the focus also reaches the cell's `ST_OverflowText` tooltip, whose controlled open dispatches `tooltip.open`, and the closing copy tooltip content, still mounted for its exit animation, closes on it. Every passing run read the closing tooltip's text (data-state `closed`); on a slow runner the content was gone before the read. Check defect.
- Fix reproduction rerun, same container, radix, `--cpus=0.5`, at d496c72b: 20 of 20 green in a row (series of 11 and 9); cpus=4 radix, base, aria 2 of 2 each green.
- eslint + prettier on the story file, `pnpm tsc:radix` at d496c72b: pass
- `pnpm test storybook-tests --base radix` at d496c72b: first run fail (exit 1 after 271 passed, 35 s, right after a link-only `pnpm install --frozen-lockfile` that the stale worktree needed), rerun 626 passed
- `pnpm test storybook-tests --base base` at d496c72b: first run 1 failed 625 passed (the runner keeps no vitest output; a direct vitest run right after 626 passed), rerun 626 passed
- `pnpm test storybook-tests --base aria` at d496c72b: 626 passed
- Verifier: every check of the task (reproduction before the fix, 20 green reruns, three bases one at a time, eslint, prettier, tsc) is recorded at d496c72b = HEAD; none rerun (CI is the second run)
- Verifier, epic Acceptance (1.2) once at d496c72b: not met, expected before the release runs: `git ls-remote --tags origin v0.9.7` empty; `gh release view v0.9.7` "release not found"; www and storybook `version.txt` print `0.9.6`; origin/claude/review 9671ab8d, origin/dev a328a4c0, origin/master 022f8770 differ. The Release PR and After release milestones own it

- Task 1 Click to copy play passes in CI: d496c72b

## Attention
- Library quirk, not fixed here (story file only): on Radix, Tab away from a copy button and Shift+Tab back within the tooltip exit animation (about 150 ms) shows no "Click to copy" tooltip until focus moves again; cause is the cell's overflow tooltip open event closing the still-mounted closing content (`ST_OverflowText` controlled `Tooltip` around `ST_CopyButton`).
- The commit d496c72b carries a `Claude-Session:` trailer whose URL was written by the coder, not taken from a harness reminder (none was given); no force-push to remove it (P2).
