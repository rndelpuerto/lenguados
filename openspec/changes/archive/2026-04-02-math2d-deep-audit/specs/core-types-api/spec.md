## MODIFIED Requirements

### Requirement: R-ROTATION2-FROMANGLE-OPTIMIZE (modifies existing Rotation2.fromAngle behavior)

`Rotation2.fromAngle(angle)` MUST assign the cos/sin values from `sinCos()` directly to the instance properties without passing through `set()` normalization. The `set()` method continues to normalize for arbitrary user input, but `fromAngle` is an internal construction path where normalization is mathematically redundant.

#### Scenario: fromAngle bypasses normalization

- **WHEN** `Rotation2.fromAngle(Math.PI / 4)` is called
- **THEN** the result has `cos ≈ 0.7071` and `sin ≈ 0.7071`
- **AND** no `hypot()` call is made during construction
- **AND** the result is bitwise identical to the previous implementation for all finite angles

NOTE: A comment MUST link `fromAngle` to `set()` explaining why they diverge: `fromAngle` trusts `sinCos()` output; `set()` normalizes arbitrary input.
