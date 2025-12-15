/**
 * @file test/arbitraries.ts
 * @description Custom fast-check arbitraries for math2d types.
 *
 * Usage:
 *   import * as fc from 'fast-check';
 *   import { arbVector2, arbRotation2 } from './arbitraries';
 *
 * @example
 * ```typescript
 * fc.assert(fc.property(arbVector2, (v) => {
 *   return v.nearEquals(v); // reflexivity
 * }));
 * ```
 */

import * as fc from 'fast-check';

import { Complex } from '../src/core/complex';
import { Interval } from '../src/core/interval';
import { Matrix2 } from '../src/core/matrix2';
import { Matrix3 } from '../src/core/matrix3';
import { Rotation2 } from '../src/core/rotation2';
import { Transform2 } from '../src/core/transform2';
import { Vector2 } from '../src/core/vector2';

// ============================================================================
// Scalar Arbitraries
// ============================================================================

/** Finite float (no NaN, no Infinity) */
export const arbFiniteFloat = fc.float({ noNaN: true, noDefaultInfinity: true });

/** Float in typical range for coordinates - using integer for precision */
export const arbCoordinate = fc.integer({ min: -1000000, max: 1000000 }).map((n) => n);

/** Non-zero scalar */
export const arbNonZeroScalar = fc
 .integer({ min: -1000000, max: 1000000 })
 .filter((x) => Math.abs(x) > 1);

/** Positive scalar */
export const arbPositiveScalar = fc.integer({ min: 1, max: 1000000 }).map((n) => n);

/** Angle in radians [-π, π] - using integer for precision */
export const arbAngle = fc.integer({ min: -31416, max: 31416 }).map((n) => (n / 10000) * Math.PI);

/** Angle near ±π boundary (using integer scaled) */
export const arbAngleNearPi = fc
 .tuple(
  fc.integer({ min: 1, max: 1000 }),
  fc.boolean(), // Choose positive or negative side
 )
 .map(([n, isPositive]) => {
  const epsilon = n * 1e-9;
  return isPositive ? Math.PI - epsilon : -Math.PI + epsilon;
 });

/** Angle near 0 (using integer scaled) */
export const arbAngleNearZero = fc.integer({ min: -1000, max: 1000 }).map((n) => n * 1e-12);

// ============================================================================
// Vector2 Arbitraries
// ============================================================================

/** General Vector2 */
export const arbVector2 = fc.tuple(arbCoordinate, arbCoordinate).map(([x, y]) => new Vector2(x, y));

/** Non-zero Vector2 */
export const arbNonZeroVector2 = arbVector2.filter((v) => v.lengthSquared() > 1e-20);

/** Unit Vector2 */
export const arbUnitVector2 = arbAngle.map((angle) => Vector2.fromAngle(angle));

/** Vector2 with small components */
export const arbSmallVector2 = fc
 .tuple(fc.integer({ min: -10000, max: 10000 }), fc.integer({ min: -10000, max: 10000 }))
 .map(([x, y]) => new Vector2(x * 1e-8, y * 1e-8));

// ============================================================================
// Rotation2 Arbitraries
// ============================================================================

/** General Rotation2 */
export const arbRotation2 = arbAngle.map((angle) => Rotation2.fromAngle(angle));

/** Rotation2 near identity */
export const arbRotation2NearIdentity = arbAngleNearZero.map((angle) => Rotation2.fromAngle(angle));

/** Rotation2 near ±π */
export const arbRotation2NearPi = arbAngleNearPi.map((angle) => Rotation2.fromAngle(angle));

// ============================================================================
// Transform2 Arbitraries
// ============================================================================

/** General Transform2 */
export const arbTransform2 = fc
 .tuple(arbVector2, arbAngle, arbPositiveScalar, arbPositiveScalar)
 .map(([pos, rot, sx, sy]) => Transform2.fromComponents(pos, rot, new Vector2(sx, sy)));

/** Transform2 near identity */
export const arbTransform2NearIdentity = fc
 .tuple(
  arbSmallVector2,
  arbAngleNearZero,
  fc.integer({ min: 990, max: 1010 }).map((n) => n / 1000),
  fc.integer({ min: 990, max: 1010 }).map((n) => n / 1000),
 )
 .map(([pos, rot, sx, sy]) => Transform2.fromComponents(pos, rot, new Vector2(sx, sy)));

// ============================================================================
// Complex Arbitraries
// ============================================================================

/** General Complex */
export const arbComplex = fc
 .tuple(arbCoordinate, arbCoordinate)
 .map(([real, imag]) => new Complex(real, imag));

/** Non-zero Complex */
export const arbNonZeroComplex = arbComplex.filter((c) => c.magnitudeSq() > 1e-20);

/** Unit Complex */
export const arbUnitComplex = arbAngle.map((angle) => Complex.fromPolar(1, angle));

// ============================================================================
// Interval Arbitraries
// ============================================================================

/** Valid Interval (min <= max) */
export const arbInterval = fc
 .tuple(arbCoordinate, arbCoordinate)
 .map(([a, b]) => new Interval(Math.min(a, b), Math.max(a, b)));

/** Non-empty Interval */
export const arbNonEmptyInterval = fc
 .tuple(arbCoordinate, arbPositiveScalar)
 .map(([min, width]) => new Interval(min, min + width));

// ============================================================================
// Matrix Arbitraries
// ============================================================================

/** General Matrix2 */
export const arbMatrix2 = fc
 .tuple(arbCoordinate, arbCoordinate, arbCoordinate, arbCoordinate)
 .map(([m00, m01, m10, m11]) => new Matrix2(m00, m01, m10, m11));

/** Rotation Matrix2 */
export const arbRotationMatrix2 = arbAngle.map((angle) => Matrix2.fromRotation(angle));

/** Invertible Matrix2 */
export const arbInvertibleMatrix2 = arbMatrix2.filter((m) => Math.abs(m.determinant()) > 1e-10);

/** General Matrix3 */
export const arbMatrix3 = fc
 .tuple(
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
  arbCoordinate,
 )
 .map(
  ([m00, m01, m02, m10, m11, m12, m20, m21, m22]) =>
   new Matrix3(m00, m01, m02, m10, m11, m12, m20, m21, m22),
 );

/** Rotation Matrix3 */
export const arbRotationMatrix3 = arbAngle.map((angle) => Matrix3.fromRotation(angle));

/** Affine Transform Matrix3 (translation + rotation + scale) */
export const arbAffineMatrix3 = fc
 .tuple(arbVector2, arbAngle, arbPositiveScalar, arbPositiveScalar)
 .map(([translation, rotation, sx, sy]) => {
  // Build TRS matrix: T * R * S
  const t = Matrix3.fromTranslation(translation);
  const r = Matrix3.fromRotation(rotation);
  const s = Matrix3.fromScale(new Vector2(sx, sy));
  return Matrix3.multiply(Matrix3.multiply(t, r), s);
 });

// ============================================================================
// Boundary Arbitraries
// ============================================================================

/** Values near critical boundaries */
export const arbBoundaryValue = fc.oneof(
 fc.constant(0),
 fc.constant(1),
 fc.constant(-1),
 fc.constant(Math.PI),
 fc.constant(-Math.PI),
 fc.constant(Number.MAX_SAFE_INTEGER),
 fc.constant(Number.MIN_SAFE_INTEGER),
 fc.constant(Number.MIN_VALUE),
 arbAngleNearZero,
 arbAngleNearPi,
);

/** Pair of nearly equal values */
export const arbNearlyEqualPair = arbCoordinate.chain((base) =>
 fc.tuple(
  fc.constant(base),
  fc.integer({ min: -1000, max: 1000 }).map((offset) => base + offset * 1e-12),
 ),
);
