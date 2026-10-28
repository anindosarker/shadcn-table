import { useEffect, useReducer, useRef } from 'react';
import {
  type ST_RowData,
  type ST_RowSelectionState,
  type ST_SortingState,
  type ST_TableInstance,
  type ST_TableState,
} from '@/components/ui-aria/shadcn-table/types';
import { getDefaultColumnOrderIds } from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';
import { getCanRankRows } from '@/components/ui-aria/shadcn-table/shared/utils/row.utils';

export const useST_Effects = <TData extends ST_RowData>(
  table: ST_TableInstance<TData, unknown>,
) => {
  const {
    getPrePaginatedRowModel,
    options: { rowCount },
  } = table;
  // The owner may not re-render on state changes (`ShadcnTable` selects only
  // the transform state), so the effects below read the store and its atoms
  // and subscribe to the slices they react to.

  const totalColumnCount = table.options.columns.length;
  const totalRowCount = rowCount ?? getPrePaginatedRowModel().rows.length;

  const rerender = useReducer(() => ({}), {})[1];
  const initialBodyHeight = useRef<string>(null);
  const previousTop = useRef<number>(null);
  const latestTable = useRef(table);
  latestTable.current = table;

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
  }, []);

  useEffect(() => {
    if (totalColumnCount !== table.atoms.columnOrder.get().length) {
      table.setColumnOrder(
        getDefaultColumnOrderIds({
          ...table.options,
          state: table.store.state as ST_TableState<TData>,
        }),
      );
    }
  }, [totalColumnCount]);

  const lastPageCheck = useRef<unknown[]>(null);
  const checkPageIndex = (totalRowCount: number) => {
    const { enablePagination } = latestTable.current.options;
    const {
      isLoading,
      pagination: { pageIndex, pageSize },
      showSkeletons,
    } = table.store.state;
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
      table.setPageIndex(totalPages - 1);
    }
  };
  const latestCheckPageIndex = useRef(checkPageIndex);
  latestCheckPageIndex.current = checkPageIndex;

  //data and option changes arrive with an owner render
  useEffect(() => {
    checkPageIndex(totalRowCount);
  });

  //state changes such as filtering may not render the owner; the check waits a
  //task so the row model is read after the components rendered the change
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const { unsubscribe } = table.store.subscribe(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const { rowCount } = latestTable.current.options;
        latestCheckPageIndex.current(
          rowCount ?? table.getPrePaginatedRowModel().rows.length,
        );
      });
    });
    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let appliedSort: ST_SortingState = table.atoms.sorting.get();
    const sortingSubscription = table.atoms.sorting.subscribe((sorting) => {
      if (sorting.length) {
        appliedSort = sorting;
      }
    });
    const applyRanking = (globalFilter: unknown) => {
      if (!getCanRankRows(latestTable.current)) return;
      if (globalFilter) {
        table.setSorting([]);
      } else {
        table.setSorting(() => appliedSort || []);
      }
    };
    applyRanking(table.atoms.globalFilter.get());
    const globalFilterSubscription =
      table.atoms.globalFilter.subscribe(applyRanking);
    return () => {
      sortingSubscription.unsubscribe();
      globalFilterSubscription.unsubscribe();
    };
  }, []);

  //fix pinned row top style when density changes
  useEffect(() => {
    const fixPinnedRows = () => {
      if (
        latestTable.current.options.enableRowPinning &&
        table.getIsSomeRowsPinned()
      ) {
        setTimeout(() => {
          rerender();
        }, 150);
      }
    };
    fixPinnedRows();
    const { unsubscribe } = table.atoms.density.subscribe(fixPinnedRows);
    return unsubscribe;
  }, []);

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
        const { enableRowPinning, rowPinningDisplayMode } =
          latestTable.current.options;
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
            table
              .getPrePaginatedRowModel()
              .flatRows.map((row, index) => [row.id, index]),
          );
          const position = (rowId: string) =>
            positions.get(rowId) ?? positions.size;
          selectedRowIds.sort((a, b) => position(a) - position(b));
        }
        table.setRowPinning(({ bottom = [], top = [] }) =>
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
  }, []);
};
