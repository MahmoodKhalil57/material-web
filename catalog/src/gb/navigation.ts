/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Smooth page-to-page navigation inside /3.0/ (imported by gb.ts):
 *
 * - keeps the expanded navigation rail's scroll position across pages (view
 *   transitions themselves are CSS: navigation.css);
 * - speculation rules for links the document rules in the layout cannot see
 *   (the rail's links are in shadow roots) and for links in the viewport,
 *   with `<link rel=prefetch>` where speculation rules are unsupported;
 * - a route progress indicator following the M3 progress indicator guidance
 *   (.m3-specs/pages/components/progress-indicators.md, "Expected wait
 *   time"): nothing under 200ms, the loading indicator up to 5s, the linear
 *   progress indicator after that, never visible for less than 600ms;
 * - registers the service worker (sw.ts, served at /3.0/sw.js).
 *
 * Everything with a side effect waits for a prerendered page to be activated.
 */

import '@material/web/labs/gb/components/loadingindicator/md-gb-loading-indicator.js';
import '@material/web/labs/gb/components/progress/md-gb-progress.js';

import {movePill} from './pill.js';

const SCOPE = '/3.0/';
/** Under this a navigation is instant: no indicator (M3: under 200ms). */
const SHOW_AFTER = 200;
/** From this a wait is long: the linear progress indicator (M3: over 5s). */
const LONG_AFTER = 5000;
/** An indicator that was shown stays at least this long (no flash). */
const MIN_VISIBLE = 600;
/** A navigation still pending after this is assumed lost. */
const GIVE_UP = 60000;
const FADE = 200;
/** How long a saved rail position belongs to the navigation that saved it. */
const SAVED_FOR = 30000;
const ROUTE_KEY = 'gb-route-progress';
const SCROLL_KEY = 'gb-rail-scroll';

type Stage = 'loading' | 'linear';
interface Carry {
  url: string;
  at: number;
  stage: Stage;
}

/**
 * localStorage, not sessionStorage: a prerendered page has its own copy of
 * the session storage, made when it started, so it would never see what the
 * page being left saved. Entries carry a timestamp and expire.
 */
function store(): Storage | null {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const prerendering = () =>
  Boolean((document as Document & {prerendering?: boolean}).prerendering);

/** Runs `fn` now, or once a prerendered page is shown to the user. */
function whenActive(fn: () => void) {
  if (prerendering()) {
    document.addEventListener('prerenderingchange', () => fn(), {once: true});
  } else {
    fn();
  }
}

// --- Booting -------------------------------------------------------------------
// The page boots with its motion tokens at 1ms (default.html adds .gb-boot,
// reduce-motion.css), so components reach their state without transitions
// as they're defined. Motion comes back once the page has settled: loaded,
// every md-gb element on it defined, its transition in finished, and, for a
// prerendered page, shown.

{
  const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const loaded = new Promise<void>((resolve) => {
    if (document.readyState === 'complete') resolve();
    else addEventListener('load', () => resolve(), {once: true});
  });
  let transition: Promise<unknown> = Promise.resolve();
  addEventListener(
    'pagereveal',
    (e) => {
      const vt = (e as Event & {viewTransition?: {finished: Promise<void>} | null}).viewTransition;
      if (vt) transition = vt.finished.catch(() => {});
    },
    {once: true},
  );
  const defined = () => {
    const tags = new Set(
      [...document.querySelectorAll(':not(:defined)')]
        .map((el) => el.localName)
        .filter((name) => name.startsWith('md-gb-')),
    );
    const timeout = new Promise((resolve) => setTimeout(resolve, 3000));
    return Promise.race([
      Promise.all([...tags].map((tag) => customElements.whenDefined(tag))),
      timeout,
    ]);
  };
  whenActive(async () => {
    await loaded;
    await defined();
    // pagereveal has run by the first frame.
    await frame();
    await transition;
    await frame();
    document.documentElement.classList.remove('gb-boot');
  });
}

/** An in-scope (same origin, under /3.0/) page URL, or null. */
function pageUrl(href: string | null | undefined): URL | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return null;
  }
  if (url.origin !== location.origin || !url.pathname.startsWith(SCOPE)) {
    return null;
  }
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return null; // A file, not a page.
  return url;
}

/** URL without its fragment, the identity of a document. */
const docKey = (url: URL) => url.origin + url.pathname + url.search;

// --- Rail scroll position --------------------------------------------------
// The expanded rail's items scroll (a section's pages); the position carries
// over to the next page, so the list doesn't jump back to the top.

interface Rail extends HTMLElement {
  updateComplete?: Promise<unknown>;
}
const rail = document.getElementById('gb-rail') as Rail | null;
const scroller = () =>
  rail?.shadowRoot?.querySelector<HTMLElement>('.nav-rail-items') ?? null;
let scrollRestored = false;

function saveRailScroll() {
  const top = scroller()?.scrollTop;
  if (top === undefined) return;
  try {
    store()?.setItem(
      SCROLL_KEY,
      JSON.stringify({top: Math.round(top), at: Date.now()}),
    );
  } catch {
    // Storage can be blocked; the rail just starts at the top.
  }
}

/**
 * Restores the saved scroll, and focuses the active destination: arriving
 * on a page, it moves to the middle (from where the page left had the
 * list; at once after a reload); expanding the rail, it's kept in view.
 */
function restoreRailScroll({arriving = true} = {}) {
  const el = scroller();
  if (scrollRestored || !el || el.scrollHeight <= el.clientHeight) return;
  scrollRestored = true;
  let saved: {top?: number; at?: number} | null = null;
  try {
    saved = JSON.parse(store()?.getItem(SCROLL_KEY) ?? 'null');
  } catch {
    // Ignore a broken entry.
  }
  // Only a position saved by the page just left; a reload starts over,
  // centered on the active destination.
  const reload =
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)
      ?.type === 'reload';
  if (!reload && saved?.top && Date.now() - (saved.at ?? 0) < SAVED_FOR) {
    el.scrollTop = saved.top;
  }
  const selected = rail?.querySelector('md-gb-nav-rail-item[selected]');
  if (selected) centerInRail(selected, {always: arriving, smooth: arriving && !reload});
}

/**
 * Scrolls the rail so `item` is in the middle of it: when it's out of view,
 * or `always`. `smooth` animates the scroll (spatial), unless motion is
 * reduced.
 */
export function centerInRail(item: Element, {always = false, smooth = false} = {}) {
  const el = scroller();
  if (!el) return;
  const box = el.getBoundingClientRect();
  const r = item.getBoundingClientRect();
  if (!always && r.top >= box.top && r.bottom <= box.bottom) return;
  const top = el.scrollTop + r.top - box.top - (box.height - r.height) / 2;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollTo({top, behavior: smooth && !reduced ? 'smooth' : 'instant'});
}

if (rail) {
  addEventListener('pagehide', saveRailScroll);
  // Chrome's last chance before a cross-document transition captures the old
  // page.
  addEventListener('pageswap', saveRailScroll);
  customElements.whenDefined('md-gb-nav-rail').then(async () => {
    await rail.updateComplete;
    restoreRailScroll();
  });
  // Before the first frame of a view transition, and once the rail expands
  // (it only scrolls expanded).
  addEventListener('pagereveal', () => restoreRailScroll());
  rail.addEventListener('toggle', () => {
    scrollRestored = false;
    requestAnimationFrame(() => restoreRailScroll({arriving: false}));
  });
  // A prerendered page restored (or had nothing to restore) while hidden.
  whenActive(() => {
    scrollRestored = false;
    restoreRailScroll();
  });
  // Always current, so the next page, prerendered or not, finds it.
  let saveTimer: number | undefined;
  customElements.whenDefined('md-gb-nav-rail').then(async () => {
    await rail.updateComplete;
    scroller()?.addEventListener(
      'scroll',
      () => {
        clearTimeout(saveTimer);
        saveTimer = window.setTimeout(saveRailScroll, 100);
      },
      {passive: true},
    );
  });
  requestAnimationFrame(() => requestAnimationFrame(() => restoreRailScroll()));
}

// --- Rail active pill: from the page left to this one ------------------------
// The rail persists across a page transition (navigation.css: the new page's
// rail shows from the first frame), so its active pill moves from the
// destination of the page left to this page's, as in the outline (pill.ts),
// rather than fading out there and in here. The page left records its
// destination; this page moves the pill from it, when it's in view here.

const PILL_KEY = 'gb-rail-pill';

if (rail) {
  addEventListener('pageswap', () => {
    const href = rail.querySelector('md-gb-nav-rail-item[selected]')?.getAttribute('href');
    try {
      if (href) store()?.setItem(PILL_KEY, JSON.stringify({href, at: Date.now()}));
    } catch {
      // Storage can be blocked; the pill just shows where it is.
    }
  });
  const movePillIn = async () => {
    let saved: {href?: string; at?: number} | null = null;
    try {
      saved = JSON.parse(store()?.getItem(PILL_KEY) ?? 'null');
      store()?.removeItem(PILL_KEY);
    } catch {
      // Ignore a broken entry.
    }
    if (!saved?.href || Date.now() - (saved.at ?? 0) > SAVED_FOR) return;
    await rail.updateComplete;
    const to = rail.querySelector('md-gb-nav-rail-item[selected]');
    const from = [...rail.querySelectorAll('md-gb-nav-rail-item')].find(
      (item) => item.getAttribute('href') === saved.href,
    );
    const list = scroller()?.getBoundingClientRect();
    if (!to || !from || from === to || !list || (from as HTMLElement).hidden) return;
    const r = from.getBoundingClientRect();
    if (!r.height || r.bottom <= list.top || r.top >= list.bottom) return;
    movePill(from, to);
  };
  // As the new page shows (after its rail scroll is restored), or once a
  // prerendered page does.
  addEventListener('pagereveal', () => whenActive(() => void movePillIn()));
}

// --- View transitions: the M3 transition pattern of each navigation ---------

interface PageTransition {
  types?: Set<string>;
  finished: Promise<void>;
  skipTransition(): void;
}
interface NavEntry {
  url: string | null;
  index: number;
}

// Skip the transition of a reload: the same page does not cross-fade into
// itself.
addEventListener('pageswap', (e) => {
  const event = e as Event & {
    viewTransition?: PageTransition | null;
    activation?: {navigationType?: string} | null;
  };
  if (event.viewTransition && event.activation?.navigationType === 'reload') {
    event.viewTransition.skipTransition();
  }
  // Reduce motion (the header's toggle): no page transitions.
  if (event.viewTransition && document.documentElement.dataset['motion'] === 'reduce') {
    event.viewTransition.skipTransition();
  }
  // The scrollbars stay out of the snapshots (navigation.css).
  if (event.viewTransition) document.documentElement.classList.add('gb-vt');
});
addEventListener('pageshow', (e) => {
  if (e.persisted) document.documentElement.classList.remove('gb-vt');
});

// The top Previous and Next cards carry over to the next page
// (navigation.css), unless they're scrolled out of view here: their
// snapshots would show outside the panel, over the header.
addEventListener('pageswap', () => {
  const pager = document.querySelector<HTMLElement>('.gb-pager-top');
  const pane = document.getElementById('gb-content-pane');
  if (!pager) return;
  const r = pager.getBoundingClientRect();
  const view = pane?.getBoundingClientRect() ?? {top: 0, bottom: innerHeight};
  if (r.top >= view.top && r.bottom <= view.bottom) return;
  for (const el of pager.querySelectorAll<HTMLElement>('.gb-pager-link, .gb-pager-title')) {
    el.style.viewTransitionName = 'none';
  }
});
// Back from the back/forward cache: the cards carry over again.
addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  for (const el of document.querySelectorAll<HTMLElement>('.gb-pager-top .gb-pager-link, .gb-pager-top .gb-pager-title')) {
    el.style.viewTransitionName = '';
  }
});

/** A page's path without its trailing slash, for comparing URLs. */
const pathOf = (url: string | null | undefined) =>
  url ? new URL(url, location.href).pathname.replace(/\/$/, '') : '';

/**
 * The transition pattern from the page left to this one (navigation.css;
 * motion transitions.md): `forward` or `backward` between pages at
 * consecutive steps (Previous and Next, a section's index and its pages,
 * back and forward in history), or `''` for top level (the rail, the
 * navigation bar, the logo, search, and anything else).
 */
function transitionType(): '' | 'forward' | 'backward' {
  const activation = (
    window as Window & {
      navigation?: {
        activation?: {
          navigationType?: string;
          from?: NavEntry | null;
          entry?: NavEntry | null;
        } | null;
      };
    }
  ).navigation?.activation;
  const from = activation?.from;
  if (!activation || !from) return '';
  if (activation.navigationType === 'traverse' && activation.entry) {
    return activation.entry.index < from.index ? 'backward' : 'forward';
  }
  const left = pathOf(from.url);
  const here = pathOf(location.href);
  const prev = document.querySelector<HTMLAnchorElement>('.gb-pager-top a[rel="prev"]');
  const next = document.querySelector<HTMLAnchorElement>('.gb-pager-top a[rel="next"]');
  // Next on the page left leads here: this page's Previous goes back there.
  if (prev && pathOf(prev.href) === left) return 'forward';
  if (next && pathOf(next.href) === left) return 'backward';
  // A section's index and its pages are consecutive levels.
  const section = (path: string) => path.split('/').slice(0, 3).join('/');
  if (section(here) === section(left)) {
    if (left === section(left) && here !== left) return 'forward';
    if (here === section(here) && here !== left) return 'backward';
  }
  return '';
}

addEventListener('pagereveal', (e) => {
  const transition = (e as Event & {viewTransition?: PageTransition | null})
    .viewTransition;
  if (!transition) return;
  // Reduce motion (the header's toggle): no page transitions.
  if (document.documentElement.dataset['motion'] === 'reduce') {
    transition.skipTransition();
    return;
  }
  const type = transitionType();
  if (type) transition.types?.add(type);
  // The scrollbars show once the page has settled (navigation.css).
  const root = document.documentElement;
  root.classList.add('gb-vt');
  const settled = () => root.classList.remove('gb-vt');
  void transition.finished.then(settled, settled);
  // The browser drops a transition whose new page took over 4s from the
  // click to show, without a word: say so while debugging.
  transition.finished.catch((error: Error) => {
    if (error?.name === 'TimeoutError') {
      console.debug('gb: page transition skipped (the page took over 4s)');
    }
  });
});

// --- Prerender safety: the theme is read when the page starts ----------------

const startTheme = [read('color-mode'), read('gb-seed-color')].join('|');
// A page prerendered before the theme changed would show the old one.
if (prerendering()) {
  document.addEventListener('prerenderingchange', () => {
    if ([read('color-mode'), read('gb-seed-color')].join('|') !== startTheme) {
      location.reload();
    }
  });
}

// --- Speculation rules and prefetch ---------------------------------------------

const supportsSpeculation =
  typeof HTMLScriptElement.supports === 'function' &&
  HTMLScriptElement.supports('speculationrules');
const saveData = () =>
  Boolean(
    (navigator as Navigator & {connection?: {saveData?: boolean}}).connection
      ?.saveData,
  );

/** The link-like element on an event path that leads to another page. */
function linkTarget(path: EventTarget[]): {el: Element; url: URL} | null {
  for (const node of path) {
    if (!(node instanceof Element)) continue;
    if (
      node.localName !== 'a' &&
      node.localName !== 'md-gb-nav-drawer-item' &&
      node.localName !== 'md-gb-nav-rail-item' &&
      node.localName !== 'md-gb-nav-bar-item'
    ) {
      continue;
    }
    if (node.hasAttribute('download')) continue;
    const target = node.getAttribute('target');
    if (target && target !== '_self') continue;
    if (/\bexternal\b/.test(node.getAttribute('rel') ?? '')) continue;
    const href = node.getAttribute('href');
    if (href?.startsWith('#')) continue;
    const url = pageUrl(href);
    if (!url || docKey(url) === docKey(new URL(location.href))) continue;
    return {el: node, url};
  }
  return null;
}

function addRules(type: 'prefetch' | 'prerender', urls: string[]) {
  const script = document.createElement('script');
  script.type = 'speculationrules';
  script.textContent = JSON.stringify({
    [type]: [{source: 'list', urls, eagerness: 'immediate'}],
  });
  document.head.append(script);
  return script;
}

const requested = new Set<string>();
const prerenders: HTMLScriptElement[] = [];
const MAX_PRERENDERS = 2; // The browser keeps few at a time anyway.

function speculate(type: 'prefetch' | 'prerender', url: URL) {
  const href = url.href;
  if (type === 'prefetch') {
    if (requested.has(href)) return;
    requested.add(href);
    if (supportsSpeculation) {
      addRules('prefetch', [href]);
    } else {
      // One cheap prefetch per link.
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.append(link);
    }
    return;
  }
  if (!supportsSpeculation || requested.has('r' + href)) return;
  requested.add('r' + href);
  prerenders.push(addRules('prerender', [href]));
  while (prerenders.length > MAX_PRERENDERS) prerenders.shift()!.remove();
}

function setUpSpeculation() {
  if (saveData()) return;
  // Pointer: prerender after a short hover (like the "moderate" eagerness of
  // the document rules), at once on press. Keyboard focus: prefetch.
  let hover: number | undefined;
  document.addEventListener('pointerover', (e) => {
    clearTimeout(hover);
    const hit = linkTarget(e.composedPath());
    if (!hit) return;
    speculate('prefetch', hit.url);
    hover = window.setTimeout(() => speculate('prerender', hit.url), 200);
  });
  document.addEventListener('pointerout', () => clearTimeout(hover));
  document.addEventListener('pointerdown', (e) => {
    const hit = linkTarget(e.composedPath());
    if (hit) speculate('prerender', hit.url);
  });
  document.addEventListener('focusin', (e) => {
    const hit = linkTarget(e.composedPath());
    if (hit) speculate('prefetch', hit.url);
  });

  // Links in the viewport: prefetch them (the document rules in the layout
  // cannot reach the rail's links in shadow roots). Batched and bounded;
  // pages of a collapsed or scrolled rail are reported when they come into
  // view.
  if (!('IntersectionObserver' in window)) return;
  const queue = new Map<string, URL>();
  let flush: number | undefined;
  let budget = 40;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      const hit = linkTarget([entry.target]);
      if (hit) queue.set(hit.url.href, hit.url);
    }
    clearTimeout(flush);
    flush = window.setTimeout(() => {
      for (const url of queue.values()) {
        if (budget-- > 0) speculate('prefetch', url);
      }
      queue.clear();
    }, 150);
  });
  for (const el of document.querySelectorAll(
    'md-gb-nav-drawer-item[href], md-gb-nav-rail-item[href], .gb-main a[href]',
  )) {
    if (linkTarget([el])) observer.observe(el);
  }
}

// Idle: speculation never competes with the page's own work.
whenActive(() => {
  const idle =
    (window as Window & {requestIdleCallback?: typeof requestIdleCallback})
      .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
  idle(setUpSpeculation);
});

// --- Route progress indicator --------------------------------------------------

let indicator: HTMLElement | null = null;
let shownStage: Stage | null = null;
let shownAt = 0;
let pending: string | null = null;
let showTimer: number | undefined;
let longTimer: number | undefined;
let giveUpTimer: number | undefined;
let hideTimer: number | undefined;

function carryOut(entry: Carry | null) {
  const s = store();
  try {
    if (entry) s?.setItem(ROUTE_KEY, JSON.stringify(entry));
    else s?.removeItem(ROUTE_KEY);
  } catch {
    // Without storage the next page just shows no carried indicator.
  }
}

function render(stage: Stage) {
  clearTimeout(hideTimer);
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'gb-route';
    // At the top edge of the content pane (inside its landmarks).
    (document.querySelector('.gb-content-pane') ?? document.body).prepend(indicator);
  }
  indicator.removeAttribute('data-out');
  indicator.dataset['stage'] = stage;
  // The component is the progressbar; its label names the process and the
  // content (M3 progress indicators, accessibility). Neither is focusable.
  const el = document.createElement(
    stage === 'loading' ? 'md-gb-loading-indicator' : 'md-gb-progress',
  );
  if (stage === 'loading') el.setAttribute('contained', '');
  el.setAttribute('aria-label', 'Loading page');
  indicator.replaceChildren(el);
  shownStage = stage;
}

function show(stage: Stage, destination: string) {
  render(stage);
  shownAt = Date.now();
  carryOut({url: destination, at: shownAt, stage});
}

/** Fades the indicator out and removes it; `now` skips the fade. */
function hide(now = false) {
  clearTimeout(hideTimer);
  shownStage = null;
  carryOut(null);
  const el = indicator;
  if (!el) return;
  const remove = () => {
    el.remove();
    if (indicator === el) indicator = null;
  };
  if (now || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    remove();
    return;
  }
  el.setAttribute('data-out', '');
  hideTimer = window.setTimeout(remove, FADE);
}

function cancel() {
  clearTimeout(showTimer);
  clearTimeout(longTimer);
  clearTimeout(giveUpTimer);
  pending = null;
  hide(true);
}

/** A navigation to `url` started (a click, or the Navigation API). */
function start(url: URL) {
  const destination = docKey(url);
  if (pending === destination) return;
  pending = destination;
  clearTimeout(showTimer);
  clearTimeout(longTimer);
  clearTimeout(giveUpTimer);
  if (shownStage) {
    // Another click while an indicator shows: keep it, retarget.
    carryOut({url: destination, at: shownAt, stage: shownStage});
  } else {
    showTimer = window.setTimeout(
      () => show('loading', destination),
      SHOW_AFTER,
    );
  }
  longTimer = window.setTimeout(() => {
    if (shownStage !== 'linear') show('linear', destination);
  }, LONG_AFTER);
  giveUpTimer = window.setTimeout(cancel, GIVE_UP);
}

/** The page this navigation led to: carry on showing what the last one did. */
function carryIn() {
  let entry: Carry | null = null;
  try {
    entry = JSON.parse(store()?.getItem(ROUTE_KEY) ?? 'null');
  } catch {
    // Ignore a broken entry.
  }
  carryOut(null);
  if (
    !entry ||
    entry.url !== docKey(new URL(location.href)) ||
    Date.now() - entry.at > GIVE_UP
  ) {
    return;
  }
  render(entry.stage);
  shownAt = entry.at;
  const remaining = Math.max(0, MIN_VISIBLE - (Date.now() - entry.at));
  window.setTimeout(() => hide(), remaining);
}

/** The page a click leads to, if it is another document. */
function clickTarget(e: MouseEvent): URL | null {
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  ) {
    return null;
  }
  const a = e
    .composedPath()
    .find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement);
  if (!a || a.hasAttribute('download')) return null;
  if (a.target && a.target !== '_self') return null;
  let url: URL;
  try {
    url = new URL(a.href);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) {
    return null;
  }
  // A fragment on this page scrolls; it does not load.
  if (url.hash && docKey(url) === docKey(new URL(location.href))) return null;
  return url;
}

// A prerendered page shows what the navigation to it started once it is
// activated.
whenActive(carryIn);

addEventListener('click', (e) => {
  const url = clickTarget(e);
  if (url) start(url);
});

interface NavigateEvent extends Event {
  hashChange: boolean;
  downloadRequest: string | null;
  destination: {url: string; sameDocument: boolean};
}
const nav = (window as unknown as {navigation?: EventTarget}).navigation;
nav?.addEventListener('navigate', (e) => {
  const event = e as NavigateEvent;
  if (
    event.hashChange ||
    event.downloadRequest !== null ||
    event.destination.sameDocument
  ) {
    return;
  }
  const url = new URL(event.destination.url);
  if (url.origin === location.origin) start(url);
});
nav?.addEventListener('navigateerror', cancel);

// Stop (Esc) cancels a pending navigation; so does restoring from the
// back/forward cache, which never loads a page.
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pending) cancel();
});
addEventListener('pageshow', (e) => {
  if (e.persisted) cancel();
});
addEventListener('pagehide', (e) => {
  // Cached for the back button: leave nothing showing in it.
  if (e.persisted) cancel();
});

// --- Service worker ------------------------------------------------------------

if ('serviceWorker' in navigator) {
  const register = () =>
    navigator.serviceWorker
      .register(`${SCOPE}sw.js`, {scope: SCOPE})
      .catch(() => {
        // Offline support is an enhancement.
      });
  whenActive(() => {
    if (document.readyState === 'complete') register();
    else addEventListener('load', register, {once: true});
  });
}
