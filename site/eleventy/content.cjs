/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A page's content (the HTML of its Markdown, with the shortcodes' output)
 * as a json-render spec of the library's catalog, with the library's
 * htmlToSpec() (json-render/html.ts), so the docs' content, like their
 * shell, is only what a user of the library can build. What is the docs'
 * own:
 *
 * - the HTML comes from parse5 (Node has no DOM);
 * - the heading permalinks (a.anchor, markdown-it-anchor) are left out
 *   (the headings keep their ids);
 * - md-gb-demo keeps its code files; its example becomes its children, or,
 *   when the example has its own styles or elements the catalog doesn't
 *   have, a document in its `srcdoc` (eleventy/demo.cjs frameDoc).
 *
 * What the catalog can't express (dropped and unwrapped elements) is in
 * `issues`, and counted in `stats` for the build's report.
 */

const {parseFragment, serialize} = require('parse5');
const {frameDoc} = require('./demo.cjs');
const {measuredHeight} = require('./frame-heights.cjs');

/**
 * parse5 nodes as the library's HtmlNodes, and each HtmlNode's parse5 node
 * (a demo's example is serialized into its frame as written).
 */
function toHtmlNodes(nodes, origin) {
  const out = [];
  for (const n of nodes) {
    if (n.nodeName === '#text') {
      out.push({text: n.value});
    } else if (n.tagName) {
      const node = {
        tag: n.tagName,
        attrs: Object.fromEntries((n.attrs ?? []).map((a) => [a.name, a.value])),
        children: toHtmlNodes((n.tagName === 'template' ? n.content : n).childNodes ?? [], origin),
      };
      origin.set(node, n);
      out.push(node);
    }
  }
  return out;
}

/**
 * @param {string} html The content HTML.
 * @param {object} ctx `htmlToSpec` (the library's), `lib` (the library URL
 *     for demo frames), `prefix` (element keys), `stats` (counts by kind).
 * @return {{spec: object, issues: Array<{kind: string, tag: string}>}}
 */
function contentSpec(html, {htmlToSpec, lib = '', prefix = 'c', stats = new Map()}) {
  const count = (key) => stats.set(key, (stats.get(key) ?? 0) + 1);
  const origin = new WeakMap();

  /** A demo: its code files, and its example as children or a document. */
  const demo = (node, ctx, issues) => {
    const attrs = node.attrs ?? {};
    const props = {};
    if (attrs.label) props.label = attrs.label;
    if (attrs['preview-height']) props.previewHeight = Number(attrs['preview-height']);
    const codes = [];
    let css = '';
    let preview = null;
    for (const child of node.children ?? []) {
      if (child.tag === 'md-gb-demo-code') codes.push(...ctx.convert(child, issues));
      else if (child.tag === 'style') css += ctx.textOf(child);
      else if (child.tag === 'iframe') props.srcdoc = child.attrs?.srcdoc ?? '';
      else if (child.tag) preview = child;
    }
    let children = [];
    if (!props.srcdoc && preview) {
      const attempt = [];
      const tried = ctx.convert(preview, attempt);
      if (!css && !attempt.length) {
        children = tried;
      } else {
        // Its own styles, or elements the catalog doesn't have: a document,
        // which keeps them (so what the attempt left out isn't an issue).
        ctx.remove(tried);
        const id = preview.attrs?.id ?? 'demo';
        props.srcdoc = frameDoc({id: attrs.id ?? id, html: `<div id="${id}">${serialize(origin.get(preview))}</div>`, css, js: '', lib});
        count('demo as a document');
      }
    }
    // The site's own examples: same origin, so the document loads the
    // page's fonts (frameDoc) without CORS.
    if (props.srcdoc) props.sandbox = 'allow-scripts allow-same-origin allow-forms';
    // A frame reserves its measured height (frame-heights.cjs), so the page
    // doesn't move as it loads.
    const measured = props.srcdoc && measuredHeight(props.srcdoc);
    if (measured) props.previewHeight = measured;
    count('demo');
    return [ctx.add({type: 'Demo', props, children, slots: {code: codes}})];
  };

  const {spec, issues} = htmlToSpec(toHtmlNodes(parseFragment(html).childNodes, origin), {
    prefix,
    override: (node, ctx, issues) => {
      // The heading permalinks: the heading keeps its id.
      if (node.tag === 'a' && /(^|\s)anchor(\s|$)/.test(node.attrs?.class ?? '')) return [];
      if (node.tag === 'md-gb-demo') return demo(node, ctx, issues);
      return undefined;
    },
  });
  for (const issue of issues) count(`${issue.kind} <${issue.tag}>`);
  return {spec, issues};
}

module.exports = {contentSpec};
