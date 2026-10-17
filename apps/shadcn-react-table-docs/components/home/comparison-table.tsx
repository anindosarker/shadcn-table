import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/cn';

const data = [
  {
    library: 'Shadcn React Table',
    libraryLink: '#',
    freeOrLicensed: 'Free MIT',
    bundleSize: 53,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/shadcn-react-table?color=blue',
    bundlePhobiaLink:
      'https://bundlephobia.com/package/shadcn-react-table@latest',
    description:
      'Built on top of TanStack Table V8 and shadcn/ui, Shadcn React Table (SRT) is a batteries-included React table library that attempts to provide all the table features you need while trying to stay as highly performant and lightweight as possible. Customization is treated as a top priority to let you override any styles you need to change. Ported from Material React Table in 2026, so it is still new.',
  },
  {
    library: 'Mantine React Table',
    libraryLink: 'https://www.mantine-react-table.com',
    freeOrLicensed: 'Free MIT',
    bundleSize: 48,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/mantine-react-table?color=blue',
    bundlePhobiaLink:
      'https://bundlephobia.com/package/mantine-react-table@latest',
    description:
      "Mantine React Table is Material React Table's sister library, forked from it to use Mantine components. Shadcn React Table shares the same TanStack Table core and feature set, but renders with shadcn/ui and Tailwind CSS. If you use Mantine instead of Tailwind, then Mantine React Table might actually be a better fit for you.",
  },
  {
    library: 'TanStack Table (React Table)',
    libraryLink: 'https://tanstack.com/table',
    freeOrLicensed: 'Free MIT',
    bundleSize: 14,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/@tanstack/react-table',
    bundlePhobiaLink:
      'https://bundlephobia.com/package/@tanstack/react-table@latest',
    description:
      'TanStack Table (formerly React Table) is a lightweight Headless UI library for building powerful tables and datagrids. No CSS or components included. You use logic from the useReactTable hook to build your own table components. No batteries included, but you get total control of your markup and styles (Shadcn React Table is built on top of TanStack Table).',
  },
  {
    library: 'Material Table',
    libraryLink: 'https://material-table.com',
    freeOrLicensed: 'Free MIT',
    bundleSize: 185,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/material-table?color=red',
    bundlePhobiaLink: 'https://bundlephobia.com/package/material-table@latest',
    description:
      'Material Table is a once-popular Material UI table library originally built in 2018 for creating Material UI tables that includes tons of features. However, it has a very large bundle size and contains outdated and insecure dependencies. It is mostly unmaintained now but did recently release a version that was somewhat compatible with Material UI V6.',
  },
  {
    library: 'MUI Datatables',
    libraryLink: 'https://github.com/gregnb/mui-datatables',
    freeOrLicensed: 'Free MIT',
    bundleSize: 96,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/mui-datatables?color=orange',
    bundlePhobiaLink: 'https://bundlephobia.com/package/mui-datatables@latest',
    description:
      'MUI Datatables is a solid Material UI-based table library that was originally built in 2017. It has a lot of features and is very customizable. However, it is not as lightweight as SRT and has a lot of dependencies. The library appears to still be kept up to date occasionally, but its documentation site is no longer available. Some of the UI layouts in MUI Datatables served as inspiration for Material React Table, and so for Shadcn React Table.',
  },
  {
    library: 'MUI X Data Grid MIT/Pro/Premium',
    libraryLink: 'https://mui.com/store/items/mui-x-premium/',
    freeOrLicensed: 'MIT or Paid License',
    bundleSize: 135,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/@mui/x-data-grid-pro?color=orange',
    bundlePhobiaLink:
      'https://bundlephobia.com/package/@mui/x-data-grid-pro@latest',
    description:
      'MUI X Data Grid MIT/Pro/Premium is one of the best Material UI Data Grid options available and it comes directly from MUI. It includes the full suite of features you may need but requires a paid license for many of the advanced features.',
  },
  {
    library: 'AG Grid Community/Enterprise',
    libraryLink: 'https://www.ag-grid.com/license-pricing',
    freeOrLicensed: 'MIT or Paid License',
    bundleSize: 332,
    bundlePhobiaImg:
      'https://img.shields.io/bundlephobia/minzip/ag-grid-enterprise?color=red',
    bundlePhobiaLink:
      'https://bundlephobia.com/package/ag-grid-enterprise@latest',
    description:
      'AG Grid Community/Enterprise is arguably the best table library of all time, but many of the advanced features require an expensive paid license. It appears to have a very large bundle size, although this is a bit misleading because it is tree-shakable and includes a lot of the UI components in the bundle. It is not built on top of shadcn/ui, but it is the benchmark most table libraries get compared to, so it is definitely relevant to this comparison.',
  },
];

const libraryColor = (library: string) =>
  library === 'Shadcn React Table'
    ? 'text-primary'
    : library === 'Mantine React Table'
      ? 'text-secondary-foreground'
      : library === 'TanStack Table (React Table)'
        ? 'text-destructive'
        : 'text-foreground';

export const ComparisonTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px] font-bold">Library</TableHead>
            <TableHead className="min-w-[80px] font-bold">
              Free or Licensed
            </TableHead>
            <TableHead className="min-w-[250px] font-bold">
              Bundle Size
            </TableHead>
            <TableHead className="min-w-[500px] font-bold">
              Description
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.library}>
              <TableCell className="align-top">
                <a
                  href={row.libraryLink}
                  target="_blank"
                  rel="noopener"
                  className={cn(
                    'font-bold no-underline hover:underline',
                    libraryColor(row.library),
                  )}
                >
                  {row.library}
                </a>
              </TableCell>
              <TableCell className="align-top">{row.freeOrLicensed}</TableCell>
              <TableCell className="align-top">
                <div className="flex items-center gap-[1ch]">
                  {`${row.bundleSize} KB`}
                  <a href={row.bundlePhobiaLink} target="_blank" rel="noopener">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={String(row.bundleSize)}
                      loading="lazy"
                      src={row.bundlePhobiaImg}
                    />
                  </a>
                </div>
              </TableCell>
              <TableCell className="whitespace-normal align-top">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
