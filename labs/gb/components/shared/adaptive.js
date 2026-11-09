/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { compareWindowSizeClasses, isWindowHeightClassAtLeast, isWindowSizeClassAtLeast, WINDOW_SIZE_CLASSES, WindowSizeClassController, } from '../../styles/layout/window-size-class.js';
/**
 * The options of window size class `cls`: `base`, overridden by the options
 * of each class up to and including `cls` that has some.
 */
export function resolveAdaptiveOptions(base, options, cls) {
    const resolved = { ...base };
    if (!options)
        return resolved;
    for (const candidate of WINDOW_SIZE_CLASSES) {
        if (compareWindowSizeClasses(candidate, cls) > 0)
            break;
        Object.assign(resolved, options[candidate]);
    }
    return resolved;
}
/** Attribute that carries the width class on the host. */
export const WINDOW_SIZE_CLASS_ATTRIBUTE = 'window-size-class';
/** Attribute that carries the height class on the host. */
export const WINDOW_HEIGHT_CLASS_ATTRIBUTE = 'window-height-class';
/** Tracks the window size class of a host and resolves per-class options. */
export class AdaptiveController {
    constructor(host, config = {}) {
        this.host = host;
        const { base, options, reflect = true, ...sizeOptions } = config;
        this.base = base ?? {};
        this.declared = options;
        this.reflect = reflect;
        this.size = new WindowSizeClassController(host, sizeOptions);
        host.addController(this);
    }
    hostConnected() {
        this.reflectClasses();
    }
    hostUpdate() {
        this.reflectClasses();
    }
    hostDisconnected() {
        if (!this.reflect)
            return;
        this.host.removeAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE);
        this.host.removeAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE);
    }
    /** The current window size class (`compact` until measured). */
    get sizeClass() {
        return this.size.value;
    }
    /** The current window height size class (`medium` until measured). */
    get heightClass() {
        return this.size.height;
    }
    /** The options for the current class. */
    get options() {
        return resolveAdaptiveOptions(this.base, this.declared, this.size.value);
    }
    /** The options for another class, e.g. to compare. */
    optionsFor(cls) {
        return resolveAdaptiveOptions(this.base, this.declared, cls);
    }
    /** Declares the per-class options (replacing earlier ones) and re-renders. */
    declare(options, base) {
        this.declared = options;
        if (base)
            this.base = base;
        this.host.requestUpdate();
    }
    /** Whether the width class is `cls` or larger. */
    atLeast(cls) {
        return isWindowSizeClassAtLeast(this.size.value, cls);
    }
    /** Whether the height class is `cls` or larger. */
    heightAtLeast(cls) {
        return isWindowHeightClassAtLeast(this.size.height, cls);
    }
    /** Re-reads the target, e.g. after the host moved. */
    observe() {
        this.size.observe();
    }
    /** Sets the class directly, e.g. from an ancestor's class. */
    set(cls) {
        this.size.set(cls);
    }
    reflectClasses() {
        if (!this.reflect)
            return;
        this.host.setAttribute(WINDOW_SIZE_CLASS_ATTRIBUTE, this.size.value);
        this.host.setAttribute(WINDOW_HEIGHT_CLASS_ATTRIBUTE, this.size.height);
    }
}
//# sourceMappingURL=adaptive.js.map