/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helpers of the RTL suite: mirrored-layout comparison.
 */

import {deepElements, renderSubject, settle, SUBJECTS} from './subjects.js';

const TOLERANCE = 1.5;

interface Box {
  left: number;
  right: number;
  width: number;
}

/** Boxes of every element, relative to the left edge of the host. */
function boxes(host: HTMLElement) {
  const base = host.getBoundingClientRect();
  const out = new Map<string, Box>();
  const seen = new Map<string, number>();
  for (const e of deepElements(host)) {
    if (e === host) continue;
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Identify an element by its tag, classes and order among equals.
    const name = `${e.localName}.${typeof e.className === 'string' ? e.className : ''}`;
    const n = (seen.get(name) ?? 0) + 1;
    seen.set(name, n);
    out.set(`${name}#${n}`, {
      left: r.left - base.left,
      right: r.right - base.left,
      width: r.width,
    });
  }
  return {width: base.width, boxes: out};
}

/** The names of elements whose RTL box is not the mirror of their LTR box. */
export async function unmirrored(subjectId: string) {
  const subject = SUBJECTS.find((s) => s.id === subjectId)!;
  const ltr = await renderSubject(subject);
  ltr.container.style.width = '400px';
  await settle(ltr.container);
  const a = boxes(ltr.el);
  ltr.cleanup();

  const rtl = await renderSubject(subject);
  rtl.container.dir = 'rtl';
  rtl.container.style.width = '400px';
  await settle(rtl.container);
  const b = boxes(rtl.el);
  rtl.cleanup();

  const bad: string[] = [];
  if (Math.abs(a.width - b.width) > TOLERANCE) bad.push(`host width ${a.width} vs ${b.width}`);
  for (const [name, box] of a.boxes) {
    const other = b.boxes.get(name);
    if (!other) continue;
    const mirroredLeft = a.width - box.right;
    if (Math.abs(other.left - mirroredLeft) > TOLERANCE) {
      bad.push(`${name} (ltr ${box.left.toFixed(1)}-${box.right.toFixed(1)}, rtl ${other.left.toFixed(1)}-${other.right.toFixed(1)})`);
    }
  }
  return bad;
}

/** The horizontal scale an element is drawn with (`transform` and `scale`). */
export function horizontalScale(e: Element): number {
  const style = getComputedStyle(e);
  let scale = 1;
  const m = style.transform.match(/matrix\(([^,]+),/);
  if (m) scale *= Number(m[1]);
  if (style.scale !== 'none') scale *= Number(style.scale.split(' ')[0]);
  return scale;
}

