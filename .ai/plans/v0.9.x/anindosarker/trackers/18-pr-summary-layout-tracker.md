# 18: PR Summary comment is a grouped table, tracker

Status: done
Branch `v0.9/pr-summary-layout`, worktree `../shadcn-react-table.worktrees/04`
Checks:
- Check: red on the shipped code (P11), `node --test tools/release/pr-summary.test.mjs` at f1048f8f with the new tests: fail (`SyntaxError: The requested module './pr-summary.mjs' does not provide an export named 'changelogSection'`)
- Check: unit tests, `node --test tools/release/pr-summary.test.mjs` at e3ff78e7: pass (11 of 11)
- Check: act, `act pull_request -W <scratchpad>/pr-summary-only.yml -j pr-summary -e <scratchpad>/event18.json -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --bind --artifact-server-path <scratchpad>/act-artifacts` at e3ff78e7, records of run 42501252444 in test/.out/: pass (Job succeeded, exit 0, body below)
- Check: unit tests, `node --test tools/release/pr-summary.test.mjs` at 0376a29b: pass (11 of 11)
- Check: validate-repo, `pnpm test validate-repo` at 0376a29b: pass (32 unit tests)
- Check: lint, `pnpm test lint` at 0376a29b: pass (0 errors, 9 warnings)
- Check: format, `pnpm format` at 0376a29b: pass (no other file changed)
- Check (verifier): skipped as recorded, unit tests, validate-repo, lint and format at 0376a29b; `git diff --name-only 0376a29b..85ba5627` touches only the tracker
- Check (verifier): act, same command as the e3ff78e7 line at 85ba5627 (pr-summary.mjs changed after e3ff78e7, header comment only), records of run 42501252444 staged in test/.out/: pass (Job succeeded, exit 0; body equal to the one below except the changelog now lists `Changed 1` with Spec 18)
- Check (verifier): the GitHub render of the comment (2.2 last line) is not a local check; the next PR run shows it

- Task 1 Reproduce: done (70e4d827)
- Task 2 buildComment and helpers, main(): done (e3ff78e7)
- Task 3 act: done (f4d85858)
- Task 4 Cleanup: done (0376a29b)

## Notes

- act 0.2.96 runs `-j pr-summary` together with its `needs` (all 19 test jobs, which fail at setup-node under act); the proof used `pr-summary-only.yml` in the scratchpad: the `pr-summary` job of pr.yml copied verbatim minus its `needs` line. act's artifact server panics on a missing run folder, so `<scratchpad>/act-artifacts/1` was created empty; download-artifact then finds nothing and the staged records stay.
- The event has `number: 0`, so `main()` takes the no-pull-request path (step summary only) and needs no token; exit code 0.
- The GitHub render of the comment is out of reach here: the next PR run (spec 19 or the 0.9.1 release PR) shows it.
- Body printed by the act run (run 42501252444 records, CHANGELOG.md at e3ff78e7):

```markdown
<!-- shadcn-table:pr-summary -->
## release: 0.9.0

`release:minor` | [run 1](https://github.com/anindosarker/shadcn-table/actions/runs/1) | ❌ 1 job failed

| Job | Result |
| --- | --- |
| **Typecheck** | |
| &nbsp;&nbsp;base | ✅ tsc clean |
| &nbsp;&nbsp;radix | ✅ tsc clean |
| &nbsp;&nbsp;aria | ✅ tsc clean |
| **Lint** | ✅ 9 warnings |
| **Storybook Tests** | |
| &nbsp;&nbsp;base | ✅ 618 passed |
| &nbsp;&nbsp;radix | ✅ 618 passed |
| &nbsp;&nbsp;aria | ✅ 618 passed |
| **Docs E2E Tests** | |
| &nbsp;&nbsp;base | ✅ 4 sections, 107 pages |
| &nbsp;&nbsp;radix | ❌ 4 sections, 107 pages, 1 failed |
| &nbsp;&nbsp;aria | ✅ 4 sections, 107 pages |
| **Validate Repo** | ✅ bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests |
| **Installation E2E** | |
| &nbsp;&nbsp;fresh | ✅ built |
| &nbsp;&nbsp;existing | ✅ built |
| &nbsp;&nbsp;base | ✅ built |
| &nbsp;&nbsp;aria | ✅ built |
| &nbsp;&nbsp;nextjs-base | ✅ built, browser pass, diff 0 px |
| &nbsp;&nbsp;nextjs-radix | ✅ built, browser pass, diff 0 px |
| &nbsp;&nbsp;nextjs-aria | ✅ built, browser pass, diff 0 px |
| **Validate PR** | ✅ Ships as 0.9.0 (release:minor, already bumped) |

<details>
<summary>❌ 1 failure</summary>

- **Docs E2E Tests (radix)** examples: FAIL /docs/examples/editing-crud-inline-row @1440 editing-crud-row: delete dialog cancel keeps the rows before=10 after=8

</details>

#### Changelog

Under `## Unreleased`: Added 1 · Docs 7

- **Added** · Spec 12 Stored view persists rows per page
- **Docs** · Spec 11 Persistent view example: ten rows · Spec 08 Theme panel: Copy and Import removed · Spec 13 Docs parts carry the design-system hooks · Spec 09 Theme panel: shortcut row, Mod+Z undo · Spec 10 Theme panel: color picker · Spec 14 ST_DefaultsProvider; the docs icon library select · Spec 15 Docs: one style sheet per style, loaded on demand

<sub>Updated on every run of this pull request.</sub>
```
- Judgment calls: `1 job failed` and `1 failure` in the singular; the changelog bullets list every `####` title (no `and N more` cut as in the draft, spec 1.2 says "as written"); headings without a `####` title are left out of the counts; on a label event the status line counts over the merged rows and links the new run.

## Attention

- Label event: the failures block is carried over except its `- **Validate PR** ` lines, which are replaced by the new Validate PR record's errors (spec 1.6.2 says verbatim; verbatim would keep a stale Validate PR failure after a relabel that fixes it). Revert in `buildComment` if verbatim is wanted.
