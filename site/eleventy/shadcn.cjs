/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Names and tables of the shadcn registry of the /3.0/ docs (/3.0/r/): which
 * components directory is which registry item, which docs page
 * documents it, the registry URL, and the mapping between the shadcn
 * variables and the M3 color roles (both directions). Synchronous and without
 * the TypeScript program so that shortcodes can use it; the element API is
 * read by scripts/m3/gb-shadcn.mjs.
 */

const {existsSync, readdirSync, readFileSync} = require('node:fs');
const {join} = require('node:path');
const {url: SITE_URL} = require('../content/_data/site.cjs');

const ROOT = join(__dirname, '..', '..');
// The element roots (components/ and extras/), shared with the scripts.
const ROOTS = require('../../scripts/element-roots.json').roots.map((r) =>
  join(ROOT, 'material-design-expressive', r),
);
const DOCS = join(ROOT, 'docs', 'components');

/** Directories whose item name is not the directory name. */
const DIR_NAMES = {
  appbar: 'app-bar',
  buttongroup: 'button-group',
  datepicker: 'date-picker',
  fabmenu: 'fab-menu',
  iconbutton: 'icon-button',
  loadingindicator: 'loading-indicator',
  navbar: 'nav-bar',
  navdrawer: 'nav-drawer',
  navrail: 'nav-rail',
  pulltorefresh: 'pull-to-refresh',
  segmentedbutton: 'segmented-button',
  splitbutton: 'split-button',
  textfield: 'text-field',
  timepicker: 'time-picker',
};

/** The registry item of a components directory: `md-button`. */
const itemName = (dir) => `md-${DIR_NAMES[dir] ?? dir}`;

/** The directories that contain md-gb-* elements, sorted. */
function elementDirs() {
  return ROOTS.filter((root) => existsSync(root))
    .flatMap((root) =>
      readdirSync(root, {withFileTypes: true})
        .filter((d) => d.isDirectory() && d.name !== 'shared')
        .filter((d) => readdirSync(join(root, d.name)).some((f) => /^md-gb-.*\.ts$/.test(f) && !f.endsWith('.d.ts')))
        .map((d) => d.name),
    )
    .sort();
}

/** {dir: docs slug} from the `{% gbapi "dir" %}` of docs/components/*.md. */
function docsPages() {
  const pages = {};
  if (!existsSync(DOCS)) return pages;
  for (const f of readdirSync(DOCS)) {
    if (!f.endsWith('.md') || f === 'README.md') continue;
    const text = readFileSync(join(DOCS, f), 'utf8');
    for (const m of text.matchAll(/\{%-?\s*gbapi\s+"([^"]+)"/g)) pages[m[1]] ??= f.slice(0, -3);
  }
  return pages;
}

/** The base URL of the registry files: no trailing slash, ends with /3.0/r. */
function registryBase({forFiles = false} = {}) {
  const override = process.env.MWC_REGISTRY_URL;
  if (override) return override.replace(/\/+$/, '');
  // In the dev server the files must work against it (the docs keep showing
  // the production URL); MWC_SITE_URL wins when it is set.
  const local = forFiles && process.env.NODE_ENV === 'DEV' && !process.env.MWC_SITE_URL;
  return `${local ? 'http://localhost:8000' : SITE_URL}/3.0/r`;
}

/** Docs URL of a directory's page (or the components index). */
function docsUrl(dir, pages = docsPages()) {
  return `${SITE_URL}/3.0/components/${pages[dir] ? pages[dir] + '/' : ''}`;
}

/**
 * M3 color role <- shadcn expression. Both light and dark use the same
 * expressions: the shadcn variables change with `.dark`. Roles that are not
 * listed (the *-fixed roles, scrim, shadow) keep the M3 baseline.
 */
const MIX = (a, pct, b) => `color-mix(in oklab, ${a} ${pct}%, ${b})`;
const ROLE_MAP = [
  // [M3 role, expression, note]
  ['primary', 'var(--primary)', 'Same role.'],
  ['on-primary', 'var(--primary-foreground)', 'Same pair.'],
  ['primary-container', 'var(--accent)', 'shadcn has no primary container; accent is its tinted fill.'],
  ['on-primary-container', 'var(--accent-foreground)', 'Pairs with accent.'],
  ['secondary', 'var(--muted-foreground)', 'The mid-tone solid; text on it is --background.'],
  ['on-secondary', 'var(--background)', 'Pairs with the solid above.'],
  ['secondary-container', 'var(--secondary)', 'shadcn secondary is a tonal fill, like an M3 container.'],
  ['on-secondary-container', 'var(--secondary-foreground)', 'Pairs with secondary.'],
  ['tertiary', 'var(--primary)', 'shadcn has no tertiary; it follows primary.'],
  ['on-tertiary', 'var(--primary-foreground)', 'Pairs with primary.'],
  ['tertiary-container', 'var(--accent)', 'Follows the primary container.'],
  ['on-tertiary-container', 'var(--accent-foreground)', 'Pairs with accent.'],
  ['error', 'var(--destructive)', 'Same role.'],
  ['on-error', 'var(--destructive-foreground, oklch(1 0 0))', 'shadcn v4 has no destructive-foreground; white.'],
  ['error-container', MIX('var(--destructive)', 14, 'var(--background)'), 'A tint of destructive on the background.'],
  ['on-error-container', 'var(--destructive)', 'Destructive on its tint.'],
  ['background', 'var(--background)', 'Same role.'],
  ['on-background', 'var(--foreground)', 'Same pair.'],
  ['surface', 'var(--background)', 'The page surface.'],
  ['on-surface', 'var(--foreground)', 'Same pair.'],
  ['surface-variant', 'var(--muted)', 'Muted fill.'],
  ['on-surface-variant', 'var(--muted-foreground)', 'Muted text.'],
  ['surface-tint', 'var(--primary)', 'Same as primary.'],
  ['surface-dim', 'var(--muted)', 'Muted fill.'],
  ['surface-bright', 'var(--background)', 'The page surface.'],
  ['surface-container-lowest', 'var(--background)', 'Lowest tone: the page.'],
  ['surface-container-low', 'var(--card)', 'Cards.'],
  ['surface-container', 'var(--popover)', 'Menus and popovers.'],
  ['surface-container-high', 'var(--muted)', 'Muted fill.'],
  ['surface-container-highest', 'var(--accent)', 'Accent fill (the highest tone in both schemes).'],
  ['outline', 'var(--muted-foreground)', 'M3 needs 3:1 against the surface; shadcn --border is too faint for field and button outlines.'],
  ['outline-variant', 'var(--border)', 'Dividers and decorative borders.'],
  ['inverse-surface', 'var(--foreground)', 'Inverse of the page.'],
  ['inverse-on-surface', 'var(--background)', 'Pairs with the inverse surface.'],
  ['inverse-primary', 'var(--primary-foreground)', 'Primary-side color that reads on the inverse surface.'],
];

/** Corner scale of --radius: the M3 px values at shadcn's default 0.625rem. */
const SHAPE_MAP = [
  ['xs', 0.4],
  ['sm', 0.8],
  ['md', 1.2],
  ['lg', 1.6],
  ['lg-increased', 2],
  ['xl', 2.8],
  ['xl-increased', 3.2],
  ['xxl', 4.8],
];

/** shadcn variable <- M3 role, for the reverse theme (md-theme-m3). */
const REVERSE_MAP = [
  ['background', 'surface'],
  ['foreground', 'on-surface'],
  ['card', 'surface-container-low'],
  ['card-foreground', 'on-surface'],
  ['popover', 'surface-container'],
  ['popover-foreground', 'on-surface'],
  ['primary', 'primary'],
  ['primary-foreground', 'on-primary'],
  ['secondary', 'secondary-container'],
  ['secondary-foreground', 'on-secondary-container'],
  ['muted', 'surface-container-high'],
  ['muted-foreground', 'on-surface-variant'],
  ['accent', 'surface-container-highest'],
  ['accent-foreground', 'on-surface'],
  ['destructive', 'error'],
  ['border', 'outline-variant'],
  ['input', 'outline'],
  ['ring', 'primary'],
  ['chart-1', 'primary'],
  ['chart-2', 'tertiary'],
  ['chart-3', 'secondary'],
  ['chart-4', 'primary-fixed-dim'],
  ['chart-5', 'tertiary-fixed-dim'],
  ['sidebar', 'surface-container-low'],
  ['sidebar-foreground', 'on-surface'],
  ['sidebar-primary', 'primary'],
  ['sidebar-primary-foreground', 'on-primary'],
  ['sidebar-accent', 'secondary-container'],
  ['sidebar-accent-foreground', 'on-secondary-container'],
  ['sidebar-border', 'outline-variant'],
  ['sidebar-ring', 'primary'],
];

/** The cssVars of md-theme: shadcn -> M3 (same in light and dark). */
function themeCssVars() {
  const vars = {};
  for (const [role, expr] of ROLE_MAP) vars[`md-sys-color-${role}`] = expr;
  for (const [size, factor] of SHAPE_MAP) {
    const value = `calc(var(--radius) * ${factor})`;
    vars[`md-sys-shape-corner-${size}`] = value;
    // The corner-value-* tokens hold the same number for calc() users.
    vars[`md-sys-shape-corner-value-${size}`] = value;
  }
  return vars;
}

/** The M3 baseline colors of styles/m3.css: {light, dark} role -> hex. */
function baselineRoles() {
  const css = readFileSync(join(ROOT, 'material-design-expressive', 'styles', 'm3.css'), 'utf8');
  const start = css.indexOf('@layer md.sys.color{');
  const darkAt = css.indexOf('@media(prefers-color-scheme: dark){', start);
  const read = (text) => {
    const roles = {};
    for (const m of text.matchAll(/--md-sys-color-([a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)) roles[m[1]] ??= m[2];
    return roles;
  };
  const light = read(css.slice(start, darkAt));
  // The dark block repeats only the roles that change (not the *-fixed ones).
  const dark = {...light, ...read(css.slice(darkAt, css.indexOf('}}', darkAt + 40) + 2))};
  return {light, dark};
}

module.exports = {
  ROLE_MAP,
  SHAPE_MAP,
  REVERSE_MAP,
  SITE_URL,
  baselineRoles,
  docsPages,
  docsUrl,
  elementDirs,
  itemName,
  registryBase,
  themeCssVars,
};
