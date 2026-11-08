# Carousel

A carousel is a scrollable list of visual items that change size as they move through the layout.

**Example: A multi-browse carousel of three destinations**

```html
<md-gb-carousel aria-label="Destinations" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
    <span slot="label">Mountains</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
    <span slot="label">Coastline</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
    <span slot="label">Desert</span>
  </md-gb-carousel-item>
</md-gb-carousel>
```

## Usage guidelines

*   **Lead with visuals.** Items emphasize an image and can carry a brief label that adapts to the item size.
*   **Choose a layout.** Use `multi-browse` for varied sizes, `hero` to feature an item, `uncontained` for items that run edge to edge, and `full-screen` for one item at a time.
*   **Match scrolling to the layout.** Snap scrolling suits multi-browse, hero and full-screen. Free scrolling suits uncontained.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A carousel holds `md-gb-carousel-item` elements. Each has a visual in its default slot and an optional label.

**Example: A carousel of three items, each with a visual and a label**

```html
<md-gb-carousel aria-label="Cities" style="--item-width: 186px">
  <md-gb-carousel-item label="Lisbon">
    <div style="background: var(--md-sys-color-primary-container)"></div>
    <span slot="label">Lisbon</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Kyoto">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
    <span slot="label">Kyoto</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Oslo">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
    <span slot="label">Oslo</span>
  </md-gb-carousel-item>
</md-gb-carousel>
```

## Examples

### Hero

Set `layout="hero"` to feature a large item with small items beside it. Add `alignment="center"` to center it.

**Example: A hero carousel**

```html
<md-gb-carousel layout="hero" aria-label="Featured trips" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
  </md-gb-carousel-item>
</md-gb-carousel>
```

### Uncontained

Set `layout="uncontained"` for items of one size that scroll freely. `uncontained-multi-aspect` allows items with different aspect ratios.

**Example: An uncontained carousel**

```html
<md-gb-carousel layout="uncontained" aria-label="Albums" style="--item-width: 186px">
  <md-gb-carousel-item label="Morning">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Noon">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Evening">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Night">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Dawn">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
</md-gb-carousel>
```

### Linked items

Give an item `href` to make it a link. Without it, the item is a button.

**Example: Carousel items that link to pages**

```html
<md-gb-carousel aria-label="Destinations" style="--item-width: 186px">
  <md-gb-carousel-item label="Mountains" href="/mountains">
    <div style="background: var(--md-sys-color-primary-container)"></div>
    <span slot="label">Mountains</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Coastline" href="/coastline">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
    <span slot="label">Coastline</span>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Desert" href="/desert">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
    <span slot="label">Desert</span>
  </md-gb-carousel-item>
</md-gb-carousel>
```

### Scroll mode and orientation

Set `scroll-mode` to `snap` or `free`, and `orientation` to `horizontal` or `vertical`. The full-screen layout scrolls vertically by default.

**Example: A full-screen carousel that snaps to one story at a time**

*HTML*

```html
<md-gb-carousel layout="full-screen" scroll-mode="snap" aria-label="Stories">
  <md-gb-carousel-item label="Morning">
    <div style="background: var(--md-sys-color-primary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Noon">
    <div style="background: var(--md-sys-color-secondary-container)"></div>
  </md-gb-carousel-item>
  <md-gb-carousel-item label="Evening">
    <div style="background: var(--md-sys-color-tertiary-container)"></div>
  </md-gb-carousel-item>
</md-gb-carousel>
```

*CSS*

```css
md-gb-carousel {
  inline-size: 100%;
  block-size: 280px;
}
```

## Accessibility

*   The carousel is a region with the role description "carousel". Name it with `aria-label`.
*   Each item's `label` is its accessible name, read with its position in the set.
*   Tab or the arrow keys move between items, and Enter or Space activates the focused one.
*   Give images a text alternative, or hide decorative ones.

## API reference

### &lt;md-gb-carousel&gt;

A Material Design carousel.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>alignment</code><br><span class="gb-desc">Start or center alignment of the hero layout.</span> | <code>alignment</code> | <code>CarouselAlignment</code> | <code>'start'</code> |
| <code>layout</code><br><span class="gb-desc">The carousel layout.</span> | <code>layout</code> | <code>CarouselLayout</code> | <code>'multi-browse'</code> |
| <code>orientation</code><br><span class="gb-desc">The scrolling axis. Defaults to vertical for the full-screen layout and horizontal for the others.</span> | <code>orientation</code> | <code>CarouselOrientation</code> |  |
| <code>scrollMode</code><br><span class="gb-desc"><code>snap</code> snaps items into the layout when released; <code>free</code> lets them stop anywhere. Defaults to <code>free</code> for uncontained layouts and <code>snap</code> for the others.</span> | <code>scroll-mode</code> | <code>CarouselScrollMode</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | The <code>md-gb-carousel-item</code> elements. |

#### Methods

| Method | Description |
| --- | --- |
| <code>next</code><br><span class="gb-desc">(behavior?: ScrollBehavior) =&gt; void</span> | Scrolls to the next item. |
| <code>previous</code><br><span class="gb-desc">(behavior?: ScrollBehavior) =&gt; void</span> | Scrolls to the previous item. |
| <code>relayout</code><br><span class="gb-desc">() =&gt; void</span> | Recomputes the layout. The carousel does this on resize and when items or properties change; call it after changing <code>--item-width</code> or other layout tokens. |
| <code>scrollToItem</code><br><span class="gb-desc">(index: number, behavior?: ScrollBehavior) =&gt; void</span> | Scrolls an item to its snapped position in the layout. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(carousel)</code> | The container. |
| <code>::part(scroller)</code> | The scroll container (<code>role="list"</code>). |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> | Item container color, behind its visual. |
| <code>--container-elevation</code> | Item elevation. |
| <code>--container-shape</code> | Item corner radius. |
| <code>--full-screen-item-spacing</code> | Space between full-screen items. |
| <code>--height</code> | Carousel height (default 221px, Compose samples). |
| <code>--item-spacing</code> | Space between items. |
| <code>--item-width</code> | Preferred large item width (multi-browse, hero) or item width (uncontained). <code>auto</code> picks a layout default. |
| <code>--label-padding</code> | Item label padding. |
| <code>--label-scrim-color</code> | Scrim behind item labels. |
| <code>--label-text</code> | Item label typography. |
| <code>--label-text-axes</code> | Item label font variation settings. |
| <code>--label-text-color</code> | Item label color. |
| <code>--label-text-tracking</code> | Item label letter spacing. |
| <code>--padding-block</code> | Top/bottom container padding. |
| <code>--padding-inline</code> | Leading/trailing container padding. |
| <code>--small-item-max-width</code> | Maximum small item width. |
| <code>--small-item-min-width</code> | Minimum small item width. |

### &lt;md-gb-carousel-item&gt;

A Material Design carousel item.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>disabled</code><br><span class="gb-desc">Whether the item is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>href</code><br><span class="gb-desc">Makes the item a link to this URL.</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>label</code><br><span class="gb-desc">The accessible name of the item. Defaults to its label text.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>outlined</code><br><span class="gb-desc">Whether the item has an outline (<code>with-outline</code> tokens).</span> | <code>outlined</code> | <code>boolean</code> | <code>false</code> |
| <code>target</code><br><span class="gb-desc">The link target, with <code>href</code>.</span> | <code>target</code> | <code>string</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The item visual, such as an <code>&lt;img&gt;</code> or <code>&lt;video&gt;</code>. It is sized to cover the item. |
| <code>label</code> | Brief label text shown over the visual. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(action)</code> | The button or link that activates the item. |
| <code>::part(content)</code> | The masked visual and label. |
| <code>::part(frame)</code> | The masked outline, elevation and focus ring. |
| <code>::part(item)</code> | The item root. |
| <code>::part(label)</code> | The label container. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--carousel-item-fraction</code> | Read-only: the item's current size between the carousel's smallest (0) and large (1) item sizes. |
| <code>--carousel-item-size</code> | Read-only: the item's current masked size along the scrolling axis. |
| <code>--with-outline-outline-color</code> | Outline color of outlined items. |
| <code>--with-outline-outline-width</code> | Outline width of outlined items. |
