## ADDED Requirements

### Requirement: Vector2 is the reference type for API patterns

Vector2 SHALL be the most complete core type and serve as the reference implementation
for all API patterns. All other types SHALL follow Vector2's patterns unless the
mathematical domain prevents it.

Vector2 SHALL provide:

- **Factories**: `fromValues`, `clone`, `copy`, `fromAngle`, `fromObject`, `fromArray`, `fromComplex`
- **Arithmetic** (static + instance): `add`, `subtract`, `multiply`, `scale`, `divide`/`divideSafe`/`divideUnchecked`, `negate`, `addScalar`, `subtractScalar`, `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked`, `addScaledVector`, `fma`, `mod`, `modScalar`
- **Numeric transforms**: `floor`, `ceil`, `round`, `trunc`, `abs`, `sign`, `inverse`/`inverseSafe`/`inverseUnchecked`, `swap`, `step`, `min`, `max`, `clamp`, `clampScalar`
- **Interpolation**: `lerp`, `lerpClamped`, `slerp`, `slerpClamped`, `smoothStep`
- **Geometry**: `magnitude`, `magnitudeSq`, `distance`, `distanceSq`, `dotProduct`, `crossProduct`, `angle`, `angleTo`, `angleBetween`, `normalize`/`normalizeSafe`/`normalizeUnchecked`, `rotate`/`rotateCS`, `rotateAround`/`rotateAroundCS`, `project`, `projectOnUnit`, `reflect`/`reflectSafe`, `reject`, `rejectOnUnit`, `perpendicular`, `crossScalarRight`, `crossScalarLeft`
- **Magnitude control**: `setMagnitude`/`setMagnitudeSafe`, `setAngle`, `clampMagnitude`, `limit`
- **Application**: `applyRotation2`, `applyMatrix2`, `applyMatrix3`, `applyTransform2`, `applyComplex`
- **Comparison**: `exactEquals`, `nearEquals`, `isZero`, `isNearZero`, `isFinite`

#### Scenario: Static and instance parity

- **WHEN** a method exists as static on Vector2
- **THEN** a corresponding instance method SHALL exist (unless it is a factory or query returning a new type)

#### Scenario: Triality for fallible operations

- **WHEN** an operation can fail (normalize zero vector, divide by zero, reflect on zero normal)
- **THEN** it SHALL have strict/Safe/Unchecked variants on both static and instance

---

### Requirement: Rotation2 conversion method — toMatrix2

Rotation2 already provides `toVector2(out?)` (rotation2.ts:1528) and `toComplex(out?)` (rotation2.ts:1508).
The only missing conversion is:

- `toMatrix2(out?)` — returns the 2x2 rotation matrix **(NEW)**

This is an instance method returning a new Matrix2 (or writing to `out`).

#### Scenario: Rotation2 to Matrix2 round-trip

- **WHEN** `Rotation2.fromAngle(angle).toMatrix2()` is called
- **THEN** the result SHALL nearEqual `Matrix2.fromRotation(angle)` within EPSILON

---

### Requirement: Complex conversion methods

Complex SHALL provide:

- `toVector2(out?)` — returns `Vector2(real, imag)`

#### Scenario: Complex to Vector2

- **WHEN** `new Complex(3, 4).toVector2()` is called
- **THEN** it SHALL return `Vector2(3, 4)`

---

### Requirement: Matrix2 transformVector — already exists (verification only)

Matrix2 already provides `transformVector` as both static (matrix2.ts:1460) and
instance (matrix2.ts:2484). No implementation needed — this requirement documents
the existing API for completeness and verification.

---

### Requirement: Interval set operations — partially existing

`Interval.union` already exists (static interval.ts:1036, instance interval.ts:1498).
`Interval.intersect` already exists (static interval.ts:1062, instance interval.ts:1479)
and returns `Interval | undefined` for disjoint sets — this is the correct behavior
(represents empty set ∅, documented in exhaustive_edge_cases.md).

New methods to add:

- `expand(interval, delta, out?)` static + instance `expand(delta)` — grow both ends by delta **(NEW)**
- `shrink(interval, delta, out?)` static + instance `shrink(delta)` — shrink both ends, clamped to center **(NEW)**

Note: The existing `expanded` getter uses a fixed EPSILON delta; the new `expand(delta)` is a
parametrized version. The method name `intersect` (not `intersection`) matches the existing API.

#### Scenario: Expand interval

- **WHEN** `Interval.expand({ min: 2, max: 8 }, 1)` is called
- **THEN** it SHALL return `Interval(1, 9)`

#### Scenario: Shrink interval clamped to center

- **WHEN** `Interval.shrink({ min: 4, max: 6 }, 5)` is called (delta exceeds half-width)
- **THEN** it SHALL return `Interval(5, 5)` (clamped to center point)

#### Scenario: Intersect disjoint returns undefined

- **WHEN** `Interval.intersect({ min: 1, max: 3 }, { min: 5, max: 8 })` is called
- **THEN** it SHALL return `undefined` (empty set ∅, not `Interval(0, 0)`)

---

### Requirement: Transform2 convenience factory fromPose

Transform2 SHALL provide:

- `static fromPose(x: number, y: number, angle: number, out?: Transform2): Transform2`

This sets position to (x, y), rotation to Rotation2.fromAngle(angle), and scale to (1, 1).

#### Scenario: fromPose creates positioned and rotated transform

- **WHEN** `Transform2.fromPose(100, 50, QUARTER_PI)` is called
- **THEN** position SHALL be `(100, 50)`, rotation angle SHALL nearEqual `QUARTER_PI`, scale SHALL be `(1, 1)`

---

### Requirement: Cross-type method family consistency

All core types that support a method family SHALL implement it using the same pattern:

| Method Family            | Vector2         | Rotation2 | Complex          | Matrix2 | Matrix3 | Transform2   | Interval         |
| ------------------------ | --------------- | --------- | ---------------- | ------- | ------- | ------------ | ---------------- |
| Factories (from\*)       | YES             | YES       | YES              | YES     | YES     | YES          | YES              |
| clone/copy               | YES             | YES       | YES              | YES     | YES     | YES          | YES              |
| exactEquals/nearEquals   | YES             | YES       | YES              | YES     | YES     | YES          | YES              |
| lerp/lerpClamped         | YES             | YES       | YES              | YES     | YES     | YES          | NO               |
| slerp/slerpClamped       | YES             | YES       | YES              | NO      | NO      | YES          | NO               |
| smoothStep               | YES             | YES       | YES              | YES     | YES     | YES          | NO               |
| normalize/Safe/Unchecked | YES             | YES       | YES              | NO      | NO      | NO           | NO               |
| inverse/Safe/Unchecked   | YES (component) | YES       | YES (reciprocal) | YES     | YES     | NO (see D6b) | YES (reciprocal) |
| negate                   | YES             | YES       | YES              | YES     | YES     | NO           | YES              |
| isIdentity               | NO              | YES       | YES              | YES     | YES     | YES          | NO               |
| isFinite                 | YES             | YES       | NO               | YES     | YES     | NO           | NO               |
| toArray                  | YES             | YES       | YES              | YES     | YES     | YES          | YES              |
| fromArray                | YES             | YES       | YES              | YES     | YES     | YES          | YES              |

Entries marked YES MUST exist. Entries marked NO are intentionally absent
(mathematically inappropriate for that type).

#### Scenario: Rotation2 has slerp but Matrix2 does not

- **WHEN** checking for `slerp` on Matrix2
- **THEN** it SHALL NOT exist — spherical interpolation is not defined for arbitrary 2x2 matrices

#### Scenario: All types have clone and copy

- **WHEN** checking any core type
- **THEN** it SHALL have both `static clone(source, out?)` and `static copy(source, destination)` methods

---

### Requirement: Complex instance methods return this

All Complex instance mutation methods SHALL return `this` for fluent chaining,
matching the pattern established by Vector2 and all other core types.

#### Scenario: Complex arithmetic chaining

- **WHEN** `complex.add(other).scale(2).conjugate()` is called
- **THEN** each method SHALL mutate `this` and return `this`, enabling the chain

---

### Requirement: Core type toArray and fromArray symmetry

All core types SHALL provide:

- `static fromArray(array, offset?, out?)` — construct from flat numeric array
- Instance: `toArray(array?, offset?)` — write to flat numeric array, return array

For matrix types, `fromArray` SHALL accept an optional `columnMajor` boolean parameter.

#### Scenario: Vector2 round-trip through array

- **WHEN** `Vector2.fromArray(new Vector2(3, 4).toArray())` is called
- **THEN** it SHALL return a vector exactEquals to `Vector2(3, 4)`

#### Scenario: Matrix3 fromArray with row-major input

- **WHEN** `Matrix3.fromArray(data, 0, false)` is called with `columnMajor = false`
- **THEN** it SHALL transpose during construction to store in column-major format
