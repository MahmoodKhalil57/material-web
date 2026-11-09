/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { CSSResultOrNative, type PropertyValues } from 'lit';
import { AriaTablistElement } from '../../../aria/tabs/tablist.js';
import { DragSettleController } from '../shared/drag-settle.js';
import { ModalSurfaceController } from '../shared/modal-surface.js';
import { RovingFocusController } from '../shared/roving-focus.js';
import { type NavRailAlignment, type NavRailItemLayout } from './nav-rail.js';
/**
 * Compose AnchoredDraggableDefaults / ModalWideNavigationRail: a modal rail
 * released past half its width, or flung faster than 125dp/s toward its
 * edge, collapses.
 */
export declare const NAV_RAIL_POSITIONAL_THRESHOLD = 0.5;
/** See `NAV_RAIL_POSITIONAL_THRESHOLD`. */
export declare const NAV_RAIL_VELOCITY_THRESHOLD_PX_PER_S = 125;
/**
 * A Material Design navigation rail component.
 *
 * @slot - Used to display navigation rail items (`md-gb-nav-rail-item`).
 * @slot header - Used to display optional header controls (menu button, FAB).
 * @csspart nav-rail - The navigation rail's root container.
 * @csspart header - The navigation rail's header container.
 * @csspart menu-button - The built-in expand/collapse menu button when `collapsible`.
 * @csspart items - The navigation rail's items container.
 * @fires {Event} change - Fired when the selected item changes. --bubbles
 * @fires {CustomEvent<{expanded: boolean, reason?: string}>} toggle - Fired when the expanded state is toggled. --bubbles
 * @csspart scrim - The modal rail's scrim, while expanded.
 *
 * A `modal` rail expands over the content with a scrim, like Compose
 * `ModalWideNavigationRail`. Clicking the scrim, pressing Escape or swiping
 * the rail toward its edge collapses it. The scrim (and the menu button of a
 * `collapsible` rail) are the single-pointer alternatives to the swipe.
 * While a modal rail is expanded, focus moves into it, Tab stays inside it,
 * page scrolling is locked, and focus returns to the previous element when
 * it collapses. The `toggle` event's `detail.reason` says why a modal rail
 * collapsed (`escape`, `back`, `scrim` or `swipe`).
 *
 * Predictive back applies to the modal expanded rail (navigation-rail.md):
 * while it is expanded the rail listens for back requests with a
 * `CloseWatcher` (the Android back gesture or button, and Escape), falling
 * back to Escape on the document where `CloseWatcher` is missing. A back
 * request plays the predictive back motion (the rail pops off its edge,
 * Compose `ModalWideNavigationRail` scales) and collapses the rail.
 *
 * A FAB (`md-gb-fab` with a `label`) in the header is an extended FAB while
 * the rail is expanded and an icon FAB while it is collapsed.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --container-vertical-padding
 * @cssprop --collapsed-item-vertical-space
 * @cssprop --collapsed-narrow-container-width
 * @cssprop --collapsed-top-space
 * @cssprop --container-width
 * @cssprop --expanded-top-space
 * @cssprop --expanded-container-color
 * @cssprop --expanded-container-width-maximum
 * @cssprop --expanded-container-width-minimum
 * @cssprop --expanded-modal-container-color
 * @cssprop --header-space-minimum
 * @cssprop --item-active-focused-icon-color
 * @cssprop --item-active-focused-label-text-color
 * @cssprop --item-active-hovered-icon-color
 * @cssprop --item-active-hovered-label-text-color
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-pressed-icon-color
 * @cssprop --item-active-pressed-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-container-height
 * @cssprop --item-container-vertical-space
 * @cssprop --item-full-width-leading-space
 * @cssprop --item-full-width-trailing-space
 * @cssprop --item-horizontal-active-indicator-height
 * @cssprop --item-horizontal-active-indicator-width - The expanded
 *   destinations' pill width: `fit-content` (default) hugs the icon and
 *   label; `100%` takes the destination's width.
 * @cssprop --item-horizontal-icon-label-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-focused-icon-color
 * @cssprop --item-inactive-focused-label-text-color
 * @cssprop --item-inactive-hovered-icon-color
 * @cssprop --item-inactive-hovered-label-text-color
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-pressed-icon-color
 * @cssprop --item-inactive-pressed-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text-font
 * @cssprop --item-label-text-font-axes
 * @cssprop --item-label-text-font-tracking
 * @cssprop --item-outer-space
 * @cssprop --item-vertical-icon-label-space
 * @cssprop --item-vertical-leading-space
 * @cssprop --item-vertical-trailing-space
 * @cssprop --modal-container-elevation
 * @cssprop --modal-container-shape
 * @cssprop --modal-scrim-color
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export declare class NavRailElement extends AriaTablistElement {
    /** @nocollapse */
    static styles: CSSResultOrNative[];
    orientation: 'horizontal' | 'vertical';
    /**
     * Arrow keys move focus between the destinations (navigation-rail.md,
     * Keyboard navigation: "Tab / Arrows | Navigate between interactive
     * elements"). The rail declares `focusgroup` for browsers that ship it;
     * Chromium does not, so the shared RovingFocusController implements the
     * arrows. Every destination stays in the tab order. Disabled destinations
     * are skipped.
     */
    protected readonly rovingFocus: RovingFocusController;
    /**
     * Whether a vertical divider marks the edge of the rail next to the app's
     * content.
     */
    divider: boolean;
    /**
     * Whether the rail is elevated to level 1, to distinguish it from content
     * that scrolls underneath it.
     */
    elevated: boolean;
    /** Whether the navigation rail is expanded to show horizontal items. */
    expanded: boolean;
    /**
     * Whether the navigation rail renders a built-in expand/collapse menu button
     * in the header when no toggle button is slotted into `slot="header"`.
     */
    collapsible: boolean;
    /**
     * Whether the expanded navigation rail is modal: it opens over the content
     * with a scrim, with modal elevation and shape.
     */
    modal: boolean;
    /**
     * Hide when collapsed (navigation-rail.md): the collapsed rail is not shown
     * and takes no space, so the body content fills in. The expanded rail
     * (always modal in this mode) appears over the content when the app's
     * menu button calls `expand()` or `toggle()`; keep that menu button
     * accessible.
     */
    hideWhenCollapsed: boolean;
    /** Whether the expanded rail is modal, explicitly or when hiding. */
    private get isModal();
    /**
     * Whether the collapsed rail uses the narrow width
     * (`md.comp.nav-rail.collapsed.narrow.container.width`, 80dp).
     */
    narrow: boolean;
    /** The swipe-to-dismiss offset (px toward the start edge) while dragging. */
    private dragOffset;
    private readonly railElement;
    private collapseReason;
    /**
     * The modal expanded rail: Escape, back and scrim close requests, focus
     * in, trap and restore, and page scroll lock. The rail owns `expanded`.
     */
    protected readonly modalSurface: ModalSurfaceController;
    private dragWidth;
    private dragDirection;
    /** Vertical alignment of items ('top', 'center', or 'bottom'). */
    alignment: NavRailAlignment;
    /** The layout orientation of items ('vertical' or 'horizontal'). */
    itemLayout: NavRailItemLayout;
    private hasHeader;
    private hasSlottedToggle;
    private readonly headerSlot;
    private readonly menuButtonElement;
    private menuButtonAbortController;
    /**
     * The 0-based index of the currently active navigation rail item.
     * Alias for `selectedTabIndex`.
     */
    get selectedIndex(): number;
    set selectedIndex(index: number);
    /**
     * Toggles the expanded state of the navigation rail.
     *
     * @param force Optional boolean to force expanded (`true`) or collapsed (`false`).
     * @return The new `expanded` state.
     */
    toggle(force?: boolean): boolean;
    /** Expands the navigation rail. */
    expand(): void;
    /** Collapses the rail, reporting why in the `toggle` event's `detail.reason`. */
    private collapseFor;
    /** Collapses the navigation rail. */
    collapse(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /** Where things were before expanding or collapsing (see `morph`). */
    private morphFrom;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected updated(changedProperties: PropertyValues<this>): void;
    /**
     * Handles a back request (the Android back gesture or button) on the modal
     * expanded rail: plays the predictive back motion, then collapses the rail.
     * Call it for an in-app back control that should behave like the system
     * back. Resolves after the back motion.
     */
    handleBack(): Promise<void>;
    protected render(): import("lit-html").TemplateResult<1>;
    /**
     * Swipe to dismiss the expanded modal rail: a drag on the rail moves it
     * between the expanded and collapsed anchors and settles on release
     * (shared DragSettleController, with the closing direction positive).
     */
    protected readonly swipe: DragSettleController;
    private railIsRtl;
    private setupBuiltInMenuButton;
    private handleMenuButtonClick;
    private handleHeaderClick;
    private handleHeaderSlotChange;
    private syncHeaderState;
    /**
     * Destinations that are links make the bar a navigation landmark of links;
     * a tab list can only hold tabs. Without links it stays a tab list.
     */
    private readonly syncRole;
    protected handleSlotChange(): void;
    /** The slotted children, and each destination's icon and active pill. */
    private measureMorph;
    /**
     * Collapsed and expanded rails transform into each other
     * (navigation-rail.md: they "match visually and can transition into each
     * other"; the menu button changes them). The destinations' icons are
     * persistent: each moves from where it was to where it is now, and the
     * active indicator stretches between the icon's pill and the pill around
     * icon and label, on the rail's spatial spring (`--motion-duration`,
     * `--motion-easing`), while the labels, laid out anew, fade in (default
     * effects) and destinations shown only now (secondary ones) fade in.
     *
     * The destinations take their new layout at once (their own layout
     * transitions are snapped: the morph is their motion), and are held at
     * the rail's final width while the rail's width moves, clipped, so they
     * don't reflow on every frame. Only what's in view animates. Under reduced
     * motion only the fades run (motion transitions.md: "subtle fades
     * instead of ... sliding").
     */
    private morph;
    private syncItemsLayout;
}
