/**
 * @file test/boundaries/angular.boundary.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Boundary value tests for angular operations.
 *
 * @remarks
 * These tests specifically target edge cases at angular boundaries (±π, 0, 2π)
 * to prevent bugs like the Transform2.nearEquals wrap-around issue.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

const PI = Math.PI;
const SMALL_EPSILON = 1e-10;
const TEST_TOLERANCE = 1e-6;

describe('Angular Boundary Tests', () => {
 describe('±π Boundary (Half Turn)', () => {
  /**
   * The ±π boundary is the most critical for wrap-around bugs.
   * Values near +π and -π represent nearly the same rotation.
   */

  describe('Rotation2', () => {
   it('nearEquals handles +π vs -π', () => {
    const r1 = Rotation2.fromAngle(PI - SMALL_EPSILON);
    const r2 = Rotation2.fromAngle(-PI + SMALL_EPSILON);
    expect(r1.nearEquals(r2, TEST_TOLERANCE)).toBe(true);
   });

   it('nearEquals handles exact ±π', () => {
    const r1 = Rotation2.fromAngle(PI);
    const r2 = Rotation2.fromAngle(-PI);
    // These are the same rotation (180°)
    expect(r1.nearEquals(r2, TEST_TOLERANCE)).toBe(true);
   });

   it('lerp crosses ±π boundary correctly', () => {
    const r1 = Rotation2.fromAngle(PI * 0.9);
    const r2 = Rotation2.fromAngle(-PI * 0.9);
    const mid = Rotation2.lerp(r1, r2, 0.5);
    // Should go through ±π, not through 0
    expect(Math.abs(mid.angle)).toBeGreaterThan(PI * 0.8);
   });
  });

  describe('Transform2', () => {
   it('nearEquals handles +π vs -π rotation', () => {
    const t1 = Transform2.fromValues(0, 0, PI - SMALL_EPSILON, 1, 1);
    const t2 = Transform2.fromValues(0, 0, -PI + SMALL_EPSILON, 1, 1);
    expect(t1.nearEquals(t2, TEST_TOLERANCE)).toBe(true);
   });

   it('nearEquals handles exact ±π rotation', () => {
    const t1 = Transform2.fromValues(0, 0, PI, 1, 1);
    const t2 = Transform2.fromValues(0, 0, -PI, 1, 1);
    expect(t1.nearEquals(t2, TEST_TOLERANCE)).toBe(true);
   });

   it('lerp crosses ±π boundary correctly', () => {
    const t1 = Transform2.fromValues(0, 0, PI * 0.9, 1, 1);
    const t2 = Transform2.fromValues(0, 0, -PI * 0.9, 1, 1);
    const mid = Transform2.lerp(t1, t2, 0.5);
    // Should go through ±π, not through 0
    expect(Math.abs(mid.rotation.angle)).toBeGreaterThan(PI * 0.8);
   });

   it('static nearEquals is symmetric at ±π', () => {
    const t1 = Transform2.fromValues(0, 0, PI - SMALL_EPSILON, 1, 1);
    const t2 = Transform2.fromValues(0, 0, -PI + SMALL_EPSILON, 1, 1);
    expect(Transform2.nearEquals(t1, t2, TEST_TOLERANCE)).toBe(
     Transform2.nearEquals(t2, t1, TEST_TOLERANCE),
    );
   });
  });

  describe('Complex', () => {
   it('angle returns consistent values near ±π', () => {
    const c1 = Complex.fromPolar(1, PI - SMALL_EPSILON);
    const c2 = Complex.fromPolar(1, -PI + SMALL_EPSILON);
    // Args should differ by nearly 2π or be very close
    const argument1 = Complex.angle(c1);
    const argument2 = Complex.angle(c2);
    const diff = Math.abs(argument1 - argument2);
    expect(diff < TEST_TOLERANCE || Math.abs(diff - 2 * PI) < TEST_TOLERANCE).toBe(true);
   });

   it('lerp crosses ±π boundary correctly', () => {
    const c1 = Complex.fromPolar(1, PI * 0.9);
    const c2 = Complex.fromPolar(1, -PI * 0.9);
    const mid = c1.clone().lerp(c2, 0.5);
    // Should go through ±π, not through 0
    const midArgument = Complex.angle(mid);
    expect(Math.abs(midArgument)).toBeGreaterThan(PI * 0.8);
   });
  });

  describe('Vector2', () => {
   it('angleTo handles vectors near ±π', () => {
    const v1 = Vector2.fromAngle(PI * 0.99);
    const v2 = Vector2.fromAngle(-PI * 0.99);
    const angle = v1.angleTo(v2);
    // Should be a small angle (they're close), not ~2π
    expect(Math.abs(angle)).toBeLessThan(0.1);
   });

   it('angleBetween returns small angle for vectors near ±π', () => {
    const v1 = Vector2.fromAngle(PI - SMALL_EPSILON);
    const v2 = Vector2.fromAngle(-PI + SMALL_EPSILON);
    const angle = Vector2.angleBetween(v1, v2);
    // Should be nearly 0, not π or 2π
    expect(angle).toBeLessThan(0.01);
   });
  });
 });

 describe('Zero Angle Boundary', () => {
  describe('Rotation2', () => {
   it('isIdentity for zero angle', () => {
    expect(Rotation2.fromAngle(0).isIdentity()).toBe(true);
   });

   it('isIdentity for very small angle', () => {
    expect(Rotation2.fromAngle(1e-12).isIdentity(TEST_TOLERANCE)).toBe(true);
    expect(Rotation2.fromAngle(-1e-12).isIdentity(TEST_TOLERANCE)).toBe(true);
   });

   it('nearEquals for angles near zero', () => {
    const r1 = Rotation2.fromAngle(SMALL_EPSILON);
    const r2 = Rotation2.fromAngle(-SMALL_EPSILON);
    expect(r1.nearEquals(r2, TEST_TOLERANCE)).toBe(true);
   });
  });

  describe('Transform2', () => {
   it('isIdentity for zero rotation', () => {
    expect(Transform2.IDENTITY.isIdentity()).toBe(true);
   });

   it('isIdentity for very small rotation', () => {
    const t = Transform2.fromValues(0, 0, 1e-12, 1, 1);
    expect(t.isIdentity(TEST_TOLERANCE)).toBe(true);
   });
  });

  describe('Vector2', () => {
   it('angle of UNIT_X is 0', () => {
    expect(Vector2.angle(Vector2.UNIT_X)).toBe(0);
   });

   it('angleTo same direction is 0', () => {
    expect(Vector2.UNIT_X.angleTo(Vector2.UNIT_X)).toBe(0);
   });
  });
 });

 describe('Full Turn Boundary (2π)', () => {
  describe('Rotation2', () => {
   it('2π rotation equals identity', () => {
    const r = Rotation2.fromAngle(2 * PI);
    expect(r.isIdentity(TEST_TOLERANCE)).toBe(true);
   });

   it('angle + 2π equals original', () => {
    const angles = [0, PI / 4, PI / 2, PI, -PI / 4, -PI / 2];
    for (const angle of angles) {
     const r1 = Rotation2.fromAngle(angle);
     const r2 = Rotation2.fromAngle(angle + 2 * PI);
     expect(r1.nearEquals(r2, TEST_TOLERANCE)).toBe(true);
    }
   });

   it('angle - 2π equals original', () => {
    const angles = [0, PI / 4, PI / 2, PI, -PI / 4, -PI / 2];
    for (const angle of angles) {
     const r1 = Rotation2.fromAngle(angle);
     const r2 = Rotation2.fromAngle(angle - 2 * PI);
     expect(r1.nearEquals(r2, TEST_TOLERANCE)).toBe(true);
    }
   });
  });

  describe('Transform2', () => {
   it('rotation is normalized after construction', () => {
    const t = Transform2.fromValues(0, 0, 3 * PI, 1, 1);
    expect(t.rotation.angle).toBeGreaterThanOrEqual(-PI);
    expect(t.rotation.angle).toBeLessThanOrEqual(PI);
   });
  });
 });

 describe('Quarter Turn Boundary (±π/2)', () => {
  describe('Rotation2', () => {
   it('π/2 rotation is perpendicular', () => {
    const r = Rotation2.fromAngle(PI / 2);
    const rotated = Rotation2.apply(r, Vector2.UNIT_X);
    expect(rotated.nearEquals(Vector2.UNIT_Y, TEST_TOLERANCE)).toBe(true);
   });

   it('-π/2 rotation is opposite perpendicular', () => {
    const r = Rotation2.fromAngle(-PI / 2);
    const rotated = Rotation2.apply(r, Vector2.UNIT_X);
    expect(rotated.nearEquals(Vector2.NEGATIVE_UNIT_Y, TEST_TOLERANCE)).toBe(true);
   });
  });

  describe('Vector2', () => {
   it('perpendicular CCW equals π/2 rotation', () => {
    const v = new Vector2(1, 0);
    const perp = Vector2.perpendicular(v, false);
    const rotated = Vector2.rotate(v, PI / 2);
    expect(perp.nearEquals(rotated, TEST_TOLERANCE)).toBe(true);
   });

   it('perpendicular CW equals -π/2 rotation', () => {
    const v = new Vector2(1, 0);
    const perp = Vector2.perpendicular(v, true);
    const rotated = Vector2.rotate(v, -PI / 2);
    expect(perp.nearEquals(rotated, TEST_TOLERANCE)).toBe(true);
   });
  });
 });

 describe('Matrix Rotation Extraction', () => {
  describe('Matrix2', () => {
   it('getRotation handles ±π correctly', () => {
    const m1 = Matrix2.fromRotation(PI - SMALL_EPSILON);
    const m2 = Matrix2.fromRotation(-PI + SMALL_EPSILON);
    // Both should extract similar rotations (near ±π)
    const r1 = m1.getRotation();
    const r2 = m2.getRotation();
    const diff = Math.abs(r1 - r2);
    expect(diff < TEST_TOLERANCE || Math.abs(diff - 2 * PI) < TEST_TOLERANCE).toBe(true);
   });
  });

  describe('Matrix3', () => {
   it('getRotation handles ±π correctly', () => {
    const m1 = Matrix3.fromRotation(PI - SMALL_EPSILON);
    const m2 = Matrix3.fromRotation(-PI + SMALL_EPSILON);
    // Both should extract similar rotations (near ±π)
    const r1 = m1.getRotation();
    const r2 = m2.getRotation();
    const diff = Math.abs(r1 - r2);
    expect(diff < TEST_TOLERANCE || Math.abs(diff - 2 * PI) < TEST_TOLERANCE).toBe(true);
   });

   it('decompose handles ±π correctly', () => {
    // Create affine matrices with rotations near ±π
    const m1 = Matrix3.fromRotation(PI - SMALL_EPSILON);
    const m2 = Matrix3.fromRotation(-PI + SMALL_EPSILON);
    const d1 = Matrix3.decompose(m1);
    const d2 = Matrix3.decompose(m2);
    const diff = Math.abs(d1.rotation - d2.rotation);
    expect(diff < TEST_TOLERANCE || Math.abs(diff - 2 * PI) < TEST_TOLERANCE).toBe(true);
   });
  });
 });

 describe('Cross-Module Equivalence', () => {
  /**
   * These tests verify that related modules behave consistently
   * at angular boundaries.
   */

  it('Transform2 rotation behaves like Rotation2 for nearEquals', () => {
   const angles = [
    [PI - SMALL_EPSILON, -PI + SMALL_EPSILON],
    [PI, -PI],
    [SMALL_EPSILON, -SMALL_EPSILON],
    [0, 2 * PI],
   ];

   for (const [a1, a2] of angles) {
    const r1 = Rotation2.fromAngle(a1);
    const r2 = Rotation2.fromAngle(a2);
    const t1 = Transform2.fromValues(0, 0, a1, 1, 1);
    const t2 = Transform2.fromValues(0, 0, a2, 1, 1);

    const rotationEquals = r1.nearEquals(r2, TEST_TOLERANCE);
    const transformEquals = t1.nearEquals(t2, TEST_TOLERANCE);

    expect(rotationEquals).toBe(transformEquals);
   }
  });

  it('Complex angle is consistent with Rotation2.angle', () => {
   const angles = [0, PI / 4, PI / 2, PI, -PI / 4, -PI / 2, -PI];

   for (const angle of angles) {
    const r = Rotation2.fromAngle(angle);
    const c = Complex.fromPolar(1, angle);
    // Both should give the same angle (within normalization)
    const rAngle = r.angle;
    const cAngle = Complex.angle(c);
    const diff = Math.abs(rAngle - cAngle);
    expect(diff < TEST_TOLERANCE || Math.abs(diff - 2 * PI) < TEST_TOLERANCE).toBe(true);
   }
  });

  it('Vector2.fromAngle matches Rotation2.apply(UNIT_X)', () => {
   const angles = [
    0,
    PI / 4,
    PI / 2,
    PI,
    -PI / 4,
    -PI / 2,
    PI - SMALL_EPSILON,
    -PI + SMALL_EPSILON,
   ];

   for (const angle of angles) {
    const fromAngle = Vector2.fromAngle(angle);
    const rotated = Rotation2.apply(Rotation2.fromAngle(angle), Vector2.UNIT_X);
    expect(fromAngle.nearEquals(rotated, TEST_TOLERANCE)).toBe(true);
   }
  });
 });
});
