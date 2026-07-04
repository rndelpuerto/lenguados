/**
 * @file test/fuzz/parse-fuzz.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Fuzz tests for the parsing utilities (fast-check).
 *
 * Two properties per exported parse function in `utils/parse`:
 * 1. Robustness — an arbitrary string either parses into a valid instance or
 *    throws the documented `Error`; it never surfaces a `TypeError` from an
 *    unguarded internal property access.
 * 2. Round-trip — format-then-parse recovers every finite component within
 *    1e-10 across every supported output format (full-precision round-trips
 *    are exact; the tolerance covers the trigonometric reconstruction paths
 *    of the Rotation2 radians/degrees formats).
 */

import { describe, expect, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Complex } from '../../src/core/complex';
import { Interval } from '../../src/core/interval';
import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';
import {
 formatComplex,
 formatInterval,
 formatMatrix2,
 formatMatrix3,
 formatRotation2,
 formatTransform2,
 formatVector2,
 parseComplex,
 parseInterval,
 parseMatrix2,
 parseMatrix3,
 parseRotation2,
 parseTransform2,
 parseVector2,
} from '../../src/utils/parse';

const NUM_RUNS = 200;
const TOLERANCE = 1e-10;

/** Finite IEEE 754 doubles (includes ±0, subnormals, and extreme magnitudes) */
const arbFinite = fc.double({ noNaN: true, noDefaultInfinity: true });

/** Angles in [-π, π] for rotation construction */
const arbAngle = fc.double({ min: -Math.PI, max: Math.PI, noNaN: true });

/**
 * Strings biased toward parser-relevant tokens (digits, separators, brackets,
 * JSON punctuation, unit suffixes) so the fuzzer explores deep parser paths,
 * mixed with fully arbitrary strings and known-nasty fixed inputs.
 */
const arbNoise = fc.oneof(
 fc.string(),
 fc.string({
  unit: fc.constantFrom(
   '0',
   '1',
   '9',
   '.',
   '-',
   '+',
   'e',
   'E',
   ',',
   ' ',
   '(',
   ')',
   '[',
   ']',
   '{',
   '}',
   '"',
   ':',
   'x',
   'y',
   'i',
   'd',
   'g',
   'm',
   'n',
   's',
   'c',
   'o',
   'r',
   'a',
   'l',
   'u',
  ),
  maxLength: 32,
 }),
 fc.constantFrom(
  '',
  ' ',
  '{}',
  '[]',
  '(,)',
  '1,2,3',
  'deg',
  'i',
  '-i',
  '1e999,0',
  'NaN,NaN',
  'Infinity,-Infinity',
  '--1,2',
  '{"x":null,"y":1}',
  '{"x":"1","y":2}',
  '{"min":5,"max":1}',
  '{"real":"a","imag":2}',
  '{"cos":1,"sin":}',
  '{"p":1,"r":1}',
  '{"p":{"x":1,"y":2},"r":{"cos":1,"sin":0},"s":5}',
  '[[1,"x"],[3,4]]',
  '[[1,2],[3]]',
  '[[null]]',
  '[[1,2,3],[4,5,6],[7,8]]',
 ),
);

/**
 * Asserts a component recovered by a round-trip matches the source component
 *
 * @param actual - Component recovered by format-then-parse
 * @param expected - Original finite component
 */
function expectClose(actual: number, expected: number): void {
 if (actual !== expected) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(TOLERANCE);
 }
}

/* ========================================================================== */
/* Robustness — arbitrary strings never surface a TypeError                    */
/* ========================================================================== */

const parsers: ReadonlyArray<
 readonly [string, (input: string) => object, abstract new () => object]
> = [
 ['parseVector2', (input) => parseVector2(input), Vector2],
 ['parseRotation2', (input) => parseRotation2(input), Rotation2],
 ['parseMatrix2', (input) => parseMatrix2(input), Matrix2],
 ['parseMatrix3', (input) => parseMatrix3(input), Matrix3],
 ['parseTransform2', (input) => parseTransform2(input), Transform2],
 ['parseComplex', (input) => parseComplex(input), Complex],
 ['parseInterval', (input) => parseInterval(input), Interval],
];

describe.each(parsers)('%s (fuzz robustness)', (_name, parse, Type) => {
 it('returns a valid instance or throws the documented Error, never a TypeError', () => {
  fc.assert(
   fc.property(arbNoise, (input) => {
    try {
     return parse(input) instanceof Type;
    } catch (error) {
     // Documented contract: parse failures throw `Error`. A TypeError would
     // indicate an unguarded internal property access on malformed input.
     return error instanceof Error && !(error instanceof TypeError);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });
});

/* ========================================================================== */
/* Round-trip — format-then-parse recovers finite values                       */
/* ========================================================================== */

describe('format → parse round-trips (fuzz)', () => {
 it('formatVector2 → parseVector2 recovers components in every format', () => {
  fc.assert(
   fc.property(arbFinite, arbFinite, (x, y) => {
    const source = new Vector2(x, y);
    for (const format of ['csv', 'space', 'json', 'brackets'] as const) {
     const parsed = parseVector2(formatVector2(source, format));
     expectClose(parsed.x, x);
     expectClose(parsed.y, y);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatRotation2 → parseRotation2 recovers the rotation in every format', () => {
  fc.assert(
   fc.property(arbAngle, (angle) => {
    const source = Rotation2.fromAngle(angle);
    for (const format of ['radians', 'degrees', 'components', 'json'] as const) {
     const parsed = parseRotation2(formatRotation2(source, format));
     expectClose(parsed.cos, source.cos);
     expectClose(parsed.sin, source.sin);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatMatrix2 → parseMatrix2 recovers components in every format', () => {
  fc.assert(
   fc.property(arbFinite, arbFinite, arbFinite, arbFinite, (m00, m01, m10, m11) => {
    const source = new Matrix2(m00, m01, m10, m11);
    for (const format of ['flat', 'nested', 'json'] as const) {
     const parsed = parseMatrix2(formatMatrix2(source, format));
     expectClose(parsed.m00, m00);
     expectClose(parsed.m01, m01);
     expectClose(parsed.m10, m10);
     expectClose(parsed.m11, m11);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatMatrix3 → parseMatrix3 recovers components in every format', () => {
  fc.assert(
   fc.property(fc.array(arbFinite, { minLength: 9, maxLength: 9 }), (cells) => {
    const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = cells as [
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
     number,
    ];
    const source = new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    for (const format of ['flat', 'nested', 'json'] as const) {
     const parsed = parseMatrix3(formatMatrix3(source, format));
     expectClose(parsed.m00, m00);
     expectClose(parsed.m01, m01);
     expectClose(parsed.m02, m02);
     expectClose(parsed.m10, m10);
     expectClose(parsed.m11, m11);
     expectClose(parsed.m12, m12);
     expectClose(parsed.m20, m20);
     expectClose(parsed.m21, m21);
     expectClose(parsed.m22, m22);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatTransform2 → parseTransform2 recovers position, rotation, and scale', () => {
  fc.assert(
   fc.property(arbFinite, arbFinite, arbAngle, arbFinite, arbFinite, (px, py, angle, sx, sy) => {
    const source = new Transform2();
    source.position.set(px, py);
    Rotation2.fromAngle(angle, source.rotation);
    source.scale.set(sx, sy);
    for (const format of ['flat', 'json'] as const) {
     const parsed = parseTransform2(formatTransform2(source, format));
     expectClose(parsed.position.x, px);
     expectClose(parsed.position.y, py);
     expectClose(parsed.rotation.cos, source.rotation.cos);
     expectClose(parsed.rotation.sin, source.rotation.sin);
     expectClose(parsed.scale.x, sx);
     expectClose(parsed.scale.y, sy);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatComplex → parseComplex recovers components in every format', () => {
  fc.assert(
   fc.property(arbFinite, arbFinite, (real, imag) => {
    const source = new Complex(real, imag);
    for (const format of ['math', 'csv', 'json'] as const) {
     const parsed = parseComplex(formatComplex(source, format));
     expectClose(parsed.real, real);
     expectClose(parsed.imag, imag);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });

 it('formatInterval → parseInterval recovers bounds in every format', () => {
  fc.assert(
   fc.property(arbFinite, arbFinite, (a, b) => {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const source = new Interval(min, max);
    for (const format of ['brackets', 'csv', 'json'] as const) {
     const parsed = parseInterval(formatInterval(source, format));
     expectClose(parsed.min, min);
     expectClose(parsed.max, max);
    }
   }),
   { numRuns: NUM_RUNS },
  );
 });
});
