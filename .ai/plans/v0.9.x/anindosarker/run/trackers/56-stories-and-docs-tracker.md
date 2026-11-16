# 56: Story pairing audit, tracker

Status: running
Branch `v0.9/story-pairing-audit`, worktree 05
Checks:
- Check: rows of lists 1 to 3, `grep -c "^| [0-9]" story-pairing-audit.md` at Task 1 commit: pass (42: exact 0, close 34, no partner 8)
- Check: exact rows name one story each, none twice: pass (list 1 empty; no story shares an example's rows, columns and options, read per example in `examples/base/<name>/` against the stories of its feature)
- Check: list 4 rows, a TypeScript-AST script (scratchpad `stories.mjs`: parses all 81 story files, keys each story by its body without play/name/tags plus meta args and render, resolves renders that only mount another story, groups equal keys per file) at 0b58a168: pass (652 stories, 269 with a play, 59 groups, 80 rows)
- Check: `Basic` RendersRows and `SearchField` OpenCloseAndEscape in list 4: pass (rows 1 and 77)

- Task 1 lists 1 to 3: done, 0b58a168
- Task 2 list 4: running
- Task 3 counts header: planned
