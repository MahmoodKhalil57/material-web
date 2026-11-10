# carousel

Elements: `md-gb-carousel`, `md-gb-carousel-item`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Carousel**
  - Multi-browse
  - Uncontained, uncontained multi-aspect
  - Hero, center-aligned hero
  - Full-screen
  - Item dynamic widths and parallax (keylines ported from Compose)

## API

### `<md-gb-carousel>`

A Material Design carousel.

Source: `components/carousel/md-gb-carousel.ts`  
Import: `import '@material/web/components/carousel/md-gb-carousel.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `alignment` | `alignment` (reflects) | `CarouselAlignment` | `'start'` | Start or center alignment of the hero layout. |
| `layout` | `layout` (reflects) | `CarouselLayout` | `'multi-browse'` | The carousel layout. |
| `orientation` | `orientation` (reflects) | `CarouselOrientation` |  | The scrolling axis. Defaults to vertical for the full-screen layout and horizontal for the others. |
| `scrollMode` | `scroll-mode` (reflects) | `CarouselScrollMode` |  | `snap` snaps items into the layout when released; `free` lets them stop anywhere. Defaults to `free` for uncontained layouts and `snap` for the others. |

Slots

- default slot: The `md-gb-carousel-item` elements.

Methods

- `next`: `(behavior?: ScrollBehavior) => void` Scrolls to the next item.
- `previous`: `(behavior?: ScrollBehavior) => void` Scrolls to the previous item.
- `relayout`: `() => void` Recomputes the layout. The carousel does this on resize and when items or properties change; call it after changing `--item-width` or other layout tokens.
- `scrollToItem`: `(index: number, behavior?: ScrollBehavior) => void` Scrolls an item to its snapped position in the layout.

CSS parts

- `::part(carousel)`: The container.
- `::part(scroller)`: The scroll container (`role="list"`).

CSS custom properties

- `--container-color`: Item container color, behind its visual.
- `--container-elevation`: Item elevation.
- `--container-shape`: Item corner radius.
- `--full-screen-item-spacing`: Space between full-screen items.
- `--height`: Carousel height (default 221px, Compose samples).
- `--item-spacing`: Space between items.
- `--item-width`: Preferred large item width (multi-browse, hero) or item width (uncontained). `auto` picks a layout default.
- `--label-padding`: Item label padding.
- `--label-scrim-color`: Scrim behind item labels.
- `--label-text`: Item label typography.
- `--label-text-axes`: Item label font variation settings.
- `--label-text-color`: Item label color.
- `--label-text-tracking`: Item label letter spacing.
- `--padding-block`: Top/bottom container padding.
- `--padding-inline`: Leading/trailing container padding.
- `--small-item-max-width`: Maximum small item width.
- `--small-item-min-width`: Minimum small item width.

### `<md-gb-carousel-item>`

A Material Design carousel item.

Source: `components/carousel/md-gb-carousel-item.ts`  
Import: `import '@material/web/components/carousel/md-gb-carousel-item.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `disabled` | `disabled` (reflects) | `boolean` | `false` | Whether the item is disabled. |
| `href` | `href` | `string` | `''` | Makes the item a link to this URL. |
| `label` | `label` | `string` | `''` | The accessible name of the item. Defaults to its label text. |
| `outlined` | `outlined` (reflects) | `boolean` | `false` | Whether the item has an outline (`with-outline` tokens). |
| `target` | `target` | `string` | `''` | The link target, with `href`. |

Slots

- default slot: The item visual, such as an `<img>` or `<video>`. It is sized to cover the item.
- `label`: Brief label text shown over the visual.

CSS parts

- `::part(action)`: The button or link that activates the item.
- `::part(content)`: The masked visual and label.
- `::part(frame)`: The masked outline, elevation and focus ring.
- `::part(item)`: The item root.
- `::part(label)`: The label container.

CSS custom properties

- `--carousel-item-fraction`: Read-only: the item's current size between the carousel's smallest (0) and large (1) item sizes.
- `--carousel-item-size`: Read-only: the item's current masked size along the scrolling axis.
- `--with-outline-outline-color`: Outline color of outlined items.
- `--with-outline-outline-width`: Outline width of outlined items.
