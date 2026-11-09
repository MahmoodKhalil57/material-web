/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { onReportValidity } from '../../../behaviors/on-report-validity.js';
import { AnchoredOverlayController } from '../shared/anchored-overlay.js';
import { ValueFieldController } from '../shared/form-field.js';
import { type SelectVariant } from './select.js';
import { SelectOptionElement } from './select-option-element.js';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<import("@material/web/labs/behaviors/mixin.js").MixinReturn<(abstract new (...args: any[]) => import("../../../behaviors/element-internals.js").WithElementInternals) & typeof LitElement & import("../../../behaviors/form-associated.js").FormAssociatedConstructor, import("../../../behaviors/form-associated.js").FormAssociated>, import("../../../behaviors/constraint-validation.js").ConstraintValidation>, import("../../../behaviors/on-report-validity.js").OnReportValidity>>;
/**
 * Shared base of `md-gb-select` and `md-gb-autocomplete`: an exposed dropdown
 * menu. It renders a text field (the `md-gb-text-field` structure and styles)
 * whose control has the ARIA `combobox` role, and a `listbox` popover (the
 * `md-gb-menu` styles) anchored to the field and as wide as it, holding the
 * slotted `md-gb-select-option`s.
 *
 * Focus stays on the field; the active option is exposed with
 * `aria-activedescendant` (Compose `ExposedDropdownMenuBox` keeps focus on
 * its anchor).
 */
export declare abstract class SelectBase extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** The variant: `filled` (default) or `outlined`. */
    variant: SelectVariant;
    /** The floating label; also the field's accessible name. */
    label: string;
    /** Hides the asterisk added to the label of a required field. */
    noAsterisk: boolean;
    /** Whether a value is required. Adds an asterisk to the label. */
    required: boolean;
    /**
     * Whether the field is in a visually invalid state. Overrides the error
     * state set by `reportValidity()`.
     */
    error: boolean;
    /**
     * The message that replaces the supporting text while `error` is true.
     * Overrides the message shown by `reportValidity()`.
     */
    errorText: string;
    /** Additional information shown below the field. */
    supportingText: string;
    /** Whether a leading icon is slotted. Set it for SSR. */
    hasLeadingIcon: boolean;
    /** Whether the menu is open. */
    open: boolean;
    name: string;
    /** Disabled by the attribute or by a disabled fieldset. */
    get disabled(): boolean;
    set disabled(disabled: boolean);
    formDisabledCallback(disabled: boolean): void;
    private readonly formDisabled;
    setCustomValidity(error: string): void;
    /** Bumped to re-announce an unchanged error message. */
    private errorAnnouncement;
    /** The dirty value and the error shown after validation. */
    protected readonly valueField: ValueFieldController;
    protected readonly listbox: HTMLElement | null;
    /** The option `aria-activedescendant` points at. */
    protected activeOption: SelectOptionElement | null;
    /** Whether this is the editable autocomplete field. */
    protected abstract readonly editable: boolean;
    /** The options: every slotted `md-gb-select-option`. */
    get options(): SelectOptionElement[];
    /** The options the autocomplete filter has not hidden. */
    protected get visibleOptions(): SelectOptionElement[];
    /** Why the menu was last asked to close (a light dismiss), for `close()`. */
    private dismissReason;
    /**
     * The listbox popover under the field's width (Compose
     * `ExposedDropdownMenuBox`): below the field, above it when there is no
     * room; Escape, a press outside or focus leaving the field close it.
     * Focus stays on the field.
     */
    protected readonly overlay: AnchoredOverlayController;
    /** Opens the menu. */
    showPicker(): void;
    focus(options?: FocusOptions): void;
    blur(): void;
    /** The element with the `combobox` role. */
    protected abstract getField(): HTMLElement | null;
    /** Renders the `combobox` control inside the text field. */
    protected abstract renderControl(describedBy: string, showError: boolean): TemplateResult;
    /** Whether the field has content (floats the label). */
    protected abstract isPopulated(): boolean;
    /** Selects an option as the user's choice. */
    protected abstract pickOption(option: SelectOptionElement): void;
    /** The option to activate when the menu opens. */
    protected initialActiveOption(): SelectOptionElement | null;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected updated(changed: PropertyValues<this>): void;
    private syncPopover;
    protected render(): TemplateResult<1>;
    protected getLabelText(): string;
    /** ARIA attributes shared by both comboboxes. */
    protected get expandedState(): "false" | "true";
    /**
     * Points `aria-activedescendant` at an option (or nothing) and scrolls it
     * into view.
     */
    protected setActive(option: SelectOptionElement | null): void;
    /**
     * Moves the active option among the visible options. Disabled options can
     * be active (menus spec: "Disabled menu items can receive focus but aren't
     * selectable"). The active option does not wrap.
     */
    protected moveActive(to: 'first' | 'last' | number): void;
    /**
     * Handles the keys shared by both comboboxes while the menu is open.
     *
     * @return Whether the key was handled.
     */
    protected handleOpenNavigationKey(event: KeyboardEvent): boolean;
    /** Picks the active option (if it is enabled) and closes the menu. */
    protected pickActive(): void;
    protected handleSlotChange(): void;
    private handleContainerClick;
    /** Handles a click on the field (outside the leading icon). */
    protected abstract handleFieldClick(path: EventTarget[]): void;
    private handleListboxMousedown;
    private handleListboxClick;
    private handleToggle;
    private handleLeadingIconChange;
    /** Dispatches the `input` and `change` events of a user change. */
    protected dispatchUserChange(): void;
    [onReportValidity](invalidEvent: Event | null): void;
}
export {};
