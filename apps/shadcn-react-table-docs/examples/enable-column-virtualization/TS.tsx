'use client';

import { useRef } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnVirtualizer,
} from '@/components/ui/shadcn-react-table';
import { fakeColumns, fakeData } from './makeData';

const Example = () => {
  //optionally access the underlying virtualizer instance
  const columnVirtualizerInstanceRef = useRef<SRT_ColumnVirtualizer>(null);

  const table = useShadcnReactTable({
    columnVirtualizerInstanceRef, //optional
    columnVirtualizerOptions: { overscan: 4 }, //optionally customize the virtualizer
    columns: fakeColumns, //500 columns
    data: fakeData,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    enableRowNumbers: true,
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
