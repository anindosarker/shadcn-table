(() => {
  window.__pend = { seenAt: null, seen: false, removedAt: null, log: [] };
  const check = (tag) => {
    const el = document.querySelector('[data-st-view-pending]');
    if (el && !window.__pend.seen) { window.__pend.seen = true; window.__pend.seenAt = performance.now(); window.__pend.ariaBusy = el.getAttribute('aria-busy') ?? (el.closest('[aria-busy]')||{getAttribute:()=>null}).getAttribute('aria-busy'); window.__pend.log.push(tag + ':seen'); }
    if (!el && window.__pend.seen && window.__pend.removedAt === null) { window.__pend.removedAt = performance.now(); window.__pend.log.push(tag + ':removed'); }
  };
  const mo = new MutationObserver(() => check('mo'));
  mo.observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-st-view-pending'] });
  document.addEventListener('DOMContentLoaded', () => { window.__pend.dcl = performance.now(); check('dcl'); });
})();
