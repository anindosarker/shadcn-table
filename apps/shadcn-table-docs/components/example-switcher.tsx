'use client';

import { useMemo } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui-radix/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui-radix/tooltip';
import { useExamplePage } from '@/components/example-page-context';
import { PageSwitcher, sectionPages } from '@/components/page-switcher';
import { EXAMPLES_URL, scrollStackTo } from '@/lib/examples-url';

interface Props {
  section: PageTree.Folder;
  current: PageTree.Item;
}

/**
 * Example playground's left toolbar: the page switcher combobox between
 * previous / next buttons. The steps follow the combobox's order (the
 * section's pages, without its overview) and stop at either end.
 */
export const ExampleSwitcher = ({ section, current }: Props) => {
  const pages = useMemo(() => sectionPages(section), [section]);
  const index = pages.findIndex((page) => page.url === current.url);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <StepButton
        direction="previous"
        page={index > 0 ? pages[index - 1] : undefined}
      />
      <PageSwitcher
        section={section}
        current={current}
        className="h-8 min-w-0 shrink rounded-md border bg-fd-secondary px-2.5 text-sm font-medium text-fd-foreground"
      />
      <StepButton
        direction="next"
        page={
          index !== -1 && index < pages.length - 1
            ? pages[index + 1]
            : undefined
        }
      />
    </div>
  );
};

/**
 * Square previous / next button; disabled when there is no page that way.
 * On the examples stack it scrolls the stack to that example's block (the URL
 * follows as `#<slug>`); on a single page it navigates to the page.
 */
function StepButton({
  direction,
  page,
}: {
  direction: 'previous' | 'next';
  page?: PageTree.Item;
}) {
  const router = useRouter();
  const onStack = useExamplePage() !== null;
  const Icon = direction === 'previous' ? ChevronLeftIcon : ChevronRightIcon;
  const verb = direction === 'previous' ? 'Previous' : 'Next';

  if (!page) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled
        aria-disabled="true"
        aria-label={`${verb} example`}
        className="docs-playground-step"
      >
        <Icon />
      </Button>
    );
  }

  const label = `${verb}: ${typeof page.name === 'string' ? page.name : ''}`;
  const go = () => {
    const slug = page.url.startsWith(`${EXAMPLES_URL}/`)
      ? page.url.slice(EXAMPLES_URL.length + 1)
      : undefined;
    if (onStack && slug && scrollStackTo(slug)) return;
    router.push(page.url);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className="docs-playground-step"
          onClick={go}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
