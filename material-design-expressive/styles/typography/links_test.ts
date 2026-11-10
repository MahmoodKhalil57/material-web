/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

// Hyperlinks come from the typography stylesheet (md-typography-tokens.scss,
// `a:not([class], [role])`): primary color and underlined, on any surface.
describe('hyperlinks', () => {
  function probeColor(value: string) {
    const probe = document.createElement('span');
    probe.style.color = value;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }

  function link(background = '') {
    const wrap = document.createElement('p');
    wrap.style.cssText = `background-color: ${background}; margin: 0; padding: 8px`;
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = 'Read the spec';
    wrap.append(a);
    document.body.append(wrap);
    return {a, remove: () => wrap.remove()};
  }

  // spec: typography-48e5e6, typography-acc02d, typography-11f209
  it('uses the primary color and is underlined', () => {
    const {a, remove} = link();
    const style = getComputedStyle(a);
    expect(style.color).toBe(probeColor('var(--md-sys-color-primary)'));
    expect(style.textDecorationLine).toContain('underline');
    // The browser's own link color would also be underlined: the same anchor
    // in a shadow root (where the document's sheets do not reach) is not
    // primary, so the color above comes from the stylesheet.
    const bare = document.createElement('div');
    bare.attachShadow({mode: 'open'}).innerHTML = '<a href="#">Read the spec</a>';
    document.body.append(bare);
    const uaColor = getComputedStyle(bare.shadowRoot!.querySelector('a')!).color;
    bare.remove();
    expect(uaColor).not.toBe(style.color);
    remove();
  });

  // spec: typography-11f209
  it('stays primary on a surface color', () => {
    const {a, remove} = link('var(--md-sys-color-surface-container-high)');
    expect(getComputedStyle(a).color).toBe(probeColor('var(--md-sys-color-primary)'));
    remove();
  });
});
