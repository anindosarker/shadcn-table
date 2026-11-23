# 80: Date picker first tag, tracker

Status: running
Branch `date-picker-first-tag` (removed after task 4: worktree, local and remote branch deleted; clone on main 908300d)
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
- Check: install aria, fresh Next.js app (`shadcn create -t next -b aria -p nova`, style aria-nova), `pnpm dlx shadcn@latest add anindosarker/shadcn-date-picker/date-picker-aria#v0.1.0` at tag v0.1.0 (908300d): pass (34 files created, button skipped as identical)
- Check: files aria, `find components/date-picker -type f | wc -l` at v0.1.0 (908300d): pass (22)
- Check: diff aria, `diff -r components/date-picker registry/aria/generated/components/date-picker` (clone main = v0.1.0, 908300d; generated folder per D173): pass (no output)
- Check: build aria, `pnpm exec tsc --noEmit` and `pnpm exec next build` with one page rendering controlled `<DatePicker type="date" />` and `<DatePicker type="date" range />` at v0.1.0 (908300d): pass (both exit 0, route / static)
- Check: deployments, `gh api repos/anindosarker/shadcn-date-picker/deployments?per_page=5`: none listed (empty array, also for environment Production and Preview)
- Check: Vercel status of 908300d, `gh api .../commits/908300d/status`: success, deployment dpl_92mKUgW64oh1pK3mUvHSsy8oYsKU "Deployment has completed"
- Check: deployment target, `vercel inspect dpl_92mKUgW64oh1pK3mUvHSsy8oYsKU`: target preview, Ready, https://shadcn-date-picker-lbpg4u2b9-anindo-sarkers-projects.vercel.app, alias shadcn-date-picker-git-main-anindo-sarkers-projects.vercel.app
- Check: preview public, python3 urllib on <preview>/version.txt at 908300d: fail (redirect to vercel.com/login, Vercel login wall)
- Check: production deployment of 908300d, `vercel ls shadcn-date-picker --environment production`: none (only production deployment dpl_F3JtxETRT8GogN4K719MFoH2JE6x, created 2 hours before the 908300d build, so not 908300d)
- Check: domain, python3 urllib on https://date-picker.shadcn-table.com/version.txt, /, /base/, /radix/, /aria/: fail (all HTTP 404)
- Check: DNS, `dig +short date-picker.shadcn-table.com`: in place (7c01400999e33fe7.vercel-dns-017.com., 64.29.17.1, 216.198.79.1)
- Check: clean-up, `git -C shadcn-date-picker worktree list | wc -l`: pass (1); `status --short`: pass (empty); branch date-picker-first-tag deleted locally and on origin

- Task 1 README: done (e27727e, merged into main as 908300d "merge: date-picker-first-tag (80)"; no workflow run). Per-base calendar sentence: Base UI and Radix UI use the style's calendar part, React Aria brings its own react-day-picker day calendar with the nova calendar classes (D168).
- Task 2 tag and release: annotated tag v0.1.0 on 908300d pushed; GitHub release v0.1.0 (https://github.com/anindosarker/shadcn-date-picker/releases/tag/v0.1.0), notes = one line per base plus the README install section.
- Task 3 install proofs: done at tag v0.1.0 (908300d); base, radix, aria each pass install, 22 files, empty diff -r against registry/<base>/generated/components/date-picker (D173), tsc and next build exit 0; scratch apps /private/tmp/claude-501/dp-tag-{base,radix,aria} deleted.
- Task 4 live reads: not run; the build of 908300d is a Vercel preview behind login and no production deployment of it exists; the domain answers 404 (Q163). Clean-up done.

## Attention

- The site date-picker.shadcn-table.com does not show the library because Vercel treats main as a preview; the project's production branch has to be set to main (Q163).
- RESUME 80 from the lead, 2026-11-24: Q163 fixed (Vercel production branch is main, the site answers 200, version.txt 0.1.0). D174: two README lines under React Aria, then the live reads.
