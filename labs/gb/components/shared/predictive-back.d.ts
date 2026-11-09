/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Predictive back for modal surfaces (bottom and side sheets, the modal
 * navigation rail and the search view), per the M3 gestures page
 * (`foundations/interaction/gestures.md`, "Predictive back") and the
 * component spec pages.
 *
 * The web has no standard back-progress events yet, so the gesture's
 * progress can't be followed. Instead the surface plays the predictive back
 * transform (the state Compose reaches at full gesture progress) as a short
 * animation when a back request closes it, then runs its normal close motion.
 *
 * Back requests come from the platform's close requests: a modal `<dialog>`
 * receives them as `cancel` events (Chrome routes Escape and the Android back
 * gesture or button through its close watcher), and other surfaces use
 * `BackHandler` (a `CloseWatcher`, or Escape where `CloseWatcher` is missing).
 */
/** Close reason for a back request (Android back gesture or button). */
export declare const BACK_REASON = "back";
/** Close reason for the Escape key. */
export declare const ESCAPE_REASON = "escape";
/** Where a close request came from. */
export type CloseRequestSource = typeof BACK_REASON | typeof ESCAPE_REASON;
/**
 * Compose `PredictiveBackEasing` (material3 `internal/BackHandler.kt`),
 * applied to the back progress.
 */
export declare const PREDICTIVE_BACK_EASING = "cubic-bezier(0.1, 0.1, 0, 1)";
/**
 * How long the back progress plays on close: `md.sys.motion.duration.short4`.
 * Compose follows the finger instead; the web has no progress events, so this
 * stands in for a quick back swipe.
 */
export declare const PREDICTIVE_BACK_DURATION_MS = 200;
/**
 * Compose `BottomSheet.kt` `PredictiveBackMaxScaleXDistance` (48dp) and
 * `PredictiveBackMaxScaleYDistance` (24dp): how far the sheet shrinks.
 */
export declare const BOTTOM_SHEET_PREDICTIVE_BACK_MAX_X_PX = 48;
/** See `BOTTOM_SHEET_PREDICTIVE_BACK_MAX_X_PX`. */
export declare const BOTTOM_SHEET_PREDICTIVE_BACK_MAX_Y_PX = 24;
/**
 * Compose `WideNavigationRail.kt` `PredictiveBackMaxScaleXDistance` (24dp)
 * and `PredictiveBackMaxScaleYDistance` (48dp), used for edge surfaces (the
 * modal rail and side sheets).
 */
export declare const SIDE_PREDICTIVE_BACK_MAX_X_PX = 24;
/** See `SIDE_PREDICTIVE_BACK_MAX_X_PX`. */
export declare const SIDE_PREDICTIVE_BACK_MAX_Y_PX = 48;
/** Compose `SearchBar.kt` `SearchBarPredictiveBackMinScale` (9/10). */
export declare const SEARCH_PREDICTIVE_BACK_MIN_SCALE = 0.9;
/**
 * Records trusted Escape presses, so close requests can tell Escape from the
 * back gesture. Installed once, in the capture phase, before any component
 * handler can stop the event.
 */
export declare function trackEscapeKey(): void;
/** Forgets recorded Escape presses (for tests). */
export declare function resetEscapeTracking(): void;
/**
 * Where a dialog `cancel` event came from. The browser fires `cancel` for
 * Escape and for the Android back gesture or button; a trusted `cancel` with
 * no Escape press just before it is a back request. Synthetic `cancel` events
 * count as Escape, as before predictive back.
 */
export declare function closeRequestSource(event: Event): CloseRequestSource;
/**
 * Listens for back requests while a non-dialog surface is open, like Compose
 * `BackHandler`. Uses a `CloseWatcher` where supported (Escape, and the
 * Android back gesture or button); elsewhere it falls back to an Escape
 * listener on the document. Handlers that already handle Escape should call
 * `preventDefault()`, which stops both the close watcher and the fallback.
 *
 * A `CloseWatcher` closes after one request; call `enable()` again to keep
 * listening (for example when the surface stayed open).
 */
export declare class BackHandler {
    private readonly onBack;
    private watcher;
    private keyListener;
    /**
     * @param onBack Called with the request's source when the user asks to go
     *     back.
     */
    constructor(onBack: (source: CloseRequestSource) => void);
    /** Whether the handler is listening. */
    get enabled(): boolean;
    /** Whether the handler uses a `CloseWatcher` (not the Escape fallback). */
    get usesCloseWatcher(): boolean;
    /** Starts listening for back requests. Does nothing when already enabled. */
    enable(): void;
    /** Stops listening. */
    disable(): void;
}
/** The predictive back shape of a surface. */
export type PredictiveBackKind = 'bottom-sheet' | 'side' | 'search';
/** Options of `playPredictiveBack()`. */
export interface PredictiveBackOptions {
    /** How the surface moves; see `PredictiveBackKind`. */
    kind: PredictiveBackKind;
    /**
     * The element whose size sets the scale (the sheet or rail). Defaults to
     * the animated element.
     */
    measure?: HTMLElement | null;
    /**
     * Content scaled back the other way to keep its aspect ratio, like
     * Compose's content `graphicsLayer` (bottom and side surfaces).
     */
    content?: HTMLElement | null;
    /** The window edge a `side` surface is attached to. */
    edge?: 'start' | 'end';
    /** Animation duration. Defaults to `PREDICTIVE_BACK_DURATION_MS`. */
    duration?: number;
}
/**
 * The predictive back transform at full gesture progress, as CSS `scale`
 * and `transform-origin` values for the surface and its content.
 */
export declare function predictiveBackTransform(surface: HTMLElement, options: PredictiveBackOptions): {
    surface: {
        scale: string;
        transformOrigin: string;
    };
    content?: {
        scale: string;
        transformOrigin: string;
    };
};
/** Whether motion should be skipped for reduced motion. */
export declare function prefersReducedMotion(): boolean;
/**
 * A running predictive back animation. It holds its end state (fill
 * `forwards`) until cancelled or reversed.
 */
export declare class PredictiveBackAnimation {
    readonly animations: Animation[];
    constructor(animations: Animation[]);
    /** Resolves when the back progress has played. */
    get finished(): Promise<void>;
    /**
     * Plays back to rest, like Compose animating the progress to 0 when the
     * gesture is cancelled. Resolves when done; the animation is then removed.
     */
    settle(): Promise<void>;
    /**
     * Runs `measure` with the surface at rest, e.g. to read layout boxes for a
     * close motion, then restores the back progress.
     */
    atRest<T>(measure: () => T): T;
    /** Removes the animation at once. */
    cancel(): void;
}
/**
 * Plays the predictive back transform on a surface. Returns null when motion
 * is reduced or the element can't animate.
 *
 * @param surface The element to scale.
 * @param options The surface kind and related elements.
 */
export declare function playPredictiveBack(surface: HTMLElement, options: PredictiveBackOptions): PredictiveBackAnimation | null;
