/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), Math.max(min, max));
}
/**
 * Positions a surface next to its anchor, after Compose's
 * `TooltipPositionProviderImpl`: prefer the requested side, flip to the
 * opposite side when it doesn't fit, then keep the surface inside the
 * viewport.
 */
export function computeOverlayPosition({ anchor, surface, viewport, placement, align = 'center', spacing = 4, margin = 8, caretInset = 12, rtl = false, }) {
    const { width, height } = surface;
    const edges = typeof margin === 'number'
        ? { inline: margin, blockStart: margin, blockEnd: margin }
        : margin;
    const anchorWidth = anchor.right - anchor.left;
    const anchorHeight = anchor.bottom - anchor.top;
    const minX = edges.inline;
    const maxX = viewport.width - edges.inline - width;
    const minY = edges.blockStart;
    const maxY = viewport.height - edges.blockEnd - height;
    let x;
    let y;
    let side;
    if (placement === 'above' || placement === 'below') {
        if (align === 'start' || align === 'end') {
            // Extend from the anchor's start (or end) edge, else the other edge,
            // else center (Compose `rememberRichTooltipPositionProvider`).
            const fromStart = (align === 'start') !== rtl;
            x = fromStart ? anchor.left : anchor.right - width;
            if (x < minX || x > maxX) {
                x = fromStart ? anchor.right - width : anchor.left;
                if (x < minX || x > maxX) {
                    x = anchor.left + (anchorWidth - width) / 2;
                }
            }
        }
        else {
            x = anchor.left + (anchorWidth - width) / 2;
        }
        x = clamp(x, minX, maxX);
        const yAbove = anchor.top - spacing - height;
        const yBelow = anchor.bottom + spacing;
        if (placement === 'above') {
            const fitsAbove = yAbove >= minY;
            side = fitsAbove || yBelow > maxY ? 'above' : 'below';
        }
        else {
            const fitsBelow = yBelow <= maxY;
            side = fitsBelow || yAbove < minY ? 'below' : 'above';
        }
        y = side === 'above' ? yAbove : yBelow;
        y = clamp(y, minY, maxY);
    }
    else {
        const preferLeft = (placement === 'start') !== rtl;
        const xLeft = anchor.left - spacing - width;
        const xRight = anchor.right + spacing;
        if (preferLeft) {
            side = xLeft >= minX || xRight > maxX ? 'left' : 'right';
        }
        else {
            side = xRight <= maxX || xLeft < minX ? 'right' : 'left';
        }
        x = clamp(side === 'left' ? xLeft : xRight, minX, maxX);
        y = clamp(align === 'center' ? anchor.top + (anchorHeight - height) / 2 : anchor.top, minY, maxY);
    }
    const vertical = side === 'above' || side === 'below';
    const length = vertical ? width : height;
    const anchorCenter = vertical
        ? anchor.left + anchorWidth / 2 - x
        : anchor.top + anchorHeight / 2 - y;
    const inset = Math.min(caretInset, length / 2);
    const caretOffset = clamp(anchorCenter, inset, length - inset);
    return { x, y, side, caretOffset };
}
/** `node` is `parent` or inside it, across shadow roots. */
export function composedContains(parent, node) {
    while (parent && node) {
        if (node === parent)
            return true;
        node = node.parentNode ?? node.host ?? null;
    }
    return false;
}
/** The focused element, looking inside open shadow roots. */
export function deepActiveElement() {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
        active = active.shadowRoot.activeElement;
    }
    return active;
}
let anchorPositioningOverride = null;
/**
 * Pretends the browser does (`true`) or does not (`false`) have CSS anchor
 * positioning, so tests can drive the JS fallback in a browser that has it.
 * `null` goes back to detecting it. Takes effect when a surface next opens.
 */
export function forceAnchorPositioningSupport(value) {
    anchorPositioningOverride = value;
}
/** Whether the browser positions elements with CSS anchor positioning. */
export function supportsAnchorPositioning() {
    if (anchorPositioningOverride !== null)
        return anchorPositioningOverride;
    return (typeof CSS !== 'undefined' &&
        !!CSS.supports?.('position-area: block-end span-inline-end'));
}
/** A Lit controller for surfaces anchored to another element. */
export class AnchoredOverlayController {
    constructor(host, options) {
        this.options = options;
        /** The invoker of the open surface, if known. */
        this.source = null;
        /** Why the surface last closed. */
        this.closeReason = null;
        /** The side of the anchor the surface is on (after JS positioning). */
        this.side = null;
        this.surface = null;
        this.surfaceAbort = null;
        this.openAbort = null;
        this.active = false;
        this.focusWasInside = false;
        this.returnTo = null;
        this.pending = null;
        this.point = null;
        this.appliedInline = false;
        this.frame = 0;
        host.addController(this);
    }
    /** Whether the surface is open. */
    get isOpen() {
        return !!this.surface?.matches(':popover-open');
    }
    hostConnected() {
        this.bind();
    }
    hostUpdated() {
        this.bind();
    }
    hostDisconnected() {
        this.surfaceAbort?.abort();
        this.surfaceAbort = null;
        this.surface = null;
        this.stopListening();
        this.active = false;
    }
    /**
     * Opens the surface.
     *
     * @param source The invoker, for focus return.
     * @return Whether it is open.
     */
    open(source) {
        this.bind();
        const surface = this.surface;
        if (!surface)
            return false;
        if (!surface.matches(':popover-open')) {
            try {
                surface.showPopover.call(surface, source ? { source } : undefined);
            }
            catch {
                // Not connected, or popover unsupported.
                return false;
            }
        }
        this.handleOpened(source ?? null);
        return this.isOpen;
    }
    /**
     * Opens the surface at a point in the viewport (a context menu): below and
     * after the point, flipping when there is no room.
     */
    openAt(x, y, source) {
        const surface = this.options.surface();
        if (!surface)
            return false;
        this.point = { x, y };
        // Start at the point, so the surface is sized as if it had room.
        this.takeOver(surface);
        surface.style.left = `${x}px`;
        surface.style.top = `${y}px`;
        const opened = this.open(source);
        if (opened) {
            this.reposition();
        }
        else {
            this.point = null;
        }
        return opened;
    }
    /**
     * Closes the surface.
     *
     * @param reason Why; recorded in {@link closeReason}.
     * @return Whether it closed (`beforeClose` may keep it open).
     */
    close(reason = 'method') {
        const surface = this.surface;
        if (!surface?.matches(':popover-open'))
            return true;
        if (this.options.beforeClose?.(reason) === false)
            return false;
        this.pending = { reason, time: Date.now() };
        this.captureFocus();
        try {
            surface.hidePopover();
        }
        catch {
            // Already hidden.
        }
        this.handleClosed();
        return true;
    }
    /** The anchor's bounding rect. */
    anchorRect() {
        return this.options.anchor?.()?.getBoundingClientRect();
    }
    /** Recomputes the JS position (scroll, resize, size change, anchor move). */
    reposition() {
        const surface = this.surface;
        if (!surface || !this.isOpen || !this.usesJs)
            return;
        const anchor = this.point
            ? {
                left: this.point.x,
                top: this.point.y,
                right: this.point.x,
                bottom: this.point.y,
            }
            : this.options.anchor?.()?.getBoundingClientRect();
        if (!anchor)
            return;
        const config = this.options.placement?.() ?? { placement: 'below' };
        const position = computeOverlayPosition({
            anchor,
            // Untransformed size: enter animations scale the surface.
            surface: { width: surface.offsetWidth, height: surface.offsetHeight },
            viewport: {
                width: document.documentElement.clientWidth || window.innerWidth,
                height: document.documentElement.clientHeight || window.innerHeight,
            },
            placement: config.placement,
            align: config.align,
            spacing: config.spacing,
            margin: config.margin,
            caretInset: config.caretInset,
            rtl: getComputedStyle(this.options.anchor?.() ?? surface).direction === 'rtl',
        });
        this.takeOver(surface);
        surface.style.left = `${position.x}px`;
        surface.style.top = `${position.y}px`;
        this.side = position.side;
        this.options.onPosition?.(position);
    }
    /** Takes the surface out of CSS anchor positioning. */
    takeOver(surface) {
        if (this.appliedInline)
            return;
        surface.style.position = 'fixed';
        surface.style.inset = 'auto';
        surface.style.margin = '0';
        // CSS offsets the surface with its block-start margin (a submenu lines its
        // first item up with the item that opened it). The margin is reset above,
        // so a surface publishes that offset as `--overlay-margin-block-start`
        // and the JS position applies it again.
        const offset = getComputedStyle(surface)
            .getPropertyValue('--overlay-margin-block-start')
            .trim();
        if (offset)
            surface.style.marginBlockStart = offset;
        surface.style.setProperty('position-area', 'none');
        surface.style.setProperty('position-try-fallbacks', 'none');
        this.appliedInline = true;
    }
    get usesJs() {
        return (this.point !== null ||
            this.options.positioning === 'js' ||
            !supportsAnchorPositioning());
    }
    /** Finds the surface and listens to its toggle events. */
    bind() {
        const surface = this.options.surface();
        if (surface === this.surface)
            return;
        this.surfaceAbort?.abort();
        this.surface = surface;
        if (!surface)
            return;
        if (!surface.hasAttribute('popover')) {
            surface.popover = this.options.popover ?? 'manual';
        }
        const abort = new AbortController();
        this.surfaceAbort = abort;
        const opts = { signal: abort.signal };
        surface.addEventListener('beforetoggle', (event) => {
            if (event.newState === 'closed')
                this.captureFocus();
        }, opts);
        surface.addEventListener('toggle', (event) => {
            // Toggle events of nested popovers do not bubble, but guard anyway.
            if (event.target !== surface)
                return;
            const toggle = event;
            // The surface may have changed state again since the event queued.
            if (surface.matches(':popover-open')) {
                this.handleOpened(toggle.source ?? null);
            }
            else {
                this.handleClosed();
            }
        }, opts);
        if (surface.matches(':popover-open'))
            this.handleOpened(null);
    }
    handleOpened(source) {
        if (this.active) {
            if (source && !this.source)
                this.source = source;
            return;
        }
        this.active = true;
        this.pending = null;
        this.closeReason = null;
        this.source = source;
        const inside = this.surface;
        const outside = deepActiveElement();
        this.returnTo = this.options.returnTarget
            ? this.options.returnTarget(source)
            : (source ??
                (outside instanceof HTMLElement &&
                    outside !== document.body &&
                    !composedContains(inside, outside)
                    ? outside
                    : null) ??
                this.options.anchor?.() ??
                null);
        this.listen();
        this.reposition();
        this.options.onOpen?.(source);
    }
    handleClosed() {
        if (!this.active)
            return;
        this.active = false;
        const surface = this.surface;
        this.stopListening();
        // A reason recorded just before the browser's own light dismiss closed
        // the surface (stale labels are ignored).
        const pending = this.pending;
        this.pending = null;
        const reason = pending && Date.now() - pending.time < 1000 ? pending.reason : 'native';
        this.closeReason = reason;
        if (this.appliedInline && surface && (this.point || !this.usesJs)) {
            for (const prop of ['position', 'inset', 'margin', 'margin-block-start', 'left', 'top']) {
                surface.style.removeProperty(prop);
            }
            surface.style.removeProperty('position-area');
            surface.style.removeProperty('position-try-fallbacks');
            this.appliedInline = false;
        }
        this.point = null;
        this.side = null;
        this.restoreFocusIfNeeded(reason);
        this.source = null;
        this.options.onClose?.(reason);
    }
    captureFocus() {
        const surface = this.surface;
        this.focusWasInside =
            !!surface && composedContains(surface, deepActiveElement());
    }
    restoreFocusIfNeeded(reason) {
        const target = this.returnTo;
        this.returnTo = null;
        const restore = this.options.restoreFocus ?? true;
        if (typeof restore === 'function' ? !restore(reason) : !restore)
            return;
        const wasInside = this.focusWasInside;
        this.focusWasInside = false;
        if (!wasInside || !target?.isConnected)
            return;
        // Return focus only if it is still inside the surface or was lost (not
        // when the user already moved it elsewhere).
        const active = deepActiveElement();
        if (!active ||
            active === document.body ||
            composedContains(this.surface, active)) {
            target.focus();
        }
    }
    /** The event came from the surface, its anchor or another inside region. */
    isInside(node) {
        if (!node)
            return false;
        return (composedContains(this.surface, node) ||
            composedContains(this.options.anchor?.() ?? null, node) ||
            !!this.options.contains?.(node));
    }
    listen() {
        this.stopListening();
        const abort = new AbortController();
        this.openAbort = abort;
        const dismiss = this.options.dismiss ?? {};
        const capture = { signal: abort.signal, capture: true };
        const native = () => this.surface?.getAttribute('popover') !== 'manual';
        const request = (reason) => {
            if (native()) {
                // The browser closes `auto` surfaces; remember why.
                this.pending = { reason, time: Date.now() };
            }
            else if (this.options.onDismiss) {
                this.options.onDismiss(reason);
            }
            else {
                this.close(reason);
            }
        };
        if (dismiss.escape !== false) {
            document.addEventListener('keydown', (event) => {
                if (event.key !== 'Escape' || !this.isOpen)
                    return;
                if (!native() &&
                    (this.isInside(event.composedPath()[0]) ||
                        this.isInside(deepActiveElement()))) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                request('escape');
            }, capture);
        }
        if (dismiss.outside !== false) {
            document.addEventListener('pointerdown', (event) => {
                if (!this.isOpen)
                    return;
                if (this.isInside(event.composedPath()[0]))
                    return;
                request('outside');
            }, capture);
        }
        if (dismiss.focusIn) {
            document.addEventListener('focusin', (event) => {
                if (!this.isOpen)
                    return;
                if (this.isInside(event.composedPath()[0]))
                    return;
                request('focus');
            }, capture);
        }
        if (dismiss.focusOut) {
            document.addEventListener('focusout', (event) => {
                if (!this.isOpen)
                    return;
                if (!this.isInside(event.composedPath()[0]))
                    return;
                const next = event.relatedTarget;
                if (this.isInside(next))
                    return;
                request('focus');
            }, capture);
        }
        if (this.usesJs) {
            const schedule = () => {
                cancelAnimationFrame(this.frame);
                this.frame = requestAnimationFrame(() => {
                    this.reposition();
                });
            };
            window.addEventListener('scroll', schedule, {
                ...capture,
                passive: true,
            });
            window.addEventListener('resize', schedule, capture);
            if (typeof ResizeObserver !== 'undefined' && this.surface) {
                this.resizeObserver ??= new ResizeObserver(schedule);
                this.resizeObserver.observe(this.surface);
            }
        }
    }
    stopListening() {
        this.openAbort?.abort();
        this.openAbort = null;
        this.resizeObserver?.disconnect();
        cancelAnimationFrame(this.frame);
    }
}
//# sourceMappingURL=anchored-overlay.js.map