/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The spec shell of the /3.0/ pages (layout spec.html), with the library's
 * json-render and preferences modules:
 *
 * - `{% gbshell content, title, description, section, collections.gb3,
 *   gbIndex, contentFormat %}`: the page's content as a spec (its own, or
 *   its HTML through content.cjs), and the shell spec (shell.cjs), both
 *   checked with checkSpec() (errors fail the build) and rendered with
 *   renderSpecToString(): the content is the shell's `gb-content` island,
 *   and the shell spec is embedded (embedSpec) for client/shell.ts to
 *   hydrate.
 * - `{% gbstyles %}`: the library's global stylesheet (m3.css) from the
 *   library server (MWC_GB_LIB), for the first paint before scripts run.
 * - `{% gbprepaint %}`: the library's prePaintScript(): the reader's saved
 *   color mode, reduced motion and theme, before the first paint.
 *
 * The library's modules are its compiled ESM (the site build runs after the
 * library build).
 */

const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {pathToFileURL} = require('node:url');
const {shellSpec} = require('./shell.cjs');
const {contentSpec} = require('./content.cjs');
// The site's public URL (MWC_SITE_URL), which the copy actions put in their text.
const gbSite = require('../content/_data/gbSite.cjs');

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
const CONTENT_ID = 'gb-content';
const SPEC_ID = 'gb-shell-spec';

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
    throw new Error(`gbshell: the shell spec uses ${[...missing].join(', ')}, which client/shell.ts doesn't import.`);
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
    const line = `gbshell: ${issue.kind} warning: ${issue.element ?? ''}: ${issue.message}`;
    if (!reported.has(line)) {
      reported.add(line);
      console.warn(line);
    }
  }
}

function gbSpecShell(eleventyConfig) {
  eleventyConfig.addAsyncShortcode('gbshell', async function (content, title, description, section, collection, ownTitle, contentFormat) {
    const where = this.page?.inputPath ?? '';
    const pages = (collection ?? []).map((p) => ({
      url: p.url,
      title: p.data.title ?? '',
      section: p.data.section,
      category: p.data.category,
      order: p.data.order,
    }));
    const {checkSpec, renderSpecToString, embedSpec, COMPONENTS, htmlToSpec} = await library();
    const failOn = (what) => (m) => {
      throw new Error(`gbshell (${where}): ${what}: ${m}`);
    };

    // The content as a spec: the page's own (a site page, content format
    // `spec`, whose template renders its spec as JSON), or its HTML
    // converted (content.cjs).
    const contentSpecOf =
      contentFormat === 'spec'
        ? JSON.parse(content)
        : contentSpec(content ?? '', {htmlToSpec, lib: process.env.MWC_GB_LIB ?? '', stats: contentStats}).spec;
    check(checkSpec, contentSpecOf, `gbshell (${where}): the content spec`);
    const contentHtml = renderSpecToString(contentSpecOf, {onWarning: failOn('content')});

    const page = {url: this.page?.url ?? '', title, description, section, ownTitle: Boolean(ownTitle), siteUrl: gbSite.url};
    const spec = shellSpec(page, pages, contentHtml);
    checkBundled(spec, COMPONENTS);
    check(checkSpec, spec, `gbshell (${where}): the shell spec`);
    const html = renderSpecToString(spec, {islands: {[CONTENT_ID]: contentHtml}, onWarning: failOn('shell')});
    if (!html.includes(`id="${CONTENT_ID}"`)) throw new Error(`gbshell (${where}): the shell has no ${CONTENT_ID} element`);
    return (
      `<div id="gb-shell">${html}</div>` +
      embedSpec(spec, SPEC_ID) +
      // The elements of the converted content, which can differ from the
      // Markdown's (md-gb-demo-code for code blocks).
      eleventyConfig.getFilter('gbcomponents')(contentHtml)
    );
  });

  // The content conversion's report: what the catalog couldn't express.
  eleventyConfig.on('eleventy.after', () => {
    if (!contentStats.size) return;
    const lines = [...contentStats].sort((a, b) => b[1] - a[1]).map(([what, n]) => `  ${n}\t${what}`);
    console.log(`[gbshell] content as specs:\n${lines.join('\n')}`);
    contentStats.clear();
  });

  eleventyConfig.addShortcode('gbstyles', () => {
    const lib = process.env.MWC_GB_LIB;
    return lib ? `<link rel="stylesheet" href="${lib}styles/m3.css" />` : '';
  });

  eleventyConfig.addAsyncShortcode('gbprepaint', async () => {
    const {prePaintScript} = await library();
    return `<script>${prePaintScript()}</script>`;
  });
}

module.exports = gbSpecShell;
module.exports.library = library;
