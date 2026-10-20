import posthog from 'posthog-js';
import type { Base, PackageManager } from '@/lib/install';

/**
 * The docs app's PostHog events, one function per event with typed
 * properties. Components call these and never `posthog` directly, so renaming
 * an event is a change to this file alone. Every function is a no-op until
 * components/posthog-provider.tsx has initialised posthog-js, which it does
 * only with `NEXT_PUBLIC_POSTHOG_KEY` set.
 */

/** Where on the page the action happened. */
export type Surface =
  | 'header'
  | 'command_bar'
  | 'tabs'
  | 'docs_page'
  | 'example'
  | 'home'
  | 'mdx_link'
  | 'nav'
  | 'footer';

const capture = (event: string, properties?: Record<string, string>) => {
  if (posthog.__loaded) posthog.capture(event, properties);
};

/** The site-wide base changed through one of its controls. */
export const trackBaseSwitched = (p: {
  from: Base;
  to: Base;
  surface: Surface;
}) => capture('base_switched', p);

/** A `shadcn add` command for a registry item went to the clipboard. */
export const trackInstallCommandCopied = (p: {
  item: string;
  base: Base;
  package_manager: PackageManager;
  surface: Surface;
}) => capture('install_command_copied', p);

/** An example panel switched to a view that shows the code. */
export const trackExampleCodeOpened = (p: {
  example: string;
  base: Base;
  mode: 'code' | 'both';
}) => capture('example_code_opened', p);

/** The reader opened another file of an example in the code explorer. */
export const trackExampleFileViewed = (p: {
  example: string;
  base: Base;
  file: string;
}) => capture('example_file_viewed', p);

/** A Storybook link was followed. */
export const trackStorybookOpened = (p: { base: Base; surface: Surface }) =>
  capture('storybook_opened', p);

/** A GitHub or Discord link was followed. */
export const trackOutboundClicked = (p: {
  target: 'github' | 'discord';
  surface: Surface;
}) => capture('outbound_clicked', p);

/** The search dialog opened. */
export const trackSearchOpened = () => capture('search_opened');
