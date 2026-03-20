## MODIFIED Requirements

### Requirement: R-LIKE-INTERVAL — All Interval instance methods accepting intervals SHALL use ReadonlyIntervalLike

All `Interval` instance methods that accept an interval as a parameter SHALL use `ReadonlyIntervalLike` instead of `ReadonlyInterval` or `Interval`. This enables interop with plain `{ min, max }` objects and is consistent with the convention followed by Vector2, Complex, Matrix2, and Matrix3 instance methods.

**Affected methods (11, verified against source `interval.ts`):**

- `copy(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1305)
- `overlaps(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1428)
- `isSubsetOf(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1440)
- `add(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1456)
- `subtract(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1470)
- `multiply(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1486)
- `intersect(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1727)
- `union(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1746)
- `exactEquals(other)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1809)
- `nearEquals(other, epsilon?)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L1826)
- `lerpInterval(other, t, out?)` — current: `ReadonlyInterval` -> target: `ReadonlyIntervalLike` (L2013)

#### Scenario: WHEN an Interval instance method receives a plain object THEN it compiles

- **GIVEN** `i = new Interval(0, 10)` and `other = { min: 3, max: 7 }`
- **WHEN** `i.intersects(other)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be `true`

#### Scenario: WHEN an Interval instance method receives a concrete Interval THEN it still works

- **GIVEN** `i = new Interval(0, 10)` and `other = new Interval(3, 7)`
- **WHEN** `i.intersects(other)` is called
- **THEN** it SHALL compile and return `true` (backward compatible)

#### Scenario: WHEN union is called with a plain object THEN the union is computed

- **GIVEN** `i = new Interval(2, 5)` and `other = { min: 4, max: 8 }`
- **WHEN** `i.union(other)` is called
- **THEN** `i` SHALL be `Interval(2, 8)`

#### Scenario: WHEN nearEquals is called with a plain object THEN comparison works

- **GIVEN** `i = new Interval(1.0, 2.0)` and `other = { min: 1.0 + 1e-11, max: 2.0 - 1e-11 }`
- **WHEN** `i.nearEquals(other)` is called
- **THEN** the result SHALL be `true` (within default EPSILON)

---

### Requirement: R-LIKE-MAT2 — Matrix2.transformVector instance SHALL accept ReadonlyVector2Like

The instance method `Matrix2.prototype.transformVector(vector)` SHALL accept `ReadonlyVector2Like` instead of `ReadonlyVector2`. The static counterpart `Matrix2.transformVector(matrix, vector, out?)` already accepts `ReadonlyVector2Like`. The instance method SHALL be consistent.

**Current:** `transformVector(vector: ReadonlyVector2): this`
**Target:** `transformVector(vector: ReadonlyVector2Like): this`

#### Scenario: WHEN Matrix2 instance transformVector receives a plain object THEN it compiles

- **GIVEN** `m = Matrix2.fromRotation(PI / 4)` and `v = { x: 1, y: 0 }`
- **WHEN** `m.transformVector(v)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error

#### Scenario: WHEN Matrix2 instance transformVector receives a Vector2 THEN it still works

- **GIVEN** `m = Matrix2.fromRotation(PI / 4)` and `v = new Vector2(1, 0)`
- **WHEN** `m.transformVector(v)` is called
- **THEN** it SHALL compile and produce correct results (backward compatible)

---

### Requirement: R-LIKE-COMPLEX — Complex.clone/copy static SHALL accept ReadonlyComplexLike

The static methods `Complex.clone(complex)` and `Complex.copy(source, out)` SHALL accept `ReadonlyComplexLike` instead of `ReadonlyComplex`. This enables creating Complex instances from plain `{ real, imag }` objects.

**Current:**

- `Complex.clone(complex: ReadonlyComplex): Complex`
- `Complex.copy(source: ReadonlyComplex, out: Complex): Complex`

**Target:**

- `Complex.clone(complex: ReadonlyComplexLike): Complex`
- `Complex.copy(source: ReadonlyComplexLike, out: Complex): Complex`

#### Scenario: WHEN Complex.clone receives a plain object THEN it creates a Complex instance

- **GIVEN** `obj = { real: 3, imag: 4 }`
- **WHEN** `Complex.clone(obj)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be a `Complex` instance with `real = 3` and `imag = 4`

#### Scenario: WHEN Complex.copy receives a plain object THEN it copies to out

- **GIVEN** `source = { real: 1, imag: 2 }` and `out = new Complex()`
- **WHEN** `Complex.copy(source, out)` is called
- **THEN** `out.real` SHALL be `1` and `out.imag` SHALL be `2`

#### Scenario: WHEN Complex.clone receives a Complex instance THEN it still works

- **GIVEN** `z = new Complex(5, 6)`
- **WHEN** `Complex.clone(z)` is called
- **THEN** the result SHALL be a new `Complex` with `real = 5` and `imag = 6` (backward compatible)

---

### Requirement: R-ASSERTS — All assert\*Like functions SHALL have asserts return type

All 7 `assert*Like` validation functions SHALL use TypeScript's `asserts` return type for zero-cost type narrowing. After a successful assertion call, the compiler SHALL narrow the parameter type to the corresponding `*Like` interface without any runtime overhead.

**Affected functions:**

- `assertVector2Like(value: unknown, name?: string): asserts value is Vector2Like`
- `assertComplexLike(value: unknown, name?: string): asserts value is ComplexLike`
- `assertRotation2Like(value: unknown, name?: string): asserts value is Rotation2Like`
- `assertIntervalLike(value: unknown, name?: string): asserts value is IntervalLike`
- `assertMatrix2Like(value: unknown, name?: string): asserts value is Matrix2Like`
- `assertMatrix3Like(value: unknown, name?: string): asserts value is Matrix3Like`
- `assertTransform2Like(value: unknown, name?: string): asserts value is Transform2Like`

#### Scenario: WHEN assertVector2Like succeeds THEN the value is narrowed to Vector2Like

- **GIVEN** `value: unknown = { x: 1, y: 2 }`
- **WHEN** `assertVector2Like(value)` is called and does not throw
- **THEN** the TypeScript compiler SHALL treat `value` as `Vector2Like` in subsequent code
- **AND** `value.x` and `value.y` SHALL be accessible without casts

#### Scenario: WHEN assertVector2Like fails THEN it throws TypeError

- **GIVEN** `value: unknown = { a: 1, b: 2 }` (not Vector2Like)
- **WHEN** `assertVector2Like(value)` is called
- **THEN** the function SHALL throw `TypeError`

#### Scenario: WHEN the emitted JavaScript is inspected THEN it is identical to the void version

- **GIVEN** the `assertVector2Like` function with `asserts` return type
- **WHEN** the emitted JavaScript is compared to the previous `void` return type version
- **THEN** the output SHALL be byte-identical (the `asserts` keyword is type-level only)

#### Scenario: WHEN all 7 assert functions are inspected THEN all have asserts return type

- **GIVEN** the validation module exports
- **WHEN** the return types of `assertVector2Like`, `assertComplexLike`, `assertRotation2Like`, `assertIntervalLike`, `assertMatrix2Like`, `assertMatrix3Like`, and `assertTransform2Like` are inspected
- **THEN** all 7 SHALL have `asserts value is *Like` return types

---

### Requirement: R-FORMAT — All format functions SHALL accept Readonly\*Like input types

All 7 formatting functions in `utils/parse.ts` SHALL accept `Readonly*Like` input types (not concrete class types or branded `Readonly*` aliases). This ensures plain objects can be formatted without constructing class instances.

**Affected functions (6 need widening, verified against source):**

- `formatVector2(v: ReadonlyVector2Like, ...)` (currently `ReadonlyVector2`, L146)
- `formatMatrix2(m: ReadonlyMatrix2Like, ...)` (currently `ReadonlyMatrix2`, L384)
- `formatMatrix3(m: ReadonlyMatrix3Like, ...)` (currently `ReadonlyMatrix3`, L519)
- `formatTransform2(t: ReadonlyTransform2Like, ...)` (currently `ReadonlyTransform2`, L669)
- `formatComplex(c: ReadonlyComplexLike, ...)` (currently `ReadonlyComplex`, L804)
- `formatInterval(interval: ReadonlyIntervalLike, ...)` (currently `ReadonlyInterval`, L923)

**Already correct:** `formatRotation2(r: ReadonlyRotation2Like, ...)` (L266) — no change needed.

#### Scenario: WHEN formatVector2 receives a plain object THEN it formats correctly

- **GIVEN** `v = { x: 3.14159, y: 2.71828 }`
- **WHEN** `formatVector2(v, 2)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error
- **AND** the result SHALL be a formatted string containing the rounded values

#### Scenario: WHEN formatInterval receives a plain object THEN it formats correctly

- **GIVEN** `i = { min: 1.5, max: 3.7 }`
- **WHEN** `formatInterval(i, 1)` is called
- **THEN** the TypeScript compiler SHALL NOT produce an error

#### Scenario: WHEN formatComplex receives a Complex instance THEN it still works

- **GIVEN** `z = new Complex(1, 2)`
- **WHEN** `formatComplex(z)` is called
- **THEN** the result SHALL be a formatted string (backward compatible)

---

### Requirement: R-LERP-DOC — All lerp methods SHALL document whether t is clamped or unclamped

Every `lerp` method across all types (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3) SHALL have its `@param t` JSDoc accurately state whether `t` is clamped or unclamped.

**Rule:** Base `lerp` methods are unclamped (allow extrapolation). `lerpClamped` methods clamp `t` to `[0, 1]`.

**Currently incorrect documentation (to be fixed):**

- `Matrix2.lerp` — JSDoc claims `t` is clamped; implementation does NOT clamp.
- `Matrix3.lerp` — JSDoc claims `t` is clamped; implementation does NOT clamp.
- `Interval.lerp` — JSDoc claims `t` is clamped; implementation does NOT clamp.

#### Scenario: WHEN Matrix2.lerp is called with t > 1 THEN it extrapolates

- **GIVEN** `a = Matrix2.IDENTITY` and `b = Matrix2.fromScale(2, 2)` and `t = 2.0`
- **WHEN** `Matrix2.lerp(a, b, t)` is called
- **THEN** the result SHALL extrapolate beyond `b` (not clamped to `b`)

#### Scenario: WHEN Matrix2.lerp JSDoc is inspected THEN t is documented as unclamped

- **GIVEN** the `Matrix2.lerp` static method
- **WHEN** the `@param t` JSDoc is inspected
- **THEN** it SHALL state that `t` is not clamped and allows extrapolation

#### Scenario: WHEN Interval.lerp is called with t = -0.5 THEN it extrapolates

- **GIVEN** `a = Interval(0, 10)` and `b = Interval(10, 20)` and `t = -0.5`
- **WHEN** `Interval.lerp(a, b, t)` is called
- **THEN** the result SHALL extrapolate below `a` (not clamped to `a`)

#### Scenario: WHEN Matrix3.lerp JSDoc is inspected THEN t is documented as unclamped

- **GIVEN** the `Matrix3.lerp` static method
- **WHEN** the `@param t` JSDoc is inspected
- **THEN** it SHALL state that `t` is not clamped

---

### Requirement: R-LERPCLAMPED-DOC — lerpClamped methods SHALL NOT claim to be an alias for lerp

The `lerpClamped` methods in Matrix2, Matrix3, and Interval currently have JSDoc that incorrectly states they are "an alias for lerp which already clamps" or similar language implying that `lerp` clamps. Since `lerp` does NOT clamp, this documentation is misleading. The `lerpClamped` JSDoc SHALL be updated to state: "Clamps `t` to `[0, 1]` before delegating to `lerp`" or equivalent accurate description.

**Affected methods:**

- `Matrix2.lerpClamped` / `Matrix2.prototype.lerpClamped`
- `Matrix3.lerpClamped` / `Matrix3.prototype.lerpClamped`
- `Interval.lerpClamped` / `Interval.prototype.lerpClamped`

#### Scenario: WHEN Matrix2.lerpClamped JSDoc is inspected THEN it does not claim lerp clamps

- **GIVEN** the `Matrix2.lerpClamped` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL NOT contain phrases like "alias for lerp" or "lerp already clamps"
- **AND** it SHALL state that `t` is clamped to `[0, 1]` before interpolation

#### Scenario: WHEN Matrix3.lerpClamped JSDoc is inspected THEN it accurately describes behavior

- **GIVEN** the `Matrix3.lerpClamped` static method
- **WHEN** the JSDoc is inspected
- **THEN** it SHALL state that it clamps `t` to `[0, 1]` before delegating to `lerp`

#### Scenario: WHEN Interval.lerpClamped is called with t > 1 THEN result matches lerp at t=1

- **GIVEN** `a = Interval(0, 10)` and `b = Interval(10, 20)` and `t = 5.0`
- **WHEN** `Interval.lerpClamped(a, b, t)` is called
- **THEN** the result SHALL be `Interval(10, 20)` (clamped `t` to `1.0`, then `lerp(a, b, 1.0) = b`)
