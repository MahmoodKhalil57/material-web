/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { isReducedMotion } from './motion.js';
import { perfEnd, perfStart } from './perf.js';
/** Attribute reflecting that the host is hidden by scrolling. */
export const SCROLL_HIDDEN_ATTRIBUTE = 'scroll-hidden';
/** Scroll distance (px) in one direction before the bar hides or reveals. */
export const SCROLL_THRESHOLD = 8;
/** How long (ms) after a scroll key a scroll still counts as keyboard scroll. */
export const KEYBOARD_SCROLL_WINDOW = 500;
const SCROLL_KEYS = new Set([
    'ArrowUp',
    'ArrowDown',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    ' ',
]);
/** Parses a `scroll-behavior` attribute value. */
export function parseScrollBehavior(value) {
    return value === 'hide' || value === 'compress' ? value : null;
}
/**
 * Advances the hide state for a new scroll position. Pure, so the rules are
 * testable without scrolling: the bar shows at the top and when scrolled up
 * by `threshold`, and hides when scrolled down by `threshold` past the top,
 * unless `canHide` is false (the bar then only reveals).
 */
export function stepScroll(prev, y, canHide = true, threshold = SCROLL_THRESHOLD) {
    const dy = y - prev.y;
    let travel = prev.travel;
    if (dy !== 0) {
        travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
    }
    let hidden = prev.hidden;
    if (y <= 0 || travel <= -threshold) {
        hidden = false;
    }
    else if (travel >= threshold && canHide) {
        hidden = true;
    }
    if (y <= 0) {
        travel = 0;
    }
    return { y, hidden, travel };
}
/** Hides, reveals or compresses the host with a scroll target. */
export class ScrollBehaviorController {
    constructor(host, options) {
        this.source = null;
        this.step = { y: 0, hidden: false, travel: 0 };
        this.lastKeyAt = -Infinity;
        this.reportedScrolled = false;
        this.focusInside = false;
        this.onKeydown = (event) => {
            if (SCROLL_KEYS.has(event.key)) {
                this.lastKeyAt = performance.now();
            }
        };
        this.onPointer = () => {
            this.lastKeyAt = -Infinity;
        };
        this.onFocusIn = () => {
            this.focusInside = true;
            if (this.step.hidden) {
                this.show();
            }
        };
        this.onFocusOut = (event) => {
            const next = event.relatedTarget;
            this.focusInside = Boolean(next && this.host.contains(next));
        };
        this.onScroll = () => {
            const perf = perfStart();
            try {
                this.scrollStep();
            }
            finally {
                perfEnd('scroll.step', perf, { hidden: this.step.hidden });
            }
        };
        this.host = host;
        this.options = options;
        host.addController(this);
    }
    /** Whether the host is hidden by scrolling. */
    get hidden() {
        return this.step.hidden;
    }
    /** Whether the target is scrolled away from the top. */
    get scrolled() {
        return this.reportedScrolled;
    }
    /** Reveals the host. */
    show() {
        this.setHidden(false);
        this.step = { ...this.step, hidden: false, travel: 0 };
    }
    hostConnected() {
        document.addEventListener('keydown', this.onKeydown, true);
        for (const type of ['wheel', 'touchstart', 'pointerdown']) {
            document.addEventListener(type, this.onPointer, {
                capture: true,
                passive: true,
            });
        }
        this.host.addEventListener('focusin', this.onFocusIn);
        this.host.addEventListener('focusout', this.onFocusOut);
        this.attach();
    }
    hostUpdated() {
        if (!this.source ||
            this.options.target() !== this.sourceId ||
            (this.source instanceof Element && !this.source.isConnected)) {
            this.attach();
        }
        if (this.options.behavior() !== 'hide' && this.step.hidden) {
            this.show();
        }
    }
    hostDisconnected() {
        document.removeEventListener('keydown', this.onKeydown, true);
        for (const type of ['wheel', 'touchstart', 'pointerdown']) {
            document.removeEventListener(type, this.onPointer, true);
        }
        this.host.removeEventListener('focusin', this.onFocusIn);
        this.host.removeEventListener('focusout', this.onFocusOut);
        this.detach();
        this.host.style.removeProperty('transform');
        this.host.removeAttribute(SCROLL_HIDDEN_ATTRIBUTE);
        this.step = { y: 0, hidden: false, travel: 0 };
    }
    attach() {
        this.detach();
        this.sourceId = this.options.target();
        const root = this.host.getRootNode();
        const element = this.sourceId
            ? (root.getElementById?.(this.sourceId) ??
                document.getElementById(this.sourceId))
            : null;
        if (this.sourceId && !element) {
            // The target does not exist (yet): follow the window meanwhile.
            this.source = window;
        }
        else {
            this.source = element ?? window;
        }
        this.source.addEventListener('scroll', this.onScroll, { passive: true });
        this.step = { y: this.position(), hidden: this.step.hidden, travel: 0 };
        this.reportScrolled();
    }
    detach() {
        this.source?.removeEventListener('scroll', this.onScroll);
        this.source = null;
    }
    position() {
        const source = this.source;
        if (source instanceof Element) {
            return source.scrollTop;
        }
        return window.scrollY || document.documentElement.scrollTop || 0;
    }
    get keyboardScrolling() {
        return (this.options.keyboardKeepsVisible === true &&
            performance.now() - this.lastKeyAt < KEYBOARD_SCROLL_WINDOW);
    }
    get canHide() {
        return !(this.focusInside ||
            this.keyboardScrolling ||
            this.options.keepVisible?.());
    }
    scrollStep() {
        const y = this.position();
        this.reportScrolled(y);
        if (this.options.behavior() !== 'hide') {
            this.step = { ...this.step, y };
            return;
        }
        const next = stepScroll(this.step, y, this.canHide);
        const changed = next.hidden !== this.step.hidden;
        this.step = next;
        if (changed) {
            this.setHidden(next.hidden);
        }
    }
    reportScrolled(y = this.position()) {
        const scrolled = y > 0;
        if (scrolled !== this.reportedScrolled) {
            this.reportedScrolled = scrolled;
            this.options.onScrolledChange?.(scrolled);
        }
    }
    setHidden(hidden) {
        const style = this.host.style;
        if (!style.transitionProperty) {
            // Spatial spring tokens: 0ms under reduced motion.
            style.transitionProperty = 'transform';
            style.transitionDuration =
                'var(--md-sys-motion-spring-default-spatial-duration, 420ms)';
            style.transitionTimingFunction =
                'var(--md-sys-motion-spring-default-spatial, ease)';
        }
        if (hidden) {
            style.transform = this.options.hiddenTransform ?? 'translateY(-100%)';
            this.host.setAttribute(SCROLL_HIDDEN_ATTRIBUTE, '');
        }
        else {
            style.removeProperty('transform');
            this.host.removeAttribute(SCROLL_HIDDEN_ATTRIBUTE);
        }
        // The duration token is 0ms under reduced motion; cover hosts where the
        // tokens are not loaded too.
        style.transitionDuration = isReducedMotion(this.host)
            ? '0ms'
            : 'var(--md-sys-motion-spring-default-spatial-duration, 420ms)';
        this.host.dispatchEvent(new CustomEvent('scrollhiddenchange', { detail: { hidden } }));
    }
}
//# sourceMappingURL=scroll-behavior.js.map