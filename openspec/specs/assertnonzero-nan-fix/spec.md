## ADDED Requirements

### Requirement: `assertNonZero` SHALL reject NaN

The `assertNonZero` assertion function SHALL throw for NaN inputs in development mode. The current guard `if (value === 0)` misses NaN because `NaN === 0` evaluates to `false` per IEEE 754 comparison semantics.

This is the identical issue fixed for `assertPositive` and `assertNonNegative` in `audit-bug-fixes` (task 1.3). All three assertion functions guard against a numeric range; all three must reject NaN because NaN is not in any valid numeric range.

**Fix**: Change `if (value === 0)` to `if (value !== value || value === 0)` in the `assertNonZero` implementation in `packages/math2d/src/validation/assert.ts`.

#### Scenario: assertNonZero rejects NaN

- **WHEN** `assertNonZero(NaN)` is called in development mode
- **THEN** the function SHALL throw an Error (consistent with `assertPositive(NaN)` and `assertNonNegative(NaN)`)

#### Scenario: assertNonZero still accepts valid non-zero numbers

- **WHEN** `assertNonZero(1)` is called
- **THEN** the function SHALL NOT throw

#### Scenario: assertNonZero still accepts negative non-zero numbers

- **WHEN** `assertNonZero(-0.001)` is called
- **THEN** the function SHALL NOT throw

#### Scenario: assertNonZero still rejects zero

- **WHEN** `assertNonZero(0)` is called in development mode
- **THEN** the function SHALL throw
