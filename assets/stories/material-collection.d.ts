/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResult, TemplateResult } from 'lit';
import { Knob, KnobUi, KnobValues } from './knobs.js';
import { LitCollection, LitStoryInit } from './story.js';
export { LitCollection as MaterialCollection } from './story.js';
/**
 * Material styling for labels.
 */
export declare const labelStyles: CSSResult;
/**
 * A subtitle knob for labelling sections in the knob UI.
 */
export declare function title(): KnobUi<void>;
/**
 * Converts an interface of `{[knobName: string]: unknown}` to something
 * ingestable by MaterialCollection.
 *
 * @example
 * ```ts
 * // demo.ts
 * import {StoryKnobs} from './stories.js';
 * import {MaterialCollection, KnobTypesToKnobs} from
 * '@material/web/internal/demo/stories/material-collection';
 *
 * const stories = new MaterialCollection<KnobTypesToKnobs<StoryKnobs>>(...);
 * ```
 */
export type KnobTypesToKnobs<T extends {
    [name: string]: any;
}, Names extends Extract<keyof T, string> = Extract<keyof T, string>> = ReadonlyArray<Names extends any ? Knob<T[Names], Names> : never>;
/**
 * An init object for Material Stories. This should be exposed to the user.
 *
 * @example
 * ```ts
 * import {MaterialStoryInit} from
 * '@material/web/internal/demo/stories/material-collection';
 * // stories.ts
 * export interface StoryKnobs {
 *   checked: boolean;
 *   disabled: boolean;
 * }
 *
 * export const stories: Array<MaterialStoryInit<StoryKnobs>> = [
 *   {
 *     name: Checkbox,
 *     styles: css`...`,
 *     render: ({checked, disabled}) => {
 *       return html`...`;
 *     }
 *   }
 * ]
 * ```
 */
export interface MaterialStoryInit<T extends {
    [name: string]: any;
}> {
    name: string;
    render: (knobs: T) => TemplateResult | Promise<TemplateResult>;
    styles?: CSSResult | CSSResult[];
}
/**
 * Converts an array of `MaterialStoryInit`s to a `LitStoryInit`.
 */
export declare function materialInitsToStoryInits<T extends {
    [name: string]: any;
}>(inits: Array<MaterialStoryInit<T>>): Array<LitStoryInit<KnobValues<KnobTypesToKnobs<T>>>>;
/**
 * Initializes the theme element for the theming knobs and renders the stories.
 */
export declare function setUpDemo(collection: LitCollection): void;
