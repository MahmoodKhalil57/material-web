/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-card.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {
  center,
  deepElements,
  focusRingsOf,
  prop,
  ripplesOf,
} from '../shared/central/subjects.js';

adoptStyles(document, [m3Styles]);

const ROLES = [
  '--md-sys-color-surface-container-low: rgb(10, 11, 12)',
  '--md-sys-color-surface-container-highest: rgb(20, 21, 22)',
  '--md-sys-color-surface: rgb(30, 31, 32)',
  '--md-sys-color-outline-variant: rgb(40, 41, 42)',
  '--md-sys-color-on-surface: rgb(50, 51, 52)',
].join(';');

type Color = 'elevated' | 'filled' | 'outlined';
type CardEl = HTMLElement & {updateComplete: Promise<unknown>; dragged: boolean};

async function mount(markup: string) {
  const container = document.createElement('div');
  container.style.cssText = `padding:64px;${ROLES}`;
  container.innerHTML = `<style>md-gb-card{min-width:120px;min-height:80px}</style>${markup}`;
  document.body.append(container);
  const cards = [...container.querySelectorAll<CardEl>('md-gb-card')];
  await Promise.all(cards.map((c) => c.updateComplete));
  await new Promise((r) => requestAnimationFrame(r));
  const part = (c: CardEl) =>
    c.shadowRoot!.querySelector<HTMLElement>('[part="card"]')!;
  return {container, cards, part};
}

function shadow(container: HTMLElement, level: number) {
  const probe = document.createElement('span');
  probe.style.boxShadow = `var(--md-sys-elevation-shadow-${level})`;
  container.append(probe);
  const out = getComputedStyle(probe).boxShadow;
  probe.remove();
  return out;
}

function settle(el: Element) {
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

// Elevation levels of the md.comp.{elevated,filled,outlined}-card tokens.
const LEVELS: Record<Color, Record<string, number>> = {
  elevated: {enabled: 1, hovered: 2, focused: 1, pressed: 1, dragged: 4},
  filled: {enabled: 0, hovered: 1, focused: 0, pressed: 0, dragged: 3},
  outlined: {enabled: 0, hovered: 1, focused: 0, pressed: 0, dragged: 3},
};

const CONTAINER: Record<Color, string> = {
  elevated: 'rgb(10, 11, 12)',
  filled: 'rgb(20, 21, 22)',
  outlined: 'rgb(30, 31, 32)',
};


describe('<md-gb-card> variants, colors and states (spec)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  // spec: cards-0ae02b, cards-6a457b, cards-3ab158, cards-47ea0a, cards-a36c93, cards-f4149e, cards-c8515a, cards-4c9a0e, cards-ebbda2, cards-4131d3, cards-424ef2, cards-b39bb9, cards-fe068e, cards-6f28d1
  // spec: cards-b27cf0, cards-914832, cards-cdae57, cards-d59aec, cards-c05132, cards-7a2a9e, cards-efd4e5, cards-6b12fa, cards-d7a00d
  it('has elevated, filled and outlined variants with their container roles, shadow and outline', async () => {
    const {container, cards, part} = await mount(`
      <md-gb-card color="elevated"></md-gb-card>
      <md-gb-card color="filled"></md-gb-card>
      <md-gb-card color="outlined"></md-gb-card>`);
    const [el, fi, ou] = cards.map(part).map((p) => getComputedStyle(p));
    expect(el.backgroundColor).toBe(CONTAINER.elevated);
    expect(fi.backgroundColor).toBe(CONTAINER.filled);
    expect(ou.backgroundColor).toBe(CONTAINER.outlined);
    // Elevated cards have a drop shadow; filled and outlined do not.
    expect(el.boxShadow).toBe(shadow(container, 1));
    expect(fi.boxShadow).toBe('none');
    expect(ou.boxShadow).toBe('none');
    // Outlined cards have a visual boundary; the others do not.
    expect(ou.borderTopWidth).toBe('1px');
    expect(ou.borderTopColor).toBe('rgb(40, 41, 42)');
    expect(el.borderTopWidth).toBe('0px');
    expect(fi.borderTopWidth).toBe('0px');
    container.remove();
  });

  // spec: cards-b43fc4, cards-847470, cards-eeff45
  it('gives cards of a collection the same resting elevation', async () => {
    const {container, cards, part} = await mount(`
      <md-gb-card color="elevated"></md-gb-card><md-gb-card color="elevated"></md-gb-card>
      <md-gb-card color="elevated" interactive></md-gb-card>`);
    const shadows = cards.map((c) => getComputedStyle(part(c)).boxShadow);
    expect(new Set(shadows).size).toBe(1);
    expect(shadows[0]).toBe(shadow(container, 1));
    container.remove();
  });

  for (const color of ['elevated', 'filled', 'outlined'] as const) {
    describe(color, () => {
      const level = (state: string) => LEVELS[color][state];

      // spec: cards-1ac7c0, cards-40c78b, cards-9947f6, cards-23ce18, cards-9725aa
      it('raises its elevation when hovered, if directly actionable', async () => {
        const {container, cards, part} = await mount(
          `<md-gb-card color="${color}" interactive aria-label="Card"></md-gb-card>`,
        );
        const c = center(part(cards[0]));
        await sendMouse({type: 'move', position: [c.x, c.y]});
        settle(cards[0]);
        expect(getComputedStyle(part(cards[0])).boxShadow).toBe(
          shadow(container, level('hovered')),
        );
        expect(ripplesOf(cards[0]).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        container.remove();
      });

      // spec: cards-052248, cards-1095f4, cards-168391, cards-288a07, cards-1d7160
      it('shows the focus indicator when focused by keyboard', async () => {
        const {container, cards, part} = await mount(
          `<md-gb-card color="${color}" interactive aria-label="Card"></md-gb-card>`,
        );
        await sendKeys({press: 'Tab'});
        settle(cards[0]);
        expect(cards[0].matches(':focus-within') || cards[0].shadowRoot!.activeElement !== null).toBeTrue();
        expect(focusRingsOf(cards[0]).some((r) => prop(r, '--focus-ring-outline') !== 'none')).toBeTrue();
        expect(getComputedStyle(part(cards[0])).boxShadow).toBe(
          shadow(container, level('focused')),
        );
        if (color === 'outlined') {
          expect(getComputedStyle(part(cards[0])).borderTopColor).toBe('rgb(50, 51, 52)');
        }
        container.remove();
      });

      // spec: cards-a6fada, cards-ee209c, cards-4e20f6, cards-a961ec, cards-a5aa61, cards-e24db7
      it('shows a ripple and its pressed elevation while pressed, if directly actionable', async () => {
        const {container, cards, part} = await mount(
          `<md-gb-card color="${color}" interactive aria-label="Card"></md-gb-card>`,
        );
        const c = center(part(cards[0]));
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        settle(cards[0]);
        expect(ripplesOf(cards[0]).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
        expect(getComputedStyle(part(cards[0])).boxShadow).toBe(
          shadow(container, level('pressed')),
        );
        await sendMouse({type: 'up'});
        container.remove();
      });

      // spec: cards-c489ef, cards-330669, cards-9fbde5, cards-efa561, cards-af81e6
      it('raises its elevation when picked up and dragged', async () => {
        const {container, cards, part} = await mount(
          `<md-gb-card color="${color}"></md-gb-card>`,
        );
        const resting = getComputedStyle(part(cards[0])).boxShadow;
        expect(resting).toBe(shadow(container, level('enabled')));
        cards[0].dragged = true;
        await cards[0].updateComplete;
        settle(cards[0]);
        expect(getComputedStyle(part(cards[0])).boxShadow).toBe(
          shadow(container, level('dragged')),
        );
        container.remove();
      });

      // spec: cards-bad7f1, cards-238fd5
      it('has no hover state and no ripple when non-actionable', async () => {
        const {container, cards, part} = await mount(
          `<md-gb-card color="${color}"><span>Text</span></md-gb-card>`,
        );
        const rest = getComputedStyle(part(cards[0])).boxShadow;
        const c = center(part(cards[0]));
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        settle(cards[0]);
        expect(getComputedStyle(part(cards[0])).boxShadow).toBe(rest);
        expect(ripplesOf(cards[0]).length).toBe(0);
        await sendMouse({type: 'up'});
        container.remove();
      });
    });
  }

  // spec: cards-46dd38, cards-dac4f5, cards-13e779, cards-c37d9b, cards-1b5998, cards-dfb0a5, cards-335277
  it('is either a non-actionable container with no role or a directly actionable button or link', async () => {
    const {container, cards} = await mount(`
      <md-gb-card></md-gb-card>
      <md-gb-card interactive aria-label="A"></md-gb-card>
      <md-gb-card interactive href="#x" aria-label="B"></md-gb-card>`);
    const [plain, button, link] = cards.map((c) => c.shadowRoot!);
    expect(plain.querySelector('.card-btn')).toBeNull();
    expect(plain.querySelector('[role]')).toBeNull();
    expect(button.querySelector('.card-btn')!.tagName).toBe('BUTTON');
    expect(link.querySelector('.card-btn')!.tagName).toBe('A');
    expect(getComputedStyle(button.querySelector('.card-btn')!).cursor).toBe('pointer');
    container.remove();
  });

  // spec: cards-0d5c5b, cards-5b8f70, cards-3f9c4a, cards-6df9d7, cards-bb536a, cards-1c4825, cards-70f252, cards-f1432f, cards-9f5d66, cards-e5b29f
  it('tabs to actionable cards and to the buttons inside non-actionable ones, in order', async () => {
    const {container, cards} = await mount(`
      <button id="before">Before</button>
      <md-gb-card interactive aria-label="First"></md-gb-card>
      <md-gb-card><button id="a">A</button><button id="b">B</button></md-gb-card>
      <md-gb-card interactive aria-label="Last"></md-gb-card>`);
    container.querySelector<HTMLElement>('#before')!.focus();
    const seen: Element[] = [];
    for (let i = 0; i < 4; i++) {
      await sendKeys({press: 'Tab'});
      seen.push(document.activeElement!);
    }
    expect(seen[0]).toBe(cards[0]);
    expect(seen[1]).toBe(container.querySelector('#a')!);
    expect(seen[2]).toBe(container.querySelector('#b')!);
    expect(seen[3]).toBe(cards[2]);
    // The non-actionable card itself is not a tab stop.
    expect(seen).not.toContain(cards[1]);
    container.remove();
  });

  // spec: cards-a27caa, cards-d00ce2
  it('performs the action with Space or Enter on a focused actionable card', async () => {
    const {container, cards} = await mount(
      `<md-gb-card interactive aria-label="Open"></md-gb-card>`,
    );
    let clicks = 0;
    cards[0].addEventListener('click', () => clicks++);
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Enter'});
    await sendKeys({press: 'Space'});
    expect(clicks).toBe(2);
    container.remove();
  });

  // spec: cards-0ecf50, cards-dcf6a8, cards-05dc5a, cards-3f0ce3
  it('clips content taller than the card instead of scrolling it', async () => {
    const {container, cards, part} = await mount(`
      <md-gb-card style="height: 40px; min-height: 0"><div style="height: 300px">Tall</div></md-gb-card>`);
    const style = getComputedStyle(part(cards[0]));
    expect(style.overflowY).toBe('hidden');
    expect(cards[0].getBoundingClientRect().height).toBe(40);
    container.remove();
  });
});
