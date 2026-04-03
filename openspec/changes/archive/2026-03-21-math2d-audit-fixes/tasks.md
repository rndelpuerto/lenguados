# Tasks — math2d-audit-fixes

## Group 1: Delete Constants (source)

- [x] 1.1 Delete `EPSILON_VECTOR` from vector2.ts (remove the static readonly property + @deprecated annotation)
- [x] 1.2 Delete `EPSILON_COMPLEX`, `SQRT2`, `SQRT2_INV`, `PI`, `E` from complex.ts (5 constants)
- [x] 1.3 Delete `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF` from matrix2.ts (4 constants)
- [x] 1.4 Delete `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF` from matrix3.ts (4 constants)
- [x] 1.5 Delete `PERCENT` from interval.ts (1 constant)

## Group 2: Restore Constants (remove @deprecated annotations)

- [x] 2.1 Remove @deprecated from `NEGATIVE_ONE`, `UNIT_DIAGONAL`, `NEGATIVE_UNIT_DIAGONAL` in vector2.ts
- [x] 2.2 Remove @deprecated from `DEGREES`, `RADIANS` in interval.ts

## Group 3: Restore Matrix Methods (remove @deprecated annotations)

- [x] 3.1 Remove @deprecated from `floor`, `ceil`, `round`, `trunc`, `sign` static methods in matrix2.ts (5 methods)
- [x] 3.2 Remove @deprecated from `floor`, `ceil`, `round`, `trunc`, `sign` instance methods in matrix2.ts (5 methods)
- [x] 3.3 Remove @deprecated from `floor`, `ceil`, `round`, `trunc`, `sign` static methods in matrix3.ts (5 methods)
- [x] 3.4 Remove @deprecated from `floor`, `ceil`, `round`, `trunc`, `sign` instance methods in matrix3.ts (5 methods)

## Group 4: Fix Rotation2 Negate API

- [x] 4.1 Fix `negated` getter implementation: change `(this.cos, -this.sin)` to `(-this.cos, -this.sin)`, remove @deprecated
- [x] 4.2 Add static `negate(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2` method
- [x] 4.3 Add instance `negate(): this` method

## Group 5: Delete Orphaned Tests

- [x] 5.1 Delete Matrix2 constant tests: ONE, EPSILON_MATRIX, SCALE_2, SCALE_HALF tests in matrix2.node.spec.ts
- [x] 5.2 Delete Matrix3 constant tests: ONE, EPSILON_MATRIX, SCALE_2, SCALE_HALF tests in matrix3.node.spec.ts
- [x] 5.3 Delete Interval.PERCENT test in interval.node.spec.ts

## Group 6: Add Rotation2 Tests

- [x] 6.1 Add tests for Rotation2.negated getter (verify (-cos, -sin) behavior, verify ≠ inversed)
- [x] 6.2 Add tests for Rotation2 static negate() (with and without out param)
- [x] 6.3 Add tests for Rotation2 instance negate() (mutates in place, returns this)

## Group 7: Verify

- [x] 7.1 Run `npm run test:unit` — 3317 tests pass, 41 suites, 0 failures
- [x] 7.2 Run `npm run lint` — zero errors, zero warnings
