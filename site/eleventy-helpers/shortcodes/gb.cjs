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

const {
  cardFiles,
  demoCard,
  demoId,
  dedent,
  frameDoc,
  loadTagModules,
  oneBlock,
  parseDemo,
  resetDemoIds,
  scopeCss,
  scriptJs,
  escapeHtml,
} = require('./gb-demo.cjs');

/**
 * Shortcodes of the /3.0/ pages (docs/3.0, layout gb/default.html).
 *
 * - `{% gbexample "<dir>/<story>" %}`: the labs/gb demo story `<story>` (the
 *   slugified story name in .../<dir>/demo/stories.ts), live in a
 *   shadow root (needs the library server of `npm run catalog:dev`,
 *   MWC_GB_LIB) in a demo card with its markup as the code.
 * - `{% demo "label" %}<html>{% enddemo %}`: the same card for HTML written
 *   once (preview and code).
 * - Filter `gbcomponents`: loads the md-gb-* elements a page uses.
 * - `{% gbapi "<dir>" %}`: the API tables (scripts/m3/gen-api-docs.mjs).
 * - `{% gbcompat %}`: the Compatibility section of a component page
 *   (eleventy-helpers/gb-compat.cjs), added to every one by a preprocessor.
 * - `{% gbshape "<name>", "<class>", "<to>", "loop", <delay> %}`: a
 *   decorative M3 Expressive shape (eleventy-helpers/gb-shapes.cjs) as
 *   inline SVG in currentColor; with `to`, it morphs into that shape, in a
 *   loop with "loop" (delay 0-3 staggers it), else on hover and focus.
 *
 * @param eleventyConfig The 11ty config in which to attach the shortcodes.
 */
function gb(eleventyConfig) {
  eleventyConfig.on('eleventy.before', resetDemoIds);
  // Every component page gets a Compatibility section (M3 spec, Baseline,
  // WAI-ARIA, Lighthouse) before its API reference, or at its end.
  eleventyConfig.addPreprocessor('gb-compat', 'md', (data, content) => {
    if (!/[\\/]3\.0[\\/]components[\\/][\w-]+\.md$/.test(String(data.page?.inputPath ?? ''))) return content;
    const section = '## Compatibility\n\n{% gbcompat %}\n\n';
    return /^## API reference/m.test(content)
      ? content.replace(/^## API reference/m, `${section}## API reference`)
      : `${content.trimEnd()}\n\n${section}`;
  });
  eleventyConfig.addShortcode('gbcompat', function () {
    return require('../gb-compat.cjs').compatSection(this.page.fileSlug);
  });
  eleventyConfig.addShortcode('gbshape', (name, cls = '', to = '', mode = '', delay = 0) =>
    require('../gb-shapes.cjs').shapeSvg(String(name), String(cls), {
      to: String(to),
      loop: mode === 'loop',
      delay: Number(delay) || 0,
    }),
  );
  // Nunjucks wants commas between arguments; the docs write
  // {% demo "label" height=240 %}.
  eleventyConfig.addPreprocessor('gb-demo-args', 'md', (data, content) =>
    content.replace(
      /(\{%-?\s*demo\s+(?:"[^"]*"|'[^']*'))([^%]*)%\}/g,
      (m, head, args) => head + args.replace(/[ \t]+(?=\w+\s*=)/g, ', ') + '%}',
    ),
  );
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
        `<script type="module">import('${lib}site/_dev-gb/${dir}/demo.js');</script>`
      : '';
    // The heights measured at capture (phone and desktop column widths) are
    // reserved (site/src/gb/gb.css), so the code doesn't move when the
    // demo arrives.
    const style = story.height
      ? `--gb-example-height: ${story.height}px; --gb-example-narrow-height: ${story.narrowHeight ?? story.height}px`
      : '';
    return demoCard(`${story.name} example`, live, [{lang: 'html', code: story.html}], {style});
  });

  /**
   * `{% demo "Accessible label" [height=240] [frame=true] %}...{% enddemo %}`: a demo card
   * for html written once, or for fenced `html`, `css` and `ts`/`js` blocks
   * (one each, one tab per file). Without a script the preview is inline
   * (light DOM, the css scoped to it); with one it is an iframe, so the code
   * can use `document` as a reader's page would. `height` (px) is what the
   * preview reserves, so the page below doesn't move when it loads; `frame=true`
   * renders the iframe also without a script (markup that takes over the
   * page, such as an open modal dialog). Demos with heading elements always
   * get the iframe, so their headings stay out of the page's outline.
   */
  eleventyConfig.addPairedShortcode('demo', function (content, label, kwargs) {
    const where = this.page?.inputPath;
    if (!label || typeof label !== 'string') {
      throw new Error(`demo (${where}): needs an accessible label`);
    }
    const height = Number(kwargs?.height) || 0;
    const files = parseDemo(content, where);
    const html = oneBlock(dedent(files.html ?? ''));
    const css = files.css !== undefined ? dedent(files.css) : '';
    const script = files.ts !== undefined ? {lang: 'ts', code: files.ts} : files.js !== undefined ? {lang: 'js', code: files.js} : null;
    const id = demoId(where + '|' + label);
    const lib = process.env.MWC_GB_LIB;
    const files_ = cardFiles(files);
    const style = height ? `--gb-demo-height: ${height}px` : '';
    // Headings in a demo belong to the demo's document, not the docs page's
    // outline and table of contents: render those in a frame too.
    const hasHeading = /<h[1-6][\s>]/i.test(html);
    if (script || kwargs?.frame || hasHeading) {
      const js = script ? scriptJs(script, where) : '';
      const doc = frameDoc({id, html, css, js, lib});
      const srcdoc = escapeHtml(doc).replace(/\n/g, '&#10;');
      const frame =
        `<iframe class="gb-demo-frame" data-id="${id}" data-min="${height || 192}" title="${escapeHtml(label)} preview" ` +
        `loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" srcdoc="${srcdoc}"></iframe>`;
      return demoCard(label, frame, files_, {id, style, frame: true});
    }
    const head = css ? `<style>${scopeCss(css, id + '-preview', lib)}</style>` : '';
    const preview = `<div class="gb-demo-inline" id="${id}-preview">
${html}
</div>`;
    return demoCard(label, preview, files_, {id, style, head});
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
    const tags = new Set(String(html).match(/(?<=<)md-(?:gb|aria)-[a-z0-9-]+/g) ?? []);
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
