# 13: Docs parts carry the design-system hooks, tracker

Status: running
Branch `v0.9/docs-parts-hooks`, worktree 06
Checks:
- `pnpm test docs-e2e --base base /docs/guides/view-settings` on the shipped parts (P11), checks at Task 1 commit, parts at 870c5608: red as expected: `style changes menus` FAIL (item padding 4px 32px 4px 6px gap 6px unchanged after Sera), `menu color inverts` FAIL (dark=false); `menu accent bold` PASS (see Attention)

- Task 1 Reproduce: running

## Attention

- `menu accent bold` passes on the shipped parts: Menu Accent is a token swap (`--accent` = `--primary`, config.ts:411) that `focus:bg-accent` already consumes without any hook, so it cannot be red there (P11). Kept as a guard. The spec's `style changes menus` measure (content border-radius and box-shadow) also passed on the shipped parts, because a Style pick sets `--radius` too; the check reads the first item's padding and gap instead (set only by the `.cn-*` layer).
