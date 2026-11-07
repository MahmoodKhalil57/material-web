/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const {existsSync, readFileSync} = require('node:fs');
const {join} = require('node:path');
const {pathToFileURL} = require('node:url');

const ROOT = join(__dirname, '..', '..', '..');
const EXAMPLES_JSON = join(__dirname, '..', '..', '_dev-gb', 'examples.json');

let examples;
/** Captured demos written by scripts/catalog-dev.mjs: {dir: [{name, slug, html}]}. */
function loadExamples() {
  if (!examples) {
    examples = existsSync(EXAMPLES_JSON)
      ? JSON.parse(readFileSync(EXAMPLES_JSON, 'utf8'))
      : {};
  }
  return examples;
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Shortcodes of the /3.0/ pages (docs/3.0, layout gb/default.html).
 *
 * - `{% gbexample "<dir>/<story>" %}`: the labs/gb demo story `<story>` (the
 *   slugified story name in labs/gb/.../<dir>/demo/stories.ts), live in a
 *   shadow root (needs the library server of `npm run catalog:dev`,
 *   MWC_GB_LIB) followed by its markup as a code block.
 * - `{% gbapi "<dir>" %}`: the API tables (scripts/m3/gen-api-docs.mjs).
 *
 * @param eleventyConfig The 11ty config in which to attach the shortcodes.
 */
function gb(eleventyConfig) {
  eleventyConfig.addShortcode('gbexample', function (id) {
    const [dir, slug] = String(id).split('/');
    const list = loadExamples()[dir];
    const index = list ? list.findIndex((s) => s.slug === slug) : -1;
    if (index < 0) {
      throw new Error(
        `gbexample "${id}" (${this.page?.inputPath}): no such story. ` +
          `Known: ${(list ?? []).map((s) => s.slug).join(', ') || 'none for ' + dir}`,
      );
    }
    const story = list[index];
    const lib = process.env.MWC_GB_LIB;
    const live = lib
      ? // The heights measured at capture (phone and desktop column widths)
        // are reserved (catalog/src/gb/gb.css), so the code below doesn't
        // move when the demo arrives.
        `<div class="gb-example" data-gb-dir="${dir}" data-gb-story="${index}"${
          story.height
            ? ` style="--gb-example-height: ${story.height}px; --gb-example-narrow-height: ${story.narrowHeight ?? story.height}px"`
            : ''
        }></div>\n` +
        `<script type="module">import('${lib}catalog/_dev-gb/${dir}/demo.js');</script>`
      : '';
    // Raw HTML, then the code fence: blank lines keep markdown-it from merging.
    return (
      `\n\n<figure class="gb-figure" aria-label="${escapeHtml(story.name)} example">\n${live}\n</figure>\n\n` +
      '```html\n' +
      story.html +
      '\n```\n\n'
    );
  });

  eleventyConfig.addAsyncShortcode('gbapi', async (dir) => {
    const {gbApiMarkdown} = await import(
      pathToFileURL(join(ROOT, 'scripts', 'm3', 'gen-api-docs.mjs')).href
    );
    const api = gbApiMarkdown(dir);
    if (!api) throw new Error(`gbapi "${dir}": no md-gb elements in that directory`);
    return `\n\n${api}\n\n`;
  });


}

module.exports = gb;
