/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia} from '@web/test-runner-commands';
import {html, LitElement} from 'lit';

import {
  DragSettleController,
  type DragSettleInfo,
  type DragSettleOptions,
  nearestAnchor,
  resolveSettle,
} from './drag-settle.js';

function last<T>(items: T[]): T {
  return items[items.length - 1];
}

describe('nearestAnchor()', () => {
  it('picks the closest anchor, the first on a tie, NaN without anchors', () => {
    expect(nearestAnchor([0, 100, 300], 140)).toBe(100);
    expect(nearestAnchor([0, 100, 300], 250)).toBe(300);
    expect(nearestAnchor([100, 0], 50)).toBe(100);
    expect(nearestAnchor([], 5)).toBeNaN();
  });
});

describe('resolveSettle()', () => {
  const options = {velocityThreshold: 400};

  it('returns to the start anchor before the positional threshold and moves on past it', () => {
    expect(resolveSettle([0, 100], 0, 49, 0, options)).toBe(0);
    expect(resolveSettle([0, 100], 0, 51, 0, options)).toBe(100);
    expect(resolveSettle([0, 100], 100, 60, 0, options)).toBe(100);
    expect(resolveSettle([0, 100], 100, 40, 0, options)).toBe(0);
  });

  it('follows a fling faster than the velocity threshold, however short the drag', () => {
    expect(resolveSettle([0, 100], 0, 5, 500, options)).toBe(100);
    expect(resolveSettle([0, 100], 100, 95, -500, options)).toBe(0);
    expect(resolveSettle([0, 100], 0, 5, 300, options)).toBe(0);
  });

  it('flings to the next anchor from where it was released, not from the start', () => {
    expect(resolveSettle([0, 100, 200], 0, 120, 500, options)).toBe(200);
    expect(resolveSettle([0, 100, 200], 0, 90, 500, options)).toBe(100);
  });

  it('keeps going over several anchors on a slow drag', () => {
    expect(resolveSettle([-400, -80, 0, 80], 0, -300, 0, options)).toBe(-400);
    expect(resolveSettle([-400, -80, 0, 80], 0, -200, 0, options)).toBe(-80);
    expect(resolveSettle([-400, -80, 0, 80], 0, -50, 0, options)).toBe(-80);
    expect(resolveSettle([-400, -80, 0, 80], 0, -30, 0, options)).toBe(0);
  });

  it('limits where a fling can land with flingAnchors', () => {
    const flingAnchors = (all: number[]) => all.filter((a) => a > -400);
    const opts = {...options, flingAnchors};
    expect(resolveSettle([-400, -80, 0, 80], 0, -200, -500, opts)).toBe(-80);
    expect(resolveSettle([-400, -80, 0, 80], 0, -30, -500, opts)).toBe(-80);
    // A slow drag still reaches it, and a fling released beyond the
    // flingable anchors is decided by the drag alone.
    expect(resolveSettle([-400, -80, 0, 80], 0, -300, 0, opts)).toBe(-400);
    expect(resolveSettle([-400, -80, 0, 80], 0, -300, -500, opts)).toBe(-400);
    expect(resolveSettle([-400, -80, 0, 80], 0, -150, -500, opts)).toBe(-80);
  });

  it('snaps a start that is between anchors to its nearest anchor first', () => {
    expect(resolveSettle([0, 360, 412], 300, 330, 0, options)).toBe(360);
    expect(resolveSettle([0, 360, 412], 300, 390, 0, options)).toBe(412);
  });

  it('uses a custom positional threshold', () => {
    const opts = {...options, positionalThreshold: (d: number) => Math.min(56, d / 2)};
    expect(resolveSettle([0, 400], 0, 57, 0, opts)).toBe(400);
    expect(resolveSettle([0, 400], 0, 55, 0, opts)).toBe(0);
  });

  it('settles on the release position without anchors', () => {
    expect(resolveSettle([], 0, 42, 0, options)).toBe(42);
  });

  it('ignores duplicate anchors and any order', () => {
    expect(resolveSettle([100, 0, 100, 0], 0, 60, 0, options)).toBe(100);
  });
});

/** Dispatches a pointer event with a given `timeStamp` (ms). */
function pointer(type: string, target: EventTarget, x: number, y: number, time: number, id = 1) {
  const event = new PointerEvent(type, {
    bubbles: true,
    composed: true,
    cancelable: true,
    pointerId: id,
    pointerType: 'touch',
    isPrimary: true,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'timeStamp', {value: time});
  target.dispatchEvent(event);
}

class TestSurface extends LitElement {
  options!: Partial<DragSettleOptions>;
  value = 0;
  anchors = [0, 100, 200];
  settles: Array<[number, DragSettleInfo]> = [];
  drags: number[] = [];
  starts: number[] = [];
  cancels: number[] = [];
  settled: number[] = [];
  controller!: DragSettleController;

  override connectedCallback() {
    this.controller ??= new DragSettleController(this, {
      axis: 'x',
      target: () => this.renderRoot.querySelector<HTMLElement>('#surface'),
      anchors: () => this.anchors,
      value: () => this.value,
      velocityThreshold: 400,
      onDragStart: (from) => this.starts.push(from),
      onDrag: (offset) => this.drags.push(offset),
      onSettle: (anchor, info) => {
        this.value = anchor;
        this.settles.push([anchor, info]);
      },
      onCancel: (to) => this.cancels.push(to),
      onSettled: (anchor) => this.settled.push(anchor),
      ...this.options,
    });
    super.connectedCallback();
  }

  protected override render() {
    return html`<div id="surface" style="width: 200px; height: 40px; touch-action: pan-y"></div>`;
  }
}
customElements.define('test-drag-surface', TestSurface);

let container: HTMLElement | undefined;

async function setup(options: Partial<DragSettleOptions> = {}, init: Partial<TestSurface> = {}, dir = 'ltr') {
  container?.remove();
  container = document.createElement('div');
  container.dir = dir;
  document.body.append(container);
  const host = document.createElement('test-drag-surface') as TestSurface;
  host.options = options;
  Object.assign(host, init);
  container.append(host);
  await host.updateComplete;
  const surface = host.shadowRoot!.querySelector<HTMLElement>('#surface')!;
  return {host, surface};
}

/** Presses, moves in steps (10ms apart) and optionally releases. */
function drag(surface: HTMLElement, dx: number, {release = true, ms = 10, steps = 4, dy = 0} = {}) {
  pointer('pointerdown', surface, 100, 20, 0);
  for (let i = 1; i <= steps; i++) {
    pointer('pointermove', surface, 100 + (dx * i) / steps, 20 + (dy * i) / steps, ms * i);
  }
  if (release) pointer('pointerup', surface, 100 + dx, 20 + dy, ms * steps);
}

afterEach(async () => {
  container?.remove();
  await emulateMedia({reducedMotion: 'no-preference'});
});

describe('DragSettleController', () => {
  describe('dragging', () => {
    it('follows the pointer once past the slop, and reports where the drag started', async () => {
      const {host, surface} = await setup();
      drag(surface, 60, {release: false});
      expect(host.controller.dragging).toBeTrue();
      expect(host.starts).toEqual([0]);
      expect(last(host.drags)).toBe(60);
      expect(host.controller.offset).toBe(60);
    });

    it('starts from the current settled position', async () => {
      const {host, surface} = await setup({}, {value: 100});
      drag(surface, 30, {release: false});
      expect(host.starts).toEqual([100]);
      expect(last(host.drags)).toBe(130);
    });

    it('does not drag below the slop, and a tap still clicks', async () => {
      const {host, surface} = await setup();
      const click = jasmine.createSpy('click');
      surface.addEventListener('click', click);
      pointer('pointerdown', surface, 100, 20, 0);
      pointer('pointermove', surface, 104, 20, 10);
      pointer('pointerup', surface, 104, 20, 20);
      surface.click();
      expect(host.controller.dragging).toBeFalse();
      expect(host.settles.length).toBe(0);
      expect(click).toHaveBeenCalledTimes(1);
    });

    it('clamps to the first and last anchor, or to custom bounds', async () => {
      const {host, surface} = await setup();
      drag(surface, 500, {release: false});
      expect(last(host.drags)).toBe(200);
      pointer('pointerup', surface, 600, 20, 100);
      const second = await setup({bounds: () => ({min: -50, max: 300})});
      drag(second.surface, -500, {release: false});
      expect(last(second.host.drags)).toBe(-50);
    });

    it('gives a vertical drag up on a horizontal surface', async () => {
      const {host, surface} = await setup();
      drag(surface, 5, {dy: 60});
      expect(host.starts.length).toBe(0);
      expect(host.settles.length).toBe(0);
    });

    it('drags along the y axis', async () => {
      const {host, surface} = await setup({axis: 'y'});
      pointer('pointerdown', surface, 100, 20, 0);
      pointer('pointermove', surface, 100, 60, 10);
      pointer('pointermove', surface, 100, 90, 20);
      expect(last(host.drags)).toBe(70);
    });

    it('can drop the slop from the travel', async () => {
      const {host, surface} = await setup({consumeSlop: true});
      pointer('pointerdown', surface, 100, 20, 0);
      pointer('pointermove', surface, 110, 20, 10);
      expect(last(host.drags)).toBe(2);
      pointer('pointermove', surface, 150, 20, 20);
      expect(last(host.drags)).toBe(42);
    });

    it('keeps the travel up to the slop by default', async () => {
      const {host, surface} = await setup();
      pointer('pointerdown', surface, 100, 20, 0);
      pointer('pointermove', surface, 110, 20, 10);
      expect(last(host.drags)).toBe(10);
    });

    it('suppresses the click that ends a drag', async () => {
      const {surface} = await setup();
      const click = jasmine.createSpy('click');
      surface.addEventListener('click', click);
      drag(surface, 60);
      surface.click();
      expect(click).not.toHaveBeenCalled();
    });

    it('ignores a press that canStart rejects, and a disabled controller', async () => {
      let allowed = false;
      const {host, surface} = await setup({canStart: () => allowed});
      drag(surface, 60);
      expect(host.starts.length).toBe(0);
      allowed = true;
      drag(surface, 60);
      expect(host.starts.length).toBe(1);

      const off = await setup({disabled: () => true});
      drag(off.surface, 60);
      expect(off.host.starts.length).toBe(0);
    });
  });

  describe('settling', () => {
    it('settles at the next anchor past the half-way point, else returns', async () => {
      const {host, surface} = await setup();
      drag(surface, 40, {ms: 100});
      expect(last(host.settles)![0]).toBe(0);
      drag(surface, 60, {ms: 100});
      expect(last(host.settles)![0]).toBe(100);
    });

    it('settles at the next anchor on a fling', async () => {
      const {host, surface} = await setup();
      drag(surface, 20, {ms: 5, steps: 2});
      const [anchor, info] = last(host.settles)!;
      expect(anchor).toBe(100);
      expect(info.source).toBe('drag');
      expect(info.from).toBe(0);
      expect(info.offset).toBe(20);
      expect(info.velocity).toBeGreaterThan(400);
    });

    it('flings back toward the previous anchor', async () => {
      const {host, surface} = await setup({}, {value: 100});
      drag(surface, -20, {ms: 5, steps: 2});
      expect(last(host.settles)![0]).toBe(0);
    });

    it('uses its thresholds', async () => {
      const {host, surface} = await setup({
        positionalThreshold: (d) => d * 0.1,
        velocityThreshold: Infinity,
      });
      drag(surface, 15, {ms: 5, steps: 2});
      expect(last(host.settles)![0]).toBe(100);
    });

    it('limits flings to flingAnchors', async () => {
      const {host, surface} = await setup({flingAnchors: (a) => a.filter((x) => x <= 100)}, {value: 100});
      drag(surface, 20, {ms: 5, steps: 2});
      expect(last(host.settles)![0]).toBe(100);
    });

    it('reports the drag as ended before it settles', async () => {
      const {host, surface} = await setup();
      drag(surface, 60);
      expect(host.controller.dragging).toBeFalse();
    });
  });

  describe('right-to-left', () => {
    // spec: layout-bidirectionality-rtl-822768
    it('mirrors the drag: toward the inline end is positive in both directions', async () => {
      const ltr = await setup({}, {}, 'ltr');
      drag(ltr.surface, 60, {release: false});
      expect(last(ltr.host.drags)).toBe(60);

      const rtl = await setup({}, {}, 'rtl');
      drag(rtl.surface, -60, {release: false});
      expect(last(rtl.host.drags)).toBe(60);
      pointer('pointerup', rtl.surface, 40, 20, 100);
      expect(last(rtl.host.settles)![0]).toBe(100);
    });

    it('mirrors the fling velocity', async () => {
      const rtl = await setup({}, {value: 100}, 'rtl');
      drag(rtl.surface, 20, {ms: 5, steps: 2});
      const [anchor, info] = last(rtl.host.settles)!;
      expect(anchor).toBe(0);
      expect(info.velocity).toBeLessThan(-400);
    });

    it('does not mirror a y drag', async () => {
      const rtl = await setup({axis: 'y'}, {}, 'rtl');
      pointer('pointerdown', rtl.surface, 100, 20, 0);
      pointer('pointermove', rtl.surface, 100, 70, 10);
      expect(last(rtl.host.drags)).toBe(50);
    });

    it('can be reversed explicitly', async () => {
      const {host, surface} = await setup({reverse: () => true});
      drag(surface, -60, {release: false});
      expect(last(host.drags)).toBe(60);
    });
  });

  describe('cancel', () => {
    // spec: interaction-gestures-94b35c
    it('returns to the start on pointercancel without settling', async () => {
      const {host, surface} = await setup({}, {value: 100});
      drag(surface, 60, {release: false});
      pointer('pointercancel', surface, 160, 20, 100);
      expect(host.controller.dragging).toBeFalse();
      expect(host.cancels).toEqual([100]);
      expect(host.settles.length).toBe(0);
      expect(host.controller.offset).toBe(100);
    });

    it('cancels with cancel() and when the host disconnects', async () => {
      const {host, surface} = await setup();
      drag(surface, 60, {release: false});
      host.controller.cancel();
      expect(host.cancels).toEqual([0]);

      drag(surface, 60, {release: false});
      host.remove();
      expect(host.cancels).toEqual([0, 0]);
      expect(host.settles.length).toBe(0);
    });

    it('does not report a cancel for a press that never became a drag', async () => {
      const {host, surface} = await setup();
      pointer('pointerdown', surface, 100, 20, 0);
      pointer('pointercancel', surface, 100, 20, 10);
      expect(host.cancels.length).toBe(0);
    });
  });

  describe('single-pointer alternative', () => {
    // spec: lists-b2bf5a, layout-scaffold-1e0240
    it('steps to the next and previous anchor like a release would', async () => {
      const {host} = await setup();
      expect(host.controller.step(1)).toBeTrue();
      expect(last(host.settles)![0]).toBe(100);
      expect(last(host.settles)![1].source).toBe('step');
      expect(host.controller.step(1)).toBeTrue();
      expect(host.value).toBe(200);
      expect(host.controller.step(-1)).toBeTrue();
      expect(host.value).toBe(100);
    });

    it('stops at the ends', async () => {
      const {host} = await setup({}, {value: 200});
      expect(host.controller.step(1)).toBeFalse();
      host.value = 0;
      expect(host.controller.step(-1)).toBeFalse();
      expect(host.settles.length).toBe(0);
    });

    it('steps from a position between anchors', async () => {
      const {host} = await setup({}, {value: 130});
      host.controller.step(-1);
      expect(host.value).toBe(100);
      host.value = 130;
      host.controller.step(1);
      expect(host.value).toBe(200);
    });

    it('cycles through the anchors and wraps', async () => {
      const {host} = await setup();
      host.controller.cycle();
      host.controller.cycle();
      expect(host.value).toBe(200);
      host.controller.cycle();
      expect(host.value).toBe(0);
    });

    it('settles at a given position', async () => {
      const {host} = await setup();
      host.controller.settleTo(200);
      expect(host.value).toBe(200);
      expect(last(host.settles)![1].source).toBe('api');
    });

    it('reaches every anchor a drag reaches', async () => {
      const dragged = await setup();
      const reached = new Set<number>();
      for (const dx of [10, 150, 250]) {
        drag(dragged.surface, dx, {ms: 100});
        reached.add(dragged.host.value);
        dragged.host.value = 0;
      }
      const stepped = await setup();
      const viaStep = new Set<number>([0]);
      while (stepped.host.controller.step(1)) viaStep.add(stepped.host.value);
      expect(reached).toEqual(viaStep);
    });

    it('does nothing without anchors', async () => {
      const {host} = await setup({}, {anchors: []});
      expect(host.controller.step(1)).toBeFalse();
      host.controller.cycle();
      expect(host.settles.length).toBe(0);
    });
  });

  describe('motion', () => {
    it('settles over the spring duration of the motion tokens', async () => {
      const {host, surface} = await setup();
      surface.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '300ms');
      jasmine.clock().install();
      try {
        host.controller.step(1);
        expect(host.controller.settling).toBeTrue();
        expect(host.controller.motion().duration).toBe(300);
        expect(host.settled).toEqual([]);
        jasmine.clock().tick(299);
        expect(host.settled).toEqual([]);
        jasmine.clock().tick(2);
        expect(host.settled).toEqual([100]);
        expect(host.controller.settling).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('uses another spring when asked', async () => {
      const {host, surface} = await setup({spring: 'fast-spatial'});
      surface.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '150ms');
      expect(host.controller.motion().duration).toBe(150);
    });

    it('settles at once, with no duration, under reduced motion', async () => {
      await emulateMedia({reducedMotion: 'reduce'});
      const {host, surface} = await setup();
      surface.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '300ms');
      drag(surface, 60, {ms: 100});
      expect(host.value).toBe(100);
      expect(host.controller.settling).toBeFalse();
      expect(host.settled).toEqual([100]);
      expect(host.controller.motion().duration).toBe(0);
    });

    it('starting a new drag ends the settle in progress', async () => {
      const {host, surface} = await setup();
      jasmine.clock().install();
      try {
        host.controller.step(1);
        expect(host.controller.settling).toBeTrue();
        drag(surface, 30, {release: false});
        expect(host.controller.settling).toBeFalse();
        expect(host.controller.dragging).toBeTrue();
        jasmine.clock().tick(1000);
        expect(host.settled).toEqual([]);
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('lifecycle', () => {
    it('follows a replaced target element', async () => {
      const {host} = await setup();
      const replacement = document.createElement('div');
      replacement.id = 'surface';
      host.shadowRoot!.querySelector('#surface')!.replaceWith(replacement);
      host.requestUpdate();
      await host.updateComplete;
      drag(replacement, 60);
      expect(host.value).toBe(100);
    });

    it('stops listening once the host is removed', async () => {
      const {host, surface} = await setup();
      host.remove();
      drag(surface, 60);
      expect(host.starts.length).toBe(0);
    });

    it('works again after the host is reconnected', async () => {
      const {host, surface} = await setup();
      const parent = host.parentElement!;
      host.remove();
      parent.append(host);
      await host.updateComplete;
      drag(surface, 60);
      expect(host.value).toBe(100);
    });
  });
});
