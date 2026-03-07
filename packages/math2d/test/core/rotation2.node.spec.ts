/**
 * @file test/core/rotation2.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Tests for Rotation2 core behavior.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Matrix2 } from '../../src/core/matrix2';
import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';

const DEG45 = Math.PI / 4;
const DEG90 = Math.PI / 2;
// DIGITS = 10 matches EPSILON = 1e-10 — the library's documented tolerance
const DIGITS = 10;

describe('Rotation2', () => {
 describe('Factories & constants', () => {
  it('identity constants', () => {
   expect(Rotation2.IDENTITY.cos).toBe(1);
   expect(Rotation2.IDENTITY.sin).toBe(0);
  });

  it('fromAngle uses deterministic math', () => {
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.cos).toBeCloseTo(0);
   expect(rot.sin).toBeCloseTo(1);
  });

  it('fromVector normalizes zero-safe', () => {
   const rot = Rotation2.fromVector2(new Vector2(0, 0));
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });

  it('fromVector normalizes arbitrary vectors', () => {
   const rot = Rotation2.fromVector2(new Vector2(10, 0));
   expect(rot.cos).toBeCloseTo(1);
   expect(rot.sin).toBeCloseTo(0);
  });

  it('fromVectors computes delta', () => {
   const from = new Vector2(1, 0);
   const to = new Vector2(0, 1);
   const rot = Rotation2.fromVectors2(from, to);
   expect(rot.cos).toBeCloseTo(0);
   expect(rot.sin).toBeCloseTo(1);
  });
 });

 describe('Instance vs static operations', () => {
  it('multiply mutates instance while static multiply stays pure', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG90);
   const returned = a.multiply(b);
   expect(returned).toBe(a);
   expect(a.angle).toBeCloseTo(Math.PI);

   const staticResult = Rotation2.multiply(Rotation2.fromAngle(DEG90), Rotation2.fromAngle(DEG90));
   expect(staticResult.angle).toBeCloseTo(Math.PI);
  });

  it('inverse returns conjugate', () => {
   const rot = Rotation2.fromAngle(DEG90);
   rot.inverse();
   expect(rot.angle).toBeCloseTo(-DEG90);
  });

  it('relativeTo computes needed delta', () => {
   const start = Rotation2.fromAngle(0);
   const target = Rotation2.fromAngle(DEG90);
   const relative = start.relativeTo(target);
   expect(relative.angle).toBeCloseTo(DEG90);
  });
 });

 describe('Vector application', () => {
  it('apply rotates vectors', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const result = rot.apply(new Vector2(1, 0));
   expect(result.x).toBeCloseTo(0);
   expect(result.y).toBeCloseTo(1);
  });

  it('applyInverse rotates opposite direction', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const result = rot.applyInverse(new Vector2(0, 1));
   expect(result.x).toBeCloseTo(1);
   expect(result.y).toBeCloseTo(0);
  });

  it('apply writes into provided out vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const out = new Vector2();
   const returned = rot.apply(new Vector2(1, 0), out);
   expect(returned).toBe(out);
   expect(out.x).toBeCloseTo(0);
   expect(out.y).toBeCloseTo(1);
  });
 });

 describe('Equality helpers', () => {
  it('equals is strict comparison', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(0);
   const c = Rotation2.fromAngle(0.0000001);
   expect(a.exactEquals(b)).toBe(true);
   expect(a.exactEquals(c)).toBe(false);
  });

  it('nearEquals respects tolerance', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(0.0000001);
   expect(a.nearEquals(b, 1e-6)).toBe(true);
  });

  it('isIdentity detects near zero rotation', () => {
   expect(Rotation2.fromAngle(0).isIdentity()).toBe(true);
   expect(Rotation2.fromAngle(DEG90).isIdentity()).toBe(false);
  });
 });

 describe('Interpolation', () => {
  it('lerp allows extrapolation (does NOT clamp t)', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI / 2);
   // With t=2, should extrapolate to PI (or -PI, which is equivalent)
   const extrapolatedAngle = start.clone().lerp(end, 2).angle;
   expect(Math.abs(extrapolatedAngle)).toBeCloseTo(Math.PI, DIGITS);
   // With t=-1, should extrapolate to -PI/2
   expect(start.clone().lerp(end, -1).angle).toBeCloseTo(-Math.PI / 2, DIGITS);
  });

  it('lerpClamped clamps interpolation factor', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI / 2);
   expect(start.clone().lerpClamped(end, -1).angle).toBeCloseTo(0, DIGITS);
   expect(start.clone().lerpClamped(end, 2).angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Clone and copy', () => {
  it('clone creates independent copy', () => {
   const original = Rotation2.fromAngle(DEG90);
   const cloned = original.clone();
   expect(cloned.cos).toBe(original.cos);
   expect(cloned.sin).toBe(original.sin);
   expect(cloned).not.toBe(original);
  });

  it('copy copies from source', () => {
   const source = Rotation2.fromAngle(DEG90);
   const target = new Rotation2();
   target.copy(source);
   expect(target.cos).toBe(source.cos);
   expect(target.sin).toBe(source.sin);
  });
 });

 describe('Conversion', () => {
  it('toArray returns [cos, sin]', () => {
   const rot = Rotation2.fromAngle(0);
   const array = rot.toArray();
   expect(array[0]).toBeCloseTo(1, DIGITS);
   expect(array[1]).toBeCloseTo(0, DIGITS);
  });

  it('toObject returns plain object', () => {
   const rot = Rotation2.fromAngle(0);
   const object = rot.toObject();
   expect(object.cos).toBeCloseTo(1, DIGITS);
   expect(object.sin).toBeCloseTo(0, DIGITS);
  });

  it('toString returns formatted string', () => {
   const rot = Rotation2.fromAngle(0);
   expect(rot.toString()).toContain('Rotation2');
  });
 });

 describe('Static factories', () => {
  it('fromObject creates from plain object', () => {
   const rot = Rotation2.fromObject({ cos: 1, sin: 0 });
   expect(rot.isIdentity()).toBe(true);
  });
 });

 describe('Set methods', () => {
  it('set updates components', () => {
   const rot = new Rotation2();
   rot.set(0, 1);
   expect(rot.cos).toBeCloseTo(0, DIGITS);
   expect(rot.sin).toBeCloseTo(1, DIGITS);
  });

  it('setAngle sets rotation by angle', () => {
   const rot = new Rotation2();
   rot.setAngle(DEG90);
   expect(rot.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('identity resets to identity', () => {
   const rot = Rotation2.fromAngle(DEG90);
   rot.identity();
   expect(rot.isIdentity()).toBe(true);
  });
 });

 describe('Additional operations', () => {
  it('multiply composes rotations', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG90);
   const c = a.multiply(b);
   expect(c.angle).toBeCloseTo(Math.PI, DIGITS);
  });

  it('inverse returns opposite rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const inv = rot.inverse();
   expect(inv.angle).toBeCloseTo(-DEG90, DIGITS);
  });

  it('equals checks equality', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG90);
   expect(a.exactEquals(b)).toBe(true);
  });

  it('toArray returns [cos, sin]', () => {
   const rot = Rotation2.fromAngle(0);
   expect(rot.toArray()).toEqual([1, 0]);
  });

  it('toObject returns plain object', () => {
   const rot = Rotation2.fromAngle(0);
   const object = rot.toObject();
   expect(object.cos).toBe(1);
   expect(object.sin).toBe(0);
  });

  it('toString returns formatted string', () => {
   const rot = new Rotation2();
   expect(rot.toString()).toContain('Rotation2');
  });
 });

 describe('Static Operations', () => {
  it('relative calculates rotation from a to b', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(Math.PI);
   const rel = Rotation2.relative(a, b);
   expect(rel.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('lerp interpolates between rotations', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const mid = Rotation2.lerp(a, b, 0.5);
   expect(mid.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('lerp does NOT clamp t (allows extrapolation)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   // With t=2, should extrapolate to PI (or -PI, equivalent due to angle normalization)
   const extrapolated = Rotation2.lerp(a, b, 2);
   expect(Math.abs(extrapolated.angle)).toBeCloseTo(Math.PI, DIGITS);
  });

  it('lerpClamped clamps t to [0, 1]', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const clamped = Rotation2.lerpClamped(a, b, 2);
   expect(clamped.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });

  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 1, y: 0 };
   const result = Rotation2.apply(rot, v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('equals handles opposite rotations (180 apart)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI * 2);
   expect(Rotation2.exactEquals(a, b)).toBe(true);
  });
 });

 describe('Instance Operations Extended', () => {
  it('relativeTo calculates relative rotation', () => {
   const a = Rotation2.fromAngle(Math.PI / 4);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const rel = a.relativeTo(b);
   expect(rel.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('applyInverse applies inverse rotation to vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(0, 1);
   const result = rot.applyInverse(v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(1, 0);
   const result = rot.apply(v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('isIdentity detects identity rotation', () => {
   expect(Rotation2.isIdentity(Rotation2.IDENTITY)).toBe(true);
   expect(Rotation2.isIdentity(Rotation2.QUARTER_TURN)).toBe(false);
  });

  it('nearEquals handles edge cases near ±180°', () => {
   const a = Rotation2.fromAngle(Math.PI - 0.001);
   const b = Rotation2.fromAngle(-Math.PI + 0.001);
   // These are very close (within epsilon of each other around ±π)
   expect(a.nearEquals(b, 0.01)).toBe(true);
  });
 });

 describe('Conversion Methods Extended', () => {
  it('toComplex returns equivalent complex number', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   const complex = rot.toComplex();
   expect(complex.argument()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('toMatrix2 returns equivalent rotation matrix', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   const mat = rot.toMatrix2();
   expect(mat.m00).toBeCloseTo(rot.cos, DIGITS);
   expect(mat.m01).toBeCloseTo(rot.sin, DIGITS);
   expect(mat.m10).toBeCloseTo(-rot.sin, DIGITS);
   expect(mat.m11).toBeCloseTo(rot.cos, DIGITS);
  });

  it('toMatrix2 accepts out parameter', () => {
   const rot = Rotation2.fromAngle(Math.PI / 2);
   const out = new Matrix2();
   const result = rot.toMatrix2(out);
   expect(result).toBe(out);
   expect(out.m00).toBeCloseTo(0, DIGITS);
   expect(out.m01).toBeCloseTo(1, DIGITS);
  });

  it('xAxis getter returns rotated X axis', () => {
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.xAxis.x).toBeCloseTo(0, DIGITS);
   expect(rot.xAxis.y).toBeCloseTo(1, DIGITS);
  });

  it('yAxis getter returns rotated Y axis', () => {
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.yAxis.x).toBeCloseTo(-1, DIGITS);
   expect(rot.yAxis.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Static Methods', () => {
  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 1, y: 0 };
   const result = Rotation2.apply(rot, v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('lerp interpolates between rotations', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const mid = Rotation2.lerp(a, b, 0.5);
   expect(mid.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('lerp does NOT clamp t (allows extrapolation)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   // With t=2, should extrapolate to 180 degrees (or -180, equivalent)
   const result = Rotation2.lerp(a, b, 2);
   expect(Math.abs(result.angle)).toBeCloseTo(Math.PI, DIGITS);
  });

  it('lerpClamped clamps t to [0, 1]', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const result = Rotation2.lerpClamped(a, b, 2);
   expect(result.angle).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Instance Methods', () => {
  it('equals returns true for same rotation', () => {
   const a = Rotation2.fromAngle(DEG45);
   const b = Rotation2.fromAngle(DEG45);
   expect(a.exactEquals(b)).toBe(true);
  });

  it('equals returns false for different rotation', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   expect(a.exactEquals(b)).toBe(false);
  });

  it('equals handles opposite signs (180 degree difference)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI);
   expect(a.exactEquals(b)).toBe(false);
  });

  it('isIdentity returns true for identity rotation', () => {
   const rot = new Rotation2(1, 0);
   expect(rot.isIdentity()).toBe(true);
  });

  it('isIdentity returns false for non-identity rotation', () => {
   const rot = Rotation2.fromAngle(DEG45);
   expect(rot.isIdentity()).toBe(false);
  });

  it('inversed getter returns inverse rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const inv = rot.inversed;
   expect(inv.angle).toBeCloseTo(-DEG90, DIGITS);
  });
 });

 describe('Coverage - Instance Transform Methods', () => {
  it('relativeTo computes relative rotation', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG45);
   const rel = a.relativeTo(b);
   // relativeTo: a relative to b = a - b
   expect(Math.abs(rel.angle)).toBeCloseTo(DEG45, DIGITS);
  });

  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(1, 0);
   const result = rot.apply(v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('applyInverse rotates vector inversely', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(0, 1);
   const result = rot.applyInverse(v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Additional Branches', () => {
  it('relativeTo mutates this and returns this', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG45);
   const result = a.relativeTo(b);
   expect(result).toBe(a); // Instance methods return this
   expect(Math.abs(result.angle)).toBeCloseTo(DEG45, DIGITS);
  });

  it('instance apply with out parameter', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(1, 0);
   const out = new Vector2();
   const result = rot.apply(v, out);
   expect(result).toBe(out);
   expect(out.y).toBeCloseTo(1, DIGITS);
  });

  it('instance applyInverse with out parameter', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = new Vector2(0, 1);
   const out = new Vector2();
   const result = rot.applyInverse(v, out);
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(1, DIGITS);
  });

  it('equals handles inverted signs (cos/sin negated)', () => {
   // Create rotations where cos/sin are negated
   const a = new Rotation2(1, 0);
   const b = new Rotation2(-1, 0);
   expect(a.exactEquals(b)).toBe(false);
  });

  it('lerp mutates this and returns this', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const result = a.lerp(b, 0.5);
   expect(result).toBe(a); // Instance methods return this
   expect(a.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('multiply mutates this and returns this', () => {
   const a = Rotation2.fromAngle(DEG45);
   const b = Rotation2.fromAngle(DEG45);
   const result = a.multiply(b);
   expect(result).toBe(a); // Instance methods return this
   expect(a.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('inverse mutates this and returns this', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const result = rot.inverse();
   expect(result).toBe(rot); // Instance methods return this
   expect(rot.angle).toBeCloseTo(-DEG90, DIGITS);
  });

  it('doubled getter returns double angle', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const doubled = rot.doubled;
   expect(doubled.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('perpendicular getter returns 90 degree rotated', () => {
   const rot = Rotation2.fromAngle(0);
   const perp = rot.perpendicular;
   expect(perp.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('normalized getter returns normalized rotation', () => {
   // Create a rotation with non-unit length
   const rot = new Rotation2(2, 0);
   const normalized = rot.normalized;
   expect(normalized.cos).toBeCloseTo(1, DIGITS);
  });

  it('negated getter returns negated rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const neg = rot.negated;
   expect(neg.cos).toBeCloseTo(rot.cos, DIGITS);
   expect(neg.sin).toBeCloseTo(-rot.sin, DIGITS);
  });

  it('static apply with out parameter', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 1, y: 0 };
   const out = new Vector2();
   const result = Rotation2.apply(rot, v, out);
   expect(result).toBe(out);
   expect(out.y).toBeCloseTo(1, DIGITS);
  });

  it('lerp with out parameter (static)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const out = new Rotation2();
   const result = Rotation2.lerp(a, b, 0.5, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Constructor and Factories Extended', () => {
  it('constructor does NOT normalize (Planck.js aligned)', () => {
   expect.hasAssertions();
   const rot = new Rotation2(3, 4); // Not unit, NOT normalized by constructor
   // Constructor preserves input values (industry standard)
   expect(rot.cos).toBe(3);
   expect(rot.sin).toBe(4);
  });

  it('fromVector with zero vector returns identity', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromVector2({ x: 0, y: 0 });
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });

  it('fromVector normalizes direction', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromVector2({ x: 3, y: 4 });
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('fromVectors computes rotation between vectors', () => {
   expect.hasAssertions();
   const from = { x: 1, y: 0 };
   const to = { x: 0, y: 1 };
   const rot = Rotation2.fromVectors2(from, to);
   expect(rot.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('fromVectors with out parameter', () => {
   expect.hasAssertions();
   const from = { x: 1, y: 0 };
   const to = { x: 0, y: 1 };
   const out = new Rotation2();
   const result = Rotation2.fromVectors2(from, to, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Static Methods Extended', () => {
  it('apply applies rotation', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(DEG45);
   const v = { x: 1, y: 0 };
   const result = Rotation2.apply(rot, v);
   expect(result.x).toBeCloseTo(Math.SQRT1_2, DIGITS);
   expect(result.y).toBeCloseTo(Math.SQRT1_2, DIGITS);
  });

  it('lerp handles wrap-around', () => {
   expect.hasAssertions();
   const a = Rotation2.fromAngle(Math.PI - 0.1);
   const b = Rotation2.fromAngle(-Math.PI + 0.1);
   const mid = Rotation2.lerp(a, b, 0.5);
   expect(Math.abs(mid.angle)).toBeCloseTo(Math.PI, 1);
  });

  it('nearEquals returns true for equivalent rotations', () => {
   expect.hasAssertions();
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI * 2);
   expect(Rotation2.nearEquals(a, b, 0.01)).toBe(true);
  });

  it('isIdentity checks for identity rotation', () => {
   expect.hasAssertions();
   expect(Rotation2.isIdentity(Rotation2.IDENTITY)).toBe(true);
   expect(Rotation2.isIdentity(Rotation2.QUARTER_TURN)).toBe(false);
  });
 });

 describe('Coverage - Instance Getters Extended', () => {
  it('inversed returns negated sin', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(DEG45);
   const inv = rot.inversed;
   expect(inv.sin).toBeCloseTo(-rot.sin, DIGITS);
   expect(inv.cos).toBeCloseTo(rot.cos, DIGITS);
  });

  it('doubled doubles the angle', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(DEG45);
   const doubled = rot.doubled;
   expect(doubled.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('perpendicular rotates 90 degrees', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(0);
   const perp = rot.perpendicular;
   expect(perp.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('xAxis and yAxis return rotated axes', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.xAxis.x).toBeCloseTo(0, DIGITS);
   expect(rot.xAxis.y).toBeCloseTo(1, DIGITS);
   expect(rot.yAxis.x).toBeCloseTo(-1, DIGITS);
   expect(rot.yAxis.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Iterator', () => {
  it('supports array destructuring', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const [cos, sin] = rot;
   expect(cos).toBeCloseTo(Math.cos(DEG45), DIGITS);
   expect(sin).toBeCloseTo(Math.sin(DEG45), DIGITS);
  });

  it('supports spread operator', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const array = [...rot];
   expect(array[0]).toBeCloseTo(0, DIGITS);
   expect(array[1]).toBeCloseTo(1, DIGITS);
  });

  it('works with for...of', () => {
   const rot = Rotation2.fromAngle(0);
   const values: number[] = [];
   for (const v of rot) {
    values.push(v);
   }
   expect(values[0]).toBeCloseTo(1, DIGITS);
   expect(values[1]).toBeCloseTo(0, DIGITS);
  });
 });

 describe('fromArray', () => {
  it('creates rotation from array', () => {
   const rot = Rotation2.fromArray([0.6, 0.8]);
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('supports offset parameter', () => {
   const rot = Rotation2.fromArray([999, 0, 1, 888], 1);
   expect(rot.cos).toBeCloseTo(0, DIGITS);
   expect(rot.sin).toBeCloseTo(1, DIGITS);
  });

  it('throws on out of bounds offset', () => {
   expect(() => Rotation2.fromArray([1, 0], 2)).toThrow(RangeError);
  });

  it('throws on negative offset', () => {
   expect(() => Rotation2.fromArray([1, 0], -1)).toThrow(RangeError);
  });
 });

 describe('Utility Methods', () => {
  it('isFinite returns true for finite rotation', () => {
   const rot = Rotation2.fromAngle(DEG45);
   expect(rot.isFinite()).toBe(true);
  });

  it('isFinite returns false for infinite rotation', () => {
   const rot = new Rotation2(Infinity, 0);
   expect(rot.isFinite()).toBe(false);
  });

  it('hasNaN returns false for normal rotation', () => {
   const rot = Rotation2.fromAngle(DEG45);
   expect(rot.hasNaN()).toBe(false);
  });

  it('hasNaN returns true for NaN rotation', () => {
   const rot = new Rotation2(NaN, 0);
   expect(rot.hasNaN()).toBe(true);
  });
 });

 describe('Coverage - Static Factory Methods', () => {
  it('fromComplex creates rotation from complex number', () => {
   // Complex with angle PI/4
   const complex = new Complex(Math.cos(DEG45), Math.sin(DEG45));
   const rot = Rotation2.fromComplex(complex);
   expect(rot.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('fromComplex with out parameter', () => {
   const complex = new Complex(0, 1);
   const out = new Rotation2();
   const result = Rotation2.fromComplex(complex, out);
   expect(result).toBe(out);
  });

  it('fromObject with out parameter', () => {
   const out = new Rotation2();
   const result = Rotation2.fromObject({ cos: 0, sin: 1 }, out);
   expect(result).toBe(out);
   expect(out.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('fromArray with out parameter', () => {
   const out = new Rotation2();
   const result = Rotation2.fromArray([0, 1], 0, out);
   expect(result).toBe(out);
   expect(out.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('static clone creates copy', () => {
   const original = Rotation2.fromAngle(DEG45);
   const cloned = Rotation2.clone(original);
   expect(cloned.angle).toBeCloseTo(DEG45, DIGITS);
   expect(cloned).not.toBe(original);
  });

  it('static clone with out parameter', () => {
   const original = Rotation2.fromAngle(DEG45);
   const out = new Rotation2();
   const result = Rotation2.clone(original, out);
   expect(result).toBe(out);
   expect(out.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('static copy copies values', () => {
   const source = Rotation2.fromAngle(DEG90);
   const destination = new Rotation2();
   const result = Rotation2.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.angle).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Static Transform Methods', () => {
  it('static applyInverse rotates vector inversely', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 0, y: 1 };
   const result = Rotation2.applyInverse(rot, v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('static applyInverse with out parameter', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const v = { x: Math.SQRT1_2, y: Math.SQRT1_2 };
   const out = new Vector2();
   const result = Rotation2.applyInverse(rot, v, out);
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(1, DIGITS);
  });
 });

 describe('Coverage - Static Comparison Methods', () => {
  it('static nearEquals uses slow path for wrap-around', () => {
   const a = Rotation2.fromAngle(Math.PI - 0.0001);
   const b = Rotation2.fromAngle(-Math.PI + 0.0001);
   expect(Rotation2.nearEquals(a, b, 0.001)).toBe(true);
  });

  it('static isIdentity checks identity rotation', () => {
   expect(Rotation2.isIdentity(Rotation2.IDENTITY)).toBe(true);
   expect(Rotation2.isIdentity(Rotation2.QUARTER_TURN)).toBe(false);
  });

  it('static isFinite checks finite components', () => {
   expect(Rotation2.isFinite(Rotation2.IDENTITY)).toBe(true);
   expect(Rotation2.isFinite({ cos: Infinity, sin: 0 } as unknown as Rotation2)).toBe(false);
   expect(Rotation2.isFinite({ cos: 0, sin: Infinity } as unknown as Rotation2)).toBe(false);
  });

  it('static hasNaN checks for NaN', () => {
   expect(Rotation2.hasNaN(Rotation2.IDENTITY)).toBe(false);
   expect(Rotation2.hasNaN({ cos: NaN, sin: 0 } as unknown as Rotation2)).toBe(true);
   expect(Rotation2.hasNaN({ cos: 0, sin: NaN } as unknown as Rotation2)).toBe(true);
  });
 });

 describe('Coverage - Static Interpolation smoothStep', () => {
  it('static smoothStep interpolates smoothly', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const mid = Rotation2.smoothStep(a, b, 0.5);
   expect(mid.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('static smoothStep clamps t', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   expect(Rotation2.smoothStep(a, b, -1).angle).toBeCloseTo(0, DIGITS);
   expect(Rotation2.smoothStep(a, b, 2).angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('static smoothStep with out parameter', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const out = new Rotation2();
   const result = Rotation2.smoothStep(a, b, 0.5, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - Instance Comparison Methods', () => {
  it('instance isIdentity checks identity', () => {
   expect(new Rotation2(1, 0).isIdentity()).toBe(true);
   expect(Rotation2.fromAngle(DEG45).isIdentity()).toBe(false);
  });

  it('instance isFinite checks finite', () => {
   expect(Rotation2.fromAngle(0).isFinite()).toBe(true);
   expect(new Rotation2(Infinity, 0).isFinite()).toBe(false);
  });

  it('instance hasNaN checks NaN', () => {
   expect(Rotation2.fromAngle(0).hasNaN()).toBe(false);
   expect(new Rotation2(NaN, 0).hasNaN()).toBe(true);
  });
 });

 describe('Coverage - Instance Getters', () => {
  it('inversed getter returns inverse', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const inv = rot.inversed;
   expect(inv.angle).toBeCloseTo(-DEG90, DIGITS);
  });
 });

 describe('Coverage - Object.freeze on rotation', () => {
  it('Object.freeze freezes the rotation object', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const frozen = Object.freeze(rot);
   expect(frozen).toBe(rot);
   expect(Object.isFrozen(frozen)).toBe(true);
  });
 });

 describe('Coverage - Instance smoothStep', () => {
  it('instance smoothStep interpolates smoothly', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   a.smoothStep(b, 0.5);
   expect(a.angle).toBeCloseTo(DEG45, DIGITS);
  });
 });

 describe('Coverage - Static normalize', () => {
  it('normalizes non-unit rotation', () => {
   const nonUnit = new Rotation2(2, 0); // Not normalized
   const normalized = Rotation2.normalize(nonUnit);
   expect(normalized.cos).toBeCloseTo(1, DIGITS);
   expect(normalized.sin).toBeCloseTo(0, DIGITS);
  });

  it('normalize with out parameter', () => {
   const input = new Rotation2(3, 4);
   const out = new Rotation2();
   const result = Rotation2.normalize(input, out);
   expect(result).toBe(out);
   expect(out.cos).toBeCloseTo(0.6, DIGITS);
   expect(out.sin).toBeCloseTo(0.8, DIGITS);
  });
 });

 describe('Coverage - Static conjugate', () => {
  it('conjugates rotation', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const conjugated = Rotation2.conjugate(rot);
   expect(conjugated.cos).toBeCloseTo(rot.cos, DIGITS);
   expect(conjugated.sin).toBeCloseTo(-rot.sin, DIGITS);
  });
 });

 describe('Coverage - Static inverse', () => {
  it('inverts rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const inverted = Rotation2.inverse(rot);
   expect(inverted.angle).toBeCloseTo(-DEG90, DIGITS);
  });
 });

 describe('Coverage - Instance conjugate', () => {
  it('conjugates in place', () => {
   const rot = Rotation2.fromAngle(DEG45);
   rot.conjugate();
   expect(rot.sin).toBeCloseTo(-Math.sin(DEG45), DIGITS);
  });
 });

 describe('Coverage - Instance inverse', () => {
  it('inverts in place', () => {
   const rot = Rotation2.fromAngle(DEG90);
   rot.inverse();
   expect(rot.angle).toBeCloseTo(-DEG90, DIGITS);
  });
 });

 describe('Coverage - Static multiply', () => {
  it('multiplies two rotations', () => {
   const a = Rotation2.fromAngle(DEG45);
   const b = Rotation2.fromAngle(DEG45);
   const product = Rotation2.multiply(a, b);
   expect(product.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('multiply with out parameter', () => {
   const a = Rotation2.fromAngle(DEG45);
   const b = Rotation2.fromAngle(DEG45);
   const out = new Rotation2();
   Rotation2.multiply(a, b, out);
   expect(out.angle).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Static relative', () => {
  it('computes relative rotation', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG45);
   const result = Rotation2.relative(a, b);
   expect(result.angle).toBeCloseTo(-DEG45, DIGITS);
  });
 });

 describe('Coverage - Static clone', () => {
  it('clones rotation', () => {
   const source = Rotation2.fromAngle(DEG45);
   const cloned = Rotation2.clone(source);
   expect(cloned.cos).toBeCloseTo(source.cos, DIGITS);
   expect(cloned.sin).toBeCloseTo(source.sin, DIGITS);
  });

  it('clone with out parameter', () => {
   const source = Rotation2.fromAngle(DEG90);
   const out = new Rotation2();
   const result = Rotation2.clone(source, out);
   expect(result).toBe(out);
   expect(out.angle).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Static copy', () => {
  it('copy copies to destination', () => {
   const source = Rotation2.fromAngle(DEG45);
   const destination = new Rotation2();
   const result = Rotation2.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.cos).toBeCloseTo(source.cos, DIGITS);
   expect(destination.sin).toBeCloseTo(source.sin, DIGITS);
  });
 });

 describe('Coverage - Instance fromAngle', () => {
  it('setAngle sets new angle', () => {
   const rot = new Rotation2();
   rot.setAngle(DEG90);
   expect(rot.angle).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Instance set', () => {
  it('set sets cos and sin directly', () => {
   const rot = new Rotation2();
   rot.set(0, 1);
   expect(rot.cos).toBe(0);
   expect(rot.sin).toBe(1);
  });
 });

 describe('Coverage - Static lerp', () => {
  it('lerp interpolates rotations', () => {
   const a = Rotation2.IDENTITY;
   const b = Rotation2.fromAngle(Math.PI / 2);
   const result = Rotation2.lerp(a, b, 0.5);
   expect(result.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - Static lerpClamped', () => {
  it('lerpClamped clamps t to [0, 1]', () => {
   const a = Rotation2.IDENTITY;
   const b = Rotation2.fromAngle(Math.PI / 2);
   const result = Rotation2.lerpClamped(a, b, 2);
   expect(result.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Coverage - Static angle', () => {
  it('angle returns angle of rotation', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   expect(Rotation2.angle(rot)).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - Static fromArray edge cases', () => {
  it('fromArray with offset', () => {
   const array = [0, 0, 1, 0];
   const rot = Rotation2.fromArray(array, 2);
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });
 });

 describe('Coverage - Instance lerp', () => {
  it('lerp interpolates in place', () => {
   const rot = Rotation2.fromAngle(0);
   rot.lerp(Rotation2.fromAngle(Math.PI / 2), 0.5);
   expect(rot.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - Instance exactEquals', () => {
  it('exactEquals checks strict equality', () => {
   const a = new Rotation2(1, 0);
   const b = new Rotation2(1, 0);
   expect(a.exactEquals(b)).toBe(true);
  });
 });

 describe('Coverage - Instance toArray', () => {
  it('toArray returns [cos, sin]', () => {
   const rot = Rotation2.fromAngle(0);
   const array = rot.toArray();
   expect(array[0]).toBe(1);
   expect(array[1]).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Static fromVector2', () => {
  it('fromVector2 creates rotation from direction', () => {
   const rot = Rotation2.fromVector2({ x: 0, y: 1 });
   expect(rot.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 // === BRANCH COVERAGE: L794-808 ===
 describe('Coverage - Static isFinite', () => {
  it('isFinite returns true for finite rotation', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   expect(Rotation2.isFinite(rot)).toBe(true);
  });

  it('isFinite returns false for Infinity', () => {
   const rot = new Rotation2(Infinity, 0);
   expect(Rotation2.isFinite(rot)).toBe(false);
  });

  it('isFinite returns false for NaN', () => {
   const rot = new Rotation2(NaN, 0);
   expect(Rotation2.isFinite(rot)).toBe(false);
  });
 });

 describe('Coverage - Static hasNaN', () => {
  it('hasNaN returns false for valid rotation', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   expect(Rotation2.hasNaN(rot)).toBe(false);
  });

  it('hasNaN returns true for NaN cos', () => {
   const rot = new Rotation2(NaN, 0);
   expect(Rotation2.hasNaN(rot)).toBe(true);
  });

  it('hasNaN returns true for NaN sin', () => {
   const rot = new Rotation2(1, NaN);
   expect(Rotation2.hasNaN(rot)).toBe(true);
  });
 });

 describe('Coverage - Static hasInfinity', () => {
  it('hasInfinity returns false for finite rotation', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   expect(Rotation2.hasInfinity(rot)).toBe(false);
  });

  it('hasInfinity returns false for valid rotation', () => {
   const rot = Rotation2.fromAngle(0);
   expect(Rotation2.hasInfinity(rot)).toBe(false);
  });

  it('hasInfinity returns false for unit rotation', () => {
   const rot = Rotation2.QUARTER_TURN;
   expect(Rotation2.hasInfinity(rot)).toBe(false);
  });

  it('hasInfinity returns false for identity', () => {
   expect(Rotation2.hasInfinity(Rotation2.IDENTITY)).toBe(false);
  });
 });

 describe('Coverage - Instance hasInfinity', () => {
  it('instance hasInfinity returns false for finite', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   expect(rot.hasInfinity()).toBe(false);
  });

  it('instance hasInfinity returns false for identity', () => {
   expect(Rotation2.hasInfinity(Rotation2.IDENTITY)).toBe(false);
  });
 });

 describe('Coverage - Static multiply with out', () => {
  it('multiply uses out parameter', () => {
   const a = Rotation2.fromAngle(Math.PI / 4);
   const b = Rotation2.fromAngle(Math.PI / 4);
   const out = new Rotation2();
   const result = Rotation2.multiply(a, b, out);
   expect(result).toBe(out);
   expect(result.angle).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Coverage - Static clone with out', () => {
  it('clone uses out parameter', () => {
   const source = Rotation2.fromAngle(Math.PI / 4);
   const out = new Rotation2();
   const result = Rotation2.clone(source, out);
   expect(result).toBe(out);
   expect(result.angle).toBeCloseTo(Math.PI / 4, DIGITS);
  });
 });

 describe('Coverage - Static normalize with out', () => {
  it('normalize uses out parameter', () => {
   const unnormalized = new Rotation2(2, 0);
   const out = new Rotation2();
   const result = Rotation2.normalize(unnormalized, out);
   expect(result).toBe(out);
   expect(result.cos).toBeCloseTo(1, DIGITS);
   expect(result.sin).toBeCloseTo(0, DIGITS);
  });
 });

 describe('fromValues factory', () => {
  it('creates rotation from cos and sin values', () => {
   const rot = Rotation2.fromValues(1, 0);
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });

  it('creates 90 degree rotation', () => {
   const rot = Rotation2.fromValues(0, 1);
   expect(rot.cos).toBe(0);
   expect(rot.sin).toBe(1);
   expect(rot.angle).toBeCloseTo(DEG90, DIGITS);
  });

  it('creates 45 degree rotation', () => {
   const cos45 = Math.cos(DEG45);
   const sin45 = Math.sin(DEG45);
   const rot = Rotation2.fromValues(cos45, sin45);
   expect(rot.angle).toBeCloseTo(DEG45, DIGITS);
  });

  it('uses out parameter', () => {
   const out = new Rotation2();
   const result = Rotation2.fromValues(0, 1, out);
   expect(result).toBe(out);
   expect(out.sin).toBe(1);
  });
  // Pure math: NaN/Infinity are valid IEEE 754 values, no longer throws
 });

 describe('Static copy method', () => {
  it('copy copies values from source to destination', () => {
   const source = Rotation2.fromAngle(DEG90);
   const destination = new Rotation2();
   const result = Rotation2.copy(source, destination);
   expect(result).toBe(destination);
   expect(destination.cos).toBeCloseTo(source.cos, DIGITS);
   expect(destination.sin).toBeCloseTo(source.sin, DIGITS);
  });
 });

 describe('Static angle method', () => {
  it('angle returns the angle of a rotation', () => {
   const rot = Rotation2.fromAngle(DEG45);
   expect(Rotation2.angle(rot)).toBeCloseTo(DEG45, DIGITS);
  });

  it('angle returns 0 for identity', () => {
   expect(Rotation2.angle(Rotation2.IDENTITY)).toBeCloseTo(0, DIGITS);
  });

  it('angle returns PI/2 for quarter turn', () => {
   expect(Rotation2.angle(Rotation2.QUARTER_TURN)).toBeCloseTo(DEG90, DIGITS);
  });
 });

 describe('Coverage - Static normalizeSafe', () => {
  it('normalizeSafe returns identity for near-zero rotation', () => {
   const nearZero = new Rotation2(1e-12, 1e-12);
   const result = Rotation2.normalizeSafe(nearZero);
   expect(result.cos).toBe(1);
   expect(result.sin).toBe(0);
  });

  it('normalizeSafe normalizes valid rotation', () => {
   const rot = new Rotation2(3, 4);
   const result = Rotation2.normalizeSafe(rot);
   expect(result.cos).toBeCloseTo(0.6, DIGITS);
   expect(result.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('normalizeSafe uses out parameter', () => {
   const rot = new Rotation2(3, 4);
   const out = new Rotation2();
   const result = Rotation2.normalizeSafe(rot, out);
   expect(result).toBe(out);
  });
 });

 describe('Coverage - normalizeUnchecked', () => {
  it('static normalizeUnchecked normalizes rotation', () => {
   const rot = new Rotation2(3, 4);
   const result = Rotation2.normalizeUnchecked(rot);
   expect(result.cos).toBeCloseTo(0.6, DIGITS);
   expect(result.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('instance normalizeUnchecked normalizes in place', () => {
   const rot = new Rotation2(3, 4);
   rot.normalizeUnchecked();
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });
 });

 describe('Coverage - normalize instance method', () => {
  it('normalize normalizes rotation in place', () => {
   const rot = new Rotation2(3, 4); // mag = 5
   rot.normalize();
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('normalize returns this for chaining', () => {
   const rot = new Rotation2(3, 4);
   const result = rot.normalize();
   expect(result).toBe(rot);
  });
 });

 describe('Coverage - normalizeSafe instance method', () => {
  it('normalizeSafe normalizes rotation in place', () => {
   const rot = new Rotation2(3, 4);
   rot.normalizeSafe();
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('normalizeSafe handles zero magnitude by setting to identity', () => {
   const rot = new Rotation2(0, 0);
   rot.normalizeSafe();
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });
 });

 describe('Coverage - Static lerp rotation', () => {
  it('lerp interpolates rotations linearly', () => {
   const from = Rotation2.fromAngle(0);
   const to = Rotation2.fromAngle(Math.PI);
   const result = Rotation2.lerp(from, to, 0.5);
   expect(result).toBeDefined();
  });
 });

 describe('NaN/Infinity handling', () => {
  it('fromAngle(NaN) throws (assertFinite)', () => {
   expect(() => Rotation2.fromAngle(NaN)).toThrow();
  });

  it('fromAngle(Infinity) throws (assertFinite)', () => {
   expect(() => Rotation2.fromAngle(Infinity)).toThrow();
  });

  it('angle getter returns NaN for NaN rotation', () => {
   const rot = new Rotation2(NaN, NaN);
   expect(rot.angle).toBeNaN();
  });

  it('apply with NaN rotation produces NaN vector', () => {
   const rot = new Rotation2(NaN, NaN);
   const v = new Vector2(1, 0);
   const result = Rotation2.apply(rot, v);
   expect(result.x).toBeNaN();
   expect(result.y).toBeNaN();
  });
 });

 describe('fromCS', () => {
  it('creates identity rotation from (1, 0)', () => {
   const r = Rotation2.fromCS(1, 0);
   expect(r.cos).toBe(1);
   expect(r.sin).toBe(0);
  });

  it('creates 90-degree rotation from (0, 1)', () => {
   const r = Rotation2.fromCS(0, 1);
   expect(r.cos).toBe(0);
   expect(r.sin).toBe(1);
  });

  it('uses out parameter', () => {
   const out = new Rotation2();
   const result = Rotation2.fromCS(0, 1, out);
   expect(result).toBe(out);
   expect(out.cos).toBe(0);
   expect(out.sin).toBe(1);
  });

  it('matches fromAngle for same angle', () => {
   const angle = 1.23;
   const cs = Rotation2.fromCS(Math.cos(angle), Math.sin(angle));
   const fromAngle = Rotation2.fromAngle(angle);
   expect(cs.cos).toBeCloseTo(fromAngle.cos, 8);
   expect(cs.sin).toBeCloseTo(fromAngle.sin, 8);
  });
 });
});
