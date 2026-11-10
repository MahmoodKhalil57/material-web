/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {badge, formatBadgeValue} from './badge.js';
import {styles as badgeStyles} from './badge.cssresult.js';

/**
 * A Material Design badge component.
 *
 * Without content it is a small (dot) badge; with content (slotted text or
 * `value`) it is a large badge.
 *
 * @slot - The large badge's label, e.g. a count.
 * @csspart badge - The badge container.
 * @cssprop --container-color
 * @cssprop --shape
 * @cssprop --size
 * @cssprop --label-text-color
 * @cssprop --padding-inline
 * @attr anchored - Places the badge on the top trailing corner of its
 *     positioned parent.
 */
export class BadgeElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    badgeStyles,
    css`
      :host {
        display: inline-flex;
      }
      /*
       * Anchored to the top trailing corner of the nearest positioned
       * ancestor (the icon's bounding box), in logical directions so it
       * mirrors for right-to-left. The leading corner of the badge's bottom
       * edge sits 6dp below the top and 6dp inside the trailing edge for a
       * small badge, 14dp and 12dp for a large one; a growing count extends
       * toward the trailing side and keeps the same placement.
       */
      :host([anchored]) {
        position: absolute;
        inset-block-end: calc(100% - 6px);
        inset-inline-start: calc(100% - 6px);
      }
      :host([anchored][large]) {
        inset-block-end: calc(100% - 14px);
        inset-inline-start: calc(100% - 12px);
      }
      .badge {
        flex: 1;
      }
    `,
  ];

  /**
   * A count to display. Counts above `max` show as `max+` (spec: limit
   * content to four characters, including a +). Slotted content is shown
   * when unset.
   */
  @property({type: Number}) value?: number;

  /** The largest count shown before it is truncated to `max+`. */
  @property({type: Number}) max = 999;

  /**
   * Screen reader text for a small (non-counting) badge. Spec: non-counting
   * badges announce "New notification", read after the destination's label.
   */
  @property() label = 'New notification';

  /**
   * Anchors the badge to the top trailing corner of its positioned parent
   * (the icon's bounding box).
   */
  @property({type: Boolean, reflect: true}) anchored = false;

  @state() private hasContent = false;

  protected override willUpdate() {
    // Lets the host's anchored placement depend on the badge size.
    this.toggleAttribute(
      'large',
      (this.value !== undefined && this.value !== null) || this.hasContent,
    );
  }

  protected override render() {
    const text =
      this.value === undefined || this.value === null
        ? undefined
        : formatBadgeValue(this.value, this.max);
    const large = text !== undefined || this.hasContent;
    return html`<span part="badge" class="${badge({large})}">
      ${text ?? nothing}
      <slot
        ?hidden=${text !== undefined}
        @slotchange=${this.handleSlotChange}></slot>
      ${!large && this.label
        ? html`<span class="badge-label">${this.label}</span>`
        : nothing}
    </span>`;
  }

  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    this.hasContent = nodes.some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent ?? '').trim().length > 0;
      }
      return true;
    });
  }
}
