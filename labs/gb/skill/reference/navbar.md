# navbar

Elements: `md-gb-nav-bar`, `md-gb-nav-bar-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Navigation bar**
  - Items with labels and badges
  - Horizontal items (medium windows), `item-layout="auto"`

## API

### `<md-gb-nav-bar>`

A Material Design gBreeze navigation bar custom element.

Source: `labs/gb/components/navbar/md-gb-nav-bar.ts`  
Import: `import '@material/web/labs/gb/components/navbar/md-gb-nav-bar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `autoSelect` | `autoselect` | `boolean` | `false` | Whether or not to automatically select a tab when it is focused. |
| `itemLayout` | `item-layout` (reflects) | `NavBarLayout` | `'vertical'` | The layout orientation of items: `vertical`, `horizontal`, or `auto` (vertical in compact windows, horizontal from medium windows, 600px). |
| `orientation` | `orientation` (reflects) | `"horizontal" \| "vertical"` | `'horizontal'` | Orientation of the tablist ('horizontal' or 'vertical'). |
| `scrollBehavior` | `scroll-behavior` (reflects) | `"hide"` |  | How the bar reacts to scrolling: `hide` hides it on scroll down. |
| `scrollTarget` | `scroll-target` | `string` | `''` | The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. |
| `selectedIndex` | `selected-index` | `number` |  | The 0-based index of the currently active navigation bar item. Alias for `selectedTabIndex`. |
| `selectedTabIndex` | `selectedtabindex` | `number` |  | The index of the currently selected tab. |

Slots

- default slot: Used to display navigation bar items (`md-gb-nav-bar-item`).

Events

- `change` (`Event`): Fired when the selected navigation bar item changes. --bubbles

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(nav-bar)`: The navigation bar's root container.

CSS custom properties

- `--container-color`
- `--container-elevation`
- `--container-height`
- `--container-shadow-color`
- `--container-shape`
- `--item-active-icon-color`
- `--item-active-indicator-color`
- `--item-active-indicator-height`
- `--item-active-indicator-icon-label-space`
- `--item-active-indicator-leading-space`
- `--item-active-indicator-shape`
- `--item-active-indicator-trailing-space`
- `--item-active-indicator-width`
- `--item-active-label-text-color`
- `--item-active-state-layer-color`
- `--item-between-space`
- `--item-container-between-space`
- `--item-icon-size`
- `--item-inactive-icon-color`
- `--item-inactive-label-text-color`
- `--item-inactive-state-layer-color`
- `--item-label-text`
- `--item-label-text-axes`
- `--item-label-text-tracking`
- `--motion-duration`
- `--motion-easing`

### `<md-gb-nav-bar-item>`

A Material Design gBreeze navigation bar item custom element.

Source: `labs/gb/components/navbar/md-gb-nav-bar-item.ts`  
Import: `import '@material/web/labs/gb/components/navbar/md-gb-nav-bar-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `active` | `active` (reflects) | `boolean` |  | Whether the navigation bar item is active. Alias for `selected`. |
| `badge` | `badge` | `string` | `''` | Optional badge text (or 'dot' / 'true' for a small dot badge). |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the navigation bar item is disabled. |
| `itemLayout` | `item-layout` (reflects) | `NavBarItemLayout` | `'vertical'` | The layout orientation of the item ('vertical' or 'horizontal'). |
| `label` | `label` | `string` | `''` | Optional label text if not provided via default slot. |
| `tabpanel` | `tabpanel` (reflects) | `string` |  | ID of the associated `md-aria-tabpanel` element. |
| `unfilledIcon` | `unfilled-icon` (reflects) | `boolean` | `false` | Whether the icon has no filled style. The active destination then uses the semibold icon weight instead of the filled icon. |

Slots

- default slot: Used to display the item's label text.
- `badge`: Used to display a custom badge on the item's icon.
- `icon`: Used to display the item's icon (`md-gb-icon`).

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS parts

- `::part(indicator)`: The active indicator / icon container element.
- `::part(label)`: The label text container element.
- `::part(nav-bar-item)`: The navigation bar item's presentational container.
