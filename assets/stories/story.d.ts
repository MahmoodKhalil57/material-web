/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResult, TemplateResult } from 'lit';
import { Knob, KnobValues, PolymorphicArrayOfKnobs } from './knobs.js';
export { Knob, PolymorphicArrayOfKnobs } from './knobs.js';
/** Metadata all stories share. */
export interface BaseStoryInit {
    /** A short name, unique to the containing collection. */
    readonly name: string;
    readonly id?: string;
    readonly description?: string;
}
type GenericKnobValues = KnobValues<PolymorphicArrayOfKnobs>;
/** A story with an arbitrary render function. */
export interface StoryInit<KV extends GenericKnobValues = GenericKnobValues> extends BaseStoryInit {
    render(container: HTMLElement | DocumentFragment, knobs: KV): Promise<void>;
    styles?: CSSStyleSheet[];
}
declare class StoryImpl<Knobs extends PolymorphicArrayOfKnobs = PolymorphicArrayOfKnobs> {
    private readonly collection;
    readonly name: string;
    readonly id: string;
    readonly description: string | undefined;
    readonly render: (container: HTMLElement | DocumentFragment) => Promise<void>;
    readonly dispose: (container: HTMLElement | DocumentFragment) => void;
    readonly knobs: KnobValues<Knobs>;
    private readonly initStyles;
    get styles(): CSSStyleSheet[];
    constructor(init: StoryInit, collection: Collection);
}
/**
 * A function that can render some HTML, combined with that metadata.
 *
 * A Story typically depicts a configuration of a UI component or group of
 * components. A Story is always a member of a collection.
 *
 * The type is exposed here, but the implementation isn't, because a Story
 * must be constructed via a Collection.
 */
export type Story<Knobs extends PolymorphicArrayOfKnobs = PolymorphicArrayOfKnobs> = StoryImpl<Knobs>;
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
export declare class Collection<T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>> {
    readonly name: string;
    private readonly children;
    readonly customStyles: CSSStyleSheet[];
    private static readonly collectionsByName;
    readonly knobs: KnobValues<T>;
    constructor(name: string, knobs?: T);
    /**
     * Get an array of all stories in this collection.
     *
     * Exported for mwc's compiled tests.
     * @export
     */
    get stories(): Array<Story<T>>;
    get tree(): ReadonlyMap<string, Story<T> | Collection<T>>;
    static get byName(): ReadonlyMap<string, Collection>;
    addStories(...inits: ReadonlyArray<StoryInit<KnobValues<T>>>): void;
    applyStyle(customStyle: CSSResult): void;
}
/**
 * Describes a single configuration of a specific web UI component.
 */
export interface LitStoryInit<KV extends KnobValues<PolymorphicArrayOfKnobs> = KnobValues<PolymorphicArrayOfKnobs>> extends BaseStoryInit {
    renderLit(knobs: KV): TemplateResult | Promise<TemplateResult>;
    litStyles?: CSSResult | CSSResult[];
}
/**
 * A collection with convenience methods for rendering lit-html templates.
 */
export declare class LitCollection<T extends PolymorphicArrayOfKnobs = ReadonlyArray<Knob<unknown>>> extends Collection<T> {
    addStories(...inits: Array<StoryInit<KnobValues<T>> | LitStoryInit<KnobValues<T>>>): void;
}
