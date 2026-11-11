/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A page's content (the HTML of its Markdown, with the shortcodes' output)
 * as a json-render spec of the library's catalog, so the docs' content, like
 * their shell, is only what a user of the library can build:
 *
 * - md-gb-* elements become their catalog components: attributes become
 *   props (coerced with each prop's schema), `slot` attributes named slots;
 * - native elements of the catalog's Html primitive become Html, with its
 *   allowed attributes; text becomes Text;
 * - a code block (<pre><code class="language-x">) becomes md-gb-demo-code;
 * - md-gb-demo keeps its code files; its example becomes its children, or,
 *   when the example has its own styles, script or elements the catalog
 *   doesn't have, a document in its `srcdoc` (eleventy/demo.cjs frameDoc);
 * - the heading permalinks (a.anchor) are left out (headings keep their id);
 * - anything else is unwrapped (its children kept) and script, style and
 *   template are dropped, both counted in `stats` for the build's report.
 */

const {parseFragment, serialize, serializeOuter} = require('parse5');
const {frameDoc} = require('../eleventy/demo.cjs');
const {shapeProps} = require('../eleventy/shapes.cjs');

const DROP = new Set(['script', 'style', 'template', 'noscript']);
/** Html attribute -> prop. */
const HTML_ATTRS = {
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

const attrsOf = (node) => Object.fromEntries((node.attrs ?? []).map((a) => [a.name, a.value]));

/** The value of `name` on the node or its closest ancestor that has it. */
function closestAttr(node, name) {
  for (let n = node; n; n = n.parentNode) {
    const value = n.attrs?.find((a) => a.name === name)?.value;
    if (value) return value;
  }
  return '';
}

/** The class list of the node and its ancestors, joined. */
function classesUp(node) {
  let out = '';
  for (let n = node; n; n = n.parentNode) out += ' ' + (n.attrs?.find((a) => a.name === 'class')?.value ?? '');
  return out;
}

const textOf = (node) =>
  node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(textOf).join('');

/**
 * @param {string} html The content HTML.
 * @param {object} ctx `components` (the catalog's COMPONENTS), `lib` (the
 *     library URL for demo frames), `prefix` (element keys), `stats`.
 * @return {{spec: object, stats: Map<string, number>}}
 */
function contentSpec(html, {components, lib = '', prefix = 'c', stats = new Map()}) {
  const byTag = new Map();
  for (const [name, c] of Object.entries(components)) {
    if (!c.tag.startsWith('#')) byTag.set(c.tag, {name, c, propOf: Object.fromEntries(Object.entries(c.attributes).map(([p, a]) => [a, p]))});
  }
  const htmlTags = new Set(components.Html.props.shape.tag.options);
  const htmlShape = components.Html.props.shape;
  const count = (key) => stats.set(key, (stats.get(key) ?? 0) + 1);

  const elements = {};
  /** Nodes already converted as part of another (a tile's icon). */
  const consumed = new WeakSet();
  let n = 0;
  const add = (el) => {
    const key = `${prefix}${(n++).toString(36)}`;
    elements[key] = {children: [], ...el};
    return key;
  };

  /** A prop value from an attribute, coerced with the prop's schema. */
  const coerce = (schema, value, isBoolean) => {
    if (isBoolean) return value !== 'false';
    if (!schema) return value;
    if (schema.safeParse(value).success) return value;
    const num = Number(value);
    if (value.trim() !== '' && !Number.isNaN(num) && schema.safeParse(num).success) return num;
    return undefined;
  };

  /**
   * Converts the children of a node. Returns {children, slots}; `issues`
   * collects what had to be unwrapped or dropped (for demo previews).
   */
  const convertChildren = (node, issues, inPre = false) => {
    const children = [];
    const slots = {};
    for (const child of node.childNodes ?? []) {
      const slot = (child.attrs ?? []).find((a) => a.name === 'slot')?.value;
      for (const key of convert(child, issues, inPre)) {
        if (slot && elements[key]) (slots[slot] ??= []).push(key);
        else children.push(key);
      }
    }
    return {children, slots};
  };

  /** Converts a node; returns the keys of the elements it became. */
  const convert = (node, issues, inPre = false) => {
    if (node.nodeName === '#text') {
      // Whitespace collapses as the browser renders it (exact inside <pre>).
      const value = inPre ? node.value : node.value.replace(/\s+/g, ' ');
      return value ? [add({type: 'Text', props: {text: value}})] : [];
    }
    if (!node.tagName) return []; // comments, doctype
    const tag = node.tagName;
    const attrs = attrsOf(node);

    if (DROP.has(tag)) {
      count(`dropped <${tag}>`);
      issues.push(tag);
      return [];
    }
    // The heading permalinks: the heading keeps its id.
    if (tag === 'a' && /(^|\s)anchor(\s|$)/.test(attrs.class ?? '')) return [];

    // A code block: highlighted by md-gb-demo-code.
    if (tag === 'pre') {
      const code = (node.childNodes ?? []).find((c) => c.tagName === 'code');
      const language = /language-([\w-]+)/.exec((code ?? node).attrs?.find((a) => a.name === 'class')?.value ?? '')?.[1] ?? 'text';
      return [add({type: 'DemoCode', props: {code: textOf(code ?? node).replace(/\n$/, ''), language}})];
    }

    if (tag === 'md-gb-demo') return [demo(node, attrs)];

    if (consumed.has(node)) return [];

    // A Material shape (eleventy/shapes.cjs) is md-gb-shape, colored by the tone
    // of the tile or card around it (or a compatibility row's status) and
    // sized by what it decorates. A tile's icon, next to it, goes on it.
    if (tag === 'svg' && attrs['data-shape']) {
      const props = shapeProps(attrs, {
        tone: closestAttr(node, 'data-tone'),
        state: closestAttr(node, 'data-state'),
        classes: classesUp(node),
      });
      const icon = (node.parentNode?.childNodes ?? []).find((c) => c.tagName === 'md-gb-icon');
      const children = icon ? convert(icon, issues) : [];
      if (icon) consumed.add(icon);
      count('Material shape as md-gb-shape');
      return [add({type: 'Shape', props, children})];
    }

    // An SVG with its own colors (a logo) is an image of itself; a
    // decorative one drawn in currentColor (an icon-like bullet) is left
    // out, since an image can't take the text color.
    if (tag === 'svg') {
      const markup = serializeOuter(node);
      const hidden = attrs['aria-hidden'] === 'true';
      if (/currentColor/i.test(markup) && hidden) {
        count('dropped decorative <svg> (currentColor)');
        return [];
      }
      const svg = markup.includes('xmlns=') ? markup : markup.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      count('<svg> as an image');
      return [
        add({
          type: 'Html',
          props: {tag: 'img', alt: hidden ? '' : (attrs['aria-label'] ?? ''), src: `data:image/svg+xml,${encodeURIComponent(svg)}`},
        }),
      ];
    }

    const custom = byTag.get(tag);
    if (custom) {
      const props = {};
      const booleans = new Set(custom.c.booleans);
      for (const [attr, value] of Object.entries(attrs)) {
        const prop = custom.propOf[attr];
        if (!prop) continue;
        const v = coerce(custom.c.props.shape[prop], value, booleans.has(prop));
        if (v !== undefined) props[prop] = v;
      }
      let {children, slots} = convertChildren(node, issues);
      // Whitespace between slotted children isn't content of a component
      // without a default slot.
      if (!custom.c.slots.includes('default')) {
        children = children.filter((k) => !(elements[k].type === 'Text' && !String(elements[k].props.text).trim()));
      }
      return [add({type: custom.name, props, children, ...(Object.keys(slots).length ? {slots} : {})})];
    }

    if (htmlTags.has(tag)) {
      const props = {tag};
      for (const [attr, prop] of Object.entries(HTML_ATTRS)) {
        if (attrs[attr] === undefined) continue;
        const v = coerce(htmlShape[prop], attrs[attr], false);
        if (v !== undefined) props[prop] = v;
      }
      const {children, slots} = convertChildren(node, issues, inPre || tag === 'pre');
      // Native elements have no named slots: a slotted child stays a child,
      // with its slot set by its parent component's spec (keys in `slots`).
      return [add({type: 'Html', props, children: [...children, ...Object.values(slots).flat()]})];
    }

    // Not in the catalog: keep what it holds.
    count(`unwrapped <${tag}>`);
    issues.push(tag);
    return convertChildren(node, issues, inPre).children;
  };

  /** A demo: its code files, and its example as children or a document. */
  const demo = (node, attrs) => {
    const props = {};
    if (attrs.label) props.label = attrs.label;
    if (attrs['preview-height']) props.previewHeight = Number(attrs['preview-height']);
    const codes = [];
    let css = '';
    let preview = null;
    for (const child of node.childNodes ?? []) {
      if (child.tagName === 'md-gb-demo-code') codes.push(...convert(child, []));
      else if (child.tagName === 'style') css += textOf(child);
      else if (child.tagName === 'iframe') props.srcdoc = attrsOf(child).srcdoc ?? '';
      else if (child.tagName) preview = child;
    }
    let children = [];
    if (!props.srcdoc && preview) {
      const issues = [];
      const before = n;
      const counted = new Map(stats);
      const tried = convert(preview, issues);
      if (!css && !issues.length) {
        children = tried;
      } else {
        // Its own styles, or elements the catalog doesn't have: a document,
        // which keeps them, so what the attempt unwrapped isn't reported.
        for (let i = before; i < n; i++) delete elements[`${prefix}${i.toString(36)}`];
        stats.clear();
        for (const [k, v] of counted) stats.set(k, v);
        const id = attrsOf(preview).id ?? 'demo';
        props.srcdoc = frameDoc({id: attrs.id ?? id, html: `<div id="${id}">${serialize(preview)}</div>`, css, js: '', lib});
        count('demo as a document');
      }
    }
    // The site's own examples, as in the old shell: same origin, so the
    // document loads the page's fonts (frameDoc) without CORS.
    if (props.srcdoc) props.sandbox = 'allow-scripts allow-same-origin allow-forms';
    count('demo');
    return add({type: 'Demo', props, children, slots: {code: codes}});
  };

  const root = add({type: 'Html', props: {tag: 'div'}});
  const issues = [];
  for (const child of parseFragment(html).childNodes) {
    elements[root].children.push(...convert(child, issues));
  }
  return {spec: {root, elements}, stats};
}

module.exports = {contentSpec};
