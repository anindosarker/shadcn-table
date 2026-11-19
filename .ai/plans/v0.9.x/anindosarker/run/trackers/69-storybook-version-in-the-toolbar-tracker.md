# 69: Storybook version in the toolbar (Q138), tracker

Status: running
Branch `v0.9/storybook-toolbar-version`, worktree 07
Checks:
- Red first (P11): `pnpm test storybook-static --base base --ids 0:3` at 5a771cd1 (check alone on the code before the change): fail on that check alone, `FAIL manager toolbar version "v0.9.6": 0 items; title "shadcn-table v0.9.6 (Base UI)" (expected "shadcn-table (Base UI)")`; every other line PASS
- `pnpm test typecheck --base base` at bd104e7d: pass
- `pnpm test storybook-static --base base` at bd104e7d: fail, `manager toolbar version "v0.9.6": no base switcher` (the check's selector `[aria-label="Base"]` missed the Select, whose label is "Base Base UI"); every other line PASS, code tab 626 of 626; selector fixed in c566b7ce
- `pnpm test typecheck --base base` at 707ca3ab: pass
- `pnpm test typecheck --base radix` at 707ca3ab: pass
- `pnpm test typecheck --base aria` at 707ca3ab: pass
- `pnpm test lint` at 707ca3ab: pass (0 errors, 9 warnings, all in apps/shadcn-table-docs/examples, none in this milestone's files)
- `pnpm test validate-repo` at 707ca3ab: pass
- `pnpm test storybook-static --base base` at 707ca3ab: pass, `PASS manager toolbar version "v0.9.6"`, code tab 626 of 626
- Browser look, base static build of bd104e7d served on 5350 (stopped), Chromium: desktop 1400x900 toolbar reads reload, measure, outline, viewport, vision, theme, `Base UI` switcher, `v0.9.6`, then right side isolation, zoom, full screen; `v0.9.6` sits right after the switcher, link `https://github.com/anindosarker/shadcn-table/releases`, `target=_blank`, `rel=noopener noreferrer`; sidebar title `shadcn-table (Base UI)`. Phone 390x844: same left group, `Base UI` and `v0.9.6` both visible side by side; Storybook itself drops the full screen button at phone width (its isMobile rule) and the right group (isolation, zoom) runs past the edge of the toolbar; the base switcher and the version behave the same, neither hidden; the sidebar is behind the bottom menu at phone width

- Task 1 Storybook version in the toolbar: 707ca3ab

## Attention

- Repo URL: the Storybook config had no exported repo URL a manager file could reuse (preview.tsx keeps a private stories-tree URL), so version-tool.ts holds `RELEASES_URL = 'https://github.com/anindosarker/shadcn-table/releases'` itself.
