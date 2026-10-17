'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { Button } from '@/components/ui/button';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
    //end
  );

  const [progress, setProgress] = useState(0);

  //simulate random progress for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.random() * 20;
        return Math.min(oldProgress + newProgress, 100);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      srtLinearProgressProps={({ isTopToolbar }) => ({
        progressComponentProps: {
          className:
            '[&_[data-slot=progress-indicator]]:bg-secondary-foreground',
          value: progress, //value between 0 and 100 (determinate); null shows indeterminate
        },
        collapsibleProps: {
          className: isTopToolbar ? 'block' : 'hidden', //hide bottom progress bar
        },
      })}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setProgress(0)}>Reset</Button>
      )}
      state={{ showProgressBars: true }}
    />
  );
};

export default Example;
