# dialog

Elements: `md-gb-dialog`.

## Usage rules

Behavior the component implements or expects the app to follow (summarized from the project checklist).

- **Dialogs**
  - Basic (hero icon, scroll dividers)
  - Full-screen

## API

### `<md-gb-dialog>`

A Material Design dialog component.

Source: `material-design-expressive/components/dialog/md-gb-dialog.ts`  
Import: `import '@material/web/components/dialog/md-gb-dialog.js';`

Attributes and properties

| Property | Attribute | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `alwaysFullScreen` | `always-full-screen` (reflects) | `boolean` | `false` | Full-screen dialogs are for compact windows only (dialogs.md: use a basic dialog at medium and expanded). So `full-screen` applies at compact windows and the dialog is a basic dialog above, with the same slots. The host gets `adaptive-basic` while it falls back. Set `always-full-screen` to keep the full-screen variant at every window size. |
| `closeLabel` | `close-label` | `string` | `'Close'` | Accessible label of the full-screen close icon button. |
| `fullScreen` | `full-screen` (reflects) | `boolean` | `false` | Uses the full-screen variant: the dialog fills the window, with a header holding a close icon button, the headline and the confirm action. Meant for compact windows; use a basic dialog at larger breakpoints. |
| `noFocusTrap` | `no-focus-trap` | `boolean` | `false` | Turns off focus trapping, which keeps Tab and Shift+Tab cycling inside the dialog. Trapping is recommended for accessibility. |
| `open` | `open` (reflects) | `boolean` |  | Opens the dialog when set to `true` and closes it when set to `false`. |
| `quick` | `quick` (reflects) | `boolean` | `false` | Skips the opening and closing animations. |
| `returnValue` | property only | `string` | `''` | The dialog's return value, usually which button closed it. Set by `close(returnValue)` and by `<form method="dialog">` submitters' `value`. Canceling (Escape, scrim, close button) leaves it unchanged. https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue |
| `type` | `type` | `"" \| "alert" \| "dialog"` | `''` | The dialog's accessibility role. `alert` (`role="alertdialog"`) or `dialog` (`role="dialog"`). When empty, basic dialogs are alert dialogs, as the spec asks for on the web, and full-screen dialogs are dialogs. |

Slots

- default slot: The supporting text or custom content (lists, form fields). Scrolls between the pinned headline and actions when it overflows.
- `actions`: The action buttons, dismissive first and confirming last. Basic: end-aligned below the content. Full-screen: the confirm action at the end of the header.
- `headline`: The headline. Labels the dialog (`aria-labelledby`).
- `icon`: An optional hero icon above the headline (basic only). Centers the headline.

Events

- `cancel` (`Event`): Fired when the dialog is canceled with Escape, a scrim click or the full-screen close button. Cancelable; canceling keeps the dialog open.
- `close` (`Event`): Fired when the dialog begins closing; `returnValue` is already set. Cancelable.
- `closed` (`Event`): Fired when the dialog has closed and animations finished.
- `open` (`Event`): Fired when the dialog begins opening. Cancelable.
- `opened` (`Event`): Fired when the dialog has opened and animations finished.

Methods

- `close`: `(returnValue?: string, reason?: string) => Promise<void>` Closes the dialog and fires a cancelable `close` event, then `closed` after the exit animation. Focus returns to the element focused before the dialog opened.
- `connectedCallback`: `() => void` Invoked when the component is added to the document's DOM. In `connectedCallback()` you should setup tasks that should only occur when the element is connected to the document. The most common of these is adding event listeners to nodes external to the element, like a keydown event handler added to the window. ```ts connectedCallback() { super.connectedCallback(); addEventListener('keydown', this._handleKeydown); } ``` Typically, anything done in `connectedCallback()` should be undone when the element is disconnected, in `disconnectedCallback()`.
- `show`: `() => Promise<void>` Opens the dialog as a modal and fires a cancelable `open` event, then `opened` after the enter animation. Focus moves to the first child with an `autofocus` attribute, else the first focusable element, else the dialog.

CSS parts

- `::part(actions)`: The actions container.
- `::part(close-button)`: The full-screen close icon button.
- `::part(content)`: The content container.
- `::part(header)`: The headline region (full-screen: the header bar).
- `::part(headline)`: The headline element.
- `::part(icon)`: The hero icon container.
- `::part(scroller)`: The scroll container of the content.

CSS custom properties

- `--action-focus-label-text-color`: Action label text color when focused.
- `--action-hover-label-text-color`: Action label text color when hovered.
- `--action-label-text`: Action label typography.
- `--action-label-text-axes`: Action label typography font variation settings.
- `--action-label-text-color`: Action label text color.
- `--action-label-text-tracking`: Action label letter spacing.
- `--action-pressed-label-text-color`: Action label text color when pressed.
- `--container-color`: Container background color.
- `--container-elevation`: Container box shadow elevation.
- `--container-shape`: Container border radius.
- `--header-action-label-text`: Full-screen action label typography.
- `--header-action-label-text-axes`: Full-screen action label typography font variation settings.
- `--header-action-label-text-color`: Full-screen action label color.
- `--header-action-label-text-tracking`: Full-screen action label letter spacing.
- `--header-container-color`: Full-screen header color.
- `--header-container-elevation`: Full-screen header elevation.
- `--header-container-height`: Full-screen header height.
- `--header-headline`: Full-screen headline typography.
- `--header-headline-axes`: Full-screen headline typography font variation settings.
- `--header-headline-color`: Full-screen headline color.
- `--header-headline-tracking`: Full-screen headline letter spacing.
- `--header-icon-color`: Full-screen close icon color.
- `--header-icon-size`: Full-screen close icon size.
- `--header-on-scroll-container-color`: Full-screen header color when the content is scrolled.
- `--header-on-scroll-container-elevation`: Full-screen header elevation when the content is scrolled.
- `--headline`: Headline typography.
- `--headline-axes`: Headline typography font variation settings.
- `--headline-color`: Headline color.
- `--headline-tracking`: Headline letter spacing.
- `--max-width`: Basic dialog maximum width.
- `--min-width`: Basic dialog minimum width.
- `--scrim-color`: Scrim color.
- `--scrim-opacity`: Scrim opacity.
- `--supporting-text`: Supporting text typography.
- `--supporting-text-axes`: Supporting text typography font variation settings.
- `--supporting-text-color`: Supporting text color.
- `--supporting-text-tracking`: Supporting text letter spacing.
- `--with-icon-icon-color`: Hero icon color.
- `--with-icon-icon-size`: Hero icon size.
