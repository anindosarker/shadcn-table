import { ExampleTabs } from '@/components/example-tabs';
import StickyHeaderExample from '@/examples/enable-sticky-header';
import ColumnPinningExample from '@/examples/enable-column-pinning';
import RowPinningStickyExample from '@/examples/enable-row-pinning-sticky';
import RowPinningStaticExample from '@/examples/enable-row-pinning-static';
import StickySelectExample from '@/examples/enable-row-pinning-select';

const StickyPinningExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Sticky Header', value: 'sticky-header' },
      { label: 'Column Pinning', value: 'column-pinning' },
      { label: 'Row Pinning (Sticky)', value: 'sticky-row-pinning' },
      { label: 'Row Pinning (Static)', value: 'static-row-pinning' },
      { label: 'Sticky Row Selection', value: 'sticky-row-selection' },
    ]}
    panels={{
      'sticky-header': <StickyHeaderExample />,
      'column-pinning': <ColumnPinningExample />,
      'sticky-row-pinning': <RowPinningStickyExample />,
      'static-row-pinning': <RowPinningStaticExample />,
      'sticky-row-selection': <StickySelectExample />,
    }}
  />
);

export default StickyPinningExamples;
