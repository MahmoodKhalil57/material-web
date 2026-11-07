---
title: Search
section: components
category: other
order: 28
summary: Find content by entering a keyword or phrase
description: A search bar lets people enter a query and find matching results, with a search view that shows suggestions and results.
---
{% demo "A search bar with recipe suggestions" %}
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
{% enddemo %}

## Usage guidelines

*   **Use it to navigate with queries.** Search is the entry point for finding content in a product by typing.
*   **Hint what to search.** A bar can show hinted text such as "Search recipes", a leading icon and up to two [trailing](#trailing-elements) icons.
*   **Suggest as people type.** The view lists suggestions or results below the bar as the query changes.
*   **Choose a style.** The contained style is recommended; the [divided](#divided) style puts a divider between the header and the results.
*   **Make it prominent.** A [search app bar](#search-app-bar) gives search an emphasized, global entry point.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A search bar holds the leading and trailing elements; its default slot holds the suggestions or results shown in its search view.

{% demo "A search bar with leading, trailing and view trailing buttons and suggestions" height=360 %}
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
{% enddemo %}

## Examples

### Trailing elements

Put up to two icon buttons in the `trailing` slot, or an avatar in the `avatar` slot. A `leading` icon button, such as a menu button, replaces the default search icon.

{% demo "A search bar with a menu button and a voice search button" %}
<md-gb-search-bar placeholder="Search messages">
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Voice search">
    <md-gb-icon>mic</md-gb-icon>
  </md-gb-icon-button>
</md-gb-search-bar>
{% enddemo %}

### Docked

Add `docked` to open the view as a drop-down below the bar, for medium and larger windows. Without it, the view opens full-screen.

{% demo "A docked search bar" %}
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
{% enddemo %}

### Divided

Add `divided` to use the baseline style, with a divider between the view's header and its results.

{% demo "A search bar with a divided view" %}
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
{% enddemo %}

### Search app bar

Put a search bar in the `search` slot of an [app bar](/3.0/components/app-bar/) with `variant="search"`. The app bar draws the container, so make the bar's container transparent.

{% demo "A search app bar with a profile button" %}
<md-gb-app-bar variant="search">
  <md-gb-search-bar slot="search" placeholder="Search recipes" style="--container-color: transparent"></md-gb-search-bar>
  <md-gb-icon-button slot="trailing" aria-label="Profile">
    <md-gb-icon>account_circle</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
{% enddemo %}

### Standalone search view

Use `md-gb-search-view` on its own for a search that opens from an icon button. Set `open` from the button.

{% demo "An icon button that opens a search view" height=360 %}
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
```js
document.querySelector('#open-search').addEventListener('click', () => {
  document.querySelector('#recipes').open = true;
});
```
{% enddemo %}

### Searching

Set `searching` while you wait for results. The view shows a progress indicator and marks the results as busy.

{% demo "A search bar that shows it is searching for a second" height=360 %}
```html
<md-gb-search-bar placeholder="Search recipes"></md-gb-search-bar>
```
```js
const bar = document.querySelector('md-gb-search-bar');
const loadResults = (query) => new Promise((resolve) => setTimeout(resolve, 1000));
bar.addEventListener('search', async (event) => {
  bar.searching = true;
  await loadResults(event.detail.value);
  bar.searching = false;
});
```
{% enddemo %}

## Accessibility

*   The bar's input and the view's input are comboboxes, and the suggestions are the options of a `listbox`. Slotted results without a role get `role="option"`.
*   Enter, the Down arrow or typing opens the view. The back button and Escape close it.
*   The input is named by `label`, which defaults to `placeholder`. Set `label` when the hint isn't a good name.
*   Give icon buttons in the slots an `aria-label`, such as "Voice search".
*   Change `back-label`, `clear-label`, `results-label` and `searching-label` when you translate the page. Announce changing results with `suggestions-label`.

## API reference

{% gbapi "search" %}
