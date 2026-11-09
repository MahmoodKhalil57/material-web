/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ClassInfo } from 'lit/directives/class-map.js';
/** Text field variants. */
export type TextFieldVariant = 'filled' | 'outlined';
/** Text field CSS classes. */
export declare const TEXT_FIELD_CLASSES: {
    readonly container: "text-field-container";
    readonly content: "text-field-content";
    readonly inputRow: "text-field-input-row";
    readonly input: "text-field-input";
    readonly label: "text-field-label";
    readonly leadingIcon: "text-field-leading-icon";
    readonly trailingIcon: "text-field-trailing-icon";
    readonly prefix: "text-field-prefix";
    readonly suffix: "text-field-suffix";
    readonly outline: "text-field-outline";
    readonly supporting: "text-field-supporting";
    readonly supportingText: "text-field-supporting-text";
    readonly counter: "text-field-counter";
    readonly errorIconFocus: "text-field-error-icon-focus";
    readonly supportingTextFocus: "text-field-supporting-text-focus";
    readonly density1: `${string}-density-1`;
    readonly density2: `${string}-density-2`;
    readonly density3: `${string}-density-3`;
    readonly textField: "text-field";
    readonly filled: "text-field-filled";
    readonly outlined: "text-field-outlined";
    readonly populated: "text-field-populated";
    readonly error: "text-field-error";
    readonly hasLabel: "text-field-has-label";
    readonly hasLeadingIcon: "text-field-has-leading-icon";
    readonly hasTrailingIcon: "text-field-has-trailing-icon";
    readonly textarea: "text-field-textarea";
    readonly noSpinner: "text-field-no-spinner";
    readonly hover: string;
    readonly focus: string;
    readonly disabled: string;
};
/** The state provided to `textFieldClasses()`. */
export interface TextFieldClassesState {
    /** The variant, `filled` by default. */
    variant?: TextFieldVariant;
    /** Whether the input has a value; floats the label. */
    populated?: boolean;
    /** Whether the field shows its error state. */
    error?: boolean;
    /** Whether the field has a label. */
    hasLabel?: boolean;
    /** Whether the field has a leading icon. */
    hasLeadingIcon?: boolean;
    /** Whether the field has a trailing icon. */
    hasTrailingIcon?: boolean;
    /** Whether the input is a `<textarea>`. */
    textarea?: boolean;
    /** Hides the spinner of `type="number"` inputs. */
    noSpinner?: boolean;
    /** Emulates `:hover`. */
    hover?: boolean;
    /** Emulates focus of the input; floats the label. */
    focus?: boolean;
    /** Emulates `:disabled`. */
    disabled?: boolean;
    /**
     * The density, 0 (default) to -3. text-fields.md: "Don't apply density to
     * text fields by default"; let people opt in to a denser layout.
     */
    density?: number;
}
/**
 * Returns the text field classes to apply to the root element.
 *
 * @param state The state of the text field.
 * @return An object of class names and truthy values if they apply.
 */
export declare function textFieldClasses({ variant, populated, error, hasLabel, hasLeadingIcon, hasTrailingIcon, textarea, noSpinner, hover, focus, disabled, density, }?: TextFieldClassesState): ClassInfo;
/**
 * Sets up a Light DOM text field: keeps the `populated` class in sync with
 * the value of its `.text-field-input`, and focuses the input when the
 * container is clicked.
 *
 * @param textField The `.text-field` root element.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export declare function setupTextField(textField: HTMLElement, opts?: {
    signal?: AbortSignal;
}): void;
/**
 * A Lit directive that adds text field classes and setup logic to the
 * `.text-field` root element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${textField({hasLabel: true})}">
 *     <div class="text-field-container">
 *       <label class="text-field-label" for="name">Name</label>
 *       <div class="text-field-content">
 *         <div class="text-field-input-row">
 *           <input id="name" class="text-field-input" />
 *         </div>
 *       </div>
 *     </div>
 *   </div>
 * `;
 * ```
 */
export declare const textField: (state?: TextFieldClassesState & import("../shared/directives.js").AdditionalClasses) => import("lit-html/directive.js").DirectiveResult;
