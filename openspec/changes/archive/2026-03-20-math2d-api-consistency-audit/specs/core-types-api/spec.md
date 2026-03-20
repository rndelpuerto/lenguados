## ADDED Requirements

### Requirement: R-ROT-FROMMATRIX2 — Rotation2.fromMatrix2(matrix) SHALL extract rotation from Matrix2

`Rotation2.fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2` SHALL extract the rotation angle from the Matrix2 using `atan2(m01, m00)` and construct a Rotation2 via `fromAngle`. This completes the Rotation2 <-> Matrix2 round-trip conversion.

#### Scenario: WHEN fromMatrix2 is called with a pure rotation matrix THEN the rotation is extracted

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 4)`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be near-equal to `Rotation2.fromAngle(PI / 4)` within `EPSILON`

#### Scenario: WHEN fromMatrix2 is called with a scaled rotation matrix THEN rotation is still correct

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 3), Matrix2.fromScale(2, 3))`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be near-equal to `Rotation2.fromAngle(PI / 3)` within `EPSILON`

#### Scenario: WHEN fromMatrix2 is called with identity THEN identity rotation is returned

- **GIVEN** `matrix = Matrix2.IDENTITY`
- **WHEN** `Rotation2.fromMatrix2(matrix)` is called
- **THEN** the result SHALL be `Rotation2(1, 0)` (identity rotation, angle = 0)

#### Scenario: WHEN fromMatrix2 is called with out parameter THEN result is written to out

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 6)` and `out = new Rotation2()`
- **WHEN** `result = Rotation2.fromMatrix2(matrix, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.cos` SHALL be approximately `cos(PI / 6)`

---

### NOTE: Rotation2.slerp alias — REMOVED (Agnostic Library Review)

The original proposal to add `Rotation2.slerp` as an alias for `Rotation2.lerp` has been **removed**. For 2D rotations represented as unit complex numbers, `lerp` already performs spherical interpolation — there is no mathematical distinction. The `slerp` name imports 3D quaternion terminology into a 2D context and creates confusion about whether the two methods differ. Discoverability is better served by a `@remarks` note in `Rotation2.lerp` JSDoc stating the equivalence with slerp for users familiar with quaternion APIs.

**Action:** Add `@remarks` to `Rotation2.lerp` JSDoc: "For 2D rotations represented as unit complex numbers, lerp is equivalent to slerp (spherical linear interpolation). No separate slerp method is provided."

---

### Requirement: R-MAT2-GETROT — Matrix2.getRotation(matrix) static SHALL exist

`Matrix2.getRotation(matrix: ReadonlyMatrix2Like): number` SHALL extract the rotation angle from a Matrix2 using `atan2(m01, m00)` and return the angle in radians. This mirrors the existing `Matrix3.getRotation` API.

#### Scenario: WHEN getRotation is called on a pure rotation matrix THEN the angle is extracted

- **GIVEN** `matrix = Matrix2.fromRotation(PI / 3)`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be approximately `PI / 3` within `EPSILON`

#### Scenario: WHEN getRotation is called on a scaled rotation THEN only rotation is returned

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 6), Matrix2.fromScale(3, 3))`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be approximately `PI / 6` within `EPSILON`

#### Scenario: WHEN getRotation is called on identity THEN angle is zero

- **GIVEN** `matrix = Matrix2.IDENTITY`
- **WHEN** `angle = Matrix2.getRotation(matrix)` is called
- **THEN** `angle` SHALL be `0`

---

### Requirement: R-MAT2-GETSCALE — Matrix2.getScale(matrix, out?) static SHALL exist

`Matrix2.getScale(matrix: ReadonlyMatrix2Like, out?: Vector2): Vector2` SHALL extract the scale from a Matrix2 by computing column magnitudes: `sx = hypot(m00, m01)`, `sy = hypot(m10, m11)`. The returned scales are always non-negative (magnitudes). This mirrors the existing `Matrix3.getScale` API.

#### Scenario: WHEN getScale is called on a pure scale matrix THEN scale is extracted

- **GIVEN** `matrix = Matrix2.fromScale(2, 3)`
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be `2` and `scale.y` SHALL be `3`

#### Scenario: WHEN getScale is called on a rotated+scaled matrix THEN magnitudes are correct

- **GIVEN** `matrix = Matrix2.multiply(Matrix2.fromRotation(PI / 4), Matrix2.fromScale(2, 3))`
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be approximately `2` and `scale.y` SHALL be approximately `3` within `EPSILON`

#### Scenario: WHEN getScale is called with out parameter THEN result is written to out

- **GIVEN** `matrix = Matrix2.fromScale(5, 7)` and `out = new Vector2()`
- **WHEN** `result = Matrix2.getScale(matrix, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.x` SHALL be `5` and `out.y` SHALL be `7`

#### Scenario: WHEN getScale is called on a reflected matrix THEN scales are positive

- **GIVEN** `matrix = Matrix2.fromScale(2, -3)` (reflection in Y)
- **WHEN** `scale = Matrix2.getScale(matrix)` is called
- **THEN** `scale.x` SHALL be `2` and `scale.y` SHALL be `3` (positive magnitudes, not signed)

---

### NOTE: Vector2.moveTowards — REMOVED (Agnostic Library Review)

The original proposal to add `Vector2.moveTowards(current, target, maxDelta, out?)` has been **removed**. This is a game engine convenience (Unity `Vector2.MoveTowards`, Godot `move_toward`) that composes existing mathematical primitives (`subtract`, `magnitude`, `normalize`, `scale`, `add`). Pure math libraries (glm, nalgebra, Eigen) do not include this operation. It encodes movement semantics (current → target with speed limit) rather than a mathematical primitive. Consumer packages building on math2d (e.g., a physics engine) can trivially compose this in ~5 lines from the existing API.

---

### Requirement: R-VEC-TIERS — Vector2 SHALL have setMagnitudeUnchecked, reflectUnchecked, directionToSafe instance methods

The following instance methods SHALL be added to complete validation tier symmetry:

1. `Vector2.prototype.setMagnitudeUnchecked(length)` — sets magnitude without zero-check.
2. `Vector2.prototype.reflectUnchecked(normal)` — reflects without validating normal is unit-length.
3. `Vector2.prototype.directionToSafe(target)` — returns direction to target, returning `Vector2(0, 0)` if coincident.

#### Scenario: WHEN setMagnitudeUnchecked is called on a non-zero vector THEN magnitude is set

- **GIVEN** `v = new Vector2(3, 4)` (magnitude = 5)
- **WHEN** `v.setMagnitudeUnchecked(10)` is called
- **THEN** `v` SHALL be `Vector2(6, 8)` (direction preserved, magnitude = 10)

#### Scenario: WHEN setMagnitudeUnchecked is called on a zero vector THEN result is NaN

- **GIVEN** `v = new Vector2(0, 0)`
- **WHEN** `v.setMagnitudeUnchecked(5)` is called
- **THEN** the function SHALL NOT throw (unchecked variant)
- **AND** the result MAY contain `NaN` components

#### Scenario: WHEN reflectUnchecked is called THEN no validation occurs on normal

- **GIVEN** `v = new Vector2(1, -1)` and `normal = { x: 0, y: 1 }`
- **WHEN** `v.reflectUnchecked(normal)` is called
- **THEN** `v` SHALL be `Vector2(1, 1)` (reflected about Y-axis normal)
- **AND** no `isUnit(normal)` check SHALL be performed

#### Scenario: WHEN directionToSafe is called with coincident points THEN zero vector is returned

- **GIVEN** `v = new Vector2(5, 5)` and `target = { x: 5, y: 5 }`
- **WHEN** `v.directionToSafe(target)` is called
- **THEN** `v` SHALL be `Vector2(0, 0)` (safe fallback for zero-distance)

#### Scenario: WHEN directionToSafe is called with distinct points THEN direction is computed

- **GIVEN** `v = new Vector2(0, 0)` and `target = { x: 3, y: 4 }`
- **WHEN** `v.directionToSafe(target)` is called
- **THEN** `v` SHALL be `Vector2(0.6, 0.8)` (normalized direction)

---

### Requirement: R-CX-DIVSCALAR — Complex.divideScalar/Safe/Unchecked SHALL exist

`Complex.divideScalar(z: ReadonlyComplexLike, s: number, out?: Complex): Complex` SHALL divide both real and imaginary components by the scalar `s`. Three tiers SHALL exist following the exact pattern of `Vector2.divideScalar`:

1. `divideScalar` — throws `RangeError` when `s` is near zero.
2. `divideScalarSafe` — returns `Complex(0, 0)` when `s` is near zero.
3. `divideScalarUnchecked` — no validation.

Instance counterparts SHALL also exist.

#### Scenario: WHEN divideScalar is called with valid scalar THEN components are divided

- **GIVEN** `z = Complex(6, 8)` and `s = 2`
- **WHEN** `Complex.divideScalar(z, s)` is called
- **THEN** the result SHALL be `Complex(3, 4)`

#### Scenario: WHEN divideScalar is called with zero scalar THEN it throws

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalar(z, s)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN divideScalarSafe is called with zero scalar THEN fallback is returned

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalarSafe(z, s)` is called
- **THEN** the result SHALL be `Complex(0, 0)`

#### Scenario: WHEN divideScalarUnchecked is called with zero scalar THEN no throw

- **GIVEN** `z = Complex(6, 8)` and `s = 0`
- **WHEN** `Complex.divideScalarUnchecked(z, s)` is called
- **THEN** the function SHALL NOT throw (result is `Complex(Infinity, Infinity)` or similar)

#### Scenario: WHEN instance divideScalar is called THEN it mutates this

- **GIVEN** `z = new Complex(10, 20)`
- **WHEN** `z.divideScalar(5)` is called
- **THEN** `z` SHALL be `Complex(2, 4)` and the return value SHALL be `z`

---

### Requirement: R-CX-FROMVEC2 — Complex.fromVector2(v, out?) static factory SHALL exist

`Complex.fromVector2(v: ReadonlyVector2Like, out?: Complex): Complex` SHALL create a Complex number from a Vector2, mapping `v.x` to real and `v.y` to imaginary. This completes the bidirectional conversion alongside `Vector2.fromComplex` (or equivalent).

#### Scenario: WHEN fromVector2 is called THEN x maps to real and y maps to imaginary

- **GIVEN** `v = { x: 3, y: 4 }`
- **WHEN** `Complex.fromVector2(v)` is called
- **THEN** the result SHALL be `Complex(3, 4)` (`real = 3`, `imag = 4`)

#### Scenario: WHEN fromVector2 is called with zero vector THEN zero complex is returned

- **GIVEN** `v = { x: 0, y: 0 }`
- **WHEN** `Complex.fromVector2(v)` is called
- **THEN** the result SHALL be `Complex(0, 0)`

#### Scenario: WHEN fromVector2 is called with out parameter THEN result is written to out

- **GIVEN** `v = { x: 1, y: 2 }` and `out = new Complex()`
- **WHEN** `result = Complex.fromVector2(v, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.real` SHALL be `1` and `out.imag` SHALL be `2`

---

### Requirement: R-CX-RECIP — Complex.reciprocal static and instance SHALL use identical zero-detection (magnitude)

Both the static `Complex.reciprocal(z, out?)` and the instance `Complex.prototype.reciprocal()` SHALL use `isNearZero(magnitude)` for their zero-detection guard. The instance method currently uses `magnitudeSquared`, which triggers at `|z| < sqrt(EPSILON) ~ 3.16e-6` instead of `|z| < EPSILON = 1e-10`. This discrepancy SHALL be fixed by changing the instance method to use `magnitude`.

**Note:** This requirement applies specifically to zero-detection in reciprocal. It does NOT establish a blanket ban on magnitudeSq usage. The `isUnit` check correctly uses `|magnitudeSq - 1| < EPSILON` per the ratified api-consistency-triality spec.

#### Scenario: WHEN a complex with magnitude between EPSILON and sqrt(EPSILON) is tested THEN static and instance agree

- **GIVEN** `z = Complex(5e-6, 0)` (magnitude = 5e-6, between `1e-10` and `3.16e-6`)
- **WHEN** `Complex.reciprocal(z)` (static) is called
- **THEN** the result SHALL be `Complex(200000, 0)` (reciprocal computed normally, magnitude `5e-6 > EPSILON`)
- **AND** `new Complex(5e-6, 0).reciprocal()` (instance) SHALL produce the same result

#### Scenario: WHEN a truly zero complex is tested THEN both static and instance throw

- **GIVEN** `z = Complex(0, 0)`
- **WHEN** `Complex.reciprocal(z)` is called
- **THEN** it SHALL throw `RangeError`
- **AND** `new Complex(0, 0).reciprocal()` SHALL also throw `RangeError`

#### Scenario: WHEN a near-zero complex is tested with magnitude below EPSILON THEN both detect zero

- **GIVEN** `z = Complex(5e-11, 0)` (magnitude = 5e-11 < EPSILON)
- **WHEN** `Complex.reciprocalSafe(z)` and `new Complex(5e-11, 0).reciprocalSafe()` are called
- **THEN** both SHALL return the safe fallback value

---

### Requirement: R-INT-ABS — Interval.abs() static + instance SHALL follow Moore's definition

`Interval.abs(interval: ReadonlyIntervalLike, out?: Interval): Interval` and `Interval.prototype.abs()` SHALL compute the absolute value of an interval following Moore's interval arithmetic definition:

- If `interval.min >= 0`: result is `[min, max]` (identity).
- If `interval.max <= 0`: result is `[-max, -min]` (flip and negate).
- If interval crosses zero (`min < 0 < max`): result is `[0, max(|min|, |max|)]`.

#### Scenario: WHEN abs is called on a positive interval THEN it is identity

- **GIVEN** `interval = Interval(2, 5)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN abs is called on a negative interval THEN it flips and negates

- **GIVEN** `interval = Interval(-5, -2)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN abs is called on an interval crossing zero THEN min is zero

- **GIVEN** `interval = Interval(-3, 7)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(0, 7)` (max of `|-3|=3` and `|7|=7` is `7`)

#### Scenario: WHEN abs is called on a symmetric interval THEN max is the absolute bound

- **GIVEN** `interval = Interval(-4, 4)`
- **WHEN** `Interval.abs(interval)` is called
- **THEN** the result SHALL be `Interval(0, 4)`

#### Scenario: WHEN instance abs is called THEN it mutates this

- **GIVEN** `i = new Interval(-5, -2)`
- **WHEN** `i.abs()` is called
- **THEN** `i.min` SHALL be `2` and `i.max` SHALL be `5`
- **AND** the return value SHALL be the same reference as `i`

---

### Requirement: R-INT-UNSORTED — Interval.fromUnsorted(a, b) SHALL create with min/max ordering

`Interval.fromUnsorted(a: number, b: number, out?: Interval): Interval` SHALL create an interval from two values that may not be in order, using `Math.min(a, b)` for `min` and `Math.max(a, b)` for `max`.

#### Scenario: WHEN fromUnsorted is called with ordered values THEN result is correct

- **GIVEN** `a = 2` and `b = 5`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN fromUnsorted is called with reversed values THEN result is ordered

- **GIVEN** `a = 5` and `b = 2`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(2, 5)`

#### Scenario: WHEN fromUnsorted is called with equal values THEN degenerate interval is created

- **GIVEN** `a = 3` and `b = 3`
- **WHEN** `Interval.fromUnsorted(a, b)` is called
- **THEN** the result SHALL be `Interval(3, 3)`

#### Scenario: WHEN fromUnsorted is called with out parameter THEN result is written to out

- **GIVEN** `a = 10` and `b = -5` and `out = new Interval()`
- **WHEN** `result = Interval.fromUnsorted(a, b, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** `out.min` SHALL be `-5` and `out.max` SHALL be `10`

---

### Requirement: R-INT-CENTER — Interval.center() SHALL use overflow-safe formula min + (max-min)\*0.5

`Interval.center()` (both static and instance) SHALL compute the center using `min + (max - min) * 0.5` instead of `(min + max) * 0.5`. The naive `(min + max) * 0.5` overflows to `Infinity` when both `min` and `max` are large positive or large negative values (e.g., `min = 1e308`, `max = 1e308`).

#### Scenario: WHEN center is called on a normal interval THEN correct midpoint is returned

- **GIVEN** `interval = Interval(2, 8)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `5`

#### Scenario: WHEN center is called on an interval with extreme values THEN no overflow occurs

- **GIVEN** `interval = Interval(1e308, 1.5e308)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `1.25e308` (not `Infinity`)

#### Scenario: WHEN center is called on a degenerate interval THEN min is returned

- **GIVEN** `interval = Interval(3, 3)`
- **WHEN** `Interval.center(interval)` is called
- **THEN** the result SHALL be `3`

#### Scenario: WHEN instance center is called THEN it matches static

- **GIVEN** `i = new Interval(0, 10)`
- **WHEN** `i.center()` is called
- **THEN** the result SHALL be `5` (same as `Interval.center(i)`)

---

### Requirement: R-INT-HULL — Interval.hull() array form SHALL use instanceof check for out param

When `Interval.hull(array, second?)` is called with an array as the first argument, the `second` parameter serves as the `out` parameter. The implementation SHALL use `instanceof Interval` (or equivalent type guard) to distinguish between `second` being an `out` parameter vs. a value to include in the hull computation. This prevents the ambiguity where a plain `IntervalLike` object passed as `second` could be misinterpreted.

#### Scenario: WHEN hull receives array and Interval instance as second THEN second is out

- **GIVEN** `values = [1, 5, 3]` and `out = new Interval()`
- **WHEN** `Interval.hull(values, out)` is called
- **THEN** `out` SHALL be mutated to `Interval(1, 5)` and the return value SHALL be `out`

#### Scenario: WHEN hull receives array without second THEN new Interval is created

- **GIVEN** `values = [2, 8, 5]`
- **WHEN** `Interval.hull(values)` is called
- **THEN** the result SHALL be a new `Interval(2, 8)`

#### Scenario: WHEN hull receives two scalars THEN second is a value

- **GIVEN** `first = 3` and `second = 7`
- **WHEN** `Interval.hull(first, second)` is called
- **THEN** the result SHALL be `Interval(3, 7)`

---

### Requirement: R-T2-TRANSFORMDIR — Transform2.transformDirection/inverseTransformDirection SHALL exist

`Transform2.transformDirection(transform: ReadonlyTransform2Like, direction: ReadonlyVector2Like, out?: Vector2): Vector2` SHALL apply only the rotation component of the transform to a vector, ignoring scale and translation. This is a standard linear algebra operation: extracting and applying the orthogonal (rotational) part of an affine transform. The JSDoc SHALL explicitly state "applies rotation only, ignores scale and translation."

`Transform2.inverseTransformDirection(transform: ReadonlyTransform2Like, direction: ReadonlyVector2Like, out?: Vector2): Vector2` SHALL apply the inverse rotation.

Following the existing `*CS` convention (R4), `transformDirectionCS(cos, sin, direction, out?)` and `inverseTransformDirectionCS(cos, sin, direction, out?)` static variants SHALL also exist, accepting pre-computed cos/sin values for use in performance-critical code paths.

Instance counterparts SHALL also exist for all variants.

#### Scenario: WHEN transformDirection is called THEN only the rotation component is applied

- **GIVEN** `transform = Transform2(position=(10, 20), rotation=PI/2, scale=(2, 3))`
- **WHEN** `Transform2.transformDirection(transform, { x: 1, y: 0 })` is called
- **THEN** the result SHALL be approximately `Vector2(0, 1)` (rotated 90 degrees; scale and translation are ignored)

#### Scenario: WHEN inverseTransformDirection is called THEN inverse rotation is applied

- **GIVEN** `transform = Transform2(position=(10, 20), rotation=PI/2, scale=(2, 3))`
- **WHEN** `Transform2.inverseTransformDirection(transform, { x: 0, y: 1 })` is called
- **THEN** the result SHALL be approximately `Vector2(1, 0)` (inverse rotation of 90 degrees)

#### Scenario: WHEN transformDirection round-trips THEN original direction is recovered

- **GIVEN** `transform` with any rotation and `dir = { x: 0.6, y: 0.8 }`
- **WHEN** `recovered = Transform2.inverseTransformDirection(transform, Transform2.transformDirection(transform, dir))` is computed
- **THEN** `recovered` SHALL be near-equal to `Vector2(0.6, 0.8)` within `EPSILON`

#### Scenario: WHEN instance transformDirection is called THEN it mutates this direction argument

- **GIVEN** `t = new Transform2()` with `rotation = PI/4` and `v = new Vector2(1, 0)`
- **WHEN** `t.transformDirection(v)` is called
- **THEN** `v` SHALL be approximately `Vector2(cos(PI/4), sin(PI/4))`

---

### Requirement: R-T2-PREMULTIPLY — Transform2.premultiply(other) SHALL compute other \* this

`Transform2.prototype.premultiply(other: ReadonlyTransform2Like): this` SHALL compute `this = other * this` (premultiplication). This is the reverse of `multiply(other)` which computes `this = this * other`. Since transform composition is non-commutative, both multiplication orders are required for algebraic completeness.

The implementation SHALL delegate to `Transform2.multiply(other, this, this)`.

#### Scenario: WHEN premultiply is called THEN other is applied first

- **GIVEN** `child = Transform2(position=(1, 0), rotation=0, scale=(1, 1))`
- **AND** `parent = Transform2(position=(0, 0), rotation=PI/2, scale=(1, 1))`
- **WHEN** `child.premultiply(parent)` is called
- **THEN** `child` SHALL represent the composition `parent * child`
- **AND** the result SHALL be different from `child.multiply(parent)` (which computes `child * parent`)

#### Scenario: WHEN premultiply is called THEN it returns this for chaining

- **GIVEN** `t = new Transform2()`
- **WHEN** `result = t.premultiply(Transform2.IDENTITY)` is called
- **THEN** `result` SHALL be the same reference as `t`

#### Scenario: WHEN premultiply with identity THEN transform is unchanged

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `t.premultiply(Transform2.IDENTITY)` is called
- **THEN** `t` SHALL be unchanged (identity is the neutral element for multiplication)
