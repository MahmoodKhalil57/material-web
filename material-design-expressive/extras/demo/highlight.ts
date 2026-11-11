/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A small syntax highlighter for the code of demos: HTML, CSS
 * and JavaScript / TypeScript. It splits code into tokens of a few kinds,
 * which md-gb-demo-code renders as text in spans (never as markup), colored
 * with the M3 color roles.
 */

/** A token kind; `''` is plain text. */
export type TokenKind = '' | 'comment' | 'tag' | 'attr' | 'string' | 'keyword' | 'number' | 'property' | 'punctuation';

/** A run of code of one kind. */
export interface Token {
  kind: TokenKind;
  text: string;
}

/** The languages highlighted (others are plain text). */
export type CodeLanguage = 'html' | 'css' | 'js' | 'ts';

type Rule = [TokenKind, RegExp];

const JS_KEYWORDS =
  'async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|return|set|static|super|switch|this|throw|true|try|type|typeof|undefined|var|void|while|with|yield';

const RULES: Record<CodeLanguage, Rule[]> = {
  html: [
    ['comment', /<!--[\s\S]*?-->/y],
    ['tag', /<\/?[A-Za-z][\w:-]*|\/?>/y],
    ['attr', /(?<=\s)[@.?:]?[A-Za-z_][\w:.-]*(?==)|(?<=<[A-Za-z][^<>]*\s)[@.?:]?[A-Za-z_][\w:.-]*/y],
    ['string', /"[^"]*"|'[^']*'/y],
  ],
  css: [
    ['comment', /\/\*[\s\S]*?\*\//y],
    ['string', /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y],
    ['keyword', /@[\w-]+|!important\b/y],
    ['property', /--?[A-Za-z][\w-]*(?=\s*:)/y],
    ['number', /-?\d*\.?\d+(?:%|[a-z]+)?\b/y],
    ['punctuation', /[{}:;,()]/y],
  ],
  js: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ['string', /`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y],
    ['keyword', new RegExp(`\\b(?:${JS_KEYWORDS})\\b`, 'y')],
    ['number', /\b\d+(?:\.\d+)?\b/y],
    ['punctuation', /[{}()[\];,.=<>!+\-*/%&|?:]+/y],
  ],
  ts: [],
};
RULES.ts = RULES.js;

/** Splits code into tokens; consecutive plain characters are one token. */
export function tokenize(code: string, language: string): Token[] {
  const rules = RULES[language as CodeLanguage];
  if (!rules) return [{kind: '', text: code}];
  const tokens: Token[] = [];
  let plain = '';
  let i = 0;
  outer: while (i < code.length) {
    for (const [kind, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length) {
        if (plain) {
          tokens.push({kind: '', text: plain});
          plain = '';
        }
        tokens.push({kind, text: m[0]});
        i += m[0].length;
        continue outer;
      }
    }
    // A word that no rule starts with stays one plain run (no keyword match
    // inside identifiers such as `classList`).
    const word = /[A-Za-z_$][\w$-]*/y;
    word.lastIndex = i;
    const w = word.exec(code);
    const step = w ? w[0].length : 1;
    plain += code.slice(i, i + step);
    i += step;
  }
  if (plain) tokens.push({kind: '', text: plain});
  return tokens;
}
