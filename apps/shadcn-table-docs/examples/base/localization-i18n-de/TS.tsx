'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_DE } from '@/components/ui/shadcn-table/shared/locales/de';

//mock data
import { data, type Person } from './makeData';
import { CakeIcon, UserIcon } from 'lucide-react';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'Vorname',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Nachname',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    icon: CakeIcon,
    header: 'Das Alter',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnOrdering
      enableEditing
      enableColumnPinning
      enableRowActions
      enableRowSelection
      enableSelectAll={false}
      initialState={{ showGlobalFilter: true }}
      localization={ST_Localization_DE}
    />
  );
};

export default Example;
