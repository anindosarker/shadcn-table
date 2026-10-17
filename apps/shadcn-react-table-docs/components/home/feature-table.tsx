import { CheckIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/cn';

type Support = boolean | null;

const columns: {
  accessorKey: 'srt' | 'mt' | 'muix';
  header: string;
  className?: string;
}[] = [
  {
    accessorKey: 'srt',
    header: 'Shadcn React Table',
    className: 'text-primary',
  },
  { accessorKey: 'mt', header: 'Material Table' },
  { accessorKey: 'muix', header: 'shadcn/ui X' },
];

const data: { feature: string; srt: Support; mt: Support; muix: Support }[] = [
  {
    feature: 'Click to copy',
    srt: true,
    mt: false,
    muix: false,
  },
  {
    feature: 'Column Action Dropdown',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Column/Row Grouping and Aggregation',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Column Hiding',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Column Ordering (DnD)',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Column Pinning (Freezing)',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Column Resizing',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Column Spanning',
    srt: false,
    mt: null,
    muix: true,
  },
  {
    feature: 'Column Virtualization',
    srt: true,
    mt: null,
    muix: true,
  },
  {
    feature: 'Custom Icons',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Data Editing',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Density Toggle',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Detail Panels',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Export to CSV',
    srt: null,
    mt: true,
    muix: true,
  },
  {
    feature: 'Filtering',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Same Column Multi-Filtering',
    srt: false,
    mt: false,
    muix: true,
  },
  {
    feature: 'Filter Modes',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Fullscreen Mode',
    srt: true,
    mt: false,
    muix: false,
  },
  {
    feature: 'Global Filtering Search',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Header Groups and Footers',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Localization (i18n)',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Manage your own state',
    srt: true,
    mt: false,
    muix: null,
  },
  {
    feature: 'Pagination',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Row Action Buttons',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Row Numbers',
    srt: true,
    mt: false,
    muix: false,
  },
  {
    feature: 'Row Ordering (DnD)',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Row Pinning',
    srt: true,
    mt: false,
    muix: true,
  },
  {
    feature: 'Row Selection',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Row Spanning',
    srt: false,
    mt: false,
    muix: null,
  },
  {
    feature: 'SSR Compatibility',
    srt: true,
    mt: null,
    muix: true,
  },
  {
    feature: 'Sorting',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Theming',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Customize Toolbars',
    srt: true,
    mt: null,
    muix: true,
  },
  {
    feature: 'Expanding Rows (Tree Data)',
    srt: true,
    mt: true,
    muix: true,
  },
  {
    feature: 'Virtualization',
    srt: true,
    mt: null,
    muix: true,
  },
];

/* MRT's initialState sorted by feature ascending. */
const sortedData = [...data].sort((a, b) => a.feature.localeCompare(b.feature));

const SupportCell = ({ value }: { value: Support }) =>
  value === true ? (
    <CheckIcon aria-label="Yes" className="mx-auto size-4 text-green-600" />
  ) : value === false ? (
    <XIcon aria-label="No" className="mx-auto size-4 text-destructive" />
  ) : (
    <TriangleAlertIcon
      aria-label="Partial"
      className="mx-auto size-4 text-yellow-600"
    />
  );

export const FeatureTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-card font-bold">
              Feature
            </TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.accessorKey}
                className={cn('text-center font-bold', column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.feature}>
              <TableCell className="sticky left-0 z-10 bg-card py-1.5 font-medium">
                {row.feature}
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.accessorKey}
                  className="py-1.5 text-center"
                >
                  <SupportCell value={row[column.accessorKey]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
