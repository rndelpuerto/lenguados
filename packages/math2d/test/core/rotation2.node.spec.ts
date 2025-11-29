import { describe, expect, it } from '@jest/globals';

import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';

const DEG90 = Math.PI / 2;
const DIGITS = 10;

describe('Rotation2', () => {
 describe('Factories & constants', () => {
  it('identity constants', () => {
   expect(Rotation2.IDENTITY.c).toBe(1);
   expect(Rotation2.IDENTITY.s).toBe(0);
  });

  it('fromAngle uses deterministic math', () => {
   const rot = Rotation2.fromAngle(DEG90);
   expect(rot.c).toBeCloseTo(0);
   expect(rot.s).toBeCloseTo(1);
  });

  it('fromVector normalizes zero-safe', () => {
   const rot = Rotation2.fromVector(new Vector2(0, 0));
   expect(rot.c).toBe(1);
   expect(rot.s).toBe(0);
  });

  it('fromVector normalizes arbitrary vectors', () => {
   const rot = Rotation2.fromVector(new Vector2(10, 0));
   expect(rot.c).toBeCloseTo(1);
   expect(rot.s).toBeCloseTo(0);
  });

  it('fromVectors computes delta', () => {
   const from = new Vector2(1, 0);
   const to = new Vector2(0, 1);
   const rot = Rotation2.fromVectors(from, to);
   expect(rot.c).toBeCloseTo(0);
   expect(rot.s).toBeCloseTo(1);
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
  it('equals respects tolerance', () => {
   const a = Rotation2.fromAngle(0);
   const b = Rotation2.fromAngle(0.0000001);
   expect(a.equals(b, 1e-6)).toBe(true);
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
   const instance = start.lerp(end, 0.25);
   const staticResult = Rotation2.slerp(start, end, 0.25);
   expect(staticResult.angle()).toBeCloseTo(instance.angle(), DIGITS);
  });

  it('lerp clamps interpolation factor', () => {
   const start = Rotation2.fromAngle(0);
   const end = Rotation2.fromAngle(Math.PI / 2);
   expect(start.lerp(end, -1).angle()).toBeCloseTo(0, DIGITS);
   expect(start.lerp(end, 2).angle()).toBeCloseTo(Math.PI / 2, DIGITS);
  });
 });
});
