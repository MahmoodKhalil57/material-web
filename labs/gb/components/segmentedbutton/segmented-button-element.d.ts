/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CSSResultOrNative, LitElement } from 'lit';
/** How a segment is announced: set by its `md-gb-segmented-button-set`. */
export type SegmentedButtonMode = 'single' | 'multiple';
declare const baseClass: import("@material/web/labs/behaviors/mixin.js").MixinReturn<typeof LitElement>;
/**
 * One segment of a Material Design segmented button. Use it only as a child
 * of `md-gb-segmented-button-set`, which manages selection, focus and
 * semantics.
 *
 * A segment shows label text, an icon, or both. When selected, a checkmark
 * replaces the icon (crossfade), or, without an icon, scales in before the
 * label, which slides over to make room (Compose `SegmentedButton`).
 *
 * In a single-select set the segment is a `radio`; in a multi-select set it
 * is a `checkbox` (spec Accessibility > Labeling elements). Icon-only
 * segments need an `aria-label`.
 *
 * @slot - The label text.
 * @slot icon - An optional leading icon, such as `<md-gb-icon>`.
 * @csspart button - The segment's `<button>`.
 * @cssprop --container-height - Segment height at density 0.
 * @cssprop --container-shape - Outer corner radius of the first and last segments.
 * @cssprop --icon-size - Icon and checkmark size.
 * @cssprop --label-text - Label typography.
 * @cssprop --label-text-axes - Label font variation settings.
 * @cssprop --label-text-tracking - Label letter spacing.
 * @cssprop --outline-color - Outline color.
 * @cssprop --outline-width - Outline width.
 * @cssprop --leading-space - Padding before the content.
 * @cssprop --trailing-space - Padding after the content.
 * @cssprop --icon-label-space - Space between the icon and the label.
 * @cssprop --target-size - Minimum touch target height.
 * @cssprop --min-width - Minimum segment width.
 * @cssprop --density-step - Height removed per density step.
 */
export declare class SegmentedButtonElement extends baseClass {
    /** @nocollapse */
    static shadowRootOptions: ShadowRootInit;
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /** Whether the segment is selected. */
    selected: boolean;
    /** Whether the segment is disabled. */
    disabled: boolean;
    /** The value submitted with the set's form when selected. */
    value: string;
    /** Label text, rendered before the default slot's content. */
    label: string;
    /** Whether to hide the checkmark that shows when selected. */
    noCheckmark: boolean;
    /**
     * The selection mode of the parent set: `radio` semantics for `single`,
     * `checkbox` for `multiple`. Set by `md-gb-segmented-button-set`.
     */
    mode: SegmentedButtonMode;
    /**
     * Whether the segment is the set's tab stop (roving `tabindex`). Set by
     * `md-gb-segmented-button-set`.
     */
    focusable: boolean;
    /** Whether the parent set is disabled. Set by `md-gb-segmented-button-set`. */
    groupDisabled: boolean;
    private hasIcon;
    private hasSlottedLabel;
    /** Whether the segment can't be interacted with (own or set disabled). */
    get effectivelyDisabled(): boolean;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleIconSlotChange;
    private handleLabelSlotChange;
}
export {};
