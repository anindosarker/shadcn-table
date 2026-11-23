# 80: Date picker first tag, tracker

Status: running
Branch `date-picker-first-tag`, worktree shadcn-date-picker.worktrees/date-picker-first-tag (kept, fast-forwarded to main 908300d for task 2)
Checks:
- Check: README tag count, `grep -c '#v0.1.0' README.md` at e27727e: pass (3)
- Check: README item count, `grep -c -E 'date-picker-(base|radix|aria)#v0.1.0' README.md` at e27727e: pass (3)
- Check: lint, `pnpm lint` at e27727e: pass (exit 0)
- Check: ready bases, `node -e` on `tools/bases.mjs` `readyBases()` at e27727e: pass (base,radix,aria)
- Check: owned files, `git diff --name-only origin/main...HEAD` at e27727e: pass (README.md only)
- Check: head, `git rev-parse HEAD` = `git rev-parse origin/main` in the worktree: pass (908300d)
- Check: install, `pnpm install --frozen-lockfile` at 908300d: pass (exit 0)
- Check: lint, `pnpm lint` at 908300d: pass (exit 0)
- Check: types, `pnpm typecheck` at 908300d: pass (exit 0)
- Check: registry, `pnpm registry:check` at 908300d: pass (exit 0, three items up to date, 22 files each)
- Check: tests base, `pnpm test --base base` at 908300d: pass (7 files, 39 tests, no rerun)
- Check: tests radix, `pnpm test --base radix` at 908300d: pass (7 files, 39 tests, no rerun)
- Check: tests aria, `pnpm test --base aria` at 908300d: pass (7 files, 39 tests, no rerun; Q164 race not hit)
- Check: site build, `pnpm storybook:build` at 908300d: pass (exit 0)
- Check: site files, `storybook-static/{base,radix,aria}/index.html` and `version.txt` at 908300d: pass (all exist, version.txt 0.1.0, landing links ./base/ ./radix/ ./aria/)
- Check: CI, `gh run list -R anindosarker/shadcn-date-picker --branch main` run 45275772159 at 908300d: pass (completed, success)
- Check: tag absent before, `git ls-remote --tags origin v0.1.0` at 908300d: pass (empty)
- Check: tag pushed, `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker v0.1.0`: pass (one line, tag object 310b4a0)
- Check: tag commit, `git rev-parse 'v0.1.0^{commit}'`: pass (908300d)
- Check: release, `gh release view v0.1.0 -R anindosarker/shadcn-date-picker --json tagName --jq .tagName`: pass (v0.1.0)
- Note: D173 changed the install; installed folders equal `registry/<base>/generated/components/date-picker`, so the diff -r of 1.6.3 runs against the generated folder of each base, not the source folder.
- Check: install base, fresh Next.js app (`shadcn create -t next -b base -p nova`, style base-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#v0.1.0` at tag v0.1.0 (908300d): pass (35 files created, button skipped as identical)
- Check: files base, `find components/date-picker -type f | wc -l` at v0.1.0 (908300d): pass (22)
- Check: diff base, `diff -r components/date-picker registry/base/generated/components/date-picker` (clone main = v0.1.0, 908300d; generated folder per D173): pass (no output)
- Check: build base, `pnpm exec tsc --noEmit` and `pnpm exec next build` with one page rendering controlled `<DatePicker type="date" />` and `<DatePicker type="date" range />` at v0.1.0 (908300d): pass (both exit 0, route / static)
- Check: install radix, fresh Next.js app (`shadcn create -t next -b radix -p nova`, style radix-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-radix#v0.1.0` at tag v0.1.0 (908300d): pass (35 files created, button skipped as identical)
- Check: files radix, `find components/date-picker -type f | wc -l` at v0.1.0 (908300d): pass (22)
- Check: diff radix, `diff -r components/date-picker registry/radix/generated/components/date-picker` (clone main = v0.1.0, 908300d; generated folder per D173): pass (no output)
- Check: build radix, `pnpm exec tsc --noEmit` and `pnpm exec next build` with one page rendering controlled `<DatePicker type="date" />` and `<DatePicker type="date" range />` at v0.1.0 (908300d): pass (both exit 0, route / static)

- Task 1 README: done (e27727e, merged into main as 908300d "merge: date-picker-first-tag (80)"; no workflow run). Per-base calendar sentence: Base UI and Radix UI use the style's calendar part, React Aria brings its own react-day-picker day calendar with the nova calendar classes (D168).
- Task 2 tag and release: annotated tag v0.1.0 on 908300d pushed; GitHub release v0.1.0 (https://github.com/anindosarker/shadcn-date-picker/releases/tag/v0.1.0), notes = one line per base plus the README install section.
