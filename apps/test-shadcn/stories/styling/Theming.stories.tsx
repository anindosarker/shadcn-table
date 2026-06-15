import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Styling/Theming',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
];

const data = makeData(21);

export const DefaultTheme = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

// API GAP: MUI ThemeProvider/createTheme (palette primary/secondary/background) and mrtTheme not supported in SRT.
// SRT theming is driven by Tailwind/shadcn CSS variables + cva variants / className instead.
export const CustomLightTheme = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);

// API GAP: MUI ThemeProvider/createTheme dark palette and mrtTheme not supported in SRT.
// Use the shadcn `.dark` class on an ancestor + Tailwind CSS variables instead.
export const CustomDarkTheme = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowSelection />
);
