## ADDED Requirements

### Requirement: Interval constructor is pure (no validation)

The `Interval` constructor SHALL NOT perform any validation (NaN checks, min<=max ordering assertions, or sanitization). This brings Interval in line with all other core types (Vector2, Rotation2, Complex, Matrix2, Matrix3, Transform2), which follow the project's explicit "Constructor Purity" rule: constructors MUST have NO assertions.

The `Interval.fromValues()` factory SHALL remain the validated entry point for constructing intervals with guaranteed invariants.

#### Scenario: Constructor accepts reversed bounds without throwing

- **WHEN** `new Interval(5, 3)` is called
- **THEN** the constructor SHALL NOT throw (creates an interval with min=5, max=3)

#### Scenario: Constructor accepts NaN without throwing

- **WHEN** `new Interval(NaN, 5)` is called
- **THEN** the constructor SHALL NOT throw

#### Scenario: fromValues still validates

- **WHEN** `Interval.fromValues(5, 3)` is called
- **THEN** the function SHALL throw (min > max violation)

#### Scenario: fromValues still rejects NaN

- **WHEN** `Interval.fromValues(NaN, 5)` is called
- **THEN** the function SHALL throw

### Requirement: Interval internal paths eliminate double-validation

Static methods currently double-validate: first in the static method itself, then again in `set()` (which calls `sanitize()` + `assertOrder()`). This redundancy SHALL be eliminated.

The approach SHALL be to introduce a private `_setDirect(min: number, max: number)` method that directly assigns without validation, used exclusively by internal/static method paths. The public `set()` method SHALL remain validated as a user-facing safety net (users who call `interval.set(5, 3)` directly should still get a clear error). This matches the pattern where `copy()` is already an unvalidated fast path for trusted sources.

**Verified**: `fromValues()` validates independently (calls `sanitize()` + `assertOrder()` BEFORE calling `set()`), so it will not be affected by internal refactoring.

**Summary of setter hierarchy after refactoring:**

- `_setDirect(min, max)` -- private, no validation, used by static methods and internal paths
- `set(min, max)` -- public, validates (sanitize + assertOrder), user-facing safety net
- `copy(source)` -- public, no validation, trusted fast path for `ReadonlyIntervalLike` sources

#### Scenario: Internal static methods use \_setDirect

- **WHEN** `Interval.add(a, b, out)` is called where `a` and `b` are valid intervals
- **THEN** the result SHALL be computed with at most one validation pass (the static method does NOT validate again via set(); it uses `_setDirect` or equivalent)

#### Scenario: Public set() retains validation for direct user calls

- **WHEN** a user calls `interval.set(5, 3)` directly (reversed bounds)
- **THEN** the method SHALL throw (preserving current user-facing behavior)

#### Scenario: ensureOut() + \_setDirect avoids constructor validation overhead

- **WHEN** a static method calls `ensureOut(out)._setDirect(resultMin, resultMax)` without an `out` parameter
- **THEN** the `new Interval()` constructor (pure after Requirement 1) creates a zero-interval cheaply, then `_setDirect` assigns the real values without validation

### Requirement: Interval copy() remains a direct unvalidated assignment

The `Interval.copy()` method SHALL continue to directly assign min and max from the source without validation, serving as the trusted fast-path for known-good sources.

#### Scenario: copy from valid source

- **WHEN** `interval.copy(source)` is called with a valid `ReadonlyIntervalLike`
- **THEN** min and max SHALL be directly assigned without validation
