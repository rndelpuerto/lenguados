## ADDED Requirements

### Requirement: compare NaN SHALL sort to consistent position instead of equaling everything

`compare(a, b, epsilon)` currently returns `0` when either `a` or `b` is `NaN`, treating NaN as equal to every value. This breaks the transitivity requirement of `Array.prototype.sort` comparators: `compare(NaN, 5) === 0` and `compare(NaN, 10) === 0` implies `5 === 10` by transitivity. The function SHALL sort NaN to a consistent position (after all finite values and Infinity) by returning `1` when `a` is NaN (and `b` is not), `-1` when `b` is NaN (and `a` is not), and `0` only when both are NaN. This is a **BREAKING** change.

**Source:** `packages/math2d/src/auxiliary/scalar/comparison.ts:233-239`

**Reference:** IEEE 754-2019 totalOrder, Java `Double.compare`, Rust `f64::total_cmp`.

#### Scenario: WHEN NaN is first operand and second is finite THEN NaN sorts after

- **GIVEN** `a = NaN` and `b = 5`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `1` (NaN sorts after finite values)

#### Scenario: WHEN NaN is second operand and first is finite THEN NaN sorts after

- **GIVEN** `a = 5` and `b = NaN`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `-1` (finite sorts before NaN)

#### Scenario: WHEN both operands are NaN THEN they are equal

- **GIVEN** `a = NaN` and `b = NaN`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `0`

#### Scenario: WHEN NaN is compared against Infinity THEN NaN sorts after

- **GIVEN** `a = NaN` and `b = Infinity`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `1` (NaN sorts after everything, including Infinity)

#### Scenario: WHEN NaN is compared against negative Infinity THEN NaN sorts after

- **GIVEN** `a = -Infinity` and `b = NaN`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `-1`

#### Scenario: WHEN compare is used as Array.sort comparator with NaN THEN sort is stable

- **GIVEN** `values = [3, NaN, 1, NaN, 2]`
- **WHEN** `values.sort(compare)` is called
- **THEN** the result SHALL be `[1, 2, 3, NaN, NaN]` (NaN values at the end, finite values correctly ordered)

#### Scenario: WHEN both operands are finite THEN behavior is unchanged

- **GIVEN** `a = 5` and `b = 10` and `epsilon = EPSILON`
- **WHEN** `compare(a, b)` is called
- **THEN** the result SHALL be `-1` (existing behavior preserved)

---

### Requirement: floorDivide SHALL have strict/safe/unchecked triality for zero-divisor handling

`floorDivide(value, divisor)` currently returns `Infinity` for `floorDivide(7, 0)` and `NaN` for `floorDivide(0, 0)` without any validation, unlike `flooredMod`, `remap`, `inverseLerp`, and other division-dependent functions in the same layer which follow the strict/safe/unchecked pattern. The function SHALL be refactored into three variants:

- `floorDivide(value, divisor)` — strict, throws `RangeError` when divisor is near zero
- `floorDivideSafe(value, divisor, fallback?)` — returns `0` (or provided fallback) when divisor is near zero
- `floorDivideUnchecked(value, divisor)` — no validation, current behavior preserved

**Source:** `packages/math2d/src/auxiliary/scalar/arithmetic.ts:416-418`

#### Scenario: WHEN strict floorDivide receives zero divisor THEN it throws

- **GIVEN** `value = 7` and `divisor = 0`
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating zero divisor

#### Scenario: WHEN strict floorDivide receives near-zero divisor THEN it throws

- **GIVEN** `value = 7` and `divisor = 1e-11` (below EPSILON)
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN safe floorDivideSafe receives zero divisor THEN it returns fallback

- **GIVEN** `value = 7` and `divisor = 0`
- **WHEN** `floorDivideSafe(value, divisor)` is called
- **THEN** the result SHALL be `0` (default fallback)

#### Scenario: WHEN safe floorDivideSafe receives custom fallback THEN it uses it

- **GIVEN** `value = 7`, `divisor = 0`, `fallback = -1`
- **WHEN** `floorDivideSafe(value, divisor, fallback)` is called
- **THEN** the result SHALL be `-1`

#### Scenario: WHEN unchecked floorDivideUnchecked receives zero divisor THEN it returns Infinity

- **GIVEN** `value = 7` and `divisor = 0`
- **WHEN** `floorDivideUnchecked(value, divisor)` is called
- **THEN** the result SHALL be `Infinity` (current behavior, no validation)

#### Scenario: WHEN floorDivide receives valid divisor THEN behavior is unchanged

- **GIVEN** `value = 7` and `divisor = 3`
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the result SHALL be `2` (existing behavior preserved)

#### Scenario: WHEN floorDivide receives negative valid inputs THEN floored semantics preserved

- **GIVEN** `value = -7` and `divisor = 3`
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the result SHALL be `-3` (floor of -2.33... is -3)

---

### Requirement: Vector2.isUnit and Complex.isUnit SHALL use the same criterion

`Vector2.isUnit` uses `scalarNearEquals(magnitude(v), 1)` which computes the square root and tests `|sqrt(x*x + y*y) - 1| <= epsilon`. `Complex.isUnit` uses `Math.abs(magnitudeSq - 1) < epsilon` which tests the squared magnitude without a square root. These produce different results at the boundary: a vector with `magnitudeSq = 1 + 2e-10` has `magnitude ~ 1 + 1e-10` which passes Vector2's check (within EPSILON of 1) but fails Complex's check (difference `2e-10 > EPSILON`). Both types SHALL use the same criterion.

The chosen criterion SHALL be the squared-magnitude approach (`|magnitudeSq - 1| < epsilon`), which avoids the `sqrt` call and is more appropriate for a hot-path predicate. `Vector2.isUnit` SHALL be updated to match `Complex.isUnit`.

**Source:** `packages/math2d/src/core/vector2.ts:2442-2444` (Vector2), `packages/math2d/src/core/complex.ts:682-685` (Complex)

#### Scenario: WHEN Vector2.isUnit is called with boundary magnitude THEN result matches Complex

- **GIVEN** a Vector2 `v` with `magnitudeSq = 1 + 1.5e-10` (magnitude ~ 1.000000000075)
- **WHEN** `Vector2.isUnit(v)` is called
- **THEN** the result SHALL be `false` (same as `Complex.isUnit` for equivalent values, since `|1.5e-10| > EPSILON`)

#### Scenario: WHEN Vector2.isUnit is called with unit vector THEN returns true

- **GIVEN** `v = Vector2(1, 0)` (exact unit vector)
- **WHEN** `Vector2.isUnit(v)` is called
- **THEN** the result SHALL be `true`

#### Scenario: WHEN Vector2.isUnit is called with nearly-unit vector THEN returns true

- **GIVEN** `v` such that `magnitudeSq = 1 + 5e-11` (within EPSILON of 1)
- **WHEN** `Vector2.isUnit(v)` is called
- **THEN** the result SHALL be `true` (difference `5e-11 < EPSILON`)

#### Scenario: WHEN both types check same numeric pair THEN they agree

- **GIVEN** `v = Vector2(a, b)` and `z = Complex(a, b)` for the same `a, b` values
- **WHEN** `Vector2.isUnit(v)` and `Complex.isUnit(z)` are called with the same epsilon
- **THEN** both results SHALL be identical

#### Scenario: WHEN Vector2 instance isUnit is called THEN it matches static

- **GIVEN** `v = new Vector2(0.6, 0.8)` (unit vector)
- **WHEN** `v.isUnit()` is called
- **THEN** the result SHALL match `Vector2.isUnit(v)`

---

### Requirement: Complex.reciprocated getter SHALL align with reciprocal/reciprocalSafe behavior

The `reciprocated` getter uses `divideSafe(1, magSq)` which silently returns `0` for near-zero magnitudes, producing `Complex(0, -0)` instead of throwing (like `reciprocal()`) or returning `Complex(0, 0)` (like `reciprocalSafe()`). The getter also produces `-0` for the imaginary component when the input imaginary is `+0` (via `-this.imag * invMagSq` where `invMagSq = 0`). The getter SHALL be documented as equivalent to `reciprocalSafe()` behavior and SHALL avoid producing `-0` in the imaginary component of the fallback result.

**Source:** `packages/math2d/src/core/complex.ts:1947-1951`

#### Scenario: WHEN reciprocated is called on near-zero complex THEN it returns zero complex without negative zero

- **GIVEN** `z = new Complex(1e-320, 0)` (near-zero magnitude)
- **WHEN** `z.reciprocated` is accessed
- **THEN** the result SHALL be `Complex(0, 0)` (not `Complex(0, -0)`)
- **AND** `Object.is(result.imag, -0)` SHALL be `false`

#### Scenario: WHEN reciprocated is called on zero complex THEN it returns zero complex

- **GIVEN** `z = new Complex(0, 0)`
- **WHEN** `z.reciprocated` is accessed
- **THEN** the result SHALL be `Complex(0, 0)`

#### Scenario: WHEN reciprocated is called on valid complex THEN it returns correct reciprocal

- **GIVEN** `z = new Complex(3, 4)` (magnitude = 5, magSq = 25)
- **WHEN** `z.reciprocated` is accessed
- **THEN** the result SHALL be `Complex(0.12, -0.16)` (i.e., `(3/25, -4/25)`)

#### Scenario: WHEN reciprocated JSDoc is inspected THEN it documents safe-variant behavior

- **GIVEN** the `Complex.reciprocated` getter
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL document that near-zero magnitudes return `Complex(0, 0)` (safe behavior, no throw)
- **AND** it SHALL reference `reciprocal()` for the throwing variant and `reciprocalSafe()` for the explicit safe method

---

### Requirement: nearEquals and comparison functions SHALL validate epsilon non-negative

`relativeEquals` validates that `relativeEpsilon >= 0` and throws `RangeError` for negative values. `nearEquals`, `isNearZero`, `isNearOne`, `lessThan`, `greaterThan`, `inRange`, and `compare` do NOT validate their epsilon parameter. A negative epsilon causes `nearEquals` to always return `false` (since `Math.abs(a - b) <= negative` is always false) without any error. All epsilon-accepting comparison functions SHALL validate that epsilon is non-negative, consistent with `relativeEquals`.

**Source:** `packages/math2d/src/auxiliary/scalar/comparison.ts:30-36` (nearEquals), `comparison.ts:112-114` (relativeEquals with validation)

#### Scenario: WHEN nearEquals receives negative epsilon THEN it throws RangeError

- **GIVEN** `a = 1.0`, `b = 1.0`, `epsilon = -0.1`
- **WHEN** `nearEquals(a, b, epsilon)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating epsilon must be non-negative

#### Scenario: WHEN isNearZero receives negative epsilon THEN it throws RangeError

- **GIVEN** `value = 0.0`, `epsilon = -1`
- **WHEN** `isNearZero(value, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN isNearOne receives negative epsilon THEN it throws RangeError

- **GIVEN** `value = 1.0`, `epsilon = -1`
- **WHEN** `isNearOne(value, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN compare receives negative epsilon THEN it throws RangeError

- **GIVEN** `a = 1.0`, `b = 2.0`, `epsilon = -0.5`
- **WHEN** `compare(a, b, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN lessThan receives negative epsilon THEN it throws RangeError

- **GIVEN** `a = 1.0`, `b = 2.0`, `epsilon = -0.1`
- **WHEN** `lessThan(a, b, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN greaterThan receives negative epsilon THEN it throws RangeError

- **GIVEN** `a = 2.0`, `b = 1.0`, `epsilon = -0.1`
- **WHEN** `greaterThan(a, b, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN inRange receives negative epsilon THEN it throws RangeError

- **GIVEN** `value = 5`, `min = 0`, `max = 10`, `epsilon = -1`
- **WHEN** `inRange(value, min, max, epsilon)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN nearEquals receives zero epsilon THEN it does not throw

- **GIVEN** `a = 1.0`, `b = 1.0`, `epsilon = 0`
- **WHEN** `nearEquals(a, b, epsilon)` is called
- **THEN** the function SHALL NOT throw (zero is non-negative and valid)
- **AND** the result SHALL be `true` (exact equality)

#### Scenario: WHEN nearEquals receives positive epsilon THEN behavior is unchanged

- **GIVEN** `a = 1.0`, `b = 1.0 + 1e-11`, `epsilon = EPSILON`
- **WHEN** `nearEquals(a, b, epsilon)` is called
- **THEN** the result SHALL be `true` (existing behavior preserved)

---

### Requirement: robustSum and neumaierSum SHALL accept readonly number arrays

`robustSum(values: number[])` and `neumaierSum(values: number[])` accept `number[]` but do not mutate the input array. The parameter type SHALL be `readonly number[]` (or equivalently `ReadonlyArray<number>`) to accept both mutable and readonly arrays without requiring callers to cast. This follows the library's convention of using `Readonly*` types for input parameters.

**Source:** `packages/math2d/src/auxiliary/numeric/safety.ts:224,255`

#### Scenario: WHEN robustSum receives a readonly array THEN it compiles without error

- **GIVEN** `values: readonly number[] = [1e10, 1, -1e10]`
- **WHEN** `robustSum(values)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be `1`

#### Scenario: WHEN neumaierSum receives a readonly array THEN it compiles without error

- **GIVEN** `values: readonly number[] = [1e10, 1, -1e10]`
- **WHEN** `neumaierSum(values)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be `1`

#### Scenario: WHEN robustSum receives a mutable array THEN it still works

- **GIVEN** `values: number[] = [0.1, 0.2, 0.3]`
- **WHEN** `robustSum(values)` is called
- **THEN** the result SHALL be approximately `0.6` (existing behavior preserved)

#### Scenario: WHEN the parameter type is inspected THEN it uses readonly

- **GIVEN** the `robustSum` function signature
- **WHEN** the parameter type is inspected
- **THEN** it SHALL be `readonly number[]` or `ReadonlyArray<number>`

---

### Requirement: Rotation2.NEGATIVE_QUARTER and THREE_QUARTER_TURN alias documentation

`Rotation2.NEGATIVE_QUARTER` and `Rotation2.THREE_QUARTER_TURN` are both defined as `Object.freeze(new Rotation2(0, -1))`. They represent the same rotation: 270 degrees CCW (equivalently, -90 degrees or 90 degrees CW). The JSDoc for both constants SHALL document that they are aliases representing the identical rotation value, SHALL cross-reference each other, and SHALL explain the naming rationale (NEGATIVE_QUARTER = -90 degrees from the perspective of signed angle, THREE_QUARTER_TURN = 270 degrees from the perspective of CCW arc).

**Source:** `packages/math2d/src/core/rotation2.ts:201-237`

#### Scenario: WHEN NEGATIVE_QUARTER JSDoc is inspected THEN it references THREE_QUARTER_TURN

- **GIVEN** the `Rotation2.NEGATIVE_QUARTER` constant
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@see` or `@remarks` noting that this is identical to `THREE_QUARTER_TURN` (both are `Rotation2(0, -1)`, representing -90 degrees / 270 degrees CCW)

#### Scenario: WHEN THREE_QUARTER_TURN JSDoc is inspected THEN it references NEGATIVE_QUARTER

- **GIVEN** the `Rotation2.THREE_QUARTER_TURN` constant
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@see` or `@remarks` noting that this is identical to `NEGATIVE_QUARTER`

#### Scenario: WHEN both constants are compared at runtime THEN they are distinct objects with identical values

- **GIVEN** `a = Rotation2.NEGATIVE_QUARTER` and `b = Rotation2.THREE_QUARTER_TURN`
- **WHEN** their `cos` and `sin` values are compared
- **THEN** `a.cos === b.cos` and `a.sin === b.sin` SHALL both be `true` (both `{ cos: 0, sin: -1 }`)
- **AND** `a === b` MAY be `false` (they are separate frozen instances)

---

### Requirement: Interval.hull overload parameter ambiguity documentation

`Interval.hull(first, second?, ...rest)` has an overload where `first` can be `ReadonlyArray<number | ReadonlyIntervalLike>` and `second` can be `number | ReadonlyIntervalLike | Interval`. When `first` is an array, `second` serves as the `out` parameter (an `Interval` to write the result into). When `first` is a scalar or interval, `second` is a value to include in the hull. This dual-purpose `second` parameter is confusing and SHALL be documented prominently in the JSDoc.

**Source:** `packages/math2d/src/core/interval.ts:1035-1045`

#### Scenario: WHEN hull receives array and Interval as second arg THEN second is out parameter

- **GIVEN** `values = [1, 5, 3]` and `out = new Interval()`
- **WHEN** `Interval.hull(values, out)` is called
- **THEN** `out` SHALL be mutated to contain `Interval(1, 5)` (hull of array values)
- **AND** the return value SHALL be `out` (same reference)

#### Scenario: WHEN hull receives two scalars THEN second is a value

- **GIVEN** `first = 3` and `second = 7`
- **WHEN** `Interval.hull(first, second)` is called
- **THEN** the result SHALL be `Interval(3, 7)` (hull of the two values)

#### Scenario: WHEN hull JSDoc is inspected THEN it documents dual-purpose second parameter

- **GIVEN** the `Interval.hull` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL contain a `@remarks` or `@overload` description explaining that when `first` is an array, `second` serves as the optional `out` parameter, and when `first` is a scalar/interval, `second` is a value to include in the hull computation

#### Scenario: WHEN hull receives array without out parameter THEN new Interval is returned

- **GIVEN** `values = [2, 8, 5]`
- **WHEN** `Interval.hull(values)` is called
- **THEN** the result SHALL be a new `Interval(2, 8)`

---

### Requirement: Constants object SHALL be Object.freeze for runtime immutability

The `Constants` object uses `as const` which provides TypeScript-level readonly enforcement but does NOT prevent runtime mutation. `Constants.EPSILON = 999` silently succeeds at runtime (in non-strict mode) or fails silently (in strict mode without `Object.freeze`). The `Constants` object SHALL be wrapped in `Object.freeze()` to match the runtime immutability pattern used by `Rotation2` static constants, `Vector2.ZERO`, and other frozen objects in the library.

Note: individual named exports (`export const EPSILON = 1e-10`) are `const` bindings and cannot be reassigned at the import site. The `Constants` object is the only mutable access path to these values. After freezing, `Constants.EPSILON` assignment will throw in strict mode and silently fail in sloppy mode, matching the defensive coding pattern established elsewhere in the library.

**Source:** `packages/math2d/src/auxiliary/scalar/constants.ts:280-303`

#### Scenario: WHEN Constants object is mutated at runtime THEN it throws in strict mode

- **GIVEN** the `Constants` object from `@lenguados/math2d`
- **WHEN** `Constants.EPSILON = 999` is executed in strict mode
- **THEN** a `TypeError` SHALL be thrown (Object.freeze prevents property mutation)

#### Scenario: WHEN Object.isFrozen is checked THEN Constants is frozen

- **GIVEN** the `Constants` object
- **WHEN** `Object.isFrozen(Constants)` is called
- **THEN** the result SHALL be `true`

#### Scenario: WHEN Constants values are read THEN they are correct

- **GIVEN** the frozen `Constants` object
- **WHEN** `Constants.EPSILON`, `Constants.PI`, `Constants.TAU` are read
- **THEN** they SHALL have the same values as the named exports `EPSILON`, `PI`, `TAU` (no regression)

---

### Requirement: wrapping.ts module doc SHALL reference only existing functions

The module-level JSDoc comment in `auxiliary/numeric/wrapping.ts` references `truncatedMod`, `mirror`, and `repeat` as available functions, but the file only exports `flooredMod`, `flooredModSafe`, and `flooredModUnchecked`. The module doc SHALL be updated to accurately list only the functions that exist in the file. If `truncatedMod`, `mirror`, and `repeat` are planned but not yet implemented, they SHALL be removed from the doc and added back when implemented.

**Source:** `packages/math2d/src/auxiliary/numeric/wrapping.ts:1-19`

#### Scenario: WHEN module doc is inspected THEN it lists only existing exports

- **GIVEN** the `@file` / `@description` JSDoc block at the top of `wrapping.ts`
- **WHEN** the referenced function names are compared against actual exports
- **THEN** every function name mentioned in the doc SHALL correspond to an exported function in the file

#### Scenario: WHEN truncatedMod is referenced in docs THEN it matches an export or is removed

- **GIVEN** the module doc mentions `truncatedMod`
- **WHEN** the file's exports are inspected
- **THEN** either `truncatedMod` SHALL be exported from the file, OR the reference SHALL be removed from the doc

#### Scenario: WHEN mirror is referenced in docs THEN it matches an export or is removed

- **GIVEN** the module doc mentions `mirror`
- **WHEN** the file's exports are inspected
- **THEN** either `mirror` SHALL be exported from the file, OR the reference SHALL be removed from the doc

#### Scenario: WHEN repeat is referenced in docs THEN it matches an export or is removed

- **GIVEN** the module doc mentions `repeat`
- **WHEN** the file's exports are inspected
- **THEN** either `repeat` SHALL be exported from the file, OR the reference SHALL be removed from the doc

---

### Requirement: Vector2.fromAngle SHALL validate radius parameter

`Vector2.fromAngle(angle, radius?, out?)` calls `assertFinite(angle, 'Vector2.fromAngle:angle')` but does not validate `radius`. An `Infinity` or `NaN` radius silently produces a vector with non-finite components. The strict variant SHALL validate `radius` with `assertFinite(radius, 'Vector2.fromAngle:radius')` to match the validation applied to `angle`. This ensures symmetric validation for all parameters that affect the output.

**Source:** `packages/math2d/src/core/vector2.ts:290-294`

#### Scenario: WHEN fromAngle receives NaN radius THEN it throws

- **GIVEN** `angle = 0` and `radius = NaN`
- **WHEN** `Vector2.fromAngle(angle, radius)` is called
- **THEN** the function SHALL throw with a message referencing `Vector2.fromAngle:radius`

#### Scenario: WHEN fromAngle receives Infinity radius THEN it throws

- **GIVEN** `angle = PI / 4` and `radius = Infinity`
- **WHEN** `Vector2.fromAngle(angle, radius)` is called
- **THEN** the function SHALL throw with a message referencing `Vector2.fromAngle:radius`

#### Scenario: WHEN fromAngle receives negative Infinity radius THEN it throws

- **GIVEN** `angle = 0` and `radius = -Infinity`
- **WHEN** `Vector2.fromAngle(angle, radius)` is called
- **THEN** the function SHALL throw

#### Scenario: WHEN fromAngle receives valid radius THEN behavior is unchanged

- **GIVEN** `angle = PI / 2` and `radius = 2`
- **WHEN** `Vector2.fromAngle(angle, radius)` is called
- **THEN** the result SHALL be approximately `Vector2(0, 2)` (existing behavior preserved)

#### Scenario: WHEN fromAngle receives negative valid radius THEN it works

- **GIVEN** `angle = 0` and `radius = -1`
- **WHEN** `Vector2.fromAngle(angle, radius)` is called
- **THEN** the result SHALL be `Vector2(-1, 0)` (negative radius produces opposite direction)

#### Scenario: WHEN fromAngle receives default radius THEN no validation error

- **GIVEN** `angle = PI / 4`
- **WHEN** `Vector2.fromAngle(angle)` is called (radius defaults to 1)
- **THEN** the function SHALL NOT throw and the result SHALL be a unit vector at PI/4

---

### Requirement: Instance setFromArray methods SHALL validate array bounds

The instance methods `Vector2.setFromArray`, `Complex.setFromArray`, `Matrix2.setFromArray`, `Matrix3.setFromArray`, and `Interval.setFromArray` use `array[offset]!` (non-null assertion) without validating that the array has sufficient elements at the given offset. The corresponding static `fromArray` methods DO validate bounds. The instance methods SHALL add the same bounds validation as their static counterparts, throwing `RangeError` when `offset + requiredElements > array.length`.

**Source:** `packages/math2d/src/core/vector2.ts:2705-2707`, `complex.ts:1180-1182`, `matrix2.ts:1801-1803`, `matrix3.ts:2409-2418`, `interval.ts:1220-1222`

#### Scenario: WHEN Vector2.setFromArray receives out-of-bounds offset THEN it throws

- **GIVEN** `v = new Vector2()`, `array = [1]`, `offset = 0`
- **WHEN** `v.setFromArray(array, offset)` is called (needs 2 elements, array has 1)
- **THEN** the function SHALL throw `RangeError` indicating insufficient array length

#### Scenario: WHEN Vector2.setFromArray receives valid array THEN behavior is unchanged

- **GIVEN** `v = new Vector2()`, `array = [3, 4, 5]`, `offset = 1`
- **WHEN** `v.setFromArray(array, offset)` is called
- **THEN** `v` SHALL be `Vector2(4, 5)` (existing behavior preserved)

#### Scenario: WHEN Complex.setFromArray receives empty array THEN it throws

- **GIVEN** `z = new Complex()`, `array = []`, `offset = 0`
- **WHEN** `z.setFromArray(array, offset)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN Matrix2.setFromArray receives insufficient elements THEN it throws

- **GIVEN** `m = new Matrix2()`, `array = [1, 2, 3]`, `offset = 0`
- **WHEN** `m.setFromArray(array, offset)` is called (needs 4 elements)
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN Matrix3.setFromArray receives insufficient elements THEN it throws

- **GIVEN** `m = new Matrix3()`, `array = [1, 2, 3, 4, 5, 6, 7, 8]`, `offset = 0`
- **WHEN** `m.setFromArray(array, offset)` is called (needs 9 elements)
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN Interval.setFromArray receives offset beyond array THEN it throws

- **GIVEN** `i = new Interval()`, `array = [1, 2, 3]`, `offset = 2`
- **WHEN** `i.setFromArray(array, offset)` is called (needs elements at indices 2 and 3, but index 3 is out of bounds)
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN Matrix3.setFromArray receives valid array with offset THEN it works

- **GIVEN** `m = new Matrix3()`, `array` with 12 elements, `offset = 3`
- **WHEN** `m.setFromArray(array, offset)` is called
- **THEN** `m` SHALL be set from elements `array[3]` through `array[11]` (existing behavior preserved)
