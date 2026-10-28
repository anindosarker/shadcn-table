import Link from 'next/link';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { LiveExampleKey } from './live-table';

/*
 * Outline tiles: hand-drawn line drawings of tiny tables, one per ST
 * feature. Stroke only, 1.25px, currentColor. Hover / focus makes each
 * drawing act out its feature with transform + opacity (see the
 * "Outline tiles" block in ../tokens.css for the .dh-* classes).
 *
 * Shared geometry, viewBox 0 0 160 100:
 *   frame x 8..152, y 8..92; header y 8..22; 5 row slots of 14
 *   (slot i spans 22+14i .. 36+14i, centre 29+14i); 3 columns of 48 at x 8, 56, 104.
 *
 * Plain module (no 'use client') so FEATURES stays real data in server
 * components; OutlineTile works in both.
 */

export type FeatureId =
  | 'sorting'
  | 'filtering'
  | 'column-pinning'
  | 'grouping'
  | 'virtualization'
  | 'editing'
  | 'row-selection'
  | 'detail-panel'
  | 'export'
  | 'column-resizing'
  | 'column-ordering'
  | 'localization';

export interface Feature {
  id: FeatureId;
  title: string;
  description: string;
  docsHref: string;
  /** The prop (or prop=value) that turns the feature on. */
  prop: string;
  /** LiveTable example key showing the feature. */
  example: LiveExampleKey;
}

export const FEATURES: readonly Feature[] = [
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Click a header to sort; shift-click to sort by several.',
    docsHref: '/docs/guides/sorting',
    prop: 'enableMultiSort',
    example: 'sorting',
  },
  {
    id: 'filtering',
    title: 'Filtering',
    description: 'Text, select, range and date filters per column.',
    docsHref: '/docs/guides/column-filtering',
    prop: "filterVariant: 'range'",
    example: 'filtering',
  },
  {
    id: 'column-pinning',
    title: 'Column pinning',
    description: 'Keep key columns stuck left or right while you scroll.',
    docsHref: '/docs/guides/column-pinning',
    prop: 'enableColumnPinning',
    example: 'column-pinning',
  },
  {
    id: 'grouping',
    title: 'Grouping',
    description: 'Group rows by any column and aggregate the rest.',
    docsHref: '/docs/guides/aggregation',
    prop: 'enableGrouping',
    example: 'grouping',
  },
  {
    id: 'virtualization',
    title: 'Virtualization',
    description: 'Render only the rows on screen, even with 10,000.',
    docsHref: '/docs/guides/virtualization',
    prop: 'enableRowVirtualization',
    example: 'virtualization',
  },
  {
    id: 'editing',
    title: 'Editing',
    description: 'Edit in a cell, a row, a modal or the whole table.',
    docsHref: '/docs/guides/editing',
    prop: "editDisplayMode: 'cell'",
    example: 'editing',
  },
  {
    id: 'row-selection',
    title: 'Row selection',
    description: 'Checkbox or click to select one row or many.',
    docsHref: '/docs/guides/row-selection',
    prop: 'enableRowSelection',
    example: 'row-selection',
  },
  {
    id: 'detail-panel',
    title: 'Detail panel',
    description: 'Expand a row to show anything you render.',
    docsHref: '/docs/guides/detail-panel',
    prop: 'renderDetailPanel',
    example: 'detail-panel',
  },
  {
    id: 'export',
    title: 'Export',
    description: 'Send the rows you see to CSV or PDF.',
    docsHref: '/docs/examples/export-csv',
    prop: 'renderTopToolbarCustomActions',
    example: 'export',
  },
  {
    id: 'column-resizing',
    title: 'Column resizing',
    description: 'Drag a column edge to set its width.',
    docsHref: '/docs/guides/column-resizing',
    prop: 'enableColumnResizing',
    example: 'column-resizing',
  },
  {
    id: 'column-ordering',
    title: 'Column ordering',
    description: 'Drag headers to put columns in any order.',
    docsHref: '/docs/guides/column-ordering-dnd',
    prop: 'enableColumnOrdering',
    example: 'column-ordering',
  },
  {
    id: 'localization',
    title: 'Localization',
    description: 'Every built-in string translated, RTL included.',
    docsHref: '/docs/guides/localization',
    prop: 'localization={ST_Localization_ES}',
    example: 'localization',
  },
];

export const getFeature = (id: FeatureId): Feature =>
  FEATURES.find((f) => f.id === id) as Feature;

/* ---------------------------------------------------------------- */
/* drawing helpers                                                   */
/* ---------------------------------------------------------------- */

interface MoveVars {
  dx?: number;
  dy?: number;
  r?: number;
  sx?: number;
  sy?: number;
  /** transform-origin, e.g. 'left center' */
  o?: string;
  /** transition delay in ms */
  d?: number;
}

const vars = ({ dx, dy, r, sx, sy, o, d }: MoveVars): CSSProperties => {
  const style: Record<string, string> = {};
  if (dx !== undefined) style['--dx'] = `${dx}px`;
  if (dy !== undefined) style['--dy'] = `${dy}px`;
  if (r !== undefined) style['--r'] = `${r}deg`;
  if (sx !== undefined) style['--sx'] = `${sx}`;
  if (sy !== undefined) style['--sy'] = `${sy}`;
  if (o !== undefined) style['--o'] = o;
  if (d !== undefined) style['--d'] = `${d}ms`;
  return style as CSSProperties;
};

/** A group that moves to its end pose on hover. */
const M = ({
  children,
  className,
  ...v
}: MoveVars & { children: ReactNode; className?: string }) => (
  <g className={cn('dh-m', className)} style={vars(v)}>
    {children}
  </g>
);

/** A group that fades in (or out) on hover. */
const Fade = ({
  children,
  out = false,
  d,
  className,
}: {
  children: ReactNode;
  out?: boolean;
  d?: number;
  className?: string;
}) => (
  <g className={cn(out ? 'dh-out' : 'dh-in', className)} style={vars({ d })}>
    {children}
  </g>
);

/** A "text" stand-in: a short horizontal stroke. */
const Bar = ({ x, y, w }: { x: number; y: number; w: number }) => (
  <line x1={x} y1={y} x2={x + w} y2={y} />
);

const ROW_H = 14;
const rowTop = (i: number) => 22 + ROW_H * i;
const rowMid = (i: number) => 29 + ROW_H * i;

const Frame = ({ w = 144 }: { w?: number }) => (
  <>
    <rect x={8} y={8} width={w} height={84} rx={3} />
    <line x1={8} y1={22} x2={8 + w} y2={22} />
  </>
);

/** Thin static row separators under slots 0..n-2. */
const RowRules = ({ n = 5, x2 = 152 }: { n?: number; x2?: number }) => (
  <g className="dh-thin">
    {Array.from({ length: n - 1 }, (_, i) => (
      <line key={i} x1={8} y1={rowTop(i + 1)} x2={x2} y2={rowTop(i + 1)} />
    ))}
  </g>
);

const ColRules = ({ xs = [56, 104] }: { xs?: number[] }) => (
  <g className="dh-thin">
    {xs.map((x) => (
      <line key={x} x1={x} y1={8} x2={x} y2={92} />
    ))}
  </g>
);

const HeaderBars = ({ ws = [18, 14, 20] }: { ws?: number[] }) => (
  <>
    {ws.map((w, i) => (
      <Bar key={i} x={14 + 48 * i} y={15} w={w} />
    ))}
  </>
);

/* ---------------------------------------------------------------- */
/* the drawings                                                      */
/* ---------------------------------------------------------------- */

const Sorting = () => {
  // col-1 bar lengths per original slot; on hover rows reorder ascending
  const lens = [28, 12, 34, 20, 16];
  const rank = [...lens].sort((a, b) => a - b);
  const other = [
    [22, 14],
    [16, 24],
    [26, 10],
    [12, 20],
    [20, 16],
  ];
  return (
    <>
      <Frame />
      <ColRules />
      <RowRules />
      <Bar x={14} y={15} w={16} />
      <M r={180}>
        <line x1={38} y1={12} x2={38} y2={18.5} />
        <polyline points="35.2,14.6 38,11.8 40.8,14.6" />
      </M>
      <Bar x={62} y={15} w={14} />
      <Bar x={110} y={15} w={20} />
      {lens.map((len, i) => (
        <M key={i} dy={(rank.indexOf(len) - i) * ROW_H} d={i * 30}>
          <Bar x={14} y={rowMid(i)} w={len} />
          <Bar x={62} y={rowMid(i)} w={other[i][0]} />
          <Bar x={110} y={rowMid(i)} w={other[i][1]} />
        </M>
      ))}
    </>
  );
};

const Filtering = () => {
  // slots 1 and 3 drop out; 2 and 4 slide up
  const plan = [
    { dy: 0 },
    { out: true },
    { dy: -ROW_H },
    { out: true },
    { dy: -2 * ROW_H },
  ];
  const lens = [
    [24, 18, 14],
    [16, 26, 20],
    [28, 14, 24],
    [20, 22, 12],
    [14, 20, 18],
  ];
  return (
    <>
      <Frame />
      <ColRules />
      <RowRules />
      <Bar x={14} y={15} w={18} />
      <Bar x={62} y={15} w={14} />
      <Bar x={110} y={15} w={20} />
      {/* funnel in col 2 header, narrows and fills */}
      <M sx={0.8} sy={1.1} o="center top">
        <path d="M86 11.5 h10 l-3.8 4.2 v3.6 l-2.4 -1.2 v-2.4 z" />
        <Fade>
          <path
            className="dh-fill"
            d="M86 11.5 h10 l-3.8 4.2 v3.6 l-2.4 -1.2 v-2.4 z"
          />
        </Fade>
      </M>
      {plan.map((p, i) => {
        const row = (
          <>
            <Bar x={14} y={rowMid(i)} w={lens[i][0]} />
            <Bar x={62} y={rowMid(i)} w={lens[i][1]} />
            <Bar x={110} y={rowMid(i)} w={lens[i][2]} />
          </>
        );
        return p.out ? (
          <Fade key={i} out>
            {row}
          </Fade>
        ) : (
          <M key={i} dy={p.dy} d={120}>
            {row}
          </M>
        );
      })}
    </>
  );
};

const ColumnCells = ({ x, ws }: { x: number; ws: number[] }) => (
  <>
    {ws.map((w, i) => (
      <Bar key={i} x={x + 6} y={rowMid(i)} w={w} />
    ))}
  </>
);

const ColumnPinning = () => (
  <>
    <Frame />
    <RowRules />
    <M dx={48}>
      <Bar x={14} y={15} w={18} />
      <ColumnCells x={8} ws={[24, 16, 28, 20, 14]} />
    </M>
    <M dx={48} d={40}>
      <line className="dh-thin" x1={56} y1={8} x2={56} y2={92} />
      <Bar x={62} y={15} w={14} />
      <ColumnCells x={56} ws={[18, 26, 12, 22, 20]} />
    </M>
    <M dx={-96}>
      <Fade>
        <rect className="dh-fill" x={104} y={8} width={48} height={84} />
      </Fade>
      <line className="dh-thin" x1={104} y1={8} x2={104} y2={92} />
      <Bar x={110} y={15} w={16} />
      {/* pin */}
      <circle cx={140} cy={14} r={2.2} />
      <line x1={140} y1={16.2} x2={140} y2={19.5} />
      <ColumnCells x={104} ws={[20, 14, 26, 16, 24]} />
    </M>
    {/* the pinned edge firms up once the column lands */}
    <Fade d={360}>
      <line x1={56} y1={8} x2={56} y2={92} />
      <line x1={57.5} y1={8} x2={57.5} y2={92} />
    </Fade>
  </>
);

const Grouping = () => {
  const rows = [
    [24, 18],
    [16, 22],
    [28, 14],
  ];
  return (
    <>
      <Frame />
      <ColRules xs={[104]} />
      <Bar x={14} y={15} w={22} />
      <Bar x={110} y={15} w={16} />
      {rows.map(([a, b], i) => (
        <M key={i} dx={8} dy={ROW_H} d={i * 40}>
          <Bar x={14} y={rowMid(i)} w={a} />
          <Bar x={110} y={rowMid(i)} w={b} />
          <line
            className="dh-thin"
            x1={8}
            y1={rowTop(i + 1)}
            x2={152}
            y2={rowTop(i + 1)}
          />
        </M>
      ))}
      <Fade out>
        <Bar x={14} y={rowMid(3)} w={20} />
        <Bar x={110} y={rowMid(3)} w={18} />
      </Fade>
      {/* group row */}
      <Fade d={200}>
        <rect className="dh-fill" x={8} y={22} width={144} height={14} />
        <polyline points="13,27.5 16,30.5 19,27.5" />
        <Bar x={24} y={29} w={28} />
        <text x={58} y={31.5}>
          (3)
        </text>
      </Fade>
      {/* aggregation row */}
      <Fade d={320}>
        <line x1={8} y1={rowTop(4)} x2={152} y2={rowTop(4)} />
        <path d="M110 81.5 h6 M110 81.5 l3.2 3.5 l-3.2 3.5 h6" />
        <Bar x={121} y={85} w={20} />
      </Fade>
    </>
  );
};

const Virtualization = () => {
  const lens = [24, 16, 28, 20, 14, 26, 18, 22, 12, 24];
  return (
    <>
      <Frame />
      <HeaderBars />
      {/* viewport: the nested svg clips the scrolling rows */}
      <svg x={8} y={22} width={144} height={70} viewBox="8 22 144 70">
        <M dy={-5 * ROW_H} className="dh-slow">
          {lens.map((w, i) => (
            <g key={i}>
              <Bar x={14} y={rowMid(i)} w={w} />
              <Bar x={62} y={rowMid(i)} w={((w * 7) % 20) + 8} />
              <Bar x={110} y={rowMid(i)} w={((w * 3) % 16) + 8} />
              <line
                className="dh-thin"
                x1={8}
                y1={rowTop(i + 1)}
                x2={142}
                y2={rowTop(i + 1)}
              />
            </g>
          ))}
        </M>
      </svg>
      {/* scrollbar */}
      <line className="dh-thin" x1={147} y1={25} x2={147} y2={89} />
      <M dy={42} className="dh-slow">
        <line x1={147} y1={26} x2={147} y2={46} />
      </M>
      {/* only this window is in the DOM */}
      <Fade d={200}>
        <path className="dh-dash" d="M4 26 h-1.5 v62 h1.5" />
      </Fade>
    </>
  );
};

const Editing = () => (
  <>
    <Frame />
    <ColRules />
    <RowRules />
    <HeaderBars />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <Bar x={14} y={rowMid(i)} w={[24, 16, 28, 20, 14][i]} />
        {i !== 1 && <Bar x={62} y={rowMid(i)} w={[18, 0, 12, 22, 20][i]} />}
        <Bar x={110} y={rowMid(i)} w={[20, 14, 26, 16, 24][i]} />
      </g>
    ))}
    {/* the cell being edited: old value out, input + new value in */}
    <Fade out>
      <Bar x={62} y={rowMid(1)} w={24} />
    </Fade>
    <Fade>
      <rect className="dh-fill" x={58} y={38} width={44} height={10} rx={1.5} />
      <rect x={58} y={38} width={44} height={10} rx={1.5} />
    </Fade>
    <Fade d={240}>
      <Bar x={62} y={rowMid(1)} w={18} />
    </Fade>
    <g className="dh-in" style={vars({ d: 320 })}>
      <line className="dh-blink" x1={83} y1={40.5} x2={83} y2={45.5} />
    </g>
    {/* pencil slides into the cell */}
    <M dx={-40} dy={-1}>
      <path d="M131 46 l1 -3.2 l6.5 -6.5 l2.2 2.2 l-6.5 6.5 z" />
    </M>
  </>
);

const RowSelection = () => {
  const checked = [true, true, false, true, false];
  return (
    <>
      <Frame />
      <ColRules xs={[26, 80]} />
      <RowRules />
      {checked.map((on, i) =>
        on ? (
          <Fade key={`f${i}`} d={i * 90}>
            <rect
              className="dh-fill"
              x={8}
              y={rowTop(i)}
              width={144}
              height={14}
            />
          </Fade>
        ) : null,
      )}
      {/* header checkbox goes indeterminate */}
      <rect x={13.5} y={11.5} width={7} height={7} rx={1.5} />
      <Fade d={300}>
        <line x1={15.5} y1={15} x2={18.5} y2={15} />
      </Fade>
      <Bar x={32} y={15} w={22} />
      <Bar x={86} y={15} w={18} />
      {checked.map((on, i) => (
        <g key={i}>
          <rect x={13.5} y={rowMid(i) - 3.5} width={7} height={7} rx={1.5} />
          {on && (
            <Fade d={i * 90}>
              <polyline
                points={`15.2,${rowMid(i)} 16.6,${rowMid(i) + 1.6} 19,${rowMid(i) - 1.6}`}
              />
            </Fade>
          )}
          <Bar x={32} y={rowMid(i)} w={[28, 18, 32, 22, 16][i]} />
          <Bar x={86} y={rowMid(i)} w={[20, 30, 14, 26, 22][i]} />
        </g>
      ))}
    </>
  );
};

const DetailPanel = () => {
  const lens = [
    [28, 20],
    [18, 30],
    [32, 16],
    [22, 26],
    [26, 18],
  ];
  const cells = (i: number) => (
    <>
      <polyline
        points={`14,${rowMid(i) - 3} 17,${rowMid(i)} 14,${rowMid(i) + 3}`}
      />
      <Bar x={30} y={rowMid(i)} w={lens[i][0]} />
      <Bar x={92} y={rowMid(i)} w={lens[i][1]} />
    </>
  );
  return (
    <>
      <Frame />
      <line className="dh-thin" x1={24} y1={8} x2={24} y2={92} />
      <Bar x={30} y={15} w={20} />
      <Bar x={92} y={15} w={16} />
      {/* row 0: chevron turns, row stays */}
      <M r={90} o="center">
        <polyline
          points={`13.5,${rowMid(0) - 3} 16.5,${rowMid(0)} 13.5,${rowMid(0) + 3}`}
        />
      </M>
      <Bar x={30} y={rowMid(0)} w={lens[0][0]} />
      <Bar x={92} y={rowMid(0)} w={lens[0][1]} />
      <line className="dh-thin" x1={8} y1={36} x2={152} y2={36} />
      {/* rows 1-2 make room */}
      {[1, 2].map((i) => (
        <M key={i} dy={2 * ROW_H}>
          <line
            className="dh-thin"
            x1={8}
            y1={rowTop(i + 1)}
            x2={152}
            y2={rowTop(i + 1)}
          />
          {cells(i)}
        </M>
      ))}
      {[3, 4].map((i) => (
        <Fade key={i} out>
          {i === 3 && (
            <line
              className="dh-thin"
              x1={8}
              y1={rowTop(4)}
              x2={152}
              y2={rowTop(4)}
            />
          )}
          {cells(i)}
        </Fade>
      ))}
      {/* the panel itself: a little chart */}
      <Fade d={220}>
        <rect
          className="dh-fill"
          x={28}
          y={39}
          width={118}
          height={22}
          rx={2}
        />
        <rect
          className="dh-dash"
          x={28}
          y={39}
          width={118}
          height={22}
          rx={2}
        />
        <polyline points="34,56 48,50 60,53 74,45 88,48 102,42 116,46 128,43 140,45" />
      </Fade>
    </>
  );
};

const Doc = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <>
    <path d={`M${x} ${y} h18 l8 8 v24 h-26 z`} />
    <path d={`M${x + 18} ${y} v8 h8`} />
    <text x={x + 13} y={y + 22} textAnchor="middle">
      {label}
    </text>
  </>
);

const Export = () => (
  <>
    <Frame w={88} />
    <line className="dh-thin" x1={52} y1={8} x2={52} y2={92} />
    <RowRules x2={96} />
    <Bar x={14} y={15} w={18} />
    <Bar x={58} y={15} w={14} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <Fade d={i * 60}>
          <rect
            className="dh-fill"
            x={8}
            y={rowTop(i)}
            width={88}
            height={14}
          />
        </Fade>
        <Bar x={14} y={rowMid(i)} w={[24, 16, 28, 20, 14][i]} />
        <Bar x={58} y={rowMid(i)} w={[18, 26, 12, 22, 20][i]} />
      </g>
    ))}
    <M dx={6} dy={-2} d={80}>
      <Doc x={120} y={12} label="CSV" />
    </M>
    <M dx={6} dy={2} d={160}>
      <Doc x={120} y={56} label="PDF" />
    </M>
    <Fade d={300}>
      <path d="M100 28 h18 M114 24.5 l4 3.5 l-4 3.5" />
      <path d="M100 72 h18 M114 68.5 l4 3.5 l-4 3.5" />
    </Fade>
  </>
);

const ColumnResizing = () => {
  const c1 = [18, 24, 14, 22, 16];
  const c2 = [26, 18, 28, 20, 24];
  const c3 = [20, 14, 26, 16, 24];
  return (
    <>
      <Frame />
      <RowRules />
      <line className="dh-thin" x1={104} y1={8} x2={104} y2={92} />
      <M sx={1.6} o="left center">
        <Bar x={14} y={15} w={18} />
      </M>
      {c1.map((w, i) => (
        <M key={i} sx={1.6} o="left center">
          <Bar x={14} y={rowMid(i)} w={w} />
        </M>
      ))}
      <M dx={26} sx={0.55} o="left center">
        <Bar x={62} y={15} w={14} />
      </M>
      {c2.map((w, i) => (
        <M key={i} dx={26} sx={0.55} o="left center">
          <Bar x={62} y={rowMid(i)} w={w} />
        </M>
      ))}
      <Bar x={110} y={15} w={20} />
      <ColumnCells x={104} ws={c3} />
      {/* the edge + its handle, dragged right */}
      <Fade d={0}>
        <line className="dh-dash" x1={56} y1={8} x2={56} y2={92} />
      </Fade>
      <M dx={26}>
        <line x1={56} y1={8} x2={56} y2={92} />
        <rect x={53.5} y={10.5} width={5} height={9} rx={1.5} />
        <Fade>
          <rect
            className="dh-solid"
            x={53.5}
            y={10.5}
            width={5}
            height={9}
            rx={1.5}
          />
        </Fade>
      </M>
    </>
  );
};

const ColumnOrdering = () => (
  <>
    <Frame />
    <RowRules />
    <ColRules xs={[56, 104]} />
    <Bar x={14} y={15} w={18} />
    <ColumnCells x={8} ws={[24, 16, 28, 20, 14]} />
    {/* column 3 steps aside */}
    <M dx={-48} d={120}>
      <Bar x={110} y={15} w={20} />
      <ColumnCells x={104} ws={[20, 14, 26, 16, 24]} />
    </M>
    {/* column 2 is picked up by its grip and dropped one slot right */}
    <M dx={48} dy={-3}>
      <Fade>
        <rect className="dh-fill" x={56} y={8} width={48} height={84} rx={2} />
        <rect x={56} y={8} width={48} height={84} rx={2} />
      </Fade>
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <circle
            key={`${r}${c}`}
            className="dh-solid"
            cx={95 + c * 3}
            cy={12 + r * 3}
            r={0.75}
          />
        )),
      )}
      <Bar x={62} y={15} w={14} />
      <ColumnCells x={56} ws={[18, 26, 12, 22, 20]} />
    </M>
  </>
);

const Localization = () => {
  const lens = [
    [24, 14, 20],
    [16, 10, 26],
    [28, 12, 14],
    [20, 16, 22],
    [14, 8, 18],
  ];
  return (
    <>
      <Frame />
      <ColRules />
      <RowRules />
      <Fade out>
        <text x={14} y={17.5}>
          Name
        </text>
        <text x={62} y={17.5}>
          Age
        </text>
        <text x={110} y={17.5}>
          City
        </text>
      </Fade>
      {/* right-to-left: headers and values hug the right edge. No
       * direction="rtl" here: it flips text-anchor, so "end" would start
       * the label at the column edge and run it past the border. */}
      <Fade d={120}>
        <text x={50} y={17.5} textAnchor="end">
          المدينة
        </text>
        <text x={98} y={17.5} textAnchor="end">
          العمر
        </text>
        <text x={146} y={17.5} textAnchor="end">
          الاسم
        </text>
      </Fade>
      {lens.map((row, i) =>
        row.map((w, c) => (
          <M key={`${i}${c}`} dx={36 - w} d={i * 30}>
            <Bar x={14 + 48 * c} y={rowMid(i)} w={w} />
          </M>
        )),
      )}
    </>
  );
};

const DRAWINGS: Record<FeatureId, () => ReactNode> = {
  sorting: Sorting,
  filtering: Filtering,
  'column-pinning': ColumnPinning,
  grouping: Grouping,
  virtualization: Virtualization,
  editing: Editing,
  'row-selection': RowSelection,
  'detail-panel': DetailPanel,
  export: Export,
  'column-resizing': ColumnResizing,
  'column-ordering': ColumnOrdering,
  localization: Localization,
};

/* ---------------------------------------------------------------- */
/* public components                                                 */
/* ---------------------------------------------------------------- */

/**
 * Just the drawing (muted + accent copies). Put it inside any element with
 * the `dh-tile` class, or set data-active="true" on that element, to play it.
 */
export function OutlineArt({
  feature,
  className,
}: {
  feature: FeatureId;
  className?: string;
}) {
  const Drawing = DRAWINGS[feature];
  return (
    <span className={cn('dh-tile-art', className)} aria-hidden="true">
      <svg
        className="dh-art-muted dh-draw"
        viewBox="0 0 160 100"
        focusable="false"
      >
        <Drawing />
      </svg>
      <svg
        className="dh-art-accent dh-draw"
        viewBox="0 0 160 100"
        focusable="false"
      >
        <Drawing />
      </svg>
    </span>
  );
}

export type OutlineTileSize = 'sm' | 'md' | 'lg';

export interface OutlineTileProps {
  feature: FeatureId;
  size?: OutlineTileSize;
  className?: string;
  /** Title (sm), + description (md), + prop snippet (lg). Default true. */
  showLabel?: boolean;
  /** Play the drawing without hover, e.g. the selected tile in a carousel. */
  active?: boolean;
  /** Override the link target (defaults to the feature's docs page). */
  href?: string;
  /** Render a <button> instead of a link (e.g. to open a live example). */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const sizeClass: Record<
  OutlineTileSize,
  { tile: string; title: string; desc: string }
> = {
  sm: { tile: 'gap-1.5 p-2', title: 'text-xs font-medium', desc: '' },
  md: {
    tile: 'gap-2.5 p-3',
    title: 'text-sm font-medium',
    desc: 'text-xs leading-snug',
  },
  lg: {
    tile: 'gap-3 p-4 sm:p-5',
    title: 'text-base font-semibold tracking-tight',
    desc: 'text-sm leading-snug',
  },
};

export function OutlineTile({
  feature,
  size = 'md',
  className,
  showLabel = true,
  active,
  href,
  onClick,
}: OutlineTileProps) {
  const f = getFeature(feature);
  const s = sizeClass[size];
  const content = (
    <>
      <span className="dh-tile-glow" aria-hidden="true" />
      <OutlineArt feature={feature} />
      {showLabel && (
        <span className="relative flex min-w-0 flex-col gap-1 text-left">
          <span className={cn('dh-tile-title', s.title)}>{f.title}</span>
          {size !== 'sm' && (
            <span className={cn('dh-tile-desc', s.desc)}>{f.description}</span>
          )}
          {size === 'lg' && (
            <code className="dh-tile-prop text-xs">{f.prop}</code>
          )}
        </span>
      )}
    </>
  );
  const shared = {
    className: cn('dh-tile', s.tile, className),
    'data-active': active ? 'true' : undefined,
    'aria-label': showLabel ? undefined : f.title,
  };

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} {...shared}>
        {content}
      </button>
    );
  }
  return (
    <Link href={href ?? f.docsHref} {...shared}>
      {content}
    </Link>
  );
}

export interface OutlineTileGridProps {
  /** Which features, in order. Defaults to all twelve. */
  features?: readonly FeatureId[];
  size?: OutlineTileSize;
  showLabel?: boolean;
  className?: string;
  tileClassName?: string;
}

const gridClass: Record<OutlineTileSize, string> = {
  sm: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
  md: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  lg: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

export function OutlineTileGrid({
  features = FEATURES.map((f) => f.id),
  size = 'md',
  showLabel = true,
  className,
  tileClassName,
}: OutlineTileGridProps) {
  return (
    <ul className={cn('grid gap-3 sm:gap-4', gridClass[size], className)}>
      {features.map((id) => (
        <li key={id} className="flex min-w-0">
          <OutlineTile
            feature={id}
            size={size}
            showLabel={showLabel}
            className={cn('w-full', tileClassName)}
          />
        </li>
      ))}
    </ul>
  );
}
