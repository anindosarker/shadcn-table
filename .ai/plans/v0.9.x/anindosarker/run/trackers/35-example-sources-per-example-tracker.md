# 35: Example sources are read per example, tracker

Status: merged (234b235f)
Branch `v0.9/example-sources-per-example`, worktree 05
Checks:
- Check: before, file pattern warnings, `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build 2>&1 | grep -c "matches .* files"` at 59a003a9: 1 (matches 10568 files)
- Check: before, build wall time, `time NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build` at 59a003a9: 2:26.92 total (warm tsbuildinfo); cold (tsbuildinfo and .next removed) 121.93 s, compile 29.3 s, TypeScript 80 s
- Check: before, types:check wall time, `time pnpm --filter shadcn-table-docs types:check` at 59a003a9: 1:53.56 total; cold (tsbuildinfo removed) 146.76 s
- Check: before, snapshot of `readExampleFiles` for 117 examples on base, radix and aria, `node snapshot.mjs` at 59a003a9: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/18a7d8fb-53ed-4e77-8be8-85309efc0f16/scratchpad/before.json (script snapshot.mjs beside it)
- Check: form A (three `import('../examples/.<base>/sources.json')` loaders), cold types:check 80.00 s; build 0 file pattern warnings, 3:03.37 total with TypeScript 2.5 min in the build; not kept
- Check: form B (three `fs.readFile` on literal paths), kept, cold types:check 73.37 s; cold build 117.87 s, compile 18.5 s, TypeScript 83 s
- Check: after, `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build 2>&1 | grep -c "matches .* files"` at 3cc75fb0: 0
- Check: after, snapshot cmp, `cmp before.json after.json` at 3cc75fb0: pass (after: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/18a7d8fb-53ed-4e77-8be8-85309efc0f16/scratchpad/after.json)
- Check: `.next/server/app/docs/[[...slug]]/page.js.nft.json` traces sources.json at 3cc75fb0: pass
- Check: `pnpm --filter shadcn-table-docs types:check` at 3cc75fb0: pass
- Check: `pnpm --filter shadcn-table-docs lint` at 3cc75fb0: pass (9 warnings, none in lib/)
- Check: `node apps/shadcn-table-docs/lib/example-variants.mjs && ls .../examples/.{base,radix,aria}/sources.json`, `git status --short apps/shadcn-table-docs/examples` at 3cc75fb0: pass, prints nothing
- Check: `pnpm test validate-repo` at 3cc75fb0: pass
- Check: `pnpm test typecheck --base base` at a6d21241: pass
- Check: `pnpm test lint` at a6d21241: pass (9 warnings)
- Check: `pnpm test docs-e2e --base base --url http://localhost:5349` (next start on 5349 of the 3cc75fb0 build) at a6d21241: pass, 107 pages, examples 939 passed
- Check: verifier, Local CI and 2.2 lines above are valid at 78b4c5b3 (`git diff --name-only 3cc75fb0..HEAD` touches only .ai/ and CHANGELOG.md); not rerun
- Check: verifier Acceptance rerun, `NEXT_PUBLIC_SITE_URL=http://localhost:5349 pnpm --filter shadcn-table-docs build 2>&1 | grep -c "matches .* files"` at 78b4c5b3: 0 (warm build 26.41 s, compile 6.1 s, TypeScript 5.0 s)
- Check: verifier Acceptance rerun, snapshot cmp, `node snapshot.mjs` then `cmp before.json verify-after.json` at 78b4c5b3: pass (base 117, radix 117, aria 117)
- Check: verifier Acceptance rerun, `time pnpm --filter shadcn-table-docs types:check` at 78b4c5b3: pass, 6.96 s warm
- Check: verifier Acceptance rerun, `pnpm test docs-e2e --base base --url http://localhost:5349` (next start on 5349 of the 78b4c5b3 build) at 78b4c5b3: pass, 107 pages, examples 939 passed

- Task 1 before numbers and snapshot: done (0e9aa6fa)
- Task 2 generator and reader: done (3cc75fb0)
- Task 3 acceptance: done (3cc75fb0)
- Task 4 cleanup and changelog: done (a6d21241)

## Attention

- The docs-e2e run used `--url` against my own `next start` on 5349, because the runner's own server picks any free port from 5340 to 5360, outside this milestone's 5349 to 5351.
