import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui-base/button';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-base/shadcn-table/types';

const readPx = (element: HTMLElement, name: string) =>
  parseFloat(getComputedStyle(element).getPropertyValue(name)) || 0;

// Hidden cues are `invisible`, which also drops them from the accessibility
// tree and from hit testing; the wrapper carries `group/st-scroll`.
const scrollButtonClassName =
  'pointer-events-none invisible absolute top-5 z-5 -translate-y-1/2 bg-background text-muted-foreground opacity-0 transition-[opacity,visibility] duration-200';

/**
 * Two chevrons centred in the 40 px header row, just inside the pinned
 * columns' inner edges, shown while the table is hovered and that side has
 * hidden columns. A click scrolls 80 percent of the unpinned width. Render
 * inside the wrapper `useST_HorizontalOverflow` writes to.
 */
export const ST_ScrollButtons = <TData extends ST_RowData>({
  table,
}: {
  table: ST_TableInstance<TData>;
}): ReactNode => {
  const {
    options: {
      icons: { ChevronLeftIcon, ChevronRightIcon },
      localization,
    },
    refs: { tableContainerRef },
  } = table;

  const scrollByPage = (direction: -1 | 1) => {
    const box = tableContainerRef.current;
    if (!box) return;
    const pinned = readPx(box, '--st-pin-start') + readPx(box, '--st-pin-end');
    const visible = Math.max(box.clientWidth - pinned, 0);
    const rtl = getComputedStyle(box).direction === 'rtl' ? -1 : 1;
    box.scrollBy({ behavior: 'smooth', left: direction * rtl * visible * 0.8 });
  };

  return (
    <>
      <button
        aria-label={localization.scrollLeft}
        className={cn(
          buttonVariants({ size: 'icon-xs', variant: 'ghost' }),
          scrollButtonClassName,
          'inset-s-[calc(var(--st-pin-start)+(--spacing(1)))] group-hover/st-scroll:group-data-overflow-start/st-scroll:pointer-events-auto group-hover/st-scroll:group-data-overflow-start/st-scroll:visible group-hover/st-scroll:group-data-overflow-start/st-scroll:opacity-100',
        )}
        data-slot="button"
        onClick={() => scrollByPage(-1)}
        tabIndex={-1}
        type="button"
      >
        <ChevronLeftIcon className="rtl:rotate-180" />
      </button>
      <button
        aria-label={localization.scrollRight}
        className={cn(
          buttonVariants({ size: 'icon-xs', variant: 'ghost' }),
          scrollButtonClassName,
          'inset-e-[calc(var(--st-pin-end)+var(--st-scrollbar-y)+(--spacing(1)))] group-hover/st-scroll:group-data-overflow-end/st-scroll:pointer-events-auto group-hover/st-scroll:group-data-overflow-end/st-scroll:visible group-hover/st-scroll:group-data-overflow-end/st-scroll:opacity-100',
        )}
        data-slot="button"
        onClick={() => scrollByPage(1)}
        tabIndex={-1}
        type="button"
      >
        <ChevronRightIcon className="rtl:rotate-180" />
      </button>
    </>
  );
};
