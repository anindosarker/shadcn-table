/**
 * Cluster E page checks: examples/faceted-values to examples/virtualized and
 * the home page. Each example page renders its own example in one playground
 * panel (no group tab strip), so a page asserts that panel, its table rows,
 * the Code toggle and the page's feature marker. The home page asserts the new
 * landing: hero, install command, live demo rows, feature and install
 * headings, guide links, then holds the page through the full live demo loop
 * on Base UI, Radix UI and React Aria (demoLoop in _helpers.mjs).
 */
import {
  chipFilter,
  closeChipEditor,
  codeToggle,
  demoLoop,
  example,
  headerLabelsFit,
} from './_helpers.mjs';

/**
 * An example page renders exactly one playground panel (data-mode) and no
 * group tab strip; the explorer's file tree is a nav, not a tablist.
 */
async function singleExample(page, check) {
  const panels = await page.locator('article [data-mode]').count();
  check('single example panel', panels === 1, `panels=${panels}`);
  const strips = await page
    .locator('article [role="tablist"]:not([aria-label="Source files"])')
    .count();
  check('no group tab strip', strips === 0, `tablists=${strips}`);
}

/** One example page: single panel, example rows, Code toggle, feature marker. */
const examplePage =
  (id, needle, marker) =>
  async ({ page, check }) => {
    await singleExample(page, check);
    const w = await example(page, id, check);
    if (marker) await marker(page, w, check);
    await codeToggle(page, id, needle, check);
  };

const checks = {
  '/docs/examples': async ({ page, check }) => {
    const links = page.locator('main a[href^="/docs/examples/"]');
    check(
      'example links',
      (await links.count()) >= 40,
      `n=${await links.count()}`,
    );
  },
  '/docs/examples/faceted-values': examplePage(
    'enable-filter-facet-values',
    'enableFacetedValues: true',
    async (page, w, check) => {
      const editor = await chipFilter(
        page,
        w,
        'faceted-values',
        'City',
        '[data-slot="select-trigger"], [role="combobox"]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/filter-switching': examplePage(
    'customize-filter-modes',
    'enableColumnFilterModes: true',
    async (page, w, check) => {
      // the mode picker sits on the editor's top line in chips mode (D39)
      const editor = await chipFilter(
        page,
        w,
        'filter-switching',
        'First Name',
        'button[aria-label*="filter mode" i]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/filter-variants': examplePage(
    'customize-filter-variants',
    "filterVariant: 'range-slider'",
    async (page, w, check) => {
      // Radix and React Aria thumbs carry role=slider, the Base UI thumb is a range input.
      const editor = await chipFilter(
        page,
        w,
        'filter-variants',
        'Salary',
        '[role="slider"], input[type="range"]',
        check,
      );
      await closeChipEditor(page, editor);
    },
  ),
  '/docs/examples/subheader-filters': examplePage(
    'subheader-filters',
    "columnFilterDisplayMode: 'subheader'",
    async (page, w, check) => {
      // Radix and React Aria thumbs carry role=slider, the Base UI thumb is a range input.
      check(
        'range slider filter',
        (await w
          .locator('thead [role="slider"], thead input[type="range"]')
          .count()) > 0,
      );
      check(
        'date filter input',
        (await w.locator('thead input[type="date"]').count()) > 0,
      );
      check(
        'checkbox filter',
        (await w
          .locator('thead [role="checkbox"], thead [data-slot="checkbox"]')
          .count()) > 0,
      );
      check(
        'filter mode buttons',
        (await w.locator('thead button[aria-label*="filter mode" i]').count()) >
          0,
      );
      // F44: every filter input and caption sits inside its th and inside any
      // clipping box between them, each caption's text inside its box; the
      // slider track stays in its th and its "Filter Mode:" caption sits
      // below the track.
      const layout = await w.locator('thead').evaluate((thead) => {
        const inside = (inner, outer) =>
          inner.left >= outer.left - 1 &&
          inner.right <= outer.right + 1 &&
          inner.top >= outer.top - 1 &&
          inner.bottom <= outer.bottom + 1;
        const clipped = [];
        let slider = 'no slider';
        for (const th of thead.querySelectorAll('th')) {
          const cell = th.getBoundingClientRect();
          const parts = [
            ...th.querySelectorAll(
              '[data-slot="input-group"], [data-slot="slider-track"], [data-slot="slider-thumb"], label, p',
            ),
          ].filter((part) => !part.closest('[aria-hidden="true"]'));
          for (const part of parts) {
            const box = part.getBoundingClientRect();
            let clip = part.parentElement;
            let ok = inside(box, cell);
            while (ok && clip && clip !== th) {
              if (getComputedStyle(clip).overflowX !== 'visible')
                ok = inside(box, clip.getBoundingClientRect());
              clip = clip.parentElement;
            }
            // A Filter Mode caption's text overflowing its own box is cut too.
            if (
              ok &&
              part.textContent?.startsWith('Filter Mode:') &&
              part.scrollWidth > part.clientWidth + 1
            )
              ok = false;
            if (!ok)
              clipped.push(
                `${th.textContent?.trim().slice(0, 14)} ${part.dataset.slot ?? part.tagName}:${part.textContent?.trim().slice(0, 30)} [${Math.round(box.left - cell.left)}, ${Math.round(box.right - cell.left)}] in ${Math.round(cell.width)}`,
              );
          }
          const track = th.querySelector('[data-slot="slider-track"]');
          if (track) {
            const caption = [...th.querySelectorAll('label, p')].find((el) =>
              el.textContent?.startsWith('Filter Mode:'),
            );
            const trackBox = track.getBoundingClientRect();
            const top = caption?.getBoundingClientRect().top ?? -1;
            slider =
              top >= trackBox.bottom
                ? ''
                : `caption top ${top} < track bottom ${trackBox.bottom}`;
          }
        }
        return { clipped, slider };
      });
      check(
        'subheader filters not clipped',
        layout.clipped.length === 0,
        layout.clipped.join(' '),
      );
      check('slider caption below track', layout.slider === '', layout.slider);
    },
  ),
  '/docs/examples/persistent-view': examplePage(
    'persistent-view',
    'persistViewSettings: true',
    async (page, w, check) => {
      // F14: the docs prose margin must not push the pagination out of the
      // bottom toolbar
      const box = await w
        .locator('[data-slot="pagination-content"]')
        .last()
        .evaluate((el) => {
          const bar = el.closest('div.justify-between')?.parentElement;
          if (!bar) return null;
          const ul = el.getBoundingClientRect();
          const rect = bar.getBoundingClientRect();
          return {
            bar: Math.round(rect.bottom),
            inside: ul.top >= rect.top - 0.5 && ul.bottom <= rect.bottom + 0.5,
            ul: Math.round(ul.bottom),
          };
        })
        .catch(() => null);
      check(
        'pagination inside the bottom toolbar',
        !!box?.inside,
        box ? `ul=${box.ul} bar=${box.bar}` : 'no pagination',
      );
    },
  ),
  '/docs/examples/popover-filters': examplePage(
    'alternate-column-filtering',
    "columnFilterDisplayMode: 'popover'",
    async (page, w, check) => {
      check(
        'no inline filter inputs',
        (await w.locator('thead input').count()) === 0,
      );
      check(
        'filter buttons in head',
        (await w.locator('thead button').count()) > 0,
      );
      await headerLabelsFit(w, 'alternate-column-filtering', check);
    },
  ),
  '/docs/examples/infinite-scrolling': examplePage(
    'infinite-scrolling',
    'useInfiniteQuery',
    async (page, w, check) => {
      const txt = await w.textContent();
      check('fetched count text', /Fetched \d+ of \d+ total rows/.test(txt));
    },
  ),
  '/docs/examples/row-virtualization': examplePage(
    'enable-row-virtualization',
    'enableRowVirtualization: true',
    async (page, w, check) => {
      const n = await w.locator('table tbody tr').count();
      check(
        'virtualized rows (fewer than 10000)',
        n > 0 && n < 200,
        `rows=${n}`,
      );
    },
  ),
  '/docs/examples/virtualized': examplePage(
    'virtualized',
    'enableColumnVirtualization: true',
    async (page, w, check) => {
      const n = await w.locator('table tbody tr').count();
      check(
        'virtualized rows (fewer than 10000)',
        n > 0 && n < 200,
        `rows=${n}`,
      );
    },
  ),
  '/docs/examples/react-query': examplePage(
    'react-query',
    'useQuery',
    async (page, w, check) => {
      // a body row under the sticky header is a library layout fault: logged,
      // not failed (spec 06.2 1.6.5)
      const head = await w.locator('thead').first().boundingBox();
      const row = await w.locator('tbody tr').first().boundingBox();
      if (head && row && row.y < head.y + head.height - 0.5) {
        console.warn(
          `  warn react-query: first body row top ${Math.round(row.y)} above the sticky header bottom ${Math.round(head.y + head.height)}`,
        );
      }
      check('react-query: header and first row measured', !!head && !!row);
    },
  ),
  '/docs/examples/remote': examplePage('remote', 'manualPagination: true'),
  '/docs/examples/lazy-detail-panel': examplePage(
    'lazy-detail-panel',
    '/api/moredata/',
    async (page, w, check) => {
      const expand = w.locator('tbody button[aria-label*="expand" i]').first();
      check('expand button', (await expand.count()) > 0);
      if (!(await expand.count())) return;
      await expand.click();
      await page.waitForTimeout(2500);
      const txt = await w.textContent();
      check('detail panel loaded', /Favorite Music|favoriteMusic/i.test(txt));
    },
  ),
  '/docs/examples/lazy-sub-rows': examplePage(
    'lazy-sub-rows',
    '/api/treedata',
    async (page, w, check) => {
      check(
        'expand buttons',
        (await w.locator('tbody button[aria-label*="expand" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/minimal': examplePage(
    'minimal',
    'ST_Table',
    async (page, w, check) => {
      check('caption', (await w.locator('table caption').count()) === 1);
      check(
        'no toolbar',
        (await w
          .locator('input[type="search"], input[placeholder*="Search" i]')
          .count()) === 0,
      );
    },
  ),
  '/docs/examples/row-dragging': examplePage(
    'enable-row-dragging',
    'enableRowDragging: true',
    async (page, w, check) => {
      check(
        'two tables',
        (await w.locator('table').count()) === 2,
        `tables=${await w.locator('table').count()}`,
      );
    },
  ),
  '/docs/examples/row-ordering': examplePage(
    'enable-row-ordering',
    'enableRowOrdering: true',
    async (page, w, check) => {
      check(
        'drag handles',
        (await w
          .locator(
            'tbody button[aria-label*="drag" i], tbody [draggable="true"]',
          )
          .count()) > 0,
      );
    },
  ),
  '/docs/examples/sticky-header': examplePage(
    'enable-sticky-header',
    'enableStickyHeader: true',
    async (page, w, check) => {
      const pos = await w
        .locator('thead')
        .first()
        .evaluate((el) => getComputedStyle(el).position);
      check('thead sticky', pos === 'sticky', pos);
    },
  ),
  '/docs/examples/sticky-row-pinning': examplePage(
    'enable-row-pinning-sticky',
    'enableRowPinning: true',
    async (page, w, check) => {
      check(
        'pin buttons',
        (await w.locator('tbody button[aria-label*="pin" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/static-row-pinning': examplePage(
    'enable-row-pinning-static',
    "rowPinningDisplayMode: 'top-and-bottom'",
    async (page, w, check) => {
      check(
        'pin buttons',
        (await w.locator('tbody button[aria-label*="pin" i]').count()) > 0,
      );
    },
  ),
  '/docs/examples/sticky-row-selection': examplePage(
    'enable-row-pinning-select',
    "rowPinningDisplayMode: 'select-sticky'",
    async (page, w, check) => {
      check(
        'row checkboxes',
        (await w
          .locator('tbody [role="checkbox"], tbody input[type="checkbox"]')
          .count()) > 0,
      );
    },
  ),
  '/': async ({ page, check, base }) => {
    const h1 = page.locator('h1').first();
    check(
      'hero title',
      /shadcn\s*-?\s*table/i.test((await h1.textContent()) ?? ''),
    );
    const main = page.locator('main, body');
    const txt = (await main.first().textContent()) ?? '';
    const bar = page.locator('[data-slot="agent-bar"]');
    check('agent bar', (await bar.count()) === 1);
    check('agent prompt', txt.includes('Install shadcn-table in my app:'));
    await bar.getByRole('radio', { name: 'Command' }).click();
    // The hosted registry URL of the selected base (the default, Base UI, or
    // the runner's --base); the origin is the dev server's in dev.
    check(
      'install command',
      /pnpm dlx shadcn@latest add \S+\/r\/[a-z]+\/shadcn-table\.json/.test(
        (await bar.textContent()) ?? '',
      ),
    );
    check(
      'copy command label',
      (await bar.getByRole('button', { name: 'Copy command' }).count()) === 1,
    );
    check('no V3 alert', !/was released September 5th, 2024/.test(txt));
    check(
      'agent bar',
      (await page.locator('[data-slot="agent-bar"]').count()) === 1,
    );
    // the live demo table is client-rendered (next/dynamic)
    const rows = page.locator('table tbody tr');
    await rows
      .first()
      .waitFor({ timeout: 30000 })
      .catch(() => {});
    check(
      'live demo rows',
      (await rows.count()) > 0,
      `rows=${await rows.count()}`,
    );
    // the stock 0.8 table: icons in the headers, filters as chips (no
    // filter row under the headers), the view settings button
    const demo = page.locator('.v5-demo-table');
    check(
      'demo: header icons',
      (await demo.locator('thead th svg[aria-hidden="true"]').count()) >= 5,
    );
    check(
      'demo: no subheader filter row',
      (await demo.locator('thead input').count()) === 0,
    );
    check(
      'demo: view settings button',
      (await demo.locator('button[aria-label="View settings"]').count()) === 1,
    );
    // seven data columns (D54), and at the desktop width they fit the frame,
    // so the Estimate cell the Editing step changes is in view (F32)
    const dataHeaders = await demo
      .locator('thead th button[aria-label$=" column menu"]')
      .count();
    check(
      'demo: seven data columns',
      dataHeaders === 7,
      `columns=${dataHeaders}`,
    );
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      const overflow = await demo
        .locator('table')
        .first()
        .evaluate((table) => {
          const box = table.parentElement;
          return box ? box.scrollWidth - box.clientWidth : 0;
        });
      check(
        'demo: no horizontal scroll',
        overflow <= 1,
        `overflow=${overflow}px`,
      );
    }
    check('features heading', txt.includes('Everything you need'));
    check(
      'install steps heading',
      txt.includes('Up and running in three steps'),
    );
    const guides = page.locator('a[href^="/docs/guides/"]');
    check(
      'guide links',
      (await guides.count()) >= 10,
      `guides=${await guides.count()}`,
    );
    check(
      'no contributors section',
      !txt.includes('Maintainers and Contributors'),
    );
    // a page of ten rows fits the table frame: no row cut off at the bottom,
    // no scrollbar inside the table (F45 follow-up)
    const clipped = await demo
      .locator('table')
      .first()
      .evaluate((table) => {
        const box = table.parentElement;
        return box ? box.scrollHeight - box.clientHeight : 0;
      });
    check('demo: ten rows fit the frame', clipped <= 1, `clipped=${clipped}px`);
    // the six step titles name the feature (F45), and one full replay gives
    // every step the active state in turn: a recorder samples the list each
    // frame from a Replay click (outside the table, so the replay keeps
    // playing) until the loop starts over. It also records what the replay
    // must never leave behind (F45 follow-up): a tooltip or a keyboard focus
    // ring on a control it clicked, a page scroll, a change in the table
    // frame's height or in the step list's place, an empty cell editor; and
    // what it must show: the Filtering cue on the "+ Filter" pill, the moved
    // column drawn on top of the cells it slides across (F47): mid-slide, the
    // topmost element at its header's centre is that header
    const titles = await page
      .locator('[aria-label="Demo items"] .v5-step span.text-sm')
      .allTextContents();
    const expected = [
      'Sort editor',
      'Global search',
      'Cell editing',
      'Filter chips',
      'Column order',
      'Striped rows',
    ];
    check(
      'demo: step titles',
      titles.join('|') === expected.join('|'),
      titles.join(' | '),
    );
    try {
      const steps = page.locator('[aria-label="Demo items"]');
      await steps.scrollIntoViewIfNeeded({ timeout: 10000 });
      await page.evaluate(() => {
        const seen = new Set();
        const flaws = {
          tooltips: new Set(),
          rings: new Set(),
          scrolls: new Set(),
          frames: new Set(),
          lists: new Set(),
          emptyEdit: 0,
          pillCue: false,
          movedOnTop: 0,
          movedCovered: 0,
        };
        window.__demoSeen = seen;
        window.__demoFlaws = flaws;
        const aside = document.querySelector('[aria-label="Demo items"]');
        const table = document.querySelector('.v5-demo-table');
        const frame = table?.querySelector('table')?.parentElement;
        const list = aside?.querySelector('ol');
        const sample = () => {
          aside?.querySelectorAll('.v5-step').forEach((el, i) => {
            if (el.getAttribute('data-state') === 'active') seen.add(i);
          });
          document
            .querySelectorAll('[role="tooltip"]')
            .forEach((el) => flaws.tooltips.add(el.textContent?.trim()));
          const focused = document.activeElement;
          if (
            focused instanceof HTMLElement &&
            focused.matches(':focus-visible') &&
            !focused.matches('input, textarea') &&
            (table?.contains(focused) ||
              focused.closest('[data-slot="popover-content"]'))
          ) {
            flaws.rings.add(
              focused.getAttribute('aria-label') ??
                focused.textContent?.trim().slice(0, 20),
            );
          }
          flaws.scrolls.add(Math.round(window.scrollY));
          if (frame) flaws.frames.add(frame.offsetHeight);
          if (aside && list) {
            flaws.lists.add(
              Math.round(
                list.getBoundingClientRect().top -
                  aside.getBoundingClientRect().top,
              ),
            );
          }
          const edit = table?.querySelector('tbody input');
          if (edit instanceof HTMLInputElement && edit.value === '') {
            flaws.emptyEdit += 1;
          }
          table?.querySelectorAll('.v12-cue').forEach((el) => {
            if (
              el.tagName === 'BUTTON' &&
              !el.hasAttribute('aria-label') &&
              el.textContent?.trim() === 'Filter'
            ) {
              flaws.pillCue = true;
            }
          });
          const head = [...(table?.querySelectorAll('thead th') ?? [])].map(
            (th) => th.getAttribute('data-flip-column'),
          );
          if (head[1] === 'project') {
            const th = table?.querySelector(
              'thead th[data-flip-column="project"]',
            );
            const sliding = th
              ?.getAnimations()
              .some(
                (animation) =>
                  animation.playState === 'running' &&
                  animation.effect
                    ?.getKeyframes()
                    .some((keyframe) => keyframe.translate !== undefined),
              );
            if (th && sliding) {
              const rect = th.getBoundingClientRect();
              const x = rect.left + rect.width / 2;
              const y = rect.top + rect.height / 2;
              if (
                x >= 0 &&
                y >= 0 &&
                x < window.innerWidth &&
                y < window.innerHeight
              ) {
                const hit = document.elementFromPoint(x, y);
                if (hit && th.contains(hit)) flaws.movedOnTop += 1;
                else flaws.movedCovered += 1;
              }
            }
          }
          if (window.__demoSeen === seen) requestAnimationFrame(sample);
        };
        sample();
      });
      await steps.getByRole('button', { name: 'Replay' }).click();
      await steps
        .locator('.v5-step')
        .nth(expected.length - 1)
        .and(page.locator('[data-state="active"]'))
        .waitFor({ timeout: 45000 });
      // the last step plays out, then the loop starts over
      await steps
        .locator('[aria-live]')
        .filter({ hasText: 'Starting' })
        .waitFor({ timeout: 15000 })
        .catch(() => {});
      const { seen, flaws } = await page.evaluate(() => {
        const list = [...window.__demoSeen].sort();
        const f = window.__demoFlaws;
        window.__demoSeen = null;
        return {
          seen: list,
          flaws: {
            tooltips: [...f.tooltips],
            rings: [...f.rings],
            scrolls: [...f.scrolls],
            frames: [...f.frames],
            lists: [...f.lists],
            emptyEdit: f.emptyEdit,
            pillCue: f.pillCue,
            movedOnTop: f.movedOnTop,
            movedCovered: f.movedCovered,
          },
        };
      });
      check(
        'demo: every step active in one replay',
        seen.length === expected.length,
        `active=${seen.join(',')}`,
      );
      check(
        'demo: no tooltip during the replay',
        flaws.tooltips.length === 0,
        flaws.tooltips.join(' | '),
      );
      check(
        'demo: no focus ring left by the replay',
        flaws.rings.length === 0,
        flaws.rings.join(' | '),
      );
      check(
        'demo: the replay never scrolls the page',
        flaws.scrolls.length === 1,
        `scrollY=${flaws.scrolls.join(',')}`,
      );
      check(
        'demo: the table frame keeps its height',
        flaws.frames.length === 1,
        `heights=${flaws.frames.join(',')}`,
      );
      check(
        'demo: the step list never moves',
        flaws.lists.length === 1,
        `offsets=${flaws.lists.join(',')}`,
      );
      check(
        'demo: the cell editor never shows empty',
        flaws.emptyEdit === 0,
        `frames=${flaws.emptyEdit}`,
      );
      check('demo: Filtering cues the + Filter pill', flaws.pillCue);
      check(
        'demo: the moved column slides on top of the others',
        flaws.movedOnTop > 0 && flaws.movedCovered === 0,
        `onTop=${flaws.movedOnTop} covered=${flaws.movedCovered}`,
      );
    } catch (e) {
      check(
        'demo: every step active in one replay',
        false,
        String(e.message).split('\n')[0].slice(0, 160),
      );
    }
    await demoLoop({ page, check, base });
  },
};

export default checks;
