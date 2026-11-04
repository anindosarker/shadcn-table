#!/usr/bin/env node
// Spec 05 Acceptance check: every v0.8 default named by the spec is set in
// useST_TableOptions.ts of each base, the old layout auto-switch is gone, and
// useST_TableInstance.ts seeds the actions column pinning. Plain node, no
// dependencies; exits 0 only when all pass.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../../../..');
const BASES = ['radix', 'base', 'aria'];

const DEFAULTS = {
  columnFilterDisplayMode: "'chips'",
  enableCellOverflowTooltip: 'true',
  enableColumnOrdering: 'true',
  enableColumnPinning: 'true',
  enableColumnResizing: 'true',
  enableScrollButtons: 'true',
  enableSortPopover: 'true',
  enableStickyHeader: 'false',
  enableViewSettings: 'true',
  paginationDisplayMode: "'pages'",
  persistViewSettings: 'false',
  positionActionsColumn: "'last'",
  showClearSearchButton: 'false',
  showColumnDragHandle: 'false',
};

const problems = [];
for (const base of BASES) {
  const hooks = path.join(
    repo,
    'packages/shadcn-table/registry',
    base,
    'components/ui/shadcn-table/hooks',
  );
  const options = fs.readFileSync(
    path.join(hooks, 'useST_TableOptions.ts'),
    'utf8',
  );
  const instance = fs.readFileSync(
    path.join(hooks, 'useST_TableInstance.ts'),
    'utf8',
  );
  const returned = options.slice(options.lastIndexOf('return {'));
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const destructured = new RegExp(`^\\s{2}${key} = ${value},$`, 'm');
    if (!destructured.test(options)) {
      problems.push(`${base}: default ${key} = ${value} missing`);
    }
    if (!new RegExp(`^\\s{4}${key},$`, 'm').test(returned)) {
      problems.push(`${base}: ${key} not returned on the defined options`);
    }
  }
  if (!/layoutMode = layoutMode \|\| 'grid';/.test(options)) {
    problems.push(`${base}: layoutMode default 'grid' missing`);
  }
  if (/grid-no-grow/.test(options)) {
    problems.push(`${base}: layoutMode still switches on resizing`);
  }
  if (!/layoutMode === 'semantic' &&/.test(options)) {
    problems.push(`${base}: virtualization upgrade from 'semantic' missing`);
  }
  if (
    !/if \(enableRowVirtualization\) \{\s*enableStickyHeader = true;/.test(
      options,
    )
  ) {
    problems.push(`${base}: sticky header rule under virtualization missing`);
  }
  if (
    !/initialState\.columnPinning = \{ start: \[\], end: \['st-row-actions'\] \};/.test(
      instance,
    )
  ) {
    problems.push(`${base}: actions column pinning seed missing`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(
  `05-check: ${BASES.length} bases, ${Object.keys(DEFAULTS).length} defaults, ok`,
);
