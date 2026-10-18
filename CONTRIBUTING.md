# Contributing to shadcn-react-table

## Suggesting features or bug fixes

Open a [GitHub issue](https://github.com/anindosarker/shadcn-react-table/issues) before a large PR so the approach can be discussed first. Small fixes can go straight to a PR.

## Running the project

Setup, the architecture and the commands for the library, the playground, the registry and the docs site are in [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md).

## Pull requests

- Branch from `master`, one topic per PR.
- Format with `pnpm prettier --write <files>` before committing.
- Run the library checks (`tsc`, `lint`, `test`, `storybook:build`) and, when the docs change, `types:check` and `build` for the docs app. CI runs the same commands (`.github/workflows/ci.yml`).
- Library changes that affect rendering need a Storybook story, or an update to an existing one.
- After adding or removing library files run `pnpm registry:build`; after adding an example or changing its imports run `pnpm registry:items`. Both outputs are committed.
