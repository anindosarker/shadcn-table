import { ExampleTabs } from '@/components/example-tabs';
import {
  EnableStickyHeaderExample,
  EnableColumnPinningExample,
  EnableRowPinningStickyExample,
  EnableRowPinningStaticExample,
  EnableRowPinningSelectExample,
} from '@/examples/map';

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
      'sticky-header': <EnableStickyHeaderExample />,
      'column-pinning': <EnableColumnPinningExample />,
      'sticky-row-pinning': <EnableRowPinningStickyExample />,
      'static-row-pinning': <EnableRowPinningStaticExample />,
      'sticky-row-selection': <EnableRowPinningSelectExample />,
    }}
  />
);

export default StickyPinningExamples;
