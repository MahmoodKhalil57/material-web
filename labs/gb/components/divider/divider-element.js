/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import dividerStyles from './divider.css.js'; // github-only
// import {styles as dividerStyles} from './divider.cssresult.js'; // google3-only
import { divider } from './divider.js';
/**
 * A Material Design divider component.
 *
 * @csspart divider - The divider element.
 * @cssprop --color
 * @cssprop --thickness
 * @cssprop --inset-leading-space
 * @cssprop --inset-trailing-space
 */
export class DividerElement extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * Whether or not the divider is vertical.
         */
        this.vertical = false;
        /** Indents both ends 16dp (spec: middle-inset divider). */
        this.inset = false;
        /** Indents the leading end 16dp (spec: inset divider). */
        this.insetStart = false;
        /** Indents the trailing end 16dp. */
        this.insetEnd = false;
    }
    render() {
        return html `<div part="divider" class="${divider(this)}"></div>`;
    }
}
/** @nocollapse */
DividerElement.styles = [
    dividerStyles,
    css `
      :host {
        display: flex;
      }
      .divider {
        flex: 1;
      }
      :host(:not([vertical])) {
        width: 100%;
      }
      :host([vertical]) {
        min-height: 100%;
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true })
], DividerElement.prototype, "vertical", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], DividerElement.prototype, "inset", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'inset-start' })
], DividerElement.prototype, "insetStart", void 0);
__decorate([
    property({ type: Boolean, reflect: true, attribute: 'inset-end' })
], DividerElement.prototype, "insetEnd", void 0);
//# sourceMappingURL=divider-element.js.map