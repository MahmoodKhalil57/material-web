/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { noChange, nothing } from 'lit';
import { type AttributePart, Directive, type DirectiveParameters, type PartInfo } from 'lit/directive.js';
/**
 * A Lit directive that sanitizes URLs for href attributes and properties.
 */
export declare class SafeHrefDirective extends Directive {
    constructor(partInfo: PartInfo);
    render(value?: string | null | undefined | typeof nothing): string | typeof nothing;
    update(part: AttributePart, [value]: DirectiveParameters<SafeHrefDirective>): typeof noChange | typeof nothing;
}
/**
 * A Lit directive that sanitizes URLs for `href` attribute and property
 * bindings.
 *
 * @param value The URL value to sanitize.
 * @return A directive result that renders the sanitized URL or `nothing`.
 */
export declare const safeHref: (value?: string | typeof nothing) => import("lit-html/directive.js").DirectiveResult<typeof SafeHrefDirective>;
