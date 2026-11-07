/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-badge.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-badge> placement', () => {
  const env = new Environment();

  async function setup(badge: unknown, dir = 'ltr') {
    const root = env.render(html`
      <div dir=${dir} style="padding: 40px">
        <span
          class="icon"
          style="position: relative; display: inline-block; inline-size: 24px; block-size: 24px"
        >
          ${badge}
        </span>
        <span class="text">Inbox</span>
      </div>
    `);
    await env.waitForStability();
    const icon = root.querySelector('.icon')!.getBoundingClientRect();
    const rect = root.querySelector('md-gb-badge')!.getBoundingClientRect();
    return {icon, rect, root};
  }

  // spec: badges-8d0016, badges-9c86f8, badges-a5da53
  it('anchors a small badge 6dp from the top trailing corner of the icon', async () => {
    const {icon, rect} = await setup(html`<md-gb-badge anchored></md-gb-badge>`);
    expect(rect.width).toBe(6);
    expect(rect.height).toBe(6);
    expect(rect.bottom - icon.top).toBe(6);
    expect(icon.right - rect.left).toBe(6);
  });

  // spec: badges-abc392, badges-a4e1e9, badges-e89985
  it('places a large badge at the icon\'s trailing edge, 14dp by 12dp from its top trailing corner', async () => {
    const {icon, rect, root} = await setup(
      html`<md-gb-badge anchored value="3"></md-gb-badge>`,
    );
    expect(rect.bottom - icon.top).toBe(14);
    expect(icon.right - rect.left).toBe(12);
    // It overlaps the icon and sticks out of its trailing edge, ahead of the
    // text that follows the icon.
    expect(rect.right).toBeGreaterThan(icon.right);
    expect(rect.left).toBeLessThan(icon.right);
    const text = root.querySelector('.text')!.getBoundingClientRect();
    expect(rect.left).toBeLessThan(text.left);
  });

  // spec: badges-cac7ec
  it('keeps the large badge in place while a growing count widens it', async () => {
    const one = await setup(html`<md-gb-badge anchored value="3"></md-gb-badge>`);
    const many = await setup(
      html`<md-gb-badge anchored value="1200"></md-gb-badge>`,
    );
    expect(many.rect.width).toBeGreaterThan(one.rect.width);
    expect(many.rect.left).toBe(one.rect.left);
    expect(many.rect.top).toBe(one.rect.top);
  });

  // spec: badges-309261
  it('mirrors the placement to the leading corner for right-to-left', async () => {
    const {icon, rect} = await setup(
      html`<md-gb-badge anchored value="3"></md-gb-badge>`,
      'rtl',
    );
    expect(rect.bottom - icon.top).toBe(14);
    expect(rect.right - icon.left).toBe(12);
    expect(rect.left).toBeLessThan(icon.left);
  });
});
