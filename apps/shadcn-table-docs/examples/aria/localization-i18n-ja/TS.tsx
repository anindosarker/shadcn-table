'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_JA } from '@/components/ui/shadcn-table/shared/locales/ja';

//mock data
import { data, type Person } from './makeData';
import { CakeIcon, UserIcon } from 'lucide-react';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'ファーストネーム',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: '苗字',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    icon: CakeIcon,
    header: '年',
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
      localization={ST_Localization_JA}
    />
  );
};

export default Example;
