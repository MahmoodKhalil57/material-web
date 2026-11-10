/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {emulateMedia, sendKeys} from '@web/test-runner-commands';
import {html, LitElement, nothing} from 'lit';

import {
  applyDisclosure,
  DisclosureController,
  type DisclosureOptions,
  expandedUnlessFalseConverter,
  reflectedExpandedConverter,
  parseTime,
  prefersReducedMotion,
  readMotion,
  requestToggle,
} from './disclosure.js';

/** A disclosure host: a trigger (native button or div) and a region. */
class TestDisclosure extends LitElement {
  static override properties = {
    expanded: {type: Boolean, reflect: true},
    native: {type: Boolean},
    disabled: {type: Boolean},
    hide: {type: String},
    noRegion: {type: Boolean},
    enabledFlag: {type: Boolean},
  };
  expanded = false;
  native = true;
  disabled = false;
  hide: 'inert' | 'hidden' | 'none' = 'inert';
  noRegion = false;
  enabledFlag = true;
  controller!: DisclosureController;

  override connectedCallback() {
    this.controller ??= new DisclosureController(this, {
      trigger: () => this.renderRoot.querySelector<HTMLElement>('#trigger'),
      region: () => this.renderRoot.querySelector<HTMLElement>('#region'),
      expanded: () => this.expanded,
      setExpanded: (value) => {
        this.expanded = value;
      },
      disabled: () => this.disabled,
      enabled: () => this.enabledFlag,
      hide: this.hide,
      keys: true,
    } satisfies DisclosureOptions);
    super.connectedCallback();
  }

  protected override render() {
    const trigger = this.native
      ? html`<button id="trigger">Toggle</button>`
      : html`<div id="trigger" role="button" tabindex="0">Toggle</div>`;
    return html`${trigger}${this.noRegion
      ? nothing
      : html`<div id="region"><button id="inner">Inside</button></div>`}`;
  }
}
customElements.define('test-disclosure', TestDisclosure);

let container: HTMLElement | undefined;

async function setup(init: Partial<TestDisclosure> = {}) {
  container?.remove();
  container = document.createElement('div');
  document.body.append(container);
  const host = document.createElement('test-disclosure') as TestDisclosure;
  Object.assign(host, init);
  container.append(host);
  await host.updateComplete;
  const trigger = host.shadowRoot!.querySelector<HTMLElement>('#trigger')!;
  const region = host.shadowRoot!.querySelector<HTMLElement>('#region');
  const toggles: ToggleEvent[] = [];
  host.addEventListener('toggle', (e) => toggles.push(e as ToggleEvent));
  return {host, trigger, region, toggles};
}

afterEach(() => container?.remove());

describe('expanded attribute converters', () => {
  it('expandedUnlessFalseConverter: expanded unless the attribute says "false"', () => {
    const c = expandedUnlessFalseConverter;
    expect(c.fromAttribute('')).toBeTrue();
    expect(c.fromAttribute('true')).toBeTrue();
    expect(c.fromAttribute('false')).toBeFalse();
    // Removing the attribute goes back to the default, expanded.
    expect(c.fromAttribute(null)).toBeTrue();
  });

  it('reflectedExpandedConverter: reflects a bare attribute, "false" or no attribute collapses', () => {
    const c = reflectedExpandedConverter;
    expect(c.fromAttribute('')).toBeTrue();
    expect(c.fromAttribute('true')).toBeTrue();
    expect(c.fromAttribute('false')).toBeFalse();
    expect(c.fromAttribute(null)).toBeFalse();
    expect(c.toAttribute(true)).toBe('');
    expect(c.toAttribute(false)).toBeNull();
  });
});

describe('parseTime()', () => {
  it('reads ms and s', () => {
    expect(parseTime('420ms')).toBe(420);
    expect(parseTime(' 0.5s ')).toBe(500);
    expect(parseTime('0ms')).toBe(0);
  });

  it('is NaN for anything else', () => {
    expect(parseTime('')).toBeNaN();
    expect(parseTime('fast')).toBeNaN();
    expect(parseTime('10px')).toBeNaN();
  });
});

describe('applyDisclosure()', () => {
  let trigger: HTMLElement;
  let region: HTMLElement;

  beforeEach(() => {
    trigger = document.createElement('button');
    region = document.createElement('div');
    region.id = 'r';
  });

  it('sets aria-expanded and aria-controls on the trigger', () => {
    applyDisclosure(false, {trigger, region});
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe('r');
    applyDisclosure(true, {trigger, region});
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('gives a region without an id one, so aria-controls always resolves', () => {
    region.removeAttribute('id');
    applyDisclosure(true, {trigger, region});
    expect(region.id).not.toBe('');
    expect(trigger.getAttribute('aria-controls')).toBe(region.id);
  });

  it('drops aria-controls without a region', () => {
    trigger.setAttribute('aria-controls', 'gone');
    applyDisclosure(true, {trigger});
    expect(trigger.hasAttribute('aria-controls')).toBeFalse();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('makes a collapsed region inert, and an expanded one interactive', () => {
    applyDisclosure(false, {trigger, region});
    expect(region.inert).toBeTrue();
    applyDisclosure(true, {trigger, region});
    expect(region.inert).toBeFalse();
  });

  it('can hide the collapsed region with hidden instead, or not at all', () => {
    applyDisclosure(false, {trigger, region, hide: 'hidden'});
    expect(region.hidden).toBeTrue();
    expect(region.inert).toBeFalse();
    applyDisclosure(true, {trigger, region, hide: 'hidden'});
    expect(region.hidden).toBeFalse();
    applyDisclosure(false, {trigger, region, hide: 'none'});
    expect(region.hidden || region.inert).toBeFalse();
  });

  it('leaves ARIA off the trigger with aria: false', () => {
    applyDisclosure(false, {trigger, region, aria: false});
    expect(trigger.hasAttribute('aria-expanded')).toBeFalse();
    expect(trigger.hasAttribute('aria-controls')).toBeFalse();
    expect(region.inert).toBeTrue();
  });
});

describe('requestToggle()', () => {
  it('fires a cancelable toggle event with the old and new state', () => {
    const target = new EventTarget();
    const events: ToggleEvent[] = [];
    target.addEventListener('toggle', (e) => events.push(e as ToggleEvent));
    expect(requestToggle(target, false)).toBeTrue();
    expect(requestToggle(target, true)).toBeTrue();
    expect(events[0].cancelable).toBeTrue();
    expect([events[0].oldState, events[0].newState]).toEqual(['closed', 'open']);
    expect([events[1].oldState, events[1].newState]).toEqual(['open', 'closed']);
  });

  it('reports a cancelled event', () => {
    const target = new EventTarget();
    target.addEventListener('toggle', (e) => e.preventDefault());
    expect(requestToggle(target, false)).toBeFalse();
  });
});

describe('DisclosureController', () => {
  describe('state in the DOM', () => {
    it('applies aria-expanded, aria-controls and inert after the first render', async () => {
      const {trigger, region} = await setup();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.getAttribute('aria-controls')).toBe(region!.id);
      expect(region!.inert).toBeTrue();
    });

    it('follows the host property', async () => {
      const {host, trigger, region} = await setup();
      host.expanded = true;
      await host.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(region!.inert).toBeFalse();
      host.expanded = false;
      await host.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(region!.inert).toBeTrue();
    });

    it('takes a collapsed region out of the tab order', async () => {
      const {host, region} = await setup();
      const inner = region!.querySelector<HTMLElement>('#inner')!;
      inner.focus();
      expect(host.shadowRoot!.activeElement).not.toBe(inner);
      host.expanded = true;
      await host.updateComplete;
      inner.focus();
      expect(host.shadowRoot!.activeElement).toBe(inner);
    });

    it('works without a region or a trigger', async () => {
      const {host, trigger} = await setup({noRegion: true});
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.hasAttribute('aria-controls')).toBeFalse();
      host.expanded = true;
      await host.updateComplete;
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('does nothing while not enabled, and hides again once enabled', async () => {
      const {host, trigger, region} = await setup({enabledFlag: false});
      expect(region!.inert).toBeFalse();
      expect(trigger.hasAttribute('aria-expanded')).toBeFalse();
      expect(host.controller.toggle()).toBeFalse();
      host.enabledFlag = true;
      await host.updateComplete;
      expect(region!.inert).toBeTrue();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('re-binds when the trigger element is replaced', async () => {
      const {host, toggles} = await setup();
      host.native = false;
      await host.updateComplete;
      const next = host.shadowRoot!.querySelector<HTMLElement>('#trigger')!;
      expect(next.getAttribute('aria-expanded')).toBe('false');
      next.click();
      await host.updateComplete;
      expect(host.expanded).toBeTrue();
      expect(toggles.length).toBe(1);
    });
  });

  describe('user toggles', () => {
    it('toggles on a click of the trigger', async () => {
      const {host, trigger, region} = await setup();
      trigger.click();
      await host.updateComplete;
      expect(host.expanded).toBeTrue();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(region!.inert).toBeFalse();
      trigger.click();
      await host.updateComplete;
      expect(host.expanded).toBeFalse();
    });

    it('applies the state at once, before the next render', async () => {
      const {host, trigger, region} = await setup();
      trigger.click();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
      expect(region!.inert).toBeFalse();
      await host.updateComplete;
    });

    it('toggles a native button with Enter and with Space', async () => {
      const {host, trigger} = await setup();
      trigger.focus();
      await sendKeys({press: 'Enter'});
      expect(host.expanded).toBeTrue();
      await sendKeys({press: 'Space'});
      expect(host.expanded).toBeFalse();
    });

    it('toggles a custom trigger with Enter, and with Space on release', async () => {
      const {host, trigger, toggles} = await setup({native: false});
      trigger.focus();
      await sendKeys({press: 'Enter'});
      expect(host.expanded).toBeTrue();
      await sendKeys({down: 'Space'});
      expect(host.expanded).toBeTrue();
      await sendKeys({up: 'Space'});
      expect(host.expanded).toBeFalse();
      expect(toggles.length).toBe(2);
    });

    it('does not scroll the page for Space on a custom trigger', async () => {
      const {trigger} = await setup({native: false});
      trigger.focus();
      const down = new KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true});
      trigger.dispatchEvent(down);
      expect(down.defaultPrevented).toBeTrue();
    });

    it('ignores other keys and modified Enter', async () => {
      const {host, trigger} = await setup({native: false});
      trigger.focus();
      await sendKeys({press: 'a'});
      await sendKeys({press: 'Shift+Enter'});
      await sendKeys({press: 'ArrowDown'});
      expect(host.expanded).toBeFalse();
    });

    it('ignores a disabled disclosure', async () => {
      const {host, trigger, toggles} = await setup({disabled: true});
      trigger.click();
      expect(host.controller.toggle()).toBeFalse();
      expect(host.expanded).toBeFalse();
      expect(toggles.length).toBe(0);
    });

    it('expand() and collapse() only change what is not already so', async () => {
      const {host, toggles} = await setup();
      expect(host.controller.collapse()).toBeFalse();
      expect(host.controller.expand()).toBeTrue();
      expect(host.controller.expand()).toBeFalse();
      expect(host.controller.collapse()).toBeTrue();
      expect(toggles.length).toBe(2);
    });
  });

  describe('toggle event', () => {
    it('is cancelable, fires before the state changes and carries both states', async () => {
      const {host, trigger} = await setup();
      let during: boolean | undefined;
      host.addEventListener('toggle', (e) => {
        during = host.expanded;
        expect(e.cancelable).toBeTrue();
      });
      trigger.click();
      expect(during).toBeFalse();
      const events: ToggleEvent[] = [];
      host.addEventListener('toggle', (e) => events.push(e as ToggleEvent));
      trigger.click();
      expect([events[0].oldState, events[0].newState]).toEqual(['open', 'closed']);
    });

    it('keeps the state when it is cancelled', async () => {
      const {host, trigger, region} = await setup();
      host.addEventListener('toggle', (e) => e.preventDefault());
      trigger.click();
      await host.updateComplete;
      expect(host.expanded).toBeFalse();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(region!.inert).toBeTrue();
    });

    it('does not fire when the host sets the property', async () => {
      const {host, toggles} = await setup();
      host.expanded = true;
      await host.updateComplete;
      expect(toggles.length).toBe(0);
    });
  });

  describe('motion', () => {
    afterEach(() => emulateMedia({reducedMotion: 'no-preference'}));

    it('reads the spring from the motion tokens', async () => {
      const {host, region} = await setup();
      region!.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '300ms');
      region!.style.setProperty('--md-sys-motion-spring-default-spatial', 'linear(0, 1)');
      const motion = host.controller.motion();
      expect(motion.duration).toBe(300);
      expect(motion.easing).toBe('linear(0, 1)');
      expect(motion.reduced).toBeFalse();
    });

    it('reads another spring', async () => {
      const {region} = await setup();
      region!.style.setProperty('--md-sys-motion-spring-fast-spatial-duration', '0.15s');
      expect(readMotion(region!, 'fast-spatial').duration).toBe(150);
    });

    it('falls back to the default spring duration without tokens', async () => {
      const {region} = await setup();
      region!.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '');
      expect(readMotion(region!).duration).toBe(420);
    });

    it('has no duration when the user prefers reduced motion', async () => {
      await emulateMedia({reducedMotion: 'reduce'});
      const {host, region} = await setup();
      region!.style.setProperty('--md-sys-motion-spring-default-spatial-duration', '300ms');
      expect(prefersReducedMotion()).toBeTrue();
      const motion = host.controller.motion();
      expect(motion.duration).toBe(0);
      expect(motion.easing).toBe('linear');
      expect(motion.reduced).toBeTrue();
    });
  });
});
