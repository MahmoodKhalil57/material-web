"use strict";
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelStyles = exports.MaterialCollection = void 0;
exports.title = title;
exports.materialInitsToStoryInits = materialInitsToStoryInits;
exports.setUpDemo = setUpDemo;
/* Slimmed down version of material-collection */
const lit_1 = require("lit");
var story_js_1 = require("./story.js");
Object.defineProperty(exports, "MaterialCollection", { enumerable: true, get: function () { return story_js_1.LitCollection; } });
/**
 * Material styling for labels.
 */
exports.labelStyles = (0, lit_1.css) `
  label {
    display: inline-flex;
    place-items: center;
    gap: 8px;
    font-family: Roboto, system-ui;
    color: var(--md-sys-color-on-background, #000);
  }
`;
/**
 * A subtitle knob for labelling sections in the knob UI.
 */
function title() {
    return {
        render(knob) {
            return (0, lit_1.html) ` <h3 style="font-family: system-ui;">${knob.name}</h3> `;
        },
    };
}
/**
 * Converts an array of `MaterialStoryInit`s to a `LitStoryInit`.
 */
// tslint:disable-next-line:no-any No way to represent this type clearly.
function materialInitsToStoryInits(inits) {
    return inits.map((init) => {
        return {
            name: init.name,
            litStyles: init.styles,
            renderLit(knobMap) {
                const knobNames = knobMap.names();
                const knobs = {};
                for (const name of knobNames) {
                    knobs[name] = knobMap.get(name);
                }
                return init.render(knobs);
            },
        };
    });
}
/**
 * Initializes the theme element for the theming knobs and renders the stories.
 */
function setUpDemo(collection) {
    const renderer = document.createElement('stories-renderer');
    renderer.collection = collection;
    document.body.appendChild(renderer);
}
//# sourceMappingURL=material-collection.js.map