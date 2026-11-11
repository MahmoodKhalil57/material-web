/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-fab.js';
import '../../styles/icons/md-gb-icon.js';

import {sendKeys, sendMouse} from '@web/test-runner-commands';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {center} from '../../testing/subjects.js';
import {type TooltipElement} from '../tooltip/tooltip-element.js';

adoptStyles(document, [m3Styles]);

const containers: HTMLElement[] = [];

async function mount(attrs: string) {
  const container = document.createElement('div');
  container.style.padding = '96px';
  containers.push(container);
  container.innerHTML = `<button id="before">Before</button><md-gb-fab ${attrs}><md-gb-icon>edit</md-gb-icon></md-gb-fab>`;
  document.body.append(container);
  const el = container.querySelector('md-gb-fab') as HTMLElement & {
    updateComplete: Promise<unknown>;
  };
  await el.updateComplete;
  const tooltip = el.shadowRoot!.querySelector<TooltipElement>('md-gb-tooltip');
  const btn = el.shadowRoot!.querySelector<HTMLElement>('[part="fab"]')!;
  return {el, btn, tooltip};
}

const isOpen = (tooltip: TooltipElement | null) =>
  !!tooltip?.matches(':popover-open');

describe('<md-gb-fab> tooltip', () => {
  afterEach(async () => {
    await sendMouse({type: 'move', position: [0, 0]});
    for (const c of containers.splice(0)) c.remove();
  });

  // spec: floating-action-button-9b4a2e
  it('shows a tooltip with its text label when hovered', async () => {
    const {btn, tooltip} = await mount('aria-label="Compose"');
    expect(tooltip).not.toBeNull();
    expect(tooltip!.textContent!.trim()).toBe('Compose');
    expect(isOpen(tooltip)).toBeFalse();
    const c = center(btn);
    await sendMouse({type: 'move', position: [c.x, c.y]});
    expect(isOpen(tooltip)).toBeTrue();
  });

  // spec: floating-action-button-176807, floating-action-button-39b69b, floating-action-button-b7f351
  it('shows the tooltip with its label when focused by keyboard', async () => {
    const {el, tooltip} = await mount('aria-label="Compose"');
    await sendKeys({press: 'Tab'});
    await sendKeys({press: 'Tab'});
    expect(el.matches(':focus-within')).toBeTrue();
    expect(isOpen(tooltip)).toBeTrue();
    expect(tooltip!.textContent!.trim()).toBe('Compose');
  });

  it('names a collapsed extended FAB in its tooltip and skips one with a visible label', async () => {
    const collapsed = await mount('label="Compose" expanded="false"');
    expect(collapsed.tooltip!.textContent!.trim()).toBe('Compose');
    const expanded = await mount('label="Compose"');
    expect(expanded.tooltip).toBeNull();
  });

  it('can turn the tooltip off', async () => {
    const {tooltip} = await mount('aria-label="Compose" tooltip="false"');
    expect(tooltip).toBeNull();
  });
});
