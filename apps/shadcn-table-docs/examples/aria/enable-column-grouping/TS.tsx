'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
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

  const table = useShadcnTable({
    columns,
    data,
    enableGrouping: true,
    groupedColumnMode,
    initialState: {
      expanded: true, //expand all groups by default
      grouping: ['state', 'gender'], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    stTableContainerProps: { className: 'max-h-[800px]' },
  });

  return (
    <div className="flex flex-col gap-4">
      <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      />
      <ShadcnTable table={table} />
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
    <RadioGroup
      className="mx-auto flex w-fit flex-col items-center"
      value={String(groupedColumnMode)}
      onChange={(value) =>
        setGroupedColumnMode(value === 'false' ? false : (value as any))
      }
    >
      <Label>Grouped Column Mode</Label>
      <div className="flex gap-2">
        <RadioGroupItem value="reorder" className="w-auto gap-2">
          &quot;reorder&quot; (default)
        </RadioGroupItem>
        <RadioGroupItem value="remove" className="w-auto gap-2">
          &quot;remove&quot;
        </RadioGroupItem>
        <RadioGroupItem value="false" className="w-auto gap-2">
          false
        </RadioGroupItem>
      </div>
    </RadioGroup>
  );
};
//end
