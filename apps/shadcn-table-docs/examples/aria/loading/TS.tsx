'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { type Person } from './makeData';
import { Building2Icon, MailIcon, UserIcon } from 'lucide-react';

const data: Array<Person> = [];

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
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
      {
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },
    ],
    [],
    //end
  );

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      state={{ isLoading: true }}
      stCircularProgressProps={{
        className: 'size-[55px] text-secondary-foreground',
        strokeWidth: 5,
      }}
      stSkeletonProps={{
        className: 'h-7 animate-pulse',
      }}
    />
  );
};

export default Example;
