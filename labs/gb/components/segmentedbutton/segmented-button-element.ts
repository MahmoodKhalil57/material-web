/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {ripple} from '../ripple/ripple.js';
import {
  SEGMENTED_BUTTON_CLASSES as C,
  segmentedButtonClasses,
} from './segmented-button.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import segmentedButtonStyles from './segmented-button.css' with {type: 'css'}; // github-only
// import segmentedButtonStyles from './segmented-button.cssresult.js'; // google3-only

/** How a segment is announced: set by its `md-gb-segmented-button-set`. */
export type SegmentedButtonMode = 'single' | 'multiple';

// Separate variable needed for closure.
// spec-labels: segmented-buttons/specs, segmented-buttons/guidelines/anatomy, segmented-buttons/specs/measurements
const baseClass = mixinDelegatesAria(LitElement);

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
export class SegmentedButtonElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    segmentedButtonStyles,
  ];

  /** Whether the segment is selected. */
  @property({type: Boolean, reflect: true}) selected = false;

  /** Whether the segment is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The value submitted with the set's form when selected. */
  @property() value = '';

  /** Label text, rendered before the default slot's content. */
  @property() label = '';

  /** Whether to hide the checkmark that shows when selected. */
  @property({type: Boolean, attribute: 'no-checkmark'}) noCheckmark = false;

  /**
   * The selection mode of the parent set: `radio` semantics for `single`,
   * `checkbox` for `multiple`. Set by `md-gb-segmented-button-set`.
   */
  @property({attribute: false}) mode: SegmentedButtonMode = 'single';

  /**
   * Whether the segment is the set's tab stop (roving `tabindex`). Set by
   * `md-gb-segmented-button-set`.
   */
  @property({attribute: false}) focusable = true;

  /** Whether the parent set is disabled. Set by `md-gb-segmented-button-set`. */
  @property({attribute: false}) groupDisabled = false;

  @state() private hasIcon = false;
  @state() private hasSlottedLabel = false;

  /** Whether the segment can't be interacted with (own or set disabled). */
  get effectivelyDisabled(): boolean {
    return this.disabled || this.groupDisabled;
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    const disabled = this.effectivelyDisabled;
    const classes = segmentedButtonClasses({
      selected: this.selected,
      disabled,
      withIcon: this.hasIcon,
      withLabel: Boolean(this.label) || this.hasSlottedLabel,
      checkmark: !this.noCheckmark,
    });
    return html`<button
      part="button"
      class="${classMap(classes)} ripple focus-ring-outer"
      type="button"
      role=${this.mode === 'multiple' ? 'checkbox' : 'radio'}
      aria-checked=${this.selected ? 'true' : 'false'}
      aria-label=${ariaLabel || nothing}
      tabindex=${this.focusable && !disabled ? '0' : '-1'}
      ?disabled=${disabled}
      ${ripple()}>
      <span class=${C.touch}></span>
      <span class=${C.content}>
        <span class=${C.graphic} aria-hidden="true">
          <span class=${C.icon}>
            <slot name="icon" @slotchange=${this.handleIconSlotChange}></slot>
          </span>
          <span class=${C.checkmark}>
            <svg viewBox="0 0 24 24">
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </span>
        </span>
        <span class=${C.label}
          >${this.label}<slot @slotchange=${this.handleLabelSlotChange}></slot
        ></span>
      </span>
    </button>`;
  }

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedElements({flatten: true}).length > 0;
  }

  private handleLabelSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasSlottedLabel = slot
      .assignedNodes({flatten: true})
      .some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE ||
          Boolean(node.textContent?.trim()),
      );
  }
}
