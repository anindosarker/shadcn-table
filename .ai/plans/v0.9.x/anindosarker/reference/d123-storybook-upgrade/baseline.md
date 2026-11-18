# D123 Storybook upgrade: baseline

Taken before any file change: library side on `57ece654` (`origin/claude/review`, worktree 08, branch `v0.9/storybook-upgrade-planned`), docs side on `6ec25203` (`origin/v0.9/docs-layout`, pool worktree 09, detached). Storybook 10.6.2 everywhere (`storybook`, every `@storybook/*` except `@storybook/icons` 2.2.0; `storybook-dark-mode` 5.0.0).

## Fixed story set

Ten stories, light and dark, on base, radix and aria (the story iframe, 1280x800):

- `basic--default`
- `features-column-pinning-examples--column-pinning-enabled`
- `features-filtering-examples--filtering-enabled-default`
- `features-editing-examples--editing-enabled-edit-mode-modal-default`
- `features-detail-panel-examples--detail-panel-enabled-semantic`
- `features-virtualization--enable-row-virtualization-dense`
- `features-row-pinning-examples--row-pinning-sticky-default-enabled`
- `features-view-settings-examples--view-settings-default`
- `features-click-to-copy-examples--click-to-copy-enabled`
- `styling-sticky-header-examples--enable-sticky-header`

The shell, per base: `<base>/?path=/story/basic--default` (sidebar, toolbar with the base tool and the dark mode toggle, the Code panel of the docs addon; the project has no autodocs, so the Code panel is the docs tab): `<base>-shell-default.png` (dark, the default), `<base>-shell-toggled.png` (after a click on the dark mode toggle), `<base>-shell-basetool.png` (the base tool open).

Docs story pages (`/docs/examples/more/<id>`, 1440x1100, light and dark, each base selected): `basic--default`, `features-column-pinning--column-pinning-enabled`, `features-virtualization--enable-row-virtualization-dense`; files `docs-<base>-<mode>-<id>.png`.

## How the captures are made

- `tools/capture.cjs <static root> <out> <port>`: serves the three static builds on one P6 port, opens each story iframe, waits for the render phase `finished` (play and afterEach done), then captures. `Math.random` is replaced by a seeded generator and the clock fixed at 2026-01-01T12:00Z, so the faker data is the same on every load; without that, 48 of 69 captures differ between two runs of the same build.
- `tools/capture-docs.cjs <origin> <out>`: the docs app's production build (`next start` on a P6 port in worktree 09), the same seeding.
- `tools/diff.cjs <a> <b> [diffOut]`: pixelmatch, threshold 0.1.
- Noise floor: two capture runs of the same build: 69 of 69 story and shell captures equal, 18 of 18 docs captures equal.
- Shell behaviour seen: the preview `<html>` class is `dark` before and `light` after the toggle click on each base; the base tool moves base to `/radix/`, radix to `/aria/`, aria to `/base/`, same `?path=`.

## Story tests (`pnpm test storybook-tests --base <base>`)

| Base | Result | Files |
|---|---|---|
| base | 654 passed | 81 |
| radix | 654 passed | 81 |
| aria | 654 passed | 81 |

Names: `lists/before/tests-<base>.txt` (file, test name, status; from a second vitest run with the json reporter, same counts).

## Static builds (`pnpm test storybook-static --base <base>`)

| Base | Result | Story ids in index.json | Files | Bytes |
|---|---|---|---|---|
| base | reset pass | 654 | 329 | 19257987 |
| radix | reset pass | 654 | 329 | 19246841 |
| aria | reset pass | 654 | 329 | 19307415 |

Story ids: `lists/before/story-ids-<base>.txt` (sorted; the three lists are equal).

## Docs story pages (`pnpm test docs-e2e --base <base>`, worktree 09 at `6ec25203`)

| Base | Result |
|---|---|
| base | pass, 5 sections, 116 pages, 2561 checks |
| radix | pass, 5 sections, 116 pages, 2561 checks (getting-started 265, api 111, guides 1020, examples 1107, site 58) |
| aria | pass, 5 sections, 116 pages, 2561 checks (same per section) |

## Captures

`captures/before/`: 60 story captures, 9 shell captures, 18 docs story page captures.
