import {
  type ST_RowData,
  type ST_TableInstance,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { useST_TableInstance } from '@/components/ui/shadcn-table/hooks/useST_TableInstance';
import { useST_TableOptions } from '@/components/ui/shadcn-table/hooks/useST_TableOptions';

export const useShadcnTable = <TData extends ST_RowData>(
  tableOptions: ST_TableOptions<TData>,
): ST_TableInstance<TData> =>
  useST_TableInstance(useST_TableOptions(tableOptions));
