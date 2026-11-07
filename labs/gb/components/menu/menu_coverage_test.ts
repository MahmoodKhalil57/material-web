/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Spec coverage for menus: the selected item's visual cues beyond color.

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import './md-gb-menu.js';
import './md-gb-menu-group.js';
import './md-gb-menu-item.js';
import {type MenuItemElement} from './menu-item-element.js';

describe('menu selected-item cues', () => {
  const env = new Environment();

  async function setup() {
    const root = env.render(html`<md-gb-menu>
      <md-gb-menu-group checkable="single">
        <md-gb-menu-item id="selected" checked>Alaska</md-gb-menu-item>
        <md-gb-menu-item id="other">Alabama</md-gb-menu-item>
      </md-gb-menu-group>
    </md-gb-menu>`);
    await env.waitForStability();
    const selected = root.querySelector<MenuItemElement>('#selected')!;
    const other = root.querySelector<MenuItemElement>('#other')!;
    await selected.updateComplete;
    await other.updateComplete;
    return {selected, other};
  }

  // spec: menus-b9c8ac
  it('adds a checkmark to the selected item, besides its shape and color', async () => {
    const {selected, other} = await setup();
    // The selected item is marked by a check icon, not color alone.
    const check = selected.shadowRoot!.querySelector<HTMLElement>('.checkmark');
    expect(check).not.toBeNull();
    expect(check!.textContent!.trim()).toBe('check');
    expect(other.shadowRoot!.querySelector('.checkmark')).toBeNull();
    expect(selected.checked).toBeTrue();
    expect(other.checked).toBeFalse();
  });
});
