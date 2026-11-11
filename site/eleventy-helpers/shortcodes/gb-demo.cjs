/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Building blocks of the demo cards of the /3.0/ docs (shortcodes/gb.cjs):
 * the card markup with one tab per file, the parser of `{% demo %}` content,
 * the CSS scoping of inline previews and the document of the iframe previews
 * of demos with a script.
 */

const {existsSync, readdirSync} = require('node:fs');
const {createHash} = require('node:crypto');
const {join} = require('node:path');

const ROOT = join(__dirname, '..', '..', '..');

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let prism;
const PRISM_LANGS = {html: 'html', css: 'css', ts: 'typescript', js: 'javascript'};
/** Highlights code like the fenced blocks (eleventy-plugin-syntaxhighlight). */
function highlight(code, lang = 'html') {
  if (!prism) {
    prism = {
      Prism: require('prismjs'),
      loader: require('@11ty/eleventy-plugin-syntaxhighlight/src/PrismLoader'),
    };
  }
  const {Prism, loader} = prism;
  const name = PRISM_LANGS[lang] ?? lang;
  const grammar = loader(name, {});
  return grammar ? Prism.highlight(code, grammar, name) : escapeHtml(code);
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

/** No blank lines in the output (they end the raw HTML block in Markdown). */
const oneBlock = (text) =>
  text
    .split('\n')
    .filter((l) => l.trim())
    .join('\n');

let tagModules;
/** md-gb-* tag name -> module path under the repo (labs/gb). */
function loadTagModules() {
  if (!tagModules) {
    tagModules = new Map();
    const scan = (dir, base) => {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir, {withFileTypes: true})) {
        if (entry.isDirectory()) scan(join(dir, entry.name), `${base}/${entry.name}`);
        else if (/^md-(gb|aria)-[a-z0-9-]+\.js$/.test(entry.name)) {
          tagModules.set(entry.name.slice(0, -3), `${base}/${entry.name}`);
        }
      }
    };
    scan(join(ROOT, 'material-design-expressive', 'components'), 'components');
    scan(join(ROOT, 'material-design-expressive', 'extras'), 'extras');
    scan(join(ROOT, 'material-design-expressive', 'styles'), 'styles');
    // The ARIA elements the gb ones pair with (md-aria-tabpanel for tabs).
    scan(join(ROOT, 'material-design-expressive', 'foundations', 'accessibility', 'aria'), 'foundations/accessibility/aria');
  }
  return tagModules;
}

/** Code up to this many lines is not collapsed (no "View code" button). */
const SHORT_CODE_LINES = 4;

/** Name of a file in the tabs, per language. */
const FILE_LABELS = {html: 'HTML', css: 'CSS', ts: 'TS', js: 'JS'};

const usedIds = new Set();
/** Forgets the ids of the last build (the ids stay stable across rebuilds). */
const resetDemoIds = () => usedIds.clear();
/** An id for a demo, unique in the build. */
function demoId(seed) {
  const h = (s) => createHash('sha1').update(s).digest('hex').slice(0, 6);
  let id = 'gbd-' + h(seed);
  for (let n = 2; usedIds.has(id); n++) id = 'gbd-' + h(seed + n);
  usedIds.add(id);
  return id;
}

/**
 * The demo card: the library's md-gb-demo (material-design-expressive/
 * extras/demo) with the preview in its default slot and one md-gb-demo-code
 * per file (it highlights the code itself, and shows a tab per file, copy,
 * and Show code for long code). The code is an attribute with its line
 * breaks as entities, so the output has no blank lines.
 *
 * @param label Accessible label.
 * @param preview Markup of the preview (inline, or the iframe).
 * @param files The code: [{lang, code}], in tab order.
 * @param options `id` of the card, `style` with the height the preview
 *     reserves (`--gb-demo-height` / `--gb-example-height`, px), `head`
 *     markup before the preview (the scoped style).
 */
function demoCard(label, preview, files, {id = '', style = '', head = ''} = {}) {
  const height = /--gb-(?:demo|example)-height:\s*(\d+)px/.exec(style)?.[1];
  const codes = files
    .map((f) => {
      const code = escapeHtml(dedent(f.code)).replace(/\n/g, '&#10;');
      return `<md-gb-demo-code slot="code" language="${f.lang}" label="${FILE_LABELS[f.lang]}" code="${code}"></md-gb-demo-code>`;
    })
    .join('');
  return (
    '\n\n<md-gb-demo label="' + escapeHtml(label) + '"' +
    (id ? ' id="' + id + '"' : '') +
    (height ? ' preview-height="' + height + '"' : '') + '>\n' +
    (head ? head + '\n' : '') +
    preview +
    '\n' + codes + '</md-gb-demo>\n\n'
  );
}

/** Splits the content of {% demo %} into its html, css and ts or js. */
function parseDemo(content, where) {
  const files = {};
  // Pages may have CRLF line endings; the fence pattern expects \n.
  const rest = content.replace(/\r\n?/g, '\n').replace(
    /^[ \t]*```(html|css|ts|js)[ \t]*\n([\s\S]*?)^[ \t]*```[ \t]*$/gm,
    (m, lang, code) => {
      if (files[lang] !== undefined) throw new Error(`demo (${where}): two ${lang} blocks`);
      files[lang] = code;
      return '';
    },
  );
  if (files.ts !== undefined && files.js !== undefined) {
    throw new Error(`demo (${where}): use a ts or a js block, not both`);
  }
  if (rest.trim()) {
    if (files.html !== undefined) throw new Error(`demo (${where}): html both fenced and unfenced`);
    files.html = rest;
  }
  return files;
}

/** The files of a parsed demo as card files, in tab order. */
function cardFiles(files) {
  return ['html', 'css', 'ts', 'js']
    .filter((lang) => files[lang] !== undefined && files[lang].trim())
    .map((lang) => ({lang, code: files[lang]}));
}

/** `@material/web/x` in a CSS import -> the library server. */
function libUrl(url, lib) {
  return lib ? url.replace(/^@material\/web\/labs\/gb\//, lib + '') : url;
}

/**
 * Scopes a demo's CSS to its preview (native @scope): :root, html and body
 * select the preview itself; @import rules are hoisted (global) with package
 * paths pointing at the library server.
 */
function scopeCss(css, id, lib) {
  const imports = [];
  const body = css
    .replace(/@import\s+(?:url\(\s*)?(['"])([^'"]+)\1\s*\)?[^;]*;/g, (m, q, url) => {
      imports.push(`@import '${libUrl(url, lib)}';`);
      return '';
    })
    .replace(/(^|[\s,{}>+~(])(:root|html|body)(?![\w-])/g, '$1:scope');
  return oneBlock(imports.join('\n') + `\n@scope (#${id}) {\n${body}\n}`);
}

/** Strips the types of TypeScript (nothing else is transformed); JS as is. */
function scriptJs(file, where) {
  const code = dedent(file.code);
  if (file.lang === 'js') return code;
  try {
    return require('esbuild').transformSync(code, {loader: 'ts', target: 'esnext'}).code;
  } catch (e) {
    throw new Error(`demo (${where}): TypeScript did not parse: ${e.message}`);
  }
}

const FRAME_CSS = `
:root { color-scheme: light dark; }
html:not([data-themed]) body { visibility: hidden; }
body { margin: 0; box-sizing: border-box; min-block-size: 100vh; padding: 24px; display: grid; place-items: center;
  background: var(--md-sys-color-surface-container-lowest, canvas); color: var(--md-sys-color-on-surface, canvastext);
  font: 400 1rem/1.5 'Roboto Flex', Roboto, system-ui, sans-serif; }
#root { box-sizing: border-box; inline-size: 100%; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; }
#gb-error { margin: 12px 0 0; font-size: .75rem; line-height: 1.4; color: var(--md-sys-color-error, red); font-family: ui-monospace, Menlo, Consolas, monospace; white-space: pre-wrap; }
`;

const FRAME_BOOT = `(() => {
  const id = '__ID__';
  const html = document.documentElement;
  const ro = new ResizeObserver(() => post());
  const error = (text) => {
    let el = document.getElementById('gb-error');
    if (!el) {
      el = document.createElement('p');
      el.id = 'gb-error';
      el.setAttribute('role', 'alert');
      document.body.append(el);
      ro.observe(el);
    }
    el.textContent += (el.textContent ? '\\n' : '') + text;
  };
  addEventListener('error', (e) => error(e.message || 'Script error'));
  addEventListener('unhandledrejection', (e) => error('Unhandled rejection: ' + (e.reason?.message ?? e.reason)));
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t !== window && (t.src || t.href)) error('Could not load ' + (t.src || t.href));
  }, true);
  function post() {
    const root = document.getElementById('root');
    const err = document.getElementById('gb-error');
    const h = Math.ceil(root.getBoundingClientRect().height + (err ? err.getBoundingClientRect().height + 12 : 0)) + 48;
    // md-gb-demo sizes its iframe to this (material-design-expressive/extras/demo).
    parent.postMessage({type: 'md-gb-demo-height', id, height: h}, '*');
  }
  ro.observe(document.getElementById('root'));
  let sheet;
  addEventListener('message', (e) => {
    if (e.source !== parent || e.data?.type !== 'gb-demo-theme') return;
    if (!sheet) {
      sheet = document.createElement('style');
      // Before the demo's own CSS, in the layer of the baseline tokens, so a
      // theme the script applies still wins.
      document.getElementById('gb-demo-css').before(sheet);
    }
    sheet.textContent = e.data.css ? '@layer md.sys.color{' + e.data.css + '}' : '';
    html.style.colorScheme = e.data.colorScheme || 'light dark';
    html.dataset.themed = '';
  });
  parent.postMessage({type: 'gb-demo-ready', id}, '*');
  setTimeout(() => { html.dataset.themed = ''; post(); }, 1500);
})();`;

/**
 * The document of a demo with a script (iframe srcdoc): the m3 styles, the
 * page's theme (posted by src/spec/shell.ts), the html and css, an import map for
 * `@material/web/`, the md-gb elements the html uses, the script as a
 * module, a height report and a visible error text.
 */
function frameDoc({id, html, css, js, lib}) {
  const modules = loadTagModules();
  const tags = new Set(html.match(/(?<=<)md-(?:gb|aria)-[a-z0-9-]+/g) ?? []);
  const imports = lib
    ? [...tags]
        .map((t) => modules.get(t))
        .filter(Boolean)
        .map((p) => `import '${lib}${p}';`)
        .join('')
    : '';
  const safe = (s) => s.replace(/<\/(script|style)/gi, '<\\/$1');
  const importMap = lib
    ? `<script type="importmap">${JSON.stringify({
        imports: {
          '@material/web/': lib + '',
          // The library server resolves Lit's own bare imports (nodeResolve).
          'lit': lib + 'node_modules/lit/index.js',
          'lit/': lib + 'node_modules/lit/',
        },
      })}</script>`
    : '';
  const cssWithImports = css.replace(
    /@import\s+(?:url\(\s*)?(['"])([^'"]+)\1/g,
    (m, q, url) => `@import ${q}${libUrl(url, lib)}${q}`,
  );
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    // The site's self-hosted fonts (scripts/gb-fonts.mjs); a srcdoc frame
    // resolves the path against the page, so it shares the page's cache.
    '<link rel="stylesheet" href="/fonts/gb/fonts.css">' +
    (lib ? `<link rel="stylesheet" href="${lib}styles/m3.css">` : '') +
    importMap +
    '<style>' + FRAME_CSS + '</style>' +
    '<style id="gb-demo-css">' + safe(cssWithImports) + '</style>' +
    '</head><body><div id="root">' + html + '</div>' +
    '<script>' + FRAME_BOOT.replace('__ID__', id) + '</script>' +
    (imports ? '<script type="module">' + imports + '</script>' : '') +
    (js ? '<script type="module">' + safe(js) + '</script>' : '') +
    '</body></html>'
  );
}

module.exports = {
  cardFiles,
  demoCard,
  demoId,
  dedent,
  escapeHtml,
  frameDoc,
  highlight,
  loadTagModules,
  oneBlock,
  parseDemo,
  resetDemoIds,
  scopeCss,
  scriptJs,
};
