# Theme hotkey checks wait for the change (F23), tracker

Status: merged (1fb91e9f; dev ea276251)
Files owned: `test/docs-e2e/lib/getting-started.mjs`
Depends on: none
Branch `v0.9/theme-hotkey-check-wait` (cut from `dev` 0adce149, D30 pattern: merged into `dev` then `claude/review`), worktree 06
Checks:
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06 at f0274282: pass (63 passed, 0 failed; all 8 theme checks pass)
- Check: claude/review merge, `node --check test/docs-e2e/lib/getting-started.mjs` at 1fb91e9f: pass (syntax check only, docs-e2e left to CI and fix-close-search)
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06 at 70ab385e (merged file): fail (66 passed, 4 failed: `r`, `Mod+Z`, `Mod+Shift+Z`, `Shift+R`; focus in the demo's Search input)
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06 with the c827660c file (before the merge): fail (same 4 checks)
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06, reduced motion only: fail (66 passed, 1 failed: the Colors tab edit `Customize theme` click timed out, the Theme panel still open)
- Check: docs E2E `/`, `pnpm test docs-e2e --base base /` in worktree 06 at 0439e53d: pass (70 passed, 0 failed), twice
- Check: docs E2E `/`, `pnpm test docs-e2e --base aria /` in worktree 06 at 0439e53d: pass (70 passed, 0 failed)

- Task 1 Hotkey waits: done (f0274282)

## Notes

- No changelog block: the change is in a test file only.
- `dev` version: `r`, `p`, `Shift+R` and the Colors tab edit poll `--primary` (50 ms steps, up to 5000 ms) for the expected value; `r` with the search dialog open keeps the fixed 200 ms wait.
- `claude/review` version (spec 09 and 10 checks kept): the same poll for `r` (inside the up-to-three-presses shuffle), `Mod+Z`, `Mod+Shift+Z`, `Shift+R`, the Colors tab edit and the picker's typed edit, drag and two undos; `p` ("changes nothing") and `r` during search keep the fixed 200 ms wait.

## Attention

- The merged file was broken by test state, not by its poll waits (the c827660c file failed the same way): the home demo replay focuses its Search field, so the theme panel closes and the hotkeys skip the keys; and with focus on a shortcut button the first Escape only closes its tooltip, leaving the panel over the trigger. Fixed on `claude/review` in 0439e53d (reduced motion during the theme checks, `closePanel` presses Escape until the panel is gone), merged as ca006472. `dev` does not have this fix, so CI on `dev` may still fail these checks.
