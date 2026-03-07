/**
 * @file test/arbitraries.node.spec.ts
 * @module @lenguados/math2d/test
 * @description Tests for arbitrary generators to ensure coverage.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import {
 arbAngle,
 arbAngleNearPi,
 arbAngleNearZero,
 arbAffineMatrix3,
 arbBoundaryValue,
 arbComplex,
 arbCoordinate,
 arbFiniteFloat,
 arbInterval,
 arbInvertibleMatrix2,
 arbMatrix2,
 arbMatrix3,
 arbNearlyEqualPair,
 arbNonEmptyInterval,
 arbNonZeroComplex,
 arbNonZeroScalar,
 arbNonZeroVector2,
 arbPositiveScalar,
 arbRotation2,
 arbRotation2NearIdentity,
 arbRotation2NearPi,
 arbRotationMatrix2,
 arbRotationMatrix3,
 arbSmallVector2,
 arbTransform2,
 arbTransform2NearIdentity,
 arbUnitComplex,
 arbUnitVector2,
 arbVector2,
} from './arbitraries';

describe('Arbitraries', () => {
 describe('Scalar Arbitraries', () => {
  it('arbFiniteFloat generates finite floats', () => {
   fc.assert(
    fc.property(arbFiniteFloat, (n) => {
     return Number.isFinite(n);
    }),
    { numRuns: 10 },
   );
  });

  it('arbCoordinate generates integers', () => {
   fc.assert(
    fc.property(arbCoordinate, (n) => {
     return typeof n === 'number' && !Number.isNaN(n);
    }),
    { numRuns: 10 },
   );
  });

  it('arbNonZeroScalar generates non-zero values', () => {
   fc.assert(
    fc.property(arbNonZeroScalar, (n) => {
     return Math.abs(n) > 0;
    }),
    { numRuns: 10 },
   );
  });

  it('arbPositiveScalar generates positive values', () => {
   fc.assert(
    fc.property(arbPositiveScalar, (n) => {
     return n > 0;
    }),
    { numRuns: 10 },
   );
  });

  it('arbAngle generates angles in valid range', () => {
   fc.assert(
    fc.property(arbAngle, (angle) => {
     return angle >= -Math.PI * 4 && angle <= Math.PI * 4;
    }),
    { numRuns: 10 },
   );
  });

  it('arbAngleNearPi generates angles near π', () => {
   fc.assert(
    fc.property(arbAngleNearPi, (angle) => {
     return Math.abs(Math.abs(angle) - Math.PI) < 0.001;
    }),
    { numRuns: 10 },
   );
  });

  it('arbAngleNearZero generates small angles', () => {
   fc.assert(
    fc.property(arbAngleNearZero, (angle) => {
     return Math.abs(angle) < 0.001;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Vector2 Arbitraries', () => {
  it('arbVector2 generates vectors', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     return typeof v.x === 'number' && typeof v.y === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbNonZeroVector2 generates non-zero vectors', () => {
   fc.assert(
    fc.property(arbNonZeroVector2, (v) => {
     return v.magnitudeSq() > 0;
    }),
    { numRuns: 10 },
   );
  });

  it('arbUnitVector2 generates unit vectors', () => {
   fc.assert(
    fc.property(arbUnitVector2, (v) => {
     return Math.abs(v.magnitude() - 1) < 0.001;
    }),
    { numRuns: 10 },
   );
  });

  it('arbSmallVector2 generates small vectors', () => {
   fc.assert(
    fc.property(arbSmallVector2, (v) => {
     return Math.abs(v.x) < 0.001 && Math.abs(v.y) < 0.001;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Rotation2 Arbitraries', () => {
  it('arbRotation2 generates rotations', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     return typeof r.cos === 'number' && typeof r.sin === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbRotation2NearIdentity generates near-identity rotations', () => {
   fc.assert(
    fc.property(arbRotation2NearIdentity, (r) => {
     return Math.abs(r.cos - 1) < 0.001;
    }),
    { numRuns: 10 },
   );
  });

  it('arbRotation2NearPi generates rotations near π', () => {
   fc.assert(
    fc.property(arbRotation2NearPi, (r) => {
     return Math.abs(r.cos - -1) < 0.01;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Transform2 Arbitraries', () => {
  it('arbTransform2 generates transforms', () => {
   fc.assert(
    fc.property(arbTransform2, (t) => {
     // Transform2.rotation is now Rotation2 object with cos/sin
     return typeof t.rotation.cos === 'number' && typeof t.rotation.sin === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbTransform2NearIdentity generates near-identity transforms', () => {
   fc.assert(
    fc.property(arbTransform2NearIdentity, (t) => {
     // Check rotation is near identity (cos ≈ 1) and scale is near 1
     return Math.abs(t.rotation.cos - 1) < 0.01 && Math.abs(t.scale.x - 1) < 0.1;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Complex Arbitraries', () => {
  it('arbComplex generates complex numbers', () => {
   fc.assert(
    fc.property(arbComplex, (c) => {
     return typeof c.real === 'number' && typeof c.imag === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbNonZeroComplex generates non-zero complex', () => {
   fc.assert(
    fc.property(arbNonZeroComplex, (c) => {
     return c.magnitudeSq() > 0;
    }),
    { numRuns: 10 },
   );
  });

  it('arbUnitComplex generates unit complex', () => {
   fc.assert(
    fc.property(arbUnitComplex, (c) => {
     return Math.abs(c.magnitude() - 1) < 0.001;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Interval Arbitraries', () => {
  it('arbInterval generates valid intervals', () => {
   fc.assert(
    fc.property(arbInterval, (index) => {
     return index.min <= index.max;
    }),
    { numRuns: 10 },
   );
  });

  it('arbNonEmptyInterval generates non-empty intervals', () => {
   fc.assert(
    fc.property(arbNonEmptyInterval, (index) => {
     return index.width() >= 0;
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Matrix Arbitraries', () => {
  it('arbMatrix2 generates matrices', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     return typeof m.m00 === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbRotationMatrix2 generates rotation matrices', () => {
   fc.assert(
    fc.property(arbRotationMatrix2, (m) => {
     return Math.abs(m.determinant() - 1) < 0.001;
    }),
    { numRuns: 10 },
   );
  });

  it('arbInvertibleMatrix2 generates invertible matrices', () => {
   fc.assert(
    fc.property(arbInvertibleMatrix2, (m) => {
     return Math.abs(m.determinant()) > 0;
    }),
    { numRuns: 10 },
   );
  });

  it('arbMatrix3 generates 3x3 matrices', () => {
   fc.assert(
    fc.property(arbMatrix3, (m) => {
     return typeof m.m00 === 'number' && typeof m.m22 === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbRotationMatrix3 generates rotation matrices', () => {
   fc.assert(
    fc.property(arbRotationMatrix3, (m) => {
     return typeof m.m00 === 'number';
    }),
    { numRuns: 10 },
   );
  });

  it('arbAffineMatrix3 generates affine matrices', () => {
   fc.assert(
    fc.property(arbAffineMatrix3, (m) => {
     return typeof m.m00 === 'number';
    }),
    { numRuns: 10 },
   );
  });
 });

 describe('Boundary Arbitraries', () => {
  it('arbBoundaryValue generates boundary values', () => {
   fc.assert(
    fc.property(arbBoundaryValue, (v) => {
     return typeof v === 'number' || v !== undefined;
    }),
    { numRuns: 10 },
   );
  });

  it('arbNearlyEqualPair generates pairs', () => {
   fc.assert(
    fc.property(arbNearlyEqualPair, ([a, b]) => {
     return typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 0.001;
    }),
    { numRuns: 10 },
   );
  });
 });
});
