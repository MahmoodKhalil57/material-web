/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../appbar/md-gb-app-bar.js';
import '../../iconbutton/md-gb-icon-button.js';
import '../../button/md-gb-button.js';

import {sendMouse} from '@web/test-runner-commands';

import {renderSubject, until} from './subjects.js';
import {anyLayer, hover, layers, reset, settleMotion, subject} from './states-helpers.js';
import {paintFingerprint as paint} from './style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md): the
// hover state is inherited by action, selection and input parts, and not by
// the app bar as a whole (see `states-foundation_test.ts` for the model).

describe('hover state (central)', () => {
  afterEach(reset);

  const HOVER: Array<[string, string, string]> = [
    ['button-filled', 'buttons', 'interaction-states-358427'],
    ['card-interactive', 'cards', 'interaction-states-66a13e'],
    ['list-item', 'list items', 'interaction-states-6f4995'],
    ['fab', 'FABs', 'interaction-states-7c8ce5'],
    ['icon-button-standard', 'icon buttons', 'interaction-states-5fe04f'],
    ['chip-assist', 'chips', 'interaction-states-5fe04f'],
    ['segmented-button', 'segmented buttons', 'interaction-states-5fe04f'],
    ['switch', 'switches', 'interaction-states-5fe04f'],
    ['checkbox', 'checkboxes', 'interaction-states-5fe04f'],
    ['text-field-filled', 'text fields', 'interaction-states-37b5c2'],
  ];

  // spec: interaction-states-5fe04f, interaction-states-358427, interaction-states-66a13e, interaction-states-6f4995, interaction-states-37b5c2, interaction-states-7c8ce5, interaction-inputs-436ac1, interaction-inputs-71feb3, interaction-inputs-0a1add, interaction-inputs-cc8fb9
  for (const [id, label] of HOVER) {
    it(`inherits hover: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const resting = paint(el);
      expect(anyLayer(el, resting)).toBeFalse();
      await hover(el);
      await until(() => anyLayer(el, resting));
      expect(anyLayer(el, resting)).toBeTrue();
      cleanup();
    });
  }

  // spec: interaction-states-cb1f4a, interaction-states-6da805
  it('does not give the whole app bar a hover state, only the components inside it', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'app-bar',
      component: 'appbar',
      html: `<md-gb-app-bar data-subject style="width:400px" headline="Title"><md-gb-icon-button slot="trailing" aria-label="Search"><md-gb-icon>search</md-gb-icon></md-gb-icon-button></md-gb-app-bar>`,
    });
    const bar = container.querySelector('md-gb-app-bar') as HTMLElement;
    const button = container.querySelector('md-gb-icon-button') as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const resting = paint(bar);
    // Hover the bar's own area, away from the button.
    await sendMouse({type: 'move', position: [Math.round(rect.left + 30), Math.round(rect.top + rect.height / 2)]});
    settleMotion();
    expect(anyLayer(bar, resting)).toBeFalse();
    await hover(button);
    await until(() => layers(button).layer === 8);
    expect(layers(button).layer).toBe(8);
    cleanup();
  });

  // spec: interaction-states-1b2c02, interaction-states-23a7c8
  it('combines hover with the selected state of a filter chip', async () => {
    const {el, cleanup} = await renderSubject(subject('chip-filter'), {selected: true});
    await hover(el);
    await until(() => layers(el).layer === 8);
    expect(el.hasAttribute('selected')).toBeTrue();
    expect(layers(el).layer).toBe(8);
    cleanup();
  });

  // spec: interaction-states-c9f338, interaction-states-44fdbf
  it('shows a hover state on one element at a time, where the cursor is', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'two-buttons',
      component: 'button',
      html: `<div style="display:flex;gap:24px"><md-gb-button data-subject color="tonal">One</md-gb-button><md-gb-button color="tonal">Two</md-gb-button></div>`,
    });
    const [one, two] = Array.from(container.querySelectorAll<HTMLElement>('md-gb-button'));
    await hover(one);
    await until(() => layers(one).layer === 8);
    expect(layers(one).layer).toBe(8);
    expect(layers(two).layer).toBe(0);
    await hover(two);
    await until(() => layers(two).layer === 8);
    expect(layers(two).layer).toBe(8);
    await until(() => layers(one).layer === 0);
    expect(layers(one).layer).toBe(0);
    cleanup();
  });
});
