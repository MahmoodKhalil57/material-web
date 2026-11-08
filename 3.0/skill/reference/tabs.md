# tabs

Elements: `md-gb-tab`, `md-gb-tab-panels`, `md-gb-tabs`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Tabs**
  - Primary, secondary
  - Icons and labels

## API

### `<md-gb-tab>`

A Material Design tab component.

Source: `labs/gb/components/tabs/md-gb-tab.ts`  
Import: `import '@material/web/labs/gb/components/tabs/md-gb-tab.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `selected` | `selected` (reflects) | `boolean` |  | Whether the tab is selected. |
| `tabpanel` | `tabpanel` (reflects) | `string` |  | ID of the associated `md-aria-tabpanel` element. |

Slots

- default slot: Used to display an optional leading icon, such as `<md-gb-icon>`. Icons are unclassed; the tab sets `--md-icon-*` for them.
- `badge`: Used to display an optional badge, such as `<span class="badge tab-badge">`.
- `label`: Used to display the tab's label. `<span class="tab-label">` in the default slot is equivalent. Bare text is not supported.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.

CSS custom properties

- `--badge-space`
- `--focus-indicator-clearance`
- `--focus-indicator-inset`
- `--focus-indicator-shape`
- `--icon-badge-inset`
- `--icon-color`
- `--icon-label-space`
- `--icon-size`
- `--label-text`
- `--label-text-axes`
- `--label-text-color`
- `--label-text-tracking`
- `--leading-space`
- `--stacked-icon-label-space`
- `--tab-scroll-margin`
- `--trailing-space`

### `<md-gb-tab-panels>`

The swipeable content panels of a set of Material Design tabs.

Source: `labs/gb/components/tabs/md-gb-tab-panels.ts`  
Import: `import '@material/web/labs/gb/components/tabs/md-gb-tab-panels.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `gesturesDisabled` | `gestures-disabled` (reflects) | `boolean` | `false` | Whether to turn off swiping between panels. |
| `htmlFor` | `for` | `string` | `''` | The id of the `<md-gb-tabs>` these panels belong to. |

Slots

- default slot: The tab panels: elements with `role="tabpanel"`, such as `<md-aria-tabpanel>` or `<div role="tabpanel">`.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS custom properties

- `--transition-duration`: Duration of a slide between panels.
- `--transition-easing`: Easing of a slide between panels.

### `<md-gb-tabs>`

A Material Design tabs component.

Source: `labs/gb/components/tabs/md-gb-tabs.ts`  
Import: `import '@material/web/labs/gb/components/tabs/md-gb-tabs.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `align` | `align` (reflects) | `"start" \| "center"` | `'center'` | Where fixed tabs sit when the window is wider than compact: `center` (default) or `start`, the leading edge. tabs.md, Responsive layout: "The group of tabs should use a fluid margin and align to the center or leading edge of the body region." At compact windows the tabs fill the full width. |
| `autoSelect` | `autoselect` | `boolean` | `false` | Whether or not to automatically select a tab when it is focused. |
| `density` | `density` (reflects) | `Density` |  | The density, from 0 (default) to -3. Each step down removes 4px from the tabs' height (48px, or 64px with icon and label); values are clamped to that range. tabs.md "Avoid applying density by default": dense tabs are below the 48x48 CSS pixel target, so let people opt in (a denser layout or theme) and keep the controls that change it at 48x48. |
| `orientation` | `orientation` (reflects) | `"horizontal" \| "vertical"` | `'horizontal'` | Orientation of the tablist ('horizontal' or 'vertical'). |
| `scrollable` | `scrollable` (reflects) | `boolean` | `false` | Scrollable tabs: each tab's width is defined by its label (tabs.md) rather than every tab taking the width of the widest, and the bar scrolls when they overflow. Fixed tabs (the default) are equal. |
| `scrollBehavior` | `scroll-behavior` (reflects) | `"hide"` |  | How the tabs react to scrolling: `hide` scrolls them off the screen when the page scrolls down and returns them when it scrolls up (tabs.md). Tabs attached to an app bar (its `tabs` slot) leave this unset: the app bar moves them with itself as one unit. |
| `scrollTarget` | `scroll-target` | `string` | `''` | The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. |
| `selectedTabIndex` | `selectedtabindex` | `number` |  | The index of the currently selected tab. |
| `variant` | `variant` (reflects) | `TabsVariant` | `'primary'` | The visual variant of the tabs. |

Slots

- default slot: Used to display `<md-gb-tab>` children.

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS custom properties

- `--active-indicator-color`
- `--active-indicator-height`
- `--active-indicator-inset`
- `--active-indicator-min-length`
- `--active-indicator-shape`
- `--container-color`
- `--container-height`
- `--container-shape`
- `--density-step`: Tab height removed per density step.
- `--divider-color`
- `--divider-thickness`
