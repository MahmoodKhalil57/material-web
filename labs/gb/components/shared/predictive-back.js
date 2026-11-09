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
export const BACK_REASON = 'back';
/** Close reason for the Escape key. */
export const ESCAPE_REASON = 'escape';
/**
 * Compose `PredictiveBackEasing` (material3 `internal/BackHandler.kt`),
 * applied to the back progress.
 */
export const PREDICTIVE_BACK_EASING = 'cubic-bezier(0.1, 0.1, 0, 1)';
/**
 * How long the back progress plays on close: `md.sys.motion.duration.short4`.
 * Compose follows the finger instead; the web has no progress events, so this
 * stands in for a quick back swipe.
 */
export const PREDICTIVE_BACK_DURATION_MS = 200;
/**
 * Compose `BottomSheet.kt` `PredictiveBackMaxScaleXDistance` (48dp) and
 * `PredictiveBackMaxScaleYDistance` (24dp): how far the sheet shrinks.
 */
export const BOTTOM_SHEET_PREDICTIVE_BACK_MAX_X_PX = 48;
/** See `BOTTOM_SHEET_PREDICTIVE_BACK_MAX_X_PX`. */
export const BOTTOM_SHEET_PREDICTIVE_BACK_MAX_Y_PX = 24;
/**
 * Compose `WideNavigationRail.kt` `PredictiveBackMaxScaleXDistance` (24dp)
 * and `PredictiveBackMaxScaleYDistance` (48dp), used for edge surfaces (the
 * modal rail and side sheets).
 */
export const SIDE_PREDICTIVE_BACK_MAX_X_PX = 24;
/** See `SIDE_PREDICTIVE_BACK_MAX_X_PX`. */
export const SIDE_PREDICTIVE_BACK_MAX_Y_PX = 48;
/** Compose `SearchBar.kt` `SearchBarPredictiveBackMinScale` (9/10). */
export const SEARCH_PREDICTIVE_BACK_MIN_SCALE = 0.9;
/**
 * How long after a trusted Escape key press a close request still counts as
 * coming from Escape.
 */
const ESCAPE_WINDOW_MS = 1000;
let lastEscapeTime = Number.NEGATIVE_INFINITY;
let escapeTrackerInstalled = false;
/**
 * Records trusted Escape presses, so close requests can tell Escape from the
 * back gesture. Installed once, in the capture phase, before any component
 * handler can stop the event.
 */
export function trackEscapeKey() {
    if (escapeTrackerInstalled || typeof window === 'undefined') {
        return;
    }
    escapeTrackerInstalled = true;
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && event.isTrusted) {
            lastEscapeTime = performance.now();
        }
    }, { capture: true });
}
trackEscapeKey();
/** Forgets recorded Escape presses (for tests). */
export function resetEscapeTracking() {
    lastEscapeTime = Number.NEGATIVE_INFINITY;
}
/** Whether Escape was pressed just now. */
function escapeJustPressed() {
    return performance.now() - lastEscapeTime < ESCAPE_WINDOW_MS;
}
/**
 * Where a dialog `cancel` event came from. The browser fires `cancel` for
 * Escape and for the Android back gesture or button; a trusted `cancel` with
 * no Escape press just before it is a back request. Synthetic `cancel` events
 * count as Escape, as before predictive back.
 */
export function closeRequestSource(event) {
    return event.isTrusted && !escapeJustPressed() ? BACK_REASON : ESCAPE_REASON;
}
/** The platform `CloseWatcher` constructor, when supported. */
function closeWatcherConstructor() {
    const ctor = globalThis.CloseWatcher;
    return typeof ctor === 'function' ? ctor : null;
}
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
export class BackHandler {
    /**
     * @param onBack Called with the request's source when the user asks to go
     *     back.
     */
    constructor(onBack) {
        this.onBack = onBack;
        this.watcher = null;
        this.keyListener = null;
    }
    /** Whether the handler is listening. */
    get enabled() {
        return !!this.watcher || !!this.keyListener;
    }
    /** Whether the handler uses a `CloseWatcher` (not the Escape fallback). */
    get usesCloseWatcher() {
        return !!this.watcher;
    }
    /** Starts listening for back requests. Does nothing when already enabled. */
    enable() {
        if (this.enabled || typeof document === 'undefined') {
            return;
        }
        const CloseWatcher = closeWatcherConstructor();
        if (CloseWatcher) {
            try {
                const watcher = new CloseWatcher();
                watcher.addEventListener('close', () => {
                    if (this.watcher !== watcher) {
                        return;
                    }
                    this.watcher = null;
                    this.onBack(escapeJustPressed() ? ESCAPE_REASON : BACK_REASON);
                });
                this.watcher = watcher;
                return;
            }
            catch {
                // Fall back to Escape.
            }
        }
        const controller = new AbortController();
        this.keyListener = controller;
        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape' ||
                event.defaultPrevented ||
                event.isComposing) {
                return;
            }
            event.preventDefault();
            this.onBack(ESCAPE_REASON);
        }, { signal: controller.signal });
    }
    /** Stops listening. */
    disable() {
        const watcher = this.watcher;
        this.watcher = null;
        watcher?.destroy();
        this.keyListener?.abort();
        this.keyListener = null;
    }
}
/**
 * The predictive back transform at full gesture progress, as CSS `scale`
 * and `transform-origin` values for the surface and its content.
 */
export function predictiveBackTransform(surface, options) {
    const measure = options.measure ?? surface;
    const width = measure.offsetWidth;
    const height = measure.offsetHeight;
    const shrink = (size, max) => size > 0 ? 1 - Math.min(max, size) / size : 1;
    const rtl = getComputedStyle(surface).direction === 'rtl';
    if (options.kind === 'search') {
        const scale = String(SEARCH_PREDICTIVE_BACK_MIN_SCALE);
        return { surface: { scale, transformOrigin: '50% 50%' } };
    }
    if (options.kind === 'bottom-sheet') {
        // Compose `sheetPredictiveBackScaling`: shrink toward the bottom center;
        // `contentPredictiveBackScaling`: keep the content's aspect ratio.
        const scaleX = shrink(width, BOTTOM_SHEET_PREDICTIVE_BACK_MAX_X_PX);
        const scaleY = shrink(height, BOTTOM_SHEET_PREDICTIVE_BACK_MAX_Y_PX);
        return {
            surface: { scale: `${scaleX} ${scaleY}`, transformOrigin: '50% 100%' },
            content: {
                scale: `1 ${scaleY ? scaleX / scaleY : 1}`,
                transformOrigin: '50% 0',
            },
        };
    }
    // Compose `ModalWideNavigationRail`: pivot on the attached edge, shrink
    // away from the screen's top and bottom. The swipe edge is unknown on the
    // web, so the surface shrinks toward its edge (Compose's case for a swipe
    // from the opposite edge).
    const scaleX = shrink(width, SIDE_PREDICTIVE_BACK_MAX_X_PX);
    const scaleY = shrink(height, SIDE_PREDICTIVE_BACK_MAX_Y_PX);
    const atLeft = (options.edge ?? 'start') === 'start' ? !rtl : rtl;
    return {
        surface: {
            scale: `${scaleX} ${scaleY}`,
            transformOrigin: `${atLeft ? '0%' : '100%'} 50%`,
        },
        content: {
            scale: `${scaleX ? scaleY / scaleX : 1} 1`,
            transformOrigin: `${atLeft ? '100%' : '0%'} 50%`,
        },
    };
}
/** Whether motion should be skipped for reduced motion. */
export function prefersReducedMotion() {
    return !!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
}
/**
 * A running predictive back animation. It holds its end state (fill
 * `forwards`) until cancelled or reversed.
 */
export class PredictiveBackAnimation {
    constructor(animations) {
        this.animations = animations;
    }
    /** Resolves when the back progress has played. */
    get finished() {
        return Promise.all(this.animations.map((animation) => animation.finished)).then(() => { }, () => { });
    }
    /**
     * Plays back to rest, like Compose animating the progress to 0 when the
     * gesture is cancelled. Resolves when done; the animation is then removed.
     */
    async settle() {
        for (const animation of this.animations) {
            animation.reverse();
        }
        await this.finished;
        this.cancel();
    }
    /**
     * Runs `measure` with the surface at rest, e.g. to read layout boxes for a
     * close motion, then restores the back progress.
     */
    atRest(measure) {
        const times = this.animations.map((animation) => animation.currentTime);
        for (const animation of this.animations) {
            animation.currentTime = 0;
        }
        try {
            return measure();
        }
        finally {
            this.animations.forEach((animation, i) => {
                animation.currentTime = times[i];
            });
        }
    }
    /** Removes the animation at once. */
    cancel() {
        for (const animation of this.animations) {
            animation.cancel();
        }
    }
}
/**
 * Plays the predictive back transform on a surface. Returns null when motion
 * is reduced or the element can't animate.
 *
 * @param surface The element to scale.
 * @param options The surface kind and related elements.
 */
export function playPredictiveBack(surface, options) {
    if (prefersReducedMotion() || typeof surface.animate !== 'function') {
        return null;
    }
    const transform = predictiveBackTransform(surface, options);
    const timing = {
        duration: options.duration ?? PREDICTIVE_BACK_DURATION_MS,
        easing: PREDICTIVE_BACK_EASING,
        fill: 'forwards',
    };
    const animate = (element, to) => element.animate([
        { scale: '1', transformOrigin: to.transformOrigin },
        { scale: to.scale, transformOrigin: to.transformOrigin },
    ], timing);
    const animations = [animate(surface, transform.surface)];
    if (options.content && transform.content) {
        animations.push(animate(options.content, transform.content));
    }
    return new PredictiveBackAnimation(animations);
}
//# sourceMappingURL=predictive-back.js.map