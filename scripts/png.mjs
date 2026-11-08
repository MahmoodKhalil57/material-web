/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// A minimal PNG reader and writer (Node's zlib, no dependencies) for the
// screenshots of the catalog scripts: 8-bit RGB or RGBA, not interlaced,
// which is what Chromium writes.

import {crc32, deflateSync, inflateSync} from 'node:zlib';

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * Decodes a PNG.
 * @param {Buffer} file
 * @return {{width: number, height: number, data: Uint8Array}} RGBA pixels.
 */
export function readPng(file) {
  if (!file.subarray(0, 8).equals(SIGNATURE)) throw new Error('not a PNG');
  let width = 0;
  let height = 0;
  let channels = 0;
  const idat = [];
  for (let at = 8; at < file.length; ) {
    const length = file.readUInt32BE(at);
    const type = file.toString('latin1', at + 4, at + 8);
    const body = file.subarray(at + 8, at + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      const [depth, color, , , interlace] = body.subarray(8, 13);
      channels = {2: 3, 6: 4}[color];
      if (depth !== 8 || !channels || interlace) {
        throw new Error(`unsupported PNG (depth ${depth}, color ${color}, interlace ${interlace})`);
      }
    } else if (type === 'IDAT') {
      idat.push(body);
    } else if (type === 'IEND') {
      break;
    }
    at += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const rows = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const out = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? rows[out + x - channels] : 0;
      const b = y ? rows[out - stride + x] : 0;
      const c = x >= channels && y ? rows[out - stride + x - channels] : 0;
      let value = raw[src + x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      rows[out + x] = value;
    }
  }
  if (channels === 4) return {width, height, data: rows};
  const data = new Uint8Array(width * height * 4);
  for (let i = 0, j = 0; i < rows.length; i += 3, j += 4) {
    data[j] = rows[i];
    data[j + 1] = rows[i + 1];
    data[j + 2] = rows[i + 2];
    data[j + 3] = 255;
  }
  return {width, height, data};
}

function chunk(type, body) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])));
  return Buffer.concat([head, body, crc]);
}

/**
 * Encodes RGBA pixels as a PNG.
 * @param {{width: number, height: number, data: Uint8Array}} image
 * @return {Buffer}
 */
export function writePng({width, height, data}) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    raw.set(data.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    SIGNATURE,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
