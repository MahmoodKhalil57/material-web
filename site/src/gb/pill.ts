/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The active pill of the site's navigation rails moving from one destination
 * to another, instead of fading out on one and in on the other: in the page
 * outline as the reader scrolls (gb.ts), and in the rail from the page left
 * to this one (navigation.ts).
 */

/**
 * A destination's active pill: the element whose ::before draws it, the
 * pill around icon and label when expanded (horizontal), around the icon
 * when collapsed (vertical).
 */
function pillOf(item: Element): HTMLElement | null {
  const root = item.shadowRoot;
  const row = root?.querySelector('.nav-rail-item');
  if (!root || !row) return null;
  return root.querySelector<HTMLElement>(
    row.classList.contains('nav-rail-item-horizontal')
      ? '.nav-rail-item-content'
      : '.nav-rail-item-indicator',
  );
}

const moves: Animation[] = [];

/**
 * Moves the active pill from `from` to `to` (spatial: the rail items' own
 * motion, --motion-duration and --motion-easing). The pill of whichever
 * comes first moves to or from the other's place, so it paints under the
 * later one's label; the other's stays hidden meanwhile. At the end each has
 * its own state, the items' own transitions having run alongside. Not under
 * reduced motion, where the pills fade. Returns whether it moved.
 */
export function movePill(from: Element, to: Element): boolean {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const a = pillOf(from);
  const b = pillOf(to);
  if (!a || !b) return false;
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  if (!ra.height || !rb.height) return false;
  for (const animation of moves.splice(0)) animation.cancel();
  const style = getComputedStyle(b);
  const timing = {
    duration: parseFloat(style.getPropertyValue('--motion-duration')) || 420,
    easing: style.getPropertyValue('--motion-easing').trim() || 'ease',
    pseudoElement: '::before',
  };
  const shown = {opacity: [1, 1], transform: ['none', 'none']};
  const hidden = {opacity: [0, 0]};
  // The `inset` of a pill on `on` that covers `rect`.
  const over = (on: DOMRect, rect: DOMRect) =>
    `${rect.top - on.top}px ${on.right - rect.right}px ${on.bottom - rect.bottom}px ${rect.left - on.left}px`;
  // A collapsed destination's label is outside its (positioned) indicator,
  // so a pill passing over it would paint on top: while it moves, the
  // labels are positioned too, painting in the destinations' order, each
  // over the pills before it.
  const labels = [...(to.parentElement?.children ?? [])]
    .map((item) => item.shadowRoot?.querySelector<HTMLElement>('.nav-rail-item-label'))
    .filter((label): label is HTMLElement => !!label);
  for (const label of labels) label.style.position = 'relative';
  if (from.compareDocumentPosition(to) & Node.DOCUMENT_POSITION_FOLLOWING) {
    // Down: the previous pill moves down to the next.
    moves.push(
      a.animate({...shown, inset: ['0px', over(ra, rb)]}, timing),
      b.animate(hidden, timing),
    );
  } else {
    // Up: the next pill comes up from the previous.
    moves.push(
      b.animate({...shown, inset: [over(rb, ra), '0px']}, timing),
      a.animate(hidden, timing),
    );
  }
  const ours = [...moves];
  void Promise.allSettled(ours.map((m) => m.finished)).then(() => {
    // Unless a later move took over (it restores them when it ends).
    if (moves[0] !== ours[0]) return;
    for (const label of labels) label.style.position = '';
  });
  return true;
}
