/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Site-level pieces of the /3.0/ docs shared by the Eleventy templates
 * (site/content/*.11ty.cjs), the shell spec, the head shortcode of the
 * layout and the Open Graph image step of site/scripts/dev.mjs:
 *
 * - the site URL (one value: site/content/_data/gbSite.cjs, env MWC_SITE_URL),
 * - the sections and the Components page's groups (docs/<section>/README.md),
 * - `pageMarkdown(item)`: a page as clean, self-contained Markdown (the
 *   `<page>.md` files and llms-full.txt),
 * - the metadata of a page (Open Graph, Twitter, JSON-LD, theme colors),
 * - the `gbAll` collection (every /3.0/ page, the start page included).
 */

const {execFileSync} = require('node:child_process');
const {existsSync, readdirSync, readFileSync, statSync} = require('node:fs');
const {join, resolve} = require('node:path');
const {pathToFileURL} = require('node:url');
const matter = require('gray-matter');

const ROOT = join(__dirname, '..', '..');
const SITE = require('../content/_data/gbSite.cjs');

/**
 * The sections, from docs/<id>/README.md: `label` (its title), `icon` (the
 * rail's), `description` (the meta description of the section's index
 * page, /3.0/<id>/), `intro` (its paragraph under the headline, the
 * README's text) and `groups` (the Components page's). In `order`.
 */
const SECTIONS = readdirSync(join(ROOT, 'docs'), {withFileTypes: true})
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, 'docs', d.name, 'README.md')))
  .map((d) => {
    const {data, content} = matter(readFileSync(join(ROOT, 'docs', d.name, 'README.md'), 'utf8'));
    return {
      id: d.name,
      label: String(data.title),
      icon: String(data.icon ?? 'article'),
      order: data.order ?? 0,
      description: String(data.description ?? '').trim(),
      intro: content.replace(/\s+/g, ' ').trim(),
      groups: data.groups ?? [],
    };
  })
  .sort((a, b) => a.order - b.order);
const sectionLabel = (id) => SECTIONS.find((s) => s.id === id)?.label ?? id;

/** The groups of the Components page (docs/components/README.md). */
const COMPONENT_GROUPS = SECTIONS.find((s) => s.id === 'components')?.groups ?? [];

/**
 * The pages of a section from docs/3.0, in order: [{url, title, description,
 * summary, category, order}]. Independent of Eleventy's collections.
 */
function sectionPages(section) {
  const dir = join(ROOT, 'docs', section);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => {
      const {data} = matter(readFileSync(join(dir, f), 'utf8'));
      return {
        slug: f.slice(0, -3),
        url: `/3.0/${section}/${f.slice(0, -3)}/`,
        title: String(data.title ?? f.slice(0, -3)),
        description: String(data.description ?? '').replace(/\s+/g, ' ').trim(),
        summary: data.summary ? String(data.summary) : '',
        category: data.category,
        order: data.order ?? 0,
      };
    })
    .sort((a, b) => a.order - b.order);
}

/** Markdown of a section's index page: its intro and a list of its pages. */
function sectionIndexMarkdown(section) {
  const s = SECTIONS.find((x) => x.id === section);
  const line = (p) => `- [${p.title}](${p.url})${p.description ? ': ' + p.description : ''}`;
  const pages = sectionPages(section);
  const out = [`# ${s.label}`, '', s.description, '', s.intro];
  if (section === 'components') {
    for (const g of COMPONENT_GROUPS) {
      const list = pages.filter((p) => p.category === g.id);
      if (list.length) out.push('', `## ${g.label}`, '', ...list.map(line));
    }
  } else {
    out.push('', ...pages.map(line));
  }
  return out.join('\n') + '\n';
}

/** Absolute URL of a site path. */
const absolute = (path) => SITE.url + path;

/** URL of the Markdown version of a page: /3.0/styles/motion/ -> /3.0/styles/motion.md */
const mdUrl = (url) => (url === '/3.0/' ? '/3.0/index.md' : url.replace(/\/$/, '') + '.md');

/** Name of a page's Open Graph image (/3.0/og/<name>.png). */
function ogName(url, section) {
  if (url === '/3.0/') return 'about-intro';
  if (url === `/3.0/${section}/`) return `${section}-index`;
  return `${section}-${url.replace(/\/$/, '').split('/').pop()}`;
}
const ogUrl = (url, section) => `/3.0/og/${ogName(url, section)}.png`;

// ---------------------------------------------------------------------------
// Baseline colors (styles/m3.css), for the manifest and theme-color.

let colors;
/** {light, dark}: {surface, primary, ...} of the baseline md-sys-color tokens. */
function baselineColors() {
  if (colors) return colors;
  const css = readFileSync(join(ROOT, 'material-design-expressive', 'styles', 'm3.css'), 'utf8');
  const darkAt = css.indexOf('prefers-color-scheme: dark');
  const pick = (text, name, fallback) =>
    new RegExp(`--md-sys-color-${name}:\\s*(#[0-9a-fA-F]{3,8})`).exec(text)?.[1] ?? fallback;
  const read = (text, fallback) => ({
    surface: pick(text, 'surface', fallback.surface),
    onSurface: pick(text, 'on-surface', fallback.onSurface),
    primary: pick(text, 'primary', fallback.primary),
    primaryContainer: pick(text, 'primary-container', fallback.primaryContainer),
    secondaryContainer: pick(text, 'secondary-container', fallback.secondaryContainer),
    tertiaryContainer: pick(text, 'tertiary-container', fallback.tertiaryContainer),
    onSurfaceVariant: pick(text, 'on-surface-variant', fallback.onSurfaceVariant),
  });
  const light = read(darkAt < 0 ? css : css.slice(0, darkAt), {
    surface: '#fef7ff', onSurface: '#1d1b20', primary: '#6750a4', primaryContainer: '#eaddff',
    secondaryContainer: '#e8def8', tertiaryContainer: '#ffd8e4', onSurfaceVariant: '#49454f',
  });
  const dark = read(darkAt < 0 ? css : css.slice(darkAt), {
    surface: '#141218', onSurface: '#e6e0e9', primary: '#d0bcff', primaryContainer: '#4f378b',
    secondaryContainer: '#4a4458', tertiaryContainer: '#633b48', onSurfaceVariant: '#cac4d0',
  });
  colors = {light, dark};
  return colors;
}

// ---------------------------------------------------------------------------
// Pages.

/** The docs/3.0 source of a copied page (site/3.0/...), for git dates. */
function sourceOf(item) {
  // A section index page is generated by its template.
  if (item.data?.gbIndex) return resolve(String(item.inputPath));
  const inputPath = resolve(String(item.inputPath));
  const rel = inputPath.replace(/\\/g, '/').replace(/^.*\/site\/3\.0\//, '');
  // /3.0/ is docs/index.md (the home page), else a copy of the intro.
  const home = rel === 'index.md' && !existsSync(join(ROOT, 'docs', 'index.md'));
  return join(ROOT, 'docs', home ? 'about/intro.md' : rel);
}

const dates = new Map();
/** Last modification of a page: its last git commit, else the file's mtime (ISO). */
function pageDate(item) {
  const source = sourceOf(item);
  if (dates.has(source)) return dates.get(source);
  let iso;
  try {
    iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', source], {cwd: ROOT, encoding: 'utf8'}).trim();
  } catch {}
  if (!iso) {
    try {
      iso = statSync(source).mtime.toISOString();
    } catch {
      iso = new Date().toISOString();
    }
  }
  dates.set(source, iso);
  return iso;
}

/** Pages in navigation order. */
function sorted(items) {
  const rank = (i) => SECTIONS.findIndex((s) => s.id === i.data.section);
  return items.slice().sort((a, b) => rank(a) - rank(b) || (a.data.order ?? 0) - (b.data.order ?? 0));
}

// ---------------------------------------------------------------------------
// Markdown.

const FILE_NAMES = {html: 'HTML', css: 'CSS', ts: 'TypeScript', js: 'JavaScript'};

let gbExamples;
function exampleHtml(id) {
  if (!gbExamples) {
    const file = join(__dirname, '..', '_dev-gb', 'examples.json');
    gbExamples = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  }
  const [dir, slug] = String(id).split('/');
  return (gbExamples[dir] ?? []).find((s) => s.slug === slug);
}

const fence = (lang, code) => {
  const ticks = '`'.repeat(Math.max(3, ...[...code.matchAll(/`+/g)].map((m) => m[0].length + 1)));
  return `${ticks}${lang}\n${code}\n${ticks}`;
};

/** The Markdown of a `{% demo %}` block: its code, labelled. */
function demoMarkdown(label, content, where) {
  const {cardFiles, dedent, parseDemo} = require('./demo.cjs');
  const files = cardFiles(parseDemo(content, where));
  const multi = files.length > 1;
  const blocks = files.map((f) => {
    const code = fence(f.lang, dedent(f.code));
    return multi ? `*${FILE_NAMES[f.lang]}*\n\n${code}` : code;
  });
  return `**Example: ${label}**\n\n${blocks.join('\n\n')}`;
}

/** Resolves a relative link of a page to an absolute path of the site. */
function absolutize(target, pageUrl) {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(target)) return target;
  try {
    const u = new URL(target, 'http://x' + pageUrl);
    return u.pathname + u.search + u.hash;
  } catch {
    return target;
  }
}

/** Makes the links and images outside code fences absolute paths. */
function fixLinks(markdown, pageUrl) {
  let inFence = null;
  return markdown
    .split('\n')
    .map((line) => {
      const m = /^\s*(`{3,}|~{3,})/.exec(line);
      if (m) {
        if (!inFence) inFence = m[1];
        else if (m[1][0] === inFence[0] && m[1].length >= inFence.length) inFence = null;
        return line;
      }
      if (inFence) return line;
      return line.replace(/(\]\()(\s*<?)([^)\s>]+)/g, (all, open, pad, target) => open + pad + absolutize(target, pageUrl));
    })
    .join('\n');
}

/** Replaces matches of `pattern` with the (async) result of `fn`. */
async function replaceAsync(text, pattern, fn) {
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    parts.push(text.slice(last, m.index), await fn(...m));
    last = m.index + m[0].length;
  }
  return parts.join('') + text.slice(last);
}

const quoted = `(?:"([^"]*)"|'([^']*)')`;

/**
 * A page as Markdown: `# Title`, the description, then the page with the
 * shortcodes replaced by their content (demo code, example markup, API
 * tables) and root-relative links.
 *
 * @param item An Eleventy collection item (inputPath, url, data).
 */
async function pageMarkdown(item) {
  if (item.data?.gbIndex) return sectionIndexMarkdown(item.data.section);
  const where = String(item.inputPath);
  const {content, data} = matter(readFileSync(resolve(where), 'utf8'));
  const title = item.data.title ?? data.title;
  const description = item.data.description ?? data.description;
  let body = content.replace(/\r\n?/g, '\n');

  body = body.replace(
    new RegExp(`\\{%-?\\s*demo\\s+${quoted}[^%]*%\\}([\\s\\S]*?)\\{%-?\\s*enddemo\\s*-?%\\}`, 'g'),
    (m, a, b, inner) => demoMarkdown(a ?? b, inner, where),
  );
  body = body.replace(new RegExp(`\\{%-?\\s*gbexample\\s+${quoted}\\s*-?%\\}`, 'g'), (m, a, b) => {
    const story = exampleHtml(a ?? b);
    if (!story) throw new Error(`gbexample "${a ?? b}" (${where}): no captured example`);
    return `**Example: ${story.name}**\n\n${fence('html', story.html)}`;
  });
  body = await replaceAsync(body, new RegExp(`\\{%-?\\s*gbapi\\s+${quoted}\\s*-?%\\}`, 'g'), async (m, a, b) => {
    const {gbApiMarkdown} = await import(pathToFileURL(join(ROOT, 'scripts', 'm3', 'gen-api-docs.mjs')).href);
    const api = gbApiMarkdown(a ?? b);
    if (!api) throw new Error(`gbapi "${a ?? b}" (${where}): no md-gb elements in that directory`);
    return `\n${api.trim()}\n`;
  });
  body = body.replace(/\{%-?[\s\S]*?-?%\}/g, '');
  if (/\{%|\{\{/.test(body.replace(/```[\s\S]*?```/g, ''))) {
    throw new Error(`${where}: Nunjucks left in the Markdown`);
  }
  body = fixLinks(body, item.url).replace(/\n{3,}/g, '\n\n').trim();
  return `# ${title}\n\n${description ? description + '\n\n' : ''}${body}\n`;
}

// ---------------------------------------------------------------------------
// Head metadata.

/** JSON for a <script type="application/ld+json">: no way to close the script. */
const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/[\u2028\u2029]/g, (c) => '\\u' + c.charCodeAt(0).toString(16));

const attr = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** The <head> metadata of a page. */
function headMarkup({title, description, section, url, item}) {
  const pageTitle = `${title} - ${SITE.name}`;
  const pageUrl = absolute(url);
  const image = absolute(ogUrl(url, section));
  const c = baselineColors();
  const date = item ? pageDate(item) : undefined;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': absolute('/3.0/#website'),
      name: SITE.name,
      url: absolute('/3.0/'),
      inLanguage: 'en',
      description: SITE.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: {'@type': 'EntryPoint', urlTemplate: absolute('/3.0/?q={search_term_string}')},
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': url === `/3.0/${section}/` ? 'CollectionPage' : 'TechArticle',
      '@id': pageUrl + '#article',
      headline: title,
      description: description || undefined,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      image,
      inLanguage: 'en',
      articleSection: sectionLabel(section),
      ...(date ? {dateModified: date} : {}),
      isPartOf: {'@id': absolute('/3.0/#website')},
      publisher: {'@type': 'Organization', name: 'Material Web', url: SITE.url},
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: SITE.name, item: absolute('/3.0/')},
        {'@type': 'ListItem', position: 2, name: sectionLabel(section), item: absolute(`/3.0/${section}/`)},
        // A section's index page is the section: no third item.
        ...(url === `/3.0/${section}/` ? [] : [{'@type': 'ListItem', position: 3, name: title, item: pageUrl}]),
      ],
    },
  ];
  return [
    `<link rel="canonical" href="${attr(pageUrl)}" />`,
    `<link rel="alternate" type="text/markdown" href="${attr(mdUrl(url))}" title="${attr(title)} as Markdown" />`,
    `<link rel="alternate" type="text/plain" href="/3.0/llms.txt" title="llms.txt" />`,
    `<link rel="manifest" href="/3.0/manifest.webmanifest" />`,
    `<link rel="apple-touch-icon" href="/3.0/icons/icon-192.png" />`,
    `<meta name="theme-color" content="${c.light.surface}" media="(prefers-color-scheme: light)" />`,
    `<meta name="theme-color" content="${c.dark.surface}" media="(prefers-color-scheme: dark)" />`,
    `<meta property="og:site_name" content="${attr(SITE.name)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${attr(pageTitle)}" />`,
    description ? `<meta property="og:description" content="${attr(description)}" />` : '',
    `<meta property="og:url" content="${attr(pageUrl)}" />`,
    `<meta property="og:image" content="${attr(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${attr(pageTitle)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(pageTitle)}" />`,
    description ? `<meta name="twitter:description" content="${attr(description)}" />` : '',
    `<meta name="twitter:image" content="${attr(image)}" />`,
    `<script type="application/ld+json">${safeJson({'@context': 'https://schema.org', '@graph': graph})}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

/** Eleventy: the `gbAll` collection and the `gbhead` shortcode. */
function gbSite(eleventyConfig) {
  // Every /3.0/ page in navigation order: gb3 plus the start page (/3.0/).
  eleventyConfig.addCollection('gbAll', (api) => {
    // The start page (/3.0/) is the intro page's copy, excluded from
    // collections: add it as a second item of the intro page.
    // The section index pages (order 0) come before the pages of their section.
    const pages = [...api.getFilteredByTag('gb3'), ...api.getFilteredByTag('gbsection')];
    const intro = pages.find((p) => p.url === '/3.0/about/intro/');
    return [...sorted(pages), ...(intro ? [{url: '/3.0/', inputPath: intro.inputPath, data: intro.data}] : [])];
  });
  // {% gbhead title, description, section, page.url %}
  eleventyConfig.addShortcode('gbhead', function (title, description, section, url) {
    return headMarkup({title, description, section, url, item: {inputPath: this.page?.inputPath}});
  });
}

module.exports = {
  COMPONENT_GROUPS,
  SECTIONS,
  sectionPages,
  sectionIndexMarkdown,
  SITE,
  absolute,
  baselineColors,
  gbSite,
  mdUrl,
  ogName,
  ogUrl,
  pageDate,
  pageMarkdown,
  sectionLabel,
  sorted,
};
