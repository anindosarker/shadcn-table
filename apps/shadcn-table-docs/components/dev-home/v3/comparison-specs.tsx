import { CheckIcon, MinusIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

/* Same facts as components/home/comparison-table.tsx and feature-table.tsx,
 * redrawn as dashed spec tables. */

const LIBRARIES = [
  {
    name: 'shadcn-table',
    href: '/docs/getting-started/install',
    license: 'MIT',
    renders: 'shadcn/ui + Tailwind CSS',
    us: true,
  },
  {
    name: 'Mantine React Table',
    href: 'https://www.mantine-react-table.com',
    license: 'MIT',
    renders: 'Mantine',
  },
  {
    name: 'TanStack Table',
    href: 'https://tanstack.com/table',
    license: 'MIT',
    renders: 'Headless, bring your own markup',
  },
  {
    name: 'Material Table',
    href: 'https://material-table.com',
    license: 'MIT',
    renders: 'Material UI',
  },
  {
    name: 'MUI Datatables',
    href: 'https://github.com/gregnb/mui-datatables',
    license: 'MIT',
    renders: 'Material UI',
  },
  {
    name: 'MUI X Data Grid',
    href: 'https://mui.com/store/items/mui-x-premium/',
    license: 'MIT or paid',
    renders: 'Material UI',
  },
  {
    name: 'AG Grid',
    href: 'https://www.ag-grid.com/license-pricing',
    license: 'MIT or paid',
    renders: 'Its own components',
  },
] as const;

type Support = boolean | null;

const MATRIX: [feature: string, srt: Support, mt: Support, muix: Support][] = [
  ['Click to copy', true, false, false],
  ['Column action dropdown', true, false, true],
  ['Column hiding', true, true, true],
  ['Column ordering (DnD)', true, true, true],
  ['Column pinning', true, true, true],
  ['Column resizing', true, true, true],
  ['Column spanning', false, null, true],
  ['Column virtualization', true, null, true],
  ['Custom icons', true, true, true],
  ['Customize toolbars', true, null, true],
  ['Data editing', true, true, true],
  ['Density toggle', true, false, true],
  ['Detail panels', true, true, true],
  ['Expanding rows (tree data)', true, true, true],
  ['Export to CSV', null, true, true],
  ['Filter modes', true, false, true],
  ['Filtering', true, true, true],
  ['Fullscreen mode', true, false, false],
  ['Global filtering search', true, true, true],
  ['Grouping and aggregation', true, true, true],
  ['Header groups and footers', true, false, true],
  ['Localization (i18n)', true, true, true],
  ['Manage your own state', true, false, null],
  ['Pagination', true, true, true],
  ['Row action buttons', true, true, true],
  ['Row numbers', true, false, false],
  ['Row ordering (DnD)', true, false, true],
  ['Row pinning', true, false, true],
  ['Row selection', true, true, true],
  ['Row spanning', false, false, null],
  ['Same column multi-filtering', false, false, true],
  ['Sorting', true, true, true],
  ['SSR compatibility', true, null, true],
  ['Theming', true, true, true],
  ['Virtualization', true, null, true],
];

const Glyph = ({ value }: { value: Support }) =>
  value === true ? (
    <CheckIcon aria-label="Yes" className="mx-auto size-4 text-(--dh-ink)" />
  ) : value === false ? (
    <XIcon aria-label="No" className="mx-auto size-4 text-(--dh-ink-faint)" />
  ) : (
    <MinusIcon
      aria-label="Partial"
      className="mx-auto size-4 text-(--dh-ink-muted)"
    />
  );

export function LibraryTable() {
  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="v3-table min-w-[32rem]">
        <caption className="sr-only">React table libraries compared</caption>
        <thead>
          <tr>
            <th scope="col">Library</th>
            <th scope="col">License</th>
            <th scope="col">Renders with</th>
          </tr>
        </thead>
        <tbody>
          {LIBRARIES.map((l) => {
            const us = 'us' in l;
            return (
              <tr key={l.name} className={cn(us && 'v3-us')}>
                <th scope="row" className="font-medium whitespace-nowrap">
                  <a
                    href={l.href}
                    {...(us ? {} : { target: '_blank', rel: 'noreferrer' })}
                    className={cn(
                      'underline-offset-4 hover:underline',
                      us ? 'text-(--dh-accent)' : 'text-(--dh-ink)',
                    )}
                  >
                    {l.name}
                  </a>
                </th>
                <td className="v3-mono text-xs whitespace-nowrap text-(--dh-ink-muted)">
                  {l.license}
                </td>
                <td className="text-(--dh-ink-muted)">{l.renders}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MatrixTable({ rows }: { rows: typeof MATRIX }) {
  return (
    <table className="v3-table">
      <caption className="sr-only">Feature support by library</caption>
      <thead>
        <tr>
          <th scope="col">Feature</th>
          <th scope="col" className="v3-glyph v3-us text-(--dh-accent)!">
            ST
          </th>
          <th scope="col" className="v3-glyph">
            <abbr title="Material Table" className="no-underline">
              MT
            </abbr>
          </th>
          <th scope="col" className="v3-glyph">
            MUI X
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([feature, srt, mt, muix]) => (
          <tr key={feature}>
            <th
              scope="row"
              className="py-1.5! font-normal text-(--dh-ink-muted)"
            >
              {feature}
            </th>
            <td className="v3-glyph v3-us py-1.5!">
              <Glyph value={srt} />
            </td>
            <td className="v3-glyph py-1.5!">
              <Glyph value={mt} />
            </td>
            <td className="v3-glyph py-1.5!">
              <Glyph value={muix} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** The feature matrix, split in two columns on wide screens. */
export function FeatureMatrix() {
  const half = Math.ceil(MATRIX.length / 2);
  return (
    <div className="v3-grid v3-grid-2">
      <div className="v3-cell">
        <MatrixTable rows={MATRIX.slice(0, half)} />
      </div>
      <div className="v3-cell">
        <MatrixTable rows={MATRIX.slice(half)} />
      </div>
    </div>
  );
}
