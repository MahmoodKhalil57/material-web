/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The Compatibility section of a /3.0/ component page (`{% gbcompat %}`,
 * added before the API reference of every component page by
 * shortcodes.cjs): a list of four expandable rows from
 * site/content/_data/gbCompat.json (scripts/m3/gen-component-compat.mjs):
 *
 * - Material Design 3: the spec units tested and the tokens that match.
 * - Baseline: widely available, the browser targets, and the newer features
 *   used as progressive enhancements.
 * - WAI-ARIA: the roles, their APG patterns, the axe and ARIA 1.3 results.
 * - Lighthouse: the category scores and failed audits of the component's
 *   test page (/3.0/lab/<slug>/: its first example alone), not this page.
 *
 * Library elements only (md-gb-list, md-gb-list-item expandable, md-gb-shape,
 * md-gb-icon, md-gb-progress, md-gb-stack, md-gb-typography) and native text
 * elements: each row's logo or icon is on a shape in its status's color, its
 * status is the supporting text, and its details are the nested content.
 */

const {existsSync, readFileSync, statSync} = require('node:fs');
const {join} = require('node:path');

const DATA = join(__dirname, '..', 'content', '_data', 'gbCompat.json');

/**
 * Each row's shape, and what is on it: a brand logo (an image served from
 * /images/compat/) or a Material Symbol.
 */
const ROW_ART = {
  m3: {shape: 'cookie9Sided', icon: 'palette'},
  baseline: {shape: 'clover4Leaf', image: '/images/compat/baseline.svg'},
  aria: {shape: 'sunny', icon: 'accessibility_new'},
  lighthouse: {shape: 'softBurst', image: '/images/compat/lighthouse.svg'},
};

/** A row's status -> its shape's color role. */
const STATUS_COLORS = {
  ok: 'secondary-container',
  warn: 'error-container',
  none: 'surface-container-highest',
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
const link = (url, text) => `<a href="${esc(url)}">${esc(text)}</a>`;

const BROWSERS = [
  ['chrome', 'Chrome'],
  ['edge', 'Edge'],
  ['firefox', 'Firefox'],
  ['safari', 'Safari'],
];
const STATUS = {widely: 'Widely available', newly: 'Newly available', limited: 'Limited availability'};

/** One row: an expandable list item with its art, name, status and body. */
function row({id, name, state, status, body}) {
  const art = ROW_ART[id];
  const content = art.icon ? `<md-gb-icon>${art.icon}</md-gb-icon>` : `<img src="${art.image}" alt="">`;
  return (
    `<md-gb-list-item expandable id="compat-${id}">` +
    `<md-gb-shape slot="leading" shape="${art.shape}" color="${STATUS_COLORS[state]}" size="40">${content}</md-gb-shape>` +
    `${esc(name)}<span slot="supporting-text">${esc(status)}</span>` +
    `<div slot="nested">${body}</div>` +
    `</md-gb-list-item>`
  );
}

/** Links under a row's text. */
const links = (...list) => `<p>${list.join(' · ')}</p>`;

function m3Row(c) {
  const {m3} = c;
  if (!m3.pages.length) {
    return row({
      id: 'm3', name: 'Material Design 3', state: 'none', status: 'No spec page',
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
    '</p>' +
    links(...m3.pages.map((p) => link(p.url, `${p.name} on m3.material.io`)), link('/3.0/about/compliance/', 'How compliance is measured'));
  const status = [ok ? 'Spec checked' : `${n(m3.uncovered)} uncovered`, tokens ? `${pct(matched, tokens.decls)}% of tokens match` : ''];
  return row({id: 'm3', name: 'Material Design 3', state: ok ? 'ok' : 'warn', status: status.filter(Boolean).join(' · '), body});
}

function baselineRow(c, targets) {
  const {enhancements, js} = c.baseline;
  const unguarded = enhancements.filter((e) => e.how === 'unguarded');
  const ok = !unguarded.length;
  const browsers = BROWSERS.map(([key, label]) => `${label} ${targets[key] ?? ''}`).join(', ');
  const items = [
    ...enhancements.map(
      (e) =>
        `<li>${link(`https://webstatus.dev/features/${e.id}`, e.name)} (${STATUS[e.status]}): ` +
        `${e.how === 'guarded' ? 'used inside an <code>@supports</code> guard' : e.how === 'allowed' ? 'degrades safely where it is missing' : '<strong>unguarded</strong>'}</li>`,
    ),
    ...js.map((a) => `<li>${link(`https://webstatus.dev/features/${a.id}`, a.name)} (${STATUS[a.status]}): JavaScript, feature-detected or optional</li>`),
  ];
  const body =
    `<p>The component’s own CSS and JavaScript rely only on web platform features that are Baseline widely available: it works in ${esc(browsers)} and later.</p>` +
    (items.length ? `<p>Newer features it uses where the browser has them (progressive enhancements):</p><ul>${items.join('')}</ul>` : '<p>It uses no newer features.</p>') +
    links(link('/3.0/about/browser-support/', 'Browser support'), link('https://web.dev/baseline', 'Learn more about Baseline'));
  return row({
    id: 'baseline', name: 'Baseline', state: ok ? 'ok' : 'warn',
    status: `${ok ? 'Widely available' : `${unguarded.length} unguarded`} · ${browsers}`, body,
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
    links(link('https://w3c.github.io/aria/', 'WAI-ARIA 1.3'), link('https://www.w3.org/WAI/ARIA/apg/', 'ARIA Authoring Practices'), link('/3.0/foundations/accessibility/', 'Accessibility'));
  const status = [ok ? 'axe and ARIA 1.3 pass' : tested ? `${n(aria.gaps)} known gaps` : 'Not checked yet', ...aria.patterns.slice(0, 2).map((p) => p.name)];
  return row({id: 'aria', name: 'WAI-ARIA', state: ok ? 'ok' : tested ? 'warn' : 'none', status: status.join(' · '), body});
}

function lighthouseRow(c) {
  const lh = c.lighthouse;
  if (!lh) {
    return row({id: 'lighthouse', name: 'Lighthouse', state: 'none', status: 'Not measured yet', body: '<p>Lighthouse hasn’t run on this component’s test page yet.</p>'});
  }
  const scores = [
    ['Performance', lh.performance],
    ['Accessibility', lh.accessibility],
    ['Best practices', lh.bestPractices],
    ['SEO', lh.seo],
  ];
  // Each score as a circular progress indicator with its value and name.
  const gauges = scores
    .map(
      ([label, s]) =>
        `<md-gb-stack align-items="center" gap="100">` +
        `<md-gb-progress circular value="${s / 100}" aria-label="${esc(label)}: ${s} out of 100"></md-gb-progress>` +
        `<md-gb-typography scale="title-md">${s}</md-gb-typography>` +
        `<md-gb-typography scale="body-sm" color="on-surface-variant">${esc(label)}</md-gb-typography>` +
        `</md-gb-stack>`,
    )
    .join('');
  const lowest = Math.min(...scores.map(([, s]) => s));
  const body =
    `<md-gb-stack direction="row" wrap gap="400">${gauges}</md-gb-stack>` +
    (lh.failed.length ? `<p>Audits under 90:</p><ul>${lh.failed.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '<p>Every other audit passes.</p>') +
    `<p>Lighthouse ${esc(lh.version)} (${esc(lh.preset)}, ${esc(lh.date)}) on the component alone: its first example on a page of its own, ` +
    `without this site's shell. The modules are the development build (not bundled or minified), so the performance score is indicative.</p>` +
    links(link(lh.page, 'Open the test page'), link('https://developer.chrome.com/docs/lighthouse/overview', 'About Lighthouse'));
  return row({id: 'lighthouse', name: 'Lighthouse', state: lowest >= 90 ? 'ok' : 'warn', status: scores.map(([, s]) => s).join(' · '), body});
}

/** The section for the component page `slug` (its file name). */
function compatSection(slug) {
  const d = data();
  const c = d?.components?.[slug];
  if (!c) return '';
  // The opening tag on a line of its own: Markdown takes a custom element as
  // an HTML block only then (else it wraps the line in a paragraph).
  return `<md-gb-list aria-label="Compatibility">\n${m3Row(c)}${baselineRow(c, d.targets)}${ariaRow(c)}${lighthouseRow(c)}\n</md-gb-list>`;
}

module.exports = {compatSection};
