import{e as i}from"../../../chunks/chunk-BQSOTSTG.js";import{a,b as s,m as t}from"../../../chunks/chunk-JMQNHKRZ.js";import"../../../chunks/chunk-HJC7KDR7.js";import"../../../chunks/chunk-GWVCJH35.js";import"../../../chunks/chunk-ROJSORO5.js";import"../../../chunks/chunk-BYSTHSJK.js";import"../../../chunks/chunk-RRSR2DPT.js";import"../../../chunks/chunk-YRNKHAFN.js";describe("disabled (central gaps)",()=>{t.disabledContent.length===0&&it("has no known gaps",()=>{expect(t.disabledContent).toEqual([])});for(let n of t.disabledContent)it(`${n}: shows its text content at 38% opacity when disabled`,async()=>{let{el:d,cleanup:l}=await s(a.find(e=>e.id===n),{disabled:!0}),o=i(d);expect(o.length).toBeGreaterThan(0);for(let e of o)expect(e).toBeCloseTo(.38,2);l()})});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
