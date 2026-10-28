## Changes

<!-- What changes and why. For a library change, say which editions it touches and, when only one differs, that its <edition>-diff.json lists the file. -->

## Checklist

- [ ] I followed [CONTRIBUTING.md](../CONTRIBUTING.md) and ran the gates of the area I changed locally (`docs/code-of-conduct/coding-standards.md`, Gates): `pnpm format`, `tsc:radix`, `tsc:baseui`, `tsc:aria`, `lint`, `test`, `test:base`, `test:aria`, `pnpm check:bases`, and the docs `types:check`, `lint`, `build`.
- [ ] A library change is made in every tree, or listed in that edition's `<edition>-diff.json`.
- [ ] I understand every line of this pull request, including code written with AI assistance.

## Release impact

- [ ] One `release:` label is set: `release:patch`, `release:minor`, `release:major`, or `release:skip` for a change that ships nothing (CI, plans, tooling).
- [ ] For `release:patch`, `release:minor` or `release:major`: `CHANGELOG.md` has this change's line under `## Unreleased`, below `### Breaking`, `### Added`, `### Changed`, `### Fixed` or `### Docs`.
