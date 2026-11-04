import { useMemo } from 'react';
import { type Meta } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/Loading Data',
};

export default meta;

type Person = {
  address: string;
  city: string;
  name: {
    firstName: string;
    lastName: string;
  };
  state: string;
};

export const NestedLoadingDataWithInitialExpanded = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      //column definitions...
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      //end
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      state={{
        expanded: true,
        isLoading: true,
      }}
    />
  );
};

export const NestedLoadingDataWithInitialFilter = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      //column definitions...
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      //end
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      state={{
        columnFilters: [{ id: 'name.firstName', value: 'Branson' }],
        isLoading: true,
      }}
    />
  );
};

export const NestedLoadingDataWithInitialGroup = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      //column definitions...
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      //end
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      state={{
        grouping: ['name.firstName'],
        isLoading: true,
      }}
    />
  );
};

export const NestedLoadingDataWithInitialPage = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      //column definitions...
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      //end
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      state={{
        isLoading: true,
        pagination: { pageIndex: 2, pageSize: 5 },
      }}
    />
  );
};

export const NestedLoadingDataWithInitialSort = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      //column definitions...
      {
        accessorKey: 'name.firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      //end
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={columns}
      data={[]}
      state={{
        isLoading: true,
        sorting: [{ desc: false, id: 'name.lastName' }],
      }}
    />
  );
};

export const AccessorKeyWhileLoading = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorFn: (row) =>
          `${row.name.firstName.toUpperCase()} ${row.name.lastName.toUpperCase()}`,
        header: 'Name',
        icon: UserIcon,
        id: 'name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
    ],
    [],
    //end
  );

  return (
    <ShadcnTable columns={columns} data={[]} state={{ isLoading: true }} />
  );
};
