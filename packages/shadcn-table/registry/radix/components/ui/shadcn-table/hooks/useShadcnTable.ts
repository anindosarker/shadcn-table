import { type TableState } from '@tanstack/react-table';
import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
  type ST_TableState,
} from '@/components/ui/shadcn-table/types';
import { type ST_Features } from '@/components/ui/shadcn-table/features/stFeatures';
import { useST_TableInstance } from '@/components/ui/shadcn-table/hooks/useST_TableInstance';
import { useST_TableOptions } from '@/components/ui/shadcn-table/hooks/useST_TableOptions';

export const useShadcnTable = <
  TData extends ST_RowData,
  TSelected = ST_TableState<TData>,
>(
  tableOptions: ST_TableOptions<TData>,
  selector?: (state: TableState<ST_Features>) => TSelected,
): ST_TableInstance<TData, TSelected> =>
  useST_TableInstance(useST_TableOptions(tableOptions), selector);
