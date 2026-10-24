'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    initialState: { expanded: { 0: true } },
    stTableBodyRowProps: ({ isDetailPanel }) => ({
      className: isDetailPanel ? 'bg-gray-100 dark:bg-gray-900' : undefined,
    }),
    renderDetailPanel: ({ row }) => (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={row.original.gamesPlayed.map((game, index) => ({
            game,
            Points: row.original.points[index],
            Assists: row.original.assists[index],
            Turnovers: row.original.turnovers[index],
          }))}
        >
          <XAxis
            dataKey="game"
            label={{ value: 'Games Played', position: 'insideBottom' }}
            tickFormatter={(value) => `#${value}`}
          />
          <YAxis domain={[0, 60]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Points"
            stroke="hsl(var(--primary))"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Assists"
            stroke="hsl(var(--secondary-foreground))"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Turnovers"
            stroke="hsl(var(--destructive))"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    ),
  });

  return <ShadcnTable table={table} />;
};

export default Example;
