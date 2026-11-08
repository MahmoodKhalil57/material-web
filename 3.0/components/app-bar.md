# App Bar

An app bar sits at the top of a screen and shows its title, navigation and actions, and can hide or compress as the page scrolls.

**Example: An app bar with a menu button, a title, a subtitle and a search action**

```html
<md-gb-app-bar>
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  Inbox
  <span slot="subtitle">24 unread</span>
  <md-gb-icon-button slot="trailing" aria-label="Search">
    <md-gb-icon>search</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
```

## Usage guidelines

*   **Keep it about the page.** An app bar shows the title, navigation and a few actions that belong to the current page.
*   **Limit the actions.** Show one action, two if needed, and put many actions in a toolbar. Avoid an overflow menu when you can.
*   **Pick a size.** Use [medium or large](#sizes) for a more expressive headline, and a [small](#sizes) bar once content scrolls.
*   **Let it respond to scrolling.** It can [hide or compress](#scroll-behavior) while people scroll.

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

An app bar holds a leading navigation button, a title with an optional subtitle or image, and trailing actions.

**Example: An app bar with a leading button, a title, a subtitle and trailing actions**

```html
<md-gb-app-bar>
  <md-gb-icon-button slot="leading" aria-label="Back">
    <md-gb-icon>arrow_back</md-gb-icon>
  </md-gb-icon-button>
  Trip to Lisbon
  <span slot="subtitle">3 days</span>
  <md-gb-icon-button slot="trailing" aria-label="Share">
    <md-gb-icon>share</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Favorite">
    <md-gb-icon>favorite</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
```

## Examples

### Sizes

Set `size` to `md` or `lg` for a taller bar. The default is `sm`.

**Example: A medium app bar with a back button and a title**

```html
<md-gb-app-bar size="md">
  <md-gb-icon-button slot="leading" aria-label="Back">
    <md-gb-icon>arrow_back</md-gb-icon>
  </md-gb-icon-button>
  Settings
</md-gb-app-bar>
```

### Centered text

Add `centered` to center the title and subtitle.

**Example: An app bar with a centered title**

```html
<md-gb-app-bar centered>
  <md-gb-icon-button slot="leading" aria-label="Open menu">
    <md-gb-icon>menu</md-gb-icon>
  </md-gb-icon-button>
  Photos
</md-gb-app-bar>
```

### Search

Set `variant="search"` and put a text input in the `search` slot.

**Example: A search app bar**

```html
<md-gb-app-bar variant="search">
  <md-gb-icon-button slot="leading" aria-label="Back">
    <md-gb-icon>arrow_back</md-gb-icon>
  </md-gb-icon-button>
  <input slot="search" type="search" aria-label="Search mail">
</md-gb-app-bar>
```

### Scroll behavior

Set `scroll-behavior` to `hide` to hide the bar while scrolling down, or to `compress` to turn a medium or large bar into a small one. Use `scroll-target` with the id of a scrolling element, or leave it out to follow the window.

**Example: A large app bar that compresses while its list scrolls**

*HTML*

```html
<div id="content">
  <md-gb-app-bar size="lg" scroll-behavior="compress" scroll-target="content">
    <md-gb-icon-button slot="leading" aria-label="Back">
      <md-gb-icon>arrow_back</md-gb-icon>
    </md-gb-icon-button>
    Recipes
  </md-gb-app-bar>
  <p>Lemon pasta</p>
  <p>Sourdough</p>
  <p>Pad thai</p>
  <p>Summer salad</p>
  <p>Tomato soup</p>
  <p>Apple pie</p>
  <p>Fried rice</p>
  <p>Banana bread</p>
</div>
```

*CSS*

```css
#content {
  inline-size: 100%;
  block-size: 280px;
  overflow: auto;
}

md-gb-app-bar {
  position: sticky;
  inset-block-start: 0;
}
```

### Overflow actions

On small windows only a few trailing actions show. The rest are listed in the `overflowchange` event, and the `overflow` slot holds a menu button that appears while actions are collapsed.

**Example: An app bar with trailing actions and an overflow button**

```html
<md-gb-app-bar>
  Gallery
  <md-gb-icon-button slot="trailing" aria-label="Search">
    <md-gb-icon>search</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Share">
    <md-gb-icon>share</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="trailing" aria-label="Favorite">
    <md-gb-icon>favorite</md-gb-icon>
  </md-gb-icon-button>
  <md-gb-icon-button slot="overflow" aria-label="More options">
    <md-gb-icon>more_vert</md-gb-icon>
  </md-gb-icon-button>
</md-gb-app-bar>
```

## Accessibility

*   The title is the app bar's text, so make it match the page. Add context in an `aria-label` if the title alone is unclear.
*   Label every icon-only button with `aria-label`.
*   Tab moves through the buttons, and Enter or Space activates the focused one.
*   A sticky or fixed app bar can cover focused content. Call `setupScrollPadding()` from `scroll-padding.js` so focused elements scroll clear of it.

## API reference

### &lt;md-gb-app-bar&gt;

A Material Design app bar component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>centered</code><br><span class="gb-desc">Whether the title and subtitle are centered instead of leading-aligned (the M3 Expressive "centered text" configuration). Defaults to <code>false</code>.</span> | <code>centered</code> | <code>boolean</code> | <code>false</code> |
| <code>scrollBehavior</code><br><span class="gb-desc">How the app bar reacts to scrolling: <code>hide</code> (hide on scroll down, reveal on scroll up) or <code>compress</code> (medium and large flexible app bars become small until scrolled back to the top).</span> | <code>scroll-behavior</code> | <code>"hide" | "compress"</code> |  |
| <code>scrolled</code><br><span class="gb-desc">Whether the app bar is in its scrolled state. Defaults to <code>false</code>. A medium or large flexible app bar in its scrolled state is shown as a small one (app-bars.md: "When scrolled, medium flexible and large flexible app bars can transform into small app bars").</span> | <code>scrolled</code> | <code>boolean</code> | <code>false</code> |
| <code>scrollTarget</code><br><span class="gb-desc">The id of the element whose scrolling drives <code>scroll-behavior</code>. Defaults to the window.</span> | <code>scroll-target</code> | <code>string</code> | <code>''</code> |
| <code>size</code><br><span class="gb-desc">The size of the app bar (<code>sm</code>, <code>md</code>, <code>lg</code>). Defaults to <code>sm</code>.</span> | <code>size</code> | <code>AppBarSize</code> | <code>'sm'</code> |
| <code>variant</code><br><span class="gb-desc">The behavioral variant of the app bar (<code>standard</code> or <code>search</code>). Defaults to <code>standard</code>.</span> | <code>variant</code> | <code>AppBarVariant</code> | <code>'standard'</code> |
