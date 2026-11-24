# 84: Date picker v0.1.1, tracker

Status: done
Merge: 2cf6e6ff08e5b3e824f04e4b8abdc41fdb4088eb (`merge: date-picker-v0-1-1 (84)` on main), tag v0.1.1
Branch `date-picker-v0-1-1`, worktree shadcn-date-picker.worktrees/date-picker-v0-1-1 (from origin/main c42b8bb)
Checks:
- Check: play red, `DP_BASE=base pnpm exec vitest run stories/Options.stories.tsx` at c42b8bb with the G3, G4 step rewritten (source unchanged): fail as expected (1 failed, 26 passed; Ignored Limits: `expected "spy" to not be called with arguments: [ StringContaining "DatePicker:" ]`, received `DatePicker: min "2026/11/05" is ignored: not a datetime value` and `DatePicker: step 1.5 is ignored: not a whole number of seconds above zero`)
- Check: no warning left, `grep -rn -E 'process\.|IgnoredProp|ignored\(' registry/*/components/date-picker` at 4873842: pass (no output)
- Check: same file, `cmp` of `utils/values.ts` base/radix and base/aria at 4873842: pass (exit 0, exit 0)
- Check: deletions only, `git diff origin/main --stat -- 'registry/*/components/date-picker/utils/values.ts'` at 4873842: pass (3 files, 6 insertions, 57 deletions; the 2 added lines per file are the callers `checkedLimits` and `checkedStep` yielding `undefined`)
- Check: tests base, `pnpm test --base base` at 4873842: pass (7 files, 39 tests; play green)
- Check: tests radix, `pnpm test --base radix` at 4873842: pass (7 files, 39 tests)
- Check: tests aria, `pnpm test --base aria` at 4873842: pass (7 files, 39 tests, no rerun)
- Note: cases G3 and G4 of `reference/q88-date-filter-demo/date-picker-9-cases.md` no longer print a console error (D176); the reference file is not edited.
- Check: arrow class, `grep -c 'rtl:rotate-180' registry/<base>/components/date-picker/components/period-views.tsx` at a05fb19: pass (base 2, radix 2, aria 2)
- Check: two lines per file, `git diff origin/main -- 'registry/*/components/date-picker/components/period-views.tsx'` at a05fb19: pass (2 insertions, 2 deletions per file, the two `GridHeader` chevrons)
- Check: right-to-left captures, Storybook dev of the branch on port 5341 with DP_BASE=base, `dir="rtl"` set on the preview document by the playwright script, plays left out of the served story modules, popup opened by a script click, at a05fb19: 8 captures under reference/q149-calendar-library/rtl/after/
- Check: rtl month-single 1280, after/month-single-1280.png against rtl/month-single-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-single 390, after/month-single-390.png against rtl/month-single-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-range 1280, after/month-range-1280.png against rtl/month-range-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl month-range 390, after/month-range-390.png against rtl/month-range-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-single 1280, after/year-single-1280.png against rtl/year-single-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-single 390, after/year-single-390.png against rtl/year-single-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-range 1280, after/year-range-1280.png against rtl/year-range-1280.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: rtl year-range 390, after/year-range-390.png against rtl/year-range-390.png (spec 78) at a05fb19: arrows flipped (previous points right, next points left; nothing else differs)
- Check: Storybook server stopped by pid, `lsof -iTCP:5341 -sTCP:LISTEN` at a05fb19: pass (nothing listens)
- Check: registry, `pnpm registry:build` then `pnpm registry:check` at 0b45dec: pass (exit 0, three items up to date, 22 files each; generated values.ts and period-views.tsx rewritten on three bases, registry.json files unchanged)
- Check: no process read, `grep -rn 'process\.' registry/*/generated` at 0b45dec: pass (no output)
- Check: install commands, `grep -c -E 'date-picker-(base|radix|aria)#v0.1.1'` README.md and stories/Introduction.mdx at 0b45dec: pass (3, 3)
- Check: old tag gone, `grep -c 'v0.1.0' README.md stories/Introduction.mdx` at 0b45dec: pass (0, 0)
- Check: Base UI note, `grep -c 'issues/9401' README.md` at 0b45dec: pass (1)
- Check: stock calendar part, `grep -c 'ref={ref}' registry/base/components/ui/calendar.tsx` at 0b45dec: pass (0)
- Check: approved folder, `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at 0b45dec: pass (exit 1, two files only: `components/period-views.tsx` 234c234 and 238c238 add `className="rtl:rotate-180"` to `ChevronLeftIcon` and `ChevronRightIcon`; `utils/values.ts` 14,15d13 `type IgnoredProp`, 97,105d94 `function ignored`, 109,111c98 `checkedLimits` caller to `? text : undefined`, 119,123c106 `checkedStep` caller to `: undefined`)
- Check: lint, `pnpm lint` at 0b45dec: pass (exit 0)
- Check: types, `pnpm typecheck` at 0b45dec: pass (exit 0)
- Check: Local CI install, `pnpm install --frozen-lockfile` at 0b45dec: pass (exit 0)
- Check: Local CI lint, `pnpm lint` at 0b45dec: pass (exit 0)
- Check: Local CI types, `pnpm typecheck` at 0b45dec: pass (exit 0)
- Check: Local CI registry, `pnpm registry:check` at 0b45dec: pass (exit 0, three items up to date, 22 files each)
- Check: Local CI tests base, `pnpm test --base base` at 0b45dec: pass (7 files, 39 tests)
- Check: Local CI tests radix, `pnpm test --base radix` at 0b45dec: pass (7 files, 39 tests)
- Check: Local CI tests aria, `pnpm test --base aria` at 0b45dec: pass (7 files, 39 tests, no rerun)
- Check: Local CI site build, `pnpm storybook:build` at 0b45dec: pass (exit 0; storybook-static/base, radix, aria, index.html, version.txt 0.1.1)

- Task 1 warning removal: done (4873842); props row in stories/Introduction.mdx says a limit in another format is ignored
- Task 2 grid arrows: done (a05fb19); eight right-to-left captures committed
- Task 3 generated files, version, README, Introduction: done (0b45dec); package.json 0.1.1, install commands at #v0.1.1, README Base UI note before Radix UI; Local CI green at 0b45dec; not merged
- Task 4 merge, checks, tag and release: done (2cf6e6f); main did not move past c42b8bb, `merge: date-picker-v0-1-1 (84)` pushed; annotated tag v0.1.1 on 2cf6e6f; GitHub release v0.1.1 (https://github.com/anindosarker/shadcn-date-picker/releases/tag/v0.1.1), notes = the three lines of 1.6.4 plus the README install section
- Task 5 install proofs, live reads, clean-up: done at tag v0.1.1 (2cf6e6f); base, radix, aria each 22 files, empty diff -r against registry/<base>/generated/components/date-picker, tsc and next build exit 0; Vite base-nova app tsc -p tsconfig.app.json exit 0; version.txt 0.1.1, Month rtl arrows flipped, Introduction at #v0.1.1 live; scratch apps /private/tmp/claude-501/dp-v011-{base,radix,aria,vite} deleted; milestone worktree and branch removed

Task 4 (head of main 2cf6e6ff08e5b3e824f04e4b8abdc41fdb4088eb):
- Check: merge, `git merge --no-ff origin/date-picker-v0-1-1` on main at c42b8bb: pass (2cf6e6f, 16 files, no conflict, worktree ff to 2cf6e6f)
- Check: install, `pnpm install --frozen-lockfile` at 2cf6e6f: pass (exit 0)
- Check: lint, `pnpm lint` at 2cf6e6f: pass (exit 0)
- Check: types, `pnpm typecheck` at 2cf6e6f: pass (exit 0)
- Check: registry, `pnpm registry:check` at 2cf6e6f: pass (exit 0)
- Check: tests base, `pnpm test --base base` at 2cf6e6f: pass (7 files, 39 tests)
- Check: tests radix, `pnpm test --base radix` at 2cf6e6f: pass (7 files, 39 tests)
- Check: tests aria, `pnpm test --base aria` at 2cf6e6f: pass (7 files, 39 tests, no rerun)
- Check: site build, `pnpm storybook:build` at 2cf6e6f: pass (exit 0, version.txt 0.1.1)
- Check: CI, `gh run list -R anindosarker/shadcn-date-picker --branch main` run 45298282527 at 2cf6e6f: pass (completed, success)
- Check: tag, `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker 'v0.1.1*'`: pass (one tag, refs/tags/v0.1.1^{} 2cf6e6ff08e5b3e824f04e4b8abdc41fdb4088eb)
- Check: old tag kept, `git ls-remote --tags https://github.com/anindosarker/shadcn-date-picker 'v0.1.0*'`: pass (refs/tags/v0.1.0^{} 908300d075125711350b6002b20131a33d710de6)
- Check: release, `gh release view v0.1.1 -R anindosarker/shadcn-date-picker --json tagName --jq .tagName`: pass (v0.1.1)

Verifier (milestone Date picker v0.1.1, head 0b45dec):
- Check: verifier owned files, `git diff --name-only origin/main...HEAD` at 0b45dec: pass (16 files, all in spec 2.1)
- Check: verifier approved folder, `diff -r test-projects/next-app/components/date-picker registry/base/components/date-picker` at 0b45dec: pass (only utils/values.ts: IgnoredProp and ignored() gone, two callers yield undefined; components/period-views.tsx: className="rtl:rotate-180" on the two GridHeader chevrons)
- Check: verifier three bases, `git diff origin/main -- 'registry/*/components/date-picker/*'` at 0b45dec: pass (same two hunks on base, radix, aria; values.ts identical on the three bases; generated copies match)
- Check: verifier no warning, `grep -rn -E 'process\.|IgnoredProp|ignored\(' registry/*/components/date-picker registry/*/generated` at 0b45dec: pass (no output)
- Check: verifier registry, `pnpm registry:build` then `git status --short` then `pnpm registry:check` at 0b45dec: pass (status clean, check exit 0)
- Check: verifier stock calendar, `grep -c 'ref={ref}' registry/base/components/ui/calendar.tsx` at 0b45dec: pass (0)
- Check: verifier arrow class, `grep -c 'rtl:rotate-180'` period-views.tsx per base at 0b45dec: pass (2, 2, 2)
- Check: verifier play, stories/Options.stories.tsx IgnoredLimits at 0b45dec: pass (expects console.error not called with "DatePicker:", keeps November 1st, 2026 enabled under the bad min and step)
- Check: verifier tests base, `pnpm test --base base` at 0b45dec: pass (7 files, 39 tests)
- Check: verifier tests radix, `pnpm test --base radix` at 0b45dec: pass (7 files, 39 tests)
- Check: verifier tests aria, `pnpm test --base aria` at 0b45dec: pass (7 files, 39 tests)
- Check: verifier lint, typecheck, storybook:build: tracker lines exist at 0b45dec, not rerun
- Check: verifier texts at 0b45dec: pass (README and Introduction.mdx 3 commands at #v0.1.1 each, 0 v0.1.0; README Base UI note before Radix UI, two lines, issues/9401 once; props row "A limit in another format is ignored."; package.json 0.1.1)
- Check: verifier captures, `git ls-tree origin/claude/review reference/q149-calendar-library/rtl/after/`: pass (8 files; month-single-390 compared with spec 78 capture by eye, arrows flipped)

Task 5 (tag v0.1.1, 2cf6e6ff08e5b3e824f04e4b8abdc41fdb4088eb; clone main at 2cf6e6f):
- Check: install base, fresh Next.js app (`pnpm dlx shadcn@latest create -t next -b base -p nova --no-monorepo`, style base-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#v0.1.1` at 2cf6e6f: pass (35 files created, button skipped as identical)
- Check: files base, `find components/date-picker -type f | wc -l` at 2cf6e6f: pass (22)
- Check: diff base, `diff -r components/date-picker registry/base/generated/components/date-picker` at 2cf6e6f: pass (no output)
- Check: build base, `pnpm exec tsc --noEmit` and `pnpm exec next build` with one page rendering controlled `<DatePicker type="date" />` and `<DatePicker type="date" range />` at 2cf6e6f: pass (both exit 0, route / static)
- Check: install radix, fresh Next.js app (`pnpm dlx shadcn@latest create -t next -b radix -p nova --no-monorepo`, style radix-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-radix#v0.1.1` at 2cf6e6f: pass (35 files created, button skipped as identical)
- Check: files radix, `find components/date-picker -type f | wc -l` at 2cf6e6f: pass (22)
- Check: diff radix, `diff -r components/date-picker registry/radix/generated/components/date-picker` at 2cf6e6f: pass (no output)
- Check: build radix, `pnpm exec tsc --noEmit` and `pnpm exec next build` with the same page at 2cf6e6f: pass (both exit 0, route / static)
- Check: install aria, fresh Next.js app (`pnpm dlx shadcn@latest create -t next -b aria -p nova --no-monorepo`, style aria-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-aria#v0.1.1` at 2cf6e6f: pass (34 files created, button skipped as identical)
- Check: files aria, `find components/date-picker -type f | wc -l` at 2cf6e6f: pass (22)
- Check: diff aria, `diff -r components/date-picker registry/aria/generated/components/date-picker` at 2cf6e6f: pass (no output)
- Check: build aria, `pnpm exec tsc --noEmit` and `pnpm exec next build` with the same page at 2cf6e6f: pass (both exit 0, route / static)
- Check: Vite before (card Q166, at #v0.1.0): "stock shadcn init --template vite --base base --preset nova, shadcn add anindosarker/shadcn-date-picker/date-picker-base#v0.1.0, tsc --noEmit -p tsconfig.app.json exits 2 with TS2591 Cannot find name 'process'"
- Check: Vite app, `pnpm dlx shadcn@latest init --template vite --base base --preset nova --no-monorepo -n dp-v011-vite` then `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-base#v0.1.1` at 2cf6e6f: pass (style base-nova, 35 files created, button skipped as identical, 22 files in src/components/date-picker, `grep -rn process src/components/date-picker` 0 lines)
- Check: Vite types, `pnpm exec tsc --noEmit -p tsconfig.app.json` at 2cf6e6f: pass (exit 0; tsconfig.app.json types stay ["vite/client"])
- Check: Vite no Node types added, `grep -c '@types/node' package.json` at 2cf6e6f: 1, not 0 (the stock vite template already has "@types/node": "^24" in devDependencies for vite.config.ts before the add; the add changed package.json by date-fns and react-day-picker only, no @types/node added, and tsconfig.app.json does not load Node types)
- Check: Vercel, `gh api repos/anindosarker/shadcn-date-picker/commits/2cf6e6ff08e5b3e824f04e4b8abdc41fdb4088eb/status`: pass (success, context Vercel)
- Check: live version, python3 urllib on https://date-picker.shadcn-table.com/version.txt at 2cf6e6f: pass (200, 0.1.1)
- Check: live rtl arrows, headless chromium on https://date-picker.shadcn-table.com/base/iframe.html?id=types-month--single with `dir="rtl"` set on the preview document, popup opened: pass (Previous year and Next year chevrons class `rtl:rotate-180`, computed rotate 180deg, transform none, direction rtl)
- Check: live Introduction, headless chromium on https://date-picker.shadcn-table.com/base/iframe.html?id=introduction--docs&viewMode=docs: pass (base, radix, aria install commands, each with #v0.1.1; no console error; browser closed)
- Check: scratch apps, `ls -d /private/tmp/claude-501/dp-v011-*`: pass (none)
- Check: clean-up, `git worktree remove` of shadcn-date-picker.worktrees/date-picker-v0-1-1 (only ignored node_modules and storybook-static left; plain remove succeeded), `push origin --delete date-picker-v0-1-1`, `branch -d date-picker-v0-1-1`, `worktree prune`: pass; `git -C shadcn-date-picker status --short`: pass (empty); worktree date-picker-docs-vercel-proof left untouched
