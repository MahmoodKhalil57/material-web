// src/gb/sw.ts
var sw = self;
var BUILD = true ? "mw7zvfl4" : "dev";
var PAGES = `gb-pages-${BUILD}`;
var ASSETS = `gb-assets-${BUILD}`;
var FONTS = "gb-fonts-v1";
var FONT_FILE = /^\/fonts\/gb\/[^/]+\.woff2$/;
var START = "/material-web/3.0/";
var NETWORK_TIMEOUT = 3e3;
var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
var ASSET_PATH = /^\/(js|css|fonts|images)\//;
var DOWNLOADS = /^\/3\.0\/(skill\/|material-web-3\.0\.mhtml$|custom-elements\.json$|llms-full\.txt$)/;
sw.addEventListener("install", (e) => {
  e.waitUntil(sw.skipWaiting());
});
sw.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      for (const name of await caches.keys()) {
        if (name.startsWith("gb-") && ![PAGES, ASSETS, FONTS].includes(name)) {
          await caches.delete(name);
        }
      }
      await sw.clients.claim();
    })()
  );
});
var cacheable = (response) => response.ok;
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (cacheable(response)) await cache.put(request, response.clone());
  return response;
}
async function networkFirst(request, cacheName, timeout, fallback, event) {
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
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("timeout")), timeout)
      )
    ]);
  } catch (error) {
    network.catch(() => {
    });
    const cached = await cache.match(request) ?? await fallback?.();
    if (cached) return cached;
    if (timeout !== null) return network;
    throw error;
  }
}
async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (cacheable(response)) await cache.put(request, response.clone());
    return response;
  });
  if (cached) {
    event.waitUntil(update.catch(() => {
    }));
    return cached;
  }
  return update;
}
sw.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === location.origin && DOWNLOADS.test(url.pathname)) return;
  if (request.mode === "navigate") {
    if (url.origin !== location.origin || !url.pathname.startsWith(START)) {
      return;
    }
    e.respondWith(
      networkFirst(
        request,
        PAGES,
        NETWORK_TIMEOUT,
        async () => await (await caches.open(PAGES)).match(START) ?? new Response("You are offline, and this page is not saved yet.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        }),
        e
      )
    );
    return;
  }
  if (url.origin === location.origin && url.pathname === "/material-web/3.0/search-index.json") {
    e.respondWith(networkFirst(request, PAGES, NETWORK_TIMEOUT, void 0, e));
    return;
  }
  const sameOrigin = url.origin === location.origin;
  if (sameOrigin && FONT_FILE.test(url.pathname)) {
    e.respondWith(cacheFirst(request, FONTS));
    return;
  }
  if (!(sameOrigin && ASSET_PATH.test(url.pathname))) return;
  if (LOCAL && sameOrigin) {
    e.respondWith(networkFirst(request, ASSETS, null, void 0, e));
    return;
  }
  e.respondWith(staleWhileRevalidate(request, e));
});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=sw.js.map
