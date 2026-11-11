/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../components/appbar/md-gb-app-bar.js';
import '../../../components/button/md-gb-button.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {renderSubject, ripplesOf, until} from '../../../testing/subjects.js';
import {anyLayer, focusByKeyboard, hover, layers, reset, settleMotion, subject} from './states-helpers.js';
import {paintFingerprint as paint} from '../../../testing/style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md): the
// pressed state is a 10% layer while the part is held, one element at a time,
// and combines with hover and selection (see `states-foundation_test.ts` for
// the model).

describe('pressed state (central)', () => {
  afterEach(reset);

  const PRESS: Array<[string, string]> = [
    ['button-filled', 'buttons'],
    ['card-interactive', 'cards'],
    ['checkbox', 'checkboxes'],
    ['list-item', 'list items'],
    ['fab', 'FABs'],
    ['icon-button-standard', 'icon buttons'],
    ['chip-assist', 'chips'],
  ];

  // spec: interaction-states-5bd6a8, interaction-states-72e9ef, interaction-states-47c383, interaction-states-4f5d95, interaction-states-c3bd3f, interaction-states-a15b30
  for (const [id, label] of PRESS) {
    it(`inherits pressed with a 10% layer: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      expect(layers(el).press).toBe(0);
      await hover(el);
      await sendMouse({type: 'down'});
      settleMotion();
      await until(() => layers(el).press === 10);
      expect(layers(el).press).toBe(10);
      await sendMouse({type: 'up'});
      cleanup();
    });
  }

  // spec: interaction-states-fb6e5c
  it('makes pressed higher emphasis than hover: a stronger layer that grows from the press point', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    const [ripple] = ripplesOf(el);
    await hover(el);
    const hoverLayer = layers(el).layer;
    await sendMouse({type: 'down'});
    // (The press animation is still running here: its layer grows from the press point.)
    await until(() => layers(el).press > hoverLayer);
    const animations = ripple.getAnimations().map((a) => (a as CSSAnimation).animationName);
    expect(animations).toContain('ripple-press');
    expect(layers(el).press).toBeGreaterThan(hoverLayer);
    await sendMouse({type: 'up'});
    cleanup();
  });

  // spec: interaction-states-7cc5d6
  it('starts a pressed state from the keyboard too', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    await focusByKeyboard(el);
    await sendKeys({down: 'Enter'});
    // Checked while the key is held: the layer fades out again after release.
    await until(() => Math.abs(layers(el).press - 10) < 0.05);
    expect(layers(el).press).toBeCloseTo(10, 1);
    await sendKeys({up: 'Enter'});
    cleanup();
  });

  // spec: interaction-states-ce409c, interaction-states-bd56b1
  it('combines pressed with hover, focus and selected', async () => {
    const {el, cleanup} = await renderSubject(subject('chip-filter'), {selected: true});
    await hover(el);
    await sendMouse({type: 'down'});
    settleMotion();
    await until(() => layers(el).press === 10);
    expect(el.hasAttribute('selected')).toBeTrue();
    expect(layers(el)).toEqual({layer: 8, press: 10});
    await sendMouse({type: 'up'});
    cleanup();
  });

  // spec: interaction-states-1a4b2a, interaction-states-8ca115
  it('shows a pressed state on one element at a time', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'two-buttons',
      component: 'button',
      html: `<div style="display:flex;gap:24px"><md-gb-button data-subject color="tonal">One</md-gb-button><md-gb-button color="tonal">Two</md-gb-button></div>`,
    });
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement>('md-gb-button'));
    await hover(one);
    await sendMouse({type: 'down'});
    settleMotion();
    await until(() => layers(one).press === 10);
    expect(layers(one).press).toBe(10);
    expect(layers(two).press).toBe(0);
    await sendMouse({type: 'up'});
    cleanup();
  });

  // spec: interaction-states-f18cb7, interaction-states-fe46d9
  it('does not give the whole app bar a pressed state', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'app-bar',
      component: 'appbar',
      html: `<md-gb-app-bar data-subject style="width:400px" headline="Title"></md-gb-app-bar>`,
    });
    const bar = container.querySelector('md-gb-app-bar') as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const resting = paint(bar);
    await sendMouse({type: 'move', position: [Math.round(rect.left + 30), Math.round(rect.top + rect.height / 2)]});
    await sendMouse({type: 'down'});
    settleMotion();
    expect(bar.shadowRoot!.querySelectorAll('.ripple').length).toBe(0);
    expect(anyLayer(bar, resting)).toBeFalse();
    await sendMouse({type: 'up'});
    cleanup();
  });
});
