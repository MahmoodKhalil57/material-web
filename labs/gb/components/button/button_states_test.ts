/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-button.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {
  center,
  deepElements,
  focusRingsOf,
  prop,
  ripplesOf,
} from '../shared/test-dom.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

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
  'surface-container-low',
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

type Role = string | 'transparent';

/** What a state looks like. Unset fields are not checked. */
interface Look {
  container?: Role;
  label?: Role;
  /** The outline color. */
  outline?: Role;
  /** Elevation level of the container shadow. */
  elevation?: number;
}

interface Style {
  name: string;
  color: string;
  mode: 'default' | 'unselected' | 'selected';
  looks: Partial<Record<State, Look>>;
}

type State = 'enabled' | 'hovered' | 'focused' | 'pressed' | 'disabled';

// Role mappings and container elevations from the md.comp.button.* tokens.
// (Hovered elevation is checked in button_gap.ts.)
function style(
  color: string,
  mode: Style['mode'],
  container: Role,
  label: Role,
  elevation: number,
  outline?: Role,
): Style {
  const resting = {container, label, elevation, outline};
  return {
    name: `${color} ${mode}`,
    color,
    mode,
    looks: {
      enabled: resting,
      hovered: {container, label},
      focused: {container, label, elevation},
      pressed: {container, label, elevation},
      disabled: {elevation: 0},
    },
  };
}

const STYLES: Style[] = [
  ...(['default', 'unselected', 'selected'] as const).flatMap((mode) => {
    const on = mode === 'selected';
    const off = mode === 'unselected';
    return [
      style('filled', mode, off ? 'surface-container' : 'primary', off ? 'on-surface-variant' : 'on-primary', 0),
      style('elevated', mode, on ? 'primary' : 'surface-container-low', on ? 'on-primary' : 'primary', 1),
      style('tonal', mode, on ? 'secondary' : 'secondary-container', on ? 'on-secondary' : 'on-secondary-container', 0),
      style('outlined', mode, on ? 'inverse-surface' : 'transparent', on ? 'inverse-on-surface' : 'on-surface-variant', 0, 'outline-variant'),
    ];
  }),
  style('text', 'default', 'transparent', 'primary', 0),
];

async function mountButton(s: Style, disabled = false) {
  const container = document.createElement('div');
  container.style.cssText = `padding:64px;${ROLES}`;
  const type = s.mode === 'default' ? '' : 'type="toggle"';
  const selected = s.mode === 'selected' ? 'selected' : '';
  container.innerHTML = `<md-gb-button color="${s.color}" ${type} ${selected} ${disabled ? 'disabled' : ''}>Label</md-gb-button>`;
  document.body.append(container);
  const el = container.firstElementChild as HTMLElement & {updateComplete: Promise<unknown>};
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="btn"]')!;
  return {container, el, btn};
}

function resolved(container: HTMLElement, property: string, value: string) {
  const probe = document.createElement('span');
  probe.style.setProperty(property, value);
  container.append(probe);
  const out = getComputedStyle(probe).getPropertyValue(property);
  probe.remove();
  return out;
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
  return m ? Number(m[1]) : color === 'rgba(0, 0, 0, 0)' ? 0 : 1;
};

function expectLook(container: HTMLElement, btn: HTMLElement, look: Look, what: string) {
  const css = getComputedStyle(btn);
  if (look.container !== undefined) {
    expect(css.backgroundColor)
      .withContext(`${what}: container ${look.container}`)
      .toBe(look.container === 'transparent' ? 'rgba(0, 0, 0, 0)' : rgb(look.container));
  }
  if (look.label !== undefined) {
    expect(css.color).withContext(`${what}: label ${look.label}`).toBe(rgb(look.label));
  }
  if (look.outline !== undefined) {
    expect(css.borderTopColor)
      .withContext(`${what}: outline ${look.outline}`)
      .toBe(rgb(look.outline));
  }
  if (look.elevation !== undefined) {
    expect(css.boxShadow)
      .withContext(`${what}: elevation ${look.elevation}`)
      .toBe(resolved(container, 'box-shadow', `var(--md-sys-elevation-shadow-${look.elevation})`));
  }
}

// spec: buttons-c1abef, buttons-939e53, buttons-fcc7c9, buttons-8504d4, buttons-190584, buttons-fb1353, buttons-ab3a7e, buttons-bdef24, buttons-1eb9fe, buttons-65232a, buttons-750c43, buttons-9dd8d2, buttons-ef454d, buttons-8cc0b3, buttons-dd2cbc, buttons-010f48, buttons-339ef1, buttons-164b5b, buttons-5183d5, buttons-449d3f, buttons-9397f6, buttons-d385ca, buttons-ceea57, buttons-d45a79, buttons-2a6c51, buttons-4f6e47, buttons-7ad62e, buttons-b58898, buttons-e8a614, buttons-bba297, buttons-7848b9, buttons-ecb90c, buttons-0e59d5, buttons-0cae71, buttons-e96c19, buttons-2e8374, buttons-e6da97, buttons-6f7d33, buttons-3958b9
// spec: buttons-feea87, buttons-78e204, buttons-c29d50, buttons-3ac35e, buttons-0dbd05, buttons-e6c1e1, buttons-76428a, buttons-76a95e, buttons-c7515f, buttons-19044a, buttons-1e47bb, buttons-52f191, buttons-52ff0f, buttons-cc8374, buttons-9785e2, buttons-ce7192, buttons-a43626, buttons-0d48ee, buttons-734a9e, buttons-bcfe7d, buttons-7fa735, buttons-79b9de, buttons-f62fb2, buttons-648a21, buttons-61440a, buttons-4532c3, buttons-6b36b2, buttons-5c4bc5, buttons-1a4d22, buttons-6f5b32, buttons-e7e4f0, buttons-19836f, buttons-ce4357, buttons-b91180, buttons-5c27c6, buttons-8c9e53, buttons-2e2904, buttons-40ec9b, buttons-b75629, buttons-3b607c, buttons-418230, buttons-aa1a43, buttons-7b3ee6, buttons-b03462, buttons-d79394, buttons-2e878a, buttons-bcfcd6, buttons-16a5b6, buttons-c1abef, buttons-f4cc91, buttons-3754d2
// The Hovered units of the elevated, filled and tonal styles (hover
// elevation) and the Disabled units of the outlined style (outline opacity)
// are not cited: see button_gap.ts and shared/central/disabled_gap.ts.
describe('<md-gb-button> color styles and states (spec)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  for (const s of STYLES) {
    describe(s.name, () => {
      it('shows the enabled state in its role colors, with no state layer', async () => {
        const {container, el, btn} = await mountButton(s);
        expectLook(container, btn, s.looks.enabled!, 'enabled');
        for (const ripple of ripplesOf(el)) {
          expect(prop(ripple, '--ripple-hover-opacity')).toBe('0%');
          expect(prop(ripple, '--ripple-press-opacity')).toBe('0%');
        }
        container.remove();
      });

      it('shows an 8% state layer in the content color when hovered', async () => {
        const {container, el, btn} = await mountButton(s);
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        settleTransitions(el);
        expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
        expectLook(container, btn, s.looks.hovered!, 'hovered');
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
        expectLook(container, btn, s.looks.focused!, 'focused');
        container.remove();
      });

      it('shows a 10% pressed layer while pressed', async () => {
        const {container, el, btn} = await mountButton(s);
        const c = center(btn);
        await sendMouse({type: 'move', position: [c.x, c.y]});
        await sendMouse({type: 'down'});
        settleTransitions(el);
        expect(ripplesOf(el).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
        expectLook(container, btn, s.looks.pressed!, 'pressed');
        await sendMouse({type: 'up'});
        container.remove();
      });

      it('shows a disabled state at 38% label and 10% container opacity, without elevation', async () => {
        const {container, btn} = await mountButton(s, true);
        const css = getComputedStyle(btn);
        expect(alpha(css.color)).toBeCloseTo(0.38, 2);
        if (s.color !== 'text' && !(s.color === 'outlined' && s.mode === 'selected')) {
          expect(alpha(css.backgroundColor)).toBeCloseTo(s.color === 'outlined' ? 0.1 : 0.1, 2);
        }
        expectLook(container, btn, s.looks.disabled!, 'disabled');
        container.remove();
      });
    });
  }
});
