/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * Shared expand/collapse (disclosure) behavior: list item expand, FAB menu
 * open/close, extended FAB `expanded`, floating toolbar collapse, and any
 * trigger that shows or hides a region.
 *
 * - The trigger carries `aria-expanded` (when it controls a region) and
 *   `aria-controls` pointing at the region.
 * - A collapsed region is `inert` (or `hidden`), so it takes no focus and is
 *   skipped by assistive technology; the region stays in the layout so CSS
 *   can animate it.
 * - Enter and Space on the trigger toggle it (native buttons through their
 *   click; custom `role="button"` triggers through the keyboard).
 * - A user toggle first fires a cancelable `toggle` event (a `ToggleEvent`
 *   with `oldState` / `newState`, like the platform's `beforetoggle`);
 *   cancelling it keeps the current state. Programmatic changes (setting the
 *   property) fire nothing.
 * - Motion goes through the motion tokens (`readMotion()`), and collapses to
 *   no motion when the user prefers reduced motion.
 *
 * Spec: lists.md (expand and collapse), floating-action-button.md and
 * extended-fab.md (collapse and expand), fab-menu.md (open and close),
 * toolbars.md (collapse), WAI-ARIA disclosure pattern.
 */
/** How a collapsed region is taken out of the interaction and a11y tree. */
export type DisclosureHide = 'inert' | 'hidden' | 'none';
/** `ToggleEvent` states of a disclosure. */
export type DisclosureToggleState = 'open' | 'closed';
/**
 * Attribute converter for a boolean `expanded` property that defaults to
 * `true` and collapses with `expanded="false"` (extended FAB), as Compose's
 * `expanded` parameter does. Removing the attribute expands again.
 */
export declare const expandedUnlessFalseConverter: {
    fromAttribute: (value: string | null) => boolean;
};
/**
 * Like {@link expandedUnlessFalseConverter} for a reflected property (floating
 * toolbar): expanded reflects as a bare attribute, and removing the attribute
 * collapses.
 */
export declare const reflectedExpandedConverter: {
    fromAttribute: (value: string | null) => boolean;
    toAttribute: (value: boolean) => string;
};
/** The resolved timing of a motion token. */
export interface MotionTiming {
    /** The duration in ms (0 under reduced motion). */
    duration: number;
    /** The CSS easing (the spring's `linear()` curve, or `linear` when reduced). */
    easing: string;
    /** Whether the user prefers reduced motion. */
    reduced: boolean;
}
/** Whether the user prefers reduced motion. */
export declare function prefersReducedMotion(): boolean;
/** Parses a CSS time (`420ms`, `0.4s`); NaN when it isn't one. */
export declare function parseTime(value: string): number;
/**
 * Reads a spring from the motion tokens
 * (`--md-sys-motion-spring-<name>` and `-duration`) in the context of an
 * element. Reduced motion resolves to no duration, whatever the tokens say.
 *
 * @param element The element whose tokens apply.
 * @param spring The spring token name. Default `default-spatial`.
 */
export declare function readMotion(element: Element, spring?: string): MotionTiming;
/** Elements a disclosure applies its attributes to. */
export interface DisclosureParts {
    /** The element that toggles the region, if any. */
    trigger?: HTMLElement | null;
    /** The region the trigger shows and hides, if any. */
    region?: HTMLElement | null;
    /** How the collapsed region is hidden. Default `inert`. */
    hide?: DisclosureHide;
    /** Whether the trigger gets `aria-expanded` and `aria-controls`. Default true. */
    aria?: boolean;
}
/**
 * Applies a disclosure state to its elements: `aria-expanded` and
 * `aria-controls` on the trigger, `inert` / `hidden` on the region.
 */
export declare function applyDisclosure(expanded: boolean, { trigger, region, hide, aria }: DisclosureParts): void;
/**
 * Asks for a user toggle: fires a cancelable `toggle` event on `target`.
 *
 * @return Whether the toggle may proceed (the event wasn't cancelled).
 */
export declare function requestToggle(target: EventTarget, expanded: boolean): boolean;
/** Options of {@link DisclosureController}. */
export interface DisclosureOptions {
    /** The element that toggles the region, if any. */
    trigger?: () => HTMLElement | null;
    /** The region that is shown and hidden, if any. */
    region?: () => HTMLElement | null;
    /** The host's current state. */
    expanded: () => boolean;
    /** Sets the host's state (a property); called after the toggle event. */
    setExpanded: (expanded: boolean) => void;
    /** Whether the disclosure ignores user toggles. */
    disabled?: () => boolean;
    /**
     * Whether the disclosure applies at all (a toolbar only collapses with a
     * FAB). While false, nothing is hidden and no ARIA is set. Default true.
     */
    enabled?: () => boolean;
    /** How a collapsed region is hidden. Default `inert`. */
    hide?: DisclosureHide;
    /** Whether the trigger gets `aria-expanded` / `aria-controls`. Default true. */
    aria?: boolean;
    /**
     * Whether Enter and Space on the trigger toggle it. Needed for triggers
     * that aren't native buttons or links (a native button already clicks).
     */
    keys?: boolean;
    /** Where the `toggle` event is fired. Default the host. */
    eventTarget?: () => EventTarget;
}
/**
 * A Lit controller for an expand/collapse trigger and region. The host owns
 * the `expanded` state as a property; the controller applies it to the
 * elements after every update and turns user input into toggles.
 */
export declare class DisclosureController implements ReactiveController {
    private readonly host;
    private readonly options;
    private bound;
    private spaceDown;
    constructor(host: ReactiveControllerHost & HTMLElement, options: DisclosureOptions);
    /** Whether the disclosure is expanded. */
    get expanded(): boolean;
    hostConnected(): void;
    hostDisconnected(): void;
    hostUpdated(): void;
    /** Applies the state to the trigger and region, and (re)binds the trigger. */
    sync(): void;
    /** The motion of the expand/collapse (see {@link readMotion}). */
    motion(spring?: string): MotionTiming;
    /**
     * Toggles on behalf of the user: fires the cancelable `toggle` event, then
     * sets the state unless it was cancelled.
     *
     * @return Whether the state changed.
     */
    toggle(): boolean;
    /** Expands on behalf of the user. @return Whether the state changed. */
    expand(): boolean;
    /** Collapses on behalf of the user. @return Whether the state changed. */
    collapse(): boolean;
    private set;
    private bind;
    private unbind;
    private readonly onClick;
    private get nativeTrigger();
    private readonly onKeydown;
    private readonly onKeyup;
}
