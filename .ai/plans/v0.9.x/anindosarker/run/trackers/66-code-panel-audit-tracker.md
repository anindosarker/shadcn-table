# 66: Code panels show the table's code, Code panel audit, tracker

Status: done (a7735eb8)
Branch `claude/review`, worktree 08 (read-only)
Checks:
- Check: Storybook base build, `pnpm --filter shadcn-table storybook:build:base` at 55a6150b: pass
- Check: Storybook radix and aria builds, `pnpm --filter shadcn-table storybook:build:radix`, `storybook:build:aria` at 55a6150b: pass
- Check: docs production build, `pnpm --filter shadcn-table-docs build` at 55a6150b: pass
- Check: Code tab read, `node read-panels.mjs storybook <base> --out sb-base.json` at 55a6150b: 645 ids of index.json, 645 rows; pass 22, fail 623; header counts sum to 645
- Check: Code tab read, `read-panels.mjs storybook <radix|aria> --ids first-per-file` at 55a6150b: 85 of 85 equal to base on each
- Check: docs panels read, `node read-panels.mjs docs <next start> --out docs.json` at 55a6150b: 692 pages, all HTTP 200; failing: 603 story pages, 15 guide story items without codeFrom
- Check: sample of 31 ids reread on fresh page loads at 55a6150b: equal
- Check: servers on 5341 and 5342 stopped, `lsof -iTCP:5341,5342 -sTCP:LISTEN`: none; worktree 08 `git status` empty, detached
- Check: `git log -1 --stat` of a7735eb8: audit.md and read-panels.mjs only

- Task 1: done (audit.md Storybook sections and 645 rows)
- Task 2: done (audit.md Docs code panels, six panel kinds, three panels quoted)
- Task 3: done (13 same-table groups, 19 copies, verdict merge; Default and Basic different; Q133 counts one line each)
- Task 4: done (a7735eb8 on claude/review, pushed)

## Attention

## Notes

- Code tab text: manager `?path=/story/<id>`, `[id$="tabpanel-storybook/docs/panel"] pre`; story switched by `history.pushState` plus `popstate`; read after the manager channel's `storyRendered` for the id, then 800 ms without change (args stories replace their source with the transform one-liner after render).
- Run time: base 645 ids 927 s, radix or aria 85 ids about 125 s, docs 692 pages 999 s; a call over the tool limit is called again (resumable).
