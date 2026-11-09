/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type WindowHeightClass, type WindowSizeClass, type WindowSizeClassValues } from './layout-values.js';
export { DOCKED_PANE_EDGE, DOCKED_PANE_FLOATS_FROM, PANE_SNAP_SPLIT, PANE_SNAP_WIDTHS, THIRD_PANE_MAX_WIDTH, WINDOW_HEIGHT_CLASS_VALUES, WINDOW_HEIGHT_CLASSES, WINDOW_SIZE_CLASS_VALUES, WINDOW_SIZE_CLASSES, type WindowHeightClass, type WindowHeightClassValues, type WindowSizeClass, type WindowSizeClassValues, } from './layout-values.js';
/**
 * Returns the M3 window size class (breakpoint) for a width in CSS px:
 * compact (< 600), medium (600–839), expanded (840–1199), large (1200–1599)
 * or extra-large (1600+).
 */
export declare function windowSizeClass(width: number): WindowSizeClass;
/**
 * Returns the M3 window height size class for a height in CSS px: compact
 * (< 480), medium (480–899) or expanded (900+). Most layouts scroll
 * vertically, so the spec expects few layouts to adjust to height.
 */
export declare function windowHeightClass(height: number): WindowHeightClass;
/** The width and height size classes of a window. */
export interface WindowSizeClasses {
    width: WindowSizeClass;
    height: WindowHeightClass;
}
/** Returns both the width and the height size class of a window size. */
export declare function windowSizeClasses(width: number, height: number): WindowSizeClasses;
/** Returns the layout values (margin, spacer, panes, ...) of a class. */
export declare function windowSizeClassValues(cls: WindowSizeClass): WindowSizeClassValues;
/**
 * Compares two window size classes: negative if `a` is smaller than `b`,
 * 0 if equal, positive if larger.
 */
export declare function compareWindowSizeClasses(a: WindowSizeClass, b: WindowSizeClass): number;
/** Whether `cls` is `min` or a larger class. */
export declare function isWindowSizeClassAtLeast(cls: WindowSizeClass, min: WindowSizeClass): boolean;
/** Whether the height class `cls` is `min` or a larger class. */
export declare function isWindowHeightClassAtLeast(cls: WindowHeightClass, min: WindowHeightClass): boolean;
/** What `observeWindowSizeClass()` measures. */
export type WindowSizeTarget = Element | Window;
/** Called with the new class and the measured width. */
export type WindowSizeClassCallback = (cls: WindowSizeClass, width: number) => void;
/** Called with the new height class and the measured height. */
export type WindowHeightClassCallback = (cls: WindowHeightClass, height: number) => void;
/** Options for `observeWindowSizeClass()`. */
export interface ObserveWindowSizeClassOptions {
    /** Stops observing when aborted. */
    signal?: AbortSignal;
    /**
     * Whether to call the callback right away with the current class.
     * Defaults to true.
     */
    initial?: boolean;
}
/** Returns the inline size of an element's border box, or the viewport. */
export declare function measureWidth(target: WindowSizeTarget): number;
/** Returns the block size of an element's border box, or the viewport. */
export declare function measureHeight(target: WindowSizeTarget): number;
/**
 * Calls `callback` whenever the window size class of `target` changes.
 *
 * For a `Window`, the class follows the viewport (via `matchMedia()` on the
 * breakpoint widths). For an element, it follows the element's border box
 * width (via `ResizeObserver`), so a resizable container can stand in for
 * the window.
 *
 * @return A function that stops observing.
 */
export declare function observeWindowSizeClass(target: WindowSizeTarget, callback: WindowSizeClassCallback, { signal, initial }?: ObserveWindowSizeClassOptions): () => void;
/**
 * Calls `callback` whenever the window height size class of `target`
 * changes, like `observeWindowSizeClass()` for heights.
 *
 * @return A function that stops observing.
 */
export declare function observeWindowHeightClass(target: WindowSizeTarget, callback: WindowHeightClassCallback, { signal, initial }?: ObserveWindowSizeClassOptions): () => void;
/**
 * Calls `callback` whenever the width or the height size class of `target`
 * changes, with both classes.
 *
 * @return A function that stops observing.
 */
export declare function observeWindowSizeClasses(target: WindowSizeTarget, callback: (classes: WindowSizeClasses, width: number, height: number) => void, { signal, initial }?: ObserveWindowSizeClassOptions): () => void;
/** Options for `WindowSizeClassController`. */
export interface WindowSizeClassControllerOptions {
    /**
     * What to measure. Defaults to the host element. Called when the host
     * connects, so it can look up an ancestor. Return null to not measure
     * anything and feed the class with `set()` instead.
     */
    target?: () => WindowSizeTarget | null;
    /** Called after the class changes, before the host updates. */
    onChange?: (cls: WindowSizeClass, previous: WindowSizeClass | null) => void;
    /** Called after the height class changes, before the host updates. */
    onHeightChange?: (cls: WindowHeightClass, previous: WindowHeightClass | null) => void;
}
/**
 * A Lit controller that tracks the window size class (and window height
 * size class) of its host, or of another target, and requests an update
 * when either changes.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   private readonly size = new WindowSizeClassController(this);
 *   render() {
 *     return this.size.value === 'compact' ? html`...` : html`...`;
 *   }
 * }
 * ```
 */
export declare class WindowSizeClassController implements ReactiveController {
    private readonly host;
    private readonly options;
    /** The current window size class. `compact` until measured. */
    value: WindowSizeClass;
    /** The current window height size class. `medium` until measured. */
    height: WindowHeightClass;
    private stop;
    private measured;
    private heightMeasured;
    constructor(host: ReactiveControllerHost & HTMLElement, options?: WindowSizeClassControllerOptions);
    hostConnected(): void;
    hostDisconnected(): void;
    /** Re-reads the target (e.g. after the host moved) and re-measures. */
    observe(): void;
    /** Sets the class directly, e.g. from an ancestor's class. */
    set(cls: WindowSizeClass): void;
    /** Sets the height class directly, e.g. from an ancestor's class. */
    setHeight(cls: WindowHeightClass): void;
}
