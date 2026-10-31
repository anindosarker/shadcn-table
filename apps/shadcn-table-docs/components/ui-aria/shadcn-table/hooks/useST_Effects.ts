import { useEffect, useEffectEvent, useReducer, useRef } from 'react';
import {
  type ST_RowData,
  type ST_RowSelectionState,
  type ST_SortingState,
  type ST_TableInstance,
} from '@/components/ui-aria/shadcn-table/types';
import { getDefaultColumnOrderIds } from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';
import { getCanRankRows } from '@/components/ui-aria/shadcn-table/shared/utils/row.utils';

export const useST_Effects = <TData extends ST_RowData>(
  table: ST_TableInstance<TData, unknown>,
) => {
  const {
    getPrePaginatedRowModel,
    options: { rowCount },
    setColumnOrder,
    setPageIndex,
    setRowPinning,
    setSorting,
  } = table;
  // The owner may not re-render on state changes (`ShadcnTable` selects only
  // the transform state), so the effects below read the atoms and subscribe
  // to the slices they react to.

  const totalColumnCount = table.options.columns.length;
  const totalRowCount = rowCount ?? getPrePaginatedRowModel().rows.length;

  const [, rerender] = useReducer(() => ({}), {});
  const initialBodyHeight = useRef<string>(null);
  const previousTop = useRef<number>(null);

  const readOptions = useEffectEvent(() => table.options);
  const readTotalRowCount = useEffectEvent(
    () => table.options.rowCount ?? table.getPrePaginatedRowModel().rows.length,
  );
  const canRankRows = useEffectEvent(() => getCanRankRows(table));
  const getIsSomeRowsPinned = useEffectEvent(() => table.getIsSomeRowsPinned());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initialBodyHeight.current = document.body.style.height;
    }
  }, []);

  useEffect(() => {
    const applyFullScreen = (isFullScreen: boolean) => {
      if (typeof window !== 'undefined') {
        if (isFullScreen) {
          previousTop.current = document.body.getBoundingClientRect().top;
          document.body.style.height = '100dvh';
        } else {
          document.body.style.height = initialBodyHeight.current as string;
          if (!previousTop.current) return;
          window.scrollTo({
            behavior: 'instant',
            top: -1 * (previousTop.current as number),
          });
        }
      }
    };
    applyFullScreen(table.atoms.isFullScreen.get());
    //the body styles wait a task, so the layout has committed the change
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const { unsubscribe } = table.atoms.isFullScreen.subscribe(
      (isFullScreen) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => applyFullScreen(isFullScreen));
      },
    );
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [table.atoms.isFullScreen]);

  useEffect(() => {
    if (totalColumnCount !== table.atoms.columnOrder.get().length) {
      setColumnOrder(
        getDefaultColumnOrderIds({
          ...readOptions(),
          state: {
            columnOrder: table.atoms.columnOrder.get(),
            creatingRow: table.atoms.creatingRow.get(),
            grouping: table.atoms.grouping.get(),
          },
        }),
      );
    }
  }, [
    setColumnOrder,
    table.atoms.columnOrder,
    table.atoms.creatingRow,
    table.atoms.grouping,
    totalColumnCount,
  ]);

  const lastPageCheck = useRef<unknown[]>(null);
  const checkPageIndex = useEffectEvent((totalRowCount: number): void => {
    const { enablePagination } = table.options;
    const isLoading = table.atoms.isLoading.get();
    const { pageIndex, pageSize } = table.atoms.pagination.get();
    const showSkeletons = table.atoms.showSkeletons.get();
    const inputs = [totalRowCount, enablePagination, isLoading, showSkeletons];
    if (lastPageCheck.current?.every((input, i) => input === inputs[i])) {
      return;
    }
    lastPageCheck.current = inputs;
    if (!enablePagination || isLoading || showSkeletons) return;
    const totalPages: number =
      totalRowCount > 0 ? Math.ceil(totalRowCount / pageSize) : 1;
    const isOutOfBounds: boolean = pageIndex < 0 || pageIndex >= totalPages;

    if (isOutOfBounds) {
      setPageIndex(totalPages - 1);
    }
  });

  //data and option changes arrive with an owner render
  useEffect(() => {
    checkPageIndex(totalRowCount);
  });

  //state changes such as filtering may not render the owner; the check waits a
  //task so the row model is read after the components rendered the change
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const scheduleCheck = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => checkPageIndex(readTotalRowCount()));
    };
    const subscriptions = [
      table.atoms.columnFilters.subscribe(scheduleCheck),
      table.atoms.globalFilter.subscribe(scheduleCheck),
      table.atoms.columnFilterFns.subscribe(scheduleCheck),
      table.atoms.globalFilterFn.subscribe(scheduleCheck),
      table.atoms.grouping.subscribe(scheduleCheck),
      table.atoms.expanded.subscribe(scheduleCheck),
      table.atoms.pagination.subscribe(scheduleCheck),
      table.atoms.isLoading.subscribe(scheduleCheck),
      table.atoms.showSkeletons.subscribe(scheduleCheck),
    ];
    return () => {
      clearTimeout(timeout);
      subscriptions.forEach(({ unsubscribe }) => unsubscribe());
    };
  }, [
    table.atoms.columnFilterFns,
    table.atoms.columnFilters,
    table.atoms.expanded,
    table.atoms.globalFilter,
    table.atoms.globalFilterFn,
    table.atoms.grouping,
    table.atoms.isLoading,
    table.atoms.pagination,
    table.atoms.showSkeletons,
  ]);

  useEffect(() => {
    let appliedSort: ST_SortingState = table.atoms.sorting.get();
    const sortingSubscription = table.atoms.sorting.subscribe((sorting) => {
      if (sorting.length) {
        appliedSort = sorting;
      }
    });
    const applyRanking = (globalFilter: unknown) => {
      if (!canRankRows()) return;
      if (globalFilter) {
        setSorting([]);
      } else {
        setSorting(() => appliedSort || []);
      }
    };
    applyRanking(table.atoms.globalFilter.get());
    const globalFilterSubscription =
      table.atoms.globalFilter.subscribe(applyRanking);
    return () => {
      sortingSubscription.unsubscribe();
      globalFilterSubscription.unsubscribe();
    };
  }, [setSorting, table.atoms.globalFilter, table.atoms.sorting]);

  useEffect(() => {
    const fixPinnedRows = () => {
      if (readOptions().enableRowPinning && getIsSomeRowsPinned()) {
        setTimeout(() => {
          rerender();
        }, 150);
      }
    };
    fixPinnedRows();
    const { unsubscribe } = table.atoms.density.subscribe(fixPinnedRows);
    return unsubscribe;
  }, [table.atoms.density]);

  //pin or unpin every row whose selection changed, whatever changed it (a
  //click, a Shift range, select all, controlled state or the table APIs)
  useEffect(() => {
    let previousSelection: ST_RowSelectionState =
      table.atoms.rowSelection.get();
    const { unsubscribe } = table.atoms.rowSelection.subscribe(
      (rowSelection) => {
        const changedRowIds = new Set(
          [
            ...Object.keys(previousSelection),
            ...Object.keys(rowSelection),
          ].filter(
            (rowId) => !!previousSelection[rowId] !== !!rowSelection[rowId],
          ),
        );
        previousSelection = rowSelection;
        const { enableRowPinning, rowPinningDisplayMode } = readOptions();
        if (
          !changedRowIds.size ||
          !enableRowPinning ||
          !rowPinningDisplayMode?.includes('select')
        ) {
          return;
        }
        const isUnchanged = (rowId: string) => !changedRowIds.has(rowId);
        const selectedRowIds = [...changedRowIds].filter(
          (rowId) => rowSelection[rowId],
        );
        // Rows pinned together (a Shift range, select all) keep the row model
        // order, whatever order the selection lists them in.
        if (selectedRowIds.length > 1) {
          const positions = new Map(
            getPrePaginatedRowModel().flatRows.map((row, index) => [
              row.id,
              index,
            ]),
          );
          const position = (rowId: string) =>
            positions.get(rowId) ?? positions.size;
          selectedRowIds.sort((a, b) => position(a) - position(b));
        }
        setRowPinning(({ bottom = [], top = [] }) =>
          rowPinningDisplayMode.includes('bottom')
            ? {
                bottom: [...bottom.filter(isUnchanged), ...selectedRowIds],
                top: top.filter(isUnchanged),
              }
            : {
                bottom: bottom.filter(isUnchanged),
                top: [...top.filter(isUnchanged), ...selectedRowIds],
              },
        );
      },
    );
    return unsubscribe;
  }, [getPrePaginatedRowModel, setRowPinning, table.atoms.rowSelection]);
};
