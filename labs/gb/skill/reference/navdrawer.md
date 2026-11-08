# navdrawer

Elements: `md-gb-nav-drawer`, `md-gb-nav-drawer-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Navigation drawer**
  - Standard, modal
  - Headline, section labels, dividers, badges, link items
  - Swipe to dismiss the modal drawer
  - Note: the Expressive spec suggests the expanded navigation rail for most cases.
  - Group dividers are full-width (the divider is inset by `--divider-inset`, 16px, like the section labels)
  - Icons on all destinations or none (consumer content; mixed icon and text-only destinations are not flagged)

## API

### `<md-gb-nav-drawer>`

A Material Design navigation drawer custom element.

Source: `labs/gb/components/navdrawer/md-gb-nav-drawer.ts`  
Import: `import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `gesturesDisabled` | `gestures-disabled` (reflects) | `boolean` | `false` | Whether swiping a modal drawer closed is turned off (Compose `gesturesEnabled = false`). Escape, the scrim and `close()` still close it. |
| `label` | `label` | `string` | `''` | The accessible name of the navigation landmark. Use it instead of `aria-label` when the host sits outside any landmark: the host's `aria-label` moves to a data attribute that checkers (axe `region`) still read as a name on a host that has no landmark role. |
| `modal` | `modal` (reflects) | `boolean` | `false` | Whether the drawer is modal: it opens over a scrim that blocks the rest of the app, instead of sitting next to the content. |
| `open` | `open` (reflects) | `boolean` |  | Whether the drawer is open. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the open and close transitions. |

Slots

- default slot: Navigation items (`md-gb-nav-drawer-item`), section labels (headings or `.nav-drawer-section-label`) and dividers (`md-gb-divider` or `<hr>`).
- `headline`: Optional headline shown above the items.

Events

- `change` (`Event`): Fired when the user selects a different item. --bubbles
- `close` (`CustomEvent<{reason: string}>`): Fired when the drawer starts closing. --cancelable
- `closed` (`CustomEvent<{reason: string}>`): Fired when the drawer has closed and finished animating.
- `open` (`Event`): Fired when the drawer starts opening. --cancelable
- `opened` (`Event`): Fired when the drawer has opened and finished animating.

Methods

- `close`: `(reason?: string) => Promise<void>` Closes the drawer. Resolves once it has finished animating.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `show`: `() => Promise<void>` Opens the drawer. Resolves once it has finished animating.
- `toggle`: `() => Promise<void>` Opens the drawer when closed, closes it when open.

CSS parts

- `::part(dialog)`: The modal drawer's `<dialog>`.
- `::part(drawer)`: The drawer sheet.
- `::part(nav)`: The `<nav>` landmark.
- `::part(scrim)`: The modal drawer's scrim.

CSS custom properties

- `--active-focus-icon-color`
- `--active-focus-label-text-color`
- `--active-hover-icon-color`
- `--active-hover-label-text-color`
- `--active-icon-color`
- `--active-indicator-color`
- `--active-indicator-height`
- `--active-indicator-shape`
- `--active-indicator-width`
- `--active-label-text`
- `--active-label-text-axes`
- `--active-label-text-color`
- `--active-pressed-icon-color`
- `--active-pressed-label-text-color`
- `--container-color`
- `--container-elevation`
- `--container-height`
- `--container-padding-block`
- `--container-padding-inline`
- `--container-shape`: Radius of the end corners.
- `--container-width`
- `--container-width-minimum`
- `--divider-inset`
- `--headline`
- `--headline-axes`
- `--headline-color`
- `--headline-tracking`
- `--icon-size`
- `--inactive-focus-icon-color`
- `--inactive-focus-label-text-color`
- `--inactive-hover-icon-color`
- `--inactive-hover-label-text-color`
- `--inactive-icon-color`
- `--inactive-label-text-color`
- `--inactive-pressed-icon-color`
- `--inactive-pressed-label-text-color`
- `--item-icon-label-space`
- `--item-leading-space`
- `--item-trailing-space`
- `--label-text`
- `--label-text-axes`
- `--label-text-tracking`
- `--large-badge-label`
- `--large-badge-label-axes`
- `--large-badge-label-color`
- `--large-badge-label-tracking`
- `--motion-close-duration`
- `--motion-close-easing`
- `--motion-effects-duration`
- `--motion-effects-easing`
- `--motion-open-duration`
- `--motion-open-easing`
- `--scrim-color`
- `--scrollbar-gutter`: `stable` reserves the scrollbar gutter, so a scrollbar that appears doesn't move the items (default `auto`: where scrollbars take space it would narrow the 12dp indicator padding).
- `--section-label-height`
- `--section-label-leading-space`

### `<md-gb-nav-drawer-item>`

A Material Design navigation drawer item custom element.

Source: `labs/gb/components/navdrawer/md-gb-nav-drawer-item.ts`  
Import: `import '@material/web/labs/gb/components/navdrawer/md-gb-nav-drawer-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `badge` | `badge` | `string` | `''` | Trailing badge label text, such as an unread count. Ignored when content is slotted into `badge`. |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the item is disabled. |
| `href` | `href` | `string` | `''` | The URL the item links to. Renders a link (`<a>`) when set. |
| `rel` | `rel` | `string` | `''` | The link's `rel` attribute, when `href` is set. |
| `selected` | `selected` (reflects) | `boolean` | `false` | Whether the item is the selected (current) destination. |
| `tabStop` | property only | `boolean` | `true` | Whether the item is in the tab order. The parent `md-gb-nav-drawer` manages this to provide a single tab stop with arrow key navigation. |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `''` | Where to open the linked `href`, e.g. `_blank`. |

Slots

- default slot: The item's label text.
- `badge`: Trailing badge label text (overrides the `badge` property).
- `icon`: The item's leading icon (`md-gb-icon`). Filled when selected.

Methods

- `blur`: `() => void` [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/blur)
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `focus`: `(options?: FocusOptions) => void` Focuses the item's link or button.

CSS parts

- `::part(badge)`: The trailing badge label container.
- `::part(icon)`: The icon container.
- `::part(item)`: The item's link or button.
- `::part(label)`: The label text container.
