/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../all.js';

import type {Spec} from '@json-render/core';

import {hydrateSpec, INNOCUOUS_URL, renderSpec, renderSpecToString} from './index.js';

const text = (t: unknown) => ({type: 'Text', props: {text: t}, children: [] as string[]});

/** The tree of elements (tag and slot) and non-blank text, for comparing renders. */
function shape(root: Node): string {
  const out: string[] = [];
  const walk = (node: Node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent!.trim();
        if (t) out.push(JSON.stringify(t));
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const slot = el.getAttribute('slot');
        out.push(`<${el.localName}${slot ? ` slot=${slot}` : ''}>`);
        walk(el);
        out.push(`</${el.localName}>`);
      }
    }
  };
  walk(root);
  return out.join('');
}

async function settle(root: ParentNode) {
  await new Promise((r) => setTimeout(r));
  await Promise.all([...root.querySelectorAll('*')].map((el) => (el as Element & {updateComplete?: unknown}).updateComplete));
}

const SCREEN: Spec = {
  root: 'root',
  state: {title: 'Settings', items: [{id: 'a', name: 'Phone'}, {id: 'b', name: 'Laptop'}], beta: false},
  elements: {
    root: {type: 'Prose', props: {}, children: ['title', 'intro', 'dialog', 'list', 'beta']},
    title: {type: 'Html', props: {tag: 'h1', text: {$state: '/title'}}, children: []},
    intro: {type: 'Html', props: {tag: 'p'}, children: ['intro-text', 'link']},
    'intro-text': text('Read the '),
    link: {type: 'Html', props: {tag: 'a', href: '/guide/', text: 'guide'}, children: []},
    dialog: {type: 'Dialog', props: {open: false}, children: ['body'], slots: {headline: ['headline'], actions: ['ok']}},
    headline: text('Reset?'),
    body: text('This resets every setting.'),
    ok: {type: 'Button', props: {color: 'tonal'}, children: ['ok-label']},
    'ok-label': text('Reset'),
    list: {type: 'List', props: {ariaLabel: 'Devices'}, children: ['item'], repeat: {statePath: '/items', key: 'id'}},
    item: {type: 'ListItem', props: {}, children: ['name']},
    name: {type: 'Text', props: {text: {$item: 'name'}}, children: []},
    beta: {type: 'Html', props: {tag: 'p', text: 'Beta'}, children: [], visible: {$state: '/beta', eq: true}},
  },
};

describe('renderSpecToString', () => {
  it('renders elements, attributes, slots and text', () => {
    const html = renderSpecToString({
      root: 'b',
      elements: {
        b: {type: 'Button', props: {color: 'tonal', size: 'lg', softDisabled: true, square: false, ariaLabel: 'Save'}, children: ['t']},
        t: text('Save'),
      },
    });
    expect(html).toBe('<md-gb-button color="tonal" size="lg" soft-disabled aria-label="Save">Save</md-gb-button>');
  });

  it('resolves state, visibility and repeats at build time', () => {
    const html = renderSpecToString(SCREEN);
    expect(html).toContain('<h1>Settings</h1>');
    expect(html).toContain('<md-gb-list-item>Phone</md-gb-list-item><md-gb-list-item>Laptop</md-gb-list-item>');
    expect(html).not.toContain('Beta');
    expect(renderSpecToString(SCREEN, {state: {...SCREEN.state, beta: true}})).toContain('<p>Beta</p>');
  });

  it('escapes text and attributes, and sanitizes URLs and tags', () => {
    const warnings: string[] = [];
    const html = renderSpecToString(
      {
        root: 'root',
        elements: {
          root: {type: 'Html', props: {tag: 'div', ariaLabel: 'a "quoted" <label>'}, children: ['t', 'a', 's', 'img']},
          t: text('<script>alert(1)</script> & co'),
          a: {type: 'Html', props: {tag: 'a', href: 'javascript:alert(1)', target: '_blank', text: 'x'}, children: []},
          s: {type: 'Html', props: {tag: 'script', text: 'alert(1)'}, children: []},
          img: {type: 'Html', props: {tag: 'img', src: 'javascript:alert(1)', alt: 'x'}, children: []},
        },
      },
      {onWarning: (m) => warnings.push(m)},
    );
    expect(html).toContain('aria-label="a &quot;quoted&quot; &lt;label&gt;"');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; co');
    expect(html).toContain(`href="${INNOCUOUS_URL}"`);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('<script');
    expect(html).toContain('<img alt="x">');
    expect(warnings.length).toBe(2);
  });

  it('has the same structure as renderSpec()', async () => {
    const live = document.createElement('div');
    document.body.append(live);
    renderSpec(SCREEN, live);
    await settle(live);
    const staticHtml = document.createElement('template');
    staticHtml.innerHTML = renderSpecToString(SCREEN);
    expect(shape(staticHtml.content)).toBe(shape(live));
    live.remove();
  });
});

describe('hydrateSpec', () => {
  it('replaces the static markup with the live spec', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderSpecToString(SCREEN);
    document.body.append(container);
    const before = shape(container);
    const view = hydrateSpec(SCREEN, container);
    await settle(container);
    expect(shape(container)).withContext('same structure').toBe(before);
    view.store.set('/title', 'Preferences');
    await settle(container);
    expect(container.querySelector('h1')?.textContent).toBe('Preferences');
    container.remove();
  });
});
