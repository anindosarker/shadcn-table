import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Button } from '@/components/ui/button';
import { HomeCards } from '@/components/home/home-cards';
import { LinkCards } from '@/components/home/link-cards';
import { GuideCard } from '@/components/home/guide-card';
import { ComparisonTable } from '@/components/home/comparison-table';
import { LinkHeading } from '@/components/home/link-heading';
import { FeatureTable } from '@/components/home/feature-table';
import BasicExamples from '@/example-groups/BasicExamples';

const installCommand =
  'pnpm dlx shadcn@latest add anindosarker/shadcn-react-table/shadcn-react-table';

const gradientText =
  'inline bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent';

const navButtons = [
  { href: '/docs/getting-started/install', label: 'Get Started' },
  { href: '/docs/api', label: 'API' },
  { href: '/docs/examples', label: 'Examples' },
  { href: '/docs/guides', label: 'Guides' },
] as const;

export default async function HomePage() {
  const installBlock = await highlight(installCommand, {
    lang: 'bash',
    components: { pre: Pre },
  });

  return (
    <div className="flex w-full flex-col px-4 pb-16">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col">
        <h1 className="mt-16 text-center text-[1.8rem] leading-10 font-bold sm:text-5xl sm:leading-[3.5rem] md:text-6xl md:leading-[4rem] lg:text-7xl lg:leading-[5rem] xl:text-8xl xl:leading-[5.25rem]">
          Welcome To
          <br />
          <span className={gradientText}>
            Shadcn&nbsp;React&nbsp;Table
            <sup className="text-base sm:text-xl md:text-2xl lg:text-4xl">
              V1
            </sup>
          </span>
        </h1>
        <h2 className="mb-4 text-center text-xl leading-9 font-normal text-muted-foreground sm:text-2xl md:text-[2.2rem] lg:text-4xl">
          Built with{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener"
            className="text-primary no-underline hover:underline"
          >
            shadcn/ui
          </a>{' '}
          and&nbsp;
          <a
            href="https://tanstack.com/table/v8"
            target="_blank"
            rel="noopener"
            className="text-primary/70 no-underline hover:underline"
          >
            TanStack&nbsp;Table<sup>V8</sup>
          </a>
        </h2>
        <div className="mx-auto my-4 grid w-full justify-center gap-6 grid-cols-[15rem] sm:grid-cols-[14rem_14rem] md:grid-cols-[16rem_16rem] lg:grid-cols-[12rem_11rem_11rem_11rem] xl:grid-cols-4">
          {navButtons.map((button, index) => (
            <Button
              key={button.href}
              asChild
              size="lg"
              variant={index === 0 ? 'default' : 'secondary'}
              className="w-full"
            >
              <Link href={button.href}>
                {button.label}
                <ChevronRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          ))}
        </div>
        <div className="mx-auto w-full max-w-2xl">
          <CodeBlock>{installBlock}</CodeBlock>
        </div>
        <HomeCards />
        <h3 className="my-8 text-center text-2xl font-semibold md:text-3xl">
          Popular Docs
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <GuideCard
            title="Best Practices"
            href="/docs/guides/best-practices"
          />
          <GuideCard title="Table Options" href="/docs/api/table-options" />
          <GuideCard title="Advanced Example" href="/docs/examples/advanced" />
          <GuideCard
            title="Fetching Example"
            href="/docs/examples/react-query"
          />
          <GuideCard title="Localization" href="/docs/guides/localization" />
          <GuideCard title="Create Columns" href="/docs/guides/data-columns" />
          <GuideCard
            title="Column Filtering"
            href="/docs/guides/column-filtering"
          />
          <GuideCard title="Selection" href="/docs/guides/row-selection" />
        </div>
      </div>
      <h3 className="my-8 text-center text-2xl font-semibold md:text-3xl">
        Examples To Get You Started
      </h3>
      <BasicExamples />
      <h3 className="mt-20 text-center text-2xl font-semibold md:text-[2rem] xl:text-[2.5rem]">
        Is <span className={gradientText}>&lt;ShadcnReactTable&nbsp;/&gt;</span>{' '}
        Right For Your Project?
      </h3>
      <div className="m-8 text-center">
        <LinkHeading
          as="h4"
          className="text-xl font-medium text-muted-foreground md:text-2xl"
        >
          Let&apos;s Compare
        </LinkHeading>
      </div>
      <ComparisonTable />
      <div className="m-8 text-center">
        <LinkHeading
          as="h4"
          className="text-xl font-medium text-muted-foreground md:text-2xl"
        >
          Feature Comparison
        </LinkHeading>
      </div>
      <FeatureTable />
      <p className="mt-4 text-sm font-medium">
        *If you see any inaccuracies in this table, PRs are welcome!
      </p>
      <LinkCards />
    </div>
  );
}
