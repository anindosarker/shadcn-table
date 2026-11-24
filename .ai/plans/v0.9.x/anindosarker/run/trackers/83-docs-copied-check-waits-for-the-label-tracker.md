# 83: Docs copied check waits for the label (Q174), tracker

Status: running
Branch `v0.9/docs-copied-check-waits`, worktree 07
Checks:
- Check: copied checks wait, `grep -n "waitForTimeout(100)" test/docs-e2e/lib/helpers.mjs` at f1d1bff50: pass (no fixed wait before a copied count; copyAndRead polls the clipboard stub, copiedShown waits for the Copied button, 5000 ms)
- Check: lint, `pnpm test lint` at f1d1bff50: pass (0 errors, 9 warnings)
- Check: docs-e2e radix, `pnpm test docs-e2e --base radix` at f1d1bff50: pass (getting-started 276, api 111, guides 1057, examples 1116, site 94, 0 failed)
- Check: validate-repo, `pnpm test validate-repo` at f1d1bff50: pass (no CHANGELOG line asked; test-only change)
- Check: process.md P5 untouched, `git diff origin/claude/review -- .ai/plans/v0.9.x/anindosarker/process.md` at f1d1bff50: pass (empty)

- Task 1 Docs copied check waits for the label: running (f1d1bff50)
