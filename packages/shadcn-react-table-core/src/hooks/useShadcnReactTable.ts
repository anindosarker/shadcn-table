import { SRT_RowData, SRT_TableInstance, SRT_TableOptions } from '../types';
import { useSRT_TableInstance } from './useSRT_TableInstance';
import { useSRT_TableOptions } from './useSRT_TableOptions';

export const useShadcnReactTable = <TData extends SRT_RowData>(
  tableOptions: SRT_TableOptions<TData>,
): SRT_TableInstance<TData> =>
  useSRT_TableInstance(useSRT_TableOptions(tableOptions));
