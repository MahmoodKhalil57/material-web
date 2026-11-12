# fabmenu

Elements: `md-gb-fab-menu`, `md-gb-fab-menu-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **FAB menu**
  - Colors: primary, secondary, tertiary containers
  - Close button
  - Alignment

## API

### `<md-gb-fab-menu>`

A Material Design component.

Source: `material-design-expressive/components/fabmenu/md-gb-fab-menu.ts`  
Import: `import '@material/web/components/fabmenu/md-gb-fab-menu.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `align` | `align` | `"start" \| "end"` | `FAB_MENU_ALIGNS.end` | The alignment of the items. Defaults to the end, as the FAB. |
| `color` | `color` | `"primary" \| "secondary" \| "tertiary"` | `FAB_MENU_COLORS.primary` | The color of the FAB, close button and items. |
| `open` | `open` (reflects) | `boolean` | `false` | Whether the menu is open. |
| `size` | `size` | `"sm" \| "md" \| "lg" \| "default"` | `'default'` | The size of the FAB. The close button is always the same size. |

Slots

- default slot: The menu's items, typically `<md-gb-fab-menu-item>`s.
- `close-icon`: The close button's icon. Defaults to a "close" icon.
- `icon`: The FAB's icon. Defaults to an "add" icon.

Events

- `activate` (`CustomEvent<FabMenuActivateDetail>`): Fired when an item is activated, before the menu closes. Cancel it to keep the menu open. --bubbles --composed
- `toggle` (`ToggleEvent`): Fired when the menu opens or closes from user interaction, before the change. Cancel it to keep the menu as it is.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(button)`: The FAB that toggles the menu.
- `::part(fab-menu)`: The menu's root element.
- `::part(list)`: The menu's list of items.

CSS custom properties

- `--close-button-between-space`
- `--close-button-container-elevation`
- `--close-button-container-height`
- `--close-button-container-shape`
- `--close-button-container-width`
- `--close-button-icon-size`
- `--item-between-space`
- `--item-container-elevation`
- `--item-container-height`
- `--item-container-shape`
- `--item-icon-label-space`
- `--item-icon-size`
- `--item-label-text`
- `--item-label-text-axes`
- `--item-label-text-tracking`
- `--item-leading-space`
- `--item-trailing-space`

### `<md-gb-fab-menu-item>`

A Material Design component.

Source: `material-design-expressive/components/fabmenu/md-gb-fab-menu-item.ts`  
Import: `import '@material/web/components/fabmenu/md-gb-fab-menu-item.js';`

Slots

- default slot: The item's label. FAB menu items should always have a label.
- `icon`: The item's leading icon.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS parts

- `::part(item)`: The item's container.
