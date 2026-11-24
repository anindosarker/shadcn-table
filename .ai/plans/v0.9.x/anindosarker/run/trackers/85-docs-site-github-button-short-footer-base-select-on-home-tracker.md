# 85: Docs site: GitHub button, short footer, base select on home, tracker

Status: done
Merge: 0c007cfe3901ef5a8b6e0b264d60be3e295055b7 (merge: date-picker-docs-site-d181 (85)) on main of anindosarker/shadcn-date-picker
Branch `date-picker-docs-site-d181`, worktree /Users/anindosarker/Work/Personal/React-table/shadcn-date-picker.worktrees/date-picker-docs-site-d181
Checks:
- Check: docs lint, `pnpm --filter docs lint` (heavy.sh) at eee77f9: pass (exit 0, 0 errors, the 1 warning of plan 4.3 on app/layout.tsx)
- Check: docs types, `pnpm --filter docs types:check` (heavy.sh) at eee77f9: pass (exit 0)
- Check: docs build, `pnpm --filter docs build` (heavy.sh) at eee77f9: pass (exit 0)
- Check: root lint, `pnpm lint` (heavy.sh) at eee77f9: pass (exit 0, eslint and prettier --check)
- Check: storybook build, `pnpm storybook:build` (heavy.sh, the storybook service's build command of vercel.json) at 78749ba: pass (exit 0; storybook-static/storybook/ with index.html, base, radix, aria; eee77f9 changes docs/ only)
- Check: local production read, `next start` of the docs build on 5356 and `python3 -m http.server 5357` on storybook-static, Playwright Chromium 1440 light, at eee77f9: pass; `/` 200 title "shadcn-date-picker: Date Picker for shadcn/ui"; `/docs/install` 200 "Install | shadcn-date-picker"; `/docs/date` 200 "Date | shadcn-date-picker", day picked "2026-11-21" to "2026-11-22"; `/storybook/base/`, `/storybook/radix/`, `/storybook/aria/` 200 each "Introduction - Docs ⋅ Storybook"; 0 console errors on each
- Check: code panel on `/docs/date` at eee77f9: pass (the "Open example" group holds one child, an `<a>` named "Open in GitHub" to docs/demos/date.tsx on GitHub; `[aria-label="More actions"]` count 0; at 390 the label is sr-only, the icon stays on the mode row)
- Check: footer on `/` and on `/no-such-page-d181` (404, title "Page not found | shadcn-date-picker") at eee77f9: pass (links exactly `//shadcn-date-picker` to `/`, GitHub to https://github.com/anindosarker/shadcn-date-picker, Storybook to `/storybook/`; text exactly "MIT licensed. Built on shadcn/ui."; the 404 page logs only the browser's own 404 line for the document, no app error)
- Check: home header base select at eee77f9: pass (header holds the "Base" select, showing "Base UI")
- Check: servers stopped, `kill` of pids 66164, 22801 and the pnpm parents, then `lsof -nP -iTCP:5356 -sTCP:LISTEN` and 5357: pass (prints nothing)
- Check: captures, 1440 and 390 light, home footer, 404 footer, code panel: reference/q149-calendar-library/docs-site/d181-*.png (6 files)

- Check: merge gate, origin/main ancestor of origin/date-picker-docs-site-d181 at eee77f9: yes, no remerge needed; builder checks green at eee77f9
- Check: deployment of 0c007cf, `gh api repos/anindosarker/shadcn-date-picker/commits/0c007cf/status`: success (Vercel success)
- Check: CI of 0c007cf, `gh run list -R anindosarker/shadcn-date-picker --branch main`: run 45332593946 completed success
- Check: live `/` at 0c007cf, Playwright Chromium 1440 light: 200, title "shadcn-date-picker: Date Picker for shadcn/ui", 0 console errors, short footer (links `//shadcn-date-picker` to `/`, GitHub, Storybook to `/storybook/`; "MIT licensed. Built on shadcn/ui.")
- Check: live `/docs/install` at 0c007cf: 200, title "Install | shadcn-date-picker", 0 console errors
- Check: live `/docs/date` at 0c007cf: 200, title "Date | shadcn-date-picker", 0 console errors; day picked "2026-11-21" to "2026-11-22"; code panel group holds one `<a>` "Open in GitHub" to docs/demos/date.tsx; "More actions" count 0
- Check: live `/storybook/base/` at 0c007cf: 200, title "Introduction - Docs ⋅ Storybook", 0 console errors
- Check: live `/storybook/radix/` at 0c007cf: 200, title "Introduction - Docs ⋅ Storybook", 0 console errors
- Check: live `/storybook/aria/` at 0c007cf: 200, title "Introduction - Docs ⋅ Storybook", 0 console errors
- Check: live `/version.txt` at 0c007cf: 200, body "0.1.1", 0 console errors
- Check: live `/no-such-page-m85` at 0c007cf: 404, title "Page not found | shadcn-date-picker", short footer same as `/`, only the browser's own 404 line in the console
- Check: cleanup, `git worktree remove` of the d181 worktree, branch date-picker-docs-site-d181 deleted locally and on origin: pass
- Task 1 D181: code panel GitHub button, short footer on home and 404, base select stays on the home header: done (eee77f9)

Notes:
- Plan lines first: 7ed095bae (rows 40, 60, the footer row of 1.2, 6.4), 05be59432 (the label below sm).
- The footer has no Dune, so it takes a dashed top rule in its place (plan 6.4).
