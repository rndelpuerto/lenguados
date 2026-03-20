## ADDED Requirements

### Requirement: unwrapAngles SHALL avoid V8 holey array allocation

`unwrapAngles` in `unwrapping.ts` creates `new Array<number>(n)`, which produces a V8 "holey" (sparse) array. Holey arrays use a slower property access path in V8 because the engine must check for holes on every indexed read. The allocation SHALL use `new Float64Array(n)` (preferred for numeric-only output) or `Array.from({ length: n }, () => 0)` to produce a packed/dense array.

**Source:** `packages/math2d/src/auxiliary/angle/unwrapping.ts:41`

**Reference:** V8 blog "Elements kinds in V8" — HOLEY_DOUBLE_ELEMENTS is slower than PACKED_DOUBLE_ELEMENTS for indexed access.

#### Scenario: WHEN unwrapAngles is called with a non-empty array THEN the result uses a dense backing store

- **GIVEN** an input array `angles` of length `n > 0`
- **WHEN** `unwrapAngles(angles)` is called
- **THEN** the result array SHALL be allocated as a packed (non-holey) array or a `Float64Array`, not via `new Array<number>(n)`
- **AND** the result SHALL contain the same unwrapped values as before (no behavioral change)

#### Scenario: WHEN unwrapAngles is called with a large array THEN indexed access is efficient

- **GIVEN** an input array of 100,000 angles
- **WHEN** `unwrapAngles(angles)` is called
- **THEN** every element of the result array SHALL be initialized at allocation time (no holes), ensuring V8 uses the PACKED_DOUBLE_ELEMENTS representation for optimal indexed access throughput

#### Scenario: WHEN unwrapAngles is called with an empty array THEN behavior is unchanged

- **GIVEN** an empty input array `[]`
- **WHEN** `unwrapAngles([])` is called
- **THEN** the result SHALL be `[]` (existing behavior preserved)

---

### Requirement: Matrix3.inverseSafe SHALL avoid double cofactor/determinant computation

`Matrix3.inverseSafe` computes `Matrix3.determinant(matrix)` for the singularity check, then calls `Matrix3.inverseUnchecked(matrix)` which recomputes all cofactors and the determinant internally. This doubles the arithmetic work (18 multiplications + 8 additions for cofactors, repeated twice). The implementation SHALL compute cofactors and the determinant once and reuse them for the inversion, or pass the pre-computed determinant to the inversion step. The same fix SHALL apply to the instance method `inverseSafe()`.

**Source:** `packages/math2d/src/core/matrix3.ts:1809-1814` (static), `packages/math2d/src/core/matrix3.ts:3036-3041` (instance)

#### Scenario: WHEN inverseSafe is called on a non-singular matrix THEN cofactors are computed once

- **GIVEN** a non-singular `Matrix3` with `det !== 0`
- **WHEN** `Matrix3.inverseSafe(matrix)` is called
- **THEN** the cofactors and determinant SHALL be computed exactly once (not twice via separate `determinant()` + `inverseUnchecked()` calls)
- **AND** the result SHALL be identical to the current output (no numerical change)

#### Scenario: WHEN inverseSafe is called on a singular matrix THEN it returns identity without computing the full inverse

- **GIVEN** a singular `Matrix3` with `det === 0`
- **WHEN** `Matrix3.inverseSafe(matrix)` is called
- **THEN** the function SHALL return identity after the determinant check, without proceeding to compute cofactors for inversion

#### Scenario: WHEN instance inverseSafe is called THEN it also avoids double computation

- **GIVEN** a non-singular `Matrix3` instance `m`
- **WHEN** `m.inverseSafe()` is called
- **THEN** the cofactors and determinant SHALL be computed exactly once
- **AND** the result SHALL be identical to `Matrix3.inverseSafe(m)`

---

### Requirement: Matrix3.fromArray SHALL read elements directly without intermediate array

`Matrix3.fromArray` creates `new Array<number>(9)` and copies elements from the source array into it, then reads them back to set matrix components. `Matrix2.fromArray` reads directly from the source array without an intermediate copy. `Matrix3.fromArray` SHALL be consistent with `Matrix2.fromArray` and read elements directly from the source `ArrayLike<number>`, eliminating the unnecessary intermediate `Array<number>(9)` allocation and copy.

**Source:** `packages/math2d/src/core/matrix3.ts:547`

#### Scenario: WHEN fromArray is called THEN no intermediate array is allocated

- **GIVEN** a source `ArrayLike<number>` of length >= 9 and `offset = 0`
- **WHEN** `Matrix3.fromArray(array, offset)` is called
- **THEN** the implementation SHALL read elements directly from `array[offset + i]` without creating an intermediate `Array<number>(9)`
- **AND** the resulting matrix SHALL contain identical values to the current implementation

#### Scenario: WHEN fromArray is called with column-major order THEN direct read produces correct layout

- **GIVEN** `array = [1, 2, 3, 4, 5, 6, 7, 8, 9]` and `columnMajor = true`
- **WHEN** `Matrix3.fromArray(array, 0, true)` is called
- **THEN** the result SHALL have `m00=1, m01=2, m02=3, m10=4, m11=5, m12=6, m20=7, m21=8, m22=9` (same as current)

#### Scenario: WHEN fromArray is called with row-major order THEN direct read with transposition produces correct layout

- **GIVEN** `array = [1, 2, 3, 4, 5, 6, 7, 8, 9]` and `columnMajor = false`
- **WHEN** `Matrix3.fromArray(array, 0, false)` is called
- **THEN** the result SHALL have the transposed layout (same as current behavior, just without the intermediate array)

---

### Requirement: Rotation2.set() SHALL normalize inline without intermediate object allocation

`Rotation2.set(cos, sin)` calls `normalizeComponents(cos, sin)` which returns a `{ cos, sin }` plain object on every invocation. In physics loops where `set()` is called per-frame per-body, this creates garbage-collectable objects at high frequency. The `set()` method SHALL normalize the cos/sin pair inline (compute magnitude, divide, assign) without allocating an intermediate object.

The same inline normalization pattern SHALL be applied to `normalize()` and the `normalized` getter where they call `normalizeComponents()`.

**Source:** `packages/math2d/src/core/rotation2.ts:157-164` (`normalizeComponents`), `rotation2.ts:916-921` (`set`), `rotation2.ts:974-978` (`normalize`), `rotation2.ts:1414-1417` (`normalized` getter)

#### Scenario: WHEN set() is called THEN no intermediate object is created

- **GIVEN** a `Rotation2` instance `r`
- **WHEN** `r.set(3, 4)` is called
- **THEN** the normalization SHALL be computed inline: `magnitude = hypot(3, 4) = 5`, `r.cos = 3/5 = 0.6`, `r.sin = 4/5 = 0.8`
- **AND** no `{ cos, sin }` plain object SHALL be allocated during the operation

#### Scenario: WHEN set() is called with near-zero magnitude THEN identity fallback is applied inline

- **GIVEN** a `Rotation2` instance `r`
- **WHEN** `r.set(0, 0)` is called
- **THEN** the result SHALL be `cos = 1, sin = 0` (identity), applied inline without intermediate allocation

#### Scenario: WHEN normalize() is called THEN it also avoids intermediate allocation

- **GIVEN** a `Rotation2` instance `r` with `cos = 3, sin = 4`
- **WHEN** `r.normalize()` is called
- **THEN** normalization SHALL be computed inline with the same result as `set(3, 4)`, without allocating an intermediate object

#### Scenario: WHEN the static normalize is called THEN it also avoids intermediate allocation

- **GIVEN** a `ReadonlyRotation2Like` with `cos = 3, sin = 4`
- **WHEN** `Rotation2.normalize(rotation, out)` is called
- **THEN** the output SHALL be computed inline without an intermediate `{ cos, sin }` object

---

### Requirement: Vector2 instance normalize() SHALL avoid double validation via divideScalar

The instance method `Vector2.prototype.normalize()` calls `this.magnitude()`, checks `isNearZero(length)`, then calls `this.divideScalar(length)` which internally calls `isNearZero(s)` again. The second validation is redundant because the magnitude has already been validated as non-zero. The implementation SHALL use `this.scale(1 / length)` (which performs no validation) instead of `this.divideScalar(length)`, matching the pattern already used in `normalizeSafe()`.

**Source:** `packages/math2d/src/core/vector2.ts:3251-3257`

#### Scenario: WHEN normalize() is called on a non-zero vector THEN isNearZero is checked once

- **GIVEN** `v = new Vector2(3, 4)`
- **WHEN** `v.normalize()` is called
- **THEN** the implementation SHALL compute `length = magnitude()`, validate `isNearZero(length)` once, then use `this.scale(1 / length)` to scale the components
- **AND** the result SHALL be `Vector2(0.6, 0.8)` (identical to current output)

#### Scenario: WHEN normalize() is called on a zero vector THEN it still throws

- **GIVEN** `v = new Vector2(0, 0)`
- **WHEN** `v.normalize()` is called
- **THEN** the function SHALL throw `RangeError` (same as current behavior, from the single `isNearZero` check)

#### Scenario: WHEN normalize() is called THEN it matches the static method's efficiency

- **GIVEN** `v = new Vector2(3, 4)`
- **WHEN** `v.normalize()` is called
- **THEN** the code path SHALL have the same number of `isNearZero` checks (one) as the static `Vector2.normalize(v)`, which computes `inv = 1 / mag` directly

---

### Requirement: Rotation2.fromVector2 SHALL avoid redundant magnitude computation

`Rotation2.fromVector2` computes `magnitudeSquared = x * x + y * y` for the `isNearZero` guard, then calls `hypot(x, y)` which internally computes `sqrt(x * x + y * y)` again. The implementation SHALL use `Math.sqrt(magnitudeSquared)` after the guard instead of `hypot(x, y)`, since the squared magnitude has already been computed and validated as non-zero (ruling out the underflow case that `hypot` protects against).

**Source:** `packages/math2d/src/core/rotation2.ts:301-311`

#### Scenario: WHEN fromVector2 is called with a normal-magnitude vector THEN magnitude is computed once

- **GIVEN** `direction = { x: 3, y: 4 }`
- **WHEN** `Rotation2.fromVector2(direction)` is called
- **THEN** the implementation SHALL compute `magnitudeSquared = 9 + 16 = 25`, validate `isNearZero(25)` is `false`, then compute `magnitude = Math.sqrt(25) = 5`
- **AND** `inv = 1 / 5 = 0.2`, producing `cos = 0.6, sin = 0.8`
- **AND** the `x * x + y * y` product SHALL NOT be computed twice (once explicitly, once inside `hypot`)

#### Scenario: WHEN fromVector2 is called with a zero vector THEN identity is returned without sqrt

- **GIVEN** `direction = { x: 0, y: 0 }`
- **WHEN** `Rotation2.fromVector2(direction)` is called
- **THEN** the function SHALL return identity `Rotation2(1, 0)` after the `isNearZero(magnitudeSquared)` check, without computing `sqrt`

#### Scenario: WHEN fromVector2 is called with very small components THEN underflow is handled

- **GIVEN** `direction = { x: 1e-155, y: 1e-155 }` (near subnormal range)
- **WHEN** `Rotation2.fromVector2(direction)` is called
- **THEN** the result SHALL be a valid unit rotation
- **AND** if `magnitudeSquared` underflows to zero, `isNearZero` SHALL catch it and return identity (matching current `hypot` behavior for this edge case, since `hypot` would also produce a near-zero result)

---

### Requirement: Rotation2.fromVectors2 SHALL avoid temporary Rotation2 allocations

`Rotation2.fromVectors2(from, to)` creates two temporary `Rotation2` objects via `fromVector2(from)` and `fromVector2(to)`, which are immediately passed to `Rotation2.relative` and then discarded. The implementation SHALL inline the relative rotation computation to avoid these two temporary allocations. The relative rotation of two unit vectors `(c1, s1)` and `(c2, s2)` is computed as `cos = c1*c2 + s1*s2` (dot product), `sin = c1*s2 - s1*c2` (cross product).

**Source:** `packages/math2d/src/core/rotation2.ts:323-331`

#### Scenario: WHEN fromVectors2 is called THEN no temporary Rotation2 objects are created

- **GIVEN** `from = { x: 1, y: 0 }` and `to = { x: 0, y: 1 }`
- **WHEN** `Rotation2.fromVectors2(from, to)` is called
- **THEN** the implementation SHALL normalize both direction vectors inline, compute the relative rotation via dot/cross products, and write directly to the output
- **AND** no intermediate `Rotation2` objects SHALL be allocated

#### Scenario: WHEN fromVectors2 is called THEN the result is identical to the current implementation

- **GIVEN** `from = { x: 3, y: 4 }` and `to = { x: -1, y: 2 }`
- **WHEN** `Rotation2.fromVectors2(from, to)` is called
- **THEN** the result SHALL be identical to the current `Rotation2.relative(Rotation2.fromVector2(from), Rotation2.fromVector2(to))`

#### Scenario: WHEN fromVectors2 is called with a zero-magnitude input THEN identity is returned

- **GIVEN** `from = { x: 0, y: 0 }` and `to = { x: 1, y: 0 }`
- **WHEN** `Rotation2.fromVectors2(from, to)` is called
- **THEN** the result SHALL be identity (since the normalized `from` is identity), matching current behavior

---

### Requirement: Complex.fromPolar SHALL not call normalizeRadians before sinCos

`Complex.fromPolar(magnitude, angle)` calls `normalizeRadians(angle)` before passing the result to `sinCos()`. The `sinCos` function delegates to deterministic `sin` and `cos` kernels which are periodic functions that handle arbitrary angles correctly via their own internal range reduction (Cody-Waite). The `normalizeRadians` call is redundant and adds unnecessary overhead (a modulo operation plus branch). It SHALL be removed unless a specific precision concern for very large angles justifies it (in which case the justification SHALL be documented).

**Source:** `packages/math2d/src/core/complex.ts:239-243`

#### Scenario: WHEN fromPolar is called with a normal angle THEN normalizeRadians is not invoked

- **GIVEN** `magnitude = 2` and `angle = PI / 4`
- **WHEN** `Complex.fromPolar(2, PI / 4)` is called
- **THEN** the implementation SHALL call `sinCos(angle)` directly (not `sinCos(normalizeRadians(angle))`)
- **AND** the result SHALL be `Complex(2 * cos(PI/4), 2 * sin(PI/4))` (identical to current output)

#### Scenario: WHEN fromPolar is called with a large angle THEN sinCos handles reduction internally

- **GIVEN** `magnitude = 1` and `angle = 100 * PI`
- **WHEN** `Complex.fromPolar(1, 100 * PI)` is called
- **THEN** the result SHALL be equivalent to `Complex.fromPolar(1, 0)` within the precision limits of the deterministic `sinCos` range reduction
- **AND** the `normalizeRadians` function SHALL NOT be called

#### Scenario: WHEN fromPolar is called with a negative angle THEN behavior is unchanged

- **GIVEN** `magnitude = 1` and `angle = -PI / 2`
- **WHEN** `Complex.fromPolar(1, -PI / 2)` is called
- **THEN** the result SHALL be `Complex(0, -1)` (same as current behavior, since `sinCos` handles negative angles correctly)

---

### Requirement: angleFromVectors SHALL use a single atan2 call via cross/dot product

`angleFromVectors` computes `atan2(y1, x1) - atan2(y2, x2)` via `angleDifference`, requiring two `atan2` calls. A single `atan2(x1*y2 - y1*x2, x1*x2 + y1*y2)` (cross product, dot product) is both faster (one `atan2` instead of two) and more numerically stable (avoids catastrophic cancellation when subtracting two nearly-equal angles for nearly-parallel vectors).

**Source:** `packages/math2d/src/auxiliary/angle/operations.ts:283-287`

#### Scenario: WHEN angleFromVectors is called with orthogonal vectors THEN single atan2 produces correct result

- **GIVEN** `v1 = (1, 0)` and `v2 = (0, 1)`
- **WHEN** `angleFromVectors(1, 0, 0, 1)` is called
- **THEN** the result SHALL be `PI / 2` (90 degrees CCW from v1 to v2)
- **AND** the implementation SHALL compute `atan2(1*1 - 0*0, 1*0 + 0*1) = atan2(1, 0) = PI/2`

#### Scenario: WHEN angleFromVectors is called with opposite vectors THEN result matches convention

- **GIVEN** `v1 = (1, 0)` and `v2 = (-1, 0)`
- **WHEN** `angleFromVectors(1, 0, -1, 0)` is called
- **THEN** the result SHALL be `PI` or `-PI` (determined by `atan2(0, -1)` which is `PI`)

#### Scenario: WHEN angleFromVectors is called with nearly-parallel vectors THEN precision improves

- **GIVEN** `v1 = (1, 0)` and `v2 = (cos(1e-10), sin(1e-10))` (nearly parallel)
- **WHEN** `angleFromVectors` is called
- **THEN** the result SHALL be approximately `1e-10` with relative error less than `1e-5`
- **AND** this SHALL be more precise than the two-atan2 approach which suffers from catastrophic cancellation when subtracting two nearly-equal angles

#### Scenario: WHEN angleFromVectors is called THEN determinism is preserved

- **GIVEN** any pair of finite vector components
- **WHEN** `angleFromVectors(x1, y1, x2, y2)` is called
- **THEN** the implementation SHALL use the deterministic `atan2` kernel from `deterministic-kernels.ts`, maintaining cross-platform bit-exactness

---

### Requirement: Rotation2.nearEquals slow path SHALL avoid two atan2 calls

The slow path of `Rotation2.nearEquals` calls `Rotation2.angle(a)` and `Rotation2.angle(b)`, each of which calls `atan2(sin, cos)`. The two resulting angles are then compared via `angleDifference`. The implementation SHALL instead compare rotations directly using the cross product and dot product of their components: `cross = a.cos*b.sin - a.sin*b.cos`, `dot = a.cos*b.cos + a.sin*b.sin`, then `isNearZero(atan2(cross, dot))` with a single `atan2` call. Alternatively, for even better performance, the comparison can avoid `atan2` entirely by checking `|cross| < epsilon * dot` when `dot > 0` (rotations within 90 degrees), falling back to the single `atan2` only when `dot <= 0`.

**Source:** `packages/math2d/src/core/rotation2.ts:810-813`

#### Scenario: WHEN nearEquals slow path is taken THEN at most one atan2 is called

- **GIVEN** two rotations `a` and `b` that fail the fast component comparison but are near-equal by angle
- **WHEN** `Rotation2.nearEquals(a, b)` falls through to the slow path
- **THEN** the implementation SHALL use at most one `atan2` call (on the cross/dot of the rotation components), not two separate `atan2` calls on each rotation individually

#### Scenario: WHEN nearEquals is called with nearly-opposite rotations THEN result is correct

- **GIVEN** `a = Rotation2(cos(PI - 0.001), sin(PI - 0.001))` and `b = Rotation2(cos(PI + 0.001), sin(PI + 0.001))`
- **WHEN** `Rotation2.nearEquals(a, b, 0.01)` is called
- **THEN** the result SHALL be `true` (the angular difference is 0.002, within epsilon = 0.01)
- **AND** the slow path with the cross/dot formulation SHALL handle the wrap-around at PI correctly

#### Scenario: WHEN nearEquals fast path succeeds THEN no atan2 is called

- **GIVEN** `a = Rotation2(1, 0)` and `b = Rotation2(1 - 1e-12, 1e-12)`
- **WHEN** `Rotation2.nearEquals(a, b)` is called
- **THEN** the fast path (direct component comparison) SHALL succeed and return `true` without any `atan2` calls

---

### Requirement: GOLDEN_RATIO and GOLDEN_RATIO_CONJUGATE SHALL share a single sqrt(5) computation

`GOLDEN_RATIO` is defined as `(1 + Math.sqrt(5)) / 2` and `GOLDEN_RATIO_CONJUGATE` as `(Math.sqrt(5) - 1) / 2`, each calling `Math.sqrt(5)` independently at module load time. The implementation SHALL compute `Math.sqrt(5)` once into a shared constant and reuse it for both derivations.

**Source:** `packages/math2d/src/auxiliary/scalar/constants.ts:239,251`

#### Scenario: WHEN the constants module loads THEN sqrt(5) is computed once

- **GIVEN** the `constants.ts` module is loaded
- **WHEN** `GOLDEN_RATIO` and `GOLDEN_RATIO_CONJUGATE` are initialized
- **THEN** `Math.sqrt(5)` SHALL be called exactly once (stored in a local `const SQRT_5 = Math.sqrt(5)`)
- **AND** `GOLDEN_RATIO` SHALL equal `(1 + SQRT_5) / 2`
- **AND** `GOLDEN_RATIO_CONJUGATE` SHALL equal `(SQRT_5 - 1) / 2`

#### Scenario: WHEN GOLDEN_RATIO values are accessed THEN they are numerically identical to current values

- **GIVEN** `GOLDEN_RATIO` and `GOLDEN_RATIO_CONJUGATE` are accessed
- **WHEN** their values are compared to the mathematically expected values
- **THEN** `GOLDEN_RATIO` SHALL equal `1.618033988749895` and `GOLDEN_RATIO_CONJUGATE` SHALL equal `0.618033988749895` (identical to current values, since `Math.sqrt(5)` is IEEE 754 deterministic)

---

### Requirement: Vector2.smoothStep and Complex.smoothStep SHALL not double-clamp t

Both `Vector2.smoothStep` and `Complex.smoothStep` call `saturate(t)` to clamp `t` to `[0, 1]`, then pass the result to `smoothStep(0, 1, clamped)` which internally calls `saturate((x - edge0) / range)`. When `edge0 = 0` and `edge1 = 1`, the inner saturate is `saturate((clamped - 0) / 1) = saturate(clamped)`, which is a redundant second clamp since `clamped` is already in `[0, 1]`. The outer `saturate(t)` call SHALL be removed, passing `t` directly to `smoothStep(0, 1, t)`.

**Source:** `packages/math2d/src/core/vector2.ts:1026` (`const smoothT = smoothStep(0, 1, saturate(t))`), `packages/math2d/src/core/complex.ts:628` (`const clamped = saturate(t)`)

#### Scenario: WHEN Vector2.smoothStep is called THEN saturate is called once (inside smoothStep)

- **GIVEN** `a = { x: 0, y: 0 }` and `b = { x: 10, y: 10 }` and `t = 0.5`
- **WHEN** `Vector2.smoothStep(a, b, t)` is called
- **THEN** the implementation SHALL call `smoothStep(0, 1, t)` directly (not `smoothStep(0, 1, saturate(t))`)
- **AND** the result SHALL be identical to the current output (since `smoothStep` clamps internally)

#### Scenario: WHEN Complex.smoothStep is called THEN saturate is called once (inside smoothStep)

- **GIVEN** `a = Complex(0, 0)` and `b = Complex(2, 4)` and `t = 0.5`
- **WHEN** `Complex.smoothStep(a, b, t)` is called
- **THEN** the implementation SHALL call `smoothStep(0, 1, t)` directly (not `smoothStep(0, 1, saturate(t))`)
- **AND** the result SHALL be identical to the current output

#### Scenario: WHEN smoothStep is called with out-of-range t THEN clamping still works

- **GIVEN** `a = { x: 0, y: 0 }` and `b = { x: 10, y: 10 }` and `t = 1.5`
- **WHEN** `Vector2.smoothStep(a, b, t)` is called
- **THEN** the result SHALL be `Vector2(10, 10)` (clamped by the internal `saturate` inside `smoothStep`)

#### Scenario: WHEN smoothStep is called with negative t THEN clamping still works

- **GIVEN** `a = Complex(0, 0)` and `b = Complex(2, 4)` and `t = -0.5`
- **WHEN** `Complex.smoothStep(a, b, t)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (clamped by the internal `saturate` inside `smoothStep`)

---

## API Consistency Audit — Merged Allocation-Elimination Requirements (2026-03-20)

_Synced from delta spec: `openspec/changes/math2d-api-consistency-audit/specs/performance-architecture`_

### Requirement: R-SMITH-ALLOC — complexDivideSmith SHALL NOT allocate tuples/arrays

The `complexDivideSmith` helper function (used internally by `Complex.divide` and related methods) SHALL write its result directly to the caller's `out` parameter fields (`out.real`, `out.imag`) instead of returning a `[number, number]` tuple. The current implementation allocates a two-element array on every call, which creates GC pressure in hot paths where complex division is performed repeatedly.

The refactored signature SHALL be: `complexDivideSmith(aRe: number, aIm: number, bRe: number, bIm: number, out: Complex): void` (or equivalent that avoids intermediate allocation).

**Source:** `packages/math2d/src/core/complex.ts` (complexDivideSmith helper)

#### Scenario: WHEN complexDivideSmith is called THEN no tuple is allocated

- **GIVEN** `a = Complex(1, 2)` and `b = Complex(3, 4)` and `out = new Complex()`
- **WHEN** `complexDivideSmith(1, 2, 3, 4, out)` is called
- **THEN** `out.real` SHALL be `(1*3 + 2*4) / (3*3 + 4*4) = 11/25 = 0.44`
- **AND** `out.imag` SHALL be `(2*3 - 1*4) / (3*3 + 4*4) = 2/25 = 0.08`
- **AND** no `[number, number]` array or tuple SHALL be allocated during the operation

#### Scenario: WHEN Complex.divide is called THEN the result is bit-identical to current implementation

- **GIVEN** `a = Complex(1e100, 1e100)` and `b = Complex(1e-100, 1e-100)` (extreme scaling)
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be bit-identical to the current implementation (Smith algorithm branching logic preserved)
- **AND** no intermediate tuple SHALL be allocated

#### Scenario: WHEN Complex.divide is called in a loop THEN no per-iteration GC pressure

- **GIVEN** a loop performing 10,000 complex divisions with a reused `out` parameter
- **WHEN** the loop completes
- **THEN** the number of heap allocations from `complexDivideSmith` SHALL be zero (all results written directly to `out`)

#### Scenario: WHEN complexDivideSmith handles the scaling branch THEN results are numerically identical

- **GIVEN** `a = Complex(1, 0)` and `b = Complex(1e-200, 1e-200)` (triggers scaling branch in Smith algorithm)
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be numerically identical to the current tuple-returning implementation
- **AND** the Smith algorithm's overflow/underflow protection SHALL be preserved exactly

---

### Requirement: R-INT-MUL-ALLOC — Interval.multiply SHALL NOT allocate arrays

`Interval.multiply` currently creates `const products = [p1, p2, p3, p4]` and passes it to `Math.min(...products)` / `Math.max(...products)`. This allocates a 4-element array on every call. The implementation SHALL use 4 local scalar variables and compute the min/max directly: `Math.min(p1, p2, p3, p4)` and `Math.max(p1, p2, p3, p4)`.

**Source:** `packages/math2d/src/core/interval.ts` (multiply implementation)

#### Scenario: WHEN Interval.multiply is called THEN no array is allocated

- **GIVEN** `a = Interval(2, 3)` and `b = Interval(4, 5)`
- **WHEN** `Interval.multiply(a, b)` is called
- **THEN** the result SHALL be `Interval(8, 15)` (min of products, max of products)
- **AND** no `Array` SHALL be allocated during the computation
- **AND** the implementation SHALL use `Math.min(p1, p2, p3, p4)` with scalar variables

#### Scenario: WHEN Interval.multiply is called with a negative interval THEN result is correct

- **GIVEN** `a = Interval(-3, 2)` and `b = Interval(-1, 4)`
- **WHEN** `Interval.multiply(a, b)` is called
- **THEN** the four products are: `(-3)*(-1)=3`, `(-3)*4=-12`, `2*(-1)=-2`, `2*4=8`
- **AND** the result SHALL be `Interval(-12, 8)` (min=-12, max=8)
- **AND** no intermediate array SHALL be allocated

#### Scenario: WHEN Interval.multiply is called in a tight loop THEN allocation count is zero

- **GIVEN** a loop performing 10,000 interval multiplications
- **WHEN** the loop completes
- **THEN** the number of heap allocations from the multiply computation (excluding the result Interval itself) SHALL be zero

---

### Requirement: R-T2-MUL-INLINE — Transform2.multiply (static) SHALL inline rotation computation

`Transform2.multiply(a, b, out?)` static method SHALL inline the rotation composition instead of calling `Rotation2.multiply(a.rotation, b.rotation)` which allocates a temporary `Rotation2`. The rotation SHALL be computed using direct scalar operations:

```
outCos = a.rotation.cos * b.rotation.cos - a.rotation.sin * b.rotation.sin
outSin = a.rotation.sin * b.rotation.cos + a.rotation.cos * b.rotation.sin
```

These results SHALL be written directly to `out.rotation.cos` and `out.rotation.sin`.

Similarly, the position and scale computations SHALL avoid intermediate object allocations.

**Source:** `packages/math2d/src/core/transform2.ts` (static multiply)

#### Scenario: WHEN Transform2.multiply static is called THEN no temporary Rotation2 is allocated

- **GIVEN** `a = Transform2(position=(1, 2), rotation=PI/4, scale=(1, 1))`
- **AND** `b = Transform2(position=(3, 4), rotation=PI/6, scale=(1, 1))`
- **WHEN** `Transform2.multiply(a, b)` is called
- **THEN** the rotation SHALL be computed inline using scalar variables
- **AND** no intermediate `Rotation2` object SHALL be allocated
- **AND** the result rotation SHALL be near-equal to `Rotation2.fromAngle(PI/4 + PI/6)`

#### Scenario: WHEN Transform2.multiply is compared with non-inlined version THEN results are identical

- **GIVEN** `a` and `b` as arbitrary Transform2 values
- **WHEN** `inlined = Transform2.multiply(a, b)` is computed
- **THEN** `inlined.rotation` SHALL be near-equal to `Rotation2.multiply(a.rotation, b.rotation)` within `EPSILON`
- **AND** `inlined.position` and `inlined.scale` SHALL also match the non-inlined computation

#### Scenario: WHEN Transform2.multiply is called with out parameter THEN result is written to out

- **GIVEN** `a`, `b` as Transform2 values and `out = new Transform2()`
- **WHEN** `result = Transform2.multiply(a, b, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** no temporary Rotation2, Vector2, or other objects SHALL be allocated beyond the final result

---

### Requirement: R-T2-INV-INLINE — Transform2.inverse/Safe/Unchecked (static) SHALL inline rotation inverse

`Transform2.inverse(transform, out?)`, `Transform2.inverseSafe(transform, out?)`, and `Transform2.inverseUnchecked(transform, out?)` static methods SHALL inline the rotation inverse computation instead of calling `Rotation2.inverse(transform.rotation)` which allocates a temporary `Rotation2`. The rotation inverse SHALL be computed as:

```
invCos = transform.rotation.cos
invSin = -transform.rotation.sin
```

These values SHALL be stored in local scalar variables and used directly for the subsequent position transformation, then written to the output rotation.

**Source:** `packages/math2d/src/core/transform2.ts` (static inverse, inverseSafe, inverseUnchecked)

#### Scenario: WHEN Transform2.inverse static is called THEN no temporary Rotation2 is allocated

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `Transform2.inverse(t)` is called
- **THEN** the inverse rotation SHALL be computed inline as `(cos, -sin)`
- **AND** no intermediate `Rotation2` object SHALL be allocated

#### Scenario: WHEN Transform2.inverse is called THEN the result is mathematically correct

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `inv = Transform2.inverse(t)` is computed
- **THEN** `inv.rotation.cos` SHALL equal `t.rotation.cos` (cosine is even)
- **AND** `inv.rotation.sin` SHALL equal `-t.rotation.sin` (sine is negated)

#### Scenario: WHEN Transform2.inverseSafe is called with singular scale THEN fallback is returned without allocation

- **GIVEN** `t = Transform2(position=(1, 1), rotation=0, scale=(0, 1))` (singular x-scale)
- **WHEN** `Transform2.inverseSafe(t)` is called
- **THEN** the function SHALL return the safe fallback without allocating temporary objects

#### Scenario: WHEN inverse round-trips with multiply THEN identity is recovered

- **GIVEN** `t = Transform2(position=(3, 7), rotation=PI/5, scale=(4, 4))` (uniform scale)
- **WHEN** `Transform2.multiply(t, Transform2.inverse(t))` is computed
- **THEN** the result SHALL be near-equal to `Transform2.IDENTITY` within `EPSILON`
- **AND** no temporary Rotation2 allocations SHALL occur in either the inverse or multiply calls

---

### Requirement: R-FROBENIUS — frobeniusNorm SHALL use Math.sqrt, not sqrtSafe

`frobeniusNorm` (for Matrix2 and Matrix3) computes `sqrtSafe(sum)` where `sum` is the sum of squares of all matrix elements. Since a sum of squares is always >= 0 (it can never be negative), the `sqrtSafe` guard (which returns 0 for negative inputs) is unnecessary. The implementation SHALL use `Math.sqrt(sum)` directly.

`Math.sqrt` is IEEE 754 deterministic for non-negative inputs and is faster than `sqrtSafe` which includes an additional comparison branch.

**Source:** `packages/math2d/src/core/matrix2.ts` and `packages/math2d/src/core/matrix3.ts` (frobeniusNorm implementations)

#### Scenario: WHEN frobeniusNorm is called on Matrix2 THEN Math.sqrt is used

- **GIVEN** `m = Matrix2.fromValues(1, 2, 3, 4)`
- **WHEN** `Matrix2.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `Math.sqrt(1 + 4 + 9 + 16) = Math.sqrt(30)`
- **AND** the implementation SHALL use `Math.sqrt`, not `sqrtSafe`

#### Scenario: WHEN frobeniusNorm is called on Matrix3 THEN Math.sqrt is used

- **GIVEN** `m = Matrix3.IDENTITY`
- **WHEN** `Matrix3.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `Math.sqrt(3)` (three 1s on the diagonal, six 0s)
- **AND** the implementation SHALL use `Math.sqrt`, not `sqrtSafe`

#### Scenario: WHEN frobeniusNorm is called on a zero matrix THEN result is zero

- **GIVEN** `m = Matrix2.fromValues(0, 0, 0, 0)`
- **WHEN** `Matrix2.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `0` (`Math.sqrt(0) = 0`)

#### Scenario: WHEN frobeniusNorm is called on any matrix THEN the sum of squares is never negative

- **GIVEN** any `Matrix2` or `Matrix3` with finite elements
- **WHEN** the sum of squares `s = m00*m00 + m01*m01 + ...` is computed
- **THEN** `s >= 0` SHALL always hold (sum of squares of real numbers is non-negative)
- **AND** therefore `Math.sqrt(s)` is always well-defined and `sqrtSafe` is redundant
