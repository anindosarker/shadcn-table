import { ExampleTabs } from '@/components/example-tabs';
import CSVExport from '@/examples/export-to-csv';
import PDFExport from '@/examples/export-to-pdf';

const DataExportExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Export to CSV', value: 'export-csv' },
      { label: 'Export to PDF', value: 'export-pdf' },
    ]}
    panels={{
      'export-csv': <CSVExport />,
      'export-pdf': <PDFExport />,
    }}
  />
);

export default DataExportExamples;
