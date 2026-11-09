/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { noChange, nothing } from 'lit';
import { directive, Directive, PartType, } from 'lit/directive.js';
import { setAnchorHref } from 'safevalues/dom';
/**
 * A Lit directive that sanitizes URLs for href attributes and properties.
 */
export class SafeHrefDirective extends Directive {
    constructor(partInfo) {
        super(partInfo);
        if (partInfo.type !== PartType.ATTRIBUTE &&
            partInfo.type !== PartType.PROPERTY) {
            throw new Error('safeHref can only be used on attribute or property bindings');
        }
        if (partInfo.name !== 'href') {
            throw new Error('safeHref() directive can only be used on "href" attribute or property bindings.');
        }
    }
    render(value) {
        return value || nothing;
    }
    update(part, [value]) {
        const element = part.element;
        element.removeAttribute('href');
        if (!value || value === nothing) {
            return nothing;
        }
        setAnchorHref(element, value);
        return noChange;
    }
}
/**
 * A Lit directive that sanitizes URLs for `href` attribute and property
 * bindings.
 *
 * @param value The URL value to sanitize.
 * @return A directive result that renders the sanitized URL or `nothing`.
 */
export const safeHref = directive(SafeHrefDirective);
//# sourceMappingURL=safe-href.js.map