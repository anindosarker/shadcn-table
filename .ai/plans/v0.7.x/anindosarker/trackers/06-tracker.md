# 06: tailwind canonical, tracker

Status: running
Branch `v0.7/tailwind-canonical`, worktree tailwind-canonical, PR #[n]
Gates:
- `pnpm check:tailwind` at 337f8f91 + phase 1 (unchanged trees): 67 problems per base, 37 canonical (22 distinct, matches F13) plus 30 physical (20 static plus 10 handle)
- `pnpm --filter shadcn-table lint` at phase 1: green
- `pnpm --filter shadcn-table test:base`, `test:radix`, `test:aria` on Tailwind 4.3.3 at phase 1: green (446 each)

- Phase 01 gate: running
