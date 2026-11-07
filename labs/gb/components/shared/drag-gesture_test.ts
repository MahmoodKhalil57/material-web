/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  DRAG_SLOP_PX,
  DragGesture,
  settleAnchor,
  VelocityTracker,
} from './drag-gesture.js';

/** Dispatches a pointer event with a given `timeStamp` (ms). */
function pointer(
  type: string,
  target: EventTarget,
  x: number,
  y: number,
  time: number,
) {
  const event = new PointerEvent(type, {
    bubbles: true,
    composed: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    clientX: x,
    clientY: y,
  });
  Object.defineProperty(event, 'timeStamp', {value: time});
  target.dispatchEvent(event);
}

describe('settleAnchor()', () => {
  const options = {velocityThreshold: 400};

  it('returns to the start anchor before the positional threshold', () => {
    expect(settleAnchor([0, 300], 0, 149, 0, options)).toBe(0);
    expect(settleAnchor([0, 300], 300, 200, 0, options)).toBe(300);
  });

  it('moves to the next anchor past the positional threshold', () => {
    expect(settleAnchor([0, 300], 0, 151, 0, options)).toBe(300);
    expect(settleAnchor([0, 300], 300, 100, 0, options)).toBe(0);
  });

  it('uses a custom positional threshold', () => {
    const custom = {...options, positionalThreshold: (d: number) => d * 0.1};
    expect(settleAnchor([0, 300], 0, 31, 0, custom)).toBe(300);
  });

  it('follows a fling past the velocity threshold', () => {
    expect(settleAnchor([0, 300], 0, 10, 500, options)).toBe(300);
    expect(settleAnchor([0, 300], 0, 200, -500, options)).toBe(0);
    // A slower fling falls back to the positional threshold.
    expect(settleAnchor([0, 300], 0, 10, 300, options)).toBe(0);
  });

  it('picks the neighbouring anchor among several', () => {
    const anchors = [400, 0, 200];
    expect(settleAnchor(anchors, 0, 120, 0, options)).toBe(200);
    expect(settleAnchor(anchors, 200, 320, 0, options)).toBe(400);
    expect(settleAnchor(anchors, 200, 250, 0, options)).toBe(200);
  });
});

describe('VelocityTracker', () => {
  it('reports px/s over recent samples', () => {
    const tracker = new VelocityTracker();
    expect(tracker.velocity).toBe(0);
    tracker.add(0, 0);
    tracker.add(10, 10);
    tracker.add(30, 20);
    expect(tracker.velocity).toBe(1500);
  });

  it('drops samples outside its window', () => {
    const tracker = new VelocityTracker(50);
    tracker.add(0, 0);
    tracker.add(100, 100); // a slow start...
    tracker.add(110, 110); // ...then 1px/ms
    tracker.add(120, 120);
    expect(tracker.velocity).toBe(1000);
  });
});

describe('DragGesture', () => {
  let target: HTMLElement;

  beforeEach(() => {
    target = document.createElement('div');
    document.body.appendChild(target);
  });

  afterEach(() => {
    target.remove();
  });

  it('starts dragging past the slop along its axis', () => {
    const onStart = jasmine.createSpy('onStart');
    const onMove = jasmine.createSpy('onMove');
    const gesture = new DragGesture(target, {axis: 'x', onStart, onMove});
    pointer('pointerdown', target, 100, 100, 0);
    pointer('pointermove', target, 100 - DRAG_SLOP_PX + 1, 100, 10);
    expect(onStart).not.toHaveBeenCalled();
    expect(gesture.dragging).toBeFalse();
    pointer('pointermove', target, 80, 102, 20);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(gesture.dragging).toBeTrue();
    expect(onMove).toHaveBeenCalledWith(-20, jasmine.anything());
    gesture.disconnect();
  });

  it('gives up a press that moves across its axis', () => {
    const onStart = jasmine.createSpy('onStart');
    const gesture = new DragGesture(target, {axis: 'x', onStart});
    pointer('pointerdown', target, 100, 100, 0);
    pointer('pointermove', target, 102, 130, 10);
    pointer('pointermove', target, 150, 130, 20);
    expect(onStart).not.toHaveBeenCalled();
    gesture.disconnect();
  });

  it('respects canStart and shouldDrag', () => {
    const onStart = jasmine.createSpy('onStart');
    let enabled = false;
    const gesture = new DragGesture(target, {
      axis: 'y',
      canStart: () => enabled,
      shouldDrag: (delta) => delta > 0,
      onStart,
    });
    pointer('pointerdown', target, 0, 0, 0);
    pointer('pointermove', target, 0, 40, 10);
    expect(onStart).not.toHaveBeenCalled();
    pointer('pointerup', target, 0, 40, 20);

    enabled = true;
    pointer('pointerdown', target, 0, 100, 30);
    pointer('pointermove', target, 0, 60, 40); // upward: refused
    expect(onStart).not.toHaveBeenCalled();
    pointer('pointerup', target, 0, 60, 50);

    pointer('pointerdown', target, 0, 0, 60);
    pointer('pointermove', target, 0, 40, 70);
    expect(onStart).toHaveBeenCalledTimes(1);
    gesture.disconnect();
  });

  it('reports the travel and velocity on release', () => {
    const onEnd = jasmine.createSpy('onEnd');
    const gesture = new DragGesture(target, {axis: 'y', onEnd});
    pointer('pointerdown', target, 0, 0, 0);
    pointer('pointermove', target, 0, 20, 20);
    pointer('pointermove', target, 0, 40, 40);
    pointer('pointerup', target, 0, 50, 50);
    expect(onEnd).toHaveBeenCalledTimes(1);
    const [delta, velocity] = onEnd.calls.mostRecent().args;
    expect(delta).toBe(50);
    expect(velocity).toBe(1000);
    expect(gesture.dragging).toBeFalse();
    gesture.disconnect();
  });

  it('suppresses the click that follows a drag, not a tap', () => {
    const button = document.createElement('button');
    target.appendChild(button);
    const onClick = jasmine.createSpy('click');
    button.addEventListener('click', onClick);
    const gesture = new DragGesture(target, {axis: 'x'});

    pointer('pointerdown', button, 0, 0, 0);
    pointer('pointerup', button, 0, 0, 10);
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    pointer('pointerdown', button, 0, 0, 20);
    pointer('pointermove', button, 40, 0, 30);
    pointer('pointerup', button, 40, 0, 40);
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    button.click();
    expect(onClick).toHaveBeenCalledTimes(2);
    gesture.disconnect();
  });

  it('cancels on pointercancel and disconnect', () => {
    const onCancel = jasmine.createSpy('onCancel');
    const onEnd = jasmine.createSpy('onEnd');
    const gesture = new DragGesture(target, {axis: 'x', onCancel, onEnd});
    pointer('pointerdown', target, 0, 0, 0);
    pointer('pointermove', target, 40, 0, 10);
    pointer('pointercancel', target, 40, 0, 20);
    expect(onCancel).toHaveBeenCalledTimes(1);
    pointer('pointerup', target, 40, 0, 30);
    expect(onEnd).not.toHaveBeenCalled();

    pointer('pointerdown', target, 0, 0, 40);
    pointer('pointermove', target, 40, 0, 50);
    gesture.disconnect();
    expect(onCancel).toHaveBeenCalledTimes(2);
    pointer('pointerdown', target, 0, 0, 60);
    pointer('pointermove', target, 40, 0, 70);
    expect(gesture.dragging).toBeFalse();
  });
});
