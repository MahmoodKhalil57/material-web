/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contract tests of the AnchoredOverlayController
 * (`labs/gb/components/shared/anchored-overlay.ts`): each component that
 * puts a surface next to an anchor opens it beside its invoker, flips it
 * when there is no room, closes it with Escape and a press outside, and
 * returns focus to the invoker. Plugged into gen-contract-tests.mjs.
 *
 * `entries[dir]` is `{components: [...]}`; each component has:
 * - tag: label of the component.
 * - imports: side-effect modules, relative to the component directory.
 * - fixture: lit `html` source of the whole component and its invoker.
 * - invoker: TS expression (with `root`, the mounted container): the element
 *   that opens the surface and gets focus back.
 * - anchor: TS expression: the element the surface is placed next to.
 * - surface: TS expression: the popover element.
 * - open: TS statements that open it like a pointer user (may `await`).
 * - openKeyboard: TS statements that open it from the keyboard and move focus
 *   inside it where the component does that.
 * - side: where it opens by default: `below` or `above`.
 * - flipEdge: window edge to put the component against so the default side
 *   has no room: `bottom` or `top`.
 * - align: optional, `start` or `end`: the surface's edge lines up with the
 *   anchor's same edge.
 * - gap: optional, the distance (px) between anchor and surface.
 * - top: optional, the fixture's distance (px) from the window top (default
 *   200); a tall surface needs room below to open below.
 * - spec: unit IDs per check: opens, flips, inside, escape, outside, focus.
 */

const menuItems = `
        <md-gb-menu-item>One</md-gb-menu-item>
        <md-gb-menu-item>Two</md-gb-menu-item>
        <md-gb-menu-item>Three</md-gb-menu-item>`;

const fruits = `
        <md-gb-select-option value="apple">Apple</md-gb-select-option>
        <md-gb-select-option value="banana">Banana</md-gb-select-option>
        <md-gb-select-option value="cherry">Cherry</md-gb-select-option>`;

const menuSpec = {
  opens: [
    'menus-0cd562',
    'menus-27ace3',
    'menus-09c5d3',
    'menus-eb894b',
  ],
  flips: ['menus-74a090', 'menus-876f3e', 'menus-e3388b'],
  inside: ['menus-09c5d3', 'menus-74a090'],
  escape: ['menus-235f42', 'menus-8ed4c3'],
  outside: ['menus-509021'],
  focus: ['menus-e50135', 'menus-4b025b'],
};

export const entries = {
  menu: {
    components: [
      {
        tag: 'md-gb-menu',
        imports: ['./md-gb-menu.js', './md-gb-menu-item.js'],
        fixture: `
      <button id="invoker" popovertarget="menu">Open</button>
      <md-gb-menu id="menu">${menuItems}
      </md-gb-menu>`,
        invoker: `root.querySelector<HTMLElement>('#invoker')!`,
        anchor: `root.querySelector<HTMLElement>('#invoker')!`,
        surface: `root.querySelector<HTMLElement>('md-gb-menu')!`,
        open: `f.invoker.click();`,
        openKeyboard: `f.invoker.focus();
  await press('Enter');`,
        side: 'below',
        flipEdge: 'bottom',
        align: 'start',
        spec: menuSpec,
      },
    ],
  },
  select: {
    components: [
      {
        tag: 'md-gb-select',
        imports: ['./md-gb-select.js', './md-gb-select-option.js'],
        fixture: `
      <md-gb-select label="Fruit">${fruits}
      </md-gb-select>`,
        invoker: `root.querySelector('md-gb-select')!.shadowRoot!.querySelector<HTMLElement>('[role="combobox"]')!`,
        anchor: `root.querySelector('md-gb-select')!.shadowRoot!.querySelector<HTMLElement>('.text-field-container')!`,
        surface: `root.querySelector('md-gb-select')!.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!`,
        open: `f.anchor.click();`,
        openKeyboard: `f.root.querySelector<HTMLElement>('md-gb-select')!.focus();
  await press('ArrowDown');`,
        side: 'below',
        flipEdge: 'bottom',
        align: 'start',
        gap: 0,
        focusStays: true,
        spec: {
          opens: ['menus-6fe29e', 'menus-c16cb5', 'menus-047bed', 'menus-0cd562'],
          flips: ['menus-74a090', 'menus-876f3e'],
          inside: ['menus-09c5d3', 'menus-74a090'],
          escape: ['menus-235f42', 'menus-8ed4c3'],
          outside: ['menus-509021'],
          focus: ['menus-e50135'],
        },
      },
      {
        tag: 'md-gb-autocomplete',
        imports: ['./md-gb-autocomplete.js', './md-gb-select-option.js'],
        fixture: `
      <md-gb-autocomplete label="Fruit">${fruits}
      </md-gb-autocomplete>`,
        invoker: `root.querySelector('md-gb-autocomplete')!.shadowRoot!.querySelector<HTMLElement>('input')!`,
        anchor: `root.querySelector('md-gb-autocomplete')!.shadowRoot!.querySelector<HTMLElement>('.text-field-container')!`,
        surface: `root.querySelector('md-gb-autocomplete')!.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!`,
        open: `f.anchor.click();`,
        openKeyboard: `f.root.querySelector<HTMLElement>('md-gb-autocomplete')!.focus();
  await press('ArrowDown');`,
        side: 'below',
        flipEdge: 'bottom',
        align: 'start',
        gap: 0,
        focusStays: true,
        spec: {
          opens: ['menus-6fe29e', 'menus-c16cb5', 'menus-047bed', 'menus-0cd562'],
          flips: ['menus-74a090', 'menus-876f3e'],
          inside: ['menus-09c5d3', 'menus-74a090'],
          escape: ['menus-235f42', 'menus-8ed4c3'],
          outside: ['menus-509021'],
          focus: ['menus-e50135'],
        },
      },
    ],
  },
  tooltip: {
    components: [
      {
        tag: 'md-gb-tooltip',
        imports: ['./md-gb-tooltip.js'],
        fixture: `
      <button id="before">Before</button>
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" show-delay="0" quick>Label</md-gb-tooltip>`,
        invoker: `root.querySelector<HTMLElement>('#anchor')!`,
        anchor: `root.querySelector<HTMLElement>('#anchor')!`,
        surface: `root.querySelector<HTMLElement>('md-gb-tooltip')!`,
        open: `f.anchor.dispatchEvent(new PointerEvent('pointerenter', {pointerType: 'mouse'}));`,
        openKeyboard: `f.root.querySelector<HTMLElement>('#before')!.focus();
  await press('Tab');`,
        side: 'above',
        flipEdge: 'top',
        gap: 4,
        focusStays: true,
        spec: {
          opens: ['tooltips-f76779', 'tooltips-084bb5', 'tooltips-d11e0b', 'tooltips-03de57'],
          flips: ['tooltips-345206', 'tooltips-a5447a'],
          inside: ['tooltips-345206'],
          escape: [],
          outside: ['tooltips-4cc181'],
          focus: [],
        },
      },
      {
        tag: 'md-gb-tooltip (rich, persistent)',
        imports: ['./md-gb-tooltip.js'],
        fixture: `
      <button id="before">Before</button>
      <button id="anchor">Anchor</button>
      <md-gb-tooltip for="anchor" variant="rich" persistent subhead="Title" quick>
        Supporting text
        <button slot="action" id="action">Got it</button>
      </md-gb-tooltip>`,
        invoker: `root.querySelector<HTMLElement>('#anchor')!`,
        anchor: `root.querySelector<HTMLElement>('#anchor')!`,
        surface: `root.querySelector<HTMLElement>('md-gb-tooltip')!`,
        open: `f.anchor.click();`,
        openKeyboard: `f.root.querySelector<HTMLElement>('#before')!.focus();
  await press('Tab');
  await press('Enter');
  await press('Tab');`,
        side: 'below',
        flipEdge: 'bottom',
        gap: 4,
        spec: {
          opens: ['tooltips-09c2d2', 'tooltips-246aa9', 'tooltips-d1f065'],
          flips: ['tooltips-345206', 'tooltips-98ce1e'],
          inside: ['tooltips-345206'],
          escape: [],
          outside: ['tooltips-4cc181', 'tooltips-040b1c'],
          focus: ['tooltips-f54ffe'],
        },
      },
    ],
  },
  splitbutton: {
    components: [
      {
        tag: 'md-gb-split-button',
        imports: [
          './md-gb-split-button.js',
          '../menu/md-gb-menu.js',
          '../menu/md-gb-menu-item.js',
        ],
        fixture: `
      <md-gb-split-button>
        <button slot="leading">Save</button>
        <button slot="trailing" id="invoker" aria-label="More actions" popovertarget="menu"></button>
        <md-gb-menu id="menu">${menuItems}
        </md-gb-menu>
      </md-gb-split-button>`,
        invoker: `root.querySelector<HTMLElement>('#invoker')!`,
        anchor: `root.querySelector<HTMLElement>('#invoker')!`,
        surface: `root.querySelector<HTMLElement>('md-gb-menu')!`,
        open: `f.invoker.click();`,
        openKeyboard: `f.invoker.focus();
  await press('Enter');`,
        side: 'below',
        flipEdge: 'bottom',
        align: 'end',
        gap: 4,
        spec: {
          opens: [
            'split-button-fab8df',
            'split-button-65d4ae',
            'split-button-347947',
            'split-button-54f72d',
            'menus-66cea9',
          ],
          flips: ['split-button-394dbb', 'split-button-24bec6', 'split-button-4e0abb'],
          inside: ['split-button-4e0abb', 'menus-74a090'],
          escape: ['menus-235f42'],
          outside: ['menus-509021'],
          focus: ['split-button-227d99'],
        },
      },
    ],
  },
  datepicker: {
    components: [
      {
        tag: 'md-gb-date-picker (docked)',
        imports: ['./md-gb-date-picker.js'],
        fixture: `
      <md-gb-date-picker quick label="Date"></md-gb-date-picker>`,
        invoker: `root.querySelector('md-gb-date-picker')!.shadowRoot!.querySelector<HTMLElement>('.date-picker-calendar-button')!`,
        anchor: `root.querySelector('md-gb-date-picker')!.shadowRoot!.querySelector<HTMLElement>('.date-picker-field')!`,
        surface: `root.querySelector('md-gb-date-picker')!.shadowRoot!.querySelector<HTMLElement>('.date-picker')!`,
        open: `f.invoker.click();`,
        openKeyboard: `f.invoker.focus();
  await press('Enter');`,
        side: 'below',
        flipEdge: 'bottom',
        align: 'start',
        gap: 4,
        top: 4,
        spec: {
          opens: ['date-pickers-3556cc'],
          flips: [],
          inside: [],
          escape: [],
          outside: [],
          focus: [],
        },
      },
    ],
  },
};

function cite(ids) {
  return ids?.length ? `    // spec: ${ids.join(', ')}\n` : '';
}

function componentTests(dir, c, index) {
  const n = index;
  const flipSide = c.side === 'below' ? 'above' : 'below';
  const cases = [];

  // Where the surface is relative to the anchor, as an assertion.
  const sideCheck = (side, name) =>
    side === 'below'
      ? `    expect(s.top).toBeGreaterThanOrEqual(a.bottom - 0.5);`
      : `    expect(s.bottom).toBeLessThanOrEqual(a.top + 0.5);`;
  const gapCheck = (side) =>
    c.gap === undefined
      ? ''
      : side === 'below'
        ? `\n    expect(Math.abs(s.top - a.bottom - ${c.gap})).toBeLessThan(1.5);`
        : `\n    expect(Math.abs(a.top - s.bottom - ${c.gap})).toBeLessThan(1.5);`;
  const alignCheck = c.align
    ? c.align === 'start'
      ? `\n    expect(Math.abs(s.left - a.left)).toBeLessThan(1.5);`
      : `\n    expect(Math.abs(s.right - a.right)).toBeLessThan(1.5);`
    : '';

  cases.push(`  it('opens as a popover in the top layer, ${c.side} its invoker${c.align ? `, ${c.align}-aligned` : ''}', async () => {
${cite(c.spec.opens)}    const f = await setupAnchored${n}();
    ${c.open}
    await settle();
    await finishAnimations(f.surface);
    expect(f.surface.matches(':popover-open')).toBeTrue();
    expect(f.surface.hasAttribute('popover')).toBeTrue();
    const a = f.anchor.getBoundingClientRect();
    const s = f.surface.getBoundingClientRect();
${sideCheck(c.side)}${gapCheck(c.side)}${alignCheck}
  });`);

  cases.push(`  it('flips to the ${flipSide} when there is no room ${c.side}', async () => {
${cite(c.spec.flips)}    const f = await setupAnchored${n}({edge: '${c.flipEdge}'});
    ${c.open}
    await settle();
    await finishAnimations(f.surface);
    expect(f.surface.matches(':popover-open')).toBeTrue();
    const a = f.anchor.getBoundingClientRect();
    const s = f.surface.getBoundingClientRect();
${sideCheck(flipSide)}${gapCheck(flipSide)}
    expect(s.top).toBeGreaterThanOrEqual(-0.5);
    expect(s.bottom).toBeLessThanOrEqual(window.innerHeight + 0.5);
  });`);

  cases.push(`  it('stays inside the window at its inline end', async () => {
${cite(c.spec.inside)}    const f = await setupAnchored${n}({edge: 'end'});
    ${c.open}
    await settle();
    await finishAnimations(f.surface);
    expect(f.surface.matches(':popover-open')).toBeTrue();
    const s = f.surface.getBoundingClientRect();
    expect(s.left).toBeGreaterThanOrEqual(-0.5);
    expect(s.right).toBeLessThanOrEqual(document.documentElement.clientWidth + 0.5);
  });`);

  cases.push(`  it('closes with Escape', async () => {
${cite(c.spec.escape)}    const f = await setupAnchored${n}();
    ${c.open}
    await settle();
    await finishAnimations(f.surface);
    expect(f.surface.matches(':popover-open')).toBeTrue();
    await press('Escape');
    expect(f.surface.matches(':popover-open')).toBeFalse();
  });`);

  cases.push(`  it('closes with a press outside', async () => {
${cite(c.spec.outside)}    const f = await setupAnchored${n}();
    ${c.open}
    await settle();
    await finishAnimations(f.surface);
    expect(f.surface.matches(':popover-open')).toBeTrue();
    await sendMouse({type: 'click', position: [document.documentElement.clientWidth - 6, 6]});
    await settle();
    expect(f.surface.matches(':popover-open')).toBeFalse();
  });`);

  cases.push(`  it('returns focus to the invoker when it was inside', async () => {
${cite(c.spec.focus)}    const f = await setupAnchored${n}();
    ${c.openKeyboard}
    await settle();
    expect(f.surface.matches(':popover-open')).toBeTrue();
    ${c.focusStays ? '' : `expect(deepActive()).not.toBe(f.invoker);\n    `}await press('Escape');
    expect(f.surface.matches(':popover-open')).toBeFalse();
    expect(deepActive()).toBe(f.invoker);
  });`);

  const setup = `async function setupAnchored${n}(opts: {edge?: 'top' | 'bottom' | 'end'} = {}) {
  const style = {
    bottom: 'bottom: 4px; left: 60px',
    top: 'top: 4px; left: 60px',
    end: 'top: ${c.top ?? 200}px; right: 2px',
    none: 'top: ${c.top ?? 200}px; left: 60px',
  }[opts.edge ?? 'none'];
  const root = await mount(html\`
    <div style="position: fixed; \${style}">${c.fixture}
    </div>
  \`);
  const f = {
    root,
    get invoker() {
      return ${c.invoker};
    },
    get anchor() {
      return ${c.anchor};
    },
    get surface() {
      return ${c.surface};
    },
  };
  return f;
}`;
  return {
    setup,
    describe: `describe('<${c.tag}> anchored overlay contract (AnchoredOverlayController: popover, ${c.side}, flip, light dismiss, focus return)', () => {
  afterEach(() => container?.remove());

${cases.join('\n\n')}
});`,
  };
}

export function tests(dir, config) {
  const parts = config.components.map((c, i) => componentTests(dir, c, i));
  const imports = [...new Set(config.components.flatMap((c) => c.imports))];
  return {
    imports,
    setup: `import {sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

adoptStyles(document, [m3Styles]);

/** Waits for the surface's open animation (its size and place are final after). */
async function finishAnimations(el: Element) {
  const animations = el.getAnimations({subtree: true});
  await Promise.all(animations.map((a): Promise<unknown> => a.finished.catch((): void => {})));
}

/** The focused element, looking inside shadow roots. */
function deepActive(): Element | null {
  let el = document.activeElement;
  while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
  return el;
}

${parts.map((p) => p.setup).join('\n\n')}`,
    describe: parts.map((p) => p.describe).join('\n\n'),
  };
}
