## ADDED Requirements

### Requirement: R-ROUNDTOPLACES-JSDOC

The `roundToPlaces` function MUST include a `@remarks` JSDoc note explaining the IEEE 754 floating-point representation limitation: values like `1.005` are stored as `1.00499...` in binary, so `roundToPlaces(1.005, 2)` returns `1.0` not `1.01`. This is inherent to all multiply-round-divide approaches.

#### Scenario: Developer reads roundToPlaces documentation

- **WHEN** a developer reads the JSDoc for `roundToPlaces`
- **THEN** they see a clear warning about the IEEE 754 representation edge case
- **AND** the note explains WHY this happens (binary floating-point representation)

### Requirement: R-NORMALIZE-UNCHECKED-JSDOC

The `Vector2.normalizeUnchecked` static method MUST include a `@remarks` JSDoc note documenting the overflow risk: using `Math.sqrt(x*x + y*y)` instead of `Math.hypot(x, y)` means vectors with components larger than ~1e154 will overflow to Infinity during the magnitude computation.

#### Scenario: Developer uses normalizeUnchecked on large vectors

- **WHEN** a developer reads the JSDoc for `normalizeUnchecked`
- **THEN** they see a clear warning about the overflow threshold
- **AND** the note explains the performance tradeoff vs using `hypot`

### Requirement: R-FROMANGLE-OPTIMIZE

`Rotation2.fromAngle` MUST NOT call `hypot()` to normalize the output of `sinCos()`. Since `sin²(θ) + cos²(θ) = 1` by trigonometric identity, the values from `sinCos()` are already unit-length and normalization is redundant.

#### Scenario: Rotation2.fromAngle performance

- **WHEN** `Rotation2.fromAngle(angle)` is called
- **THEN** it assigns cos/sin directly without calling `set()` which normalizes
- **AND** the result is identical to the previous implementation (mathematically equivalent)

### Requirement: R-LERP-ZERO-GUARD

The scalar `lerp(a, b, t)` function MUST return `a` exactly when `t === 0`, matching the existing `t === 1` guard that returns `b`. This prevents `NaN` results when `b - a` overflows to `±Infinity` and `0 * Infinity = NaN`.

#### Scenario: lerp at t=0 with extreme values

- **WHEN** `lerp(1e308, -1e308, 0)` is called
- **THEN** the result is exactly `1e308` (the value of `a`)
- **AND** it does NOT return `NaN` from overflow in `b - a`

#### Scenario: lerp at t=0 with normal values

- **WHEN** `lerp(3, 7, 0)` is called
- **THEN** the result is exactly `3`

### Requirement: R-NEAREQUALS-JSDOC

The `nearEquals` methods on Vector2 and Matrix2 MUST document in their JSDoc that they use **relative tolerance** (via `relativeEquals`: `|a-b| <= epsilon * max(1, |a|, |b|)`), while the scalar `nearEquals` uses **absolute tolerance** (`|a-b| <= epsilon`).

#### Scenario: Developer compares tolerance behavior

- **WHEN** a developer reads the JSDoc for `Vector2.nearEquals`
- **THEN** the documentation explicitly states the tolerance is relative, not absolute
- **AND** references `relativeEquals` as the underlying comparison
