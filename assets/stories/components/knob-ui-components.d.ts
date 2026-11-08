/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/radio/radio.js';
import '@material/web/ripple/ripple.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/textfield/filled-text-field.js';
import { LitElement } from 'lit';
import { Knob, KnobUi } from '../knobs.js';
/**
 * A boolean Knob UI.
 */
export declare function boolInput(): KnobUi<boolean>;
/**
 * Color selector for knob UI
 */
export declare class KnobColorSelector extends LitElement {
    static styles: import("lit", { with: { "resolution-mode": "import" } }).CSSResult;
    private internalValue;
    hasAlpha: boolean;
    set value(val: string);
    get value(): string;
    render(): import("lit-html", { with: { "resolution-mode": "import" } }).TemplateResult<1>;
    private renderTextInput;
    private renderColorInput;
    private onInput;
    private propagateEvt;
    click(): void;
    focus(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'knob-color-selector': KnobColorSelector;
    }
}
declare const defaultColorPickerOpts: {
    hasAlpha: boolean;
};
/**
 * Options for ColorPicker knob.
 */
export type ColorPickerOpts = Partial<typeof defaultColorPickerOpts>;
/**
 * A color picker Knob UI.
 */
export declare function colorPicker(opts?: ColorPickerOpts): KnobUi<string>;
interface TextInputOptions<T> {
    transform(val: string): T;
}
/**
 * A simple, one line text input Knob UI.
 */
export declare function textInput<T>(): KnobUi<string>;
export declare function textInput<T>(options: TextInputOptions<T>): KnobUi<T>;
declare const defaultNumberInputOpts: {
    step: number;
};
/**
 * Options for NumberInput knob.
 */
export type NumberInputOpts = Partial<typeof defaultNumberInputOpts>;
/**
 * A simple, one line text input Knob UI.
 */
export declare function numberInput(opts?: NumberInputOpts): KnobUi<number>;
/**
 * A Knob UI that's just a button that triggers a rerender which it's clicked.
 * The value keeps track of the number of times it's been clicked.
 */
export declare function button(): KnobUi<number>;
interface RadioSelectorConfig<T extends string> {
    readonly options: ReadonlyArray<{
        readonly value: T;
        readonly label: string;
    }>;
    readonly name: string;
}
/** A radio button Knob UI. */
export declare function radioSelector<T extends string>({ options, name, }: RadioSelectorConfig<T>): KnobUi<T>;
interface SelectDropdownConfig<T extends string> {
    readonly options: ReadonlyArray<{
        readonly value: T;
        readonly label: string;
    }>;
}
/** A select dropdown Knob UI. */
export declare function selectDropdown<T extends string>({ options, }: SelectDropdownConfig<T>): KnobUi<T | undefined>;
/**
 * Knob wiring that updates the CSS custom property with the knob's name
 * to the updated value.
 */
export declare function cssCustomProperty(knob: Knob<string>, val: string, containerOfRenderedStory: HTMLElement): void;
/**
 * Knob wiring that updates the CSS properties on a given querySelector's
 * targets.
 */
export declare function setProp(selector: string): (knob: Knob<any>, val: unknown, container: HTMLElement) => void;
export {};
