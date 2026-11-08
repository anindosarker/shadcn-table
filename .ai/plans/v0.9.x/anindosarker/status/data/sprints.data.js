window.SPRINT_DATA = {
  "release": "v0.9.x",
  "repoRoot": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table",
  "updated": "2026-11-09 02:48",
  "source": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker",
  "sprints": [
    "S1",
    "S2",
    "S3",
    "S4",
    "S5",
    "S6",
    "S7"
  ],
  "epics": [
    "E1",
    "E2",
    "E3",
    "E4",
    "E5",
    "E6",
    "E7",
    "Fixes"
  ],
  "milestones": [
    {
      "id": "Filtering",
      "name": "Filtering",
      "epic": "E1",
      "number": "01",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/registry/<base>/components/ui/shadcn-table/hooks/useST_TableOptions.ts",
        ".../components/inputs/ST_FilterTextField.tsx",
        ".../components/menus/ST_FilterOptionMenu.tsx",
        ".../shared/utils/filterSummary.utils.ts",
        ".../shared/fns/filterFns.ts",
        ".../types.ts",
        ".../shared/locales/*.ts",
        "packages/shadcn-table/stories/features/Filtering.stories.tsx",
        "packages/shadcn-table/stories/features/FilterChips.stories.tsx",
        "apps/shadcn-table-docs/content/docs/guides/column-filtering.mdx",
        "apps/shadcn-table-docs/content/docs/guides/filter-chips.mdx",
        "apps/shadcn-table-docs/content/docs/guides/production-ready-tables.mdx",
        "apps/shadcn-table-docs/content/docs/examples/subheader-filters.mdx",
        "apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts",
        "apps/shadcn-table-docs/lib/prop-tables/columnOptions.ts",
        "apps/shadcn-table-docs/examples/<base>/**/*.tsx",
        "test/docs-e2e/lib/examples.mjs"
      ],
      "specTitle": "Filter modes on by default, select clear button",
      "specPath": "plan/specs/01-filtering.md",
      "outcome": "Filter mode pickers show without a flag on every variant; the select clear button no longer covers the chevron",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/01-filtering.md"
    },
    {
      "id": "Pagination",
      "name": "Pagination",
      "epic": "E1",
      "number": "02",
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Filtering"
      ],
      "files": [
        "packages/shadcn-table/registry/<base>/components/ui/shadcn-table/components/toolbar/ST_TablePagination.tsx",
        ".../features/stConfigFeature.ts",
        "packages/shadcn-table/stories/features/Pagination.stories.tsx",
        "packages/shadcn-table/stories/features/TableProvider.stories.tsx",
        "packages/shadcn-table/stories/features/NestedTable.stories.tsx",
        "packages/shadcn-table/stories/features/RowPinningOnSelect.stories.tsx",
        "apps/shadcn-table-docs/content/docs/guides/pagination.mdx",
        "apps/shadcn-table-docs/content/docs/guides/best-practices.mdx",
        "apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts",
        "apps/shadcn-table-docs/examples/<base>/alternate-pagination/TS.tsx",
        "test/docs-e2e/lib/guides.mjs"
      ],
      "specTitle": "Pages footer row range, compact mode",
      "specPath": "plan/specs/02-pagination.md",
      "outcome": "The pages footer shows the row range; the compact footer is named compact everywhere",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/02-pagination.md"
    },
    {
      "id": "Resize animation",
      "name": "Resize animation",
      "epic": "E1",
      "number": "03",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/registry/<base>/components/ui/shadcn-table/shared/utils/column.utils.ts",
        ".../components/head/ST_TableHeadCellResizeHandle.tsx",
        ".../components/menus/ST_ColumnActionMenu.tsx",
        ".../components/head/ST_TableHeadCell.tsx",
        ".../components/body/ST_TableBodyCell.tsx",
        "packages/shadcn-table/stories/features/ColumnResizing.stories.tsx"
      ],
      "specTitle": "Column size reset animates",
      "specPath": "plan/specs/03-resize-animation.md",
      "outcome": "A double-click or menu reset of a column width animates in CSS, drags stay instant",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/03-resize-animation.md"
    },
    {
      "id": "Theme customizer",
      "name": "Theme customizer",
      "epic": "E2",
      "number": "04",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "apps/shadcn-table-docs/package.json",
        "pnpm-lock.yaml",
        "apps/shadcn-table-docs/lib/design-system/*",
        "apps/shadcn-table-docs/components/design-system-provider.tsx",
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/components/theme-controls.tsx",
        "apps/shadcn-table-docs/components/theme-preset-switcher.tsx",
        "apps/shadcn-table-docs/components/ui-radix/sheet.tsx",
        "apps/shadcn-table-docs/lib/theme-presets.ts",
        "apps/shadcn-table-docs/themes/*",
        "apps/shadcn-table-docs/styles/*",
        "apps/shadcn-table-docs/app/global.css",
        "apps/shadcn-table-docs/app/layout.tsx",
        "apps/shadcn-table-docs/components/theme-demo/variants/no-step-3.tsx",
        "apps/shadcn-table-docs/components/theme-demo/variants/matches.tsx",
        "apps/shadcn-table-docs/components/dev-home/v12/dune.tsx",
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": "Theme customizer panel",
      "specPath": "plan/specs/04-theme-customizer.md",
      "outcome": "The docs palette button opens a right-side customizer with presets, per-token colors, fonts and shortcuts",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/04-theme-customizer.md"
    },
    {
      "id": "Release approval",
      "name": "Release approval",
      "epic": "E2",
      "number": "05",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        ".github/workflows/pr.yml"
      ],
      "specTitle": "Version bump waits for the owner's approval",
      "specPath": "plan/specs/05-release-approval.md",
      "outcome": "The release PR's bump job waits on the owner's Approve in the release environment",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/05-release-approval.md"
    },
    {
      "id": "Storybook reset",
      "name": "Storybook reset",
      "epic": "E2",
      "number": "06",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/.storybook/main.ts",
        "packages/shadcn-table/.storybook/preview.tsx",
        "test/storybook-static/run.mjs",
        "test/storybook-static/test.mjs"
      ],
      "specTitle": "Static Storybook resets after the play",
      "specPath": "plan/specs/06-storybook-reset.md",
      "outcome": "Deployed stories open in their initial state after the play runs; dev and vitest unchanged",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/06-storybook-reset.md"
    },
    {
      "id": "Integration",
      "name": "Integration",
      "epic": "E3",
      "number": "07",
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Theme customizer",
        "Release approval",
        "Storybook reset"
      ],
      "files": [],
      "specTitle": "Release 0.9.0",
      "specPath": "plan/specs/07-release.md",
      "outcome": "0.9.0 ships E1, E2 and the F3 fix: integration on dev, the release PR, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/07-release.md"
    },
    {
      "id": "Release PR",
      "name": "Release PR",
      "epic": "E3",
      "number": "07",
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Integration"
      ],
      "files": [],
      "specTitle": "Release 0.9.0",
      "specPath": "plan/specs/07-release.md",
      "outcome": "0.9.0 ships E1, E2 and the F3 fix: integration on dev, the release PR, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/07-release.md"
    },
    {
      "id": "After release",
      "name": "After release",
      "epic": "E3",
      "number": "07",
      "sprint": 3,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Release PR"
      ],
      "files": [],
      "specTitle": "Release 0.9.0",
      "specPath": "plan/specs/07-release.md",
      "outcome": "0.9.0 ships E1, E2 and the F3 fix: integration on dev, the release PR, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/07-release.md"
    },
    {
      "id": "Theme panel copy import",
      "name": "Theme panel copy import",
      "epic": "E4",
      "number": "08",
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/components/design-system-provider.tsx",
        "apps/shadcn-table-docs/lib/design-system/config.ts",
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": "Copy and Import leave the theme panel",
      "specPath": "plan/specs/08-theme-panel-copy-import.md",
      "outcome": "The theme panel drops Copy and Import and the preset-code format they share",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/08-theme-panel-copy-import.md"
    },
    {
      "id": "Theme panel shortcut row",
      "name": "Theme panel shortcut row",
      "epic": "E4",
      "number": "09",
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Theme panel copy import"
      ],
      "files": [
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/components/design-system-provider.tsx",
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": "One shortcut row in the theme panel",
      "specPath": "plan/specs/09-theme-panel-shortcut-row.md",
      "outcome": "Reset, Undo, Redo, Random and Next preset sit in one top row with their keys; undo and redo use Mod+Z and Mod+Shift+Z",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/09-theme-panel-shortcut-row.md"
    },
    {
      "id": "Theme color picker",
      "name": "Theme color picker",
      "epic": "E4",
      "number": "10",
      "sprint": 3,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Theme panel shortcut row"
      ],
      "files": [
        "apps/shadcn-table-docs/package.json",
        "pnpm-lock.yaml",
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/components/design-system-provider.tsx",
        "apps/shadcn-table-docs/lib/design-system/tokens.ts",
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": "Color swatches open a picker",
      "specPath": "plan/specs/10-theme-color-picker.md",
      "outcome": "Each color token's swatch opens a picker; a pick writes the token live and undoes in one step",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/10-theme-color-picker.md"
    },
    {
      "id": "Persistent view page size",
      "name": "Persistent view page size",
      "epic": "E4",
      "number": "11",
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "apps/shadcn-table-docs/examples/radix/persistent-view/TS.tsx",
        "apps/shadcn-table-docs/examples/base/persistent-view/TS.tsx",
        "apps/shadcn-table-docs/examples/aria/persistent-view/TS.tsx",
        "apps/shadcn-table-docs/content/docs/examples/persistent-view.mdx",
        "test/docs-e2e/lib/examples.mjs"
      ],
      "specTitle": "Persistent view example starts at ten rows",
      "specPath": "plan/specs/11-persistent-view-page-size.md",
      "outcome": "The persistent view example loads with ten rows per page",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/11-persistent-view-page-size.md"
    },
    {
      "id": "Stored view page size",
      "name": "Stored view page size",
      "epic": "E4",
      "number": "12",
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/shared/utils/viewSettingsStorage.utils.ts",
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "packages/shadcn-table/stories/features/ViewSettings.stories.tsx",
        "apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts",
        "apps/shadcn-table-docs/content/docs/guides/view-settings.mdx",
        "apps/shadcn-table-docs/content/docs/guides/state-management.mdx"
      ],
      "specTitle": "Stored view persists rows per page",
      "specPath": "plan/specs/12-stored-view-page-size.md",
      "outcome": "A persisted view restores the rows-per-page choice on reload",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/12-stored-view-page-size.md"
    },
    {
      "id": "Docs parts hooks",
      "name": "Docs parts hooks",
      "epic": "E4",
      "number": "13",
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "apps/shadcn-table-docs/lib/install.mjs",
        "apps/shadcn-table-docs/components/ui-radix/*.tsx",
        "apps/shadcn-table-docs/components/ui-base/*.tsx",
        "apps/shadcn-table-docs/components/ui-aria/*.tsx",
        "test/docs-e2e/lib/guides.mjs"
      ],
      "specTitle": "Docs parts carry the design-system hooks",
      "specPath": "plan/specs/13-docs-parts-hooks.md",
      "outcome": "Style, Menu Color and Menu Accent change the docs menus, popovers and buttons",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/13-docs-parts-hooks.md"
    },
    {
      "id": "Icon library select",
      "name": "Icon library select",
      "epic": "E5",
      "number": "14",
      "sprint": 4,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Theme color picker"
      ],
      "files": [
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_Defaults.tsx",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_Defaults.tsx",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_Defaults.tsx",
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_TableOptions.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_TableOptions.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_TableOptions.ts",
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/index.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/index.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/index.ts",
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/types.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/types.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/types.ts",
        "packages/shadcn-table/stories/features/Icons.stories.tsx",
        "apps/shadcn-table-docs/package.json",
        "pnpm-lock.yaml",
        "apps/shadcn-table-docs/lib/install.mjs",
        "apps/shadcn-table-docs/components/example-icons.tsx",
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/lib/design-system/config.ts",
        "apps/shadcn-table-docs/app/layout.tsx",
        "apps/shadcn-table-docs/lib/prop-tables/tableOptions.ts",
        "apps/shadcn-table-docs/content/docs/api/st-components.mdx",
        "apps/shadcn-table-docs/content/docs/guides/customize-icons.mdx",
        "test/docs-e2e/lib/getting-started.mjs",
        "test/docs-e2e/lib/examples.mjs"
      ],
      "specTitle": "The Icon Library select switches the example tables' icons",
      "specPath": "plan/specs/14-icon-library-select.md",
      "outcome": "The theme panel's Icon Library select switches every example table's icons between the five sets",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/14-icon-library-select.md"
    },
    {
      "id": "Style sheet on demand",
      "name": "Style sheet on demand",
      "epic": "E5",
      "number": "15",
      "sprint": 5,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Docs parts hooks",
        "Icon library select"
      ],
      "files": [
        "apps/shadcn-table-docs/lib/build-styles.mjs",
        "apps/shadcn-table-docs/app/global.css",
        "apps/shadcn-table-docs/app/layout.tsx",
        "apps/shadcn-table-docs/lib/design-system/config.ts",
        "apps/shadcn-table-docs/components/design-system-provider.tsx",
        "apps/shadcn-table-docs/package.json",
        "pnpm-lock.yaml",
        "apps/shadcn-table-docs/.gitignore",
        "test/docs-e2e/lib/getting-started.mjs",
        ".ai/plans/v0.9.x/anindosarker/process.md"
      ],
      "specTitle": "Only the active style's stylesheet loads",
      "specPath": "plan/specs/15-style-sheet-on-demand.md",
      "outcome": "Each docs page links only the active style's stylesheet; the eight style imports leave global.css",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/15-style-sheet-on-demand.md"
    },
    {
      "id": "CI skip bump commit",
      "name": "CI skip bump commit",
      "epic": "E6",
      "number": "16",
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        ".github/workflows/pr.yml",
        ".github/workflows/typecheck.yml",
        ".github/workflows/storybook-tests.yml",
        ".github/workflows/docs-e2e.yml",
        ".github/workflows/installation-e2e.yml"
      ],
      "specTitle": "Test jobs skip the version bump commit",
      "specPath": "plan/specs/16-ci-skip-bump-commit.md",
      "outcome": "The bot's chore: version commit runs no test job; one CI run per release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/16-ci-skip-bump-commit.md"
    },
    {
      "id": "CI Node 24 actions",
      "name": "CI Node 24 actions",
      "epic": "E6",
      "number": "17",
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "CI skip bump commit"
      ],
      "files": [
        ".github/workflows/pr.yml",
        ".github/workflows/typecheck.yml",
        ".github/workflows/storybook-tests.yml",
        ".github/workflows/docs-e2e.yml",
        ".github/workflows/installation-e2e.yml",
        ".github/workflows/release.yml"
      ],
      "specTitle": "Workflows use the Node 24 action majors",
      "specPath": "plan/specs/17-ci-node24-actions.md",
      "outcome": "Every GitHub action in the workflows runs on its Node 24 major; zero deprecation annotations",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/17-ci-node24-actions.md"
    },
    {
      "id": "PR summary layout",
      "name": "PR summary layout",
      "epic": "E6",
      "number": "18",
      "sprint": 0,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "tools/release/pr-summary.mjs",
        "tools/release/pr-summary.test.mjs"
      ],
      "specTitle": "PR Summary comment is a grouped table",
      "specPath": "plan/specs/18-pr-summary-layout.md",
      "outcome": "The sticky PR comment shows one grouped table, a failures block and a changelog section",
      "critical": false,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/18-pr-summary-layout.md"
    },
    {
      "id": "PR summary job outputs",
      "name": "PR summary job outputs",
      "epic": "E6",
      "number": "19",
      "sprint": 3,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "CI Node 24 actions",
        "PR summary layout"
      ],
      "files": [
        ".github/workflows/pr.yml",
        ".github/workflows/typecheck.yml",
        ".github/workflows/storybook-tests.yml",
        ".github/workflows/docs-e2e.yml",
        ".github/workflows/installation-e2e.yml",
        "tools/release/record-output.mjs",
        "tools/release/pr-summary.mjs",
        "tools/release/pr-summary.test.mjs"
      ],
      "specTitle": "PR Summary reads job outputs",
      "specPath": "plan/specs/19-pr-summary-job-outputs.md",
      "outcome": "Test jobs hand their records to PR Summary through job outputs; no test-out artifacts",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/19-pr-summary-job-outputs.md"
    },
    {
      "id": "Integration 0.9.1",
      "name": "Integration 0.9.1",
      "epic": "E7",
      "number": "20",
      "sprint": 4,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        ".gitignore",
        "tools/release/record-output.test.mjs",
        "tools/release/pr-summary.mjs"
      ],
      "specTitle": "Release 0.9.1",
      "specPath": "plan/specs/20-release-0-9-1.md",
      "outcome": "0.9.1 ships E4, E5 and E6: fast-forward to dev, the release PR on GitHub, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/20-release-0-9-1.md"
    },
    {
      "id": "Release PR 0.9.1",
      "name": "Release PR 0.9.1",
      "epic": "E7",
      "number": "20",
      "sprint": 5,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Integration 0.9.1"
      ],
      "files": [],
      "specTitle": "Release 0.9.1",
      "specPath": "plan/specs/20-release-0-9-1.md",
      "outcome": "0.9.1 ships E4, E5 and E6: fast-forward to dev, the release PR on GitHub, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/20-release-0-9-1.md"
    },
    {
      "id": "After release 0.9.1",
      "name": "After release 0.9.1",
      "epic": "E7",
      "number": "20",
      "sprint": 6,
      "status": "done",
      "marker": "[x]",
      "depends": [
        "Release PR 0.9.1"
      ],
      "files": [],
      "specTitle": "Release 0.9.1",
      "specPath": "plan/specs/20-release-0-9-1.md",
      "outcome": "0.9.1 ships E4, E5 and E6: fast-forward to dev, the release PR on GitHub, tag and GitHub release",
      "critical": true,
      "specAbs": "/Users/anindosarker/Work/Personal/React-table/shadcn-react-table/.ai/plans/v0.9.x/anindosarker/plan/specs/20-release-0-9-1.md"
    },
    {
      "id": "CRUD dialog check waits for the rows (F25)",
      "name": "CRUD dialog check waits for the rows (F25)",
      "epic": "Fixes",
      "number": null,
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "test/docs-e2e/lib/examples.mjs"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Dev server clean (F11)",
      "name": "Dev server clean (F11)",
      "epic": "Fixes",
      "number": null,
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "apps/shadcn-table-docs/components/theme-customizer.tsx",
        "apps/shadcn-table-docs/app/layout.tsx",
        "apps/shadcn-table-docs/components/search-dialog.tsx"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Page index play (F22)",
      "name": "Page index play (F22)",
      "epic": "Fixes",
      "number": null,
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/stories/features/ViewSettings.stories.tsx"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Perf budgets on CI (F28)",
      "name": "Perf budgets on CI (F28)",
      "epic": "Fixes",
      "number": null,
      "sprint": 5,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Installation references refreshed (F20)",
      "name": "Installation references refreshed (F20)",
      "epic": "Fixes",
      "number": null,
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "test/installation-e2e/fixtures/reference/base/default-light.png",
        "test/installation-e2e/fixtures/reference/base/default-dark.png",
        "test/installation-e2e/fixtures/reference/radix/default-light.png",
        "test/installation-e2e/fixtures/reference/radix/default-dark.png",
        "test/installation-e2e/fixtures/reference/aria/default-light.png",
        "test/installation-e2e/fixtures/reference/aria/default-dark.png"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Stored view page index (F22)",
      "name": "Stored view page index (F22)",
      "epic": "Fixes",
      "number": null,
      "sprint": 1,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "packages/shadcn-table/registry/radix/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "packages/shadcn-table/registry/base/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "packages/shadcn-table/registry/aria/components/ui/shadcn-table/hooks/useST_ViewPersistence.ts",
        "apps/shadcn-table-docs/content/docs/guides/view-settings.mdx",
        "apps/shadcn-table-docs/content/docs/examples/persistent-view.mdx"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Theme check closes the search dialog (F24)",
      "name": "Theme check closes the search dialog (F24)",
      "epic": "Fixes",
      "number": null,
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    },
    {
      "id": "Theme hotkey checks wait for the change (F23)",
      "name": "Theme hotkey checks wait for the change (F23)",
      "epic": "Fixes",
      "number": null,
      "sprint": 2,
      "status": "done",
      "marker": "[x]",
      "depends": [],
      "files": [
        "test/docs-e2e/lib/getting-started.mjs"
      ],
      "specTitle": null,
      "specPath": null,
      "outcome": null,
      "critical": false,
      "specAbs": null
    }
  ],
  "criticalPaths": {
    "E1": [
      "Filtering",
      "Pagination"
    ],
    "E2": [
      "Theme customizer"
    ],
    "E3": [
      "Integration",
      "Release PR",
      "After release"
    ],
    "E4": [
      "Theme panel copy import",
      "Theme panel shortcut row",
      "Theme color picker"
    ],
    "E5": [
      "Icon library select",
      "Style sheet on demand"
    ],
    "E6": [
      "CI skip bump commit",
      "CI Node 24 actions",
      "PR summary job outputs"
    ],
    "E7": [
      "Integration 0.9.1",
      "Release PR 0.9.1",
      "After release 0.9.1"
    ]
  },
  "criticalPath": [
    "Filtering",
    "Pagination",
    "Theme customizer",
    "Integration",
    "Release PR",
    "After release",
    "Theme panel copy import",
    "Theme panel shortcut row",
    "Theme color picker",
    "Icon library select",
    "Style sheet on demand",
    "CI skip bump commit",
    "CI Node 24 actions",
    "PR summary job outputs",
    "Integration 0.9.1",
    "Release PR 0.9.1",
    "After release 0.9.1"
  ]
};
