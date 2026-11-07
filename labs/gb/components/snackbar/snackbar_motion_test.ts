/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';
import {html, render} from 'lit';

import './md-gb-snackbar.js';
import {type SnackbarElement} from './snackbar-element.js';

describe('<md-gb-snackbar> motion', () => {
  let container: HTMLElement;

  async function setup() {
    container = document.createElement('div');
    document.body.appendChild(container);
    render(
      html`<md-gb-snackbar label-text="Message sent"></md-gb-snackbar>`,
      container,
    );
    const snackbar = container.querySelector<SnackbarElement>('md-gb-snackbar')!;
    await snackbar.updateComplete;
    return snackbar;
  }

  function surface(snackbar: SnackbarElement) {
    return snackbar.shadowRoot!.querySelector<HTMLElement>('.snackbar-surface')!;
  }

  afterEach(async () => {
    container.remove();
    await emulateMedia({reducedMotion: 'no-preference'});
  });

  it('opens with a scale and a fade by default and fires opened when they end', async () => {
    const snackbar = await setup();
    const opened = new Promise((resolve) =>
      snackbar.addEventListener('opened', resolve, {once: true}),
    );
    const shown = snackbar.show();
    await snackbar.updateComplete;
    const properties = getComputedStyle(surface(snackbar)).transitionProperty;
    expect(properties).toContain('opacity');
    expect(properties).toContain('transform');
    await shown;
    await opened;
    expect(getComputedStyle(surface(snackbar)).opacity).toBe('1');
  });

  // spec: motion-transitions-ec3f87, motion-transitions-1ec6c0, motion-transitions-cab46b, motion-transitions-3bb2d7
  it('turns the scale off with reduced motion and keeps the fade', async () => {
    await emulateMedia({reducedMotion: 'reduce'});
    const snackbar = await setup();
    const opened = new Promise((resolve) =>
      snackbar.addEventListener('opened', resolve, {once: true}),
    );
    const shown = snackbar.show();
    await snackbar.updateComplete;
    const style = getComputedStyle(surface(snackbar));
    expect(style.transitionProperty).toBe('opacity');
    expect(style.transform).toBe('none');
    expect(parseFloat(style.transitionDuration)).toBeGreaterThan(0.001);
    await shown;
    await opened;
    expect(getComputedStyle(surface(snackbar)).opacity).toBe('1');
    await snackbar.close();
    expect(getComputedStyle(surface(snackbar)).transform).toBe('none');
  });
});
