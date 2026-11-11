/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import './md-gb-prose.js';

/** The computed value of a CSS custom property (its token) as resolved. */
function token(name: string): string {
  const probe = document.createElement('div');
  probe.style.font = `var(${name})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).font;
  probe.remove();
  return value;
}

describe('md-gb-prose', () => {
  let prose: HTMLElement;
  beforeAll(() => adoptStyles(document, [m3Styles]));
  beforeEach(() => {
    prose = document.createElement('md-gb-prose');
    prose.innerHTML =
      '<h1>Title</h1><h2>Section</h2><h3>Sub</h3><p>Text <a href="#x">link</a> <code>x</code></p>' +
      '<ul><li>One</li></ul><pre><code>let a = 1;</code></pre><table><tr><th>A</th><td>1</td></tr></table>';
    document.body.append(prose);
  });
  afterEach(() => prose.remove());

  it('keeps its children in the light DOM', () => {
    expect(prose.shadowRoot).toBeNull();
    expect(prose.querySelector('h2')?.textContent).toBe('Section');
  });

  it('styles text with the M3 type scale (typography.md, Applying type)', () => {
    const font = (sel: string) => getComputedStyle(prose.querySelector(sel)!).font;
    expect(font('h1')).withContext('h1: headline large').toBe(token('--md-sys-typescale-headline-lg'));
    expect(font('h2')).withContext('h2: headline small').toBe(token('--md-sys-typescale-headline-sm'));
    expect(font('h3')).withContext('h3: title large').toBe(token('--md-sys-typescale-title-lg'));
    expect(font('p')).withContext('p: body large').toBe(token('--md-sys-typescale-body-lg'));
  });

  it('colors links with the primary role and code blocks with a surface container', () => {
    const color = (sel: string, prop: 'color' | 'backgroundColor') => getComputedStyle(prose.querySelector(sel)!)[prop];
    const probe = document.createElement('div');
    document.body.append(probe);
    probe.style.color = 'var(--md-sys-color-primary)';
    probe.style.backgroundColor = 'var(--md-sys-color-surface-container)';
    const expected = getComputedStyle(probe);
    expect(color('a', 'color')).toBe(expected.color);
    expect(color('pre', 'backgroundColor')).toBe(expected.backgroundColor);
    probe.remove();
  });

  it('leaves the examples of md-gb-demo as they are on their own', () => {
    const demo = document.createElement('md-gb-demo');
    demo.innerHTML = '<h2>In a demo</h2>';
    prose.append(demo);
    const h2 = demo.querySelector('h2')!;
    expect(getComputedStyle(h2).font).not.toBe(token('--md-sys-typescale-headline-sm'));
  });

  it('lets the app override its styles (zero specificity)', () => {
    const style = document.createElement('style');
    style.textContent = 'h2 { margin-block-start: 3px; }';
    document.head.append(style);
    expect(getComputedStyle(prose.querySelector('h2')!).marginBlockStart).toBe('3px');
    style.remove();
  });
});
