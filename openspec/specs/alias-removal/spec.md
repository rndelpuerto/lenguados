## ADDED Requirements

### Requirement: Unified multiplyScalar across all core types

All 5 core numeric types (Vector2, Complex, Interval, Matrix2, Matrix3) SHALL use `multiplyScalar` as the canonical name for scalar multiplication of all components. The former name `scale` SHALL be removed from all types to eliminate ambiguity with geometric scaling operations (`fromScale`, `scaleBy`, `getScale`).

#### Scenario: multiplyScalar exists on all 5 types (static)

- **WHEN** the static methods of Vector2, Complex, Interval, Matrix2, Matrix3 are inspected
- **THEN** each SHALL have a `multiplyScalar(input, scalar, out?)` static method

#### Scenario: multiplyScalar exists on all 5 types (instance)

- **WHEN** the instance methods of Vector2, Complex, Interval, Matrix2, Matrix3 are inspected
- **THEN** each SHALL have a `multiplyScalar(scalar)` instance method returning `this`

#### Scenario: No public scale() methods remain for scalar multiplication

- **WHEN** the entire `packages/math2d/src/` directory is searched for `public scale(` or `public static scale(`
- **THEN** zero matches SHALL be found

#### Scenario: Geometric scale methods are unaffected

- **WHEN** `fromScale`, `scaleBy`, `getScale`, `decompose` methods are inspected
- **THEN** they SHALL remain unchanged — these refer to geometric scaling, not scalar multiplication

---

### Requirement: Remove argument() from Complex, keep angle

The instance method `Complex.prototype.argument()` and the static method `Complex.argument(complex)` SHALL be removed. The `angle` getter and `Complex.angle(complex)` static method SHALL contain the computation directly (`atan2(imag, real)`), consistent with `Vector2.angle` and `Rotation2.angle`.

#### Scenario: Complex.argument no longer exists (static or instance)

- **WHEN** `packages/math2d/src/` is searched for `.argument(`
- **THEN** zero matches SHALL be found

#### Scenario: Complex.angle returns correct values

- **GIVEN** `z = new Complex(1, 1)`
- **WHEN** `z.angle` is accessed
- **THEN** the value SHALL be approximately `PI / 4`

#### Scenario: Complex.angleDegrees and angleTurns still work

- **GIVEN** `z = new Complex(0, 1)`
- **WHEN** `z.angleDegrees` and `z.angleTurns` are accessed
- **THEN** they SHALL return approximately `90` and `0.25` respectively

---

### Requirement: Interval division uses divideScalar naming convention

The `Interval.divide(scalar)`, `Interval.divideSafe(scalar)`, and `Interval.divideUnchecked(scalar)` methods SHALL be renamed to `divideScalar`, `divideScalarSafe`, `divideScalarUnchecked` respectively. This follows the convention where `verb(type)` operates on the same type and `verbScalar(number)` operates on a scalar.

#### Scenario: Interval.divideScalar triality exists

- **WHEN** the Interval class is inspected
- **THEN** it SHALL have `divideScalar`, `divideScalarSafe`, `divideScalarUnchecked` (static and instance)
- **AND** SHALL NOT have `divide`, `divideSafe`, `divideUnchecked` that take a `number` parameter

#### Scenario: divideScalar throws on zero

- **GIVEN** `i = new Interval(10, 20)`
- **WHEN** `i.divideScalar(0)` is called
- **THEN** it SHALL throw `RangeError`

#### Scenario: divideScalarSafe returns zero on zero

- **GIVEN** `i = new Interval(10, 20)`
- **WHEN** `i.divideScalarSafe(0)` is called
- **THEN** `i` SHALL be `Interval(0, 0)`

---

### Requirement: Consistent scalar parameter naming in fma

The `fma` method across Vector2, Matrix2, and Matrix3 SHALL use `scalar` as the parameter name for the scalar multiplier, not `scale`. This avoids confusion with geometric scaling operations.

#### Scenario: All fma methods use scalar parameter name

- **WHEN** the `fma` method signatures in Vector2, Matrix2, Matrix3 are inspected
- **THEN** the scalar parameter SHALL be named `scalar` in all 6 methods (3 static + 3 instance)

---

### Requirement: All tests updated to use canonical names

All test files SHALL use the canonical method names (`multiplyScalar`, `angle`, `divideScalar`). No tests SHALL reference removed names (`scale` for scalar multiplication, `argument`, `divide` on Interval for scalar division).

#### Scenario: Full test suite passes

- **WHEN** `npm run test:unit` is executed
- **THEN** all tests SHALL pass with zero failures

#### Scenario: No removed names in test files

- **WHEN** test files are searched for `.scale(`, `.argument(`, `Interval.divide(`
- **THEN** zero matches SHALL be found (excluding geometric `scaleBy`/`fromScale` and Complex/Vector2 `divide(type)`)
