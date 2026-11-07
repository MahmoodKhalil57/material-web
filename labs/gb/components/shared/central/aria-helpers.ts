/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Checks a rendered tree against the WAI-ARIA 1.3 role model
 * (`.m3-specs/aria/aria-1.3-model.json`, written by
 * `scripts/m3/gen-aria-model.mjs` from the saved W3C draft). The model is the
 * only source of rules; nothing here is written from memory of ARIA 1.2.
 *
 * The walk follows the accessibility tree: light DOM, open shadow roots and
 * slotted content (flat tree), `aria-owns` reparenting, and it ignores what
 * the tree excludes (`hidden`, `display: none`, `aria-hidden`, the children
 * of a role with presentational children). Roles and ARIA state come from
 * attributes and from `ElementInternals` (`aria-internals.ts`); an attribute
 * wins over internals, as in the browser.
 *
 * Every finding names the rule, the role, the attribute and the spec section.
 */

import './aria-internals.js';

import {internalsOf} from './aria-internals.js';

/** A rule category; each has a deliberately broken fixture in `aria_test.ts`. */
export type Rule =
  | 'role'
  | 'required'
  | 'unsupported'
  | 'prohibited'
  | 'deprecated'
  | 'value'
  | 'context'
  | 'children'
  | 'name'
  | 'name-prohibited'
  | 'idref'
  | 'consistency';

/** The spec section each rule comes from (WAI-ARIA 1.3 section numbers). */
export const SECTIONS: Record<Rule, string> = {
  role: '5.3.1 Abstract Roles, 9.1 Roles',
  required: '5.2.2 Required States and Properties',
  unsupported: '5.2.3 Supported States and Properties',
  prohibited: '5.2.5 Prohibited States and Properties',
  deprecated: '6.8 Definitions of States and Properties (deprecated)',
  value: '6.2.4 Value',
  context: '5.2.7 Required Accessibility Parent Role',
  children: '5.2.6 Allowed Accessibility Child Roles',
  name: '5.2.8 Name From (Accessible Name Required)',
  'name-prohibited': '5.2.8.3 Roles which cannot be named',
  idref: '6.2.4 Value (ID reference)',
  consistency: '6.8 Definitions of States and Properties (state follows the component)',
};

/** One finding. */
export interface Violation {
  rule: Rule;
  /** The effective role of the element (`generic` when it has none). */
  role: string;
  /** The aria-* attribute or `role` the finding is about ('' when none). */
  attr: string;
  section: string;
  message: string;
  /** A short description of the element, with its host chain. */
  target: string;
}

interface RoleDef {
  abstract: boolean;
  superclass: string[];
  requiredContext: Array<{role: string; note: string}>;
  allowedChildren: Array<{role: string; note: string}>;
  requiredProps: string[];
  supportedProps: Array<{name: string; deprecated: boolean}>;
  inheritedProps: Array<{name: string; deprecated: boolean}>;
  prohibitedProps: string[];
  nameFrom: string[];
  nameRequired: boolean;
  childrenPresentational: boolean;
}

interface AttrDef {
  kind: 'state' | 'property';
  deprecated: boolean;
  valueType: string;
  values: string[];
  default?: string;
}

/** The parsed model. */
export interface AriaModel {
  roles: Record<string, RoleDef>;
  attrs: Record<string, AttrDef>;
  globals: string[];
}

let loading: Promise<AriaModel> | undefined;

/** Loads the model once; fails with the command that generates it. */
export function loadModel(): Promise<AriaModel> {
  loading ??= fetch('/.m3-specs/aria/aria-1.3-model.json').then(async (response) => {
    if (!response.ok) {
      throw new Error(
        'ARIA model missing: run `node scripts/m3/gen-aria-model.mjs` ' +
          '(needs .m3-specs/Accessible Rich Internet Applications (WAI-ARIA) 1.3.html)',
      );
    }
    return (await response.json()) as AriaModel;
  });
  return loading;
}

/** Attributes that carry IDREFs, with the property that reflects them. */
const IDREF_ATTRS: Record<string, {prop: string; list: boolean}> = {
  'aria-activedescendant': {prop: 'ariaActiveDescendantElement', list: false},
  'aria-controls': {prop: 'ariaControlsElements', list: true},
  'aria-describedby': {prop: 'ariaDescribedByElements', list: true},
  'aria-details': {prop: 'ariaDetailsElements', list: true},
  'aria-errormessage': {prop: 'ariaErrorMessageElements', list: true},
  'aria-flowto': {prop: 'ariaFlowToElements', list: true},
  'aria-labelledby': {prop: 'ariaLabelledByElements', list: true},
  'aria-owns': {prop: 'ariaOwnsElements', list: true},
};

const SKIPPED_TAGS = new Set(['slot', 'style', 'script', 'template', 'link', 'meta', 'noscript', 'head', 'title']);

/** Roles whose elements add nothing to the accessibility tree structure. */
const TRANSPARENT = new Set(['generic', 'none', 'presentation']);

/** The name of an aria property on ElementInternals, as an attribute name. */
function attrNameOfProp(key: string): string {
  return `aria-${key.slice(4).toLowerCase()}`;
}

const internalsKeys = Object.getOwnPropertyNames(ElementInternals.prototype).filter(
  (k) => k.startsWith('aria') && !/Elements?$/.test(k),
);

/** The role HTML-AAM gives an element without a role attribute. */
function implicitRole(el: Element): string | undefined {
  const tag = el.localName;
  const attr = (n: string) => el.getAttribute(n);
  switch (tag) {
    case 'button':
      return 'button';
    case 'a':
      return el.hasAttribute('href') ? 'link' : 'generic';
    case 'input': {
      const type = (attr('type') ?? 'text').toLowerCase();
      if (type === 'checkbox') return 'checkbox';
      if (type === 'radio') return 'radio';
      if (type === 'range') return 'slider';
      if (['button', 'submit', 'reset', 'image'].includes(type)) return 'button';
      if (type === 'number') return 'spinbutton';
      if (type === 'hidden') return 'none';
      if (type === 'search') return el.hasAttribute('list') ? 'combobox' : 'searchbox';
      return el.hasAttribute('list') ? 'combobox' : 'textbox';
    }
    case 'textarea':
      return 'textbox';
    case 'select':
      return el.hasAttribute('multiple') || Number(attr('size')) > 1 ? 'listbox' : 'combobox';
    case 'option':
      return 'option';
    case 'ul':
    case 'ol':
    case 'menu':
      return 'list';
    case 'li':
      return 'listitem';
    case 'nav':
      return 'navigation';
    case 'main':
      return 'main';
    case 'aside':
      return 'complementary';
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'heading';
    case 'img':
      return attr('alt') === '' ? 'none' : 'img';
    case 'dialog':
      return 'dialog';
    case 'table':
      return 'table';
    case 'tr':
      return 'row';
    case 'td':
      return 'cell';
    case 'th':
      return 'columnheader';
    case 'thead':
    case 'tbody':
    case 'tfoot':
      return 'rowgroup';
    case 'progress':
      return 'progressbar';
    case 'meter':
      return 'meter';
    case 'hr':
      return 'separator';
    case 'fieldset':
      return 'group';
    case 'output':
      return 'status';
    case 'p':
      return 'paragraph';
    case 'svg':
      return undefined;
    default:
      return 'generic';
  }
}

/** One element of the accessibility walk. */
interface ANode {
  el: Element;
  /** The effective role ('generic' when none). */
  role: string;
  /** The role came from a role attribute or ElementInternals. */
  explicit: boolean;
  aria: Map<string, string>;
  /** Element references set through properties or ElementInternals. */
  refs: Map<string, Element[]>;
  /** The nearest accessibility ancestor with a role (not generic/none). */
  parent?: ANode;
  kids: ANode[];
  /** Below a role with presentational children: not exposed. */
  hiddenByParent: boolean;
  /** Findings about the role token itself. */
  roleProblems: string[];
  /** The shadow host chain, for the report. */
  chain: string;
}

/** A readable description of an element. */
function describeEl(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  for (let i = 0; current && i < 4; i++) {
    const id = current.id ? `#${current.id}` : '';
    const role = current.getAttribute('role') ? `[role=${current.getAttribute('role')}]` : '';
    parts.unshift(`${current.localName}${id}${role}`);
    const root: Node = current.getRootNode();
    current = current.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    if (current && !(current.localName.includes('-'))) {
      // Keep only custom-element hosts and the element itself in the chain.
      let next: Element | null = current;
      while (next && !next.localName.includes('-')) {
        const r: Node = next.getRootNode();
        next = next.parentElement ?? (r instanceof ShadowRoot ? r.host : null);
      }
      current = next;
    }
  }
  return parts.join(' > ');
}

/** True when the element is not rendered (and so not in the accessibility tree). */
function isHidden(el: Element): boolean {
  if (el.getAttribute('aria-hidden') === 'true' || (el as HTMLElement).inert) return true;
  const style = getComputedStyle(el);
  return style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse';
}

/** The flat-tree element children of an element (shadow tree and slots). */
function flatChildren(el: Element): Element[] {
  const source = el.shadowRoot ? Array.from(el.shadowRoot.children) : Array.from(el.children);
  const out: Element[] = [];
  for (const child of source) {
    if (child instanceof HTMLSlotElement) {
      const assigned = child.assignedElements({flatten: true});
      out.push(...(assigned.length || child.assignedNodes({flatten: true}).length ? assigned : Array.from(child.children)));
    } else {
      out.push(child);
    }
  }
  return out;
}

/** The tree of an accessibility walk. */
export interface ATree {
  nodes: ANode[];
  model: AriaModel;
}

/** Reads the role and ARIA state of one element, from attributes and internals. */
function read(el: Element, model: AriaModel): ANode {
  const aria = new Map<string, string>();
  for (const a of Array.from(el.attributes)) {
    if (a.name.startsWith('aria-') && !/elements?$/.test(a.name)) aria.set(a.name, a.value);
  }
  const internals = internalsOf(el);
  const refs = new Map<string, Element[]>();
  if (internals) {
    for (const key of internalsKeys) {
      const value = (internals as unknown as Record<string, string | null>)[key];
      const name = attrNameOfProp(key);
      if (key !== 'role' && value != null && !aria.has(name)) aria.set(name, String(value));
    }
    for (const [attr, {prop, list}] of Object.entries(IDREF_ATTRS)) {
      const value = (internals as unknown as Record<string, Element | Element[] | null>)[prop];
      const arr = value == null ? [] : list ? Array.from(value as Element[]) : [value as Element];
      if (arr.length) refs.set(attr, arr);
    }
  }
  for (const [attr, {prop, list}] of Object.entries(IDREF_ATTRS)) {
    // The element reflection of an attribute holds elements set as properties
    // (the attribute is then the empty string).
    if (el.hasAttribute(attr) && el.getAttribute(attr) !== '') continue;
    const value = (el as unknown as Record<string, Element | Element[] | null>)[prop];
    const arr = value == null ? [] : list ? Array.from(value as Element[]) : [value as Element];
    if (arr.length) refs.set(attr, arr);
  }

  // The role: the first valid, non-abstract token of the attribute; else the
  // role set through internals; else the native role.
  const problems: string[] = [];
  let role: string | undefined;
  let explicit = false;
  const sources = [
    ['role attribute', el.getAttribute('role')],
    ['ElementInternals.role', (internals as unknown as {role: string | null} | undefined)?.role ?? null],
  ] as const;
  for (const [label, raw] of sources) {
    if (raw == null) continue;
    const tokens = raw.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    for (const token of tokens) {
      const def = model.roles[token];
      if (def?.abstract) problems.push(`abstract role "${token}" in the ${label}`);
    }
    const valid = tokens.find((t) => model.roles[t] && !model.roles[t].abstract);
    if (valid) {
      role = valid;
      explicit = true;
      break;
    }
    if (!problems.length) problems.push(`"${raw}" is not a WAI-ARIA role (${label})`);
  }
  role ??= implicitRole(el) ?? 'generic';
  return {
    el,
    role,
    explicit,
    aria,
    refs,
    kids: [],
    hiddenByParent: false,
    roleProblems: problems,
    chain: describeEl(el),
  };
}

/** Walks `root` into accessibility nodes. */
export function walk(root: Element, model: AriaModel): ATree {
  const nodes: ANode[] = [];
  const visit = (el: Element, solid: ANode | undefined, presentational: boolean) => {
    if (SKIPPED_TAGS.has(el.localName) || isHidden(el)) return;
    const node = read(el, model);
    node.hiddenByParent = presentational;
    nodes.push(node);
    let childSolid = solid;
    let childPresentational = presentational;
    if (!presentational) {
      node.parent = solid;
      if (!TRANSPARENT.has(node.role)) {
        solid?.kids.push(node);
        childSolid = node;
        if (model.roles[node.role]?.childrenPresentational) childPresentational = true;
      }
    }
    for (const child of flatChildren(el)) visit(child, childSolid, childPresentational);
  };
  visit(root, undefined, false);

  // aria-owns moves the owned element under the owner.
  const byEl = new Map(nodes.map((n) => [n.el, n]));
  for (const owner of nodes) {
    if (TRANSPARENT.has(owner.role)) continue;
    for (const owned of ownedElements(owner)) {
      const node = byEl.get(owned);
      if (!node || TRANSPARENT.has(node.role) || node === owner) continue;
      node.parent?.kids.splice(node.parent.kids.indexOf(node), 1);
      node.parent = owner;
      owner.kids.push(node);
    }
  }
  return {nodes, model};
}

/** The elements an element owns through aria-owns (same root, or references). */
function ownedElements(node: ANode): Element[] {
  return resolveRefs(node, 'aria-owns').found;
}

/** Resolves the IDREF attribute of a node to elements. */
function resolveRefs(node: ANode, attr: string): {found: Element[]; missing: string[]} {
  const found: Element[] = [];
  const missing: string[] = [];
  const raw = node.el.getAttribute(attr) ?? node.aria.get(attr);
  if (raw != null && raw.trim() !== '') {
    const root = node.el.getRootNode() as Document | ShadowRoot;
    for (const id of raw.trim().split(/\s+/)) {
      const target = root.getElementById(id);
      if (target) found.push(target);
      else missing.push(id);
    }
  }
  for (const ref of node.refs.get(attr) ?? []) {
    if (ref.isConnected) found.push(ref);
    else missing.push(`<${ref.localName}> (not connected)`);
  }
  return {found, missing};
}

/** Icon ligature words that went into the accessible name being computed. */
let leaks: string[] | undefined;

/** Collects the text of an element's flat tree, for the name computation. */
function contentText(el: Element, model: AriaModel, seen: Set<Element>): string {
  let out = '';
  const nodes: Node[] = el.shadowRoot ? Array.from(el.shadowRoot.childNodes) : Array.from(el.childNodes);
  const flat: Node[] = [];
  for (const child of nodes) {
    if (child instanceof HTMLSlotElement) {
      const assigned = child.assignedNodes({flatten: true});
      flat.push(...(assigned.length ? assigned : Array.from(child.childNodes)));
    } else {
      flat.push(child);
    }
  }
  for (const child of flat) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? '';
      // Icon-font ligatures ("check") would be read aloud as words.
      const parent = child.parentElement;
      if (leaks && parent && text.trim() && /symbols|material|icons/i.test(getComputedStyle(parent).fontFamily)) {
        leaks.push(text.trim());
      }
      out += ` ${text}`;
    }
    else if (child instanceof Element && !SKIPPED_TAGS.has(child.localName)) {
      if (isHidden(child)) continue;
      out += ` ${nameOf(child, model, seen, true)}`;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** A simplified accessible name computation (accname 1.2) for the checks. */
export function nameOf(el: Element, model: AriaModel, seen = new Set<Element>(), embedded = false): string {
  if (seen.has(el)) return '';
  seen.add(el);
  const node = read(el, model);
  const labelledby = resolveRefs(node, 'aria-labelledby').found;
  if (labelledby.length && !embedded) {
    const text = labelledby.map((target) => nameOf(target, model, new Set(seen), true)).join(' ').trim();
    if (text) return text;
  }
  const label = node.aria.get('aria-label')?.trim();
  if (label) return label;
  const labels = (el as HTMLInputElement).labels;
  if (labels && labels.length) {
    const text = Array.from(labels).map((l) => contentText(l, model, new Set(seen))).join(' ').trim();
    if (text) return text;
  }
  if (el instanceof HTMLImageElement && el.alt) return el.alt;
  if (el instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(el.type) && el.value) return el.value;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.placeholder) return el.placeholder;
  }
  if (el instanceof HTMLFieldSetElement) {
    const legend = el.querySelector(':scope > legend');
    if (legend) return contentText(legend, model, new Set(seen));
  }
  const def = model.roles[node.role];
  const fromContent =
    embedded || !def || def.nameFrom.includes('contents') || node.role === 'generic' || !node.explicit;
  if (fromContent && !(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement)) {
    const text = contentText(el, model, seen);
    if (text) return text;
  }
  return el.getAttribute('title')?.trim() ?? '';
}

/** Checks one value of the given type; returns a message or ''. */
function valueProblem(name: string, value: string, def: AttrDef, role: string): string {
  const type = def.valueType;
  const quote = `"${value}"`;
  const oneOf = (list: string[]) => (list.includes(value) ? '' : `${quote} is not one of ${list.join(' | ')}`);
  switch (type) {
    case 'true/false':
      return oneOf(['true', 'false']);
    case 'tristate': {
      const bad = oneOf(['true', 'false', 'mixed', 'undefined']);
      if (bad) return bad;
      return '';
    }
    case 'true/false/undefined':
      return oneOf(['true', 'false', 'undefined']);
    case 'token':
      return oneOf(def.values);
    case 'token list': {
      const tokens = value.trim().split(/\s+/).filter(Boolean);
      const bad = tokens.filter((t) => !def.values.includes(t));
      return !tokens.length || bad.length ? `${quote} has tokens outside ${def.values.join(' | ')}` : '';
    }
    case 'integer': {
      if (!/^[-+]?\d+$/.test(value.trim())) return `${quote} is not an integer`;
      const n = Number(value);
      if (name === 'aria-level' && n < 1) return `${quote} is below 1`;
      if (name === 'aria-posinset' && n < 1) return `${quote} is below 1`;
      if (name === 'aria-setsize' && n < -1) return `${quote} is below -1`;
      return '';
    }
    case 'number':
      return /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(value.trim()) ? '' : `${quote} is not a number`;
    case 'ID reference':
      return /^\S+$/.test(value) ? '' : `${quote} is not a single ID`;
    case 'ID reference list':
      return value.trim() ? '' : 'the ID list is empty';
    default:
      return '';
  }
}

/** True when the element is focusable by the sequential order or script. */
function isFocusable(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.hasAttribute('tabindex')) return true;
  if (el.shadowRoot?.delegatesFocus) return true;
  if (el.matches('a[href], button, input:not([type=hidden]), select, textarea, summary, [contenteditable]')) {
    return !(el as HTMLButtonElement).disabled;
  }
  return false;
}

/** Runs every rule on a walked tree. */
export function check(tree: ATree): Violation[] {
  const {model} = tree;
  const out: Violation[] = [];
  const add = (node: ANode, rule: Rule, attr: string, message: string) =>
    out.push({rule, role: node.role, attr, section: SECTIONS[rule], message, target: node.chain});

  for (const node of tree.nodes) {
    if (node.hiddenByParent) continue;
    const def = model.roles[node.role];
    for (const problem of node.roleProblems) add(node, 'role', 'role', problem);

    // Supported, prohibited, deprecated and valid values.
    const supported = new Map<string, boolean>();
    for (const g of model.globals) supported.set(g, false);
    for (const name of def?.requiredProps ?? []) supported.set(name, false);
    for (const p of [...(def?.supportedProps ?? []), ...(def?.inheritedProps ?? [])]) {
      supported.set(p.name, (supported.get(p.name) ?? false) || p.deprecated);
    }
    for (const [name, value] of node.aria) {
      const attrDef = model.attrs[name];
      if (!attrDef) {
        add(node, 'unsupported', name, `${name} is not a WAI-ARIA 1.3 attribute`);
        continue;
      }
      if (attrDef.deprecated) {
        add(node, 'deprecated', name, `${name} is deprecated in ARIA 1.3`);
        continue;
      }
      if (def?.prohibitedProps.includes(name)) {
        const naming = name === 'aria-label' || name === 'aria-labelledby';
        add(
          node,
          naming && def.nameFrom.includes('prohibited') ? 'name-prohibited' : 'prohibited',
          name,
          `${name} is prohibited on role ${node.role}`,
        );
        continue;
      }
      if (!supported.has(name)) {
        add(node, 'unsupported', name, `${name} is not supported on role ${node.role}`);
      } else if (supported.get(name)) {
        add(node, 'deprecated', name, `${name} is deprecated on role ${node.role}`);
      }
      // An empty IDREF attribute is the element reflection of a property
      // (resolved above and checked as an IDREF below).
      const reflected = value === '' && node.refs.has(name);
      const problem = reflected ? '' : valueProblem(name, value, attrDef, node.role);
      if (problem) add(node, 'value', name, problem);
      if (name === 'aria-checked' && value === 'mixed' && /^(radio|menuitemradio|switch)$/.test(node.role)) {
        add(node, 'value', name, `"mixed" is not supported on role ${node.role}`);
      }
    }

    // aria-valuenow within the range.
    if (node.aria.has('aria-valuenow') && !Number.isNaN(Number(node.aria.get('aria-valuenow')))) {
      const min = Number(node.aria.get('aria-valuemin') ?? 0);
      const max = Number(node.aria.get('aria-valuemax') ?? 100);
      const now = Number(node.aria.get('aria-valuenow'));
      if (min > max) add(node, 'value', 'aria-valuemin', `aria-valuemin ${min} exceeds aria-valuemax ${max}`);
      else if (now < min || now > max) add(node, 'value', 'aria-valuenow', `aria-valuenow ${now} is outside ${min}..${max}`);
    }
    if (node.aria.has('aria-posinset') && node.aria.has('aria-setsize')) {
      if (Number(node.aria.get('aria-posinset')) > Number(node.aria.get('aria-setsize'))) {
        add(node, 'value', 'aria-posinset', 'aria-posinset exceeds aria-setsize');
      }
    }

    // Required states and properties: only where the role is set by the
    // author (a native element supplies its own state).
    if (node.explicit && def) {
      for (const required of def.requiredProps) {
        if (node.aria.has(required)) continue;
        // separator: aria-valuenow is required only for a focusable separator.
        if (node.role === 'separator' && !isFocusable(node.el)) continue;
        add(node, 'required', required, `role ${node.role} requires ${required}`);
      }
    }

    // Required accessibility parent, through generic/none elements.
    if (def?.requiredContext.length) {
      const parent = node.parent;
      const ok = def.requiredContext.some((ctx) => {
        if (!parent || parent.role !== ctx.role) return false;
        const via = /with accessibility parent (\w+)/.exec(ctx.note)?.[1];
        return !via || parent.parent?.role === via;
      });
      if (!ok) {
        const wanted = [...new Set(def.requiredContext.map((c) => c.role))].join(' | ');
        add(node, 'context', 'role', `role ${node.role} must be inside ${wanted}; its accessibility parent is ${parent ? parent.role : 'the root'}`);
      }
    }

    // Allowed accessibility child roles.
    if (def?.allowedChildren.length) {
      for (const kid of node.kids) {
        const allowed = def.allowedChildren.some((c) => {
          if (c.role !== kid.role) return false;
          const via = /with accessibility child (\w+)/.exec(c.note)?.[1];
          return !via || kid.kids.some((k) => k.role === via);
        });
        if (!allowed) {
          const wanted = [...new Set(def.allowedChildren.map((c) => c.role))].join(' | ');
          add(kid, 'children', 'role', `role ${kid.role} is not an allowed child of ${node.role} (allowed: ${wanted})`);
        }
      }
    }

    // Accessible name.
    if (def) {
      const named = () => nameOf(node.el, model);
      if (def.nameRequired && !named()) {
        add(node, 'name', node.aria.has('aria-label') ? 'aria-label' : '', `role ${node.role} requires an accessible name`);
      }
    }
    // Decorative icon-font text must not leak into the name.
    if (def && (def.nameFrom.includes('contents') || node.role === 'generic') && node.role !== 'generic') {
      leaks = [];
      nameOf(node.el, model);
      const words = leaks;
      leaks = undefined;
      if (words.length) {
        add(node, 'name', '', `the accessible name includes icon-font text "${words.join(' ')}"; mark the decorative icon aria-hidden`);
      }
    }
    // IDREFs.
    for (const attr of Object.keys(IDREF_ATTRS)) {
      if (!node.aria.has(attr) && !node.refs.has(attr)) continue;
      const {found, missing} = resolveRefs(node, attr);
      const expanded = node.aria.get('aria-expanded');
      const selected = node.aria.get('aria-selected');
      // axe-core skips aria-controls of a collapsed or unselected widget: the
      // controlled element may be absent until it opens.
      const optional = attr === 'aria-controls' && (expanded === 'false' || selected === 'false');
      if (missing.length && !optional) {
        add(node, 'idref', attr, `${attr} references ${missing.join(', ')}, which does not exist in the same tree`);
      }
      if (attr === 'aria-activedescendant' && found.length) {
        const target = found[0]!;
        const contains = (container: Element, el: Element): boolean => {
          for (let cur: Element | null = el; cur; ) {
            if (cur === container) return true;
            const root: Node = cur.getRootNode();
            // The flat tree: a slotted element is a child of its slot.
            cur = cur.assignedSlot ?? cur.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
          }
          return false;
        };
        const owned = resolveRefs(node, 'aria-owns').found;
        // A combobox, textbox or searchbox may refer to a descendant of the
        // element its aria-controls refers to (aria-activedescendant).
        const controlled = /^(combobox|textbox|searchbox)$/.test(node.role)
          ? resolveRefs(node, 'aria-controls').found
          : [];
        if (
          !contains(node.el, target) &&
          !owned.some((o) => contains(o, target)) &&
          !controlled.some((o) => contains(o, target))
        ) {
          add(node, 'idref', attr, 'aria-activedescendant does not reference an accessibility descendant');
        }
      }
    }
  }

  // aria-haspopup names the role of the popup. `true` means a menu; a
  // tooltip is not a popup of any listed type. aria-controls (when set) must
  // point at an element of the named role.
  const byEl = new Map(tree.nodes.map((n) => [n.el, n]));
  for (const node of tree.nodes) {
    const popup = node.aria.get('aria-haspopup');
    if (!popup || popup === 'false' || node.hiddenByParent) continue;
    const expected = popup === 'true' ? 'menu' : popup;
    for (const target of resolveRefs(node, 'aria-controls').found) {
      const role = (byEl.get(target) ?? read(target, model)).role;
      // A generic wrapper (such as the host of a component) may contain the popup.
      if (role !== expected && !TRANSPARENT.has(role) && !(expected === 'menu' && role === 'menubar')) {
        add(node, 'consistency', 'aria-haspopup', `aria-haspopup="${popup}" but the controlled element has role ${role}, not ${expected}`);
      }
    }
    for (const described of resolveRefs(node, 'aria-describedby').found) {
      if (read(described, model).role === 'tooltip' && (described as unknown as {persistent?: boolean}).persistent) {
        add(node, 'consistency', 'aria-haspopup', `aria-haspopup="${popup}" on the anchor of a persistent tooltip, which is not a ${expected}`);
      }
    }
  }

  // Exactly one selected tab per single-select tablist.
  for (const node of tree.nodes) {
    if (node.role === 'tablist' && node.explicit !== undefined && !node.hiddenByParent) {
      const tabs = node.kids.filter((k) => k.role === 'tab' && k.aria.has('aria-selected'));
      const multi = node.aria.get('aria-multiselectable') === 'true';
      const selected = tabs.filter((t) => t.aria.get('aria-selected') === 'true');
      if (!multi && tabs.length && selected.length !== 1) {
        add(node, 'consistency', 'aria-selected', `a single-select tablist needs exactly one selected tab, has ${selected.length}`);
      }
    }
  }
  return out;
}

/** Walks and checks an element subtree. */
export async function ariaViolations(root: Element): Promise<Violation[]> {
  const model = await loadModel();
  return check(walk(root, model));
}

/** A readable list for a failing expectation. */
export function describeAria(violations: Violation[]): string {
  return violations
    .map((v) => `[${v.rule}] ${v.target}: ${v.message} (role ${v.role}${v.attr ? `, ${v.attr}` : ''}; spec ${v.section})`)
    .join('\n');
}


// Component state that an ARIA state attribute must follow.
const STATE_PROPS: Record<string, string[]> = {
  'aria-checked': ['checked', 'selected'],
  'aria-selected': ['selected', 'checked'],
  'aria-pressed': ['pressed', 'selected', 'checked'],
  'aria-expanded': ['expanded', 'open'],
};

const INTERACTIVE = new Set([
  'button', 'checkbox', 'radio', 'switch', 'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
  'option', 'link', 'textbox', 'combobox', 'slider', 'spinbutton', 'searchbox', 'gridcell', 'treeitem',
]);

/** How many state pairs the dynamic checks compared (to show they ran). */
export const stats = {compared: 0, disabled: 0};

const nextFrame = () => new Promise((r) => {
  requestAnimationFrame(r);
  setTimeout(r, 16);
});

type Host = Record<string, unknown> & Element & {updateComplete?: Promise<unknown>};

/**
 * The element whose property carries the state that `attr` on `node` shows:
 * the node itself when it has the property, else the shadow host that renders
 * the node, when the node is the only one in that shadow tree with `attr`.
 */
function stateOwner(node: ANode, attr: string, tree: ATree, props: string[]): {host: Host; prop: string} | undefined {
  const own = props.find((p) => typeof (node.el as unknown as Record<string, unknown>)[p] === 'boolean');
  if (own) return {host: node.el as Host, prop: own};
  const root = node.el.getRootNode();
  if (!(root instanceof ShadowRoot)) return undefined;
  const sharing = tree.nodes.filter((n) => n.el.getRootNode() === root && n.aria.has(attr));
  if (sharing.length !== 1) return undefined;
  // A node in the shadow tree stands for the host's open state only when the
  // host has no other expanded node; `open` is not `expanded` (a sheet).
  const hostProps = attr === 'aria-expanded' ? props.filter((p) => p !== 'open') : props;
  const prop = hostProps.find((p) => typeof (root.host as unknown as Record<string, unknown>)[p] === 'boolean');
  return prop ? {host: root.host as Host, prop} : undefined;
}

/**
 * Checks that aria-checked / aria-selected / aria-pressed / aria-expanded of
 * a component follow its state property, now and after flipping the property
 * (the element that shows the state may be the host or one node in its shadow
 * tree). Only attributes that have a boolean state property are compared.
 * Flipping changes the rendered component: use a fresh render.
 */
export async function stateConsistency(root: Element, model: AriaModel): Promise<Violation[]> {
  const out: Violation[] = [];
  const tree = walk(root, model);
  const seen = new Set<string>();
  for (const node of tree.nodes) {
    if (node.hiddenByParent) continue;
    for (const [attr, props] of Object.entries(STATE_PROPS)) {
      if (!node.aria.has(attr)) continue;
      const owner = stateOwner(node, attr, tree, props);
      if (!owner) continue;
      const {host, prop} = owner;
      const original = host[prop] as boolean;
      const indeterminate = (host as unknown as {indeterminate?: boolean}).indeterminate === true;
      if (indeterminate) continue;
      const expect = (value: boolean) => {
        stats.compared++;
        const actual = read(node.el, model).aria.get(attr) ?? null;
        if (actual !== String(value)) {
          const key = `${node.chain}|${attr}|${value}`;
          if (seen.has(key)) return;
          seen.add(key);
          out.push({
            rule: 'consistency',
            role: node.role,
            attr,
            section: SECTIONS.consistency,
            message: `${attr} is "${actual}" but ${host.localName}.${prop} is ${value}`,
            target: node.chain,
          });
        }
      };
      expect(original);
      try {
        host[prop] = !original;
        await host.updateComplete;
        await nextFrame();
        expect(!original);
      } finally {
        host[prop] = original;
        await host.updateComplete;
        await nextFrame();
      }
    }
  }
  return out;
}

/**
 * Checks that a disabled component exposes the state: every interactive node
 * it renders is natively disabled or has aria-disabled="true" (on itself or on
 * the accessibility ancestor inside the component). Flips `disabled` on a
 * fresh render.
 */
export async function disabledConsistency(root: Element, model: AriaModel): Promise<Violation[]> {
  const out: Violation[] = [];
  const before = walk(root, model);
  const hosts = new Set<Host>();
  for (const node of before.nodes) {
    if (node.el.localName.includes('-') && typeof (node.el as unknown as {disabled?: unknown}).disabled === 'boolean') {
      hosts.add(node.el as Host);
    }
  }
  for (const host of hosts) {
    if ((host as unknown as {disabled: boolean}).disabled) continue;
    (host as unknown as {disabled: boolean}).disabled = true;
    stats.disabled++;
    await host.updateComplete;
    await nextFrame();
    const tree = walk(root, model);
    const inside = (el: Element) => {
      for (let cur: Element | null = el; cur; ) {
        if (cur === host) return true;
        const r: Node = cur.getRootNode();
        cur = cur.parentElement ?? (r instanceof ShadowRoot ? r.host : null);
      }
      return false;
    };
    for (const node of tree.nodes) {
      if (node.hiddenByParent || !INTERACTIVE.has(node.role) || !inside(node.el)) continue;
            // `:disabled` matches built-in controls and form-associated custom elements,
      // which browsers expose as disabled.
      const native = node.el.matches(':disabled');
      let ariaDisabled = false;
      for (let cur: ANode | undefined = node; cur; cur = cur.parent) {
        if (cur.aria.get('aria-disabled') === 'true') ariaDisabled = true;
        if (cur.el === host) break;
      }
      // A cell or option that wraps a disabled control is disabled through it.
      const throughKid = (n: ANode): boolean =>
        n.kids.some((k) => (INTERACTIVE.has(k.role) && (k.el.matches(':disabled') || k.aria.get('aria-disabled') === 'true')) || throughKid(k));
      if (!native && !ariaDisabled && !throughKid(node)) {
        out.push({
          rule: 'consistency',
          role: node.role,
          attr: 'aria-disabled',
          section: SECTIONS.consistency,
          message: `${host.localName} is disabled but this ${node.role} is not exposed as disabled`,
          target: node.chain,
        });
      }
    }
    (host as unknown as {disabled: boolean}).disabled = false;
    await host.updateComplete;
  }
  return out;
}

/** Renders markup in a fresh container; `cleanup` removes it. */
export async function renderMarkup(html: string) {
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);
  await Promise.all(
    Array.from(container.querySelectorAll('*')).map((e) => (e as {updateComplete?: Promise<unknown>}).updateComplete),
  );
  return {container, cleanup: () => container.remove()};
}

/** Checks markup and returns the findings, as a rule/attr list for assertions. */
export async function checkMarkup(html: string): Promise<Violation[]> {
  const {container, cleanup} = await renderMarkup(html);
  try {
    return await ariaViolations(container);
  } finally {
    cleanup();
  }
}
