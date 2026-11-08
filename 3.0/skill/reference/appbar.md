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

Source: `labs/gb/components/appbar/md-gb-app-bar.ts`  
Import: `import '@material/web/labs/gb/components/appbar/md-gb-app-bar.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `centered` | `centered` (reflects) | `boolean` | `false` | Whether the title and subtitle are centered instead of leading-aligned (the M3 Expressive "centered text" configuration). Defaults to `false`. |
| `scrollBehavior` | `scroll-behavior` (reflects) | `"hide" \| "compress"` |  | How the app bar reacts to scrolling: `hide` (hide on scroll down, reveal on scroll up) or `compress` (medium and large flexible app bars become small until scrolled back to the top). |
| `scrolled` | `scrolled` (reflects) | `boolean` | `false` | Whether the app bar is in its scrolled state. Defaults to `false`. A medium or large flexible app bar in its scrolled state is shown as a small one (app-bars.md: "When scrolled, medium flexible and large flexible app bars can transform into small app bars"). |
| `scrollTarget` | `scroll-target` | `string` | `''` | The id of the element whose scrolling drives `scroll-behavior`. Defaults to the window. |
| `size` | `size` (reflects) | `AppBarSize` | `'sm'` | The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. |
| `variant` | `variant` (reflects) | `AppBarVariant` | `'standard'` | The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. |
