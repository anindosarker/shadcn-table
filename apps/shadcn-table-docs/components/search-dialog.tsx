'use client';

import * as React from 'react';
import type { DefaultSearchDialogProps } from 'fumadocs-ui/components/dialog/search-default';

const DefaultSearchDialog = React.lazy(
  () => import('fumadocs-ui/components/dialog/search-default'),
);

const subscribe = () => () => {};

/**
 * fumadocs' default search dialog, rendered only in the browser.
 *
 * Closed, the dialog still renders its backdrop and footer into the server
 * HTML, inside a Suspense boundary that hydrates after the rest of the page.
 * A modal Radix popup opened before that (the theme panel's Sheet, a menu)
 * marks those not-yet-hydrated elements `aria-hidden`, and their hydration
 * then fails on the extra attributes. Rendering nothing on the server and in
 * the hydration pass leaves no server HTML to change; the dialog mounts right
 * after, and the open state lives in fumadocs' SearchProvider, so a search
 * opened in between shows once it mounts.
 */
export function SearchDialog(props: DefaultSearchDialogProps) {
  const inBrowser = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return inBrowser ? <DefaultSearchDialog {...props} /> : null;
}
