#!/usr/bin/env node
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates the M3 layout values (breakpoints, margins, spacers, pane widths
 * and pane counts per window size class) from the spec pages, and the pane
 * drag handle tokens from Jetpack Compose.
 *
 * The token DB has no layout tokens, so values are read from the layout
 * pages downloaded into `.m3-specs/pages/foundations/layout/`:
 *   - breakpoints.md: width ranges, per-class margins, spacers and fixed pane
 *     widths, the third pane (side sheet) maximum width.
 *   - scaffold.md: recommended and other pane totals, drag handle snap widths.
 *   - canonical-examples.md: the supporting pane width (checked against the
 *     fixed pane width).
 *   - grids-spacing.md: column counts (image descriptions).
 *   - breakpoints.md "Height breakpoints": the height size classes (compact,
 *     medium, expanded). The page names them and links the Android window
 *     size class docs for their ranges (checked: the link must still be
 *     there).
 *   - scaffold.md / layout-overview.md: floating and docked panes (how a
 *     docked pane adapts per breakpoint) and the fold / spacer definitions.
 * The drag handle has no spec token set; its sizes, shapes and colors are
 * read from Compose `tokens/DragHandleTokens.kt`. Floating and docked panes
 * have no token set either; they use the spec's floating sheet, docked
 * bottom sheet and scrim tokens (token DB), which the spec compares them to.
 *
 * Every value is matched with a regex; if the wording of a page changes the
 * script fails instead of writing stale values.
 *
 *   node scripts/m3/gen-layout.mjs           # write
 *   node scripts/m3/gen-layout.mjs --check   # exit 1 if a file is out of date
 *
 * Writes:
 *   labs/gb/styles/layout/_md-layout-values.scss
 *   labs/gb/styles/layout/layout-values.ts
 *   labs/gb/components/scaffold/_drag-handle-tokens.scss
 *   labs/gb/components/scaffold/_levitated-pane-tokens.scss
 */

import {readFile, writeFile} from 'node:fs/promises';

import {sysVar, tokenCss} from './gb-css.mjs';
import {SpecDb, WEB_CONTEXT} from './spec-db.mjs';

const PAGES = '.m3-specs/pages/foundations/layout';
const DRAG_HANDLE_KT =
  '.m3-specs/compose/material3/commonMain/androidx/compose/material3/tokens/DragHandleTokens.kt';
const OUT_SCSS = 'labs/gb/styles/layout/_md-layout-values.scss';
const OUT_TS = 'labs/gb/styles/layout/layout-values.ts';
const OUT_DRAG = 'labs/gb/components/scaffold/_drag-handle-tokens.scss';
const OUT_LEVITATED = 'labs/gb/components/scaffold/_levitated-pane-tokens.scss';
const check = process.argv.includes('--check');

// The pages use non-breaking spaces in places; match them as spaces.
const read = async (name) =>
  (await readFile(`${PAGES}/${name}.md`, 'utf8')).replace(/ /g, ' ');
const [breakpointsMd, scaffoldMd, canonicalMd, gridsMd, overviewMd] =
  await Promise.all(
    ['breakpoints', 'scaffold', 'canonical-examples', 'grids-spacing', 'layout-overview'].map(read),
  );
const dragKt = await readFile(DRAG_HANDLE_KT, 'utf8');

function must(value, what) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    throw new Error(`gen-layout: ${what} not found in the spec; re-check the page wording`);
  }
  return value;
}

const CLASSES = ['compact', 'medium', 'expanded', 'large', 'extra-large'];
const LABEL = {
  compact: 'Compact',
  medium: 'Medium',
  expanded: 'Expanded',
  large: 'Large',
  'extra-large': 'Extra-large',
};

// --- Breakpoints (breakpoints.md, "Breakpoint | Width (dp)" table) ---------
const ranges = {};
for (const cls of CLASSES) {
  const re = new RegExp(
    String.raw`\|\s*${LABEL[cls]}\s*\n\s*\|\s*(?:Under (\d+)dp|(\d+)\s*[–-]\s*(\d+)dp|(\d+)dp\+)`,
  );
  const m = breakpointsMd.match(re);
  must(m, `${cls} width range`);
  if (m[1]) ranges[cls] = {min: 0, max: Number(m[1])};
  else if (m[2]) ranges[cls] = {min: Number(m[2]), max: Number(m[3]) + 1};
  else ranges[cls] = {min: Number(m[4]), max: null};
}
// The ranges must tile the axis.
for (let i = 1; i < CLASSES.length; i++) {
  if (ranges[CLASSES[i - 1]].max !== ranges[CLASSES[i]].min) {
    throw new Error(`gen-layout: ${CLASSES[i - 1]} and ${CLASSES[i]} ranges do not meet`);
  }
}

// --- Per-class spacing and fixed pane widths (breakpoints.md sections) -----
/** `## Compact`, `## Medium`, `## Expanded`, `## Large & extra-large`. */
function section(md, heading) {
  const start = md.search(new RegExp(String.raw`^## ${heading}\s*$`, 'm'));
  must(start >= 0 ? start : undefined, `"## ${heading}" section`);
  const rest = md.slice(start + 3);
  const end = rest.search(/^## /m);
  return end < 0 ? rest : rest.slice(0, end);
}
function subsection(md, heading) {
  const start = md.search(new RegExp(String.raw`^### ${heading}\s*$`, 'm'));
  if (start < 0) return '';
  const rest = md.slice(start + 4);
  const end = rest.search(/^###? /m);
  return end < 0 ? rest : rest.slice(0, end);
}
const SECTIONS = {
  compact: 'Compact',
  medium: 'Medium',
  expanded: 'Expanded',
  large: 'Large &(?:amp;)? extra-large',
  'extra-large': 'Large &(?:amp;)? extra-large',
};
const spacing = {};
for (const cls of CLASSES) {
  const sec = section(breakpointsMd, SECTIONS[cls]);
  const sp = subsection(sec, 'Spacing');
  const margin = Number(
    must(sp.match(/[Mm]argins? (?:are|of) (\d+)dp/)?.[1], `${cls} margin`),
  );
  const spacer = sp.match(/spacer between panes is (?:also )?(\d+)dp/)?.[1];
  const fixed = sec.match(/fixed pane should have a width of (\d+)dp/)?.[1];
  spacing[cls] = {
    margin,
    spacer: spacer === undefined ? null : Number(spacer),
    fixedPaneWidth: fixed === undefined ? null : Number(fixed),
  };
}
// Compact is single-pane, so the spec gives no spacer; stacked (reflowed)
// panes and feed gaps use the compact margin. Compact and medium give no
// fixed pane width (medium two-pane layouts are 50/50); use expanded's.
spacing.compact.spacer ??= spacing.compact.margin;
for (const cls of CLASSES) {
  must(spacing[cls].spacer, `${cls} spacer`);
}
spacing.compact.fixedPaneWidth ??= must(spacing.expanded.fixedPaneWidth, 'expanded fixed pane width');
spacing.medium.fixedPaneWidth ??= spacing.expanded.fixedPaneWidth;
for (const cls of ['large', 'extra-large']) must(spacing[cls].fixedPaneWidth, `${cls} fixed pane width`);

const thirdPaneMaxWidth = Number(
  must(breakpointsMd.match(/side sheets have a default maximum width of (\d+)dp/)?.[1], 'side sheet max width'),
);

// --- Pane totals (scaffold.md, "Recommended pane total" table) -------------
const panes = {};
for (const cls of CLASSES) {
  const re = new RegExp(
    String.raw`\|\s*${LABEL[cls]}\s*\n\s*\|\s*(\d)\s*\n\s*\|\s*([\d, ]+|--)\s*\n`,
  );
  const m = must(scaffoldMd.match(re), `${cls} pane totals`);
  const others = m[2].trim() === '--' ? [] : m[2].split(',').map(Number);
  panes[cls] = {recommended: Number(m[1]), max: Math.max(Number(m[1]), ...others)};
}

// --- Drag handle snap widths (scaffold.md) ---------------------------------
const snapBlock = must(
  scaffoldMd.match(/recommended custom widths are:\s*\n([\s\S]*?)\[VIDEO/)?.[1],
  'pane snap widths',
);
const snapWidths = [...snapBlock.matchAll(/^- (\d+)dp\s*$/gm)].map((m) => Number(m[1]));
must(snapWidths.length ? snapWidths : undefined, 'pane snap widths');
const snapSplit = /^- Split-pane/m.test(snapBlock);

// --- Supporting pane (canonical-examples.md) must match the fixed pane -----
const supporting = Number(
  must(canonicalMd.match(/Leading or trailing\s*\n\s*\|\s*Fixed \((\d+) ?dp\)\s*\n\s*\|\s*Expanded/)?.[1], 'supporting pane width'),
);
if (supporting !== spacing.expanded.fixedPaneWidth) {
  throw new Error(
    `gen-layout: supporting pane width ${supporting} != expanded fixed pane width ${spacing.expanded.fixedPaneWidth}`,
  );
}

// --- Columns (grids-spacing.md image descriptions) -------------------------
// "A course listing on a compact screen, with 4 columns" and "...on a
// foldable screen, with 8 columns" (foldables unfolded are medium/expanded;
// the mockup groups "compact, medium/expanded, and large/extra-large").
const compactColumns = Number(must(gridsMd.match(/compact screen, with (\d+) columns/)?.[1], 'compact columns'));
const mediumColumns = Number(must(gridsMd.match(/foldable screen, with (\d+) columns/)?.[1], 'medium columns'));
must(/compact, medium\/expanded, and large\/extra-large/.test(gridsMd) || undefined, 'column groups');
// The page does not state the large/extra-large count; 12 continues the
// 4 / 8 progression of the Material layout grid.
const LARGE_COLUMNS = 12;
const columns = {
  compact: compactColumns,
  medium: mediumColumns,
  expanded: mediumColumns,
  large: LARGE_COLUMNS,
  'extra-large': LARGE_COLUMNS,
};

// --- Height size classes (breakpoints.md "Height breakpoints") -------------
// "On Android, compact, medium, and expanded breakpoints are also available
// for [height](https://developer.android.com/...#window_size_classes)." The
// page names the classes and takes their ranges from the linked Android
// docs: compact height < 480dp, medium 480-899dp, expanded 900dp+
// (WindowSizeClass HEIGHT_DP_MEDIUM_LOWER_BOUND, HEIGHT_DP_EXPANDED_LOWER_BOUND).
const heightSection = must(
  breakpointsMd.match(/^#### Height breakpoints\s*\n([^\n]+)/m)?.[1],
  'height breakpoints section',
);
const heightNames = must(
  heightSection.match(
    /^On Android, ([a-z, ]+?),? and ([a-z]+) breakpoints are also available for\s\[height\]\(https:\/\/developer\.android\.com\/[^)]*#window_size_classes\)/,
  ),
  'height breakpoint classes and their Android link',
);
const HEIGHT_CLASSES = [...heightNames[1].split(/,\s*/), heightNames[2]];
const ANDROID_HEIGHT_MIN = {compact: 0, medium: 480, expanded: 900};
if (HEIGHT_CLASSES.join() !== Object.keys(ANDROID_HEIGHT_MIN).join()) {
  throw new Error(`gen-layout: height classes changed to ${HEIGHT_CLASSES.join(', ')}`);
}
must(/rare that layouts need to adjust to available height/.test(heightSection) || undefined, 'height breakpoint guidance');
const heightRanges = Object.fromEntries(
  HEIGHT_CLASSES.map((cls, i) => [
    cls,
    {min: ANDROID_HEIGHT_MIN[cls], max: ANDROID_HEIGHT_MIN[HEIGHT_CLASSES[i + 1]] ?? null},
  ]),
);

// --- Floating and docked panes (scaffold.md) -------------------------------
const DOCKED_EDGE = must(
  scaffoldMd.match(/^Docked panes are usually at the (bottom) of the window, like a bottom sheet\./m)?.[1],
  'docked pane edge',
);
// "At medium and expanded breakpoints, docked panes can adapt into floating
// panes." Below that (compact) a docked pane stays docked.
const dockedFloats = must(
  scaffoldMd.match(/^At ([a-z]+) and ([a-z]+) breakpoints, docked panes can adapt into floating panes\./m),
  'docked to floating breakpoints',
);
const DOCKED_FLOATS_FROM = dockedFloats[1];
if (
  !CLASSES.includes(DOCKED_FLOATS_FROM) ||
  CLASSES.indexOf(dockedFloats[2]) !== CLASSES.indexOf(DOCKED_FLOATS_FROM) + 1
) {
  throw new Error(`gen-layout: unexpected docked pane breakpoints "${dockedFloats[0]}"`);
}
const pinned = (re, what) => must(re.test(scaffoldMd) || undefined, what);
pinned(/^On large screens, consider changing docked panes into co-planar panes\./m, 'docked to co-planar guidance');
pinned(/^- Floating panes are the default\s*\n\s*\n- The scrim behind a floating pane is optional/m, 'floating pane scrim guidance');
pinned(/^Floating: A pane is displayed above other panes or content, like a dialog/m, 'floating pane definition');
pinned(/^Docked: A pane is displayed above other panes and one of its edges extends beyond one side of the screen, like a bottom sheet/m, 'docked pane definition');
// Modal floating panes: focus moves in and back to the trigger, and the pane
// closes when something behind it is used (accessibility considerations).
pinned(/^- Focus moves automatically to the first element in the pane, and when the pane is closed, focus moves back to the element that triggered it/m, 'modal floating pane focus');
pinned(/^- It disappears when a person interacts with something behind it\./m, 'modal floating pane dismissal');

// --- Folds (layout-overview.md, scaffold.md, canonical-examples.md) --------
// Panes keep off the fold, and the spacer between two panes sits on it.
must(/\*\*Fold\*\*: A flexible area of the screen or a hinge that separates two displays on foldable devices/.test(overviewMd) || undefined, 'fold definition');
must(/\*\*Spacer\*\*: The space between two panes on a foldable device/.test(overviewMd) || undefined, 'spacer definition');
pinned(/split-pane layout keeps the spacer visually centered\. It.s best for foldable devices/, 'split-pane foldable guidance');
must(/including special behavior for foldables/.test(canonicalMd) || undefined, 'list-detail foldable guidance');

// --- Floating / docked pane tokens ------------------------------------------
// Floating panes (above other panes; non-modal by default) use the floating
// sheet tokens, docked panes the docked bottom sheet tokens, and the modal
// scrim the scrim tokens. The token DB export has no md.comp.sheet.floating
// or md.comp.scrim set, so those are read from the generated token Sass
// (tokens/versions/latest/sass).
const db = await SpecDb.load();
const TOKEN_SASS = 'tokens/versions/latest/sass';
const sassSets = new Map();
async function sassToken(name) {
  const m = must(name.match(/^md\.comp\.(.+?)\.((?:container|drag-handle)\..+)$/), `token ${name}`);
  const set = m[1].replace(/\./g, '-');
  if (!sassSets.has(set)) {
    sassSets.set(set, await readFile(`${TOKEN_SASS}/_md-comp-${set}.scss`, 'utf8').catch(() => ''));
  }
  const variable = m[2].replace(/\./g, '-');
  const value = sassSets.get(set).match(new RegExp(String.raw`^\$${variable}: ([^;]+);`, 'm'))?.[1];
  if (value === undefined) return undefined;
  if (/^[\d.]+$/.test(value)) return value;
  const ref = value.match(/^md-sys-([a-z]+)\.\$([\w-]+)$/);
  return ref ? sysVar(`md.sys.${ref[1]}.${ref[2]}`) : undefined;
}
const specToken = async (name) =>
  must(tokenCss(db, name, WEB_CONTEXT) ?? (await sassToken(name)), `token ${name}`);
const LEVITATED = {
  floating: [
    ['container-color', 'md.comp.sheet.floating.container.color'],
    ['container-elevation', 'md.comp.sheet.floating.container.elevation'],
    ['container-shape', 'md.comp.sheet.floating.container.shape'],
  ],
  docked: [
    ['container-color', 'md.comp.sheet.bottom.docked.container.color'],
    ['container-elevation', 'md.comp.sheet.bottom.docked.standard.container.elevation'],
    ['modal-container-elevation', 'md.comp.sheet.bottom.docked.modal.container.elevation'],
    ['container-shape', 'md.comp.sheet.bottom.docked.container.shape'],
  ],
  scrim: [
    ['scrim-color', 'md.comp.scrim.container.color'],
    ['scrim-opacity', 'md.comp.scrim.container.opacity'],
  ],
};
const levitatedValues = [];
for (const [mixin, decls] of Object.entries(LEVITATED)) {
  const values = [];
  for (const [prop, token] of decls) values.push([prop, await specToken(token), token]);
  levitatedValues.push([mixin, values]);
}

// --- Drag handle (Compose DragHandleTokens.kt) -----------------------------
function kt(name) {
  const m = dragKt.match(new RegExp(String.raw`val ${name}[^=]*?(?:=|get\(\) =)\s*([^\n]+)`));
  return must(m?.[1].trim(), `DragHandleTokens.${name}`);
}
const dp = (name) => {
  const v = kt(name);
  const n = v.match(/^([\d.]+)\.dp$/)?.[1];
  if (n !== undefined) return `${Number(n)}px`;
  const level = v.match(/ElevationTokens\.Level(\d)/)?.[1];
  if (level !== undefined) return `var(--md-sys-elevation-shadow-${level})`;
  throw new Error(`gen-layout: unexpected DragHandleTokens.${name} value ${v}`);
};
const kebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const color = (name) => {
  const key = must(kt(name).match(/ColorSchemeKeyTokens\.(\w+)/)?.[1], `${name} color`);
  return `var(--md-sys-color-${kebab(key)})`;
};
const SHAPE_SIZES = {None: 'none', ExtraSmall: 'xs', Small: 'sm', Medium: 'md', Large: 'lg', ExtraLarge: 'xl', Full: 'full'};
const shape = (name) => {
  const key = must(kt(name).match(/ShapeKeyTokens\.Corner(\w+)/)?.[1], `${name} shape`);
  return `var(--md-sys-shape-corner-${must(SHAPE_SIZES[key], `${name} shape ${key}`)})`;
};
const drag = [
  ['color', color('Color'), 'Color'],
  ['container-width', dp('ContainerWidth'), 'ContainerWidth'],
  ['width', dp('Width'), 'Width'],
  ['height', dp('Height'), 'Height'],
  ['shape', shape('Shape'), 'Shape'],
  ['elevation', dp('Elevation'), 'Elevation'],
  ['pressed-color', color('PressedColor'), 'PressedColor'],
  ['pressed-width', dp('PressedWidth'), 'PressedWidth'],
  ['pressed-height', dp('PressedHeight'), 'PressedHeight'],
  ['pressed-shape', shape('PressedShape'), 'PressedShape'],
  ['dragged-color', color('DraggedColor'), 'DraggedColor'],
  ['dragged-width', dp('DraggedWidth'), 'DraggedWidth'],
  ['dragged-height', dp('DraggedHeight'), 'DraggedHeight'],
  ['dragged-shape', shape('DraggedShape'), 'DraggedShape'],
];

// --- Emit ------------------------------------------------------------------
const HEADER = (comment) => `//
// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, run: node scripts/m3/gen-layout.mjs
${comment}
`;

const px = (n) => (n === null ? 'null' : `${n}px`);
const scss = `${HEADER(`// Source: m3.material.io foundations/layout (breakpoints, scaffold,
// canonical-examples, grids-spacing). 1dp = 1 CSS px.`)}
// Window size classes (breakpoints), smallest first.
$window-classes: ${CLASSES.join(', ')};

// Per window size class:
// - min-width / max-width: the class covers min-width <= width < max-width.
// - margin: leading and trailing window margin.
// - spacer: space between panes. Compact has no spacer in the spec (single
//   pane); it uses the compact margin for reflowed panes.
// - fixed-pane-width: default width of the fixed pane in a fixed-and-flexible
//   layout. Compact/medium have none in the spec; they use expanded's.
// - columns: layout grid columns. Large and extra-large are not stated in the
//   spec text; 12 continues the 4 / 8 progression.
// - panes-recommended / panes-max: visible pane totals (scaffold.md).
$values: (
${CLASSES.map((cls) => {
  const r = ranges[cls];
  const s = spacing[cls];
  return `  ${cls}: (
    min-width: ${px(r.min)},
    max-width: ${px(r.max)},
    margin: ${px(s.margin)},
    spacer: ${px(s.spacer)},
    fixed-pane-width: ${px(s.fixedPaneWidth)},
    columns: ${columns[cls]},
    panes-recommended: ${panes[cls].recommended},
    panes-max: ${panes[cls].max},
  ),`;
}).join('\n')}
);

// Maximum width of a standard side sheet used as the third pane.
$third-pane-max-width: ${px(thirdPaneMaxWidth)};

// Recommended drag handle snap widths for two-pane layouts at expanded and
// larger, plus ${snapSplit ? 'a split with the spacer visually centered' : 'no split snap'}.
$pane-snap-widths: ${snapWidths.map(px).join(' ')};
$pane-snap-split: ${snapSplit};

// Window height size classes (breakpoints.md "Height breakpoints"; ranges
// from the Android window size classes it links to), smallest first. Most
// layouts scroll vertically, so the spec expects few height adjustments.
$window-height-classes: ${HEIGHT_CLASSES.join(', ')};
$height-values: (
${HEIGHT_CLASSES.map((cls) => `  ${cls}: (
    min-height: ${px(heightRanges[cls].min)},
    max-height: ${px(heightRanges[cls].max)},
  ),`).join('\n')}
);
`;

const ts = `/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// AUTOGENERATED. DO NOT MODIFY.
// To modify this file, run: node scripts/m3/gen-layout.mjs
// Source: m3.material.io foundations/layout. Widths in CSS px (1dp = 1px).

/** M3 window size classes (breakpoints), smallest first. */
export const WINDOW_SIZE_CLASSES = ${JSON.stringify(CLASSES).replace(/"/g, "'").replace(/,/g, ', ')} as const;

/** An M3 window size class (breakpoint). */
export type WindowSizeClass = (typeof WINDOW_SIZE_CLASSES)[number];

/** Layout values for one window size class. */
export interface WindowSizeClassValues {
  /** Smallest width in the class (inclusive). */
  readonly minWidth: number;
  /** Width where the next class starts (exclusive), or null for the last. */
  readonly maxWidth: number | null;
  /** Leading and trailing window margin. */
  readonly margin: number;
  /** Space between panes. */
  readonly spacer: number;
  /** Default fixed pane width in a fixed-and-flexible layout. */
  readonly fixedPaneWidth: number;
  /** Layout grid columns. */
  readonly columns: number;
  /** Recommended number of visible panes. */
  readonly panesRecommended: number;
  /** Maximum number of visible panes. */
  readonly panesMax: number;
}

/** Layout values per window size class. */
export const WINDOW_SIZE_CLASS_VALUES: Readonly<
  Record<WindowSizeClass, WindowSizeClassValues>
> = {
${CLASSES.map((cls) => {
  const r = ranges[cls];
  const s = spacing[cls];
  return `  '${cls}': {
    minWidth: ${r.min},
    maxWidth: ${r.max},
    margin: ${s.margin},
    spacer: ${s.spacer},
    fixedPaneWidth: ${s.fixedPaneWidth},
    columns: ${columns[cls]},
    panesRecommended: ${panes[cls].recommended},
    panesMax: ${panes[cls].max},
  },`;
}).join('\n')}
};

/** Maximum width of a standard side sheet used as the third pane. */
export const THIRD_PANE_MAX_WIDTH = ${thirdPaneMaxWidth};

/** Recommended drag handle snap widths (expanded and larger). */
export const PANE_SNAP_WIDTHS: readonly number[] = [${snapWidths.join(', ')}];

/** Whether panes also snap to a split with the spacer visually centered. */
export const PANE_SNAP_SPLIT = ${snapSplit};

/**
 * M3 window height size classes, smallest first (spec: breakpoints, "Height
 * breakpoints"; ranges from the Android window size classes it links to).
 */
export const WINDOW_HEIGHT_CLASSES = ${JSON.stringify(HEIGHT_CLASSES).replace(/"/g, "'").replace(/,/g, ', ')} as const;

/** An M3 window height size class. */
export type WindowHeightClass = (typeof WINDOW_HEIGHT_CLASSES)[number];

/** Height range of one window height size class. */
export interface WindowHeightClassValues {
  /** Smallest height in the class (inclusive). */
  readonly minHeight: number;
  /** Height where the next class starts (exclusive), or null for the last. */
  readonly maxHeight: number | null;
}

/** Height ranges per window height size class. */
export const WINDOW_HEIGHT_CLASS_VALUES: Readonly<
  Record<WindowHeightClass, WindowHeightClassValues>
> = {
${HEIGHT_CLASSES.map((cls) => `  '${cls}': {minHeight: ${heightRanges[cls].min}, maxHeight: ${heightRanges[cls].max}},`).join('\n')}
};

/** The window edge a docked pane is pinned to (spec: scaffold, levitate). */
export const DOCKED_PANE_EDGE = '${DOCKED_EDGE}';

/**
 * The smallest window size class where a docked pane adapts into a floating
 * pane (spec: "At ${dockedFloats[1]} and ${dockedFloats[2]} breakpoints, docked panes can
 * adapt into floating panes").
 */
export const DOCKED_PANE_FLOATS_FROM = '${DOCKED_FLOATS_FROM}';
`;

const dragScss = `${HEADER(`// Source: Jetpack Compose material3 tokens/DragHandleTokens.kt (the spec has
// no drag handle token set).`)}
@mixin root {
${drag.map(([name, value, src]) => `  // DragHandleTokens.${src}\n  --${name}: ${value};`).join('\n')}
}
`;

const levitatedScss = `${HEADER(`// Source: m3.material.io foundations/layout/scaffold (floating panes are
// "like a dialog", docked panes "like a bottom sheet"). The spec has no pane
// token set, so floating panes use md.comp.sheet.floating, docked panes
// md.comp.sheet.bottom.docked and the modal scrim md.comp.scrim.`)}
${levitatedValues.map(([mixin, decls]) => `@mixin ${mixin} {
${decls.map(([prop, value, token]) => `  // ${token}\n  --${prop}: ${value};`).join('\n')}
}`).join('\n\n')}
`;

let stale = false;
for (const [file, content] of [
  [OUT_SCSS, scss],
  [OUT_TS, ts],
  [OUT_DRAG, dragScss],
  [OUT_LEVITATED, levitatedScss],
]) {
  const current = await readFile(file, 'utf8').catch(() => null);
  if (check) {
    if (current !== content) {
      console.error(`${file} is out of date; run node scripts/m3/gen-layout.mjs`);
      stale = true;
    }
  } else if (current !== content) {
    await writeFile(file, content);
    console.log(`Wrote ${file}`);
  } else {
    console.log(`${file} is up to date`);
  }
}
if (stale) process.exit(1);
