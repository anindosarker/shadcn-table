'use client';

import { useState } from 'react';
import type { ST_ColumnPinningState } from '@/components/ui/shadcn-table';
import { useMediaQuery } from '@/lib/use-media-query';

/**
 * Column pinning for the prop tables: on desktop pin the name column (with the
 * expand and row-number display columns) left and the link column right, on
 * narrow screens unpin everything. The pinning follows the breakpoint but stays
 * editable by the user in between (the table still calls `setColumnPinning`).
 */
export function useDesktopColumnPinning(nameColumnId: string) {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const [columnPinning, setColumnPinning] = useState<ST_ColumnPinningState>({});
  const [pinnedForDesktop, setPinnedForDesktop] = useState(isDesktop);

  //adjust the state while rendering when the breakpoint changes instead of mirroring it from an effect
  if (pinnedForDesktop !== isDesktop) {
    setPinnedForDesktop(isDesktop);
    setColumnPinning(
      isDesktop
        ? {
            left: ['st-row-expand', 'st-row-numbers', nameColumnId],
            right: ['link'],
          }
        : {},
    );
  }

  return [columnPinning, setColumnPinning] as const;
}
