/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-button-group.js';
import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import '../../styles/icon/md-gb-icon.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import type {ReactiveElement} from 'lit';

adoptStyles(document, [m3Styles]);

let container: HTMLElement | undefined;

afterEach(() => container?.remove());

/** Renders the markup in a wide box and waits for updates. */
async function mount(markup: string) {
  container?.remove();
  container = document.createElement('div');
  container.style.width = '800px';
  document.body.appendChild(container);
  container.innerHTML = markup;
  await settle();
  return container;
}

async function settle(root: ParentNode = document.body) {
  for (const el of root.querySelectorAll('*')) {
    const update = (el as Partial<ReactiveElement>).updateComplete;
    if (update) await update;
    if (el.shadowRoot) await settle(el.shadowRoot);
  }
  if (root !== document.body) return;
  await new Promise((resolve) => requestAnimationFrame(resolve));
  // Finish transitions instead of waiting for them.
  document.getAnimations().forEach((a) => a instanceof CSSTransition && a.finish());
}

function group(): HTMLElement {
  return container!.querySelector('md-gb-button-group') as HTMLElement;
}

describe('<md-gb-button-group> content', () => {
  // spec: button-groups-8290ab
  it('contains no buttons by default', async () => {
    await mount('<md-gb-button-group></md-gb-button-group>');
    const el = group();
    const shadow = el.shadowRoot!;

    // Nothing is slotted into the group, and it adds no button of its own.
    const defaultSlot = shadow.querySelector('slot:not([name])') as HTMLSlotElement;
    expect(defaultSlot.assignedElements().length).toBe(0);
    expect(el.querySelectorAll('md-gb-button, md-gb-icon-button').length).toBe(0);
    expect(shadow.querySelectorAll('md-gb-button, md-gb-icon-button').length).toBe(0);
    expect(shadow.querySelector('.overflow-trigger')).toBeNull();
  });

  // spec: button-groups-07602b
  it('lays out label buttons and icon buttons together in one row', async () => {
    await mount(`<md-gb-button-group>
      <md-gb-button>Label</md-gb-button>
      <md-gb-icon-button aria-label="Add"><md-gb-icon>add</md-gb-icon></md-gb-icon-button>
      <md-gb-button>Another</md-gb-button>
    </md-gb-button-group>`);
    const slot = group().shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;
    const items = slot.assignedElements() as HTMLElement[];
    expect(items.map((el) => el.tagName)).toEqual([
      'MD-GB-BUTTON',
      'MD-GB-ICON-BUTTON',
      'MD-GB-BUTTON',
    ]);

    // Both kinds render at the same height, in order, without overlapping.
    const rects = items.map((el) => el.getBoundingClientRect());
    rects.forEach((rect) => expect(rect.height).toBeGreaterThan(0));
    expect(Math.abs(rects[0].top - rects[1].top)).toBeLessThan(1);
    expect(rects[1].left).toBeGreaterThanOrEqual(rects[0].right);
    expect(rects[2].left).toBeGreaterThanOrEqual(rects[1].right);
  });
});

describe('<md-gb-button-group> inner corners', () => {
  const btn = (el: Element) => el.shadowRoot!.querySelector('[part="btn"]')!;

  // spec: shape-83346d
  it('maps its inner corners to the single-corner tokens, not the all-corner ones', async () => {
    const markup = (style: string) => `<md-gb-button-group variant="connected" style="${style}">
        <md-gb-button>One</md-gb-button><md-gb-button>Two</md-gb-button>
      </md-gb-button-group>`;
    const innerOf = async (style: string) => {
      await mount(markup(style));
      const first = btn(container!.querySelector('md-gb-button')!);
      first.getAnimations().forEach((a) => a.finish());
      const s = getComputedStyle(first);
      return {inner: s.borderStartEndRadius, outer: s.borderStartStartRadius};
    };
    const base = await innerOf('');
    // md.comp.button-group.connected.small.inner-corner.corner-size is
    // md.sys.shape.corner-value.small (8px).
    expect(base.inner).toBe('8px');
    // The single-corner token drives the inner corner...
    const value = await innerOf('--md-sys-shape-corner-value-sm: 3px');
    expect(value.inner).toBe('3px');
    expect(value.outer).toBe(base.outer);
    // ...and the all-corner token alone does not.
    const all = await innerOf('--md-sys-shape-corner-sm: 3px');
    expect(all.inner).toBe('8px');
  });
});
