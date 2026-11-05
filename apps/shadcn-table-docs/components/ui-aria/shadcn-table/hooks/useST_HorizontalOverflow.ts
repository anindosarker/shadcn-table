import { type RefObject, useEffect } from 'react';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';

const setFlag = (element: HTMLElement, name: string, on: boolean) => {
  if (on) element.setAttribute(name, '');
  else element.removeAttribute(name);
};

/**
 * Tracks the sideways overflow of `scrollRef` and writes it to `wrapperRef`
 * as `data-overflow-start` and `data-overflow-end`, with the box's vertical
 * scrollbar width as `--st-scrollbar-y` and the pinned columns' widths as
 * `--st-pin-start` and `--st-pin-end`. Everything goes to the DOM, so a
 * scroll never re-renders the table.
 *
 * A passive scroll listener covers scrolling; one ResizeObserver on the box
 * and its first child covers window and column size changes; the pinning,
 * sizing and visibility slices are watched without a render.
 */
export const useST_HorizontalOverflow = <TData extends ST_RowData>(
  wrapperRef: RefObject<HTMLElement | null>,
  scrollRef: RefObject<HTMLElement | null>,
  table: ST_TableInstance<TData>,
): void => {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const box = scrollRef.current;
    if (!wrapper || !box) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const { clientWidth, scrollWidth } = box;
      // RTL boxes scroll towards negative scrollLeft values.
      const scrolled = Math.abs(box.scrollLeft);
      // A pixel of slack absorbs sub-pixel widths and zoom rounding.
      setFlag(wrapper, 'data-overflow-start', scrolled > 1);
      setFlag(
        wrapper,
        'data-overflow-end',
        scrolled + clientWidth < scrollWidth - 1,
      );
      wrapper.style.setProperty(
        '--st-scrollbar-y',
        `${box.offsetWidth - clientWidth - box.clientLeft * 2}px`,
      );
      wrapper.style.setProperty(
        '--st-pin-start',
        `${table.getStartTotalSize()}px`,
      );
      wrapper.style.setProperty('--st-pin-end', `${table.getEndTotalSize()}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    box.addEventListener('scroll', schedule, { passive: true });
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(schedule);
    observer?.observe(box);
    if (box.firstElementChild) observer?.observe(box.firstElementChild);
    const subscriptions = [
      table.atoms.columnPinning.subscribe(schedule),
      table.atoms.columnSizing.subscribe(schedule),
      table.atoms.columnVisibility.subscribe(schedule),
    ];
    return () => {
      box.removeEventListener('scroll', schedule);
      observer?.disconnect();
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      if (frame) cancelAnimationFrame(frame);
    };
  }, [wrapperRef, scrollRef, table]);
};
