/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The spec shell of the /3.0/ pages (layout gb/spec.html):
 *
 * - `{% gbshell content, title, description, section, collections.gb3 %}`:
 *   the page's shell spec (../gb-shell-spec.cjs), checked with the library's
 *   checkSpec() (errors fail the build), rendered to static HTML with
 *   renderSpecToString(), the page's content in its `gb-content` element,
 *   and the spec as JSON for src/spec/shell.ts to hydrate.
 * - `{% gbstyles %}`: the library's global stylesheet (m3.css) from the
 *   library server (MWC_GB_LIB), for the first paint before scripts run.
 *
 * The library's json-render modules are its compiled ESM
 * (material-design-expressive/json-render/*.js; the site build runs after
 * the library build).
 */

const {join} = require('node:path');
const {pathToFileURL} = require('node:url');
const {shellSpec} = require('../gb-shell-spec.cjs');

const JSON_RENDER = join(__dirname, '..', '..', '..', 'material-design-expressive', 'json-render');
let modules;
async function library() {
  modules ??= Promise.all([
    import(pathToFileURL(join(JSON_RENDER, 'check.js')).href),
    import(pathToFileURL(join(JSON_RENDER, 'static.js')).href),
  ]).then(([check, render]) => ({checkSpec: check.checkSpec, renderSpecToString: render.renderSpecToString}));
  return modules;
}

const CONTENT_SLOT = '<div id="gb-content"></div>';
const reported = new Set();

function gbSpecShell(eleventyConfig) {
  eleventyConfig.addAsyncShortcode('gbshell', async function (content, title, description, section, collection) {
    const where = this.page?.inputPath ?? '';
    const pages = (collection ?? []).map((p) => ({
      url: p.url,
      title: p.data.title ?? '',
      section: p.data.section,
      category: p.data.category,
      order: p.data.order,
    }));
    const spec = shellSpec({url: this.page?.url ?? '', title, description, section}, pages, content ?? '');
    const {checkSpec, renderSpecToString} = await library();
    const {valid, issues} = checkSpec(spec);
    if (!valid) {
      const errors = issues.filter((i) => i.severity === 'error').map((i) => `  ${i.element ?? ''}: ${i.message}`);
      throw new Error(`gbshell (${where}): the shell spec breaks the catalog:\n${errors.join('\n')}`);
    }
    for (const issue of issues) {
      const line = `gbshell: ${issue.kind} warning: ${issue.element ?? ''}: ${issue.message}`;
      if (!reported.has(line)) {
        reported.add(line);
        console.warn(line);
      }
    }
    const html = renderSpecToString(spec, {
      onWarning: (m) => {
        throw new Error(`gbshell (${where}): ${m}`);
      },
    });
    if (html.split(CONTENT_SLOT).length !== 2) throw new Error(`gbshell (${where}): no single content element`);
    const json = JSON.stringify(spec).replace(/</g, '\\u003c');
    return (
      `<div id="gb-shell">${html.replace(CONTENT_SLOT, `<div id="gb-content">${content ?? ''}</div>`)}</div>` +
      `<script type="application/json" id="gb-shell-spec">${json}</script>`
    );
  });

  eleventyConfig.addShortcode('gbstyles', () => {
    const lib = process.env.MWC_GB_LIB;
    return lib ? `<link rel="stylesheet" href="${lib}styles/m3.css" />` : '';
  });
}

module.exports = gbSpecShell;
