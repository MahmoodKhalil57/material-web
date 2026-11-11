/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The table of labs/gb components and variants that the central
 * CSS/token suites (`*_test.ts` and `*_gap.ts` in this folder) run over. One
 * row renders one interactive element (marked `data-subject`) in the context it
 * needs, so a suite can render every row the same way.
 */

import '../styles/icons/md-gb-icon.js';

import {adoptStyles} from '../styles/adopt-styles.js';
import {styles as m3Styles} from '../styles/m3.cssresult.js';
import {center, deepElements, focusRingsOf, prop, ripplesOf, until} from '../components/shared/test-dom.js';

// Shared with the component tests that do not need the subject table.
export {center, deepElements, focusRingsOf, prop, ripplesOf, until};

adoptStyles(document, [m3Styles]);

/** How a subject takes part in the disabled checks. */
export interface DisabledSupport {
  /**
   * The property that a click or Space/Enter would change when operable, for
   * the "not operable" check; `null` when the part has no state to toggle.
   */
  toggles: 'selected' | 'checked' | 'pressed' | 'active' | null;
  /** The component supports the `soft-disabled` attribute. */
  soft?: boolean;
}

/** One row of the shared table. */
export interface Subject {
  /** Unique id, `<folder>` or `<folder>-<variant>`. */
  id: string;
  /** The `components` folder. */
  component: string;
  /** Markup with exactly one `[data-subject]` element (the interactive part). */
  html: string;
  /** The component supports the `density` attribute (0 to -3). */
  density?: boolean;
  /** Set when the part can be disabled (`disabled` attribute). */
  disabled?: DisabledSupport;
  /** The part has no shadow-DOM ripple and uses its own state layer. */
  noRipple?: boolean;
  /**
   * The subject's interactive part is not the host itself: a selector for it
   * inside the host's shadow root.
   */
  part?: string;
  /** Opens or otherwise readies the rendered container (a menu, a drawer). */
  prepare?: (container: HTMLElement) => Promise<void> | void;
  /** Whether the part is a text input (hover/press are on the field). */
  input?: boolean;
  /**
   * The spec sets a smaller target for this part (the unit is cited next to
   * the entry); these minimums apply instead of 48 x 48.
   */
  targetMin?: {width: number; height: number};
}


const buttons: Subject[] = [];
for (const color of ['filled', 'elevated', 'tonal', 'outlined', 'text']) {
  buttons.push({
    id: `button-${color}`,
    component: 'button',
    html: `<md-gb-button data-subject color="${color}">Label</md-gb-button>`,
    disabled: {toggles: null, soft: true},
  });
}
for (const size of ['xs', 'md', 'xl']) {
  buttons.push({
    id: `button-${size}`,
    component: 'button',
    html: `<md-gb-button data-subject color="filled" size="${size}">Label</md-gb-button>`,
    disabled: {toggles: null, soft: true},
  });
}
buttons.push({
  id: 'button-toggle',
  component: 'button',
  html: `<md-gb-button data-subject color="tonal" type="toggle">Label</md-gb-button>`,
  disabled: {toggles: 'selected', soft: true},
});

const iconButtons: Subject[] = [];
for (const color of ['standard', 'filled', 'tonal', 'outlined']) {
  iconButtons.push({
    id: `icon-button-${color}`,
    component: 'iconbutton',
    html: `<md-gb-icon-button data-subject color="${color}" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`,
    density: true,
    disabled: {toggles: null, soft: true},
  });
}
iconButtons.push({
  id: 'icon-button-xs',
  component: 'iconbutton',
  html: `<md-gb-icon-button data-subject color="filled" size="xs" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`,
  density: true,
  disabled: {toggles: null, soft: true},
});
iconButtons.push({
  id: 'icon-button-toggle',
  component: 'iconbutton',
  html: `<md-gb-icon-button data-subject type="toggle" color="tonal" aria-label="Favorite"><md-gb-icon>favorite</md-gb-icon></md-gb-icon-button>`,
  density: true,
  disabled: {toggles: 'selected', soft: true},
});

export const SUBJECTS: Subject[] = [
  ...buttons,
  ...iconButtons,
  {
    id: 'fab',
    component: 'fab',
    html: `<md-gb-fab data-subject aria-label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>`,
    disabled: {toggles: null},
  },
  {
    id: 'fab-sm',
    component: 'fab',
    html: `<md-gb-fab data-subject size="sm" aria-label="Create"><md-gb-icon>add</md-gb-icon></md-gb-fab>`,
    disabled: {toggles: null},
  },
  {
    id: 'checkbox',
    component: 'checkbox',
    html: `<md-gb-checkbox data-subject aria-label="Check"></md-gb-checkbox>`,
    density: true,
    disabled: {toggles: 'checked'},
  },
  {
    id: 'radio',
    component: 'radio',
    html: `<md-gb-radio data-subject name="r" value="a" aria-label="A"></md-gb-radio>`,
    density: true,
    disabled: {toggles: 'checked'},
  },
  {
    id: 'switch',
    component: 'switch',
    html: `<md-gb-switch data-subject aria-label="Wi-Fi"></md-gb-switch>`,
    density: true,
    disabled: {toggles: 'selected'},
  },
  {
    id: 'chip-assist',
    component: 'chip',
    html: `<md-gb-chip-set><md-gb-chip data-subject type="assist">Label</md-gb-chip></md-gb-chip-set>`,
    density: true,
    disabled: {toggles: null, soft: true},
  },
  {
    id: 'chip-filter',
    component: 'chip',
    html: `<md-gb-chip-set><md-gb-chip data-subject type="filter">Label</md-gb-chip></md-gb-chip-set>`,
    density: true,
    disabled: {toggles: 'selected', soft: true},
  },
  {
    id: 'chip-suggestion',
    component: 'chip',
    html: `<md-gb-chip-set><md-gb-chip data-subject type="suggestion" elevated>Label</md-gb-chip></md-gb-chip-set>`,
    density: true,
    disabled: {toggles: null, soft: true},
  },
  {
    id: 'segmented-button',
    component: 'segmentedbutton',
    html: `<md-gb-segmented-button-set aria-label="Sort"><md-gb-segmented-button data-subject value="a">Day</md-gb-segmented-button><md-gb-segmented-button value="b">Week</md-gb-segmented-button></md-gb-segmented-button-set>`,
    density: true,
    disabled: {toggles: 'selected'},
  },
  {
    id: 'card-interactive',
    component: 'card',
    html: `<md-gb-card data-subject interactive aria-label="Open" style="width:200px;height:120px">Content</md-gb-card>`,
    disabled: {toggles: null},
  },
  {
    id: 'list-item',
    component: 'list',
    html: `<md-gb-list aria-label="Items"><md-gb-list-item data-subject>One</md-gb-list-item><md-gb-list-item>Two</md-gb-list-item></md-gb-list>`,
    density: true,
    disabled: {toggles: null},
  },
  {
    id: 'menu-item',
    component: 'menu',
    prepare: (c) => (c.querySelector('md-gb-menu') as HTMLElement).showPopover(),
    html: `<md-gb-menu aria-label="Menu"><md-gb-menu-item data-subject>Cut</md-gb-menu-item><md-gb-menu-item>Copy</md-gb-menu-item></md-gb-menu>`,
    density: true,
    disabled: {toggles: null},
  },
  {
    id: 'nav-bar-item',
    component: 'navbar',
    html: `<md-gb-nav-bar><md-gb-nav-bar-item data-subject><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-bar-item><md-gb-nav-bar-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-bar-item></md-gb-nav-bar>`,
    disabled: {toggles: null},
  },
  {
    id: 'nav-rail-item',
    component: 'navrail',
    html: `<md-gb-nav-rail><md-gb-nav-rail-item data-subject><md-gb-icon slot="icon">home</md-gb-icon>Home</md-gb-nav-rail-item><md-gb-nav-rail-item><md-gb-icon slot="icon">mail</md-gb-icon>Mail</md-gb-nav-rail-item></md-gb-nav-rail>`,
    disabled: {toggles: null},
  },
  {
    id: 'nav-drawer-item',
    component: 'navdrawer',
    prepare: (c) => {
      const drawer = c.querySelector('md-gb-nav-drawer') as HTMLElement & {open: boolean};
      drawer.setAttribute('quick', '');
      drawer.open = true;
    },
    html: `<md-gb-nav-drawer aria-label="Mail"><md-gb-nav-drawer-item data-subject>Inbox</md-gb-nav-drawer-item><md-gb-nav-drawer-item>Sent</md-gb-nav-drawer-item></md-gb-nav-drawer>`,
    disabled: {toggles: 'selected'},
  },
  {
    id: 'tab-primary',
    component: 'tabs',
    html: `<md-gb-tabs aria-label="Tabs"><md-gb-tab data-subject><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`,
    disabled: {toggles: null},
  },
  {
    id: 'tab-secondary',
    component: 'tabs',
    html: `<md-gb-tabs aria-label="Tabs" variant="secondary"><md-gb-tab data-subject><span slot="label">One</span></md-gb-tab><md-gb-tab><span slot="label">Two</span></md-gb-tab></md-gb-tabs>`,
    disabled: {toggles: null},
  },
  {
    id: 'text-field-filled',
    component: 'textfield',
    html: `<md-gb-text-field data-subject label="Label"></md-gb-text-field>`,
    density: true,
    input: true,
    noRipple: true,
    disabled: {toggles: null},
  },
  {
    id: 'text-field-outlined',
    component: 'textfield',
    html: `<md-gb-text-field data-subject variant="outlined" label="Label"></md-gb-text-field>`,
    density: true,
    input: true,
    noRipple: true,
    disabled: {toggles: null},
  },
  {
    id: 'slider',
    component: 'slider',
    noRipple: true,
    // sliders-509b38: the XS handle is 44dp high (sliders/specs/measurements).
    targetMin: {width: 48, height: 44},
    html: `<md-gb-slider data-subject style="width:300px" value="40" aria-label="Volume"></md-gb-slider>`,
    disabled: {toggles: null},
  },
  {
    id: 'search-bar',
    component: 'search',
    html: `<md-gb-search-bar data-subject placeholder="Search" style="width:360px"></md-gb-search-bar>`,
    disabled: {toggles: null},
  },
];

/** Renders a subject into a fresh container and returns its subject element. */
export async function renderSubject(subject: Subject, attrs: Record<string, string | boolean> = {}) {
  await loadSubject(subject);
  const container = document.createElement('div');
  container.style.cssText = 'padding:64px;display:block;position:relative';
  container.innerHTML = subject.html;
  document.body.append(container);
  const el = container.querySelector<HTMLElement>('[data-subject]')!;
  for (const [name, value] of Object.entries(attrs)) {
    if (value === false) el.removeAttribute(name);
    else el.setAttribute(name, value === true ? '' : value);
  }
  await subject.prepare?.(container);
  await settle(container);
  return {container, el, cleanup: () => container.remove()};
}

// Each subject's component loads when the subject is first rendered, so a
// suite file only pays for the components it renders (the central suites are
// split into many files, and every file loading all of them used to triple
// the import time of the full run).
const LOADERS: Record<string, () => Promise<unknown[]>> = {
  button: () => Promise.all([import('../components/button/md-gb-button.js')]),
  iconbutton: () => Promise.all([import('../components/iconbutton/md-gb-icon-button.js')]),
  fab: () => Promise.all([import('../components/fab/md-gb-fab.js')]),
  checkbox: () => Promise.all([import('../components/checkbox/md-gb-checkbox.js')]),
  radio: () => Promise.all([import('../components/radio/md-gb-radio.js')]),
  switch: () => Promise.all([import('../components/switch/md-gb-switch.js')]),
  chip: () => Promise.all([import('../components/chip/md-gb-chip.js'), import('../components/chip/md-gb-chip-set.js')]),
  segmentedbutton: () => Promise.all([import('../components/segmentedbutton/md-gb-segmented-button.js'), import('../components/segmentedbutton/md-gb-segmented-button-set.js')]),
  card: () => Promise.all([import('../components/card/md-gb-card.js')]),
  list: () => Promise.all([import('../components/list/md-gb-list.js'), import('../components/list/md-gb-list-item.js')]),
  menu: () => Promise.all([import('../components/menu/md-gb-menu.js'), import('../components/menu/md-gb-menu-item.js')]),
  navbar: () => Promise.all([import('../components/navbar/md-gb-nav-bar.js'), import('../components/navbar/md-gb-nav-bar-item.js')]),
  navdrawer: () => Promise.all([import('../components/navdrawer/md-gb-nav-drawer.js'), import('../components/navdrawer/md-gb-nav-drawer-item.js')]),
  navrail: () => Promise.all([import('../components/navrail/md-gb-nav-rail.js'), import('../components/navrail/md-gb-nav-rail-item.js')]),
  search: () => Promise.all([import('../components/search/md-gb-search-bar.js')]),
  tabs: () => Promise.all([import('../components/tabs/md-gb-tabs.js'), import('../components/tabs/md-gb-tab.js')]),
  textfield: () => Promise.all([import('../components/textfield/md-gb-text-field.js')]),
  slider: () => Promise.all([import('../components/slider/md-gb-slider.js')]),
};

/** Loads the components a subject renders (all of them with no subject). */
export async function loadSubject(subject?: Subject) {
  const dirs = subject ? [subject.component] : Object.keys(LOADERS);
  await Promise.all(dirs.map((d) => LOADERS[d]?.()));
}

/** Waits for every custom element under `root` to finish rendering. */
export async function settle(root: Element) {
  const all = [root, ...root.querySelectorAll('*')] as Array<
    Element & {updateComplete?: Promise<unknown>}
  >;
  await Promise.all(all.map((e) => e.updateComplete));
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await Promise.all(all.map((e) => e.updateComplete));
}

/** The element that has focus, descending through shadow roots. */
export function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** The pause that lets a transition on a registered property finish. */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The largest alpha among the colors painted by an element's background. */
export function stateLayerAlpha(el: Element): number {
  const bg = getComputedStyle(el).backgroundImage;
  let max = 0;
  for (const match of bg.matchAll(/(?:color\(srgb [^)/]*|rgba\([^)]*,|hsla\([^)]*,)\s*\/?\s*([\d.]+)\)/g)) {
    max = Math.max(max, Number(match[1]));
  }
  return Math.round(max * 1000) / 1000;
}

/**
 * The largest state-layer alpha painted by a ripple element, its descendants or
 * their `::before` / `::after` (the checkbox, switch and nav items paint it
 * on a pseudo-element or a child).
 */
export function paintedLayerAlpha(el: Element): number {
  const parts = [el, ...Array.from(el.querySelectorAll('*'))];
  const alphas = parts.flatMap((part) => [undefined, '::before', '::after'].map((pseudo) => {
    const bg = getComputedStyle(part, pseudo).backgroundImage;
    let max = 0;
    for (const match of bg.matchAll(/(?:color\(srgb [^)/]*|rgba\([^)]*,|hsla\([^)]*,)\s*\/?\s*([\d.]+)\)/g)) {
      max = Math.max(max, Number(match[1]));
    }
    return max;
  }));
  return Math.round(Math.max(...alphas) * 1000) / 1000;
}

/** Style sheets (document, adopted, shadow roots) that style a subject. */
export function sheetsOf(el: Element): CSSStyleSheet[] {
  const sheets = new Set<CSSStyleSheet>();
  const add = (root: Document | ShadowRoot) => {
    for (const s of root.adoptedStyleSheets) sheets.add(s);
    for (const s of Array.from(root.styleSheets)) sheets.add(s);
  };
  for (const e of deepElements(el)) {
    const root = e.getRootNode();
    if (root instanceof ShadowRoot) add(root);
  }
  return [...sheets];
}

/** A style rule found while walking, with the media conditions around it. */
export interface WalkedRule {
  rule: CSSStyleRule;
  media: string[];
}

/** Every style rule, including those nested in @media, @layer and @supports. */
export function walkRules(
  rules: CSSRuleList,
  media: string[] = [],
  out: WalkedRule[] = [],
): WalkedRule[] {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      out.push({rule, media});
      // Nested rules (CSS nesting) inherit the parent's media.
      if (rule.cssRules.length) walkRules(rule.cssRules, media, out);
    } else if (rule instanceof CSSMediaRule) {
      walkRules(rule.cssRules, [...media, rule.conditionText], out);
    } else if ('cssRules' in rule) {
      walkRules((rule as CSSGroupingRule).cssRules, media, out);
    }
  }
  return out;
}

/** True when a media list means hover-capable pointers only. */
export const isHoverMedia = (media: string[]) =>
  media.some((m) => /\(\s*hover\s*:\s*hover\s*\)/.test(m));

/** Short component name for reports, from the `components/<name>`. */
export const byComponent = <T extends {component: string}>(items: T[]) => [
  ...new Set(items.map((i) => i.component)),
];

/**
 * Subjects that do not meet a rule yet, by rule. The green test of a suite
 * skips them and the matching `_gap.ts` test covers them; when a component is
 * fixed, delete its entry and the gap test moves to green.
 */
export const KNOWN_GAPS = {
  /** Subjects that still transition a spatial property with reduced motion on. */
  reducedMotion: [] as string[],
  /** Subjects whose RTL layout is not the mirror of the LTR one. */
  rtlMirror: [] as string[],
  /** Disabled parts that can still take focus. */
  disabledFocus: [] as string[],
  /** The disabled outline is not painted at 12% (md.comp.outlined-*.disabled.outline.opacity). */
  disabledOutline: [] as string[],
  /** Disabled text is not painted at 38%. */
  disabledContent: [] as string[],
  /** `<subject id>@<density>` whose hit target is smaller than 48x48. */
  touchTarget: [] as string[],
  /** The keyboard focus ring is set but nothing is drawn (outline: none wins). */
  focusRing: [] as string[],
  /** No `--ripple-hover-opacity` transition (instant hover layer). */
  hoverFade: [] as string[],
  /** A `:hover` rule is not inside `@media (hover: hover)`. */
  hoverGate: [] as string[],
};

/**
 * Checks the spec itself waives, with the reason. Not gaps: the code follows
 * the spec here.
 */
export const SPEC_EXCEPTIONS: {touchTarget: Record<string, string>} = {
  touchTarget: {
    // text-fields.md, Density: "Don't apply density to text fields by
    // default. This lowers their targets below the recommended 48x48 CSS
    // pixels." Density is opt-in; the default (density 0) keeps 48.
    'text-field-filled@-3': 'text-fields: opt-in density lowers the target',
    'text-field-outlined@-3': 'text-fields: opt-in density lowers the target',
  },
};

/**
 * The size of the area around an element's center that hits the element: the
 * largest centered box of which the four corners, inset 1px, still resolve to
 * the element (or something inside it). Measured up to 64px.
 */
export function hitTargetSize(el: Element) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const hits = (hw: number, hh: number) =>
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].every(([dx, dy]) => {
      const hit = document.elementFromPoint(cx + dx * (hw - 1), cy + dy * (hh - 1));
      return !!hit && (hit === el || el.contains(hit));
    });
  const measure = (axis: 'w' | 'h') => {
    // Only grow the axis being measured; the other stays at 4px (the center).
    let size = 4;
    for (let s = 6; s <= 64; s += 2) {
      if (!(axis === 'w' ? hits(s / 2, 2) : hits(2, s / 2))) break;
      size = s;
    }
    return size;
  };
  return {width: measure('w'), height: measure('h')};
}
