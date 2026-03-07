## 1. Interval Triality (sqrt)

- [x] 1.1 Add static `Interval.sqrtSafe(interval, out?)` — clamps min to 0, returns `[0,0]` for fully negative
- [x] 1.2 Add instance `interval.sqrtSafe()` — mutates this, same logic
- [x] 1.3 Add static `Interval.sqrtUnchecked(interval, out?)` — no validation
- [x] 1.4 Add instance `interval.sqrtUnchecked()` — mutates this, no validation
- [x] 1.5 Add tests for sqrtSafe (fully negative, partially negative, valid interval, zero interval)
- [x] 1.6 Add tests for sqrtUnchecked (valid interval, NaN passthrough)

## 2. Matrix mod/modScalar Static Equivalents

- [x] 2.1 Add static `Matrix2.mod(a, b, out?)` — element-wise modulo
- [x] 2.2 Add static `Matrix2.modScalar(m, scalar, out?)` — scalar modulo
- [x] 2.3 Add static `Matrix3.mod(a, b, out?)` — element-wise modulo
- [x] 2.4 Add static `Matrix3.modScalar(m, scalar, out?)` — scalar modulo
- [x] 2.5 Add tests verifying static/instance parity for Matrix2 mod/modScalar
- [x] 2.6 Add tests verifying static/instance parity for Matrix3 mod/modScalar

## 3. Complex.get normalized Fallback (BREAKING v0.6.0 → v0.7.0)

- [x] 3.1 Change `Complex.get normalized` to return `(1, 0)` instead of `(0, 0)` for zero-magnitude
- [x] 3.2 Update existing tests that assert `(0, 0)` fallback to expect `(1, 0)`
- [x] 3.3 Update JSDoc `@remarks` on `get normalized` to document identity fallback rationale (reference v0.6.0 → v0.7.0)

## 4. \*CS Factory Variants

- [x] 4.1 Add static `Complex.fromPolarCS(magnitude, cos, sin, out?)` — polar factory with pre-computed trig
- [x] 4.2 Add static `Rotation2.fromCS(cos, sin, out?)` — rotation factory with pre-computed trig
- [x] 4.3 Add tests for `Complex.fromPolarCS` (unit, arbitrary magnitude, zero magnitude, out parameter)
- [x] 4.4 Add tests for `Rotation2.fromCS` (identity, 90-degree, out parameter, equivalence with fromAngle)

## 5. Matrix2 Instance-Static Parity

- [x] 5.1 Add static `Matrix2.premultiply(left, right, out?)` — computes left \* right
- [x] 5.2 Add instance `matrix2.compose(scaleX, scaleY, angle)` — builds Scale\*Rotate matrix
- [x] 5.3 Add instance `matrix2.decompose()` — extracts {scaleX, scaleY, angle}
- [x] 5.4 Add tests for Matrix2.premultiply (static vs instance equivalence)
- [x] 5.5 Add tests for compose/decompose (round-trip, identity, pure rotation, pure scale)

## 6. Matrix3 Instance-Static Parity

- [x] 6.1 Add static `Matrix3.premultiply(left, right, out?)` — computes left \* right
- [x] 6.2 Add static `Matrix3.transformPoints(m, points, out?)` — transforms point array
- [x] 6.3 Add static `Matrix3.transformVectors(m, vectors, out?)` — transforms vector array (no translation)
- [x] 6.4 Add static `Matrix3.isAffine(m)` — predicate for affine test
- [x] 6.5 Add instance `matrix3.decompose()` — extracts {tx, ty, angle, scaleX, scaleY}
- [x] 6.6 Add tests for Matrix3 static parity (premultiply, transformPoints, transformVectors, isAffine)
- [x] 6.7 Add tests for Matrix3.decompose (round-trip with compose, translation+rotation+scale)

## 7. Interval Static Sample

- [x] 7.1 Add static `Interval.sample(interval, t)` — linear interpolation
- [x] 7.2 Add tests for static sample (boundaries t=0/t=1, midpoint, equivalence with instance)

## 8. Tolerance Documentation

- [x] 8.1 Add `@remarks` to all EPSILON-using functions in auxiliary/scalar (nearEquals, isNearZero, isNearOne, relativeEquals)
- [x] 8.2 Add `@remarks` to all MIN_SAFE_DIVISOR-using functions in auxiliary/numeric (safeDivide, safeReciprocal)
- [x] 8.3 Add `@remarks` to core type methods that use tolerance (isIdentity, isOrthogonal, nearEquals, normalizeSafe, inverseSafe)

## 9. Near-Singular Boundary Tests

- [x] 9.1 Add boundary tests for Matrix2.inverse/inverseSafe at determinant near EPSILON
- [x] 9.2 Add boundary tests for Matrix3.inverse/inverseSafe at determinant near EPSILON
- [x] 9.3 Add boundary tests for Transform2.inverse/inverseSafe with scale near zero

## 10. Core Coverage to 95%+

- [x] 10.1 Identify uncovered lines in complex.ts and add targeted tests
- [x] 10.2 Identify uncovered lines in matrix2.ts and add targeted tests
- [x] 10.3 Identify uncovered lines in matrix3.ts and add targeted tests
- [x] 10.4 Identify uncovered lines in interval.ts and add targeted tests
- [x] 10.5 Run full coverage report and verify all four files are at 95%+ statements
