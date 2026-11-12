/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import type {Spec} from '@json-render/core';

import {
  checkSpec,
  domToHtmlNodes,
  embedSpec,
  hydrateSpec,
  htmlToSpec,
  readEmbeddedSpec,
  renderSpecToString,
  type HtmlNode,
} from './index.js';

/** An HTML fragment as HtmlNodes, through a template (which keeps every node where it is). */
function nodes(html: string): HtmlNode[] {
  const template = document.createElement('template');
  template.innerHTML = html;
  return domToHtmlNodes(template.content.childNodes);
}

/** The elements of a spec under its root, by type, in order. */
function types(spec: Spec): string[] {
  const out: string[] = [];
  const walk = (key: string) => {
    const el = spec.elements[key];
    out.push(el.type === 'Html' ? `Html:${(el.props as {tag: string}).tag}` : el.type);
    for (const k of [...(el.children ?? []), ...Object.values(el.slots ?? {}).flat()]) walk(k);
  };
  for (const k of spec.elements[spec.root].children ?? []) walk(k);
  return out;
}

const only = (spec: Spec, type: string) => Object.values(spec.elements).filter((e) => e.type === type);

describe('htmlToSpec()', () => {
  it('converts catalog elements, native elements and text', () => {
    const {spec, issues} = htmlToSpec(nodes('<h2 id="a">Title</h2><p>Some <strong>bold</strong> text</p><md-gb-button color="tonal">Go</md-gb-button>'));
    expect(issues).toEqual([]);
    expect(types(spec)).toEqual(['Html:h2', 'Text', 'Html:p', 'Text', 'Html:strong', 'Text', 'Text', 'Button', 'Text']);
    expect(only(spec, 'Html').find((e) => (e.props as {tag: string}).tag === 'h2')!.props).toEqual({tag: 'h2', id: 'a'});
    expect(only(spec, 'Button')[0].props).toEqual({color: 'tonal'});
    expect(checkSpec(spec).valid).toBeTrue();
  });

  it("coerces attributes with each prop's schema: numbers, enums, booleans", () => {
    const {spec} = htmlToSpec(nodes('<md-gb-grid span="3"></md-gb-grid><md-gb-stack wrap gap="400" direction="sideways"></md-gb-stack>'));
    expect(only(spec, 'Grid')[0].props).toEqual({span: 3});
    // An invalid enum value is left out; a boolean attribute is true.
    expect(only(spec, 'Stack')[0].props).toEqual({wrap: true, gap: '400'});
  });

  it('puts children with a slot attribute in that slot', () => {
    const {spec} = htmlToSpec(nodes('<md-gb-list-item>Label<span slot="supporting-text">More</span></md-gb-list-item>'));
    const item = only(spec, 'ListItem')[0];
    expect(item.children!.length).toBe(1);
    expect(Object.keys(item.slots!)).toEqual(['supporting-text']);
  });

  it('collapses white space, except in a code block, which becomes DemoCode', () => {
    const {spec} = htmlToSpec(nodes('<p>a\n   b</p><pre><code class="language-js">let a = 1;\n  a++;\n</code></pre>'));
    expect(only(spec, 'Text')[0].props).toEqual({text: 'a b'});
    expect(only(spec, 'DemoCode')[0].props).toEqual({code: 'let a = 1;\n  a++;', language: 'js'});
  });

  it('drops scripts and styles and unwraps unknown elements, and reports both', () => {
    const {spec, issues} = htmlToSpec(nodes('<script>x()</script><style>p{}</style><my-widget><p>kept</p></my-widget>'));
    expect(issues).toEqual([
      {kind: 'dropped', tag: 'script'},
      {kind: 'dropped', tag: 'style'},
      {kind: 'unwrapped', tag: 'my-widget'},
    ]);
    expect(types(spec)).toEqual(['Html:p', 'Text']);
  });

  it('reports a stray slot: a component the parser split (a custom element in a paragraph)', () => {
    // A Markdown renderer wraps an inline custom element in <p>: the parser
    // closes the paragraph at the first <div>, which leaves the item.
    const {issues} = htmlToSpec(nodes('<p><md-gb-list><md-gb-list-item>A<div slot="nested">More</div></md-gb-list-item></md-gb-list></p>'));
    expect(issues).toContain({kind: 'stray-slot', tag: 'div'});
    // Written as a block, it converts cleanly.
    expect(htmlToSpec(nodes('<md-gb-list><md-gb-list-item>A<div slot="nested">More</div></md-gb-list-item></md-gb-list>')).issues).toEqual([]);
  });

  it('lets the app convert its own nodes first', () => {
    const anchor = (node: HtmlNode) => node.tag === 'a' && node.attrs?.['class'] === 'anchor';
    const {spec} = htmlToSpec(nodes('<h2>T<a class="anchor" href="#t">#</a></h2>'), {
      override: (node, ctx) => (anchor(node) ? [] : node.tag === 'h2' ? [ctx.add({type: 'Html', props: {tag: 'h3', text: ctx.textOf(node)}})] : undefined),
    });
    expect(types(spec)).toEqual(['Html:h3']);
    expect(only(spec, 'Html').find((e) => (e.props as {tag: string}).tag === 'h3')!.props).toEqual({tag: 'h3', text: 'T#'});
  });

  it('can take back a conversion (context.remove)', () => {
    let attempt: string[] = [];
    const {spec} = htmlToSpec(nodes('<div><p>a</p><p>b</p></div>'), {
      override: (node, ctx, issues) => {
        if (node.tag !== 'div') return undefined;
        attempt = (node.children ?? []).flatMap((c) => ctx.convert(c, issues));
        ctx.remove(attempt);
        return [ctx.add({type: 'Html', props: {tag: 'p', text: 'replaced'}})];
      },
    });
    expect(Object.keys(spec.elements).length).toBe(2);
    expect(attempt.some((k) => spec.elements[k])).toBeFalse();
  });
});

describe('islands and embedded specs', () => {
  const shell: Spec = {
    root: 'r',
    elements: {
      r: {type: 'Html', props: {tag: 'div'}, children: ['title', 'content']},
      title: {type: 'Html', props: {tag: 'h1', text: 'Shell'}, children: []},
      content: {type: 'Html', props: {tag: 'div', id: 'content'}, children: []},
    },
  };

  it('renders an island inside the static HTML', () => {
    const html = renderSpecToString(shell, {islands: {content: '<p id="kept">Static</p>'}});
    expect(html).toBe('<div><h1>Shell</h1><div id="content"><p id="kept">Static</p></div></div>');
  });

  it("keeps an island's nodes through hydration", () => {
    const container = document.createElement('div');
    container.innerHTML = renderSpecToString(shell, {islands: {content: '<p id="kept">Static</p>'}});
    document.body.append(container);
    const kept = container.querySelector('#kept')!;
    hydrateSpec(shell, container, {islands: ['content']});
    expect(container.querySelector('#content #kept')).toBe(kept);
    expect(container.querySelector('h1')!.textContent).toBe('Shell');
    container.remove();
  });

  it('embeds a spec in a page and reads it back, with text that could close the script', () => {
    const spec: Spec = {root: 't', elements: {t: {type: 'Text', props: {text: '</script><b>x</b>'}, children: []}}};
    const doc = new DOMParser().parseFromString(`<!doctype html><body>${embedSpec(spec, 'app-spec')}</body>`, 'text/html');
    expect(doc.querySelectorAll('script').length).toBe(1);
    expect(readEmbeddedSpec('app-spec', doc)).toEqual(spec);
    expect(readEmbeddedSpec('missing', doc)).toBeNull();
  });
});
