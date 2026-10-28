'use client';

import { useRef } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnVirtualizer,
} from '@/components/ui/shadcn-table';
import { fakeColumns, fakeData } from './makeData';

const Example = () => {
  //optionally access the underlying virtualizer instance
  const columnVirtualizerInstanceRef = useRef<ST_ColumnVirtualizer>(null);

  const table = useShadcnTable({
    columnVirtualizerInstanceRef, //optional
    columnVirtualizerOptions: { overscan: 4 }, //optionally customize the virtualizer
    columns: fakeColumns, //500 columns
    data: fakeData,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableColumnVirtualization: true,
    enableRowNumbers: true,
  });

  return <ShadcnTable table={table} />;
};

export default Example;
