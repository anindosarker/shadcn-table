'use client';

import { useMemo, useState } from 'react';
import {
  useShadcnTable,
  type ST_ColumnDef,
  type ST_Row,
  ST_TableContainer,
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
        const { draggingRow, hoveredRow } = table.state;
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

  return <ST_TableContainer table={table} />;
};

export default Example;
