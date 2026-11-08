# Button Group

A button group arranges related buttons and can manage their selection, density and overflow.

**Example: A standard button group of three buttons**

```html
<md-gb-button-group aria-label="Text alignment">
  <md-gb-button color="tonal">Left</md-gb-button>
  <md-gb-button color="tonal">Center</md-gb-button>
  <md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
```

## Usage guidelines

*   **Choose standard or connected.** In a standard group, buttons respond to the one that is pressed; a [connected group](#connected) joins them into one control.
*   **Keep buttons alike.** Use the same size and shape for every button, and mix sizes only for hero moments.
*   **Group related buttons.** Mix colors and widths to emphasize what matters and to group related actions.
*   **Let it adapt.** On narrow screens, trailing buttons can collapse into an [overflow menu](#overflow-menu).

This component is new in [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive).

## Anatomy

A button group holds `md-gb-button` elements, each with an optional icon.

**Example: A button group of three buttons with an icon and a label**

```html
<md-gb-button-group>
  <md-gb-button color="tonal">
    <md-gb-icon>content_cut</md-gb-icon>
    Cut
  </md-gb-button>
  <md-gb-button color="tonal">
    <md-gb-icon>content_copy</md-gb-icon>
    Copy
  </md-gb-button>
  <md-gb-button color="tonal">
    <md-gb-icon>content_paste</md-gb-icon>
    Paste
  </md-gb-button>
</md-gb-button-group>
```

## Examples

### Connected

Set `variant="connected"` for buttons that sit together as a single control.

**Example: A connected button group**

```html
<md-gb-button-group variant="connected" aria-label="View">
  <md-gb-button color="outlined">Day</md-gb-button>
  <md-gb-button color="outlined">Week</md-gb-button>
  <md-gb-button color="outlined">Month</md-gb-button>
</md-gb-button-group>
```

### Selection

Set `selection` to `single` or `multiple` and give each button a `value`. Add `required` to keep one selected in a single-select group. A group fires `input` and `change` when selection changes.

**Example: A single-select button group with Week selected**

```html
<md-gb-button-group variant="connected" selection="single" required aria-label="View">
  <md-gb-button value="day" color="outlined">Day</md-gb-button>
  <md-gb-button value="week" color="outlined" selected>Week</md-gb-button>
  <md-gb-button value="month" color="outlined">Month</md-gb-button>
</md-gb-button-group>
```

### Icons

Buttons in a group can be icon-only. Give each one an `aria-label`.

**Example: A button group of icon buttons**

```html
<md-gb-button-group aria-label="Reactions">
  <md-gb-button color="tonal" aria-label="Like">
    <md-gb-icon>thumb_up</md-gb-icon>
  </md-gb-button>
  <md-gb-button color="tonal" aria-label="Favorite">
    <md-gb-icon>favorite</md-gb-icon>
  </md-gb-button>
  <md-gb-button color="tonal" aria-label="Share">
    <md-gb-icon>share</md-gb-icon>
  </md-gb-button>
</md-gb-button-group>
```

### Density

Set `density` from 0 (default) to -3 to make the buttons shorter. Touch targets stay 48px.

**Example: A button group with density -2**

```html
<md-gb-button-group density="-2" aria-label="Text alignment">
  <md-gb-button color="tonal">Left</md-gb-button>
  <md-gb-button color="tonal">Center</md-gb-button>
  <md-gb-button color="tonal">Right</md-gb-button>
</md-gb-button-group>
```

### Overflow menu

Add `overflow-menu` to collapse the buttons that don't fit into a menu at the trailing edge. Choosing a menu entry clicks the original button.

**Example: A button group with an overflow menu in a narrow container**

```html
<md-gb-button-group overflow-menu aria-label="Actions" style="width: 240px">
  <md-gb-button color="tonal">Copy</md-gb-button>
  <md-gb-button color="tonal">Paste</md-gb-button>
  <md-gb-button color="tonal">Cut</md-gb-button>
  <md-gb-button color="tonal">Delete</md-gb-button>
</md-gb-button-group>
```

## Accessibility

*   The group does not need a label of its own, but a name such as `aria-label="Text alignment"` helps when the buttons form a set.
*   Label each button as you would a [button](/material-web/3.0/components/button/); icon-only buttons need `aria-label`.
*   Tab enters the group, Arrow keys move between buttons, and Enter or Space activates the focused button.

## API reference

### &lt;md-gb-button-group&gt;

A Material Design button group.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>density</code><br><span class="gb-desc">The density of the buttons inside, from 0 (default) to -3. Each step down removes 4px from the buttons' height (button-groups.md: "Button groups adapt to the height of the buttons inside, including when density is applied"); touch targets stay 48px. A button's own non-zero <code>density</code> wins. Values are clamped to that range.</span> | <code>density</code> | <code>Density</code> |  |
| <code>disabled</code><br><span class="gb-desc">Whether the button group is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>overflowMenu</code><br><span class="gb-desc">Whether the buttons at the trailing edge that do not fit collapse into a trailing overflow menu, and come back when the group has room again (button-groups.md, Adaptive design: "Buttons at the trailing edge of the button group can be customized to collapse into an overflow menu at smaller breakpoints, and become visible again at larger sizes."). The group is as wide as its container allows: give it a width, or put it in a narrower container, to make buttons overflow. Choosing a menu entry clicks the original button.</span> | <code>overflow-menu</code> | <code>boolean</code> | <code>false</code> |
| <code>required</code><br><span class="gb-desc">Whether selection is required in single-select mode.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>resizing</code><br><span class="gb-desc">How the group and its buttons resize (button-groups.md, Resizing). <code>fixed</code>: every button keeps the width its own size and width give it. <code>flexible</code>: the group fills the width of its container and its buttons grow with it; an icon button does not stretch past its set width, and a button with <code>resizing="fixed"</code> keeps its width. A button with <code>resizing="flexible"</code> in a fixed group grows when the group is given more width. Unset: a connected group is flexible (it spans its surface), a standard group is fixed.</span> | <code>resizing</code> | <code>ButtonGroupResizing</code> | <code>""</code> |
| <code>selection</code><br><span class="gb-desc">The selection mode.</span> | <code>selection</code> | <code>ButtonGroupSelection</code> | <code>"none"</code> |
| <code>variant</code><br><span class="gb-desc">The visual variant of the button group.</span> | <code>variant</code> | <code>ButtonGroupVariant</code> | <code>"standard"</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | Used to display buttons. |
| <code>overflow</code> | Replaces the default overflow button (see <code>overflowMenu</code>). |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when selection changes. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when selection changes. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--between-space</code> |  |
| <code>--density-step</code> | Button height removed per density step. |
| <code>--inner-corner-size</code> |  |
| <code>--motion-spring-fast-spatial</code> |  |
| <code>--motion-spring-fast-spatial-duration</code> |  |
| <code>--outer-corner-size</code> |  |
| <code>--outer-corner-square-size</code> |  |
| <code>--pressed-inner-corner-size</code> |  |
| <code>--pressed-item-width-multiplier</code> |  |
