/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
/**
 * Fired (bubbling, not composed) when an option's `selected` property
 * changes, so its select can keep a single selection.
 */
export declare const SELECTED_CHANGE_EVENT = "md-gb-select-option-selected-change";
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement, import("../../../behaviors/element-internals.js").WithElementInternals>;
/**
 * An option of a `md-gb-select` or `md-gb-autocomplete`, styled as a
 * `md-gb-menu-item`.
 *
 * It has the ARIA `option` role. It never takes focus: its select keeps focus
 * on the field and points `aria-activedescendant` at the active option.
 *
 * @slot - The option's label.
 * @slot leading - An icon before the label. Without one, a selected option shows a checkmark.
 * @slot supporting-text - Supporting text below the label.
 * @slot trailing-text - Metadata after the label, such as a keyboard shortcut.
 * @slot trailing - An icon after the label.
 * @csspart menu-item - The option's root element.
 */
export declare class SelectOptionElement extends baseClass {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the option cannot be selected. It can still become active. */
    disabled: boolean;
    /**
     * Whether the option is selected. The `selected` attribute is the default
     * selection restored on form reset.
     */
    get selected(): boolean;
    set selected(selected: boolean);
    /** The form value. Defaults to `displayText`, like a native `<option>`. */
    get value(): string;
    set value(value: string);
    /**
     * The text shown in the field when the option is selected. Defaults to the
     * option's label text.
     */
    get displayText(): string;
    set displayText(text: string);
    /** The text matched by typeahead and filtering. Defaults to `displayText`. */
    get typeaheadText(): string;
    set typeaheadText(text: string);
    /**
     * Whether the option is the select's active option (its
     * `aria-activedescendant`). Set by the select.
     */
    active: boolean;
    /** Whether an autocomplete filter hides the option. Set by the select. */
    get filtered(): boolean;
    set filtered(filtered: boolean);
    private isSelected;
    private explicitValue;
    private explicitDisplayText;
    private explicitTypeaheadText;
    constructor();
    protected render(): import("lit-html").TemplateResult<1>;
    protected updated(): void;
    /** The text of the default slot (the label), without the other slots. */
    private getLabelText;
}
export {};
