/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import {CARD_CLASSES, cardClasses} from './card.js';
import type {CardElement} from './card-element.js';
import cardStyles from './card.cssresult.js';
import './md-gb-card.js';

adoptStyles(document, [m3Styles, cardStyles]);

describe('<md-gb-card>', () => {
  const env = new Environment();

  async function setupTest(template = html`<md-gb-card></md-gb-card>`) {
    const root = env.render(template);
    await env.waitForStability();
    const card = root.querySelector('md-gb-card') as CardElement | null;
    if (!card) throw new Error('Failed to query rendered <md-gb-card>');
    const container = card.shadowRoot!.querySelector<HTMLElement>('.card')!;
    return {card, container};
  }

  it('is outlined by default and has no role or tab stop', async () => {
    const {card, container} = await setupTest();
    expect(card.color).toBe('outlined');
    expect(container.classList).toContain(CARD_CLASSES.cardOutlined);
    // Spec: non-actionable cards are containers and are not tab stops.
    expect(card.shadowRoot!.querySelector('.card-btn')).toBeNull();
    expect(container.hasAttribute('role')).toBeFalse();
  });

  it('renders a button action when interactive', async () => {
    const {card} = await setupTest(
      html`<md-gb-card interactive aria-label="Open"></md-gb-card>`,
    );
    const btn = card.shadowRoot!.querySelector('.card-btn')!;
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('aria-label')).toBe('Open');
  });

  it('renders a link action when interactive with href', async () => {
    const {card} = await setupTest(
      html`<md-gb-card interactive href="#details"></md-gb-card>`,
    );
    const link = card.shadowRoot!.querySelector('.card-btn')!;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#details');
  });

  it('removes the href of a disabled link card', async () => {
    const {card} = await setupTest(
      html`<md-gb-card interactive disabled href="#details"></md-gb-card>`,
    );
    const link = card.shadowRoot!.querySelector('.card-btn')!;
    expect(link.hasAttribute('href')).toBeFalse();
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('raises a dragged card (spec dragged elevation)', async () => {
    const {card, container} = await setupTest(
      html`<md-gb-card color="elevated"></md-gb-card>`,
    );
    const resting = getComputedStyle(container).getPropertyValue(
      '--container-elevation',
    );
    card.dragged = true;
    await env.waitForStability();
    expect(container.classList).toContain(CARD_CLASSES.dragged);
    expect(
      getComputedStyle(container).getPropertyValue('--container-elevation'),
    ).not.toBe(resting);
  });

  it('dims the content of a disabled card', async () => {
    const {container} = await setupTest(
      html`<md-gb-card disabled><span>Content</span></md-gb-card>`,
    );
    expect(
      getComputedStyle(container).getPropertyValue('--disabled-content-opacity').trim(),
    ).toBe('0.38');
  });
});

describe('cardClasses()', () => {
  it('emulates pressed and dragged states', () => {
    const classes = cardClasses({color: 'filled', active: true, dragged: true});
    expect(classes[CARD_CLASSES.cardFilled]).toBeTrue();
    expect(classes[CARD_CLASSES.active]).toBeTrue();
    expect(classes[CARD_CLASSES.dragged]).toBeTrue();
  });
});
