# Tooltip

Tooltips add context to a button or other element, as a short plain label or a richer panel with a subhead and actions.

**Example: A plain tooltip on an icon button**

```html
<md-gb-icon-button id="edit" aria-label="Edit">
  <md-gb-icon>edit</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="edit">Edit</md-gb-tooltip>
```

## Usage guidelines

*   **Plain to label.** Use a [plain](#placement) tooltip to name an element with no text, such as an icon-only button. Don't add one when the element already has a visible label.
*   **Rich for details.** Use a [rich](#rich) tooltip for longer text, such as a definition or an explanation of a new feature, with an optional subhead and up to two text buttons.
*   **Nothing critical.** Tooltips are easy to miss, so never hide information people must see. Use a dialog for that.

## Anatomy

A tooltip points at an anchor element by its id. A rich tooltip can add a subhead and actions.

**Example: A rich tooltip with a subhead, text and an action, open on a button**

*HTML*

```html
<button id="anchor">Storage</button>
<md-gb-tooltip for="anchor" variant="rich" persistent>
  <span slot="subhead">Storage</span>
  Photos and files you keep in your account.
  <md-gb-button slot="action" color="text">Manage</md-gb-button>
</md-gb-tooltip>
```

*JavaScript*

```js
document.querySelector('md-gb-tooltip').show();
```

## Examples

### Placement

A plain tooltip opens above its anchor and a rich one below it. Set `placement` to `above`, `below`, `start` or `end`; it flips when there isn't room. Add `caret` to point at the anchor.

**Example: A plain tooltip with a caret, placed below its anchor**

```html
<md-gb-icon-button id="share" aria-label="Share">
  <md-gb-icon>share</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="share" placement="below" caret>Share</md-gb-tooltip>
```

### Rich

Set `variant="rich"` and a `subhead`. Text buttons go in the `action` slot.

**Example: A rich tooltip with a subhead and an action**

```html
<md-gb-button id="grant" color="outlined">Grant value</md-gb-button>
<md-gb-tooltip for="grant" variant="rich" subhead="How it's calculated">
  Uses the closing stock price from the day before the grant date.
  <md-gb-button slot="action" color="text">Learn more</md-gb-button>
</md-gb-tooltip>
```

### Persistent

A `persistent` rich tooltip opens when the anchor is clicked and stays open until someone interacts with something else, so people can reach its actions.

**Example: A rich tooltip that opens on click**

```html
<md-gb-button id="whats-new" color="tonal">What's new</md-gb-button>
<md-gb-tooltip for="whats-new" variant="rich" persistent subhead="Shared folders">
  Invite others to a folder and work on files together.
  <md-gb-button slot="action" color="text">Got it</md-gb-button>
</md-gb-tooltip>
```

### Delays

A tooltip opens right away and closes 1.5 seconds after the pointer leaves. Set `show-delay` and `hide-delay` in milliseconds, or add `quick` to skip the motion.

**Example: A tooltip that closes after half a second**

```html
<md-gb-icon-button id="delete" aria-label="Delete">
  <md-gb-icon>delete</md-gb-icon>
</md-gb-icon-button>
<md-gb-tooltip for="delete" hide-delay="500">Delete</md-gb-tooltip>
```

## Accessibility

*   A plain tooltip is a `tooltip` that describes its anchor, and it opens on hover and on keyboard focus. Keep the anchor's own accessible name, such as an `aria-label` on an icon button.
*   A rich tooltip with actions is a `dialog`, so its buttons can be reached with the keyboard.
*   Escape closes an open tooltip.
*   Don't put information in a tooltip that people can't find another way, since touch users can't hover.

## API reference

### &lt;md-gb-tooltip&gt;

A Material Design plain or rich tooltip.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>align</code><br><span class="gb-desc">How the tooltip lines up with its anchor along the placement side: <code>center</code> (plain default) or <code>start</code> (rich default). A rich tooltip can be <code>center</code>ed below its anchor on desktop.</span> | <code>align</code> | <code>"" | "start" | "center"</code> | <code>''</code> |
| <code>caret</code><br><span class="gb-desc">Whether to draw a caret pointing at the anchor.</span> | <code>caret</code> | <code>boolean</code> | <code>false</code> |
| <code>hideDelay</code><br><span class="gb-desc">Delay before hiding after the pointer leaves, in milliseconds.</span> | <code>hide-delay</code> | <code>number</code> | <code>TOOLTIP_HIDE_DELAY_MS</code> |
| <code>htmlFor</code><br><span class="gb-desc">The id of the anchor element, in the same root as the tooltip.</span> | <code>for</code> | <code>string</code> | <code>''</code> |
| <code>noBoundary</code><br><span class="gb-desc">Plain only: the anchor has no visual boundary, such as a text baseline, so the tooltip sits 8dp from it instead of 4dp.</span> | <code>no-boundary</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the tooltip is open.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>persistent</code><br><span class="gb-desc">Rich only: opens when the anchor is clicked instead of on hover / focus, and stays open until the user interacts with another element.</span> | <code>persistent</code> | <code>boolean</code> | <code>false</code> |
| <code>placement</code><br><span class="gb-desc">Preferred side of the anchor. Defaults to <code>above</code> for plain tooltips and <code>below</code> for rich ones. Flips when there isn't room.</span> | <code>placement</code> | <code>"" | TooltipPlacement</code> | <code>''</code> |
| <code>quick</code><br><span class="gb-desc">Skips the open / close animation.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>showDelay</code><br><span class="gb-desc">Hover delay before showing, in milliseconds.</span> | <code>show-delay</code> | <code>number</code> | <code>TOOLTIP_SHOW_DELAY_MS</code> |
| <code>subhead</code><br><span class="gb-desc">Rich only: subhead text. Replaced by content in the <code>subhead</code> slot.</span> | <code>subhead</code> | <code>string</code> | <code>''</code> |
| <code>variant</code><br><span class="gb-desc">Plain or rich.</span> | <code>variant</code> | <code>TooltipVariant</code> | <code>TOOLTIP_VARIANTS.plain</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The supporting text. |
| <code>action</code> | Rich tooltip text buttons (up to two), e.g. <code>&lt;md-gb-button color="text"&gt;</code>. |
| <code>subhead</code> | Rich tooltip subhead; replaces the <code>subhead</code> attribute. |

#### Events

| Event | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired before the tooltip closes. Cancelable. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired after the tooltip closes. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired before the tooltip opens. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired after the tooltip opens. |

#### Methods

| Method | Description |
| --- | --- |
| <code>hide</code><br><span class="gb-desc">() =&gt; void</span> | Closes the tooltip. |
| <code>reposition</code><br><span class="gb-desc">() =&gt; void</span> | Recomputes the tooltip's position next to its anchor. |
| <code>show</code><br><span class="gb-desc">() =&gt; void</span> | Opens the tooltip, closing any other open tooltip. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The actions container. |
| <code>::part(caret)</code> | The caret. |
| <code>::part(subhead)</code> | The subhead container. |
| <code>::part(supporting-text)</code> | The supporting text container. |
| <code>::part(tooltip)</code> | The tooltip surface. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--action-label-text</code> | Rich action typography. |
| <code>--action-label-text-axes</code> | Rich action font variation settings. |
| <code>--action-label-text-color</code> | Rich action label color. |
| <code>--action-label-text-tracking</code> | Rich action letter spacing. |
| <code>--actions-gap</code> | Space between rich actions. |
| <code>--actions-padding-block-end</code> | Rich container bottom padding below actions. |
| <code>--actions-spacing</code> | Space above the rich actions. |
| <code>--anchor-spacing</code> | Distance between the anchor and the tooltip (or its caret). |
| <code>--caret-height</code> | Caret height. |
| <code>--caret-width</code> | Caret base width. |
| <code>--container-color</code> | Container color. |
| <code>--container-elevation</code> | Container box shadow. |
| <code>--container-shape</code> | Container corner radius. |
| <code>--max-width</code> | Maximum container width. |
| <code>--min-height</code> | Minimum container height. |
| <code>--min-width</code> | Minimum container width. |
| <code>--padding-block</code> | Container block padding. |
| <code>--padding-inline</code> | Container inline padding. |
| <code>--subhead</code> | Rich subhead typography. |
| <code>--subhead-axes</code> | Rich subhead font variation settings. |
| <code>--subhead-color</code> | Rich subhead color. |
| <code>--subhead-spacing</code> | Space below the rich subhead. |
| <code>--subhead-tracking</code> | Rich subhead letter spacing. |
| <code>--supporting-text</code> | Supporting text typography. |
| <code>--supporting-text-axes</code> | Supporting text font variation settings. |
| <code>--supporting-text-color</code> | Supporting text color. |
| <code>--supporting-text-tracking</code> | Supporting text letter spacing. |
| <code>--viewport-margin</code> | Minimum distance from the viewport edges. |
