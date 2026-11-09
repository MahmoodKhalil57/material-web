/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type WindowHeightClass, type WindowSizeClass, type WindowSizeClassControllerOptions } from '../../styles/layout/window-size-class.js';
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
export declare function resolveAdaptiveOptions<T extends object>(base: T, options: AdaptiveOptions<T> | undefined, cls: WindowSizeClass): T;
/** Options for `AdaptiveController`. */
export interface AdaptiveControllerOptions<T extends object> extends WindowSizeClassControllerOptions {
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
export declare const WINDOW_SIZE_CLASS_ATTRIBUTE = "window-size-class";
/** Attribute that carries the height class on the host. */
export declare const WINDOW_HEIGHT_CLASS_ATTRIBUTE = "window-height-class";
/** Tracks the window size class of a host and resolves per-class options. */
export declare class AdaptiveController<T extends object = Record<string, never>> implements ReactiveController {
    private readonly host;
    private readonly size;
    private base;
    private declared;
    private readonly reflect;
    constructor(host: ReactiveControllerHost & HTMLElement, config?: AdaptiveControllerOptions<T>);
    hostConnected(): void;
    hostUpdate(): void;
    hostDisconnected(): void;
    /** The current window size class (`compact` until measured). */
    get sizeClass(): WindowSizeClass;
    /** The current window height size class (`medium` until measured). */
    get heightClass(): WindowHeightClass;
    /** The options for the current class. */
    get options(): T;
    /** The options for another class, e.g. to compare. */
    optionsFor(cls: WindowSizeClass): T;
    /** Declares the per-class options (replacing earlier ones) and re-renders. */
    declare(options: AdaptiveOptions<T>, base?: T): void;
    /** Whether the width class is `cls` or larger. */
    atLeast(cls: WindowSizeClass): boolean;
    /** Whether the height class is `cls` or larger. */
    heightAtLeast(cls: WindowHeightClass): boolean;
    /** Re-reads the target, e.g. after the host moved. */
    observe(): void;
    /** Sets the class directly, e.g. from an ancestor's class. */
    set(cls: WindowSizeClass): void;
    private reflectClasses;
}
