'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { CakeIcon, HashIcon, UserIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        icon: UserIcon,
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
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
