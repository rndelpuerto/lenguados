## ADDED Requirements

### NOTE: Vector2.moveTowards — REVERSED

This addition was proposed but REVERSED during adversarial review. The ratified spec at `openspec/specs/core-types-api/spec.md:649` explicitly rejected `moveTowards` as "a game engine convenience that composes existing mathematical primitives."

---

### Requirement: Matrix3.fromReflection static factory

`Matrix3.fromReflection(normal, out?)` SHALL create a 3x3 reflection matrix about a line passing through the origin with the given normal vector. The normal SHALL be a `ReadonlyVector2Like`. The reflection matrix for normal `(nx, ny)` is the Householder reflector `I - 2nn^T`:

```
| 1 - 2*nx*nx   -2*nx*ny      0 |
| -2*nx*ny       1 - 2*ny*ny   0 |
| 0              0              1 |
```

The normal is assumed to be unit length (no normalization performed). The Householder reflector is a fundamental linear algebra operation found in every numerical methods textbook.

#### Scenario: Reflection about Y-axis (normal = (1, 0))

- **GIVEN** `normal = { x: 1, y: 0 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** the result SHALL be a matrix that negates x-coordinates: `m00 = -1, m01 = 0, m10 = 0, m11 = 1`

#### Scenario: Reflection about X-axis (normal = (0, 1))

- **GIVEN** `normal = { x: 0, y: 1 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** the result SHALL be a matrix that negates y-coordinates: `m00 = 1, m01 = 0, m10 = 0, m11 = -1`

#### Scenario: Reflection about diagonal (normal = (√2/2, √2/2))

- **GIVEN** `normal = { x: Math.SQRT1_2, y: Math.SQRT1_2 }`
- **WHEN** `Matrix3.fromReflection(normal)` is called
- **THEN** `m00` and `m11` SHALL be approximately `0`, `m01` and `m10` SHALL be approximately `-1`
- **AND** applying this matrix to `Vector2(1, 0)` SHALL yield approximately `Vector2(0, -1)`

#### Scenario: out parameter avoids allocation

- **GIVEN** `normal = { x: 1, y: 0 }` and `out = new Matrix3()`
- **WHEN** `Matrix3.fromReflection(normal, out)` is called
- **THEN** the return value SHALL be `out` (same reference)

---

### NOTE: Complex.fromAngle — DEFERRED

This addition is DEFERRED pending further review. It is a trivial one-argument alias for `Complex.fromPolar(1, angle)`. The discoverability benefit may not outweigh the API surface cost.

---

### Requirement: Transform2 Symbol.iterator implementation

`Transform2` SHALL implement `Symbol.iterator` yielding its numeric components in the order `[position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y]`. This completes the pattern implemented by all other 6 core types (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3).

Note: The yielded components represent semantically heterogeneous quantities (position, rotation, scale). This iterator is primarily useful for serialization and array-buffer interop. The same heterogeneity concern applies to Matrix3 (which mixes rotation, translation, and scale) and it already has an iterator.

#### Scenario: Iterating Transform2 yields 6 numeric components

- **GIVEN** `t = new Transform2({ x: 1, y: 2 }, { cos: 0, sin: 1 }, { x: 3, y: 4 })`
- **WHEN** `[...t]` is evaluated
- **THEN** the result SHALL be `[1, 2, 0, 1, 3, 4]`

#### Scenario: Destructuring Transform2 components

- **GIVEN** `t = Transform2.IDENTITY`
- **WHEN** `const [px, py, rc, rs, sx, sy] = t` is evaluated
- **THEN** `px === 0, py === 0, rc === 1, rs === 0, sx === 1, sy === 1`

---

## MODIFIED Requirements

### NOTE: Vector2.isParallel/isPerpendicular tolerance normalization — DEFERRED

This modification is DEFERRED. The adversarial review found it violates the audit's own constraint of "ZERO behavioral changes to any existing public API that returns correct results." The current absolute tolerance is a mathematically valid (area-based) definition. The proposed normalized tolerance is a different (angle-based) definition. This requires a separate proposal that explicitly acknowledges the behavioral change.

---

### Requirement: Complex.smoothStep and Interval.smoothStep instance — remove redundant saturate

The instance methods `Complex.prototype.smoothStep` and `Interval.prototype.smoothStep` SHALL remove the internal call to `saturate(t)` before passing to `smoothStep(0, 1, t)`, since `smoothStep` already clamps `t` to [0, 1] internally via `saturate((x - edge0) / range)`.

Additionally, `Interval.smoothStep` static (L873) has the same redundancy and SHALL also be fixed.

Affected locations:

- `complex.ts:2431` — instance: `const clamped = saturate(t);` → remove, pass `t` directly
- `interval.ts:873` — static: `smoothStep(0, 1, saturate(t))` → `smoothStep(0, 1, t)`
- `interval.ts:2049` — instance: `smoothStep(0, 1, saturate(t))` → `smoothStep(0, 1, t)`

Note: The Complex static version (L869) and Vector2 versions are already correct (no redundant saturate).

#### Scenario: Complex instance smoothStep produces correct results

- **GIVEN** `z = Complex(0.5, 0)` and `edge0 = Complex(0, 0)` and `edge1 = Complex(1, 0)`
- **WHEN** `z.smoothStep(edge0, edge1)` is called
- **THEN** the result SHALL be identical to before (no behavioral change, just redundant code removal)

#### Scenario: Interval static smoothStep produces correct results

- **GIVEN** `a = Interval(0, 10)` and `b = Interval(20, 30)` and `t = 0.5`
- **WHEN** `Interval.smoothStep(a, b, t)` is called
- **THEN** the result SHALL be identical to before

---

### Requirement: Rotation2.negated deprecation

The `Rotation2.prototype.negated` getter SHALL be marked `@deprecated` with message "Use `inversed` instead — negated is an exact duplicate of inversed for unit rotations." The getter currently returns `{ cos, -sin }` which is identical to `inversed`. Confirmed byte-identical in source at L1551-1553 and L1608-1610.

#### Scenario: negated is deprecated but still functional

- **GIVEN** `r = Rotation2.fromAngle(Math.PI / 4)`
- **WHEN** `r.negated` is accessed
- **THEN** the result SHALL equal `r.inversed` (same cos, same sin values)
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Rotation2 frozen constants typing

Frozen constants `Rotation2.IDENTITY`, `Rotation2.HALF_PI`, `Rotation2.PI`, `Rotation2.NEGATIVE_HALF_PI` SHALL be typed as `ReadonlyRotation2` instead of `ReadonlyRotation2Like`, matching the pattern used by Vector2, Complex, Matrix2, Matrix3, and Interval frozen constants. This is a non-breaking change (widening the type).

#### Scenario: Frozen constants expose full Rotation2 methods

- **GIVEN** `r = Rotation2.IDENTITY`
- **WHEN** `r.angle` is accessed
- **THEN** it SHALL compile and return `0` (ReadonlyRotation2 exposes computed properties, ReadonlyRotation2Like does not)

---

## REMOVED Requirements

### Requirement: Vector2 non-standard constants

The following Vector2 constants SHALL be marked `@deprecated`:

- `EPSILON_VECTOR` — Use `Object.freeze(new Vector2(EPSILON, EPSILON))` as a locally defined constant instead
- `NEGATIVE_ONE` — Use `new Vector2(-1, -1)` instead
- `UNIT_DIAGONAL` — Use `new Vector2(Math.SQRT1_2, Math.SQRT1_2)` instead
- `NEGATIVE_UNIT_DIAGONAL` — Use `new Vector2(-Math.SQRT1_2, -Math.SQRT1_2)` instead

**Reason:** Zero internal usage, zero precedent in any of the 10+ reference libraries audited (including Unity, Godot, Three.js, gl-matrix, Box2D which provide directional constants but NOT these specific ones).
**Migration:** Replace with inline construction as documented in each deprecation tag.

#### Scenario: Deprecated constants still return correct values

- **WHEN** `Vector2.EPSILON_VECTOR` is accessed
- **THEN** it SHALL still return `Vector2(EPSILON, EPSILON)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Complex non-standard constants

The following Complex constants SHALL be marked `@deprecated`:

- `EPSILON_COMPLEX` — Use `Object.freeze(new Complex(EPSILON, EPSILON))` as a locally defined constant instead
- `SQRT2` — Use `new Complex(Math.SQRT2, 0)` instead
- `SQRT2_INV` — Use `new Complex(Math.SQRT1_2, 0)` instead
- `PI` — Use `new Complex(Math.PI, 0)` instead
- `E` — Use `new Complex(Math.E, 0)` instead

**Reason:** Zero internal usage, zero precedent. C++ `std::complex`, NumPy `cmath`, and no other complex number library provides real constants as complex-typed objects.
**Migration:** Replace with inline construction.

#### Scenario: Deprecated constants still return correct values

- **WHEN** `Complex.SQRT2` is accessed
- **THEN** it SHALL still return `Complex(Math.SQRT2, 0)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix2 non-standard constants

The following Matrix2 constants SHALL be marked `@deprecated`:

- `ONE` — Use `Matrix2.fromScalar(1)` instead
- `EPSILON_MATRIX` — No meaningful use case; construct manually if needed
- `SCALE_2` — Use `Matrix2.fromScale(2, 2)` instead
- `SCALE_HALF` — Use `Matrix2.fromScale(0.5, 0.5)` instead

**Reason:** Zero internal usage, zero precedent. Matrix libraries provide Identity, Zero, and construction factories — not arbitrary scale presets.
**Migration:** Replace with factory calls.

#### Scenario: Deprecated constants still function

- **WHEN** `Matrix2.ONE` is accessed
- **THEN** it SHALL still return a matrix with all components set to 1
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix3 non-standard constants

The following Matrix3 constants SHALL be marked `@deprecated`:

- `ONE` — Use `Matrix3.fromScalar(1)` (if available) or construct manually
- `EPSILON_MATRIX` — No meaningful use case
- `SCALE_2` — Use `Matrix3.fromScale(2, 2)` instead
- `SCALE_HALF` — Use `Matrix3.fromScale(0.5, 0.5)` instead

**Reason:** Same as Matrix2 — zero usage, zero precedent.
**Migration:** Replace with factory calls.

#### Scenario: Deprecated constants still function

- **WHEN** `Matrix3.SCALE_2` is accessed
- **THEN** it SHALL still return a 2x scale matrix
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Interval non-standard constants

The following Interval constants SHALL be marked `@deprecated`:

- `PERCENT` (`[0, 100]`) — Application-domain preset, not mathematical primitive
- `DEGREES` (`[0, 360]`) — Application-domain preset, not mathematical primitive
- `RADIANS` (`[0, 2π]`) — Application-domain preset, not mathematical primitive

**Reason:** These are application-domain ranges, not mathematical primitives. No interval arithmetic library (including Boost.Interval) provides preset ranges. Define application-level constants where needed.
**Migration:** Replace with `new Interval(0, 100)`, `new Interval(0, 360)`, `new Interval(0, 2 * Math.PI)`.

#### Scenario: Deprecated constants still function

- **WHEN** `Interval.DEGREES` is accessed
- **THEN** it SHALL still return `Interval(0, 360)`
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### NOTE: Scalar GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE — REVERSED

These deprecations were proposed but REVERSED during adversarial review. The ratified `performance-architecture` spec requires both constants and mandates they share a single `sqrt(5)` computation (already implemented). The prior foundations audit explicitly kept `GOLDEN_RATIO_CONJUGATE` as "computationally useful." GLM and C++20 `std::numbers::phi` also include the golden ratio.

---

### Requirement: Matrix2 component-wise operations deprecation

The following Matrix2 methods SHALL be marked `@deprecated` (both static and instance):

- `floor`, `ceil`, `round`, `trunc`, `sign` — Uncommon for matrices in game/physics math libraries. Access components directly if needed.

**Reason:** GLSL spec limits floor/ceil/round to `genFType` (vectors), NOT `matN` types. gl-matrix, Three.js, Unity, Godot, Box2D do NOT provide these on matrix types. Only GLM (which mirrors GLSL extensions) supports component-wise operations on matrices. For a physics engine math library, these lack precedent.
**Migration:** Access components directly for component-wise operations, which is also the safer approach (avoids accidentally rounding rotation elements).

NOTE: `mod`, `modScalar` are NOT deprecated — they were deliberately added by the ratified API hardening change (2026-03-07) to complete static/instance triality.

NOTE: `addScalar`, `subtractScalar` deprecation is DEFERRED pending further evaluation of their provenance and usage.

#### Scenario: Deprecated methods still produce correct results

- **GIVEN** `m = new Matrix2(1.5, 2.7, 3.1, 4.9)`
- **WHEN** `Matrix2.floor(m)` is called
- **THEN** the result SHALL be `Matrix2(1, 2, 3, 4)` (still functional)
- **AND** TypeScript tooling SHALL show a deprecation warning

---

### Requirement: Matrix3 component-wise operations deprecation

Same as Matrix2: `floor`, `ceil`, `round`, `trunc`, `sign` SHALL be marked `@deprecated` on Matrix3 (both static and instance).

**Reason:** Identical to Matrix2 — uncommon for matrices in game/physics libraries.
**Migration:** Access components directly if needed.

NOTE: `mod`, `modScalar` are NOT deprecated (ratified API hardening). `addScalar`, `subtractScalar` deprecation is DEFERRED.

#### Scenario: Deprecated methods still produce correct results

- **GIVEN** `m = new Matrix3(1.5, 2.7, 3.1, 4.9, 5.2, 6.8, 7.3, 8.1, 9.6)`
- **WHEN** `Matrix3.floor(m)` is called
- **THEN** the result SHALL be `Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9)` (still functional)
- **AND** TypeScript tooling SHALL show a deprecation warning
