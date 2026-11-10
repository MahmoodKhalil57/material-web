/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Compatibility section of a /3.0/ component page (`{% gbcompat %}`,
 * added before the API reference of every component page by
 * shortcodes/gb.cjs): four rows, each a disclosure with a status, from
 * site/content/_data/gbCompat.json (scripts/m3/gen-component-compat.mjs):
 *
 * - Material Design 3: the spec units tested and the tokens that match.
 * - Baseline: widely available, the browser targets, and the newer features
 *   used as progressive enhancements.
 * - WAI-ARIA: the roles, their APG patterns, the axe and ARIA 1.3 results.
 * - Lighthouse: the category scores and failed audits of the component's
 *   test page (/3.0/lab/<slug>/: its first example alone), not this page.
 *
 * Styles: site/src/gb/compat.css.
 */

const {existsSync, readFileSync, statSync} = require('node:fs');
const {join} = require('node:path');

const DATA = join(__dirname, '..', 'content', '_data', 'gbCompat.json');
const SVG = join(__dirname, '..', 'src', 'svg');
const {shapeSvg} = require('./gb-shapes.cjs');

/**
 * A logo of site/src/svg (a Lit `html` template of an <svg>) as markup:
 * the template's text, without its comments, decorative.
 */
const logos = new Map();
function logo(file) {
  if (!logos.has(file)) {
    const src = readFileSync(join(SVG, `${file}.ts`), 'utf8');
    const svg = (/html`\s*([\s\S]*?)`;/.exec(src)?.[1] ?? '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<svg\b/, '<svg class="gb-compat-logo-svg" aria-hidden="true" focusable="false"');
    logos.set(file, svg);
  }
  return logos.get(file);
}

/** Each row's logo, on an M3 Expressive shape of its own. */
const ROW_ART = {
  m3: {logo: 'material-design-logo', shape: 'cookie9Sided'},
  baseline: {logo: 'logos-baseline', shape: 'clover4Leaf'},
  aria: {logo: 'custom-aria', shape: 'sunny'},
  lighthouse: {logo: 'logos-lighthouse', shape: 'softBurst'},
};
let cache = {mtime: 0, data: null};
function data() {
  if (!existsSync(DATA)) return null;
  const mtime = statSync(DATA).mtimeMs;
  if (cache.mtime !== mtime) cache = {mtime, data: JSON.parse(readFileSync(DATA, 'utf8'))};
  return cache.data;
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
const n = (x) => Number(x).toLocaleString('en-US');
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const link = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}<span class="gb-visually-hidden"> (opens in a new tab)</span></a>`;

const BROWSERS = [
  ['chrome', 'Chrome'],
  ['edge', 'Edge'],
  ['firefox', 'Firefox'],
  ['safari', 'Safari'],
];
const STATUS = {widely: 'Widely available', newly: 'Newly available', limited: 'Limited availability'};

/** One row: a disclosure with its logo on a shape, its name, a status
    badge and a body. */
function row({id, name, state, badge, extra = '', body}) {
  const art = ROW_ART[id];
  return (
    `<details class="gb-compat-row" data-state="${state}">` +
    `<summary class="gb-compat-summary">` +
    `<span class="gb-compat-logo" data-logo="${id}">${shapeSvg(art.shape, 'gb-compat-shape')}${logo(art.logo)}</span>` +
    `<span class="gb-compat-main">` +
    `<span class="gb-compat-name" id="gb-compat-${id}">${esc(name)}</span>` +
    `<span class="gb-compat-badge">${esc(badge)}</span>` +
    (extra ? `<span class="gb-compat-extra">${extra}</span>` : '') +
    `</span>` +
    `<md-gb-icon class="gb-compat-chevron" aria-hidden="true">expand_more</md-gb-icon>` +
    `</summary><div class="gb-compat-body">${body}</div></details>`
  );
}

function m3Row(c) {
  const {m3} = c;
  if (!m3.pages.length) {
    return row({
      id: 'm3', name: 'Material Design 3', state: 'none', badge: 'No spec page',
      body: '<p>Material Design has no page for this component; it follows the general guidance (color, shape, motion, states).</p>',
    });
  }
  const tokens = m3.tokens;
  const matched = tokens ? tokens.match + tokens.derived : 0;
  const ok = m3.uncovered === 0 && (!tokens || tokens.drift === 0);
  const body =
    `<p>${n(m3.tested)} of ${n(m3.buildable)} buildable spec units are tested, ${n(m3.excluded)} are excluded with a written reason` +
    `${m3.tracked ? `, ${n(m3.tracked)} are tracked gaps` : ''} and ${n(m3.uncovered)} are uncovered (the target is 0). ` +
    (tokens
      ? `${n(matched)} of ${n(tokens.decls)} token declarations match the spec (${pct(matched, tokens.decls)}%)` +
        `${tokens.drift ? `, ${n(tokens.drift)} differ on purpose or are being fixed` : ''}` +
        `${tokens.none ? `, and ${n(tokens.none)} have no spec token` : ''}.`
      : '') +
    `</p><p class="gb-compat-links">${m3.pages.map((p) => link(p.url, `${p.name} on m3.material.io`)).join(' ')}` +
    ` <a href="/3.0/about/compliance/">How compliance is measured</a></p>`;
  return row({
    id: 'm3', name: 'Material Design 3', state: ok ? 'ok' : 'warn',
    badge: ok ? 'Spec checked' : `${n(m3.uncovered)} uncovered`,
    extra: tokens ? `<span class="gb-compat-chip">${pct(matched, tokens.decls)}% tokens</span>` : '',
    body,
  });
}

function baselineRow(c, targets) {
  const {enhancements, js} = c.baseline;
  const unguarded = enhancements.filter((e) => e.how === 'unguarded');
  const ok = !unguarded.length;
  const browsers = BROWSERS.map(
    ([key, label]) => `<span class="gb-compat-chip">${label} ${esc(targets[key] ?? '')}<md-gb-icon aria-hidden="true">check</md-gb-icon></span>`,
  ).join('');
  const items = [
    ...enhancements.map(
      (e) =>
        `<li>${link(`https://webstatus.dev/features/${e.id}`, e.name)} <span class="gb-compat-tag" data-status="${e.status}">${STATUS[e.status]}</span> ` +
        `${e.how === 'guarded' ? 'used inside an <code>@supports</code> guard' : e.how === 'allowed' ? 'degrades safely where it is missing' : '<strong>unguarded</strong>'}</li>`,
    ),
    ...js.map(
      (a) =>
        `<li>${link(`https://webstatus.dev/features/${a.id}`, a.name)} <span class="gb-compat-tag" data-status="${a.status}">${STATUS[a.status]}</span> JavaScript, feature-detected or optional</li>`,
    ),
  ];
  const body =
    `<p>The component’s own CSS and JavaScript rely only on web platform features that are Baseline widely available: it works in ` +
    `${BROWSERS.map(([key, label]) => `${label} ${esc(targets[key] ?? '')}`).join(', ')} and later.</p>` +
    (items.length
      ? `<p>Newer features it uses where the browser has them (progressive enhancements):</p><ul class="gb-compat-list">${items.join('')}</ul>`
      : '<p>It uses no newer features.</p>') +
    `<p class="gb-compat-links"><a href="/3.0/about/browser-support/">Browser support</a> ${link('https://web.dev/baseline', 'Learn more about Baseline')}</p>`;
  return row({
    id: 'baseline', name: 'Baseline', state: ok ? 'ok' : 'warn',
    badge: ok ? 'Widely available' : `${unguarded.length} unguarded`, extra: browsers, body,
  });
}

function ariaRow(c) {
  const {aria} = c;
  const roles = aria.roles.map((r) => link(`https://w3c.github.io/aria/#${r}`, r)).join(', ');
  const patterns = aria.patterns.map((p) => link(p.url, p.name)).join(', ');
  const tested = aria.rows > 0;
  const ok = tested && aria.gaps === 0;
  const body =
    (roles ? `<p>Roles the component renders: ${roles}.</p>` : '<p>The component renders no interactive role of its own.</p>') +
    (patterns ? `<p>Follows the WAI-ARIA Authoring Practices: ${patterns}.</p>` : '') +
    `<p>${tested ? `${n(aria.rows)} rendered state${aria.rows === 1 ? '' : 's'} run through axe-core and the WAI-ARIA 1.3 role and attribute rules in a real browser` : 'Not in the central axe and WAI-ARIA suites yet'}` +
    `${tested ? (aria.gaps ? `, with ${n(aria.gaps)} known gap${aria.gaps === 1 ? '' : 's'}.` : ', with no known gaps.') : '.'}</p>` +
    `<p class="gb-compat-links">${link('https://w3c.github.io/aria/', 'WAI-ARIA 1.3')} ${link('https://www.w3.org/WAI/ARIA/apg/', 'ARIA Authoring Practices')} <a href="/3.0/foundations/accessibility/">Accessibility</a></p>`;
  return row({
    id: 'aria', name: 'WAI-ARIA', state: ok ? 'ok' : tested ? 'warn' : 'none',
    badge: ok ? 'axe and ARIA 1.3 pass' : tested ? `${n(aria.gaps)} known gaps` : 'Not checked yet',
    extra: aria.patterns.slice(0, 2).map((p) => `<span class="gb-compat-chip">${esc(p.name)}</span>`).join(''),
    body,
  });
}

function lighthouseRow(c) {
  const lh = c.lighthouse;
  if (!lh) {
    return row({id: 'lighthouse', name: 'Lighthouse', state: 'none', badge: 'Not measured yet', body: '<p>Lighthouse hasn’t run on this component’s test page yet.</p>'});
  }
  const scores = [
    ['Performance', lh.performance],
    ['Accessibility', lh.accessibility],
    ['Best practices', lh.bestPractices],
    ['SEO', lh.seo],
  ];
  const level = (s) => (s >= 90 ? 'good' : s >= 50 ? 'fair' : 'poor');
  const gauges = scores
    .map(
      ([label, s]) =>
        `<li class="gb-compat-score" data-level="${level(s)}"><md-gb-progress circular value="${s / 100}" aria-label="${esc(label)}: ${s} out of 100"></md-gb-progress>` +
        `<span class="gb-compat-score-value" aria-hidden="true">${s}</span><span class="gb-compat-score-label">${esc(label)}</span></li>`,
    )
    .join('');
  const lowest = Math.min(...scores.map(([, s]) => s));
  const body =
    `<ul class="gb-compat-scores">${gauges}</ul>` +
    (lh.failed.length
      ? `<p>Audits under 90:</p><ul class="gb-compat-list">${lh.failed.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
      : '<p>Every other audit passes.</p>') +
    `<p class="gb-compat-note">Lighthouse ${esc(lh.version)} (${esc(lh.preset)}, ${esc(lh.date)}) on the component alone: its first example on a page of its own, ` +
    `without this site's shell. The modules are the development build (not bundled or minified), so the performance score is indicative.</p>` +
    `<p class="gb-compat-links"><a href="${esc(lh.page)}">Open the test page</a> ${link('https://developer.chrome.com/docs/lighthouse/overview', 'About Lighthouse')}</p>`;
  return row({
    id: 'lighthouse', name: 'Lighthouse', state: lowest >= 90 ? 'ok' : 'warn',
    badge: scores.map(([, s]) => s).join(' · '),
    body,
  });
}

/** The section for the component page `slug` (its file name). */
function compatSection(slug) {
  const d = data();
  const c = d?.components?.[slug];
  if (!c) return '';
  return (
    `<div class="gb-compat">${m3Row(c)}${baselineRow(c, d.targets)}${ariaRow(c)}${lighthouseRow(c)}</div>`
  );
}

module.exports = {compatSection};
