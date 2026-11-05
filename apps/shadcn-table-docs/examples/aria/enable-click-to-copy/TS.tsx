'use client';

import { useMemo } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Building2Icon, MailIcon, UserIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
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
        enableClickToCopy: true,
        stCopyButtonProps: {
          className: 'w-full justify-start',
        },
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        enableClickToCopy: true,
      },
    ],
    [],
  );

  return <ShadcnTable columns={columns} data={data} />;
};

export default Example;
