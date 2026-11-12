/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Page-to-page navigation inside /3.0/ for the spec shell (shell.ts):
 *
 * - a route progress indicator following the M3 progress indicator guidance
 *   (.m3-specs/pages/components/progress-indicators.md, "Expected wait
 *   time"): nothing under 200ms, the loading indicator up to 5s, the linear
 *   progress indicator after that, never visible for less than 600ms. It sets
 *   the store's `/route` ('' | 'loading' | 'linear'), which the shell spec
 *   shows; the next page carries it on until 600ms have passed;
 * - speculation rules for links the document rules in the layout cannot see
 *   (the rail's and bar's links are in shadow roots) and for links in the
 *   viewport, with `<link rel=prefetch>` where speculation rules are
 *   unsupported;
 * - registers the service worker (sw.ts, served at /3.0/sw.js).
 *
 * Everything with a side effect waits for a prerendered page to be activated.
 */

import type {StateStore} from '@json-render/core';

const SCOPE = '/3.0/';
/** Under this a navigation is instant: no indicator (M3: under 200ms). */
const SHOW_AFTER = 200;
/** From this a wait is long: the linear progress indicator (M3: over 5s). */
const LONG_AFTER = 5000;
/** An indicator that was shown stays at least this long (no flash). */
const MIN_VISIBLE = 600;
/** A navigation still pending after this is assumed lost. */
const GIVE_UP = 60000;
const ROUTE_KEY = 'route-progress';

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

const prerendering = () => Boolean((document as Document & {prerendering?: boolean}).prerendering);

/** Runs `fn` now, or once a prerendered page is shown to the user. */
function whenActive(fn: () => void) {
  if (prerendering()) document.addEventListener('prerenderingchange', () => fn(), {once: true});
  else fn();
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
  if (url.origin !== location.origin || !url.pathname.startsWith(SCOPE)) return null;
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return null; // A file, not a page.
  return url;
}

/** URL without its fragment, the identity of a document. */
const docKey = (url: URL) => url.origin + url.pathname + url.search;

// --- Speculation rules and prefetch ---------------------------------------------

const LINKS = ['a', 'md-gb-nav-rail-item', 'md-gb-nav-bar-item', 'md-gb-button', 'md-gb-carousel-item'];

const supportsSpeculation =
  typeof HTMLScriptElement.supports === 'function' && HTMLScriptElement.supports('speculationrules');
const saveData = () =>
  Boolean((navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData);

/** The link-like element on an event path that leads to another page. */
function linkTarget(path: EventTarget[]): {el: Element; url: URL} | null {
  for (const node of path) {
    if (!(node instanceof Element) || !LINKS.includes(node.localName)) continue;
    if (node.hasAttribute('download')) continue;
    const target = node.getAttribute('target');
    if (target && target !== '_self') continue;
    const href = node.getAttribute('href');
    if (!href || href.startsWith('#')) continue;
    const url = pageUrl(href);
    if (!url || docKey(url) === docKey(new URL(location.href))) continue;
    return {el: node, url};
  }
  return null;
}

function addRules(type: 'prefetch' | 'prerender', urls: string[]) {
  const script = document.createElement('script');
  script.type = 'speculationrules';
  script.textContent = JSON.stringify({[type]: [{source: 'list', urls, eagerness: 'immediate'}]});
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

  // Links in the viewport: prefetch them, batched and bounded.
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
      for (const url of queue.values()) if (budget-- > 0) speculate('prefetch', url);
      queue.clear();
    }, 150);
  });
  for (const el of document.querySelectorAll('md-gb-nav-rail-item[href], md-gb-nav-bar-item[href], main a[href]')) {
    if (linkTarget([el])) observer.observe(el);
  }
}

// --- Route progress ---------------------------------------------------------------

function carryOut(entry: Carry | null) {
  try {
    if (entry) store()?.setItem(ROUTE_KEY, JSON.stringify(entry));
    else store()?.removeItem(ROUTE_KEY);
  } catch {
    // Without storage the next page just shows no carried indicator.
  }
}

/** The page a click leads to, if it is another document. */
function clickTarget(e: MouseEvent): URL | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const hit = e.composedPath().find((n): n is Element => n instanceof Element && LINKS.includes(n.localName) && n.hasAttribute('href'));
  if (!hit || hit.hasAttribute('download')) return null;
  const target = hit.getAttribute('target');
  if (target && target !== '_self') return null;
  let url: URL;
  try {
    url = new URL(hit.getAttribute('href')!, location.href);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return null;
  // A fragment on this page scrolls; it does not load.
  if (url.hash && docKey(url) === docKey(new URL(location.href))) return null;
  return url;
}

function routeProgress(state: StateStore) {
  let shown: Stage | null = null;
  let shownAt = 0;
  let pending: string | null = null;
  let showTimer: number | undefined;
  let longTimer: number | undefined;
  let giveUpTimer: number | undefined;

  const show = (stage: Stage, destination: string) => {
    shown = stage;
    shownAt = Date.now();
    state.set('/route', stage);
    carryOut({url: destination, at: shownAt, stage});
  };
  const hide = () => {
    shown = null;
    carryOut(null);
    state.set('/route', '');
  };
  const cancel = () => {
    clearTimeout(showTimer);
    clearTimeout(longTimer);
    clearTimeout(giveUpTimer);
    pending = null;
    hide();
  };
  /** A navigation to `url` started (a click, or the Navigation API). */
  const start = (url: URL) => {
    const destination = docKey(url);
    if (pending === destination) return;
    pending = destination;
    clearTimeout(showTimer);
    clearTimeout(longTimer);
    clearTimeout(giveUpTimer);
    if (shown) carryOut({url: destination, at: shownAt, stage: shown});
    else showTimer = window.setTimeout(() => show('loading', destination), SHOW_AFTER);
    longTimer = window.setTimeout(() => {
      if (shown !== 'linear') show('linear', destination);
    }, LONG_AFTER);
    giveUpTimer = window.setTimeout(cancel, GIVE_UP);
  };
  /** The page this navigation led to: carry on showing what the last one did. */
  const carryIn = () => {
    let entry: Carry | null = null;
    try {
      entry = JSON.parse(store()?.getItem(ROUTE_KEY) ?? 'null');
    } catch {
      // Ignore a broken entry.
    }
    carryOut(null);
    if (!entry || entry.url !== docKey(new URL(location.href)) || Date.now() - entry.at > GIVE_UP) return;
    shown = entry.stage;
    shownAt = entry.at;
    state.set('/route', entry.stage);
    window.setTimeout(hide, Math.max(0, MIN_VISIBLE - (Date.now() - entry.at)));
  };

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
    if (event.hashChange || event.downloadRequest !== null || event.destination.sameDocument) return;
    const url = new URL(event.destination.url);
    if (url.origin === location.origin) start(url);
  });
  nav?.addEventListener('navigateerror', cancel);
  // Stop (Esc) cancels a pending navigation; so does the back/forward cache.
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pending) cancel();
  });
  addEventListener('pageshow', (e) => {
    if (e.persisted) cancel();
  });
  addEventListener('pagehide', (e) => {
    if (e.persisted) cancel();
  });
}

// --- Service worker ------------------------------------------------------------

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const register = () =>
    navigator.serviceWorker.register(`${SCOPE}sw.js`, {scope: SCOPE}).catch(() => {
      // Offline support is an enhancement.
    });
  whenActive(() => {
    if (document.readyState === 'complete') register();
    else addEventListener('load', register, {once: true});
  });
}

/** Sets up the navigation features; `state` is null on a page without the shell. */
export function setUpNavigation(state: StateStore | null) {
  if (state) routeProgress(state);
  // Idle: speculation never competes with the page's own work.
  whenActive(() => {
    const idle =
      (window as Window & {requestIdleCallback?: typeof requestIdleCallback}).requestIdleCallback ??
      ((cb: () => void) => setTimeout(cb, 200));
    idle(setUpSpeculation);
  });
  registerServiceWorker();
}
