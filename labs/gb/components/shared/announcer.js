/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** The attribute that marks a live region of the announcer, with its politeness. */
export const ANNOUNCER_ATTRIBUTE = 'data-announcer';
/** How long (ms) a repeated or first announcement waits so it reads as a change. */
export const ANNOUNCE_DELAY_MS = 60;
/** The ARIA role of the live region for each politeness. */
export const ANNOUNCER_ROLES = {
    polite: 'status',
    assertive: 'alert',
};
/** The inline style that hides a live region visually but not from assistive technology. */
const VISUALLY_HIDDEN = 'position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;' +
    'border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;';
/** Collapses whitespace so the announced text is stable. */
export function normalizeAnnouncement(message) {
    return (message ?? '').replace(/\s+/g, ' ').trim();
}
/** Creates a hidden live region for `politeness`. */
export function createLiveRegion(politeness) {
    const region = document.createElement('div');
    region.setAttribute(ANNOUNCER_ATTRIBUTE, politeness);
    region.setAttribute('role', ANNOUNCER_ROLES[politeness]);
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.style.cssText = VISUALLY_HIDDEN;
    return region;
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
export class AnnouncerController {
    constructor(host, options = {}) {
        this.host = host;
        this.options = options;
        this.regions = new Map();
        this.timers = new Map();
        host.addController(this);
    }
    hostConnected() {
        for (const politeness of this.options.regions ?? ['polite']) {
            this.region(politeness);
        }
    }
    hostUpdated() {
        // The template may have replaced the container: bring the regions along.
        for (const region of this.regions.values()) {
            const parent = this.parent();
            if (parent && region.parentNode !== parent) {
                parent.appendChild(region);
            }
        }
    }
    hostDisconnected() {
        this.cancelAll();
        for (const region of this.regions.values()) {
            region.remove();
        }
        this.regions.clear();
    }
    /** The text a live region holds now, or '' (also while an announcement is pending). */
    text(politeness = 'polite') {
        return this.regions.get(politeness)?.textContent ?? '';
    }
    /** The live region element, created when needed; null when it cannot be attached. */
    region(politeness = 'polite') {
        let region = this.regions.get(politeness);
        if (region?.isConnected && region.parentNode === this.parent()) {
            return region;
        }
        const parent = this.parent();
        if (!parent) {
            return region ?? null;
        }
        if (!region) {
            region = createLiveRegion(politeness);
            this.regions.set(politeness, region);
        }
        parent.appendChild(region);
        return region;
    }
    /**
     * Announces `message`. Returns a promise that resolves once the text is in
     * the live region (at once for a new message in an existing region, after
     * the delay for a repeat or a new region) or the announcement was
     * replaced, cleared or dropped by a disconnect.
     */
    announce(message, politeness = 'polite') {
        const text = normalizeAnnouncement(message);
        if (!text) {
            this.clear(politeness);
            return Promise.resolve();
        }
        this.cancel(politeness);
        const existing = this.regions.get(politeness);
        const region = this.region(politeness);
        if (!region) {
            return Promise.resolve();
        }
        const fresh = !existing?.isConnected || existing !== region;
        if (!fresh && region.textContent !== text) {
            region.textContent = text;
            return Promise.resolve();
        }
        // A repeat, or a region that was just added: set the text in a later task.
        region.textContent = '';
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                this.timers.delete(politeness);
                region.textContent = text;
                resolve();
            }, this.options.delay ?? ANNOUNCE_DELAY_MS);
            this.timers.set(politeness, { timer, resolve });
        });
    }
    /** Empties a live region (both by default) and drops pending announcements. */
    clear(politeness) {
        for (const p of politeness ? [politeness] : ['polite', 'assertive']) {
            this.cancel(p);
            const region = this.regions.get(p);
            if (region) {
                region.textContent = '';
            }
        }
    }
    parent() {
        return (this.options.container?.() ??
            this.host.renderRoot ??
            this.host.shadowRoot ??
            this.host);
    }
    cancel(politeness) {
        const pending = this.timers.get(politeness);
        if (pending) {
            clearTimeout(pending.timer);
            this.timers.delete(politeness);
            pending.resolve();
        }
    }
    cancelAll() {
        for (const politeness of [...this.timers.keys()]) {
            this.cancel(politeness);
        }
    }
}
//# sourceMappingURL=announcer.js.map