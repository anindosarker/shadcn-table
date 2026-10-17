'use client';

import {
  ShadcnReactTable,
  useShadcnReactTable,
} from '@/components/ui/shadcn-react-table';
import { columns, data } from './makeData';

const Example = () => {
  const table = useShadcnReactTable({
    columns,
    data,
    srtPaginationProps: {
      showRowsPerPage: false,
    },
    paginationDisplayMode: 'pages',
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
