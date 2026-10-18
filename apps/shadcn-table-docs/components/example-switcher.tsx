'use client';

import { useMemo } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PageSwitcher, sectionPages } from '@/components/page-switcher';

interface Props {
  section: PageTree.Folder;
  current: PageTree.Item;
}

/**
 * Example playground's left toolbar: "Select example" label, then the page
 * switcher combobox between previous / next buttons. The steps follow the
 * combobox's order (the section's pages, without its overview) and stop at
 * either end. The label hides below sm.
 */
export const ExampleSwitcher = ({ section, current }: Props) => {
  const pages = useMemo(() => sectionPages(section), [section]);
  const index = pages.findIndex((page) => page.url === current.url);

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="hidden font-mono text-[11px] tracking-[0.12em] whitespace-nowrap text-fd-muted-foreground uppercase sm:inline">
        Select example
      </span>
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

/** Square previous / next button; disabled when there is no page that way. */
function StepButton({
  direction,
  page,
}: {
  direction: 'previous' | 'next';
  page?: PageTree.Item;
}) {
  const router = useRouter();
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
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className="docs-playground-step"
          onClick={() => router.push(page.url)}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
