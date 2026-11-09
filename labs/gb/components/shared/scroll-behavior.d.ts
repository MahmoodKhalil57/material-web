/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ReactiveController, type ReactiveControllerHost } from 'lit';
/**
 * Shared scroll behavior of bars: a bar watches a scroll target and hides,
 * reveals, or compresses with it.
 *
 * - `hide`: scrolling down hides the bar (it slides beyond the screen edge),
 *   scrolling up reveals it, and reaching the top shows it. Used by the app
 *   bar, navigation bar, tabs, and docked and floating toolbars.
 * - `compress`: a medium or large flexible app bar turns into a small one as
 *   soon as the target is scrolled, and stays small until the target is back
 *   at the top (scrolling up does not expand it again).
 *
 * The scroll target is an element id (`scroll-target`) or, by default, the
 * window. Hide and reveal move the host with a transform that uses the
 * spatial spring tokens, so the motion scheme and reduced motion (spatial
 * motion off, the bar jumps) apply without the component knowing about them.
 * The host should be sticky or fixed at the screen edge it hides toward.
 *
 * The bar never hides while it would hurt someone:
 * - focus is inside it (and focus moving into a hidden bar reveals it), so
 *   focus is never lost or obscured (WCAG 2.4.11 Focus Not Obscured);
 * - optionally (`keyboardKeepsVisible`) while the page scrolls because of a
 *   key press. The web cannot tell whether a screen reader is on, but screen
 *   reader and switch users move through the page with the keyboard, so
 *   hiding only on wheel, touch, pointer or programmatic scrolling is the
 *   closest signal.
 *
 * Spec: app-bars ("hide and reappear when scrolling", "medium and large
 * flexible ... transform into small ... remain small until the page is
 * scrolled back to the top"), navigation-bar ("scrolling downward can hide the
 * navigation bar; scrolling upward reveals it", "Don't hide ... when a screen
 * reader is active"), tabs ("scroll offscreen ... reappear when the page is
 * scrolled up", "move as a single unit"), toolbars ("animate offscreen"),
 * motion transitions ("enter and exit ... beyond the screen bounds based on a
 * scroll gesture").
 */
/** The scroll behaviors. */
export type ScrollBehaviorKind = 'hide' | 'compress';
/** Attribute reflecting that the host is hidden by scrolling. */
export declare const SCROLL_HIDDEN_ATTRIBUTE = "scroll-hidden";
/** Scroll distance (px) in one direction before the bar hides or reveals. */
export declare const SCROLL_THRESHOLD = 8;
/** How long (ms) after a scroll key a scroll still counts as keyboard scroll. */
export declare const KEYBOARD_SCROLL_WINDOW = 500;
/** Parses a `scroll-behavior` attribute value. */
export declare function parseScrollBehavior(value: string | null | undefined): ScrollBehaviorKind | null;
/** The state {@link stepScroll} advances. */
export interface ScrollStep {
    /** The scroll position of the last step. */
    y: number;
    /** Whether the bar is hidden. */
    hidden: boolean;
    /** The distance scrolled in the current direction (negative: up). */
    travel: number;
}
/**
 * Advances the hide state for a new scroll position. Pure, so the rules are
 * testable without scrolling: the bar shows at the top and when scrolled up
 * by `threshold`, and hides when scrolled down by `threshold` past the top,
 * unless `canHide` is false (the bar then only reveals).
 */
export declare function stepScroll(prev: ScrollStep, y: number, canHide?: boolean, threshold?: number): ScrollStep;
/** Options of {@link ScrollBehaviorController}. */
export interface ScrollBehaviorOptions {
    /** The behavior (`hide`, `compress`), or null for none. */
    behavior: () => string | null | undefined;
    /** The id of the scrolling element; the window when empty or not found. */
    target: () => string | null | undefined;
    /**
     * The transform that moves the hidden host beyond its screen edge.
     * Default `translateY(-100%)` (top bars).
     */
    hiddenTransform?: string;
    /**
     * Keep the bar visible while the page scrolls because of a key press (a
     * keyboard or screen reader user scrolling). Default false.
     */
    keyboardKeepsVisible?: boolean;
    /** An extra reason to keep the bar visible. */
    keepVisible?: () => boolean;
    /** Called when the target's scrolled state (scroll position above the top) changes. */
    onScrolledChange?: (scrolled: boolean) => void;
}
/** Hides, reveals or compresses the host with a scroll target. */
export declare class ScrollBehaviorController implements ReactiveController {
    private readonly host;
    private readonly options;
    private source;
    private sourceId;
    private step;
    private lastKeyAt;
    private reportedScrolled;
    private focusInside;
    constructor(host: ReactiveControllerHost & HTMLElement, options: ScrollBehaviorOptions);
    /** Whether the host is hidden by scrolling. */
    get hidden(): boolean;
    /** Whether the target is scrolled away from the top. */
    get scrolled(): boolean;
    /** Reveals the host. */
    show(): void;
    hostConnected(): void;
    hostUpdated(): void;
    hostDisconnected(): void;
    private attach;
    private detach;
    private position;
    private get keyboardScrolling();
    private get canHide();
    private readonly onKeydown;
    private readonly onPointer;
    private readonly onFocusIn;
    private readonly onFocusOut;
    private readonly onScroll;
    private scrollStep;
    private reportScrolled;
    private setHidden;
}
