# Theme hotkey checks wait for the change (F23), tracker

Status: merged (1fb91e9f; dev ea276251)
Files owned: `test/docs-e2e/lib/getting-started.mjs`
Depends on: none
Branch `v0.9/theme-hotkey-check-wait` (cut from `dev` 0adce149, D30 pattern: merged into `dev` then `claude/review`), worktree 06
Checks:
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06 at f0274282: pass (63 passed, 0 failed; all 8 theme checks pass)
- Check: claude/review merge, `node --check test/docs-e2e/lib/getting-started.mjs` at 1fb91e9f: pass (syntax check only, docs-e2e left to CI and fix-close-search)

- Task 1 Hotkey waits: done (f0274282)

## Notes

- No changelog block: the change is in a test file only.
- `dev` version: `r`, `p`, `Shift+R` and the Colors tab edit poll `--primary` (50 ms steps, up to 5000 ms) for the expected value; `r` with the search dialog open keeps the fixed 200 ms wait.
- `claude/review` version (spec 09 and 10 checks kept): the same poll for `r` (inside the up-to-three-presses shuffle), `Mod+Z`, `Mod+Shift+Z`, `Shift+R`, the Colors tab edit and the picker's typed edit, drag and two undos; `p` ("changes nothing") and `r` during search keep the fixed 200 ms wait.

## Attention

- Local docs E2E runs of the merged `claude/review` file failed (main checkout twice, worktree 06 once: hotkeys had no effect within 5 s in 2 of 3 runs, and the themeColorPicker `Customize theme` click timed out in all 3), while one baseline run of `origin/claude/review` without the change passed in worktree 06. Root cause was not investigated, as the lead directed: the remaining CI failure is the search dialog that stays open after Escape, which fix-close-search fixes. Confirm on CI after that fix.
