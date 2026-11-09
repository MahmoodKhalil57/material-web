/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { createElementDirective } from './directives.js';
import { updateClassList } from './update-class-list.js';
/** CSS classes applied to visual effects elements and slots. */
export const FX_CLASSES = {
    playing: 'fx-playing',
};
/** Returns the `.fx-*` classes for a visual effects state. */
export function fxClasses({ playing = false } = {}) {
    return {
        [FX_CLASSES.playing]: playing,
    };
}
/**
 * Event dispatched by visual effects elements when their state changes.
 *
 * Bubbles through the element's tree (including assigned `<slot>` elements)
 * without crossing enclosing shadow roots (`composed: false`), keeping
 * shadow-internal effects encapsulated by default.
 */
export class FxChangeEvent extends Event {
    constructor(opts) {
        super(FxChangeEvent.type, { bubbles: true, composed: false, ...opts });
        this.playing = opts?.playing ?? false;
    }
}
FxChangeEvent.type = 'fx-change';
/**
 * Updates a visual effects element's `.fx-*` classes and dispatches an
 * `FxChangeEvent` when its state changes.
 *
 * Visual effects elements own their playback state machine and call this
 * function with a state snapshot whenever that state may have changed.
 */
export function updateFxElement(element, state) {
    const wasPlaying = element.classList.contains(FX_CLASSES.playing);
    const isPlaying = state.playing ?? false;
    updateClassList(element, fxClasses({ playing: isPlaying }));
    if (isPlaying !== wasPlaying) {
        element.dispatchEvent(new FxChangeEvent({ playing: isPlaying }));
    }
}
/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`, so shadow stylesheets can match `:has(.fx-playing)` across the
 * slot boundary.
 */
export function setupFxSlot(element, opts) {
    if (!(element instanceof HTMLSlotElement)) {
        throw new Error('fxSlot() must be used on a <slot> element.');
    }
    const slot = element;
    const playingTargets = new Set();
    const syncClasses = () => {
        for (const target of playingTargets) {
            if (!(target instanceof Element) ||
                !target.isConnected ||
                !target.classList.contains(FX_CLASSES.playing)) {
                playingTargets.delete(target);
            }
        }
        updateClassList(slot, fxClasses({ playing: playingTargets.size > 0 }));
    };
    // Re-check assigned elements on 'slotchange', since a removed fx element
    // dispatches its final `FxChangeEvent` after it is no longer slotted.
    const syncAssignedElements = () => {
        playingTargets.clear();
        for (const el of slot.assignedElements({ flatten: true })) {
            if (el.matches(`.${FX_CLASSES.playing}`)) {
                playingTargets.add(el);
            }
            for (const child of el.querySelectorAll(`.${FX_CLASSES.playing}`)) {
                playingTargets.add(child);
            }
        }
        syncClasses();
    };
    syncAssignedElements();
    slot.addEventListener('slotchange', syncAssignedElements, opts);
    slot.addEventListener(FxChangeEvent.type, (event) => {
        if (!event.target)
            return;
        if (event.playing) {
            playingTargets.add(event.target);
        }
        else {
            playingTargets.delete(event.target);
        }
        syncClasses();
    }, opts);
}
/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`.
 *
 * @example
 * ```ts
 * html`<slot name="container" ${hasSlotted()} ${fxSlot()}></slot>`;
 * ```
 */
export const fxSlot = createElementDirective(setupFxSlot);
//# sourceMappingURL=fx.js.map