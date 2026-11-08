# Icon Buttons

Icon buttons help people take supplementary actions with a single tap.

**Example: A row of icon buttons, one for each color**

```html
<md-gb-icon-button color="filled" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="outlined" aria-label="Settings">
  <md-gb-icon>settings</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button aria-label="More options">
  <md-gb-icon>more_vert</md-gb-icon>
</md-gb-icon-button>
```

## Usage guidelines

*   **Use a clear icon.** Pick a system icon whose meaning people already know, and give the button an accessible name that describes the action.
*   **Describe the action on hover.** On the web, add a [tooltip](#tooltip) so the action is named while hovering or focusing the button.
*   **Pick the color by emphasis.** [Filled](#colors) is the most prominent, [tonal](#colors) and [outlined](#colors) are medium, and the standard color suits the lowest priority.
*   **Show state with a toggle.** A [toggle](#toggle) button uses the outlined icon when unselected and the filled icon when selected.

## Anatomy

An icon button is one element that holds an icon (default slot). It renders a native `<button>` or, with `href`, a link.

**Example: A filled icon button with a send icon**

```html
<md-gb-icon-button color="filled" aria-label="Send">
  <md-gb-icon>send</md-gb-icon>
</md-gb-icon-button>
```

## Examples

### Colors

Choose one of four colors with the `color` attribute: filled, tonal, outlined, or standard (the default).

**Example: Filled, tonal, outlined and standard icon buttons**

```html
<md-gb-icon-button color="filled" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="outlined" aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button aria-label="Video call">
  <md-gb-icon>videocam</md-gb-icon>
</md-gb-icon-button>
```

### Sizes

Set `size` to `xs`, `sm` (default), `md`, `lg`, or `xl`.

**Example: Filled icon buttons from extra small to extra large**

```html
<md-gb-icon-button color="filled" size="xs" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="md" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="lg" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" size="xl" aria-label="Add">
  <md-gb-icon>add</md-gb-icon>
</md-gb-icon-button>
```

### Widths

Set `width` to `narrow` or `wide`. The default width sits in between.

**Example: Narrow, default and wide icon buttons**

```html
<md-gb-icon-button color="tonal" width="narrow" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="tonal" width="wide" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
```

### Square shape

Add `square` to change the shape of the button from round to square.

**Example: A filled icon button with a square shape**

```html
<md-gb-icon-button color="filled" square aria-label="Delete">
  <md-gb-icon>delete</md-gb-icon>
</md-gb-icon-button>
```

### Toggle

Set `type="toggle"` to make a button that stays selected after it is pressed. Add `selected` for the initial state. The selected button shows the filled icon; if an icon has no filled version, add `unfilled-icon` and it gets a heavier weight instead.

**Example: An unselected and a selected toggle icon button**

```html
<md-gb-icon-button type="toggle" color="outlined" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button type="toggle" color="outlined" selected aria-label="Bookmark">
  <md-gb-icon>bookmark</md-gb-icon>
</md-gb-icon-button>
```

### Tooltip

Add `tooltip` to show the button's `aria-label` on hover and keyboard focus. Write the label as the action, not the icon's name.

**Example: An icon button with a tooltip**

```html
<md-gb-icon-button tooltip aria-label="Add to favorites">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
```

### Links

Set `href` to render the button as a link. Use `target` and `rel` as you would on an anchor.

**Example: An icon button that links to another page**

```html
<md-gb-icon-button href="https://m3.material.io/components/icon-buttons" target="_blank" aria-label="Open the guidelines">
  <md-gb-icon>open_in_new</md-gb-icon>
</md-gb-icon-button>
```

### Density

Set `density` from `0` (default) down to `-3` to remove 4px of height per step. The touch target stays at least 48px. Keep it off by default and let people opt in.

**Example: A filled icon button at density -2**

```html
<md-gb-icon-button color="filled" density="-2" aria-label="Search">
  <md-gb-icon>search</md-gb-icon>
</md-gb-icon-button>
```

### Disabled and soft-disabled

A disabled button can't be focused with the keyboard. A `soft-disabled` button stays focusable, which helps discoverability in toolbars.

**Example: A disabled icon button and a soft-disabled icon button**

```html
<md-gb-icon-button color="filled" disabled aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-icon-button color="filled" soft-disabled aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
```

## Accessibility

*   An icon button has no visible text, so always give it an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) that describes the action.
*   Icon buttons activate with Enter and Space and are reachable with Tab.
*   Disabled buttons leave the tab order. Use `soft-disabled` to keep one focusable, as the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls) allows.
*   Toggle buttons expose their state with `aria-pressed`.

**Example: A toggle icon button that exposes its pressed state**

```html
<md-gb-icon-button type="toggle" aria-label="Add to favorites">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-icon-button>
```

## API reference

### &lt;md-gb-icon-button&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code><br><span class="gb-desc">The color of the button.</span> | <code>color</code> | <code>IconButtonColor</code> | <code>'standard'</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the container height (and the width of a default-width button); the icon keeps its size and the touch target stays at least 48px. Values are clamped to that range. Density 0 inherits the density of an enclosing <code>md-gb-button-group</code>. icon-buttons.md: don't apply density by default; let people opt in to a denser layout.</span> | <code>density</code> | <code>Density</code> |  |
| <code>download</code><br><span class="gb-desc">The filename to use when downloading the linked resource.</span> | <code>download</code> | <code>string</code> | <code>''</code> |
| <code>href</code><br><span class="gb-desc">The URL that the link button points to.</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>referrerPolicy</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>referrerpolicy</code> attribute when <code>href</code> is set.</span> | <code>referrerpolicy</code> | <code>string</code> | <code>''</code> |
| <code>rel</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>rel</code> attribute when <code>href</code> is set.</span> | <code>rel</code> | <code>string</code> | <code>''</code> |
| <code>selected</code><br><span class="gb-desc">Whether or not the button is selected, when <code>type="toggle"</code>. TODO: replace reflected <code>[selected]</code> with <code>:state(selected)</code></span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>size</code><br><span class="gb-desc">The size of the button.</span> | <code>size</code> | <code>IconButtonSize</code> | <code>'sm'</code> |
| <code>softDisabled</code><br><span class="gb-desc">Whether or not the button is "soft-disabled" (disabled but still focusable).</span> | <code>soft-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>square</code><br><span class="gb-desc">Changes the shape of the button to be square.</span> | <code>square</code> | <code>boolean</code> | <code>false</code> |
| <code>target</code><br><span class="gb-desc">Where to display the linked <code>href</code> URL for a link button.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>''</code> |
| <code>tooltip</code><br><span class="gb-desc">Shows a tooltip with the button's accessibility label (<code>aria-label</code>) on hover and keyboard focus. The label should describe the action, not name the icon.</span> | <code>tooltip</code> | <code>boolean</code> | <code>false</code> |
| <code>type</code><br><span class="gb-desc">A string indicating the behavior of the button. - "submit" (default): A button that submits its associated form. - "reset": A button that resets its associated form. - "button": A normal button. - "toggle": A toggle button using the <code>selected</code> property. - "link": An anchor link (<code>&lt;a&gt;</code>). Type is always "link" when <code>href</code> is set.</span> | <code>type</code> | <code>string</code> |  |
| <code>unfilledIcon</code><br><span class="gb-desc">Set when the icon has no filled version: a selected toggle button then shows the icon in semibold weight instead of filled.</span> | <code>unfilled-icon</code> | <code>boolean</code> | <code>false</code> |
| <code>width</code><br><span class="gb-desc">Changes the width of the button.</span> | <code>width</code> | <code>IconButtonWidth</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display an icon. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when a toggle button is selected or unselected. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when a toggle icon button is selected or unselected. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(icon-btn)</code> | The icon button's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-height</code> | Container height at density 0. |
| <code>--container-shape</code> | The resolved shape; defaults to the round or square shape. |
| <code>--container-shape-round</code> |  |
| <code>--container-shape-square</code> |  |
| <code>--density-step</code> | Container height removed per density step. |
| <code>--icon-color</code> |  |
| <code>--icon-size</code> |  |
| <code>--leading-space</code> |  |
| <code>--md-icon-fill</code> |  |
| <code>--outline-color</code> |  |
| <code>--outline-width</code> |  |
| <code>--target-size</code> | The minimum touch target size, kept at any density. |
| <code>--trailing-space</code> |  |
