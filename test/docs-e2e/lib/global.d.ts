/**
 * The clipboard stub test/docs-e2e/test.mjs installs in every page: the last
 * text written through navigator.clipboard.writeText, read by the checks.
 */
declare global {
  interface Window {
    __stClipboard?: string;
  }
}

export {};
