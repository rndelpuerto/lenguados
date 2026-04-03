## Why

A comprehensive 12-agent audit of @lenguados/math2d identified API inconsistencies, a bug in Rotation2.negated, and constants that don't serve the library's algebraic or practical needs. The current uncommitted changes incorrectly applied `@deprecated` annotations instead of making definitive decisions. This change makes the final, clean cuts: delete what doesn't belong, keep what does, fix what's broken. No deprecated code will remain — the result is the definitive API.

## What Changes

### Deletions (15 constants) — **BREAKING**

- **Delete 4× EPSILON\_\* constants** (Vector2, Complex, Matrix2, Matrix3): Tolerance is inherently scalar; no API method consumes an epsilon vector/matrix. Zero internal usage.
- **Delete 4× Complex scalar wrappers** (SQRT2, SQRT2_INV, PI, E): Real scalars wrapped as Complex(x,0) have no algebraic significance. `Math.*` platform constants exist.
- **Delete 2× Matrix.ONE** (Matrix2, Matrix3): Name is misleading (not the multiplicative identity — that's IDENTITY). All-ones matrix is degenerate rank-1.
- **Delete 4× Matrix SCALE_2/SCALE_HALF** (Matrix2, Matrix3): Arbitrary scale factors. `fromScale(n)` is the idiomatic factory pattern.
- **Delete Interval.PERCENT**: Ambiguous convention (0-100 vs 0-1). `Interval.UNIT` [0,1] covers normalized percentages.

### Restorations (25 items — remove @deprecated, keep code)

- **Restore Vector2.NEGATIVE_ONE**: Symmetry with ONE, same as UNIT_X/NEGATIVE_UNIT_X pattern.
- **Restore Vector2.UNIT_DIAGONAL, NEGATIVE_UNIT_DIAGONAL**: 45° is fundamental in 2D gamedev. Irrational values (√2/2) are error-prone inline.
- **Restore Interval.DEGREES, RADIANS**: Standard angular ranges for a 2D math library that works with angles.
- **Restore 20× Matrix2/3 floor/ceil/round/trunc/sign**: The library has abs/min/max/clamp/mod/lerp/smoothStep on matrices NOT deprecated. Deprecating only floor/ceil/round/trunc/sign is an arbitrary asymmetry with no principled justification.

### Bug Fix + API Completion — **BREAKING** (behavioral change)

- **Fix Rotation2.negated**: Currently computes (cos,-sin) which is conjugation/inversion, identical to `inversed`. True component-wise negation is (-cos,-sin) = rotation by θ+π. Every other core type's `negated` does component-wise sign flip.
- **Add Rotation2 static negate() and instance negate()**: Rotation2 is the only core type missing these. All 5 other types have all three: static negate(), instance negate(), getter negated.

### Cleanup

- Remove all `@deprecated` annotations from code — no deprecated items will remain.
- Delete tests that only verify deleted constants.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `core-types-api`: Constant inventory changes (15 deletions, 5 restorations). Rotation2.negated behavioral fix. Rotation2 negate() addition.
- `api-conventions`: Component-wise operation consistency enforcement (floor/ceil/round/trunc/sign on matrices).

## Impact

- **Layer 2 (core/)**: 7 files modified (vector2, complex, matrix2, matrix3, interval, rotation2, transform2)
- **Tests**: ~10 test cases deleted (self-verifying tests for deleted constants), ~6 test cases added (Rotation2 negate/negated)
- **Breaking changes**: 15 constant deletions + Rotation2.negated behavioral change. Requires major version bump.
- **Bundle size**: Slight reduction from deleted constants.
- **Determinism**: Not affected — no changes to deterministic layer or numerical algorithms.
- **Tree-shaking**: Unaffected — deleted constants were tree-shakeable but unused.
