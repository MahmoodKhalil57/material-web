# scaffold

Elements: `md-gb-app-scaffold`, `md-gb-pane-scaffold`.

## API

### `<md-gb-app-scaffold>`

A Material Design app scaffold (bars, rails, FAB, snackbar).

Source: `components/scaffold/md-gb-app-scaffold.ts`  
Import: `import '@material/web/components/scaffold/md-gb-app-scaffold.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `autoExpandRail` | `auto-expand-rail` (reflects) | `boolean` | `false` | Whether to expand a slotted navigation rail at large and extra-large windows and collapse it below (spec: breakpoints, swapping components). Applied when the window size class changes. |
| `navigation` | `navigation` (reflects) | `ScaffoldNavigation` | `'auto'` | Which navigation component to show. |
| `sideSheetNavigation` | `side-sheet-navigation` (reflects) | `SideSheetNavigation` | `'keep'` | What the navigation rail does while a side sheet is present (spec: breakpoints and scaffold): `keep` it as is, `collapse` it to the collapsed rail, or `hide` it completely. A side sheet is present while the nested pane scaffold shows its tertiary pane or `side-sheet-open` is set. |
| `sideSheetOpen` | `side-sheet-open` (reflects) | `boolean` | `false` | Whether an app-managed side sheet is open. |

Slots

- default slot: The content, typically an `md-gb-pane-scaffold`. Scrolls.
- `companion-rail`: A companion rail on the trailing side of large and extra-large windows, holding supporting controls or actions that modify or relate to the content in a pane.
- `fab`: A FAB, 16px from the trailing and bottom edges of the content.
- `navigation-bar`: A navigation bar (`md-gb-nav-bar`) at the bottom.
- `navigation-rail`: A navigation rail (`md-gb-nav-rail`) at the leading edge.
- `snackbar`: A snackbar host (`md-gb-snackbar`), above the FAB.
- `toolbar`: A toolbar floating in the bottom rail region, centered above the navigation bar (mobile).
- `top-app-bar`: A top app bar (`md-gb-app-bar`), beside the rail.

Events

- `navigation-change` (`CustomEvent<NavigationChangeDetail>`): Fired when the shown navigation component changes. --bubbles --composed
- `window-class-change` (`CustomEvent<WindowClassChangeDetail>`): Fired when the window size class changes. --bubbles --composed
- `window-height-class-change` (`CustomEvent<WindowHeightClassChangeDetail>`): Fired when the window height size class changes. --bubbles --composed

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.

CSS parts

- `::part(body)`: The content region (content, FAB and snackbar).
- `::part(companion-rail)`: The companion rail region.
- `::part(content)`: The scrolling content container.
- `::part(navigation-bar)`: The navigation bar region.
- `::part(rail)`: The navigation rail region.
- `::part(scaffold)`: The scaffold grid.
- `::part(toolbar)`: The floating toolbar region.
- `::part(top-app-bar)`: The top app bar region.

CSS custom properties

- `--container-color`: Scaffold background.
- `--content-color`: Scaffold content color.
- `--scrollbar-gutter`: `stable` reserves the content's scrollbar gutter, so a scrollbar that appears doesn't move the content (default `auto`: the pane widths are measured to the edges).

### `<md-gb-pane-scaffold>`

A Material Design pane scaffold (list-detail, supporting pane, feed).

Source: `components/scaffold/md-gb-pane-scaffold.ts`  
Import: `import '@material/web/components/scaffold/md-gb-pane-scaffold.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `arrangement` | `arrangement` (reflects) | `PaneArrangement` | `'fixed-flexible'` | How two panes share the width. |
| `collapsedPane` | `collapsed-pane` (reflects) | `"primary" \| "secondary"` | `null` | A pane collapsed with the drag handle, or null. |
| `detailOpen` | `detail-open` (reflects) | `boolean` | `false` | List-detail: whether an item is selected. Single-pane windows show the detail (primary) pane when true and the list (secondary) pane when false; two-pane windows show the `placeholder` slot instead of the detail while false. |
| `dragHandleLabel` | `drag-handle-label` | `string` | `'Resize panes'` | Accessible label of the drag handle. |
| `handleTap` | `handle-tap` | `PaneHandleTap` | `'toggle'` | What a tap, Enter or Space on the drag handle does, the single-pointer alternative to dragging it: `toggle` (default) switches between one and two panes; `cycle` steps through the snap widths and then collapses the secondary pane. |
| `layout` | `layout` (reflects) | `PaneScaffoldLayout` | `'list-detail'` | The canonical layout. |
| `levitate` | `levitate` (reflects) | `PaneLevitate` | `'none'` | The levitate strategy for the secondary pane of supporting pane and feed layouts in windows too small for two panes: `none` reflows it below the primary pane, `floating` floats it above, `docked` docks it to the bottom edge at compact (floating from medium). |
| `levitateCoplanar` | `levitate-coplanar` (reflects) | `boolean` | `false` | Keeps a levitated pane co-planar at large and extra-large windows. By default it floats there (spec: scaffold, "On large screens: floating panes are the default"). |
| `levitateDraggable` | `levitate-draggable` (reflects) | `boolean` | `false` | Lets a floating pane be dragged by its handle, or moved with the arrow keys while the handle is focused (spec: scaffold, floating panes "can be customized to be dragged or resized"). |
| `levitateLabel` | `levitate-label` | `string` | `''` | Accessible label of a modal levitated pane (its dialog role). |
| `levitateModal` | `levitate-modal` (reflects) | `boolean` | `false` | Whether the levitated secondary pane is modal (scrim, inert panes). |
| `levitateMoveLabel` | `levitate-move-label` | `string` | `'Move pane'` | Accessible label of the floating pane's move handle. |
| `levitateOpen` | `levitate-open` (reflects) | `boolean` | `false` | Whether the levitated secondary pane is shown. |
| `levitateResizable` | `levitate-resizable` (reflects) | `boolean` | `false` | Lets a floating pane be resized by its corner handle, or with the arrow keys while the handle is focused. |
| `levitateResizeLabel` | `levitate-resize-label` | `string` | `'Resize pane'` | Accessible label of the floating pane's resize handle. |
| `mediumTwoPane` | `medium-two-pane` (reflects) | `boolean` | `false` | Whether medium windows show two panes (50% each) instead of one. The spec limits this to low-density content such as settings. |
| `paneWidth` | `pane-width` | `number` | `null` | Width in px of the secondary pane set with the drag handle, or null for the default width. Set it to restore a persisted width. |
| `resizable` | `resizable` (reflects) | `boolean` | `false` | Whether two-pane layouts render a drag handle to resize the panes. |
| `resizeBehavior` | `resize-behavior` | `PaneResizeBehavior` | `undefined` | `persistent` keeps a resized width or collapsed pane across window size class changes; `temporary` returns to the default layout. Defaults to persistent for list-detail and temporary for the other layouts. |
| `scrollLabel` | `scroll-label` | `string` | `'Panes'` | Accessible label of the stacked panes' scroll region. Only used while the stacked panes overflow and hold nothing focusable: the region is then focusable (so the keyboard can scroll it) and a labelled `region`. |
| `secondaryPosition` | `secondary-position` (reflects) | `PanePosition` | `undefined` | Where the secondary pane sits in two-pane layouts. Defaults to `start` for list-detail and `end` for supporting pane and feed layouts. Mirrors in right-to-left. |

Slots

- default slot: The primary (flexible) pane: the detail pane of a list-detail layout, the focus pane of a supporting pane layout, or the feed items (laid out on a grid) of a feed layout.
- `placeholder`: Shown in the primary pane of a two-pane list-detail layout while `detail-open` is false (no item selected). Levitate (spec: scaffold, "Levitate"): with `levitate="floating"` or `levitate="docked"`, the secondary pane of a supporting pane or feed layout floats above the primary pane (or docks to the bottom edge at compact, like a bottom sheet) in windows too small for two co-planar panes, while `levitate-open` is set. `levitate-modal` makes it modal: a scrim covers the panes, the primary pane is inert, focus moves into the pane and back to the trigger, and the pane closes when something behind it is used or Escape is pressed. Modality is scoped to the scaffold; use `md-gb-dialog` or `md-gb-sheet` for app-wide modals. At large and extra-large windows a levitated pane keeps floating (spec: "On large screens, floating panes are the default"); the scrim is optional (`levitate-modal` adds it). `levitate-coplanar` opts into a co-planar pane there instead. `levitate-draggable` and `levitate-resizable` add a move handle and a resize corner to a floating pane: drag them, or focus them and use the arrow keys (Shift moves in larger steps). `levitate-change` fires after each move or resize. Foldables: the scaffold reads the fold (hinge) from the Viewport Segments API and keeps panes off it. A vertical fold splits two panes at the fold with the spacer on it (at least the spacer width); a horizontal fold (tabletop) stacks the supporting pane below it. The fold crossing the scaffold is reflected as the `fold` attribute (`vertical` or `horizontal`). Browsers without the API keep the regular layout.
- `secondary`: The secondary pane: the list of a list-detail layout or the supporting pane. It is the fixed pane in fixed-and-flexible arrangements.
- `tertiary`: An optional third pane (e.g. a standard side sheet), shown at extra-large only.

Events

- `levitate-close` (`Event`): Fired when the scaffold closes a levitated pane (Escape, or using something behind a modal pane). --bubbles --composed
- `pane-layout-change` (`CustomEvent<PaneLayoutChangeDetail>`): Fired when the visible panes change. --bubbles --composed
- `pane-resize` (`CustomEvent<PaneResizeDetail>`): Fired when the panes are resized or collapsed with the drag handle. --bubbles --composed
- `window-class-change` (`CustomEvent<WindowClassChangeDetail>`): Fired when the window size class changes. --bubbles --composed
- `window-height-class-change` (`CustomEvent<WindowHeightClassChangeDetail>`): Fired when the window height size class changes. --bubbles --composed

Methods

- `closeDetail`: `() => void` List-detail: returns to the list (e.g. from the detail pane's back button in a single-pane window).
- `closeLevitated`: `() => void` Hides the levitated secondary pane.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `measureFold`: `() => void` Finds where the viewport's fold crosses the scaffold. Call it after moving the scaffold without resizing it.
- `openDetail`: `() => void` List-detail: shows the detail pane (e.g. after selecting an item).
- `openLevitated`: `() => void` Shows the levitated secondary pane.
- `resetPaneWidth`: `() => void` Returns the panes to their default widths.

CSS parts

- `::part(drag-handle)`: The drag handle.
- `::part(pane)`: Each pane.
- `::part(primary)`: The primary pane.
- `::part(scaffold)`: The flex container of the panes.
- `::part(scrim)`: The scrim behind a modal levitated pane.
- `::part(secondary)`: The secondary pane.
- `::part(spacer)`: The spacer between panes.
- `::part(tertiary)`: The tertiary pane.

CSS custom properties

- `--feed-columns`: Overrides the number of feed grid columns.
- `--md-gb-scaffold-companion-inline-size`: Width of a companion rail on the trailing side of the scaffold. Set by `md-gb-app-scaffold`.
- `--md-gb-scaffold-nav-inline-size`: Width of a navigation rail beside the scaffold, so split panes keep the spacer centered in the window. Set by `md-gb-app-scaffold`.
- `--pane-container-color`: Pane background (transparent: panes blend with the background, implicit grouping).
- `--pane-container-shape`: Pane corner radius.
- `--scrollbar-gutter`: `stable` reserves the panes' scrollbar gutters, so a scrollbar that appears doesn't move their content (default `auto`: the spacer is centered on the pane edges).
