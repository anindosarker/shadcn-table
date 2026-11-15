# 46: Live demo with ten columns, tracker

Status: merged (5054cf80)
Branch `v0.9/live-demo-ten-columns`, worktree 08
Checks:
- Check: copies identical, `diff -r examples/base/live-demo examples/radix/live-demo` and `aria` at 826b2d55: pass (no output)
- Check: docs types, `pnpm --filter shadcn-table-docs types:check` at 826b2d55: pass
- Check: production build, `pnpm --filter shadcn-table-docs build` at 826b2d55, served by `next start -p 5349` (stopped): pass
- Check: docs E2E base, `pnpm test docs-e2e --base base --url http://localhost:5349` at 6cd6b814: pass (getting-started 245, api 109, guides 701, examples 939, 0 failed)
- Check: docs E2E radix, `pnpm test docs-e2e --base radix --url http://localhost:5349` at 6cd6b814: pass (0 failed)
- Check: docs E2E aria, `pnpm test docs-e2e --base aria --url http://localhost:5349` at 6cd6b814: pass (0 failed)
- Check: new docs E2E checks on usage and introduction, three bases: "live-demo: ten columns in order", "live-demo: scrolls sideways at 1280 px" (scrollWidth=1560 clientWidth=644), "select filter (Department) filters rows" rows=6, "range filter (Salary) filters rows" rows=8: pass
- Check: screenshots, 1280 px, dark, at 6cd6b814: /Users/anindosarker/Work/Personal/React-table/shadcn-react-table.worktrees/08/test/.out/spec46-shots/{base,radix,aria}-{usage,introduction}.png
- Check: typecheck, `pnpm test typecheck --base base` at e45b5a40: pass
- Check: lint, `pnpm test lint` at e45b5a40: pass (9 warnings, none in owned files)
- Check: validate-repo, `pnpm test validate-repo` at e45b5a40: pass (registry fresh, generated example copies are git-ignored)
- Check (verifier): typecheck, lint, validate-repo at e45b5a40 stay valid (only .ai/ changed since); not rerun
- Check (verifier): copies identical, both `diff -r` lines of 1.2 at 0e16b1dd: pass (no output)
- Check (verifier): production build, `pnpm --filter shadcn-table-docs build` at 0e16b1dd, served by `next start -p 5349` (stopped): pass
- Check (verifier): docs E2E base, `pnpm test docs-e2e --base base --url http://localhost:5349` at 0e16b1dd: pass (getting-started 245, api 109, guides 701, examples 939, 0 failed)
- Check (verifier): docs E2E radix, `pnpm test docs-e2e --base radix --url http://localhost:5349` at 0e16b1dd: pass (same counts, 0 failed)
- Check (verifier): docs E2E aria, `pnpm test docs-e2e --base aria --url http://localhost:5349` at 0e16b1dd: pass (same counts, 0 failed)
- Check (verifier): Acceptance 1.2 at 0e16b1dd, three bases: ten columns in order, scrolls sideways (scrollWidth=1560 clientWidth=629), Department rows=6, Salary rows=8: pass; P11 not applicable (a feature, no fix play)
- Check (verifier): files changed since merge base match Files owned plus tracker and CHANGELOG.md: pass

- Task 1 The data and the columns: done (826b2d55)
- Task 2 The helper: done (6cd6b814)
- Task 3 Regenerate, format, changelog: done (e45b5a40)

## Attention

- City, Department and Salary got lucide icons (Building2Icon, BriefcaseIcon, BanknoteIcon) like every other demo column, though spec 1.6.2 names an icon only for Email.
