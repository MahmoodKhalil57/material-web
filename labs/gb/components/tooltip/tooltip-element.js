/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { html, LitElement, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AnchoredOverlayController, composedContains, deepActiveElement, } from '../shared/anchored-overlay.js';
import { TOOLTIP_HIDE_DELAY_MS, TOOLTIP_LONG_PRESS_MS, TOOLTIP_SHOW_DELAY_MS, TOOLTIP_VARIANTS, tooltipClasses, } from './tooltip.js';
import tooltipStyles from './tooltip.css.js'; // github-only
/** Pointer travel (px) that cancels a pending long press. */
const LONG_PRESS_SLOP_PX = 10;
/** The open transient tooltip; showing another closes it ("one at a time"). */
let activeTooltip = null;
let idCounter = 0;
function px(style, prop, fallback) {
    const value = parseFloat(style.getPropertyValue(prop));
    return Number.isFinite(value) ? value : fallback;
}
function matchesFocusVisible(element) {
    try {
        return element.matches(':focus-visible');
    }
    catch {
        return true;
    }
}
// spec-labels: tooltips/guidelines/anatomy/rich-tooltip,
// spec-labels: tooltips/specs/plain-tooltip/plain-tooltip-measurements,
// spec-labels: tooltips/specs/rich-tooltip/rich-tooltip-configurations, tooltips/guidelines/usage,
// spec-labels: tooltips/specs/plain-tooltip, tooltips/specs/rich-tooltip,
// spec-labels: tooltips/guidelines/anatomy/plain-tooltip
/**
 * A Material Design tooltip: a plain tooltip that labels an element, or a
 * rich tooltip with an optional subhead and text buttons.
 *
 * Anchor it with `for="<anchor id>"` (an element in the same root) or the
 * `anchorElement` property. The tooltip shows when the anchor is hovered,
 * keyboard focused or long-pressed, and hides 1.5 seconds after the pointer
 * leaves (immediately on blur or Escape). A `persistent` rich tooltip instead
 * toggles when the anchor is clicked and stays until the user interacts
 * elsewhere or presses Escape.
 *
 * Plain tooltips, and rich tooltips without actions, have the `tooltip` role
 * and describe the anchor through `aria-describedby`. A rich tooltip with
 * slotted actions is a non-modal `dialog` labelled by its subhead; Tab from
 * the anchor moves focus into it, and focus is never trapped.
 *
 * @fires {Event} open - Fired before the tooltip opens. Cancelable.
 * @fires {Event} opened - Fired after the tooltip opens.
 * @fires {CustomEvent<{reason: string}>} close - Fired before the tooltip closes. Cancelable.
 * @fires {CustomEvent<{reason: string}>} closed - Fired after the tooltip closes.
 * @slot - The supporting text.
 * @slot subhead - Rich tooltip subhead; replaces the `subhead` attribute.
 * @slot action - Rich tooltip text buttons (up to two), e.g. `<md-gb-button color="text">`.
 * @csspart tooltip - The tooltip surface.
 * @csspart caret - The caret.
 * @csspart subhead - The subhead container.
 * @csspart supporting-text - The supporting text container.
 * @csspart actions - The actions container.
 * @cssprop --container-color - Container color.
 * @cssprop --container-elevation - Container box shadow.
 * @cssprop --container-shape - Container corner radius.
 * @cssprop --supporting-text - Supporting text typography.
 * @cssprop --supporting-text-axes - Supporting text font variation settings.
 * @cssprop --supporting-text-color - Supporting text color.
 * @cssprop --supporting-text-tracking - Supporting text letter spacing.
 * @cssprop --subhead - Rich subhead typography.
 * @cssprop --subhead-axes - Rich subhead font variation settings.
 * @cssprop --subhead-color - Rich subhead color.
 * @cssprop --subhead-tracking - Rich subhead letter spacing.
 * @cssprop --action-label-text - Rich action typography.
 * @cssprop --action-label-text-axes - Rich action font variation settings.
 * @cssprop --action-label-text-color - Rich action label color.
 * @cssprop --action-label-text-tracking - Rich action letter spacing.
 * @cssprop --min-width - Minimum container width.
 * @cssprop --min-height - Minimum container height.
 * @cssprop --max-width - Maximum container width.
 * @cssprop --padding-block - Container block padding.
 * @cssprop --padding-inline - Container inline padding.
 * @cssprop --actions-padding-block-end - Rich container bottom padding below actions.
 * @cssprop --subhead-spacing - Space below the rich subhead.
 * @cssprop --actions-spacing - Space above the rich actions.
 * @cssprop --actions-gap - Space between rich actions.
 * @cssprop --anchor-spacing - Distance between the anchor and the tooltip (or its caret).
 * @cssprop --caret-width - Caret base width.
 * @cssprop --caret-height - Caret height.
 * @cssprop --viewport-margin - Minimum distance from the viewport edges.
 */
export class TooltipElement extends LitElement {
    constructor() {
        super(...arguments);
        /** Plain or rich. */
        this.variant = TOOLTIP_VARIANTS.plain;
        /** The id of the anchor element, in the same root as the tooltip. */
        this.htmlFor = '';
        /**
         * Preferred side of the anchor. Defaults to `above` for plain tooltips and
         * `below` for rich ones. Flips when there isn't room.
         */
        this.placement = '';
        /**
         * Rich only: opens when the anchor is clicked instead of on hover / focus,
         * and stays open until the user interacts with another element.
         */
        this.persistent = false;
        /**
         * Plain only: the anchor has no visual boundary, such as a text baseline,
         * so the tooltip sits 8dp from it instead of 4dp.
         */
        this.noBoundary = false;
        /**
         * How the tooltip lines up with its anchor along the placement side:
         * `center` (plain default) or `start` (rich default). A rich tooltip can
         * be `center`ed below its anchor on desktop.
         */
        this.align = '';
        /** Whether to draw a caret pointing at the anchor. */
        this.caret = false;
        /** Rich only: subhead text. Replaced by content in the `subhead` slot. */
        this.subhead = '';
        /** Hover delay before showing, in milliseconds. */
        this.showDelay = TOOLTIP_SHOW_DELAY_MS;
        /** Delay before hiding after the pointer leaves, in milliseconds. */
        this.hideDelay = TOOLTIP_HIDE_DELAY_MS;
        /** Skips the open / close animation. */
        this.quick = false;
        /** The side of the anchor the tooltip is on. */
        this.side = 'above';
        this.hasSlottedSubhead = false;
        this.hasActions = false;
        this.internals = this.attachInternals();
        this.isOpenInternal = false;
        this.pendingOpen = false;
        this.explicitAnchor = null;
        this.boundAnchor = null;
        this.anchorAbort = null;
        this.addedDescribedBy = false;
        this.addedExpanded = false;
        this.addedHasPopup = false;
        this.longPressStart = null;
        this.longPressShown = false;
        this.suppressClickUntil = 0;
        this.restoringFocus = false;
        /**
         * The popover, its position next to the anchor, light dismiss (Escape, a
         * press or focus outside) and the return of focus to the anchor.
         */
        this.overlay = new AnchoredOverlayController(this, {
            surface: () => this,
            anchor: () => this.boundAnchor,
            popover: 'manual',
            positioning: 'js',
            dismiss: { escape: true, outside: true, focusIn: true },
            restoreFocus: (reason) => reason === 'escape',
            returnTarget: () => this.boundAnchor,
            placement: () => {
                const style = getComputedStyle(this);
                const caretHeight = this.caret ? px(style, '--caret-height', 8) : 0;
                return {
                    // A plain tooltip is above its anchor, or below it in an app bar.
                    placement: this.placement ||
                        (this.isRich || this.anchorInAppBar() ? 'below' : 'above'),
                    align: this.align || (this.isRich ? 'start' : 'center'),
                    spacing: (this.noBoundary
                        ? px(style, '--text-anchor-spacing', 8)
                        : px(style, '--anchor-spacing', 4)) + caretHeight,
                    margin: px(style, '--viewport-margin', 8),
                    caretInset: px(style, '--caret-width', 16) / 2 + 4,
                };
            },
            onDismiss: (reason) => {
                this.close(reason === 'focus' ? 'outside' : reason);
            },
            onPosition: (position) => {
                this.applyPosition(position);
            },
        });
        this.handleAnchorPointerEnter = (event) => {
            if (event.pointerType !== 'mouse' || this.isPersistent)
                return;
            this.scheduleShow();
        };
        this.handleAnchorPointerLeave = (event) => {
            if (event.pointerType !== 'mouse' || this.isPersistent)
                return;
            // Stay while the anchor holds keyboard focus.
            const focused = deepActiveElement();
            if (focused &&
                composedContains(this.boundAnchor, focused) &&
                matchesFocusVisible(focused)) {
                return;
            }
            this.scheduleHide('pointer');
        };
        this.handleAnchorPointerDown = (event) => {
            this.longPressShown = false;
            if (event.pointerType === 'mouse' || this.isPersistent)
                return;
            this.longPressStart = { x: event.clientX, y: event.clientY };
            window.clearTimeout(this.longPressTimer);
            this.longPressTimer = window.setTimeout(() => {
                this.longPressStart = null;
                this.longPressShown = true;
                this.show();
            }, TOOLTIP_LONG_PRESS_MS);
        };
        this.handleAnchorPointerMove = (event) => {
            const start = this.longPressStart;
            if (!start)
                return;
            if (Math.hypot(event.clientX - start.x, event.clientY - start.y) >
                LONG_PRESS_SLOP_PX) {
                window.clearTimeout(this.longPressTimer);
                this.longPressStart = null;
            }
        };
        this.handleAnchorPointerUp = () => {
            window.clearTimeout(this.longPressTimer);
            this.longPressStart = null;
            if (this.longPressShown) {
                // The long press shows the tooltip instead of activating the anchor.
                this.suppressClickUntil = Date.now() + 400;
                this.scheduleHide('pointer');
            }
        };
        this.handleAnchorContextMenu = (event) => {
            if (this.longPressShown || this.longPressStart) {
                event.preventDefault();
            }
        };
        this.handleAnchorClick = (event) => {
            if (this.longPressShown && Date.now() < this.suppressClickUntil) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.longPressShown = false;
                return;
            }
            if (!this.isPersistent)
                return;
            if (this.isOpenInternal) {
                this.close('toggle');
            }
            else {
                this.show();
            }
        };
        this.handleAnchorFocusIn = () => {
            if (this.isPersistent || this.restoringFocus)
                return;
            const focused = deepActiveElement();
            if (focused && !matchesFocusVisible(focused))
                return;
            this.cancelHide();
            this.show();
        };
        this.handleAnchorFocusOut = (event) => {
            if (this.isPersistent)
                return;
            if (composedContains(this, event.relatedTarget))
                return;
            this.close('blur');
        };
        this.handleAnchorKeyDown = (event) => {
            // Compose: Tab from the anchor moves focus into a tooltip with actions.
            if (event.key === 'Tab' &&
                !event.shiftKey &&
                this.isOpenInternal &&
                this.isDialog &&
                this.focusFirstAction()) {
                event.preventDefault();
            }
        };
        this.handleTooltipPointerEnter = () => {
            // The tooltip is part of the target region: keep it while hovered.
            this.cancelHide();
        };
        this.handleTooltipPointerLeave = (event) => {
            if (event.pointerType !== 'mouse' || this.isPersistent)
                return;
            this.scheduleHide('pointer');
        };
        this.handleTooltipFocusOut = (event) => {
            const next = event.relatedTarget;
            if (!next || composedContains(this, next))
                return;
            if (composedContains(this.boundAnchor, next))
                return;
            this.close('blur');
        };
        this.handleTooltipKeyDown = (event) => {
            // Focus moves top to bottom between the interactive elements (links, then
            // actions). Shift+Tab from the first one returns to the anchor.
            if (event.key !== 'Tab' || !this.boundAnchor)
                return;
            const items = this.interactiveElements();
            const index = items.findIndex((el) => composedContains(el, event.target));
            if (index < 0)
                return;
            if (event.shiftKey) {
                event.preventDefault();
                (items[index - 1] ?? this.boundAnchor).focus();
            }
            else if (index < items.length - 1) {
                event.preventDefault();
                items[index + 1].focus();
            }
        };
    }
    /** Whether the tooltip is open. */
    get open() {
        return this.isOpenInternal || this.pendingOpen;
    }
    set open(value) {
        if (!this.hasUpdated || !this.isConnected) {
            const old = this.open;
            this.pendingOpen = value;
            this.requestUpdate('open', old);
            return;
        }
        if (value) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    /**
     * The anchor element. Set it to anchor to an element directly; otherwise
     * it is the element whose id is `for`.
     */
    get anchorElement() {
        if (this.explicitAnchor)
            return this.explicitAnchor;
        if (!this.htmlFor)
            return null;
        const root = this.getRootNode();
        return root.getElementById?.(this.htmlFor) ?? null;
    }
    set anchorElement(element) {
        this.explicitAnchor = element;
        this.bindAnchor();
    }
    /** Whether the anchor is inside an app bar (also through shadow roots). */
    anchorInAppBar() {
        let node = this.boundAnchor;
        while (node) {
            if (node instanceof Element && node.closest('md-gb-app-bar')) {
                return true;
            }
            const root = node.getRootNode();
            node = root instanceof ShadowRoot ? root.host : null;
        }
        return false;
    }
    get isRich() {
        return this.variant === TOOLTIP_VARIANTS.rich;
    }
    get isPersistent() {
        return this.isRich && this.persistent;
    }
    /** A rich tooltip with actions is a non-modal dialog. */
    get isDialog() {
        return this.isRich && this.hasActions;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.id) {
            this.id = `md-gb-tooltip-${++idCounter}`;
        }
        if (!this.hasAttribute('popover')) {
            this.popover = 'manual';
        }
        this.addEventListener('pointerenter', this.handleTooltipPointerEnter);
        this.addEventListener('pointerleave', this.handleTooltipPointerLeave);
        this.addEventListener('focusout', this.handleTooltipFocusOut);
        this.addEventListener('keydown', this.handleTooltipKeyDown);
        if (this.hasUpdated) {
            this.bindAnchor();
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('pointerenter', this.handleTooltipPointerEnter);
        this.removeEventListener('pointerleave', this.handleTooltipPointerLeave);
        this.removeEventListener('focusout', this.handleTooltipFocusOut);
        this.removeEventListener('keydown', this.handleTooltipKeyDown);
        if (this.isOpenInternal) {
            this.finishHide('method');
        }
        this.unbindAnchor();
    }
    /** Opens the tooltip, closing any other open tooltip. */
    show() {
        if (!this.isConnected || !this.hasUpdated) {
            this.open = true;
            return;
        }
        this.pendingOpen = false;
        this.clearTimers();
        if (this.isOpenInternal)
            return;
        this.bindAnchor();
        const proceed = this.dispatchEvent(new Event('open', { bubbles: true, cancelable: true }));
        if (!proceed)
            return;
        if (activeTooltip && activeTooltip !== this) {
            activeTooltip.finishHide('replaced');
        }
        activeTooltip = this;
        this.isOpenInternal = true;
        this.requestUpdate('open', false);
        this.overlay.open(this.boundAnchor);
        this.syncAnchorExpanded();
        this.dispatchEvent(new Event('opened', { bubbles: true }));
    }
    /** Closes the tooltip. */
    hide() {
        this.close('method');
    }
    close(reason) {
        this.clearTimers();
        if (!this.isOpenInternal) {
            if (this.pendingOpen) {
                this.pendingOpen = false;
                this.requestUpdate('open', true);
            }
            return;
        }
        const proceed = this.dispatchEvent(new CustomEvent('close', {
            bubbles: true,
            cancelable: true,
            detail: { reason },
        }));
        if (!proceed)
            return;
        this.finishHide(reason);
    }
    finishHide(reason) {
        this.clearTimers();
        if (!this.isOpenInternal)
            return;
        this.isOpenInternal = false;
        this.requestUpdate('open', true);
        if (activeTooltip === this) {
            activeTooltip = null;
        }
        // Focus returning to the anchor must not show the tooltip again.
        this.restoringFocus = true;
        this.overlay.close(reason);
        this.restoringFocus = false;
        this.syncAnchorExpanded();
        this.dispatchEvent(new CustomEvent('closed', { bubbles: true, detail: { reason } }));
    }
    /** Recomputes the tooltip's position next to its anchor. */
    reposition() {
        this.overlay.reposition();
    }
    applyPosition(position) {
        this.style.setProperty('--_caret-offset', `${position.caretOffset}px`);
        const origin = {
            above: `${position.caretOffset}px 100%`,
            below: `${position.caretOffset}px 0`,
            left: `100% ${position.caretOffset}px`,
            right: `0 ${position.caretOffset}px`,
        }[position.side];
        this.style.setProperty('--_origin', origin);
        this.side = position.side;
    }
    firstUpdated() {
        this.bindAnchor();
        if (this.pendingOpen) {
            // Outside the update cycle: showing updates `open` and the side.
            queueMicrotask(() => {
                if (this.pendingOpen)
                    this.show();
            });
        }
    }
    updated(changed) {
        if (changed.has('htmlFor') ||
            changed.has('variant') ||
            changed.has('persistent') ||
            changed.has('hasActions') ||
            changed.has('subhead') ||
            changed.has('hasSlottedSubhead')) {
            this.bindAnchor();
            this.syncAria();
        }
        if (this.isOpenInternal &&
            (changed.has('variant') ||
                changed.has('caret') ||
                changed.has('placement'))) {
            queueMicrotask(() => {
                this.reposition();
            });
        }
    }
    render() {
        const rich = this.isRich;
        const classes = tooltipClasses({
            variant: this.variant,
            side: this.side,
            caret: this.caret,
            hasSubhead: rich && (this.hasSlottedSubhead || !!this.subhead.trim()),
            hasActions: rich && this.hasActions,
        });
        return html `
      <div
        class=${classMap({ ...classes, 'tooltip-host': true })}
        part="tooltip">
        <span class="tooltip-caret" part="caret" aria-hidden="true"></span>
        ${rich
            ? html `<div class="tooltip-subhead" part="subhead">
              <slot name="subhead" @slotchange=${this.handleSubheadSlotChange}
                >${this.subhead}</slot
              >
            </div>`
            : nothing}
        <div class="tooltip-supporting-text" part="supporting-text">
          <slot></slot>
        </div>
        ${rich
            ? html `<div class="tooltip-actions" part="actions">
              <slot
                name="action"
                @slotchange=${this.handleActionSlotChange}></slot>
            </div>`
            : nothing}
      </div>
    `;
    }
    handleSubheadSlotChange(event) {
        const slot = event.target;
        this.hasSlottedSubhead = slot.assignedNodes().some((node) => node.nodeType === Node.ELEMENT_NODE || !!node.textContent?.trim());
    }
    handleActionSlotChange(event) {
        const slot = event.target;
        this.hasActions = slot.assignedElements().length > 0;
    }
    get subheadText() {
        if (this.hasSlottedSubhead) {
            return Array.from(this.querySelectorAll('[slot="subhead"]'))
                .map((el) => el.textContent?.trim() ?? '')
                .join(' ')
                .trim();
        }
        return this.subhead.trim();
    }
    syncAria() {
        this.internals.role = this.isDialog ? 'dialog' : 'tooltip';
        this.internals.ariaLabel = this.isDialog ? this.subheadText || null : null;
        const anchor = this.boundAnchor;
        if (!anchor)
            return;
        if (this.isDialog) {
            this.removeDescribedBy(anchor);
        }
        else {
            this.addDescribedBy(anchor);
        }
        if (this.isPersistent) {
            // aria-haspopup names the role of the popup (ARIA 1.3: menu, listbox,
            // tree, grid or dialog; `true` means menu). Only the dialog form of the
            // rich tooltip is such a popup; a tooltip is not.
            if (this.isDialog) {
                anchor.setAttribute('aria-haspopup', 'dialog');
                this.addedHasPopup = true;
            }
            else if (this.addedHasPopup) {
                anchor.removeAttribute('aria-haspopup');
                this.addedHasPopup = false;
            }
            this.addedExpanded = true;
            this.syncAnchorExpanded();
        }
        else if (this.addedExpanded) {
            if (this.addedHasPopup)
                anchor.removeAttribute('aria-haspopup');
            this.addedHasPopup = false;
            anchor.removeAttribute('aria-expanded');
            this.addedExpanded = false;
        }
    }
    syncAnchorExpanded() {
        if (this.addedExpanded && this.boundAnchor) {
            this.boundAnchor.setAttribute('aria-expanded', String(this.isOpenInternal));
        }
    }
    addDescribedBy(anchor) {
        const ids = (anchor.getAttribute('aria-describedby') ?? '')
            .split(/\s+/)
            .filter(Boolean);
        if (!ids.includes(this.id)) {
            anchor.setAttribute('aria-describedby', [...ids, this.id].join(' '));
            this.addedDescribedBy = true;
        }
    }
    removeDescribedBy(anchor) {
        if (!this.addedDescribedBy)
            return;
        this.addedDescribedBy = false;
        const ids = (anchor.getAttribute('aria-describedby') ?? '')
            .split(/\s+/)
            .filter((id) => id && id !== this.id);
        if (ids.length) {
            anchor.setAttribute('aria-describedby', ids.join(' '));
        }
        else {
            anchor.removeAttribute('aria-describedby');
        }
    }
    bindAnchor() {
        if (!this.isConnected)
            return;
        const anchor = this.anchorElement;
        if (anchor === this.boundAnchor)
            return;
        this.unbindAnchor();
        if (!anchor)
            return;
        this.boundAnchor = anchor;
        this.anchorAbort = new AbortController();
        const opts = { signal: this.anchorAbort.signal };
        anchor.addEventListener('pointerenter', this.handleAnchorPointerEnter, opts);
        anchor.addEventListener('pointerleave', this.handleAnchorPointerLeave, opts);
        anchor.addEventListener('pointerdown', this.handleAnchorPointerDown, opts);
        anchor.addEventListener('pointermove', this.handleAnchorPointerMove, opts);
        anchor.addEventListener('pointerup', this.handleAnchorPointerUp, opts);
        anchor.addEventListener('pointercancel', this.handleAnchorPointerUp, opts);
        anchor.addEventListener('contextmenu', this.handleAnchorContextMenu, opts);
        anchor.addEventListener('click', this.handleAnchorClick, {
            ...opts,
            capture: true,
        });
        anchor.addEventListener('focusin', this.handleAnchorFocusIn, opts);
        anchor.addEventListener('focusout', this.handleAnchorFocusOut, opts);
        anchor.addEventListener('keydown', this.handleAnchorKeyDown, opts);
        this.syncAria();
    }
    unbindAnchor() {
        const anchor = this.boundAnchor;
        this.anchorAbort?.abort();
        this.anchorAbort = null;
        if (anchor) {
            this.removeDescribedBy(anchor);
            if (this.addedExpanded) {
                if (this.addedHasPopup)
                    anchor.removeAttribute('aria-haspopup');
                this.addedHasPopup = false;
                anchor.removeAttribute('aria-expanded');
                this.addedExpanded = false;
            }
        }
        this.boundAnchor = null;
    }
    clearTimers() {
        window.clearTimeout(this.showTimer);
        window.clearTimeout(this.hideTimer);
        this.showTimer = undefined;
        this.hideTimer = undefined;
    }
    scheduleShow() {
        window.clearTimeout(this.hideTimer);
        this.hideTimer = undefined;
        if (this.isOpenInternal)
            return;
        window.clearTimeout(this.showTimer);
        if (this.showDelay <= 0) {
            this.show();
            return;
        }
        this.showTimer = window.setTimeout(() => {
            this.show();
        }, this.showDelay);
    }
    scheduleHide(reason) {
        window.clearTimeout(this.showTimer);
        this.showTimer = undefined;
        if (!this.isOpenInternal)
            return;
        window.clearTimeout(this.hideTimer);
        this.hideTimer = window.setTimeout(() => {
            this.close(reason);
        }, Math.max(0, this.hideDelay));
    }
    cancelHide() {
        window.clearTimeout(this.hideTimer);
        this.hideTimer = undefined;
    }
    /**
     * The tooltip's interactive elements in reading order (top to bottom):
     * links in the supporting text, then the actions.
     */
    interactiveElements() {
        return Array.from(this.querySelectorAll('a[href], button, [slot="action"], [tabindex]:not([tabindex="-1"])')).filter((el) => !el.matches(':disabled, [disabled]'));
    }
    focusFirstAction() {
        const target = this.interactiveElements()[0];
        if (!target)
            return false;
        target.focus();
        return true;
    }
}
/** @nocollapse */
TooltipElement.styles = [tooltipStyles];
__decorate([
    property({ reflect: true })
], TooltipElement.prototype, "variant", void 0);
__decorate([
    property({ attribute: 'for', reflect: true })
], TooltipElement.prototype, "htmlFor", void 0);
__decorate([
    property({ reflect: true })
], TooltipElement.prototype, "placement", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TooltipElement.prototype, "persistent", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'no-boundary' })
], TooltipElement.prototype, "noBoundary", void 0);
__decorate([
    property({ reflect: true })
], TooltipElement.prototype, "align", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TooltipElement.prototype, "caret", void 0);
__decorate([
    property()
], TooltipElement.prototype, "subhead", void 0);
__decorate([
    property({ type: Number, attribute: 'show-delay' })
], TooltipElement.prototype, "showDelay", void 0);
__decorate([
    property({ type: Number, attribute: 'hide-delay' })
], TooltipElement.prototype, "hideDelay", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TooltipElement.prototype, "quick", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TooltipElement.prototype, "open", null);
__decorate([
    state()
], TooltipElement.prototype, "side", void 0);
__decorate([
    state()
], TooltipElement.prototype, "hasSlottedSubhead", void 0);
__decorate([
    state()
], TooltipElement.prototype, "hasActions", void 0);
//# sourceMappingURL=tooltip-element.js.map