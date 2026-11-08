# Chips

Chips help people enter information, make selections, filter content, or trigger actions.

**Example: Filter chips in a labeled chip set**

```html
<md-gb-chip-set aria-label="Meal filters">
  <md-gb-chip type="filter" selected>Breakfast</md-gb-chip>
  <md-gb-chip type="filter">Lunch</md-gb-chip>
  <md-gb-chip type="filter">Dinner</md-gb-chip>
</md-gb-chip-set>
```

## Usage guidelines

*   **Pick the type by purpose.** [Assist](#assist-chips) chips are smart actions, [filter](#filter-chips) chips filter content, [input](#input-chips) chips are information a person entered, and [suggestion](#suggestion-chips) chips offer dynamic replies or queries.
*   **Show chips as a set.** Unlike buttons, chips appear dynamically as a group, so always place them in a [chip set](#chip-set).
*   **Elevate only for protection.** Use [elevated](#assist-chips) chips when they sit on an image or a busy background.
*   **Keep them compact.** Reduce [density](#density) when space is tight.

## Anatomy

A chip set holds chips, and each chip holds its label and optional icons.

**Example: A chip set with a chip that has a leading and a trailing icon**

```html
<md-gb-chip-set aria-label="Places">
  <md-gb-chip>
    <md-gb-icon slot="icon">place</md-gb-icon>
    <md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>
    Nearby
  </md-gb-chip>
  <md-gb-chip>Open late</md-gb-chip>
</md-gb-chip-set>
```

## Examples

### Assist chips

Assist chips are smart or automated actions, such as adding an event to a calendar. They are the default `type`, can link with `href`, and can be elevated.

**Example: An assist chip with an icon and an assist chip that links to a page**

```html
<md-gb-chip-set aria-label="Event actions">
  <md-gb-chip>
    <md-gb-icon slot="icon">event</md-gb-icon>
    Add to calendar
  </md-gb-chip>
  <md-gb-chip href="https://m3.material.io/components/chips">
    <md-gb-icon slot="icon">open_in_new</md-gb-icon>
    Guidelines
  </md-gb-chip>
</md-gb-chip-set>
```

### Filter chips

Filter chips use tags or descriptive words to filter content and can replace toggle buttons or checkboxes. Set `type="filter"` and use `selected` for chosen ones.

**Example: Filter chips, one selected, one with a trailing icon**

```html
<md-gb-chip-set aria-label="Filters">
  <md-gb-chip type="filter" selected>Open now</md-gb-chip>
  <md-gb-chip type="filter">
    Price
    <md-gb-icon slot="trailing-icon">arrow_drop_down</md-gb-icon>
  </md-gb-chip>
</md-gb-chip-set>
```

### Input chips

Input chips are discrete pieces of information a person entered, such as contacts. Set `type="input"`; add `removable` for a remove button and `editable` to let people edit the text. Icons and avatars go in the `icon` slot.

**Example: Removable input chips, one with an icon**

```html
<md-gb-chip-set aria-label="Attendees">
  <md-gb-chip type="input" removable>Hiking</md-gb-chip>
  <md-gb-chip type="input" removable>
    <md-gb-icon slot="icon">person</md-gb-icon>
    Ada
  </md-gb-chip>
</md-gb-chip-set>
```

### Suggestion chips

Suggestion chips narrow a person's intent with dynamically generated suggestions, such as possible replies.

**Example: Suggested replies**

```html
<md-gb-chip-set aria-label="Suggested replies">
  <md-gb-chip type="suggestion">Sounds good</md-gb-chip>
  <md-gb-chip type="suggestion" elevated>See you then</md-gb-chip>
</md-gb-chip-set>
```

### Chip set

The chip set manages selection (`selection="single"` or `"multiple"`) and arrow-key navigation, and wraps chips by default. With `selection="single"`, add `required` so the selected chip can't be unselected, or `single-line` to scroll instead of wrap.

**Example: A single-select chip set with a heading**

```html
<h3 id="size-label">Size</h3>
<md-gb-chip-set aria-labelledby="size-label" selection="single" required>
  <md-gb-chip type="filter" selected>Small</md-gb-chip>
  <md-gb-chip type="filter">Medium</md-gb-chip>
  <md-gb-chip type="filter">Large</md-gb-chip>
</md-gb-chip-set>
```

### Density

Set `density` on the chip set from 0 (default) to -3 to remove 4px of height per step.

**Example: A chip set with a density of -2**

```html
<md-gb-chip-set aria-label="Compact filters" density="-2">
  <md-gb-chip type="filter">Lunch</md-gb-chip>
  <md-gb-chip type="filter">Dinner</md-gb-chip>
</md-gb-chip-set>
```

### Disabled and soft-disabled

A `soft-disabled` chip stays focusable so screen reader users can discover actions that are not available yet, such as Copy before text is selected.

**Example: A disabled chip and a soft-disabled chip**

```html
<md-gb-chip-set aria-label="Edit actions">
  <md-gb-chip disabled>Disabled</md-gb-chip>
  <md-gb-chip soft-disabled>Soft-disabled</md-gb-chip>
</md-gb-chip-set>
```

## Accessibility

*   A chip set is a grid of chips: label it with [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) or [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby).
*   Add an `aria-label` to chips whose text needs to be more descriptive.
*   The set is one tab stop; arrow keys, Home and End move between chips, and Backspace or Delete removes a removable chip.
*   Disabled chips leave the focus order; use `soft-disabled` where discoverability matters, per the [ARIA guidance on disabled controls](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls).

**Example: A chip set labelled by a heading, with chips that have a longer aria-label**

```html
<h3 id="dates-label">Dates</h3>
<md-gb-chip-set aria-labelledby="dates-label">
  <md-gb-chip aria-label="Monday" type="filter">Mon</md-gb-chip>
  <md-gb-chip aria-label="Tuesday" type="filter">Tue</md-gb-chip>
</md-gb-chip-set>
```

## API reference

### &lt;md-gb-chip&gt;

A Material Design Expressive Chip component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>color</code> | <code>color</code> | <code>ChipColor</code> | <code>"flat"</code> |
| <code>density</code><br><span class="gb-desc">The density, from 0 (default) to -3. Each step down removes 4px from the container height (32px); the label and icons keep their size and the touch target stays 48px (chips.md: "regardless of placement or density"). Values are clamped to that range. Density 0 inherits the density of an enclosing <code>md-gb-chip-set</code>. chips.md: don't apply density by default; let people opt in to a denser layout.</span> | <code>density</code> | <code>Density</code> |  |
| <code>disabled</code><br><span class="gb-desc">Whether the chip is disabled.</span> | <code>disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>dragged</code><br><span class="gb-desc">Whether the chip is being dragged (spec dragged state elevation).</span> | <code>dragged</code> | <code>boolean</code> | <code>false</code> |
| <code>editable</code><br><span class="gb-desc">Whether the text of an input chip can be edited (chips.md "Input chips": "Input chips can support editing to change their contents, such as correcting an email address"). Editing starts by interacting with the chip: a second click, Enter or Space on the selected chip, or a double click. Committing with Enter or by leaving the field changes the chip's text and fires <code>edit</code>; Escape (or emptying the text) keeps the old text.</span> | <code>editable</code> | <code>boolean</code> | <code>false</code> |
| <code>elevated</code><br><span class="gb-desc">Elevated container, for chips on images or complex backgrounds. Input chips have no elevated style.</span> | <code>elevated</code> | <code>boolean</code> | <code>false</code> |
| <code>groupDisabled</code><br><span class="gb-desc">Whether the chip's set is disabled (a disabled form fieldset).</span> |  | <code>boolean</code> | <code>false</code> |
| <code>href</code><br><span class="gb-desc">The URL destination; makes an assist chip a link.</span> | <code>href</code> | <code>string</code> | <code>""</code> |
| <code>referrerPolicy</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>referrerpolicy</code> attribute when <code>href</code> is set.</span> | <code>referrerpolicy</code> | <code>string</code> | <code>""</code> |
| <code>rel</code><br><span class="gb-desc">Sets the underlying <code>HTMLAnchorElement</code>'s <code>rel</code> attribute when <code>href</code> is set.</span> | <code>rel</code> | <code>string</code> | <code>""</code> |
| <code>removable</code><br><span class="gb-desc">Whether the chip has a remove button (input chips).</span> | <code>removable</code> | <code>boolean</code> | <code>false</code> |
| <code>removeLabel</code><br><span class="gb-desc">The remove button's accessible label. Defaults to "Remove &#123;chip label&#125;" (spec: the remove action is labeled separately).</span> | <code>remove-label</code> | <code>string</code> | <code>""</code> |
| <code>selected</code><br><span class="gb-desc">Whether the filter (or input) chip is selected.</span> | <code>selected</code> | <code>boolean</code> | <code>false</code> |
| <code>softDisabled</code><br><span class="gb-desc">Whether the chip is soft-disabled (<code>aria-disabled="true"</code> while preserving focusability).</span> | <code>soft-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>target</code><br><span class="gb-desc">Where to display the linked <code>href</code> URL for a link chip.</span> | <code>target</code> | <code>"" | "_blank" | "_parent" | "_self" | "_top"</code> | <code>""</code> |
| <code>type</code><br><span class="gb-desc">The chip type: <code>assist</code> (default), <code>filter</code>, <code>input</code> or <code>suggestion</code>.</span> | <code>type</code> | <code>ChipType</code> | <code>"assist"</code> |
| <code>value</code><br><span class="gb-desc">The value a chip set submits while the chip is selected. Defaults to the label text, like a native <code>&lt;option&gt;</code>.</span> | <code>value</code> | <code>string</code> |  |

#### Slots

| Slot | Description |
| --- | --- |
| default | The chip label text. |
| <code>icon</code> | An optional leading icon, or an avatar (<code>class="chip-avatar"</code> or an <code>&lt;img&gt;</code>; input chips). |
| <code>remove-icon</code> | The remove button icon when <code>removable</code> (default: the <code>close</code> symbol). |
| <code>trailing-icon</code> | An optional trailing icon (filter chips, e.g. a drop-down arrow). |

#### Events

| Event | Description |
| --- | --- |
| <code>change</code><br><span class="gb-desc">Event</span> | Fired when a filter chip's selection changes. |
| <code>edit</code><br><span class="gb-desc">CustomEvent</span> | Fired when an <code>editable</code> chip's new text is committed; <code>detail</code> has <code>value</code> and <code>previousValue</code>. |
| <code>input</code><br><span class="gb-desc">InputEvent</span> | Fired when a filter chip's selection changes. |
| <code>remove</code><br><span class="gb-desc">Event</span> | Fired when the remove button is activated, or Backspace / Delete is pressed on a removable chip. |
| <code>update-focus</code><br><span class="gb-desc">Event</span> | Fired when <code>disabled</code> changes, so a chip set can update its tab stop. |

#### Methods

| Method | Description |
| --- | --- |
| <code>cancelEdit</code><br><span class="gb-desc">() =&gt; void</span> | Ends editing and keeps the old text. |
| <code>commitEdit</code><br><span class="gb-desc">() =&gt; void</span> | Ends editing and applies the new text (empty or unchanged text keeps the old). |
| <code>focus</code><br><span class="gb-desc">(options?: FocusOptions &amp; &#123; trailing?: boolean; &#125;) =&gt; void</span> | Focuses the chip's primary action, or its remove button with <code>&#123;trailing: true&#125;</code> (chip set navigation backwards into a chip). |
| <code>startEdit</code><br><span class="gb-desc">() =&gt; void</span> | Turns an editable input chip into a text string to edit. Does nothing for other chips. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(chip)</code> | The root container element. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--avatar-opacity</code> |  |
| <code>--avatar-shape</code> |  |
| <code>--avatar-size</code> |  |
| <code>--container-color</code> |  |
| <code>--container-elevation</code> |  |
| <code>--container-height</code> | Container height at density 0. |
| <code>--container-shape</code> |  |
| <code>--density-step</code> | Container height removed per density step. |
| <code>--icon-label-space</code> |  |
| <code>--label-text</code> |  |
| <code>--label-text-color</code> |  |
| <code>--leading-icon-color</code> |  |
| <code>--leading-icon-size</code> |  |
| <code>--leading-space</code> |  |
| <code>--outline-color</code> |  |
| <code>--outline-width</code> |  |
| <code>--target-size</code> | The minimum touch target size, kept at any density. |
| <code>--trailing-icon-color</code> |  |
| <code>--trailing-icon-size</code> |  |
| <code>--trailing-space</code> |  |

### &lt;md-gb-chip-set&gt;

A Material Design Expressive chip set.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>density</code><br><span class="gb-desc">The density of the chips, from 0 (default) to -3: each step down removes 4px from the chips' height. A chip's own non-zero <code>density</code> wins. Values are clamped to that range.</span> | <code>density</code> | <code>Density</code> |  |
| <code>required</code><br><span class="gb-desc">Single-select: the selected chip can't be unselected.</span> | <code>required</code> | <code>boolean</code> | <code>false</code> |
| <code>selection</code><br><span class="gb-desc">How many filter chips can be selected: <code>none</code>, <code>single</code> or <code>multiple</code>.</span> | <code>selection</code> | <code>SelectionMode</code> | <code>"multiple"</code> |
| <code>singleLine</code><br><span class="gb-desc">Keep the chips on one line and scroll horizontally instead of wrapping.</span> | <code>single-line</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The chips. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--chip-set-overflow-inset</code> | Room kept for touch targets and focus rings when a single-line set clips its overflow. |
| <code>--chip-set-space</code> | The space between chips and between lines. |
