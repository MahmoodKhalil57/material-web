/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../appbar/md-gb-app-bar.js';
import '../../iconbutton/md-gb-icon-button.js';
import '../../button/md-gb-button.js';
import '../../fab/md-gb-fab.js';

import {sendKeys} from '@web/test-runner-commands';

import {deepActiveElement, renderSubject, until} from './subjects.js';
import {anyLayer, focusByKeyboard, hover, layers, reset, settleMotion, subject} from './states-helpers.js';
import {paintFingerprint as paint} from './style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md): the
// focused state is inherited from the keyboard focus, one element at a time,
// and combines with hover and selection (see `states-foundation_test.ts` for
// the model).

describe('focused state (central)', () => {
  afterEach(reset);

  const FOCUS: Array<[string, string]> = [
    ['button-filled', 'buttons'],
    ['text-field-filled', 'text fields'],
    ['fab', 'FABs'],
    ['chip-assist', 'chips'],
    ['icon-button-standard', 'icon buttons'],
    ['segmented-button', 'segmented buttons'],
    ['checkbox', 'checkboxes'],
    ['switch', 'selection controls'],
    ['card-interactive', 'cards'],
    ['list-item', 'list items'],
  ];

  // spec: interaction-states-96c50e, interaction-states-641b81, interaction-states-e1b5b5, interaction-states-9380ab, interaction-states-a29d51, interaction-states-7cfb53, interaction-states-cd9032
  for (const [id, label] of FOCUS) {
    it(`inherits focus from the keyboard: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      (deepActiveElement() as HTMLElement | null)?.blur();
      settleMotion();
      const resting = paint(el);
      expect(anyLayer(el, resting)).toBeFalse();
      await focusByKeyboard(el);
      await until(() => anyLayer(el, resting));
      expect(anyLayer(el, resting)).toBeTrue();
      cleanup();
    });
  }

  // spec: interaction-states-99f4b0, interaction-states-695dd6
  it('does not give the whole app bar a focus state, only the components inside it', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'app-bar',
      component: 'appbar',
      html: `<md-gb-app-bar data-subject style="width:400px" headline="Title"><md-gb-icon-button slot="trailing" aria-label="Search"><md-gb-icon>search</md-gb-icon></md-gb-icon-button></md-gb-app-bar>`,
    });
    const bar = container.querySelector('md-gb-app-bar') as HTMLElement;
    const button = container.querySelector('md-gb-icon-button') as HTMLElement;
    await focusByKeyboard(button);
    await until(() => layers(button).layer === 10);
    expect(layers(button).layer).toBe(10);
    expect(bar.shadowRoot!.querySelectorAll('.ripple').length).toBe(0);
    expect(deepActiveElement()).toBe(button.shadowRoot?.activeElement ?? button);
    cleanup();
  });

  // spec: interaction-states-fddfb1
  it('acts on the focused element with the keyboard', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    let clicks = 0;
    el.addEventListener('click', () => clicks++);
    await focusByKeyboard(el);
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
    cleanup();
  });

  // spec: interaction-states-2178d5, interaction-states-ad486a
  it('combines focus with hover and selected', async () => {
    const {el, cleanup} = await renderSubject(subject('chip-filter'), {selected: true});
    await hover(el);
    await focusByKeyboard(el);
    await until(() => layers(el).layer === 10);
    expect(el.hasAttribute('selected')).toBeTrue();
    // Focus shows as its 10% layer, in place of the 8% hover layer.
    expect(layers(el).layer).toBe(10);
    cleanup();
  });

  // spec: interaction-states-33e1d9, interaction-states-17511f
  it('shows a focus state on one element at a time', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'two-buttons',
      component: 'button',
      html: `<div style="display:flex;gap:24px"><md-gb-button data-subject color="tonal">One</md-gb-button><md-gb-button color="tonal">Two</md-gb-button></div>`,
    });
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement>('md-gb-button'));
    await focusByKeyboard(one);
    await until(() => layers(one).layer === 10);
    expect(layers(one).layer).toBe(10);
    await sendKeys({press: 'Tab'});
    await until(() => layers(two).layer === 10);
    expect(layers(two).layer).toBe(10);
    expect(layers(one).layer).toBe(0);
    cleanup();
  });
});
