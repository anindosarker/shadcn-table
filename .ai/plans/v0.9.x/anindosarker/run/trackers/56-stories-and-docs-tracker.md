# 56: Story pairing audit, tracker

Status: running
Branch `v0.9/story-pairing-audit`, worktree 05
Checks:
- Check: rows of lists 1 to 3, `grep -c "^| [0-9]" story-pairing-audit.md` at Task 1 commit: pass (42: exact 0, close 34, no partner 8)
- Check: exact rows name one story each, none twice: pass (list 1 empty; no story shares an example's rows, columns and options, read per example in `examples/base/<name>/` against the stories of its feature)

- Task 1 lists 1 to 3: running
- Task 2 list 4: planned
- Task 3 counts header: planned
