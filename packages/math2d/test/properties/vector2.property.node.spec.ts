/**
 * @file test/properties/vector2.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Vector2.
 */

import { describe, expect, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Complex } from '../../src/core/complex';
import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';
import {
 arbAngle,
 arbComplex,
 arbMatrix2,
 arbMatrix3,
 arbNonZeroVector2,
 arbTransform2,
 arbVector2,
} from '../arbitraries';

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

 describe('Negation', () => {
  it('should be involutive: -(-v) = v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const doubleNegated = Vector2.negate(Vector2.negate(v));
     return doubleNegated.exactEquals(v);
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
      const st_v = Vector2.multiplyScalar(v, s * t);
      const s_tv = Vector2.multiplyScalar(Vector2.multiplyScalar(v, t), s);
      return st_v.nearEquals(s_tv, TEST_TOLERANCE);
     },
    ),
   );
  });

  it('should have 1 as identity: 1 * v = v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Vector2.multiplyScalar(v, 1);
     return result.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should have 0 as annihilator: 0 * v = 0', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Vector2.multiplyScalar(v, 0);
     return result.nearEquals(Vector2.ZERO, TEST_TOLERANCE);
    }),
   );
  });

  it('should distribute over vector addition: s * (a + b) = s*a + s*b', () => {
   fc.assert(
    fc.property(fc.integer({ min: -100, max: 100 }), arbVector2, arbVector2, (s, a, b) => {
     const s_ab = Vector2.multiplyScalar(Vector2.add(a, b), s);
     const sa_sb = Vector2.add(Vector2.multiplyScalar(a, s), Vector2.multiplyScalar(b, s));
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
     const lengthSq = Vector2.magnitudeSq(a);
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
     return Math.abs(normalized.magnitude() - 1) < TEST_TOLERANCE;
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
     const originalLength = Vector2.magnitude(v);
     const rotatedLength = Vector2.magnitude(rotated);
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

describe('Vector2 NaN/Infinity Propagation', () => {
 const nanVec = new Vector2(NaN, 1);
 const infVec = new Vector2(Infinity, 0);

 it('add propagates NaN', () => {
  fc.assert(
   fc.property(arbVector2, (v) => {
    const result = Vector2.add(v, nanVec);
    return Number.isNaN(result.x);
   }),
  );
 });

 it('add propagates Infinity', () => {
  fc.assert(
   fc.property(arbVector2, (v) => {
    const result = Vector2.add(v, infVec);
    return !Number.isFinite(result.x);
   }),
  );
 });

 it('scale with NaN produces NaN', () => {
  fc.assert(
   fc.property(arbVector2, (v) => {
    const result = Vector2.multiplyScalar(v, NaN);
    return Number.isNaN(result.x) && Number.isNaN(result.y);
   }),
  );
 });

 it('dot with NaN produces NaN', () => {
  fc.assert(
   fc.property(arbVector2, (v) => {
    return Number.isNaN(Vector2.dot(v, nanVec));
   }),
  );
 });

 it('magnitude of NaN vector is NaN', () => {
  expect(Vector2.magnitude(nanVec)).toBeNaN();
 });

 it('normalizeSafe of NaN vector propagates NaN (not caught by isNearZero)', () => {
  const result = Vector2.normalizeSafe(nanVec);
  expect(result.x).toBeNaN();
 });
});

describe('Vector2 Cross-Module Equivalence', () => {
 describe('applyComplex ≡ Complex.apply', () => {
  it('should produce identical results', () => {
   fc.assert(
    fc.property(arbComplex, arbVector2, (c, v) => {
     const fromVector = Vector2.applyComplex(v, c);
     const fromComplex = Complex.apply(c, v);
     return fromVector.nearEquals(fromComplex, 1e-10);
    }),
   );
  });
 });

 describe('applyMatrix2 ≡ Matrix2.transformVector', () => {
  it('should produce identical results', () => {
   fc.assert(
    fc.property(arbMatrix2, arbVector2, (m, v) => {
     const fromVector = Vector2.applyMatrix2(v, m);
     const fromMatrix = Matrix2.transformVector(m, v);
     return fromVector.nearEquals(fromMatrix, 1e-10);
    }),
   );
  });
 });

 describe('applyTransform2 ≡ Transform2.transformPoint', () => {
  it('should produce identical results', () => {
   fc.assert(
    fc.property(arbTransform2, arbVector2, (t, v) => {
     const fromVector = Vector2.applyTransform2(v, t);
     const fromTransform = Transform2.transformPoint(t, v);
     return fromVector.nearEquals(fromTransform, 1e-10);
    }),
   );
  });
 });

 describe('applyMatrix3 ≡ Matrix3.transformPoint', () => {
  it('should produce identical results', () => {
   fc.assert(
    fc.property(arbMatrix3, arbVector2, (m, v) => {
     const fromVector = Vector2.applyMatrix3(v, m);
     const fromMatrix = Matrix3.transformPoint(m, v);
     return fromVector.nearEquals(fromMatrix, 1e-10);
    }),
   );
  });
 });
});
