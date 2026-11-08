# Sheets

Sheets show supplementary content and actions anchored to the bottom or the side of the window.

**Example: A modal bottom sheet with file actions**

*HTML*

```html
<md-gb-button id="open-actions">Show actions</md-gb-button>
<md-gb-bottom-sheet id="actions" modal label="File actions">
  <md-gb-list>
    <md-gb-list-item>Share</md-gb-list-item>
    <md-gb-list-item>Get link</md-gb-list-item>
    <md-gb-list-item>Make a copy</md-gb-list-item>
  </md-gb-list>
</md-gb-bottom-sheet>
```

*JavaScript*

```js
document.querySelector('#open-actions').addEventListener('click', () => {
  document.querySelector('#actions').show();
});
```

## Usage guidelines

*   **Secondary content.** Sheets hold extra content and actions, not the main content of the app.
*   **Match the window size.** Use a [bottom sheet](#bottom-sheets) in compact and medium windows and a [side sheet](#side-sheets) in wider ones.
*   **Standard or modal.** A standard sheet sits beside the content so people can keep using it. A modal sheet blocks the page under a scrim until it is closed.

## Anatomy

A bottom sheet has a container and an optional drag handle. A side sheet adds a headline, a close button and actions.

**Example: A bottom sheet and a side sheet, each opened by a button**

*HTML*

```html
<md-gb-button id="open-bottom">Bottom sheet</md-gb-button>
<md-gb-button id="open-side">Side sheet</md-gb-button>

<md-gb-bottom-sheet id="bottom" modal label="Share">
  <p>Share this photo with friends.</p>
</md-gb-bottom-sheet>

<md-gb-side-sheet id="side" modal>
  <span slot="headline">Filters</span>
  <p>Narrow the results by date or author.</p>
  <md-gb-button slot="actions">Apply</md-gb-button>
</md-gb-side-sheet>
```

*JavaScript*

```js
document.querySelector('#open-bottom').addEventListener('click', () => {
  document.querySelector('#bottom').show();
});
document.querySelector('#open-side').addEventListener('click', () => {
  document.querySelector('#side').show();
});
```

## Examples

### Bottom sheets

A bottom sheet rests at a partial height and expands when dragged or when its handle is activated. Without `modal` it is a standard sheet with no scrim. Set `state="expanded"` to open it at full height.

**Example: A bottom sheet that opens expanded**

*HTML*

```html
<md-gb-button id="open-expanded">Show details</md-gb-button>
<md-gb-bottom-sheet id="expanded" modal state="expanded" label="Photo details">
  <p>Taken on June 3 in Lisbon.</p>
</md-gb-bottom-sheet>
```

*JavaScript*

```js
document.querySelector('#open-expanded').addEventListener('click', () => {
  document.querySelector('#expanded').show();
});
```

### Without a drag handle

Add `hide-drag-handle` to remove the handle and dragging. Add `skip-partially-expanded` for a sheet that has no partial height.

**Example: A bottom sheet without a drag handle**

*HTML*

```html
<md-gb-button id="open-plain">Show options</md-gb-button>
<md-gb-bottom-sheet id="plain" modal hide-drag-handle label="Sort options">
  <p>Sort by name, date, or size.</p>
</md-gb-bottom-sheet>
```

*JavaScript*

```js
document.querySelector('#open-plain').addEventListener('click', () => {
  document.querySelector('#plain').show();
});
```

### Side sheets

A side sheet has a `headline`, a close button and an `actions` slot. Add `divider` to separate the actions, and `detached` to float the sheet with margins.

**Example: A modal side sheet with Save and Cancel actions**

*HTML*

```html
<md-gb-button id="open-filters">Filters</md-gb-button>
<md-gb-side-sheet id="filters" modal headline="Filters">
  <p>Narrow the results by date or author.</p>
  <md-gb-button slot="actions">Save</md-gb-button>
  <md-gb-button slot="actions" color="outlined">Cancel</md-gb-button>
</md-gb-side-sheet>
```

*JavaScript*

```js
document.querySelector('#open-filters').addEventListener('click', () => {
  document.querySelector('#filters').show();
});
```

### Back button

Set `has-back-button` on a side sheet to let people go back to an earlier region. The sheet fires `back` when it is pressed.

**Example: A side sheet with a back button**

*HTML*

```html
<md-gb-button id="open-detail">Details</md-gb-button>
<md-gb-side-sheet id="detail" modal has-back-button headline="Details">
  <p>Created by Ada on May 2.</p>
</md-gb-side-sheet>
```

*JavaScript*

```js
document.querySelector('#open-detail').addEventListener('click', () => {
  document.querySelector('#detail').show();
});
```

## Accessibility

*   A modal sheet is a `<dialog>`: focus moves into it, stays inside, and returns to the opener on close. Escape and a click on the scrim close it.
*   Name a bottom sheet with `label`. A side sheet is named by its `headline`, or by `label` when it has none.
*   The drag handle is a button, so keyboard users can expand and collapse the sheet. Localize `drag-handle-label`, `close-label` and `back-label`.

## API reference

### &lt;md-gb-bottom-sheet&gt;

A Material Design bottom sheet.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>closeLabel</code><br><span class="gb-desc">Accessible label of the close icon button of a full-screen sheet.</span> | <code>close-label</code> | <code>string</code> | <code>'Close'</code> |
| <code>collapseLabel</code><br><span class="gb-desc">Accessible label of the collapse icon button of a full-screen sheet.</span> | <code>collapse-label</code> | <code>string</code> | <code>'Collapse'</code> |
| <code>dragHandleLabel</code><br><span class="gb-desc">Accessible label of the drag handle button.</span> | <code>drag-handle-label</code> | <code>string</code> | <code>'Drag handle'</code> |
| <code>hideDragHandle</code><br><span class="gb-desc">Whether to hide the drag handle (which also disables dragging).</span> | <code>hide-drag-handle</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">Accessible label of the sheet dialog.</span> | <code>label</code> | <code>string</code> | <code>'Bottom sheet'</code> |
| <code>modal</code><br><span class="gb-desc">Whether the sheet is modal: shown above a scrim, blocking the rest of the page, and closed by Escape or a scrim click.</span> | <code>modal</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the sheet is open. Setting it calls <code>show()</code> or <code>close()</code>.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Whether to skip the opening and closing motion.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>skipPartiallyExpanded</code><br><span class="gb-desc">Whether the sheet has no partially expanded height: it opens expanded and the drag handle closes it.</span> | <code>skip-partially-expanded</code> | <code>boolean</code> | <code>false</code> |
| <code>state</code><br><span class="gb-desc">The resting height while open: <code>partially-expanded</code> or <code>expanded</code>. Updated when the user drags or activates the drag handle.</span> | <code>state</code> | <code>BottomSheetState</code> | <code>BOTTOM_SHEET_STATES.partiallyExpanded</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The sheet content. It scrolls when taller than the sheet. |

#### Events

| Event | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the sheet begins closing. Cancelable; canceling keeps it open. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired after the closing motion. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the sheet begins opening. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired after the opening motion. |
| <code>state-change</code><br><span class="gb-desc">Event</span> | Fired when the user moves the sheet to another height (<code>state</code>). |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the sheet. Resolves after the closing motion. |
| <code>expand</code><br><span class="gb-desc">() =&gt; void</span> | Expands the sheet to its full height. |
| <code>handleBack</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Handles a back request (the Android back gesture or button, which a modal sheet receives through its dialog): plays the predictive back motion and closes the sheet with reason <code>back</code>. If the <code>close</code> event is canceled, the sheet settles back. Resolves after the closing motion. Call it for an in-app back control that should behave like the system back. |
| <code>partialExpand</code><br><span class="gb-desc">() =&gt; void</span> | Moves the sheet to its partially expanded height, when it has one. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the sheet. Resolves after the opening motion. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(container)</code> | The sheet container. |
| <code>::part(content)</code> | The container of the default slot. |
| <code>::part(dialog)</code> | The <code>&lt;dialog&gt;</code> holding the sheet; its <code>::backdrop</code> is the scrim. |
| <code>::part(drag-handle)</code> | The drag handle button. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--container-color</code> | Container color. |
| <code>--container-elevation</code> | Container box shadow. |
| <code>--container-shape</code> | Top corner radius. |
| <code>--drag-handle-color</code> | Drag handle color. |
| <code>--drag-handle-height</code> | Drag handle height. |
| <code>--drag-handle-padding-block</code> | Space above and below the drag handle. |
| <code>--drag-handle-width</code> | Drag handle width. |
| <code>--max-width</code> | Maximum container width. |
| <code>--partially-expanded-height</code> | Maximum visible height of a partially expanded modal sheet. |
| <code>--peek-height</code> | Visible height of a partially expanded standard sheet. |
| <code>--scrim-color</code> | Scrim color of a modal sheet. |
| <code>--scrim-opacity</code> | Scrim opacity of a modal sheet. |
| <code>--top-margin</code> | Minimum space above the expanded sheet. |
| <code>--wide-margin</code> | Top and side margins when the sheet is wider than its max width. |

### &lt;md-gb-side-sheet&gt;

A Material Design side sheet.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>backLabel</code><br><span class="gb-desc">Accessible label of the back icon button.</span> | <code>back-label</code> | <code>string</code> | <code>'Back'</code> |
| <code>closeLabel</code><br><span class="gb-desc">Accessible label of the close icon button.</span> | <code>close-label</code> | <code>string</code> | <code>'Close'</code> |
| <code>detached</code><br><span class="gb-desc">Whether the sheet floats inset from the window edges with rounded corners, instead of touching them.</span> | <code>detached</code> | <code>boolean</code> | <code>false</code> |
| <code>divider</code><br><span class="gb-desc">Whether to draw dividers: along the inline start edge of a standard docked sheet, and above the actions.</span> | <code>divider</code> | <code>boolean</code> | <code>false</code> |
| <code>gesturesDisabled</code><br><span class="gb-desc">Whether to turn off swipe to dismiss on a modal sheet.</span> | <code>gestures-disabled</code> | <code>boolean</code> | <code>false</code> |
| <code>hasBackButton</code><br><span class="gb-desc">Whether to show the back icon button before the headline.</span> | <code>has-back-button</code> | <code>boolean</code> | <code>false</code> |
| <code>headline</code><br><span class="gb-desc">The headline text.</span> | <code>headline</code> | <code>string</code> | <code>''</code> |
| <code>hideCloseButton</code><br><span class="gb-desc">Whether to hide the close icon button. Material requires a close affordance in every side sheet; provide another one when hiding it.</span> | <code>hide-close-button</code> | <code>boolean</code> | <code>false</code> |
| <code>label</code><br><span class="gb-desc">Accessible label of the sheet dialog, used when it has no headline.</span> | <code>label</code> | <code>string</code> | <code>''</code> |
| <code>modal</code><br><span class="gb-desc">Whether the sheet is modal: shown above a scrim, blocking the rest of the page, and closed by Escape or a scrim click.</span> | <code>modal</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Whether the sheet is open. Setting it calls <code>show()</code> or <code>close()</code>.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Whether to skip the opening and closing motion.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The sheet content. It scrolls vertically when taller than the sheet. |
| <code>actions</code> | Action buttons at the bottom of the sheet, such as Save and Cancel. |
| <code>headline</code> | Headline content; replaces the <code>headline</code> text. |

#### Events

| Event | Description |
| --- | --- |
| <code>back</code><br><span class="gb-desc">Event</span> | Fired when the back icon button is activated. |
| <code>close</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired when the sheet begins closing. Cancelable; canceling keeps it open. |
| <code>closed</code><br><span class="gb-desc">CustomEvent&lt;&#123;reason: string&#125;&gt;</span> | Fired after the closing motion. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the sheet begins opening. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired after the opening motion. |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the sheet. Resolves after the closing motion. |
| <code>handleBack</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Handles a back request (the Android back gesture or button, which a modal sheet receives through its dialog): plays the predictive back motion and closes the sheet with reason <code>back</code>. If the <code>close</code> event is canceled, the sheet settles back. Resolves after the closing motion. Call it for an in-app back control that should behave like the system back. |
| <code>render</code><br><span class="gb-desc">() =&gt; TemplateResult&lt;1&gt;</span> | Invoked on each update to perform rendering tasks. This method may return any value renderable by lit-html's <code>ChildPart</code> - typically a <code>TemplateResult</code>. Setting properties inside this method will *not* trigger the element to update. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the sheet. Resolves after the opening motion. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The container of the actions slot. |
| <code>::part(container)</code> | The sheet container. |
| <code>::part(content)</code> | The container of the default slot. |
| <code>::part(dialog)</code> | The <code>&lt;dialog&gt;</code> holding the sheet; its <code>::backdrop</code> is the scrim. |
| <code>::part(header)</code> | The header row. |
| <code>::part(headline)</code> | The headline. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--actions-height</code> | Actions row minimum height. |
| <code>--actions-padding-block-end</code> | Space below the actions. |
| <code>--actions-padding-block-start</code> | Space above the actions. |
| <code>--container-color</code> | Container color. |
| <code>--container-elevation</code> | Container box shadow. |
| <code>--container-height</code> | Height of a standard sheet. |
| <code>--container-margin</code> | Inset from the window edges (16px when detached). |
| <code>--container-shape</code> | Corner radius (the inline start corners of a docked modal sheet; every corner of a detached sheet). |
| <code>--container-width</code> | Container width (capped at <code>--max-width</code>). |
| <code>--divider-color</code> | Divider color. |
| <code>--header-gap</code> | Space between header elements. |
| <code>--header-height</code> | Header minimum height. |
| <code>--headline</code> | Headline typography. |
| <code>--headline-axes</code> | Headline font variation settings. |
| <code>--headline-color</code> | Headline color. |
| <code>--headline-tracking</code> | Headline letter spacing. |
| <code>--icon-padding-inline</code> | Header padding next to the back or close icon button. |
| <code>--max-width</code> | Maximum container width. |
| <code>--padding-inline</code> | Start and end padding. |
| <code>--scrim-color</code> | Scrim color of a modal sheet. |
| <code>--scrim-opacity</code> | Scrim opacity of a modal sheet. |
