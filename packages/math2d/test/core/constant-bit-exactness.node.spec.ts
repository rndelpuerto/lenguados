/**
 * @file test/core/constant-bit-exactness.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Bit-exactness contract for frozen constants whose initializers
 * were rewritten to literal-only expressions. Every rewritten component must
 * be IEEE 754 bit-identical (`Object.is`, distinguishing -0 and NaN) to the
 * original defining expression computed at test time.
 */

import { describe, expect, it } from '@jest/globals';

import { PI, SQRT_HALF, TAU, EPSILON } from '../../src/auxiliary/scalar/constants';
import { Interval } from '../../src/core/interval';
import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';

describe('constant bit-exactness (rewritten literal initializers)', () => {
 describe('Rotation2 turn constants match fromAngle exactly', () => {
  const cases: Array<[string, Rotation2, number]> = [
   ['EIGHTH_TURN', Rotation2.EIGHTH_TURN as Rotation2, PI / 4],
   ['TWELFTH_TURN', Rotation2.TWELFTH_TURN as Rotation2, PI / 6],
   ['SIXTEENTH_TURN', Rotation2.SIXTEENTH_TURN as Rotation2, PI / 8],
   ['SIXTH_TURN', Rotation2.SIXTH_TURN as Rotation2, PI / 3],
  ];

  it.each(cases)('%s stores the exact fromAngle bits', (_name, constant, angle) => {
   const reference = Rotation2.fromAngle(angle);
   expect(Object.is(constant.cos, reference.cos)).toBe(true);
   expect(Object.is(constant.sin, reference.sin)).toBe(true);
  });

  it('NEGATIVE_QUARTER keeps reference equality with THREE_QUARTER_TURN', () => {
   expect(Rotation2.NEGATIVE_QUARTER).toBe(Rotation2.THREE_QUARTER_TURN);
  });

  it('THREE_QUARTER_TURN stores the exact (0, -1) pair', () => {
   expect(Object.is(Rotation2.THREE_QUARTER_TURN.cos, 0)).toBe(true);
   expect(Object.is(Rotation2.THREE_QUARTER_TURN.sin, -1)).toBe(true);
  });
 });

 describe('Vector2 constants match their defining expressions exactly', () => {
  it('UNIT_DIAGONAL and NEGATIVE_UNIT_DIAGONAL are ±SQRT_HALF bit-exact', () => {
   expect(Object.is(Vector2.UNIT_DIAGONAL.x, SQRT_HALF)).toBe(true);
   expect(Object.is(Vector2.UNIT_DIAGONAL.y, SQRT_HALF)).toBe(true);
   expect(Object.is(Vector2.NEGATIVE_UNIT_DIAGONAL.x, -SQRT_HALF)).toBe(true);
   expect(Object.is(Vector2.NEGATIVE_UNIT_DIAGONAL.y, -SQRT_HALF)).toBe(true);
  });

  it('POSITIVE_INFINITY and NEGATIVE_INFINITY are the IEEE 754 infinities', () => {
   expect(Object.is(Vector2.POSITIVE_INFINITY.x, Number.POSITIVE_INFINITY)).toBe(true);
   expect(Object.is(Vector2.POSITIVE_INFINITY.y, Number.POSITIVE_INFINITY)).toBe(true);
   expect(Object.is(Vector2.NEGATIVE_INFINITY.x, Number.NEGATIVE_INFINITY)).toBe(true);
   expect(Object.is(Vector2.NEGATIVE_INFINITY.y, Number.NEGATIVE_INFINITY)).toBe(true);
  });
 });

 describe('Interval constants match their defining expressions exactly', () => {
  it('POSITIVE, NEGATIVE, and FULL carry the IEEE 754 infinities', () => {
   expect(Object.is(Interval.POSITIVE.min, 0)).toBe(true);
   expect(Object.is(Interval.POSITIVE.max, Number.POSITIVE_INFINITY)).toBe(true);
   expect(Object.is(Interval.NEGATIVE.min, Number.NEGATIVE_INFINITY)).toBe(true);
   expect(Object.is(Interval.NEGATIVE.max, 0)).toBe(true);
   expect(Object.is(Interval.FULL.min, Number.NEGATIVE_INFINITY)).toBe(true);
   expect(Object.is(Interval.FULL.max, Number.POSITIVE_INFINITY)).toBe(true);
  });

  it('EPSILON_INTERVAL is ±EPSILON bit-exact', () => {
   expect(Object.is(Interval.EPSILON_INTERVAL.min, -EPSILON)).toBe(true);
   expect(Object.is(Interval.EPSILON_INTERVAL.max, EPSILON)).toBe(true);
  });

  it('RADIANS upper bound is TAU bit-exact', () => {
   expect(Object.is(Interval.RADIANS.max, TAU)).toBe(true);
  });
 });
});
