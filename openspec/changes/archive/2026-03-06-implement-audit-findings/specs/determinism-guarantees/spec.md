## REMOVED Requirements

### Requirement: Custom sqrt removed from deterministic kernels

**Reason**: `Math.sqrt` is an IEEE 754 **required** correctly-rounded operation (0.5 ULP guaranteed). A custom polynomial sqrt is both slower (6x per benchmark) and less accurate. No cross-platform variation exists for `Math.sqrt`.
**Migration**: Use `Math.sqrt` directly. For safe variants, use `sqrtSafe` from `auxiliary/numeric/safety.ts`.

## MODIFIED Requirements

### Requirement: Deterministic kernel exports

The `deterministic/deterministic-kernels.ts` module SHALL export:

- `DeterministicKernels` object containing all deterministic functions
- Individual named exports: `sin`, `cos`, `sinCos`, `tan`, `asin`, `asinSafe`, `acos`, `acosSafe`, `atan`, `atan2`, `exp`, `expSafe`, `log`, `logSafe`, `pow`, `hypot`
- `config` object with `useNativeMath: boolean` toggle
- Re-export of `sqrtSafe` from `auxiliary/numeric/safety.ts` (backward compatibility)

The module SHALL NOT export a custom `sqrt` function. All internal uses of sqrt SHALL use `Math.sqrt` directly.

#### Scenario: sqrt is not exported

- **WHEN** a consumer attempts to import `sqrt` from `@lenguados/math2d/deterministic`
- **THEN** the symbol SHALL NOT exist (removed)

#### Scenario: hypot uses Math.sqrt internally

- **WHEN** `hypot(3, 4)` is called
- **THEN** it SHALL return `5` using `Math.sqrt` internally (not a custom polynomial)

#### Scenario: sinCos accepts out parameter

- **WHEN** `sinCos(angle, existingObject)` is called with an `out` parameter
- **THEN** it SHALL write cos and sin into the provided object and return it, avoiding allocation

### Requirement: sinCos performs single range reduction

The `deterministic/sinCos` function SHALL compute sin and cos using a single shared range reduction step, not by calling `sin()` and `cos()` separately (which each perform their own range reduction).

#### Scenario: sinCos matches separate calls

- **WHEN** `sinCos(angle)` is called for any angle
- **THEN** `result.sin` SHALL equal `sin(angle)` and `result.cos` SHALL equal `cos(angle)` within EPSILON

#### Scenario: sinCos is faster than separate calls

- **WHEN** `sinCos(angle)` is compared to `{ sin: sin(angle), cos: cos(angle) }`
- **THEN** sinCos SHALL perform at most one range reduction (shared), not two
