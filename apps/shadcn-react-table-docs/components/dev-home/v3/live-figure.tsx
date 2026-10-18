'use client';

import { useState } from 'react';
import {
  LiveTable,
  type LiveExampleKey,
} from '@/components/dev-home/shared/live-table';

const FIGURES: { key: LiveExampleKey; label: string; prop: string }[] = [
  {
    key: 'advanced',
    label: 'Advanced',
    prop: 'enableGrouping, enableColumnPinning, enableRowSelection',
  },
  {
    key: 'column-pinning',
    label: 'Pinning',
    prop: 'enableColumnPinning: true',
  },
  { key: 'grouping', label: 'Grouping', prop: 'enableGrouping: true' },
  { key: 'editing', label: 'Editing', prop: "editDisplayMode: 'table'" },
];

/** Fig. 01: the real component, switchable between four examples. */
export function LiveFigure() {
  const [current, setCurrent] = useState(0);
  const fig = FIGURES[current];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b border-dashed border-(--v3-dash) px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="v3-label">
          <span className="text-(--dh-accent)">Fig. 01</span>
          <span aria-hidden="true"> / </span>
          Live table
        </p>
        <div
          role="group"
          aria-label="Example"
          className="flex flex-wrap items-center gap-1"
        >
          {FIGURES.map((f, i) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={i === current}
              onClick={() => setCurrent(i)}
              className="v3-toggle"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <LiveTable
        key={fig.key}
        example={fig.key}
        className="v3-live"
        bodyClassName="min-h-[26rem] p-2 sm:p-4"
      />
      <div className="flex flex-col gap-1 border-t border-dashed border-(--v3-dash) px-4 py-3 text-xs text-(--dh-ink-muted) sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <p className="text-pretty">
          The shipped component, not a recording. Sort, filter, resize and page
          it.
        </p>
        <code className="v3-mono min-w-0 truncate text-(--dh-ink-faint)">
          {fig.prop}
        </code>
      </div>
    </div>
  );
}
