# 07: comments and dead code, tracker

Status: running
Branch `v0.7/library-sweep`, worktree `library-sweep`, PR #72 (workstream S1)
Gates: see 02-tracker.md

- Milestone 1 menus on the foundation hook: done (set C ff32d364)
- Milestone 2 comment sweep per file set: done (set A 90487682, set B 77a0eba8, set C ff32d364, set D cde17938); the F16 range slider note deleted in the three bases at c06bd679 (the four guards stay)
- Milestone S1 merge: done (27ad7a70); sets A to D merged (5599c724, 9dda6b63, b0d23112, da9eee9a), docs copies regenerated (ec16ade5), CHANGELOG (d84bd445), set worktrees removed, branches kept

## Attention

- S1 merge: `shared/utils/style.utils.ts` still named MUI Collapse in its keyframe comment in all three bases (no set rewrote it); 27ad7a70 rewrites it to state the contract only, so the 07 Acceptance grep is empty.
