# Dialogs

Dialogs provide important prompts in a user flow.

**Example: A button that opens a dialog asking to delete messages**

*HTML*

```html
<md-gb-button id="open-delete">Delete</md-gb-button>
<md-gb-dialog id="delete-dialog">
  <span slot="headline">Permanently delete?</span>
  Deleting the selected messages also removes them from your other devices.
  <form id="delete-form" method="dialog"></form>
  <md-gb-button slot="actions" form="delete-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="delete-form" value="delete">Delete</md-gb-button>
</md-gb-dialog>
```

*JavaScript*

```js
document.querySelector('#open-delete').addEventListener('click', () => {
  document.querySelector('#delete-dialog').show();
});
```

## Usage guidelines

*   **Use them sparingly.** A dialog interrupts people to ask for a decision or to show critical information, so it blocks the rest of the app until it is dismissed.
*   **Pick the right priority.** For low or medium priority information, use a snackbar instead.
*   **Choose basic or full-screen.** Use a basic dialog by default. A [full-screen dialog](#full-screen) suits compact windows with a lot of content.
*   **Order the actions.** Put the dismissive action first and the confirming action last.

## Anatomy

A dialog has an optional icon and headline, supporting content, and actions.

**Example: A dialog with an icon, headline, supporting text and actions**

```html
<md-gb-dialog open quick>
  <md-gb-icon slot="icon">info</md-gb-icon>
  <span slot="headline">Discard draft?</span>
  Your draft will be deleted.
  <md-gb-button slot="actions">Cancel</md-gb-button>
  <md-gb-button slot="actions">Discard</md-gb-button>
</md-gb-dialog>
```

## Examples

### With an icon

Put an `md-gb-icon` in the `icon` slot to center the headline under a hero icon.

**Example: A dialog with a hero icon**

*HTML*

```html
<md-gb-button id="open-reset">Reset</md-gb-button>
<md-gb-dialog id="reset-dialog">
  <md-gb-icon slot="icon">restart_alt</md-gb-icon>
  <span slot="headline">Reset settings?</span>
  This returns your preferences to their defaults.
  <form id="reset-form" method="dialog"></form>
  <md-gb-button slot="actions" form="reset-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="reset-form" value="reset">Reset</md-gb-button>
</md-gb-dialog>
```

*JavaScript*

```js
document.querySelector('#open-reset').addEventListener('click', () => {
  document.querySelector('#reset-dialog').show();
});
```

### Full-screen

Set `full-screen` for a dialog that fills a compact window, with a close button and the confirming action in its header. Above compact sizes it falls back to a basic dialog; add `always-full-screen` to keep it.

**Example: A full-screen dialog for a new event**

*HTML*

```html
<md-gb-button id="open-event">New event</md-gb-button>
<md-gb-dialog id="event-dialog" full-screen>
  <span slot="headline">New event</span>
  <md-gb-button slot="actions">Save</md-gb-button>
  <label>
    Event name
    <input type="text">
  </label>
</md-gb-dialog>
```

*JavaScript*

```js
document.querySelector('#open-event').addEventListener('click', () => {
  document.querySelector('#event-dialog').show();
});
```

### Return value

A button's `value` becomes the dialog's `returnValue` when it closes the dialog through its form. Read it in the `closed` event.

**Example: A dialog that reports which button closed it**

*HTML*

```html
<md-gb-button id="open-archive">Archive</md-gb-button>
<p id="result" role="status"></p>
<md-gb-dialog id="archive-dialog">
  <span slot="headline">Archive this thread?</span>
  It moves out of your inbox.
  <form id="archive-form" method="dialog"></form>
  <md-gb-button slot="actions" form="archive-form" value="cancel">Cancel</md-gb-button>
  <md-gb-button slot="actions" form="archive-form" value="archive">Archive</md-gb-button>
</md-gb-dialog>
```

*JavaScript*

```js
const dialog = document.querySelector('#archive-dialog');
document.querySelector('#open-archive').addEventListener('click', () => {
  dialog.show();
});
dialog.addEventListener('closed', () => {
  document.querySelector('#result').textContent =
    dialog.returnValue === 'archive' ? 'Archived' : 'Canceled';
});
```

### Opening and closing

Open and close a dialog with `show()` and `close()`, or by setting `open`. Both methods return a promise that resolves after the animation. Cancel the `cancel` event to keep the dialog open.

**Example: Buttons that open and close a dialog from script**

*HTML*

```html
<md-gb-button id="open">Open</md-gb-button>
<md-gb-dialog id="note-dialog">
  <span slot="headline">Reminder</span>
  This dialog closes itself after three seconds.
  <md-gb-button slot="actions" id="close">Close now</md-gb-button>
</md-gb-dialog>
```

*JavaScript*

```js
const dialog = document.querySelector('#note-dialog');
document.querySelector('#open').addEventListener('click', async () => {
  await dialog.show();
  setTimeout(() => dialog.close(), 3000);
});
document.querySelector('#close').addEventListener('click', () => dialog.close());
```

## Accessibility

*   The headline names the dialog. Add `aria-label` to a dialog without a headline.
*   A basic dialog is an alert dialog (`role="alertdialog"`) by default, as M3 asks for on the web. Set `type="dialog"` for a plain dialog.
*   Focus moves into the dialog and Tab cycles inside it. Escape closes it and focus returns to what opened it.
*   Label buttons and fields inside the dialog as you would elsewhere. In a full-screen dialog, set `close-label` to name the close button.

## API reference

### &lt;md-gb-dialog&gt;

A Material Design dialog component.

#### Properties

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| <code>alwaysFullScreen</code><br><span class="gb-desc">Full-screen dialogs are for compact windows only (dialogs.md: use a basic dialog at medium and expanded). So <code>full-screen</code> applies at compact windows and the dialog is a basic dialog above, with the same slots. The host gets <code>adaptive-basic</code> while it falls back. Set <code>always-full-screen</code> to keep the full-screen variant at every window size.</span> | <code>always-full-screen</code> | <code>boolean</code> | <code>false</code> |
| <code>closeLabel</code><br><span class="gb-desc">Accessible label of the full-screen close icon button.</span> | <code>close-label</code> | <code>string</code> | <code>'Close'</code> |
| <code>fullScreen</code><br><span class="gb-desc">Uses the full-screen variant: the dialog fills the window, with a header holding a close icon button, the headline and the confirm action. Meant for compact windows; use a basic dialog at larger breakpoints.</span> | <code>full-screen</code> | <code>boolean</code> | <code>false</code> |
| <code>noFocusTrap</code><br><span class="gb-desc">Turns off focus trapping, which keeps Tab and Shift+Tab cycling inside the dialog. Trapping is recommended for accessibility.</span> | <code>no-focus-trap</code> | <code>boolean</code> | <code>false</code> |
| <code>open</code><br><span class="gb-desc">Opens the dialog when set to <code>true</code> and closes it when set to <code>false</code>.</span> | <code>open</code> | <code>boolean</code> |  |
| <code>quick</code><br><span class="gb-desc">Skips the opening and closing animations.</span> | <code>quick</code> | <code>boolean</code> | <code>false</code> |
| <code>returnValue</code><br><span class="gb-desc">The dialog's return value, usually which button closed it. Set by <code>close(returnValue)</code> and by <code>&lt;form method="dialog"&gt;</code> submitters' <code>value</code>. Canceling (Escape, scrim, close button) leaves it unchanged. https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue</span> |  | <code>string</code> | <code>''</code> |
| <code>type</code><br><span class="gb-desc">The dialog's accessibility role. <code>alert</code> (<code>role="alertdialog"</code>) or <code>dialog</code> (<code>role="dialog"</code>). When empty, basic dialogs are alert dialogs, as the spec asks for on the web, and full-screen dialogs are dialogs.</span> | <code>type</code> | <code>DialogType</code> | <code>''</code> |

#### Slots

| Slot | Description |
| --- | --- |
| default | The supporting text or custom content (lists, form fields). Scrolls between the pinned headline and actions when it overflows. |
| <code>actions</code> | The action buttons, dismissive first and confirming last. Basic: end-aligned below the content. Full-screen: the confirm action at the end of the header. |
| <code>headline</code> | The headline. Labels the dialog (<code>aria-labelledby</code>). |
| <code>icon</code> | An optional hero icon above the headline (basic only). Centers the headline. |

#### Events

| Event | Description |
| --- | --- |
| <code>cancel</code><br><span class="gb-desc">Event</span> | Fired when the dialog is canceled with Escape, a scrim click or the full-screen close button. Cancelable; canceling keeps the dialog open. |
| <code>close</code><br><span class="gb-desc">Event</span> | Fired when the dialog begins closing; <code>returnValue</code> is already set. Cancelable. |
| <code>closed</code><br><span class="gb-desc">Event</span> | Fired when the dialog has closed and animations finished. |
| <code>open</code><br><span class="gb-desc">Event</span> | Fired when the dialog begins opening. Cancelable. |
| <code>opened</code><br><span class="gb-desc">Event</span> | Fired when the dialog has opened and animations finished. |

#### Methods

| Method | Description |
| --- | --- |
| <code>close</code><br><span class="gb-desc">(returnValue?: string, reason?: string) =&gt; Promise&lt;void&gt;</span> | Closes the dialog and fires a cancelable <code>close</code> event, then <code>closed</code> after the exit animation. Focus returns to the element focused before the dialog opened. |
| <code>show</code><br><span class="gb-desc">() =&gt; Promise&lt;void&gt;</span> | Opens the dialog as a modal and fires a cancelable <code>open</code> event, then <code>opened</code> after the enter animation. Focus moves to the first child with an <code>autofocus</code> attribute, else the first focusable element, else the dialog. |

#### CSS parts

| Part | Description |
| --- | --- |
| <code>::part(actions)</code> | The actions container. |
| <code>::part(close-button)</code> | The full-screen close icon button. |
| <code>::part(content)</code> | The content container. |
| <code>::part(header)</code> | The headline region (full-screen: the header bar). |
| <code>::part(headline)</code> | The headline element. |
| <code>::part(icon)</code> | The hero icon container. |
| <code>::part(scroller)</code> | The scroll container of the content. |

#### CSS custom properties

| Property | Description |
| --- | --- |
| <code>--action-focus-label-text-color</code> | Action label text color when focused. |
| <code>--action-hover-label-text-color</code> | Action label text color when hovered. |
| <code>--action-label-text</code> | Action label typography. |
| <code>--action-label-text-axes</code> | Action label typography font variation settings. |
| <code>--action-label-text-color</code> | Action label text color. |
| <code>--action-label-text-tracking</code> | Action label letter spacing. |
| <code>--action-pressed-label-text-color</code> | Action label text color when pressed. |
| <code>--container-color</code> | Container background color. |
| <code>--container-elevation</code> | Container box shadow elevation. |
| <code>--container-shape</code> | Container border radius. |
| <code>--header-action-label-text</code> | Full-screen action label typography. |
| <code>--header-action-label-text-axes</code> | Full-screen action label typography font variation settings. |
| <code>--header-action-label-text-color</code> | Full-screen action label color. |
| <code>--header-action-label-text-tracking</code> | Full-screen action label letter spacing. |
| <code>--header-container-color</code> | Full-screen header color. |
| <code>--header-container-elevation</code> | Full-screen header elevation. |
| <code>--header-container-height</code> | Full-screen header height. |
| <code>--header-headline</code> | Full-screen headline typography. |
| <code>--header-headline-axes</code> | Full-screen headline typography font variation settings. |
| <code>--header-headline-color</code> | Full-screen headline color. |
| <code>--header-headline-tracking</code> | Full-screen headline letter spacing. |
| <code>--header-icon-color</code> | Full-screen close icon color. |
| <code>--header-icon-size</code> | Full-screen close icon size. |
| <code>--header-on-scroll-container-color</code> | Full-screen header color when the content is scrolled. |
| <code>--header-on-scroll-container-elevation</code> | Full-screen header elevation when the content is scrolled. |
| <code>--headline</code> | Headline typography. |
| <code>--headline-axes</code> | Headline typography font variation settings. |
| <code>--headline-color</code> | Headline color. |
| <code>--headline-tracking</code> | Headline letter spacing. |
| <code>--max-width</code> | Basic dialog maximum width. |
| <code>--min-width</code> | Basic dialog minimum width. |
| <code>--scrim-color</code> | Scrim color. |
| <code>--scrim-opacity</code> | Scrim opacity. |
| <code>--supporting-text</code> | Supporting text typography. |
| <code>--supporting-text-axes</code> | Supporting text typography font variation settings. |
| <code>--supporting-text-color</code> | Supporting text color. |
| <code>--supporting-text-tracking</code> | Supporting text letter spacing. |
| <code>--with-icon-icon-color</code> | Hero icon color. |
| <code>--with-icon-icon-size</code> | Hero icon size. |
