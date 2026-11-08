import{a as o}from"../../../chunks/chunk-UZWBCDJM.js";import{g as r}from"../../../chunks/chunk-BQSOTSTG.js";import{a as i,b as n,m as e}from"../../../chunks/chunk-P365OTTB.js";import"../../../chunks/chunk-HJC7KDR7.js";import"../../../chunks/chunk-GWVCJH35.js";import"../../../chunks/chunk-ROJSORO5.js";import"../../../chunks/chunk-BYSTHSJK.js";import"../../../chunks/chunk-RRSR2DPT.js";import"../../../chunks/chunk-YRNKHAFN.js";describe("reduced motion (central gaps)",()=>{e.reducedMotion.length===0&&it("has no known gaps",()=>{expect(e.reducedMotion).toEqual([])}),afterEach(()=>o({reducedMotion:"no-preference"}));for(let t of e.reducedMotion)it(`${t} has no spatial transitions with reduced motion on`,async()=>{await o({reducedMotion:"reduce"});let{el:a,cleanup:d}=await n(i.find(c=>c.id===t));expect(r(a)).toEqual([]),d()})});
/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
