# 02: frame and body, tracker

Status: done
Branch `v0.8/frame-body`, worktree 01, PR #98
Gates:
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria` at 89c64f19: green
- `pnpm lint` at 89c64f19: green
- `pnpm check:tailwind`, `pnpm check:icons`, `pnpm check:bases` at 89c64f19: green
- `pnpm tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `check:tailwind`, `check:icons` at d65fc6f2: green
- `pnpm test:radix` at d65fc6f2: green, 480 of 480 (first parallel run hit a setup-file import error on 12 files, rerun green)
- `pnpm test:aria` at d65fc6f2: green, 480 of 480
- `pnpm test:base` at d65fc6f2: 479 of 480, `Global Filter Mode Switch` red under parallel load, isolated rerun of CustomFilterFns green 12 of 12
- `pnpm storybook:build:base`, `storybook:build:radix`, `storybook:build:aria` at d65fc6f2: green
- `pnpm check:bases`, `pnpm registry:build` (no diff), `lib:install` per base (no diff), `node reference/01-check.mjs` at d65fc6f2: green

- Milestone 01 one pass over 1.6.2 to 1.6.8: done (89c64f19)
- Milestone 02 stories, captures, judges: done (5ecc689a)
- Milestone 03 cleanup and gates once: done (d65fc6f2)

## Attention

## Notes
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/base-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/base-default-dark.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/radix-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/radix-default-dark.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/aria-default-light.png
Captures: /private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/252fd84e-2c81-46e1-b175-d3dcca5f3984/scratchpad/captures/02/aria-default-dark.png
- Captures from the static Storybook build per base, story `styling-default-look--default`, theme via the `sb-addon-themes-3` storage key. Header cells, toolbar icons and cell badges differ from the reference by design: spec 03, spec 04 and story cell renderers.
