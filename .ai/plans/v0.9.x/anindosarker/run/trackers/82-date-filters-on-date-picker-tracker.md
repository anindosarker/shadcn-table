# 82: Date filters on the date picker, tracker

Status: running
Branch `v0.9/date-filters-on-date-picker`, worktree 06
Checks:

- Check: the is-empty play on the shipped code (P11), `ST_BASE=base pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 36ca2818 with the play in the working tree: fail as intended (`Clear Empty Returns Date Default Mode`: expected `Filter Mode: Equals`, received `JoinedFilter Mode: Fuzzy`; 1 failed, 13 passed)
- Check: `ST_BASE=base|radix|aria pnpm exec vitest run stories/features/DateFilters.stories.tsx` at 6dcd219e with the play: pass (14 passed on base, radix, aria)

- Task 1 the is-empty reset: running
