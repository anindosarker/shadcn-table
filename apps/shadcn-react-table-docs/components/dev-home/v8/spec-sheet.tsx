/* SRT against the plain shadcn/ui Table. Every SRT row names the real table
 * option from the guides in content/docs; the plain column describes what
 * the shadcn Table component and its Data Table guide leave to you. */

const COLS = ['shadcn-react-table', 'Plain shadcn/ui Table'] as const;

const BUILD_IT = 'Not included. Build it on TanStack Table yourself';

const ROWS: readonly {
  feature: string;
  prop: string;
  ours: string;
  plain: string;
}[] = [
  {
    feature: 'How it ships',
    prop: 'shadcn add',
    ours: 'Source copied into your project by the shadcn CLI',
    plain: 'Markup copied into your project by the shadcn CLI',
  },
  {
    feature: 'Sorting',
    prop: 'enableSorting',
    ours: 'Header buttons, multi-sort and sort removal',
    plain: 'Wire getSortedRowModel and header buttons yourself',
  },
  {
    feature: 'Filtering',
    prop: 'enableColumnFilterModes',
    ours: 'Per-column filters with switchable filter modes',
    plain: BUILD_IT,
  },
  {
    feature: 'Global search',
    prop: 'enableGlobalFilter',
    ours: 'Toolbar search with match highlighting',
    plain: BUILD_IT,
  },
  {
    feature: 'Column pinning',
    prop: 'enableColumnPinning',
    ours: 'Pin left or right from the column menu',
    plain: BUILD_IT,
  },
  {
    feature: 'Grouping and aggregation',
    prop: 'enableGrouping',
    ours: 'Group by any column, aggregate the rest',
    plain: BUILD_IT,
  },
  {
    feature: 'Editing',
    prop: 'enableEditing',
    ours: 'Cell, row, modal and table edit modes',
    plain: BUILD_IT,
  },
  {
    feature: 'Virtualization',
    prop: 'enableRowVirtualization',
    ours: 'Rows and columns, via @tanstack/react-virtual',
    plain: BUILD_IT,
  },
  {
    feature: 'Keyboard navigation',
    prop: 'enableKeyboardShortcuts',
    ours: 'On by default',
    plain: BUILD_IT,
  },
  {
    feature: 'Localization',
    prop: 'localization',
    ours: 'Built-in locales, or pass your own strings',
    plain: 'Strings live in your own JSX',
  },
];

export function SpecSheet() {
  return (
    <table className="v8-spec">
      <caption className="sr-only">
        shadcn-react-table compared with the plain shadcn/ui Table
      </caption>
      <thead>
        <tr>
          <th scope="col">Feature</th>
          {COLS.map((c, i) => (
            <th key={c} scope="col" data-ours={i === 0 || undefined}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.feature}>
            <th scope="row">{r.feature}</th>
            <td data-label={COLS[0]} data-ours>
              <code className="v8-prop">{r.prop}</code>
              <span className="block">{r.ours}</span>
            </td>
            <td data-label={COLS[1]}>{r.plain}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
