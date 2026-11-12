/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Renders json-render specs (./schema.js) of the library's
 * catalog (./catalog.js) into md-gb-* elements, with lit-html.
 *
 * - Props are set as element properties after json-render resolves their
 *   expressions (`$state`, `$item`, `$cond`, `$template`, `$computed`).
 * - `visible` hides an element, `repeat` renders its children once per item
 *   of a state array (with `$item` / `$index` / `$bindItem`).
 * - `on` binds DOM events to actions: the built-in `setState`, `pushState`
 *   and `removeState`, and the app's `handlers`. `press` means `click`.
 * - `$bindState` / `$bindItem` props write the element's value back to state
 *   on `input` and `change` (and its `open` state on open and close events).
 * - Named slots set the children's `slot` attribute; text in a named slot is
 *   wrapped in a `<span slot>`.
 *
 * The state store re-renders on change; lit-html keeps the DOM and only
 * updates what changed. Element tags come only from the catalog, and `Html`
 * only creates the native elements of `HTML_TAGS`, with URL attributes
 * sanitized, so a spec from a model can't inject markup or script.
 */

import {
  createStateStore,
  evaluateVisibility,
  executeAction,
  getByPath,
  resolveActionParam,
  resolveBindings,
  resolveElementProps,
  resolveRepeatStatePath,
  type ActionBinding,
  type ComputedFunction,
  type PropResolutionContext,
  type Spec,
  type StateStore,
  type UIElement,
} from '@json-render/core';
import {nothing, render, type TemplateResult} from 'lit';
import {
  directive,
  Directive,
  type ElementPart,
  type PartInfo,
  PartType,
} from 'lit/directive.js';
import {repeat} from 'lit/directives/repeat.js';
import {html, unsafeStatic} from 'lit/static-html.js';
import {setAnchorHref} from 'safevalues/dom';

import {COMPONENTS, HTML_ATTRIBUTES, HTML_TAG, HTML_TAGS, TEXT_TAG} from './catalog.js';
import {isSafeSrc} from './urls.js';

/** An app action: gets the resolved params. */
export type ActionHandler = (params: Record<string, unknown>) => unknown;

/** Options of `renderSpec()`. */
export interface RenderSpecOptions {
  /** App actions by name, for `on` bindings beyond the built-in ones. */
  handlers?: Record<string, ActionHandler>;
  /** Functions for `$computed` props. */
  functions?: Record<string, ComputedFunction>;
  /** A state store to use instead of one seeded from `spec.state`. */
  store?: StateStore;
  /** Called for problems that skip part of the spec (unknown types, keys). */
  onWarning?: (message: string) => void;
}

/** A rendered spec. */
export interface RenderedSpec {
  /** The state the spec reads and writes. */
  readonly store: StateStore;
  /** Renders another spec into the same container, keeping the DOM it can. */
  update(spec: Spec): void;
  /** Stops re-rendering on state changes and clears the container. */
  dispose(): void;
}

type Component = (typeof COMPONENTS)[keyof typeof COMPONENTS];
const components = COMPONENTS as Record<string, Component>;
const HTML_ALLOWED = new Set<string>(HTML_TAGS);

/** Events after which a two-way bound prop is read back. */
const WRITE_BACK_EVENTS = ['input', 'change', 'opened', 'closed', 'toggle'];

/** Built-in actions (./schema.js BUILT_IN_ACTIONS). */
function builtIns(store: StateStore): Record<string, ActionHandler> {
  return {
    setState: ({statePath, value}) => store.set(String(statePath), value),
    pushState: ({statePath, value}) => {
      const list = store.get(String(statePath));
      store.set(String(statePath), [...(Array.isArray(list) ? list : []), value]);
    },
    removeState: ({statePath, index}) => {
      const list = store.get(String(statePath));
      if (!Array.isArray(list)) return;
      store.set(
        String(statePath),
        list.filter((_, i) => i !== Number(index)),
      );
    },
  };
}


/** What the props directive needs, refreshed on every render. */
interface ElementState {
  type: string;
  props: Record<string, unknown>;
  slot?: string;
  bindings?: Record<string, string>;
  on?: Record<string, ActionBinding | ActionBinding[]>;
  ctx: PropResolutionContext;
  runtime: Runtime;
}

/** The renderer's shared state. */
interface Runtime {
  store: StateStore;
  handlers: Record<string, ActionHandler>;
  functions?: Record<string, ComputedFunction>;
  warn: (message: string) => void;
}

/**
 * Applies an element's resolved props, slot, event bindings and two-way
 * bindings (an element-part directive).
 */
class ApplyDirective extends Directive {
  private element?: Element;
  private state?: ElementState;
  /** The element's own value of each prop before the spec set it. */
  private readonly defaults = new Map<string, unknown>();
  private readonly listening = new Set<string>();

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('apply() goes on an element.');
    }
  }

  render(_state: ElementState) {
    return nothing;
  }

  override update(part: ElementPart, [state]: [ElementState]) {
    const el = part.element;
    this.element = el;
    const previous = this.state;
    this.state = state;
    if (state.slot) el.setAttribute('slot', state.slot);
    else el.removeAttribute('slot');

    if (state.type === 'Html') {
      this.applyHtml(el, state.props);
    } else {
      const target = el as unknown as Record<string, unknown>;
      for (const [name, value] of Object.entries(state.props)) {
        if (!this.defaults.has(name)) this.defaults.set(name, target[name]);
        if (target[name] !== value) target[name] = value;
      }
      // Props the spec no longer sets go back to the element's own value.
      for (const name of Object.keys(previous?.props ?? {})) {
        if (!(name in state.props)) target[name] = this.defaults.get(name);
      }
    }

    // Listen once per event; the handlers read the latest state.
    const events = new Set<string>(Object.keys(state.on ?? {}).map((e) => (e === 'press' ? 'click' : e)));
    if (state.bindings && Object.keys(state.bindings).length) {
      for (const e of WRITE_BACK_EVENTS) events.add(e);
    }
    for (const event of events) {
      if (this.listening.has(event)) continue;
      this.listening.add(event);
      el.addEventListener(event, (e) => this.handle(event, e));
    }
    return nothing;
  }

  private applyHtml(el: Element, props: Record<string, unknown>) {
    // `text` renders in the template, before the children.
    for (const [prop, attribute] of Object.entries(HTML_ATTRIBUTES)) {
      const value = props[prop];
      if (value === undefined) el.removeAttribute(attribute);
      else el.setAttribute(attribute, String(value));
    }
    // A new browsing context gets no opener (and no referrer).
    if (props['target'] === '_blank') el.setAttribute('rel', 'noopener noreferrer');
    else el.removeAttribute('rel');
    const href = props['href'];
    if (el instanceof HTMLAnchorElement && href !== undefined) {
      setAnchorHref(el, String(href));
    }
    const src = props['src'];
    if (el instanceof HTMLImageElement && typeof src === 'string') {
      if (isSafeSrc(src)) el.src = src;
      else this.state?.runtime.warn(`Html img: unsafe src ignored: ${src}`);
    }
  }

  private handle(event: string, e: Event) {
    const state = this.state;
    const el = this.element;
    if (!state || !el) return;
    const {runtime, ctx} = state;
    // Two-way bindings: read the element's value back into state.
    if (state.bindings && WRITE_BACK_EVENTS.includes(event)) {
      const target = el as unknown as Record<string, unknown>;
      const updates: Record<string, unknown> = {};
      for (const [prop, path] of Object.entries(state.bindings)) {
        updates[path] = target[prop];
      }
      runtime.store.update(updates);
    }
    const bound = state.on?.[event] ?? (event === 'click' ? state.on?.['press'] : undefined);
    if (!bound) return;
    for (const binding of Array.isArray(bound) ? bound : [bound]) {
      if (binding.preventDefault) e.preventDefault();
      void runAction(binding, ctx, runtime);
    }
  }
}

const apply = directive(ApplyDirective);

/** Resolves an action binding's params in a scope and runs it. */
async function runAction(binding: ActionBinding, ctx: PropResolutionContext, runtime: Runtime) {
  const handler = runtime.handlers[binding.action];
  if (!handler) {
    runtime.warn(`No handler for action "${binding.action}".`);
    return;
  }
  const params: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(binding.params ?? {})) {
    params[name] = resolveActionParam(value, {...ctx, stateModel: runtime.store.getSnapshot()});
  }
  try {
    await executeAction({
      action: {
        action: binding.action,
        params,
        confirm: binding.confirm,
        onSuccess: binding.onSuccess,
        onError: binding.onError,
      },
      handler,
      setState: (path, value) => runtime.store.set(path, value),
      executeAction: (next) => runAction(next, ctx, runtime),
    });
  } catch (error) {
    runtime.warn(`Action "${binding.action}" failed: ${String(error)}`);
  }
}

/** Renders a spec's tree as a lit-html template. */
function template(spec: Spec, runtime: Runtime): TemplateResult | typeof nothing {
  const stateModel = runtime.store.getSnapshot();
  const visiting = new Set<string>();

  const node = (key: string, ctx: PropResolutionContext, slot?: string): unknown => {
    const el: UIElement | undefined = spec.elements?.[key];
    if (!el) {
      runtime.warn(`Missing element "${key}".`);
      return nothing;
    }
    if (visiting.has(key)) {
      runtime.warn(`Element "${key}" contains itself.`);
      return nothing;
    }
    const component = components[el.type];
    if (!component) {
      runtime.warn(`Unknown component type "${el.type}" (element "${key}").`);
      return nothing;
    }
    if (el.visible !== undefined && !evaluateVisibility(el.visible, ctx)) return nothing;
    const rawProps = (el.props ?? {}) as Record<string, unknown>;
    const props = resolveElementProps(rawProps, ctx);

    if (component.tag === TEXT_TAG) {
      const text = String(props['text'] ?? '');
      return slot ? html`<span slot=${slot}>${text}</span>` : text;
    }

    visiting.add(key);
    const children = childrenOf(el, ctx);
    const named = Object.entries(el.slots ?? {}).map(([name, keys]) =>
      keys.map((k) => node(k, ctx, name === 'default' ? undefined : name)),
    );
    visiting.delete(key);

    const state: ElementState = {
      type: el.type,
      props,
      slot,
      bindings: resolveBindings(rawProps, ctx),
      on: el.on,
      ctx,
      runtime,
    };
    let tag: string = component.tag;
    let text: unknown = nothing;
    if (tag === HTML_TAG) {
      tag = String(props['tag']);
      if (!HTML_ALLOWED.has(tag)) {
        runtime.warn(`Html: tag "${tag}" is not allowed (element "${key}").`);
        return nothing;
      }
      if (props['text'] !== undefined) text = String(props['text']);
      state.props = {...props};
      delete state.props['tag'];
      delete state.props['text'];
    }
    // The tag comes from the catalog, or from HTML_TAGS for Html.
    const t = unsafeStatic(tag);
    return html`<${t} ${apply(state)}>${text}${children}${named}</${t}>`;
  };

  /** The default slot's children; once per item for a `repeat` element. */
  const childrenOf = (el: UIElement, ctx: PropResolutionContext): unknown => {
    const keys = el.children ?? [];
    if (!el.repeat) return keys.map((k) => node(k, ctx));
    const path = resolveRepeatStatePath(el.repeat.statePath, ctx.repeatBasePath);
    const items = path === undefined ? undefined : getByPath(ctx.stateModel, path);
    if (!Array.isArray(items)) return nothing;
    const keyOf = el.repeat.key;
    return repeat(
      items,
      (item, i) =>
        keyOf && item && typeof item === 'object' ? String((item as Record<string, unknown>)[keyOf]) : i,
      (item, i) =>
        keys.map((k) =>
          node(k, {...ctx, repeatItem: item, repeatIndex: i, repeatBasePath: `${path}/${i}`}),
        ),
    );
  };

  if (!spec.root) return nothing;
  const root = node(spec.root, {stateModel, functions: runtime.functions});
  return html`${root}`;
}

/** Options of `hydrateSpec()`. */
export interface HydrateSpecOptions extends RenderSpecOptions {
  /**
   * The ids of static islands (`renderSpecToString()` `islands`): their
   * content is kept, as it is, in the live elements with the same ids.
   */
  islands?: string[];
}

/** The element with `id` in a container (or a fragment). */
function byId(container: HTMLElement | DocumentFragment, id: string): Element | null {
  return container.querySelector(`#${CSS.escape(id)}`);
}

/**
 * Takes over a container that holds the spec's static HTML
 * (`renderSpecToString()`, ./static.js): renders the spec live in its place,
 * with its state, actions and bindings. The static markup is replaced, so
 * render the same spec and state that produced it; the content of its
 * `islands` is kept (the same nodes: their state and listeners survive).
 */
export function hydrateSpec(
  spec: Spec,
  container: HTMLElement | DocumentFragment,
  options: HydrateSpecOptions = {},
): RenderedSpec {
  const kept = new Map<string, Node[]>();
  for (const id of options.islands ?? []) {
    const island = byId(container, id);
    if (island) kept.set(id, [...island.childNodes]);
  }
  container.replaceChildren();
  const rendered = renderSpec(spec, container, options);
  for (const [id, nodes] of kept) {
    const island = byId(container, id);
    if (island) island.append(...nodes);
    else (options.onWarning ?? ((m: string) => console.warn(`json-render: ${m}`)))(`Island "${id}" is not in the spec.`);
  }
  return rendered;
}

/**
 * The spec a page embeds with `embedSpec()` (./static.js), or null when
 * there is none (or it isn't JSON).
 */
export function readEmbeddedSpec(id = 'json-render-spec', root: Document | DocumentFragment = document): Spec | null {
  const script = root.querySelector(`script#${CSS.escape(id)}[type="application/json"]`);
  if (!script?.textContent) return null;
  try {
    return JSON.parse(script.textContent) as Spec;
  } catch {
    return null;
  }
}

/**
 * Renders a json-render spec of the library's catalog into a container.
 *
 * ```js
 * import {renderSpec} from '@material/web/json-render/index.js';
 * const view = renderSpec(spec, document.querySelector('#app'), {
 *   handlers: {save: (params) => api.save(params)},
 * });
 * view.store.set('/user/name', 'Ada');
 * ```
 */
export function renderSpec(
  spec: Spec,
  container: HTMLElement | DocumentFragment,
  options: RenderSpecOptions = {},
): RenderedSpec {
  const store = options.store ?? createStateStore(structuredClone(spec.state ?? {}));
  const warnings = new Set<string>();
  const runtime: Runtime = {
    store,
    handlers: {...builtIns(store), ...options.handlers},
    functions: options.functions,
    warn: (message) => {
      if (warnings.has(message)) return;
      warnings.add(message);
      (options.onWarning ?? ((m: string) => console.warn(`json-render: ${m}`)))(message);
    },
  };
  let current = spec;
  let scheduled = false;
  const draw = () => {
    scheduled = false;
    render(template(current, runtime), container);
  };
  draw();
  const unsubscribe = store.subscribe(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(draw);
  });
  return {
    store,
    update(next) {
      current = next;
      draw();
    },
    dispose() {
      unsubscribe();
      render(nothing, container);
    },
  };
}
