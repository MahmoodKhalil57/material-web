/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { TemplateResult } from 'lit';
export * from './components/knob-ui-components.js';
interface KnobInit<T> {
    defaultValue?: T;
    ui: KnobUi<T>;
    wiring?: KnobWiring<T>;
}
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
export declare class Knob<T, Name extends string = string> extends EventTarget {
    readonly name: Name;
    readonly defaultValue?: T;
    latestValue?: T;
    /**
     * True iff the knob has had a value set, so that we know to apply any
     * wiring to any new stories we're informed of.
     */
    private dirty;
    private readonly uiFn;
    private readonly wiring?;
    private readonly onChange;
    private readonly onReset;
    private readonly renderedStoryContainers;
    constructor(name: Name, init: KnobInit<T>);
    get isUnset(): boolean;
    get uiTemplate(): TemplateResult;
    getKnobUiTemplate(): TemplateResult;
    /**
     * Connect the knob's wiring, if any, up to a container of a rendered story.
     * This is fast and idempotent, so it's fine to call frequently.
     */
    connectWiring(containerOfRenderedStory: HTMLElement | DocumentFragment): void;
    disconnectWiring(containerOfRenderedStory: HTMLElement | DocumentFragment): boolean;
    imperativelySet(newValue: T): void;
    reset(): void;
}
/** NOTE: This must only be used in an extends clause for a type variable. */
export type PolymorphicArrayOfKnobs = ReadonlyArray<Knob<any>>;
/**
 * Given an array of Knobs, return their names.
 *
 * So given
 *   Knobs = `[Knob<string, 'label'>, Knob<number, 'count'>]`
 *
 * This type operator would return 'label' | 'count'
 */
type KnobKeys<Knobs extends PolymorphicArrayOfKnobs> = Knobs[number]['name'];
/**
 * Given an array of Knobs, and the name of one of those knobs,
 * returns the value of the knob.
 *
 * So given:
 *   Knobs = `[Knob<string, 'label'>, Knob<number, 'count'>]` and
 *   SearchName = `'count'`
 *
 * This type operator would return `number`.
 */
type TypeOfKnobWithName<Knobs extends PolymorphicArrayOfKnobs, SearchName extends string> = Extract<Knobs[number], {
    name: SearchName;
}> extends Knob<infer U> ? U | undefined : never;
/** A helper class for getting the latest value for a knob by name. */
export declare class KnobValues<Knobs extends PolymorphicArrayOfKnobs> extends EventTarget {
    private readonly byName;
    constructor(knobsArray: PolymorphicArrayOfKnobs);
    get<SearchName extends KnobKeys<Knobs>>(knobName: SearchName): TypeOfKnobWithName<Knobs, SearchName>;
    set<SearchName extends KnobKeys<Knobs>>(knobName: SearchName, newValue: TypeOfKnobWithName<Knobs, SearchName>): void;
    /**
     * Returns an iterator of all the knob names.
     */
    names<SearchName extends KnobKeys<Knobs>>(): IterableIterator<SearchName>;
    /**
     * Reset all knob values back to their initial values.
     */
    reset(): void;
    /** True if empty, false if it contains knobs. */
    get empty(): boolean;
    /**
     * Connect the knobs' wiring up to this container where a story will be
     * rendered.
     *
     * Unlikely that any code outside of the stories system internals would
     * call this.
     */
    connectWiring(container: HTMLElement | DocumentFragment): void;
    /**
     * The inverse of connectWiring, so that discarded story renderers can be
     * garbage collected.
     *
     * Returns false if the container wasn't actually connected.
     */
    disconnectWiring(container: HTMLElement | DocumentFragment): boolean;
    /**
     * Renders the UIs of the knobs.
     */
    renderUI(): TemplateResult;
}
/**
 * Displays a user interface for someone browsing a catalog or demo for an
 * element to set the knob to different values.
 */
export interface KnobUi<T> {
    /**
     * @param knob Info about the knob that this UI is being rendered for.
     * @param container The element to render the UI into.
     * @param onChange Call this function every time a new value for the knob
     *     has been selected by the user.
     * @param onReset Call this function when the user has indicated that they
     *     want to unset a knob completely. This is similar to calling onChange
     *     with knob.defaultValue, but it will clear the knob from the URL
     *     and wiring may treat this case differently (e.g. restoring a value
     *     to the value it had before the wiring set it the first time).
     */
    render(knob: Knob<T>, onChange: (val: T) => void, onReset: () => void): TemplateResult;
}
/**
 * Takes updated values for a knob and interacts with a rendered story in order
 * to automatically apply the knob's value.
 *
 * Not all knobs can be automatically wired up in this way, so the knobs are
 * also made available to the stories themselves.
 *
 * For example, a knob that updates a css custom property can be automatically
 * wired up by just applying styles to the containerOfRenderedStory.
 */
export interface KnobWiring<T> {
    (knob: Knob<T>, val: T, containerOfRenderedStory: HTMLElement | DocumentFragment): void;
}
