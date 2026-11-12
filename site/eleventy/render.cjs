/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The spec shell of the /3.0/ pages (layout spec.html), with the library's
 * json-render and preferences modules:
 *
 * - `{% shell content, title, description, section, collections.docs,
 *   indexPage, contentFormat %}`: the page's content as a spec (its own, or
 *   its HTML through content.cjs), and the shell spec (shell.cjs), both
 *   checked with checkSpec() (errors fail the build) and rendered with
 *   renderSpecToString(): the content is the shell's `page-content` island,
 *   and the shell spec is embedded (embedSpec) for client/shell.ts to
 *   hydrate.
 * - `{% librarystyles %}`: the library's global stylesheet (m3.css) from the
 *   library server (MWC_LIB_URL), for the first paint before scripts run.
 * - `{% prepaint %}`: the library's prePaintScript(): the reader's saved
 *   color mode, reduced motion and theme, before the first paint.
 *
 * The library's modules are its compiled ESM (the site build runs after the
 * library build).
 */

const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {pathToFileURL} = require('node:url');
const {shellSpec} = require('../specs/shell.cjs');
const {contentSpec} = require('./content.cjs');
// The site's public URL (MWC_SITE_URL), which the copy actions put in their text.
const siteData = require('../content/_data/site.cjs');

const LIBRARY = join(__dirname, '..', '..', 'material-design-expressive');
const load = (path) => import(pathToFileURL(join(LIBRARY, path)).href);
let modules;
async function library() {
  modules ??= Promise.all([
    load('json-render/check.js'),
    load('json-render/static.js'),
    load('json-render/catalog.js'),
    load('json-render/html.js'),
    // The pre-paint script on its own: preferences.js needs a browser.
    load('styles/preferences-script.js'),
  ]).then(([check, render, catalog, html, preferences]) => ({
    checkSpec: check.checkSpec,
    renderSpecToString: render.renderSpecToString,
    embedSpec: render.embedSpec,
    COMPONENTS: catalog.COMPONENTS,
    htmlToSpec: html.htmlToSpec,
    prePaintScript: preferences.prePaintScript,
  }));
  return modules;
}

/** The id of the shell's content island, and of its embedded spec. */
const CONTENT_ID = 'page-content';
const SPEC_ID = 'app-shell-spec';

/** What the content conversion left out, over the whole build. */
const contentStats = new Map();
const reported = new Set();

/**
 * The shell's elements are defined by the client bundle (client/shell.ts),
 * which imports each one: fails when the shell spec uses a component the
 * bundle doesn't import (it would stay an unupgraded element).
 */
let bundled;
function checkBundled(spec, components) {
  bundled ??= new Set(
    [...readFileSync(join(__dirname, '..', 'client', 'shell.ts'), 'utf8').matchAll(/import '@material\/web\/[^']*\/(md-gb-[a-z-]+)\.js';/g)].map((m) => m[1]),
  );
  const missing = new Set();
  for (const el of Object.values(spec.elements)) {
    const tag = components[el.type]?.tag;
    if (tag && !tag.startsWith('#') && !bundled.has(tag)) missing.add(tag);
  }
  if (missing.size) {
    throw new Error(`shell: the shell spec uses ${[...missing].join(', ')}, which client/shell.ts doesn't import.`);
  }
}

/** Checks a spec; throws with its errors, and reports its warnings once. */
function check(checkSpec, spec, what) {
  const {valid, issues} = checkSpec(spec);
  if (!valid) {
    const errors = issues.filter((i) => i.severity === 'error').slice(0, 20).map((i) => `  ${i.element ?? ''}: ${i.message}`);
    throw new Error(`${what} breaks the catalog:\n${errors.join('\n')}`);
  }
  for (const issue of issues) {
    const line = `shell: ${issue.kind} warning: ${issue.element ?? ''}: ${issue.message}`;
    if (!reported.has(line)) {
      reported.add(line);
      console.warn(line);
    }
  }
}

/**
 * A page's shell, built once and shared by `shellhead` (in the head) and
 * `shell` (in the body), by page URL (a paginated template's pages share
 * their input file).
 */
const built = new Map();

function specShell(eleventyConfig) {
  const buildShell = async function (thisPage, content, title, description, section, collection, ownTitle, contentFormat) {
    const where = thisPage?.inputPath ?? '';
    const pages = (collection ?? []).map((p) => ({
      url: p.url,
      title: p.data.title ?? '',
      section: p.data.section,
      category: p.data.category,
      order: p.data.order,
    }));
    const {checkSpec, renderSpecToString, embedSpec, COMPONENTS, htmlToSpec} = await library();
    const failOn = (what) => (m) => {
      throw new Error(`shell (${where}): ${what}: ${m}`);
    };

    // The content as a spec: the page's own (a site page, content format
    // `spec`, whose template renders its spec as JSON), or its HTML
    // converted (content.cjs).
    let contentSpecOf;
    if (contentFormat === 'spec') {
      contentSpecOf = JSON.parse(content);
    } else {
      const converted = contentSpec(content ?? '', {htmlToSpec, lib: process.env.MWC_LIB_URL ?? '', stats: contentStats});
      // Strict: the content is only what the catalog can express. Nothing
      // dropped, unwrapped or in a stray slot (a demo's example that needs
      // more is a framed document, which isn't an issue).
      if (converted.issues.length) {
        const counts = new Map();
        for (const i of converted.issues) counts.set(`${i.kind} <${i.tag}>`, (counts.get(`${i.kind} <${i.tag}>`) ?? 0) + 1);
        const list = [...counts].map(([what, n]) => `  ${what}${n > 1 ? ` (${n})` : ''}`).join('\n');
        throw new Error(`shell (${where}): the content has HTML the catalog can't express:\n${list}`);
      }
      contentSpecOf = converted.spec;
    }
    check(checkSpec, contentSpecOf, `shell (${where}): the content spec`);
    const contentHtml = renderSpecToString(contentSpecOf, {onWarning: failOn('content')});

    const page = {url: thisPage?.url ?? '', title, description, section, ownTitle: Boolean(ownTitle), siteUrl: siteData.url};
    const spec = shellSpec(page, pages, contentHtml);
    checkBundled(spec, COMPONENTS);
    check(checkSpec, spec, `shell (${where}): the shell spec`);
    const html = renderSpecToString(spec, {islands: {[CONTENT_ID]: contentHtml}, onWarning: failOn('shell')});
    if (!html.includes(`id="${CONTENT_ID}"`)) throw new Error(`shell (${where}): the shell has no ${CONTENT_ID} element`);
    return {
      // The modules of the content's elements (they can differ from the
      // Markdown's: md-gb-demo-code for code blocks): render-blocking, which
      // works in the head only.
      head: eleventyConfig.getFilter('componentmodules')(contentHtml),
      // The shell, with its embedded spec.
      body: `<div id="app-shell">${html}</div>` + embedSpec(spec, SPEC_ID),
    };
  };

  const shellOf = (thisPage, args) => {
    const key = thisPage?.url ?? '';
    if (!built.has(key)) built.set(key, buildShell(thisPage, ...args));
    return built.get(key);
  };

  // `{% shellhead content, title, ... %}` in the head, `{% shell content,
  // title, ... %}` in the body: the same arguments.
  eleventyConfig.addAsyncShortcode('shellhead', async function (...args) {
    return (await shellOf(this.page, args)).head;
  });
  eleventyConfig.addAsyncShortcode('shell', async function (...args) {
    const shell = await shellOf(this.page, args);
    built.delete(this.page?.url ?? '');
    return shell.body;
  });

  // The content conversion's report: what the catalog couldn't express.
  eleventyConfig.on('eleventy.after', () => {
    if (!contentStats.size) return;
    const lines = [...contentStats].sort((a, b) => b[1] - a[1]).map(([what, n]) => `  ${n}\t${what}`);
    console.log(`[shell] content as specs:\n${lines.join('\n')}`);
    contentStats.clear();
  });

  eleventyConfig.addShortcode('librarystyles', () => {
    const lib = process.env.MWC_LIB_URL;
    return lib ? `<link rel="stylesheet" href="${lib}styles/m3.css" />` : '';
  });

  eleventyConfig.addAsyncShortcode('prepaint', async () => {
    const {prePaintScript} = await library();
    return `<script>${prePaintScript()}</script>`;
  });
}

module.exports = specShell;
module.exports.library = library;
