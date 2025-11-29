import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Quaternion2 } from '../../src/core/quaternion2';

const DIGITS = 6;

describe('Quaternion2', () => {
 describe('Factories', () => {
  it('fromAngle matches deterministic trig', () => {
   const q = Quaternion2.fromAngle(Math.PI / 2);
   expect(q.w).toBeCloseTo(Math.cos(Math.PI / 4), DIGITS);
   expect(q.z).toBeCloseTo(Math.sin(Math.PI / 4), DIGITS);
  });

  it('fromComplex converts via angle', () => {
   const complex = Complex.fromPolar(1, Math.PI / 3);
   const q = Quaternion2.fromComplex(complex);
   expect(q.angle()).toBeCloseTo(Math.PI / 3, DIGITS);
  });
 });

 describe('Operations', () => {
  it('multiply composes rotations', () => {
   const a = Quaternion2.fromAngle(Math.PI / 4);
   const b = Quaternion2.fromAngle(Math.PI / 4);
   const c = a.multiply(b);
   expect(c.angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('inverse equals conjugate for unit quaternions', () => {
   const q = Quaternion2.fromAngle(Math.PI / 3);
   const inverse = q.inverse();
   const product = q.multiply(inverse);
   expect(product.isIdentity()).toBe(true);
  });

  it('inverse handles non-unit quaternions', () => {
   const q = Quaternion2.fromAngle(Math.PI / 3).set(2, 0);
   const inverse = q.inverse();
   const product = q.multiply(inverse);
   expect(product.isIdentity()).toBe(true);
  });
 });

 describe('Interpolation', () => {
  it('slerp blends shortest path', () => {
   const start = Quaternion2.fromAngle(0);
   const end = Quaternion2.fromAngle(Math.PI);
   const mid = start.slerp(end, 0.5);
   expect(mid.angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('slerp clamps t to [0, 1]', () => {
   const start = Quaternion2.fromAngle(0);
   const end = Quaternion2.fromAngle(Math.PI / 2);
   expect(start.slerp(end, -1).angle()).toBeCloseTo(0, DIGITS);
   expect(start.slerp(end, 2).angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });
});
