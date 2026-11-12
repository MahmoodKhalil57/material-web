# appbar

Elements: `md-gb-app-bar`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **App bars**
  - Sizes: small, medium flexible, large flexible
  - Subtitle
  - Search app bar
  - Scrolled state
  - Centered title
  - Gaps: the baseline medium/large app bar sets (the spec no longer recommends them; gb uses the flexible ones)
  - Search bar placeholder contains the word "Search" (the `search` slot is consumer content; nothing enforces or defaults it)
  - Search app bar on mobile fits a trailing avatar plus two trailing icons (the compact limit counts every trailing element, avatar included, so the avatar is the first to overflow)
  - Alternate search colors keep search text and container at 3:1 (a consumer choice; the component does not check overrides)

## API

### `<md-gb-app-bar>`

A Material Design app bar component.

Source: `material-design-expressive/components/appbar/md-gb-app-bar.ts`  
Import: `import '@material/web/components/appbar/md-gb-app-bar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `centered` | `centered` (reflects) | `boolean` | `false` | Whether the title and subtitle are centered instead of leading-aligned (the M3 Expressive "centered text" configuration). Defaults to `false`. |
| `scrollBehavior` | `scroll-behavior` (reflects) | `"hide" \| "compress"` |  | How the app bar reacts to scrolling: `hide` (hide on scroll down, reveal on scroll up) or `compress` (medium and large flexible app bars become small until scrolled back to the top). |
| `scrolled` | `scrolled` (reflects) | `boolean` | `false` | Whether the app bar is in its scrolled state. Defaults to `false`. A medium or large flexible app bar in its scrolled state is shown as a small one (app-bars.md: "When scrolled, medium flexible and large flexible app bars can transform into small app bars"). |
| `scrollTarget` | `scroll-target` | `string` | `''` | The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. |
| `size` | `size` (reflects) | `"sm" \| "md" \| "lg"` | `'sm'` | The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. |
| `variant` | `variant` (reflects) | `"standard" \| "search"` | `'standard'` | The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. |

Slots

- default slot: Used to display the primary title text of the app bar.
- `image`: An optional image or logo. In a small app bar it can replace the title text; in medium and large flexible app bars it appears above the text.
- `leading`: Used to display the leading navigation icon button (e.g. menu or back).
- `overflow`: Used to display an overflow menu button. Shown only while trailing actions are collapsed (see "Adaptive design" above).
- `search`: Used to display the search bar input or controls when `variant="search"`, inside the search bar container.
- `subtitle`: Used to display an optional subtitle below the title.
- `tabs`: Optional `md-gb-tabs` attached below the app bar. They are part of the app bar's box, so they hide and reveal with it as one unit (tabs.md: "When tabs are attached to a component, they should appear and move as a single unit").
- `trailing`: Used to display trailing action buttons and/or user avatar.

Events

- `overflowchange` (`CustomEvent<{overflowed: Element[]}>`): Fired when the trailing actions that collapse at the current window size class change. --bubbles --composed
- `scrollstatechange` (`CustomEvent<{scrolled: boolean}>`): Fired when the scrolled state changes. --bubbles --composed

CSS parts

- `::part(app-bar)`: The root container element.

CSS custom properties

- `--avatar-size`
- `--collapsed-height`
- `--container-color`
- `--container-elevation`
- `--container-height`
- `--container-shape`
- `--icon-button-space`
- `--icon-size`
- `--leading-icon-color`
- `--leading-space`
- `--on-scroll-container-color`
- `--on-scroll-container-elevation`
- `--search-container-color`
- `--search-container-height`
- `--search-container-shape`
- `--search-label-color`
- `--search-label-text-font`
- `--search-label-text-font-axes`
- `--search-label-text-font-tracking`
- `--search-leading-space`
- `--search-on-scroll-container-color`
- `--search-trailing-space`
- `--subtitle-color`
- `--subtitle-font`
- `--subtitle-font-axes`
- `--subtitle-font-tracking`
- `--title-bottom-space`
- `--title-color`
- `--title-font`
- `--title-font-axes`
- `--title-font-tracking`
- `--title-inset`
- `--trailing-icon-color`
- `--trailing-space`
