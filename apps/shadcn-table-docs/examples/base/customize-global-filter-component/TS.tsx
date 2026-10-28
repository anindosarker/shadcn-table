'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
    ],
    [],
    //end
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGlobalFilterModes
      initialState={{
        showGlobalFilter: true,
      }}
      positionGlobalFilter="left"
      stSearchTextFieldProps={{
        placeholder: `Search ${data.length} rows`,
        className: 'min-w-[300px]',
      }}
    />
  );
};

export default Example;
