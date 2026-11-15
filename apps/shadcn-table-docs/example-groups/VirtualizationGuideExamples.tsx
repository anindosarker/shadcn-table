import Link from 'next/link';
import { ExampleTabs } from '@/components/example-tabs';
import {
  EnableRowVirtualizationExample,
  EnableColumnVirtualizationExample,
} from '@/examples/map';

/** Link to the tab's example page, its title as the link text. */
const ExamplePageLink = ({ slug, title }: { slug: string; title: string }) => (
  <p className="text-sm">
    <Link
      className="font-medium underline underline-offset-4"
      href={`/docs/examples/${slug}`}
    >
      {title}
    </Link>
  </p>
);

/**
 * Example section of the Virtualization Guide (new format B, preview only):
 * one tab per matching example page, each with its page link and live table.
 */
const VirtualizationGuideExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Row Virtualization', value: 'row-virtualization' },
      { label: 'Column Virtualization', value: 'column-virtualization' },
    ]}
    panels={{
      'row-virtualization': (
        <div className="flex flex-col gap-2">
          <ExamplePageLink
            slug="row-virtualization"
            title="Row Virtualization Example"
          />
          <EnableRowVirtualizationExample />
        </div>
      ),
      'column-virtualization': (
        <div className="flex flex-col gap-2">
          <ExamplePageLink
            slug="column-virtualization"
            title="Column Virtualization Example"
          />
          <EnableColumnVirtualizationExample />
        </div>
      ),
    }}
  />
);

export default VirtualizationGuideExamples;
