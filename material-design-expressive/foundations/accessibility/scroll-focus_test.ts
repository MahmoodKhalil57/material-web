/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {focusableWhileScrollable} from './scroll-focus.js';

const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

describe('focusableWhileScrollable()', () => {
  let box: HTMLElement;
  let content: HTMLElement;
  let stop: () => void;
  beforeEach(() => {
    box = document.createElement('div');
    box.style.cssText = 'inline-size: 200px; overflow-x: auto';
    content = document.createElement('div');
    // A box with no height doesn't count toward overflow.
    content.style.cssText = 'inline-size: 100px; block-size: 20px';
    box.append(content);
    document.body.append(box);
  });
  afterEach(() => {
    stop?.();
    box.remove();
  });

  it('leaves content that fits alone', () => {
    stop = focusableWhileScrollable(box);
    expect(box.hasAttribute('tabindex')).toBeFalse();
  });

  it('makes a container that scrolls focusable, and takes it back when it fits', async () => {
    content.style.inlineSize = '600px';
    stop = focusableWhileScrollable(box);
    expect(box.getAttribute('tabindex')).withContext('scrolls').toBe('0');
    content.style.inlineSize = '100px';
    await frames();
    expect(box.hasAttribute('tabindex')).withContext('fits').toBeFalse();
    content.style.inlineSize = '600px';
    await frames();
    expect(box.getAttribute('tabindex')).withContext('scrolls again').toBe('0');
  });

  it("keeps the app's own tabindex", async () => {
    box.setAttribute('tabindex', '-1');
    content.style.inlineSize = '600px';
    stop = focusableWhileScrollable(box);
    content.style.inlineSize = '100px';
    await frames();
    expect(box.getAttribute('tabindex')).toBe('-1');
  });

  it("doesn't count content a container clips (overflow hidden)", () => {
    box.style.overflowX = 'hidden';
    content.style.inlineSize = '600px';
    stop = focusableWhileScrollable(box);
    expect(box.hasAttribute('tabindex')).toBeFalse();
  });
});
