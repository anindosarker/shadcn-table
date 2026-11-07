'use client';

import { ShadcnTable, useShadcnTable } from '@/components/ui/shadcn-table';
import { columns, data } from './makeData';

const Example = () => {
  const table = useShadcnTable({
    columns,
    data,
    stPaginationProps: {
      showRowsPerPage: false,
    },
    paginationDisplayMode: 'compact', //the compact row range and arrow buttons footer
  });

  return <ShadcnTable table={table} />;
};

export default Example;
