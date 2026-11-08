var s={DISMISS:"dismiss",SCRIM:"scrim",ESCAPE:"escape",BACK:"back",SWIPE:"swipe",DRAG_HANDLE:"drag-handle",CLOSE_BUTTON:"close-button"};function E(e,c,o){e.addEventListener("keydown",t=>{if(t.key!=="Escape"||t.defaultPrevented||!c())return;let n=e;if(t.preventDefault(),typeof n.close=="function"&&!(n instanceof HTMLDialogElement)){n.close(s.ESCAPE);return}e.dispatchEvent(new CustomEvent("close",{bubbles:!0,cancelable:!0,detail:{reason:s.ESCAPE}}))},o)}export{s as a,E as b};
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
