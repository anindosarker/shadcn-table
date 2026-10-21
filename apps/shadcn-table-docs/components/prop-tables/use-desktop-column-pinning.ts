'use client';

import { useState } from 'react';
import type { ST_ColumnPinningState } from '@/components/ui-radix/shadcn-table';
import { useMediaQuery } from '@/lib/use-media-query';

/**
 * Column pinning for the prop tables: on desktop pin the name column (with the
 * expand and row-number display columns) to the start and the link column to the
 * end, on
 * narrow screens unpin everything. The pinning follows the breakpoint but stays
 * editable by the user in between (the table still calls `setColumnPinning`).
 */
export function useDesktopColumnPinning(nameColumnId: string) {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [columnPinning, setColumnPinning] = useState<ST_ColumnPinningState>({
    start: [],
    end: [],
  });
  const [pinnedForDesktop, setPinnedForDesktop] = useState(isDesktop);

  //adjust the state while rendering when the breakpoint changes instead of mirroring it from an effect
  if (pinnedForDesktop !== isDesktop) {
    setPinnedForDesktop(isDesktop);
    setColumnPinning(
      isDesktop
        ? {
            start: ['st-row-expand', 'st-row-numbers', nameColumnId],
            end: ['link'],
          }
        : { start: [], end: [] },
    );
  }

  return [columnPinning, setColumnPinning] as const;
}
