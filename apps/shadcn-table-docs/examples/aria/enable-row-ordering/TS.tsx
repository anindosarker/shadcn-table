'use client';

import { useMemo, useState } from 'react';
import {
  useShadcnTable,
  type ST_ColumnDef,
  type ST_Row,
  type ST_TableState,
  ST_TableContainer,
  ST_TableProvider,
} from '@/components/ui/shadcn-table';
import { data as initData, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
    //end
  );

  const [data, setData] = useState(() => initData);

  const table = useShadcnTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    stRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.store
          .state as ST_TableState<Person>;
        if (hoveredRow && draggingRow) {
          data.splice(
            (hoveredRow as ST_Row<Person>).index,
            0,
            data.splice(draggingRow.index, 1)[0],
          );
          setData([...data]);
        }
      },
    }),
  });

  return (
    <ST_TableProvider table={table}>
      <ST_TableContainer />
    </ST_TableProvider>
  );
};

export default Example;
