/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** CSS classes applied to visual effects elements and slots. */
export declare const FX_CLASSES: {
    readonly playing: "fx-playing";
};
/**
 * A snapshot of a visual effects element's state.
 *
 * Each field must define how `setupFxSlot()` combines it across multiple
 * slotted fx elements (`playing` is `true` if any slotted fx element plays).
 */
export interface FxState {
    playing?: boolean;
}
/** Returns the `.fx-*` classes for a visual effects state. */
export declare function fxClasses({ playing }?: FxState): ClassInfo;
/** Options for `FxChangeEvent`. */
export interface FxChangeEventInit extends EventInit, FxState {
}
/**
 * Event dispatched by visual effects elements when their state changes.
 *
 * Bubbles through the element's tree (including assigned `<slot>` elements)
 * without crossing enclosing shadow roots (`composed: false`), keeping
 * shadow-internal effects encapsulated by default.
 */
export declare class FxChangeEvent extends Event implements Required<FxState> {
    static readonly type = "fx-change";
    readonly playing: boolean;
    constructor(opts?: FxChangeEventInit);
}
declare global {
    interface HTMLElementEventMap {
        'fx-change': FxChangeEvent;
    }
}
/**
 * Updates a visual effects element's `.fx-*` classes and dispatches an
 * `FxChangeEvent` when its state changes.
 *
 * Visual effects elements own their playback state machine and call this
 * function with a state snapshot whenever that state may have changed.
 */
export declare function updateFxElement(element: HTMLElement, state: FxState): void;
/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`, so shadow stylesheets can match `:has(.fx-playing)` across the
 * slot boundary.
 */
export declare function setupFxSlot(element: HTMLElement, opts: {
    signal: AbortSignal;
}): void;
/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`.
 *
 * @example
 * ```ts
 * html`<slot name="container" ${hasSlotted()} ${fxSlot()}></slot>`;
 * ```
 */
export declare const fxSlot: () => import("lit-html/directive.js").DirectiveResult;
