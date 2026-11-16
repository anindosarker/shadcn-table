# 53: Preview lands on review, tracker

Status: waiting (lead: merge into `v0.9/docs-layout` per D109, never `claude/review`; the run's merge step still names `claude/review`)
Branch `v0.9/docs-frame`, worktree 03
Checks:
- Task 1 reference captures, `pnpm --filter shadcn-table-docs build` + `next start -p 5341` at 173444ad (detached): pass; server stopped. EX B sidebar (1440 px): `reference/docs-layout/captures/ref-exb-sidebar-top.png`, `ref-exb-sidebar-collapsed.png` (More examples closed), `ref-exb-sidebar-more-open.png`, `ref-exb-sidebar-more-open-mid.png`, `ref-exb-sidebar-midscroll-stuck.png` (stuck label). Frame: `ref-<page>-<1440|920|390>-<open|hidden>.png`, pages `examples-basic`, `guides-column-pinning`, `api`, `getting-started-introduction` (24 files; at 390 "open" is the drawer)
- Task 6 stuck label, production build at the task 6 commit on 5344, one capture per engine scrolled into the Editing group of `/docs/examples/basic`: `reference/docs-layout/captures/new-stuck-label-chromium.png`, `new-stuck-label-firefox.png`, `new-stuck-label-webkit.png`: pass (label sticks and carries the dashed line in all three; no label marked at scroll top). On the preview the line showed in Chromium only (`scroll-state` container query)
- Task 7 milestone frame captures, production build at 560d2960: `reference/docs-layout/captures/new-<page>-<1440|920|390>-<open|hidden>.png`, same pages as the `ref-` set (24 files), pair by name: pass
- `pnpm format` at 97a837cb: no diff
- `pnpm test typecheck --base radix` at 97a837cb: pass (tsc clean)
- `pnpm test lint` at 97a837cb: pass (0 errors, 9 warnings)
- `pnpm test validate-repo` at 97a837cb: pass (40 unit tests, registry fresh, no tracked file changed)
- `pnpm --filter shadcn-table-docs build` at 97a837cb: pass
- `pnpm test docs-e2e --base radix` at 97a837cb: pass (110 pages, examples 941 passed, 0 failed); server stopped. Bases base and aria left to the verifier
- Task 1 reference captures: f517d677
- Task 2 merge the preview: a2b70b5d
- Task 3 remove the demo sections: 4b86658e
- Task 4 guides overview list: 4412dd91
- Task 5 docs E2E follows the frame: 1e4156c2
- Task 6 stuck label line in three engines: 68e07f79
- Task 7 cleanup: 97a837cb

## Attention
- Built and checked, not merged. D109 sends every E14 milestone into `v0.9/docs-layout`, never `claude/review`; this run's merge step predates D109 and still names `claude/review`. The lead merges `v0.9/docs-frame` into `v0.9/docs-layout` (`merge: Preview lands on review (53)`). The branch was cut from 8ba6b03c (`claude/review`), not from `origin/v0.9/docs-layout`; the merge base with `docs-layout` is 8ba6b03c, so the merge brings only spec 53 work plus the preview.
