/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {adoptStyles} from '../../adopt-styles.js';
import {styles as m3Styles} from '../../m3.cssresult.js';

import './md-gb-skeleton.js';
import transitionStyles from './md-motion-transitions.cssresult.js';
import {SKELETON_CLASSES} from './transitions.js';

adoptStyles(document, [m3Styles, transitionStyles]);

describe('<md-gb-skeleton>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-skeleton loading
      ><span>Content</span></md-gb-skeleton
    >`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const skeleton = root.querySelector('md-gb-skeleton')!;
    const placeholder = skeleton.shadowRoot!.querySelector<HTMLElement>(
      '.skeleton-placeholder',
    )!;
    const content =
      skeleton.shadowRoot!.querySelector<HTMLElement>('.skeleton-content')!;
    return {root, skeleton, placeholder, content};
  }

  it('defaults to not loading, rect shape', async () => {
    const {skeleton} = await setupTest(html`<md-gb-skeleton></md-gb-skeleton>`);
    expect(skeleton.loading).toBeFalse();
    expect(skeleton.shape).toBe('rect');
    expect(skeleton.getAttribute('shape')).toBe('rect');
    expect(skeleton.hasAttribute('aria-busy')).toBeFalse();
  });

  it('shows the placeholder and hides the content while loading', async () => {
    const {skeleton, placeholder, content} = await setupTest();
    expect(skeleton.getAttribute('aria-busy')).toBe('true');
    expect(placeholder.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(placeholder).opacity).toBe('1');
    expect(getComputedStyle(content).opacity).toBe('0');
    expect(content.inert).toBeTrue();
  });

  // spec: motion-transitions-f42659, motion-transitions-4ecbe4, motion-transitions-508ea7
  it('keeps the content layout while loading', async () => {
    const {skeleton, content} = await setupTest();
    expect(content.getBoundingClientRect().height).toBeGreaterThan(0);
    expect(skeleton.getBoundingClientRect().height).toBe(
      content.getBoundingClientRect().height,
    );
  });

  // spec: motion-transitions-fc01f1, motion-transitions-60e397, motion-transitions-eed611
  it('fades the content in when loaded', async () => {
    const {skeleton, content} = await setupTest();
    skeleton.loading = false;
    await skeleton.updateComplete;
    expect(skeleton.hasAttribute('loading')).toBeFalse();
    expect(skeleton.hasAttribute('aria-busy')).toBeFalse();
    expect(content.inert).toBeFalse();
    const style = getComputedStyle(content);
    expect(style.transitionProperty).toBe('opacity');
    expect(style.transitionDuration).toBe('0.2s');
  });

  // spec: motion-transitions-503062, motion-transitions-ac2c1d
  it('pulses with the extra long duration', async () => {
    const {placeholder} = await setupTest();
    const style = getComputedStyle(placeholder);
    expect(style.animationName).toBe('md-skeleton-pulse');
    expect(style.animationDuration).toBe('2s');
    expect(style.backgroundAttachment).toBe('fixed');
  });

  // spec: motion-transitions-802540
  it('sweeps the pulse from the top left to the bottom right (mirrored in RTL)', async () => {
    const {skeleton, placeholder} = await setupTest();
    // 135deg points toward the bottom right; the gradient is fixed to the
    // viewport so the pulse crosses the whole screen.
    expect(getComputedStyle(placeholder).backgroundImage).toContain('135deg');
    expect(getComputedStyle(placeholder).backgroundAttachment).toBe('fixed');
    expect(getComputedStyle(placeholder).animationName).toBe('md-skeleton-pulse');
    skeleton.dir = 'rtl';
    expect(getComputedStyle(placeholder).backgroundImage).toContain('225deg');
    expect(getComputedStyle(placeholder).animationName).toBe('md-skeleton-pulse-rtl');
    skeleton.dir = '';
  });

  it('reflects the shape', async () => {
    const {skeleton, placeholder} = await setupTest(
      html`<md-gb-skeleton loading shape="circle" style="inline-size: 40px">
      </md-gb-skeleton>`,
    );
    expect(skeleton.getAttribute('shape')).toBe('circle');
    expect(skeleton.getBoundingClientRect().height).toBe(40);
    expect(getComputedStyle(placeholder).borderTopLeftRadius).not.toBe('0px');
  });

  it('styles the md-skeleton utility class', async () => {
    const root = env.render(
      html`<div class="${SKELETON_CLASSES.skeleton}"></div>`,
    );
    const block = root.querySelector('div')!;
    expect(getComputedStyle(block).animationName).toBe('md-skeleton-pulse');
  });
});
