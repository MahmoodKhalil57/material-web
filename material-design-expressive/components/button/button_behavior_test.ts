/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-button.js';
import '../../styles/icon/md-gb-icon.js';
import '../buttongroup/md-gb-button-group.js';
import '../fab/md-gb-fab.js';
import '../fabmenu/md-gb-fab-menu.js';
import '../iconbutton/md-gb-icon-button.js';
import '../splitbutton/md-gb-split-button.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center, deepElements, prop, ripplesOf} from '../shared/test-dom.js';
import {type ButtonElement} from './button-element.js';

adoptStyles(document, [m3Styles]);

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const HEIGHTS: Record<Size, number> = {xs: 32, sm: 40, md: 56, lg: 96, xl: 136};
/** Resting corner of a square button, pressed corner and selected-round corner. */
const SQUARE: Record<Size, string> = {
  xs: 'md',
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: 'xl',
};
const PRESSED: Record<Size, string> = {
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'lg',
};

describe('<md-gb-button> spec behavior', () => {
  const env = new Environment();

  async function setup(template: unknown) {
    const root = env.render(html`<div style="padding: 32px">${template}</div>`);
    await env.waitForStability();
    const buttons = [...root.querySelectorAll<ButtonElement>('md-gb-button')];
    const part = (b: ButtonElement) =>
      b.shadowRoot!.querySelector<HTMLElement>('[part="btn"]')!;
    return {root, buttons, part};
  }

  const corner = (el: HTMLElement) => getComputedStyle(el).borderTopLeftRadius;

  /** The computed radius of a shape token. */
  function shape(root: HTMLElement, name: string) {
    const probe = document.createElement('span');
    probe.style.borderTopLeftRadius = `var(--md-sys-shape-corner-${name})`;
    probe.style.width = probe.style.height = '10px';
    root.append(probe);
    const out = getComputedStyle(probe).borderTopLeftRadius;
    probe.remove();
    return out;
  }

  /**
   * The "full" corner of a button: half its own height (not the system
   * `50cqmin`, which cannot know the element's size and would morph badly).
   */
  const fullOf = (btn: HTMLElement) => `${btn.getBoundingClientRect().height / 2}px`;

  function settle(el: Element) {
    document.body.getBoundingClientRect();
    getComputedStyle(el.shadowRoot!.querySelector('[part="btn"]')!).borderTopLeftRadius;
    for (let pass = 0; pass < 2; pass++) {
      for (const a of [
        ...document.getAnimations(),
        ...deepElements(el).flatMap((e) => e.getAnimations()),
      ]) {
        try {
          a.finish();
        } catch {
          // Infinite animations cannot finish.
        }
      }
    }
  }

  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: all-buttons-265084, all-buttons-32ca0c, all-buttons-c99615, all-buttons-8f290a, all-buttons-9d82c4, all-buttons-d223ff, all-buttons-9c2f93, all-buttons-259a08, all-buttons-a60a28
  it('is one of ten button types: each type is a registered element and the toggles use type="toggle"', async () => {
    for (const tag of [
      'md-gb-button',
      'md-gb-icon-button',
      'md-gb-split-button',
      'md-gb-button-group',
      'md-gb-fab',
      'md-gb-fab-menu',
    ]) {
      expect(customElements.get(tag)).withContext(tag).toBeDefined();
    }
    const {root} = await setup(html`
      <md-gb-button type="toggle">Toggle</md-gb-button>
      <md-gb-icon-button type="toggle" aria-label="Toggle"></md-gb-icon-button>
      <md-gb-fab aria-label="Create"></md-gb-fab>
      <md-gb-fab size="lg" aria-label="Create"></md-gb-fab>`);
    const toggle = root.querySelector('md-gb-button')!.shadowRoot!.querySelector('[part="btn"]')!;
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    const iconToggle = root.querySelector('md-gb-icon-button')!;
    expect(iconToggle.getAttribute('type')).toBe('toggle');
    // Extended FABs are FABs with a label.
    const fabs = root.querySelectorAll('md-gb-fab');
    expect(fabs.length).toBe(2);
  });

  // spec: all-buttons-9b934c
  it('gives the tonal button a secondary palette that is less prominent than filled', async () => {
    const root = env.render(html`<div style="--md-sys-color-primary: rgb(10, 10, 10); --md-sys-color-secondary-container: rgb(200, 200, 200)">
      <md-gb-button color="filled">A</md-gb-button><md-gb-button color="tonal">B</md-gb-button></div>`);
    await env.waitForStability();
    const [filled, tonal] = [...root.querySelectorAll<ButtonElement>('md-gb-button')]
      .map((b) => getComputedStyle(b.shadowRoot!.querySelector('[part="btn"]')!).backgroundColor);
    expect(filled).toBe('rgb(10, 10, 10)');
    expect(tonal).toBe('rgb(200, 200, 200)');
  });

  // spec: buttons-1c3ffb, buttons-5fd4fc, buttons-2ba0c3
  it('is a default button or a toggle button whose selection changes on click', async () => {
    const {buttons, part} = await setup(html`
      <md-gb-button type="button">Default</md-gb-button>
      <md-gb-button type="toggle">Toggle</md-gb-button>`);
    const [plain, toggle] = buttons;
    expect(part(plain).hasAttribute('aria-pressed')).toBeFalse();
    plain.click();
    expect(plain.selected).toBeFalse();
    expect(part(toggle).getAttribute('aria-pressed')).toBe('false');
    part(toggle).click();
    await env.waitForStability();
    expect(toggle.selected).toBeTrue();
    expect(part(toggle).getAttribute('aria-pressed')).toBe('true');
    part(toggle).click();
    await env.waitForStability();
    expect(toggle.selected).toBeFalse();
  });

  // spec: buttons-8bb357, buttons-d83027, buttons-3917dd, buttons-7ff932, buttons-873b6a, buttons-98c091, buttons-d7a56f
  it('comes in sizes XS, S (default), M, L and XL', async () => {
    const {buttons, part} = await setup(html`
      <md-gb-button>Default</md-gb-button>
      ${SIZES.map((s) => html`<md-gb-button size=${s}>Label</md-gb-button>`)}`);
    expect(buttons[0].size).toBe('sm');
    expect(getComputedStyle(part(buttons[0])).minHeight).toBe('40px');
    SIZES.forEach((size, i) => {
      expect(getComputedStyle(part(buttons[i + 1])).minHeight)
        .withContext(size)
        .toBe(`${HEIGHTS[size]}px`);
    });
  });

  // spec: buttons-355f27, buttons-af408b, buttons-0a6888, buttons-922017
  it('is round (fully rounded) by default at every size, and 40dp tall by default', async () => {
    const {buttons, part} = await setup(html`
      ${SIZES.map((s) => html`<md-gb-button size=${s}>Label</md-gb-button>`)}`);
    buttons.forEach((b, i) => {
      expect(corner(part(b))).withContext(SIZES[i]).toBe(fullOf(part(b)));
    });
    const {buttons: [def], part: p2} = await setup(html`<md-gb-button>Label</md-gb-button>`);
    expect(getComputedStyle(p2(def)).minHeight).toBe('40px');
  });

  // spec: buttons-708fac, buttons-f1a126
  it('comes in five color styles', async () => {
    const colors = ['elevated', 'filled', 'tonal', 'outlined', 'text'];
    const {buttons} = await setup(html`
      ${colors.map((c) => html`<md-gb-button color=${c}>Label</md-gb-button>`)}`);
    expect(buttons.map((b) => b.color as string)).toEqual(colors);
    const part = (b: ButtonElement) => b.shadowRoot!.querySelector('[part="btn"]')!;
    expect(
      colors.map((c, i) => part(buttons[i]).classList.contains(`btn-${c}`)),
    ).toEqual([true, true, true, true, true]);
  });

  // spec: buttons-eb9f8c, buttons-61534c, buttons-2461bf
  it('can be square, with a smaller corner than a round button', async () => {
    const {root, buttons, part} = await setup(html`
      ${SIZES.map((s) => html`<md-gb-button size=${s} square>Label</md-gb-button>`)}`);
    buttons.forEach((b, i) => {
      expect(corner(part(b))).withContext(SIZES[i]).toBe(shape(root, SQUARE[SIZES[i]]));
    });
  });

  // spec: buttons-1df19e, buttons-51972b, buttons-f34ae2, buttons-e37297, buttons-8ec12b
  it('pads a small button 16dp on both sides, round or square', async () => {
    const {buttons, part} = await setup(html`
      <md-gb-button>Round</md-gb-button>
      <md-gb-button square>Square</md-gb-button>`);
    for (const b of buttons) {
      const css = getComputedStyle(part(b));
      expect(css.paddingLeft).toBe('16px');
      expect(css.paddingRight).toBe('16px');
    }
  });

  // spec: buttons-64e84e
  it('has 20dp leading and trailing icons by default', async () => {
    const {buttons, part} = await setup(html`<md-gb-button>Label</md-gb-button>`);
    expect(getComputedStyle(part(buttons[0])).getPropertyValue('--icon-size').trim()).toBe('20px');
  });

  // spec: buttons-a893c4, buttons-e56e58, buttons-f73863, buttons-b4e023, buttons-e1949b, buttons-dc5b8b, buttons-c5d4db, buttons-220a0a
  for (const size of SIZES) {
    it(`${size}: morphs to a more square shape when pressed, the same for round and square`, async () => {
      const {root, buttons, part} = await setup(html`
        <md-gb-button size=${size}>Round</md-gb-button>
        <md-gb-button size=${size} square>Square</md-gb-button>`);
      for (const b of buttons) {
        const btn = part(b);
        const resting = corner(btn);
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        settle(b);
        // Hovered keeps the resting shape.
        expect(corner(btn)).withContext(`${size} hovered`).toBe(resting);
        await sendMouse({type: 'down'});
        settle(b);
        expect(corner(btn))
          .withContext(`${size} pressed`)
          .toBe(shape(root, PRESSED[size]));
        expect(corner(btn)).not.toBe(resting);
        await sendMouse({type: 'up'});
      }
    });
  }

  // spec: buttons-96dd91, buttons-7a42aa, buttons-916313, buttons-c19c81, buttons-0dfe5a, buttons-0e958b, buttons-b0bb0d, buttons-b3a897, buttons-88aa58, buttons-b978b3
  it('swaps round and square on a toggle button when selected', async () => {
    const {root, buttons, part} = await setup(html`
      <md-gb-button type="toggle" size="md">Round</md-gb-button>
      <md-gb-button type="toggle" size="md" square>Square</md-gb-button>`);
    const [round, square] = buttons;
    expect(corner(part(round))).toBe(fullOf(part(round)));
    expect(corner(part(square))).toBe(shape(root, 'lg'));
    round.selected = true;
    square.selected = true;
    await env.waitForStability();
    settle(round);
    settle(square);
    // Selected: the round button turns square, the square one turns round.
    expect(corner(part(round))).toBe(shape(root, 'lg'));
    expect(corner(part(square))).toBe(fullOf(part(square)));
    // A selected toggle still morphs when pressed.
    const c = center(part(round));
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    settle(round);
    expect(corner(part(round))).toBe(shape(root, 'md'));
  });

  // spec: buttons-eec50e
  it('uses a filled icon when selected and an outlined icon when unselected', async () => {
    const {buttons, part} = await setup(html`
      <md-gb-button type="toggle">Toggle</md-gb-button>`);
    const fill = () => getComputedStyle(part(buttons[0])).getPropertyValue('--md-icon-fill').trim();
    expect(fill()).toBe('0');
    buttons[0].selected = true;
    await env.waitForStability();
    expect(fill()).toBe('1');
  });

  // spec: buttons-e994f2
  it('sets its width to fit the label text', async () => {
    const {buttons} = await setup(html`
      <md-gb-button>Ok</md-gb-button>
      <md-gb-button>A much longer label</md-gb-button>`);
    const [short, long] = buttons.map((b) => b.getBoundingClientRect().width);
    expect(long).toBeGreaterThan(short);
    // 16dp padding on each side plus the 1px outline: the label sets the rest.
    expect(short).toBeLessThan(80);
  });

  // spec: buttons-76b8e1
  it('stretches horizontally when its container is wider', async () => {
    const {buttons, part} = await setup(html`
      <md-gb-button style="width: 320px">Label</md-gb-button>`);
    expect(buttons[0].getBoundingClientRect().width).toBe(320);
    expect(part(buttons[0]).getBoundingClientRect().width).toBe(320);
  });

  // spec: buttons-d236c8, buttons-fc47f9, buttons-f47df7
  it('keeps the icon and label grouped and centered as the width changes', async () => {
    for (const width of [160, 320, 480]) {
      const {buttons} = await setup(html`
        <md-gb-button style="width: ${width}px"><span id="i">*</span><span id="l">Label</span></md-gb-button>`);
      const box = buttons[0].getBoundingClientRect();
      const i = buttons[0].querySelector('#i')!.getBoundingClientRect();
      const l = buttons[0].querySelector('#l')!.getBoundingClientRect();
      const groupCenter = (Math.min(i.left, l.left) + Math.max(i.right, l.right)) / 2;
      expect(Math.abs(groupCenter - (box.left + box.width / 2)))
        .withContext(`${width}px: group centered`)
        .toBeLessThan(1);
      expect(Math.abs(l.left - i.right))
        .withContext(`${width}px: label stays next to icon`)
        .toBeLessThan(10);
    }
  });

  // spec: buttons-2554d3, buttons-9b47cd, buttons-ccbdd3
  it('is reached with Tab and activated with Space or Enter', async () => {
    const {buttons} = await setup(html`<md-gb-button>Done</md-gb-button>`);
    let clicks = 0;
    buttons[0].addEventListener('click', () => clicks++);
    await sendKeys({press: 'Tab'});
    expect(document.activeElement).toBe(buttons[0]);
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
  });

  // spec: buttons-bda379
  it('is named by its visible label text', async () => {
    const {buttons, part} = await setup(html`<md-gb-button>Done</md-gb-button>`);
    expect(part(buttons[0]).hasAttribute('aria-label')).toBeFalse();
    expect(buttons[0].textContent!.trim()).toBe('Done');
  });

  // spec: buttons-ed8443, buttons-35d145, buttons-019fb6
  // md.comp.button.{filled,tonal}.hovered.container.elevation = level1 and
  // md.comp.button.elevated.hovered.container.elevation = level2.
  for (const [color, level] of [
    ['filled', 1],
    ['tonal', 1],
    ['elevated', 2],
  ] as const) {
    it(`${color}: raises the container to elevation ${level} when hovered`, async () => {
      const container = document.createElement('div');
      container.style.padding = '64px';
      container.innerHTML = `<md-gb-button color="${color}">Label</md-gb-button>`;
      document.body.append(container);
      const el = container.firstElementChild as ButtonElement;
      await el.updateComplete;
      const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="btn"]')!;
      const probe = document.createElement('span');
      probe.style.boxShadow = `var(--md-sys-elevation-shadow-${level})`;
      container.append(probe);
      const expected = getComputedStyle(probe).boxShadow;
      const c = center(btn);
      await sendMouse({type: 'move', position: [c.x, c.y]});
      expect(getComputedStyle(btn).boxShadow).toBe(expected);
      await sendMouse({type: 'move', position: [0, 0]});
      container.remove();
    });
  }

  // The emulated `.active` class keeps the pressed shape for at most the
  // ripple's minimum press time; it must not stay after the mouse is released.
  it('drops the pressed shape (and `.active`) after the mouse is released', async () => {
    const {buttons, part} = await setup(html`<md-gb-button color="filled">Label</md-gb-button>`);
    const btn = part(buttons[0]);
    const rest = corner(btn);
    const c = center(btn);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    await sendMouse({type: 'down'});
    await sendMouse({type: 'up'});
    // The ripple keeps `.active` for its 225ms minimum press time.
    jasmine.clock().tick(400);
    await sendMouse({type: 'move', position: [0, 0]});
    settle(buttons[0]);
    expect(btn.classList.contains('active')).toBeFalse();
    expect(corner(btn)).toBe(rest);
  });

  // spec: buttons-174aee, buttons-c25110
  for (const color of ['outlined', 'text'] as const) {
    it(`${color}: has an invisible container at rest but the same state layers when hovered, pressed and disabled`, async () => {
      const {buttons, part} = await setup(
        html`<md-gb-button color=${color}>One</md-gb-button><md-gb-button color=${color} disabled>Two</md-gb-button>`,
      );
      const [enabled, disabled] = buttons;
      const btn = part(enabled);
      expect(getComputedStyle(btn).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      const c = center(btn);
      await sendMouse({type: 'move', position: [c.x, c.y]});
      settle(enabled);
      expect(ripplesOf(enabled).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
      await sendMouse({type: 'down'});
      settle(enabled);
      expect(ripplesOf(enabled).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
      await sendMouse({type: 'up'});
      const label = getComputedStyle(part(disabled)).color.match(/\/\s*([\d.]+)\)/);
      expect(Number(label?.[1])).toBeCloseTo(0.38, 2);
    });
  }

  // spec: buttons-fd7ee9, buttons-6c4b57, buttons-aafb87, buttons-c08bc4, buttons-360bae
  it('keeps its label on one line and never narrower than the label text', async () => {
    const {buttons, part} = await setup(html`<div style="inline-size: 60px">
      <md-gb-button color="filled">A rather long label</md-gb-button>
    </div>`);
    const btn = part(buttons[0]);
    expect(getComputedStyle(btn).whiteSpace).toBe('nowrap');
    expect(btn.getBoundingClientRect().height).toBe(40);
    const slot = btn.querySelector('slot')!;
    const text = slot.assignedNodes()[0];
    const range = document.createRange();
    range.selectNodeContents(text);
    expect(btn.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      range.getBoundingClientRect().width,
    );
  });

  // spec: buttons-4f7033, buttons-82a3d7, buttons-e79818
  it('places the icon before the label: on the left in LTR, on the right in RTL', async () => {
    for (const dir of ['ltr', 'rtl']) {
      const {buttons} = await setup(html`<div dir=${dir}>
        <md-gb-button color="filled"><md-gb-icon>add</md-gb-icon>Label</md-gb-button>
      </div>`);
      const icon = buttons[0].querySelector('md-gb-icon')!.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(buttons[0].childNodes[1]);
      const text = range.getBoundingClientRect();
      if (dir === 'ltr') {
        expect(icon.right).withContext(dir).toBeLessThanOrEqual(text.left + 0.5);
      } else {
        expect(icon.left).withContext(dir).toBeGreaterThanOrEqual(text.right - 0.5);
      }
    }
  });

  // spec: buttons-cb5ac3
  it('does not underline the text button', async () => {
    const {buttons, part} = await setup(html`<md-gb-button color="text">Label</md-gb-button>`);
    expect(getComputedStyle(part(buttons[0])).textDecorationLine).toBe('none');
  });

  // spec: buttons-7e9118
  it('uses a semibold icon instead of a filled one when a toggle has no filled icon', async () => {
    const {buttons} = await setup(html`<md-gb-button type="toggle" selected unfilled-icon><md-gb-icon>star</md-gb-icon>Label</md-gb-button>`);
    const style = getComputedStyle(buttons[0]);
    expect(style.getPropertyValue('--md-icon-fill').trim()).toBe('0');
    expect(style.getPropertyValue('--md-icon-wght').trim()).toBe('600');
  });
});
