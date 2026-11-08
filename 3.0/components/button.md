# Buttons

Buttons help people initiate actions, from sending an email, to sharing a document, to liking a post.

**Example: A filled button and an outlined button**

```html
<md-gb-button color="filled">Save</md-gb-button>
<md-gb-button color="outlined">Cancel</md-gb-button>
```

## Usage guidelines

*   **Label the action.** A button's text describes what happens when it is pressed, such as "Save" or "Join now".
*   **Match emphasis to importance.** Use [filled](#colors) for the final action of a flow, [tonal](#colors) and [outlined](#colors) for medium emphasis, and [text](#colors) for the lowest priority.
*   **Use elevated sparingly.** Elevated buttons add a shadow, so reserve them for buttons that need separation from a patterned background.
*   **Add an icon to draw attention.** An [icon](#with-an-icon) can help communicate the action.

## Anatomy

A button is one element holding a label and an optional icon (default slot). It renders a native `<button>` or, with `href`, a link.

**Example: A filled button with an icon and a label**

```html
<md-gb-button color="filled">
  <md-gb-icon>send</md-gb-icon>
  Send
</md-gb-button>
```

## Examples

### Colors

Choose one of five colors with the `color` attribute: filled, elevated, tonal, outlined, or text.

**Example: Elevated, filled, tonal, outlined and text buttons**

```html
<md-gb-button color="elevated">Elevated</md-gb-button>
<md-gb-button color="filled">Filled</md-gb-button>
<md-gb-button color="tonal">Tonal</md-gb-button>
<md-gb-button color="outlined">Outlined</md-gb-button>
<md-gb-button color="text">Text</md-gb-button>
```

### Sizes

Set `size` to `xs`, `sm` (default), `md`, `lg`, or `xl`.

**Example: Buttons from extra small to extra large**

```html
<md-gb-button size="xs">XS</md-gb-button>
<md-gb-button size="sm">Small</md-gb-button>
<md-gb-button size="md">Medium</md-gb-button>
<md-gb-button size="lg">Large</md-gb-button>
<md-gb-button size="xl">XL</md-gb-button>
```

### With an icon

Put an `md-gb-icon` before the label, or after it for an action that leaves the page.

**Example: A tonal button with a send icon and a text button with an open-in-new icon**

```html
<md-gb-button color="tonal">
  <md-gb-icon>send</md-gb-icon>
  Send
</md-gb-button>
<md-gb-button color="text">
  Open
  <md-gb-icon>open_in_new</md-gb-icon>
</md-gb-button>
```

### Square shape

Add `square` to change the shape of the button from round to square.

**Example: A filled button with a square shape**

```html
<md-gb-button color="filled" square>Square</md-gb-button>
```

### Toggle

Set `type="toggle"` to make a button that stays selected after it is pressed. Add `selected` for the initial state.

**Example: An icon toggle button**

```html
<md-gb-button type="toggle" color="outlined" aria-label="Favorite">
  <md-gb-icon>favorite</md-gb-icon>
</md-gb-button>
```

### Disabled and soft-disabled

A disabled button can't be focused with the keyboard. A `soft-disabled` button stays focusable, which helps discoverability in toolbars.

**Example: A disabled button and a soft-disabled button**

```html
<md-gb-button color="filled" disabled>Disabled</md-gb-button>
<md-gb-button color="filled" soft-disabled>Soft-disabled</md-gb-button>
```

### Opening a popover or menu

Like a native button, an `md-gb-button` (and `md-gb-icon-button`) takes `popovertarget` (with `popovertargetaction`) or `commandfor` (with `command`) naming an element in the same tree. A menu opened this way also opens with the arrow keys.

**Example: A button that opens a menu**

```html
<md-gb-button color="tonal" popovertarget="button-menu">Options</md-gb-button>
<md-gb-menu id="button-menu">
  <md-gb-menu-item>Rename</md-gb-menu-item>
  <md-gb-menu-item>Duplicate</md-gb-menu-item>
</md-gb-menu>
```

## Accessibility

*   Buttons need a visible label; add an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) to icon-only buttons or when the label needs to be more descriptive.
*   Buttons activate with Enter and Space and are reachable with Tab.
*   Disabled buttons leave the tab order. Use `soft-disabled` to keep one focusable, as the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls) allows.
*   Toggle buttons expose their state with `aria-pressed`.

**Example: A button whose aria-label describes the action more fully**

```html
<md-gb-button aria-label="Add a new contact" color="elevated">Add</md-gb-button>
```

## API reference

### &lt;md-gb-button&gt;

A Material Design button.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code><br><span class="gb-desc">The color of the button.</span> | <code>color</code> | <code>"filled" | "elevated" | "tonal" | "outlined" | "text"</code> | <code>'text'</code> |
| <code>download</code><br><span class="gb-desc">The filename to use when downloading the linked resource. If not specified, the browser will determine a filename. This is only applicable when the button is used as a link (<code>href</code> is set).</span> | <code>download</code> | <code>string</code> | <code>''</code> |
| <code>href</code><br><span class="gb-desc">The URL that the link button points to.</span> | <code>href</code> | <code>string</code> | <code>''</code> |
| <code>referrerPolicy</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>referrerpolicy</code> attribute when <code>href</code> is set.</span> | <code>referrerpolicy</code> | <code>string</code> | <code>''</code> |
| <code>rel</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>rel</code> attribute when <code>href</code> is set.</span> | <code>rel</code> | <code>string</code> | <code>''</code> |
| <code>selected</code><br><span class="gb-desc">Whether or not the button is selected, when <code>type="toggle"</code>. TODO: replace reflected <code>[selected]</code> with <code>:state(selected)</code></span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>size</code><br><span class="gb-desc">The size of the button.</span> | <code>size</code> | <code>"sm" | "md" | "lg" | "xs" | "xl"</code> | <code>'sm'</code> |
| <code>softDisabled</code><br><span class="gb-desc">Whether or not the button is "soft-disabled" (disabled but still focusable). Use this when a button needs increased visibility when disabled. See https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls for more guidance on when this is needed.</span> | <code>soft-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>square</code><br><span class="gb-desc">Changes the shape of the button to be square.</span> | <code>square</code> | <code>boolean</code> | <code>false</code> |
| <code>target</code><br><span class="gb-desc">Where to display the linked <code>href</code> URL for a link button. Common options include <code>_blank</code> to open in a new tab.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>''</code> |
| <code>type</code><br><span class="gb-desc">A string indicating the behavior of the button. - "submit" (default): A button that submits its associated form. - "reset": A button that resets its associated form. - "button": A normal button. - "toggle": A toggle button using the <code>selected</code> property. - "link": An anchor link (<code>&lt;a&gt;</code>). Type is always "link" when <code>href</code> is set.</span> | <code>type</code> | <code>string</code> |  |
| <code>unfilledIcon</code><br><span class="gb-desc">Set when the icon has no filled version: a selected toggle button then shows the icon in semibold weight instead of filled.</span> | <code>unfilled-icon</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display a label and optional icon. |
| <code>container</code> | Used to set a custom background container for the button. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when a toggle button is selected or unselected. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when a toggle button is selected or unselected. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(btn)</code> | The button's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-height</code> |  |
| <code>--container-shape</code> | The resolved shape; defaults to the round or square shape. |
| <code>--container-shape-round</code> |  |
| <code>--container-shape-square</code> |  |
| <code>--icon-color</code> |  |
| <code>--icon-label-space</code> |  |
| <code>--icon-size</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-axes</code> |  |
| <code>--label-text-color</code> |  |
| <code>--label-text-tracking</code> |  |
| <code>--leading-space</code> |  |
| <code>--md-icon-fill</code> |  |
| <code>--outline-color</code> |  |
| <code>--outline-width</code> |  |
| <code>--state-layer-color</code> |  |
| <code>--trailing-space</code> |  |
