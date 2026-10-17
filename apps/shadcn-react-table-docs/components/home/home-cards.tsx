import Link from 'next/link';
import { AwardIcon, BlocksIcon, CodeIcon, ZapIcon } from 'lucide-react';
import { Logo } from '@/components/logo';

const cardClass = 'flex flex-col gap-2 rounded-lg border bg-card p-4';
const headingClass =
  'mb-2 flex items-center justify-center gap-3 text-center text-xl font-semibold';

const AnchorLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="text-primary hover:underline">
    {children}
  </Link>
);

export const HomeCards = () => {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cardClass}>
            <h3 className={headingClass}>The Best of Both Worlds</h3>
            <div className="mx-auto my-4 flex justify-center">
              <Logo />
            </div>
            <p>
              Combine TanStack Table&apos;s Extensive API With shadcn/ui&apos;s
              Awesome Pre-Built Components!
            </p>
          </div>
          <div className={cardClass}>
            <h3 className={headingClass}>
              <ZapIcon aria-label="Efficiency Icon" className="size-6" />{' '}
              Efficient Bundle Size
            </h3>
            <p>37-53 KB depending on components imported.</p>
            <p>
              Import the recommended <code>ShadcnReactTable</code> component, or
              optionally import lighter weight SRT sub-components that only
              include the UI you need.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cardClass}>
            <h3 className={headingClass}>
              <BlocksIcon aria-label="Quality Icon" className="size-6" />{' '}
              Pre-Built or 100% Custom
            </h3>
            <p>
              Use the pre-built single component data grid with the{' '}
              <code>&lt;ShadcnReactTable /&gt;</code> component.
            </p>
            <p>
              Or build your own markup from scratch using the{' '}
              <code>useShadcnReactTable</code> hook.
            </p>
            <p>
              All internal SRT components are exported for you to use as
              &quot;lego blocks&quot; to build your own custom tables.
            </p>
          </div>
          <div className={cardClass}>
            <h3 className={headingClass}>
              <CodeIcon aria-label="Customizable Icon" className="size-6" />{' '}
              Easy Customization
            </h3>
            <p>
              Just about everything is customizable or overridable in Shadcn
              React Table. Pass in custom props or styles to all internal
              components. Use simple <code>enable*</code> props to easily enable
              or disable features.
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className={cardClass}>
          <h3 className={headingClass}>
            <AwardIcon aria-label="Quality Icon" className="size-6" /> Powerful
            Features
          </h3>
          <p>
            Shadcn React Table has most of the features you would expect from a
            modern table library including{' '}
            <AnchorLink href="/docs/guides/pagination">Pagination</AnchorLink>,{' '}
            <AnchorLink href="/docs/guides/sorting">Sorting</AnchorLink>,{' '}
            <AnchorLink href="/docs/guides/column-filtering">
              Filtering
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/row-selection">
              Row Selection
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/expanding-sub-rows">
              Row Expansion
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/column-resizing">
              Column Resizing
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/column-ordering-dnd">
              Column Reordering
            </AnchorLink>
            , etc.
          </p>
          <p>
            However, Shadcn React Table also has advanced features that you may
            not find in other table libraries such as{' '}
            <AnchorLink href="/docs/guides/virtualization">
              Virtualization
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/aggregation-and-grouping">
              Aggregation and Grouping
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/examples/advanced">
              Advanced Filter UIs
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/global-filtering">
              Fuzzy Search
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/editing">
              Full Editing (CRUD)
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/column-pinning">
              Column Pinning
            </AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/row-pinning">Row Pinning</AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/row-numbers">Row Numbers</AnchorLink>
            ,{' '}
            <AnchorLink href="/docs/guides/click-to-copy">
              Click to Copy
            </AnchorLink>
            , and more.
          </p>
        </div>
        <div className={cardClass}>
          <h3 className={headingClass}>30+ i18n Locales</h3>
          <p>
            The SRT Community has contributed{' '}
            <AnchorLink href="/docs/guides/localization">
              over&nbsp;30&nbsp;Locales
            </AnchorLink>{' '}
            for everyone to import and use.
          </p>
        </div>
      </div>
    </div>
  );
};
