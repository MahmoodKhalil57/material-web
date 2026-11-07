/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html, LitElement, render} from 'lit';

import {
  AnchoredOverlayController,
  type AnchoredOverlayOptions,
  composedContains,
  computeOverlayPosition,
  deepActiveElement,
  type OverlayPositionInput,
  supportsAnchorPositioning,
} from './anchored-overlay.js';

const VIEWPORT = {width: 800, height: 600};
const SURFACE = {width: 120, height: 60};

function rect(left: number, top: number, width = 80, height = 30) {
  return {left, top, right: left + width, bottom: top + height};
}

function position(input: Partial<OverlayPositionInput> = {}) {
  return computeOverlayPosition({
    anchor: rect(300, 300),
    surface: SURFACE,
    viewport: VIEWPORT,
    placement: 'below',
    ...input,
  });
}

describe('computeOverlayPosition()', () => {
  // spec: menus-eb894b
  it('opens below the anchor, centered, with the spacing between', () => {
    const p = position({spacing: 4});
    expect(p.side).toBe('below');
    expect(p.y).toBe(334);
    expect(p.x).toBe(300 + 40 - 60);
  });

  // spec: tooltips-f76779
  it('opens above the anchor when asked', () => {
    const p = position({placement: 'above', spacing: 4});
    expect(p.side).toBe('above');
    expect(p.y).toBe(300 - 4 - 60);
  });

  // spec: menus-74a090, menus-876f3e
  it('flips from below to above when there is no room below', () => {
    const p = position({anchor: rect(300, 560)});
    expect(p.side).toBe('above');
    expect(p.y + SURFACE.height).toBeLessThanOrEqual(560);
  });

  // spec: tooltips-345206
  it('flips from above to below when there is no room above', () => {
    const p = position({anchor: rect(300, 10), placement: 'above'});
    expect(p.side).toBe('below');
    expect(p.y).toBeGreaterThanOrEqual(40);
  });

  it('stays on the preferred side when neither side fits', () => {
    const tall = computeOverlayPosition({
      anchor: rect(300, 280),
      surface: {width: 100, height: 500},
      viewport: VIEWPORT,
      placement: 'below',
    });
    expect(tall.side).toBe('below');
    // Still clamped inside the window.
    expect(tall.y + 500).toBeLessThanOrEqual(VIEWPORT.height);
  });

  // spec: menus-09c5d3, tooltips-345206
  it('keeps the surface inside the window on both inline edges', () => {
    const left = position({anchor: rect(0, 300, 20, 20)});
    expect(left.x).toBeGreaterThanOrEqual(8);
    const right = position({anchor: rect(780, 300, 20, 20)});
    expect(right.x + SURFACE.width).toBeLessThanOrEqual(VIEWPORT.width - 8);
  });

  it('accepts a margin per window edge', () => {
    const p = position({
      anchor: rect(10, 590, 0, 0),
      margin: {inline: 8, blockStart: 0, blockEnd: 48},
      align: 'start',
      spacing: 0,
    });
    // No room below inside the 48px bottom margin: above the point, and kept
    // out of that margin.
    expect(p.side).toBe('above');
    expect(p.y).toBe(VIEWPORT.height - 48 - SURFACE.height);
  });

  // spec: tooltips-09c2d2
  it('aligns to the start edge and extends toward the end', () => {
    const p = position({align: 'start', anchor: rect(100, 100, 60, 20)});
    expect(p.x).toBe(100);
  });

  it('aligns to the start edge from the right in right-to-left', () => {
    const p = position({align: 'start', anchor: rect(300, 100, 60, 20), rtl: true});
    expect(p.x).toBe(360 - SURFACE.width);
  });

  it('end-aligns, then centers, when start-aligning does not fit', () => {
    const endAligned = position({align: 'start', anchor: rect(740, 100, 50, 20)});
    expect(endAligned.x).toBe(790 - SURFACE.width);
    const centered = computeOverlayPosition({
      anchor: rect(10, 100, 20, 20),
      surface: {width: 780, height: 20},
      viewport: VIEWPORT,
      placement: 'below',
      align: 'start',
    });
    expect(centered.x).toBeGreaterThanOrEqual(8);
    expect(centered.x + 780).toBeLessThanOrEqual(792);
  });

  // spec: menus-e183b4, menus-0817d4
  it('places a submenu beside its item without overlapping it', () => {
    const item = rect(300, 200, 200, 48);
    const p = position({anchor: item, placement: 'end', align: 'start', spacing: 0});
    expect(p.side).toBe('right');
    expect(p.x).toBe(item.right);
    expect(p.y).toBe(item.top);
  });

  // spec: menus-74a090
  it('flips a side placement to the other side when there is no room', () => {
    const item = rect(640, 200, 150, 48);
    const p = position({anchor: item, placement: 'end', align: 'start', spacing: 0});
    expect(p.side).toBe('left');
    expect(p.x + SURFACE.width).toBeLessThanOrEqual(item.left);
  });

  it('mirrors start and end in right-to-left', () => {
    const item = rect(300, 200, 100, 48);
    expect(position({anchor: item, placement: 'end', rtl: true}).side).toBe('left');
    expect(position({anchor: item, placement: 'start', rtl: true}).side).toBe('right');
    expect(position({anchor: item, placement: 'start'}).side).toBe('left');
  });

  it('centers a side placement on the anchor unless start-aligned', () => {
    const item = rect(300, 200, 100, 100);
    expect(position({anchor: item, placement: 'end'}).y).toBe(200 + 50 - 30);
    expect(position({anchor: item, placement: 'end', align: 'start'}).y).toBe(200);
  });

  it('keeps the caret over the anchor, inside the surface corners', () => {
    const centered = position({anchor: rect(340, 300, 40, 20), caretInset: 12});
    expect(centered.caretOffset).toBe(60);
    const nearEdge = position({anchor: rect(0, 300, 10, 20), caretInset: 12});
    expect(nearEdge.caretOffset).toBe(12);
    const sideways = position({
      anchor: rect(300, 300, 20, 20),
      placement: 'end',
    });
    expect(sideways.caretOffset).toBe(30);
  });
});

describe('composedContains() and deepActiveElement()', () => {
  it('sees through shadow roots', () => {
    const host = document.createElement('div');
    const shadow = host.attachShadow({mode: 'open'});
    const input = document.createElement('input');
    shadow.append(input);
    document.body.append(host);
    expect(composedContains(host, input)).toBeTrue();
    expect(composedContains(input, host)).toBeFalse();
    input.focus();
    expect(deepActiveElement()).toBe(input);
    host.remove();
  });

  it('is false for unrelated or missing nodes', () => {
    expect(composedContains(null, document.body)).toBeFalse();
    expect(composedContains(document.body, null)).toBeFalse();
  });
});

class OverlayTestHost extends LitElement {
  protected override createRenderRoot() {
    return this;
  }
  protected override render() {
    return html``;
  }
}
customElements.define('overlay-test-host', OverlayTestHost);

interface Fixture {
  host: OverlayTestHost;
  overlay: AnchoredOverlayController;
  anchor: HTMLElement;
  surface: HTMLElement;
  inner: HTMLElement;
  outside: HTMLElement;
  log: string[];
}

let container: HTMLElement | undefined;

async function frame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Mounts a surface (with a button inside) next to an anchor, controlled by an
 * AnchoredOverlayController with the given options.
 */
async function mountOverlay(
  options: Partial<AnchoredOverlayOptions> = {},
  opts: {
    popover?: string;
    anchorStyle?: string;
    dir?: string;
    extra?: boolean;
  } = {},
): Promise<Fixture> {
  container?.remove();
  container = document.createElement('div');
  if (opts.dir) container.dir = opts.dir;
  document.body.append(container);
  render(
    html`
      <overlay-test-host>
        <button id="before">Before</button>
        <button
          id="anchor"
          style="position: fixed; left: 300px; top: 200px; width: 80px; height: 30px; ${opts.anchorStyle ??
          ''}">
          Anchor
        </button>
        <div
          id="surface"
          popover=${opts.popover ?? ''}
          style="position: fixed; box-sizing: border-box; width: 120px; height: 60px; margin: 0; padding: 0; border: 0; overflow: visible; background: white;">
          <button id="inner">Inner</button>
        </div>
        <button
          id="outside"
          style="position: fixed; left: 600px; top: 500px; width: 80px; height: 30px;">
          Outside
        </button>
      </overlay-test-host>
    `,
    container,
  );
  const host = container.querySelector('overlay-test-host') as OverlayTestHost;
  const anchor = container.querySelector<HTMLElement>('#anchor')!;
  const surface = container.querySelector<HTMLElement>('#surface')!;
  if (!opts.popover) surface.removeAttribute('popover');
  const log: string[] = [];
  const overlay = new AnchoredOverlayController(host, {
    surface: () => surface,
    anchor: () => anchor,
    onOpen: (source) => {
      log.push(`open:${source?.id ?? ''}`);
    },
    onClose: (reason) => {
      log.push(`close:${reason}`);
    },
    ...options,
  });
  await host.updateComplete;
  await frame();
  return {
    host,
    overlay,
    anchor,
    surface,
    inner: container.querySelector<HTMLElement>('#inner')!,
    outside: container.querySelector<HTMLElement>('#outside')!,
    log,
  };
}

async function press(key: string) {
  await sendKeys({press: key});
  await frame();
}

async function clickOn(el: Element) {
  const r = el.getBoundingClientRect();
  await sendMouse({
    type: 'click',
    position: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)],
  });
  await frame();
}

describe('AnchoredOverlayController', () => {
  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  describe('popover', () => {
    // spec: menus-0cd562, menus-27ace3
    it('shows the surface as a popover in the top layer', async () => {
      const f = await mountOverlay();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.open()).toBeTrue();
      expect(f.overlay.isOpen).toBeTrue();
      expect(f.surface.matches(':popover-open')).toBeTrue();
    });

    it('gives a surface without one the manual popover mode', async () => {
      const f = await mountOverlay();
      expect(f.surface.getAttribute('popover')).toBe('manual');
    });

    it('gives it the requested mode, and keeps the one it has', async () => {
      const auto = await mountOverlay({popover: 'auto'});
      expect(auto.surface.getAttribute('popover')).toBe('auto');
      const own = await mountOverlay({popover: 'auto'}, {popover: 'manual'});
      expect(own.surface.getAttribute('popover')).toBe('manual');
    });

    it('closes the surface', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      expect(f.overlay.close()).toBeTrue();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.surface.matches(':popover-open')).toBeFalse();
    });

    it('does nothing when closing a closed surface or opening an open one', async () => {
      const f = await mountOverlay();
      expect(f.overlay.close()).toBeTrue();
      f.overlay.open();
      f.overlay.open();
      expect(f.log).toEqual(['open:']);
    });

    it('reports opening and closing once, with the invoker as source', async () => {
      const f = await mountOverlay();
      f.overlay.open(f.anchor);
      expect(f.overlay.source).toBe(f.anchor);
      f.overlay.close('method');
      await frame();
      expect(f.log).toEqual(['open:anchor', 'close:method']);
      expect(f.overlay.closeReason).toBe('method');
      expect(f.overlay.source).toBeNull();
    });

    it('follows a surface the browser opens and closes', async () => {
      const f = await mountOverlay({popover: 'auto'});
      f.surface.showPopover();
      await frame();
      expect(f.log).toEqual(['open:']);
      f.surface.hidePopover();
      await frame();
      expect(f.log).toEqual(['open:', 'close:native']);
    });

    it('takes its source from a popovertarget invoker', async () => {
      const f = await mountOverlay({popover: 'auto'});
      const button = document.createElement('button');
      button.id = 'invoker';
      f.surface.id = 'surface';
      button.setAttribute('popovertarget', 'surface');
      container!.append(button);
      button.click();
      await frame();
      expect(f.overlay.isOpen).toBeTrue();
      expect(f.log[0]).toBe('open:invoker');
    });

    it('may be kept open by beforeClose', async () => {
      const reasons: string[] = [];
      const f = await mountOverlay({
        beforeClose: (reason) => {
          reasons.push(reason);
          return reasons.length > 1;
        },
      });
      f.overlay.open();
      expect(f.overlay.close('method')).toBeFalse();
      expect(f.overlay.isOpen).toBeTrue();
      expect(f.overlay.close('method')).toBeTrue();
      expect(f.overlay.isOpen).toBeFalse();
      expect(reasons).toEqual(['method', 'method']);
    });

    it('does not reopen when closed again before the toggle event', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.overlay.close();
      await frame();
      await frame();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.log).toEqual(['open:', 'close:method']);
    });

    it('can be shown again after closing', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.overlay.close('escape');
      f.overlay.open();
      expect(f.overlay.isOpen).toBeTrue();
      expect(f.overlay.closeReason).toBeNull();
      f.overlay.close();
      expect(f.overlay.closeReason).toBe('method');
    });

    it('does not open a disconnected surface', async () => {
      const f = await mountOverlay();
      f.surface.remove();
      expect(f.overlay.open()).toBeFalse();
    });

    it('stops reacting when the host disconnects', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.host.remove();
      await press('Escape');
      expect(f.log).toEqual(['open:']);
    });

    it('follows a surface that is replaced', async () => {
      let surface: HTMLElement | null = null;
      const f = await mountOverlay({surface: () => surface});
      expect(f.overlay.open()).toBeFalse();
      surface = f.surface;
      f.host.requestUpdate();
      await f.host.updateComplete;
      expect(f.overlay.open()).toBeTrue();
    });
  });

  describe('Escape', () => {
    // spec: menus-235f42, menus-8ed4c3, menus-509021
    it('closes the surface with the reason escape', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      await press('Escape');
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('escape');
      expect(f.log).toEqual(['open:', 'close:escape']);
    });

    it('closes it wherever focus is', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.outside.focus();
      await press('Escape');
      expect(f.overlay.isOpen).toBeFalse();
    });

    it('consumes the key when focus is inside, so outer handlers do not see it', async () => {
      const f = await mountOverlay();
      let seen = false;
      document.body.addEventListener('keydown', () => {
        seen = true;
      }, {once: true});
      f.overlay.open();
      f.inner.focus();
      await press('Escape');
      expect(seen).toBeFalse();
    });

    it('leaves the key to others when focus is elsewhere', async () => {
      const f = await mountOverlay();
      let prevented: boolean | null = null;
      const check = (e: KeyboardEvent) => {
        prevented = e.defaultPrevented;
      };
      document.body.addEventListener('keydown', check, {once: true});
      f.overlay.open();
      f.outside.focus();
      await press('Escape');
      expect(prevented).toBe(false);
    });

    it('is ignored when escape dismissal is off', async () => {
      const f = await mountOverlay({dismiss: {escape: false}});
      f.overlay.open();
      await press('Escape');
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('is ignored for other keys and when the surface is closed', async () => {
      const f = await mountOverlay();
      await press('Escape');
      expect(f.log).toEqual([]);
      f.overlay.open();
      await press('Enter');
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('lets a component decide through onDismiss', async () => {
      const reasons: string[] = [];
      const f = await mountOverlay({
        onDismiss: (reason) => {
          reasons.push(reason);
        },
      });
      f.overlay.open();
      await press('Escape');
      expect(reasons).toEqual(['escape']);
      expect(f.overlay.isOpen).toBeTrue();
      f.overlay.close('escape');
      expect(f.overlay.isOpen).toBeFalse();
    });

    // spec: menus-235f42
    it('is labelled when the browser closes an auto popover', async () => {
      const f = await mountOverlay({popover: 'auto'});
      f.overlay.open();
      f.inner.focus();
      await press('Escape');
      await frame();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('escape');
    });
  });

  describe('press outside', () => {
    // spec: menus-509021
    it('closes the surface with the reason outside', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      await clickOn(f.outside);
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('outside');
    });

    it('does not close it for a press inside the surface or on the anchor', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      await clickOn(f.inner);
      expect(f.overlay.isOpen).toBeTrue();
      await clickOn(f.anchor);
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('treats the elements that contains() accepts as inside', async () => {
      const f = await mountOverlay({
        contains: (node) => composedContains(container!.querySelector('#outside'), node),
      });
      f.overlay.open();
      await clickOn(f.outside);
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('is ignored when outside dismissal is off', async () => {
      const f = await mountOverlay({dismiss: {outside: false}});
      f.overlay.open();
      await clickOn(f.outside);
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('is labelled when the browser closes an auto popover', async () => {
      const f = await mountOverlay({popover: 'auto'});
      f.overlay.open();
      await clickOn(f.outside);
      await frame();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('outside');
    });

    it('stops listening once closed', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.overlay.close();
      await clickOn(f.outside);
      expect(f.log).toEqual(['open:', 'close:method']);
    });

    it('labels a close nobody asked for as native', async () => {
      const f = await mountOverlay({popover: 'auto'});
      f.overlay.open();
      f.surface.hidePopover();
      await frame();
      expect(f.overlay.closeReason).toBe('native');
    });
  });

  describe('focus', () => {
    it('closes when focus moves to an element outside (focusIn)', async () => {
      const f = await mountOverlay({dismiss: {focusIn: true}});
      f.overlay.open();
      f.inner.focus();
      expect(f.overlay.isOpen).toBeTrue();
      f.anchor.focus();
      expect(f.overlay.isOpen).toBeTrue();
      f.outside.focus();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('focus');
    });

    it('ignores focus moving outside by default', async () => {
      const f = await mountOverlay();
      f.overlay.open();
      f.outside.focus();
      expect(f.overlay.isOpen).toBeTrue();
    });

    it('closes when focus leaves the surface and anchor (focusOut)', async () => {
      const f = await mountOverlay({dismiss: {focusOut: true}});
      f.overlay.open();
      f.inner.focus();
      f.anchor.focus();
      expect(f.overlay.isOpen).toBeTrue();
      f.outside.focus();
      expect(f.overlay.isOpen).toBeFalse();
      expect(f.overlay.closeReason).toBe('focus');
    });

    it('closes when focus leaves to nothing (focusOut)', async () => {
      const f = await mountOverlay({dismiss: {focusOut: true, outside: false}});
      f.overlay.open();
      f.inner.focus();
      f.inner.blur();
      expect(f.overlay.isOpen).toBeFalse();
    });
  });

  describe('focus return', () => {
    // spec: menus-e50135
    it('returns focus to the invoker when it was inside the surface', async () => {
      const f = await mountOverlay();
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      await press('Escape');
      expect(document.activeElement).toBe(f.anchor);
    });

    it('returns to the element that had focus when no invoker is known', async () => {
      const f = await mountOverlay({anchor: () => null});
      const before = container!.querySelector<HTMLElement>('#before')!;
      before.focus();
      f.overlay.open();
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement).toBe(before);
    });

    it('falls back to the anchor', async () => {
      const f = await mountOverlay();
      document.body.focus();
      f.overlay.open();
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement).toBe(f.anchor);
    });

    it('does not move focus that was never inside', async () => {
      const f = await mountOverlay();
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.outside.focus();
      f.overlay.close('method');
      expect(document.activeElement).toBe(f.outside);
    });

    it('does not steal focus the user moved elsewhere', async () => {
      const f = await mountOverlay({dismiss: {outside: false}});
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      await clickOn(f.outside);
      f.overlay.close('method');
      expect(document.activeElement).toBe(f.outside);
    });

    it('restores focus after an auto popover is closed by the browser', async () => {
      const f = await mountOverlay({popover: 'auto'});
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      await press('Escape');
      await frame();
      expect(document.activeElement).toBe(f.anchor);
    });

    it('can be turned off', async () => {
      const f = await mountOverlay({restoreFocus: false});
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement).not.toBe(f.anchor);
    });

    it('can depend on the close reason', async () => {
      const f = await mountOverlay({
        restoreFocus: (reason) => reason === 'escape',
      });
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement).not.toBe(f.anchor);
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      await press('Escape');
      expect(document.activeElement).toBe(f.anchor);
    });

    it('can return to a chosen element', async () => {
      const f = await mountOverlay({
        returnTarget: () => container!.querySelector<HTMLElement>('#before'),
      });
      f.overlay.open(f.anchor);
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement?.id).toBe('before');
    });

    it('returns nowhere when the chosen element is gone or none is chosen', async () => {
      const f = await mountOverlay({returnTarget: () => null});
      f.anchor.focus();
      f.overlay.open(f.anchor);
      f.inner.focus();
      f.overlay.close('method');
      expect(document.activeElement).not.toBe(f.anchor);
    });

    it('returns focus from inside a shadow root', async () => {
      const f = await mountOverlay();
      const shadow = f.surface.attachShadow({mode: 'open'});
      const button = document.createElement('button');
      shadow.append(button);
      f.anchor.focus();
      f.overlay.open(f.anchor);
      button.focus();
      expect(deepActiveElement()).toBe(button);
      f.overlay.close('method');
      expect(document.activeElement).toBe(f.anchor);
    });
  });

  describe('JS positioning', () => {
    function placement(extra: Record<string, unknown> = {}) {
      return {
        positioning: 'js' as const,
        placement: () => ({placement: 'below' as const, spacing: 4, ...extra}),
      };
    }

    // spec: menus-eb894b
    it('places the surface below the anchor', async () => {
      const f = await mountOverlay(placement());
      f.overlay.open();
      const a = f.anchor.getBoundingClientRect();
      const s = f.surface.getBoundingClientRect();
      expect(s.top).toBe(a.bottom + 4);
      expect(s.left).toBe(a.left + a.width / 2 - s.width / 2);
      expect(f.overlay.side).toBe('below');
    });

    // spec: menus-74a090
    it('flips above when there is no room below', async () => {
      const f = await mountOverlay(placement(), {
        anchorStyle: 'top: 560px;',
      });
      f.overlay.open();
      const a = f.anchor.getBoundingClientRect();
      const s = f.surface.getBoundingClientRect();
      expect(s.bottom).toBe(a.top - 4);
      expect(f.overlay.side).toBe('above');
    });

    // spec: tooltips-345206
    it('keeps the surface inside the window', async () => {
      const f = await mountOverlay(placement(), {
        anchorStyle: 'left: 2px; top: 560px;',
      });
      f.overlay.open();
      const s = f.surface.getBoundingClientRect();
      expect(s.left).toBeGreaterThanOrEqual(8);
      expect(s.top).toBeGreaterThanOrEqual(8);
    });

    it('reports the position, for carets', async () => {
      const seen: string[] = [];
      const f = await mountOverlay({
        ...placement(),
        onPosition: (p) => {
          seen.push(`${p.side}:${Math.round(p.x)}`);
        },
      });
      f.overlay.open();
      expect(seen.length).toBeGreaterThan(0);
      expect(seen[0].startsWith('below:')).toBeTrue();
    });

    it('follows the anchor on resize and scroll', async () => {
      const f = await mountOverlay(placement());
      f.overlay.open();
      f.anchor.style.top = '100px';
      window.dispatchEvent(new Event('resize'));
      await frame();
      await frame();
      expect(f.surface.getBoundingClientRect().top).toBe(100 + 30 + 4);
      f.anchor.style.top = '150px';
      window.dispatchEvent(new Event('scroll'));
      await frame();
      await frame();
      expect(f.surface.getBoundingClientRect().top).toBe(150 + 30 + 4);
    });

    it('repositions on demand', async () => {
      const f = await mountOverlay(placement());
      f.overlay.open();
      f.anchor.style.left = '100px';
      f.overlay.reposition();
      const a = f.anchor.getBoundingClientRect();
      expect(f.surface.getBoundingClientRect().left).toBe(a.left + 40 - 60);
    });

    it('mirrors start-aligned placement in right-to-left', async () => {
      const f = await mountOverlay(placement({align: 'start'}), {dir: 'rtl'});
      f.overlay.open();
      const a = f.anchor.getBoundingClientRect();
      const s = f.surface.getBoundingClientRect();
      expect(s.right).toBe(a.right);
    });

    it('does nothing while closed', async () => {
      const f = await mountOverlay(placement());
      f.overlay.reposition();
      expect(f.surface.style.left).toBe('');
    });

    it('has the page place the surface when CSS anchor positioning works', async () => {
      const f = await mountOverlay({
        placement: () => ({placement: 'below', spacing: 4}),
      });
      f.overlay.open();
      if (supportsAnchorPositioning()) {
        expect(f.surface.style.left).toBe('');
        expect(f.surface.style.top).toBe('');
      } else {
        expect(f.surface.style.left).not.toBe('');
      }
    });

    it('reports whether the browser has CSS anchor positioning', () => {
      expect(typeof supportsAnchorPositioning()).toBe('boolean');
    });

    // spec: menus-72492c
    it('opens at a point, below and after it', async () => {
      const f = await mountOverlay({
        placement: () => ({
          placement: 'below',
          align: 'start',
          spacing: 0,
          margin: {inline: 8, blockStart: 0, blockEnd: 48},
        }),
      });
      f.overlay.openAt(120, 80);
      const s = f.surface.getBoundingClientRect();
      expect(s.left).toBe(120);
      expect(s.top).toBe(80);
      expect(f.overlay.isOpen).toBeTrue();
    });

    // spec: menus-74a090
    it('flips a point menu when there is no room', async () => {
      const f = await mountOverlay({
        placement: () => ({
          placement: 'below',
          align: 'start',
          spacing: 0,
          margin: {inline: 8, blockStart: 0, blockEnd: 48},
        }),
      });
      f.overlay.openAt(790, 590);
      const s = f.surface.getBoundingClientRect();
      expect(s.right).toBe(790);
      // Above the point, kept out of the 48px bottom margin.
      expect(s.bottom).toBe(600 - 48);
    });

    it('moves an open point menu to a new point', async () => {
      const f = await mountOverlay({
        placement: () => ({placement: 'below', align: 'start', spacing: 0}),
      });
      f.overlay.openAt(100, 100);
      f.overlay.openAt(300, 250);
      const s = f.surface.getBoundingClientRect();
      expect(s.left).toBe(300);
      expect(s.top).toBe(250);
    });

    it('gives the page back the surface when a point menu closes', async () => {
      const f = await mountOverlay({
        placement: () => ({placement: 'below', align: 'start', spacing: 0}),
      });
      f.overlay.openAt(100, 100);
      f.overlay.close();
      expect(f.surface.style.left).toBe('');
      expect(f.surface.style.top).toBe('');
      expect(f.surface.style.position).toBe('');
    });

    it('does not open a point menu without a surface', async () => {
      const f = await mountOverlay({surface: () => null});
      expect(f.overlay.openAt(1, 1)).toBeFalse();
    });
  });
});
