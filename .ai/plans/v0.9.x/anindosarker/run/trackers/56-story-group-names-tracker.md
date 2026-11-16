# 56: Story group names, tracker

Status: running
Branch `v0.9/story-group-names`, worktree 08
Checks:
- Check: Task 1 title checks (grep count 0, segment regex, 81 unique titles, ls stories), at cb9163b1: pass
- Check: Task 2 ids, `pnpm --filter shadcn-table storybook:build:base` then 33 map ids and STORY_ID in index.json, at 9380ced1: pass
- Check: eslint on preview.tsx, stories, storybook-map.ts, at 9380ced1: pass

- Task 1 titles and directory: done, cb9163b1
- Task 2 ids that follow: done, 9380ced1
- Task 3 cleanup: done, 2bf6ce44

## Attention

- Group names decided by the coder where D106 gives no example: "AppBar overlaps with Fullscreen Modal" became "App Bar Overlaps With Full Screen Modal" (matches the "Full Screen" group), "Click to Copy" became "Click To Copy", "RTL" and "Custom Filter Fns" kept as is.
