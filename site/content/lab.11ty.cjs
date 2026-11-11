/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A test page per /3.0/ component, /3.0/lab/<slug>/: the component's first
 * example (the first {% demo %} of docs/components/<slug>.md) alone in a
 * minimal document, without the docs shell (no header, rail, outline,
 * search or site scripts): the M3 styles, the fonts, and the modules of the
 * md-gb-* tags it uses (from the library server, MWC_GB_LIB, like the demos).
 * Lighthouse audits these pages for the component pages' Compatibility
 * section (scripts/m3/gen-component-compat.mjs), so its scores are the
 * component's, not the documentation's. Out of the sitemap and search.
 */

const {readdirSync, readFileSync} = require('node:fs');
const {join} = require('node:path');
const matter = require('gray-matter');
const {parseDemo, dedent, escapeHtml, loadTagModules} = require('../eleventy/demo.cjs');

const DOCS = join(__dirname, '..', '..', 'docs', 'components');

/** The first example of a component page: its title and demo files. */
function labOf(file) {
  const {data, content} = matter(readFileSync(join(DOCS, file), 'utf8'));
  const m = /\{%-?\s*demo\s+(?:"[^"]*"|'[^']*')[^%]*%\}([\s\S]*?)\{%-?\s*enddemo\s*-?%\}/.exec(content.replace(/\r\n?/g, '\n'));
  const files = m ? parseDemo(m[1], file) : {};
  return {slug: file.slice(0, -3), title: String(data.title ?? file), html: dedent(files.html ?? ''), css: files.css ?? '', js: files.js ?? ''};
}

const labs = readdirSync(DOCS).filter((f) => f.endsWith('.md')).sort().map(labOf);

class GbLab {
  data() {
    return {
      eleventyExcludeFromCollections: true,
      pagination: {data: 'gbLabList', size: 1, alias: 'lab'},
      gbLabList: labs,
      permalink: (data) => `/3.0/lab/${data.lab.slug}/`,
    };
  }

  render({lab}) {
    const lib = process.env.MWC_GB_LIB ?? '';
    const modules = loadTagModules();
    const tags = new Set(lab.html.match(/(?<=<)md-gb-[a-z0-9-]+/g) ?? []);
    const imports = [...tags]
      .map((t) => modules.get(t))
      .filter(Boolean)
      .map((p) => `import '${lib}${p}';`)
      .join('\n');
    const importMap = JSON.stringify({
      imports: {
        '@material/web/': `${lib}`,
        lit: `${lib}node_modules/lit/index.js`,
        'lit/': `${lib}node_modules/lit/`,
      },
    });
    const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1');
    const name = escapeHtml(lab.title);
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${name}: component test page - Material Web 3.0</title>
<meta name="description" content="The ${name} component of Material Web 3.0 on its own, in its first example, for audits.">
<link href="/images/favicon.svg" rel="icon" sizes="any" type="image/svg+xml">
<link rel="stylesheet" href="/fonts/gb/fonts.css">
${lib ? `<link rel="stylesheet" href="${lib}styles/m3.css">` : ''}
<script type="importmap">${importMap}</script>
<style>
body {
  margin: 0;
  padding: 24px;
  background: var(--md-sys-color-surface, Canvas);
  color: var(--md-sys-color-on-surface, CanvasText);
  font: var(--md-sys-typescale-body-lg, 16px/1.5 sans-serif);
}
h1 {
  margin: 0 0 24px;
  font: var(--md-sys-typescale-title-lg, 600 22px/1.3 sans-serif);
}
main > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
${safe(lab.css)}
</style>
</head>
<body>
<main>
<h1>${name}</h1>
<div>
${lab.html}
</div>
</main>
<script type="module">
${imports}
</script>
${lab.js ? `<script type="module">\n${safe(lab.js)}\n</script>` : ''}
</body>
</html>
`;
  }
}

module.exports = GbLab;
