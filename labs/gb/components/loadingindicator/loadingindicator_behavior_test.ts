/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-loading-indicator.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type LoadingIndicatorElement} from './loading-indicator-element.js';

adoptStyles(document, [m3Styles]);

const ROLES = [
  '--md-sys-color-primary: rgb(1, 1, 1)',
  '--md-sys-color-on-primary-container: rgb(2, 2, 2)',
  '--md-sys-color-primary-container: rgb(3, 3, 3)',
].join(';');

describe('<md-gb-loading-indicator> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown, style = ROLES) {
    const root = env.render(html`<div style=${style}>${template}</div>`);
    await env.waitForStability();
    const els = [
      ...root.querySelectorAll<LoadingIndicatorElement>(
        'md-gb-loading-indicator',
      ),
    ];
    const part = (e: LoadingIndicatorElement) =>
      e.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
    return {root, els, part};
  }

  const prop = (el: HTMLElement, name: string) =>
    getComputedStyle(el).getPropertyValue(name).trim();

  // spec: loading-indicator-62cdbf, loading-indicator-dca5eb, loading-indicator-9b6cd8, loading-indicator-c40fd9, loading-indicator-f86ea2
  it('has a default variant without a container', async () => {
    const {els, part} = await setup(
      html`<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>`,
    );
    expect(getComputedStyle(part(els[0])).backgroundColor).toBe(
      'rgba(0, 0, 0, 0)',
    );
  });

  // spec: loading-indicator-867c65, loading-indicator-a6212b, loading-indicator-ef006a
  it('has a contained variant: a circular container behind the shape', async () => {
    const {els, part} = await setup(html`
      <md-gb-loading-indicator contained aria-label="Loading"></md-gb-loading-indicator>`);
    const style = getComputedStyle(part(els[0]));
    expect(style.backgroundColor).toBe('rgb(3, 3, 3)');
    expect(parseFloat(style.borderTopLeftRadius)).toBeGreaterThanOrEqual(
      parseFloat(style.height) / 2,
    );
    expect(style.width).toBe(style.height);
  });

  // spec: loading-indicator-c0dabb, loading-indicator-c9a374
  it('colors the default indicator with the primary role', async () => {
    const {els, part} = await setup(
      html`<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>`,
    );
    expect(prop(part(els[0]), '--active-indicator-color')).toBe('rgb(1, 1, 1)');
    const path = part(els[0]).querySelector('path')!;
    expect(getComputedStyle(path).fill).toBe('rgb(1, 1, 1)');
  });

  // spec: loading-indicator-979219, loading-indicator-3b64f0, loading-indicator-5d9b70
  it('colors the contained indicator on-primary-container over a primary-container container', async () => {
    const {els, part} = await setup(html`
      <md-gb-loading-indicator contained aria-label="Loading"></md-gb-loading-indicator>`);
    expect(prop(part(els[0]), '--active-indicator-color')).toBe('rgb(2, 2, 2)');
    expect(prop(part(els[0]), '--container-color')).toBe('rgb(3, 3, 3)');
    const path = part(els[0]).querySelector('path')!;
    expect(getComputedStyle(path).fill).toBe('rgb(2, 2, 2)');
  });

  // spec: loading-indicator-d6036f
  it('animates to show that an activity is in progress', async () => {
    const {els, part} = await setup(
      html`<md-gb-loading-indicator aria-label="Loading"></md-gb-loading-indicator>`,
    );
    const running = part(els[0])
      .getAnimations({subtree: true})
      .filter((a) => a.playState === 'running');
    expect(running.length).toBeGreaterThanOrEqual(3);
  });

  // spec: loading-indicator-9de3da
  it('defaults to 48dp and can be resized through its container tokens', async () => {
    const {els, part} = await setup(html`
      <md-gb-loading-indicator aria-label="a"></md-gb-loading-indicator>
      <md-gb-loading-indicator aria-label="b"></md-gb-loading-indicator>`);
    expect(getComputedStyle(part(els[0])).width).toBe('48px');
    expect(getComputedStyle(part(els[0])).height).toBe('48px');
    part(els[1]).style.setProperty('--container-width', '96px');
    part(els[1]).style.setProperty('--container-height', '96px');
    expect(getComputedStyle(part(els[1])).width).toBe('96px');
    expect(getComputedStyle(part(els[1])).height).toBe('96px');
  });

  // spec: loading-indicator-1acb4e, loading-indicator-927b19
  it('has the progressbar role and an accessibility label', async () => {
    const {els, part} = await setup(
      html`<md-gb-loading-indicator aria-label="Loading results"></md-gb-loading-indicator>`,
    );
    expect(part(els[0]).getAttribute('role')).toBe('progressbar');
    expect(part(els[0]).getAttribute('aria-label')).toBe('Loading results');
  });
});

/** WCAG relative luminance of an `rgb()` string. */
function luminance(rgb: string) {
  const [r, g, b] = rgb.match(/[\d.]+/g)!.slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('<md-gb-loading-indicator> contrast with the default theme', () => {
  const env = new Environment();

  // spec: loading-indicator-f086ad, loading-indicator-1792e9, loading-indicator-14071b, loading-indicator-24f36b
  it('keeps the indicator at 3:1 or more against the surface, light and dark', async () => {
    for (const scheme of ['light', 'dark']) {
      const root = env.render(html`<div style="color-scheme: ${scheme}; background: var(--md-sys-color-surface)">
        <md-gb-loading-indicator aria-label="a"></md-gb-loading-indicator>
        <md-gb-loading-indicator contained aria-label="b"></md-gb-loading-indicator></div>`);
      await env.waitForStability();
      const wrapper = root.firstElementChild as HTMLElement;
      const surface = getComputedStyle(wrapper).backgroundColor;
      const [plain, contained] = [
        ...wrapper.querySelectorAll<LoadingIndicatorElement>(
          'md-gb-loading-indicator',
        ),
      ].map((e) =>
        getComputedStyle(
          e.shadowRoot!.querySelector('[part="indicator"] path')!,
        ).fill,
      );
      expect(contrast(plain, surface))
        .withContext(`${scheme} default indicator on surface`)
        .toBeGreaterThanOrEqual(3);
      // The container needs no contrast; the indicator is checked against it.
      const containerColor = getComputedStyle(
        wrapper.querySelectorAll('md-gb-loading-indicator')[1].shadowRoot!
          .querySelector('[part="indicator"]')!,
      ).backgroundColor;
      expect(contrast(contained, containerColor))
        .withContext(`${scheme} contained indicator on its container`)
        .toBeGreaterThanOrEqual(3);
    }
  });
});
