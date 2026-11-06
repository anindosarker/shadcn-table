// usage: node gate.mjs <base> <port> [steps]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const [base, port, only] = process.argv.slice(2);
const S = '/private/tmp/claude-501/-Users-anindosarker-Work-Personal-React-table/13d1b0a3-6637-482d-84a6-6db8776a4a16/scratchpad/release-gate/base';
const CAP = S;
fs.mkdirSync(CAP, { recursive: true });
const env = { ...process.env, AGENT_BROWSER_SESSION: `g08-${base}` };
const URL = `http://localhost:${port}`;
const out = {};
const consoleLog = [];
const ab = (...args) => execFileSync('agent-browser', args, { env, encoding: 'utf8', maxBuffer: 1 << 26 }).trim();
const sleep = (ms) => ab('wait', String(ms));
const ev = (body) => {
  const raw = ab('eval', `(()=>{ const __r = (()=>{ ${body} })(); return JSON.stringify(__r === undefined ? null : __r); })()`);
  let v = JSON.parse(raw);
  return typeof v === 'string' ? JSON.parse(v) : v;
};
const evAsync = (body) => {
  const raw = ab('eval', `(async()=>{ const __r = await (async()=>{ ${body} })(); return JSON.stringify(__r === undefined ? null : __r); })()`);
  let v = JSON.parse(raw);
  return typeof v === 'string' ? JSON.parse(v) : v;
};
const center = (sel) => ev(`const e=${sel}; if(!e) return null; const r=e.getBoundingClientRect(); return [Math.round(r.x+r.width/2), Math.round(r.y+r.height/2)];`);
const click = (sel) => {
  const ok = ev(`document.querySelectorAll('[data-gate-target]').forEach(e=>e.removeAttribute('data-gate-target')); const e=${sel}; if(!e) return false; e.setAttribute('data-gate-target',''); return true;`);
  if (!ok) throw new Error('no element ' + sel);
  ab('click', '[data-gate-target]');
  sleep(350);
  return ok;
};
const clickAt = (x, y) => { ab('mouse', 'move', String(x), String(y)); ev(`const e=document.elementFromPoint(${x},${y}); document.querySelectorAll('[data-gate-target]').forEach(e=>e.removeAttribute('data-gate-target')); e.setAttribute('data-gate-target',''); return 1`); ab('click', '[data-gate-target]'); sleep(350); };
const q = (css) => `document.querySelector(${JSON.stringify(css)})`;
const byText = (css, text) => `[...document.querySelectorAll(${JSON.stringify(css)})].find(e=>e.textContent.trim().toLowerCase()===${JSON.stringify(text.toLowerCase())} && e.getClientRects().length)`;
const th = (id) => q(`thead th[data-flip-column="${id}"]`);
const chevron = (id) => `${th(id)}.querySelector('button[aria-label="Column Actions"]')`;
const label = (id, name) => `${th(id)}.querySelector('[aria-label="${name} column menu"]')`;
const menuItems = () => ev(`return [...document.querySelectorAll('[role=menu]')].filter(m=>m.getClientRects().length).flatMap(m=>[...m.querySelectorAll('[role^=menuitem]')]).map(m=>(m.textContent.trim())+((m.getAttribute('aria-disabled')==='true'||m.hasAttribute('data-disabled'))?' (disabled)':''))`);
const menuOpen = () => ev(`return [...document.querySelectorAll('[role=menu]')].filter(m=>m.getClientRects().length).length`);
const press = (k) => { ab('press', k); sleep(250); };
const collectConsole = (page) => {
  const c = ab('console'); const e = ab('errors');
  const lines = c.split('\n').filter(Boolean);
  const warn = lines.filter((l) => /^\[(warn|warning)\]/i.test(l));
  const err = lines.filter((l) => /^\[error\]/i.test(l));
  const errs = e.split('\n').filter((l) => l.trim() && !/no errors|^✓/i.test(l));
  const ariaWarn = lines.filter((l) => /react aria|must be focusable|interactive ARIA role|aria-label/i.test(l));
  consoleLog.push({ page, warnings: warn.length, errors: err.length + errs.length, ariaWarnings: ariaWarn.length, sample: [...warn, ...err, ...errs].slice(0, 6) });
  ab('console', '--clear'); ab('errors', '--clear');
};
const open = (path) => { for (let i = 0; ; i++) { try { ab('open', URL + path); break; } catch (e) { if (i >= 2) throw e; sleep(2000); } } sleep(1500); for (let i = 0; i < 20 && ev(`return document.readyState`) !== 'complete'; i++) sleep(250); };
const step = (name, fn) => {
  if (only && !only.split(',').includes(name)) return;
  if (['columnMenu','filter','sort','viewSettings','viewIcons','headerDrag','lockedName','overflow','search','actionsColumn'].includes(name)) { collectConsole('release-gate before ' + name); open('/release-gate'); }
  try { out[name] = { pass: true, ...fn() }; }
  catch (e) { out[name] = { pass: false, error: String(e.message || e).slice(0, 400) }; }
  // close stray popups
  try { ab('press', 'Escape'); ab('press', 'Escape'); } catch {}
  console.error(name, JSON.stringify(out[name]).slice(0, 600));
};
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };

ab('--init-script', `${S}/init.js`, 'set', 'viewport', '1800', '1150');
ab('set', 'media', 'light');
try { ab('console', '--clear'); ab('errors', '--clear'); } catch {}
open('/release-gate');
ev(`localStorage.clear(); return 1`);
open('/release-gate');

step('noScript', () => {
  const n = ev(`return document.querySelectorAll('[data-slot=st-table-layout] script').length`);
  expect(n === 0, `scripts inside layout: ${n}`);
  return { scripts: n };
});

step('icons', () => {
  const r = ev(`const ic=window.__gateTable.options.icons||{}; const k=Object.keys(ic); return {keys:k.length, undef:k.filter(x=>ic[x]==null), svgUndefined: document.querySelectorAll('svg[class*=undefined]').length}`);
  expect(r.keys > 0 && r.undef.length === 0, 'icons ' + JSON.stringify(r));
  return r;
});

step('toolbarOrder', () => {
  const order = ev(`const f=${q('[data-slot=st-table-frame]')}; const lay=${q('[data-slot=st-table-layout]')}; return [...lay.querySelectorAll('button[aria-label]')].filter(b=>!f.contains(b) && b.getClientRects().length).map(b=>b.getAttribute('aria-label'))`);
  const want = ['Show/Hide search', 'Filter', 'Sort', 'Show/Hide columns', 'Toggle density', 'Toggle full screen', 'View settings'];
  expect(JSON.stringify(order) === JSON.stringify(want), 'order ' + JSON.stringify(order));
  return { order };
});

step('columnMenu', () => {
  click(chevron('status'));
  expect(menuOpen() === 1, 'chevron did not open menu');
  const unsorted = menuItems();
  click(chevron('status'));
  sleep(200);
  expect(menuOpen() === 0, 'second chevron click did not close');
  click(label('status', 'Status'));
  expect(menuOpen() === 1, 'label did not open menu');
  const viaLabel = menuItems();
  expect(JSON.stringify(viaLabel) === JSON.stringify(unsorted), 'label menu differs');
  click(byText('[role=menu] [role^=menuitem]', 'Sort ascending'));
  sleep(200);
  click(chevron('status'));
  const sorted = menuItems();
  click(chevron('status'));
  expect(menuOpen() === 0, 'second click (sorted) did not close');
  click(chevron('status'));
  click(byText('[role=menu] [role^=menuitem]', 'Pin to start'));
  click(chevron('status'));
  const pinned = menuItems();
  click(byText('[role=menu] [role^=menuitem]', 'Unpin'));
  click(chevron('status'));
  click(byText('[role=menu] [role^=menuitem]', 'Clear sort'));
  const want0 = ['Sort ascending', 'Sort descending', 'Filter', 'Pin to start', 'Pin to end', 'Hide'];
  expect(JSON.stringify(unsorted) === JSON.stringify(want0), 'unsorted items ' + JSON.stringify(unsorted));
  expect(sorted.includes('Sort ascending (disabled)') && sorted.includes('Clear sort'), 'sorted items ' + JSON.stringify(sorted));
  expect(pinned.includes('Unpin') && !pinned.includes('Pin to start'), 'pinned items ' + JSON.stringify(pinned));
  const after = ev(`return { sorting: window.__gateTable.atoms.sorting.get(), pin: window.__gateTable.atoms.columnPinning.get() }`);
  return { unsorted, sorted, pinned, after };
});

step('filter', () => {
  const rows0 = ev(`return window.__gateTable.getFilteredRowModel().rows.length`);
  click(chevron('status'));
  click(byText('[role=menu] [role^=menuitem]', 'Filter'));
  sleep(400);
  const chip = ev(`const lay=${q('[data-slot=st-table-layout]')}; const f=${q('[data-slot=st-table-frame]')}; return [...lay.querySelectorAll('button')].filter(b=>!f.contains(b)&&b.getClientRects().length).map(b=>b.textContent.trim()).filter(Boolean)`);
  const pop = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content]')].filter(e=>e.getClientRects().length); return p.map(e=>({text:e.textContent.trim().slice(0,80), inputs:e.querySelectorAll('input').length}))`);
  expect(pop.length >= 1, 'no filter popover open');
  expect(chip.some((t) => /status/i.test(t)), 'no Status chip ' + JSON.stringify(chip));
  const focusIn = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content]')].find(e=>e.getClientRects().length); const i=p.querySelector('input'); i.focus(); return document.activeElement===i`);
  ab('keyboard', 'type', 'Done'); sleep(700);
  const rows1 = ev(`return window.__gateTable.getFilteredRowModel().rows.length`);
  press('Escape');
  expect(rows1 < rows0 && rows1 > 0, `rows ${rows0} -> ${rows1}`);
  click(byText('button', 'Clear filters'));
  sleep(300);
  const chips2 = ev(`return window.__gateTable.atoms.columnFilters.get()`);
  const chipStill = ev(`const lay=${q('[data-slot=st-table-layout]')}; const f=${q('[data-slot=st-table-frame]')}; return [...lay.querySelectorAll('button')].filter(b=>!f.contains(b)&&b.getClientRects().length).map(b=>b.textContent.trim()).filter(t=>/status/i.test(t))`);
  const rows2 = ev(`return window.__gateTable.getFilteredRowModel().rows.length`);
  expect(chips2.length === 0 && chipStill.length === 0 && rows2 === rows0, `after clear filters=${JSON.stringify(chips2)} chip=${JSON.stringify(chipStill)} rows=${rows2}`);
  return { chip: chip.filter((t) => /status/i.test(t)), rowsBefore: rows0, rowsFiltered: rows1, rowsAfterClear: rows2, inputFocusable: focusIn };
});

step('sort', () => {
  click(q('button[aria-label="Sort"]'));
  const picker = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content]')].find(e=>e.getClientRects().length); return p ? [...p.querySelectorAll('[role=option]')].map(o=>o.textContent.trim()) : null`);
  expect(picker && picker.includes('Due'), 'picker ' + JSON.stringify(picker));
  click(byText('[role=option]', 'Due'));
  sleep(400);
  let state = ev(`return window.__gateTable.atoms.sorting.get()`);
  expect(state.length === 1 && state[0].id === 'due', 'sorting after Due ' + JSON.stringify(state));
  const chipText = ev(`return [...document.querySelectorAll('[data-slot=popover-trigger]')].filter(b=>b.getClientRects().length).map(b=>b.textContent.trim()).filter(t=>/due|sort/i.test(t))`);
  let rules = 0;
  for (let i = 0; i < 6 && rules === 0; i++) { sleep(250); rules = ev(`return document.querySelectorAll('[data-sort-rule]').length`); }
  let editorVia = 'opened on choose';
  if (rules === 0) { editorVia = 'chip click'; click(`[...document.querySelectorAll('[data-slot=popover-trigger]')].find(e=>/^due/i.test(e.textContent.trim()) && e.getClientRects().length)`); sleep(300); rules = ev(`return document.querySelectorAll('[data-sort-rule]').length`); }
  expect(rules === 1, 'rules ' + rules);
  click(byText('button', 'Add sort'));
  click(byText('[role=option]', 'Status'));
  sleep(300);
  let rules2 = ev(`return [...document.querySelectorAll('[data-sort-rule]')].map(e=>e.getAttribute('data-sort-rule'))`);
  expect(rules2.length === 2, 'rules after add ' + JSON.stringify(rules2));
  // drag handle of rule 2 onto rule 1 (real mouse; HTML5 drop is synthesised if the native drop does not land)
  const h2 = center(`document.querySelectorAll('[data-sort-rule] [aria-label="Drag to reorder"]')[1]`);
  const r1 = center(`document.querySelectorAll('[data-sort-rule]')[0]`);
  ab('mouse', 'move', String(h2[0]), String(h2[1])); ab('mouse', 'down');
  for (let i = 1; i <= 5; i++) ab('mouse', 'move', String(h2[0]), String(Math.round(h2[1] + (r1[1] - h2[1]) * i / 5)));
  ab('mouse', 'up'); sleep(300);
  let order = ev(`return window.__gateTable.atoms.sorting.get().map(s=>s.id)`);
  let dragMethod = 'mouse';
  if (order[0] !== 'status') {
    dragMethod = 'synthetic DragEvent (native drop not delivered)';
    ev(`const dt=new DataTransfer(); const h=document.querySelectorAll('[data-sort-rule] [aria-label="Drag to reorder"]')[1]; const t=document.querySelectorAll('[data-sort-rule]')[0]; h.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt})); return 1`);
    sleep(100);
    ev(`const dt=new DataTransfer(); const t=document.querySelectorAll('[data-sort-rule]')[0]; t.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); return 1`);
    sleep(100);
    ev(`const dt=new DataTransfer(); const t=document.querySelectorAll('[data-sort-rule]')[0]; t.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})); return 1`);
    sleep(300);
    order = ev(`return window.__gateTable.atoms.sorting.get().map(s=>s.id)`);
  }
  expect(JSON.stringify(order) === '["status","due"]', 'order after drag ' + JSON.stringify(order));
  click(byText('button', 'Delete sort'));
  state = ev(`return window.__gateTable.atoms.sorting.get()`);
  expect(state.length === 0, 'after delete ' + JSON.stringify(state));
  return { picker: picker.length, chip: chipText, editorVia, rulesAfterDue: rules, rulesAfterAdd: rules2, orderAfterDrag: order, dragMethod };
});

step('viewSettings', () => {
  click(q('button[aria-label="View settings"]'));
  const rows = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content],[role=dialog],[role=menu]')].find(e=>e.getClientRects().length); return p ? p.innerText.split('\\n').map(s=>s.trim()).filter(Boolean) : null`);
  const want = ['Columns', 'Density', 'Wrap cell text', 'Grid lines', 'Sticky header', 'Alternating row colors', 'Row numbers', 'Reset view'];
  const missing = want.filter((w) => !rows || !rows.some((r) => r.toLowerCase() === w.toLowerCase()));
  expect(missing.length === 0, 'missing ' + JSON.stringify(missing) + ' rows ' + JSON.stringify(rows));
  const sw = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content],[role=dialog]')].find(e=>e.getClientRects().length); const lab=[...p.querySelectorAll('*')].find(e=>e.children.length===0 && /^row numbers$/i.test(e.textContent.trim())); let row=lab; while(row && !row.querySelector('[role=switch]')) row=row.parentElement; const s=row.querySelector('[role=switch]'); const r=s.getBoundingClientRect(); return [Math.round(r.x+r.width/2), Math.round(r.y+r.height/2)]`);
  clickAt(sw[0], sw[1]); sleep(100);
  const num = ev(`const h=[...document.querySelectorAll('thead th')]; const t=h.find(x=>x.textContent.trim()==='#'); if(!t) return null; const cs=getComputedStyle(t); return {index:h.indexOf(t), position:cs.position, insetInlineStart:cs.insetInlineStart, left:cs.left, pin: window.__gateTable.atoms.columnPinning.get()}`);
  expect(num && num.index === 0 && num.position === 'sticky', 'row numbers column ' + JSON.stringify(num));
  const reset = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content],[role=dialog]')].find(e=>e.getClientRects().length); const b=[...p.querySelectorAll('button')].find(b=>/reset view/i.test(b.textContent)); const r=b.getBoundingClientRect(); return [Math.round(r.x+r.width/2), Math.round(r.y+r.height/2)]`);
  clickAt(reset[0], reset[1]); sleep(100);
  const after = ev(`return {hash:[...document.querySelectorAll('thead th')].some(x=>x.textContent.trim()==='#'), vs: window.__gateTable.atoms.viewSettings.get()}`);
  expect(!after.hash, 'row numbers still shown after reset');
  return { rows: rows.slice(0, 12), rowNumbers: num, afterReset: after };
});

step('viewIcons', () => {
  const tb = ev(`const b=document.querySelector('button[aria-label="Show/Hide columns"]'); return b ? [...b.querySelectorAll('svg')].map(x=>x.getAttribute('class')) : null`);
  click(q('button[aria-label="View settings"]'));
  const panel = ev(`const p=[...document.querySelectorAll('[data-slot=popover-content],[role=dialog],[role=menu]')].find(e=>e.getClientRects().length); return p ? [...p.querySelectorAll('svg')].map(x=>(x.getAttribute('class')||'').split(' ').filter(c=>/^lucide-|rotate|scale/.test(c)).join(' ')) : null`);
  const all = (tb||[]).join(' ') + ' ' + (panel||[]).join(' ');
  expect(/lucide-columns-3-cog/.test((tb||[]).join(' ')), 'toolbar columns icon ' + JSON.stringify(tb));
  return { toolbarColumns: tb, panel };
});

step('headerDrag', () => {
  const order0 = ev(`return window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6)`);
  const a = center(`${th('assignee')}.querySelector('[aria-label="Assignee column menu"]')`);
  const p = center(th('project'));
  ab('mouse', 'move', String(a[0]), String(a[1])); ab('mouse', 'down');
  for (let x = a[0] + 10; x <= p[0] + 40; x += 30) ab('mouse', 'move', String(x), String(a[1]));
  sleep(300);
  const mid = ev(`const tr=(id)=>getComputedStyle(document.querySelector('thead th[data-flip-column="'+id+'"]')).translate; const body=[...document.querySelectorAll('tbody td')].map(td=>getComputedStyle(td).translate).filter(t=>t!=='none' && t!=='0px'); return {project: tr('project'), assignee: tr('assignee'), bodyTranslated: body.length}`);
  // Escape mid-drag
  ab('press', 'Escape'); ab('mouse', 'up'); sleep(500);
  const afterEsc = ev(`return {order: window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6), shifted:[...document.querySelectorAll('thead th')].filter(t=>t.style.translate).length}`);
  expect(mid.project !== 'none' && parseFloat(mid.project) !== 0, 'project translate ' + mid.project);
  expect(mid.bodyTranslated === 0, 'body translated ' + mid.bodyTranslated);
  expect(JSON.stringify(afterEsc.order) === JSON.stringify(order0) && afterEsc.shifted === 0, 'escape did not restore ' + JSON.stringify(afterEsc));
  // drop: real mouse first, then synthetic drop when the native drop does not land
  ab('mouse', 'move', String(a[0]), String(a[1])); ab('mouse', 'down');
  for (let x = a[0] + 10; x <= p[0] + 40; x += 30) ab('mouse', 'move', String(x), String(a[1]));
  ab('mouse', 'up'); sleep(150);
  let order1 = ev(`return window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6)`);
  let method = 'mouse';
  let anim; let window_state = null;
  if (JSON.stringify(order1) === JSON.stringify(order0)) {
    method = 'synthetic DragEvent sequence (headless native drop not delivered)';
    window_state = ev(`return {dragging: window.__gateTable.atoms.draggingColumn.get()?.id ?? null, hovered: window.__gateTable.atoms.hoveredColumn.get()?.id ?? null}`);
    open('/release-gate');
    anim = ev(`window.__anims=[]; const orig=Element.prototype.animate; Element.prototype.animate=function(k,o){ window.__anims.push((this.getAttribute('data-flip-column')||this.tagName)); return orig.call(this,k,o); }; 
      const dt=(()=>{const d=new DataTransfer(); let de='none', ea='uninitialized'; Object.defineProperty(d,'dropEffect',{get:()=>de,set:v=>{de=v}}); Object.defineProperty(d,'effectAllowed',{get:()=>ea,set:v=>{ea=v}}); return d})(); window.__dt=dt; const src=document.querySelector('thead th[data-flip-column="assignee"]'); const dst=document.querySelector('thead th[data-flip-column="project"]'); const r=dst.getBoundingClientRect(); const cx=r.x+r.width*0.75, cy=r.y+r.height/2; window.__cxy=[cx,cy];
      src.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx-200,clientY:cy}));
      return 1`);
    sleep(150);
    ev(`const dt=window.__dt; const dst=document.querySelector('thead th[data-flip-column="project"]'); const [cx,cy]=window.__cxy; dst.dispatchEvent(new DragEvent('dragenter',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx,clientY:cy})); dst.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx,clientY:cy})); return dt.dropEffect`);
    sleep(300);
    ev(`const dt=window.__dt; const dst=document.querySelector('thead th[data-flip-column="project"]'); const [cx,cy]=window.__cxy; dst.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx,clientY:cy})); dst.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx,clientY:cy})); const src=document.querySelector('thead th[data-flip-column="assignee"]'); src.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:cx,clientY:cy})); return dt.dropEffect`);
    sleep(150);
    anim = ev(`return window.__anims.slice()`);
    order1 = ev(`return window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6)`);
  }
  const highlight = ev(`return document.getAnimations().map(a=>a.effect && a.effect.target && a.effect.target.getAttribute && a.effect.target.getAttribute('data-flip-column')).filter(Boolean)`);
  sleep(800);
  expect(order1.indexOf('assignee') > order1.indexOf('project'), 'order after drop ' + JSON.stringify(order1));
  const movedAnimated = (highlight || []).filter((x) => x === 'assignee').length + (anim || []).filter((x) => x === 'assignee').length;
  expect(movedAnimated > 0, 'no highlight animation on moved column ' + JSON.stringify({ highlight, anim }));
  // restore
  ev(`window.__gateTable.setColumnOrder(window.__gateTable.initialState.columnOrder || []); return 1`);
  return { orderBefore: order0, mid, afterEsc, orderAfter: order1, dropMethod: method, stateAfterNativeAttempt: window_state, animatedCells: { running: highlight.length, assignee: movedAnimated } };
});

step('lockedName', () => {
  const a = center(`${th('status')}.querySelector('[aria-label="Status column menu"]')`);
  const n = center(th('name'));
  ab('mouse', 'move', String(a[0]), String(a[1])); ab('mouse', 'down');
  for (let x = a[0] - 10; x >= n[0]; x -= 30) ab('mouse', 'move', String(x), String(a[1]));
  ab('mouse', 'move', String(n[0]), String(n[1]));
  sleep(400);
  const st = ev(`const td=document.querySelector('tbody tr td[data-flip-column="name"]')||[...document.querySelectorAll('tbody tr')][0].children[0]; const after=getComputedStyle(td,'::after'); const hth=document.querySelector('thead th[data-flip-column="name"]'); const ha=getComputedStyle(hth,'::after'); return {tdAfterBg: after.backgroundImage.slice(0,60), tdAfterOpacity: after.opacity, thText: hth.textContent.trim(), thAfterBg: ha.backgroundImage.slice(0,40)}`);
  // dropEffect the library sets over Name
  const de = ev(`const dt=new DataTransfer(); const dst=document.querySelector('thead th[data-flip-column="name"]'); const r=dst.getBoundingClientRect(); const e=new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt,clientX:r.x+r.width/2,clientY:r.y+r.height/2}); dst.dispatchEvent(e); return dt.dropEffect`);
  ab('press', 'Escape'); ab('mouse', 'up'); sleep(400);
  click(chevron('name'));
  const items = menuItems();
  press('Escape');
  expect(/repeating-linear-gradient/.test(st.tdAfterBg) && parseFloat(st.tdAfterOpacity) > 0, 'stripes ' + JSON.stringify(st));
  expect(de === 'none', 'dropEffect over Name ' + de);
  expect(items.includes('Fixed position (disabled)'), 'name menu ' + JSON.stringify(items));
  return { stripes: st, dropEffectOverName: de, cursor: de === 'none' ? 'not-allowed (dropEffect none)' : de, nameMenu: items };
});

step('overflow', () => {
  ab('set', 'viewport', '1200', '1150'); sleep(500);
  const edge = ev(`const tr=document.querySelector('tbody tr'); const last=tr.lastElementChild; const cs=getComputedStyle(last); const h=[...document.querySelectorAll('thead th')].pop(); return {td: cs.filter, th: getComputedStyle(h).filter, ov: document.querySelector('[data-slot=st-scroll-wrapper]').getAttributeNames().filter(n=>n.startsWith('data-overflow'))}`);
  const box = ev(`const b=document.querySelector('[data-slot=st-scroll-wrapper]'); const c=b.querySelector('[aria-label="Scroll right"]')?b:b; return 1`);
  const t = center(`document.querySelector('tbody tr:nth-child(3) td:nth-child(3)')`);
  ab('mouse', 'move', String(t[0]), String(t[1])); sleep(400);
  const btn = ev(`const b=document.querySelector('[aria-label="Scroll right"]'); if(!b) return null; const cs=getComputedStyle(b); const r=b.getBoundingClientRect(); return {visibility: cs.visibility, opacity: cs.opacity, x: Math.round(r.x+r.width/2), y: Math.round(r.y+r.height/2)}`);
  expect(btn && btn.visibility === 'visible', 'scroll right button ' + JSON.stringify(btn));
  const before = ev(`const sc=document.querySelector('[data-slot=st-table-frame] .overflow-auto, [data-slot=st-scroll-wrapper] [class*=overflow]'); const box=[...document.querySelectorAll('[data-slot=st-scroll-wrapper] *, [data-slot=st-scroll-wrapper]')].find(e=>e.scrollWidth>e.clientWidth+5 && /auto|scroll/.test(getComputedStyle(e).overflowX)); window.__box=box; const px=(n)=>parseFloat(getComputedStyle(box).getPropertyValue(n))||0; return {left: box.scrollLeft, client: box.clientWidth, pinS: px('--st-pin-start'), pinE: px('--st-pin-end')}`);
  ab('mouse', 'move', String(btn.x), String(btn.y)); sleep(200);
  ab('mouse', 'down'); sleep(80);
  const pressed = ev(`const b=document.querySelector('[aria-label="Scroll right"]'); const r=b.getBoundingClientRect(); return {y: Math.round(r.y+r.height/2), hit: document.elementFromPoint(${btn.x},${btn.y})?.getAttribute('aria-label') || document.elementFromPoint(${btn.x},${btn.y})?.tagName}`);
  ab('mouse', 'up'); sleep(1000);
  const centreDelta = ev(`return window.__box.scrollLeft`) - before.left;
  ev(`window.__box.scrollTo({left:0}); return 1`); sleep(300);
  ab('mouse', 'move', String(btn.x), String(btn.y + 8)); sleep(200);
  ab('mouse', 'down'); ab('mouse', 'up'); sleep(1000);
  const after = ev(`return window.__box.scrollLeft`);
  const delta = after - before.left;
  const visible = before.client - before.pinS - before.pinE;
  const ratio = delta / visible;
  ab('set', 'viewport', '1800', '1150'); sleep(300);
  expect(/drop-shadow/.test(edge.td) && /drop-shadow/.test(edge.th), 'edge shadow ' + JSON.stringify(edge));
  expect(ratio > 0.75 && ratio < 0.85, `scroll ratio ${ratio}`);
  expect(centreDelta > 0, `centre click on Scroll right did not scroll: on press the button moves from y ${btn.y} to ${pressed.y} (active:translate-y-px replaces -translate-y-1/2), pointer then hits ${pressed.hit}; lower-half click delta ${Math.round(delta)} of visible ${Math.round(visible)} (ratio ${ratio.toFixed(3)})`);
  return { centreDelta, pressed, edgeFilter: edge.td.slice(0, 80), overflowAttrs: edge.ov, button: btn.visibility, scrollDelta: Math.round(delta), visibleUnpinned: Math.round(visible), ratio: +ratio.toFixed(3) };
});

step('search', () => {
  click(q('button[aria-label="Show/Hide search"]'));
  sleep(300);
  const focused = ev(`const a=document.activeElement; return {tag:a.tagName, type:a.type, inField: !!a.closest('[data-slot=input-group]')}`);
  ab('keyboard', 'type', 'Design'); sleep(700);
  const rows = ev(`return window.__gateTable.getFilteredRowModel().rows.length`);
  const clearInField = ev(`return document.querySelectorAll('[data-slot=input-group] [aria-label="Clear search"]').length`);
  click(q('button[aria-label="Show/Hide search"]'));
  sleep(400);
  const after = ev(`return {gf: window.__gateTable.atoms.globalFilter.get(), show: window.__gateTable.atoms.showGlobalFilter.get(), rows: window.__gateTable.getFilteredRowModel().rows.length}`);
  expect(focused.tag === 'INPUT' && focused.inField, 'focus ' + JSON.stringify(focused));
  expect(rows > 0 && rows < 50, 'rows ' + rows);
  expect(!after.gf && !after.show && after.rows === 50, 'after toggle ' + JSON.stringify(after));
  expect(clearInField === 0, 'clear button in field ' + clearInField);
  return { focused, filteredRows: rows, afterToggle: after, clearSearchInField: clearInField };
});

step('actionsColumn', () => {
  const r = ev(`const h=[...document.querySelectorAll('thead th')].pop(); const td=document.querySelector('tbody tr').lastElementChild; const hs=getComputedStyle(h), ts=getComputedStyle(td); const svg=td.querySelector('button svg'); return {thPos: hs.position, thRight: hs.right, tdPos: ts.position, tdRight: ts.right, width: Math.round(td.getBoundingClientRect().width), trigger: td.querySelector('button')?.getAttribute('aria-label'), svgClass: svg?.getAttribute('class'), svgPaths: svg ? svg.innerHTML.slice(0,160) : null, colId: window.__gateTable.getVisibleLeafColumns().map(c=>c.id).pop()}`);
  expect(r.colId === 'st-row-actions' && r.tdPos === 'sticky' && r.thPos === 'sticky' && r.tdRight !== 'auto', 'actions ' + JSON.stringify(r));
  click(`document.querySelector('tbody tr').lastElementChild.querySelector('button')`);
  const items = menuItems();
  press('Escape');
  expect(items.length === 3, 'row action items ' + JSON.stringify(items));
  return { ...r, items };
});

step('storage', () => {
  const keys = ev(`return Object.keys(localStorage).filter(k=>k.startsWith('shadcn-table:'))`);
  expect(keys.length === 0, 'keys ' + JSON.stringify(keys));
  return { keys };
});

step('captures', () => {
  collectConsole('release-gate');
  const paths = {};
  for (const m of ['light', 'dark']) {
    ab('set', 'media', m);
    ev(`localStorage.setItem('theme', '${m}'); return 1`);
    open('/release-gate');
    const cls = ev(`return document.documentElement.className`);
    expect(m === 'dark' ? /\bdark\b/.test(cls) : !/\bdark\b/.test(cls), 'theme class ' + cls);
    ev(`document.querySelectorAll('nextjs-portal').forEach(e=>e.remove()); return 1`);
    ab('mouse', 'move', '1790', '1140'); sleep(500);
    const p = `${CAP}/default-${m}.png`;
    ab('screenshot', '--full', p);
    paths[m] = p;
  }
  ab('set', 'media', 'light');
  collectConsole('release-gate (captures)');
  return paths;
});

step('persisted', () => {
  ab('set', 'media', 'light');
  open('/release-gate/persisted');
  ev(`localStorage.clear(); return 1`);
  open('/release-gate/persisted');
  const first = ev(`return {pend: window.__pend, attr: !!document.querySelector('[data-st-view-pending]')}`);
  // reorder two columns through the table API's drag path (synthetic drop, see headerDrag)
  ev(`const dt=(()=>{const d=new DataTransfer(); let de='none', ea='uninitialized'; Object.defineProperty(d,'dropEffect',{get:()=>de,set:v=>{de=v}}); Object.defineProperty(d,'effectAllowed',{get:()=>ea,set:v=>{ea=v}}); return d})(); window.__dt=dt; const src=document.querySelector('thead th[data-flip-column="assignee"]'); src.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt})); return 1`);
  sleep(150);
  ev(`const dt=window.__dt; const dst=document.querySelector('thead th[data-flip-column="project"]'); if(!window.__cxy){const r=dst.getBoundingClientRect(); window.__cxy=[r.x+r.width*0.75,r.y+r.height/2];} const o={bubbles:true,cancelable:true,dataTransfer:dt,clientX:window.__cxy[0],clientY:window.__cxy[1]}; dst.dispatchEvent(new DragEvent('dragenter',o)); dst.dispatchEvent(new DragEvent('dragover',o)); return 1`);
  sleep(250);
  ev(`const dt=window.__dt; const dst=document.querySelector('thead th[data-flip-column="project"]'); if(!window.__cxy){const r=dst.getBoundingClientRect(); window.__cxy=[r.x+r.width*0.75,r.y+r.height/2];} const o={bubbles:true,cancelable:true,dataTransfer:dt,clientX:window.__cxy[0],clientY:window.__cxy[1]}; dst.dispatchEvent(new DragEvent('dragover',o)); dst.dispatchEvent(new DragEvent('drop',o)); document.querySelector('thead th[data-flip-column="assignee"]').dispatchEvent(new DragEvent('dragend',o)); return 1`);
  sleep(800);
  const stored = ev(`const k=Object.keys(localStorage).filter(k=>k.startsWith('shadcn-table:')); return {keys:k, order: window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6), value: k.length? JSON.parse(localStorage.getItem(k[0])).columnOrder : null}`);
  expect(stored.keys.length === 1, 'no stored key ' + JSON.stringify(stored));
  collectConsole('release-gate/persisted');
  ab('reload'); sleep(2500);
  const after = ev(`return {pend: window.__pend, attrNow: !!document.querySelector('[data-st-view-pending]'), ariaBusy: document.querySelector('[data-slot=st-table-layout]')?.getAttribute('aria-busy'), order: window.__gateTable.getVisibleLeafColumns().map(c=>c.id).slice(0,6), domOrder: [...document.querySelectorAll('thead th')].slice(0,6).map(t=>t.getAttribute('data-flip-column'))}`);
  collectConsole('release-gate/persisted (reload)');
  ev(`localStorage.clear(); return 1`);
  expect(after.pend.seen, 'pending attribute never observed ' + JSON.stringify(after.pend));
  expect(!after.attrNow, 'attribute still present');
  expect(JSON.stringify(after.order) === JSON.stringify(stored.order) && after.order.indexOf('assignee') > after.order.indexOf('project'), 'order not restored ' + JSON.stringify(after.order));
  return { firstLoadPending: first.attr, storedOrder: stored.order, afterReload: { seen: after.pend.seen, seenAtMs: Math.round(after.pend.seenAt), dclMs: Math.round(after.pend.dcl || 0), removedAtMs: after.pend.removedAt && Math.round(after.pend.removedAt), log: after.pend.log, ariaBusyWhileMarked: after.pend.ariaBusy, ariaBusyNow: after.ariaBusy, attrNow: after.attrNow, order: after.order, domOrder: after.domOrder } };
});

step('rtl', () => {
  open('/release-gate/rtl');
  const r = ev(`const th=document.querySelector('thead th[data-flip-column="name"]'); const cs=getComputedStyle(th); const rh=th.querySelector('[role=separator], [data-slot*=resize], .cursor-col-resize, [class*=col-resize]'); const rr=rh&&rh.getBoundingClientRect(); const tr=th.getBoundingClientRect(); const td=document.querySelector('tbody tr td[data-flip-column="name"]')||document.querySelector('tbody tr').firstElementChild; const ts=getComputedStyle(td); return {dir: getComputedStyle(document.querySelector('[data-slot=st-table-layout]')).direction, th:[Math.round(tr.left),Math.round(tr.right)], handle: rr?[Math.round(rr.left),Math.round(rr.right)]:null, thPos: cs.position, thInsetStart: cs.insetInlineStart, tdPos: ts.position, tdInsetStart: ts.insetInlineStart, width: Math.round(tr.width)}`);
  expect(r.dir === 'rtl', 'dir ' + r.dir);
  expect(r.handle && Math.abs(r.handle[0] - r.th[0]) <= 12, 'handle not on inline-end (left) edge ' + JSON.stringify(r));
  expect(r.thPos === 'sticky' && r.tdPos === 'sticky' && r.thInsetStart === '0px' && r.tdInsetStart === '0px', 'pinned ' + JSON.stringify(r));
  const hx = Math.round((r.handle[0] + r.handle[1]) / 2);
  const hy = ev(`const th=document.querySelector('thead th[data-flip-column="name"]'); const b=th.getBoundingClientRect(); return Math.round(b.y+b.height/2)`);
  ab('mouse', 'move', String(hx), String(hy)); ab('mouse', 'down');
  for (let i = 1; i <= 6; i++) ab('mouse', 'move', String(hx - i * 10), String(hy));
  ab('mouse', 'up'); sleep(300);
  const w2 = ev(`return Math.round(document.querySelector('thead th[data-flip-column="name"]').getBoundingClientRect().width)`);
  expect(w2 - r.width >= 55 && w2 - r.width <= 65, `rtl resize ${r.width} -> ${w2}`);
  collectConsole('release-gate/rtl');
  return { ...r, resized: [r.width, w2] };
});

if (!only || only.includes('console')) collectConsole('end');
const result = { base, steps: out, console: consoleLog };
fs.writeFileSync(`${S}/result-${base}.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ base, pass: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.pass])), console: consoleLog.map((c) => [c.page, c.warnings, c.errors, c.ariaWarnings]) }));
