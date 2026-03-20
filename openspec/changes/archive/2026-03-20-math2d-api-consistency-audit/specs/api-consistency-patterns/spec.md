## ADDED Requirements

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
