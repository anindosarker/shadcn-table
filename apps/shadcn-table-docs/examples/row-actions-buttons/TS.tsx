'use client';

import { useMemo, useState } from 'react';
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import {
  Pencil as EditIcon,
  Trash2 as DeleteIcon,
  Mail as EmailIcon,
} from 'lucide-react';
import { data as initialData, type Person } from './makeData';

export const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
    //end
  );

  const [data, setData] = useState<Person[]>(initialData);

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      layoutMode="grid"
      displayColumnDefOptions={{
        'st-row-actions': {
          size: 180, //if using layoutMode that is not 'semantic', the columns will not auto-size, so you need to set the size manually
          grow: false,
        },
      }}
      enableRowActions
      renderRowActions={({ row, table }) => (
        <div className="flex flex-nowrap gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary"
            onClick={() =>
              window.open(
                `mailto:kevinvandy@mailinator.com?subject=Hello ${row.original.firstName}!`,
              )
            }
          >
            <EmailIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-secondary-foreground"
            onClick={() => {
              table.setEditingRow(row);
            }}
          >
            <EditIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              data.splice(row.index, 1); //assuming simple data table
              setData([...data]);
            }}
          >
            <DeleteIcon />
          </Button>
        </div>
      )}
    />
  );
};

export default Example;
