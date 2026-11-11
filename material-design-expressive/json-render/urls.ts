/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview URL checks for spec props that become `href` and `src`, so a
 * spec (from a model) can't run script through a URL.
 */

/** What an unsafe URL becomes (as safevalues does). */
export const INNOCUOUS_URL = 'about:invalid#zClosurez';

const scheme = (url: string) => /^\s*([a-z][a-z0-9+.-]*):/i.exec(url)?.[1]?.toLowerCase();

/** A link target: http(s), mailto, tel, or relative; anything else is replaced. */
export function safeHref(url: string): string {
  const s = scheme(url);
  return !s || s === 'http' || s === 'https' || s === 'mailto' || s === 'tel' ? url : INNOCUOUS_URL;
}

/** Whether a URL is safe for `src`: http(s), data images, or relative. */
export function isSafeSrc(url: string): boolean {
  const s = scheme(url);
  return !s || s === 'http' || s === 'https' || /^\s*data:image\//i.test(url);
}
