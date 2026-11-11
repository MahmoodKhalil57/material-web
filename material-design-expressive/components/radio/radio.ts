/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {focusRingClasses} from '../../foundations/interaction/states/focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../../foundations/interaction/states/ripple/ripple.js';
import {densityClasses, densityClassNames} from '../../foundations/layout/density.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../../foundations/interaction/states/pseudo-classes.js';

/** Radio classes. */
export const RADIO_CLASSES = {
  radio: 'radio',
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  checked: PSEUDO_CLASSES.checked,
  disabled: PSEUDO_CLASSES.disabled,
  ...densityClassNames('radio'),
} as const;

/** The state provided to the `radioClasses()` function. */
export interface RadioClassesState {
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /** The density, 0 (default) to -3. */
  density?: number;
}

/**
 * Returns the radio classes to apply to an element based on the given state.
 *
 * @param state The state of the radio.
 * @return An object of class names and truthy values if they apply.
 */
export function radioClasses({
  hover = false,
  focus = false,
  active = false,
  checked = false,
  disabled = false,
  density = 0,
}: RadioClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [RADIO_CLASSES.radio]: true,
    [RADIO_CLASSES.hover]: hover,
    [RADIO_CLASSES.focus]: focus,
    [RADIO_CLASSES.active]: active,
    [RADIO_CLASSES.checked]: checked,
    [RADIO_CLASSES.disabled]: disabled,
    ...densityClasses(RADIO_CLASSES.radio, density),
  };
}

/**
 * Sets up radio functionality for the given element.
 *
 * @param radio The element on which to set up radio functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupRadio(
  radio: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(radio, opts);
}

/**
 * A Lit directive that adds radio styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <input type="radio" class="${radio()}" name="radio-group">
 *   <input type="radio" class="${radio()}" name="radio-group">
 *   <input type="radio" class="${radio()}" name="radio-group">
 * `;
 * ```
 */
export const radio = createClassMapDirective({
  getClasses: radioClasses,
  setupElement: setupRadio,
});
