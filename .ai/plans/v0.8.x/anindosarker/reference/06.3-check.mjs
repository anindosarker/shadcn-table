#!/usr/bin/env node
// Spec 06.3 play presence check. Walks packages/shadcn-table/stories/ and
// reports every *.stories.tsx without a play, and for each features/ file the
// spec 1.6.2 play names not found as a play on a story with that export name.
// Exit 1 on any report.
//
// A play is an object story's `play:` key or a `Story.play = ...` assignment.
// A named play is `export const <Name> = { ... play: ... }` or
// `<Name>.play = ...`.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../../..',
);
const storiesDir = path.join(root, 'packages/shadcn-table/stories');

/** Spec 06.3, 1.6.2: required play names per features/ file. */
const required = {
  Aggregation: ['GroupedRowShowsAggregate'],
  CellActions: ['RightClickOpensMenu', 'MenuItemRuns'],
  ClickToCopy: ['ClickCopiesValue'],
  ColumnDragging: ['DropHighlightsColumn'],
  ColumnGrouping: [
    'GroupByBanner',
    'ExpandGroupShowsRows',
    'GroupedHeaderHasIcon',
  ],
  ColumnOrdering: ['MenuReorderMovesColumn', 'LockedColumnStaysPut'],
  ColumnPinning: ['PinStartSticks', 'UnpinRestores', 'PinnedEdgeShadow'],
  ColumnResizing: [
    'DragResizesColumn',
    'DoubleClickResetsWidth',
    'ResizeMenuItemResets',
  ],
  Creating: ['CreateRowAppears'],
  DensePadding: ['ToggleChangesRowHeight'],
  Editing: ['CellEditSaves', 'RowEditSaveCancel', 'ModalEditSaves'],
  FullScreen: ['ToggleFullScreen'],
  LayoutMode: ['GridGrowsColumns', 'SemanticLayoutRenders'],
  Loading: ['SkeletonsWhileLoading', 'ProgressBarShown'],
  Pagination: [
    'NextPageChangesRows',
    'PageSizeChangesCount',
    'PagesModeNumbers',
  ],
  RowDragging: ['DragBetweenTables'],
  RowOrdering: ['DragReordersRows', 'DropSlidesRows'],
  RowPinning: ['PinRowTopMode', 'PinRowSticky', 'UnpinRow'],
  Search: [
    'TypingFiltersRows',
    'ToggleClearsAndCloses',
    'EscapeClearsThenCloses',
  ],
  SubRowTree: ['ExpandShowsChildren', 'ExpandAllCollapseAll'],
  Toolbar: [
    'InternalButtonsOrder',
    'CustomActionsRender',
    'BottomToolbarAlertBanner',
  ],
  Virtualization: [
    'ScrollRendersFurtherRows',
    'ColumnVirtualizationScrollsHeaders',
  ],
};

const PLAY_KEY = /(^|[^\w$.])play\s*:/m;
const PLAY_ASSIGN = /\.play\s*=/;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.stories.tsx') ? [full] : [];
  });

/** Whether the story exported as `name` has a play. */
const hasNamedPlay = (source, name) => {
  if (new RegExp(`^${name}\\.play\\s*=`, 'm').test(source)) return true;
  const start = source.search(
    new RegExp(`^export const ${name}\\s*(:[^=]+)?=\\s*\\{`, 'm'),
  );
  if (start < 0) return false;
  const next = source.slice(start + 1).search(/^export /m);
  const body =
    next < 0 ? source.slice(start) : source.slice(start, start + 1 + next);
  return PLAY_KEY.test(body);
};

const reports = [];
const files = walk(storiesDir).sort();
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const rel = path.relative(storiesDir, file);
  if (!PLAY_KEY.test(source) && !PLAY_ASSIGN.test(source)) {
    reports.push(`${rel}: no play`);
  }
  const [dir, base] = [path.dirname(rel), path.basename(rel, '.stories.tsx')];
  if (dir === 'features') {
    for (const name of required[base] ?? []) {
      if (!hasNamedPlay(source, name)) {
        reports.push(`${rel}: missing play ${name}`);
      }
    }
  }
}
for (const base of Object.keys(required)) {
  if (!files.some((file) => file.endsWith(`features/${base}.stories.tsx`))) {
    reports.push(`features/${base}.stories.tsx: file not found`);
  }
}

for (const line of reports) console.log(line);
console.log(
  `${files.length} story files, ${reports.length} report${reports.length === 1 ? '' : 's'}`,
);
process.exit(reports.length ? 1 : 0);
