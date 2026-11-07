/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-icon-button.js';

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

/** Distinct role colors, so a computed color names the role it came from. */
const ROLE_NAMES = [
  'primary',
  'on-primary',
  'secondary',
  'on-secondary',
  'secondary-container',
  'on-secondary-container',
  'surface-container',
  'on-surface',
  'on-surface-variant',
  'inverse-surface',
  'inverse-on-surface',
  'outline-variant',
];
const rgb = (role: string) => {
  const i = ROLE_NAMES.indexOf(role) + 1;
  return `rgb(${i * 7}, ${i * 3 + 1}, ${i * 5 + 2})`;
};
const ROLES = ROLE_NAMES.map((r) => `--md-sys-color-${r}: ${rgb(r)}`).join(';');

type Mode = 'default' | 'unselected' | 'selected';

interface Style {
  name: string;
  color: string;
  mode: Mode;
  container: string;
  icon: string;
  outline?: string;
}

// Role mappings from the md.comp.icon-button.* tokens.
const STYLES: Style[] = (['default', 'unselected', 'selected'] as const).flatMap((mode) => {
  const on = mode === 'selected';
  const off = mode === 'unselected';
  const s = (color: string, container: string, icon: string, outline?: string): Style => ({
    name: `${color} ${mode}`,
    color,
    mode,
    container,
    icon,
    outline,
  });
  return [
    s('filled', off ? 'surface-container' : 'primary', off ? 'on-surface-variant' : 'on-primary'),
    s('tonal', on ? 'secondary' : 'secondary-container', on ? 'on-secondary' : 'on-secondary-container'),
    s(
      'outlined',
      on ? 'inverse-surface' : 'transparent',
      on ? 'inverse-on-surface' : 'on-surface-variant',
      'outline-variant',
    ),
    s('standard', 'transparent', on ? 'primary' : 'on-surface-variant'),
  ];
});

async function mountButton(s: Style, disabled = false) {
  const container = document.createElement('div');
  container.style.cssText = `padding:64px;${ROLES}`;
  const type = s.mode === 'default' ? '' : 'type="toggle"';
  const selected = s.mode === 'selected' ? 'selected' : '';
  container.innerHTML = `<md-gb-icon-button aria-label="Favorite" color="${s.color}" ${type} ${selected} ${disabled ? 'disabled' : ''}>x</md-gb-icon-button>`;
  document.body.append(container);
  const el = container.firstElementChild as HTMLElement & {updateComplete: Promise<unknown>};
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="icon-btn"]')!;
  return {container, el, btn};
}

function settleTransitions(el: Element) {
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

const alpha = (color: string) => {
  const m = color.match(/\/\s*([\d.]+)\)/) ?? color.match(/rgba\([^)]*,\s*([\d.]+)\)/);
  return m ? Number(m[1]) : 1;
};

function expectLook(btn: HTMLElement, s: Style, what: string) {
  const css = getComputedStyle(btn);
  expect(css.backgroundColor)
    .withContext(`${what}: container ${s.container}`)
    .toBe(s.container === 'transparent' ? 'rgba(0, 0, 0, 0)' : rgb(s.container));
  expect(css.color).withContext(`${what}: icon ${s.icon}`).toBe(rgb(s.icon));
  if (s.outline) {
    expect(css.borderTopColor).withContext(`${what}: outline`).toBe(rgb(s.outline));
  }
}

// spec: icon-buttons-2487dc, icon-buttons-daa215, icon-buttons-f69b8e, icon-buttons-ddc3aa, icon-buttons-f17b1e, icon-buttons-4d202e, icon-buttons-b427a2, icon-buttons-9ad5a0, icon-buttons-ca25e5, icon-buttons-52cec7, icon-buttons-a1d5d3, icon-buttons-de70ff, icon-buttons-bd3033, icon-buttons-8099a4, icon-buttons-f90f62, icon-buttons-57efdd, icon-buttons-1794f3, icon-buttons-27eb11, icon-buttons-42f9bb, icon-buttons-5ac044, icon-buttons-dc4e27, icon-buttons-065cad, icon-buttons-1e7032, icon-buttons-7c7fe8, icon-buttons-0007ef, icon-buttons-c7fce6, icon-buttons-de15e2, icon-buttons-12acb7, icon-buttons-002d54, icon-buttons-4b6f11, icon-buttons-d68eb4, icon-buttons-3a3367, icon-buttons-367fe6, icon-buttons-6b6ca9, icon-buttons-a030a7, icon-buttons-5a1196
// spec: icon-buttons-acf79e, icon-buttons-adb66c, icon-buttons-401294, icon-buttons-10955a, icon-buttons-facf66, icon-buttons-45ec1c
// spec: icon-buttons-61fc2b, icon-buttons-4b7d84, icon-buttons-4d0541, icon-buttons-263996, icon-buttons-5334fd, icon-buttons-e3aab6, icon-buttons-fc15d9, icon-buttons-4438f6, icon-buttons-401b2b, icon-buttons-eb3c30
// spec: icon-buttons-81445b, icon-buttons-8ed1f7, icon-buttons-2c00fe, icon-buttons-a6c530, icon-buttons-55d560, icon-buttons-afa2d3, icon-buttons-b1c006, icon-buttons-c33fb8, icon-buttons-c33cd0, icon-buttons-41172e, icon-buttons-700bfb
// spec: icon-buttons-522a79, icon-buttons-55abff, icon-buttons-6f8af4, icon-buttons-d6de64, icon-buttons-fbdc9e, icon-buttons-4d4d44, icon-buttons-a3122b, icon-buttons-be8d6c, icon-buttons-abd35e, icon-buttons-ac0901, icon-buttons-936079
// spec: icon-buttons-e1400f, icon-buttons-a43bb4, icon-buttons-66cf7c, icon-buttons-6a061e, icon-buttons-82f139, icon-buttons-98ce26, icon-buttons-75fb28, icon-buttons-451efc, icon-buttons-b7133a, icon-buttons-0854c1, icon-buttons-ba80b5, icon-buttons-51521d, icon-buttons-ef6060
// spec: icon-buttons-207565, icon-buttons-984466
describe('<md-gb-icon-button> color styles and states (spec)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  for (const s of STYLES) {
    describe(s.name, () => {
      it('shows the enabled state in its role colors, with no state layer', async () => {
        const {container, el, btn} = await mountButton(s);
        expectLook(btn, s, 'enabled');
        for (const ripple of ripplesOf(el)) {
          expect(prop(ripple, '--ripple-hover-opacity')).toBe('0%');
          expect(prop(ripple, '--ripple-press-opacity')).toBe('0%');
        }
        container.remove();
      });

      it('shows an 8% state layer when hovered', async () => {
        const {container, el, btn} = await mountButton(s);
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        settleTransitions(el);
        expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        expectLook(btn, s, 'hovered');
        container.remove();
      });

      it('shows the focus indicator and a 10% layer when focused by keyboard', async () => {
        const {container, el, btn} = await mountButton(s);
        await sendKeys({press: 'Shift'});
        el.focus();
        settleTransitions(el);
        expect(btn.matches(':focus-visible')).toBeTrue();
        expect(focusRingsOf(el).some((r) => prop(r, '--focus-ring-outline') !== 'none')).toBeTrue();
        expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '10%')).toBeTrue();
        expectLook(btn, s, 'focused');
        container.remove();
      });

      it('shows a 10% pressed layer while pressed', async () => {
        const {container, el, btn} = await mountButton(s);
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        settleTransitions(el);
        expect(ripplesOf(el).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
        expectLook(btn, s, 'pressed');
        await sendMouse({type: 'up'});
        container.remove();
      });

      it('shows a disabled state at 38% icon and 10% container opacity', async () => {
        const {container, btn} = await mountButton(s, true);
        const css = getComputedStyle(btn);
        expect(alpha(css.color)).toBeCloseTo(0.38, 2);
        expect(alpha(css.backgroundColor)).toBeCloseTo(0.1, 2);
        if (s.color === 'outlined' && s.mode !== 'selected') {
          expect(alpha(css.borderTopColor)).toBeCloseTo(0.12, 2);
        }
        container.remove();
      });
    });
  }
});
