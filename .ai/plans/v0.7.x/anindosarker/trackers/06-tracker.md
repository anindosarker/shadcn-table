# 06: tailwind canonical, tracker

Status: running
Branch `v0.7/library-sweep`, worktree `library-sweep`, PR #72 (workstream S1)
Gates: see 02-tracker.md

- Milestone 1 class edits per file set: done (set A 90487682, set B 77a0eba8, set C ff32d364, set D cde17938)
- Baseline: `reference/06-<base>-<view>-<theme>.png` (views `resize-handle`, `pinned-columns`, `toolbar`, `header-shadows`, `ltr`; themes `light`, `dark`; 30 files) taken with `reference/06-capture.mjs` from Storybook dev at 48c0e7e8; `check:tailwind` baseline 66 per base (36 canonical, 22 distinct, 30 physical), see 02-tracker.md
- Milestone S1 merge: done (27ad7a70); sets A to D merged (5599c724, 9dda6b63, b0d23112, da9eee9a), docs copies regenerated (ec16ade5), CHANGELOG (d84bd445), set worktrees removed, branches kept
- Final milestone judged captures and computed-style spot check at c06bd679: same position, same visible shadow; `z-index: 2`, `min-height: 100px` in the three bases (02-tracker.md gates)

## Attention

- S1 merge: the CHANGELOG direction line names `inset-s-` and `inset-e-` instead of 1.6.1's `start-` and `end-`, since Tailwind 4.3.3 canonicalizes those and the sets use the inset forms.
