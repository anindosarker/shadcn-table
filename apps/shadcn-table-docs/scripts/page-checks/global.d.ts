/**
 * The clipboard stub scripts/check-pages.mjs installs in every page: the last
 * text written through navigator.clipboard.writeText, read by the checks.
 */
declare global {
  interface Window {
    __stClipboard?: string;
  }
}

export {};
