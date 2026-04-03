## ADDED Requirements

### Requirement: compensatedProduct overflow threshold documentation is accurate

The `compensatedProduct` function's TSDoc `@remarks` SHALL state the correct Veltkamp splitting overflow threshold as approximately `1.34e300` (computed as `Number.MAX_VALUE / 134217729`), replacing the current incorrect value of `~1.34e291`. Verified: `Number.MAX_VALUE / 134217729 = 1.3393857490036326e+300`.

#### Scenario: Developer reads compensatedProduct documentation

- **WHEN** a developer reads the `@remarks` section of `compensatedProduct`
- **THEN** the overflow threshold SHALL reference `~1.34e300` (not `~1.34e291`)

### Requirement: Vector2.inverted getter documents zero-component behavior

The `Vector2.inverted` getter's TSDoc currently has no `@remarks` about edge cases. It SHALL include a note documenting that it does not check for zero components and will return `(Infinity, Infinity)` for a zero vector, unlike the `inverse()` method which throws. Verified: current TSDoc is only 5 lines with no edge case mention.

#### Scenario: Developer reads inverted getter documentation

- **WHEN** a developer reads the TSDoc for the `inverted` getter on Vector2
- **THEN** the documentation SHALL warn about zero-component behavior and reference `inverse()` / `inverseSafe()` as alternatives

### Requirement: sinCosNormalized documents its specific use case

The `sinCosNormalized` function's TSDoc currently says "Normalizes the angle to (-pi, pi] before computing" but does not explain WHEN or WHY to prefer it over `sinCos`. It SHALL include documentation clarifying that it is primarily useful for angles accumulated over many frames (exceeding ~1e6 radians), where Cody-Waite range reduction in the deterministic kernels may lose precision. For typical angle ranges, plain `sinCos` is sufficient.

#### Scenario: Developer reads sinCosNormalized documentation

- **WHEN** a developer reads the TSDoc for `sinCosNormalized`
- **THEN** the documentation SHALL explain when to prefer it over `sinCos`

### Requirement: angleFromVectors documents zero-vector behavior

The `angleFromVectors` function's TSDoc currently describes the computation for non-zero vectors but does not mention zero-length input behavior. It SHALL document that when one or both input vectors have zero length, the result is 0 (via `atan2(0, 0)`).

#### Scenario: Developer reads angleFromVectors documentation

- **WHEN** a developer reads the TSDoc for `angleFromVectors`
- **THEN** the documentation SHALL note that zero-length vectors produce a result of 0

### Requirement: lerpSafe documents non-monotonicity trade-off

The `lerpSafe` function's TSDoc currently says only "Safe linear interpolation that avoids overflow" with no mention of trade-offs. The implementation uses the distributive form `a * (1 - t) + b * t` (visible in source). The TSDoc SHALL document that this form sacrifices monotonicity for overflow safety, and reference the standard `lerp` in `scalar/interpolation.ts` as the monotonic alternative.

#### Scenario: Developer reads lerpSafe documentation

- **WHEN** a developer reads the TSDoc for `lerpSafe`
- **THEN** the documentation SHALL mention the non-monotonicity trade-off

### Requirement: reduceAngle documents precision boundary

The internal `reduceAngle` function in `deterministic-kernels.ts` (marked `@internal`) uses two-step Cody-Waite range reduction. Its TSDoc currently mentions "quadrant-based reduction" but does not specify the safe input range. It SHALL document the approximate precision boundary (~2^20 \* PI ~ 3.3 million radians) beyond which the two-word reduction accumulates error exceeding 1 ULP.

Note: The public `sinCos` function already documents this precision boundary in its own `@remarks`. This requirement adds the same information to the internal `reduceAngle` for completeness, so maintainers reading the reduction code itself can see the limitation without needing to find the `sinCos` docs.

#### Scenario: Developer reads reduceAngle documentation

- **WHEN** a developer reads the TSDoc for `reduceAngle`
- **THEN** the documentation SHALL specify the safe input range and precision implications

### Requirement: tan documents reduced precision near singularities

The deterministic `tan` function's TSDoc currently shows only `@returns tan(x) = sin(x) / cos(x)` with no precision caveats. The implementation computes `sin(x) / cos(x)` rather than using a dedicated tangent kernel polynomial (as fdlibm provides in `k_tan.c`). The TSDoc SHALL include a `@remarks` note explaining the reduced precision near `x = PI/2 + n*PI` where cos approaches zero.

#### Scenario: Developer reads tan documentation

- **WHEN** a developer reads the TSDoc for the deterministic `tan` function
- **THEN** the documentation SHALL note the precision limitation near singularities
