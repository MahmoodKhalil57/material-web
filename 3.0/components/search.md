# Search

A search bar lets people enter a query and find matching results, with a search view that shows suggestions and results.

**Example: A search bar with recipe suggestions**

```html
<md-gb-search-bar placeholder="Search recipes">
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">history</md-gb-icon>
    Mexican dishes
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">history</md-gb-icon>
    Peanut sauce
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pasta recipes
  </md-gb-list-item>
</md-gb-search-bar>
```

## Usage guidelines

*   **Use it to navigate with queries.** Search is the entry point for finding content in a product by typing.
*   **Hint what to search.** A bar can show hinted text such as "Search recipes", a leading icon and up to two [trailing](#trailing-elements) icons.
*   **Suggest as people type.** The view lists suggestions or results below the bar as the query changes.
*   **Choose a style.** The contained style is recommended; the [divided](#divided) style puts a divider between the header and the results.
*   **Make it prominent.** A [search app bar](#search-app-bar) gives search an emphasized, global entry point.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A search bar holds the leading and trailing elements; its default slot holds the suggestions or results shown in its search view.

**Example: A search bar with leading, trailing and view trailing buttons and suggestions**

```html
<md-gb-search-bar placeholder="Search recipes">
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Voice search">
    <md-gb-icon>mic</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="view-trailing" aria-label="Voice search">
    <md-gb-icon>mic</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">history</md-gb-icon>
    Mexican dishes
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pasta recipes
  </md-gb-list-item>
</md-gb-search-bar>
```

## Examples

### Trailing elements

Put up to two icon buttons in the `trailing` slot, or an avatar in the `avatar` slot. A `leading` icon button, such as a menu button, replaces the default search icon.

**Example: A search bar with a menu button and a voice search button**

```html
<md-gb-search-bar placeholder="Search messages">
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Voice search">
    <md-gb-icon>mic</md-gb-icon>
  </md-gb-icon-button>
</md-gb-search-bar>
```

### Docked

Add `docked` to open the view as a drop-down below the bar, for medium and larger windows. Without it, the view opens full-screen.

**Example: A docked search bar**

```html
<md-gb-search-bar docked placeholder="Search recipes">
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pancakes
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pad thai
  </md-gb-list-item>
</md-gb-search-bar>
```

### Divided

Add `divided` to use the baseline style, with a divider between the view's header and its results.

**Example: A search bar with a divided view**

```html
<md-gb-search-bar divided placeholder="Search recipes">
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">history</md-gb-icon>
    Plants
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pasta recipes
  </md-gb-list-item>
</md-gb-search-bar>
```

### Search app bar

Put a search bar in the `search` slot of an [app bar](/material-web/3.0/components/app-bar/) with `variant="search"`. The app bar draws the container, so make the bar's container transparent.

**Example: A search app bar with a profile button**

```html
<md-gb-app-bar variant="search">
  <md-gb-search-bar slot="search" placeholder="Search recipes" style="--container-color: transparent"></md-gb-search-bar>
  <md-gb-icon-button slot="trailing" aria-label="Profile">
    <md-gb-icon>account_circle</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
```

### Standalone search view

Use `md-gb-search-view` on its own for a search that opens from an icon button. Set `open` from the button.

**Example: An icon button that opens a search view**

*HTML*

```html
<md-gb-icon-button id="open-search" aria-label="Search">
  <md-gb-icon>search</md-gb-icon>
</md-gb-icon-button>
<md-gb-search-view id="recipes" placeholder="Search recipes">
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">history</md-gb-icon>
    Mexican dishes
  </md-gb-list-item>
  <md-gb-list-item static role="option">
    <md-gb-icon slot="leading">search</md-gb-icon>
    Pad thai
  </md-gb-list-item>
</md-gb-search-view>
```

*JavaScript*

```js
document.querySelector('#open-search').addEventListener('click', () => {
  document.querySelector('#recipes').open = true;
});
```

### Searching

Set `searching` while you wait for results. The view shows a progress indicator and marks the results as busy.

**Example: A search bar that shows it is searching for a second**

*HTML*

```html
<md-gb-search-bar placeholder="Search recipes"></md-gb-search-bar>
```

*JavaScript*

```js
const bar = document.querySelector('md-gb-search-bar');
const loadResults = (query) => new Promise((resolve) => setTimeout(resolve, 1000));
bar.addEventListener('search', async (event) => {
  bar.searching = true;
  await loadResults(event.detail.value);
  bar.searching = false;
});
```

## Accessibility

*   The bar's input and the view's input are comboboxes, and the suggestions are the options of a `listbox`. Slotted results without a role get `role="option"`.
*   Enter, the Down arrow or typing opens the view. The back button and Escape close it.
*   The input is named by `label`, which defaults to `placeholder`. Set `label` when the hint isn't a good name.
*   Give icon buttons in the slots an `aria-label`, such as "Voice search".
*   Change `back-label`, `clear-label`, `results-label` and `searching-label` when you translate the page. Announce changing results with `suggestions-label`.

## API reference

### &lt;md-gb-search-bar&gt;

A Material Design search bar.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>backLabel</code><br><span class="gb-desc">Accessible label of the view's back button.</span> | <code>back-label</code> | <code>string</code> | <code>'Back'</code> |
| <code>clearLabel</code><br><span class="gb-desc">Accessible label of the view's clear button.</span> | <code>clear-label</code> | <code>string</code> | <code>'Clear search'</code> |
| <code>disabled</code><br><span class="gb-desc">Whether the search bar is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>divided</code><br><span class="gb-desc">Uses the divided (baseline) view style.</span> | <code>divided</code> | <code>boolean</code> | <code>false</code> |
| <code>docked</code><br><span class="gb-desc">Opens the view docked below the bar, for medium and larger windows. Otherwise it opens full-screen.</span> | <code>docked</code> | <code>boolean</code> | <code>false</code> |
| <code>expanded</code><br><span class="gb-desc">Whether the search view is open.</span> | <code>expanded</code> | <code>boolean</code> |  |
| <code>label</code><br><span class="gb-desc">Accessible label of the inputs. Defaults to <code>placeholder</code>, per the spec.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>placeholder</code><br><span class="gb-desc">Hinted search text, e.g. "Search messages".</span> | <code>placeholder</code> | <code>string</code> | <code>''</code> |
| <code>quick</code><br><span class="gb-desc">Whether to skip the open and close animations.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>resultsLabel</code><br><span class="gb-desc">Accessible label of the results listbox.</span> | <code>results-label</code> | <code>string</code> | <code>'Search results'</code> |
| <code>searching</code><br><span class="gb-desc">Whether the app is searching: shows progress in the view.</span> | <code>searching</code> | <code>boolean</code> | <code>false</code> |
| <code>searchingLabel</code><br><span class="gb-desc">Accessible label of the searching progress indicator.</span> | <code>searching-label</code> | <code>string</code> | <code>'Searching'</code> |
| <code>suggestionsLabel</code><br><span class="gb-desc">Announced when suggestions or results become available.</span> | <code>suggestions-label</code> | <code>string</code> | <code>'Suggestions available'</code> |
| <code>value</code><br><span class="gb-desc">The search text. Shared with the view.</span> | <code>value</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Search suggestions or results, shown in the view. Use elements with <code>role="option"</code>; slotted elements without a role get it. |
| <code>avatar</code> | A trailing avatar image. |
| <code>leading</code> | A navigation icon button. Defaults to a non-functional search icon. |
| <code>trailing</code> | Up to two trailing icons or icon buttons. |
| <code>view-trailing</code> | Trailing icon buttons in the view's header. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the search text is committed. |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the view begins closing. Cancelable. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the view has closed. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the search text changes. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the view begins opening. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired when the view has opened and animations finished. |
| <code>search</code><br><span class="gb-desc">CustomEvent&lt;&#123;value: string&#125;&gt;</span> | Fired when a search is executed with Enter in the view. |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the search view. |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | Focuses the search bar input. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the search view. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(bar)</code> | The search bar container. |
| <code>::part(input)</code> | The search bar input. |
| <code>::part(view)</code> | The <code>md-gb-search-view</code>. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--avatar-shape</code> | Avatar shape. |
| <code>--avatar-size</code> | Avatar size. |
| <code>--contained-avatar-target-size</code> | Avatar tap target size. |
| <code>--contained-icon-label-gap</code> | Space between the icon targets and the input. |
| <code>--contained-leading-margin</code> | Recommended margin to the start of the window. |
| <code>--contained-leading-space</code> | Space before the leading icon target. |
| <code>--contained-motion-duration</code> | Expand and collapse duration. |
| <code>--contained-motion-spring</code> | Expand and collapse easing. |
| <code>--contained-no-actions-leading-space</code> | Leading space without a leading icon. |
| <code>--contained-no-actions-trailing-space</code> | Trailing space without trailing icons. |
| <code>--contained-trailing-actions-gap</code> | Gap between trailing icon targets. |
| <code>--contained-trailing-actions-leading-space</code> | Space before the trailing icon targets. |
| <code>--contained-trailing-actions-trailing-space</code> | Space after the trailing icon targets. |
| <code>--contained-trailing-margin</code> | Recommended margin to the end of the window. |
| <code>--contained-trailing-space</code> | Trailing space. |
| <code>--container-color</code> | Container color. |
| <code>--container-height</code> | Container height. |
| <code>--container-shape</code> | Container shape. |
| <code>--icon-size</code> | Icon size. |
| <code>--icon-target-size</code> | Icon tap target size. |
| <code>--input-text</code> | Input typography. |
| <code>--input-text-axes</code> | Input font variation settings. |
| <code>--input-text-color</code> | Input text color. |
| <code>--input-text-tracking</code> | Input letter spacing. |
| <code>--leading-icon-color</code> | Leading icon color. |
| <code>--leading-icon-leading-icon-label-space</code> | Divided style space between the leading icon and input. |
| <code>--leading-space</code> | Divided style leading space. |
| <code>--max-width</code> | Maximum width. |
| <code>--min-width</code> | Minimum width. |
| <code>--supporting-text</code> | Placeholder typography. |
| <code>--supporting-text-axes</code> | Placeholder font variation settings. |
| <code>--supporting-text-color</code> | Placeholder color. |
| <code>--supporting-text-tracking</code> | Placeholder letter spacing. |
| <code>--trailing-icon-color</code> | Trailing icon color. |
| <code>--trailing-icon-label-trailing-icon-space</code> | Divided style space between the input and trailing icon. |
| <code>--trailing-space</code> | Divided style trailing space. |

### &lt;md-gb-search-view&gt;

Focused search: suggestions or results opened from a search bar.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>backLabel</code><br><span class="gb-desc">Accessible label of the back button.</span> | <code>back-label</code> | <code>string</code> | <code>'Back'</code> |
| <code>bar</code><br><span class="gb-desc">The search bar the view expands from. Docked, the view is positioned over it.</span> |  | <code>HTMLElement</code> | <code>null</code> |
| <code>clearLabel</code><br><span class="gb-desc">Accessible label of the clear button.</span> | <code>clear-label</code> | <code>string</code> | <code>'Clear search'</code> |
| <code>divided</code><br><span class="gb-desc">Divided (baseline) style, with a divider between the header and results. Otherwise the view uses the contained M3 Expressive style.</span> | <code>divided</code> | <code>boolean</code> | <code>false</code> |
| <code>docked</code><br><span class="gb-desc">Docked layout: a drop-down below the search bar over a scrim. Otherwise the view is full-screen.</span> | <code>docked</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">Accessible label of the input and dialog. Defaults to <code>placeholder</code>.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>open</code><br><span class="gb-desc">Whether the view is open.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>placeholder</code><br><span class="gb-desc">Hinted search text.</span> | <code>placeholder</code> | <code>string</code> | <code>''</code> |
| <code>quick</code><br><span class="gb-desc">Whether to skip the open and close animations.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>resultsLabel</code><br><span class="gb-desc">Accessible label of the results listbox.</span> | <code>results-label</code> | <code>string</code> | <code>'Search results'</code> |
| <code>searching</code><br><span class="gb-desc">Whether the app is searching: shows a progress indicator under the header and marks the results busy for assistive technology.</span> | <code>searching</code> | <code>boolean</code> | <code>false</code> |
| <code>searchingLabel</code><br><span class="gb-desc">Accessible label of the searching progress indicator.</span> | <code>searching-label</code> | <code>string</code> | <code>'Searching'</code> |
| <code>suggestionsLabel</code><br><span class="gb-desc">Announced when suggestions or results become available.</span> | <code>suggestions-label</code> | <code>string</code> | <code>'Suggestions available'</code> |
| <code>value</code><br><span class="gb-desc">The search text.</span> | <code>value</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Search suggestions or results. |
| <code>leading</code> | Replaces the back icon button. |
| <code>trailing</code> | Trailing icons or icon buttons, after the clear button. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the input text is committed. |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the view begins closing. Cancelable. See <code>SEARCH_CLOSE_REASONS</code>. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the view has closed. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the input text changes. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the view begins opening. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired when the view has opened and animations finished. |
| <code>search</code><br><span class="gb-desc">CustomEvent&lt;&#123;value: string&#125;&gt;</span> | Fired when a search is executed with Enter. |

#### Methods

| Method | Description |
| --- | --- |
| <code>clear</code><br><span class="gb-desc">() =&gt; void</span> | Clears the search text and focuses the input. |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the view. |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions) =&gt; void</span> | Focuses the search input. |
| <code>handleBack</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Handles a back request (the Android back gesture or button, which the view receives through its dialog): a full-screen view plays the predictive back motion, then the view closes with reason <code>back</code>. Call it for an in-app back control that should behave like the system back. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the view. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(container)</code> | The view's container. |
| <code>::part(dialog)</code> | The modal <code>&lt;dialog&gt;</code>. |
| <code>::part(divider)</code> | The divider of the divided style. |
| <code>::part(header)</code> | The header with the input. |
| <code>::part(input)</code> | The search input. |
| <code>::part(results)</code> | The <code>role="listbox"</code> results container. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--bar-container-height</code> | Contained full-screen bar height. |
| <code>--bar-results-gap</code> | Contained docked gap between the bar and results. |
| <code>--bar-shape</code> | Contained bar shape. |
| <code>--contained-background-color</code> | Contained full-screen background color. |
| <code>--contained-icon-label-gap</code> | Space between the icon targets and the input. |
| <code>--contained-leading-margin</code> | Contained full-screen bar leading margin. |
| <code>--contained-motion-duration</code> | Contained expand and collapse duration. |
| <code>--contained-motion-spring</code> | Contained expand and collapse easing. |
| <code>--contained-trailing-margin</code> | Contained full-screen bar trailing margin. |
| <code>--container-color</code> | Container color. |
| <code>--container-shape</code> | Container shape. |
| <code>--content-fade-in-delay</code> | Results fade in delay. |
| <code>--content-fade-in-duration</code> | Results fade in duration. |
| <code>--content-fade-in-easing</code> | Results fade in easing. |
| <code>--content-fade-out-duration</code> | Results fade out duration. |
| <code>--content-fade-out-easing</code> | Results fade out easing. |
| <code>--divided-collapse-motion-duration</code> | Divided collapse duration. |
| <code>--divided-collapse-motion-spring</code> | Divided collapse easing. |
| <code>--divided-expand-motion-duration</code> | Divided expand duration. |
| <code>--divided-expand-motion-spring</code> | Divided expand easing. |
| <code>--divider-color</code> | Divided style divider color. |
| <code>--header-container-height</code> | Header height. |
| <code>--header-input-text</code> | Input typography. |
| <code>--header-input-text-axes</code> | Input font variation settings. |
| <code>--header-input-text-color</code> | Input text color. |
| <code>--header-input-text-tracking</code> | Input letter spacing. |
| <code>--header-leading-icon-color</code> | Back icon color. |
| <code>--header-supporting-text</code> | Placeholder typography. |
| <code>--header-supporting-text-axes</code> | Placeholder font variation settings. |
| <code>--header-supporting-text-color</code> | Placeholder color. |
| <code>--header-supporting-text-tracking</code> | Placeholder letter spacing. |
| <code>--header-trailing-icon-color</code> | Trailing icon color. |
| <code>--icon-size</code> | Icon size. |
| <code>--icon-target-size</code> | Icon tap target size. |
| <code>--leading-space</code> | Space before the leading icon. |
| <code>--max-height</code> | Docked maximum height. |
| <code>--max-width</code> | Docked maximum width. |
| <code>--min-height</code> | Docked minimum height. |
| <code>--min-width</code> | Docked minimum width. |
| <code>--results-shape</code> | Contained docked results shape. |
| <code>--scrim-color</code> | Docked scrim color. |
| <code>--trailing-space</code> | Space after the trailing icon. |
