/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  type ReactiveController,
  type ReactiveControllerHost,
} from 'lit';

import {
  compareWindowSizeClasses,
  isWindowHeightClassAtLeast,
  isWindowSizeClassAtLeast,
  WINDOW_SIZE_CLASSES,
  WindowSizeClassController,
  type WindowHeightClass,
  type WindowSizeClass,
  type WindowSizeClassControllerOptions,
} from './window-size-class.js';

/**
 * Adaptive design for components whose spec changes by window size class
 * (compact, medium, expanded, large, extra-large).
 *
 * `AdaptiveController` is a small layer on `WindowSizeClassController`:
 *
 * - it exposes the current class on the host as the `window-size-class`
 *   (and `window-height-class`) attribute, so CSS can match
 *   `:host([window-size-class='compact'])`,
 * - it re-renders the host when the class changes,
 * - a component declares per-class options once and reads `options` for the
 *   class it is in.
 *
 * Options cascade upward like `min-width` media queries: a class uses its own
 * options, else those of the nearest smaller class that has some, else the
 * `base`. So `{compact: {max: 2}, expanded: {max: 4}}` gives `max: 2` for
 * compact and medium, and `4` from expanded up.
 *
 * @example
 * ```ts
 * class MyBar extends LitElement {
 *   private readonly adaptive = new AdaptiveController(this, {
 *     options: {compact: {actions: 2}, expanded: {actions: 4}},
 *   });
 *   render() {
 *     return html`${this.adaptive.options.actions} actions`;
 *   }
 * }
 * ```
 */

/** Per-class options. Missing classes inherit from the next smaller one. */
export type AdaptiveOptions<T> = Partial<Record<WindowSizeClass, Partial<T>>>;

/**
 * The options of window size class `cls`: `base`, overridden by the options
 * of each class up to and including `cls` that has some.
 */
export function resolveAdaptiveOptions<T extends object>(
  base: T,
  options: AdaptiveOptions<T> | undefined,
  cls: WindowSizeClass,
): T {
  const resolved = {...base};
  if (!options) return resolved;
  for (const candidate of WINDOW_SIZE_CLASSES) {
    if (compareWindowSizeClasses(candidate, cls) > 0) break;
    Object.assign(resolved, options[candidate]);
  }
  return resolved;
}

/** Options for `AdaptiveController`. */
export interface AdaptiveControllerOptions<T extends object>
  extends WindowSizeClassControllerOptions {
  /** Options used in every class unless a class overrides them. */
  base?: T;
  /** Per-class overrides, cascading upward. */
  options?: AdaptiveOptions<T>;
  /**
   * Reflect the classes on the host as `window-size-class` and
   * `window-height-class`. Defaults to true.
   */
  reflect?: boolean;
}

/** Attribute that carries the width class on the host. */
export const WINDOW_SIZE_CLASS_ATTRIBUTE = 'window-size-class';

/** Attribute that carries the height class on the host. */
export const WINDOW_HEIGHT_CLASS_ATTRIBUTE = 'window-height-class';

/** Tracks the window size class of a host and resolves per-class options. */
export class AdaptiveController<T extends object = Record<string, never>>
  implements ReactiveController
{
  private readonly size: WindowSizeClassController;
  private base: T;
  private declared: AdaptiveOptions<T> | undefined;
  private readonly reflect: boolean;

  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement,
    config: AdaptiveControllerOptions<T> = {},
  ) {
    const {base, options, reflect = true, ...sizeOptions} = config;
    this.base = base ?? ({} as T);
    this.declared = options;
    this.reflect = reflect;
    this.size = new WindowSizeClassController(host, sizeOptions);
    host.addController(this);
  }

  hostConnected() {
    this.reflectClasses();
  }

  hostUpdate() {
    this.reflectClasses();
  }

  hostDisconnected() {
    if (!this.reflect) return;
    this.host.removeAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE);
    this.host.removeAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE);
  }

  /** The current window size class (`compact` until measured). */
  get sizeClass(): WindowSizeClass {
    return this.size.value;
  }

  /** The current window height size class (`medium` until measured). */
  get heightClass(): WindowHeightClass {
    return this.size.height;
  }

  /** The options for the current class. */
  get options(): T {
    return resolveAdaptiveOptions(this.base, this.declared, this.size.value);
  }

  /** The options for another class, e.g. to compare. */
  optionsFor(cls: WindowSizeClass): T {
    return resolveAdaptiveOptions(this.base, this.declared, cls);
  }

  /** Declares the per-class options (replacing earlier ones) and re-renders. */
  declare(options: AdaptiveOptions<T>, base?: T) {
    this.declared = options;
    if (base) this.base = base;
    this.host.requestUpdate();
  }

  /** Whether the width class is `cls` or larger. */
  atLeast(cls: WindowSizeClass): boolean {
    return isWindowSizeClassAtLeast(this.size.value, cls);
  }

  /** Whether the height class is `cls` or larger. */
  heightAtLeast(cls: WindowHeightClass): boolean {
    return isWindowHeightClassAtLeast(this.size.height, cls);
  }

  /** Re-reads the target, e.g. after the host moved. */
  observe() {
    this.size.observe();
  }

  /** Sets the class directly, e.g. from an ancestor's class. */
  set(cls: WindowSizeClass) {
    this.size.set(cls);
  }

  private reflectClasses() {
    if (!this.reflect) return;
    this.host.setAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE, this.size.value);
    this.host.setAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE, this.size.height);
  }
}
