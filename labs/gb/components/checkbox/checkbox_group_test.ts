/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-checkbox.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type CheckboxElement} from './checkbox-element.js';
import {linkParentCheckbox} from './checkbox-group.js';

adoptStyles(document, [m3Styles]);

describe('<md-gb-checkbox> parent and child checkboxes', () => {
  const env = new Environment();

  async function setup(checked = [false, false, false]) {
    const root = env.render(html`
      <md-gb-checkbox id="parent" aria-label="All"></md-gb-checkbox>
      ${checked.map(
        (on, i) =>
          html`<md-gb-checkbox
            class="child"
            ?checked=${on}
            aria-label="Child ${i}"></md-gb-checkbox>`,
      )}
    `);
    await env.waitForStability();
    const parent = root.querySelector('#parent') as CheckboxElement;
    const children = [
      ...root.querySelectorAll<CheckboxElement>('.child'),
    ];
    const unlink = linkParentCheckbox(parent, children);
    await env.waitForStability();
    const click = async (box: CheckboxElement) => {
      box.shadowRoot!.querySelector('input')!.click();
      await env.waitForStability();
    };
    return {parent, children, unlink, click};
  }

  // spec: checkbox-1582b7, checkbox-410675
  it('checks every child when the parent is checked', async () => {
    const {parent, children, click} = await setup();
    await click(parent);
    expect(parent.checked).toBeTrue();
    expect(children.map((c) => c.checked)).toEqual([true, true, true]);
  });

  // spec: checkbox-05ff50
  it('unchecks every child when the parent is unchecked', async () => {
    const {parent, children, click} = await setup([true, true, true]);
    expect(parent.checked).toBeTrue();
    await click(parent);
    expect(parent.checked).toBeFalse();
    expect(children.map((c) => c.checked)).toEqual([false, false, false]);
  });

  // spec: checkbox-f03267, checkbox-39988a
  it('is indeterminate when some, but not all, children are checked', async () => {
    const {parent, children, click} = await setup([true, false, false]);
    expect(parent.indeterminate).toBeTrue();
    expect(parent.checked).toBeFalse();
    await click(children[1]);
    expect(parent.indeterminate).toBeTrue();
    await click(children[2]);
    expect(parent.indeterminate).toBeFalse();
    expect(parent.checked).toBeTrue();
  });

  // spec: checkbox-daea52
  it('becomes indeterminate when one child is unchecked', async () => {
    const {parent, children, click} = await setup([true, true, true]);
    await click(children[0]);
    expect(parent.indeterminate).toBeTrue();
    expect(parent.checked).toBeFalse();
  });

  // spec: checkbox-f03267, checkbox-bd6ddd
  it('checks every child when an indeterminate parent is selected', async () => {
    const {parent, children, click} = await setup([true, false, false]);
    expect(parent.indeterminate).toBeTrue();
    await click(parent);
    expect(parent.indeterminate).toBeFalse();
    expect(parent.checked).toBeTrue();
    expect(children.map((c) => c.checked)).toEqual([true, true, true]);
  });

  it('stops syncing after it is unlinked', async () => {
    const {parent, children, unlink, click} = await setup();
    unlink();
    await click(parent);
    expect(children.map((c) => c.checked)).toEqual([false, false, false]);
  });
});

describe('<md-gb-checkbox> with a text label', () => {
  const env = new Environment();

  // spec: checkbox-18586c, checkbox-9c36b4
  it('is selected by the text label as well as by the checkbox', async () => {
    const root = env.render(html`
      <label id="wrap"><md-gb-checkbox></md-gb-checkbox> <span>Remember me</span></label>
      <md-gb-checkbox id="for"></md-gb-checkbox>
      <label id="forLabel" for="for">Subscribe</label>
    `);
    await env.waitForStability();
    const wrapped = root.querySelector('#wrap md-gb-checkbox') as CheckboxElement;
    root.querySelector<HTMLElement>('#wrap span')!.click();
    await env.waitForStability();
    expect(wrapped.checked).toBeTrue();
    wrapped.shadowRoot!.querySelector('input')!.click();
    await env.waitForStability();
    expect(wrapped.checked).toBeFalse();

    const other = root.querySelector('#for') as CheckboxElement;
    root.querySelector<HTMLElement>('#forLabel')!.click();
    await env.waitForStability();
    expect(other.checked).toBeTrue();
  });

  // spec: checkbox-b28a51, checkbox-57bea4
  it('takes its accessibility label from the adjacent text label', async () => {
    const root = env.render(html`
      <label><md-gb-checkbox></md-gb-checkbox> Remember me</label>
    `);
    await env.waitForStability();
    const box = root.querySelector('md-gb-checkbox') as CheckboxElement;
    await box.updateComplete;
    expect(box.shadowRoot!.querySelector('input')!.getAttribute('aria-label')).toBe(
      'Remember me',
    );
  });
});
