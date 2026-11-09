## release: 0.9.0

`release:minor` | [run 42501252444](https://github.com/anindosarker/shadcn-table/actions/runs/42501252444) | ❌ 2 jobs failed

| Job                         | Result                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Typecheck**               |                                                                                      |
| &nbsp;&nbsp;base            | ✅ tsc clean                                                                         |
| &nbsp;&nbsp;radix           | ✅ tsc clean                                                                         |
| &nbsp;&nbsp;aria            | ✅ tsc clean                                                                         |
| **Lint**                    | ✅ 9 warnings                                                                        |
| **Storybook Tests**         |                                                                                      |
| &nbsp;&nbsp;base            | ✅ 618 passed                                                                        |
| &nbsp;&nbsp;radix           | ✅ 618 passed                                                                        |
| &nbsp;&nbsp;aria            | ✅ 618 passed                                                                        |
| **Docs E2E Tests**          |                                                                                      |
| &nbsp;&nbsp;base            | ❌ 3 of 107 pages failed                                                             |
| &nbsp;&nbsp;radix           | ❌ 1 of 107 pages failed                                                             |
| &nbsp;&nbsp;aria            | ✅ 107 pages                                                                         |
| **Validate Repo**           | ✅ bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests |
| **Installation E2E**        |                                                                                      |
| &nbsp;&nbsp;fresh           | ✅ built                                                                             |
| &nbsp;&nbsp;existing        | ✅ built                                                                             |
| &nbsp;&nbsp;base            | ✅ built                                                                             |
| &nbsp;&nbsp;aria            | ✅ built                                                                             |
| &nbsp;&nbsp;nextjs-base     | ✅ built, browser pass, diff 0 px                                                    |
| &nbsp;&nbsp;nextjs-radix    | ✅ built, browser pass, diff 0 px                                                    |
| &nbsp;&nbsp;nextjs-aria     | ✅ built, browser pass, diff 0 px                                                    |
| **Validate PR**             | ✅ ships as 0.9.0 (release:minor, already bumped)                                    |
| **Prepare Release**         | ⚪ skipped (already bumped)                                                          |

<details>
<summary>❌ 4 failures</summary>

- **Docs E2E Tests (base)** `/docs/examples/editing-crud-inline-row` @1440 · editing-crud-row: delete dialog cancel keeps the rows before=10 after=8
- **Docs E2E Tests (base)** `/docs/examples/editing-crud-inline-table` @1440 · editing-crud-table: delete dialog cancel keeps the rows before=10 after=8
- **Docs E2E Tests (base)** `/docs/examples/editing-crud-inline-cell` @1440 · editing-crud-cell: delete dialog cancel keeps the rows before=10 after=8
- **Docs E2E Tests (radix)** `/docs/examples/editing-crud-tree` @1440 · editing-crud-tree: delete dialog cancel keeps the rows before=20 after=10

</details>

#### Changelog

Under `## Unreleased`: Added 6 · Changed 2 · Fixed 9

- **Added** · Theme customizer panel · Filter modes on by default · Pages footer row range · Column size reset animation · Static Storybook resets after the play · Release approval gate
- **Changed** · `paginationDisplayMode: 'compact'` replaces `'default'` · Multi-select filter mode labels
- **Fixed** · Select filter clear button over the chevron · Filter mode menu exit jump (F3) · Dev server logs clean (F11) · Installation references (F20) · Theme hotkey checks (F23) · Theme check closes the search dialog (F24) · and 3 more

<sub>Updated on every run of this pull request.</sub>

---

Same layout, all green (the state after the rerun):

## release: 0.9.0

`release:minor` | [run 42501252444](https://github.com/anindosarker/shadcn-table/actions/runs/42501252444) | ✅ all green

| Job                         | Result                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------ |
| **Typecheck**               |                                                                                      |
| &nbsp;&nbsp;base            | ✅ tsc clean                                                                         |
| &nbsp;&nbsp;radix           | ✅ tsc clean                                                                         |
| &nbsp;&nbsp;aria            | ✅ tsc clean                                                                         |
| **Lint**                    | ✅ 9 warnings                                                                        |
| **Storybook Tests**         |                                                                                      |
| &nbsp;&nbsp;base            | ✅ 618 passed                                                                        |
| &nbsp;&nbsp;radix           | ✅ 618 passed                                                                        |
| &nbsp;&nbsp;aria            | ✅ 618 passed                                                                        |
| **Docs E2E Tests**          |                                                                                      |
| &nbsp;&nbsp;base            | ✅ 107 pages                                                                         |
| &nbsp;&nbsp;radix           | ✅ 107 pages                                                                         |
| &nbsp;&nbsp;aria            | ✅ 107 pages                                                                         |
| **Validate Repo**           | ✅ bases identical, icon maps complete, tailwind valid, registry valid, 27 unit tests |
| **Installation E2E**        |                                                                                      |
| &nbsp;&nbsp;fresh           | ✅ built                                                                             |
| &nbsp;&nbsp;existing        | ✅ built                                                                             |
| &nbsp;&nbsp;base            | ✅ built                                                                             |
| &nbsp;&nbsp;aria            | ✅ built                                                                             |
| &nbsp;&nbsp;nextjs-base     | ✅ built, browser pass, diff 0 px                                                    |
| &nbsp;&nbsp;nextjs-radix    | ✅ built, browser pass, diff 0 px                                                    |
| &nbsp;&nbsp;nextjs-aria     | ✅ built, browser pass, diff 0 px                                                    |
| **Validate PR**             | ✅ ships as 0.9.0 (release:minor, already bumped)                                    |
| **Prepare Release**         | ⚪ skipped (already bumped)                                                          |

#### Changelog

Under `## Unreleased`: Added 6 · Changed 2 · Fixed 9

- **Added** · Theme customizer panel · Filter modes on by default · Pages footer row range · Column size reset animation · Static Storybook resets after the play · Release approval gate
- **Changed** · `paginationDisplayMode: 'compact'` replaces `'default'` · Multi-select filter mode labels
- **Fixed** · Select filter clear button over the chevron · Filter mode menu exit jump (F3) · Dev server logs clean (F11) · Installation references (F20) · Theme hotkey checks (F23) · Theme check closes the search dialog (F24) · and 3 more

<sub>Updated on every run of this pull request.</sub>
