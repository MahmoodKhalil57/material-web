/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Converts HTML (the output of a Markdown renderer, a CMS, a
 * template) into a json-render spec of the library's catalog, so content
 * written as HTML is rendered, checked and hydrated like any other spec:
 *
 * - md-gb-* elements become their catalog components: attributes become
 *   props (coerced with each prop's schema: numbers, enums, booleans), and
 *   children with a `slot` attribute go to that named slot;
 * - native elements the Html primitive allows (HTML_TAGS) become Html with
 *   its attributes (HTML_ATTRIBUTES, href, src); text becomes Text, with
 *   white space collapsed as a browser renders it (kept inside <pre>);
 * - a code block (`<pre><code class="language-x">`) becomes DemoCode;
 * - script, style, template and noscript are dropped, and any other element
 *   is unwrapped (its children kept): both are reported as `issues`, so a
 *   build can fail on content the catalog can't express.
 *
 * The HTML comes as a tree of plain nodes (`HtmlNode`), so any parser can
 * feed it: `domToHtmlNodes()` reads DOM nodes (DOMParser, a template), and a
 * server-side parser's tree maps to it in a few lines. `override` converts
 * nodes of the app's own (a component with special content) before the
 * rules above.
 */

import type {Spec, UIElement} from '@json-render/core';
import type {z} from 'zod';

import {COMPONENTS, HTML_TAGS} from './catalog.js';

/** An HTML node: an element (`tag`, `attrs`, `children`) or text (`text`). */
export interface HtmlNode {
  /** The element's tag name, lower case. Absent for text. */
  tag?: string;
  attrs?: Record<string, string>;
  children?: HtmlNode[];
  /** The text of a text node. */
  text?: string;
}

/**
 * Something the conversion can't express: a dropped or an unwrapped element,
 * or a stray slot: an element with a `slot` attribute outside a component,
 * where it fills no slot (often HTML the parser restructured, such as a
 * custom element a Markdown renderer put in a paragraph, split at its first
 * block child).
 */
export interface HtmlToSpecIssue {
  kind: 'dropped' | 'unwrapped' | 'stray-slot';
  tag: string;
}

/** What an `override` gets to convert a node. */
export interface HtmlToSpecContext {
  /** Adds an element to the spec; returns its key. */
  add(element: Omit<UIElement, 'children'> & {children?: string[]}): string;
  /** Converts a node by the rules (and the override); returns its elements' keys. */
  convert(node: HtmlNode, issues: HtmlToSpecIssue[]): string[];
  /** Removes elements (and their descendants) a conversion added. */
  remove(keys: string[]): void;
  /** The text of a node and its descendants. */
  textOf(node: HtmlNode): string;
}

/** Options of `htmlToSpec()`. */
export interface HtmlToSpecOptions {
  /** The prefix of the element keys. Default `h`. */
  prefix?: string;
  /**
   * Converts a node before the rules: return its elements' keys, or
   * undefined to convert it by the rules. Report what it leaves out in
   * `issues`.
   */
  override?: (node: HtmlNode, context: HtmlToSpecContext, issues: HtmlToSpecIssue[]) => string[] | undefined;
}

type Component = (typeof COMPONENTS)[keyof typeof COMPONENTS];
type Shape = Record<string, z.ZodType>;

const DROP = new Set(['script', 'style', 'template', 'noscript']);
const HTML_ALLOWED = new Set<string>(HTML_TAGS);
/** Html attribute -> prop. */
const HTML_PROPS: Record<string, string> = {
  id: 'id',
  role: 'role',
  alt: 'alt',
  type: 'type',
  popovertarget: 'popovertarget',
  target: 'target',
  lang: 'lang',
  colspan: 'colspan',
  rowspan: 'rowspan',
  scope: 'scope',
  'aria-label': 'ariaLabel',
  href: 'href',
  src: 'src',
};

/** The components by tag, with their attribute -> prop maps. */
const BY_TAG = new Map(
  Object.entries(COMPONENTS as Record<string, Component>)
    .filter(([, c]) => !c.tag.startsWith('#'))
    .map(([name, c]) => [c.tag, {name, c, propOf: Object.fromEntries(Object.entries(c.attributes).map(([p, a]) => [a, p]))}]),
);

const shapeOf = (c: Component) => (c.props as unknown as {shape: Shape}).shape;

/** A prop value from an attribute, coerced with the prop's schema. */
function coerce(schema: z.ZodType | undefined, value: string, isBoolean: boolean): unknown {
  if (isBoolean) return value !== 'false';
  if (!schema) return value;
  if (schema.safeParse(value).success) return value;
  const num = Number(value);
  if (value.trim() !== '' && !Number.isNaN(num) && schema.safeParse(num).success) return num;
  return undefined;
}

/** The text of a node and its descendants. */
function textOf(node: HtmlNode): string {
  return node.tag === undefined ? (node.text ?? '') : (node.children ?? []).map(textOf).join('');
}

/** DOM nodes (a parsed document's body, a template's content) as HtmlNodes. */
export function domToHtmlNodes(nodes: Iterable<Node>): HtmlNode[] {
  const out: HtmlNode[] = [];
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      out.push({text: node.nodeValue ?? ''});
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const content = el instanceof HTMLTemplateElement ? el.content.childNodes : el.childNodes;
      out.push({
        tag: el.localName,
        attrs: Object.fromEntries([...el.attributes].map((a) => [a.name, a.value])),
        children: domToHtmlNodes(content),
      });
    }
  }
  return out;
}

/**
 * Converts HTML nodes into a spec of the catalog: a root `Html` div with
 * the nodes' elements.
 *
 * ```js
 * import {domToHtmlNodes, htmlToSpec} from '@material/web/json-render/html.js';
 * const doc = new DOMParser().parseFromString(html, 'text/html');
 * const {spec, issues} = htmlToSpec(domToHtmlNodes(doc.body.childNodes));
 * ```
 */
export function htmlToSpec(nodes: HtmlNode[], options: HtmlToSpecOptions = {}): {spec: Spec; issues: HtmlToSpecIssue[]} {
  const prefix = options.prefix ?? 'h';
  const elements: Record<string, UIElement> = {};
  let n = 0;
  const add: HtmlToSpecContext['add'] = (element) => {
    const key = `${prefix}${(n++).toString(36)}`;
    elements[key] = {children: [], ...element} as UIElement;
    return key;
  };
  const remove = (keys: string[]) => {
    for (const key of keys) {
      const el = elements[key];
      if (!el) continue;
      delete elements[key];
      remove([...(el.children ?? []), ...Object.values(el.slots ?? {}).flat()]);
    }
  };
  const htmlShape = shapeOf(COMPONENTS.Html as Component);

  /**
   * Converts the children of a node: {children, slots}. Only a component's
   * children fill slots; elsewhere a `slot` attribute is a stray slot.
   */
  const convertChildren = (node: HtmlNode, issues: HtmlToSpecIssue[], inPre: boolean, component = false) => {
    const children: string[] = [];
    const slots: Record<string, string[]> = {};
    for (const child of node.children ?? []) {
      const slot = child.attrs?.['slot'];
      if (slot && !component) issues.push({kind: 'stray-slot', tag: child.tag ?? '#text'});
      for (const key of convertNode(child, issues, inPre)) {
        if (slot && component) (slots[slot] ??= []).push(key);
        else children.push(key);
      }
    }
    return {children, slots};
  };

  const convertNode = (node: HtmlNode, issues: HtmlToSpecIssue[], inPre = false): string[] => {
    if (node.tag === undefined) {
      const value = inPre ? (node.text ?? '') : (node.text ?? '').replace(/\s+/g, ' ');
      return value ? [add({type: 'Text', props: {text: value}})] : [];
    }
    const overridden = options.override?.(node, context, issues);
    if (overridden) return overridden;
    const tag = node.tag;
    const attrs = node.attrs ?? {};

    if (DROP.has(tag)) {
      issues.push({kind: 'dropped', tag});
      return [];
    }

    // A code block: highlighted by md-gb-demo-code.
    if (tag === 'pre') {
      const code = (node.children ?? []).find((c) => c.tag === 'code');
      const language = /language-([\w-]+)/.exec((code ?? node).attrs?.['class'] ?? '')?.[1] ?? 'text';
      return [add({type: 'DemoCode', props: {code: textOf(code ?? node).replace(/\n$/, ''), language}})];
    }

    const custom = BY_TAG.get(tag);
    if (custom) {
      const props: Record<string, unknown> = {};
      const booleans = new Set(custom.c.booleans);
      const shape = shapeOf(custom.c);
      for (const [attr, value] of Object.entries(attrs)) {
        const prop = custom.propOf[attr];
        if (!prop) continue;
        const v = coerce(shape[prop], value, booleans.has(prop));
        if (v !== undefined) props[prop] = v;
      }
      let {children, slots} = convertChildren(node, issues, false, true);
      // White space between slotted children isn't the content of a
      // component without a default slot.
      if (!custom.c.slots.includes('default')) {
        const blank = (k: string) => elements[k].type === 'Text' && !String((elements[k].props as {text?: unknown}).text ?? '').trim();
        remove(children.filter(blank));
        children = children.filter((k) => elements[k]);
      }
      return [add({type: custom.name, props, children, ...(Object.keys(slots).length ? {slots} : {})})];
    }

    if (HTML_ALLOWED.has(tag)) {
      const props: Record<string, unknown> = {tag};
      for (const [attr, prop] of Object.entries(HTML_PROPS)) {
        if (attrs[attr] === undefined) continue;
        const v = coerce(htmlShape[prop], attrs[attr], false);
        if (v !== undefined) props[prop] = v;
      }
      // A native element has no slots: a child with a slot attribute stays a
      // child (and is a stray slot).
      const {children} = convertChildren(node, issues, inPre || tag === 'pre');
      return [add({type: 'Html', props, children})];
    }

    // Not in the catalog: keep what it holds.
    issues.push({kind: 'unwrapped', tag});
    return convertChildren(node, issues, inPre).children;
  };

  const context: HtmlToSpecContext = {add, convert: (node, issues) => convertNode(node, issues), remove, textOf};
  const issues: HtmlToSpecIssue[] = [];
  const root = add({type: 'Html', props: {tag: 'div'}});
  elements[root].children = convertChildren({tag: 'div', children: nodes}, issues, false).children;
  return {spec: {root, elements}, issues};
}
