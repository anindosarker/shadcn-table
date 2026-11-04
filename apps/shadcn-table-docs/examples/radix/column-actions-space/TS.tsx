'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { HashIcon, UserIcon } from 'lucide-react';

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
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
    ],
    [], //end
  );

  const table = useShadcnTable({
    columns,
    data,
    stTableHeadCellProps: {
      className: '[&>div]:justify-between',
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
