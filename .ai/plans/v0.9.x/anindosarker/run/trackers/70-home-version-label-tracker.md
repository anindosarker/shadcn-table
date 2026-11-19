# 70: Home page version label, tracker

Status: running
Branch `v0.9/home-page-version-label`, worktree 06
Checks:
- Red: docs-e2e, `pnpm test docs-e2e --base base / /nope` at 1c5f6dc9 (checks only, before the cherry-pick): fail, `FAIL / @1440 home header version v0.9.7: []`, `FAIL / @1440 home header version at 390 v0.9.7: []`, `FAIL /nope @1440 404: header version v0.9.7: []`, `FAIL /nope @1440 404: header version at 390 v0.9.7: []`, the only 4 fails of 99
- Check: cherry-pick diff, `git diff 93405e6e HEAD -- apps/shadcn-table-docs/components/dev-home/v12/nav.tsx` at 53acbfec and at e3a9d9d9: empty
- Check: docs-e2e, `pnpm test docs-e2e --base base` at 53acbfec: pass, 2645 checks, 0 failed; `home header version`, `home header version at 390` on `/`, `404: header version` and `404: header version at 390` on `/nope`, `/docs/examples/sticky-heder`, `/docs/nope`, and spec 68 `header version`, `header version at 390` on the install page passed
- Check: typecheck, `pnpm test typecheck --base radix` at e3a9d9d9: pass, tsc clean
- Check: lint, `pnpm test lint` at e3a9d9d9: pass, 9 warnings (docs app, none in this milestone's files)
- Check: validate-repo, `pnpm test validate-repo` at e3a9d9d9: pass, 43 unit tests, registry fresh
- Check: changelog, `grep -c '^#### Spec 70' CHANGELOG.md` at e3a9d9d9: 1
- Not run here (builder): docs-e2e radix and aria (verifier); docs-e2e base not rerun at e3a9d9d9 (diff to 53acbfec is CHANGELOG.md only)

- Task 1 The home and 404 header version checks, then the cherry-pick of 93405e6e: 53acbfec
- Task 2 The changelog block: e3a9d9d9

## Attention

## Notes
