---
title: Pull to refresh
section: components
order: 22
description: A pull to refresh container lets people pull its content down to reload it, with a loading indicator that shows progress.
---
{% demo "A list of news stories that refreshes when pulled down" height=240 %}
```html
<md-gb-pull-to-refresh id="news" indicator-label="Refreshing news" style="block-size: 200px">
  <ul>
    <li>Markets rally on new data</li>
    <li>City opens a new bike lane</li>
    <li>Local team wins the final</li>
    <li>Weather turns cooler this week</li>
    <li>New library hours start Monday</li>
    <li>Festival lineup announced</li>
  </ul>
</md-gb-pull-to-refresh>
```
```js
const news = document.querySelector('#news');
const loadNews = () => new Promise((resolve) => setTimeout(resolve, 1500));
news.addEventListener('refresh', async () => {
  await loadNews();
  news.refreshing = false;
});
```
{% enddemo %}

## Usage guidelines

*   **Refresh content people expect to change.** Use it on feeds and lists that update, such as news or messages.
*   **Always offer another way.** Pulling isn't available to everyone, so provide a [refresh button](#refresh-button) that people can use with a single pointer or the keyboard.
*   **Show it is working.** The container keeps the indicator in view until you set `refreshing` back to `false`.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A pull to refresh container holds the scrolling content (default slot). An indicator appears above it while people pull and while it refreshes.

{% demo "A pull to refresh container holding a list" %}
<md-gb-pull-to-refresh indicator-label="Refreshing tasks" style="block-size: 120px">
  <ul>
    <li>Water the plants</li>
    <li>Pay the rent</li>
    <li>Call the dentist</li>
  </ul>
</md-gb-pull-to-refresh>
{% enddemo %}

## Examples

### Refresh button

Call `refresh()` from a button to start the same refresh without a gesture. It fires `refresh` and sets `refreshing`.

{% demo "A refresh button above a pull to refresh list" height=240 %}
```html
<md-gb-icon-button id="reload" aria-label="Refresh">
  <md-gb-icon>refresh</md-gb-icon>
</md-gb-icon-button>
<md-gb-pull-to-refresh id="feed" indicator-label="Refreshing the feed" style="block-size: 160px">
  <ul>
    <li>New recipe: lemon pasta</li>
    <li>Ten tips for sourdough</li>
    <li>What to cook this weekend</li>
    <li>Pantry staples to stock</li>
  </ul>
</md-gb-pull-to-refresh>
```
```js
const feed = document.querySelector('#feed');
document.querySelector('#reload').addEventListener('click', () => feed.refresh());
feed.addEventListener('refresh', () => {
  setTimeout(() => {
    feed.refreshing = false;
  }, 1500);
});
```
{% enddemo %}

### Circular indicator

Set `indicator="circular"` to use a circular arrow and progress indicator instead of the default contained loading indicator.

{% demo "A pull to refresh list with a circular indicator" %}
<md-gb-pull-to-refresh indicator="circular" indicator-label="Refreshing messages" style="block-size: 160px">
  <ul>
    <li>Ali: Brunch this weekend?</li>
    <li>Sandra: Summer BBQ</li>
    <li>Trevor: Oui oui</li>
    <li>Britta: Recipe to try</li>
  </ul>
</md-gb-pull-to-refresh>
{% enddemo %}

### Threshold and disabled

Set `threshold` to the distance in pixels people must pull before releasing starts a refresh (the default is 80). Add `disabled` to turn pulling off.

{% demo "A pull to refresh list that needs a 120px pull" %}
<md-gb-pull-to-refresh threshold="120" indicator-label="Refreshing orders" style="block-size: 160px">
  <ul>
    <li>Order 1042: shipped</li>
    <li>Order 1041: delivered</li>
    <li>Order 1040: delivered</li>
    <li>Order 1039: returned</li>
  </ul>
</md-gb-pull-to-refresh>
{% enddemo %}

## Accessibility

*   Pulling needs a drag, so also provide a button or another control that calls `refresh()`, usable with a single pointer or the keyboard.
*   While refreshing, the indicator is a `progressbar` named by `indicator-label` (the default is "Refreshing"), and the label is announced politely. Write a label that says what is refreshing, such as "Refreshing news".

## API reference

{% gbapi "pulltorefresh" %}
