'use client';

//Import Shadcn React Table and its Types
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';

//Import Shadcn React Table Translations
import { SRT_Localization_PL } from '@/components/ui/shadcn-react-table/locales/pl';

//mock data
import { data, type Person } from './makeData';

const columns: SRT_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'Imię',
  },
  {
    accessorKey: 'lastName',
    header: 'Nazwisko',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'Wiek',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnReactTable
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
      localization={SRT_Localization_PL}
    />
  );
};

export default Example;
