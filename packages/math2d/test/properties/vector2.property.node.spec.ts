/**
 * @file properties/vector2.property.node.spec.ts
 * @description Property-based tests for Vector2 class.
 *
 * These tests verify mathematical invariants that should hold for all inputs,
 * using randomly generated test cases via fast-check.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Vector2 } from '../../src/core/vector2';
import { arbAngle, arbNonZeroVector2, arbVector2 } from '../arbitraries';

// Using 1e-6 tolerance - realistic for floating-point operations
const TEST_TOLERANCE = 1e-6;

describe('Vector2 Properties', () => {
 describe('Addition', () => {
  it('should be commutative: a + b = b + a', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const ab = Vector2.add(a, b);
     const ba = Vector2.add(b, a);
     return ab.nearEquals(ba, TEST_TOLERANCE);
    }),
   );
  });

  it('should be associative: (a + b) + c = a + (b + c)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, arbVector2, (a, b, c) => {
     const ab_c = Vector2.add(Vector2.add(a, b), c);
     const a_bc = Vector2.add(a, Vector2.add(b, c));
     return ab_c.nearEquals(a_bc, TEST_TOLERANCE);
    }),
   );
  });

  it('should have zero as identity: a + 0 = a', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     const result = Vector2.add(a, Vector2.ZERO);
     return result.nearEquals(a, TEST_TOLERANCE);
    }),
   );
  });

  it('should have additive inverse: a + (-a) = 0', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     const negA = Vector2.negate(a);
     const result = Vector2.add(a, negA);
     return result.nearEquals(Vector2.ZERO, TEST_TOLERANCE);
    }),
   );
  });
 });

 describe('Scalar Multiplication', () => {
  it('should be associative: (s * t) * v = s * (t * v)', () => {
   fc.assert(
    fc.property(
     fc.integer({ min: -100, max: 100 }),
     fc.integer({ min: -100, max: 100 }),
     arbVector2,
     (s, t, v) => {
      const st_v = Vector2.scale(v, s * t);
      const s_tv = Vector2.scale(Vector2.scale(v, t), s);
      return st_v.nearEquals(s_tv, TEST_TOLERANCE);
     },
    ),
   );
  });

  it('should have 1 as identity: 1 * v = v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Vector2.scale(v, 1);
     return result.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should have 0 as annihilator: 0 * v = 0', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Vector2.scale(v, 0);
     return result.nearEquals(Vector2.ZERO, TEST_TOLERANCE);
    }),
   );
  });

  it('should distribute over vector addition: s * (a + b) = s*a + s*b', () => {
   fc.assert(
    fc.property(fc.integer({ min: -100, max: 100 }), arbVector2, arbVector2, (s, a, b) => {
     const s_ab = Vector2.scale(Vector2.add(a, b), s);
     const sa_sb = Vector2.add(Vector2.scale(a, s), Vector2.scale(b, s));
     return s_ab.nearEquals(sa_sb, TEST_TOLERANCE);
    }),
   );
  });
 });

 describe('Dot Product', () => {
  it('should be commutative: a · b = b · a', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const ab = Vector2.dot(a, b);
     const ba = Vector2.dot(b, a);
     return Math.abs(ab - ba) < TEST_TOLERANCE;
    }),
   );
  });

  it('should be distributive: a · (b + c) = a·b + a·c', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, arbVector2, (a, b, c) => {
     const a_bc = Vector2.dot(a, Vector2.add(b, c));
     const ab_ac = Vector2.dot(a, b) + Vector2.dot(a, c);
     return Math.abs(a_bc - ab_ac) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: a · a >= 0', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     return Vector2.dot(a, a) >= -TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: a · a = ||a||²', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     const dotSelf = Vector2.dot(a, a);
     const lengthSq = Vector2.lengthSquared(a);
     return Math.abs(dotSelf - lengthSq) < TEST_TOLERANCE;
    }),
   );
  });
 });

 describe('Cross Product (2D)', () => {
  it('should be anti-commutative: a × b = -(b × a)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const ab = Vector2.cross(a, b);
     const ba = Vector2.cross(b, a);
     return Math.abs(ab + ba) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: a × a = 0', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     return Math.abs(Vector2.cross(a, a)) < TEST_TOLERANCE;
    }),
   );
  });
 });

 describe('Normalization', () => {
  it('should produce unit length for non-zero vectors', () => {
   fc.assert(
    fc.property(arbNonZeroVector2, (v) => {
     const normalized = Vector2.normalizeSafe(v);
     if (normalized.exactEquals(Vector2.ZERO)) return true; // Underflow case
     return Math.abs(normalized.length() - 1) < TEST_TOLERANCE;
    }),
   );
  });

  it('should preserve direction: normalize(v) is parallel to v', () => {
   fc.assert(
    fc.property(arbNonZeroVector2, (v) => {
     const normalized = Vector2.normalizeSafe(v);
     if (normalized.exactEquals(Vector2.ZERO)) return true; // Underflow case
     // cross product should be zero for parallel vectors
     return Math.abs(Vector2.cross(v, normalized)) < TEST_TOLERANCE;
    }),
   );
  });
 });

 describe('Equality', () => {
  it('nearEquals should be reflexive: a.nearEquals(a)', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     return a.nearEquals(a);
    }),
   );
  });

  it('nearEquals should be symmetric: a.nearEquals(b) = b.nearEquals(a)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     return a.nearEquals(b) === b.nearEquals(a);
    }),
   );
  });

  it('exactEquals should be reflexive: a.exactEquals(a)', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     return a.exactEquals(a);
    }),
   );
  });

  it('exactEquals should be symmetric: a.exactEquals(b) = b.exactEquals(a)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     return a.exactEquals(b) === b.exactEquals(a);
    }),
   );
  });
 });

 describe('Distance', () => {
  it('should be non-negative: distance(a, b) >= 0', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     return Vector2.distance(a, b) >= -TEST_TOLERANCE;
    }),
   );
  });

  it('should be symmetric: distance(a, b) = distance(b, a)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const ab = Vector2.distance(a, b);
     const ba = Vector2.distance(b, a);
     return Math.abs(ab - ba) < TEST_TOLERANCE;
    }),
   );
  });

  it('should be zero for identical vectors: distance(a, a) = 0', () => {
   fc.assert(
    fc.property(arbVector2, (a) => {
     return Math.abs(Vector2.distance(a, a)) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy triangle inequality: d(a,c) <= d(a,b) + d(b,c)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, arbVector2, (a, b, c) => {
     const ac = Vector2.distance(a, c);
     const ab = Vector2.distance(a, b);
     const bc = Vector2.distance(b, c);
     return ac <= ab + bc + TEST_TOLERANCE;
    }),
   );
  });
 });

 describe('Rotation', () => {
  it('should preserve length: ||rotate(v, θ)|| = ||v||', () => {
   fc.assert(
    fc.property(arbVector2, arbAngle, (v, theta) => {
     const rotated = Vector2.rotate(v, theta);
     const originalLength = Vector2.length(v);
     const rotatedLength = Vector2.length(rotated);
     // Relative tolerance - 1e-6 relative error for floating point
     const tolerance = Math.max(1e-10, originalLength * 1e-6);
     return Math.abs(originalLength - rotatedLength) < tolerance;
    }),
   );
  });

  it('should satisfy: rotate(v, 0) = v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const rotated = Vector2.rotate(v, 0);
     return rotated.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: rotate(v, 2π) ≈ v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const rotated = Vector2.rotate(v, 2 * Math.PI);
     return rotated.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should be additive: rotate(rotate(v, a), b) = rotate(v, a+b)', () => {
   // Using larger tolerance due to floating-point accumulation errors
   fc.assert(
    fc.property(
     arbVector2,
     fc.integer({ min: -157, max: 157 }).map((n) => (n / 100) * (Math.PI / 2)),
     fc.integer({ min: -157, max: 157 }).map((n) => (n / 100) * (Math.PI / 2)),
     (v, a, b) => {
      const rotateAB = Vector2.rotate(Vector2.rotate(v, a), b);
      const rotateSum = Vector2.rotate(v, a + b);
      return rotateAB.nearEquals(rotateSum, 1e-6); // Larger tolerance for accumulated error
     },
    ),
   );
  });
 });

 describe('Projection', () => {
  it('should satisfy: project(v, v) = v for non-zero v', () => {
   fc.assert(
    fc.property(arbNonZeroVector2, (v) => {
     const projected = Vector2.project(v, v);
     return projected.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should be idempotent: project(project(v, axis), axis) = project(v, axis)', () => {
   fc.assert(
    fc.property(arbVector2, arbNonZeroVector2, (v, axis) => {
     const first = Vector2.project(v, axis);
     const second = Vector2.project(first, axis);
     return first.nearEquals(second, TEST_TOLERANCE);
    }),
   );
  });
 });

 describe('Lerp', () => {
  it('should satisfy: lerp(a, b, 0) = a', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const result = Vector2.lerp(a, b, 0);
     return result.nearEquals(a, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: lerp(a, b, 1) = b', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const result = Vector2.lerp(a, b, 1);
     return result.nearEquals(b, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: lerp(a, a, t) = a for any t', () => {
   fc.assert(
    fc.property(
     arbVector2,
     fc.integer({ min: 0, max: 100 }).map((n) => n / 100),
     (a, t) => {
      const result = Vector2.lerp(a, a, t);
      return result.nearEquals(a, TEST_TOLERANCE);
     },
    ),
   );
  });
 });
});
