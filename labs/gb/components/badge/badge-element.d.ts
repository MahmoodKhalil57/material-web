/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, LitElement } from 'lit';
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
export declare class BadgeElement extends LitElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    /**
     * A count to display. Counts above `max` show as `max+` (spec: limit
     * content to four characters, including a +). Slotted content is shown
     * when unset.
     */
    value?: number;
    /** The largest count shown before it is truncated to `max+`. */
    max: number;
    /**
     * Screen reader text for a small (non-counting) badge. Spec: non-counting
     * badges announce "New notification", read after the destination's label.
     */
    label: string;
    /**
     * Anchors the badge to the top trailing corner of its positioned parent
     * (the icon's bounding box).
     */
    anchored: boolean;
    private hasContent;
    protected willUpdate(): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private handleSlotChange;
}
