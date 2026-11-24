# 83: Docs copied check waits for the label (Q174), tracker

Status: running
Branch `v0.9/docs-copied-check-waits`, worktree 07
Checks:
- Check: copied checks wait, `grep -n "waitForTimeout(100)" test/docs-e2e/lib/helpers.mjs` at f1d1bff50: pass (no fixed wait before a copied count; copyAndRead polls the clipboard stub, copiedShown waits for the Copied button, 5000 ms)
- Check: lint, `pnpm test lint` at f1d1bff50: pass (0 errors, 9 warnings)
- Check: docs-e2e radix, `pnpm test docs-e2e --base radix` at f1d1bff50: pass (getting-started 276, api 111, guides 1057, examples 1116, site 94, 0 failed)
- Check: validate-repo, `pnpm test validate-repo` at f1d1bff50: pass (no CHANGELOG line asked; test-only change)
- Check: process.md P5 untouched, `git diff origin/claude/review -- .ai/plans/v0.9.x/anindosarker/process.md` at f1d1bff50: pass (empty)
- Check: verify files, `git diff --name-only origin/claude/review...HEAD` at c11953865: pass (helpers.mjs, getting-started.mjs, tracker only)
- Check: verify stands, `git diff --name-only f1d1bff50..HEAD` at c11953865: pass (tracker only; lint, docs-e2e radix, validate-repo lines at f1d1bff50 stand)
- Check: verify copied waits, diff read at c11953865: pass (all four copied-state checks use copiedShown locator wait 5000 ms; three clipboard reads poll via copyAndRead; no fixed wait before a copied count)
- Check: verify stays unchanged, `git diff --stat origin/claude/review...HEAD -- .github tools packages apps test-projects process.md CHANGELOG.md registry.json public` at c11953865: pass (empty)
- Check: verify ports and tree, `lsof -nP -iTCP:5340-5360 -sTCP:LISTEN` and `git status --short` at c11953865: pass (both empty)

- Task 1 Docs copied check waits for the label: done (f1d1bff50)
