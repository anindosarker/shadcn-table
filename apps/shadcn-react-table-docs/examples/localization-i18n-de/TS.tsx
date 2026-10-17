'use client';

//Import Shadcn React Table and its Types
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';

//Import Shadcn React Table Translations
import { SRT_Localization_DE } from '@/components/ui/shadcn-react-table/locales/de';

//mock data
import { data, type Person } from './makeData';

const columns: SRT_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'Vorname',
  },
  {
    accessorKey: 'lastName',
    header: 'Nachname',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'Das Alter',
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
      localization={SRT_Localization_DE}
    />
  );
};

export default Example;
