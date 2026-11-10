/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

function radius(token: string, size = 200) {
  const el = document.createElement('div');
  el.style.cssText = `width:${size}px;height:${size}px;border-top-left-radius:var(--md-sys-shape-corner-${token})`;
  document.body.append(el);
  const value = getComputedStyle(el).borderTopLeftRadius;
  el.remove();
  return value;
}

describe('corner radius tokens', () => {
  // spec: shape-8f3df6, shape-c92e27
  it('has an extra large increased corner of 32dp', () => {
    expect(radius('xl-increased')).toBe('32px');
  });

  // spec: shape-4592d7
  it('has a full corner that rounds to a circle', () => {
    const r = parseFloat(radius('full', 48));
    expect(r).toBeGreaterThanOrEqual(24);
  });
});
