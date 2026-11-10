/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-fab.js';
import '../../styles/icon/md-gb-icon.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {
  center,
  deepElements,
  focusRingsOf,
  prop,
  ripplesOf,
} from '../shared/test-dom.js';

adoptStyles(document, [m3Styles]);

const ROLE_NAMES = [
  'primary',
  'on-primary',
  'secondary',
  'on-secondary',
  'tertiary',
  'on-tertiary',
  'primary-container',
  'on-primary-container',
  'secondary-container',
  'on-secondary-container',
  'tertiary-container',
  'on-tertiary-container',
];
const rgb = (role: string) => {
  const i = ROLE_NAMES.indexOf(role) + 1;
  return `rgb(${i * 7}, ${i * 3 + 1}, ${i * 5 + 2})`;
};
const ROLES = ROLE_NAMES.map((r) => `--md-sys-color-${r}: ${rgb(r)}`).join(';');

// Color style -> [container, content] roles (md.comp.fab.* tokens).
const COLORS: Array<[string, string, string]> = [
  ['primary-container', 'primary-container', 'on-primary-container'],
  ['secondary-container', 'secondary-container', 'on-secondary-container'],
  ['tertiary-container', 'tertiary-container', 'on-tertiary-container'],
  ['primary', 'primary', 'on-primary'],
  ['secondary', 'secondary', 'on-secondary'],
  ['tertiary', 'tertiary', 'on-tertiary'],
];

type Shape = 'icon-only' | 'extended';
type State = 'enabled' | 'hovered' | 'focused' | 'pressed';
// Container elevation level per state (floating-action-button.md States).
const ELEVATION: Record<State, number> = {enabled: 3, hovered: 4, focused: 3, pressed: 3};

async function mountFab(color: string, shape: Shape) {
  const container = document.createElement('div');
  container.style.cssText = `padding:64px;${ROLES}`;
  const label = shape === 'extended' ? 'label="Create"' : 'aria-label="Create"';
  container.innerHTML = `<md-gb-fab color="${color}" ${label}><md-gb-icon>add</md-gb-icon></md-gb-fab>`;
  document.body.append(container);
  const el = container.firstElementChild as HTMLElement & {updateComplete: Promise<unknown>};
  await el.updateComplete;
  await new Promise((r) => requestAnimationFrame(r));
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="fab"]')!;
  return {container, el, btn};
}

function resolved(container: HTMLElement, value: string) {
  const probe = document.createElement('span');
  probe.style.boxShadow = value;
  container.append(probe);
  const out = getComputedStyle(probe).boxShadow;
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

function expectLook(
  container: HTMLElement,
  btn: HTMLElement,
  bg: string,
  fg: string,
  state: State,
) {
  const css = getComputedStyle(btn);
  expect(css.backgroundColor).withContext(`${state}: container`).toBe(rgb(bg));
  expect(css.color).withContext(`${state}: content`).toBe(rgb(fg));
  expect(css.boxShadow)
    .withContext(`${state}: elevation ${ELEVATION[state]}`)
    .toBe(resolved(container, `var(--md-sys-elevation-shadow-${ELEVATION[state]})`));
}

// spec: floating-action-button-b27805, floating-action-button-5abaf6, floating-action-button-efe141, floating-action-button-68f90b, floating-action-button-802ba2, floating-action-button-8844b7, floating-action-button-283cb9, floating-action-button-aa20ae, floating-action-button-94676c, floating-action-button-ef487f, floating-action-button-62fcdb, floating-action-button-a26950, floating-action-button-338d7e, floating-action-button-83cc38, floating-action-button-0421d7, floating-action-button-851474
// spec: floating-action-button-7fad36, floating-action-button-2b74df, floating-action-button-5eb154, floating-action-button-cb591b
// spec: extended-fab-806107, extended-fab-febb92, extended-fab-a2ba4d, extended-fab-8176d5, extended-fab-050a40, extended-fab-89864c, extended-fab-c12ba9, extended-fab-8c7c56, extended-fab-961e26, extended-fab-24596e, extended-fab-3c42a5
// spec: extended-fab-0a24ba, extended-fab-bd0c20, extended-fab-d1563a, extended-fab-318637, extended-fab-337d7b, extended-fab-7dab54, extended-fab-2d7ecb, extended-fab-47b0d3, extended-fab-fe0e46, extended-fab-e31a2e, extended-fab-5d7e65
describe('<md-gb-fab> color styles and states (spec)', () => {
  afterEach(async () => {
    await sendMouse({type: 'up'}).catch(() => {});
    await sendMouse({type: 'move', position: [0, 0]});
  });

  for (const shape of ['icon-only', 'extended'] as const) {
    for (const [color, bg, fg] of COLORS) {
      describe(`${shape} ${color}`, () => {
        it('shows the enabled state in its role colors at elevation 3, with no state layer', async () => {
          const {container, el, btn} = await mountFab(color, shape);
          expectLook(container, btn, bg, fg, 'enabled');
          for (const ripple of ripplesOf(el)) {
            expect(prop(ripple, '--ripple-hover-opacity')).toBe('0%');
            expect(prop(ripple, '--ripple-press-opacity')).toBe('0%');
          }
          container.remove();
        });

        it('shows an 8% state layer and elevation 4 when hovered', async () => {
          const {container, el, btn} = await mountFab(color, shape);
          const c = center(btn);
          await sendMouse({type: 'move', position: [c.x, c.y]});
          settleTransitions(el);
          expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '8%')).toBeTrue();
          expectLook(container, btn, bg, fg, 'hovered');
          container.remove();
        });

        it('shows the focus indicator and a 10% layer when focused by keyboard', async () => {
          const {container, el, btn} = await mountFab(color, shape);
          await sendKeys({press: 'Shift'});
          el.focus();
          settleTransitions(el);
          expect(btn.matches(':focus-visible')).toBeTrue();
          expect(focusRingsOf(el).some((r) => prop(r, '--focus-ring-outline') !== 'none')).toBeTrue();
          expect(ripplesOf(el).some((r) => prop(r, '--ripple-hover-opacity') === '10%')).toBeTrue();
          expectLook(container, btn, bg, fg, 'focused');
          container.remove();
        });

        it('shows a 10% pressed layer while pressed', async () => {
          const {container, el, btn} = await mountFab(color, shape);
          const c = center(btn);
          await sendMouse({type: 'move', position: [c.x, c.y]});
          await sendMouse({type: 'down'});
          settleTransitions(el);
          expect(ripplesOf(el).some((r) => prop(r, '--ripple-press-opacity') === '10%')).toBeTrue();
          expectLook(container, btn, bg, fg, 'pressed');
          await sendMouse({type: 'up'});
          container.remove();
        });
      });
    }
  }
});
