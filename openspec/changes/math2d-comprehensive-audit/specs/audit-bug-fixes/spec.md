## ADDED Requirements

### Requirement: ceilPowerOfTwo returns correct results for all powers of two

The `ceilPowerOfTwo` function SHALL return the exact input value when the input is already a power of two. The function currently returns incorrect results for exact powers of 2 at exponents 29, 31, 39, 47, and 51 (verified by executing the function against all exponents 1-52). The root cause is floating-point imprecision in `log(value) / LN_2` producing values like `29.000000000000004`, causing `Math.ceil` to round up to 30.

The fix SHALL apply a snap-to-integer guard on the log2 computation before applying `Math.ceil`. `floorPowerOfTwo` and `roundToPowerOfTwo` SHALL NOT be modified (verified unaffected -- `Math.floor` absorbs the positive error correctly).

#### Scenario: ceilPowerOfTwo with exact power of two at exponent 29

- **WHEN** `ceilPowerOfTwo(2 ** 29)` is called (input = 536870912)
- **THEN** the result SHALL be `536870912` (not `1073741824`)

#### Scenario: ceilPowerOfTwo with exact power of two at exponent 31

- **WHEN** `ceilPowerOfTwo(2 ** 31)` is called (input = 2147483648)
- **THEN** the result SHALL be `2147483648`

#### Scenario: ceilPowerOfTwo with exact power of two at exponent 39

- **WHEN** `ceilPowerOfTwo(2 ** 39)` is called
- **THEN** the result SHALL be `2 ** 39`

#### Scenario: ceilPowerOfTwo with exact power of two at exponent 47

- **WHEN** `ceilPowerOfTwo(2 ** 47)` is called
- **THEN** the result SHALL be `2 ** 47`

#### Scenario: ceilPowerOfTwo with exact power of two at exponent 51

- **WHEN** `ceilPowerOfTwo(2 ** 51)` is called
- **THEN** the result SHALL be `2 ** 51`

#### Scenario: ceilPowerOfTwo with non-power-of-two values remains correct

- **WHEN** `ceilPowerOfTwo(100)` is called
- **THEN** the result SHALL be `128`

#### Scenario: ceilPowerOfTwo for all exponents 1-52

- **WHEN** `ceilPowerOfTwo(2 ** n)` is called for every integer n from 1 to 52
- **THEN** the result SHALL be `2 ** n` for every n

### Requirement: assertPositive and assertNonNegative reject NaN

The `assertPositive` and `assertNonNegative` assertion functions SHALL throw for NaN inputs in development mode. Currently, NaN silently passes because `NaN <= 0` is `false` (IEEE 754 comparison semantics cause NaN to bypass the guard condition).

#### Scenario: assertPositive rejects NaN

- **WHEN** `assertPositive(NaN)` is called in development mode
- **THEN** the function SHALL throw an Error (consistent with all other assertion functions in `assert.ts` which use `throw new Error(...)`)

#### Scenario: assertNonNegative rejects NaN

- **WHEN** `assertNonNegative(NaN)` is called in development mode
- **THEN** the function SHALL throw an Error (consistent with all other assertion functions in `assert.ts` which use `throw new Error(...)`)

#### Scenario: assertPositive still accepts valid positive numbers

- **WHEN** `assertPositive(5)` is called in development mode
- **THEN** the function SHALL NOT throw

#### Scenario: assertNonNegative still accepts zero

- **WHEN** `assertNonNegative(0)` is called in development mode
- **THEN** the function SHALL NOT throw

### Requirement: Rotation2 instance methods that compute new cos/sin have consistent dev-mode assertion

The following `Rotation2` instance methods SHALL include the same dev-only unit-length assertion as their static counterparts (which route through `setDirect` at line 215). Currently, these instance methods directly assign `this.cos` and `this.sin` without the assertion:

1. **`multiply()`** (instance, line 1450): Computes rotation composition. Static `Rotation2.multiply` (line 772) routes through `setDirect`. Instance version directly assigns.
2. **`relativeTo()`** (instance, line 1521): Computes relative rotation. Static `Rotation2.relative` (line 824) routes through `setDirect`. Instance version directly assigns.

Note: Instance `inverse()`, `negate()`, and `conjugate()` are NOT affected because they only negate components, which perfectly preserves unit-length (`(-cos)^2 + (-sin)^2 = cos^2 + sin^2 = 1`).

#### Scenario: Instance multiply assertion consistency

- **WHEN** `rotation.multiply(other)` is called in development mode with a valid unit-length rotation
- **THEN** the dev-only assertion SHALL pass (no throw)

#### Scenario: Instance multiply assertion catches drift

- **WHEN** `rotation.multiply(other)` is called in development mode and the result has drifted beyond the unit-length tolerance
- **THEN** the dev-only assertion SHALL fire (matching static `Rotation2.multiply` behavior)

#### Scenario: Instance relativeTo assertion consistency

- **WHEN** `rotation.relativeTo(other)` is called in development mode with a valid unit-length rotation
- **THEN** the dev-only assertion SHALL pass (no throw)

#### Scenario: Instance relativeTo assertion catches drift

- **WHEN** `rotation.relativeTo(other)` is called in development mode and the result has drifted beyond the unit-length tolerance
- **THEN** the dev-only assertion SHALL fire (matching static `Rotation2.relative` behavior)
