# FAB menu

A FAB menu opens from a FAB to show several related actions, and the FAB becomes its close button.

**Example: A FAB menu with three actions**

```html
<md-gb-fab-menu aria-label="Message actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">mail</md-gb-icon>
    Messages
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">archive</md-gb-icon>
    Archive
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">share</md-gb-icon>
    Share
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
```

## Usage guidelines

*   **Open it from a FAB.** The menu appears where the FAB was, and not from an extended FAB or any other component.
*   **Keep it related.** A menu holds 2 to 6 closely related actions under one purpose, such as sharing.
*   **Align to the trailing edge.** The FAB and menu sit at the trailing edge of the window, mirrored in right-to-left languages.
*   **Always label items.** Every item needs a text label.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A FAB menu holds items and a FAB that toggles it. Both icons can be replaced.

**Example: An open FAB menu with custom toggle icons and two items**

```html
<md-gb-fab-menu open aria-label="Compose actions">
  <md-gb-icon slot="icon">add</md-gb-icon>
  <md-gb-icon slot="close-icon">close</md-gb-icon>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Note
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">checklist</md-gb-icon>
    List
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
```

## Examples

### Colors

Set `color` to `primary` (default), `secondary` or `tertiary`.

**Example: A tertiary FAB menu**

```html
<md-gb-fab-menu color="tertiary" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
```

### Size

Set `size` to `md` or `lg` for a larger FAB.

**Example: A large FAB menu**

```html
<md-gb-fab-menu size="lg" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
```

### Start alignment

Set `align="start"` to align the items to the start edge, as for a FAB at the leading side.

**Example: A FAB menu aligned to the start**

```html
<md-gb-fab-menu align="start" aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
```

### Open and events

Set `open` to open the menu from code. The `toggle` event fires before it opens or closes and `activate` fires before an item closes it; cancel either to keep the menu as it is.

**Example: A FAB menu that stays open when an item is activated**

*HTML*

```html
<md-gb-fab-menu open aria-label="Photo actions">
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">edit</md-gb-icon>
    Edit
  </md-gb-fab-menu-item>
  <md-gb-fab-menu-item>
    <md-gb-icon slot="icon">delete</md-gb-icon>
    Delete
  </md-gb-fab-menu-item>
</md-gb-fab-menu>
<output id="status" role="status"></output>
```

*TypeScript*

```ts
const menu = document.querySelector('md-gb-fab-menu')!;
const status = document.querySelector('#status')!;
menu.addEventListener('activate', (event) => {
  status.textContent = 'Activated';
  // Cancel to keep the menu open.
  event.preventDefault();
});
```

## Accessibility

*   Name the menu with `aria-label`, such as "Message actions". It labels the toggle button.
*   The toggle button exposes whether the menu is expanded or collapsed.
*   Tab moves through the button and the items, and Enter or Space activates the focused one.
*   A menu over scrolling content shouldn't hide focused elements. Register it with `setupScrollPadding()` from `appbar/scroll-padding.js`.

## API reference

### &lt;md-gb-fab-menu&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>align</code><br><span class="gb-desc">The alignment of the items. Defaults to the end, as the FAB.</span> | <code>align</code> | <code>FabMenuAlign</code> | <code>FAB_MENU_ALIGNS.end</code> |
| <code>color</code><br><span class="gb-desc">The color of the FAB, close button and items.</span> | <code>color</code> | <code>FabMenuColor</code> | <code>FAB_MENU_COLORS.primary</code> |
| <code>open</code><br><span class="gb-desc">Whether the menu is open.</span> | <code>open</code> | <code>boolean</code> | <code>false</code> |
| <code>size</code><br><span class="gb-desc">The size of the FAB. The close button is always the same size.</span> | <code>size</code> | <code>FabSize</code> | <code>'default'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The menu's items, typically <code>&lt;md-gb-fab-menu-item&gt;</code>s. |
| <code>close-icon</code> | The close button's icon. Defaults to a "close" icon. |
| <code>icon</code> | The FAB's icon. Defaults to an "add" icon. |

#### Events

| Event | Description |
| --- | --- |
| <code>activate</code><br><span class="gb-desc">CustomEvent&lt;FabMenuActivateDetail&gt;</span> | Fired when an item is activated, before the menu closes. Cancel it to keep the menu open. |
| <code>toggle</code><br><span class="gb-desc">ToggleEvent</span> | Fired when the menu opens or closes from user interaction, before the change. Cancel it to keep the menu as it is. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(button)</code> | The FAB that toggles the menu. |
| <code>::part(fab-menu)</code> | The menu's root element. |
| <code>::part(list)</code> | The menu's list of items. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--close-button-between-space</code> |  |
| <code>--close-button-container-elevation</code> |  |
| <code>--close-button-container-height</code> |  |
| <code>--close-button-container-shape</code> |  |
| <code>--close-button-container-width</code> |  |
| <code>--close-button-icon-size</code> |  |
| <code>--item-between-space</code> |  |
| <code>--item-container-elevation</code> |  |
| <code>--item-container-height</code> |  |
| <code>--item-container-shape</code> |  |
| <code>--item-icon-label-space</code> |  |
| <code>--item-icon-size</code> |  |
| <code>--item-label-text</code> |  |
| <code>--item-label-text-axes</code> |  |
| <code>--item-label-text-tracking</code> |  |
| <code>--item-leading-space</code> |  |
| <code>--item-trailing-space</code> |  |

### &lt;md-gb-fab-menu-item&gt;

A Material Design component.

#### Slots

| Slot | Description |
| --- | --- |
| default | The item's label. FAB menu items should always have a label. |
| <code>icon</code> | The item's leading icon. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(item)</code> | The item's container. |
