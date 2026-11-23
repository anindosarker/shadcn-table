# 80: Date picker first tag, tracker

Status: running
Branch `date-picker-first-tag`, worktree shadcn-date-picker.worktrees/date-picker-first-tag (kept, fast-forwarded to main 908300d for task 2)
Checks:
- Check: README tag count, `grep -c '#v0.1.0' README.md` at e27727e: pass (3)
- Check: README item count, `grep -c -E 'date-picker-(base|radix|aria)#v0.1.0' README.md` at e27727e: pass (3)
- Check: lint, `pnpm lint` at e27727e: pass (exit 0)
- Check: ready bases, `node -e` on `tools/bases.mjs` `readyBases()` at e27727e: pass (base,radix,aria)
- Check: owned files, `git diff --name-only origin/main...HEAD` at e27727e: pass (README.md only)
- Note: D173 changed the install; installed folders equal `registry/<base>/generated/components/date-picker`, so the diff -r of 1.6.3 runs against the generated folder of each base, not the source folder.

- Task 1 README: done (e27727e, merged into main as 908300d "merge: date-picker-first-tag (80)"; no workflow run). Per-base calendar sentence: Base UI and Radix UI use the style's calendar part, React Aria brings its own react-day-picker day calendar with the nova calendar classes (D168).
