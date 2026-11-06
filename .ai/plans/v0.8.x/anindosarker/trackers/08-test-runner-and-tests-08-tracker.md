# 08: Test runner and tests (08), tracker (D85, D86, D87, D88)

Status: running
Branch `v0.8/08-test-runner`, worktree `shadcn-react-table.worktrees/01`, no PR (P1, P3)
Checks:
- Check: frozen install, `pnpm install --frozen-lockfile` at 85ec0484: pass
- Check: registry output, `pnpm registry:build` then `git status --porcelain packages/shadcn-table/registry.json packages/shadcn-table/public` empty at 85ec0484: pass
- Check: docs build, `pnpm --filter shadcn-table-docs build` at 85ec0484: pass
- Check: tsc radix, `pnpm --filter shadcn-table tsc:radix` at 85ec0484: pass
- Check: tool unit tests, `node --test "tools/**/*.test.mjs"` at 85ec0484: pass (21)
- Check: generated maps, `git status --porcelain apps/shadcn-table-docs/examples/map.tsx` header line only at 85ec0484: pass
- Check: list, `pnpm test --list` at task 2: pass (eight names)
- Check: typecheck, `pnpm test typecheck` at task 2: pass (3 bases)
- Check: lint, `pnpm test lint` at task 2: pass (9 docs warnings)
- Check: validate-repo, `pnpm test validate-repo` at task 2: pass
- Check: storybook-tests (radix), `pnpm test storybook-tests --base radix` at task 2: pass (609 passed)
- Check: changed, `pnpm test --changed --list` names validate-repo at task 2: pass

- Task 1 Dependencies and the tools move: done (85ec0484)
- Task 2 Runner and the wrappers: running
- Task 3 docs-e2e and validate-production: planned
- Task 4 installation-e2e: planned
- Task 5 Cleanup and checks once: planned

## Attention

## Notes
