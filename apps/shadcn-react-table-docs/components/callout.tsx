import {
  Callout as FumaCallout,
  CalloutContainer as FumaCalloutContainer,
  type CalloutContainerProps,
} from 'fumadocs-ui/components/callout';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/* TanStack-style note: flat surface, square left edge with a 4px accent bar.
   Right corners use the docs chrome radius (app/global.css --docs-radius), not
   the shadcn scale. */
const calloutClass =
  'srt-callout rounded-l-none rounded-r-(--docs-radius) border-l-4 border-l-(--callout-color) ps-3';

export function Callout(props: ComponentProps<typeof FumaCallout>) {
  return (
    <FumaCallout {...props} className={cn(calloutClass, props.className)} />
  );
}

export function CalloutContainer(props: CalloutContainerProps) {
  return (
    <FumaCalloutContainer
      {...props}
      className={cn(calloutClass, props.className)}
    />
  );
}
