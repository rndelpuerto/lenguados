/**
 * @file test/validation/shape-keys.node.spec.ts
 * @module @lenguados/math2d/validation
 * @description Tests for the V10 DRY refactor of the `assert*Like` family —
 * verifies the shared `validateShape` helper path, the per-key error-message
 * format, and the preserved bespoke path for `assertTransform2Like`.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from '@jest/globals';

import {
 assertComplexLike,
 assertIntervalLike,
 assertMatrix2Like,
 assertMatrix3Like,
 assertRotation2Like,
 assertTransform2Like,
 assertVector2Like,
} from '../../src/validation/assert';

const __filename = fileURLToPath(import.meta.url);
const assertSource = readFileSync(resolve(__filename, '../../../src/validation/assert.ts'), 'utf8');

/**
 * Extract the brace-balanced body (from the first `{` after the declaration
 * to the matching `}`) of the named exported function from the assert.ts source.
 * Used by regression guards that verify internal routing without executing code.
 *
 * @param source - Full source text of the module to scan
 * @param exportName - Name of the exported function whose body to extract
 * @returns The substring from the opening `{` to the matching `}` inclusive
 */
function extractFunctionBody(source: string, exportName: string): string {
 const start = source.indexOf(`export function ${exportName}`);
 if (start === -1) throw new Error(`extractFunctionBody: "${exportName}" not found`);
 const bodyOpen = source.indexOf('{', start);
 let depth = 0;
 let bodyClose = -1;
 for (let index = bodyOpen; index < source.length; index++) {
  if (source[index] === '{') depth++;
  else if (source[index] === '}') {
   depth--;
   if (depth === 0) {
    bodyClose = index;
    break;
   }
  }
 }
 if (bodyClose === -1)
  throw new Error(`extractFunctionBody: unbalanced braces for "${exportName}"`);
 return source.slice(bodyOpen, bodyClose + 1);
}

describe('validation/assert — V10 shape-keys DRY refactor', () => {
 describe('validateShape per-key error-message format (D-4 unification)', () => {
  it('assertVector2Like throws per-key on NaN x', () => {
   expect(() => assertVector2Like({ x: NaN, y: 1 })).toThrow(/value\.x must be a finite number/);
  });

  it('assertVector2Like throws per-key on NaN y', () => {
   expect(() => assertVector2Like({ x: 1, y: NaN })).toThrow(/value\.y must be a finite number/);
  });

  it('assertRotation2Like throws per-key on non-finite cos', () => {
   expect(() => assertRotation2Like({ cos: Infinity, sin: 0 })).toThrow(
    /value\.cos must be a finite number/,
   );
  });

  it('assertComplexLike throws per-key on non-finite imag', () => {
   expect(() => assertComplexLike({ real: 1, imag: NaN })).toThrow(
    /value\.imag must be a finite number/,
   );
  });

  it('assertMatrix2Like throws per-key on non-finite m10 (existing V9 behaviour preserved)', () => {
   expect(() => assertMatrix2Like({ m00: 1, m01: 0, m10: NaN, m11: 1 })).toThrow(
    /value\.m10 must be a finite number/,
   );
  });

  it('assertMatrix3Like throws per-key on non-finite m22', () => {
   const m = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: Infinity };
   expect(() => assertMatrix3Like(m)).toThrow(/value\.m22 must be a finite number/);
  });

  it('assertIntervalLike throws per-key on non-finite min before reaching invariant check', () => {
   // finite check runs first — invariant (min > max) never fires
   expect(() => assertIntervalLike({ min: NaN, max: 10 })).toThrow(
    /value\.min must be a finite number/,
   );
  });

  it('custom name label propagates to error message', () => {
   expect(() => assertVector2Like({ x: 1, y: NaN }, 'velocity')).toThrow(
    /velocity\.y must be a finite number/,
   );
  });
 });

 describe('type-guard failure path', () => {
  it('assertVector2Like throws TypeError when value is not object-like', () => {
   expect(() => assertVector2Like(null)).toThrow(TypeError);
   expect(() => assertVector2Like(null)).toThrow(/Expected Vector2Like for value, got object/);
  });

  it('assertMatrix3Like throws TypeError on wrong shape', () => {
   expect(() => assertMatrix3Like({ x: 1, y: 2 })).toThrow(TypeError);
  });

  it('assertRotation2Like respects custom name in TypeError message', () => {
   expect(() => assertRotation2Like('string' as unknown, 'input')).toThrow(
    /Expected Rotation2Like for input, got string/,
   );
  });
 });

 describe('assertIntervalLike preserves the invariant path and its error-message format', () => {
  it('rejects min > max with pre-V10 message format (Error, not RangeError)', () => {
   let caught: unknown;
   try {
    assertIntervalLike({ min: 5, max: 3 });
   } catch (error) {
    caught = error;
   }
   expect(caught).toBeInstanceOf(Error);
   expect(caught).not.toBeInstanceOf(TypeError);
   // RangeError is a subclass of Error — ensure the pre-V10 plain Error is preserved.
   expect(caught instanceof RangeError).toBe(false);
   expect((caught as Error).message).toBe('[math2d] value.min (5) must not exceed value.max (3)');
  });

  it('accepts valid interval', () => {
   expect(() => assertIntervalLike({ min: 0, max: 10 })).not.toThrow();
  });
 });

 describe('assertTransform2Like remains bespoke (no validateShape routing)', () => {
  it('accepts valid Transform2-like input', () => {
   const t = {
    position: { x: 1, y: 2 },
    rotation: { cos: 1, sin: 0 },
    scale: { x: 1, y: 1 },
   };
   expect(() => assertTransform2Like(t)).not.toThrow();
  });

  it('rejects non-finite nested scalars with pre-V10 message format (conjoined)', () => {
   const t = {
    position: { x: NaN, y: 2 },
    rotation: { cos: 1, sin: 0 },
    scale: { x: 1, y: 1 },
   };
   expect(() => assertTransform2Like(t)).toThrow(/position\.x and \.y must be finite numbers/);
  });

  it('source body does NOT contain a call to validateShape (regression guard)', () => {
   const body = extractFunctionBody(assertSource, 'assertTransform2Like');
   expect(body).not.toContain('validateShape(');
  });
 });

 describe('6 flat-shape asserts route through validateShape (regression guard)', () => {
  it('5 pure one-liners + 1 partial route call validateShape', () => {
   const names = [
    'assertVector2Like',
    'assertRotation2Like',
    'assertMatrix2Like',
    'assertMatrix3Like',
    'assertComplexLike',
    'assertIntervalLike',
   ];
   for (const name of names) {
    const body = extractFunctionBody(assertSource, name);
    expect(body).toContain('validateShape(');
   }
  });

  it('assertIntervalLike has both validateShape call AND the min > max invariant check', () => {
   const body = extractFunctionBody(assertSource, 'assertIntervalLike');
   expect(body).toContain('validateShape(');
   expect(body).toContain('must not exceed');
  });
 });

 describe('KEYS constants + validateShape helper are internal (no barrel leak)', () => {
  it('main barrel does not export validateShape or *_KEYS', () => {
   const barrelSource = readFileSync(resolve(__filename, '../../../src/index.ts'), 'utf8');
   expect(barrelSource).not.toContain('validateShape');
   expect(barrelSource).not.toContain('VECTOR2_KEYS');
   expect(barrelSource).not.toContain('ROTATION2_KEYS');
   expect(barrelSource).not.toContain('COMPLEX_KEYS');
   expect(barrelSource).not.toContain('INTERVAL_KEYS');
   expect(barrelSource).not.toContain('MATRIX2_KEYS');
   expect(barrelSource).not.toContain('MATRIX3_KEYS');
  });

  it('no TRANSFORM2_KEYS constant anywhere in src/ (intentionally absent — nested shape)', () => {
   // Grep-equivalent: assertSource already covers validation/assert.ts; confirm
   // the constant is not declared there. The project file layout prevents it
   // from existing anywhere else (shapes.ts is a re-export shim; no other file
   // would host a shape-key constant).
   expect(assertSource).not.toContain('TRANSFORM2_KEYS');
  });

  it('validation/shapes subpath does not export validateShape or *_KEYS', () => {
   const shapesSource = readFileSync(
    resolve(__filename, '../../../src/validation/shapes.ts'),
    'utf8',
   );
   expect(shapesSource).not.toContain('validateShape');
   expect(shapesSource).not.toContain('VECTOR2_KEYS');
   expect(shapesSource).not.toContain('ROTATION2_KEYS');
   expect(shapesSource).not.toContain('COMPLEX_KEYS');
   expect(shapesSource).not.toContain('INTERVAL_KEYS');
   expect(shapesSource).not.toContain('MATRIX2_KEYS');
   expect(shapesSource).not.toContain('MATRIX3_KEYS');
  });
 });
});
