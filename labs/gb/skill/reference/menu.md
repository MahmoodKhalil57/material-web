# menu

Elements: `md-gb-menu`, `md-gb-menu-group`, `md-gb-menu-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Menus**
  - Standard, vibrant colors
  - Checked items
  - Submenus (keyboard, hover), groups with labels, gaps (`layout="grouped"`)
  - Context menus (right-click, long press, Shift+F10)

## API

### `<md-gb-menu>`

A Material Design component.

Source: `labs/gb/components/menu/md-gb-menu.ts`  
Import: `import '@material/web/labs/gb/components/menu/md-gb-menu.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `color` | `color` | `MenuColor` | `MENU_COLORS.standard` | The color style: `standard` (surface-based) or `vibrant` (tertiary). |
| `contextFor` | `context-for` | `string` | `''` | The id of an element (in the same root) that opens this menu as a context menu on a secondary click, the context menu key or a long press (menus.md "Context menus ... usually open with a secondary click"; "Performs a specific action to trigger the menu, like right-click or press-and-hold"). |
| `density` | `density` (reflects) | `Density` |  | The density, from 0 (default) to -3 (menus.md "Density": "On web only, density levels control the spacing between elements. Increasing density decreases the top and bottom padding"). Each step removes 4px from the items' height; submenus inherit it. Values are clamped to that range. Dense items are smaller than the 48px recommended target, so don't apply density by default; let people opt in (grids-spacing.md "Avoid applying component scaling by default"). |
| `filterFor` | `filter-for` | `string` | `''` | The id of a text field (in the same root) the menu is attached to. As the person types in it, the menu opens (without taking focus) and shows only the items whose label contains the text, case-insensitively (menus.md "Filtering": "As someone types, the list of menu options filters to show relevant results"). The remaining items ease into their new position ("Menu items ease into their new position as the menu is filtered"), unless motion is reduced. Fires `filter` with the query. |
| `layout` | `layout` (reflects) | `MenuLayout` | `'standard'` | The layout: `standard` items on one surface, or `grouped` `md-gb-menu-group`s on separate surfaces with gaps between them. |

Slots

- default slot: The menu's items, groups and dividers.

Methods

- `closeAll`: `() => void` Closes this menu and every menu it is a submenu of.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `filter`: `(query: string) => void` Shows only the items whose label contains `query`, easing the others into their new position.
- `showAt`: `(x: number, y: number) => void` Opens the menu at a point in the viewport (a context menu), keeping it inside the window: it opens below and after the point, and flips when there is no room.

CSS parts

- `::part(menu)`: The menu's root element.

CSS custom properties

- `--container-color`
- `--container-elevation`
- `--container-max-width`
- `--container-min-width`
- `--container-shape`
- `--density-step`: Item height removed per density step (set on the items).
- `--gap`: Space between groups in the grouped layout.
- `--group-padding`
- `--group-shape`
- `--section-label-text`
- `--section-label-text-color`

### `<md-gb-menu-group>`

A Material Design component.

Source: `labs/gb/components/menu/md-gb-menu-group.ts`  
Import: `import '@material/web/labs/gb/components/menu/md-gb-menu-group.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `checkable` | `checkable` (reflects) | `MenuItemCheckable` | `null` |  |
| `label` | `label` | `string` | `''` | The section label shown above the group's items. |

Slots

- default slot: Used to display the menu group's items.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(group)`: The group's root element.
- `::part(label)`: The section label.

### `<md-gb-menu-item>`

A Material Design component.

Source: `labs/gb/components/menu/md-gb-menu-item.ts`  
Import: `import '@material/web/labs/gb/components/menu/md-gb-menu-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `checked` | `checked` (reflects) | `boolean` | `false` |  |
| `disabled` | `disabled` (reflects) | `boolean` | `false` |  |

Slots

- default slot: Used to display the item's primary label.
- `leading`: Used to display icons and content before the item's main content.
- `submenu`: An `md-gb-menu` to open as this item's submenu.
- `supporting-text`: Used to display supporting text below the main label.
- `trailing`: Used to display icons and content after the item's main content.
- `trailing-text`: Used to display metadata or text after the item's main content.

Events

- `change` (`Event`): Fired when a checkbox or menu item is checked or unchecked. --bubbles
- `input` (`InputEvent`): Fired when a checkbox or menu item is checked or unchecked. --bubbles --composed

Methods

- `closeSubmenu`: `() => void` Closes the item's submenu.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `openSubmenu`: `(focus?: boolean) => void` Opens the item's submenu next to it and focuses its first item.

CSS parts

- `::part(menu-item)`: The menu item's root element.

CSS custom properties

- `--between-space`
- `--bottom-space`
- `--container-color`
- `--height`
- `--inner-corner-corner-size`
- `--label-text`
- `--label-text-axes`
- `--label-text-color`
- `--label-text-tracking`
- `--leading-icon-color`
- `--leading-icon-size`
- `--leading-space`
- `--shape`
- `--supporting-text`
- `--supporting-text-axes`
- `--supporting-text-color`
- `--supporting-text-tracking`
- `--top-space`
- `--trailing-icon-color`
- `--trailing-icon-size`
- `--trailing-space`
- `--trailing-supporting-text`
- `--trailing-supporting-text-axes`
- `--trailing-supporting-text-color`
- `--trailing-supporting-text-tracking`
