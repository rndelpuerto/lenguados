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

- `floorDivide(value, divisor)` — strict, throws `RangeError` when `divisor === 0`
- `floorDivideSafe(value, divisor, fallback?)` — returns `0` (or provided fallback) when `divisor === 0`
- `floorDivideUnchecked(value, divisor)` — no validation, current behavior preserved

**Source:** `packages/math2d/src/auxiliary/scalar/arithmetic.ts:416-418`

#### Scenario: WHEN strict floorDivide receives zero divisor THEN it throws

- **GIVEN** `value = 7` and `divisor = 0`
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating zero divisor

#### Scenario: WHEN strict floorDivide receives small non-zero divisor THEN it computes

- **GIVEN** `value = 7` and `divisor = 1e-11`
- **WHEN** `floorDivide(value, divisor)` is called
- **THEN** the function SHALL return `Math.floor(7 / 1e-11)` (valid computation, exact zero is the only rejected input)

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

---

### Requirement: Matrix2 Safe/Unchecked test coverage

All Matrix2 Safe and Unchecked triality variants SHALL have explicit test cases verifying their contracts.

#### Scenario: inverseSafe returns identity for singular matrix

- **WHEN** `Matrix2.inverseSafe(singularMatrix)` is called where determinant is near-zero
- **THEN** the result SHALL be the identity matrix
- **AND** no exception SHALL be thrown

#### Scenario: inverseUnchecked skips validation

- **WHEN** `Matrix2.inverseUnchecked(matrix)` is called on an invertible matrix
- **THEN** the result SHALL be the correct inverse

#### Scenario: divideScalarSafe returns zero for near-zero scalar

- **WHEN** `Matrix2.divideScalarSafe(matrix, 0)` is called
- **THEN** the result SHALL be the zero matrix
- **AND** no exception SHALL be thrown

#### Scenario: divideScalarUnchecked skips validation

- **WHEN** `Matrix2.divideScalarUnchecked(matrix, 2)` is called
- **THEN** the result SHALL equal the matrix with all components halved

---

### Requirement: Matrix3 Safe/Unchecked test coverage

All Matrix3 Safe and Unchecked triality variants SHALL have explicit test cases verifying their contracts.

#### Scenario: inverseSafe returns identity for singular matrix

- **WHEN** `Matrix3.inverseSafe(singularMatrix)` is called where determinant is near-zero
- **THEN** the result SHALL be the identity matrix
- **AND** no exception SHALL be thrown

#### Scenario: inverseUnchecked on invertible matrix

- **WHEN** `Matrix3.inverseUnchecked(matrix)` is called on an invertible matrix
- **THEN** the result SHALL be the correct inverse

#### Scenario: divideScalarSafe returns zero for near-zero scalar

- **WHEN** `Matrix3.divideScalarSafe(matrix, 0)` is called
- **THEN** the result SHALL be the zero matrix
- **AND** no exception SHALL be thrown

#### Scenario: divideScalarUnchecked on valid scalar

- **WHEN** `Matrix3.divideScalarUnchecked(matrix, 2)` is called
- **THEN** the result SHALL equal the matrix with all components halved

---

### Requirement: Complex predicate test coverage

Complex static predicates and instance comparison methods SHALL have explicit test coverage.

#### Scenario: hasNaN detects NaN in real part

- **WHEN** `Complex.hasNaN(new Complex(NaN, 1))` is called
- **THEN** the result SHALL be `true`

#### Scenario: hasNaN detects NaN in imaginary part

- **WHEN** `Complex.hasNaN(new Complex(1, NaN))` is called
- **THEN** the result SHALL be `true`

#### Scenario: hasNaN returns false for finite complex

- **WHEN** `Complex.hasNaN(new Complex(3, 4))` is called
- **THEN** the result SHALL be `false`

#### Scenario: hasInfinity detects Infinity

- **WHEN** `Complex.hasInfinity(new Complex(Infinity, 0))` is called
- **THEN** the result SHALL be `true`

#### Scenario: isZero instance predicate

- **WHEN** `new Complex(0, 0).isZero()` is called
- **THEN** the result SHALL be `true`

#### Scenario: isReal instance predicate

- **WHEN** `new Complex(5, 0).isReal()` is called
- **THEN** the result SHALL be `true`
- **AND** `new Complex(5, 1).isReal()` SHALL return `false`

#### Scenario: isImaginary instance predicate

- **WHEN** `new Complex(0, 5).isImaginary()` is called
- **THEN** the result SHALL be `true`
- **AND** `new Complex(1, 5).isImaginary()` SHALL return `false`

---

### Requirement: Transform2 batch operation test coverage

Transform2 batch methods `transformPoints()` and `transformVectors()` SHALL have explicit test coverage including array handling.

#### Scenario: transformPoints batch produces same result as individual

- **WHEN** `transform.transformPoints([p1, p2, p3])` is called
- **THEN** each output point SHALL match `Transform2.transformPoint(transform, pN)`

#### Scenario: transformVectors batch produces same result as individual

- **WHEN** `transform.transformVectors([v1, v2])` is called
- **THEN** each output vector SHALL match `Transform2.transformVector(transform, vN)`

---

### Requirement: Rotation2.fromCS factory test coverage

The `Rotation2.fromCS()` factory method SHALL have explicit test coverage.

#### Scenario: fromCS with unit values

- **WHEN** `Rotation2.fromCS(cos(PI/4), sin(PI/4))` is called
- **THEN** the result SHALL have `cos` and `sin` within EPSILON of the expected values

#### Scenario: fromCS normalizes non-unit input

- **WHEN** `Rotation2.fromCS(2, 0)` is called with non-unit magnitude
- **THEN** the result SHALL be normalized to `(1, 0)` via the normalization path

---

## API Consistency Audit Requirements (2026-03-20)

_Synced from delta spec: `openspec/changes/math2d-api-consistency-audit/specs/api-consistency-patterns`_

### Requirement: R1 — Input parameters SHALL use Readonly\*Like interfaces, NEVER concrete types

Every public method parameter that accepts a math object as input SHALL use the structural `Readonly*Like` interface from `types/` (e.g., `ReadonlyVector2Like`, `ReadonlyComplexLike`, `ReadonlyIntervalLike`). Parameters SHALL NEVER use the concrete class (`Vector2`), the branded readonly alias (`ReadonlyVector2`), or the mutable `*Like` interface (`Vector2Like`). This enables interop with plain objects (`{ x: 1, y: 2 }`) without requiring callers to construct class instances.

**Exception:** When the implementation must access nested objects (e.g., `transform.rotation.cos`), the parameter type may use `ReadonlyTransform2Like` which already defines the nested structure.

**Rule:** Output types (return values, `out` parameters) SHALL use concrete class types (e.g., `Vector2`, `Complex`).

#### Scenario: WHEN a static method accepts a vector input THEN it uses ReadonlyVector2Like

- **GIVEN** `Vector2.add(a, b, out?)` static method
- **WHEN** the TypeScript signature is inspected
- **THEN** `a` SHALL be typed as `ReadonlyVector2Like` and `b` SHALL be typed as `ReadonlyVector2Like`
- **AND** `out` SHALL be typed as `Vector2 | undefined`
- **AND** the return type SHALL be `Vector2`

#### Scenario: WHEN an instance method accepts a math object THEN it uses Readonly\*Like

- **GIVEN** `Interval.prototype.intersects(other)` instance method
- **WHEN** the TypeScript signature is inspected
- **THEN** `other` SHALL be typed as `ReadonlyIntervalLike` (not `ReadonlyInterval` or `Interval`)

#### Scenario: WHEN a plain object is passed to a method expecting Readonly\*Like THEN it compiles

- **GIVEN** a plain object `{ x: 3, y: 4 }` conforming to `ReadonlyVector2Like`
- **WHEN** `Vector2.magnitude({ x: 3, y: 4 })` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be `5`

#### Scenario: WHEN a concrete class instance is passed to a Readonly\*Like parameter THEN it compiles

- **GIVEN** `v = new Vector2(1, 2)`
- **WHEN** `Vector2.magnitude(v)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error (concrete types satisfy structural interfaces)

---

### Requirement: R2 — Fallible operations SHALL provide strict/Safe/Unchecked validation tiers

Every operation that can fail (division by zero, normalization of zero-length vector, singular matrix inversion, etc.) SHALL provide three variants following the naming convention:

1. **Strict** (base name, e.g., `normalize`): Validates inputs and throws `RangeError` on failure.
2. **Safe** (suffix `Safe`, e.g., `normalizeSafe`): Validates inputs and returns a safe fallback value on failure (never throws).
3. **Unchecked** (suffix `Unchecked`, e.g., `normalizeUnchecked`): Performs no validation; behavior on invalid input is undefined (may produce `NaN`/`Infinity`).

The strict variant SHALL always be the default (no suffix). The safe variant SHALL document what fallback value is returned. The unchecked variant SHOULD only be used in performance-critical inner loops where inputs are pre-validated.

#### Scenario: WHEN a fallible operation exists as strict THEN Safe and Unchecked variants also exist

- **GIVEN** `Vector2.normalize(v, out?)` exists as the strict variant
- **WHEN** the module's exports are inspected
- **THEN** `Vector2.normalizeSafe(v, out?)` and `Vector2.normalizeUnchecked(v, out?)` SHALL also exist
- **AND** instance counterparts `normalize()`, `normalizeSafe()`, and `normalizeUnchecked()` SHALL also exist

#### Scenario: WHEN the strict variant receives invalid input THEN it throws RangeError

- **GIVEN** `v = Vector2(0, 0)`
- **WHEN** `Vector2.normalize(v)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: WHEN the Safe variant receives invalid input THEN it returns a fallback

- **GIVEN** `v = Vector2(0, 0)`
- **WHEN** `Vector2.normalizeSafe(v)` is called
- **THEN** the function SHALL return `Vector2(0, 0)` (the documented fallback) without throwing

#### Scenario: WHEN the Unchecked variant receives invalid input THEN it does not throw

- **GIVEN** `v = Vector2(0, 0)`
- **WHEN** `Vector2.normalizeUnchecked(v)` is called
- **THEN** the function SHALL NOT throw (result may be `Vector2(NaN, NaN)`)

---

### Requirement: R3 — Every static method with out? parameter SHALL have an instance counterpart

For every static method `Type.method(input, ..., out?: Type): Type`, there SHALL exist a corresponding instance method `Type.prototype.method(...): this` that mutates `this` and returns `this` for chaining. The instance method SHALL produce identical numerical results to the static method when called with equivalent inputs.

**Exceptions:** Factory methods (e.g., `fromAngle`, `fromValues`, `fromArray`) and pure query methods (e.g., `magnitude`, `dot`, `determinant`) that return scalars are exempt from this requirement.

#### Scenario: WHEN a static method with out? exists THEN its instance counterpart exists

- **GIVEN** `Vector2.add(a, b, out?)` static method
- **WHEN** the instance API is inspected
- **THEN** `Vector2.prototype.add(other)` SHALL exist
- **AND** `v.add(other)` SHALL produce the same result as `Vector2.add(v, other, v)` (mutating `this`)

#### Scenario: WHEN an instance method is called THEN it returns this for chaining

- **GIVEN** `v = new Vector2(1, 2)`
- **WHEN** `result = v.add({ x: 3, y: 4 })` is called
- **THEN** `result` SHALL be the same reference as `v` (`result === v` is `true`)
- **AND** `v` SHALL be `Vector2(4, 6)`

#### Scenario: WHEN a static and instance method are compared THEN they produce identical results

- **GIVEN** `a = Vector2(3, 4)` and `b = Vector2(1, 2)`
- **WHEN** `staticResult = Vector2.subtract(a, b)` and `instanceResult = new Vector2(3, 4).subtract({ x: 1, y: 2 })` are computed
- **THEN** `staticResult.x === instanceResult.x` and `staticResult.y === instanceResult.y` SHALL both be `true`

---

### Requirement: R4 — Naming conventions for parameters, methods, and aliases

The following naming conventions SHALL be applied consistently across all modules:

1. **Parameter names:** Input math objects SHALL be named descriptively (`vector`, `rotation`, `matrix`, `interval`, `complex`) or positionally (`a`, `b`) for binary operations. The `out` parameter SHALL always be named `out`.
2. **Method names:** Mutation methods use verb form (`add`, `subtract`, `scale`). Query methods use noun/adjective form (`magnitude`, `normalized`, `isUnit`). Factory methods use `from*` prefix (`fromAngle`, `fromValues`, `fromArray`).
3. **`*CS` variants:** Methods accepting pre-computed cos/sin SHALL use the `CS` suffix (`rotateCS`, `applyCS`). The cos parameter SHALL come before sin: `method(cos, sin)`.
4. **Aliases:** Aliases SHALL be documented with `@see` referencing the canonical method. Aliases SHALL NOT duplicate implementation logic; they SHALL delegate to the canonical method.

#### Scenario: WHEN a CS variant exists THEN its parameters are ordered (cos, sin)

- **GIVEN** `Vector2.rotateCS(v, cos, sin, out?)` static method
- **WHEN** the parameter order is inspected
- **THEN** `cos` SHALL precede `sin` in the parameter list

#### Scenario: WHEN an alias method exists THEN it delegates to the canonical method

- **GIVEN** an alias method delegating to a canonical method
- **WHEN** the implementation of the alias is inspected
- **THEN** it SHALL delegate to the canonical method (not duplicate its logic)
- **AND** the JSDoc SHALL contain `@see` referencing the canonical method

#### Scenario: WHEN a factory method is named THEN it uses from\* prefix

- **GIVEN** `Rotation2.fromAngle(angle, out?)` factory method
- **WHEN** the method name is inspected
- **THEN** it SHALL start with `from` followed by the source type/concept name

---

### Requirement: R5 — Hot-path helpers SHALL NOT allocate; out parameter pattern for results

Methods used in performance-critical inner loops SHALL NOT allocate intermediate objects (tuples, arrays, plain objects, class instances) that are immediately discarded. Instead:

1. Multi-value results SHALL be written directly to the `out` parameter's fields.
2. Intermediate computations SHALL use local scalar variables (stack-allocated by the JS engine).
3. The `out` parameter SHALL always be the last optional parameter in the signature.
4. When `out` is omitted, the method SHALL allocate a new instance of the return type.

#### Scenario: WHEN a hot-path method is called with out parameter THEN no intermediate allocation occurs

- **GIVEN** `out = new Vector2()`
- **WHEN** `Vector2.add(a, b, out)` is called
- **THEN** the result SHALL be written directly to `out.x` and `out.y`
- **AND** no intermediate `Vector2`, `Array`, or plain object SHALL be allocated
- **AND** the return value SHALL be the same reference as `out`

#### Scenario: WHEN a hot-path method is called without out parameter THEN exactly one allocation occurs

- **GIVEN** no `out` parameter
- **WHEN** `Vector2.add(a, b)` is called
- **THEN** exactly one `new Vector2()` SHALL be allocated for the result
- **AND** no additional intermediate allocations SHALL occur

#### Scenario: WHEN intermediate results are needed THEN local scalars are used

- **GIVEN** a method that computes `cos` and `sin` internally
- **WHEN** the implementation is inspected
- **THEN** the cos and sin values SHALL be stored in `const`/`let` local variables (e.g., `const c = ...`, `const s = ...`), NOT in an intermediate `{ cos, sin }` object or `[cos, sin]` tuple

---

### Requirement: R6 — lerp methods SHALL document clamped/unclamped behavior; @throws required for throwing methods

1. Every `lerp` method SHALL document in its `@param t` JSDoc whether `t` is clamped to `[0, 1]` or unclamped (allowing extrapolation). Base `lerp` methods are unclamped. `lerpClamped` methods clamp `t` before interpolation.
2. `lerpClamped` methods SHALL NOT be documented as "alias for lerp" or claim that "lerp already clamps". They SHALL be documented as "clamps t to [0, 1] before delegating to lerp".
3. Every method that throws an exception SHALL include a `@throws` JSDoc tag specifying the error type and condition.
4. Every method that returns a fallback value on failure (Safe variants) SHALL document the fallback value in `@returns`.

#### Scenario: WHEN a base lerp method's JSDoc is inspected THEN t is documented as unclamped

- **GIVEN** `Matrix2.lerp(a, b, t, out?)` static method
- **WHEN** the `@param t` JSDoc is inspected
- **THEN** it SHALL state that `t` is NOT clamped and allows extrapolation
- **AND** it SHALL NOT contain the word "clamped" in a way that implies clamping occurs

#### Scenario: WHEN a lerpClamped method's JSDoc is inspected THEN it documents clamping behavior

- **GIVEN** `Matrix2.lerpClamped(a, b, t, out?)` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL document that `t` is clamped to `[0, 1]` before interpolation
- **AND** it SHALL NOT claim to be "an alias for lerp" or state that "lerp already clamps"

#### Scenario: WHEN a throwing method's JSDoc is inspected THEN @throws is present

- **GIVEN** `Vector2.normalize(v, out?)` which throws on zero-length input
- **WHEN** the JSDoc is inspected
- **THEN** a `@throws {RangeError}` tag SHALL be present describing the failure condition

---

### Requirement: R7 — Zero-detection SHALL use isNearZero(magnitude); magnitudeSq comparisons require squared thresholds

All zero-magnitude detection checks (is this vector/complex effectively zero?) SHALL use `isNearZero(magnitude)` with the library's standard `EPSILON = 1e-10`. Using `isNearZero(magnitudeSquared)` with the same `EPSILON` triggers at `|z| < sqrt(1e-10) ~ 3.16e-6`, which is 5 orders of magnitude different from the intended threshold.

**Nuanced rule (not a blanket ban on magnitudeSq):**

- **Zero-detection** (is this value effectively zero?): ALWAYS use `isNearZero(magnitude)` with `EPSILON`. Never compare `magnitudeSq` against `EPSILON` directly.
- **Unit-length checks** (`isUnit`): `|magnitudeSq - 1| < EPSILON` is correct and preferred (avoids sqrt). This is NOT zero-detection; it compares against 1, not 0.
- **Any magnitudeSq comparison against a threshold**: the threshold must be squared too (e.g., `magnitudeSq < EPSILON * EPSILON`).

**Rationale:** The ratified api-consistency-triality spec (archived 2026-03-08) explicitly chose magnitudeSq for isUnit. A blanket "never magnitudeSq" rule would contradict that decision. The correct rule is context-dependent: zero-detection requires magnitude; non-zero comparisons can use magnitudeSq with appropriately scaled thresholds.

#### Scenario: WHEN Complex.reciprocal static is inspected THEN it uses magnitude for zero-detection

- **GIVEN** `Complex.reciprocal(z, out?)` static method
- **WHEN** the zero-detection guard is inspected
- **THEN** it SHALL use `isNearZero(magnitude)` where `magnitude` is the magnitude of `z`
- **AND** it SHALL NOT use `isNearZero(magnitudeSquared)` or `isNearZero(magSq)`

#### Scenario: WHEN Complex.reciprocal instance is inspected THEN it uses the same threshold as static

- **GIVEN** `Complex.prototype.reciprocal()` instance method
- **WHEN** the zero-detection guard is inspected
- **THEN** it SHALL use `isNearZero(magnitude)` (not `isNearZero(magnitudeSquared)`)
- **AND** the threshold behavior SHALL be identical to the static method

#### Scenario: WHEN isUnit uses magnitudeSq THEN it is correct because the comparison is against 1

- **GIVEN** `Complex.isUnit(z)` or `Vector2.isUnit(v)`
- **WHEN** the implementation is inspected
- **THEN** it MAY use `|magnitudeSq - 1| < EPSILON` because the comparison target is `1` (not `0`)
- **AND** this is NOT a zero-detection check and therefore the magnitude rule does not apply

#### Scenario: WHEN a near-zero complex is tested THEN both static and instance reciprocal agree

- **GIVEN** `z = Complex(5e-6, 0)` (magnitude = 5e-6, magnitudeSquared = 2.5e-11)
- **WHEN** `Complex.reciprocal(z)` (static) and `new Complex(5e-6, 0).reciprocal()` (instance) are called
- **THEN** both SHALL produce the same result (both use the magnitude threshold, so `5e-6 > EPSILON` means neither treats it as zero)
- **AND** they SHALL NOT disagree because one uses `magnitudeSquared < EPSILON` (which would trigger for `2.5e-11 < 1e-10`)
