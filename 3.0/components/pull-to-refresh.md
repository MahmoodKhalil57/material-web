# Pull to refresh

A pull to refresh container lets people pull its content down to reload it, with a loading indicator that shows progress.

**Example: A list of news stories that refreshes when pulled down**

*HTML*

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

*JavaScript*

```js
const news = document.querySelector('#news');
const loadNews = () => new Promise((resolve) => setTimeout(resolve, 1500));
news.addEventListener('refresh', async () => {
  await loadNews();
  news.refreshing = false;
});
```

Pull to refresh is the pull-to-refresh behavior of the [loading indicator](/material-web/3.0/components/loading-indicator/), which it shows while the content reloads.

## Usage guidelines

*   **Refresh content people expect to change.** Use it on feeds and lists that update, such as news or messages.
*   **Always offer another way.** Pulling isn't available to everyone, so provide a [refresh button](#refresh-button) that people can use with a single pointer or the keyboard.
*   **Show it is working.** The container keeps the indicator in view until you set `refreshing` back to `false`.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A pull to refresh container holds the scrolling content (default slot). An indicator appears above it while people pull and while it refreshes.

**Example: A pull to refresh container holding a list**

```html
<md-gb-pull-to-refresh indicator-label="Refreshing tasks" style="block-size: 120px">
  <ul>
    <li>Water the plants</li>
    <li>Pay the rent</li>
    <li>Call the dentist</li>
  </ul>
</md-gb-pull-to-refresh>
```

## Examples

### Refresh button

Call `refresh()` from a button to start the same refresh without a gesture. It fires `refresh` and sets `refreshing`.

**Example: A refresh button above a pull to refresh list**

*HTML*

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

*JavaScript*

```js
const feed = document.querySelector('#feed');
document.querySelector('#reload').addEventListener('click', () => feed.refresh());
feed.addEventListener('refresh', () => {
  setTimeout(() => {
    feed.refreshing = false;
  }, 1500);
});
```

### Circular indicator

Set `indicator="circular"` to use a circular arrow and progress indicator instead of the default contained loading indicator.

**Example: A pull to refresh list with a circular indicator**

```html
<md-gb-pull-to-refresh indicator="circular" indicator-label="Refreshing messages" style="block-size: 160px">
  <ul>
    <li>Ali: Brunch this weekend?</li>
    <li>Sandra: Summer BBQ</li>
    <li>Trevor: Oui oui</li>
    <li>Britta: Recipe to try</li>
  </ul>
</md-gb-pull-to-refresh>
```

### Threshold and disabled

Set `threshold` to the distance in pixels people must pull before releasing starts a refresh (the default is 80). Add `disabled` to turn pulling off.

**Example: A pull to refresh list that needs a 120px pull**

```html
<md-gb-pull-to-refresh threshold="120" indicator-label="Refreshing orders" style="block-size: 160px">
  <ul>
    <li>Order 1042: shipped</li>
    <li>Order 1041: delivered</li>
    <li>Order 1040: delivered</li>
    <li>Order 1039: returned</li>
  </ul>
</md-gb-pull-to-refresh>
```

## Accessibility

*   Pulling needs a drag, so also provide a button or another control that calls `refresh()`, usable with a single pointer or the keyboard.
*   While refreshing, the indicator is a `progressbar` named by `indicator-label` (the default is "Refreshing"), and the label is announced politely. Write a label that says what is refreshing, such as "Refreshing news".

## API reference

### &lt;md-gb-pull-to-refresh&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>disabled</code><br><span class="gb-desc">Whether pulling is turned off (Compose <code>enabled = false</code>).</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>indicator</code><br><span class="gb-desc">The indicator: <code>loading</code> (M3 Expressive contained loading indicator) or <code>circular</code> (circular arrow and progress indicator).</span> | <code>indicator</code> | <code>PullToRefreshIndicator</code> | <code>'loading'</code> |
| <code>indicatorLabel</code><br><span class="gb-desc">Accessible label of the indicator, e.g. "Refreshing news".</span> | <code>indicator-label</code> | <code>string</code> | <code>DEFAULT_LABEL</code> |
| <code>refreshing</code><br><span class="gb-desc">Whether content is refreshing. Set by a pull past the threshold (or <code>refresh()</code>); set it back to false once the content has refreshed.</span> | <code>refreshing</code> | <code>boolean</code> | <code>false</code> |
| <code>threshold</code><br><span class="gb-desc">How far (px) the indicator must be pulled before releasing it refreshes (Compose <code>PullToRefreshDefaults.PositionalThreshold</code>, 80dp).</span> | <code>threshold</code> | <code>number</code> | <code>PULL_TO_REFRESH_THRESHOLD_PX</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The scrolling content. |

#### Events

| Event | Description |
| --- | --- |
| <code>refresh</code><br><span class="gb-desc">Event</span> | Fired when a pull (or <code>refresh()</code>) starts a refresh. Cancel it to keep <code>refreshing</code> false. |

#### Methods

| Method | Description |
| --- | --- |
| <code>refresh</code><br><span class="gb-desc">() =&gt; boolean</span> | Starts a refresh without a gesture, e.g. from a refresh button: fires <code>refresh</code> and, unless it is cancelled, sets <code>refreshing</code>. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(indicator)</code> | The indicator container. |
| <code>::part(scroller)</code> | The element that scrolls the content. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--indicator-color</code> |  |
| <code>--indicator-container-color</code> |  |
| <code>--indicator-container-height</code> |  |
| <code>--indicator-container-shape</code> |  |
| <code>--indicator-container-width</code> |  |
| <code>--indicator-elevation</code> |  |
| <code>--indicator-max-distance</code> | How far the indicator moves below the top edge at the threshold. |
| <code>--motion-effects-duration</code> |  |
| <code>--motion-effects-easing</code> |  |
| <code>--motion-settle-duration</code> |  |
| <code>--motion-settle-easing</code> |  |
