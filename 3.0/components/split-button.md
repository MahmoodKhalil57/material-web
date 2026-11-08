# Split button

A split button pairs a main action with a trailing button that opens a menu of related actions.

**Example: A split button with a Save action and a menu of save options**

```html
<md-gb-split-button>
  <button slot="leading">Save</button>
  <button slot="trailing" aria-label="More save options" popovertarget="save-menu"></button>
  <md-gb-menu id="save-menu">
    <md-gb-menu-item>Save as copy</md-gb-menu-item>
    <md-gb-menu-item>Save as template</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
```

## Usage guidelines

*   **One main action plus related ones.** The leading button runs the most common action, and the menu holds the alternatives.
*   **Same sizes as buttons.** Split buttons come in the five button sizes, so they can sit next to [buttons](/material-web/3.0/components/button/) and icon buttons of the same size.
*   **Trailing menu icon.** The trailing button always shows the menu icon. Its color doesn't change when the menu opens; it only turns.

## Anatomy

A split button holds a leading button, a trailing button and the menu the trailing button opens.

**Example: A split button with an icon, a label and a menu**

```html
<md-gb-split-button>
  <button slot="leading">
    <md-gb-icon>send</md-gb-icon>
    Send
  </button>
  <button slot="trailing" aria-label="More send options" popovertarget="anatomy-menu"></button>
  <md-gb-menu id="anatomy-menu">
    <md-gb-menu-item>Send later</md-gb-menu-item>
    <md-gb-menu-item>Schedule send</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
```

## Examples

### Colors

Split buttons are `filled` by default. Set `color` to `elevated`, `tonal` or `outlined`.

**Example: A tonal split button**

```html
<md-gb-split-button color="tonal">
  <button slot="leading">Reply</button>
  <button slot="trailing" aria-label="More reply options" popovertarget="reply-menu"></button>
  <md-gb-menu id="reply-menu">
    <md-gb-menu-item>Reply all</md-gb-menu-item>
    <md-gb-menu-item>Forward</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
```

### Sizes

Set `size` to `xs`, `sm` (the default), `md`, `lg` or `xl`.

**Example: A large split button**

```html
<md-gb-split-button size="lg">
  <button slot="leading">Send</button>
  <button slot="trailing" aria-label="More send options" popovertarget="send-menu"></button>
  <md-gb-menu id="send-menu">
    <md-gb-menu-item>Send later</md-gb-menu-item>
    <md-gb-menu-item>Schedule send</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
```

### Leading icon

The leading button can have an icon, a label, or both.

**Example: A split button with an icon and a label**

```html
<md-gb-split-button>
  <button slot="leading">
    <md-gb-icon>download</md-gb-icon>
    Download
  </button>
  <button slot="trailing" aria-label="More download options" popovertarget="download-menu"></button>
  <md-gb-menu id="download-menu">
    <md-gb-menu-item>Download as PDF</md-gb-menu-item>
    <md-gb-menu-item>Download as text</md-gb-menu-item>
  </md-gb-menu>
</md-gb-split-button>
```

## Accessibility

*   Both parts are native `<button>`s you provide, so give the trailing button an `aria-label` that says what the menu holds, such as "More save options". Add one to an icon-only leading button too.
*   The two buttons are separate tab stops. The trailing button toggles the menu with `popovertarget`, and the menu follows the [menu](/material-web/3.0/components/menu/) keyboard behavior.

## API reference

### &lt;md-gb-split-button&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code> | <code>color</code> | <code>SplitButtonColor</code> | <code>'filled'</code> |
| <code>selected</code> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>size</code> | <code>size</code> | <code>SplitButtonSize</code> | <code>'sm'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to render the trailing button's popover menu. |
| <code>leading</code> | Requires a <code>&lt;button&gt;</code> for the main action. |
| <code>trailing</code> | Requires a <code>&lt;button&gt;</code> for the menu action. Use <code>popovertarget</code> to display a menu. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(leading-btn)</code> | The split button's main action. |
| <code>::part(split-btn)</code> | The split button's root element. |
| <code>::part(trailing-btn)</code> | The split button's menu action. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--between-space</code> |  |
| <code>--icon-size</code> |  |
| <code>--inner-corner-size</code> |  |
| <code>--leading-space</code> |  |
| <code>--outer-corner-size</code> |  |
| <code>--trailing-space</code> |  |
