# Switch

Switches toggle the state of an item on or off.

**Example: A switch with a text label**

```html
<label>
  Wi-Fi
  <md-gb-switch selected></md-gb-switch>
</label>
```

## Usage guidelines

*   **Use for settings.** Switches are the best way to let people adjust a setting. Use a switch, not a radio button, when each item in a list is controlled on its own.
*   **Visible at a glance.** Make the on or off state clear, and let the change take effect right away.
*   **Label with text.** Put the label next to the switch in a `<label>`. Its text color stays the same, even when the switch changes.

## Anatomy

A switch has a track, a handle and optional icons shown in the handle.

**Example: A switch with an icon in the handle for each state**

```html
<md-gb-switch aria-label="Airplane mode" selected>
  <md-gb-icon slot="off-icon">close</md-gb-icon>
  <md-gb-icon slot="on-icon">check</md-gb-icon>
</md-gb-switch>
```

## Examples

### Selected

Add `selected` to start with the switch on.

**Example: A label wrapping a selected switch, and a label linked by for**

```html
<label>
  Wi-Fi
  <md-gb-switch selected></md-gb-switch>
</label>
<label for="bluetooth">Bluetooth</label>
<md-gb-switch id="bluetooth"></md-gb-switch>
```

### Icons

Icons in the `on-icon` and `off-icon` slots appear in the handle. Fill only `on-icon` to show an icon just when the switch is on.

**Example: A switch with a check mark when on and a close mark when off**

```html
<md-gb-switch aria-label="Notifications">
  <md-gb-icon slot="on-icon">check</md-gb-icon>
  <md-gb-icon slot="off-icon">close</md-gb-icon>
</md-gb-switch>
```

**Example: A switch with an icon only when on**

```html
<md-gb-switch aria-label="Dark mode" selected>
  <md-gb-icon slot="on-icon">check</md-gb-icon>
</md-gb-switch>
```

### Disabled

A `disabled` switch can't be changed.

**Example: A disabled switch that is off and one that is on**

```html
<md-gb-switch aria-label="Sync off" disabled></md-gb-switch>
<md-gb-switch aria-label="Sync on" disabled selected></md-gb-switch>
```

### In a form

A switch submits its `value` (`on` by default) under its `name` when it is selected, and `required` means it must be on.

**Example: A required switch that accepts the terms**

```html
<form>
  <label>
    Accept terms
    <md-gb-switch name="terms" required></md-gb-switch>
  </label>
  <md-gb-button type="submit">Continue</md-gb-button>
</form>
```

## Accessibility

*   A switch has the `switch` role. It takes its name from an adjacent `<label>`, or from an explicit [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label), which wins over the label.
*   Add an `aria-label` to a switch with no visible label.
*   Space toggles the switch.

**Example: A switch with no visible label, named Lights**

```html
<md-gb-switch aria-label="Lights"></md-gb-switch>
```

## API reference

### &lt;md-gb-switch&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the state layer (40px); the track keeps its size and the touch target stays 48px. Values are clamped to that range. switch.md: don't apply density by default; let people opt in to a denser layout.</span> | <code>density</code> | <code>Density</code> |  |
| <code>required</code><br><span class="gb-desc">When true, require the switch to be selected when participating in form submission. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>selected</code><br><span class="gb-desc">Puts the switch in the selected state and sets the form submission value to the <code>value</code> property.</span> | <code>selected</code> | <code>boolean</code> |  |
| <code>value</code><br><span class="gb-desc">The value associated with this switch on form submission. <code>null</code> is submitted when <code>selected</code> is <code>false</code>.</span> | <code>value</code> | <code>string</code> | <code>'on'</code> |

#### Slots

| Slot | Description |
| --- | --- |
| <code>off-icon</code> | Used to show an icon when the switch is unselected. |
| <code>on-icon</code> | Used to show an icon when the switch is selected. |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the switch is selected or unselected. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the switch is selected or unselected. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(switch)</code> | The switch's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--density-step</code> | State layer size removed per density step. |
| <code>--handle-color</code> |  |
| <code>--handle-height</code> |  |
| <code>--handle-shape</code> |  |
| <code>--handle-width</code> |  |
| <code>--icon-color</code> |  |
| <code>--icon-size</code> |  |
| <code>--state-layer-color</code> |  |
| <code>--state-layer-shape</code> |  |
| <code>--state-layer-size</code> | State layer size at density 0. |
| <code>--target-size</code> | The minimum touch target size, kept at any density. |
| <code>--track-color</code> |  |
| <code>--track-height</code> |  |
| <code>--track-opacity</code> |  |
| <code>--track-outline-color</code> |  |
| <code>--track-outline-width</code> |  |
| <code>--track-shape</code> |  |
| <code>--track-width</code> |  |
| <code>--with-icon-handle-height</code> |  |
| <code>--with-icon-handle-width</code> |  |
