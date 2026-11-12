/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * /3.0/all/: every /3.0/ page on one page, in the order of the navigation
 * drawer, each page's content under its own h1. It is the source of the
 * single-file download (/3.0/material-web-3.0.mhtml, saved from this page by
 * site/scripts/assets.mjs) and prints well.
 *
 * - No drawer, search or table of contents; a contents list at the top.
 * - Links between /3.0/ pages, and links to a heading, become in-page
 *   anchors. Heading ids are prefixed with the page (`components-button--usage`)
 *   so the ids of different pages cannot collide. Ids of other elements stay:
 *   demos refer to them (popovertarget, anchor).
 * - Demo iframes load when near the viewport (84 at once exhaust a browser);
 *   the snapshot step loads them a few at a time.
 * - The library's styles only (m3.css, md-gb-prose), as the spec shell.
 * - The spec shell's script (/js/spec/shell.js: the theme, the demo frames'
 *   theme, the WebMCP tools) blocks rendering, so the page's tools
 *   (window.docsTools) exist before a demo iframe runs.
 * - noindex, and left out of the sitemap and the collections.
 */

const cheerio = require('cheerio');
const {SECTIONS, SITE, absolute, sorted} = require('../eleventy/site.cjs');
const {library} = require('../eleventy/render.cjs');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** /3.0/components/button/ -> components-button */
const slugOf = (url) => url.split('/').filter(Boolean).slice(1).join('-');

/** The path of an internal /3.0/ link (or undefined for any other link). */
function internalPath(href) {
  let url;
  try {
    url = new URL(href, 'https://placeholder.invalid/3.0/');
  } catch {
    return undefined;
  }
  const own = url.origin === 'https://placeholder.invalid' || url.origin === SITE.url;
  if (!own || !url.pathname.startsWith('/3.0/')) return undefined;
  return {path: url.pathname, hash: decodeURIComponent(url.hash.replace(/^#/, ''))};
}

class AllPage {
  data() {
    return {
      permalink: '/3.0/all/',
      eleventyExcludeFromCollections: true,
      eleventyImport: {collections: ['docs']},
    };
  }

  async render(data) {
    const pages = sorted(data.collections?.docs ?? []);
    const byPath = new Map(pages.map((p) => [p.url, p]));
    // Pass 1: parse every page and note its heading ids.
    const docs = new Map();
    for (const page of pages) {
      const $ = cheerio.load(await page.templateContent, null, false);
      const ids = new Set();
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const id = $(el).attr('id');
        if (id) ids.add(id);
      });
      docs.set(page.url, {$, ids, slug: slugOf(page.url)});
    }
    // Pass 2: ids, links and iframes.
    for (const page of pages) {
      const {$, ids, slug} = docs.get(page.url);
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const id = $(el).attr('id');
        if (id) $(el).attr('id', `${slug}--${id}`);
      });
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (href.startsWith('#')) {
          const id = decodeURIComponent(href.slice(1));
          if (ids.has(id)) $(el).attr('href', `#${slug}--${id}`);
          return;
        }
        const target = internalPath(href);
        if (!target) return;
        // /3.0/components/button.md is the Markdown of /3.0/components/button/.
        const path = target.path.replace(/\.md$/, '/').replace(/\/index\/$/, '/');
        const normalized = path === '/3.0/' ? '/3.0/about/intro/' : path.replace(/\/?$/, '/');
        const dest = byPath.get(normalized);
        if (!dest) return;
        const d = docs.get(dest.url);
        $(el).attr('href', target.hash && d.ids.has(target.hash) ? `#${d.slug}--${target.hash}` : `#${d.slug}`);
      });
      // Demo iframes (srcdoc) load as they come near the viewport (the inline
      // script below): 84 of them at once exhaust the browser's resources.
      $('iframe[srcdoc]').each((_, el) => {
        $(el).attr('data-srcdoc', $(el).attr('srcdoc')).removeAttr('srcdoc').removeAttr('loading');
      });
    }

    const contents = SECTIONS.map((section) => {
      const inSection = pages.filter((p) => p.data.section === section.id);
      if (!inSection.length) return '';
      return (
        `<li><span>${esc(section.label)}</span><ul>` +
        inSection.map((p) => `<li><a href="#${docs.get(p.url).slug}">${esc(p.data.title)}</a></li>`).join('') +
        '</ul></li>'
      );
    }).join('');

    const body = pages
      .map((p) => {
        const description = String(p.data.description ?? '').trim();
        return (
          `<section class="all-page" id="${docs.get(p.url).slug}" aria-labelledby="${docs.get(p.url).slug}-title">` +
          `<h1 id="${docs.get(p.url).slug}-title">${esc(p.data.title)}</h1>` +
          (description ? `<p class="lede">${esc(description)}</p>` : '') +
          `<p class="all-source">Online: <a href="${esc(absolute(p.url))}">${esc(absolute(p.url))}</a></p>` +
          `<div class="page-content">${docs.get(p.url).$.html()}</div></section>`
        );
      })
      .join('\n');

    const components = this.componentmodules ? this.componentmodules(body) : '';
    // The library's styles only (m3.css, md-gb-prose), as the spec shell.
    const styles = this.librarystyles ? this.librarystyles() : '';
    const fonts = data.fonts?.stylesheet ? `<link rel="stylesheet" href="${esc(data.fonts.stylesheet)}" />` : '';
    // The reader's saved color mode, reduced motion and theme before the
    // first paint (the library's styles/preferences.ts), as on the pages.
    const {prePaintScript} = await library();
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(SITE.name)}: all pages</title>
    <meta name="description" content="${esc(SITE.description)}" />
    <meta name="robots" content="noindex" />
    <meta name="color-scheme" content="light dark" />
    <link href="/images/favicon.svg" rel="icon" sizes="any" type="image/svg+xml" />
    ${fonts}
    ${styles}
    ${components}
    <script>
      // Demo iframes run before shell.js registers window.docsTools (modules
      // are deferred): calls wait for the real tools.
      (() => {
        const stub = new Proxy({}, {
          get: (_, name) => async (...args) => {
            for (let i = 0; i < 200 && window.docsTools === stub; i++) await new Promise((r) => setTimeout(r, 50));
            return window.docsTools[name](...args);
          },
        });
        window.docsTools = stub;
      })();
    </script>
    <script>${prePaintScript()}</script>
    <script type="module" src="/js/spec/shell.js" blocking="render"></script>
  </head>
  <body>
    <main id="main" tabindex="-1">
      <md-gb-prose>
      <header id="top">
        <p><strong>${esc(SITE.name)}</strong></p>
        <p>${esc(SITE.description)} All pages of <a href="${esc(absolute('/3.0/'))}">${esc(absolute('/3.0/'))}</a> on one page.</p>
        <nav aria-label="Contents"><ul>${contents}</ul></nav>
      </header>
${body}
      </md-gb-prose>
    </main>
    <script>
      // Loads a demo iframe (loadDemo is also what the snapshot step calls, a
      // few at a time) when it comes near the viewport.
      (() => {
        const load = (frame) => {
          if (frame.dataset.srcdoc === undefined) return;
          frame.srcdoc = frame.dataset.srcdoc;
          delete frame.dataset.srcdoc;
        };
        window.loadDemo = load;
        const frames = document.querySelectorAll('iframe[data-srcdoc]');
        if (!('IntersectionObserver' in window)) return frames.forEach(load);
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              observer.unobserve(entry.target);
              load(entry.target);
            }
          },
          {rootMargin: '1500px 0px'},
        );
        frames.forEach((frame) => observer.observe(frame));
      })();
    </script>
    <div id="page-status" role="status" aria-live="polite" style="position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap"></div>
  </body>
</html>
`;
  }
}

module.exports = AllPage;
