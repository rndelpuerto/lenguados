/**
 * Boundary tests for the interpolation family endpoint contract.
 *
 * Every interpolation method MUST reproduce its endpoint inputs bit-for-bit:
 * at t === 0 the result equals `a`, at t === 1 the result equals `b`, as
 * IEEE 754 bit-identical stored components (sign-of-zero, denormals, finite,
 * and infinity preserved). NaN propagates per IEEE 754-2019 §6.2. These tests
 * use strict `===` (not tolerance) to assert bit-identity, and exercise the
 * endpoint guards on the non-delegating kernels (slerp, Rotation2.lerp,
 * lerpAngle) plus the adversarial non-finite / extreme-magnitude paths.
 */

import { describe, expect, it } from '@jest/globals';

import {
 lerpAngle,
 lerpAngleClamped,
 smoothStepAngle,
} from '../../src/auxiliary/angle/interpolation';
import { lerp, lerpClamped } from '../../src/auxiliary/scalar/interpolation';
import { Complex } from '../../src/core/complex';
import { Interval } from '../../src/core/interval';
import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

const HUGE = 1e308;
const MAXV = Number.MAX_VALUE;

describe('interpolation endpoint contract — scalar lerp', () => {
 it('lerp reproduces endpoints bit-exact, incl. infinity (t===0 guard is load-bearing)', () => {
  expect(lerp(3, 7, 0)).toBe(3);
  expect(lerp(3, 7, 1)).toBe(7);
  // Infinity at the endpoint: the t===0 guard short-circuits before (b - a) = NaN.
  expect(lerp(Infinity, Infinity, 0)).toBe(Infinity);
  expect(lerp(Infinity, Infinity, 1)).toBe(Infinity);
  // Extreme magnitudes that overflow the naive a + (b - a) * t form.
  expect(lerp(HUGE, -HUGE, 0)).toBe(HUGE);
  expect(lerp(HUGE, -HUGE, 1)).toBe(-HUGE);
  // Signed zero preserved.
  expect(Object.is(lerp(-0, 5, 0), -0)).toBe(true);
 });

 it('lerpClamped reproduces endpoints and clamps', () => {
  expect(lerpClamped(3, 7, 0)).toBe(3);
  expect(lerpClamped(3, 7, 1)).toBe(7);
  expect(lerpClamped(3, 7, -0.5)).toBe(3);
  expect(lerpClamped(3, 7, 1.5)).toBe(7);
 });
});

describe('interpolation endpoint contract — lerpAngle (non-finite NaN bug fix)', () => {
 it('lerpAngle(finite, Infinity, 0) returns the finite start (was NaN before the guard)', () => {
  expect(lerpAngle(0.5, Infinity, 0)).toBe(0.5);
  expect(lerpAngle(0.5, -Infinity, 0)).toBe(0.5);
  expect(lerpAngle(0.5, Number.NaN, 0)).toBe(0.5);
 });

 it('lerpAngle(from, to, 1) returns `to` exactly', () => {
  expect(lerpAngle(0.5, 1.25, 1)).toBe(1.25);
  expect(lerpAngle(-Math.PI, Math.PI, 1)).toBe(Math.PI);
 });

 it('lerpAngle(from, to, 0) returns `from` exactly', () => {
  expect(lerpAngle(-Math.PI, Math.PI, 0)).toBe(-Math.PI);
  expect(lerpAngle(1.25, 0.5, 0)).toBe(1.25);
 });

 it('lerpAngleClamped and smoothStepAngle inherit the endpoint guards', () => {
  expect(lerpAngleClamped(0.5, Infinity, 0)).toBe(0.5);
  expect(lerpAngleClamped(0.5, 1.25, 1)).toBe(1.25);
  expect(smoothStepAngle(0.5, Infinity, 0)).toBe(0.5);
  expect(smoothStepAngle(0.5, 1.25, 1)).toBe(1.25);
 });
});

describe('interpolation endpoint contract — Vector2.slerp (component copy guard)', () => {
 it('static slerp reproduces endpoints bit-exact across drift-prone and extreme inputs', () => {
  const cases: ReadonlyArray<readonly [Vector2, Vector2]> = [
   [new Vector2(1, 2), new Vector2(-3, 4)],
   [new Vector2(HUGE, 0), new Vector2(0, HUGE)],
   [new Vector2(MAXV, MAXV), new Vector2(-MAXV, MAXV)],
  ];
  for (const [a, b] of cases) {
   const at0 = Vector2.slerp(a, b, 0);
   expect(at0.x).toBe(a.x);
   expect(at0.y).toBe(a.y);
   const at1 = Vector2.slerp(a, b, 1);
   expect(at1.x).toBe(b.x);
   expect(at1.y).toBe(b.y);
  }
 });

 it('slerpClamped inherits via saturate(t)', () => {
  const a = new Vector2(1, 2);
  const b = new Vector2(-3, 4);
  expect(Vector2.slerpClamped(a, b, -0.5).x).toBe(a.x);
  expect(Vector2.slerpClamped(a, b, 1.5).x).toBe(b.x);
 });

 it('instance slerp reproduces endpoints bit-exact, incl. this-aliasing', () => {
  const a = new Vector2(1, 2);
  const start = a.clone();
  a.slerp(new Vector2(-3, 4), 0);
  expect(a.x).toBe(start.x);
  expect(a.y).toBe(start.y);
  const b = new Vector2(7, -11);
  const c = new Vector2(1, 2);
  c.slerp(b, 1);
  expect(c.x).toBe(b.x);
  expect(c.y).toBe(b.y);
 });
});

describe('interpolation endpoint contract — Complex.slerp (component copy guard)', () => {
 it('static slerp reproduces endpoints bit-exact', () => {
  const a = Complex.fromValues(1, 2);
  const b = Complex.fromValues(-3, 4);
  const at0 = Complex.slerp(a, b, 0);
  expect(at0.real).toBe(a.real);
  expect(at0.imag).toBe(a.imag);
  const at1 = Complex.slerp(a, b, 1);
  expect(at1.real).toBe(b.real);
  expect(at1.imag).toBe(b.imag);
 });

 it('endpoints exact at extreme magnitude', () => {
  const a = Complex.fromValues(HUGE, 0);
  const b = Complex.fromValues(0, HUGE);
  expect(Complex.slerp(a, b, 0).real).toBe(HUGE);
  expect(Complex.slerp(a, b, 1).imag).toBe(HUGE);
 });
});

describe('interpolation endpoint contract — Rotation2.lerp (direct cos/sin copy, 100% bit-exact)', () => {
 const angles = [0, 0.37, 1.25, -2.1, Math.PI / 4, Math.PI - 1e-9];

 it('static lerp reproduces endpoint cos/sin bit-exact for every sampled rotation', () => {
  for (const aa of angles) {
   for (const ba of angles) {
    const a = Rotation2.fromAngle(aa);
    const b = Rotation2.fromAngle(ba);
    const at0 = Rotation2.lerp(a, b, 0);
    expect(at0.cos).toBe(a.cos);
    expect(at0.sin).toBe(a.sin);
    const at1 = Rotation2.lerp(a, b, 1);
    expect(at1.cos).toBe(b.cos);
    expect(at1.sin).toBe(b.sin);
   }
  }
 });

 it('slerp (alias) and smoothStep inherit endpoint exactness', () => {
  const a = Rotation2.fromAngle(0.37);
  const b = Rotation2.fromAngle(1.25);
  expect(Rotation2.slerp(a, b, 0).cos).toBe(a.cos);
  expect(Rotation2.slerp(a, b, 1).sin).toBe(b.sin);
  expect(Rotation2.smoothStep(a, b, 0).cos).toBe(a.cos);
  expect(Rotation2.smoothStep(a, b, 1).sin).toBe(b.sin);
 });

 it('instance lerp reproduces endpoints bit-exact', () => {
  const a = Rotation2.fromAngle(0.37);
  const aClone = a.clone();
  a.lerp(Rotation2.fromAngle(1.25), 0);
  expect(a.cos).toBe(aClone.cos);
  expect(a.sin).toBe(aClone.sin);
  const c = Rotation2.fromAngle(0.37);
  const b = Rotation2.fromAngle(1.25);
  c.lerp(b, 1);
  expect(c.cos).toBe(b.cos);
  expect(c.sin).toBe(b.sin);
 });

 it('non-unit *Like endpoint input is reproduced verbatim (out-of-contract GIGO, accepted)', () => {
  // ReadonlyRotation2Like is contractually a unit rotation; a non-unit input is
  // out-of-contract. The endpoint guard copies cos/sin verbatim rather than
  // re-normalizing (which is the price of 100% bit-exactness for valid input).
  const nonUnit = { cos: 2, sin: 0 };
  const b = Rotation2.fromAngle(1);
  const at0 = Rotation2.lerp(nonUnit, b, 0);
  expect(at0.cos).toBe(2);
  expect(at0.sin).toBe(0);
 });
});

describe('interpolation endpoint contract — Transform2 (transitive bit-exact endpoints)', () => {
 it('lerp/smoothStep reproduce position, scale (exact) and rotation (exact) at endpoints', () => {
  const a = new Transform2({ x: 1e6, y: -2e6 }, 0.37, { x: 3, y: 5 });
  const b = new Transform2({ x: -4e6, y: 7e6 }, 1.25, { x: 0.5, y: 9 });
  const check = (at0: Transform2, at1: Transform2): void => {
   expect(at0.position.x).toBe(a.position.x);
   expect(at0.position.y).toBe(a.position.y);
   expect(at0.scale.x).toBe(a.scale.x);
   expect(at0.scale.y).toBe(a.scale.y);
   expect(at0.rotation.cos).toBe(a.rotation.cos);
   expect(at0.rotation.sin).toBe(a.rotation.sin);
   expect(at1.position.x).toBe(b.position.x);
   expect(at1.rotation.cos).toBe(b.rotation.cos);
   expect(at1.rotation.sin).toBe(b.rotation.sin);
  };
  check(Transform2.lerp(a, b, 0), Transform2.lerp(a, b, 1));
  check(Transform2.smoothStep(a, b, 0), Transform2.smoothStep(a, b, 1));
 });
});

describe('interpolation endpoint contract — component-wise lifted methods (inherited Tier A)', () => {
 it('Vector2/Complex/Matrix2/Matrix3/Interval lerp reproduce endpoints bit-exact at extreme magnitude', () => {
  const v0 = Vector2.lerp(new Vector2(HUGE, -HUGE), new Vector2(-HUGE, HUGE), 0);
  expect(v0.x).toBe(HUGE);
  expect(v0.y).toBe(-HUGE);

  const c1 = Complex.lerp(Complex.fromValues(HUGE, -HUGE), Complex.fromValues(-HUGE, HUGE), 1);
  expect(c1.real).toBe(-HUGE);
  expect(c1.imag).toBe(HUGE);

  const m2 = Matrix2.lerp(new Matrix2(1, 2, 3, 4), new Matrix2(5, 6, 7, 8), 0);
  expect(m2.m00).toBe(1);
  expect(m2.m11).toBe(4);

  const m3a = new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const m3b = new Matrix3(9, 8, 7, 6, 5, 4, 3, 2, 1);
  const m3 = Matrix3.lerp(m3a, m3b, 1);
  expect(m3.m00).toBe(9);
  expect(m3.m22).toBe(1);

  const iv = Interval.lerp(new Interval(2, 8), new Interval(-3, 50), 0);
  expect(iv.min).toBe(2);
  expect(iv.max).toBe(8);
 });
});
