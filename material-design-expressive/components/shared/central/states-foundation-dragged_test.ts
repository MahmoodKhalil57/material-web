/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../appbar/md-gb-app-bar.js';
import '../../fab/md-gb-fab.js';
import '../../tabs/md-gb-tabs.js';
import '../../tabs/md-gb-tab.js';

import {sendKeys} from '@web/test-runner-commands';

import {deepActiveElement, deepElements, renderSubject, settle, until} from './subjects.js';
import {anyLayer, hover, layers, reset, subject} from './states-helpers.js';
import {contentAlphas, isWithin, paintFingerprint as paint} from './style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md): the
// dragged state (a 16% layer and a raised elevation), and the disabled state
// that parts inherit (reduced content, no state layers). See
// `states-foundation_test.ts` for the model.

describe('dragged state (central)', () => {
  afterEach(reset);

  /** The elevation (box shadow) of an element or its shadow-DOM container. */
  function shadowOf(el: Element) {
    const parts = [el, ...Array.from(el.shadowRoot?.querySelectorAll('*') ?? [])];
    return parts.map((p) => getComputedStyle(p).boxShadow).filter((s) => s !== 'none').join('|');
  }

  const DRAGGABLE: Array<[string, string]> = [
    ['card-interactive', 'cards'],
    ['chip-assist', 'chips'],
  ];

  // spec: interaction-states-479709, interaction-states-ae9cc9, interaction-states-6afeb4, interaction-states-0c3752, interaction-states-15c64f, interaction-states-581df2
  for (const [id, label] of DRAGGABLE) {
    it(`inherits dragged with a 16% layer and a raised elevation: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id));
      const resting = shadowOf(el);
      (el as unknown as {dragged: boolean}).dragged = true;
      await settle(el);
      await until(() => layers(el).layer === 16 || paint(el).includes('0.16'));
      expect(layers(el).layer === 16 || paint(el).includes('0.16')).withContext(label).toBeTrue();
      expect(shadowOf(el)).not.toBe(resting);
      cleanup();
    });
  }

  // spec: interaction-states-479709, interaction-states-b196d6
  it('inherits dragged: list items', async () => {
    const {el, cleanup} = await renderSubject(subject('list-item'), {dragging: true});
    const painted = () => deepElements(el).map((e) => getComputedStyle(e).backgroundImage).join('|');
    await until(() => painted().includes('0.16'));
    expect(painted()).toContain('0.16');
    cleanup();
  });

  // spec: interaction-states-5e30bf, interaction-states-bd1aa2, interaction-states-529659
  it('does not move or lift an app bar with a dragged state', async () => {
    const {container, cleanup} = await renderSubject({
      id: 'app-bar',
      component: 'appbar',
      html: `<md-gb-app-bar data-subject style="width:400px" headline="Title"></md-gb-app-bar>`,
    });
    const bar = container.querySelector('md-gb-app-bar') as HTMLElement;
    const before = bar.getBoundingClientRect();
    const resting = shadowOf(bar);
    bar.classList.add('dragged');
    await settle(bar);
    const after = bar.getBoundingClientRect();
    expect(after.top).toBe(before.top);
    expect(after.left).toBe(before.left);
    expect(bar.shadowRoot!.querySelectorAll('.ripple').length).toBe(0);
    expect(shadowOf(bar)).toBe(resting);
    cleanup();
  });
});

describe('disabled state inheritance (central)', () => {
  afterEach(reset);

  const DISABLED: Array<[string, string]> = [
    ['button-filled', 'buttons'],
    ['card-interactive', 'cards'],
    ['checkbox', 'checkboxes'],
    ['radio', 'radio buttons'],
    ['switch', 'switches'],
    ['text-field-filled', 'text fields'],
    ['icon-button-standard', 'icon buttons'],
    ['segmented-button', 'segmented buttons'],
    ['chip-assist', 'chips'],
    ['list-item', 'list items'],
  ];

  // spec: interaction-states-c93a1d, interaction-states-82df36, interaction-states-958a20, interaction-states-99010f, interaction-states-a6d043, interaction-states-dfd586, interaction-states-8a4a3a, interaction-states-aa0177, interaction-states-97a617, interaction-states-0c2b3c, interaction-states-296613, interaction-states-e767ef, interaction-states-bbcd6f, interaction-states-8fdb93, interaction-states-a63ef7
  for (const [id, label] of DISABLED) {
    it(`inherits disabled, with reduced content and no state layers: ${label}`, async () => {
      const {el, cleanup} = await renderSubject(subject(id), {disabled: true});
      for (const alpha of contentAlphas(el)) expect(alpha).toBeLessThan(0.5);
      const resting = paint(el);
      await hover(el);
      expect(anyLayer(el, resting)).toBeFalse();
      cleanup();
    });
  }

  // spec: interaction-states-03fd93, interaction-states-2128d7, interaction-states-e22cd3
  it('has no disabled state for FABs and tabs: the attribute neither dims them nor stops them', async () => {
    for (const id of ['fab', 'tab-primary']) {
      const plain = await renderSubject(subject(id));
      const alphasBefore = contentAlphas(plain.el);
      plain.cleanup();
      const {el, cleanup} = await renderSubject(subject(id), {disabled: true});
      expect(contentAlphas(el)).withContext(id).toEqual(alphasBefore);
      await sendKeys({press: 'Shift'});
      el.focus();
      expect(isWithin(el, deepActiveElement())).withContext(id).toBeTrue();
      cleanup();
    }
  });
});
