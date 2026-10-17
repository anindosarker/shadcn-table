'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Age',
        accessorKey: 'age',
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
      },
    ],
    [],
    //end
  );

  //demo state
  const [groupedColumnMode, setGroupedColumnMode] = useState<
    false | 'remove' | 'reorder'
  >('reorder'); //default is 'reorder

  const table = useShadcnReactTable({
    columns,
    data,
    enableGrouping: true,
    groupedColumnMode,
    initialState: {
      expanded: true, //expand all groups by default
      grouping: ['state', 'gender'], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    srtTableContainerProps: { className: 'max-h-[800px]' },
  });

  return (
    <div className="flex flex-col gap-4">
      <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      />
      <ShadcnReactTable table={table} />
    </div>
  );
};

export default Example;

//demo...
const DemoRadioGroup = ({
  groupedColumnMode,
  setGroupedColumnMode,
}: {
  groupedColumnMode: false | 'remove' | 'reorder';
  setGroupedColumnMode: (
    groupedColumnMode: false | 'remove' | 'reorder',
  ) => void;
}) => {
  return (
    <div className="mx-auto text-center">
      <Label>Grouped Column Mode</Label>
      <RadioGroup
        className="flex"
        value={String(groupedColumnMode)}
        onValueChange={(value) =>
          setGroupedColumnMode(value === 'false' ? false : (value as any))
        }
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="reorder" id="grouped-column-mode-reorder" />
          <Label htmlFor="grouped-column-mode-reorder">
            &quot;reorder&quot; (default)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="remove" id="grouped-column-mode-remove" />
          <Label htmlFor="grouped-column-mode-remove">&quot;remove&quot;</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="false" id="grouped-column-mode-false" />
          <Label htmlFor="grouped-column-mode-false">false</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
//end
