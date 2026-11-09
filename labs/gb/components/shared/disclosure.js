/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Attribute converter for a boolean `expanded` property that defaults to
 * `true` and collapses with `expanded="false"` (extended FAB), as Compose's
 * `expanded` parameter does. Removing the attribute expands again.
 */
export const expandedUnlessFalseConverter = {
    fromAttribute: (value) => value !== 'false',
};
/**
 * Like {@link expandedUnlessFalseConverter} for a reflected property (floating
 * toolbar): expanded reflects as a bare attribute, and removing the attribute
 * collapses.
 */
export const reflectedExpandedConverter = {
    fromAttribute: (value) => value !== null && value !== 'false',
    toAttribute: (value) => (value ? '' : null),
};
/** Whether the user prefers reduced motion. */
export function prefersReducedMotion() {
    return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
/** Parses a CSS time (`420ms`, `0.4s`); NaN when it isn't one. */
export function parseTime(value) {
    const match = /^\s*(-?[\d.]+)(ms|s)\s*$/.exec(value);
    if (!match)
        return NaN;
    return parseFloat(match[1]) * (match[2] === 's' ? 1000 : 1);
}
/**
 * Reads a spring from the motion tokens
 * (`--md-sys-motion-spring-<name>` and `-duration`) in the context of an
 * element. Reduced motion resolves to no duration, whatever the tokens say.
 *
 * @param element The element whose tokens apply.
 * @param spring The spring token name. Default `default-spatial`.
 */
export function readMotion(element, spring = 'default-spatial') {
    const reduced = prefersReducedMotion();
    const style = getComputedStyle(element);
    const duration = parseTime(style.getPropertyValue(`--md-sys-motion-spring-${spring}-duration`));
    const easing = style.getPropertyValue(`--md-sys-motion-spring-${spring}`).trim();
    return {
        duration: reduced ? 0 : Number.isNaN(duration) ? 420 : duration,
        easing: reduced ? 'linear' : easing || 'ease',
        reduced,
    };
}
let idCounter = 0;
/**
 * Applies a disclosure state to its elements: `aria-expanded` and
 * `aria-controls` on the trigger, `inert` / `hidden` on the region.
 */
export function applyDisclosure(expanded, { trigger, region, hide = 'inert', aria = true }) {
    if (region) {
        region.toggleAttribute('inert', hide === 'inert' && !expanded);
        region.toggleAttribute('hidden', hide === 'hidden' && !expanded);
        if (aria && trigger && !region.id)
            region.id = `disclosure-region-${++idCounter}`;
    }
    if (trigger && aria) {
        trigger.setAttribute('aria-expanded', String(expanded));
        if (region?.id) {
            trigger.setAttribute('aria-controls', region.id);
        }
        else {
            trigger.removeAttribute('aria-controls');
        }
    }
}
/**
 * Asks for a user toggle: fires a cancelable `toggle` event on `target`.
 *
 * @return Whether the toggle may proceed (the event wasn't cancelled).
 */
export function requestToggle(target, expanded) {
    const event = new ToggleEvent('toggle', {
        cancelable: true,
        oldState: expanded ? 'open' : 'closed',
        newState: expanded ? 'closed' : 'open',
    });
    target.dispatchEvent(event);
    return !event.defaultPrevented;
}
/**
 * A Lit controller for an expand/collapse trigger and region. The host owns
 * the `expanded` state as a property; the controller applies it to the
 * elements after every update and turns user input into toggles.
 */
export class DisclosureController {
    constructor(host, options) {
        this.host = host;
        this.options = options;
        this.bound = null;
        this.spaceDown = false;
        this.onClick = (event) => {
            if (event.defaultPrevented)
                return;
            this.toggle();
        };
        this.onKeydown = (event) => {
            if (event.defaultPrevented || this.nativeTrigger || event.target !== this.bound)
                return;
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
                return;
            if (event.key === 'Enter') {
                event.preventDefault();
                this.toggle();
            }
            else if (event.key === ' ') {
                // Space activates on release, like a button, and must not scroll.
                event.preventDefault();
                this.spaceDown = true;
            }
        };
        this.onKeyup = (event) => {
            if (event.key !== ' ' || !this.spaceDown)
                return;
            this.spaceDown = false;
            if (this.nativeTrigger || event.defaultPrevented)
                return;
            event.preventDefault();
            this.toggle();
        };
        host.addController(this);
    }
    /** Whether the disclosure is expanded. */
    get expanded() {
        return this.options.expanded();
    }
    hostConnected() {
        this.bind();
    }
    hostDisconnected() {
        this.unbind();
    }
    hostUpdated() {
        this.sync();
    }
    /** Applies the state to the trigger and region, and (re)binds the trigger. */
    sync() {
        this.bind();
        const o = this.options;
        const trigger = o.trigger?.() ?? null;
        const region = o.region?.() ?? null;
        if (o.enabled && !o.enabled()) {
            applyDisclosure(true, { trigger, region, hide: o.hide, aria: false });
            return;
        }
        applyDisclosure(this.expanded, { trigger, region, hide: o.hide, aria: o.aria });
    }
    /** The motion of the expand/collapse (see {@link readMotion}). */
    motion(spring = 'default-spatial') {
        return readMotion(this.options.region?.() ?? this.host, spring);
    }
    /**
     * Toggles on behalf of the user: fires the cancelable `toggle` event, then
     * sets the state unless it was cancelled.
     *
     * @return Whether the state changed.
     */
    toggle() {
        return this.set(!this.expanded);
    }
    /** Expands on behalf of the user. @return Whether the state changed. */
    expand() {
        return this.set(true);
    }
    /** Collapses on behalf of the user. @return Whether the state changed. */
    collapse() {
        return this.set(false);
    }
    set(next) {
        const o = this.options;
        if (next === this.expanded || o.disabled?.() || (o.enabled && !o.enabled())) {
            return false;
        }
        if (!requestToggle(o.eventTarget?.() ?? this.host, this.expanded))
            return false;
        o.setExpanded(next);
        this.sync();
        return true;
    }
    bind() {
        const trigger = this.options.trigger?.() ?? null;
        if (trigger === this.bound)
            return;
        this.unbind();
        this.bound = trigger;
        trigger?.addEventListener('click', this.onClick);
        if (this.options.keys) {
            trigger?.addEventListener('keydown', this.onKeydown);
            trigger?.addEventListener('keyup', this.onKeyup);
        }
    }
    unbind() {
        this.bound?.removeEventListener('click', this.onClick);
        this.bound?.removeEventListener('keydown', this.onKeydown);
        this.bound?.removeEventListener('keyup', this.onKeyup);
        this.bound = null;
    }
    // A native button or link activates itself with a click on Enter/Space.
    get nativeTrigger() {
        return Boolean(this.bound?.matches('button, a[href], summary'));
    }
}
//# sourceMappingURL=disclosure.js.map