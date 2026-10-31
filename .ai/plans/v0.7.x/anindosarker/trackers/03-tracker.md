# 03: table instance atoms, tracker

Status: running
Branch `v0.7/library-sweep`, worktree `library-sweep`, PR #72 (workstream S1)
Gates: see 02-tracker.md

- Verifier at 2172c9a0: spec 03 Acceptance rerun green, `pr.yml` red on the merge ref (02-tracker.md gates and Attention)
- Milestone 01 base: done (ba367b60)
- Milestone 02 radix and aria copies: done (ba367b60)
- `eslint --rule '{"react-hooks/refs":"error"}'` on the three `useST_TableInstance.ts` at ba367b60: 0 problems (the file lints clean under the full config too); `grep -nE "tableRef|columnDefsRef|table\.store"` empty; three copies byte-identical
- Milestone S1 merge: done (27ad7a70); sets A to D merged (5599c724, 9dda6b63, b0d23112, da9eee9a), docs copies regenerated (ec16ade5), CHANGELOG (d84bd445), set worktrees removed, branches kept

## Attention

- S1 lead: the transition render into a freeze builds the column defs once and holds that build (03 1.6.4 "set to `columns` when `isFrozen` turns true"), where the old ref held the previous render's defs; TanStack gets one new `columns` array at gesture start. Drag and resize stories stay green in the three bases. The new stories measure builds from after the freeze starts: 0 while frozen, 1 at release.
