'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const Loading = () => (
  <div
    role="status"
    className="flex min-h-[18rem] items-center justify-center text-sm text-(--dh-ink-muted)"
  >
    Loading table
  </div>
);

/**
 * Real ST examples from examples/<folder>/TS.tsx, loaded lazily on the
 * client only. Keys match the FEATURES ids in outline-tiles.tsx where a
 * feature has a matching example, so a tile can open its own live table.
 * next/dynamic wants each import and options object written out literally.
 */
const examples = {
  advanced: dynamic(() => import('@/examples/.radix/advanced/TS'), {
    ssr: false,
    loading: Loading,
  }),
  basic: dynamic(() => import('@/examples/.radix/basic/TS'), {
    ssr: false,
    loading: Loading,
  }),
  sorting: dynamic(() => import('@/examples/.radix/multi-sorting/TS'), {
    ssr: false,
    loading: Loading,
  }),
  filtering: dynamic(
    () => import('@/examples/.radix/customize-filter-variants/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  'column-pinning': dynamic(
    () => import('@/examples/.radix/enable-column-pinning/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  grouping: dynamic(
    () => import('@/examples/.radix/aggregation-and-grouping/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  virtualization: dynamic(() => import('@/examples/.radix/virtualized/TS'), {
    ssr: false,
    loading: Loading,
  }),
  editing: dynamic(() => import('@/examples/.radix/editing-crud-table/TS'), {
    ssr: false,
    loading: Loading,
  }),
  'row-selection': dynamic(
    () => import('@/examples/.radix/enable-row-selection/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  'detail-panel': dynamic(
    () => import('@/examples/.radix/enable-detail-panel-conditionally/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  export: dynamic(() => import('@/examples/.radix/export-to-csv/TS'), {
    ssr: false,
    loading: Loading,
  }),
  'column-resizing': dynamic(
    () => import('@/examples/.radix/enable-column-resizing/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  'column-ordering': dynamic(
    () => import('@/examples/.radix/enable-column-ordering/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
  localization: dynamic(
    () => import('@/examples/.radix/localization-i18n-es/TS'),
    {
      ssr: false,
      loading: Loading,
    },
  ),
};

export type LiveExampleKey = keyof typeof examples;

export const LIVE_EXAMPLE_KEYS = Object.keys(examples) as LiveExampleKey[];

interface LiveTableProps {
  example?: LiveExampleKey;
  /** Optional caption under the table. */
  caption?: ReactNode;
  className?: string;
  /** Classes for the inner wrapper that holds the table itself. */
  bodyClassName?: string;
}

/** A live, interactive ST example in a hairline frame. No fake chrome. */
export function LiveTable({
  example = 'advanced',
  caption,
  className,
  bodyClassName,
}: LiveTableProps) {
  const Example = examples[example];
  return (
    <figure
      className={cn(
        'dh-live min-w-0 overflow-hidden rounded-xl border border-(--dh-rule) bg-(--dh-paper)',
        className,
      )}
    >
      <div className={cn('min-w-0 overflow-x-auto p-2 sm:p-3', bodyClassName)}>
        <Example />
      </div>
      {caption ? (
        <figcaption className="border-t border-(--dh-rule) px-3 py-2 text-xs text-(--dh-ink-muted)">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
