/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';
import './md-gb-dialog.js';

import {setViewport} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {DialogElement} from './dialog-element.js';

adoptStyles(document, [m3Styles]);

describe('md-gb-dialog full-screen across window sizes', () => {
  const env = new Environment();

  async function render() {
    const root = env.render(
      html`<md-gb-dialog quick full-screen>
        <span slot="headline">Title</span>
        <p>Content</p>
        <md-gb-button slot="actions">Save</md-gb-button>
      </md-gb-dialog>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-dialog') as DialogElement;
    await el.updateComplete;
    return el;
  }

  const closeButton = (el: DialogElement) =>
    el.shadowRoot!.querySelector('[part~="close-button"]');
  const dialogRect = (el: DialogElement) =>
    el.shadowRoot!.querySelector('dialog')!.getBoundingClientRect();

  afterEach(async () => {
    await setViewport({width: 800, height: 600});
  });

  // spec: dialogs-daddf8
  it('is full-screen at compact windows', async () => {
    await setViewport({width: 400, height: 700});
    const el = await render();
    el.show();
    await env.waitForStability();
    expect(closeButton(el)).not.toBeNull();
    expect(dialogRect(el).width).toBe(400);
    expect(dialogRect(el).height).toBe(700);
  });

  // spec: dialogs-56b7f9, dialogs-daddf8
  it('is a basic dialog at medium and expanded windows', async () => {
    for (const width of [800, 1000]) {
      await setViewport({width, height: 700});
      const el = await render();
        el.show();
      await env.waitForStability();
      expect(el.hasAttribute('adaptive-basic')).withContext(`${width}`).toBeTrue();
      expect(closeButton(el)).withContext(`${width}`).toBeNull();
      expect(dialogRect(el).width).withContext(`${width}`).toBeLessThan(width);
      expect(
        el.shadowRoot!.querySelector('dialog')!.getAttribute('role'),
      )
        .withContext(`${width}`)
        .toBe('alertdialog');
    }
  });

  // spec: dialogs-daddf8
  it('switches when the window crosses the compact breakpoint', async () => {
    await setViewport({width: 1000, height: 700});
    const el = await render();
    expect(el.hasAttribute('adaptive-basic')).toBeTrue();
    const crossed = new Promise((resolve) => {
      matchMedia('(max-width: 599px)').addEventListener('change', resolve, {once: true});
    });
    await setViewport({width: 400, height: 700});
    await crossed;
    await el.updateComplete;
    expect(el.hasAttribute('adaptive-basic')).toBeFalse();
  });

  // spec: dialogs-1bb3d9, dialogs-6777bc
  it('keeps an always-full-screen dialog full-screen and filling the window at any width', async () => {
    for (const width of [800, 1000, 1400]) {
      await setViewport({width, height: 700});
      const root = env.render(
        html`<md-gb-dialog quick full-screen always-full-screen>
          <span slot="headline">Title</span>
          <p>Content</p>
        </md-gb-dialog>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-dialog') as DialogElement;
      await el.updateComplete;
      el.show();
      await env.waitForStability();
      expect(el.hasAttribute('adaptive-basic')).withContext(`${width}`).toBeFalse();
      expect(closeButton(el)).withContext(`${width}`).not.toBeNull();
      expect(dialogRect(el).width).withContext(`${width}`).toBe(width);
      expect(dialogRect(el).height).withContext(`${width}`).toBe(700);
    }
  });

  // Not cited: dialogs-0f62e4 is excluded as contradicted (exclusions/components-other.md).
  // The full-screen color list repeats the basic dialog's "Surface container
  // high"; md.comp.full-screen-dialog.container.color and the page's color
  // figure (its container is the surface color) say surface, which wins.
  it('paints a full-screen dialog in the surface color', async () => {
    await setViewport({width: 400, height: 700});
    const el = await render();
    el.show();
    await env.waitForStability();
    el.shadowRoot!.getAnimations().forEach((a) => a.finish());
    const probe = document.createElement('span');
    probe.style.color = 'var(--md-sys-color-surface)';
    document.body.append(probe);
    const surface = getComputedStyle(probe).color;
    probe.remove();
    const dialog = el.shadowRoot!.querySelector('dialog')!;
    expect(getComputedStyle(dialog).backgroundColor).toBe(surface);
  });
});
