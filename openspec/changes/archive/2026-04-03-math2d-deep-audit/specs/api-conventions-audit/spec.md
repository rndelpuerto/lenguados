## ADDED Requirements

### Requirement: static/instance symmetry completeness

Every static method that operates on a single instance SHALL have a corresponding instance method, except where the return type fundamentally conflicts (e.g., `getLengthAndNormalize` returns a compound result incompatible with fluent chaining).

**Evidence:** The "completeness over minimalism" pillar (2026-03-21 audit-fixes D-AF-02) and "static owns logic, instance delegates" principle (D-F1-21) mandate this.

#### Scenario: Vector2 direction tier completeness

- **WHEN** `Vector2.directionUnchecked` exists as a static method
- **THEN** `vector.directionToUnchecked(target)` SHALL exist as an instance method

#### Scenario: Interval divide tier completeness

- **WHEN** `Interval.divideSafe` and `Interval.divideUnchecked` exist as static methods
- **THEN** `interval.divideSafe(scalar)` and `interval.divideUnchecked(scalar)` SHALL exist as instance methods

#### Scenario: Transform2 inverse safe completeness

- **WHEN** `Transform2.inverseTransformPointSafe` and `Transform2.inverseTransformVectorSafe` exist as static methods
- **THEN** corresponding instance methods SHALL exist

### Requirement: Strict/Safe/Unchecked triality consistency

Every fallible operation SHALL offer all three tiers with consistent naming and behavior.

**Evidence:** D-F1-23 established this pattern inspired by Rapier. D-E1-04 formalized the \*Safe contract: "finite-in/finite-out, fallback validity, monotonicity."

#### Scenario: Consistent tier naming

- **WHEN** a method `foo` has variants
- **THEN** `foo` = strict (throws), `fooSafe` = returns fallback, `fooUnchecked` = no validation

#### Scenario: Safe contract compliance

- **WHEN** any `*Safe` function receives finite input
- **THEN** it SHALL return a finite result (per D-E1-04 formal contract)

#### Scenario: Unchecked IEEE propagation

- **WHEN** any `*Unchecked` function receives degenerate input
- **THEN** it SHALL produce IEEE 754 results (NaN/Infinity) without checking

### Requirement: out parameter convention

The `out` parameter SHALL always be the last optional parameter.

**Evidence:** D-F1-20 established this. Empirically measured 13x speedup with `out` parameter (D-F1, findings/14: `Vector2.add(a,b)` = 80ns, `Vector2.add(a,b,out)` = 6ns).

#### Scenario: Consistent positioning

- **WHEN** any static method accepts an `out` parameter
- **THEN** it SHALL be the last parameter and optional

### Requirement: CS variant convention — documentation over forced consistency

Methods accepting pre-computed cos/sin SHALL follow the `*CS` suffix convention. Parameter order differences SHALL be DOCUMENTED, not forced into uniformity.

**Evidence:** The devil's advocate demonstrated that `transformDirectionCS` omits the `transform` parameter because direction transforms only use rotation. Adding an unused `transform` violates the Interface Segregation Principle (ISP) — users would pass data that is silently ignored.

**Historical:** D-H1-03 established that \*CS variants use direct set for hot-path performance.

#### Scenario: CS naming consistency

- **WHEN** a method has a pre-computed cos/sin variant
- **THEN** it SHALL use the `*CS` suffix

#### Scenario: Direction CS documented rationale

- **WHEN** `transformDirectionCS` has different parameters than `transformPointCS`
- **THEN** the JSDoc SHALL explain: "Omits transform parameter because only rotation is used (ISP)"

### Requirement: instance method mutation and chaining

All instance mutator methods SHALL mutate `this` and return `this` for chaining.

**Evidence:** D-F1-21 ("static owns logic, instance delegates") and the universal pattern across all 7 core types.

#### Scenario: Chaining pattern

- **WHEN** `vector.add(other).scale(2).normalize()` is called
- **THEN** each method SHALL mutate the same vector and return it

#### Scenario: Allocating getters return new instances

- **WHEN** a property getter (`normalized`, `negated`, `inverted`) is accessed
- **THEN** it SHALL return a NEW instance, never mutating the original

### Requirement: DRY delegation for instance comparison methods (P2)

Instance comparison methods SHALL delegate to their static counterparts.

**Evidence:** Code verification confirmed 9 Matrix2 and 9 Matrix3 instance comparison methods re-implement static logic. Methods like `exactEquals`, `nearEquals`, `hasInfinity` already correctly delegate, proving the pattern works.

**Devil's advocate concern:** V8 inlining. **Rebuttal:** These are NOT hot-path operations. You don't check `isOrthogonal` 50,000 times per frame. Maintenance risk of 18 duplicated methods outweighs theoretical performance concern.

#### Scenario: Matrix2 delegation

- **WHEN** `matrix.isIdentity(epsilon)` is called
- **THEN** it SHALL execute `return Matrix2.isIdentity(this, epsilon)`

#### Scenario: Matrix3 delegation

- **WHEN** `matrix3.isOrthogonal(epsilon)` is called
- **THEN** it SHALL execute `return Matrix3.isOrthogonal(this, epsilon)`

#### Scenario: Transform2 delegation

- **WHEN** `transform.isIdentity(epsilon)` is called
- **THEN** it SHALL execute `return Transform2.isIdentity(this, epsilon)`

### Requirement: Rotation2 normalization behavior — setDirect for static arithmetic (P1)

Static arithmetic methods on Rotation2 SHALL NOT normalize when operating on unit-length inputs.

**Evidence:** Box2D `b2MulRot` — NO normalization (DEFINITIVE from source). nalgebra `UnitComplex::mul` — `new_unchecked` (DEFINITIVE from source). The `@remarks` on `Rotation2.multiply` already acknowledges drift accumulates and suggests "call normalize periodically."

#### Scenario: Performance parity with instance methods

- **WHEN** `Rotation2.multiply(a, b)` is called
- **THEN** it SHALL NOT call `hypot` or perform division
- **THEN** it SHALL use the private `setDirect` method with a dev-mode unit-length assertion

### Requirement: naming consistency — ReadonlyLike for input

All methods accepting core types as input SHALL use `Readonly*Like` parameter types.

**Evidence:** D-F1-20 established this as a universal convention. Code verification confirmed `Complex.fromObject` uses `ComplexLike` (not `ReadonlyComplexLike`) — the only known violation.

#### Scenario: Readonly input convention

- **WHEN** a method accepts a core type as read-only input
- **THEN** the parameter type SHALL use `Readonly*Like` (e.g., `ReadonlyVector2Like`, `ReadonlyComplexLike`)

### Requirement: documentation accuracy

All JSDoc SHALL accurately describe the method's actual behavior.

**Evidence:** Code verification confirmed multiple inaccuracies across the codebase.

#### Scenario: No misleading @throws

- **WHEN** `Vector2.fromObject` does not throw
- **THEN** it SHALL NOT have a `@throws` annotation

#### Scenario: No misleading @remarks about deterministic sqrt

- **WHEN** `Matrix2.frobeniusNorm` uses `Math.sqrt`
- **THEN** the `@remarks` SHALL say "Uses Math.sqrt which is IEEE 754 deterministic (correctly rounded to 0.5 ULP)" per D-F1-05

#### Scenario: No misleading clamped parameters

- **WHEN** `Transform2.lerp` does NOT clamp t
- **THEN** the `@param` SHALL NOT say "clamped"

#### Scenario: No misleading extraction method claims

- **WHEN** `Rotation2.fromMatrix2` uses `set(m00, m01)` (normalizes via hypot)
- **THEN** the JSDoc SHALL NOT say "extracts rotation via atan2"

### Requirement: three-tier DRY pattern for inverse operations (P2)

Operations with strict/safe/unchecked tiers that share the same core math SHALL use the guard-then-delegate pattern.

**Evidence:** Transform2 has three copies of the same 10-line inverse math (code verification confirmed at lines 592-704). The guard-then-delegate pattern is already used elsewhere in the codebase.

#### Scenario: Transform2 inverse refactoring

- **WHEN** `Transform2.inverse()` is implemented
- **THEN** it SHALL perform its guard check, then call `Transform2.inverseUnchecked()`

#### Scenario: Behavioral equivalence

- **WHEN** the refactored methods are tested
- **THEN** they SHALL produce identical results for all inputs including edge cases (NaN, Infinity, zero-scale)

### Requirement: component-wise operations all-or-nothing principle

If any component-wise operation (abs, min, max, clamp, mod, lerp, smoothStep) exists on a type, then ALL component-wise operations (floor, ceil, round, trunc, sign) SHALL also exist.

**Evidence:** D-AF-03 (2026-03-21 audit-fixes) explicitly established this: "The library already provides abs/min/max/clamp/mod/lerp/smoothStep on matrices NOT deprecated. Deprecating only floor/ceil/round/trunc/sign is an arbitrary asymmetry with no principled justification."

#### Scenario: No arbitrary removal

- **WHEN** a component-wise operation is evaluated for removal from a type
- **THEN** it SHALL NOT be removed unless ALL component-wise operations are removed from that type

#### Scenario: Matrix2.multiplyScalar preserved

- **WHEN** `Matrix2.multiplyScalar` (alias for `scale`) is evaluated
- **THEN** it SHALL be KEPT per the all-or-nothing principle

### Requirement: no @deprecated policy

Items SHALL either exist clean or be removed entirely. No `@deprecated` annotations.

**Evidence:** D-AF-01 (2026-03-21): "No deprecated code, aliases, or legacy. Items either earn their place or are removed entirely." This REVERSED the 2026-03-20 deprecation-first strategy (D-C1-01). The library is pre-1.0 semver, allowing breaking changes.

#### Scenario: No deprecation limbo

- **WHEN** an item is determined to not belong
- **THEN** it SHALL be deleted entirely, not annotated with `@deprecated`
