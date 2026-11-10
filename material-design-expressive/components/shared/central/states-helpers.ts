/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {sendKeys, sendMouse} from '@web/test-runner-commands';

import {center, prop, ripplesOf, SUBJECTS, type Subject} from './subjects.js';
import {paintFingerprint as paint} from './style-helpers.js';

// Helpers shared by the state-model suites (`states-foundation*_test.ts`).

export const subject = (id: string): Subject => SUBJECTS.find((s) => s.id === id)!;

/**
 * Finishes every running transition and animation in the document (also in
 * shadow roots), so the layers rest at their end values.
 */
export function settleMotion() {
  for (const a of document.getAnimations()) {
    try {
      a.finish();
    } catch {
      // An infinite animation cannot finish.
    }
  }
}

/**
 * Lets the browser process pointer and focus input: a few animation frames.
 * Used only where a check must see that nothing changed (no state to wait for).
 */
export function frames(n = 3): Promise<void> {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => (++i >= n ? resolve() : requestAnimationFrame(tick));
    requestAnimationFrame(tick);
  });
}

/** Moves the cursor onto a part and lets the pointer and the hover fade settle. */
export async function hover(el: Element) {
  settleMotion();
  const c = center(el);
  await sendMouse({type: 'move', position: [c.x, c.y]});
  await frames();
  settleMotion();
}

/** Releases the pointer, moves it away and removes focus. */
export async function reset() {
  await sendMouse({type: 'up'}).catch(() => {});
  await sendMouse({type: 'move', position: [0, 0]});
  (document.activeElement as HTMLElement | null)?.blur();
}

/** Moves focus the way a keyboard user does (the last input was a key). */
export async function focusByKeyboard(el: HTMLElement) {
  await sendKeys({press: 'Shift'});
  el.focus();
  settleMotion();
}

/** The layer opacities (hover/focus/drag, press) of a subject's ripples. */
export function layers(el: Element) {
  const ripples = ripplesOf(el);
  const pct = (name: string) =>
    Math.max(0, ...ripples.map((r) => parseFloat(prop(r, name)) || 0));
  return {layer: pct('--ripple-hover-opacity'), press: pct('--ripple-press-opacity')};
}

/** Whether a ripple paints a state layer. */
export function rippleLayer(el: Element) {
  return ripplesOf(el).some((r) => {
    const painted = getComputedStyle(r).backgroundImage !== 'none';
    return painted && (parseFloat(prop(r, '--ripple-hover-opacity')) > 0 || parseFloat(prop(r, '--ripple-press-opacity')) > 0);
  });
}

/** Whether a subject shows a state layer: a ripple, or its own (text fields) via `resting`. */
export function anyLayer(el: Element, resting?: string) {
  return rippleLayer(el) || (resting !== undefined && paint(el) !== resting);
}
