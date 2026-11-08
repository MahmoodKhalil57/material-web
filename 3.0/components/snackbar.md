# Snackbar

Snackbars tell people about a process an app has performed or will perform, without interrupting them.

**Example: A button that shows a snackbar with an Undo action**

*HTML*

```html
<md-gb-button id="archive">Archive</md-gb-button>
<md-gb-snackbar id="archived" fixed label-text="Email archived" action-label="Undo"></md-gb-snackbar>
```

*TypeScript*

```ts
document.querySelector('#archive')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```

## Usage guidelines

*   **Low priority only.** Use a snackbar for a message that needs no response. For an important one that blocks the task, use a dialog.
*   **One at a time.** Show a single snackbar, and queue [consecutive](#consecutive-snackbars) messages.
*   **At most one action.** Give it a short action such as Undo. A snackbar with an action stays until it is used or dismissed.
*   **Repeat the message nearby.** A snackbar that disappears on its own is easy to miss, so also show the result inline, such as changing "Save" to "Saved".

## Anatomy

A snackbar has a message, an optional action and an optional close button.

**Example: A snackbar with a message, an action and a close button**

```html
<md-gb-snackbar open timeout-ms="-1">
  Photo deleted
  <md-gb-button slot="action">Undo</md-gb-button>
  <md-gb-icon-button slot="dismiss" aria-label="Close">
    <md-gb-icon>close</md-gb-icon>
  </md-gb-icon-button>
</md-gb-snackbar>
```

## Examples

### Close button

Add `has-close-button` so people can dismiss the snackbar. Without an action it stays for `timeout-ms` (5 seconds by default); use `-1` to keep it open.

**Example: A snackbar with a close button that stays open**

*HTML*

```html
<md-gb-button id="save">Save</md-gb-button>
<md-gb-snackbar id="saved" fixed has-close-button timeout-ms="-1" label-text="Changes saved"></md-gb-snackbar>
```

*TypeScript*

```ts
document.querySelector('#save')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```

### Two lines

Put longer text in the default slot for a two-line snackbar.

**Example: A two-line snackbar**

*HTML*

```html
<md-gb-button id="send">Send</md-gb-button>
<md-gb-snackbar id="sent" fixed action-label="View">
  Message sent to 3 people.<br>Replies appear in your inbox.
</md-gb-snackbar>
```

*TypeScript*

```ts
document.querySelector('#send')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```

### Consecutive snackbars

`md-gb-snackbar-host` shows messages one after another. Call `showSnackbar()`; it resolves with `action-performed` or `dismissed`. Pass `replace: true` to swap out a message that is out of date.

**Example: A host that queues two messages and reports the result**

*HTML*

```html
<md-gb-button id="queue">Queue messages</md-gb-button>
<output id="result" role="status"></output>
<md-gb-snackbar-host id="host" fixed></md-gb-snackbar-host>
```

*TypeScript*

```ts
const host = document.querySelector('md-gb-snackbar-host')!;
const result = document.querySelector('#result')!;
document.querySelector('#queue')!.addEventListener('click', async () => {
  host.showSnackbar('Photo uploaded');
  const outcome = await host.showSnackbar({message: 'Photo deleted', actionLabel: 'Undo'});
  result.textContent = outcome === 'action-performed' ? 'Restored' : 'Deleted';
});
```

### Anchor

Set `anchor` to the id of an element, such as a FAB, so the snackbar appears above it.

**Example: A snackbar anchored above a FAB**

*HTML*

```html
<md-gb-fab id="compose" aria-label="Compose">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-fab>
<md-gb-snackbar id="drafted" fixed anchor="compose" label-text="Draft saved"></md-gb-snackbar>
```

*TypeScript*

```ts
document.querySelector('#compose')!.addEventListener('click', () => {
  document.querySelector('md-gb-snackbar')!.show();
});
```

## Accessibility

*   The message is announced politely in a live region, so focus stays where it is.
*   Auto-dismissing snackbars are hard to read for people with low vision or who need more time. Give the same information inline, or add an action so the snackbar stays until it is used.
*   Give a snackbar that has a close button a localized `close-label`.
*   Escape closes the snackbar, and a slotted action is a normal button in the tab order.

## API reference

### &lt;md-gb-snackbar&gt;

A Material Design snackbar component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>actionLabel</code><br><span class="gb-desc">Visible text of the built-in action button. Rendered only when non-empty and nothing is slotted into <code>action</code>.</span> | <code>action-label</code> | <code>string</code> | <code>''</code> |
| <code>align</code><br><span class="gb-desc">Where a snackbar sits on wide layouts: <code>center</code> (default) or <code>start</code> (left-aligned). Use the same value wherever snackbars appear, so they always show in the same spot. Compact layouts span the width.</span> | <code>align</code> | <code>"start" | "center"</code> | <code>'center'</code> |
| <code>anchor</code><br><span class="gb-desc">The id of an element the snackbar appears above, such as a FAB or a docked toolbar, in the snackbar's root (document or shadow root). See <code>anchorElement</code>.</span> | <code>anchor</code> | <code>string</code> | <code>''</code> |
| <code>anchorElement</code><br><span class="gb-desc">An element the snackbar appears above, such as a FAB or a docked toolbar: while open, the snackbar's bottom edge sits <code>--bottom-offset</code> above the element's top edge. Takes precedence over <code>anchor</code>.</span> |  | <code>HTMLElement</code> | <code>null</code> |
| <code>closeLabel</code><br><span class="gb-desc">Accessible label for the built-in dismiss button.</span> | <code>close-label</code> | <code>string</code> | <code>'Close'</code> |
| <code>fixed</code><br><span class="gb-desc">Whether the snackbar should be positioned relative to the viewport (fixed).</span> | <code>fixed</code> | <code>boolean</code> | <code>false</code> |
| <code>hasCloseButton</code><br><span class="gb-desc">Whether to display a close icon button.</span> | <code>has-close-button</code> | <code>boolean</code> | <code>false</code> |
| <code>labelText</code><br><span class="gb-desc">Supporting message text to display. Rendered before default slot content.</span> | <code>label-text</code> | <code>string</code> | <code>''</code> |
| <code>open</code><br><span class="gb-desc">Whether the snackbar is currently open.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Whether to skip opening and closing transition delays.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>timeoutMs</code><br><span class="gb-desc">Time in milliseconds before the snackbar automatically dismisses. Set to 0 or a negative value (e.g. -1) to disable auto-dismiss. Read when the snackbar opens; changing it while open takes effect on the next open.</span> | <code>timeout-ms</code> | <code>number</code> | <code>5000</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Default slot for rich content (rendered after <code>label-text</code>). If both <code>label-text</code> and slotted content are provided, both render. |
| <code>action</code> | Slot for a custom action button; replaces the built-in action rendered from <code>action-label</code>. Prefer the <code>action-label</code> attribute, which renders a text button matching the spec. A slotted plain <code>&lt;button&gt;</code> is styled by the snackbar, with hover, focus and pressed states. A slotted text <code>&lt;md-gb-button&gt;</code> gets the <code>--action-label-text*</code> colors and typography, but keeps its own 16px padding and pressed shape, because its component tokens can't be set from outside its shadow root. |
| <code>dismiss</code> | Slot for dismiss button (falls back to close icon button when <code>has-close-button</code> is set). |

#### Events

| Event | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the snackbar begins closing. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the snackbar has closed. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the snackbar begins opening. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired when the snackbar has opened and animations finished. |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the snackbar. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the snackbar. |
| <code>updateAnchorPosition</code><br><span class="gb-desc">() =&gt; void</span> | Places the snackbar above its anchor. Called while open when the window or the anchor resizes; call it after moving the anchor. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The container wrapping action and dismiss slots. |
| <code>::part(label)</code> | The container wrapping the label content. |
| <code>::part(surface)</code> | The surface container of the snackbar. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--action-label-text</code> | Action button label typography. |
| <code>--action-label-text-axes</code> | Action button label typography font variation settings. |
| <code>--action-label-text-color</code> | Action button label text color. |
| <code>--action-label-text-tracking</code> | Action button label letter spacing. |
| <code>--bottom-offset</code> | Inset block end distance from container bottom, or from the top of the <code>anchor</code>. |
| <code>--container-color</code> | Container background color. |
| <code>--container-elevation</code> | Container box shadow elevation. |
| <code>--container-shape</code> | Container border radius. |
| <code>--icon-color</code> | Close icon color. |
| <code>--icon-size</code> | Close icon size. |
| <code>--max-width</code> | Maximum surface width in wide layout. |
| <code>--min-height</code> | Minimum surface height (the single-line height). |
| <code>--min-width</code> | Minimum surface width in wide layout. |
| <code>--position</code> | CSS position property (<code>absolute</code> by default). |
| <code>--supporting-text</code> | Supporting label typography. |
| <code>--supporting-text-axes</code> | Supporting label typography font variation settings. |
| <code>--supporting-text-color</code> | Supporting label text color. |
| <code>--supporting-text-tracking</code> | Supporting label letter spacing. |
| <code>--with-single-line-container-height</code> | Single-line container height (spec 48dp). |
| <code>--with-two-lines-container-height</code> | Two-line container height (spec 68dp). |
| <code>--z-index</code> | Z-index of the snackbar. |

### &lt;md-gb-snackbar-host&gt;

Shows queued snackbars one at a time.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>anchor</code><br><span class="gb-desc">The id of the element the built-in snackbar appears above, such as a FAB (see <code>md-gb-snackbar</code> <code>anchor</code>).</span> | <code>anchor</code> | <code>string</code> | <code>''</code> |
| <code>anchorElement</code><br><span class="gb-desc">The element the built-in snackbar appears above, such as a FAB.</span> |  | <code>HTMLElement</code> | <code>null</code> |
| <code>closeLabel</code><br><span class="gb-desc">Accessible label of the close icon button.</span> | <code>close-label</code> | <code>string</code> | <code>'Close'</code> |
| <code>fixed</code><br><span class="gb-desc">Whether the built-in snackbar is positioned in the viewport (fixed).</span> | <code>fixed</code> | <code>boolean</code> | <code>false</code> |
| <code>quick</code><br><span class="gb-desc">Whether to skip the snackbar's opening and closing motion.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Optional <code>md-gb-snackbar</code> to show the messages in. |

#### Events

| Event | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Bubbles from the snackbar when it begins closing. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Bubbles from the snackbar when it has closed. |

#### Methods

| Method | Description |
| --- | --- |
| <code>dismissAll</code><br><span class="gb-desc">() =&gt; void</span> | Dismisses the current snackbar and every queued one. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>showSnackbar</code><br><span class="gb-desc">(options: string | ShowSnackbarOptions) =&gt; Promise&lt;SnackbarResult&gt;</span> | Queues a snackbar and resolves when it ends: <code>action-performed</code> when its action is activated, otherwise <code>dismissed</code>. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(snackbar)</code> | The built-in snackbar, when none is slotted. |
