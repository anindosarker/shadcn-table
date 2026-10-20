'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_NP } from '@/components/ui/shadcn-table/locales/np';

//mock data
import { data, type Person } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'नाम',
  },
  {
    accessorKey: 'lastName',
    header: 'थर',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'उमेर',
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
      initialState={{ showColumnFilters: true, showGlobalFilter: true }}
      localization={ST_Localization_NP}
    />
  );
};

export default Example;
