import { describe, expect, it } from '@jest/globals';

import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';

const DEG45 = Math.PI / 4;
const DEG90 = Math.PI / 2;
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
   const rot = Rotation2.fromVector(new Vector2(0, 0));
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });

  it('fromVector normalizes arbitrary vectors', () => {
   const rot = Rotation2.fromVector(new Vector2(10, 0));
   expect(rot.cos).toBeCloseTo(1);
   expect(rot.sin).toBeCloseTo(0);
  });

  it('fromVectors computes delta', () => {
   const from = new Vector2(1, 0);
   const to = new Vector2(0, 1);
   const rot = Rotation2.fromVectors(from, to);
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
   expect(a.angle()).toBeCloseTo(Math.PI);

   const staticResult = Rotation2.multiply(Rotation2.fromAngle(DEG90), Rotation2.fromAngle(DEG90));
   expect(staticResult.angle()).toBeCloseTo(Math.PI);
  });

  it('inverse returns conjugate', () => {
   const rot = Rotation2.fromAngle(DEG90);
   rot.inverse();
   expect(rot.angle()).toBeCloseTo(-DEG90);
  });

  it('relativeTo computes needed delta', () => {
   const start = Rotation2.fromAngle(0);
   const target = Rotation2.fromAngle(DEG90);
   const relative = start.relativeTo(target);
   expect(relative.angle()).toBeCloseTo(DEG90);
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
  it('slerp static matches instance lerp', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI);
   // Clone start because instance lerp mutates this
   const instanceCopy = start.clone();
   instanceCopy.lerp(end, 0.25);
   const staticResult = Rotation2.slerp(start, end, 0.25);
   expect(staticResult.angle()).toBeCloseTo(instanceCopy.angle(), DIGITS);
  });

  it('lerp allows extrapolation (does NOT clamp t)', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI / 2);
   // With t=2, should extrapolate to PI (or -PI, which is equivalent)
   const extrapolatedAngle = start.clone().lerp(end, 2).angle();
   expect(Math.abs(extrapolatedAngle)).toBeCloseTo(Math.PI, DIGITS);
   // With t=-1, should extrapolate to -PI/2
   expect(start.clone().lerp(end, -1).angle()).toBeCloseTo(-Math.PI / 2, DIGITS);
  });

  it('lerpClamped clamps interpolation factor', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI / 2);
   expect(start.clone().lerpClamped(end, -1).angle()).toBeCloseTo(0, DIGITS);
   expect(start.clone().lerpClamped(end, 2).angle()).toBeCloseTo(Math.PI / 2, DIGITS);
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
   expect(rot.angle()).toBeCloseTo(DEG90, DIGITS);
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
   expect(c.angle()).toBeCloseTo(Math.PI, DIGITS);
  });

  it('inverse returns opposite rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const inv = rot.inverse();
   expect(inv.angle()).toBeCloseTo(-DEG90, DIGITS);
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
   expect(rel.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('lerp interpolates between rotations', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const mid = Rotation2.lerp(a, b, 0.5);
   expect(mid.angle()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('lerp does NOT clamp t (allows extrapolation)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   // With t=2, should extrapolate to PI (or -PI, equivalent due to angle normalization)
   const extrapolated = Rotation2.lerp(a, b, 2);
   expect(Math.abs(extrapolated.angle())).toBeCloseTo(Math.PI, DIGITS);
  });

  it('lerpClamped clamps t to [0, 1]', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const clamped = Rotation2.lerpClamped(a, b, 2);
   expect(clamped.angle()).toBeCloseTo(Math.PI / 2, DIGITS);
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
   expect(rel.angle()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('applyInverse applies inverse rotation to vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 0, y: 1 };
   const result = rot.applyInverse(v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });

  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 1, y: 0 };
   const result = rot.apply(v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('isIdentity detects identity rotation', () => {
   expect(Rotation2.IDENTITY.isIdentity()).toBe(true);
   expect(Rotation2.QUARTER_TURN.isIdentity()).toBe(false);
  });

  it('nearEquals handles edge cases near ±180°', () => {
   const a = Rotation2.fromAngle(Math.PI - 0.001);
   const b = Rotation2.fromAngle(-Math.PI + 0.001);
   // These are very close (within epsilon of each other around ±π)
   expect(a.nearEquals(b, 0.01)).toBe(true);
  });
 });

 describe('SLERP Operations', () => {
  it('slerp interpolates on shortest arc', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   const mid = Rotation2.slerp(a, b, 0.5);
   expect(mid.angle()).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('slerp handles t=0 and t=1', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(Math.PI / 2);
   expect(Rotation2.slerp(a, b, 0).angle()).toBeCloseTo(0, DIGITS);
   expect(Rotation2.slerp(a, b, 1).angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });

 describe('Conversion Methods Extended', () => {
  it('toComplex returns equivalent complex number', () => {
   const rot = Rotation2.fromAngle(Math.PI / 4);
   const complex = rot.toComplex();
   expect(complex.argument()).toBeCloseTo(Math.PI / 4, DIGITS);
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
   expect(mid.angle()).toBeCloseTo(DEG45, DIGITS);
  });

  it('lerp does NOT clamp t (allows extrapolation)', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   // With t=2, should extrapolate to 180 degrees (or -180, equivalent)
   const result = Rotation2.lerp(a, b, 2);
   expect(Math.abs(result.angle())).toBeCloseTo(Math.PI, DIGITS);
  });

  it('lerpClamped clamps t to [0, 1]', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const result = Rotation2.lerpClamped(a, b, 2);
   expect(result.angle()).toBeCloseTo(DEG90, DIGITS);
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
   expect(inv.angle()).toBeCloseTo(-DEG90, DIGITS);
  });
 });

 describe('Coverage - Instance Transform Methods', () => {
  it('relativeTo computes relative rotation', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG45);
   const rel = a.relativeTo(b);
   // relativeTo: a relative to b = a - b
   expect(Math.abs(rel.angle())).toBeCloseTo(DEG45, DIGITS);
  });

  it('apply rotates a vector', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 1, y: 0 };
   const result = rot.apply(v);
   expect(result.x).toBeCloseTo(0, DIGITS);
   expect(result.y).toBeCloseTo(1, DIGITS);
  });

  it('applyInverse rotates vector inversely', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const v = { x: 0, y: 1 };
   const result = rot.applyInverse(v);
   expect(result.x).toBeCloseTo(1, DIGITS);
   expect(result.y).toBeCloseTo(0, DIGITS);
  });
 });

 describe('Coverage - Static Additional Methods', () => {
  it('slerp interpolates with t=0.5', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const mid = Rotation2.slerp(a, b, 0.5);
   expect(mid.angle()).toBeCloseTo(DEG45, 3);
  });
 });

 describe('Coverage - Additional Branches', () => {
  it('relativeTo mutates this and returns this', () => {
   const a = Rotation2.fromAngle(DEG90);
   const b = Rotation2.fromAngle(DEG45);
   const result = a.relativeTo(b);
   expect(result).toBe(a); // Instance methods return this
   expect(Math.abs(result.angle())).toBeCloseTo(DEG45, DIGITS);
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
   expect(a.angle()).toBeCloseTo(DEG45, DIGITS);
  });

  it('multiply mutates this and returns this', () => {
   const a = Rotation2.fromAngle(DEG45);
   const b = Rotation2.fromAngle(DEG45);
   const result = a.multiply(b);
   expect(result).toBe(a); // Instance methods return this
   expect(a.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('inverse mutates this and returns this', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const result = rot.inverse();
   expect(result).toBe(rot); // Instance methods return this
   expect(rot.angle()).toBeCloseTo(-DEG90, DIGITS);
  });

  it('doubled getter returns double angle', () => {
   const rot = Rotation2.fromAngle(DEG45);
   const doubled = rot.doubled;
   expect(doubled.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('perpendicular getter returns 90 degree rotated', () => {
   const rot = Rotation2.fromAngle(0);
   const perp = rot.perpendicular;
   expect(perp.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('normalized getter returns normalized rotation', () => {
   // Create a rotation with non-unit length
   const rot = new Rotation2(2, 0);
   const normalized = rot.normalized;
   expect(normalized.cos).toBeCloseTo(1, DIGITS);
  });

  it('angleValue getter returns angle', () => {
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.angleValue).toBeCloseTo(DEG90, DIGITS);
  });

  it('negated getter returns negated rotation', () => {
   const rot = Rotation2.fromAngle(DEG90);
   const neg = rot.negated;
   expect(neg.cos).toBeCloseTo(rot.cos, DIGITS);
   expect(neg.sin).toBeCloseTo(-rot.sin, DIGITS);
  });

  it('slerp with out parameter', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(DEG90);
   const out = new Rotation2();
   const result = Rotation2.slerp(a, b, 0.5, out);
   expect(result).toBe(out);
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
  it('constructor normalizes non-unit input', () => {
   expect.hasAssertions();
   const rot = new Rotation2(3, 4); // Not unit, will be normalized
   const magnitude = Math.sqrt(rot.cos * rot.cos + rot.sin * rot.sin);
   expect(magnitude).toBeCloseTo(1, DIGITS);
  });

  it('fromVector with zero vector returns identity', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromVector({ x: 0, y: 0 });
   expect(rot.cos).toBe(1);
   expect(rot.sin).toBe(0);
  });

  it('fromVector normalizes direction', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromVector({ x: 3, y: 4 });
   expect(rot.cos).toBeCloseTo(0.6, DIGITS);
   expect(rot.sin).toBeCloseTo(0.8, DIGITS);
  });

  it('fromVectors computes rotation between vectors', () => {
   expect.hasAssertions();
   const from = { x: 1, y: 0 };
   const to = { x: 0, y: 1 };
   const rot = Rotation2.fromVectors(from, to);
   expect(rot.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('fromVectors with out parameter', () => {
   expect.hasAssertions();
   const from = { x: 1, y: 0 };
   const to = { x: 0, y: 1 };
   const out = new Rotation2();
   const result = Rotation2.fromVectors(from, to, out);
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
   expect(Math.abs(mid.angle())).toBeCloseTo(Math.PI, 1);
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
   expect(doubled.angle()).toBeCloseTo(DEG90, DIGITS);
  });

  it('perpendicular rotates 90 degrees', () => {
   expect.hasAssertions();
   const rot = Rotation2.fromAngle(0);
   const perp = rot.perpendicular;
   expect(perp.angle()).toBeCloseTo(DEG90, DIGITS);
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
});
