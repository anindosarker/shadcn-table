# Dev server clean (F11), tracker

Status: merged (0d95960c)
Files owned: `apps/shadcn-table-docs/components/theme-customizer.tsx`, `apps/shadcn-table-docs/app/layout.tsx`, `apps/shadcn-table-docs/components/search-dialog.tsx` (new)
Depends on: none
Branch `v0.9/fix-dev-server-clean`, worktree 04
Checks:
- Check: red on the shipped code (P11), `PORT=5345 pnpm --filter shadcn-table-docs dev`, headless playwright loads `/`, `/docs`, `/docs/examples/basic` at efd2717a: fail as expected, two logs:
  - server, GET `/`: `[TanStack Hotkeys] A hotkey label was formatted during server rendering without a platform, so it uses 'linux'.` (the theme panel's `format(...)` calls run in `ThemeCustomizer` while it builds the closed `SheetContent` children, so the server formats every kbd hint)
  - browser, `/`, theme panel opened as soon as its button exists: `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`, attribute `aria-hidden="true"` / `data-aria-hidden="true"` on fumadocs' `DefaultSearchDialog` backdrop and footer (closed dialog rendered into the server HTML inside a late-hydrating Suspense boundary; the modal Sheet hides it before it hydrates). The plain three loads, a Mac user agent and a reload with a stored theme choice log nothing in the browser.
- Check: green, same dev server and three loads plus the scenarios (Mac UA, stored choice reload, early panel open) at de62f9eb: pass, server log holds only the GET lines, browser logs no error or warning; panel kbd hints render (`⇧ R`, `P`, `R`, `C` on Mac UA), `Meta+K` opens search
- Check: `pnpm --filter shadcn-table-docs types:check` at de62f9eb: pass
- Check: `pnpm --filter shadcn-table-docs lint` at de62f9eb: pass, 0 errors, 9 warnings (examples, untouched files); the three changed files lint clean
- Check: format, `pnpm exec prettier --check` on the three changed files and `CHANGELOG.md` at f58201a2: pass
- Check: Acceptance, `pnpm test docs-e2e --base base` at f58201a2: pass, 1923 passed, 0 failed, 107 pages
- Check: verifier, D20 Acceptance rerun, `PORT=5346 pnpm --filter shadcn-table-docs dev`, headless playwright loads `/`, `/docs`, `/docs/examples/basic` plus `/` with Mac UA and theme panel opened at first paint, at 464ba1a7: pass, server log holds no TanStack Hotkeys line, browser logs no error, warning or hydration mismatch
- Check: verifier, `pnpm test docs-e2e --base base` at 464ba1a7: pass, 1923 checks, 107 pages, 0 failed
- Check: verifier, `pnpm test typecheck --base radix` at 464ba1a7: pass, tsc clean
- Check: verifier, `pnpm test lint` at 464ba1a7: pass, 0 errors, 9 warnings (examples, untouched files)
- Check: verifier, `pnpm test validate-repo` at 464ba1a7: pass, bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests

- Task 1 Reproduce on the shipped code: done at efd2717a
- Task 2 Theme panel kbd hints format only in the browser: done (fea054ee)
- Task 3 Search dialog renders only in the browser (home page hydration mismatch): done (de62f9eb)
- Task 4 CHANGELOG line (P9): done (f58201a2)

## Attention

- The hydration mismatch reproduces only when a modal opens before the search dialog's Suspense boundary hydrates (here: the theme panel clicked at first paint); a plain headless load of `/` does not log it. Fixed at that root cause; if the owner still sees it on a plain load, a browser extension adding attributes is the remaining candidate.
- Hotkeys fix uses the library's "render the labels only in the browser" option, not `detectPlatform(userAgent)` on the provider: the labels live only in the theme panel, which mounts only while open.

## Notes

- The interrupted attempt's three edits were kept as they were: each serves D20 and no other change was needed.
- No library copies were regenerated; no generated file touched.
