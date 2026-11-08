"use strict";
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnobValues = exports.Knob = void 0;
const tslib_1 = require("tslib");
/* Slimmed down version of Lit stories knobs but using md-* components */
const lit_1 = require("lit");
tslib_1.__exportStar(require("./components/knob-ui-components.js"), exports);
/**
 * A parameter that may be customized at runtime for a story.
 *
 * Has two parts: a UI which may be displayed to the user for them to set the
 * knob's value, and an optional bit of wiring that, if given, may automatically
 * apply the value to the rendered story.
 *
 * The story will also be notified when a knob's value changes.
 *
 * @template {Name} We capture the name of the knob here as a string literal
 *     type so that we can provide type safe access to the current value of a
 *     knob from within a story's render function.
 */
class Knob extends EventTarget {
    constructor(name, init) {
        super();
        this.name = name;
        /**
         * True iff the knob has had a value set, so that we know to apply any
         * wiring to any new stories we're informed of.
         */
        this.dirty = false;
        this.onChange = (updatedVal, resetting = false) => {
            this.latestValue = updatedVal;
            this.dirty = !resetting;
            this.dispatchEvent(new CustomEvent('changed', { detail: updatedVal }));
            if (this.wiring !== undefined) {
                for (const container of this.renderedStoryContainers) {
                    this.wiring(this, updatedVal, container);
                }
            }
        };
        this.onReset = () => {
            this.reset();
        };
        this.renderedStoryContainers = new Set();
        this.defaultValue = init.defaultValue;
        this.latestValue = this.defaultValue;
        this.wiring = init.wiring;
        this.uiFn = init.ui;
    }
    get isUnset() {
        return !this.dirty;
    }
    get uiTemplate() {
        return this.uiFn.render(this, this.onChange, this.onReset);
    }
    getKnobUiTemplate() {
        return this.uiTemplate;
    }
    /**
     * Connect the knob's wiring, if any, up to a container of a rendered story.
     * This is fast and idempotent, so it's fine to call frequently.
     */
    connectWiring(containerOfRenderedStory) {
        // Fast path the common case where we have no wiring.
        if (!this.wiring) {
            return;
        }
        const alreadyWired = this.renderedStoryContainers.has(containerOfRenderedStory);
        if (!alreadyWired) {
            this.renderedStoryContainers.add(containerOfRenderedStory);
            // Ensure default values are wired correctly.
            if (this.dirty ||
                (this.latestValue !== undefined &&
                    this.latestValue === this.defaultValue)) {
                this.wiring?.(this, this.latestValue, containerOfRenderedStory);
            }
        }
    }
    disconnectWiring(containerOfRenderedStory) {
        return this.renderedStoryContainers.delete(containerOfRenderedStory);
    }
    imperativelySet(newValue) {
        this.dirty = true;
        if (this.latestValue !== newValue) {
            this.onChange(newValue);
        }
    }
    reset() {
        if (this.dirty === true) {
            this.onChange(this.defaultValue, true);
        }
    }
}
exports.Knob = Knob;
/** A helper class for getting the latest value for a knob by name. */
class KnobValues extends EventTarget {
    constructor(knobsArray) {
        super();
        const byName = new Map();
        for (const knob of knobsArray) {
            if (byName.has(knob.name)) {
                throw new Error(`More than one knob with name '${knob.name}' given to a story.`);
            }
            byName.set(knob.name, knob);
            knob.addEventListener('changed', (e) => {
                this.dispatchEvent(new CustomEvent('changed', { detail: { knobName: knob.name } }));
            });
        }
        this.byName = byName;
    }
    get(knobName) {
        return this.byName.get(knobName)?.latestValue;
    }
    set(knobName, newValue) {
        const knob = this.byName.get(knobName);
        if (knob === undefined) {
            throw new Error(`No knob with name ${knobName}`);
        }
        knob.imperativelySet(newValue);
    }
    /**
     * Returns an iterator of all the knob names.
     */
    names() {
        return this.byName.keys();
    }
    /**
     * Reset all knob values back to their initial values.
     */
    reset() {
        for (const knob of this.byName.values()) {
            knob.reset();
        }
    }
    /** True if empty, false if it contains knobs. */
    get empty() {
        return this.byName.size === 0;
    }
    /**
     * Connect the knobs' wiring up to this container where a story will be
     * rendered.
     *
     * Unlikely that any code outside of the stories system internals would
     * call this.
     */
    connectWiring(container) {
        for (const knob of this.byName.values()) {
            if (container instanceof DocumentFragment) {
                container = container.firstElementChild;
            }
            knob.connectWiring(container);
        }
    }
    /**
     * The inverse of connectWiring, so that discarded story renderers can be
     * garbage collected.
     *
     * Returns false if the container wasn't actually connected.
     */
    disconnectWiring(container) {
        let disconnected = false;
        for (const knob of this.byName.values()) {
            disconnected = knob.disconnectWiring(container) || disconnected;
        }
        return disconnected;
    }
    /**
     * Renders the UIs of the knobs.
     */
    renderUI() {
        const uiTemplates = [];
        for (const knob of this.byName.values()) {
            uiTemplates.push(knob.getKnobUiTemplate());
        }
        return (0, lit_1.html) `${uiTemplates}`;
    }
}
exports.KnobValues = KnobValues;
//# sourceMappingURL=knobs.js.map