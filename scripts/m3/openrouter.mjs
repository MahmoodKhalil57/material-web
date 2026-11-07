/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Minimal client for OpenRouter's alpha Decisions / Extractions APIs, used by
 * spec-checks.mjs. The key comes from `OPENROUTER_API_KEY` only.
 */

const BASE = 'https://openrouter.ai/api/alpha';

export const usage = {cost: 0, inputTokens: 0, calls: 0};

export const hasKey = () => Boolean(process.env.OPENROUTER_API_KEY);

/** A failure that retrying cannot fix (bad key, no credits, bad request). */
export class FatalApiError extends Error {}

/** POSTs `body` to `/<path>`, retrying network errors, 429 and 5xx. */
export async function post(path, body, tries = 6) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new FatalApiError('OPENROUTER_API_KEY is not set');
  let last = '';
  for (let i = 0; i < tries; i++) {
    let res, text;
    try {
      res = await fetch(`${BASE}/${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'X-Title': 'material-web m3 spec-checks',
        },
        body: JSON.stringify(body),
      });
      text = await res.text();
    } catch (err) {
      last = err.message;
      await sleep(2000 * (i + 1));
      continue;
    }
    if (res.ok) {
      const json = JSON.parse(text);
      usage.cost += json.usage?.cost ?? 0;
      usage.inputTokens += json.usage?.input_tokens ?? 0;
      usage.calls++;
      return json;
    }
    last = `${res.status} ${text.slice(0, 300)}`;
    if (res.status < 500 && res.status !== 429) throw new FatalApiError(last);
    await sleep(2000 * (i + 1));
  }
  throw new Error(`gave up: ${last}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
