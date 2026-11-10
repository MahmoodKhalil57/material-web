# navrail

Elements: `md-gb-nav-rail`, `md-gb-nav-rail-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Navigation rail**
  - Collapsed, expanded
  - Modal (scrim, swipe to dismiss)
  - Alignment, narrow
  - Badges
  - Header FAB becomes an extended FAB when expanded
  - Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)

## API

### `<md-gb-nav-rail>`

A Material Design navigation rail custom element.

Source: `components/navrail/md-gb-nav-rail.ts`  
Import: `import '@material/web/components/navrail/md-gb-nav-rail.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` (reflects) | `NavRailAlignment` | `'top'` | Vertical alignment of items ('top', 'center', or 'bottom'). |
| `autoSelect` | `autoselect` | `boolean` | `false` | Whether or not to automatically select a tab when it is focused. |
| `collapsible` | `collapsible` (reflects) | `boolean` | `false` | Whether the navigation rail renders a built-in expand/collapse menu button in the header when no toggle button is slotted into `slot="header"`. |
| `divider` | `divider` (reflects) | `boolean` | `false` | Whether a vertical divider marks the edge of the rail next to the app's content. |
| `elevated` | `elevated` (reflects) | `boolean` | `false` | Whether the rail is elevated to level 1, to distinguish it from content that scrolls underneath it. |
| `expanded` | `expanded` (reflects) | `boolean` | `false` | Whether the navigation rail is expanded to show horizontal items. |
| `hideWhenCollapsed` | `hide-when-collapsed` (reflects) | `boolean` | `false` | Hide when collapsed (navigation-rail.md): the collapsed rail is not shown and takes no space, so the body content fills in. The expanded rail (always modal in this mode) appears over the content when the app's menu button calls `expand()` or `toggle()`; keep that menu button accessible. |
| `itemLayout` | `item-layout` (reflects) | `NavRailItemLayout` | `'vertical'` | The layout orientation of items ('vertical' or 'horizontal'). |
| `modal` | `modal` (reflects) | `boolean` | `false` | Whether the expanded navigation rail is modal: it opens over the content with a scrim, with modal elevation and shape. |
| `narrow` | `narrow` (reflects) | `boolean` | `false` | Whether the collapsed rail uses the narrow width (`md.comp.nav-rail.collapsed.narrow.container.width`, 80dp). |
| `selectedIndex` | `selected-index` | `number` |  | The 0-based index of the currently active navigation rail item. Alias for `selectedTabIndex`. |
| `selectedTabIndex` | `selectedtabindex` | `number` |  | The index of the currently selected tab. |

Slots

- default slot: Used to display navigation rail items (`md-gb-nav-rail-item`).
- `header`: Used to display optional header controls (menu button, FAB).

Events

- `change` (`Event`): Fired when the selected item changes. --bubbles
- `toggle` (`CustomEvent<{expanded: boolean, reason?: string}>`): Fired when the expanded state is toggled. --bubbles

Methods

- `collapse`: `() => void` Collapses the navigation rail.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `expand`: `() => void` Expands the navigation rail.
- `handleBack`: `() => Promise<void>` Handles a back request (the Android back gesture or button) on the modal expanded rail: plays the predictive back motion, then collapses the rail. Call it for an in-app back control that should behave like the system back. Resolves after the back motion.
- `toggle`: `(force?: boolean) => boolean` Toggles the expanded state of the navigation rail.

CSS parts

- `::part(header)`: The navigation rail's header container.
- `::part(items)`: The navigation rail's items container.
- `::part(menu-button)`: The built-in expand/collapse menu button when `collapsible`.
- `::part(nav-rail)`: The navigation rail's root container.
- `::part(scrim)`: The modal rail's scrim, while expanded. A `modal` rail expands over the content with a scrim, like Compose `ModalWideNavigationRail`. Clicking the scrim, pressing Escape or swiping the rail toward its edge collapses it. The scrim (and the menu button of a `collapsible` rail) are the single-pointer alternatives to the swipe. While a modal rail is expanded, focus moves into it, Tab stays inside it, page scrolling is locked, and focus returns to the previous element when it collapses. The `toggle` event's `detail.reason` says why a modal rail collapsed (`escape`, `back`, `scrim` or `swipe`). Predictive back applies to the modal expanded rail (navigation-rail.md): while it is expanded the rail listens for back requests with a `CloseWatcher` (the Android back gesture or button, and Escape), falling back to Escape on the document where `CloseWatcher` is missing. A back request plays the predictive back motion (the rail pops off its edge, Compose `ModalWideNavigationRail` scales) and collapses the rail. A FAB (`md-gb-fab` with a `label`) in the header is an extended FAB while the rail is expanded and an icon FAB while it is collapsed.

CSS custom properties

- `--collapsed-item-vertical-space`
- `--collapsed-narrow-container-width`
- `--collapsed-top-space`
- `--container-color`
- `--container-elevation`
- `--container-shape`
- `--container-vertical-padding`
- `--container-width`
- `--expanded-container-color`
- `--expanded-container-width-maximum`
- `--expanded-container-width-minimum`
- `--expanded-modal-container-color`
- `--expanded-top-space`
- `--header-space-minimum`
- `--item-active-focused-icon-color`
- `--item-active-focused-label-text-color`
- `--item-active-hovered-icon-color`
- `--item-active-hovered-label-text-color`
- `--item-active-icon-color`
- `--item-active-indicator-color`
- `--item-active-indicator-height`
- `--item-active-indicator-shape`
- `--item-active-indicator-width`
- `--item-active-label-text-color`
- `--item-active-pressed-icon-color`
- `--item-active-pressed-label-text-color`
- `--item-active-state-layer-color`
- `--item-container-height`
- `--item-container-vertical-space`
- `--item-full-width-leading-space`
- `--item-full-width-trailing-space`
- `--item-horizontal-active-indicator-height`
- `--item-horizontal-icon-label-space`
- `--item-icon-size`
- `--item-inactive-focused-icon-color`
- `--item-inactive-focused-label-text-color`
- `--item-inactive-hovered-icon-color`
- `--item-inactive-hovered-label-text-color`
- `--item-inactive-icon-color`
- `--item-inactive-label-text-color`
- `--item-inactive-pressed-icon-color`
- `--item-inactive-pressed-label-text-color`
- `--item-inactive-state-layer-color`
- `--item-label-text-font`
- `--item-label-text-font-axes`
- `--item-label-text-font-tracking`
- `--item-outer-space`
- `--item-vertical-icon-label-space`
- `--item-vertical-leading-space`
- `--item-vertical-trailing-space`
- `--modal-container-elevation`
- `--modal-container-shape`
- `--modal-scrim-color`
- `--motion-duration`
- `--motion-easing`

### `<md-gb-nav-rail-item>`

A Material Design navigation rail item custom element.

Source: `components/navrail/md-gb-nav-rail-item.ts`  
Import: `import '@material/web/components/navrail/md-gb-nav-rail-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `active` | `active` (reflects) | `boolean` |  | Whether the navigation rail item is active. Alias for `selected`. TODO: replace reflected `[active]` with `:state(selected)` |
| `badge` | `badge` | `string` | `''` | Optional badge text (or 'dot' / 'true' for a small dot badge). |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the navigation rail item is disabled. |
| `href` | `href` | `string` | `''` | The URL the destination links to. The item is then a link (role `link`, `aria-current="page"` while selected) instead of a tab. |
| `itemLayout` | `item-layout` (reflects) | `NavRailItemLayout` | `'vertical'` | The layout orientation of the item ('vertical' or 'horizontal'). |
| `label` | `label` | `string` | `''` | Optional label text if not provided via default slot. |
| `rel` | `rel` | `string` | `''` | The link's `rel` attribute, when `href` is set. |
| `secondary` | `secondary` (reflects) | `boolean` | `false` | Whether the destination is secondary: it shows only while the rail is expanded. |
| `tabpanel` | `tabpanel` (reflects) | `string` |  | ID of the associated `md-aria-tabpanel` element. |
| `target` | `target` | `"" \| "_blank" \| "_parent" \| "_self" \| "_top"` | `''` | Where to open the linked `href`, e.g. `_blank`. |
| `unfilledIcon` | `unfilled-icon` (reflects) | `boolean` | `false` | Whether the icon has no filled style. The active destination then uses the semibold icon weight instead of the filled icon. |

Slots

- default slot: Used to display the item's label text.
- `badge`: Used to display a custom badge on the item's icon.
- `icon`: Used to display the item's icon (`md-gb-icon`).

Methods

- `click`: `() => void` Activates the destination: follows its link, else clicks the tab.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS parts

- `::part(indicator)`: The active indicator / icon container element.
- `::part(label)`: The label text container element.
- `::part(nav-rail-item)`: The navigation rail item's presentational container.
