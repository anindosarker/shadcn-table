// Init script of the installation-e2e browser phase (browser.mjs), added with
// page.addInitScript before any page script runs. Records in window.__pend
// the first time the table root carries data-st-view-pending (and its
// aria-busy then), the time the attribute goes, and DOMContentLoaded, so the
// gate can prove the persisted view is marked before first paint (D36).
(() => {
  const pend = {
    seen: false,
    seenAt: null,
    ariaBusy: null,
    removedAt: null,
    dcl: null,
    log: [],
  };
  window.__pend = pend;
  const check = (tag) => {
    const el = document.querySelector('[data-st-view-pending]');
    if (el && !pend.seen) {
      pend.seen = true;
      pend.seenAt = performance.now();
      const busy = el.hasAttribute('aria-busy')
        ? el
        : el.closest('[aria-busy]');
      pend.ariaBusy = busy ? busy.getAttribute('aria-busy') : null;
      pend.log.push(`${tag}:seen`);
    }
    if (!el && pend.seen && pend.removedAt === null) {
      pend.removedAt = performance.now();
      pend.log.push(`${tag}:removed`);
    }
  };
  new MutationObserver(() => check('mo')).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-st-view-pending'],
  });
  document.addEventListener('DOMContentLoaded', () => {
    pend.dcl = performance.now();
    check('dcl');
  });
})();
