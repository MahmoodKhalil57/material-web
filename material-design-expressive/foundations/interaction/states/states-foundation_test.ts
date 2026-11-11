/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../components/iconbutton/md-gb-icon-button.js';
import '../../../components/button/md-gb-button.js';
import '../../../components/fab/md-gb-fab.js';
import '../../../components/tabs/md-gb-tabs.js';
import '../../../components/tabs/md-gb-tab.js';

import {sendMouse} from '@web/test-runner-commands';

import {hitTargetSize, prop, renderSubject, ripplesOf, until} from '../../../testing/subjects.js';
import {anyLayer, focusByKeyboard, hover, layers, reset, subject} from './states-helpers.js';
import {paintFingerprint as paint, textElements} from '../../../testing/style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md): the
// model of state layers (one layer at a time, in the content color, fixed
// opacities). The hover, focus, pressed and dragged/disabled inheritance are in
// `states-foundation-hover_test.ts`, `states-foundation-focus_test.ts`,
// `states-foundation-pressed_test.ts` and `states-foundation-dragged_test.ts`.
// The per-state opacity checks of every part are in `state-layers_test.ts`, the
// focus ring in `focus-indicator_test.ts`, disabled parts in `disabled_test.ts`.

describe('state layer model (central)', () => {
  afterEach(reset);

  // spec: interaction-states-035523, interaction-states-3fc45f
  it('shows one layer at a time, 8% for hover, 10% for focus, 16% for dragged', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    const [ripple] = ripplesOf(el);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('0%');
    ripple.classList.add('hover');
    await until(() => prop(ripple, '--ripple-hover-opacity') === '8%');
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('8%');
    // Focus takes the place of hover: the layers never add up.
    ripple.classList.add('focus');
    await until(() => prop(ripple, '--ripple-hover-opacity') === '10%');
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('10%');
    ripple.classList.add('dragged');
    await until(() => prop(ripple, '--ripple-hover-opacity') === '16%');
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('16%');
    ripple.classList.remove('dragged', 'focus');
    await until(() => prop(ripple, '--ripple-hover-opacity') === '8%');
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('8%');
    cleanup();
  });

  // spec: interaction-states-3fc45f
  it('shows a 10% layer for focus from the keyboard and 10% for press', async () => {
    const {el, cleanup} = await renderSubject(subject('button-tonal'));
    await focusByKeyboard(el);
    await until(() => layers(el).layer === 10);
    expect(layers(el).layer).toBe(10);
    await reset();
    await hover(el);
    await sendMouse({type: 'down'});
    await until(() => layers(el).press === 10);
    expect(layers(el).press).toBe(10);
    cleanup();
  });

  // spec: interaction-states-31d9c9, interaction-states-cd1346, interaction-states-54d395, interaction-states-4944ed, interaction-states-920331
  it('leaves the enabled style as it is and adds a state layer for a stateful style', async () => {
    for (const id of ['button-tonal', 'switch', 'text-field-filled', 'fab']) {
      const {el, cleanup} = await renderSubject(subject(id));
      const resting = paint(el);
      expect(anyLayer(el, resting)).withContext(id).toBeFalse();
      await hover(el);
      await until(() => anyLayer(el, resting));
      expect(anyLayer(el, resting)).withContext(id).toBeTrue();
      cleanup();
    }
  });

  // spec: interaction-states-d8af74
  it('puts the state layer between the container (below) and the content (above)', async () => {
    const {el, cleanup} = await renderSubject(subject('button-tonal'));
    const [ripple] = ripplesOf(el);
    await hover(el);
    await until(() => getComputedStyle(ripple).backgroundImage !== 'none');
    const style = getComputedStyle(ripple);
    // The container color and the state layer image are painted by the same
    // element, the image over the color; the content is a child, above both.
    expect(style.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(style.backgroundImage).not.toBe('none');
    const label = textElements(el)[0];
    const layer = ripple.getBoundingClientRect();
    const content = label.getBoundingClientRect();
    expect(content.left).toBeGreaterThanOrEqual(layer.left);
    expect(content.right).toBeLessThanOrEqual(layer.right);
    expect(content.top).toBeGreaterThanOrEqual(layer.top);
    expect(content.bottom).toBeLessThanOrEqual(layer.bottom);
    cleanup();
  });

  // spec: interaction-states-cc160f, interaction-states-b579ae, interaction-states-6d92de
  it('paints the layer in the color of the content: the on color of the container, or the primary color for text on a surface', async () => {
    const expected: Record<string, string> = {
      'button-tonal': '--md-sys-color-on-secondary-container',
      'button-filled': '--md-sys-color-on-primary',
      'button-text': '--md-sys-color-primary',
    };
    const probe = document.createElement('div');
    document.body.append(probe);
    for (const [id, role] of Object.entries(expected)) {
      probe.style.color = `var(${role})`;
      const want = getComputedStyle(probe).color;
      const {el, cleanup} = await renderSubject(subject(id));
      const [ripple] = ripplesOf(el);
      expect(getComputedStyle(ripple).color).withContext(id).toBe(want);
      cleanup();
    }
    probe.remove();
    // Whatever the content color is, the layer has the same one.
    const {el, cleanup} = await renderSubject(subject('button-outlined'));
    const [ripple] = ripplesOf(el);
    const text = textElements(el)[0];
    const source = text.shadowRoot?.querySelector('slot:not([name])') ?? text;
    expect(getComputedStyle(ripple).color).toBe(getComputedStyle(source).color);
    cleanup();
  });

  // spec: interaction-states-181cf5
  it('draws a 40dp state layer inside a 48dp interactive target', async () => {
    const {el, cleanup} = await renderSubject(subject('icon-button-standard'));
    const [ripple] = ripplesOf(el);
    const r = ripple.getBoundingClientRect();
    expect(Math.round(r.width)).toBe(40);
    expect(Math.round(r.height)).toBe(40);
    const target = hitTargetSize(el);
    expect(target.width).toBeGreaterThanOrEqual(48);
    expect(target.height).toBeGreaterThanOrEqual(48);
    cleanup();
  });

  // spec: interaction-states-ba917a, interaction-states-ca34ab, interaction-states-cfa528
  it('applies a layer to the whole component, or as a circular shape over a part of it', async () => {
    const whole = await renderSubject(subject('button-filled'));
    const box = whole.el.getBoundingClientRect();
    const [full] = ripplesOf(whole.el);
    const fullRect = full.getBoundingClientRect();
    expect(Math.round(fullRect.width)).toBe(Math.round(box.width));
    expect(Math.round(fullRect.height)).toBe(Math.round(box.height));
    whole.cleanup();

    // An icon button's layer is a circle.
    const part = await renderSubject(subject('icon-button-standard'));
    const [circle] = ripplesOf(part.el);
    const rect = circle.getBoundingClientRect();
    expect(Math.abs(rect.width - rect.height)).toBeLessThan(1);
    const radius = parseFloat(getComputedStyle(circle).borderTopLeftRadius);
    expect(radius).toBeGreaterThanOrEqual(rect.width / 2 - 1);
    part.cleanup();
  });
});
