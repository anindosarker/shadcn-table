// The core table is built once per mounted table, so plain `{ current }`
// objects set here live as long as the table and no `useRef` is needed.
import type {
  RowData,
  TableFeature,
  TableFeatures,
} from '@tanstack/react-table';
import type { RefObject } from 'react';

export interface ST_TableRefs {
  actionCellRef: RefObject<HTMLTableCellElement | null>;
  bottomToolbarRef: RefObject<HTMLDivElement | null>;
  editInputRefs: RefObject<Record<string, HTMLInputElement>>;
  filterInputRefs: RefObject<Record<string, HTMLInputElement>>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  tableFooterRef: RefObject<HTMLTableSectionElement | null>;
  tableHeadCellRefs: RefObject<Record<string, HTMLTableCellElement>>;
  tableHeadRef: RefObject<HTMLTableSectionElement | null>;
  tableLayoutRef: RefObject<HTMLDivElement | null>;
  topToolbarRef: RefObject<HTMLDivElement | null>;
}

export interface ST_Table_Refs {
  refs: ST_TableRefs;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- declaration merging repeats the TanStack type parameters */
declare module '@tanstack/react-table' {
  interface Plugins {
    stRefsFeature: TableFeature;
  }
  interface Table_FeatureMap<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    stRefsFeature: ST_Table_Refs;
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

export const stRefsFeature: TableFeature = {
  constructTableAPIs: (table) => {
    (table as unknown as ST_Table_Refs).refs = {
      actionCellRef: { current: null },
      bottomToolbarRef: { current: null },
      editInputRefs: { current: {} },
      filterInputRefs: { current: {} },
      searchInputRef: { current: null },
      tableContainerRef: { current: null },
      tableFooterRef: { current: null },
      tableHeadCellRefs: { current: {} },
      tableHeadRef: { current: null },
      tableLayoutRef: { current: null },
      topToolbarRef: { current: null },
    };
  },
};
