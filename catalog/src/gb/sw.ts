/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service worker of the /3.0/ pages (scope /3.0/, built to /3.0/sw.js by
 * catalog/esbuild.config.mjs, registered by navigation.ts). Its paths come
 * from its scope, so it works under a base path too (GitHub Pages).
 *
 * - Page navigations: network first with a short timeout, then the cached
 *   copy; offline, the cached page (or the 3.0 start page).
 * - Fonts (/fonts/gb/*.woff2, self-hosted by scripts/gb-fonts.mjs): cache
 *   first, in a cache that outlives builds. Their file names carry a content
 *   hash, so a URL never changes content: once fetched they are never
 *   fetched again, in dev too.
 * - Other static assets (/js/, /css/, /fonts/, /images/):
 *   stale-while-revalidate; on localhost network first, so a rebuild is
 *   never served stale for more than the one load that fails to reach it.
 * - Page and asset cache names carry the build id, which changes the worker
 *   script on every build: a new build installs, takes over at once, and
 *   deletes the caches of the old one (not the font cache).
 */

declare const __GB_BUILD_ID__: string;

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<unknown>): void;
}
interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}
interface Scope {
  skipWaiting(): Promise<void>;
  clients: {claim(): Promise<void>};
  addEventListener(type: string, listener: (e: never) => void): void;
}
const sw = self as unknown as Scope & {registration: {scope: string}};

const BUILD = typeof __GB_BUILD_ID__ === 'string' ? __GB_BUILD_ID__ : 'dev';
const PAGES = `gb-pages-${BUILD}`;
const ASSETS = `gb-assets-${BUILD}`;
/** Content-hashed font files: kept across builds. */
const FONTS = 'gb-fonts-v1';
/** The 3.0 start page, from the scope: /3.0/, or under a base path on a
 * project site (/material-web/3.0/ on GitHub Pages). */
const START = new URL(sw.registration.scope).pathname;
/** The site's root: / or the base path. */
const SITE = START.replace(/3\.0\/$/, '');
const at = (pattern: string) =>
  new RegExp('^' + SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + pattern);
const FONT_FILE = at('fonts/gb/[^/]+\\.woff2$');
/** How long a page may take before the cached copy is used. */
const NETWORK_TIMEOUT = 3000;
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
/** lib/ is the bundled labs/gb of a static build (scripts/catalog-pages.mjs). */
const ASSET_PATH = at('(js|css|fonts|images|lib)/');
const DOWNLOADS = at(
  '3\\.0/(skill/|material-web-3\\.0\\.mhtml$|custom-elements\\.json$|llms-full\\.txt$)',
);

sw.addEventListener('install', (e: ExtendableEvent) => {
  e.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (e: ExtendableEvent) => {
  e.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith('gb-') && ![PAGES, ASSETS, FONTS].includes(name)) {
          await caches.delete(name);
        }
      }
      await sw.clients.claim();
    })(),
  );
});

/** Only complete, successful responses are worth keeping. */
const cacheable = (response: Response) => response.ok;

/** The cached copy, else the network (kept for next time). */
async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (cacheable(response)) await cache.put(request, response.clone());
  return response;
}

async function networkFirst(
  request: Request,
  cacheName: string,
  timeout: number | null,
  fallback?: () => Promise<Response | undefined>,
  event?: ExtendableEvent,
): Promise<Response> {
  const cache = await caches.open(cacheName);
  const network = fetch(request).then((response) => {
    if (cacheable(response)) {
      const store = cache.put(request, response.clone());
      event?.waitUntil(store);
    }
    return response;
  });
  try {
    if (timeout === null) return await network;
    return await Promise.race([
      network,
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeout),
      ),
    ]);
  } catch (error) {
    // Slow or offline: the cached copy. A slow network still fills the cache
    // for next time.
    network.catch(() => {});
    const cached = (await cache.match(request)) ?? (await fallback?.());
    if (cached) return cached;
    if (timeout !== null) return network; // Nothing cached: wait for it.
    throw error;
  }
}

async function staleWhileRevalidate(
  request: Request,
  event: ExtendableEvent,
): Promise<Response> {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (cacheable(response)) await cache.put(request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => {}));
    return cached;
  }
  return update;
}

sw.addEventListener('fetch', (e: FetchEvent) => {
  const {request} = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Files that are downloaded, not read offline: the single-file site
  // (.mhtml, many MB), custom-elements.json, the agent skill files,
  // llms-full.txt. Large and rebuilt with the docs, so they always come from
  // the network (the page lists them; the Download & copy sheet).
  if (url.origin === location.origin && DOWNLOADS.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    if (url.origin !== location.origin || !url.pathname.startsWith(START)) {
      return;
    }
    e.respondWith(
      networkFirst(
        request,
        PAGES,
        NETWORK_TIMEOUT,
        async () =>
          (await (await caches.open(PAGES)).match(START)) ??
          new Response('You are offline, and this page is not saved yet.', {
            status: 503,
            headers: {'Content-Type': 'text/plain; charset=utf-8'},
          }),
        e,
      ),
    );
    return;
  }

  // The search index (search.ts) changes with every build: network first,
  // the cached copy offline.
  if (url.origin === location.origin && url.pathname === `${START}search-index.json`) {
    e.respondWith(networkFirst(request, PAGES, NETWORK_TIMEOUT, undefined, e));
    return;
  }

  const sameOrigin = url.origin === location.origin;
  if (sameOrigin && FONT_FILE.test(url.pathname)) {
    e.respondWith(cacheFirst(request, FONTS));
    return;
  }
  if (!(sameOrigin && ASSET_PATH.test(url.pathname))) return;
  // Dev: files change without a new URL, so the network wins.
  if (LOCAL && sameOrigin) {
    e.respondWith(networkFirst(request, ASSETS, null, undefined, e));
    return;
  }
  e.respondWith(staleWhileRevalidate(request, e));
});
