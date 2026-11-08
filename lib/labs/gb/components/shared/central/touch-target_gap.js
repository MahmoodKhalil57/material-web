import{a as n,b as o,m as t,o as i}from"../../../chunks/chunk-JMQNHKRZ.js";import"../../../chunks/chunk-HJC7KDR7.js";import"../../../chunks/chunk-GWVCJH35.js";import"../../../chunks/chunk-ROJSORO5.js";import"../../../chunks/chunk-BYSTHSJK.js";import"../../../chunks/chunk-RRSR2DPT.js";import"../../../chunks/chunk-YRNKHAFN.js";describe("touch targets (central gaps)",()=>{t.touchTarget.length===0&&it("has no known gaps",()=>{expect(t.touchTarget).toEqual([])});for(let s of t.touchTarget){let[r,e]=s.split("@"),h=n.find(a=>a.id===r);it(`${r} keeps a 48x48 target at density ${e}`,async()=>{let{el:a,cleanup:g}=await o(h,e==="0"?{}:{density:e}),c=i(a);expect(c.width).toBeGreaterThanOrEqual(48),expect(c.height).toBeGreaterThanOrEqual(48),g()})}});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
