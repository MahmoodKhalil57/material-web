# Navigation Drawer

A Material Design navigation drawer.

**Example: A standard navigation drawer with Inbox selected**

```html
<md-gb-nav-drawer open aria-label="Mail">
  <h2 slot="headline">Mail</h2>
  <md-gb-nav-drawer-item href="#inbox" selected badge="24">
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    Inbox
  </md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">
    <md-gb-icon slot="icon">send</md-gb-icon>
    Sent
  </md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```

## Usage guidelines

*   **Use it for top-level destinations.** A drawer lists the main sections of an app, with the current one selected.
*   **Choose standard or modal.** A standard drawer (above) sits beside the content on large windows; a [modal drawer](#modal-drawer) opens over a scrim on small ones.
*   **Group with labels.** Use section labels and dividers to organize long lists.
*   **Keep labels short.** Long [labels](#text-labels-only) truncate.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A drawer holds an optional headline, section labels, dividers, and items.

**Example: A drawer with a headline, section label, items, badge and divider**

```html
<md-gb-nav-drawer open aria-label="Mail">
  <h2 slot="headline">Mail</h2>
  <h2 class="nav-drawer-section-label">Folders</h2>
  <md-gb-nav-drawer-item href="#anatomy-inbox" selected>
    <md-gb-icon slot="icon">inbox</md-gb-icon>
    <span slot="badge">24</span>
    Inbox
  </md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#anatomy-drafts">
    <md-gb-icon slot="icon">draft</md-gb-icon>
    Drafts
  </md-gb-nav-drawer-item>
  <md-gb-divider></md-gb-divider>
  <md-gb-nav-drawer-item href="#anatomy-trash">
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Trash
  </md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```

## Examples

### Modal drawer

Set `modal` to open the drawer over a scrim. Escape, the scrim, or swiping closes it.

**Example: A button that opens a modal navigation drawer**

*HTML*

```html
<md-gb-button id="open-menu">Menu</md-gb-button>
<md-gb-nav-drawer id="menu" modal aria-label="Mail">
  <md-gb-nav-drawer-item href="#inbox" selected>Inbox</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">Sent</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```

*JavaScript*

```js
document.querySelector('#open-menu').addEventListener('click', () => {
  document.querySelector('#menu').show();
});
```

### Modal drawer without swipe

Set `gestures-disabled` on a modal drawer to turn off swipe-to-close. Escape, the scrim, and `close()` still work.

**Example: A modal navigation drawer that can't be swiped closed**

*HTML*

```html
<md-gb-button id="open-fixed-menu">Menu</md-gb-button>
<md-gb-nav-drawer id="fixed-menu" modal gestures-disabled aria-label="Mail">
  <md-gb-nav-drawer-item href="#inbox" selected>Inbox</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#sent">Sent</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```

*JavaScript*

```js
document.querySelector('#open-fixed-menu').addEventListener('click', () => {
  document.querySelector('#fixed-menu').show();
});
```

### Text labels only

Items work without icons. Labels that are too long truncate, and `disabled` items are not interactive.

**Example: A navigation drawer with text labels only**

```html
<md-gb-nav-drawer open aria-label="Settings">
  <md-gb-nav-drawer-item href="#general" selected>General</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item href="#privacy">Privacy</md-gb-nav-drawer-item>
  <md-gb-nav-drawer-item disabled>Billing</md-gb-nav-drawer-item>
</md-gb-nav-drawer>
```

## Accessibility

*   The drawer renders a `<nav>` landmark; give it a name with `aria-label`.
*   The selected item is the current page and is exposed with `aria-current`.
*   A modal drawer is a dialog: it traps focus, closes with Escape, and returns focus to what opened it.
*   Tab moves through the items; Enter activates a link item.

## API reference

### &lt;md-gb-nav-drawer&gt;

A Material Design navigation drawer custom element.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>gesturesDisabled</code><br><span class="gb-desc">Whether swiping a modal drawer closed is turned off (Compose <code>gesturesEnabled = false</code>). Escape, the scrim and <code>close()</code> still close it.</span> | <code>gestures-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">The accessible name of the navigation landmark. Use it instead of <code>aria-label</code> when the host sits outside any landmark: the host's <code>aria-label</code> moves to a data attribute that checkers (axe <code>region</code>) still read as a name on a host that has no landmark role.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>modal</code><br><span class="gb-desc">Whether the drawer is modal: it opens over a scrim that blocks the rest of the app, instead of sitting next to the content.</span> | <code>modal</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the drawer is open.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Whether to skip the open and close transitions.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Navigation items (<code>md-gb-nav-drawer-item</code>), section labels (headings or <code>.nav-drawer-section-label</code>) and dividers (<code>md-gb-divider</code> or <code>&lt;hr&gt;</code>). |
| <code>headline</code> | Optional headline shown above the items. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the user selects a different item. |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the drawer starts closing. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the drawer has closed and finished animating. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the drawer starts opening. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired when the drawer has opened and finished animating. |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the drawer. Resolves once it has finished animating. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the drawer. Resolves once it has finished animating. |
| <code>toggle</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the drawer when closed, closes it when open. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(dialog)</code> | The modal drawer's <code>&lt;dialog&gt;</code>. |
| <code>::part(drawer)</code> | The drawer sheet. |
| <code>::part(nav)</code> | The <code>&lt;nav&gt;</code> landmark. |
| <code>::part(scrim)</code> | The modal drawer's scrim. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--active-focus-icon-color</code> |  |
| <code>--active-focus-label-text-color</code> |  |
| <code>--active-hover-icon-color</code> |  |
| <code>--active-hover-label-text-color</code> |  |
| <code>--active-icon-color</code> |  |
| <code>--active-indicator-color</code> |  |
| <code>--active-indicator-height</code> |  |
| <code>--active-indicator-shape</code> |  |
| <code>--active-indicator-width</code> |  |
| <code>--active-label-text</code> |  |
| <code>--active-label-text-axes</code> |  |
| <code>--active-label-text-color</code> |  |
| <code>--active-pressed-icon-color</code> |  |
| <code>--active-pressed-label-text-color</code> |  |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-height</code> |  |
| <code>--container-padding-block</code> |  |
| <code>--container-padding-inline</code> |  |
| <code>--container-shape</code> | Radius of the end corners. |
| <code>--container-width</code> |  |
| <code>--container-width-minimum</code> |  |
| <code>--divider-inset</code> |  |
| <code>--headline</code> |  |
| <code>--headline-axes</code> |  |
| <code>--headline-color</code> |  |
| <code>--headline-tracking</code> |  |
| <code>--icon-size</code> |  |
| <code>--inactive-focus-icon-color</code> |  |
| <code>--inactive-focus-label-text-color</code> |  |
| <code>--inactive-hover-icon-color</code> |  |
| <code>--inactive-hover-label-text-color</code> |  |
| <code>--inactive-icon-color</code> |  |
| <code>--inactive-label-text-color</code> |  |
| <code>--inactive-pressed-icon-color</code> |  |
| <code>--inactive-pressed-label-text-color</code> |  |
| <code>--item-icon-label-space</code> |  |
| <code>--item-leading-space</code> |  |
| <code>--item-trailing-space</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-axes</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--large-badge-label</code> |  |
| <code>--large-badge-label-axes</code> |  |
| <code>--large-badge-label-color</code> |  |
| <code>--large-badge-label-tracking</code> |  |
| <code>--motion-close-duration</code> |  |
| <code>--motion-close-easing</code> |  |
| <code>--motion-effects-duration</code> |  |
| <code>--motion-effects-easing</code> |  |
| <code>--motion-open-duration</code> |  |
| <code>--motion-open-easing</code> |  |
| <code>--scrim-color</code> |  |
| <code>--scrollbar-gutter</code> | <code>stable</code> reserves the scrollbar gutter, so a scrollbar that appears doesn't move the items (default <code>auto</code>: where scrollbars take space it would narrow the 12dp indicator padding). |
| <code>--section-label-height</code> |  |
| <code>--section-label-leading-space</code> |  |

### &lt;md-gb-nav-drawer-item&gt;

A Material Design navigation drawer item custom element.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>badge</code><br><span class="gb-desc">Trailing badge label text, such as an unread count. Ignored when content is slotted into <code>badge</code>.</span> | <code>badge</code> | <code>string</code> | <code>''</code> |
| <code>disabled</code><br><span class="gb-desc">Whether the item is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>href</code><br><span class="gb-desc">The URL the item links to. Renders a link (<code>&lt;a&gt;</code>) when set.</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>rel</code><br><span class="gb-desc">The link's <code>rel</code> attribute, when <code>href</code> is set.</span> | <code>rel</code> | <code>string</code> | <code>''</code> |
| <code>selected</code><br><span class="gb-desc">Whether the item is the selected (current) destination.</span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>tabStop</code><br><span class="gb-desc">Whether the item is in the tab order. The parent <code>md-gb-nav-drawer</code> manages this to provide a single tab stop with arrow key navigation.</span> |  | <code>boolean</code> | <code>true</code> |
| <code>target</code><br><span class="gb-desc">Where to open the linked <code>href</code>, e.g. <code>_blank</code>.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The item's label text. |
| <code>badge</code> | Trailing badge label text (overrides the <code>badge</code> property). |
| <code>icon</code> | The item's leading icon (<code>md-gb-icon</code>). Filled when selected. |

#### Methods

| Method | Description |
| --- | --- |
| <code>blur</code><br><span class="gb-desc">() =&gt; void</span> | [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur) |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | Focuses the item's link or button. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(badge)</code> | The trailing badge label container. |
| <code>::part(icon)</code> | The icon container. |
| <code>::part(item)</code> | The item's link or button. |
| <code>::part(label)</code> | The label text container. |
