# pulltorefresh

Elements: `md-gb-pull-to-refresh`.

## API

### `<md-gb-pull-to-refresh>`

A Material Design component.

Source: `components/pulltorefresh/md-gb-pull-to-refresh.ts`  
Import: `import '@material/web/components/pulltorefresh/md-gb-pull-to-refresh.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether pulling is turned off (Compose `enabled = false`). |
| `indicator` | `indicator` (reflects) | `PullToRefreshIndicator` | `'loading'` | The indicator: `loading` (M3 Expressive contained loading indicator) or `circular` (circular arrow and progress indicator). |
| `indicatorLabel` | `indicator-label` | `string` | `DEFAULT_LABEL` | Accessible label of the indicator, e.g. "Refreshing news". |
| `refreshing` | `refreshing` (reflects) | `boolean` | `false` | Whether content is refreshing. Set by a pull past the threshold (or `refresh()`); set it back to false once the content has refreshed. |
| `threshold` | `threshold` | `number` | `PULL_TO_REFRESH_THRESHOLD_PX` | How far (px) the indicator must be pulled before releasing it refreshes (Compose `PullToRefreshDefaults.PositionalThreshold`, 80dp). |

Slots

- default slot: The scrolling content.

Events

- `refresh` (`Event`): Fired when a pull (or `refresh()`) starts a refresh. Cancel it to keep `refreshing` false. --cancelable

Methods

- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `refresh`: `() => boolean` Starts a refresh without a gesture, e.g. from a refresh button: fires `refresh` and, unless it is cancelled, sets `refreshing`.

CSS parts

- `::part(indicator)`: The indicator container.
- `::part(scroller)`: The element that scrolls the content.

CSS custom properties

- `--indicator-color`
- `--indicator-container-color`
- `--indicator-container-height`
- `--indicator-container-shape`
- `--indicator-container-width`
- `--indicator-elevation`
- `--indicator-max-distance`: How far the indicator moves below the top edge at the threshold.
- `--motion-effects-duration`
- `--motion-effects-easing`
- `--motion-settle-duration`
- `--motion-settle-easing`
