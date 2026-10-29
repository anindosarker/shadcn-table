## Changes

<!-- What changes and why. For a library change, say which bases it touches and, when only one differs, that its <base>-diff.json lists the file. -->

## Checklist

- [ ] I followed [CONTRIBUTING.md](../CONTRIBUTING.md) and ran the gates of the area I changed locally (`docs/code-of-conduct/coding-standards.md`, Gates): `pnpm format`, `tsc:baseui`, `tsc:radix`, `tsc:aria`, `lint`, `test:base`, `test:radix`, `test:aria`, `pnpm check:bases`, and the docs `types:check`, `lint`, `build`.
- [ ] A library change is made in every tree, or listed in that base's `<base>-diff.json`.
- [ ] I understand every line of this pull request, including code written with AI assistance.

## Release impact

- [ ] One `release:` label is set: `release:patch`, `release:minor`, `release:major`, or `release:skip` for a change that ships nothing (CI, plans, tooling).
- [ ] For `release:patch`, `release:minor` or `release:major`: `CHANGELOG.md` has this change's line under `## Unreleased`, below `### Breaking`, `### Removed`, `### Added`, `### Changed`, `### Fixed` or `### Docs`.
