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
import '../../tabs/md-gb-tabs.js';
import '../../tabs/md-gb-tab.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {
  center,
  deepActiveElement,
  deepElements,
  hitTargetSize,
  prop,
  renderSubject,
  ripplesOf,
  settle,
  sleep,
  SUBJECTS,
  type Subject,
} from './subjects.js';
import {contentAlphas, isWithin, paintFingerprint as paint, textElements} from './style-helpers.js';

// Foundations > Interaction > States (foundations/interaction/states.md):
// the model of state layers (one layer at a time, in the content color, fixed
// opacities) and which components inherit which state. The per-state opacity
// checks of every part are in `state-layers_test.ts`, the focus ring in
// `focus-indicator_test.ts`, disabled parts in `disabled_test.ts`.

const subject = (id: string): Subject => SUBJECTS.find((s) => s.id === id)!;

async function hover(el: Element) {
  const c = center(el);
  await sendMouse({type: 'move', position: [c.x, c.y]});
  await sleep(100);
}

async function reset() {
  await sendMouse({type: 'up'}).catch(() => {});
  await sendMouse({type: 'move', position: [0, 0]});
  (document.activeElement as HTMLElement | null)?.blur();
  await sleep(30);
}

async function focusByKeyboard(el: HTMLElement) {
  await sendKeys({press: 'Shift'});
  el.focus();
  await sleep(60);
}

/** The layer opacities (hover/focus/drag, press) of a subject's ripples. */
function layers(el: Element) {
  const ripples = ripplesOf(el);
  const pct = (name: string) =>
    Math.max(0, ...ripples.map((r) => parseFloat(prop(r, name)) || 0));
  return {layer: pct('--ripple-hover-opacity'), press: pct('--ripple-press-opacity')};
}

/** Whether a ripple paints a state layer. */
function rippleLayer(el: Element) {
  return ripplesOf(el).some((r) => {
    const painted = getComputedStyle(r).backgroundImage !== 'none';
    return painted && (parseFloat(prop(r, '--ripple-hover-opacity')) > 0 || parseFloat(prop(r, '--ripple-press-opacity')) > 0);
  });
}

/** Whether a subject shows a state layer: a ripple, or its own (text fields) via `resting`. */
function anyLayer(el: Element, resting?: string) {
  return rippleLayer(el) || (resting !== undefined && paint(el) !== resting);
}

describe('state layer model (central)', () => {
  afterEach(reset);

  // spec: interaction-states-035523, interaction-states-3fc45f
  it('shows one layer at a time, 8% for hover, 10% for focus, 16% for dragged', async () => {
    const {el, cleanup} = await renderSubject(subject('button-filled'));
    const [ripple] = ripplesOf(el);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('0%');
    ripple.classList.add('hover');
    await sleep(60);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('8%');
    // Focus takes the place of hover: the layers never add up.
    ripple.classList.add('focus');
    await sleep(60);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('10%');
    ripple.classList.add('dragged');
    await sleep(60);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('16%');
    ripple.classList.remove('dragged', 'focus');
    await sleep(60);
    expect(prop(ripple, '--ripple-hover-opacity')).toBe('8%');
    cleanup();
  });

  // spec: interaction-states-3fc45f
  it('shows a 10% layer for focus from the keyboard and 10% for press', async () => {
    const {el, cleanup} = await renderSubject(subject('button-tonal'));
    await focusByKeyboard(el);
    expect(layers(el).layer).toBe(10);
    await reset();
    await hover(el);
    await sendMouse({type: 'down'});
    await sleep(150);
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
      expect(anyLayer(el, resting)).withContext(id).toBeTrue();
      cleanup();
    }
  });

  // spec: interaction-states-d8af74
  it('puts the state layer between the container (below) and the content (above)', async () => {
    const {el, cleanup} = await renderSubject(subject('button-tonal'));
    const [ripple] = ripplesOf(el);
    await hover(el);
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
    await sleep(100);
    expect(anyLayer(bar, resting)).toBeFalse();
    await hover(button);
    expect(layers(button).layer).toBe(8);
    cleanup();
  });

  // spec: interaction-states-1b2c02, interaction-states-23a7c8
  it('combines hover with the selected state of a filter chip', async () => {
    const {el, cleanup} = await renderSubject(subject('chip-filter'), {selected: true});
    await hover(el);
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
    expect(layers(one).layer).toBe(8);
    expect(layers(two).layer).toBe(0);
    await hover(two);
    expect(layers(two).layer).toBe(8);
    await sleep(60);
    expect(layers(one).layer).toBe(0);
    cleanup();
  });
});

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
      await sleep(30);
      const resting = paint(el);
      expect(anyLayer(el, resting)).toBeFalse();
      await focusByKeyboard(el);
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
    await sendKeys({press: 'Shift'});
    button.focus();
    await sleep(60);
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
    expect(layers(one).layer).toBe(10);
    await sendKeys({press: 'Tab'});
    await sleep(60);
    expect(layers(two).layer).toBe(10);
    expect(layers(one).layer).toBe(0);
    cleanup();
  });
});

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
      await sleep(150);
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
    await sleep(150);
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
    await sleep(80);
    await sendKeys({up: 'Enter'});
    expect(layers(el).press).toBeCloseTo(10, 1);
    cleanup();
  });

  // spec: interaction-states-ce409c, interaction-states-bd56b1
  it('combines pressed with hover, focus and selected', async () => {
    const {el, cleanup} = await renderSubject(subject('chip-filter'), {selected: true});
    await hover(el);
    await sendMouse({type: 'down'});
    await sleep(150);
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
    await sleep(150);
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
    await sleep(120);
    expect(bar.shadowRoot!.querySelectorAll('.ripple').length).toBe(0);
    expect(anyLayer(bar, resting)).toBeFalse();
    await sendMouse({type: 'up'});
    cleanup();
  });
});

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
      await sleep(60);
      expect(layers(el).layer === 16 || paint(el).includes('0.16')).withContext(label).toBeTrue();
      expect(shadowOf(el)).not.toBe(resting);
      cleanup();
    });
  }

  // spec: interaction-states-479709, interaction-states-b196d6
  it('inherits dragged: list items', async () => {
    const {el, cleanup} = await renderSubject(subject('list-item'), {dragging: true});
    await sleep(60);
    const painted = deepElements(el).map((e) => getComputedStyle(e).backgroundImage).join('|');
    expect(painted).toContain('0.16');
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
    bar.setAttribute('aria-grabbed', 'true');
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
