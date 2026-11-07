/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-text-field.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import type {ReactiveElement} from 'lit';

adoptStyles(document, [m3Styles]);

let container: HTMLElement | undefined;

afterEach(() => container?.remove());

/** Renders the markup and waits for updates. */
async function mount(markup: string) {
  container?.remove();
  container = document.createElement('div');
  container.style.width = '400px';
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
  document.getAnimations().forEach((a) => a instanceof CSSTransition && a.finish());
}

function field(): HTMLElement {
  return container!.querySelector('md-gb-text-field') as HTMLElement;
}

/** The element with the given id in the field's shadow root. */
function byId(id: string): HTMLElement {
  return field().shadowRoot!.getElementById(id)!;
}

/** The elements the input's aria-describedby refers to. */
function describedByElements(): HTMLElement[] {
  const ids = (byId('input').getAttribute('aria-describedby') ?? '').split(/\s+/);
  return ids.filter(Boolean).map((id) => byId(id));
}

describe('<md-gb-text-field> supporting text', () => {
  // spec: text-fields-1f192d
  it('is the accessible description of the input', async () => {
    await mount('<md-gb-text-field label="Email" supporting-text="Use the company address"></md-gb-text-field>');
    const described = describedByElements();
    expect(described.map((el) => el.textContent?.trim())).toContain(
      'Use the company address',
    );

    // The description follows the text when it changes.
    field().setAttribute('supporting-text', 'Use your work address');
    await settle();
    expect(describedByElements().map((el) => el.textContent?.trim())).toContain(
      'Use your work address',
    );
  });

  // spec: text-fields-34cdb7
  it('exposes its own text as a readable element', async () => {
    await mount('<md-gb-text-field label="Email" supporting-text="Use the company address"></md-gb-text-field>');
    const supporting = byId('supporting-text');
    // The text is not hidden from assistive technology and has no role of
    // its own, so the text is what is read for it.
    expect(supporting.getAttribute('aria-hidden')).toBeNull();
    expect(getComputedStyle(supporting).display).not.toBe('none');
    expect(supporting.getAttribute('role')).toBeNull();
    expect(supporting.textContent?.trim()).toBe('Use the company address');
  });

  // spec: text-fields-34cdb7
  it('gives error text the alert role as its label', async () => {
    await mount(
      '<md-gb-text-field label="Email" supporting-text="Use the company address" error error-text="Not a valid address"></md-gb-text-field>',
    );
    const supporting = byId('supporting-text');
    expect(supporting.getAttribute('role')).toBe('alert');
    expect(supporting.textContent?.trim()).toBe('Not a valid address');
    expect(describedByElements()).toContain(supporting);
  });
});
