# Rules for every sub-agent

Every agent prompt in this repo names this file instead of repeating it. Read it first.

- Work only in the git worktree you were given (`<repo>.worktrees/<name>`) on the branch
  named in your task. Never touch the main checkout or another worktree. Never touch the
  worktrees `wt1` and `wt2`.
- Never kill or use ports 5273, 5320, 5330, 6006, 6007, 6008, 5310 (the owner's servers).
  Take a port in 5340 to 5360 for anything you start, including Storybook dev (`-p`
  explicitly). Stop every server you start.
- Never use bare `git stash` or `git stash pop`. The stack is shared. A WIP commit is the way
  to set work aside.
- Commits: Conventional Commits, small, one concern each. The message ends with a blank line
  and the trailer `Claude-Session: <session url from your task>`. Run `pnpm format` once
  right before each commit. Push to origin after every commit.
- No em dashes anywhere: code, comments, docs, commits. A comma, a colon or a new sentence.
- Never edit a shadcn part by hand (`packages/shadcn-table/registry/<base>/components/ui/
  <part>.tsx`). Parts change only through `pnpm add-part <base> <part>`.
- Never reorder or change `BASES` in `packages/shadcn-table/scripts/registry/bases.mjs`.
- Standards: `docs/code-of-conduct/coding-standards.md`. Plans:
  `docs/code-of-conduct/planning-guidelines.md`. Release: `docs/code-of-conduct/release.md`.
  Decisions: the cycle's `decisions.md`, read before the plan; never re-decide.
- Gates run once. Record each gate you ran in the tracker as one line: command, commit,
  result. Per-base gates (`check-pages.mjs --base <base>`, `storybook:build:<base>`,
  `test:<base>`) run concurrently, each on its own port.
- `pnpm install` without `--frozen-lockfile` rewrites unrelated lockfile lines. Add a
  dependency by hand in `package.json` plus the importer entry in `pnpm-lock.yaml`, then
  verify with `pnpm install --frozen-lockfile`.
- Known flake: `Profiled Thousand Rows` (vitest browser mode) times out once in a while on
  the CI runner. `gh run rerun --failed <id>` once before reporting red.
- The owner is away. Questions are not possible. Pick the sensible default; record a
  judgment call the owner may want to revert as one bullet under `## Attention` in the
  part's tracker. Halt only on a halt condition the plan index names (a shadcn part edit of
  any kind, a ruleset or repo setting change, a change outside the part's target structure):
  stop, commit what is coherent, return `halt=true` with the reason.
- Your final text is a return value for a script or the main session, not a message to a
  human: facts, shas, gate results, attention items.
