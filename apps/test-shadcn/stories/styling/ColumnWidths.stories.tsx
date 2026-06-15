import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Column Width Examples',
};

export default meta;

const data = makeData(25);

const customWidthColumns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', size: 50 },
  { accessorKey: 'lastName', header: 'Last Name', size: 300 },
  { accessorKey: 'age', header: 'Age', size: 100 },
  { accessorKey: 'address', header: 'Address', size: 50 },
];

export const CustomWidthsSemantic = () => (
  <ShadcnReactTable columns={customWidthColumns} data={data} />
);

export const CustomWidthsGrid = () => (
  <ShadcnReactTable
    columns={customWidthColumns}
    data={data}
    layoutMode="grid"
  />
);

export const CustomWidthsGridNoGrow = () => (
  <ShadcnReactTable
    columns={customWidthColumns}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const CustomWidthsGridNoGrowIndividualGrow = () => (
  <ShadcnReactTable
    columns={[
      { accessorKey: 'firstName', header: 'First Name', size: 50 },
      { accessorKey: 'lastName', header: 'Last Name', size: 300 },
      { accessorKey: 'age', header: 'Age', size: 100 },
      { accessorKey: 'address', grow: true, header: 'Address', size: 50 },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const CustomWidthsGridIndividualShrink = () => (
  <ShadcnReactTable
    columns={[
      { accessorKey: 'firstName', grow: false, header: 'First Name', size: 50 },
      { accessorKey: 'lastName', header: 'Last Name', size: 300 },
      { accessorKey: 'age', header: 'Age', size: 100 },
      { accessorKey: 'address', header: 'Address', size: 50 },
    ]}
    data={data}
    layoutMode="grid"
  />
);

const smallWidthColumns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', size: 10 },
  { accessorKey: 'lastName', header: 'Last Name', size: 10 },
  { accessorKey: 'age', header: 'Age', size: 10 },
  { accessorKey: 'address', header: 'Address', size: 10 },
  { accessorKey: 'state', header: 'State', size: 10 },
];

export const SmallWidthsSemantic = () => (
  <ShadcnReactTable columns={smallWidthColumns} data={data} />
);

export const SmallWidthsGrid = () => (
  <ShadcnReactTable columns={smallWidthColumns} data={data} layoutMode="grid" />
);

export const SmallWidthsGridNoGrow = () => (
  <ShadcnReactTable
    columns={smallWidthColumns}
    data={data}
    layoutMode="grid-no-grow"
  />
);

export const SmallWidthsGridNoGrowIndividualGrow = () => (
  <ShadcnReactTable
    columns={[
      { accessorKey: 'firstName', grow: 1, header: 'First Name', size: 10 },
      { accessorKey: 'lastName', grow: 1, header: 'Last Name', size: 10 },
      { accessorKey: 'age', header: 'Age', size: 80 },
      { accessorKey: 'address', header: 'Address', size: 200 },
    ]}
    data={data}
    layoutMode="grid-no-grow"
  />
);
