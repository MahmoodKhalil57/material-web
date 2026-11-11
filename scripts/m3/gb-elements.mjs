/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Reads the API of the `md-gb-*` elements from the labs/gb TypeScript sources
 * with the compiler API and the JSDoc of each class: tag, attributes and
 * properties (type, default, reflects, description), slots, events, methods,
 * CSS parts and CSS custom properties. Shared by gen-agent-skill.mjs and
 * gen-api-docs.mjs. See gen-agent-skill.mjs for why this does not use the
 * Custom Elements Manifest.
 */

import {readdirSync} from 'node:fs';
import {basename, dirname, join, relative, resolve, sep} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {elementDirs} from '../element-dirs.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const ROOT = resolve(fileURLToPath(import.meta.url), '../../..');
const GB = resolve(ROOT, 'material-design-expressive');
const posix = (p) => p.split(sep).join('/');

/**
 * Every element with `{dir, tag, file, className, summary, props, methods,
 * slots, events, parts, cssProps}`, sorted by tag.
 */
export function readGbElements() {
  // Every element root: components/ (the M3 index) and extras/.
  const entryFiles = elementDirs(ROOT)
    .flatMap((d) =>
      readdirSync(d.dir)
        .filter((f) => /^md-gb-.*\.ts$/.test(f) && !f.endsWith('.d.ts'))
        .map((f) => join(d.dir, f)),
    )
    .sort();

  const cfgPath = join(ROOT, 'tsconfig.json');
  const cfg = ts.readConfigFile(cfgPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, ROOT);
  const program = ts.createProgram({
    rootNames: [...entryFiles, join(ROOT, 'material-design-expressive/internal/types/css-imports.d.ts')],
    options: {...parsed.options, noEmit: true, skipLibCheck: true},
  });
  const checker = program.getTypeChecker();

  const elements = [];
  for (const file of entryFiles) {
    const source = program.getSourceFile(file);
    // The component folder's name (`button`, `scaffold`), whatever its root.
    const dir = basename(dirname(file));
    ts.forEachChild(source, function visit(node) {
      if (ts.isPropertySignature(node) && node.type && node.name) {
        const tag = node.name.text ?? node.name.getText().replace(/['"]/g, '');
        if (/^md-gb-/.test(tag)) elements.push(describe(dir, tag, node, file));
      }
      ts.forEachChild(node, visit);
    });
  }
  elements.sort((a, b) => a.tag.localeCompare(b.tag));

  function describe(dir, tag, node, file) {
    const type = checker.getTypeFromTypeNode(node.type);
    const symbol = type.getSymbol();
    const classes = classChain(type);
    const own = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
    const summary = firstParagraph(flatten(own?.comment) || classes.map(docText).find(Boolean) || '');
    return {
      dir,
      tag,
      file: posix(relative(ROOT, file)),
      className: symbol?.getName() ?? '',
      // The next class of the chain, when the element extends a labs/gb class.
      superclass: classes[1]?.name?.text ?? '',
      superclassFile: classes[1] ? posix(relative(ROOT, classes[1].getSourceFile().fileName)) : '',
      summary,
      ...collectApi(type, classes),
    };
  }

  /** The class declarations of a type and its base classes, most derived first. */
  function classChain(type) {
    const out = [];
    const seen = new Set();
    (function walk(t) {
      const sym = t.getSymbol();
      for (const d of sym?.declarations ?? []) {
        if (ts.isClassDeclaration(d) && !seen.has(d) && !isLibrary(d.getSourceFile())) {
          seen.add(d);
          out.push(d);
        }
      }
      if (sym && sym.flags & (ts.SymbolFlags.Class | ts.SymbolFlags.Interface)) {
        for (const base of checker.getBaseTypes(t)) walk(base);
      }
    })(type);
    return out;
  }

  function isLibrary(sf) {
    return program.isSourceFileDefaultLibrary(sf) || /node_modules/.test(sf.fileName);
  }

  function docText(decl) {
    const doc = ts.getJSDocCommentsAndTags(decl).find(ts.isJSDoc);
    return doc ? flatten(doc.comment) : '';
  }

  function flatten(comment) {
    if (!comment) return '';
    if (typeof comment === 'string') return comment;
    return comment.map((c) => c.text ?? '').join('');
  }

  function firstParagraph(text) {
    return clean(text.split(/\n\s*\n/)[0] ?? '');
  }

  function clean(text) {
    return text
      .replace(/\{@link\s+(?:[^|}\s]+\s*\|?\s*)?([^}]*)\}/g, '$1')
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function collectApi(type, classes) {
    const slots = new Map();
    const events = new Map();
    const parts = new Map();
    const cssProps = new Map();
    for (const decl of [...classes].reverse()) {
      for (const tag of ts.getJSDocTags(decl)) {
        const name = tag.tagName.text;
        const text = clean(flatten(tag.comment));
        if (name === 'slot') {
          const m = text.match(/^(?:(\S+)\s+-\s*|-\s*)?(.*)$/);
          slots.set(m[1] ?? '', m[2]);
        } else if (name === 'fires' || name === 'event') {
          // The type may contain braces (`{CustomEvent<{reason: string}>}`).
          let evType = 'Event';
          let rest = text;
          if (rest.startsWith('{')) {
            let depth = 0;
            let end = 0;
            for (; end < rest.length; end++) {
              if (rest[end] === '{') depth++;
              else if (rest[end] === '}' && --depth === 0) break;
            }
            evType = rest.slice(1, end);
            rest = rest.slice(end + 1).trim();
          }
          const m = rest.match(/^(\S+)\s*(?:-\s*)?(.*)$/);
          if (m) events.set(m[1], {type: evType, description: m[2]});
        } else if (name === 'csspart') {
          const m = text.match(/^(\S+)\s*(?:-\s*)?(.*)$/);
          if (m) parts.set(m[1], m[2]);
        } else if (name === 'cssprop' || name === 'cssproperty') {
          const m = text.match(/^(\S+)\s*(?:-\s*)?(.*)$/);
          if (m) cssProps.set(m[1], m[2]);
        }
      }
    }
    const props = [];
    const methods = [];
    for (const sym of checker.getPropertiesOfType(type)) {
      const name = sym.getName();
      if (name.startsWith('_') || name.startsWith('#')) continue;
      const decls = sym.declarations ?? [];
      if (!decls.length || decls.every((d) => isLibrary(d.getSourceFile()))) continue;
      const flags = decls.map((d) => ts.getCombinedModifierFlags(d));
      if (flags.some((f) => f & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected))) continue;
      if (flags.some((f) => f & ts.ModifierFlags.Static)) continue;
      const reactive = decls.map(propertyDecorator).find(Boolean);
      const doc = clean(ts.displayPartsToString(sym.getDocumentationComment(checker)));
      if (reactive) {
        const primary = decls.find((d) => ts.isPropertyDeclaration(d) && d.initializer);
        const propType = checker.typeToString(
          checker.getTypeOfSymbolAtLocation(sym, decls[0]),
          undefined,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        );
        props.push({
          name,
          attribute: reactive.attribute === false ? '' : (reactive.attribute ?? name.toLowerCase()),
          reflect: !!reactive.reflect,
          type: propType,
          default: primary ? primary.initializer.getText().replace(/\s+/g, ' ') : '',
          description: doc,
        });
      } else if (decls.some((d) => ts.isMethodDeclaration(d)) && !isFrameworkFile(decls[0])) {
        methods.push({
          name,
          signature: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(sym, decls[0]),
            undefined,
            ts.TypeFormatFlags.NoTruncation,
          ),
          description: doc,
        });
      }
    }
    props.sort((a, b) => a.name.localeCompare(b.name));
    methods.sort((a, b) => a.name.localeCompare(b.name));
    const sorted = (m) => [...m].sort(([a], [b]) => a.localeCompare(b));
    return {
      props,
      methods,
      slots: sorted(slots),
      events: sorted(events),
      parts: sorted(parts),
      cssProps: sorted(cssProps),
    };
  }

  /** Methods of Lit and the mixins' plumbing are not part of the usage API. */
  function isFrameworkFile(decl) {
    const file = decl.getSourceFile().fileName;
    // internal/ (but not a styles/x/internal/ folder), and the ARIA mixins
    // that moved from internal/aria to foundations/accessibility/aria.
    if (/[\\/]internal[\\/]/.test(file) && !/(^|[\\/])(components|extras|styles)[\\/]/.test(file)) return true;
    if (/[\\/]foundations[\\/]accessibility[\\/]aria[\\/](aria|delegate)\.(ts|d\.ts)$/.test(file)) return true;
    return /[\\/]lit[\\/]|reactive-element/.test(file);
  }

  /** The options of a `@property(...)` decorator on a declaration, or undefined. */
  function propertyDecorator(decl) {
    for (const dec of ts.canHaveDecorators(decl) ? (ts.getDecorators(decl) ?? []) : []) {
      const call = dec.expression;
      const name = ts.isCallExpression(call) ? call.expression.getText() : call.getText();
      if (name !== 'property') continue;
      const opts = {};
      const arg = ts.isCallExpression(call) ? call.arguments[0] : undefined;
      if (arg && ts.isObjectLiteralExpression(arg)) {
        for (const p of arg.properties) {
          if (!ts.isPropertyAssignment(p)) continue;
          const key = p.name.getText();
          if (key === 'attribute') opts.attribute = p.initializer.kind === ts.SyntaxKind.FalseKeyword ? false : p.initializer.text;
          else if (key === 'reflect') opts.reflect = p.initializer.kind === ts.SyntaxKind.TrueKeyword;
        }
      }
      return opts;
    }
    return undefined;
  }

  return elements;
}
