/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * Screen reader announcements for components whose state changes are not
 * visible in the focused element: one polite and one assertive live region
 * per component, instead of a hand-written region in every template.
 *
 * - Polite announcements (`role="status"`) queue behind what the screen
 *   reader is saying; assertive ones (`role="alert"`) interrupt it. Use
 *   polite for snackbars, month changes and progress; assertive for errors.
 * - The same message can be announced again: a repeat clears the region and
 *   sets the text again after a short delay, which screen readers read as a
 *   change.
 * - The regions are plain elements created by the controller (visually
 *   hidden with inline styles, so no stylesheet is needed), inside the
 *   host's shadow root or the element `container` returns (a modal dialog
 *   needs its region inside, because the page behind it is inert). They are
 *   moved back into the container after each render and removed when the
 *   host disconnects, with pending announcements dropped.
 * - Announcing never moves focus.
 *
 * Spec: the Accessibility sections of snackbars ("use a live region with a
 * polite announcement instead of an assertive announcement"), text fields
 * (error messages get an "alert" role), pull to refresh, date and time
 * pickers.
 */
/** How urgent an announcement is. */
export type Politeness = 'polite' | 'assertive';
/** The attribute that marks a live region of the announcer, with its politeness. */
export declare const ANNOUNCER_ATTRIBUTE = "data-announcer";
/** How long (ms) a repeated or first announcement waits so it reads as a change. */
export declare const ANNOUNCE_DELAY_MS = 60;
/** The ARIA role of the live region for each politeness. */
export declare const ANNOUNCER_ROLES: Readonly<Record<Politeness, string>>;
/** Collapses whitespace so the announced text is stable. */
export declare function normalizeAnnouncement(message: string | null | undefined): string;
/** Creates a hidden live region for `politeness`. */
export declare function createLiveRegion(politeness: Politeness): HTMLElement;
/** A Lit element (or any custom element with controllers). */
export type AnnouncerHost = ReactiveControllerHost & HTMLElement & {
    readonly renderRoot?: HTMLElement | DocumentFragment;
};
/** Options of {@link AnnouncerController}. */
export interface AnnouncerOptions {
    /**
     * The element that holds the live regions. Default: the host's render
     * root. Called after every render, so it may return different elements
     * over time (e.g. the surface of a dialog or a popup).
     */
    container?: () => Element | ShadowRoot | null | undefined;
    /**
     * The regions to create right away, so they are in the page before the
     * first announcement. Default `['polite']`; the assertive region is
     * created on its first use.
     */
    regions?: Politeness[];
    /** Delay (ms) before a repeated or first announcement is set. Default 60. */
    delay?: number;
}
/**
 * Adds polite and assertive live regions to a Lit element.
 *
 * ```ts
 * private readonly announcer = new AnnouncerController(this);
 * ...
 * this.announcer.announce('Refreshing');
 * this.announcer.announce('Enter a valid email', 'assertive');
 * ```
 */
export declare class AnnouncerController implements ReactiveController {
    private readonly host;
    private readonly options;
    private readonly regions;
    private readonly timers;
    constructor(host: AnnouncerHost, options?: AnnouncerOptions);
    hostConnected(): void;
    hostUpdated(): void;
    hostDisconnected(): void;
    /** The text a live region holds now, or '' (also while an announcement is pending). */
    text(politeness?: Politeness): string;
    /** The live region element, created when needed; null when it cannot be attached. */
    region(politeness?: Politeness): HTMLElement;
    /**
     * Announces `message`. Returns a promise that resolves once the text is in
     * the live region (at once for a new message in an existing region, after
     * the delay for a repeat or a new region) or the announcement was
     * replaced, cleared or dropped by a disconnect.
     */
    announce(message: string | null | undefined, politeness?: Politeness): Promise<void>;
    /** Empties a live region (both by default) and drops pending announcements. */
    clear(politeness?: Politeness): void;
    private parent;
    private cancel;
    private cancelAll;
}
