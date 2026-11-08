"use strict";
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitCollection = exports.Collection = exports.Knob = void 0;
/* Slimmed down version of Lit stories story file */
const lit_1 = require("lit");
const knobs_js_1 = require("./knobs.js");
var knobs_js_2 = require("./knobs.js");
Object.defineProperty(exports, "Knob", { enumerable: true, get: function () { return knobs_js_2.Knob; } });
class StoryImpl {
    get styles() {
        let styles = [...this.collection.customStyles];
        if (this.initStyles) {
            styles = styles.concat(this.initStyles);
        }
        return styles;
    }
    constructor(init, collection) {
        this.collection = collection;
        this.name = init.name;
        this.description = init.description;
        this.id = init.id || this.name.replace(/ /g, '_').replace(/,/g, '');
        if (this.id.includes('/')) {
            const message = `A story id can't contain a '/' character. ` +
                `The name can, but if so you have to give an ` +
                `explicit id that doesn't.`;
            throw new Error(message);
        }
        const wrapperDivMap = new WeakMap();
        this.initStyles = init.styles;
        this.knobs = collection.knobs;
        this.render = async (container) => {
            let wrapperDiv = wrapperDivMap.get(container);
            if (wrapperDiv === undefined) {
                wrapperDiv = document.createElement('div');
                wrapperDiv.id = 'storyWrapper';
                wrapperDivMap.set(container, wrapperDiv);
            }
            (0, lit_1.render)((0, lit_1.html) ` ${wrapperDiv} `, container);
            await init.render(wrapperDiv, this.knobs);
        };
        this.dispose = (container) => {
            wrapperDivMap.delete(container);
            (0, lit_1.render)(lit_1.nothing, container);
        };
    }
}
/**
 * A tree of related stories and sub-collections.
 *
 * The stories and sub-collections are stored in the order that they are
 * added to the collection.
 *
 * Every Story is a member of exactly one collection. Every collection is
 * either a toplevel collection for a named component, or it is a member of
 * exactly one collection.
 */
class Collection {
    constructor(name, knobs = []) {
        this.name = name;
        this.children = new Map();
        this.customStyles = [];
        Collection.collectionsByName.set(name, this);
        this.knobs = new knobs_js_1.KnobValues(knobs);
    }
    /**
     * Get an array of all stories in this collection.
     *
     * Exported for mwc's compiled tests.
     * @export
     */
    get stories() {
        const stories = [];
        for (const child of this.children.values()) {
            if (child instanceof StoryImpl) {
                stories.push(child);
            }
            else {
                stories.push(...child.stories);
            }
        }
        return stories;
    }
    get tree() {
        return this.children;
    }
    static get byName() {
        return Collection.collectionsByName;
    }
    addStories(...inits) {
        for (const init of inits) {
            const story = new StoryImpl(init, this);
            if (this.children.has(story.id)) {
                const message = `A story or subcollection already exists with the id ${JSON.stringify(story.id)}`;
                // Don't throw an error, as that will disrupt live_reload / hot reload,
                // by halting this module's initialization.
                console.error(message);
                continue;
            }
            this.children.set(story.id, story);
        }
    }
    applyStyle(customStyle) {
        this.customStyles.push(customStyle.styleSheet);
    }
}
exports.Collection = Collection;
Collection.collectionsByName = new Map();
function isLitStoryInit(init) {
    return !!init.renderLit;
}
/**
 * A collection with convenience methods for rendering lit-html templates.
 */
class LitCollection extends Collection {
    addStories(...inits) {
        const simpleInits = [];
        for (const init of inits) {
            if (isLitStoryInit(init)) {
                let styles = [];
                if (init.litStyles) {
                    styles =
                        init.litStyles instanceof Array
                            ? init.litStyles.map((s) => s.styleSheet)
                            : [init.litStyles.styleSheet];
                }
                simpleInits.push({
                    ...init,
                    async render(container, knobValues) {
                        const templateResult = await init.renderLit(knobValues);
                        (0, lit_1.render)(templateResult, container);
                    },
                    styles,
                });
            }
            else {
                simpleInits.push(init);
            }
        }
        super.addStories(...simpleInits);
    }
}
exports.LitCollection = LitCollection;
//# sourceMappingURL=story.js.map