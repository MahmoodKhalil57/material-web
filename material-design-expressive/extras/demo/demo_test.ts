/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-demo-code.js';
import './md-gb-demo.js';

import type {DemoCodeElement} from './demo-code-element.js';
import type {DemoElement} from './demo-element.js';
import {tokenize} from './highlight.js';

const kinds = (code: string, language: string) =>
  tokenize(code, language)
    .filter((t) => t.kind)
    .map((t) => `${t.kind}:${t.text}`);

describe('tokenize()', () => {
  it('highlights HTML tags, attributes and strings', () => {
    expect(kinds('<md-gb-button color="tonal" disabled>Save</md-gb-button>', 'html')).toEqual([
      'tag:<md-gb-button',
      'attr:color',
      'string:"tonal"',
      'attr:disabled',
      'tag:>',
      'tag:</md-gb-button',
      'tag:>',
    ]);
  });

  it('highlights CSS properties, values and at-rules', () => {
    expect(kinds('@media (x) { a { --gap: 4px; } }', 'css')).toContain('keyword:@media');
    expect(kinds('a { --gap: 4px; }', 'css')).toEqual(['punctuation:{', 'property:--gap', 'punctuation:: ', 'number:4px', 'punctuation:;', 'punctuation: }'].map((s) => s.replace(': ', ':')));
  });

  it('highlights JS keywords, strings and comments, not words that contain keywords', () => {
    const t = kinds("const classList = 'a'; // note", 'js');
    expect(t).toContain('keyword:const');
    expect(t).toContain("string:'a'");
    expect(t).toContain('comment:// note');
    expect(t).not.toContain('keyword:class');
  });

  it('keeps every character', () => {
    const code = '<a href="#">x</a>\n.b { c: d }';
    expect(tokenize(code, 'html').map((t) => t.text).join('')).toBe(code);
  });
});

describe('md-gb-demo', () => {
  let demo: DemoElement;
  const file = (language: string, code: string, label = '') => {
    const f = document.createElement('md-gb-demo-code') as DemoCodeElement;
    f.slot = 'code';
    f.language = language;
    f.code = code;
    f.label = label;
    return f;
  };
  const settle = async () => {
    await demo.updateComplete;
    await new Promise((r) => setTimeout(r));
    await demo.updateComplete;
  };

  beforeEach(() => {
    demo = document.createElement('md-gb-demo') as DemoElement;
    demo.label = 'A button';
    demo.innerHTML = '<button>Preview</button>';
    document.body.append(demo);
  });
  afterEach(() => demo.remove());

  it('shows one file without tabs, highlighted', async () => {
    demo.append(file('html', '<b>x</b>'));
    await settle();
    expect(demo.shadowRoot!.querySelector('md-gb-tabs')).toBeNull();
    const code = demo.querySelector('md-gb-demo-code')!;
    await code.updateComplete;
    expect(code.shadowRoot!.querySelector('.tag')?.textContent).toBe('<b');
    expect(demo.shadowRoot!.querySelector('figure')!.getAttribute('aria-label')).toBe('A button');
  });

  it('shows a tab per file and only the selected file', async () => {
    demo.append(file('html', '<b>x</b>', 'HTML'), file('css', 'b { color: red; }', 'CSS'));
    await settle();
    const tabs = demo.shadowRoot!.querySelectorAll('md-gb-tab');
    expect([...tabs].map((t) => t.textContent!.trim())).toEqual(['HTML', 'CSS']);
    const [html, css] = demo.querySelectorAll('md-gb-demo-code');
    expect([html.hidden, css.hidden]).toEqual([false, true]);
    (tabs[1] as HTMLElement).click();
    await settle();
    expect([html.hidden, css.hidden]).toEqual([true, false]);
  });

  it('collapses long code until Show code', async () => {
    demo.append(file('js', 'a\nb\nc\nd\ne\nf'));
    await settle();
    const code = demo.querySelector('md-gb-demo-code')!;
    expect(code.collapsed).toBeTrue();
    const toggle = demo.shadowRoot!.querySelector('md-gb-button')!;
    expect(toggle.textContent!.trim()).toBe('Show code');
    toggle.click();
    await settle();
    expect(code.collapsed).toBeFalse();
    expect(toggle.textContent!.trim()).toBe('Hide code');
  });

  it('copies the selected file', async () => {
    demo.append(file('html', '<i>copy me</i>'));
    await settle();
    const written: string[] = [];
    spyOn(navigator.clipboard, 'writeText').and.callFake(async (text: string) => void written.push(text));
    const copied = new Promise((resolve) => demo.addEventListener('copy', resolve, {once: true}));
    (demo.shadowRoot!.querySelector('md-gb-icon-button') as HTMLElement).click();
    await copied;
    await settle();
    expect(written).toEqual(['<i>copy me</i>']);
    expect(demo.shadowRoot!.querySelector('[role=status]')!.textContent).toBe('Code copied');
  });

  it('renders srcdoc in a sandboxed frame without same-origin, sized to its height', async () => {
    demo.replaceChildren();
    demo.srcdoc = `<script>parent.postMessage({type: 'md-gb-demo-height', height: 222}, '*');</script>`;
    await settle();
    const frame = demo.shadowRoot!.querySelector('iframe')!;
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts allow-forms');
    await new Promise((resolve) => frame.addEventListener('load', resolve, {once: true}));
    await new Promise((r) => setTimeout(r, 50));
    expect(frame.style.blockSize).toBe('222px');
  });

  it('sets the srcdoc frame sandbox from the sandbox property', async () => {
    demo.replaceChildren();
    demo.sandbox = 'allow-scripts allow-same-origin';
    demo.srcdoc = '<p>trusted</p>';
    await settle();
    expect(demo.shadowRoot!.querySelector('iframe')!.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin');
  });

  it('sizes an iframe preview to the height it posts', async () => {
    demo.replaceChildren();
    const frame = document.createElement('iframe');
    frame.srcdoc = `<script>parent.postMessage({type: 'md-gb-demo-height', height: 321}, '*');</script>`;
    demo.append(frame);
    await new Promise((resolve) => frame.addEventListener('load', resolve, {once: true}));
    await new Promise((r) => setTimeout(r, 50));
    expect(frame.style.blockSize).toBe('321px');
  });
});
