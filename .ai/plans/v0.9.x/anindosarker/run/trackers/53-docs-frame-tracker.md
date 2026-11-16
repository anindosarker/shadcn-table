# 53: Preview lands on review, tracker

Status: running
Branch `v0.9/docs-frame`, worktree 03
Checks:
- Task 1 reference captures, `pnpm --filter shadcn-table-docs build` + `next start -p 5341` at 173444ad (detached): pass; server stopped. EX B sidebar (1440 px): `reference/docs-layout/captures/ref-exb-sidebar-top.png`, `ref-exb-sidebar-collapsed.png` (More examples closed), `ref-exb-sidebar-more-open.png`, `ref-exb-sidebar-more-open-mid.png`, `ref-exb-sidebar-midscroll-stuck.png` (stuck label). Frame: `ref-<page>-<1440|920|390>-<open|hidden>.png`, pages `examples-basic`, `guides-column-pinning`, `api`, `getting-started-introduction` (24 files; at 390 "open" is the drawer)
- Task 6 stuck label, production build at the task 6 commit on 5344, one capture per engine scrolled into the Editing group of `/docs/examples/basic`: `reference/docs-layout/captures/new-stuck-label-chromium.png`, `new-stuck-label-firefox.png`, `new-stuck-label-webkit.png`: pass (label sticks and carries the dashed line in all three; no label marked at scroll top). On the preview the line showed in Chromium only (`scroll-state` container query)

- Task 1 reference captures: planned
- Task 2 merge the preview: planned
- Task 3 remove the demo sections: planned
- Task 4 guides overview list: planned
- Task 5 docs E2E follows the frame: planned
- Task 6 stuck label line in three engines: planned
- Task 7 cleanup: planned
