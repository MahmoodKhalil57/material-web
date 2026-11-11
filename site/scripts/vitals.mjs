/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// collectVitals() is injected by site/scripts/walk.mjs into every page
// (page.addInitScript; it runs in the page, so it uses nothing from here),
// top frame only. It collects the page's Core Web Vitals while the walker reads it, and when the
// page is left (pagehide), appends them to sessionStorage, which outlives the
// navigation. window.__walkVitals() returns them for the last page.
//
// - LCP: the last largest-contentful-paint entry, from activation (a
//   prerendered page counts from when it was shown).
// - CLS: the largest session window of layout shifts not caused by input
//   (gaps under 1 s, windows up to 5 s), with the elements that moved most.
// - INP: the longest interaction (an interaction's longest event); with
//   fewer than 50 interactions that's the 98th percentile. The walker's own
//   click on Next is the interaction; its entry is flushed with
//   takeRecords() on pagehide.

export function collectVitals() {
  if (window !== window.top) return;
  const KEY = 'catalog-walk-vitals';
  const nav = performance.getEntriesByType('navigation')[0];
  const activation = nav?.activationStart || 0;

  const describe = (node) => {
    if (!node || node.nodeType !== 1) return node?.nodeName?.toLowerCase() ?? '';
    const id = node.id ? `#${node.id}` : '';
    const cls = node.classList?.length ? `.${[...node.classList].slice(0, 2).join('.')}` : '';
    return `${node.localName}${id}${cls}`;
  };

  let lcp = 0;
  let lcpElement = '';
  const onLcp = (entries) => {
    for (const e of entries) {
      lcp = Math.max(0, e.startTime - activation);
      lcpElement = describe(e.element);
    }
  };

  let cls = 0;
  let windowValue = 0;
  let windowStart = 0;
  let windowLast = 0;
  let windowSources = new Map();
  let clsSources = [];
  const onShift = (entries) => {
    for (const e of entries) {
      if (e.hadRecentInput) continue;
      if (windowValue && (e.startTime - windowLast > 1000 || e.startTime - windowStart > 5000)) {
        windowValue = 0;
        windowSources = new Map();
      }
      if (!windowValue) windowStart = e.startTime;
      windowValue += e.value;
      windowLast = e.startTime;
      for (const s of e.sources ?? []) {
        const name = describe(s.node);
        windowSources.set(name, (windowSources.get(name) ?? 0) + e.value);
      }
      if (windowValue > cls) {
        cls = windowValue;
        clsSources = [...windowSources].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);
      }
    }
  };

  const interactions = new Map();
  const onEvent = (entries) => {
    for (const e of entries) {
      if (!e.interactionId) continue;
      const known = interactions.get(e.interactionId);
      if (!known || e.duration > known.duration) {
        interactions.set(e.interactionId, {duration: e.duration, name: e.name, target: describe(e.target)});
      }
    }
  };

  const observers = [];
  const observe = (type, handler, extra = {}) => {
    try {
      const o = new PerformanceObserver((list) => handler(list.getEntries()));
      o.observe({type, buffered: true, ...extra});
      observers.push([o, handler]);
    } catch {}
  };
  observe('largest-contentful-paint', onLcp);
  observe('layout-shift', onShift);
  observe('event', onEvent, {durationThreshold: 16});
  observe('first-input', onEvent);

  const report = () => {
    for (const [o, handler] of observers) handler(o.takeRecords());
    const all = [...interactions.values()].sort((a, b) => b.duration - a.duration);
    const inp = all[Math.min(all.length - 1, Math.floor(all.length / 50))];
    return {
      url: location.pathname,
      lcp: Math.round(lcp),
      lcpElement,
      cls: Number(cls.toFixed(4)),
      clsSources,
      inp: inp ? Math.round(inp.duration) : null,
      inpEvent: inp ? `${inp.name} ${inp.target}` : '',
    };
  };
  window.__walkVitals = report;
  addEventListener('pagehide', () => {
    try {
      const list = JSON.parse(sessionStorage.getItem(KEY) || '[]');
      list.push(report());
      sessionStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
  });
}
