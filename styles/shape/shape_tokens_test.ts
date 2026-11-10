/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import '../../components/button/md-gb-button.js';
import {adoptStyles} from '../adopt-styles.js';
import {styles as m3Styles} from '../m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('shape tokens', () => {
  // spec: shape-dc55a6
  it('has a token per corner of every scale step, defaulting to the all-corner token', () => {
    const root = getComputedStyle(document.documentElement);
    for (const size of ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'full']) {
      for (const corner of ['start-start', 'start-end', 'end-end', 'end-start']) {
        const el = document.createElement('div');
        el.style.cssText = `width:100px;height:100px;border-radius:var(--md-sys-shape-corner-${size}-${corner})`;
        const all = document.createElement('div');
        all.style.cssText = `width:100px;height:100px;border-radius:var(--md-sys-shape-corner-${size})`;
        document.body.append(el, all);
        expect(getComputedStyle(el).borderTopLeftRadius).withContext(`${size}-${corner}`).toBe(getComputedStyle(all).borderTopLeftRadius);
        el.remove();
        all.remove();
      }
    }
    expect(root.getPropertyValue('--md-sys-shape-corner-md-start-start')).toBe(root.getPropertyValue('--md-sys-shape-corner-md'));
  });

  // spec: shape-dc55a6
  it('shapes a single corner by overriding its token', () => {
    const el = document.createElement('div');
    el.style.cssText = `width:100px;height:100px;--md-sys-shape-corner-lg-end-end:0px;border-start-start-radius:var(--md-sys-shape-corner-lg-start-start);border-end-end-radius:var(--md-sys-shape-corner-lg-end-end)`;
    document.body.append(el);
    const s = getComputedStyle(el);
    expect(s.borderTopLeftRadius).toBe('16px');
    expect(s.borderBottomRightRadius).toBe('0px');
    // The same shape without the override keeps every corner at its default.
    const sibling = document.createElement('div');
    sibling.style.cssText = `width:100px;height:100px;border-start-start-radius:var(--md-sys-shape-corner-lg-start-start);border-end-end-radius:var(--md-sys-shape-corner-lg-end-end)`;
    document.body.append(sibling);
    const d = getComputedStyle(sibling);
    expect(d.borderTopLeftRadius).toBe('16px');
    expect(d.borderBottomRightRadius).toBe('16px');
    sibling.remove();
    el.remove();
  });

  // spec: shape-5585a6
  it('switches the corner family from rounded to cut', () => {
    if (!CSS.supports('corner-shape', 'bevel')) {
      pending('corner-shape is not supported by this browser');
    }
    const host = document.createElement('div');
    const el = document.createElement('div');
    el.style.cssText = 'width:100px;height:100px;border-radius:16px';
    host.append(el);
    document.body.append(host);
    host.setAttribute('data-shape-family', 'rounded');
    expect(getComputedStyle(el).getPropertyValue('corner-shape')).toBe('round');
    host.setAttribute('data-shape-family', 'cut');
    expect(getComputedStyle(el).getPropertyValue('corner-shape')).toBe('bevel');
    host.remove();
  });
});

describe('shape morph motion scheme', () => {
  const env = new Environment();

  // spec: shape-eb4d58, shape-7e4b53
  it('uses the expressive motion scheme by default and can switch to standard', async () => {
    const root = env.render(html`<div id="scope"><md-gb-button size="sm">One</md-gb-button></div>`);
    await env.waitForStability();
    const scope = root.querySelector('#scope') as HTMLElement;
    const button = scope.querySelector('md-gb-button')!.shadowRoot!.querySelector('.btn') as HTMLElement;
    const duration = () => getComputedStyle(scope).getPropertyValue('--md-sys-motion-spring-fast-spatial-duration').trim();
    const expressive = duration();
    expect(getComputedStyle(button).transitionTimingFunction).toContain('linear(');
    scope.classList.add('md-motion-standard');
    expect(duration()).not.toBe(expressive);
    expect(expressive).toBe('350ms');
    expect(duration()).toBe('160ms');
  });
});
