# search

Elements: `md-gb-search-bar`, `md-gb-search-view`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Search**
  - Search bar
  - Search view (docked, full-screen; contained and divided) with suggestions
  - Predictive back (dialog `cancel` / `CloseWatcher`; close motion from Compose; no web gesture progress events)

## API

### `<md-gb-search-bar>`

A Material Design search bar.

Source: `labs/gb/components/search/md-gb-search-bar.ts`  
Import: `import '@material/web/labs/gb/components/search/md-gb-search-bar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `backLabel` | `back-label` | `string` | `'Back'` | Accessible label of the view's back button. |
| `clearLabel` | `clear-label` | `string` | `'Clear search'` | Accessible label of the view's clear button. |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the search bar is disabled. |
| `divided` | `divided` (reflects) | `boolean` | `false` | Uses the divided (baseline) view style. |
| `docked` | `docked` (reflects) | `boolean` | `false` | Opens the view docked below the bar, for medium and larger windows. Otherwise it opens full-screen. |
| `expanded` | `expanded` (reflects) | `boolean` |  | Whether the search view is open. |
| `label` | `label` | `string` | `''` | Accessible label of the inputs. Defaults to `placeholder`, per the spec. |
| `placeholder` | `placeholder` | `string` | `''` | Hinted search text, e.g. "Search messages". |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the open and close animations. |
| `resultsLabel` | `results-label` | `string` | `'Search results'` | Accessible label of the results listbox. |
| `searching` | `searching` (reflects) | `boolean` | `false` | Whether the app is searching: shows progress in the view. |
| `searchingLabel` | `searching-label` | `string` | `'Searching'` | Accessible label of the searching progress indicator. |
| `suggestionsLabel` | `suggestions-label` | `string` | `'Suggestions available'` | Announced when suggestions or results become available. |
| `value` | `value` | `string` | `''` | The search text. Shared with the view. |

Slots

- default slot: Search suggestions or results, shown in the view. Use elements with `role="option"`; slotted elements without a role get it.
- `avatar`: A trailing avatar image.
- `leading`: A navigation icon button. Defaults to a non-functional search icon.
- `trailing`: Up to two trailing icons or icon buttons.
- `view-trailing`: Trailing icon buttons in the view's header.

Events

- `>}` (`CustomEvent<{value: string`): search - Fired when a search is executed with Enter in the view.
- `change` (`Event`): Fired when the search text is committed.
- `input` (`InputEvent`): Fired when the search text changes.
- `open` (`Event`): Fired when the view begins opening. Cancelable.
- `opened` (`Event`): Fired when the view has opened and animations finished.

Methods

- `close`: `(reason?: string) => Promise<void>` Closes the search view.
- `focus`: `(options?: FocusOptions) => void` Focuses the search bar input.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `show`: `() => Promise<void>` Opens the search view.

CSS parts

- `::part(bar)`: The search bar container.
- `::part(input)`: The search bar input.
- `::part(view)`: The `md-gb-search-view`.

CSS custom properties

- `--avatar-shape`: Avatar shape.
- `--avatar-size`: Avatar size.
- `--contained-avatar-target-size`: Avatar tap target size.
- `--contained-icon-label-gap`: Space between the icon targets and the input.
- `--contained-leading-margin`: Recommended margin to the start of the window.
- `--contained-leading-space`: Space before the leading icon target.
- `--contained-motion-duration`: Expand and collapse duration.
- `--contained-motion-spring`: Expand and collapse easing.
- `--contained-no-actions-leading-space`: Leading space without a leading icon.
- `--contained-no-actions-trailing-space`: Trailing space without trailing icons.
- `--contained-trailing-actions-gap`: Gap between trailing icon targets.
- `--contained-trailing-actions-leading-space`: Space before the trailing icon targets.
- `--contained-trailing-actions-trailing-space`: Space after the trailing icon targets.
- `--contained-trailing-margin`: Recommended margin to the end of the window.
- `--contained-trailing-space`: Trailing space.
- `--container-color`: Container color.
- `--container-height`: Container height.
- `--container-shape`: Container shape.
- `--icon-size`: Icon size.
- `--icon-target-size`: Icon tap target size.
- `--input-text`: Input typography.
- `--input-text-axes`: Input font variation settings.
- `--input-text-color`: Input text color.
- `--input-text-tracking`: Input letter spacing.
- `--leading-icon-color`: Leading icon color.
- `--leading-icon-leading-icon-label-space`: Divided style space between the leading icon and input.
- `--leading-space`: Divided style leading space.
- `--max-width`: Maximum width.
- `--min-width`: Minimum width.
- `--supporting-text`: Placeholder typography.
- `--supporting-text-axes`: Placeholder font variation settings.
- `--supporting-text-color`: Placeholder color.
- `--supporting-text-tracking`: Placeholder letter spacing.
- `--trailing-icon-color`: Trailing icon color.
- `--trailing-icon-label-trailing-icon-space`: Divided style space between the input and trailing icon.
- `--trailing-space`: Divided style trailing space.

### `<md-gb-search-view>`

Focused search: suggestions or results opened from a search bar.

Source: `labs/gb/components/search/md-gb-search-view.ts`  
Import: `import '@material/web/labs/gb/components/search/md-gb-search-view.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `backLabel` | `back-label` | `string` | `'Back'` | Accessible label of the back button. |
| `bar` | property only | `HTMLElement` | `null` | The search bar the view expands from. Docked, the view is positioned over it. |
| `clearLabel` | `clear-label` | `string` | `'Clear search'` | Accessible label of the clear button. |
| `divided` | `divided` (reflects) | `boolean` | `false` | Divided (baseline) style, with a divider between the header and results. Otherwise the view uses the contained M3 Expressive style. |
| `docked` | `docked` (reflects) | `boolean` | `false` | Docked layout: a drop-down below the search bar over a scrim. Otherwise the view is full-screen. |
| `label` | `label` | `string` | `''` | Accessible label of the input and dialog. Defaults to `placeholder`. |
| `open` | `open` (reflects) | `boolean` |  | Whether the view is open. |
| `placeholder` | `placeholder` | `string` | `''` | Hinted search text. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Whether to skip the open and close animations. |
| `resultsLabel` | `results-label` | `string` | `'Search results'` | Accessible label of the results listbox. |
| `searching` | `searching` (reflects) | `boolean` | `false` | Whether the app is searching: shows a progress indicator under the header and marks the results busy for assistive technology. |
| `searchingLabel` | `searching-label` | `string` | `'Searching'` | Accessible label of the searching progress indicator. |
| `suggestionsLabel` | `suggestions-label` | `string` | `'Suggestions available'` | Announced when suggestions or results become available. |
| `value` | `value` | `string` | `''` | The search text. |

Slots

- default slot: Search suggestions or results.
- `leading`: Replaces the back icon button.
- `trailing`: Trailing icons or icon buttons, after the clear button.

Events

- `>}` (`CustomEvent<{value: string`): search - Fired when a search is executed with Enter.
- `change` (`Event`): Fired when the input text is committed.
- `input` (`InputEvent`): Fired when the input text changes.
- `open` (`Event`): Fired when the view begins opening. Cancelable.
- `opened` (`Event`): Fired when the view has opened and animations finished.

Methods

- `clear`: `() => void` Clears the search text and focuses the input.
- `close`: `(reason?: string) => Promise<void>` Closes the view.
- `disconnectedCallback`: `() => void` Invoked when the component is removed from the document's DOM. This callback is the main signal to the element that it may no longer be used. `disconnectedCallback()` should ensure that nothing is holding a reference to the element (such as event listeners added to nodes external to the element), so that it is free to be garbage collected. ```ts disconnectedCallback() { super.disconnectedCallback(); window.removeEventListener('keydown', this._handleKeydown); } ``` An element may be re-connected after being disconnected.
- `focus`: `(options?: FocusOptions) => void` Focuses the search input.
- `handleBack`: `() => Promise<void>` Handles a back request (the Android back gesture or button, which the view receives through its dialog): a full-screen view plays the predictive back motion, then the view closes with reason `back`. Call it for an in-app back control that should behave like the system back.
- `render`: `() => TemplateResult<1>` Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's `ChildPart` - typically a `TemplateResult`. Setting properties inside this method will *not* trigger the element to update.
- `show`: `() => Promise<void>` Opens the view.

CSS parts

- `::part(container)`: The view's container.
- `::part(dialog)`: The modal `<dialog>`.
- `::part(divider)`: The divider of the divided style.
- `::part(header)`: The header with the input.
- `::part(input)`: The search input.
- `::part(results)`: The `role="listbox"` results container.

CSS custom properties

- `--bar-container-height`: Contained full-screen bar height.
- `--bar-results-gap`: Contained docked gap between the bar and results.
- `--bar-shape`: Contained bar shape.
- `--contained-background-color`: Contained full-screen background color.
- `--contained-icon-label-gap`: Space between the icon targets and the input.
- `--contained-leading-margin`: Contained full-screen bar leading margin.
- `--contained-motion-duration`: Contained expand and collapse duration.
- `--contained-motion-spring`: Contained expand and collapse easing.
- `--contained-trailing-margin`: Contained full-screen bar trailing margin.
- `--container-color`: Container color.
- `--container-shape`: Container shape.
- `--content-fade-in-delay`: Results fade in delay.
- `--content-fade-in-duration`: Results fade in duration.
- `--content-fade-in-easing`: Results fade in easing.
- `--content-fade-out-duration`: Results fade out duration.
- `--content-fade-out-easing`: Results fade out easing.
- `--divided-collapse-motion-duration`: Divided collapse duration.
- `--divided-collapse-motion-spring`: Divided collapse easing.
- `--divided-expand-motion-duration`: Divided expand duration.
- `--divided-expand-motion-spring`: Divided expand easing.
- `--divider-color`: Divided style divider color.
- `--header-container-height`: Header height.
- `--header-input-text`: Input typography.
- `--header-input-text-axes`: Input font variation settings.
- `--header-input-text-color`: Input text color.
- `--header-input-text-tracking`: Input letter spacing.
- `--header-leading-icon-color`: Back icon color.
- `--header-supporting-text`: Placeholder typography.
- `--header-supporting-text-axes`: Placeholder font variation settings.
- `--header-supporting-text-color`: Placeholder color.
- `--header-supporting-text-tracking`: Placeholder letter spacing.
- `--header-trailing-icon-color`: Trailing icon color.
- `--icon-size`: Icon size.
- `--icon-target-size`: Icon tap target size.
- `--leading-space`: Space before the leading icon.
- `--max-height`: Docked maximum height.
- `--max-width`: Docked maximum width.
- `--min-height`: Docked minimum height.
- `--min-width`: Docked minimum width.
- `--results-shape`: Contained docked results shape.
- `--scrim-color`: Docked scrim color.
- `--trailing-space`: Space after the trailing icon.
