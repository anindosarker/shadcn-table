'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_HR } from '@/components/ui/shadcn-table/shared/locales/hr';

//mock data
import { data, type Person } from './makeData';
import { CakeIcon, UserIcon } from 'lucide-react';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'Ime',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Prezime',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    icon: CakeIcon,
    header: 'Godine',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      enableColumnOrdering
      enableEditing
      enableColumnPinning
      enableRowActions
      enableRowSelection
      enableSelectAll={false}
      initialState={{ showGlobalFilter: true }}
      localization={ST_Localization_HR}
    />
  );
};

export default Example;
