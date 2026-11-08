# Radio

Radio buttons let people select one option from a set of options.

**Example: A radio group for choosing a delivery address**

```html
<div role="radiogroup" aria-label="Delivery address">
  <div>
    <md-gb-radio id="home" name="address" value="home" checked></md-gb-radio>
    <label for="home">Home</label>
  </div>
  <div>
    <md-gb-radio id="office" name="address" value="office"></md-gb-radio>
    <label for="office">Office</label>
  </div>
</div>
```

## Usage guidelines

*   **Use radios for a single choice.** Pick radio buttons, not switches, when only one option can be selected from a list; use checkboxes when several can.
*   **Show every option.** Radios expose all the choices, so use them for five or fewer; consider a menu when space is tight.
*   **Always add a label.** Each radio needs its own scannable label, and a person can select either the radio or its label.
*   **Preselect one and stack them.** List radios vertically with one option already selected, and avoid nesting them.

## Anatomy

A radio is one element, paired with an adjacent label.

**Example: A radio button with its label**

```html
<md-gb-radio id="anatomy-radio" name="anatomy" value="email" checked></md-gb-radio>
<label for="anatomy-radio">Email</label>
```

## Examples

### Group

Radios with the same `name` form a group, and only one can be selected. Add `checked` to the one selected at the start, and `value` to identify the selection in a form.

**Example: A group of three radios in a form**

```html
<form>
  <div role="radiogroup" aria-label="Pet">
    <div>
      <md-gb-radio id="cats" name="pet" value="cats"></md-gb-radio>
      <label for="cats">Cats</label>
    </div>
    <div>
      <md-gb-radio id="dogs" name="pet" value="dogs" checked></md-gb-radio>
      <label for="dogs">Dogs</label>
    </div>
    <div>
      <md-gb-radio id="birds" name="pet" value="birds"></md-gb-radio>
      <label for="birds">Birds</label>
    </div>
  </div>
</form>
```

### Required

Add `required` to any radio in the group to require a selection before the form submits.

**Example: A required radio group**

```html
<form>
  <div role="radiogroup" aria-label="Plan">
    <div>
      <md-gb-radio id="monthly" name="plan" value="monthly" required></md-gb-radio>
      <label for="monthly">Monthly</label>
    </div>
    <div>
      <md-gb-radio id="yearly" name="plan" value="yearly"></md-gb-radio>
      <label for="yearly">Yearly</label>
    </div>
  </div>
</form>
```

### Disabled

Add `disabled` to a radio that can't be selected right now.

**Example: A radio group with a disabled option**

```html
<div role="radiogroup" aria-label="Shipping">
  <div>
    <md-gb-radio id="standard" name="shipping" checked></md-gb-radio>
    <label for="standard">Standard</label>
  </div>
  <div>
    <md-gb-radio id="express" name="shipping" disabled></md-gb-radio>
    <label for="express">Express</label>
  </div>
</div>
```

### Density

Set `density` from `0` (default) down to `-3` to shrink the radio by 4px per step. The touch target stays 48px. Keep it off by default and let people opt in.

**Example: A radio group at density -2**

```html
<div role="radiogroup" aria-label="Size">
  <div>
    <md-gb-radio id="small" name="size" density="-2" checked></md-gb-radio>
    <label for="small">Small</label>
  </div>
  <div>
    <md-gb-radio id="large" name="size" density="-2"></md-gb-radio>
    <label for="large">Large</label>
  </div>
</div>
```

## Accessibility

*   Place radios in a [`role="radiogroup"`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radiogroup_role) and label the group with `aria-label` or `aria-labelledby`.
*   Name each radio with a `<label for>` that points at its `id`. Use an [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) only for a radio with no visible label.
*   Don't wrap a radio in its `<label>`; screen readers then can't announce the number of radios in the group.
*   Tab moves focus to the selected radio of a group, and the arrow keys move the selection between radios. Space selects the focused radio.
*   Once a radio is selected the group can't be cleared, so add a "None" option or a "Clear selection" control if people may opt out.

## API reference

### &lt;md-gb-radio&gt;

A Material Design component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>checked</code><br><span class="gb-desc">Whether or not the radio is selected.</span> | <code>checked</code> | <code>boolean</code> |  |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the radio's layout box (48px) and state layer (40px); the touch target stays 48px. Values are clamped to that range. radio-button.md: don't apply density by default; let people opt in to a denser layout.</span> | <code>density</code> | <code>Density</code> |  |
| <code>required</code><br><span class="gb-desc">Whether or not the radio is required. If any radio is required in a group, all radios are implicitly required.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>value</code><br><span class="gb-desc">The element value to use in form submission when checked.</span> | <code>value</code> | <code>string</code> | <code>'on'</code> |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when the radio is checked (but not unchecked). |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when the radio is checked (but not unchecked). |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(radio)</code> | The radio's root element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--density-step</code> | Size removed per density step. |
| <code>--icon-color</code> |  |
| <code>--icon-size</code> |  |
| <code>--state-layer-color</code> |  |
| <code>--state-layer-shape</code> |  |
| <code>--state-layer-size</code> | State layer size at density 0. |
| <code>--target-size</code> | The minimum touch target size, kept at any density. |
