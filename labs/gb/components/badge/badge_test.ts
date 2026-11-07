/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {BADGE_CLASSES, formatBadgeValue} from './badge.js';
import type {BadgeElement} from './badge-element.js';
import './md-gb-badge.js';

describe('<md-gb-badge>', () => {
  const env = new Environment();

  async function setupTest(template = html`<md-gb-badge></md-gb-badge>`) {
    const root = env.render(template);
    await env.waitForStability();
    const el = root.querySelector('md-gb-badge') as BadgeElement | null;
    if (!el) throw new Error('Failed to query rendered <md-gb-badge>');
    await env.waitForStability();
    const container = el.shadowRoot!.querySelector<HTMLElement>('.badge')!;
    return {el, container};
  }

  it('is a small badge without content and announces a new notification', async () => {
    const {container} = await setupTest();
    expect(container.classList).not.toContain(BADGE_CLASSES.badgeLarge);
    expect(container.getBoundingClientRect().height).toBe(6);
    expect(container.textContent?.trim()).toBe('New notification');
  });

  it('is a large badge with slotted content', async () => {
    const {el, container} = await setupTest(
      html`<md-gb-badge>3</md-gb-badge>`,
    );
    await el.updateComplete;
    expect(container.classList).toContain(BADGE_CLASSES.badgeLarge);
    expect(container.getBoundingClientRect().height).toBe(16);
    expect(container.querySelector('.badge-label')).toBeNull();
  });

  it('truncates a count above max to max+', async () => {
    const {container} = await setupTest(
      html`<md-gb-badge value="1200"></md-gb-badge>`,
    );
    expect(container.classList).toContain(BADGE_CLASSES.badgeLarge);
    expect(container.textContent?.trim()).toBe('999+');
  });

  it('uses the spec 4px large badge padding', async () => {
    const {container} = await setupTest(
      html`<md-gb-badge value="42"></md-gb-badge>`,
    );
    expect(getComputedStyle(container).paddingInlineStart).toBe('4px');
  });
});

describe('formatBadgeValue()', () => {
  it('keeps counts up to max', () => {
    expect(formatBadgeValue(999)).toBe('999');
    expect(formatBadgeValue(5, 9)).toBe('5');
  });

  it('truncates counts above max', () => {
    expect(formatBadgeValue(1000)).toBe('999+');
    expect(formatBadgeValue(10, 9)).toBe('9+');
  });
});
