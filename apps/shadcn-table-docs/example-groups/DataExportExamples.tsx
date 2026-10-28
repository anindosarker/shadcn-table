import { ExampleTabs } from '@/components/example-tabs';
import { ExportToCsvExample, ExportToPdfExample } from '@/examples/map';

const DataExportExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Export to CSV', value: 'export-csv' },
      { label: 'Export to PDF', value: 'export-pdf' },
    ]}
    panels={{
      'export-csv': <ExportToCsvExample />,
      'export-pdf': <ExportToPdfExample />,
    }}
  />
);

export default DataExportExamples;
