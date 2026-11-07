/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const {existsSync, readFileSync, readdirSync} = require('node:fs');
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
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let prism;
/** Highlights HTML like the fenced ```html blocks (eleventy-plugin-syntaxhighlight). */
function highlightHtml(code) {
  if (!prism) {
    prism = {
      Prism: require('prismjs'),
      loader: require('@11ty/eleventy-plugin-syntaxhighlight/src/PrismLoader'),
    };
  }
  const {Prism, loader} = prism;
  const grammar = loader('html', {});
  return grammar ? Prism.highlight(code, grammar, 'html') : escapeHtml(code);
}

/** Removes the common indentation and surrounding blank lines. */
function dedent(text) {
  const lines = text.replace(/\r\n?/g, '\n').replace(/\s+$/, '').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => /^ */.exec(l)[0].length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(indent)).join('\n');
}

/** Code up to this many lines is not collapsed (no "View code" button). */
const SHORT_CODE_LINES = 4;

/**
 * The demo card (styles in catalog/src/gb/gb.css, behavior in gb.ts): a
 * figure with the preview and the code. No blank lines in the output (they
 * would end the raw HTML block in Markdown), so the code's line breaks are
 * entities.
 */
function demoCard(label, preview, code, style = '') {
  const source = dedent(code);
  const short = source.split('\n').length <= SHORT_CODE_LINES;
  const highlighted = highlightHtml(source).replace(/\n/g, '&#10;');
  return (
    '\n\n<figure class="gb-demo" aria-label="' + escapeHtml(label) + '"' +
    (short ? ' data-short' : '') + '>\n' +
    '<div class="gb-demo-preview"' + (style ? ' style="' + style + '"' : '') + '>\n' +
    preview +
    '\n</div>\n<div class="gb-demo-code"><div class="gb-code">' +
    '<pre class="language-html"><code class="language-html">' + highlighted + '</code></pre>' +
    '</div></div>\n</figure>\n\n'
  );
}

let tagModules;
/** md-gb-* tag name -> module path under the repo (labs/gb). */
function loadTagModules() {
  if (!tagModules) {
    tagModules = new Map();
    const scan = (dir, base) => {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir, {withFileTypes: true})) {
        if (entry.isDirectory()) scan(join(dir, entry.name), `${base}/${entry.name}`);
        else if (/^md-gb-[a-z0-9-]+\.js$/.test(entry.name)) {
          tagModules.set(entry.name.slice(0, -3), `${base}/${entry.name}`);
        }
      }
    };
    scan(join(ROOT, 'labs', 'gb', 'components'), 'labs/gb/components');
    scan(join(ROOT, 'labs', 'gb', 'styles'), 'labs/gb/styles');
  }
  return tagModules;
}

/**
 * Shortcodes of the /3.0/ pages (docs/3.0, layout gb/default.html).
 *
 * - `{% gbexample "<dir>/<story>" %}`: the labs/gb demo story `<story>` (the
 *   slugified story name in labs/gb/.../<dir>/demo/stories.ts), live in a
 *   shadow root (needs the library server of `npm run catalog:dev`,
 *   MWC_GB_LIB) in a demo card with its markup as the code.
 * - `{% demo "label" %}<html>{% enddemo %}`: the same card for HTML written
 *   once (preview and code).
 * - Filter `gbcomponents`: loads the md-gb-* elements a page uses.
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
      ? `<div class="gb-example" data-gb-dir="${dir}" data-gb-story="${index}"></div>
` +
        `<script type="module">import('${lib}catalog/_dev-gb/${dir}/demo.js');</script>`
      : '';
    // The heights measured at capture (phone and desktop column widths) are
    // reserved (catalog/src/gb/gb.css), so the code doesn't move when the
    // demo arrives.
    const style = story.height
      ? `--gb-example-height: ${story.height}px; --gb-example-narrow-height: ${story.narrowHeight ?? story.height}px`
      : '';
    return demoCard(`${story.name} example`, live, story.html, style);
  });

  /**
   * `{% demo "Accessible label" %}<html>{% enddemo %}`: the HTML is the
   * preview and, formatted and highlighted, the code of a demo card.
   */
  eleventyConfig.addPairedShortcode('demo', function (content, label) {
    if (!label) {
      throw new Error(`demo (${this.page?.inputPath}): needs an accessible label`);
    }
    // Blank lines would end the raw HTML block in Markdown.
    const preview = dedent(content)
      .split('\n')
      .filter((line) => line.trim())
      .join('\n');
    return demoCard(String(label), preview, content);
  });

  /**
   * Filter `gbcomponents`: the script that defines the md-gb-* elements used
   * in a page's content (from the library server of `npm run catalog:dev`,
   * MWC_GB_LIB); empty without it. The first definition of a tag wins, since
   * the page shell (/js/gb/gb.js) bundles some of the components.
   */
  eleventyConfig.addFilter('gbcomponents', (html) => {
    const lib = process.env.MWC_GB_LIB;
    if (!lib) return '';
    const modules = loadTagModules();
    const tags = new Set(String(html).match(/(?<=<)md-gb-[a-z0-9-]+/g) ?? []);
    const paths = [...tags].map((t) => modules.get(t)).filter(Boolean);
    if (!paths.length) return '';
    return (
      '<script type="module">' +
      'const define = customElements.define.bind(customElements);' +
      'customElements.define = (name, ctor, options) => { if (!customElements.get(name)) define(name, ctor, options); };' +
      paths.map((p) => `import('${lib}${p}');`).join('') +
      '</script>'
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
