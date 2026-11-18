# 56: Story group names, tracker

Status: done (8215fa6)
Branch `v0.9/story-group-names`, worktree 08
Checks:
- Check: Task 1 title checks (grep count 0, segment regex, 81 unique titles, ls stories), at cb9163b1: pass
- Check: Task 2 ids, `pnpm --filter shadcn-table storybook:build:base` then 33 map ids and STORY_ID in index.json, at 9380ced1: pass
- Check: eslint on preview.tsx, stories, storybook-map.ts, at 9380ced1: pass
- Check: `pnpm test storybook-tests --base base` at 2bf6ce44: pass (652)
- Check: `pnpm test storybook-tests --base radix` at 2bf6ce44: pass (652)
- Check: `pnpm test storybook-tests --base aria` at 2bf6ce44: pass (652) on rerun; first run failed ClickToCopy "Click Copies Value" only (P5 load flake)
- Check: `pnpm test storybook-static --base base` at 2bf6ce44: pass
- Check: `pnpm test typecheck --base radix` at 2bf6ce44: pass
- Check: `pnpm test lint` at 2bf6ce44: pass
- Check: `pnpm test docs-e2e --base base` at 2bf6ce44: pass
- Check (verifier): `pnpm test typecheck --base base` at 2bf6ce44: pass (tsc clean)
- Check (verifier): `pnpm test typecheck --base aria` at 2bf6ce44: pass (tsc clean)
- Check (verifier): `pnpm test validate-repo` at 2bf6ce44: pass (registry valid and fresh, 40 unit tests); tree clean after
- Check (verifier): `pnpm test docs-e2e --base radix` at 2bf6ce44: pass (110 pages, examples 941 passed)
- Check (verifier): `pnpm test docs-e2e --base aria` at 2bf6ce44: pass (110 pages, examples 941 passed); no server left on 5340 to 5360 from worktree 08
- Check (verifier): Acceptance 1.2 rerun at 2bf6ce44, the parts this milestone can meet: storybook-tests all bases, validate-repo and docs-e2e all bases green (lines above); the 33 ids of `lib/storybook-map.ts` (14 unique) and `STORY_ID` are all in `storybook-static/base/index.json`: pass. Parity check 1.6.5, 42 pages with an exact-pair id, the judged text and "More examples" checks belong to later milestones of the epic (audit lists 0 exact pairs today): not applicable here

- Task 1 titles and directory: done, cb9163b1
- Task 2 ids that follow: done, 9380ced1
- Task 3 cleanup: done, 2bf6ce44

## Attention

- Group names decided by the coder where D106 gives no example: "AppBar overlaps with Fullscreen Modal" became "App Bar Overlaps With Full Screen Modal" (matches the "Full Screen" group), "Click to Copy" became "Click To Copy", "RTL" and "Custom Filter Fns" kept as is.
