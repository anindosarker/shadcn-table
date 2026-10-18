import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import { beforeAll } from 'vitest';
import * as projectAnnotations from './preview';

// Apply the preview config (global decorators, parameters, dark-mode harness)
// to every story rendered as a Vitest test. The addon prints an info box
// saying this is automatic since Storybook 10.3, but with 10.6.2 removing the
// call makes every story fail with "context.renderToCanvas is not a function"
// (the react-vite framework annotations are not provisioned), so keep it.
const project = setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
]);

beforeAll(project.beforeAll);

/**
 * console.error calls that are expected from specific stories and would
 * otherwise clutter the test output. React passes a printf-style format
 * string plus arguments, so each predicate sees the raw argument list.
 * Keep this list short and named.
 */
const allowedConsoleErrors: Array<(args: unknown[]) => boolean> = [
  // styling/CustomTableBody: `stTableBodyProps={{ children: 'Custom Table Body' }}`
  // puts a text node straight into <tbody>, same as the MRT story. React 19
  // reports it as a hydration-style DOM nesting error:
  // console.error('In HTML, text nodes cannot be a child of <%s>. ...', 'tbody', ...)
  ([format, tag]) =>
    typeof format === 'string' &&
    format.startsWith('In HTML, text nodes cannot be a child of <%s>.') &&
    tag === 'tbody',
];

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (allowedConsoleErrors.some((allowed) => allowed(args))) {
    return;
  }
  originalConsoleError(...args);
};
