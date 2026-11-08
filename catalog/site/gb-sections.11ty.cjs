/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The index pages of the /3.0/ sections: /3.0/about/, /3.0/foundations/,
 * /3.0/styles/ and /3.0/components/. A large hero (the section's name and
 * intro, with M3 Expressive shapes) and a grid of cards, one per page of the
 * section (styles: catalog/src/gb/sections.css).
 *
 * - Components are grouped like https://m3.material.io/components (the
 *   `category` front matter of docs/3.0/components) and show their hero demo
 *   live but inert; demos that need a script or an iframe, or that don't
 *   read well small, show a shape with the component's icon instead.
 * - The other sections show a shape with the page's `icon` (front matter).
 *
 * The pages carry the tag `gbsection` and `gbIndex: true`: the layout swaps
 * its title block for the hero, and eleventy-helpers/gb-site.cjs adds them to the
 * `gbAll` collection (sitemap, Markdown, llms.txt, search).
 */

const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {COMPONENT_GROUPS, SECTIONS, sectionPages} = require('../eleventy-helpers/gb-site.cjs');
const {parseDemo, dedent, escapeHtml} = require('../eleventy-helpers/shortcodes/gb-demo.cjs');

const ROOT = join(__dirname, '..', '..');

// ---------------------------------------------------------------------------
// Shapes (labs/gb/styles/shape/material-shapes.ts: paths in a 0..1 box).

let shapePaths;
function shapePath(name) {
  if (!shapePaths) {
    const src = readFileSync(join(ROOT, 'labs', 'gb', 'styles', 'shape', 'material-shapes.ts'), 'utf8');
    shapePaths = Object.fromEntries([...src.matchAll(/^\s+(\w+): '([^']+)',?$/gm)].map((m) => [m[1], m[2]]));
  }
  if (!shapePaths[name]) throw new Error(`gb-sections: no shape "${name}"`);
  return shapePaths[name];
}

/** An inline SVG of a Material shape (filled with currentColor). */
const shapeSvg = (name, cls = '') =>
  `<svg class="gb-shape ${cls}" viewBox="0 0 1 1" aria-hidden="true" focusable="false"><path d="${shapePath(name)}"/></svg>`;

// Shapes of the card illustrations, and the container roles they cycle.
const SHAPES = ['cookie9Sided', 'clover4Leaf', 'sunny', 'flower', 'puffy', 'cookie6Sided', 'softBurst', 'pill', 'pentagon', 'cookie12Sided', 'gem', 'burst'];
const TONES = ['primary', 'secondary', 'tertiary'];

// ---------------------------------------------------------------------------
// Components.

/** Material Symbols of the components, for the fallback illustration. */
const COMPONENT_ICONS = {
  'app-bar': 'web_asset', badge: 'counter_1', 'button-group': 'view_column', button: 'smart_button',
  card: 'article', carousel: 'view_carousel', checkbox: 'check_box', chip: 'label',
  'date-picker': 'calendar_month', dialog: 'chat_bubble', divider: 'horizontal_rule',
  'fab-menu': 'menu_open', fab: 'edit', 'icon-button': 'favorite', list: 'list',
  'loading-indicator': 'progress_activity', menu: 'more_vert', 'navigation-bar': 'bottom_navigation',
  'navigation-drawer': 'left_panel_open', 'navigation-rail': 'side_navigation', progress: 'linear_scale',
  'pull-to-refresh': 'refresh', radio: 'radio_button_checked', search: 'search',
  'segmented-button': 'splitscreen', select: 'arrow_drop_down_circle', sheets: 'view_agenda',
  slider: 'tune', snackbar: 'info', 'split-button': 'splitscreen_right', switch: 'toggle_on', tabs: 'tab',
  'text-field': 'text_fields', 'time-picker': 'schedule', toolbar: 'build', tooltip: 'chat_bubble',
};

/**
 * Components whose hero is not previewed live, besides the ones the hero
 * itself rules out (script, iframe, headings): why, for the report.
 */
const ICON_ONLY = new Set([
  'navigation-drawer', // Wide, full-height surface.
  'sheets', // Modal surface.
  'dialog', // Modal surface.
  'tabs', // Wider than the preview: its tabs scroll and clip.
  'time-picker', // A tall dial: only its top half would show.
]);

/** Small components are shown larger than the box's scale (1 = fit 400px). */
const ZOOM = {
  badge: 2.2, button: 1.7, 'button-group': 1.6, checkbox: 1.7, chip: 1.2, 'date-picker': 1.4, fab: 2,
  'fab-menu': 1.8, 'icon-button': 1.1, 'loading-indicator': 3, menu: 1.9, progress: 1.6, radio: 1.7,
  select: 1.4, 'segmented-button': 1.2, slider: 1.2, 'split-button': 2, switch: 1.9, 'text-field': 1.4,
  toolbar: 1.5, tooltip: 2.4,
};

/** Attributes that point at other elements of the page: dropped from previews. */
const REFERENCES = /\s(?:id|for|popovertarget|popovertargetaction|autofocus|anchor|aria-controls|aria-labelledby|aria-describedby|aria-owns|tabpanel)=(?:"[^"]*"|'[^']*')/g;

/** The hero demo of a component page, or why it has none: {html} | {fallback}. */
function heroOf(inputPath) {
  const src = readFileSync(inputPath, 'utf8').replace(/\r\n?/g, '\n');
  const m = /\{%-?\s*demo\s+(?:"[^"]*"|'[^']*')([^%]*)%\}([\s\S]*?)\{%-?\s*enddemo\s*-?%\}/.exec(src);
  if (!m) return {fallback: 'no demo'};
  const files = parseDemo(m[2], inputPath);
  if (files.ts !== undefined || files.js !== undefined) return {fallback: 'script'};
  if (files.css !== undefined) return {fallback: 'css'};
  if (/frame\s*=\s*true/.test(m[1])) return {fallback: 'iframe'};
  const html = dedent(files.html ?? '');
  if (/<h[1-6][\s>]/i.test(html)) return {fallback: 'headings (iframe)'};
  return {html: html.replace(REFERENCES, '')};
}

/** The icon illustration: a shape in a container role with the icon on it. */
function illustration(index, icon) {
  const tone = TONES[index % TONES.length];
  return (
    `<div class="gb-card-media gb-card-art" data-tone="${tone}" aria-hidden="true">` +
    shapeSvg(SHAPES[index % SHAPES.length], 'gb-card-shape') +
    `<md-gb-icon class="gb-card-icon">${escapeHtml(icon)}</md-gb-icon>` +
    '</div>'
  );
}

/** A card: media (decorative: the title is the link), title, description.
    The title's id puts the card in the page outline. */
function card({url, title, text, media, deprecated, level = 3}) {
  const chip = deprecated ? `<span class="gb-card-chip">${escapeHtml(deprecated)}</span>` : '';
  const id = `gb-card-${url.split('/').filter(Boolean).pop()}`;
  return (
    `<li class="gb-card">${media}` +
    `<h${level} id="${id}" class="gb-card-title"><a class="gb-card-link" href="${url}">${escapeHtml(title)}</a>${chip}</h${level}>` +
    `<p class="gb-card-desc">${escapeHtml(text)}</p></li>`
  );
}

/** The live, inert preview of a component's hero. */
const preview = (html, zoom = 1) =>
  `<div class="gb-card-media gb-card-preview" aria-hidden="true" inert${zoom === 1 ? '' : ` style="--gb-z: ${zoom}"`}><div class="gb-card-stage">${html}</div></div>`;

// ---------------------------------------------------------------------------
// Page.

function hero(section, count) {
  // Shapes behind the headline: M3 Expressive shapes in the container roles.
  const decor = [
    ['cookie9Sided', 'primary', 'a'],
    ['clover4Leaf', 'tertiary', 'b'],
    ['sunny', 'secondary', 'c'],
    ['pill', 'primary', 'd'],
  ]
    .map(([shape, tone, pos]) => `<span class="gb-hero-shape" data-tone="${tone}" data-pos="${pos}">${shapeSvg(shape)}</span>`)
    .join('');
  return (
    `<header class="gb-hero"><div class="gb-hero-art" aria-hidden="true">${decor}</div>` +
    `<div class="gb-hero-text"><p class="gb-hero-eyebrow">Material Web 3.0</p>` +
    `<h1>${escapeHtml(section.label)}</h1>` +
    `<p class="gb-hero-intro">${escapeHtml(section.intro)}</p>` +
    `<p class="gb-hero-meta">${count} pages &middot; <a href="/3.0/${section.id}.md" type="text/markdown">View as Markdown</a></p></div></header>`
  );
}

class GbSections {
  data() {
    return {
      layout: 'gb/default.html',
      tags: ['gbsection'],
      gbIndex: true,
      order: 0,
      pagination: {data: 'gbSectionList', size: 1, alias: 'gbsec', addAllPagesToCollections: true},
      gbSectionList: SECTIONS,
      permalink: (data) => `/3.0/${data.gbsec.id}/`,
      eleventyComputed: {
        section: (data) => data.gbsec.id,
        title: (data) => data.gbsec.label,
        description: (data) => data.gbsec.description,
      },
    };
  }

  render(data) {
    const section = data.gbsec;
    // Source paths of the copied pages (docs/3.0 -> site/3.0), by url.
    const inputs = new Map((data.collections?.gb3 ?? []).map((p) => [p.url, String(p.inputPath)]));
    const pages = sectionPages(section.id);
    let n = 0;
    const list = (items, build) => `<ul class="gb-cards" role="list">${items.map(build).join('')}</ul>`;

    let body;
    if (section.id === 'components') {
      body = COMPONENT_GROUPS.map((group) => {
        const items = pages.filter((p) => p.category === group.id);
        if (!items.length) return '';
        return (
          `<section class="gb-group" aria-labelledby="gb-group-${group.id}">` +
          `<h2 id="gb-group-${group.id}" class="gb-group-title">${escapeHtml(group.label)}</h2>` +
          list(items, (p) => {
            const index = n++;
            const hero_ = ICON_ONLY.has(p.slug) ? {fallback: 'icon only'} : heroOf(inputs.get(p.url));
            const media = hero_.html ? preview(hero_.html, ZOOM[p.slug]) : illustration(index, COMPONENT_ICONS[p.slug] ?? 'widgets');
            return card({
              url: p.url,
              title: p.title,
              text: p.summary || p.description,
              media,
              deprecated: p.slug === 'segmented-button' ? 'Not recommended' : '',
            });
          }) +
          '</section>'
        );
      }).join('');
    } else {
      const icons = pages.map((p) => matterIcon(inputs.get(p.url)));
      body = list(pages, (p, i) =>
        // No groups: the cards' titles are the h2 of the page.
        card({url: p.url, title: p.title, text: p.description, media: illustration(i, icons[i] || 'article'), level: 2}),
      );
      body = `<section class="gb-group" aria-label="${escapeHtml(section.label)} pages">${body}</section>`;
    }
    return `<div class="gb-section" data-section="${section.id}">${hero(section, pages.length)}${body}</div>`;
  }
}

const matter = require('gray-matter');
/** The `icon` front matter of a page. */
const matterIcon = (inputPath) => String(matter(readFileSync(inputPath, 'utf8')).data.icon ?? '');

module.exports = GbSections;
module.exports.heroOf = heroOf;
